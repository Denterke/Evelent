var client = function(server) {

  server.register(require('inert'), function () {
    server.route({
      method: 'GET',
      path:'/evelent/client/{fileName}',
      handler: function (request, reply) {
        console.log(request.params.fileName);
        reply.file('client/'+request.params.fileName);
      }
    });
  });

};

module.exports = client;
