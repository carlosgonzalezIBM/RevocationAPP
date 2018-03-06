var express = require('express');
var router = express.Router();
var func  = require('../config/functions');
var schedule = require('node-schedule');


/* GET home page. */

router.get('/', function(req, res, next) {
res.render('index', { title: 'RevocationApp'});

  });

router.get('/revoke', function(req, res, next) {

func.getrevokedcontent(function(response){
res.set('Content-Type', 'application/xml');

  var xml='<?xml version="1.0" encoding="UTF-8"?>'+
    '<oauth-revocation>';
xml+=response;
xml+='</oauth-revocation>';
res.set('Content-Type', 'application/xml').send(xml);

});



});

router.get('/auth', function(req, res, next) {
// res.io.emit('auth',req.headers.authorization);
console.log("BODY".blue, req.body,"\nHEADERS".yellow,req.headers)
// console.log("okey".yellow);
  // if(response){
    res.set({
      'API-OAUTH-METADATA-FOR-ACCESSTOKEN': 'hello'
    });
  res.status(200).json("OK");
  // } else res.status(403);

// });
});

router.post('/revoke', function(req, res) {
  console.log("BODY".blue, req.body,"\nHEADERS".yellow,req.headers)

  func.newtoken(req.body.token,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});

router.post('/revoketoken', function(req, res) {
  func.revoketoken(req.body,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});

router.post('/enabletoken', function(req, res) {
  func.enabletoken(req.body,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});



router.post('/revokeall*', function(req, res) {
  func.revokeall(req.body,req.url,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});


router.post('/enableall*', function(req, res) {
  func.enableall(req.body,req.url,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});



router.post('/revokerefresh', function(req, res) {
  func.revokerefresh(req.body,function(response){
  res.io.emit('token',response);
  res.status(200).json(response);
  });

});


module.exports = router;
