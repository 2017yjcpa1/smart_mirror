define(function () {
    
    var __event__ = {
      
        listeners : [],
        
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
    
    function F() {};
    F.prototype = __event__;

    return F;
})