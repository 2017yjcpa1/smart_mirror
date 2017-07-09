(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.speechUtterance = factory();
    }
}(this, function () {
    
    var VOICE_KOREAN = 'Google 한국';
    var VOICE_ENGLISH = 'Google US English';
    var VOICE_JAPANESE = 'Google 日本語'; 
    var VOICE_CHINESE = 'Google 普通话';
    
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
    
    function getVoice(name) {
        var speechVoices = window.speechSynthesis.getVoices();
        
        for(var n = 0; n < speechVoices.length; ++n) {
            
            var str1 = String(speechVoices[n].name).toLowerCase();
            var str2 = name.toLowerCase();
            
            if (str1.indexOf(str2) > 0) {
                return speechVoices[n];
            }
        }
        
        return null;
    }
    
    function speak(text, voiceName) {
        if (isSpeaking()) {
            cancel();
            
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }

            timeoutId = window.setTimeout(
                            function () { 
                                speak(text, voiceName); 
                            }, 
                            500
                        );
            return;
        }
        
        speechUtter = new SpeechSynthesisUtterance();

        speechUtter.text = text;
        
        speechUtter.volume = 1;
        speechUtter.rate = 1;
        speechUtter.pitch = 1; 
        
        if (voiceName) {
            speechUtter.voice =  getVoice(voiceName);
        } else {
            speechUtter.voice =  getVoice(VOICE_KOREAN);
        }
        
        speechSynthesis.speak(speechUtter);
    }

    return window.speechUtterance = {
        
        KOREAN_VOICE : VOICE_KOREAN,
        ENGLISH_VOICE : VOICE_ENGLISH,
        JAPANESE_VOICE : VOICE_JAPANESE,
        CHINESE_VOICE : VOICE_CHINESE, 
        
        isSpeaking : isSpeaking,
        
        getVoice : getVoice,
        
        speak : speak,
        
        cancel : cancel,
    }
}));