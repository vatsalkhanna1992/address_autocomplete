(function ($) {

  /**
   * Script for autocomplete address field.
   */
  Drupal.behaviors.autocompleteAddress = {
    attach: function (context, settings) {
    	$('#autocomplete').focus(function() {
    		geolocate();
    	});
      var placeSearch, autocomplete;
      var componentForm = {
			  street_number: 'short_name',
			  route: 'long_name',
			  locality: 'long_name',
			  administrative_area_level_1: 'short_name',
			  country: 'long_name',
			  postal_code: 'short_name'
			};
			var initAutocomplete = function () {
				// Create the autocomplete object, restricting the search to geographical
			  // location types.
			    if (Drupal.settings.address_autocomplete.country_selected) {
						autocomplete = new google.maps.places.Autocomplete(
			    	/** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
			    	{types: ['geocode'], componentRestrictions: {country: Drupal.settings.address_autocomplete.country_selected}});
			    }
			    else {
			    	autocomplete = new google.maps.places.Autocomplete(
			    	/** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
			    	{types: ['geocode']});
			    }
			    
			  // When the user selects an address from the dropdown, populate the address
			  // fields in the form.
			  autocomplete.addListener('place_changed', fillInAddress);
			}
			var fillInAddress = function() {
			  // Get the place details from the autocomplete object.
			  var place = autocomplete.getPlace();
			  
			  for (var component in componentForm) {
			    $('.' + component).text('');
			    $('.' + component).attr('readonly', false);
			  }

			  // Get each component of the address from the place details
			  // and fill the corresponding field on the form.
			  for (var i = 0; i < place.address_components.length; i++) {
			    var addressType = place.address_components[i].types[0];
			    if (componentForm[addressType]) {
			      var val = place.address_components[i][componentForm[addressType]];
			      $('.' + addressType).val(val);
			    }
			  }
			}
			// Bias the autocomplete object to the user's geographical location,
			// as supplied by the browser's 'navigator.geolocation' object.
			var geolocate = function() {
			  if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function(position) {
			      var geolocation = {
			        lat: position.coords.latitude,
			        lng: position.coords.longitude
			      };
			      var circle = new google.maps.Circle({
			        center: geolocation,
			        radius: position.coords.accuracy
			      });
			      autocomplete.setBounds(circle.getBounds());
			    });
			  }
			  initAutocomplete();
			}
    }
  };

})(jQuery);
