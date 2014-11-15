/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var fs = require( 'fs' ),
        path = require( 'path' ),
        logger = require( '../../lib/logger' ),
        WebError = require( '../../lib/error' ).WebError;

    module.exports.initialize = function initialize( app ) {
        fs
            .readdirSync( __dirname )
            .filter( function filenameFilter( filename ) {
                return ( ( filename.charAt( 0 ) !== '.' ) && ( filename !== 'index.js' ) )
            } )
            .forEach( function filenameHandler( filename ) {
                var controller = require( path.join( __dirname, filename ) );

                if( controller.hasOwnProperty( 'addRoutes' ) ) {
                    controller.addRoutes( app );
                }
            } );
    };

    /**
     * Creates a function that checks the given value against the passed in value ( This is for use in a then promise block )
     * @param first The first value to compare
     * @returns {Function} Function that takes one argument, the second thing to compare, and compares them.
     */
    module.exports.checkRevision = function( first ) {
        return function( second ) {
            if( second.server_revision !== first.server_revision ) {
                console.log( 'Revision number incorrect ' + first.server_revision + ' !== ' + second.server_revision );
                throw new WebError( 400, 4001,'Revision not correct' );
            }
            return second;
        }
    };

    /**
     * This is an express function that checks that the request was made with the correct version in mind
     * @param required_version The version that is required
     * @returns {Function} An express function that checks the version
     */
    module.exports.checkVersion = function( required_version ) { // TODO: MOWB-147: Should versioning be a greater then system (https://markone.atlassian.net/browse/MOWB-147)
        return function( req, res, next ) {
            if( req.header( 'mkone-api-version' ) && parseInt( req.header( 'mkone-api-version' ) ) && parseInt( req.header( 'mkone-api-version' ) ) >= required_version ) {
                next();
            } else {
                next( new WebError( 400, 4002, 'Api Version Incorrect. This endpoint requires: ' + required_version ) );
            }
        }
    }

})();