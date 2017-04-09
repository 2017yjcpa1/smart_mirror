define([
    'jquery',
    'util/eventListener'
], function ($, EventListener) {
    var eventListener = new EventListener();

    var speechRecog = new webkitSpeechRecognition();
    speechRecog.continuous = true;
    speechRecog.interimResults = true; // 음성인식 과정을 onresult 에 발생
    
    speechRecog.onresult = function (event) {
        
        for (var n = event.resultIndex; n < event.results.length; ++n) {
            
            var res = {};
            res.isFinal = event.results[n].isFinal;
            res.transcript = event.results[n][0].transcript;
            eventListener.dispatchEvent('result', res);
        }
    };

    return {
        
        addEventListener : function (type, method) {
            eventListener.addEventListener(type, method);
        },
        
        init : function() {
            speechRecog.start();
        }
    }
})
