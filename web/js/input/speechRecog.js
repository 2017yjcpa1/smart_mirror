define(function () {
    
    var SpeechRecognition = window.SpeechRecognition ||
                            window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition;
    
    var speechRecog = new SpeechRecognition();
    speechRecog.continuous = true;
    speechRecog.interimResults = true; // 음성인식 중간과정을 onresult 에 발생
    
    speechRecog.onresult = function (event) {
        var results = event.results;
        
        for (var n = event.resultIndex; n < results.length; ++n) {
            var isFinal = results[n].isFinal;
            var transcript = results[n][0].transcript;
            
        }
    };
    
    return {
        
        init : function() {
            speechRecog.start();
        }
    }
})
