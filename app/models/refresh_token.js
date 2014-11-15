/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    module.exports = function initRefreshToken( sequelize, DataTypes ) {
        var RefreshToken = sequelize.define( 'RefreshToken', {
            refresh_token: {
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
                RefreshToken.belongsTo( models.User, {foreignKey: 'user_id', as: 'user'} );
            },
            classMethods: {
                publicFields: [
                    'id',
                    'refresh_token',
                    'expires',
                    'user_id'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.RefreshToken,
                        attributes: RefreshToken.publicFields,
                        as: 'refresh_token',
                        include: db.RefreshToken.standardInclude( db )
                    }
                },
                standardInclude: function( db ) {
                    return [
                        {}
                    ]
                }
            }
        } );

        return RefreshToken;
    }

})();