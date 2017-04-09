define(function () {
    
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition;
    
    var speechRecog = null;
    
    function start() {
        if ( ! speechRecog) {
            init();
        }
        
        speechRecog.start();
    }
    
    function result(isFinal, transcript) {
        console.log(isFinal, transcript);
        
        $('#speechRecog').html(transcript);
    }
    
    function init() { 
        if (speechRecog && speechRecog.abort) {
            speechRecog.abort();
        }

        speechRecog = new SpeechRecognition();
        speechRecog.continuous = true;
        speechRecog.interimResults = true; // 음성인식 중간과정을 onresult 에 발생

        speechRecog.onend = start;
        speechRecog.onresult = function (event) {
            var results = event.results;
            
            for (var n = event.resultIndex; n < results.length; ++n) {
                var isFinal = results[n].isFinal;
                var transcript = results[n][0].transcript;
                
                result(isFinal, transcript);
            }
        }
        
        start();
    }
    
    return {
        
        init : init
    }
})
