/* global geocode, google */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#origin').blur(geocodeOrigin);
    $('#destination').blur(geocodeDestination);

    $('form').submit(addTrip);
  });

  function getDistance(o,d){
    var origin      = new google.maps.LatLng(parseFloat(o.lat), parseFloat(o.lng)),
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
        $('#distance').val(distance);
        $('form').submit();
      });
  }

  function addTrip(e){
    var origin      = {lat:$('#originLat').val(), lng:$('#originLng').val()},
        distance    = $('#distance').val(),
        destination = {lat:$('#destinationLat').val(), lng:$('#destinationLng').val()};

    if(!distance){
      getDistance(origin, destination);

      e.preventDefault();
    }
  }

  function geocodeOrigin(){
    var origin = $('#origin').val();
    geocode(origin, function(originName, originLat, originLng){
      $('#origin').val(originName);
      $('#originLat').val(originLat);
      $('#originLng').val(originLng);
    });
  }
  function geocodeDestination(){
    var destination = $('#destination').val();
    geocode(destination, function(destinationName, destinationLat, destinationLng){
      $('#destination').val(destinationName);
      $('#destinationLat').val(destinationLat);
      $('#destinationLng').val(destinationLng);
    });
  }
})();
