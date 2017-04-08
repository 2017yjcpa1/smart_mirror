define([
    'jquery',
], function ($) {

    var recog;

    function init() {
        recog = new webkitSpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        
        recog.onresult = function (event) {
            var str = '';
            for (var n = event.resultIndex; n < event.results.length; ++n) {
                if (event.results[n].isFinal)
                    str += event.results[n][0].transcript;
            }
            
            $('#homeActivity').html(str);
        };

        recog.start();
    }


    return {
        init: init
    }
})
