define(['jquery'], function ($) {

    var recog = new webkitSpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true; // 음성인식 과정을 onresult 에 발생
    
    recog.onresult = function (event) {
        var res = event.results;
        
        var str = '';
        for (var n = event.resultIndex; n < res.length; ++n) {
            if (res[n].isFinal)
                str += res[n][0].transcript;
        }
            
        $('#homeActivity').html(str);
    };

    return {
        
        init : function() {
            recog.start();
        }
    }
})
