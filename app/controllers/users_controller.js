/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var db = require( '../models' ).db,
        User = db.User;

    var bcrypt = require( 'bcrypt-then' ),
        controller = require( './' );

    /**
     * Bcrypts the password in the body, and deletes the plaintext password from the body.
     * Input: {
     *  "password": "test_password"
     * }
     *
     * Output: {
     *  "encrypted_password": <bcrypt of test_password>
     * }
     *
     * @param body The body to replace the password in
     * @returns {Bluebird.Promise|*} A promise that once resolved passes the new body without the password, and with the encrypted_password
     * @private
     */
    var _bcryptPasswordInBody = function( body ) {
        return bcrypt
            .hash( body.password )
            .then( function( hashed ) {
                body.encrypted_password = hashed;
                delete body.password;
                delete body.password_confirmation;
                return body;
            } );
    };

    /**
     * Checks if the password and password_confirmation match, then replaces the password with the bcrypted version
     *
     * @param body The body to replace the password in
     * @returns {Bluebird.Promise|*} Once this is resolved, it will pass a new body that has encrypted_password
     * @private
     */
    var _replacePassword = function( body ) {
        if( body.password &&
            body.password_confirmation &&
            body.password === body.password_confirmation ) {
            return _bcryptPasswordInBody( body );
        } else {
            throw new WebError( 400, 4001, 'Password and Password confirmation do not match' )
        }
    };

    /**
     * Calls create user on the given promise input, with the given transaction
     * @param transaction The transaction to create the user under
     * @returns {Function} Returns promise that takes body, and creates a user with that body and transaction
     * @private
     */
    var _createUser = function( transaction ) {
        return function createUser( user ) {
            return User
                .create( user, {
                    transaction: transaction
                } )
        };
    };

    /**
     * Deletes the password from the given user creation response
     * @returns {Function} Promise that removes the password from the given creation response
     * @private
     */
    var _removePasswordFromCreateResponse = function() {
        return function removePasswordFromCreateResponse( created ) {
            var user = created.dataValues;
            delete user.encrypted_password;
            return user;
        };
    };

    /**
     * Responds to POST requests to /users. Creates user if request is valid
     * @param req See express
     * @param res See express
     * @param next See express
     */
    var createUser = function( req, res, next ) {
        _replacePassword( req.body )
            .then( _createUser( req.transaction ) )
            .then( _removePasswordFromCreateResponse() )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    module.exports.addRoutes = function( app ) {
        app.post( '/users', createUser );
    };

})();