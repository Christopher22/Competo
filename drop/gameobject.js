var Drop = Drop || {};

Drop.GameObject = function() {
    Object.defineProperty(this, "x", {
        configurable : true,
        get : function () {
            return 0;
        }
    });

    Object.defineProperty(this, "y", {
        configurable : true,
        get : function () {
            return 0;
        }
    });
};

Drop.GameObject.prototype.finalize = function () {};

