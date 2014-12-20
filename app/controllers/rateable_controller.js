/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var db = require( '../models' ).db,
        Rateable = db.Rateable;

    var controller = require( './' ),
        q = require( 'q' ),
        WebError = require( '../../lib/error' ).WebError;

    var url_param_name = 'rateable_id';
    module.exports.url_param_name = url_param_name;

    var url_name = 'rateables';
    module.exports.url_name = url_name;

    var _getAllRateables = function( transaction ) {
        return Rateable
            .getAll( {}, {
                transaction: transaction
            } );
    };

    var _getRateableFromParam = function( transaction ) {
        return function( req ) {
            return Rateable
                .get( {
                    where: {
                        id: req.param( url_param_name )
                    }
                }, {
                    transaction: transaction
                } );
        };
    };
    module.exports.getRateableFromParam = _getRateableFromParam;

    var _getRateableFromBody = function( transaction ) {
        return function( req ) {
            return Rateable
                .get( {
                    where: {
                        id: req.id
                    }
                }, {
                    transaction: transaction
                } )
        };
    };

    var _checkForIdUrlParam = function( req ) {
        return q.try( function() {
            if( !req.param( url_param_name ) || !+req.param( url_param_name ) ) {
                throw new WebError( 400, 4201, 'Invalid ' + url_param_name + ' specified' )
            }
            return req;
        } );
    };
    module.exports.checkForIdParam = _checkForIdUrlParam;

    var _createRateable = function( transaction ) {
        return function( req ) {
            req.body.user_id = req.user.id;

            // Add user_id to editable fields for creation
            var editableFields = Rateable.editableFields;
            editableFields.push( 'user_id' );

            return Rateable
                .create( req.body, {
                    transaction: transaction,
                    fields: editableFields
                } )
        }
    };

    var _editRateable = function( transction, body ) {
        return function( rateable ) {
            rateable
                .updateAttributes( body, {
                    transaction: transction,
                    fields: body.editableFields
                } );
        }
    };

    var allRateables = function( req, res, next ) {
        _getAllRateables( req.transaction )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    var getRateable = function( req, res, next ) {
        _checkForIdUrlParam( req )
            .then( _getRateableFromParam( req.transaction ) )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    var createRateable = function( req, res, next ) {
        _createRateable( req.transaction )( req )
            .then( _getRateableFromBody( req.transaction ) )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    var editRateable = function( req, res, next ) {
        _checkForIdUrlParam( req )
            .then( _getRateableFromParam( req.transaction ) )
            .then( _editRateable( transaction, req.body ) )
            .then( _getRateableFromBody( req.transaction ) )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    module.exports.addRoutes = function( app ) {
        app.get( '/' + url_name,  app.oauth.authorise(), allRateables );
        app.get( '/' + url_name + '/:' + url_param_name,  app.oauth.authorise(), getRateable );
        app.post( '/' + url_name,  app.oauth.authorise(), createRateable );
        app.put( '/' + url_name + '/:' + url_param_name,  app.oauth.authorise(), editRateable );
    };
})();