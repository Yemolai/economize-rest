// libraries
var rest = require('restify');
var pg = require('pg');
var bodyParser = require('body-parser');

// variables
var port = process.env.PORT || 5000;
var pgPath = process.env.DATABASE_URL;
var server = rest.createServer({
  "name": "EconomizeAPI",
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  "extended": false
}));

pg.defaults.ssl = true;
var client = new pg.Client(pgPath);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
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

// Starting server
console.log("Inicializando\n\n...\n");

server.listen(port);
console.log("Servidor ativo na porta " + port);
