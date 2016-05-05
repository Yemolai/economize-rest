var db = require('../models');
module.exports = {
  GET: { // GET ROUTES
    all: {
      url: '/user',
      handler: function (req, res) {
        console.log("requisitando: GET /user");
        var userList = db.User.all().then(function (users) {
          console.log("respondendo com conteúdo da tabela de usuários.");
          res.json(users);
        });
      }
    },
    specific: {
      url: '/user/:id',
      handler: function (req, res) {
        console.log("requisitando: GET /user/"+req.params.id);
        var user = db.User.findOne({id: req.params.id}).then(function (users) {
          console.log("respondendo com o usuário solicitado.");
          res.json(users);
        })
      }
    },
    byEmail: {
      url: '/user/email/:email',
      handler: function (req, res) {
        console.log("requisitando: GET /user/email/"+req.params.email);
        var users = db.User.find({email: req.params.email}).then(function(users) {
          console.log("respondendo com usuários com email solicitado.");
          res.json(users);
        })
      }
    }
  },
  POST: { //POST ROUTES
    newuser: {
      url: '/user',
      handler: function (req, res, next) {
        console.log("requisitando: POST /user");
        res.json({code: "MethodNotAllowedError", message: "Sorry, method not implemented yet."});
      }
    },
    login: {
      url: '/user/login',
      handler: function (req, res, next) {
        console.log("requisitando: POST /user/login");
        res.json({code: "MethodNotAllowedError", message: "Sorry, method not implemented yet."});
      }
    }
  }
}
