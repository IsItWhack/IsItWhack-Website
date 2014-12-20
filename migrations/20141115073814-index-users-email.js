module.exports = {
    up: function( migration, DataTypes, done ) {
        migration
            .addIndex( 'Users', ['email'], {
                indexName: 'UsersEmailIndex',
                indicesType: 'UNIQUE'
            } )
            .complete( done );
    },
    down: function( migration, DataTypes, done ) {
        migration
            .removeIndex( 'Users', 'UsersEmailIndex' )
            .complete( done );
    }
};