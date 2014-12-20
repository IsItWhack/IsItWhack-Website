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
        controller = require( './' ),
        q = require( 'q' ),
        WebError = require( '../../lib/error' ).WebError;

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
     * Checks if the signed in user is the same as the user_id param in the url, if not fails
     * @param req The request to check for the user / user_id param
     * @returns {Function} A promise that verifies that the user in the req, and the user_id in the req.params is the same
     * @private
     */
    var _verifyUserPermissions = function( req ) {
        return function verifyUserPermissions() {
            if( +req.user.id !== +req.param( 'user_id' ) ) {
                throw new WebError( 400, 4100, 'Not allows to view/edit this user' );
            }
            return req;
        };
    };

    /**
     * Takes a request, and returns a body. Made for use in a promise chain
     * @param req The request to get the body from
     * @returns {.getRequestWithBody.body|*|body|.getName.body|HTMLElement} The body from the request
     * @private
     */
    var _reqToBody = function( req ) {
        return req.body;
    };

    /**
     * Checks if the previous password field exists, and if it is equal to the user's previous password
     * @param user The user to check the password against
     * @returns {Function} a Promise that takes a body which contains the previous_password field. Passes body along if success throws WebError( 4102 ) if fails
     * @private
     */
    var _checkPreviousPassword = function( user ) {
        return function checkPreviousPassword( body ) {
            if( body.previous_password ) {
                return bcrypt
                    .compare( body.previous_password, user.encrypted_password )
                    .then( function comparisonResults( compare_results ) {
                        if( !compare_results ) throw new WebError( 400, 4102, 'Previous Password does not match' );
                        return body;
                    } )
            } else {
                throw new WebError( 400, 4103, 'No previous password specified' );
            }
        };
    };

    /**
     * Changes the user's password to the bodies value of encrypted_password
     * @param transaction Transaction to change the user's password with
     * @param user The user to change the password of
     * @returns {Function} A promise that takes a body which contains an encrypted_password, changes the user's password and returns {}
     * @private
     */
    var _changePassword = function( transaction, user ) {
        return function changePassword( body ) {
            return user
                .updateAttributes( {
                    encrypted_password: body.encrypted_password
                }, {
                    transaction: transaction
                } )
                .then( function() {
                    return {};
                } )
        }
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


    /**
     * Responds to POST requests to /users/:user_id/password. Changes the user's password if request is valid
     * @param req See express
     * @param res See express
     * @param next See express
     */
    var changePassword = function( req, res, next ) {
        q.try( _verifyUserPermissions( req ) )
            .then( _reqToBody )
            .then( _checkPreviousPassword( req.user ) )
            .then( _replacePassword )
            .then( _changePassword( req.transaction, req.user ) )
            .then( controller.commitAndSend( req.transaction, res ) )
            .catch( controller.rollbackAndFail( req.transaction, next ) );
    };

    module.exports.addRoutes = function( app ) {
        app.post( '/users', createUser );

        app.post( '/users/:user_id/password', app.oauth.authorise(), changePassword )
    };

})();