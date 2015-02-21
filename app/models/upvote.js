/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    module.exports = function initUpvote( sequelize, DataTypes ) {
        var Upvote = sequelize.define( 'Upvote', {
            rateable_id: DataTypes.INTEGER
        }, {
            underscored: true,
            associate: function( models ) {
                models.Upvote.belongsTo( models.User, { foreignKey: 'user_id', as: 'user' } );
                models.Upvote.belongsTo( models.Rateable, { foreignKey: 'rateable_id', as: 'rateable' } );
            },
            classMethods: {
                publicFields: [
                    'id'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.Upvote,
                        attributes: Upvote.publicFields,
                        as: 'upvote',
                        include: db.Upvote.standardInclude( db )
                    }
                },
                standardInclude: function( db ) {
                    return [
                        db.User.standardInclude( db ),
                        db.Rateable.standardInclude( db )
                    ]
                }
            }
        } );

        return Upvote;
    }

})();