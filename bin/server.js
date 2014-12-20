/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var express = require( 'express' ),
        body_parser = require( 'body-parser' ),
        compress = require( 'compression' ),
        logger = require( '../lib/logger' ),
        logger_init = false,
        WebError = require( '../lib/error' ).WebError,
        q = require( 'q' ),
        oauthserver = require( 'oauth2-server-mlyons' ),
        oauth = require( '../lib/oauth' ),
        path = require( 'path' );

    var models = require( '../app/models' ),
        controllers = require( '../app/controllers' );

    var server = null;

    exports.start = function startServer( opts ) {
        var deferred = q.defer();

        var logging_level = opts.logging_level || 'v';
        if( !logger_init ) { // Don't try to init the logger if it's already been done
            logger = logger.init( logging_level );
            logger_init = true;
        }

        var database_name = opts.database_name || 'isitwhack_development';
        var database_url = opts.database_url || '127.0.01';
        var database_port = opts.database_port || 5432;
        var port = opts.port || 1337;
        var database_username = opts.database_username || 'isitwhack';
        var database_password = opts.database_password || 'isitwhack';
        var sequelize_logging = opts.sequelize_logging || logger.db;
        var native = opts.native || false;

        // Initialize database
        var db = models.init( {
            database_name: database_name,
            database_url: database_url,
            database_port: database_port,
            database_username: database_username,
            database_password: database_password,
            sequelize_logging: sequelize_logging,
            native: native
        } );

        // Initialize express
        var app = express();
        if( logging_level === 'd' ) { // Set up response logger
            app.use( logResponseBody );
        }
        app.use( compress() );
        app.use( body_parser.json() );
        app.use( body_parser.urlencoded( {
            extended: true
        } ) );

        if( logging_level === 'd' ) { // Set up response logger
            app.use( logRequestBody );
        }

        app.use( function( req, res, next ) {
            if( !db )
                db = require( '../app/models' ).db;
            db.sequelize
                .transaction()
                .then( function( transaction ) {
                    req.transaction = transaction;
                    console.log( 'Got transaction' );
                    next();
                } );
        } );

        app.use( function( req, res, next ) {
            function commitTransaction() {
                if( !req.failed && !req.transaction.finished ) {
                    req.transaction.commit().bind( req.transaction );
                }
            }

            res.on( 'finish', commitTransaction );
            res.on( 'close', commitTransaction );
            next();
        } );

        app.oauth = oauthserver( {
            model: oauth(), // See below for specification
            grants: ['password', 'refresh_token'],
            debug: true
        } );

        app.all( '/tokens', app.oauth.grant() );

        app.get( '/test', function( req, res ) {
            res.send( 'test' );
        } );

        app.use( express.static( path.resolve( __dirname, '..', 'public' ) ) );

        server = app.listen( port, function listenCallback() {
            // Initialize Controllers
            controllers.initialize( app );

            app.use( function( err, req, res, next ) {
                console.log( err.stack );
                if( req.transaction ) {
                    console.log( 'Closing transaction' );
                    req.transaction.rollback().bind( req.transaction );
                }
                req.failed = true;
                if( err instanceof WebError ) {
                    res.status( err.web_error ).send( {'error': err.value, 'message': err.message} );
                } else {
                    res.status( 500 ).send( {'error': err} );
                }
            } );

            console.log( 'Running' );
            deferred.resolve();
        } );

        server.on( 'error', function serverError( err ) {
            console.log( err );
        } );

        server.on( 'close', function() {
            console.log( 'Closed' );
        } );

        return deferred.promise;
    };

    exports.close = function closeServer() {
        var deferred = q.defer();
        server.on( 'close', function() {
            deferred.resolve();
        } );
        server.close();
        return deferred.promise;
    };

    var logRequestBody = function( req, res, next ) {
        logger.d( "============= Begin Request =============" );
        logger.d( "Request body" );
        logger.d( req.body );
        logger.d( "Request url" );
        logger.d( req.url );
        next();
    };

    var logResponseBody = function( req, res, next ) {
        var oldWrite = res.write,
            oldEnd = res.end;

        var chunks = [];

        res.write = function( chunk ) {
            chunks.push( chunk );

            oldWrite.apply( res, arguments );
        };

        res.end = function( chunk ) {
            if( chunk )
                chunks.push( chunk );

            var body = Buffer.concat( chunks ).toString( 'utf8' );
            logger.d( "Response" );
            logger.d( req.path, body );
            logger.d( "============= End Request =============" );

            oldEnd.apply( res, arguments );
        };

        next();
    }

})();
