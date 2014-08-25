/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'road-trip-test';

describe('Trip', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Trip object', function(){
      var trip = new Trip({
        name: ['Corpus Christi 2014'],
        cash: ['1000'],
        mpg: ['35'],
        begin: ['2014-10-05'],
        end: ['2014-12-05'],
        originName: ['Nashville, TN, USA'],
        originLat: ['36.166667'],
        originLng: ['-86.783333'],
        destinationName: ['Corpus Christi, TX, USA'],
        destinationLat: ['27.742778'],
        destinationLng: ['-97.401944'],
        distance: ['1789'],
        gasCost: ['3.50']
      });

      //Trip Properties from form
      expect(trip).to.be.instanceof(Trip);
      expect(trip.name).to.equal('Las Vegas 2013');
      expect(trip.cash).to.equal(1000);
      expect(trip.mpg).to.equal(35);
      expect(trip.begin).to.be.instanceof(Date);
      expect(trip.end).to.be.instanceof(Date);
      expect(trip.photo).to.have.length(0);
      expect(trip.origin.lat).to.equal(36.16);
      expect(trip.origin.lng).to.equal(-86.8);
      expect(trip.origin.name).to.equal('Nashville, TN, USA');
      expect(trip.destination.lat).to.equal(36.17);
      expect(trip.destination.lng).to.equal(-115.14);
      expect(trip.destination.name).to.equal('Las Vegas, TN, USA');
      expect(trip.distance).to.equal(1789);

      //Trip Calculations
      expect(trip.gasPerGallon).to.equal(3.5);
      expect(trip.gallons).to.equal(52);
      expect(trip.tripCost).to.equal(182);
      expect(trip.delta).to.equal(818);


      //Trip Stops/Events
      expect(trip.stops).to.have.length(0);
      expect(trip.events).to.have.length(0);
      expect(trip.photos).to.have.length(0);
    });
  });

  describe('.all', function(){
    it('should get all people', function(done){
      Trip.all(function(err, trips){
        expect(trips).to.have.length(3);
        done();
      });
    });
  });

  describe('.create', function(){
    it('should create a new trip object', function(done){
      var fields = {
        name: ['Las Vegas 2013'],
        cash: ['1000'],
        mpg: ['35'],
        begin: ['2014-10-05'],
        end: ['2014-12-05'],
        originLat: ['36.16'],
        originLng: ['-86.8'],
        originName: ['Nashville, TN, USA'],
        destLat: ['36.17'],
        destLng: ['-115.14'],
        destName: ['Las Vegas, TN, USA'],
        distance: ['1789'],
        gasPerGallon : ['3.50']
      };

      Trip.create(fields, {photo: [{path: ''}]}, function(){
        expect(fields).to.be.ok;
        done();
      });
    });
  });

  describe('.findByID', function(){
    it('should find a specific trip by its ID', function(done){
      Trip.findById('000000000000000000000001', function(trip){
        expect(trip).to.be.ok;
        done();
      });
    });
  });


});
