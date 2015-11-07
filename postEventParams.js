var fs  = require('fs'); //file system
var joi = require('joi');
var pg  = require('pg'); //require postgres
var conString    = "postgres://postgres:bafffefu123@31.131.24.188:5432/evelent";
var randomString = require('random-string');

var postEventParams = function(server) {
  server.route({
    method: 'POST',
    path:'/evelent/postEventParams',
    handler: function (request, reply) {

      var name          = decodeURI(request.payload.name);
      var description   = decodeURI(request.payload.description);
      var date          = request.payload.date;
      var coordinates_x = request.payload.coordinates_x;
      var coordinates_y = request.payload.coordinates_y;
      var creator       = request.payload.visitor;
      var place         = decodeURI(request.payload.place);
      var img_src       = 'images/events_img/default_event_img.jpg';

      var schema = {
        name:          joi.string().min(5).max(75).required(),
        description:   joi.string().min(10).max(1000).required(),
        place:         joi.string().min(5).max(70).required(),
        date:          joi.date().required(),
        coordinates_x: joi.string().regex(/\-?\d+(\.\d{0,})?/).required(),
        coordinates_y: joi.string().regex(/\-?\d+(\.\d{0,})?/).required(),
        creator:       joi.string().regex(/^[0-9, ]+$/).required()
      };
      var value = {
          name:          name,
          description:   description,
          place:         place,
          date:          date,
          coordinates_x: coordinates_x,
          coordinates_y: coordinates_x,
          creator:       creator
      };

      joi.validate(value, schema, function (err, value) {
        if (err) {
          console.log(err.details[0].message);
          return reply(err.details[0].message);
        }
        else {
          if (name.indexOf('<') > -1 || description.indexOf('<') > -1 || place.indexOf('<') > -1) {
              console.log('err - <');
              return reply('u have error!');
          }

          if (typeof(request.payload.fileUpload) == 'string') {
            var image = request.payload.fileUpload.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            var fileBuffer = new Buffer(image, "base64");
          }
          else var fileBuffer = request.payload.fileUpload;

          if (fileBuffer) {//дописать проверку расширения
            img_src   = 'images/events_img/'+randomString()+'.jpg'; //сделать уникальное имя
            fs.writeFile(
              img_src,
              fileBuffer,
              function(err) {
                if (err) throw err;
              }
            );
          }

          pg.connect(conString, function(err, client, done) {
            if (err) {
              reply('bad connection with database');
              return console.error('could not connect to postgres', err);
            }

            client.query(
              "INSERT INTO events (name, date, description, coordinates_x, coordinates_y, visitors, img_src, place) VALUES ('"+name+"','"+date+"','"+description+"','"+coordinates_x+"','"+coordinates_y+"','{"+creator+"}','http://31.131.24.188:8080/evelent/"+img_src+"','"+place+"')",
              function(err, result) {
                done();
                if (err) {
                  console.log(err);
                  return reply('u have error!');
                }

              console.log(name, date, description, coordinates_x, coordinates_y, creator, img_src);
              return reply('success');
            });
          });
        }
      })
    }
  });
};

module.exports = postEventParams;
