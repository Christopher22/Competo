/**
 * The implementation of Competo.
 * @author Christopher Gundler
 * @version 1.0
 */
var Competo = {};

/**
 * A field on the grid of Competo.
 */
Competo.FIELD = {
    FREE: 0,
    Player1: 1,
    Player2: 2
};

/**
 * Returns the opposite of the given player.
 * @param {Competo.FIELD} player The player.
 * @returns The opposite.
 */
Competo.getEnemy = function (player) {
    switch (player) {
        case Competo.FIELD.Player1:
            return Competo.FIELD.Player2;
        case Competo.FIELD.Player2:
            return Competo.FIELD.Player1;
        default:
            throw "Invalid player!";
    }
};

/**
 * The status of a Competo match.
 */
Competo.STATUS = {
    Running: 0,
    Player1Win: 1,
    Player2Win: 2
};

/**
 * Available moves for a player.
 */
Competo.Moves = {};

/**
 * The base of all moves.
 * @param player {Competo.FIELD} The current player.
 * @param posOld {Array} The old position of a pawn.
 * @param posNew {Array} The new position of a pawn.
 * @constructor Creates a abstract class for moves.
 */
Competo.Moves.Move = function (player, posOld, posNew) {
    if (player !== Competo.FIELD.Player1 && player !== Competo.FIELD.Player2) {
        throw "Invalid player!";
    }

    Object.defineProperty(this, "player", {
        writeable: false,
        value: player
    });

    Object.defineProperty(this, "oldPosition", {
        writeable: false,
        value: posOld
    });

    Object.defineProperty(this, "newPosition", {
        writeable: false,
        value: posNew
    });
};

/**
 * Checks if the move is valid.
 * @param competo {Competo.Competo} The current game.
 * @return {boolean} Returns true if the move is valid.
 */
Competo.Moves.Move.prototype.isValid = function (competo) {
    throw "Not implemented!";
};

/**
 * Move 1: A single step in the direction of the target.
 * @param player {Competo.FIELD} The player.
 * @param x {number} The x coordinate.
 * @param y {number} The y coordinate.
 * @constructor Creates this move.
 */
Competo.Moves.SimpleMove = function (player, x, y) {
    Competo.Moves.Move.call(this, player, [x, y], ((player === Competo.FIELD.Player1) ? [x, y - 1] : [x - 1, y]));
};

Competo.Moves.SimpleMove.prototype = Object.create(Competo.Moves.Move.prototype);
Competo.Moves.SimpleMove.prototype.constructor = Competo.Moves.SimpleMove;

Competo.Moves.SimpleMove.prototype.isValid = function (competo) {
    return competo.get(this.newPosition[0], this.newPosition[1]) === Competo.FIELD.FREE;
};

/**
 * Move 2: Two step in the direction of the target iff the pawn is surrounded on two sides.
 * @param player {Competo.Field} The player.
 * @param x {number} The x coordinate.
 * @param y {number} The y coordinate.
 * @constructor Creates this move.
 */
Competo.Moves.DoubleMove = function (player, x, y) {
    Competo.Moves.Move.call(this, player, [x, y], ((player === Competo.FIELD.Player1) ? [x, y - 2] : [x - 2, y]));
};

Competo.Moves.DoubleMove.prototype = Object.create(Competo.Moves.Move.prototype);
Competo.Moves.DoubleMove.prototype.constructor = Competo.Moves.DoubleMove;

Competo.Moves.DoubleMove.prototype.isValid = function (competo) {
    if (this.player === Competo.FIELD.Player1) {
        return competo.get(this.newPosition[0], this.newPosition[1]) === Competo.FIELD.FREE &&
            competo.get(this.oldPosition[0] - 1, this.oldPosition[1]) === this.player &&
            competo.get(this.oldPosition[0] + 1, this.oldPosition[1]) === this.player;
    }
    else {
        return competo.get(this.newPosition[0], this.newPosition[1]) === Competo.FIELD.FREE &&
            competo.get(this.oldPosition[0], this.oldPosition[1] - 1) === this.player &&
            competo.get(this.oldPosition[0], this.oldPosition[1] + 1) === this.player;
    }
};

/**
 * Move 3: A jump in the direction of the target about the pawn of a enemy.
 * @param player {Competo.FIELD} The player.
 * @param x {number} The x coordinate.
 * @param y {number} The y coordinate.
 * @constructor Creates this move.
 */
Competo.Moves.Jump = function (player, x, y) {
    Competo.Moves.Move.call(this, player, [x, y], ((player === Competo.FIELD.Player1) ? [x, y - 2] : [x - 2, y]));

    Object.defineProperty(this, "enemyMove", {
        writeable: false,
        value: (player === Competo.FIELD.Player1 ? (new Competo.Moves.SimpleMove(Competo.FIELD.Player2, x, y - 1)) :
            (new Competo.Moves.SimpleMove(Competo.FIELD.Player1, x - 1, y)))
    });
};

Competo.Moves.Jump.prototype = Object.create(Competo.Moves.Move.prototype);
Competo.Moves.Jump.prototype.constructor = Competo.Moves.Jump;

Competo.Moves.Jump.prototype.isValid = function (competo) {
    if (this.player === Competo.FIELD.Player1) {
        return competo.get(this.newPosition[0], this.newPosition[1]) === Competo.FIELD.FREE &&
            competo.get(this.oldPosition[0], this.oldPosition[1] - 1) === Competo.getEnemy(this.player);
    }
    else {
        return competo.get(this.newPosition[0], this.newPosition[1]) === Competo.FIELD.FREE &&
            competo.get(this.oldPosition[0] - 1, this.oldPosition[1]) === Competo.getEnemy(this.player)
    }
};

/**
 * A Competo game.
 * @param fields {number} The dimensions of the game.
 * @constructor Creates a new game.
 */
Competo.Competo = function (fields) {

    Object.defineProperty(this, "SIZE", {
        writeable: false,
        value: fields
    });

    // Creates a size*size field.
    this.field = new Array(fields);
    for (var x = 0; x < fields; x++) {
        this.field[x] = new Array(fields);
        for (var y = 0; y < fields; y++) {
            this.field[x][y] = Competo.FIELD.FREE;
        }
    }

    // Creates the player.
    this.p1 = [];
    this.p2 = [];
    for (var i = 1; i < fields - 1; i++) {
        this.field[i][7] = Competo.FIELD.Player1;
        this.field[7][i] = Competo.FIELD.Player2;

        this.p1.push([i, 7]);
        this.p2.push([7, i]);
    }
};

/**
 * Returns the type of a specific field.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @return {Competo.FIELD|null} Returns the field or null if out of bounds.
 */
Competo.Competo.prototype.get = function (x, y) {
    return (x >= 0 && x < this.SIZE && y >= 0 && y < this.SIZE) ? this.field[x][y] : null;
};

/**
 * Moves the pawn of a player.
 * @param oldPos {Array} The old position.
 * @param newPos {Array} The new position.
 */
Competo.Competo.prototype.move = function (oldPos, newPos) {

    var player = this.get(oldPos[0], oldPos[1]);
    if (player !== Competo.FIELD.Player1 && player !== Competo.FIELD.Player2) {
        throw "Invalid player!";
    }
    else if (this.get(newPos[0], newPos[1]) !== Competo.FIELD.FREE) {
        throw "Target is already occupied!";
    }

    // Replace old coordinate
    var playerArray = (player === Competo.FIELD.Player1 ? this.p1 : this.p2);
    for (var i = 0; i < playerArray.length; i++) {
        if (playerArray[i][0] === oldPos[0] && playerArray[i][1] === oldPos[1]) {
            playerArray[i] = newPos;
            break;
        }
    }

    this.field[oldPos[0]][oldPos[1]] = Competo.FIELD.FREE;
    this.field[newPos[0]][newPos[1]] = player;
};

/**
 * Returns all the pawns of a player.
 * @param player {Competo.FIELD} The player.
 * @return {Array} The positions of the pawns.
 */
Competo.Competo.prototype.getPlayer = function (player) {
    switch (player) {
        case Competo.FIELD.Player1:
            return this.p1;
        case Competo.FIELD.Player2:
            return this.p2;
        default:
            throw "Invalid player!";
    }
};

/**
 * Returns the current status of the game.
 * @return {Competo.STATUS} The status.
 */
Competo.Competo.prototype.getStatus = function () {
    var p1Win = true;
    var p2Win = true;

    for (var i = 1; i < this.SIZE - 1; i++) {
        if (p1Win && this.field[i][0] !== Competo.FIELD.Player1) {
            p1Win = false;
        }

        if (p2Win && this.field[0][i] !== Competo.FIELD.Player2) {
            p2Win = false;
        }
    }

    if (p1Win) {
        return Competo.STATUS.Player1Win;
    }
    else if (p2Win) {
        return Competo.STATUS.Player2Win;
    }
    else {
        return Competo.STATUS.Running;
    }
};

/**
 * Returns the next possible steps for a player.
 * @param player {Competo.FIELD} The player.
 * @return {Array} The possible steps.
 */
Competo.Competo.prototype.getNextSteps = function (player) {
    var results = [];
    var that = this;

    this.getPlayer(player).forEach(function (pos) {
        var step;
        if (((step = new Competo.Moves.Jump(player, pos[0], pos[1])) && step.isValid(that)) ||
            ((step = new Competo.Moves.DoubleMove(player, pos[0], pos[1])) && step.isValid(that)) ||
            ((step = new Competo.Moves.SimpleMove(player, pos[0], pos[1])) && step.isValid(that))) {
            results.push(step);
        }
    });

    return results;
};