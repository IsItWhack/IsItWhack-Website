/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    module.exports = function initAccessToken( sequelize, DataTypes ) {
        var AccessToken = sequelize.define( 'AccessToken', {
            access_token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            expires: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            underscored: true,
            associate: function( models ) {
                AccessToken.belongsTo( models.User, {foreignKey: 'user_id', as: 'user'} );
            },
            classMethods: {
                publicFields: [
                    'id',
                    'access_token',
                    'expires',
                    'user_id'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.AccessToken,
                        attributes: AccessToken.publicFields,
                        as: 'access_token',
                        include: db.AccessToken.standardInclude( db )
                    }
                },
                standardInclude: function( db ) {
                    return [
                        db.User.parentInclude( db )
                    ]
                }
            }
        } );

        return AccessToken;
    }

})();