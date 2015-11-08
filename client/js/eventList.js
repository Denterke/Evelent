$(document).ready(function({
	$.get("http://31.131.24.188:8080/evelent/getEventsParams", function (data) {
        _.sortBy(data, 'date');
        _.map(data, function(object){
        	$("#render-target").append("<li><a href='#' data-reveal-id='event-details' onclick='ShowDetails("+(object["id"])+")'  >" + object['name'] + "</a></li>");
        });        
    });
}))
