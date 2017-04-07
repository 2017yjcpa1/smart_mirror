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
    'kinect/skeleton',
], function (system, kinect, cursor, skeleton) {
    
    system.init();
    
    kinect.init();
    
    cursor.init();
    skeleton.init();
});