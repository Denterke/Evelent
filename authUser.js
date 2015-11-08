var pg  = require('pg'); //require с postgres
var joi = require('joi');
var conString = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";


var authUser = function(server) {

  server.route({
    method: 'POST',
    path:'/evelent/authUser',
    handler: function (request, reply) {

      var phone_number = request.payload.phone_number.substring(1);
      var phone_code   = request.payload.phone_code;

      var schema = {
        phone_number: joi.string().regex(/^\d+$/).length(10),
        phone_code: joi.string().regex(/^\d+$/).length(4)
      };
      var value = {
        phone_number: phone_number,
        phone_code: phone_code
      };

      joi.validate(value, schema, function (err, value) {
        if (err) {
          reply(err.details[0].message);
          return console.log(err.details[0].message);
        }
      });

      pg.connect(conString, function(err, client, done) {
        if (err) {
          reply("bad connection with database");
          return console.error('could not connect to postgres', err);
        }

        client.query(
          "SELECT (id) FROM users WHERE phone_number = '"+phone_number+"' AND phone_code = '"+phone_code+"'",
          function(err, result) {
            done();
            if (err) {
              throw err;
              return reply(err);
            }
            if (result.rows[0])
              return reply('success' + result.rows[0].id);
            else
              return reply('failed');
        });
      });
    }
  });
};

module.exports = authUser;
