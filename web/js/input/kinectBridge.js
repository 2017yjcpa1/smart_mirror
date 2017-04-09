define(function () {
    
    var listeners = [];
    var kinectServer = new WebSocket("ws://127.0.0.1:9003/");

    kinectServer.onmessage = function (event) {
        dispatchEvent('skeleton', event.data);
    } 
        
    function dispatchEvent(type, data) {
        type = type.toLowerCase();

        var handlers = null;
        if ( ! (handlers = listeners[type])) {
            return;
        }

        if (typeof(data) === 'string') {
            data = JSON.parse(data);
        }

        for (var n = 0; n < handlers.length; ++n) {
            handlers[n](data);
        }
    }
    
    return {
        
        addEventListener : function (type, method) {
            type = type.toLowerCase();

            var handlers = null;
            if ( ! (handlers = listeners[type])) {
                handlers = listeners[type] = [];
            }

            handlers.push(method);
        }
    }
})
