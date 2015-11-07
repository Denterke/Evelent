// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

$(document).foundation();

$(document).ready(function(){

	var map = L.map('map').setView([43.11, 131.89], 13);
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

        circle.bindPopup("<h1>" + eventData["name"] + "</h1><div class='event-details-button' onclick='ShowEventDetails("+eventData["id"]+");'>•••</div>");
    }
}

function ShowEventDetails (id) {
	$.get("http://31.131.24.188:8080/evelent/getEventParams/" + id + "&1", function (eventData) {
		eventData = eventData[0];
		$(".event-details-event-window-title").html(eventData["title"]);
        $(".event-details-event-window-description").html(eventData["description"]);
		
		var date = new Date(eventData["date"]*1000);
		console.log(date);
		date = date.getDate();
		console.log(date);
		
		$(".event-details-event-window-date").html(date);
		$(".event-details-window").fadeIn(300);
		
		console.log(eventData);
		
		$(".event-details-event-window-image").css("background-image", "url('" + eventData["img_src"] + "')");
	});
}

function CloseEventDetailsWindow () {
	$(".event-details-window").fadeOut(300);
}

function SubmitRegistrationForm() {
    var formData = $("#regform").serialize();
    
	localStorage.setItem('phone_number', $("#phone").val());
    
	console.log("Пытаемся зарегаться");
	
	$.post("", formData, function (data) {
        console.log(data);
        if (data == "register_success") {
			SendVerificationRequest($("#phone").val());
			localStorage.setItem("isLoggedIn", "true");
        }
        else
            navigator.notification.alert("Какое-то из полей не было заполнено", null, "Ошибка","Ok");
    });
}

function SendVerificationRequest(phone_without_8) {
    $.get("" + phone_without_8, function(data) {
        console.log(data);
    });
}