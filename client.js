var client = function(server) {

  server.register(require('inert'), function () {
    server.route({
      method: 'GET',
      path:'/evelent/client/{fileName}',
      handler: function (request, reply) {
        //console.log(request.params.fileName);
        reply.file('client/'+request.params.fileName);
      }
    });
  });

  server.register(require('inert'), function () {
    server.route({
      method: 'GET',
      path:'/evelent/client/js/{fileName}',
      handler: function (request, reply) {
        //console.log(request.params.fileName);
        reply.file('client/js/'+request.params.fileName);
      }
    });
  });

  server.register(require('inert'), function () {
    server.route({
      method: 'GET',
      path:'/evelent/client/stylesheets/{fileName}',
      handler: function (request, reply) {
        //console.log(request.params.fileName);
        reply.file('client/stylesheets/'+request.params.fileName);
      }
    });
  });

};

module.exports = client;
