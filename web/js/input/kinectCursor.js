define([
    'jquery',
    
    'input/kinectBridge',
    
    'math/vec2d',
    'math/vec3d',
    'math/mat2d',
], function ($, kinectBridge, vec2d, vec3d, mat2d) {
    
    var oldTarget = null;
    
    var isOpened = true;
    var isClosed = false;
    
    var isActive = false;
    var capturePos = false;
    
    var isMoved = false;
    var oldX = 0;
    var oldY = 0;
    
    var pausedTime = -1;
    
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
                            
    var progressCanvas = $(document.createElement('canvas'))
                            .appendTo(handCursor)
                            .attr('width', 120)
                            .attr('height', 120)
                            .css({
                                'position': 'absolute',
                                'top': '-50%',
                                'left': '-50%',
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
        if (newTarget === progressCanvas[0]) {
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
    
    function drawProgress(progress) {
        var context = progressCanvas[0].getContext('2d');
        
        var canvasWidth = parseInt(progressCanvas.attr('width'), 10);
        var canvasHeight = parseInt(progressCanvas.attr('height'), 10);

        var arcSize = canvasWidth / 2;
        var lineWidth = 10;
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        
        if (progress <= 0) {
            return;
        }
        
        context.save();
        
        context.translate(arcSize, arcSize);
        
        context.beginPath();
        context.arc(0,
                    0,
                    arcSize - lineWidth,
                    -(Math.PI / 2),
                    ((Math.PI * 2) * (progress / 100)) - Math.PI / 2, 
                    false);

        context.strokeStyle = '#FFFFFF';
        context.lineWidth = lineWidth;

        context.stroke();
        
        context.restore();
    }
    
    function updatePos(data) {
        if (capturePos === null) {
            capturePos = data.handRight;
        }
        
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var currentPos = data.handRight;
        
        var newX = (currentPos.x - capturePos.x) / 0.2 * windowWidth + windowWidth / 2;
        var newY = -(currentPos.y - capturePos.y) / 0.2 * windowHeight + windowHeight / 2;
        
        isMoved = vec2d(oldX, oldY).distance(newX, newY) >= 15; 
        
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
    
    function updateImage(data) {
        var vec = vec3d(data.handRight).sub(data.wristRight);
        var rad = Math.atan2(-vec.y, vec.x);
        var deg = Math.toDegrees(rad);
        
        var style = {};
        style['background-image'] = 'url(res/drawable/img_hand.png)';
        
        if (isClosed) {
            style['background-image'] = 'url(res/drawable/img_hand_close.png)';
        }
        
        if (60 <= deg && deg <= 120) {
            style['transform'] = mat2d.rotation(rad).toCSSTransform();
        }
        
        handCursor.css(style);
    }

    function updateState(data) {
        if (isOpened && ! data.handRight.isOpened) { // 손바닥을 편상태에서 주먹을 쥐게 된경우
            dispatchEvent('mousedown'); // 왼쪽마우스를 누른효과 발생

            isClosed = true;
            isOpened = false; 
        }
        
        if (isClosed && data.handRight.isOpened) { // 주먹상태에서 손을 폈을경우
            dispatchEvent('mouseup'); // 왼쪽마우스이 클릭이된 상태에서 뗀 효과 발생

            isClosed = false;
            isOpened = true;
        }
        
        if (isMoved) { // 손바닥을 움직인경우
            pausedTime = -1;
            drawProgress(0);
            
            dispatchEvent('mousemove');

            // TODO mouseout
            // TODO newTarget 과 oldTarget 이 서로 다를때 mouseover dispatch
            dispatchEvent('mouseover');            
        } // 손바닥 위치가 고정된 상황에서 주먹상태로 되면
        else if (isClosed) {
            
            // 시간을 기록하고
            if (pausedTime === -1) {
                pausedTime = new Date().getTime();
            }
            
            // 머문시간이 0.7초 이상 유지되면
            var elapsedTime = new Date().getTime() - pausedTime;
            if ( ! (elapsedTime > 700)) { 
                return;
            }

            // 0.6 초동안 progress 상태를 보여주고
            var progressPercent = (elapsedTime - 700) / 600 * 100; 
            
            drawProgress(progressPercent);
            
            // 100% 가 되면 클릭이벤트 호출
            if (progressPercent >= 100) {
                dispatchEvent('click');
            }
        }
    }
    
    function update(data) {
        updateImage(data);
        
        if (data.handRight.y < data.hipRight.y) {
            deactivate();
            return false;
        }

        if ( ! isActive) {
            window.setTimeout(activate, 1000 * 0.7);
            return false;
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
