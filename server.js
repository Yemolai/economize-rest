var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var mongoOp     =   require("./models/mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

/*
  Opera√√es REST:
    GET /users Return all Users from MongoDB
    POST /users Add new user in MongoDB
    GET /users/:id Return User with matched ID
    PUT /users/:id Update users information
    DELETE /users/:id Delete particular user
*/

router.route("/users")
  .get(function (req, res) {
    var response = {};
    mongoOp.find({}, function (err, data) {
      if (err) {
        response = {"error": true, "message": "Error fetching the data"};
      } else {
        response = {"error": false, "message": data};
      }
      res.json(response);
    });
  });

router.get("/",function(req,res){
  res.json({"error" : false,"message" : "No methods working right now"});
});

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
