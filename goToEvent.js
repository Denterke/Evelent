var pg = require('pg'); //require с postgres
var conString = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";


var goToEvent = function(server) {

  server.route({
    method: 'GET',
    path:'/evelent/goToEvent/{event_id}&{user_id}',
      handler: function (request, reply) {
        var event_id = request.params.event_id;
        var user_id = request.params.user_id;

        pg.connect(conString, function(err, client, done) {
        if (err) {
          reply('could not connect to postgres');
          return console.error('could not connect to postgres', err);
        }

        client.query(
          "SELECT COUNT (*) FROM events WHERE id = '"+event_id+"' AND "+user_id+" = ANY (visitors)",
          function(err, result) {
            done();

            if (err) throw err;

            if (result.rows[0].count == 1) {
              client.query("UPDATE events SET visitors = array_remove(visitors, "+user_id+") WHERE id = '"+event_id+"'");
              reply('disliked');
            }
            else {
              client.query("UPDATE events SET visitors = array_append(visitors, "+user_id+") WHERE id = '"+event_id+"'");
              reply('liked');
            }
        });
      });
    }
  });

};

module.exports = goToEvent;
