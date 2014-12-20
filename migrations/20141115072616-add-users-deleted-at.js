module.exports = {
    up: function( migration, DataTypes, done ) {
        migration
            .addColumn( 'Users', 'deleted_at', {
                type: DataTypes.DATE,
                allowNull: true
            } )
            .complete( done );
    },
    down: function( migration, DataTypes, done ) {
        migration
            .removeColumn( 'Users', 'deleted_at' )
            .complete( done );
    }
};