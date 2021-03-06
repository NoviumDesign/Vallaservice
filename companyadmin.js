// variables
var url, company, business, token, formId, success, customer;
// functions
var getFormData, getToken, buildForm, validate;

// constants
url = 'http://companyadmins.elasticbeanstalk.com';
company = 'dfg7586ghf';
business = '43g5345hj3';
formId = '#order';
success = '<div class="success"><h2>Tack för din beställning!</h2></div>';


// vaiables data
customer = false,


// token request
getToken = function() {
	$.getJSON(
		url + '/request/token',
		function(response) {
			token = response.token;
			
			getFormData();
	});
}

// products request
getFormData = function() {
	$.getJSON(
		url + '/request/data/' + company + '/' + business + '/' + token,
		function(response) {
			token = response.token;
			
			buildForm(response.data)
	});
}

// build product select
buildForm = function(data) {
	for(var i = 0; i < data.products.length; i++) {

		if(i == 0) {
			// set product to first product
			$(formId + ' .products').attr('name', 'products[' + data.products[i].product_secret + ']');
		}

		$(formId + ' select.products').append(
			'<option data-secret="' + data.products[i].product_secret + '" value="1">' +
        		data.products[i].product + (data.products[i].price > 0? ' ' + data.products[i].price + 'kr': '') +
            '</option>'
		);
	}
}

// vaildate form
validate = function() {
	var valid = true;

	// product
	$productsFields = $(formId + ' section.products input, ' + formId + ' section.products select');
	$productsFields.each(function() {
		if($(this).val() == undefined || $(this).val() == '') {
			valid = false;
		}
	});

	// new customer
	if(!customer) {
		$customerFields = $(formId + ' section.newCustomer input, ' + formId + ' section.newCustomer select');
		$customerFields.each(function() {
			if($(this).val() == undefined || $(this).val() == '') {
				valid = false;
			}
		});
	}

	// return
	if(valid) {
		return true;
	} else {
		return false;
	}
}

// product secret
$(formId + ' .products').change(function() {
	var secret = $(this).find(":selected").data('secret');

	$(this).attr('name', 'products[' + secret + ']');
});

// submit
$(formId).submit(function(event) {
	event.preventDefault();

	if(!validate()) {
		alert('Var vänlig och fyll i alla fält med röd stjärna');
		return;
	}

    $.post(url + '/request/post/' + company + '/' + business + '/' + token,
    	$(this).serialize(),
    	function(response){
    		token = response.token;
			
			if(response.success) {
				$(formId).html(success);
			} else if(response.error) {
				// if(response.error = 'secret') {
				// 	alert('Kundkoden du valt funkar tyvärr inte.');
				// } else {
					alert('Formuläret är inte rätt ifyllt');
				// }
			}                  
    }, 'json');
});

// quantity
$(formId + ' .quantity').change(function() {
	var value = $(this).val();

	if(value < 1) {
		$(this).val(1);
		value = 1;
	}

	$(formId + ' select.products').children().attr('value', value)
});

// start
$(document).ready(function() {
	getToken();
});

// toggle section
// $(formId + ' input[name="toggleCustomer"]').change(function() {
// 	var value, newCustomer, oldCustomer;

// 	value = $(this).val();
// 	newCustomer = $(formId + ' .newCustomer');
// 	oldCustomer = $(formId + ' .oldCustomer');

// 	if(value == 'true') {
// 		newCustomer.removeClass('hidden');
// 		oldCustomer.addClass('hidden');
// 	} else {
// 		oldCustomer.removeClass('hidden');
// 		newCustomer.addClass('hidden');
// 	}
// });

// try customer
// var running = false;
// $(formId + ' .try').keyup(function() {
// 	var value = $(formId + ' .try').val();

// 	if(value.length > 4 && running == false) {
// 		running = true;
// 		$.post(
// 			url + '/request/customer/' + company + '/' + business + '/' + token,
//         	{'try' : value},
//         	function(response){
//         		running = false;

//         		token = response.token;
				
// 				if(response.customer) {
// 					$(formId + ' .selectedCustomer').html(response.customer.name);
// 					customer = true;
// 				} else {
// 					$(formId + ' .selectedCustomer').html('Ingen matchning');
// 					customer = false;
// 				}

// 	    }, 'json');
// 	}
// });