define([ 'system' ],function (system) {
    
    function reset() {
        var box = $('#moveLearn > *:nth-child(3) > div');

        var random = parseInt(Math.random() * box.length, 10);
        
        box.removeClass('target')
           .eq(random)
           .addClass('target');
    }
    
    return {
        
        id : 'tutorialActivity',
        title : '튜토리얼',
        icon : 'ic_tutorial.png',
        layoutHTML : 'activity_tutorial.html',
        
        init : function () {
            console.log('tutorial init');
            
            $(document).on('mouseover mousemove', '#moveLearn .target', function () {
                reset();
            })
        },
        
        resume : function () {
            console.log('tutorial resume');
            
            reset();
        },
        
        pause : function () {
            console.log('tutorial pause');
        },
        
        destroy : function () {
            console.log('tutorial destroy');
        },
    }
})
