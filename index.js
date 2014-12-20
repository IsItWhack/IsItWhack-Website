/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var server = require( "./bin/server" ),
        options_loader = require( './lib/options_loader' ),
        logger = require( "./lib/logger" );

    server.start( options_loader.loadOptions( process.env.NODE_ENV || 'development' ) );
})();