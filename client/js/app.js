// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function(){
  var map = L.map('map').setView([43.11, 131.89], 15);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'evelent.cignfgrjg001yzam47lnmyl59',
      accessToken: 'pk.eyJ1IjoiZXZlbGVudCIsImEiOiJjaWduZmdydmUwMDF0bHVrdDB3dmtkZHJjIn0.QN3O5fQ44HY2Kg0WAUCCkQ'
  }).addTo(map);
  GetEventsList(map);
})

function GetEventsList(map) {
    $.get("http://31.131.24.188:8080/evelent/getEventsParams", function (data) {
        var eventsData = data;
        console.log(eventsData);
        for (var i = 0; i < eventsData.length; i++) {
            ShowEventCircle(eventsData[i], map);
        }
    });
}

function ShowEventCircle(eventData, map) {

    if ((eventData["date"] <= 255) && (eventData["date"] >= 0)) {
        console.log(eventData);

        var circle = L.circle([eventData["coordinates_x"], eventData["coordinates_y"]], eventData["visitors"] * 100, {
            color: 'rgb(' + eventData["date"] + "," + (255-eventData["date"]) + ",0)",
            fillColor: 'rgb(' + eventData["date"] + "," + (255-eventData["date"]) + ",0)",
            fillOpacity: 1
        }).addTo(map);

        circle.bindPopup("<h1>" + eventData["name"] + "</h1>");
    }
}
