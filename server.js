
var restify =     require('restify')
  , routify =     require('./routify')
  , routes =      require('./routes')
  , middlewares = require('./routes/middlewares')
  ;


var port = process.env.PORT || 5000
var server = restify.createServer({
  "name": "EconomizeAPI",
});

server.use([restify.bodyParser(), restify.fullResponse()]);

console.log("Conectando Sequelize ao banco");

routify(server, routes);
server.use(middlewares);
server.listen(port);

// Starting server
console.log("Inicializando\n\n...\n");

console.log("Servidor ativo na porta " + port);
