define([
    'jquery',
    'input/kinectBridge',
    'vec3d'
], function ($, kinectBridge, vec3d) {
    
    var canvas = false;
    var context = false;
    
    function init() {
        console.log('skeleton init');
        
        canvas = $('canvas', this.rootLayout);
        context = canvas[0].getContext('2d');
        
        setWidgetByAspectRatio();
        
        kinectBridge.addEventListener('skeleton', update);
    }
    
    function setWidgetByAspectRatio() {
        var widget = $('#skeletonWidget');
        
        var outerHeight = $('canvas', widget).outerHeight();
        var outerWidth = Math.round((outerHeight / 16) * 9);
        
        $('canvas', widget).attr('width', outerWidth);
    }
    
    function update(data) {
        //console.log('skeleton update');
        
        var canvasWidth = parseInt(canvas.width());
        var canvasHeight = parseInt(canvas.height());
        
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // 머리에서 척추
        drawSegments([ data.head, data.neck, data.spineMid, data.spineBase ]);
        
        // 어깨에서 손
        drawSegments([ data.neck, data.shoulderRight, data.elbowRight, data.wristRight, data.handRight ]);
        drawSegments([ data.neck, data.shoulderLeft, data.elbowLeft, data.wristLeft, data.handLeft ]);
        
        // 척추에서 발
        return;
        drawSegments([ data.spineBase, data.hipRight, data.kneeRight, data.ankleRight, data.footRight ]);
        drawSegments([ data.spineBase, data.hipLeft, data.kneeLeft, data.ankleLeft, data.footLeft ]);
    }
    
    function drawSegments(segs) {
        if (segs.length < 2) {
            return;
        }
        
        var centerX = parseInt(canvas.width()) / 2;
        var centerY = parseInt(canvas.height()) / 2;
        
        context.beginPath();
                
        var seg = vec3d(segs[0]);
        seg.x = seg.x * centerX + centerX;
        seg.y = -seg.y * centerY + centerY;
        context.moveTo(seg.x, seg.y);

        for (var n = 1; n < segs.length; ++n) {
            var seg = vec3d(segs[n]);
            seg.x = seg.x * centerX + centerX;
            seg.y = -seg.y * centerY + centerY;
            context.lineTo(seg.x, seg.y);
        }
        
        context.lineJoin = 'round';
        context.lineWidth = 5; 
        context.strokeStyle = '#ffffff';
        
        context.stroke();
    }
    
    return {
        
        alwaysOnTop : true,
        layoutHTML : 'widget_skeleton.html',
        
        init : init,
    }
});