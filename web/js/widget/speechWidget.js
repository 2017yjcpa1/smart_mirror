define([
    'jquery',
    'input/speechRecog',
], function ($, speechRecog) {
    
    function update() {
        
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_speech.html',
        
        init : function () {
            speechRecog.addEventListener('[a-zA-Z가-힣0-9\s]+', update);
        }
    }
});