/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    module.exports = function() {
        var db = require( '../app/models' ).db,
            bcrypt = require( 'bcrypt-then' );


        var oauth = {};

        oauth.getAccessToken = function( bearerToken, callback ) {
            db.AccessToken
                .find( {
                    where: {
                        access_token: bearerToken
                    },
                    include: db.AccessToken.standardInclude( db )
                } )
                .then( function( token ) {
                    if( !token ) callback( true );
                    callback( false, token );
                } );
        };

        oauth.getClient = function( clientId, clientSecret, callback ) {
            callback( false, {
                clientId: clientId,
                clientSecret: clientSecret
            } )
        };

        oauth.getRefreshToken = function ( bearerToken, callback ) {
            db.RefreshToken
                .find( {
                    where: {
                        refresh_token: bearerToken
                    }
                } )
                .then( function( token ) {
                    if( !token ) callback( true );
                    callback( false, token );
                } );
        };

        oauth.grantTypeAllowed = function( clientId, grantType, callback ) {
            callback( false, true );
        };

        oauth.saveAccessToken = function( accessToken, clientId, expires, user, callback ) {
            db.AccessToken
                .create( {
                    access_token: accessToken,
                    client_id: clientId,
                    expires: expires,
                    user_id: user.id
                } )
                .then( function( created_token ) {
                    callback( false );
                } )
                .catch( function( err ) {
                    callback( err );
                } );
        };

        oauth.saveRefreshToken = function( refreshToken, clientId, expires, user, callback ) {
            db.RefreshToken
                .create( {
                    refresh_token: refreshToken,
                    client_id: clientId,
                    expires: expires,
                    user_id: user.id
                } )
                .then( function( created_token ) {
                    callback( false );
                } )
                .catch( function( err ) {
                    callback( err );
                } );
        };

        oauth.getUser = function( username, password, callback ) {
            db.User
                .find( {
                    where: {
                        email: username
                    }
                } )
                .then( function( user ) {
                    return bcrypt
                        .compare( password, user.encrypted_password )
                        .then( function( compare ) {
                            if( !compare ) {
                                console.log( 'compare failed' );
                                return callback( true );
                            }
                            return user;
                        } )
                } )
                .then( function( user ) {
                    callback( false, user.dataValues );
                } );
        };

        return oauth;
    };


})();