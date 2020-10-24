const fs = require('fs');
const express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');

var port = process.env.PORT || 3000;

const JSONdb = require('simple-json-db');
cont db = new JSONdb(__dirname + '/db.json');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const push_value_error_one = 'Push Value FAILED due to the condition being set to EDIT and the key having no value.';
const push_value_error_two = 'Push Value FAILED due to no condition being set. Set your condition as NEW or EDIT.';
const push_value_error_three = 'Push Value FAILED due to the condition being set to NEW despite the key having a value.';

app.post("/push", function (req, res) {
  const push_key = req.body.push_key;
  const push_value = req.body.push_value;
  const push_condition = req.body.push_condition;
  
  const push_key_value_check = db.get(push_key);
  
  if (push_key_value_check === null || push_key_value_check === undefined || push_key_value_check === '') {
    if (push_condition === 'new' || push_condition === 'NEW') {
      db.set(push_value);
      
      res.send('Push Value SET');
    }
    else if (push_condition === 'edit' || push_condition === 'EDIT') {
      res.send('Push Value FAILED: ' + push_value_error_one);
    }
    else {
      res.send('Push Value FAILED: ' + push_value_error_two);
    }
  }
  else {
    if (push_condition === 'new' || push_condition === 'NEW') {
      res.send('Push Value FAILED: ' + push_value_error_three);
    }
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
