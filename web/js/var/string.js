define(function () {
    
    String.prototype.camelize = function () {
        return this.replace(/[_.-](\w|$)/g, function (_, x) {
            return x.toUpperCase();
        });
    }
})

