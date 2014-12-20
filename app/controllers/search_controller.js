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
        res.redirect( 'http://interstellar.' + req.headers.host );
    };

    module.exports.addRoutes = function( app ) {
        app.get( '/' + url_name, search );
    };
})();