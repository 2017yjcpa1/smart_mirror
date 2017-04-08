define([
    'util/eventListener',
], function (EventListener) {
    var eventListener = new EventListener();

    if ( ! window.WebSocket) {
        window.alert('WebSocket 을 지원하지않는 브라우저입니다.');
        return;
    }

    var socket = new WebSocket("ws://127.0.0.1:9003/");

    socket.onmessage = function (event) {
        eventListener.dispatchEvent('skeleton', event.data);
    }
    
    return {
        
        addEventListener : function (type, method) {
            eventListener.addEventListener(type, method);
        }
    }
})
