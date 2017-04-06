requirejs.config({
    'baseUrl': './js',
    'paths': {
        'jquery': 'lib/jquery-3.2.0.min'
    }
});

require([
    'application',
    
    'kinect',
    'kinect/cursor',
    'kinect/skeleton',
], function (application, kinect, cursor, skeleton) {
    
    application.init();
    
    kinect.init();
    
    cursor.init();
    skeleton.init();
});