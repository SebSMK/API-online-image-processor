var Q = require('q'),
config = require('./config'),
http = require('http'),
url = require('url'),
sprintf = require('sprintf-js').sprintf;

function post(filepath) {
  
  var filename = filepath.split('/').pop();  
  var post_data = sprintf('{"invnumber":"%s", "link":"%s"}', filename, filepath);
  
  var deferred = Q.defer(),
  options = {
    host: config.convert_API_url.host,
    port: config.convert_API_url.port,
    path: config.convert_API_url.path,
    headers: {
        'Content-Type': 'application/json'
    },
    method: 'POST'
  };
  
  var post = http.request(options, function(resp) {          
    var data = '';      
    resp.setEncoding('utf8');
    resp.on('data', function(chunk) {
          data += chunk;
      });
    resp.on('end', function() {
        if (data !== '' && data.indexOf('"error":') == -1){
            var jsonData = JSON.parse(data);
            //console.log("converter: response received", JSON.stringify(jsonData, null, 4));
            
            var id = jsonData.response.id;
            var formatUrl =sprintf('http://%s:%s%s/%s', config.format_API_url.host, config.format_API_url.port, config.format_API_url.path, id);
            jsonData.response.formatUrl = formatUrl;
            var zoomUrl =sprintf('http://%s:%s%s/%s', config.zoom_API_url.host, config.zoom_API_url.port, config.zoom_API_url.path, id);
            jsonData.response.zoomUrl = zoomUrl;            
            
            deferred.resolve(jsonData);
        }else{
            console.error("empty postjson result returned");
            deferred.reject(data);
        }
    });
    resp.on('error', function(err) {
        console.error("http.request postjson error: " + err);
        deferred.reject(err);
    });
  });
          
  post.on('error', function(e) {
    console.error("converter:", e.message);
    deferred.reject("converter:" + e.message);
  });
  
  // write data to request body
  post.write(post_data);
  
  post.end();            
  
  
  return deferred.promise;

  
}

module.exports = {
  post: post
};
