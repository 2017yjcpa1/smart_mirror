define([
    'jquery',
    'kinect/bridge',
    'math/vec3d',
    'math/mat2d',
], function ($, kinect, vec3d, mat2d) {
    
    var active = false;
    var capturePos;
    
    var hand = $(document.createElement('div'))
                    .css({
                        'opacity' : 0,

                        'position' : 'fixed',
                        'top' : 0,
                        'left' : 0,
                        'width' : 60,
                        'height' : 60,

                        'background' : 'url(res/drawable/img_hand.png)',
                        'background-size' : 'contain',

                        'transform-origin' : 'center',
                        
                        'transition' : 'all 0.1s',
                    });
    
    function activate() {
        active = true;
        
        hand.css('opacity', 1);
    }

    function deactivate() {
        active = false;
        capturePos = null;
        
        hand.css('opacity', 0);
    }
    
    function updateAngle(data) {
        var vec = vec3d(data.handRight).sub(data.wristRight);
        var rad = Math.atan2(-vec.y, vec.x);
        var deg = rad * 180.0 / Math.PI;

        if ( ! (20 <= deg && deg <= 140)) {
            return;
        }
        
        hand.css('transform', mat2d.rotation(rad).toCSSTransform());
    }
    
    function isActive(data) {
        if (data.handRight.y < data.hipRight.y) {
            deactivate();
            return false;
        }

        if ( ! active) {
            window.setTimeout(activate, 1000 * 0.7);
            return false;
        }
        
        return true;
    }
    
    function updatePos(data) {
        if ( ! isActive(data)) {
            return;
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

        hand.css({
            'left' : (currentPos.x - capturePos.x) / 0.2 * windowWidth  + windowWidth / 2,
            'top' : -(currentPos.y - capturePos.y) / 0.2 * windowHeight + windowHeight / 2,
        });
    }
    
    function update(data) {
        updateAngle(data);
        updatePos(data); 
    }
    
    function init() {
        hand.appendTo('body');

        kinect.addEventListener('skeleton', update);
    }
    
    return {
        
        init : init,
    };
})