define([
    'jquery',
    'system',
], function ($, system) {
    
    
    function waitForNotify(creationDate) {
     
        var url = './notify/pull/';
        
        if (creationDate) {
            url += '?creation_date=' + creationDate;
        }
     
        $.getJSON(url, function (notifyData) {
            
            var messages = notifyData['messages'];
            for (var n = 0; n < messages.length; ++n) {
                
                var message = messages[n];
                
                $('<li class="clearFix"></li>')
                     .append($('<img src="' + message['icon'] + '">'))
                     .append($('<span>' + message['contents'] + '</span>'))
                     .insertBefore('#notifyWidget ul li:first-child');
            }
            
            if (notifyData['creation_date']) {
                waitForNotify(parseInt(notifyData['creation_date'], 10));
            }
        }); 
    };

    return {

        layoutHTML: 'widget_notify.html',

        init: function () {
            waitForNotify();
        },

        blur: function () {

        },

        focus: function () {

        }
    }
})