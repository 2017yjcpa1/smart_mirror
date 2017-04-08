define([
    'jquery',
    'input/kinectBridge',
    'math/vec3d',
    'math/mat2d',
], function ($, kinectBridge, vec3d, mat2d) {
    
    var isActive = false;
    var capturePos = false;
    
    var handCursor = $(document.createElement('div'))
                            .css({
                                'opacity' : 0,

                                'position' : 'fixed',
                                'top' : 0,
                                'left' : 0,
                                'width' : 60,
                                'height' : 60,
                                'z-index' : 9999,

                                'background' : 'url(res/drawable/img_hand.png)',
                                'background-size' : 'contain',

                                'transform-origin' : 'center',

                                'transition' : 'all 0.1s',
                            });
    
    function activate() {
        isActive = true;
        
        handCursor.css('opacity', 1);
    }

    function deactivate() {
        isActive = false;
        capturePos = null;
        
        handCursor.css('opacity', 0);
    }
    
    function updateAngle(data) {
        var vec = vec3d(data.handRight).sub(data.wristRight);
        var rad = Math.atan2(-vec.y, vec.x);
        var deg = Math.toDegrees(rad);

        if ( ! (20 <= deg && deg <= 140)) {
            return;
        }
        
        handCursor.css('transform', mat2d.rotation(rad).toCSSTransform());
    }
    
    function updatePos(data) {
        if (data.handRight.y < data.hipRight.y) {
            deactivate();
            return false;
        }

        if ( ! isActive) {
            window.setTimeout(activate, 1000 * 0.7);
            return false;
        }

        if (capturePos === null) {
            capturePos = data.handRight;
        }

        if (data.handLeft.y > data.elbowLeft.y) {
            return false;
        }
        
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var currentPos = data.handRight;

        handCursor.css({
            'left' : (currentPos.x - capturePos.x) / 0.2 * windowWidth  + windowWidth / 2,
            'top' : -(currentPos.y - capturePos.y) / 0.2 * windowHeight + windowHeight / 2,
        });
    }
    
    function update(data) {
        updateAngle(data);
        updatePos(data); 
    }
    
    function init() {
        handCursor.appendTo('body');
                            
        kinectBridge.addEventListener('skeleton', update);
    }
    
    return {
        init : init
    }
})
