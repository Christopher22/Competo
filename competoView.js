/**
 * Contains important consts for CSS and GUI.
 */
const COMPETO_VIEW_CONSTANTS = {
    PLAYER1_FIELD_NAME : "Player1",
    PLAYER1_NEXT_STEP : "Player1_Step",
    PLAYER1_WIN : "Team RED wins!",

    PLAYER2_FIELD_NAME : "Player2",
    PLAYER2_NEXT_STEP : "Player2_Step",
    PLAYER2_WIN : "Team YELLOW wins!"
};

/**
 * The view for a Competo game.
 * @constructor Creates a new view.
 */
function CompetoView() {

    const SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.8;

    this.game = new Competo.Competo(8);
    this.svg = new Drop.Playpen(SIZE, SIZE);
    this.field = new Grid(this.svg, 8);
    this.currentPlayer = (Math.random() >= 0.5 ? Competo.FIELD.Player1 : Competo.FIELD.Player2);
    this.pawns = [];
}

/**
 * Draws or updates the current game.
 */
CompetoView.prototype.draw = function () {
    if(this.pawns.length > 0) {
        this.clear();
    }

    this.drawPlayer(Competo.FIELD.Player1);
    this.drawPlayer(Competo.FIELD.Player2);
    this.drawNextSteps();
};

/**
 * Clears all existing pawns.
 */
CompetoView.prototype.clear = function() {
    this.pawns.forEach(function (pawn) {
        pawn.finalize();
    });

    this.pawns = [];
};

/**
 * Draws the pawns of a player.
 * @param player {Competo.FIELD} The player.
 */
CompetoView.prototype.drawPlayer = function (player) {

    const RADIUS = this.field.fieldSize / 2 * 0.8;

    this.game.getPlayer(player).forEach(function (pos) {
        var center = this.field.fields[pos[0]][pos[1]].center;
        var pawn = new Drop.Primitives.Circle(this.svg, center.x, center.y, RADIUS);
        pawn.class = ((player === Competo.FIELD.Player1) ? COMPETO_VIEW_CONSTANTS.PLAYER1_FIELD_NAME : COMPETO_VIEW_CONSTANTS.PLAYER2_FIELD_NAME);
        this.pawns.push(pawn);
    }, this);
};

/**
 * Draws the next steps of the current player.
 */
CompetoView.prototype.drawNextSteps = function () {

    var that = this;

    // Get steps and pause if there are no more possibilities
    var steps = this.game.getNextSteps(this.currentPlayer);
    if(steps.length === 0) {
        this.currentPlayer = Competo.getEnemy(this.currentPlayer);
        steps = this.game.getNextSteps(this.currentPlayer);
    }

    // Draw next steps
    steps.forEach(function(step) {
        var rect = that.field.fields[step.newPosition[0]][step.newPosition[1]];

        // Create the pawn for the next steps
        var pawn = new Drop.Primitives.Rect(that.svg, rect.x, rect.y, rect.width, rect.height);
        pawn.node.step = step;
        pawn.class = that.currentPlayer === Competo.FIELD.Player1 ? COMPETO_VIEW_CONSTANTS.PLAYER1_NEXT_STEP : COMPETO_VIEW_CONSTANTS.PLAYER2_NEXT_STEP;

        // Implements game logic on click.
        pawn.registerEvent(Drop.Event.CLICK, function () {
            that.game.move(this.step.oldPosition, this.step.newPosition);

            // Move enemy in case of jump and give another move.
            if(this.step instanceof Competo.Moves.Jump) {
                if(this.step.enemyMove.isValid(that.game)) {
                    that.game.move(this.step.enemyMove.oldPosition, this.step.enemyMove.newPosition)
                }
            }
            // ... or switch player.
            else {
                that.currentPlayer = Competo.getEnemy(that.currentPlayer);
            }

            that.draw();

            // Checks if somebody wins.
            var status = that.game.getStatus();
            if(status !== Competo.STATUS.Running) {
                alert(status === Competo.STATUS.Player1Win ? COMPETO_VIEW_CONSTANTS.PLAYER1_WIN : COMPETO_VIEW_CONSTANTS.PLAYER2_WIN);
                location.reload(false);
            }
        });

        that.pawns.push(pawn);
    });
};