

function HTMLActuator() {
    this.gameContainer = document.querySelector(".GameSpace")
    this.wallContainer = document.querySelector(".WallSpace")
    // this.tileContainer = document.querySelector(".tile-container");
    // this.scoreContainer = document.querySelector(".score-container");
    // this.bestContainer = document.querySelector(".best-container");
    // this.messageContainer = document.querySelector(".game-message");
    // this.sharingContainer = document.querySelector(".score-sharing");

    // this.score = 0;
}

HTMLActuator.prototype.actuate = function (level) {
    var self = this;

    window.requestAnimationFrame(function () {
        self.clearContainer(self.gameContainer);


        level.objArr.forEach(function (column) {
            column.forEach(function (item) {
                if (item) {
                    self.addPiece(item);
                }
            });
        });
        // console.log(level.player)        
        self.addPiece(level.player)

        self.updateMoves(level.moves)
        self.updatePushes(level.pushes)
        self.updateSaved(level.saved)
    })
}

HTMLActuator.prototype.actuateWalls = function (level) {
    var self = this;

    window.requestAnimationFrame(function () {
        self.clearContainer(self.wallContainer);


        level.objArr.forEach(function (column) {
            column.forEach(function (item) {
                if (item) {
                    self.addWall(item);
                }
            });
        });
    })
}

HTMLActuator.prototype.clearContainer = function (container) {
    while (container.firstChild != null) {
        container.removeChild(container.firstChild);
    }
};

HTMLActuator.prototype.updateMoves = function (moves) {
    document.getElementById("moves").innerText = theLevel.moves
    document.getElementById("best-moves").innerText = bestMoves
}

HTMLActuator.prototype.updatePushes = function (pushes) {
    document.getElementById("pushes").innerText = theLevel.pushes
    document.getElementById("best-pushes").innerText = bestPushes
}

HTMLActuator.prototype.updateSaved = function (saved) {
    document.getElementById("saved").innerText = theLevel.savedPacks
}

HTMLActuator.prototype.positionClass = function (position) {
    // position = this.normalizePosition(position)
    return "piece-position-" + position.x + "-" + position.y
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
    element.setAttribute("class", classes.join(" "))
};

HTMLActuator.prototype.normalizePosition = function (position) {
    return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.addPiece = function (piece) {
    if (piece.value != null) {
        var self = this;

        var wrapper = document.createElement("div")
        var inner = document.createElement("div")
        var position = piece.previousPosition || { x: piece.x, y: piece.y }
        var positionClass = this.positionClass(position)

        // We can't use classlist because it somehow glitches when replacing classes

        var classes = ["piece", positionClass]

        var pieceArr = ['$', '@', '+', '*', '?']
        var isWall = !pieceArr.includes(piece.value)
        if (!isWall) {
            if (piece.value == '+') {
                wrapper.setAttribute("piece", '@')
                wrapper.textContent = '@';
            } else if (piece.value == '*') {
                wrapper.setAttribute("piece", '$')
                wrapper.textContent = '$';
            } else {
                wrapper.setAttribute("piece", piece.value)
                wrapper.textContent = piece.value;
            }
            // wrapper.innerText += graph.grid[piece.x][piece.y].weight
            this.applyClasses(wrapper, classes)

            if (piece.previousPosition) {
                // Make sure that the tile gets rendered in the previous position first
                window.requestAnimationFrame(function () {
                    classes[1] = self.positionClass({ x: piece.x, y: piece.y });
                    self.applyClasses(wrapper, classes); // Update the position
                });
            }

            // Add the inner part of the tile to the wrapper
            // wrapper.appendChild(inner);

            // Put the tile on the board
            this.gameContainer.appendChild(wrapper)
        }
    }
}

HTMLActuator.prototype.addWall = function (piece) {
    if (piece.value != null) {
        var self = this;



        // We can't use classlist because it somehow glitches when replacing classes


        var pieceArr = ['$', '.', '@', '+', '*', '?']
        var isWall = !pieceArr.includes(piece.value)
        if (isWall || piece.value == '.' || piece.value == '+' || piece.value == '*') {

            var wrapper = document.createElement("div")
            var inner = document.createElement("div")
            var position = piece.previousPosition || { x: piece.x, y: piece.y }
            var positionClass = this.positionClass(position)

            var classes = []
            if (isWall) {
                classes = ["wall", positionClass]
                wrapper.setAttribute("piece", piece.value)
                wrapper.textContent = piece.value
            } else {
                classes = ["piece", positionClass]
                wrapper.setAttribute("piece", '.')
                wrapper.textContent = '.'
            }


            this.applyClasses(wrapper, classes)

            if (piece.previousPosition) {
                // Make sure that the tile gets rendered in the previous position first
                window.requestAnimationFrame(function () {
                    classes[1] = self.positionClass({ x: piece.x, y: piece.y });
                    self.applyClasses(wrapper, classes); // Update the position
                });
            }

            // Add the inner part of the tile to the wrapper
            // wrapper.appendChild(inner);

            // Put the tile on the board
            this.wallContainer.appendChild(wrapper)
        }
    }
}