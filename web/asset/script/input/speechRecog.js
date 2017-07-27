(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.speechRecog = factory();
    }
}(this, function () {
    
    var COMMAND_START = '(미러야|밀어야)';
    var REGEXP_START =  COMMAND_START + '(?!.*' + COMMAND_START + ')(.*)';
    
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition;
    
    var listeners = [];
    var speechRecog = null; 
     
    function init() {
        console.log('init()');
        
        if (speechRecog && speechRecog.stop) {
            speechRecog.stop();
        }

        speechRecog = new SpeechRecognition();
        speechRecog.lang = 'ko-KR';
        speechRecog.continuous = true;
        speechRecog.interimResults = true;
        speechRecog.maxAlternatives = 5;

        speechRecog.onerror = function (event) {
            console.log('speechRecog.onerror() = ' + event.error);
        };
        
        speechRecog.onstart = function () { 
            console.log('speechRecog.onstart()');
        };
        
        speechRecog.onend = function () {
            console.log('speechRecog.onend()');
            
            start();
        };
        
        speechRecog.onsoundstart = function () { 
            console.log('speechRecog.onsoundstart()'); 
        };
        
        speechRecog.onresult = function (event) {
            console.log('speechRecog.onresult()');
            
            var results = event.results[event.resultIndex];
            var isFinal = results.isFinal;
            var transcripts = [];
                
            for (var n = 0; n < results.length; ++n) {
                transcripts[n] = results[n].transcript.trim();
            }
            
            for (var n = 0; n < transcripts.length; ++n) { // maxAlternatives 수 만큼 인식한 문장들
                console.log(isFinal, transcripts[n]); 
                    
                var matches = new RegExp(REGEXP_START, 'i').exec(transcripts[n].replace(/\s+/g, ""));
                if ( ! (matches && matches[1])) {
                    continue;
                }
                
                var speechCommand = matches[1].replace(/\s+/g, "");
                
                if (speechCommand) {
                    dispatchEvent(isFinal, speechCommand);
                }
            }
        };
    }
    
    function start() {
        console.log('start()');
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
}))