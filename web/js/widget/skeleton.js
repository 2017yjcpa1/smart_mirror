define([
    'jquery',
    'kinect/bridge',
    'math/vec2d'
], function ($, kinect, vec2d) {
    
    var cvs = false;
    var ctx = false;
    
    function init() {
        console.log('skeleton init');
        
        cvs = $('canvas', this.rootLayout);
        ctx = cvs[0].getContext('2d');
        
        kinect.addEventListener('skeleton', update);
    }
    
    function update(data) {
        var canvasWidth = parseInt(cvs.width());
        var canvasHeight = parseInt(cvs.height());
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // 머리에서 척추
        drawSegments([ data.head, data.neck, data.spineMid, data.spineBase ]);
        
        // 어깨에서 손
        drawSegments([ data.neck, data.shoulderRight, data.elbowRight, data.wristRight, data.handRight ]);
        drawSegments([ data.neck, data.shoulderLeft, data.elbowLeft, data.wristLeft, data.handLeft ]);
        
        // 척추에서 발
        drawSegments([ data.spineBase, data.hipRight, data.kneeRight, data.ankleRight, data.footRight ]);
        drawSegments([ data.spineBase, data.hipLeft, data.kneeLeft, data.ankleLeft, data.footLeft ]);
    }
    
    function drawSegments(segs) {
        if (segs.length < 2) {
            return;
        }
        
        var centerX = parseInt(cvs.width()) / 2;
        var centerY = parseInt(cvs.height()) / 2;
    
        ctx.beginPath();
        	
        var seg = vec2d(segs[0]);            
        seg.x = seg.x * centerX + centerX;
        seg.y = -seg.y * centerY + centerY;
        ctx.moveTo(seg.x, seg.y);

        for (var n = 1; n < segs.length; ++n) {
            var seg = vec2d(segs[n]);
            seg.x = seg.x * centerX + centerX;
            seg.y = -seg.y * centerY + centerY;
            ctx.lineTo(seg.x, seg.y);
        }
        
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5; 
        ctx.strokeStyle = '#ffffff';
        
        ctx.stroke();
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_skeleton.html',
        
        init : init,
    }
});