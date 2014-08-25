'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path'),
    Stop  = require('./stop');

function Trip(o){
  // ID given here so that we can save a photo without two calls to the database
  this._id = Mongo.ObjectID();
  this.name = o.name[0];
  this.cash = o.cash[0] * 1;
  this.origin = {name: o.originName[0], lat: parseFloat(o.originLat[0]), lng: parseFloat(o.originLng[0])};
  this.destination = {name: o.destinationName[0], lat: parseFloat(o.destinationLat[0]), lng: parseFloat(o.destinationLng[0])};
  this.startDate = new Date(o.startDate[0]);
  this.endDate = new Date(o.endDate[0]);
  this.photo = [];
  this.mpg = o.mpg[0] * 1;
  this.distance = o.distance[0] * 1;

  // Trip Calculations
  this.gasCost = o.gasCost[0] * 1;
  this.gallons = Math.ceil(this.distance / this.mpg);
  this.tripCost = this.gasCost * this.gallons;
  this.delta = this.cash - this.tripCost;

  // Trip Stops/Events
  this.stops = [];
  this.events = [];
  this.photos = [];
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.all = function(cb){
  Trip.collection.find().toArray(cb);
};

Trip.create = function(fields, file, cb){
  var trip = new Trip(fields);
  trip.moveFile(file);
  Trip.collection.save(trip, cb);
};

Trip.findById = function(query, cb){
  var id = Mongo.ObjectID(query);
  Trip.collection.findOne({_id: id}, function(err, obj){
    var trip = _.create(Trip.prototype, obj);
    cb(trip);
  });
};

Trip.findStops = function(query, cb){
  Stop.find(query, function(stops){
    cb(stops);
  });
};

// Called in .create
Trip.prototype.moveFile = function(files){
  var baseDir = __dirname + '/../static', // absolute path to static directory
      relDir  = '/img/' + this._id, // relative path to img from browser
      absDir  = baseDir + relDir; // absolute path to /img/:id

  fs.mkdirSync(absDir); // creates /img/:id

  this.photo = files.photo.map(function(photo, index){
    if(!photo.size){return;} // makes sure there is a photo

    var ext = path.extname(photo.path), // pulls extension
      name = index + ext, // (e.g., 0.jpg)
      absPath = absDir + '/' + name, // absolute path to file
      relPath = relDir + '/' + name; // relative path to file

    fs.renameSync(photo.path, absPath); // moves photo to dir
    return relPath; // returns relative path to new array
  });

  this.photo = _.compact(this.photo);
};
module.exports = Trip;
