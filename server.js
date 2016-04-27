// libraries
var rest = require('restify');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var _ = require('lodash');
var crypto = require('crypto');

// variables
var port = process.env.PORT || 5000;
var DATABASE_URL = process.env.DATABASE_URL;
var server = rest.createServer({
  "name": "EconomizeAPI",
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  "extended": false
}));

var db = new Sequelize(DATABASE_URL);

var User = db.define('user', {
  uuid: {
    type: Sequelize.STRING,
    field: "_id"
  },
  firstName: {
    type: Sequelize.STRING,
    field: "first_name"
  },
  lastName: {
    type: Sequelize.STRING,
    field: "last_name"
  },
  cpfNumber: {
    type: Sequelize.STRING,
    field: "cpf"
  },
  password: {
    type: Sequelize.STRING
  }
},{
  freezeTableName: true
});

User.sync({force: true}).then(function () {
  // Tabela foi criada
  return User.findOrCreate( {
    where: {
      firstName: 'Romulo',
      lastName: 'Rodrigues',
      cpfNumber: '12345678901',
      password: crypto.createHash('sha256').update('!yemolai!', "utf8").digest('base64')
    }
  });
});

// routing
/*
  Available REST Actions:
    GET /users Return all Users
    POST /users Add new user
    GET /users/:id Return User with matched ID
    PUT /users/:id Update users information
    DELETE /users/:id Delete particular user
*/

server.get('/', function (req, res, next) {
  console.log("Requisitando: GET /");
  // respondendo com mensagem simpática
  res.json({
    "error": false,
    "message": "Hello. Are you lost?"
  });
});

server.get('/users', function (req, res, next) {
  console.log("requisitando: GET /users");
  var userList = User.all().then(function (users) {
    console.log("respondendo com conteúdo da tabela de usuários.")
    res.json(users);
    console.log("userList:", userList);
    console.log("users:", users);
  });
});

// Starting server
console.log("Inicializando\n\n...\n");

server.listen(port);
console.log("Servidor ativo na porta " + port);
