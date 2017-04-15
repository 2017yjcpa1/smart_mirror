define(function () {
    
    function __overload__(x, y) {
        if (typeof(x) === 'number') {
            return { 
                x : x, 
                y : y || x };
        }
        
        if (Array.isArray(x)) {
            return { x : x[0], y : x[1] };
        }
        
        if (typeof(x) === 'undefined') {
            return { x : 0, y : 0 };
        }
        
        if (typeof(x) === 'object') {
            return x;
        }
        
        return { x : x, y : y };
    }

    var __vec2d__ = {
        
        x : 0,
        y : 0,
        
        init : function (x, y) {
            var args = __overload__(x, y);
            
            this.x = args.x;
            this.y = args.y;
        },
        
        /* 사칙연산 */
        sub : function (x, y) {
            var args = __overload__(x, y);
            
            return vec2d(
                args.x - this.x,
                args.y - this.y
            );
        },
        
        sum : function (x, y) {
            var args = __overload__(x, y);
            
            return vec2d(
                args.x + this.x,
                args.y + this.y
            );
        },
        /* //사칙연산 */
        
        /* 내적, 외적 */
        dotProduct : function (x, y) {
            var args = __overload__(x, y);
            
            return args.x * this.x 
                 + args.y * this.y;
        },
        /* 내적, 외적 */
        
        normalize : function (len) {
            len = len || 1;
            len = this.length() / len;

            var vec = vec2d([ this.x, this.y ]);
            vec.x /= len;
            vec.y /= len; 
            return vec;
        },
        
        distance : function (x, y) {
            var args = __overload__(x, y);
            
            return this.sub(args).length();
        },
        
        length : function () {
            var x = Math.pow(this.x, 2);
            var y = Math.pow(this.y, 2);

            return Math.sqrt(x + y);
        }
    }
    
    function vec2d(x, y, z) {
        function F() {};
        F.prototype = __vec2d__;
        
        var f = new F();
        f.init(x, y);
        return f;
    }
    
    return vec2d;
});


