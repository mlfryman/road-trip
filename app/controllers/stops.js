'use strict';

var mp     = require('multiparty'),
    Mongo  = require('mongodb'),
    Trip   = require('../models/trip'),
    Stop   = require('../models/stop');

exports.createStop = function(req, res){
  var names = (req.body.name.length === 1) ? req.body.name : [req.body.name];
  Stop.insert(req.body.stop, req.body.tripID, function(){
    Trip.collection.update({_id: Mongo.ObjectID(req.params.id)}, {$push : {stops: {$each : names}}}, function(){
      res.redirect('/trips/' + req.params.id);
    });
  });
};

exports.events = function(req, res){
  Stop.findById(req.params.stopid, function(stop){
    res.render('stops/index', {stop: stop, tripID: req.params.id});
  });
};

exports.createEvent = function(req, res){
  var form = new mp.Form();

  form.parse(req, function(err, fields, files){
    Stop.findById(req.params.stopid, function(stop){
      console.log(stop);
      stop.eventsAndPhotos(files, fields, function(){
        Trip.collection.update({_id: Mongo.ObjectID(req.params.id)}, {$push : {events: {$each : fields.events}, photos: {$each: files.photos}}}, function(){
          res.redirect('/trips/' + req.params.id + '/stops/' + req.params.stopid);
        });
      });
    });
  });
};
