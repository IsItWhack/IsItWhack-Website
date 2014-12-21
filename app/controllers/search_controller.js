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
        rateable_controller = require( './rateable_controller' ),
        q = require( 'q' ),
        WebError = require( '../../lib/error' ).WebError;

    var url_name = 'search';
    module.exports.url_name = url_name;

    var search = function( req, res, next ) {
        console.log( req.param( 'q' ) );
        Rateable
            .get( {
                where: {
                    name: req.param( 'q' )
                }
            }, {
                transaction: req.transaction
            } )
            .then( function( rateable ) {
                if( !rateable ) return res.render( 'search_not_found', { rateable: { name: req.param( 'q' ) } } );
                res.render( 'search', { rateable: rateable.dataValues } );
            } )
            .then( function( rateable ) {

            } )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    module.exports.addRoutes = function( app ) {
        app.get( '/' + url_name, search );
    };
})();