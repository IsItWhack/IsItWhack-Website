/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var _ = require( 'underscore' );

    module.exports = function initRateable( sequelize, DataTypes ) {
        var Rateable = sequelize.define( 'Rateable', {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            paranoid: true,
            underscored: true,
            associate: function( models ) {
                Rateable.belongsTo( models.User, { foreignKey: 'user_id', as: 'user' } );
            },
            classMethods: {
                publicFields: [
                    'id',
                    'name',
                    'link',
                    'user_id'
                ],
                editableFields: [
                    'name',
                    'link'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.Rateable,
                        attributes: Rateable.publicFields,
                        as: 'rateable',
                        include: db.Rateable.standardInclude( db )
                    }
                },
                standardInclude: function( db ) {
                    return [
                        db.User.parentInclude( db )
                    ]
                },
                getAll: function( opt1, opt2 ) {
                    var public_fields = Rateable.publicFields;

                    var default_opt1 = {
                        attributes: public_fields
                    };

                    _.extend( opt1, default_opt1 );

                    return Rateable
                        .findAll( opt1, opt2 );
                },
                get: function( opt1, opt2 ) {
                    var public_fields = Rateable.publicFields;

                    var default_opt1 = {
                        attributes: public_fields
                    };

                    _.extend( opt1, default_opt1 );

                    return Rateable
                        .find( opt1, opt2 );
                }
            }
        } );

        return Rateable;
    }

})();