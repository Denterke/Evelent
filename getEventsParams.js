var pg = require('pg'); //require с postgres
var conString = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";


var getEventsParams = function(server) {

  server.route({
    method: 'GET',
    path:'/evelent/getEventsParams',
      handler: function (request, reply) {
        var dateObj = new Date();

        pg.connect(conString, function(err, client, done) {
        if (err) {
          reply('could not connect to postgres');
          return console.error('could not connect to postgres', err);
        }

        client.query(
          "SELECT * FROM events WHERE (date > "+Date.parse(dateObj)+") AND (date < "+new Date().setDate(dateObj.getDate() + 4)+")",
          function(err, result) {
            done();

            if (err) throw err;

            for (i=0; i<result.rows.length; i++) {
              result.rows[i].date = Math.ceil((result.rows[i].date - Date.parse(dateObj))/3600000);
              result.rows[i].visitors = result.rows[i].visitors.length;
              //delete(result.rows[i].place);
              delete(result.rows[i].description);
              delete(result.rows[i].img_src);

            }

            reply(result.rows);
        });
      });
    }
  });

};

module.exports = getEventsParams;
