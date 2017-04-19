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
                            
    var handProgress = $(document.createElement('canvas'))
                            .appendTo(handCursor)
                            .attr('width', 120)
                            .attr('height', 120)
                            .css({
                                'position': 'absolute',
                                'top': '-50%',
                                'left': '-50%',
                            });
                
    function setProgress(percent) {
        var context = handProgress[0].getContext('2d');

        var arcSize = handProgress.width() / 2;
        var lineWidth = 10;
        
        context.clearRect(0, 0, handProgress.width(), handProgress.height());
        
        context.save();
        context.translate(arcSize, arcSize);
        
        context.beginPath();
        context.arc(0,
                0,
                arcSize - lineWidth,
                -(Math.PI / 2),
                ((Math.PI * 2) * (percent / 100)) - Math.PI / 2, 
                false);

        context.strokeStyle = '#FFFFFF';
        context.lineWidth = lineWidth;

        context.stroke();
        context.restore();
    }
                            
    function activate() {
        isActive = true;
        
        handCursor.css('opacity', 1);
    }

    function deactivate() {
        isActive = false;
        capturePos = null;
        
        handCursor.css('opacity', 0);
    }
    
    var stopTime = -1;
    var ready = false;
    
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
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var currentPos = data.handRight;
        
        var newX = (currentPos.x - capturePos.x) / 0.3 * windowWidth + windowWidth / 2;
        var newY = -(currentPos.y - capturePos.y) / 0.3 * windowHeight + windowHeight / 2;
        
        var s = 15;
        if (isPressed) {
            s = ready ? 100 : 50;
        }
        
        isMoved = vec2d(oldX, oldY).distance(newX, newY) >= s; 
        
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
    
    function extendedArm(data) {
        var dist1 = vec3d(data.handRight).distance(data.elbowRight);
        var dist2 = vec3d(data.elbowRight).distance(data.shoulderRight);
        
        var dist3 = vec3d(data.handRight).distance(data.shoulderRight);
        
        return dist3 / (dist2 + dist1) * 100;
    }
    
    function updateState(data) {
        var handRight = data.handRight;

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
        
        if (isMoved) {
            stopTime = -1;
            setProgress(0)
            
            dispatchEvent('mousemove');

            // TODO newTarget 과 oldTarget 이 서로 다를때 mouseover dispatch
            dispatchEvent('mouseover');
        }
        else if (isPressed && stopTime == -1) {
            stopTime = new Date().getTime();
        }
        else {
            ready = false;
        }
        
        var handImg = 'img_hand.png';
        if (isPressed) {
            handImg = 'img_hand_close.png';
            
            
            if ( ! isMoved) {
                var currentTime = new Date().getTime();

                if (currentTime - stopTime > 600) {
                    ready = true;
                    
                    var p = (currentTime - stopTime - 600) / 500 * 100;
                    
                    setProgress(p);
                    
                    if (p >= 100) {
                        dispatchEvent('click');
                    }
                }
            }
        }
        
        handCursor.css('background-image', 'url(res/drawable/' + handImg + ')');
    }
    
    function createEvent(target, type, pageX, pageY) {
        var event = target.ownerDocument.createEvent('MouseEvents');
        event.initMouseEvent(
            type,                               // type
            true,                               // canBubble
            true,                               // cancelable
            target.ownerDocument.defaultView,   // view
            1,                                  // detail
            pageX,                              // screenX
            pageY,                              // screenY
            pageX,                              // clientX
            pageY,                              // clientY
            false,                              // ctrlKey
            false,                              // altKey
            false,                              // shiftKey
            false,                              // metaKey
            0,                                  // button
            null);                              // relatedTarget
            
        return event;
    }
    
    function dispatchEvent(type) {
        var pageX = parseInt(handCursor[0].style.left, 10) || 0;
        var pageY = parseInt(handCursor[0].style.top, 10) || 0;
        
        var newTargets = document.elementsFromPoint(pageX, pageY);
        
        var newTarget = newTargets[0];
        if (newTarget === handProgress[0]) {
            newTarget = newTargets[1];
        }
        
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
