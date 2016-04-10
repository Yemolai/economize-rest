var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
// Objeto do mongoose para manipulação do MongoDB
var mongoOp = require("./models/mongo");
// Objeto do Mongoose para acessar DB produtos no MongoDB
console.log("Inicializando\n\n...\n");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  "extended": false
}));

/*
  Available REST Actions:
    GET /users Return all Users from MongoDB
    POST /users Add new user in MongoDB
    GET /users/:id Return User with matched ID
    PUT /users/:id Update users information
    DELETE /users/:id Delete particular user
*/

router.get("/", function (req, res) {
  console.log("Requisitando: GET /");
  res.json({ // respondendo com mensagem simpática
    "error": false,
    "message": "Hi, how are you?"
  });
});

// route() vai permitir que você use o mesmo caminho para diferentes operações
// HTTP. Então se você tem a mesma URL com diferentes operações HTTP como GET,
// POST, etc. use o route() para remover código redundante e enxutar o script.

router.route("/users").get(function (req, res) {
    console.log("Requisitando: GET /users");
    var response = {};
    mongoOp.find({}, function (err, data) {
      if (err) {
        console.log("Erro ao tentar requisitar dados do MongoDB\nErro:", err);
        response = {
          "error": true,
          "message": "Error fetching the data"
        };
      } else {
        console.log("Respondendo requisição com seguinte dados:", data);
        response = {
          "error": false,
          "message": data
        };
      }
      res.json(response);
    });
  })
  .post(function (req, res) {
    console.log("Requisitando: POST /users");
    var db = new mongoOp();
    var response = {};
    //fetch email & password from REST request.
    // Add Strict validation when you use this in Production.
    db.userEmail = req.body.email;
    // Hash the password using SHA1 algorithm.
    db.userPassword = require('crypto')
      .createHash('sha1')
      .update(req.body.password)
      .digest('base64');
    db.save(function (err) {
      // save() will run the MongoDB insert() command.
      // and will add new data in conllection.
      if (err) {
        console.log("Erro enquanto tentava salvar dados\nErro:", err);
        response = {
          "error": true,
          "message": "Error adding data"
        };
      } else {
        console.log("Dados salvos, respondendo ao cliente.\n");
        response = {
          "error": false,
          "message": "Data added"
        };
      }
      res.json(response);
    });
  }); // route /users, GET e POST

router.route("/users/:id")
  .get(function (req, res) {
    console.log("Requisição: GET /users/" + req.params.id);
    var response = {};
    mongoOp.findById(req.params.id, function (err, data) {
      // This will run Mongo Query to fetch data based on ID
      if (err) {
        console.log("Erro ao tentar requisitar dados do MongoDB\nErro: ", err);
        response = {
          "error": true,
          "message": "Error fetching the database"
        };
      } else {
        console.log("Respondendo requisição com seguinte dados: ", data);
        response = {
          "error": false,
          "message": data
        };
      }
      res.json(response);
    })
  })
  .put(function (req, res) {
    console.log("Requisição: PUT /users/" + req.params.id);
    var response = {};
    // first find out record exists or not
    // if it does then update the record
    mongoOp.findById(req.params.id, function (err, data) {
      if (err) {
        console.log("Erro ao tentar requisitar dados do MongoDB\nErro:", err);
        response = {
          "error": true,
          "message": "Error fetching data"
        };
      } else {
        console.log("Registro " + req.params.id + " encontrado para ser atualizado");
        // we've got data from Mongo.
        // change it accordingly
        if (req.body.email !== undefined) {
          console.log("Atualizando email");
          // case where email needs to be updated
          data.userEmail = req.body.email;
        }
        if (req.body.password !== undefined) {
          console.log("Atualizando senha");
          // case where password need to be updated
          data.userPassword = require('crypto')
            .createHash('sha1')
            .update(req.body.password)
            .digest('base64');
        }
        data.save(function (err) {
          if (err) {
            console.log("Erro ao tentar atualizar os dados do registro " + req.params.id + " de usuário");
            response = {
              "error": true,
              "message": "Error updating data"
            };
          } else {
            console.log("Dados do registro " + req.params.id + " atualizados.");
            response = {
              "error": false,
              "message": "Data updated for " + req.params.id
            };
          }
          res.json(response);
        });
      }
    });
  })
  .delete(function (req, res) {
    console.log("Requisição: DELETE /users/" + req.params.id);
    var response = {};
    // find the data
    mongoOp.findById(req.params.id, function (err,data) {
      if (err) {
        console.log("Erro ao requisitar dados com id " + req.params.id);
        response = {
          "error": true,
          "message": "Error fetching data"
        };
      } else {
        // data exists, remove it
        console.log("Tentando apagar registro " + req.params.id);
        mongoOp.remove({_id: req.params.id}, function (err) {
          if (err) {
            // registro apagado
            console.log("Não foi possível apagar o registro " + req.params.id);
            response = {
              "error": true,
              "message": "Error deleting data"
            };
          } else {
            // não houveram erros
            console.log("Registro de usuário " + req.params.id + " foi apagado.");
            response = {
              "error": false,
              "message": "Data associated with "+req.params.id+" is deleted"
            };
          }
          res.json(response);
        });
      }
    });
  }); // route GET, PUT e DELETE /users/:id


app.use('/', router);

app.listen(3000);
console.log("Servidor ativo na porta 3000");
