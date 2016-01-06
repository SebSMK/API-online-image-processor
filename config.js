module.exports = {
  port: 8002,
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
    path: '/imgsrv/test/add'
  },
  
  format_API_url: {
    host: 'csdev-seb-02',
    port: 4000,
    path: '/imgsrv/get'
  },
  
  zoom_API_url: {
    host: 'csdev-seb-02',
    port: 4000,
    path: '/imgsrv/test/zoom'
  },
    
};
