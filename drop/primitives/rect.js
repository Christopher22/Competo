var Drop = Drop || {};
Drop.Primitives = Drop.Primitives || {};

Drop.Primitives.Rect = function (playpen, x, y, width, height) {

    Drop.SvgObject.call(this, playpen, "rect");

    Object.defineProperty(this, "width", {
        get : function () {
            return Number(this.node.getAttribute("width"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid width!";
            }
            this.node.setAttribute("width", String(value));
        }
    });

    Object.defineProperty(this, "height", {
        get : function () {
            return Number(this.node.getAttribute("height"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid height!";
            }
            this.node.setAttribute("height", String(value));
        }
    });

    Object.defineProperty(this, "center", {
        get : function () {
            return {
                x : this.x + this.width / 2,
                y : this.y + this.height / 2
            };
        }
    });

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Drop.Primitives.Rect.prototype = Object.create(Drop.SvgObject.prototype);
Drop.Primitives.Rect.prototype.constructor = Drop.Primitives.Rect;