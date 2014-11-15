/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var server = require( "./bin/server" ),
        logger = require( "./lib/logger" );

    server.start( {
        database_name: 'mkonerest_development',
        sequelize_logging: console.log,
        logging_level: 'd'
    } );
})();