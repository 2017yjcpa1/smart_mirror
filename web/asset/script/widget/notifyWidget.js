define([
    'jquery',
    'system',
    
    
    'output/speechUtterance',
], function ($, system, speechUtterance) {
    
    
    function waitForNotify(creationDate) {
     
        var url = './notify/pull/';
        
        if (creationDate) {
            url += '?creation_date=' + creationDate;
        }
     
        $.getJSON(url, function (notifyData) {
            
            var messages = notifyData['messages'];
            for (var n = 0; n < messages.length; ++n) {
                
                var message = messages[n];
                
                speechUtterance.speak(message['contents']);
                
                $('<li class="clearFix"></li>')
                     .append($('<img src="' + message['icon'] + '">'))
                     .append($('<h1>' + message['title'] + '</h1>'))
                     .append($('<p>' + message['contents'] + '</p>'))
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