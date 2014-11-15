module.exports = {
  up: function( migration, DataTypes, done ) {
    migration
        .createTable( 'AccessTokens', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          access_token: {
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
    migration
        .dropTable( 'AccessTokens' )
        .complete( done );
  }
};