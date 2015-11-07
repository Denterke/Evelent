// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

$(document).foundation();

$(document).ready(function(){

    if (localStorage.getItem("nick") == null) {
        $(".registered").css('display', 'none');
    } else {
        $(".non-registered").css('display', 'none');
    }


	var map = L.map('map').setView([43.11, 131.89], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'evelent.cignfgrjg001yzam47lnmyl59',
        accessToken: 'pk.eyJ1IjoiZXZlbGVudCIsImEiOiJjaWduZmdydmUwMDF0bHVrdDB3dmtkZHJjIn0.QN3O5fQ44HY2Kg0WAUCCkQ'
    }).addTo(map);

    GetEventsList(map);

    $(document).on('closed.fndtn.reveal', '#event-details', function () {
        $("#event-details>#container").empty();
    });


    $("#logout").click(function(event) {
        localStorage.removeItem("nick");
        $(".registered").css('display', 'none');
        $(".non-registered").css('display', 'block');
    });


})


function GetEventsList(map) {
    $.get("http://31.131.24.188:8080/evelent/getEventsParams", function (data) {
        console.log(data);
        var eventsData = data;
        for (var i = 0; i < eventsData.length; i++) {
            ShowEventCircle(eventsData[i], map);
        }
    });
}

function ShowEventCircle(eventData, map) {
    if ((eventData["date"] <= 255) && (eventData["date"] >= 0)) {        
         var circle = L.circle([eventData["coordinates_x"], eventData["coordinates_y"]], eventData["visitors"] * 3, {
            color: 'rgb(' + (255 - eventData["date"]) + "," + eventData["date"] + ",0)",
            fillColor: 'rgb(' + (255 - eventData["date"]) + "," + eventData["date"] + ",0)",
            fillOpacity: 1
        }).addTo(map);

        var title = "<h2>" + eventData["name"] + "</h2>";
        
        var more = "<a href='#' class='button' data-reveal-id='event-details' onclick='ShowDetails("+(eventData['id'])+")' >Подробнее</a>"
        circle.bindPopup(title + more);
    }
}

function ShowDetails(id){
    $.get("http://31.131.24.188:8080/evelent/getEventParams/" + id + "&1", function (eventData) {
        var info = eventData[0];
        var title = info["name"];
        var description = info['description'];
        var date = new Date(info['date'] * 2);
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
        };

        date = date.toLocaleString("ru", options);



        var node = $("#event-details #container");
        node.append("<h2>" + title + "</h2>");
        node.append("<img src='" + info['img_src'] +"'/>");
        node.append("<i>" + date + "</i>");
        node.append("<p>" + description + "</p>");
    });
}