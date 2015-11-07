$(document).ready(function() {
	$("#registration-form").on('submit', function(event) {
		event.preventDefault();
		
		$.ajax({
  			method: "POST",
  			url: "http://31.131.24.188:8080/evelent/registerUser",
  			data: event.target.serializeArray()
		})
  		.done(function( msg ) {
  			console.log(msg);
			$("#registration-confirm").foundation('reveal','open');
  		});
	});


	$("#registration-confirm").on('submit', function(event) {
		event.preventDefault();
		
		$.ajax({
  			method: "POST",
  			url: "http://31.131.24.188:8080/evelent/authUser",
  			data: event.target.serializeArray()
		})
  		.done(function( msg ) {
    		localStorage.setItem("logIn", true);
			//localStorage.setItem("userInfo", );
  		});
		

	});

});
