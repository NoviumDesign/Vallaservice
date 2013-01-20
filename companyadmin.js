// variables
var url, company, business, token, formId, success;
// functions
var getFormData, getToken, buildForm;

// constants
url = 'http://companyadmins.elasticbeanstalk.com';
company = '';
business = '';
formId = '#order';
success = '<div class="success"><h2>Tack för din beställning!</h2></div>';

// first
getToken = function() {
	$.getJSON(
		url + '/request/token',
		function(response) {
			token = response.token;
			

			getFormData();
	});
}

// second
getFormData = function() {
	$.getJSON(
		url + '/request/data/' + company + '/' + business + '/' + token,
		function(response) {
			token = response.token;
			
			buildForm(response.data)
	});
}

buildForm = function(data) {
	for(var i = 0; i < data.products.length; i++) {

		$(formId + ' .products').append(
				'<option data-secret="' + data.products[i].product_secret + '" value="1">' +
	        		data.products[i].product + ' ' + data.products[i].price + 
	            '</option>'
			);
	}
}

$(formId + ' .products').change(function() {
	var secret = $(this).find(":selected").data('secret');

	$(this).attr('name', 'products[' + secret + ']');
});

// toggle section
$(formId + ' input[name="toggleCustomer"]').change(function() {
	var value, newCustomer, oldCustomer;

	value = $(this).val();
	newCustomer = $(formId + ' .newCustomer');
	oldCustomer = $(formId + ' .oldCustomer');

	if(value == 'true') {
		newCustomer.removeClass('hidden');
		oldCustomer.addClass('hidden');
	} else {
		oldCustomer.removeClass('hidden');
		newCustomer.addClass('hidden');
	}
});


// try customer
var running = false;
$(formId + ' .try').keyup(function() {
	var value = $(formId + ' .try').val();

	if(value.length > 4 && running == false) {
		running = true;
		$.post(
			url + '/request/customer/' + company + '/' + business + '/' + token,
        	{'try' : value},
        	function(response){
        		running = false;

        		token = response.token;
				
				if(response.customer) {
					$(formId + ' .selectedCustomer').html(response.customer.name);
				} else {
					$(formId + ' .selectedCustomer').html('Ingen matchning');
				}

	    }, 'json');
	}
});


$(formId).submit(function(event) {
	event.preventDefault();

    $.post(url + '/request/post/' + company + '/' + business + '/' + token,
    	$(this).serialize(),
    	function(response){
    		token = response.token;
			
			if(response.success) {
				$(formId).html(success);
			} else if(response.error) {
				if(response.error = 'secret') {
					alert('Kundkoden du valt funkar tyvärr inte.');
				} else {
					alert('Formuläret är inte rätt ifyllt!');
				}
			}                  
    }, 'json');
});

$(document).ready(function() {
	getToken();
});