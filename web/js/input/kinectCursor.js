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
                                'top' : -9999,
                                'left' : -9999,
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

        /*
        if (data.handLeft.y > data.elbowLeft.y) {
            return false;
        }
        */
       
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var currentPos = data.handRight;
        
        handCursor.css({
            'left' : (currentPos.x - capturePos.x) / 0.2 * windowWidth  + windowWidth / 2,
            'top' : -(currentPos.y - capturePos.y) / 0.2 * windowHeight + windowHeight / 2,
        });
        
        updateHand(data.handRight);
    }
    
    var isReleased = true;
    var isPressed = false;
    
    function updateHand(handRight) {
        //dispatchMouseEvent('mousemove');
        //dispatchMouseEvent('mouseover');
            
        if (handRight.isTracked) {
            if (isReleased && ! handRight.isOpened) {
                dispatchMouseEvent('mousedown');
                isPressed = true;
                isReleased = false;
            } 
            else if (isPressed && handRight.isOpened) {
                dispatchMouseEvent('mouseup'); 
                isPressed = false;
                isReleased = true;
            }
        }
        
        var img = 'url(res/drawable/img_hand.png)';
        if (isPressed) {
            img = 'url(res/drawable/img_hand_close.png)';
        }
        
        handCursor.css('background-image', img);
    }
    
    function dispatchMouseEvent(type) { 
        console.log(type)
        var cursorX = parseInt(handCursor[0].style.left, 10) || 0;
        var cursorY = parseInt(handCursor[0].style.top, 10) || 0;
        
        var event = document.createEvent('Event');
        event.initEvent(type, true, true);
        event.pageX = cursorX;
        event.pageY = cursorY;
        
        var eventTarget = document.elementFromPoint(cursorX, cursorY);
        if (eventTarget) {
            eventTarget.dispatchEvent(event);
        }
    }
    
    function update(data) {
        updateAngle(data);
        updatePos(data); 
        
        updateHand(data.handRight);
    }
    
    function start() {
        handCursor.appendTo('body');
                            
        kinectBridge.addEventListener('skeleton', update);
    }
    
    return {
        start : start
    }
})
