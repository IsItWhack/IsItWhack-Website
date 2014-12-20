module.exports = {
    up: function( migration, DataTypes, done ) {
        migration
            .createTable( 'Downvotes', {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                rateable_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            } )
            .complete( done );
    },
    down: function( migration, DataTypes, done ) {
        migration
            .dropTable( 'Downvotes' )
            .complete( done );
    }
};