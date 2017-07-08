<!DOCTYPE html>
<html>
    <head>
        <title>제목없음</title>
        <meta charset="UTF-8"/>
        <meta name="Viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css?family=Open+Sans');
            
            body {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                
                padding: 0;
                margin: 0;
                
                overflow: hidden;

                background: #333;
                color: white;
            }
            
            body > .activity{
                position: absolute;
                top: 0;
                left: 0;
                
                z-index: 0;
                
                width: 100%;
                height: 100%;
                
                background: black;
                visibility: hidden;
                
                perspective: 1200px;
                transform-style: preserve-3d;
                transform: translate3d(0, 0, 0);
            }
            
            body > .activity.activityOnTop {
                z-index: 1000;
                visibility: visible;
            }
            
            body > .activity.showEffect {
                visibility: visible;
                animation: scale-up-down .5s ease both;
                animation-delay: .3s; 
            }
            
            body > .activity.hideEffect {
                visibility: visible;
                animation: scale-down .5s ease both;
            }

            .clearFix:before, 
            .clearFix:after{
                content: " ";
                display:table
            }
            .clearFix:after{
                clear:both
            }

            @keyframes scale-down {
                to { opacity: 0; transform: scale(.8); }
            }
            
            @keyframes scale-up-down {
                from { opacity: 0; -webkit-transform: scale(1.2); }
            }
        </style>
        <script type="text/javascript" src="asset/script/lib/require-2.3.3.min.js"></script>
        <script type="text/javascript">
            
            var GOOGLE_MAPS_JS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCVsFm99OvEG10HtxASj9jDzdRJUjnXho0';
            
            Array.prototype.peek = function () {
                return this[ this.length - 1 ];
            }
            
            Math.toDegrees = function (rad) {
                return rad * 180.0 / Math.PI;
            }
            
            String.prototype.camelize = function () {
                return this.replace(/[_.-](\w|$)/g, function (_, char) {
                    return char.toUpperCase();
                });
            };
            
            String.prototype.hashCode = function() {                
                if (this.length === 0) {
                    return 0;
                }
                
                var hash = 0;
                var char;
                
                for (var n = 0; n < this.length; n++) {
                    char = this.charCodeAt(n);
                    hash = ((hash << 5) - hash) + char;
                    hash |= 0; // Convert to 32bit integer
                }
                
                return hash;
            };
    
            requirejs.config({
                'urlArgs': 'bust=' + (new Date()).getTime(),
                'baseUrl': './asset/script',
                'paths': {
                      'async' : 'lib/require-async-0.1.2'
                    
                    , 'vec2d': 'math/vec2d'
                    , 'vec3d': 'math/vec3d'
                    , 'mat2d': 'math/mat2d'
                    
                    , 'jquery': 'lib/jquery-3.2.0.min'
                    , 'jquery-draggable': 'lib/jquery-draggable-1.0'
                },
                
                shim : {
                    'jquery-draggable' : {
                        exports : '$',
                        deps : ['jquery']
                    }
                }
            });

            require(['system'], function (system) {
                system.init();
            });
        </script>
    </head>
    <body>
    </body>
</html>
