(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.speechUtterance = factory();
    }
}(this, function () {
    
    var KOREAN_VOICE = 'Google 한국의';
    var ENGLISH_VOICE = 'Google US English';
    var JAPANESE_VOICE = 'Google 日本語'; 
    var CHINESE_VOICE = 'Google 普通话（中国大陆）';
    
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
            if (String(speechVoices[n].name).toLowerCase() == name.toLowerCase()) {
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
            speechUtter.voice =  getVoice(KOREAN_VOICE);
        }
        
        speechSynthesis.speak(speechUtter);
    }

    return window.speechUtterance = {
        
        KOREAN_VOICE : KOREAN_VOICE,
        ENGLISH_VOICE : ENGLISH_VOICE,
        JAPANESE_VOICE : JAPANESE_VOICE,
        CHINESE_VOICE : CHINESE_VOICE, 
        
        isSpeaking : isSpeaking,
        
        getVoice : getVoice,
        
        speak : speak,
        
        cancel : cancel,
    }
}));