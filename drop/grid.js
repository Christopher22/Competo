function Grid(playpen, rects) {

    Drop.GameObject.call(this);

    Object.defineProperty(this, "fieldSize", {
        enumerable : true,
        writable : false,
        value : Math.min(playpen.width, playpen.height) / rects
    });

    this.fields = new Array(rects);
    for(var i = 0; i < rects; i++) {
        this.fields[i] = new Array(rects);

        for(var j = 0; j < rects; j++) {
            this.fields[i][j] = new Drop.Primitives.Rect(playpen, this.fieldSize * i, this.fieldSize * j, this.fieldSize, this.fieldSize);
        }
    }
}

Grid.prototype = Object.create(Drop.GameObject.prototype);
Grid.prototype.constructor = Grid;