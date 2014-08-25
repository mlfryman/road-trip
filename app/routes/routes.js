'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    home           = require('../controllers/home'),
    stops          = require('../controllers/stops'),
    trips          = require('../controllers/trips');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);

  app.get('/trips/new', trips.new);
  app.post('/trips', trips.create);
  app.get('/trips', trips.index);
  app.get('/trips/:id', trips.stops);

  app.post('/trips/:id', stops.createStop);
  app.get('/trips/:id/stops/:stopid', stops.events);
  app.post('/trips/:id/stops/:stopid', stops.createEvent);


  console.log('Express: Routes Loaded');
};
