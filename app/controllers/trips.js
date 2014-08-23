'use strict';

var mp = require('multiparty');

exports.index = function(req, res){
  //find all trips
  res.render('trips/index');
};

exports.new = function(req, res){
  res.render('trips/new');
};

exports.create = function(req, res){
  //parse req with multiparty, console.log fiels and forms.
  // could we just do mp.Form.parse(req... ?
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    console.log(fields);
    console.log(files);
    res.redirect('/trips');
  });
};

exports.show = function(req, res){

};
