var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
// Objeto do mongoose para manipulação do MongoDB
var mongoOp = require("./models/mongo");

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

router.get("/", function(req, res) {
    res.json({
        "error": false,
        "message": "No methods working right now"
    });
});

// route() vai permitir que você use o mesmo caminho para diferentes operações
// HTTP. Então se você tem a mesma URL com diferentes operações HTTP como GET,
// POST, etc. use o route() para remover código redundante e enxutar o script.

router.route("/users").get(function(req, res) {
    var response = {};
    mongoOp.find({}, function(err, data) {
            if (err)
                response = {
                    "error": true,
                    "message": "Error fetching the data"
                };
            else
                response = {
                    "error": false,
                    "message": data
                };

            res.json(response);
        })
        .post(function() {
            var db = new mongoOp();
            var repsonse = {};
            //fetch email & password from REST request.
            // Add Strict validation when you use this in Production.
            db.userEmail = req.body.email;
            // Hash the password using SHA1 algorithm.
            db.userPassword = require('crypto')
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');
            db.save(function(err) {
                // save() will run the MongoDB insert() command.
                // and will add new data in conllection.
                if (err)
                    response = {
                        "error": true,
                        "message": "Error adding data"
                    };
                else
                    response = {
                        "error": false,
                        "message": "Data added"
                    };
                res.json(response);
            });
        });
});


app.use('/', router);

app.listen(3000);
console.log("Listening to PORT 3000");
