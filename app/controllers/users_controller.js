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

    var bcrypt = require( 'bcrypt-then' );

    var _gzipPasswordInBody = function( body ) {
        return bcrypt
            .hash( body.password )
            .then( function( hashed ) {
                body.encrypted_password = hashed;
                delete body.password;
                delete body.password_confirmation;
                return body;
            } );
    };

    var _replacePassword = function( body ) {
        if( body.password &&
            body.password_confirmation &&
            body.password === body.password_confirmation ) {
            return _gzipPasswordInBody( body );
        } else {
            throw new WebError( 400, 4001, 'Password and Password confirmation do not match' )
        }
    };

    var createUser = function( req, res, next ) {
        _replacePassword( req.body )
            .then( function( body ) {
                return User
                    .create( body, {
                        transaction: req.transaction
                    } );
            } )
            .then( function( created ) {
                var user = created.dataValues;
                delete user.encrypted_password;
                return user;
            } )
            .then( function( user ) {
                req.transaction
                    .commit().bind( req.transaction )
                    .then( function() {
                        res.send( user );
                    } );
            } )
            .catch( function( err ) {
                req.transaction
                    .rollback().bind( req.transaction )
                    .then( function() {
                        next( err );
                    } )
            } );
    };

    module.exports.addRoutes = function( app ) {
        app.post( '/users', createUser );
    };

})();