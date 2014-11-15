module.exports = {
  up: function( migration, DataTypes, done ) {
    migration
        .createTable( 'Users', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          full_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false
          },
          encrypted_password: {
            type: DataTypes.STRING,
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
        .dropTable( 'Users' )
        .complete( done );
  }
};