define([ 
    'system', 
    
    'jquery',
    'jquery-draggable'
],function (system, $) {
    
    var __clickLearn__ = {
        
        successCounter : 0,
        
        init : function () {
            var self = this;
        
            this.successCounter = 0;
            
            var layoutLoaded = function () {
                $('#tutorialActivity .learnStage div')
                    .click(function () { self.success(this) })
            }
            
            var learnWrapper = $('#tutorialActivity .learnWrapper');
            learnWrapper.load('res/layout/activity_tutorial/click_learn.html', layoutLoaded);
        },
        
        success: function (targetObject) {
            targetObject = $(targetObject);
            
            if (targetObject.css('visibility') === 'hidden') {
                return;
            }
            
            targetObject.css('visibility', 'hidden');

            if (++this.successCounter < 3) {
                return;
            }

            __clickLearn__.complete();
        },
        
        complete : function () {
            
        }
    }
    
    var __dragLearn__ = {
        
        successCounter : 0,
        
        init : function () {
            var self = this;
            
            this.successCounter = 0;
            
            var layoutLoaded = function () {
                $('#tutorialActivity .scrollWrapper')
                    .on('dragend', function () { self.success() })
                    .draggable({ 'axis' : 'x' });
            }
            
            var learnWrapper = $('#tutorialActivity .learnWrapper');
            learnWrapper.load('res/layout/activity_tutorial/drag_learn.html', layoutLoaded);
        },
        
        success: function () {
            this.successCounter++;

            if (this.successCounter < 3) {
                return;
            }

            __dragLearn__.complete();
        },
        
        complete : function () {
            __clickLearn__.init();
        }
    }
    
    var __moveLearn__ = {
        
        successCounter : 0,
        
        init : function () {
            var self = this;
            
            this.successCounter = 0;
            
            var learnWrapper = $('#tutorialActivity .learnWrapper');
            
            $(learnWrapper)
                .on(
                    'mouseover mousemove', 
                    '.targetObject', 
                    function () {
                        self.success();
                    }
                );
            
            var layoutLoaded = function () {
                self.reset();
            }
            
            learnWrapper.load('res/layout/activity_tutorial/move_learn.html', layoutLoaded);
        },
        
        success: function () {
            this.successCounter++;

            if (this.successCounter < 3) {
                this.reset();
                return;
            }

            __moveLearn__.complete();
        },
        
        reset : function () {            
            var targetObjects = $('#tutorialActivity .learnStage div');
            var targetRandom = parseInt(Math.random() * targetObjects.length, 10);
            
            targetObjects
                .removeClass('targetObject')
                .eq(targetRandom)
                .addClass('targetObject');
        },
        
        complete : function () {
            __dragLearn__.init();
        }
    }
    
    
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
            
            __moveLearn__.init();
        },
        
        pause : function () {
            console.log('tutorial pause');
        },
        
        destroy : function () {
            console.log('tutorial destroy');
        },
    }
})
