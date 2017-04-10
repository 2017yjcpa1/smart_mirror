define([
    'jquery',
    'input/speechRecog',
], function ($, speechRecog) {
    
    function init() {
        var rootLayout = $('#transcriptWidget');
        
        rootLayout.removeClass('recognized');
        $('span', rootLayout).text('대기중...');
    }
    
    function update(isFinal, transcript) {
        var rootLayout = $('#transcriptWidget');
        
        if (isFinal) {
            rootLayout.addClass('recognized');
            
            window.setTimeout(init, 1000);
        }
        
        $('span', rootLayout).text(transcript);
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_transcript.html',
        
        init : function () {
            init();
            
            speechRecog.addEventListener('[a-zA-Z가-힣0-9\s]+', update);
        }
    }
});