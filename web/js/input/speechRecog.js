define(function () {
    
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition;
    
    var speechRecog = null;
    
    function init() {
        if (speechRecog && speechRecog.abort) {
            speechRecog.abort();
        }

        speechRecog = new SpeechRecognition();
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
            
            if (isFinal) {
                finalResult(transcript);
            } else {
                interimResult(transcript);
            }
        };
    }
    
    function start() {
        if ( ! speechRecog) {
            init();
        }
        speechRecog.start();
    }
    
    function interimResult(transcript) {
        console.log('interimResult', transcript);
    }
    
    function finalResult(transcript) {
        console.log('finalResult', transcript);
    }
    
    return {
        start : start
    }
})
