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

    describe( 'Users functional tests', function userUnitTests() {

        before( function beforeAll( done ) {
            helper
                .before()
                .then( done );
        } );

        after( function afterAll( done ) {
            helper.after().then( done );
        } );

        it( 'Should be able to create user', function( done ) {
            var user_to_create = {
                full_name: 'Test User',
                email: 'test@test.com',
                password: 'testtest',
                password_confirmation: 'testtest'
            };

            request
                .post( '/users' )
                .send( user_to_create )
                .expect( 200 )
                .expect( 'Content-Type', /json/ )
                .end( function( err, res ) {
                    if( err ) return done( err );

                    assert.isDefined( res.body.email, 'User create email isd' );
                    assert.equal( res.body.email, user_to_create.email, 'User create email ise' );

                    assert.isDefined( res.body.full_name, 'User create full_name isd' );
                    assert.equal( res.body.full_name, user_to_create.full_name, 'User create full_name ise' );

                    assert.isUndefined( res.body.password );
                    assert.isUndefined( res.body.password_confirmation );
                    assert.isUndefined( res.body.encrypted_password );

                    done();
                } );
        } );
    } );

})();