const fs = require('fs');
const express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');

var port = process.env.PORT || 3000;

const JSONdb = require('simple-json-db');
cont db = new JSONdb(__dirname + '/db.json');

const delete_check_key = process.env.DELKEY;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const push_value_error_one = 'Push Value FAILED due to the condition being set to EDIT and the key having no value.';
const push_value_error_two = 'Push Value FAILED due to no condition being set. Set your condition as NEW or EDIT.';
const push_value_error_three = 'Push Value FAILED due to the condition being set to NEW despite the key having a value.';
const push_value_error_four = 'Push Value FAILED due to no condition being set. Set your condition to EDIT.';

const delete_value_error_one = 'Delete Value FAILED due to the deletion key being incorrect.';

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
    else if (push_condition === 'edit' || push_condition === 'EDIT') {
      const push_appended_key_value = push_key_value_check + push_value;
      
      db.set(push_key, push_appended_key_value);
      
      res.send('Push Value SET');
    }
    else {
      res.send('Push Value FAILED: ' + push_value_error_four);
    }
  }
});

app.post("/get", function (req, res) {
  const push_key = req.body.push_key;
  
  const push_key_value = db.get(push_key);
  
  res.send(push_key_value);
});

app.post("/delete", function (req, res) {
  const push_key = req.body.push_key;
  const deletion_key = req.body.deletion_key;
  
  if (deletion_key === delete_check_key) {
    db.delete(push_key);
    
    res.send('Delete Value SET');
  }
  else {
    res.send('Delete Value FAILED: ' + delete_value_error_one);
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
