var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
// Objeto do mongoose para manipulação do MongoDB
var mongoOp = require("./models/mongo");
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
    console.log("Requisitando: POST /users\nDados da requisição:", req);
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
    console.log("Requisição: GET /users/:id");
    var response = {};
    mongoOp.findById(req.params.id, function (err, data) {
      // This will run Mongo Query to fetch data based on ID
      if (err) {
        console.log("Erro ao tentar requisitar dados do MongoDB\nErro:", err);
        response = {
          "error": true,
          "message": "Error fetching the database"
        };
      } else {
        console.log("Respondendo requisição com seguinte dados:", data);
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
        console.log("Registro " + req.params.id + "encontrado para ser atualizado");
        // we've got data from Mongo.
        // change it accordingly
        if (req.body.userEmail !== undefined) {
          console.log("Atualizando email");
          // case where email needs to be updated
          data.userEmail = req.body.email;
        }
        if (req.body.userPassword !== undefined) {
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
            console.log("Dados do registro " + req.params.id + "atualizados.");
            response = {
              "error": false,
              "message": "Data updated for " + req.params.id
            };
          }
          res.json(response);
        });
      }
    });
  }); // route GET /users/:id

app.use('/', router);

app.listen(3000);
console.log("Servidor ativo na porta 3000");
