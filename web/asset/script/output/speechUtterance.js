(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.speechUtterance = factory();
    }
}(this, function () {
    
    var DEFAULT_VOLUME = 1;
    var DEFAULT_RATE = 1.2;
    var DEFAULT_PITCH = 3;
    
    var SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

    var speechSynthesis = window.speechSynthesis; 
    var speechUtter = null;
    
    var timeoutId = null;
    
    function isSpeaking() {
        return speechSynthesis && speechSynthesis.speaking;
    }
    
    function cancel() {
        speechSynthesis.cancel();
    }
    
    function speak(text, volume, rate, pitch, voice) {
        if (isSpeaking()) {
            cancel();
            
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }

            timeoutId = window.setTimeout(
                            function () { 
                                speak(text); 
                            }, 
                            500
                        );
            return;
        }
        
        speechUtter = new SpeechSynthesisUtterance();

        speechUtter.text = text;
        
        speechUtter.volume = volume || DEFAULT_VOLUME;
        speechUtter.rate = rate || DEFAULT_RATE;
        speechUtter.pitch = pitch || DEFAULT_PITCH; 
        
        speechUtter.voice = voice || getKoreanVoice();
        
        speechSynthesis.speak(speechUtter);
    }

    function getKoreanVoice() {
        var voices = window.speechSynthesis.getVoices();
        
        for(var n = 0; n < voices.length; ++n) {
            if (String(voices[n].name).indexOf('Korean') >= 0) {
                return voices[n];
            }
        }
        
        return null;
    }
    
    return {
        
        isSpeaking : isSpeaking,
        
        speak : speak,
        
        cancel : cancel,
    }
}));