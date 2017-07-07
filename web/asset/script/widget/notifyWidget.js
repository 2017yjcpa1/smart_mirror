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
            
           $('<li></li>').text(notifyData['message']).insertBefore('#notifyWidget ul li:first-child');

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