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

        speechRecog.onstart = function () {
            console.log('speechRecocg onstart');
        }

        speechRecog.onend = function () {
            console.log('speechRecocg onend');
            
            speechRecog.start();
        }

        speechRecog.onresult = function (event) {
            console.log('speechRecocg onresult');
            
            var results = event.results;
            
            for (var n = event.resultIndex; n < results.length; ++n) {
                
                var isFinal = results[n].isFinal;
                var transcript = results[n][0].transcript;

                console.log(isFinal, transcript);
                if (isFinal) {
                    transcript = '인식결과<br/>' + transcript;
                }
                
                $('#speechRecog').html(transcript);
            }
        }
        
        speechRecog.start();
    }
    
    return {
        
        init : init
    }
})
