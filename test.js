var express = require('express');
var app = express();
var formidable = require('formidable');
var util = require('util');
var config = require('./config');
var fs = require('fs');
var converter = require('./converter');
var path = require('path');

app.use(express.static(__dirname + '/static'));

app.get('/compare',function(req,res){         
  res.sendFile(path.join(__dirname, '/static', 'compare.html'));
});

app.get('/crop',function(req,res){ 
  res.sendFile(path.join(__dirname, '/static', 'crop.html'));        
});

app.post('/upfor', function(req, response) {
  var form = new formidable.IncomingForm();
  form.uploadDir = config.upload_dir;
  form.encoding = 'binary';

  form.addListener('file', function(name, file) {
    // do something with uploaded file
  });

  form.addListener('end', function() {
    //var res = {response:{id: 'youhou', formatUrl: 'youhou', zoomUrl: 'youhou'}};
    //response.end(JSON.stringify(res, null, 4));        
    
  });

  form.parse(req, function(err, fields, files) {
    //fs.rename(files.files.path, 'yournewfilename', function (err) { throw err; });
  
    if (err) {
      console.log(err);
      response.statusCode = 500;
      response.end();       
    } 
    
    // http post to Converter API    
    converter.post(files.files.path)
    .then(function(res){      
      response.statusCode = 200;     
      response.end(JSON.stringify(res, null, 4));
    })
    .catch(function(err) {
      console.error(err);                    
      response.statusCode = 500;
      response.end();        
    })                  
    
  });
});

app.listen(8003, function () {
  console.log('Example app listening on port 8003!');
});