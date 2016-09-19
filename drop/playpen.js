var Drop = Drop || {};

Drop.Playpen = function(width, height) {
    this.node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.node.setAttribute("class", "playpen");
    this.node.setAttribute("width", width + "px");
    this.node.setAttribute("height", height + "px");
    this.node.setAttribute("viewbox", "0 0 " + width + " " + height);

    Object.defineProperty(this, "width", {
        enumerable : true,
        writable: false,
        value: width
    });

    Object.defineProperty(this, "height", {
        enumerable : true,
        writable: false,
        value: height
    });

    document.body.appendChild(this.node);
};

Drop.Playpen.prototype.create = function(name, callback) {
    var node = document.createElementNS(this.node.namespaceURI, String(name));
    if(!node) {
        throw "Drop: Invalid SVG element!";
    }

    node.setAttribute("class", name);

    if(typeof callback === "function") {
        callback(node);
    }

    this.node.appendChild(node);
    return node;
};

Drop.Playpen.prototype.remove = function (node) {
    this.node.removeChild(node);
};

Drop.Playpen.prototype.finalize = function () {
    this.node.parentNode.removeChild(this.node);
};