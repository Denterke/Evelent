var Hapi = require('hapi'); //require с hapi

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: '31.131.24.188',
    port: 8080
});

server.route({
    method: 'GET',
    path:'/evelent',
    handler: function (request, reply) {
      reply('SERVER IS WORKING!');
    }
});

require('./getEventParams')(server); // getEventParams
require('./getEventsParams')(server); // getEventsParams
require('./postEventParams')(server); // postEventParams

require('./registerUser')(server); // postEventParams
require('./authUser')(server); // postEventParams

require('./goToEvent')(server);


require('./client')(server); // client

var getRequest = require('request');
getRequest('http://t89242331814:456570@gate.prostor-sms.ru/credits/');
// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
