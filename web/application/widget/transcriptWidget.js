define([
    'jquery',
    
    'input/speechRecog'
], function ($, speechRecog) {
    
    var scheduleId = -1;
    
    function init() {
        if (scheduleId > -1) {
            window.clearTimeout(scheduleId);
        }
        
        var rootLayout = $('#transcriptWidget');
        
        rootLayout.removeClass('recognized');
        $('span', rootLayout).text('대기중...');
    }
    
    function update(isFinal, transcript) {
        console.log('transcriptWidget', isFinal, transcript);
        var rootLayout = $('#transcriptWidget');
        
        if (isFinal) {
            rootLayout.addClass('recognized');
            
            scheduleId = window.setTimeout(init, 1000 * 3);
        }
        
        $('span', rootLayout).text(transcript);
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_transcript.html',
        
        init : function () {
            init();
            
            speechRecog.addEventListener('.+', update);
        }
    }
});