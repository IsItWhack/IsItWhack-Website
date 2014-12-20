/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    module.exports = function initDownvote( sequelize, DataTypes ) {
        var Downvote = sequelize.define( 'Downvote', {}, {
            underscored: true,
            associate: function( models ) {
                models.Upvote.belongsTo( models.User, { foreignKey: 'user_id', as: 'user' } );
                models.Downvote.belongsTo( models.Rateable, { foreignKey: 'rateable_id', as: 'rateable' } );
            },
            classMethods: {
                publicFields: [
                    'id'
                ],
                parentInclude: function( db ) {
                    return {
                        model: db.Downvote,
                        attributes: Downvote.publicFields,
                        as: 'Downvote',
                        include: db.Downvote.standardInclude( db )
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

        return Downvote;
    }

})();