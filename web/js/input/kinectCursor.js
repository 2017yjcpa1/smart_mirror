define([
    'jquery',
    
    'input/kinectBridge',
    
    'math/vec2d',
    'math/vec3d',
    'math/mat2d',
], function ($, kinectBridge, vec2d, vec3d, mat2d) {
    
    var oldTarget = null;
    
    var isReleased = true;
    var isPressed = false;
    
    var isActive = false;
    var capturePos = false;
    
    var isMoved = false;
    var oldX = 0;
    var oldY = 0;
    
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
    
    /**
     * dblclick > 키넥트로 더블클릭은 구현하면 불편함
     * click (V)
     * 
     * mousedown (V)
     * mouseup (V)
     * 
     * mousemove (V)?
     * 
     * mouseenter
     * mouseleave
     * 
     * mouseover
     * mouseout
     */
    function updatePos(data) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var currentPos = data.handRight;
        
        var newX = (currentPos.x - capturePos.x) / 0.2 * windowWidth  + windowWidth / 2;
        var newY = -(currentPos.y - capturePos.y) / 0.2 * windowHeight + windowHeight / 2;
        
        isMoved = vec2d(oldX, oldY).distance(newX, newY) >= 10; // 10px 이상 움직임이 있어야 isMoved = true;
        
        if ( ! isMoved) {
            return;
        }
        
        handCursor.css({
            'left' : newX,
            'top' : newY,
        });
        
        oldX = newX;
        oldY = newY;
    }
    
    function updateState(data) {
        var handRight = data.handRight;
        
        if (isMoved) {
            dispatchEvent('mousemove');
            
            dispatchEvent('mouseover');
        }
        
        // 오른손이 키넥트에서 인식했을경우
        if (handRight.isTracked) {
            
            if (isReleased && ! handRight.isOpened) {
                dispatchEvent('mousedown');
                
                isPressed = true;
                isReleased = false;
            }
            else if (isPressed && handRight.isOpened) {
                dispatchEvent('mouseup');
                
                isPressed = false;
                isReleased = true;
            }
        }
        
        var handImg = 'img_hand.png';
        if (isPressed) {
            handImg = 'img_hand_close.png';
        }
        
        handCursor.css('background-image', 'url(res/drawable/' + handImg + ')');
    }
    
    function createEvent(target, type, pageX, pageY) {
        var event = target.ownerDocument.createEvent('MouseEvents');
        event.initMouseEvent(
            type, 
            true,
            true,
            target.ownerDocument.defaultView,
            1,
            pageX,
            pageY,
            pageX,
            pageY, 
            false,
            false,
            false,
            false,
            0,
            null);
            
        return event;
    }
    
    function dispatchEvent(type) {
        var pageX = parseInt(handCursor[0].style.left, 10) || 0;
        var pageY = parseInt(handCursor[0].style.top, 10) || 0;
        
        var newTarget = document.elementFromPoint(pageX, pageY);
        if ( ! newTarget) {
            newTarget = oldTarget;
        }
        
        if ( ! newTarget) {
            return;
        }
        
        var event = createEvent(newTarget, type, pageX, pageY);
        newTarget.dispatchEvent(event);
        
        oldTarget = newTarget;
    }
    
    function update(data) {
        updateAngle(data);
        
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
        
        updatePos(data);
        updateState(data);
    }
    
    function start() {
        handCursor.appendTo('body');
                            
        kinectBridge.addEventListener('skeleton', update);
    }
    
    return {
        start : start
    }
})
