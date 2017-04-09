define([
    'jquery',
    'util/eventListener'
], function ($, EventListener) {
    
    var eventListener = new EventListener();
    
    eventListener.dispatchEvent = function (transcript) {
        
        var listeners = this.listeners;
        
        for (var regex in listeners) {
            if ( ! regex.test(transcript)) {
                continue;
            }
            
            var handlers = listeners[regex];
 
            for (var n = 0; n < handlers.length; ++n) {
                handlers[n](transcript);
            }
        }
    }
    
    var speechRecog = new webkitSpeechRecognition();
    speechRecog.continuous = true;
    speechRecog.interimResults = true; // 음성인식 과정을 onresult 에 발생
    
    speechRecog.onresult = function (event) {
        for (var n = event.resultIndex; n < event.results.length; ++n) {
            var res = {};
            res.isFinal = event.results[n].isFinal;
            res.transcript = event.results[n][0].transcript;
            
            eventListener.dispatchEvent(res.transcript);
        }
    };
    
    return {
        
        addEventListener : function (type, method) {
            eventListener.addEventListener(type, method);
        },
        
        init : function() {
            
            this.addEventListener(/[가-힣]/g, function () {
                console.log(arguments)
            })
            
            speechRecog.start();
        }
    }
})
