/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var models = require( '../app/models' ),
        options_loader = require( '../lib/options_loader' );

        var options = options_loader.loadOptions( process.env.NODE_ENV );
        options.sequelize_logging = false;

        models.init( options );

        var migrator = models.db.sequelize.getMigrator( {
            path: process.cwd() + '/migrations',
            filesFilter: /\.js$/
        } );

        migrator
            .migrate()
            .then( function( mess ) {
                console.log( 'Migrations Complete' );
                console.log( mess );
                process.exit();
            } )
}) ();