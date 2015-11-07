$(document).ready(function() {
	$("#registration-form").on('submit', function(event) {
		event.preventDefault();

		$.ajax({
  			method: "POST",
  			url: "http://31.131.24.188:8080/evelent/registerUser",
  			data: {phone_number: $("#phoneNumber").val(),
  					name: $("#nickName").val()
  			}
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
  			data: {phone_number: $("#phoneNumber").val(), phone_code: $("#confirmCode").val()}
		})
  		.done(function( msg ) {
    		localStorage.setItem("nick", $("#nickName").val());

    		$(".registered").css('display', 'block');
        	$(".non-registered").css('display', 'none');

			//localStorage.setItem("userInfo", );
  		});
		

	});

});
