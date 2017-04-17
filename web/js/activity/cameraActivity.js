define([ 'system' ],function (system) {
    
    return {
        
        id : 'cameraActivity',
        title : '카메라',
        icon : 'ic_camera.png',
        layoutHTML : 'activity_camera.html',
        
        init : function () {
            console.log('camera init');
        },
        
        resume : function () {
            console.log('camera resume');
        },
        
        pause : function () {
            console.log('camera pause');
        },
        
        destroy : function () {
            console.log('camera destroy');
        },
    }
})