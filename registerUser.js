var joi = require('joi');
var pg  = require('pg'); //require postgres
var conString    = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";
var randomString = require('random-string');
var getRequest = require('request');

var registerUser = function(server) {
  server.route({
    method: 'POST',
    path:'/evelent/registerUser',
    handler: function (request, reply) {

      var name   = decodeURI(request.payload.name);
      var phone_number = request.payload.phone_number.substring(1);
      var phone_code   = randomString({length: 4, numeric: true, letters: false});

      var schema = {
        name: joi.string().regex(/[а-яА-ЯёЁa-zA-Z0-9]/).min(3).max(15).required(),
        phone_number: joi.string().regex(/^\d+$/).length(10)
      };
      var value = {
        name:        name,
        phone_number: phone_number
      };

      joi.validate(value, schema, function (err, value) {
        if (err) {
          console.log(err.details[0].message);
          return reply(err.details[0].message);
        }
        else {
          pg.connect(conString, function(err, client, done) {
            if (err) {
              reply('bad connection with database');
              return console.error('could not connect to postgres', err);
            }

            client.query(
              "INSERT INTO users (name, phone_number, phone_code) VALUES ('"+name+"','"+phone_number+"','"+phone_code+"')",
              function(err, result) {
                done();
                if (err) {

                  client.query(
                    "SELECT phone_code FROM users WHERE phone_number='"+phone_number+"'",
                    function(err, result) {
                      done();
                      if (err) throw err;
                      getRequest('http://gate.prostor-sms.ru/send/?phone=%2B7'+phone_number+'&text='+result.rows[0].phone_code+'&login=t89242331814&password=456570');
                  });

                  return reply('success');
                }

              getRequest('http://gate.prostor-sms.ru/send/?phone=%2B7'+phone_number+'&text='+phone_code+'&login=t89242331814&password=456570', function (error, response, body) {
                if (!error && response.statusCode == 200)
                  console.log(body) // Show the HTML for the Google homepage.
                else console.log(response);
              });

              console.log(name, phone_number, phone_code);
              return reply('success');
            });
          });
        }
      });
    }
  });
};

module.exports = registerUser;
