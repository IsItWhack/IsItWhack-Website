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
        lodash = require( 'lodash' ),
        Sequelize = require( 'sequelize' ),
        models = {};

    var previously_initialized = false;

    module.exports.init = function init( opts ) {
        if( previously_initialized ) return;
        previously_initialized = true;

        var sequelize = new Sequelize(
            opts.database_name,
            opts.database_username,
            opts.database_password,
            {
                dialect: "postgres",
                protocol: "postgres",
                port: opts.database_port,
                host: opts.database_url,
                logging: opts.sequelize_logging,
                native: opts.native
            } );

        // Load all models in directory
        fs
            .readdirSync( __dirname )
            .filter( function filenameFilter( filename ) {
                return ( ( filename.charAt( 0 ) !== '.' ) && ( filename !== 'index.js' ) )
            } )
            .forEach( function filenameHandler( filename ) {
                var model = sequelize.import( path.join( __dirname, filename ) );
                models[model.name] = model;
            } );

        // Allow each model to create it's associations
        Object.keys( models ).forEach( function modelHandler( modelname ) {
            if( models[modelname].options.hasOwnProperty( 'associate' ) ) {
                models[modelname].options.associate( models );
            }
        } );

        // Create exportable database
        var db = lodash.extend( {
            sequelize: sequelize,
            Sequelize: Sequelize
        }, models );

        // Add database to exports
        module.exports.db = db;

        // Return database
        return db;
    };
})();