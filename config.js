module.exports = {
  port: 8003,
  
  s3: {
    key: '',
    secret: '',
    bucket: ''
  },
  s3_enabled: false,
  upload_dir: '/tmp',
  
  convert_API_url: {
    host: 'csdev-seb-02',
    port: 4000,
    //host: 'http://demoapi.smk.dk',    
    //port: 80,
    path: '/imgsrv/test/add'
  },
  
  format_API_url: {
    host: 'csdev-seb-02',
    //port: 4000,
    port: 4003,
    path: '/imgsrv/get'
  },
  
  zoom_API_url: {
    host: 'csdev-seb-02',
    //port: 4000,
    port: 4003,
    path: '/imgsrv/test/zoom'
  }
    
};
