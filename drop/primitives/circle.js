var Drop = Drop || {};
Drop.Primitives = Drop.Primitives || {};

Drop.Primitives.Circle = function (playpen, x, y, radius) {
    Drop.SvgObject.call(this, playpen, "circle");

    Object.defineProperty(this, "x", {
        get : function () {
            return Number(this.node.getAttribute("cx"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid x!";
            }
            this.node.setAttribute("cx", String(value));
        }
    });

    Object.defineProperty(this, "y", {
        get : function () {
            return Number(this.node.getAttribute("cy"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid y!";
            }
            this.node.setAttribute("cy", String(value));
        }
    });

    Object.defineProperty(this, "radius", {
        get : function () {
            return Number(this.node.getAttribute("r"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid radius!";
            }
            this.node.setAttribute("r", String(value));
        }
    });

    this.x = x;
    this.y = y;
    this.radius = radius;
};

Drop.Primitives.Circle.prototype = Object.create(Drop.SvgObject.prototype);
Drop.Primitives.Circle.prototype.constructor = Drop.Primitives.Circle;