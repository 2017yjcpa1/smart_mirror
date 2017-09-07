(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.audioPlayer = factory();
    }
}(this, function () {
    
    return {
        play : function () {
            new Audio('./asset/audio/bg_timer.mp3').play();
        },
    }
}));