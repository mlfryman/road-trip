'use strict';

var mp     = require('multiparty'),
    moment = require('moment'),
    Trip   = require('../models/trip'),
    Stop   = require('../models/stop');

exports.new = function(req, res){
  res.render('trips/new');
};

exports.create = function(req, res){
  var form = new mp.Form();

  form.parse(req, function(err, fields, files){
    console.log('fields', fields);
    console.log('files', files);
    Trip.create(fields, files, function(){
      res.redirect('/trips');
    });
  });
};

exports.index = function(req, res){
  Trip.all(function(err, trips){
    console.log(trips);
    res.render('trips/index', {trips: trips, moment: moment});
  });
};

exports.stops = function(req, res){
  Trip.findById(req.params.id, function(trip){
    console.log(trip);
    Stop.find(req.params.id, function(stops){
      console.log(stops);
      res.render('trips/stops', {trip: trip, stops: stops});
    });
  });
};
