module.exports = {
    up: function( migration, DataTypes, done ) {
        // refresh_token, client_id, expires, user_id
        migration
            .createTable( 'RefreshTokens', {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                refresh_token: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                expires: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                client_id: {
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
                }
            } )
            .complete( done );
    },
    down: function( migration, DataTypes, done ) {
        done();
    }
};