if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

    if (process.env.DATABASE_URL) {
      // Verifica se está rodando no heroku
      sequelize = new Sequelize(process.env.DATABASE_URL);
    } else {
      // Se DATABASE_URL não estiver definido é porque está rodando localmente
      console.log("No url found. Connecting to local database without SSL.");
      var params = require('../localDatabaseConnectionParameters'); // params file
      sequelize = new Sequelize(params.schema, params.user, params.password, params.options);
    }

    global.db = {
      Sequelize: Sequelize,
      sequelize: sequelize,
      User:      sequelize.import(__dirname + '/user')
      // Adicione outros modelos aqui
    }

    /*
    Associações podem ser definidas aqui. Por exemplo:
    global.db.User.hasMany(global.db.outraCoisa)
     */


}

module.exports = global.db;
