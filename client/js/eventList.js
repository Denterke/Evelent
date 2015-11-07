$(document).ready(function({
	$.get("http://31.131.24.188:8080/evelent/getEventsParams", function (data) {
        data.sort(function(a, b){
        	return a.data - b.data;
        })
        console.log(data);
    });
}))