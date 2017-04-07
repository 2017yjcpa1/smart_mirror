define([
    'jquery',
    'kinect',
    'math/vec2d'
], function ($, kinect, vec2d) {
    
    var canvas = false;
    var context = false;
    
    function init() {
        canvas = $('#skeletonWidget canvas');
        context = canvas[0].getContext('2d');
        
        kinect.addEventListener('skeleton', update);
    }
    
    function update(data) {
        var canvasWidth = parseInt(canvas.width());
        var canvasHeight = parseInt(canvas.height());
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // 목에서 척추
        drawSegments([ data.head, data.neck, data.spineMid, data.spineBase ]);
        
        // 어깨에서 손
        drawSegments([ data.neck, data.shoulderRight, data.elbowRight, data.wristRight, data.handRight ]);
        drawSegments([ data.neck, data.shoulderLeft, data.elbowLeft, data.wristLeft, data.handLeft ]);
        
        // 척추에서 발
        drawSegments([ data.spineBase, data.hipRight, data.kneeRight, data.ankleRight, data.footRight ]);
        drawSegments([ data.spineBase, data.hipLeft, data.kneeLeft, data.ankleLeft, data.footLeft ]);
    }
    
    function drawSegments(segments) {
        var centerX = parseInt(canvas.width()) / 2;
        var centerY = parseInt(canvas.height()) / 2;
    
        context.beginPath();
        
        for (var n = 1; n < segments.length; ++n) {		
            var segment1 = vec2d(segments[n - 1]);            
            segment1.x = segment1.x * centerX + centerX;
            segment1.y = -segment1.y * centerY + centerY;
            
            var segment2 = vec2d(segments[n]);
            segment2.x = segment2.x * centerX + centerX;
            segment2.y = -segment2.y * centerY + centerY;
            
            context.moveTo(segment1.x, segment1.y);
            context.lineTo(segment2.x, segment2.y);
        }
        
        context.lineWidth = 5; 
        context.strokeStyle = '#ffffff';
        
        context.stroke();
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_skeleton.html',
        
        init : init,
        
        update: function () {
        },
    }
});