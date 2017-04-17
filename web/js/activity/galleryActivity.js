define([ 'system' ],function (system) {
    
    return {
        
        id : 'galleryActivity',
        title : '갤러리',
        icon : 'ic_gallery.png',
        layoutHTML : 'activity_gallery.html',
        
        init : function () {
            console.log('gallery init');
        },
        
        resume : function () {
            console.log('gallery resume');
        },
        
        pause : function () {
            console.log('gallery pause');
        },
        
        destroy : function () {
            console.log('gallery destroy');
        },
    }
})