/* global google, async, geocode */
/* jshint quotmark:false */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    $('#add').click(addAdditionalStop);
    $('button[type=submit]').click(geoStops);

    // Origin and destination vars
    var $coordinates = $('.coordinates'),
              origin = new google.maps.LatLng($coordinates.attr('data-olat'), $coordinates.attr('data-olng')),
         destination = new google.maps.LatLng($coordinates.attr('data-dlat'), $coordinates.attr('data-dlng')),
               stops = $('.stop'),
           waypoints = [];

    // Turn stop into an array
    stops = $.makeArray(stops);

    // Convert stops to waypoints for Google Maps
    if(stops.length){
      waypoints = stops.map(function(div){
        var lat  = $(div).attr('data-lat'),
        lng  = $(div).attr('data-lng');
        return {location: new google.maps.LatLng(parseFloat(lat), parseFloat(lng))};
      });
    }

    // Initialize map with current set of waypoints
    initialize(origin, destination, waypoints);
  });

  function addAdditionalStop(){
    var $input = $('form > .stop-group:last-of-type'),
        $clone = $input.clone();
    $('form #stops').append($clone);
  }

  function initialize(origin, destination, stops){

    var styles = [{'featureType':'water','stylers':[{'color':'#021019'}]},{'featureType':'landscape','stylers':[{'color':'#08304b'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#0c4152'},{'lightness':5}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#0b434f'},{'lightness':25}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#0b3d51'},{'lightness':16}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#000000'},{'lightness':13}]},{'featureType':'transit','stylers':[{'color':'#146474'}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#144b53'},{'lightness':14},{'weight':1.4}]}],
    options = {
      zoom: 2,
      center: origin,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    },

    // Display driving directions
    directionsService = new google.maps.DirectionsService();

    // Set map equal to google.maps.Map, give it an ID to attach to and some options to see it up with
    map = new google.maps.Map(document.getElementById('map'), options);

    // Render options specific to directionsDisplay. (e.g., lines on the map)
    var rendererOptions = {map: map},
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions),
    request = {
      origin: origin,
      destination: destination,
      waypoints: stops,
      optimizeWaypoints: false,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    // Set panel for Google directionsService
    directionsDisplay.setPanel(document.getElementById('directions'));

    // Sends our request to directionsService where it will tell us if we're crazy or not
    directionsService.route(request, function(response, status){
      if (status === google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }
      else {
        console.log(status);
        console.log(response);
      }
    });
  }

  function geoStops(e){
    // Creates an array of the name field's values
    var addresses = $('.stop-group .form-control').toArray().map(function(a){
      return $(a).val();
    });

    // Since geocoding needs to communicate somewhere,
    // we need async map to asynchronously loop over the addresses we just made and update their fields.
    async.map(addresses, iterator, results);

    e.preventDefault();
  }

  // Iterator takes two parameters: index and a callback for when done.
  // The callback here is meant to do something asynchronously in a loop, hence the need for async.map
  function iterator(address, cb){
    // We're geocoding the address and expecting geocode to give us back name, lat, and lng.
    geocode(address, function(name, lat, lng){
      cb(null, {name:name, lat:lat, lng:lng});
    });
  }

  // Results takes two parameters (err and transformed array)
  function results(err, newStops){
    // if we clone the fields before adding, then we can't target fields individually;
    // but we CAN update the values and then prepend.
    newStops.forEach(function(stop, i){
      $('form').prepend("<input type='hidden' name='stop[" + i +"][name]' value='" + stop.name +"' />");
      $('form').prepend("<input type='hidden' name='stop[" + i +"][lat]' value='" + stop.lat +"' />");
      $('form').prepend("<input type='hidden' name='stop[" + i +"][lng]' value='" + stop.lng +"' />");
    });

    // Finally ready to submit
    $('form').submit();
  }

})();
