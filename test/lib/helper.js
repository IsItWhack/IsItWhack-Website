/**
 * Copyright of Mark One Lifestyle Inc.
 *
 * Authors:
 *     - Mike Lyons (m@mkone.co)
 */

(function() {
    'use strict';

    var server = require( '../../bin/server' );

    var classes_to_delete = [
        'User',
        'AccessToken',
        'RefreshToken'
    ];

    /**
     * Wipes the database
     * @returns {*}
     * @private
     */
    function _deleteAll() {
        var models = require( '../../app/models' ),
            Sequelize = require( 'sequelize' ),
            q = require( 'q' );

        var promises = [];

        classes_to_delete.forEach( function( className ) {
            var promise = models.db[ className ].findAll( {
                paranoid: false
            } ).then( function( all ) {
                var chainer = new Sequelize.Utils.QueryChainer();
                all.forEach( function( row ) {
                    chainer.add( row.destroy( { force: true }, true ) );
                } );
                return chainer.run();
            });

            promises.push( promise );
        } );

        return q.all( promises );
    }

    module.exports.before = function() {
        return server
            .start( {
                database_name: 'isitwhack_test',
                sequelize_logging: console.log,
                logging_level: 'd'
            } )
            .then( function wipeDatabase( db ) {
                return _deleteAll();
            } )
            .then( function() {

            } );
    };

    module.exports.after = function() {
        return server.close();
    }

})();