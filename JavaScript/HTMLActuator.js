

function HTMLActuator() {
    this.gameContainer = document.querySelector(".GameSpace")
    this.wallContainer = document.querySelector(".WallSpace")
    this.movesDisplay = document.getElementById("moves")
    this.bestMovesDisplay = document.getElementById("best-moves")
    this.savedDisplay = document.getElementById("saved")
    this.pushesDisplay = document.getElementById("pushes")
    this.bestPushesDisplay = document.getElementById("best-pushes")
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
    this.movesDisplay.innerText = theLevel.moves
    this.bestMovesDisplay.innerText = bestMoves
}

HTMLActuator.prototype.updatePushes = function (pushes) {
    this.pushesDisplay.innerText = theLevel.pushes
    this.bestPushesDisplay.innerText = bestPushes
}

HTMLActuator.prototype.updateSaved = function (saved) {
    this.savedDisplay.innerText = theLevel.savedPacks
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

            // Put the tile on the board
            this.gameContainer.appendChild(wrapper)
        }
    }
}

// HTMLActuator.prototype.addWall = function (piece) {
//     if (piece.value != null) {
//         var self = this;
//         // We can't use classlist because it somehow glitches when replacing classes
//         var pieceArr = ['$', '.', '@', '+', '*', '?']
//         var isWall = !pieceArr.includes(piece.value)
//         if (isWall || piece.value == '.' || piece.value == '+' || piece.value == '*') {

//             var wrapper = document.createElement("div")
//             var position = piece.previousPosition || { x: piece.x, y: piece.y }
//             var positionClass = this.positionClass(position)

//             var classes = []
//             if (isWall) {
//                 classes = ["wall", positionClass]
//                 wrapper.setAttribute("piece", piece.value)
//                 wrapper.textContent = piece.value
//             } else {
//                 classes = ["piece", positionClass]
//                 wrapper.setAttribute("piece", '.')
//                 wrapper.textContent = '.'
//             }


//             this.applyClasses(wrapper, classes)
            
//             // Put the tile on the board
//             this.wallContainer.appendChild(wrapper)
//         }
//     }
// }

HTMLActuator.prototype.addWall = function (piece) {
    if (piece.value != null) {
        var self = this;
        // We can't use classlist because it somehow glitches when replacing classes
        var pieceArr = ['$', '.', '@', '+', '*', '?']
        var isWall = !pieceArr.includes(piece.value)
        if (isWall || piece.value == '.' || piece.value == '+' || piece.value == '*') {

            var position = piece.previousPosition || { x: piece.x, y: piece.y }
            var positionClass = this.positionClass(position)
            var wrapper = '<div ' 

            var classes = []
            if (isWall) {
                wrapper += 'piece="' + piece.value + '" class="wall ' + positionClass + '">' + piece.value + "</div>"
            } else {
                wrapper += 'piece="." class="piece ' + positionClass + '">.</div>'
                
            }

            
            // Put the tile on the board
            this.wallContainer.innerHTML += wrapper
        }
    }
}