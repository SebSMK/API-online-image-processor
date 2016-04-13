var current_file_id = 0;  
var current_file;

;(function (window, document) {

  'use strict';

  var all_files = [];
  var all_file_list;
//  var current_file_id = 0;
  var locked = false;
  var prev_count_files = 0;
  var waiting = 0;  
  
  var zoomServer = "http://csdev-seb-02:4000/imgsrv/test/zoom"; 
  
  var socket = io.connect('http://172.20.1.203:4000'); 
  socket.on('converting', function (data) {
    if(data) {                    
        if (data.process != 'end'){
          document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = data.process;            
          var progress = document.getElementById('file-' + current_file_id).querySelector('progress');
          progress.max = 100;
          progress.value = data.pct;
        }else{
          document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'ready';            
          var progress = document.getElementById('file-' + current_file_id).querySelector('progress');
          progress.max = 100;
          progress.value = 100;                                                                                                           
        }                                                                                    
    } else {
        document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Failed';
        all_files[current_file_id] = 1;
        current_file_id++;
        handleNextFile();                    
    }
  });        
         
  var noopHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  
  var hasClass = function(el, className) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  };
  
  var selectImage = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    var classname = "selected"
    var el = document.getElementsByClassName(classname);
    
    for (var i = 0, length = el.length; i < length; i++) {
      el[0].className = el[0].className.replace(classname,"");
    }
    
    evt.currentTarget.getElementsByTagName('div')[0].className += " selected";         
    
    refreshViewer();
                 
  };
  
  var refreshViewer = function () {       
    var selected = document.getElementById('dropzone').getElementsByClassName('selected');
    var zoomIds = [];
    
    for (var i = 0, length = selected.length; i < length; i++) {
      var zoomId = {};      
      zoomId['id'] = selected[i].getAttribute('imageid');
      zoomIds.push(zoomId);              
    }     
    
    if (zoomIds.length > 0){      
      //document.getElementById('viewzone').querySelector('iframe').src = zoomServer + '/' + zoomIds[0].id;
            
      document.getElementById("viewForm").action = zoomServer;
      document.getElementById("viewForm").action = zoomServer;
      document.getElementById('images').value = JSON.stringify(zoomIds);
      document.getElementById("viewForm").submit();
    }                
  };

  var drop = function (evt) {
    noopHandler(evt);
    handleFiles(evt.dataTransfer.files);
  };

  var handleFileDialog = function (evt) {
    noopHandler(evt);
    var element = evt.srcElement || evt.target;
    handleFiles(element.files);
  };

  var handleFiles = function (files) {
    var count = files.length;
    var i, j;

    if ( count > 0 ) {

      prev_count_files = all_files.length;

      document.getElementById('dropzone').className = 'queue';

      for ( i = prev_count_files + waiting, j = 0; i < prev_count_files + files.length + waiting; i++, j++ ) {
        //document.getElementById('dropzone').innerHTML += '<div class="file" id="file-' + i + '"><div class="name">' + files[j].name + '</div><div class="progress">Waiting...</div><div class="clear"></div></div>';        
        var aEl  = document.createElement("div");
        //aEl.innerHTML = '<div class="file" id="file-' + i + '"><div class="name">' + files[j].name + '</div><div class="progress">Waiting...</div><div class="progressbar"></div><div class="clear"></div></div>';
        //aEl.innerHTML = '<div class="file" id="file-' + i + '"><div class="progress">Waiting...</div><div class="progressbar"></div><div class="clear"></div></div>';
        aEl.innerHTML = '<div class="file" id="file-' + i + '"><div class="progress">Waiting...</div><progress class="progressbar"></progress><div class="clear"></div></div>';        
        document.getElementById('dropzone').appendChild(aEl);
      }

      waiting += count;

      if ( ! locked ) {
        waiting -= count;
        all_files.push.apply(all_files, files);        
        handleNextFile();
      }
    }
  };

  var handleReaderLoad = function (evt) {

    current_file = {
      name: all_files[current_file_id].name,
      type: all_files[current_file_id].type,
      size: all_files[current_file_id].size,
      contents: evt.target.result
    };    

    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    
    if (xhr.upload && current_file.type.indexOf("image/") == 0 && current_file.size <= 50000000) {
    
      // create progress bar
  		//var o = document.getElementById('file-' + current_file_id).querySelector('.progress');
  		//var progressbar = o.appendChild(document.createElement("p"));
  		//progressbar.appendChild(document.createTextNode("upload " + current_file.name));
      var progress = document.getElementById('file-' + current_file_id).querySelector('progress');
      progress.max = current_file.size;
      
      // progress bar      
  		xhr.upload.addEventListener("progress", function(e) {
  			//var pc = parseInt(100 - (e.loaded / e.total * 100));
  			//progressbar.style.backgroundPosition = pc + "% 0";
        progress.value = e.loaded;                
  		}, false);
          
      formData.append('files', all_files[current_file_id]);
      
      xhr.open('POST', '/upfor', true);                  
      
      xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
          if ( document.getElementById('file-' + current_file_id) ) {
            
            //progressbar.className = (xhr.status == 200 ? "success" : "failure");
          
            if ( xhr.status === 200 ) { 
                                   
              var jsonRes = JSON.parse(xhr.response);
              var formatUrl = JSON.parse(xhr.response).response.formatUrl; 
              var zoomUrl = JSON.parse(xhr.response).response.zoomUrl; 
              var imageid = JSON.parse(xhr.response).response.id;                                         
                          
              //document.getElementById('file-' + current_file_id).querySelector('.progress').className = 'progress';                     
              //document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = current_file.name + ' uploaded' + document.getElementById('file-' + current_file_id).querySelector('.progress').getElementsByTagName('p')[0].outerHTML;
              document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = current_file.name + ' uploaded';                       
              
                                                  
              document.getElementById('file-' + current_file_id).innerHTML += '<a></a>';
              var a = document.getElementById('file-' + current_file_id).querySelector('a');
              a.href = "#";
              a.innerHTML += '<div imageid="' + imageid + '" class="image"><img src="' + formatUrl + '/thumb"></a></div>';
              a.getElementsByTagName('div')[0].className += " selected";  
              a.addEventListener('click', selectImage, false);
              
              refreshViewer();
                            
              all_files[current_file_id] = 1;
              current_file_id++;
              handleNextFile();         
                             
            } else {
              document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Failed';
              all_files[current_file_id] = 1;
              current_file_id++;
              handleNextFile();
            }
          }else{
            all_files[current_file_id] = 1;
            current_file_id++;
            handleNextFile();
          }
          
        }
      };
            
      //xhr.send(JSON.stringify(current_file));
      
      
      xhr.send(formData);    
    }
    else{
      document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Error on init';
    }
    
    
  };

  var handleNextFile = function () {

    if ( current_file_id < all_files.length ) {

      locked = true;

      document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Uploading...';
      //document.getElementById('file-' + current_file_id).querySelector('.progress').className += ' blink_me';
      var current_file = all_files[current_file_id];

      var reader = new FileReader();
      reader.onload = handleReaderLoad;
      reader.readAsDataURL(current_file);

    } else {
      locked = false;
    }
  };

  var openFileDialog = function () {
    var evt = new MouseEvent('click');
    document.getElementById('addFile').dispatchEvent(evt);
  };

  var dropzone = document.getElementById('dropzone');
  //dropzone.addEventListener('click', openFileDialog, false);
  dropzone.addEventListener('dragenter', noopHandler, false);
  dropzone.addEventListener('dragexit', noopHandler, false);
  dropzone.addEventListener('dragover', noopHandler, false);
  dropzone.addEventListener('drop', drop, false);
  

  var addFile = document.getElementById('addFile');
  addFile.addEventListener('change', handleFileDialog);

}(window, window.document));
