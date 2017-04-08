define(function () {
    
    function __overload__(a, b, c, d, e, f) {
        if (Array.isArray(a)) {
            return { a : parseFloat(a[0]), b : parseFloat(a[1]), c : parseFloat(a[2]), 
                     d : parseFloat(a[3]), e : parseFloat(a[4]), f : parseFloat(a[5]) };
        }
        
        if (typeof(a) === 'undefined') {
            return { a : 1, b : 0, c : 0, 
                     d : 1, e : 0, f : 0 };
        }
        
        if (typeof(a) === 'object') {
            if (typeof(a.style) !== 'undefined') { // element 로 들어왔을시
                var mat2d = window.getComputedStyle(a, null).transform;
                if (mat2d > '') {
                    return { a : 1, b : 0, c : 0, 
                             d : 1, e : 0, f : 0 };
                }
                
                mat2d = mat2d.split('(')[1];
                mat2d = mat2d.split(')')[0];
                mat2d = mat2d.split(',');          
                
                return __overload__(mat2d);
            }
            
            return a;
        }
        
        return { a : parseFloat(a), b : parseFloat(b), c : parseFloat(c), 
                 d : parseFloat(d), e : parseFloat(e), f : parseFloat(f) };
    }

    var __mat2d__ = {
        
        a : 1,
        b : 0,
        c : 0,
        d : 1,
        e : 0,
        f : 0,
        
        init : function (a, b, c, d, e, f) {
            var args = __overload__(a, b, c, d, e, f);
            
            this.a = args.a;
            this.b = args.b;
            this.c = args.c;
            this.d = args.d;
            this.e = args.e;
            this.f = args.f;
        },
        
        concat : function (a, b, c, d, e, f) {
            var args = __overload__(a, b, c, d, e, f);
            
            return mat2d(
                this.a * args.a + this.c * args.b,
                this.b * args.a + this.d * args.b,
                this.a * args.c + this.c * args.d,
                this.b * args.c + this.d * args.d,
                this.a * args.e + this.c * args.f + this.e,
                this.b * args.e + this.d * args.f + this.e
            );
        },
        
        toArray : function () {
            return [ 
                this.a,
                this.b,
                this.c,
                this.d,
                this.e,
                this.f
            ];
        },
        
        toCSSTransform : function() {
            return 'matrix(' + this.toArray().join(', ') + ')';
        }
    }
    
    function mat2d(a, b, c, d, e, f) {
        function F() {};
        F.prototype = __mat2d__;
        
        var _f = new F();
        _f.init(a, b, c, d, e, f);
        return _f;
    }
    
    mat2d.translate = function (x, y) {
        return mat2d(1, 0, 0, 1, x, y);
    }
    
    mat2d.scale = function (x, y) {
        y = y || x;
        return mat2d(x, 0, 0, y, 0, 0);
    }
    
    mat2d.rotation = function (rad) {
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        return mat2d(cos, sin, -sin, cos, 0, 0);
    }    
    
    return mat2d;
});


