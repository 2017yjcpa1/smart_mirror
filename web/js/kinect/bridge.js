define(function () {
    
    var listeners = [];
    
    function dispatchEvent(type, data) {
        type = type.toLowerCase();
        
        var handlers = null;
        if ( ! (handlers = listeners[type])){
            return;
        }
        
        if (typeof(data) === 'string') {
            data = JSON.parse(data);
        }
        
        for (var loop = 0; loop < handlers.length; ++loop) {
            handlers[loop](data);
        }
    }
    
    function addEventListener(type, method) {
        type = type.toLowerCase();
        
        var handlers = null;
        if ( ! (handlers = listeners[type])){
            handlers = listeners[type] = [];
        }

        handlers.push(method);
    } 
    
    if ( ! window.WebSocket) {
        window.alert('WebSocket 을 지원하지않는 브라우저입니다.');
        return;
    }

    var socket = new WebSocket("ws://127.0.0.1:9003/");
    socket.onerror = function () {
        window.alert('오류가 발생하였습니다.');
    }

    socket.onmessage = function (event) {
        dispatchEvent('skeleton', event.data);
    }
    
    return {
        addEventListener : addEventListener
    }
})
