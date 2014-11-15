/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var _ = require( 'underscore' );

    module.exports = function initUser( sequelize, DataTypes ) {
        var User = sequelize.define( 'User', {
            full_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                },
                unique: true
            },
            encrypted_password: {
                type: DataTypes.STRING,
                allowNull: false,
                min: 8
            }
        }, {
            paranoid: true,
            underscored: true,
            classMethods: {
                publicFields: [
                    'id',
                    'full_name',
                    'email'
                ],
                editableFields: [
                    'full_name',
                    'email'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.User,
                        attributes: User.publicFields,
                        as: 'user',
                        include: db.User.standardInclude( db )
                    };
                },
                standardInclude: function( db ) {
                    return [];
                },
                get: function( options, transaction ) {
                    var models = require( './' ).db;

                    options = options || {};
                    options.attributes = _.union( options.attributes, User.publicFields );
                    options.include = _.union( options.include, User.standardInclude( models ) )

                    return User
                        .find( options, {
                            transaction: transaction
                        } );
                }
            },
            instanceMethods: {
            },
            associate: function( models ) {
                User.hasMany( models.AccessToken );
                User.hasMany( models.RefreshToken );
            },
            getterMethods: {
                server_revision: function() {
                    return (new Date( this.updated_at )).getTime();
                }
            }
        } );

        return User;
    }

})();
