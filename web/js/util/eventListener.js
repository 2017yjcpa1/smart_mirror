define(function () {
    
    function EventListener() {
        this.listeners = [];
    }
    
    EventListener.prototype = {
    
        addEventListener : function (type, method) {
            var handlers = null;
            if ( ! (handlers = this.listeners[type])) {
                handlers = this.listeners[type] = [];
            }

            handlers.push(method);
        },
        
        dispatchEvent : function (type, data) {
            var handlers = null;
            if ( ! (handlers = this.listeners[type])) {
                return;
            }

            if (typeof(data) === 'string') {
                data = JSON.parse(data);
            }

            for (var loop = 0; loop < handlers.length; ++loop) {
                handlers[loop](data);
            }
        }
    };
    
    return EventListener;
})