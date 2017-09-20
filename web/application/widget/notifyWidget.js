define([
    'jquery',
    'system',
    
    'output/speechUtterance',
], function ($, system, speechUtterance) {
    
    
    function waitForNotify(creationDate) {
     
        var url = window.URL.createEndpointURL('/notify/pull/');
        
        if (creationDate) {
            url += '?creation_date=' + creationDate;
        }
     
        $.getJSON(url, function (notifyData) {
            
            if (notifyData['messages']) {
                var messages = notifyData['messages'];
                if (messages.length) {
                    for (var n = 0; n < messages.length; ++n) {

                        var message = messages[n];

                        //speechUtterance.speak(message['contents']);

                        $('<li class="clearFix"></li>')
                             .attr('data-package', message.packageName)
                             .append($('<i style="background-image:url(\'' + message['icon'] + '\')"></i>'))
                             .append($('<h1>' + message['title'] + '</h1>'))
                             .append($('<p>' + message['contents'] + '</p>'))
                             .insertBefore('#notifyWidget ul li:first-child');
                    }
                }
            }
            
            // TODO 달력데이터와 어떻게...??
            // TODO 일정 갯수이후 제거하기
            
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