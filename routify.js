module.exports = function (restifyInstance, routeBlocks, methods) {
  // Automatically inject routes and middlewares
  // Restify can add middlewares as an array of functions
  if (restifyInstance == undefined) {
    console.error("No restify instance passed. Terminating routify.");
    return false;
  }
  if (routeBlocks == undefined) {
    console.error("No routes passed. Terminating routify.");
    return false;
  }
  if (methods == undefined) {
    console.log("no HTTP methods defined. Searching all possible methods");
    methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  } else {
    console.log("Searching these methods: ", methods);
  }
  // To add the routes we open a box with route blocks
  for (var blockName in routeBlocks) {
    console.log("route block:", blockName);
    var block = routeBlocks[blockName];
    for (var methodID in methods) {
      var method = methods[methodID];
      // hasOwnProperty checks if the object has a property with this string name
      if (block[method] != undefined) {
        var methodBlock = block[method];
        console.log("|- preparing " + method + " routes");
        for (var routeName in methodBlock) {
          var route = methodBlock[routeName];
          if (typeof route.url == 'string' && typeof route.handler == 'function') {
            console.log("||- " + method + " ", route.url);
            switch (method) {
              case 'GET':
                restifyInstance.get(route.url, route.handler);
                break;
              case 'POST':
                restifyInstance.post(route.url, route.handler);
                break;
              case 'PUT':
                restifyInstance.put(route.url, route.handler);
                break;
              case 'PATCH':
                restifyInstance.patch(route.url, route.handler);
                break;
              case 'DELETE':
                restifyInstance.delete(route.url, route.handler);
                break;
              default:
                console.error("The method " + method + " is not implemented.");
                break;
            }
          } else {
            console.error("||- # Erro na rota " + method + " chamada '" + routeName + "'");
          }
          route = null;
        }
        methodBlock = null;
      }
      method = null;
    }
    block = null;
  }
  console.log("\n\tFinished the routifying.\n");
}
