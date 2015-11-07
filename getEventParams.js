var pg = require('pg'); //require с postgres
var conString = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";


var getEventParams = function(server) {

  server.route({
    method: 'GET',
    path:'/evelent/getEventParams/{event_id}&{user_id}',
      handler: function (request, reply) {
        var event_id = request.params.event_id;
        var user_id = request.params.user_id;

        pg.connect(conString, function(err, client, done) {
        if (err) {
          reply('could not connect to postgres');
          return console.error('could not connect to postgres', err);
        }

        client.query(
          "SELECT name, date, description, visitors, img_src FROM events WHERE id = '"+event_id+"'",
          function(err, result) {
            done();

            if (err) throw err;

            if (result.rows[0].visitors.indexOf(parseInt(user_id)) > -1 )
              result.rows[0].isVisitor = 'true';
            else
              result.rows[0].isVisitor = 'false';

            reply(result.rows);
        });
      });
    }
  });

//for working with static file
  server.register(require('inert'), function () {
    server.route({
      method: 'GET',
      path:'/evelent/images/events_img/{imgName}',
      handler: function (request, reply) {
        reply.file('images/events_img/' + request.params.imgName);
      }
    });
  });

};

module.exports = getEventParams;
