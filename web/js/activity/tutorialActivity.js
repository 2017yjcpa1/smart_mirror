define([
    'activity/tutorialActivity/moveLearn',
    
    'system', 
    
    'jquery',
    'jquery-draggable'
],function (moveLearn, system, $) {
    
    return {
        
        id : 'tutorialActivity',
        title : '모션학습',
        icon : 'ic_tutorial.png',
        layoutHTML : 'activity_tutorial.html',
        
        init : function () {
            console.log('tutorial init');
        },
        
        resume : function () {
            console.log('tutorial resume'); 
            
            moveLearn.init();
        },
        
        pause : function () {
            console.log('tutorial pause');
        },
        
        destroy : function () {
            console.log('tutorial destroy');
        },
    }
})
