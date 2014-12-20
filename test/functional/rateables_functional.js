/**
 * Copyright of Mark One Lifestyle Inc.
 *
 * Authors:
 *     - Mike Lyons (m@mkone.co)
 */

(function() {
    'use strict';

    var helper = require( '../lib/helper' ),
        chai = require( 'chai' ),
        assert = chai.assert,
        request = require( 'supertest-mlyons' )( 'http://localhost:1337' );

    describe( 'Rateables functional tests', function userUnitTests() {

        before( function beforeAll( done ) {
            helper
                .before()
                .then( done );
        } );

        after( function afterAll( done ) {
            helper.after().then( done );
        } );

        it( 'Should be able to create rateable', function( done ) {
            done();
        } );
    } );

})();