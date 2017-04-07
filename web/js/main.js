requirejs.config({
    'baseUrl': './js',
    'paths': {
        'jquery': 'lib/jquery-3.2.0.min'
    }
});

require([
    'system',
    
    'kinect',
    'kinect/cursor',
], function (system, kinect, cursor) {
    
    system.init();
    
    kinect.init();
    cursor.init();
});