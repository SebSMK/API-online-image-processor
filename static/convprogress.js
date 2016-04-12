window.onload = function() {    
    var messages = [];
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
            console.log("There is a problem");
        }
    });     
}