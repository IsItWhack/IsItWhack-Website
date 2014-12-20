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
            options_loader = require( '../../lib/options_loader' ),
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
            .start( options_loader.loadOptions( process.env.NODE_ENV || 'test' ) )
            .then( function wipeDatabase( db ) {
                return _deleteAll();
            } );
    };

    module.exports.after = function() {
        return server.close();
    }

})();