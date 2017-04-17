define(function () {
    
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition;
    
    var listeners = [];
    var speechRecog = null; 
    
    function init() {
        if (speechRecog && speechRecog.abort) {
            speechRecog.abort();
        }

        speechRecog = new SpeechRecognition();
        speechRecog.lang = 'ko-KR';
        speechRecog.continuous = true;
        speechRecog.interimResults = true; // 음성인식 중간과정을 onresult 에 발생

        speechRecog.onend = start;
        speechRecog.onresult = function (event) {
            var isFinal = false;
            var transcript = '';

            var results = event.results[event.resultIndex];
            for (var n = 0; n < results.length; ++n) {
                isFinal = results.isFinal;
                transcript += results[0].transcript;
            }
            
            console.log(isFinal, transcript)
            dispatchEvent(isFinal, transcript);
        };
    }
    
    function start() {
        if ( ! speechRecog) {
            init();
        }
        
        speechRecog.start();
    }
    
    function addEventListener(regex, method) {
        var handlers = null;
        if ( ! (handlers = listeners[regex])) {
            handlers = listeners[regex] = [];
        }
        
        handlers.push(method);
    }

    function dispatchEvent(isFinal, transcript) {
        var handlers = [];

        for(var regex in listeners) {
            if ( ! new RegExp(regex, 'i').test(transcript)) {
                continue;
            }
            handlers = handlers.concat(listeners[regex]);
        }

        for(var n = 0; n < handlers.length; ++n) {
            handlers[n](isFinal, transcript);
        }
    }
    
    return {
        
        addEventListener : addEventListener,
        
        start : start
    }
})
