define([
    'jquery',
    
    'activity/tutorialActivity/clickLearn'
], function ($, clickLearn) {
    
    var successCount = 0;
    
    function init() {
        successCount = 0;

        var layoutLoaded = function () {
            $('#tutorialActivity .scrollWrapper')
                .on('dragend', function () { success() })
                .draggable({ 'axis' : 'x' });
        }

        var learnWrapper = $('#tutorialActivity .learnWrapper');
        learnWrapper.load('asset/layout/activity_tutorial/drag_learn.html', layoutLoaded);
    }

    function success() {
        successCount++;

        if (successCount < 2) {
            return;
        }

        complete();
    }

    function complete() {
        clickLearn.init();
    }
    
    return {
        init : init
    }
})