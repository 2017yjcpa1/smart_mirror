define([
    'system',
    
    'jquery'
], function (system, $) {
    
    var successCount = 0;
    
    function init() {
        successCount = 0;

        var layoutLoaded = function () {
            $('#tutorialActivity .learnStage div')
                .click(function () { success(this) })
        }

        var learnWrapper = $('#tutorialActivity .learnWrapper');
        learnWrapper.load('asset/layout/activity_tutorial/click_learn.html', layoutLoaded);
    }

    function success(targetObject) {
        targetObject = $(targetObject);

        if (targetObject.css('visibility') === 'hidden') {
            return;
        }

        targetObject.css('visibility', 'hidden');

        if (++successCount < 3) {
            return;
        }

        complete();
    }
 
    function complete() {
        system.finishActivity('tutorialActivity');
    }
    
    return {
        init : init
    }
})