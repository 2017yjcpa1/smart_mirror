(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.speechRecog = factory();
    }
}(this, function () {
    
    var COMMAND_START = '거울아';
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
        
        /**
         *  연속된 음성인식 결과를 받고싶으면 true 로 설정해야합니다.
         *  하지만 스마트미러의 input 기능인 음성명령어로 활용하려면 
         *  짧은 문장을 받아야하므로 false 로 셋팅합니다.
         */
        speechRecog.continuous = false;
        
        /**
         * 음성인식이 진행되고 있는 중간결과값도 받아옵니다.
         * 순전히 디버그용도로 활용되며 중간결과값으로 
         * 무언가를 활용하진 않습니다.
         */
        speechRecog.interimResults = true;
        
        /**
         * 음성인식은 오차가 발생할 수 있습니다.
         * 사람 vs 사람에서도 잘못 오가는 대화가 오고갈수 있습니다.
         * 이를 방지하기위해 올바른 명령어로 말했음에도 인식을 잘못할수도 있어
         * 추천수를 지정하여 인식범위를 높여줍니다.
         */
        speechRecog.maxAlternatives = 3;

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
                
            // 음성인식 결과를 배열에 담음
            for (var n = 0; n < results.length; ++n) {
                transcripts[n] = results[n].transcript.trim();
            }
            
            for (var n = 0; n < transcripts.length; ++n) { // maxAlternatives 수 만큼 인식한 문장들 
                
                var matches = new RegExp(REGEXP_START, 'i').exec(transcripts[n].replace(/\s+/g, ""));
                if ( ! (matches && matches[1])) {
                    continue;
                }
                
                var speechCommand = matches[1].replace(/\s+/g, "");
                if ( ! speechCommand) {
                    continue;
                }
                
                if (dispatchEvent(isFinal, speechCommand)) {
                    return;
                }
            }
        };
    }
    
    function dispatchEvent(isFinal, transcript) {
        var handlers = [];
        
        for(var regex in listeners) {
            
            var matches = new RegExp(regex, 'i').exec(transcript.replace(/\s/g, ''));
            if (matches === null) {
                continue;
            }
            
            var handlers = listeners[regex];
            for (var n = 0; n < handlers.length; ++n) {
                if (handlers[n](isFinal, transcript, matches)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    function start() {
        console.log('start()');
        if ( ! speechRecog) {
            init();
        }
        
        speechRecog.start();
    }
    
    function addEventListener(regex, listener) {
        var handlers = null;
        if ( ! (handlers = listeners[regex])) {
            handlers = listeners[regex] = [];
        }
        
        handlers.push(listener);
    }

    return {
        
        addEventListener : addEventListener,
        
        start : start
    }
}))