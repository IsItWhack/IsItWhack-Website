/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var winston = require( 'winston' );

    var log_levels = {
        levels: {
            e: 3, // Error log level
            v: 2, // Verbose log level
            d: 1, // Debug log level
            db: 0 // Database log level
        },
        colors: {
            e: 'red',
            d: 'yellow',
            v: 'white',
            db: 'green'
        }
    };

    module.exports = {};

    module.exports.init = function( output_level ) {
        var logger = new (winston.Logger)( {
            transports: [
                new (winston.transports.Console)( {
                    'colorize': 'true',
                    'level': output_level
                } )
            ],
            levels: log_levels.levels
        } );

        winston.addColors( log_levels.colors );

        module.exports = logger;

        return logger;
    };
})();
