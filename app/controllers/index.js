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
                throw new WebError( 400, 4001, 'Revision not correct' );
            }
            return second;
        }
    };

    /**
     * This is an express function that checks that the request was made with the correct version in mind
     * @param required_version The version that is required
     * @returns {Function} An express function that checks the version
     */
    module.exports.checkVersion = function( required_version ) {
        return function( req, res, next ) {
            if( req.header( 'mkone-api-version' ) && parseInt( req.header( 'mkone-api-version' ) ) && parseInt( req.header( 'mkone-api-version' ) ) >= required_version ) {
                next();
            } else {
                next( new WebError( 400, 4002, 'Api Version Incorrect. This endpoint requires: ' + required_version ) );
            }
        }
    }

    /**
     * Returns a promise that commits the given transaction, and sends the value that was passed in from the previous
     * promise through the given res
     *
     * Intended to be the end of a promise chain
     * eg:
     *      User
     *          .all( {
     *             transaction: req.transaction
     *          } )
     *          .then( commitAndSend( req.transaction, res ) ); // Will send the results of User.all() after commiting
     *
     * @param transaction The transaction to commit
     * @param res The response to send the value through
     * @returns {Function} Promise that commits the transaction and then sends the response
     */
    module.exports.commitAndSend = function( transaction, res ) {
        return function commitAndSend( response ) {
            transaction
                .commit().bind( transaction )
                .then( function send() {
                    res.send( response );
                } )
        }
    };

    /**
     * Returns a promise that rollbacks the given transaction, and sends the value that was passed in from the previous
     * promise through the given next function
     *
     * Intended to be the end of a promise chain, to handle thrown errors in the catch method
     * eg:
     *      User
     *          .all( {
     *             transaction: req.transaction
     *          } )
     *          .then( commitAndSend( req.transaction, res ) )
     *          .catch( rollbackAndFail( req.transaction, next ) )
     *
     * @param transaction The transaction to be rolled back
     * @param next The function to be called with the error
     * @returns {Function} Promise that rolls back the transaction, and calls the next function with the error
     */
    module.exports.rollbackAndFail = function( transaction, next ) {
        return function rollbackAndFail( err ) {
            transaction
                .rollback().bind( transaction )
                .then( function fail() {
                    next( err );
                } )
        }
    };

})();