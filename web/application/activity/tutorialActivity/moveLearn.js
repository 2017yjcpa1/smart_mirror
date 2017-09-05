define([
    'jquery',
    
    'activity/tutorialActivity/dragLearn'
], function ($, dragLearn) {
    
    var successCount = 0;
    
    function init() {
        successCount = 0;

        var learnWrapper = $('#tutorialActivity .learnWrapper');

        $(learnWrapper)
            .on(
                'mouseover mousemove', 
                '.targetObject', 
                function () {
                    success();
                }
            );

        var layoutLoaded = function () {
            reset();
        }

        learnWrapper.load('asset/layout/activity_tutorial/move_learn.html?bust=' + (new Date()).getTime(), layoutLoaded);
    }

    function success() {
        successCount++;

        if (successCount < 3) {
            reset();
            return;
        }

        complete();
    }

    function reset() {
        var targetObjects = $('#tutorialActivity .learnStage div');
        var targetRandom = parseInt(Math.random() * targetObjects.length, 10);

        targetObjects
            .removeClass('targetObject')
            .eq(targetRandom)
            .addClass('targetObject');
    }

    function complete() {
        dragLearn.init();
    }
    
    return {
        init : init
    }
})