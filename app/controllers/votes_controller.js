/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var db = require( '../models' ).db,
        Rateable = db.Rateable,
        Upvote = db.Upvote,
        Downvote = db.Downvote;

    var controller = require( './' ),
        rateable_controller = require( './rateable_controller' ),
        q = require( 'q' ),
        WebError = require( '../../lib/error' ).WebError;

    var url_name = 'votes';
    module.exports.url_name = url_name;

    var _createVote = function( transaction, user_id, body ) {
        return function createVote( rateable ) {
            var vote_class = null;
            if( body.vote_type === "up" ) {
                vote_class = Upvote;
            } else if( body.vote_type === "down" ) {
                vote_class = Downvote;
            }
            if( !vote_class ) throw new WebError( 400, 4301, "Invalid vote type specified" );

            console.log( rateable.dataValues.id );

            return vote_class
                .create( {
                    rateable_id: rateable.dataValues.id,
                    user_id: user_id
                }, {
                    transaction: transaction,
                    fields: [ 'rateable_id', 'user_id' ]
                } );
        };
    };

    var addVote = function( req, res, next ) {
        rateable_controller
            .checkForIdParam( req )
            .then( rateable_controller.getRateable( req.transaction ) )
            .then( _createVote( req.transaction, req.user.id, req.body ) )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    module.exports.addRoutes = function( app ) {
        app.post( '/' + rateable_controller.url_name + '/:' + rateable_controller.url_param_name + '/' + url_name, app.oauth.authorise(), addVote );
    };
})();