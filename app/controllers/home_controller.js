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

    var index = function( req, res, next ) {
        res.render( 'home' );
    };

    module.exports.addRoutes = function( app ) {
        app.get( '/', index );
    };
})();