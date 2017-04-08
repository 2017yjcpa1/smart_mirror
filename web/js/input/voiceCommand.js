define([
    'jquery',
], function ($) {
    
    var recog;
    
    var isStart;
    
    //https://ctrlq.org/code/19680-html5-web-speech-api
  
    function init() {
        recog = new webkitSpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
    }
    
    return {
        init : init
    }
})
