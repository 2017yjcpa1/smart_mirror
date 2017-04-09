define(function () {
    
    function EventListener() {
        this.listeners = [];
    }
    
    EventListener.prototype = {
    
        addEventListener : function (type, method) {
            type = type.toLowerCase();

            var handlers = null;
            if ( ! (handlers = this.listeners[type])) {
                handlers = this.listeners[type] = [];
            }

            handlers.push(method);
        },
        
        dispatchEvent : function (type, data) {
            type = type.toLowerCase();

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