define(function () {
    
    function __overload__(x, y, z) {
        if (typeof(x) === 'number') {
            return { 
                x : x, 
                y : y || x, 
                z : z || x };
        }
        
        if (Array.isArray(x)) {
            return { x : x[0], y : x[1], z : x[2] };
        }
        
        if (typeof(x) === 'undefined') {
            return { x : 0, y : 0, z : 0 };
        }
        
        if (typeof(x) === 'object') {
            return x;
        }
        
        return { x : x, y : y, z : z };
    }

    var __vec3d__ = {
        
        x : 0,
        y : 0,
        z : 0,
        
        init : function (x, y, z) {
            var args = __overload__(x, y, z);
            
            this.x = args.x;
            this.y = args.y;
            this.z = args.z;
        },
        
        /* 사칙연산 */
        sub : function (x, y, z) {
            var args = __overload__(x, y, z);
            
            return vec3d(
                args.x - this.x,
                args.y - this.y,
                args.z - this.z
            );
        },
        
        sum : function (x, y, z) {
            var args = __overload__(x, y, z);
            
            return vec3d(
                args.x + this.x,
                args.y + this.y,
                args.z + this.z
            );
        },
        /* //사칙연산 */
        
        /* 내적, 외적 */
        dot : function (x, y, z) {
            var args = __overload__(x, y, z);
            
            return args.x * this.x 
                 + args.y * this.y 
                 + args.z * this.z;
        },
        /* 내적, 외적 */
        
        norm : function (len) {
            len = len || 1;
            len = this.length() / len;

            var vec = vec3d([ this.x, this.y, this.z ]);
            vec.x /= len;
            vec.y /= len;
            vec.z /= len;
            return vec;
        },
        
        dist : function (x, y, z) {
            var args = __overload__(x, y, z);
            
            return this.sub(args).length();
        },
        
        length : function () {
            var x = Math.pow(this.x, 2);
            var y = Math.pow(this.y, 2);
            var z = Math.pow(this.z, 2);

            return Math.sqrt(x + y + z);
        }
    }
    
    function vec3d(x, y, z) {
        function F() {};
        F.prototype = __vec3d__;
        
        var f = new F();
        f.init(x, y, z);
        return f;
    }
    
    return vec3d;
});


