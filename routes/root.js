// import here any libs those route handler functions are using

module.exports = {
  GET: { // type of requisition
    any: { // route identifier (make this unique, please)
      url: '/', // the route URL
      handler: function (req, res) { // the route handler function
        console.log("Requisitando: GET /");
        // respondendo com mensagem simpática
        res.json({
          "error": false,
          "message": "Hello. Are you lost?"
        });
      }
    }
  }
}
