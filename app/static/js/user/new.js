/* global geocode, google */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#origin').blur(geocodeOrigin);
    $('#destination').blur(geocodeDestination);

    $('form').submit(addTrip);
  });

  function getDistance(o,d){
    // Set origin and destination, turn them into floats because Google requires it to be a number
    var origin = new google.maps.LatLng(parseFloat(o.lat), parseFloat(o.lng)),
        destination = new google.maps.LatLng(parseFloat(d.lat), parseFloat(d.lng)),
        service = new google.maps.DistanceMatrixService();

    console.log(origin, destination);

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }, function(results, response){

        console.log(results, response);

        var distance = results.rows[0].elements[0].distance.text;
        distance = distance.split(' mi').join('').split(',').join('');
        // Update value of distance before submitted
        $('#distance').val(distance);
        // Submit the form
        $('form').submit();
      });
  }

  function addTrip(e){
    var origin      = {lat:$('#originLat').val(), lng:$('#originLng').val()},
        distance    = $('#distance').val(),
        destination = {lat:$('#destinationLat').val(), lng:$('#destinationLng').val()};

    // If disance is null/undefined, we need to change that.
    // Without this if statement, the document will submit before information is received
    if(!distance){
      getDistance(origin, destination);

      //Prevent form from submitting before it's done geocoding
      e.preventDefault();
    }
  }

  // Since geocoder requires a callback, we must wait until both origin & distance are done
  // Geocode source/origin
  function geocodeOrigin(){
    var origin = $('#origin').val();
    geocode(origin, function(originName, originLat, originLng){
       // Update origin before submit
      $('#origin').val(originName);
      $('#originLat').val(originLat);
      $('#originLng').val(originLng);
    });
  }

  // Geocode destination
  function geocodeDestination(){
    var destination = $('#destination').val();
    geocode(destination, function(destinationName, destinationLat, destinationLng){
       // Update destination before submit
      $('#destination').val(destinationName);
      $('#destinationLat').val(destinationLat);
      $('#destinationLng').val(destinationLng);
    });
  }
})();
