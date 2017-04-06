define([
    'jquery',
    'kinect',
    'math/vec2d'
], function ($, kinect, vec2d) {
    
    var WIDTH = 170;
    var HEIGHT = 250;
    
    var cvs = $(document.createElement('canvas'))
                    .attr({ 'width' : WIDTH, 'height' : HEIGHT })
                    .css({		
                        'position' : 'fixed',		
                        'bottom' : 0,		
                        'left' : 0
                    });
                    
    var ctx = cvs.get(0).getContext('2d');
    
    function init() {
        kinect.addEventListener('skeleton', update);
        
        cvs.appendTo('body');
    }
                    
    function drawSegments(segs) {
        var cx = WIDTH / 2;
        var cy = HEIGHT / 2;
    
        ctx.beginPath();
        
        for (var n = 1; n < segs.length; ++n) {		
            var seg1 = vec2d(segs[n - 1]);            
            seg1.x = seg1.x * cx + cx;
            seg1.y = -seg1.y * cy + cy;
            
            var seg2 = vec2d(segs[n]);
            seg2.x = seg2.x * cx + cx;
            seg2.y = -seg2.y * cy + cy;
            
            ctx.moveTo(seg1.x, seg1.y);
            ctx.lineTo(seg2.x, seg2.y);
        }
        
        ctx.lineWidth = 5; 
        ctx.strokeStyle = '#ffffff';
        
        ctx.stroke();
    }
    
    function update(data) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        
        // 목에서 척추
        drawSegments([ data.head, data.neck, data.spineMid, data.spineBase ]);
        
        // 어깨에서 손
        drawSegments([ data.neck, data.shoulderRight, data.elbowRight, data.wristRight, data.handRight ]);
        drawSegments([ data.neck, data.shoulderLeft, data.elbowLeft, data.wristLeft, data.handLeft ]);
        
        // 척추에서 발
        drawSegments([ data.spineBase, data.hipRight, data.kneeRight, data.ankleRight, data.footRight ]);
        drawSegments([ data.spineBase, data.hipLeft, data.kneeLeft, data.ankleLeft, data.footLeft ]);
    }
    
    return {
        init : init
    }
});