/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

( function() {
    'use strict';

    module.exports.ENVIRONMENT_NAMES = {
        DEVELOPMENT: 'development',
        TRAVIS: 'travis',
        TEST: 'test',
        PRODUCTION: 'production'
    };

    module.exports.loadOptions = function( env ) {
        var environment_names = module.exports.ENVIRONMENT_NAMES;

        var options = {
            database_name: 'isitwhack_development',
            database_url: '127.0.0.1',
            database_port: 5432,
            port: 1337,
            database_username: 'isitwhack',
            database_password: 'isitwhack',
            sequelize_logging: console.log,
            logging_level: 'd',
            native: false
        };
        if( !env || env === environment_names.DEVELOPMENT ) {
            options.database_port = 5433;
        } else if( env === environment_names.TRAVIS ) {
            options.database_name = 'isitwhack_test';
            options.database_usernmae = 'postgres';
            options.database_password = '';
        } else if( env === environment_names.TEST ) {
            options.database_name = 'isitwhack_test';
            options.database_port = 5433;
        } else if( env === environment_names.PRODUCTION ) {
            // TODO: Load production server information from environment variable
        }

        console.log( '===== Options Loaded: =====' );
        console.log( options );
        return options;
    };

} )();