/** @license
 * RequireJS plugin for async dependency load like JSONP and Google Maps
 * Author: Miller Medeiros
 * Version: 0.1.2 (2014/02/24)
 * Released under the MIT license
 */
define(function() {

    var REGEX_PARAM = /!(.+)/;
    
    var DEFAULT_PARAM_NAME = 'callback';
    
    var uid = 0;

    function injectScript(src) {
        var scriptElement = document.createElement('script'); 
        scriptElement.type = 'text/javascript'; 
        scriptElement.async = true; 
        scriptElement.src = src;
        
        var siblingNode = document.getElementsByTagName('script')[0]; 
        siblingNode.parentNode.insertBefore(scriptElement, siblingNode);
    }

    function getFormatUrl(name, uid) {
        var url = name.replace(REGEX_PARAM, '');
        var param = DEFAULT_PARAM_NAME;
        
        if (REGEX_PARAM.test(name)) {
            param = name.replace(/.+!/, '');
        }
        
        url += (url.indexOf('?') < 0)? '?' : '&';
        
        return url + param + '=' + uid;
    }

    function getUniqueId() {
        return '__async_req_' + (uid++) + '__';
    }

    return {
        
        load : function (name, req, loaded, config) {
            if (config.isBuild) {
                loaded(null); // avoid errors on the optimizer
            } else {
                var uid = getUniqueId();
                // create a global variable that stores onLoad so callback
                // function can define new module after async load
                window[uid] = loaded;
                injectScript(getFormatUrl(req.toUrl(name), uid));
            }
        }
    };
});