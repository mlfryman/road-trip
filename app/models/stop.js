'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path');

function Stop(o){
  this._id     = Mongo.ObjectID();
  this._tripID = o.tripID;
  this.name    = o.name;
  this.lat     = o.lat * 1;
  this.lng     = o.lng * 1;
  this.events  = [];
  this.photos  = [];
}

Object.defineProperty(Stop, 'collection', {
  get: function(){return global.mongodb.collection('stops');}
});

// Insert will do bulk inserts or just one if needed.
Stop.insert = function(stops, tripID, cb){
  var s;

  // If stops has a length, it needs to be mapped.
  if(stops.length){
    s = stops.map(function(s){
      s.tripID = Mongo.ObjectID(tripID);
      return new Stop(s);
    });
  }else {
    s = new Stop(stops);
    s.tripID = Mongo.ObjectID(tripID);
  }

  Stop.collection.insert(s, cb);
};

Stop.find = function(query, cb){
  var id = Mongo.ObjectID(query);
  Stop.collection.find({_tripID: id}).toArray(function(err, stops){
    cb(stops);
  });
};

Stop.findById = function(query, cb){
  var id = Mongo.ObjectID(query);
  Stop.collection.findOne({_id: id}, function(err, obj){
    var stop = _.create(Stop.prototype, obj);
    cb(stop);
  });
};

Stop.prototype.eventsAndPhotos = function(files, fields, cb){
  // Add photos to file system & photos array.
  var baseDir = __dirname + '/../static',
      relDir  = '/img/' + this._id,
      absDir  = baseDir + relDir,
      exists = fs.existsSync(absDir),
      self = this;

  if(!exists){
    fs.mkdirSync(absDir);
  }

  // Stops mkdirSync from trying to create a directory if photo(s) = null.
  files.photos.forEach(function(photo){
    if(!photo.size){ return; } // If it's not a photo, don't let it push to photos.

    var ext = path.extname(photo.path),
        fileName = self.photos.length + ext,
        rel = relDir + '/' + fileName,
        abs = absDir + '/' + fileName;
    fs.renameSync(photo.path, abs);

    self.photos.push(rel);
  });

  // Push events to events array.
  fields.events.forEach(function(e){
    // Don't be a sieve & allow null values through.
    if(!e) { return; }
    self.events.push(e);
  });

  // Save stop
  Stop.collection.save(this, cb);

};

module.exports = Stop;
