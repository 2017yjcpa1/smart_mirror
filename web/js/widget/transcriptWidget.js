define([
    'jquery',
    'input/speechRecog',
], function ($, speechRecog) {
    
    var timeoutId = -1;
    
    function init() {
        if (timeoutId > -1) {
            window.clearTimeout(timeoutId);
        }
        
        var rootLayout = $('#transcriptWidget');
        
        rootLayout.removeClass('recognized');
        $('span', rootLayout).text('대기중...');
    }
    
    function update(isFinal, transcript) {
        var rootLayout = $('#transcriptWidget');
        
        if (isFinal) {
            rootLayout.addClass('recognized');
            
            timeoutId = window.setTimeout(init, 1000 * 3);
        }
        
        $('span', rootLayout).text(transcript);
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_transcript.html',
        
        init : function () {
            init();
        },
        
        update : update
    }
});