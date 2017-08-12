


var won = false

function SokobanManager(InputManager, Actuator, StorageManager) {


    this.inputManager = new InputManager
    this.storageManager = new StorageManager;
    this.actuator = new Actuator;


    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    // this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
}

SokobanManager.prototype.setup = function () {
    var previousState = this.storageManager.getGameState(levelNumber);

    bestMoves = this.storageManager.getBestMoves(levelNumber)
    bestPushes = this.storageManager.getBestPushes(levelNumber)
    // console.log(previousState)

    // Reload the game from a previous game if present
    if (previousState) {


        theLevel = new LevelStruct([0, 0, 0, 0, 0, 0, 0], previousState.title)
        theLevel.rows = previousState.rows
        theLevel.columns = previousState.columns
        theLevel.packs = previousState.packs
        theLevel.savedPacks = previousState.savedPacks
        theLevel.playerV = previousState.playerV
        theLevel.playerH = previousState.playerH
        // theLevel.rawData = previousState.rawData

        theLevel.pushes = previousState.pushes
        theLevel.moves = previousState.moves

        // theLevel.objArr = previousState.objArr
        theLevel.objArr = theLevel.empty()

        for (var x = 0; x < theLevel.columns; x++) {
            for (var y = 0; y < theLevel.columns; y++) {
                var value = previousState.objArr[x][y]
                if (value != null) {
                    theLevel.addItem(new SokoPiece({ x: x, y: y }, value))
                }
            }
        }
        var playerPosition = { x: theLevel.playerH, y: theLevel.playerV }
        theLevel.player = new SokoPiece(playerPosition, '@')


        // renderLevel(theLevel)

        isCompleted = (bestMoves != 0)
        // console.log(listCookies())
        levelTitle = theLevel.title
        setWindowTitle()


    } else {

        // LoadResFork("Sokoban");
        gotoLevel(levelNumber);

    }

    style = document.createElement('style');
    document.head.appendChild(style);
    stylesheet = style.sheet;
    var width = document.getElementsByClassName("GameBoard")[0].offsetWidth / (theLevel.columns + 1)

    style.innerText += '.GameBoard {'
    style.innerText += 'font-size:' + width + 'px;'
    style.innerText += 'height:' + width * theLevel.rows + 'px;'
    style.innerText += '}'

    // document.getElementsByClassName("GameBoard")[0].clientHeight

    // document.getElementsByClassName("GameBoard")[0].style.height = width * theLevel.rows

    for (var x = 0; x < theLevel.columns; x++) {
        for (var y = 0; y < theLevel.rows; y++) {
            var selector = ".piece-position-" + x + "-" + y
            var value1 = width * x
            var value2 = width * y

            style.innerText += selector + '{'
            style.innerText += 'transform: translate(' + value1 + 'px, ' + value2 + 'px)'
            style.innerText += '}'
        }
    }


    // Update the actuator
    this.actuator.actuateWalls(theLevel)
    this.actuate();
}


// Move tiles on the grid in the specified direction
SokobanManager.prototype.move = function (direction) {
    // 0: up, 1: right, 2: down, 3: left
    var self = this;

    // if (this.isGameTerminated()) return; // Don't do anything if the game's over

    var cell, tile;

    var vector = this.getVector(direction);

    // var player

    theLevel.eachCell(function (x, y, piece) {
        // console.log(piece)
        var pieceArr = ['$', '@', '+', '*', '?']


        if (piece != null) {
            // if (pieceArr.includes(piece.value)) {
            piece.savePosition()
            // }
        }
        // if (piece) {
        //     piece.savePosition()
        // }
    })



    // player = theLevel.getPlayer()

    var player = theLevel.player


    var nextPosition = { x: player.x + vector.x, y: player.y + vector.y }
    var playerPosition = { x: player.x, y: player.y }

    var item = theLevel.itemAt(nextPosition)
    // console.log(player)
    console.log(item)
    // var position = {x:x, y:y}
    // tile.updatePosition(nextPosition);
    // theLevel.addItem(tile)
    // theLevel.addItem(new SokoPiece(position, null))

    // player.updatePosition(position)

    // move(vector.y, vector.x)

    var isWall = false
    var isTreasure = false
    if (item != null) {
        var pieceArr = ['$', '.', '@', '+', '*', '?']
        var treasures = ['$', '*']
        isWall = !pieceArr.includes(item.value)
        isTreasure = treasures.includes(item.value)

    }

    if (isWall == true) {
        return;
    }
    var nextItem
    if (isTreasure) {
        var otherPosition = { x: nextPosition.x + vector.x, y: nextPosition.y + vector.y }
        nextItem = theLevel.itemAt(otherPosition)

        if (nextItem == null || nextItem.value == '.') {
            this.movePiece(item, otherPosition)
            this.movePiece(player, nextPosition)
            theLevel.moves++
            theLevel.pushes++
        }

    } else {
        this.movePiece(player, nextPosition)
        theLevel.moves++
    }




    this.actuate()

};

SokobanManager.prototype.moveEmpty = function (player, cell) {

};

// Move a tile and its representation
SokobanManager.prototype.movePiece = function (piece, cell) {
    var nextPiece = theLevel.itemAt(cell)

    var goals = ['+', '*', '.']
    var onGoal = goals.includes(piece.value)
    var willBeOnGoal = nextPiece != null && nextPiece.value == '.'
    var position = { x: piece.x, y: piece.y }

    if (!onGoal && willBeOnGoal) {
        if (piece.value == '@') {
            piece.value = '+'
        }
        if (piece.value == '$') {
            piece.value = '*'
        }
    } else if (onGoal && !willBeOnGoal) {
        if (piece.value == '+') {
            piece.value = '@'
        }
        if (piece.value == '*') {
            piece.value = '$'
        }
    }
    piece.updatePosition(cell);
    theLevel.addItem(piece)

    if (onGoal) {
        theLevel.addItem(new SokoPiece(position, '.'))
    } else {
        theLevel.objArr[position.x][position.y] = null;
    }

    // if (onGoal && !willBeOnGoal) {
    //     piece.updatePosition(cell);
    //     theLevel.addItem(piece)
    //     theLevel.addItem(new SokoPiece(position, '.'))
    // } 
    // if (onGoal && willBeOnGoal) {
    //     piece.updatePosition(cell);
    //     theLevel.addItem(piece)
    //     theLevel.addItem(new SokoPiece(position, '.'))        
    // }
    // if (!onGoal && willBeOnGoal) {
    //     piece.updatePosition(cell);
    //     theLevel.addItem(piece)
    //     theLevel.objArr[position.x][position.y] = null;  
    // }
    // if(!onGoal && !willBeOnGoal) {
    //     piece.updatePosition(cell);
    //     theLevel.addItem(piece)
    //     theLevel.objArr[position.x][position.y] = null;  
    // }



    // theLevel.objArr[cell.x][cell.y] = tile;

};

SokobanManager.prototype.restart = function () {
    this.storageManager.clearGameState(levelNumber)
    // TODO: uncomment these lines
    // might speed up resets

    // theLevel = parseXML(level)
    // theLevel.addPlayer()
    // moves = 0
    // pushes = 0
    // this.actuate();
    this.setup()
}

// Get the vector representing the chosen direction
SokobanManager.prototype.getVector = function (direction) {
    // Vectors representing tile movement
    var map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 },  // Right
        2: { x: 0, y: 1 },  // Down
        3: { x: -1, y: 0 }   // Left
    };

    return map[direction];
};


// Sends the updated grid to the actuator
SokobanManager.prototype.actuate = function () {
    // if (this.storageManager.getBestScore() < this.score) {
    //     this.storageManager.setBestScore(this.score);
    // }

    // Clear the state when the game is over (game over only, not win)
    // if (this.over) {
    //     this.storageManager.clearGameState();
    // } else {

    countSavedPackets()
    var serial = theLevel.serialize()
    this.storageManager.setGameState(serial, levelNumber);

    this.actuator.actuate(theLevel)
    // this.actuator.actuate(foo, {
    //     moves: theLevel.moves,
    //     pushes: theLevel.pushes,
    //     saved: theLevel.saved
    // })

    if (theLevel.savedPacks == theLevel.packs) {

        // var cookieTitle = "level" + levelNumber
        // setCookie(cookieTitle, true)

        console.log("you win")

        if (bestMoves > theLevel.moves || bestMoves == 0) {
            this.storageManager.setBestMoves(theLevel.moves, levelNumber)
        }
        if (bestPushes > theLevel.pushes || bestPushes == 0) {
            this.storageManager.setBestPushes(theLevel.pushes, levelNumber)
        }
        this.storageManager.clearGameState(levelNumber)

        nextLevel()

    }

};






var Rows = 0;
var Columns = 0;
var Packs = 0;
var PlayerV = 0;
var PlayerH = 0;

var bestMoves = 0;
var bestPushes = 0;


var objArr = new Array();



var newSnd = new Audio()


var completedStr = "   •Completed•"

var undoBuffer = []


ion.sound({
    sounds: [
        { name: "push in" },
        { name: "push out" },
        { name: "push" },
        { name: "walk" },
    ],

    path: "Sound/",
    multiplay: true,
    preload: true,
    volume: 0.7
})



var levelNumber = 0
var theLevel

function startGame() {





    // findDeadzones()
}

function keyhandler(e) {

    switch (e.keyCode) {
        case 38:
            move(-1, 0);
            break;

        case 40:
            move(1, 0);
            break;

        case 37:
            move(0, -1);
            break;

        case 39:
            move(0, 1);
            break;

        case 8:
            undo_pop();
            break;

        case 122:
            if (e.metaKey || e.ctrlKey) {
                undo_pop();
            }
            break;
    }

}




function click(e) {

}


function undo_pop() {
    var undo = undoBuffer.pop()
    if (undo) {
        for (var y = 0; y < theLevel.rows; y++) {
            for (var x = 0; x < theLevel.columns; x++) {
                theLevel.addItem(x, y, undo[y * 34 + x])
            }
        }

        // theLevel.objArr = undo
        // renderLevel(theLevel)
    }
}


function move(yofs, xofs) {
    var xPos = 0;
    var yPos = 0;

    PlayerH = theLevel.playerH
    PlayerV = theLevel.playerV

    xPos = PlayerH + xofs;
    yPos = PlayerV + yofs;

    var item = theLevel.itemAt(xPos, yPos);
    var oldItem = theLevel.itemAt(PlayerH, PlayerV);
    // console.log( "was: " + itemAt( xPos, yPos ) + ", " + itemAt( PlayerH, PlayerV ) + " location : " + PlayerH + ", " + PlayerV);

    // console.log(item);


    var didMove = false;
    var didPush = false;

    undoBuffer.push(theLevel.objArr)

    /* empty */
    if (item == ' ') {
        theLevel.addItem(xPos, yPos, '@');
        if (oldItem == '@') {
            theLevel.addItem(PlayerH, PlayerV, ' ');
        } else if (oldItem == '+') {
            theLevel.addItem(PlayerH, PlayerV, '.');
        }

        ion.sound.play("walk")

        didMove = true
    }

    /* goal */
    if (item == '.') {
        theLevel.addItem(xPos, yPos, '+');
        if (oldItem == '@' /* player */) {
            theLevel.addItem(PlayerH, PlayerV, ' '); /* empty */
        } else if (oldItem == '+' /* player on goal */) {
            theLevel.addItem(PlayerH, PlayerV, '.'); /* goal */
        }

        ion.sound.play("walk")

        didMove = true


    }

    /*treasure*/
    if (item == '$') {
        var nextItem = theLevel.itemAt(xPos + xofs, yPos + yofs);

        /* empty or goal */
        if (nextItem == ' ' || nextItem == '.') {


            if (oldItem == '@'/* player */) {
                theLevel.addItem(PlayerH, PlayerV, ' ');
            } else if (oldItem == '+' /* player on goal */) {
                theLevel.addItem(PlayerH, PlayerV, '.');
            }

            theLevel.addItem(xPos, yPos, '@');

            if (nextItem == ' ' /* empty */) {
                theLevel.addItem(xPos + xofs, yPos + yofs, '$');
                ion.sound.play("push")
            } else if (nextItem == '.' /* goal */) {
                theLevel.addItem(xPos + xofs, yPos + yofs, '*'); // treasure on goal;
                ion.sound.play("push in")
            }

            didMove = true
            didPush = true
        }
    }

    /* treasure on goal */
    if (item == '*') {
        var otherItem = theLevel.itemAt(xPos + xofs, yPos + yofs);
        if (otherItem == ' ' || otherItem == '.') {
            if (oldItem == '@') {
                theLevel.addItem(PlayerH, PlayerV, ' ');
            } else if (oldItem == '+') {
                theLevel.addItem(PlayerH, PlayerV, '.');
            }

            theLevel.addItem(xPos, yPos, '+');

            if (otherItem == ' ' /* empty */) {
                ion.sound.play("push out")

                theLevel.addItem(xPos + xofs, yPos + yofs, '$'); // tresure
            } else if (otherItem == '.' /* goal */) {
                theLevel.addItem(xPos + xofs, yPos + yofs, '*'); // treasure on goal;
                ion.sound.play("push in")
            }

            didMove = true
            didPush = true
        }
    }

    if (didMove) {
        theLevel.playerH += xofs
        theLevel.playerV += yofs
        theLevel.moves++
    } else {
        undoBuffer.pop()
    }

    if (didPush) {
        theLevel.pushes++
    }



    // renderLevel(theLevel)
    countSavedPackets()
}




function printSnd(snd) {

    var str = "play: "
    switch (snd.src) {
        case pushIn.src:
            str += "Sok Push In"
            break;
        case pushOut.src:
            str += "Sok Push Out"
            break;
        case pushSnd.src:
            str += "Sok Push"
            break;
        case walkSnd.src:
            str += "Sok Walk"
            break;

        default:
            str += "none"
            break;
    }

    console.log(str);

}

function play(snd) {

    // printSnd(snd)

    // if ( !snd.paused && !snd.ended ) {
    snd.play();
    // }

    // snd.load()


}



function renderLevel(lvl) {

    // pushOut.play();

    // printLevel(lvl)
    // document.getElementById("GameBoard").innerHTML = text

    // document.getElementById("moves").innerText = theLevel.moves
    // document.getElementById("pushes").innerText = theLevel.pushes
    // document.getElementById("saved").innerText = theLevel.savedPacks
    // document.getElementById("best-moves").innerText = bestMoves
    // document.getElementById("best-pushes").innerText = bestPushes

}


var myGamePiece;
var myObstacles = [];
var myScore;

var objectArray = [];
var size = 64;





function countSavedPackets() {

    theLevel.savedPacks = 0

    for (var y = 0; y < theLevel.rows; y++) {
        for (var x = 0; x < theLevel.columns; x++) {

            var item = theLevel.itemAt(x, y);

            if (item != null && item.value == '*') {
                theLevel.savedPacks += 1;
            }

        }
    }

}


function previousLevel() {

    var runLoop = true

    while (runLoop) {

        levelNumber--

        // var lvl = GetResource('MAPR', levelNumber)
        var lvl = LoadLevelData(levelNumber)


        if (typeof lvl != "undefined") {
            runLoop = false;
        }

    }

    history.pushState(0, "" + levelNumber, "index.html?level=" + levelNumber)

    // setCookie("level", levelNumber)

    // document.getElementById("levelNumber").value = levelNumber

    manager.setup()
}

function nextLevel() {

    var runLoop = true



    while (runLoop) {

        levelNumber++

        // var lvl = GetResource('MAPR', levelNumber)
        var lvl = LoadLevelData(levelNumber)


        if (typeof lvl != "undefined") {
            runLoop = false;
        }

    }

    history.pushState(0, "" + levelNumber, "index.html?level=" + levelNumber)

    // setCookie("level", levelNumber)

    // document.getElementById("levelNumber").value = levelNumber
    // loadLevel(levelNumber)
    manager.setup()
}

function gotoLevel(num) {

    // if (levelNumber == "" ) {
    //     levelNumber = document.getElementById("levelNumber").value
    // } else {
    //     document.getElementById("levelNumber").value = levelNumber
    // }

    loadLevel(num)
}

function loadLevel(level) {

    theLevel = parseXML(level)

    theLevel.addPlayer()
    theLevel.cleanWalls()

    moves = 0
    pushes = 0

    // renderLevel(theLevel)
    isCompleted = (bestMoves != 0)
    // console.log(listCookies())
    levelTitle = theLevel.title
    setWindowTitle()
}


var isCompleted = false
var levelTitle = ""

function getLevelType() {
    let num = levelNumber

    if (201 <= num && num <= 250)
        return "" //Original Levels"
    if (251 <= num && num <= 290)
        return "Extra"
    if (301 <= num && num <= 335)
        return "Still More!"
    if (351 <= num && num <= 411)
        return "Simple Sokoban"
    if (450 <= num && num <= 478)
        return "IQ Carrier"
    if (480 <= num && num <= 645)
        return "Boxxle"
    if (651 <= num && num <= 711)
        return "Dimitri & Yorick"


    return ""
}

function getLevelNumber(type) {
    var number = levelNumber

    switch (type) {
        case "":
            number -= 200
            break;
        case "Extra":
            number -= 250
            break;
        case "Still More!":
            number -= 300
            break;
        case "Simple Sokoban":
            number -= 350
            break;
        case "IQ Carrier":
            number -= 449
            break;
        case "Boxxle":
            number -= 479
            break;
        case "Dimitri & Yorick":
            number -= 650
            break;
    }

    return number
}


function setWindowTitle() {

    var winTitle = "XX-"

    let type = getLevelType()

    winTitle += type
    winTitle += " Level " + getLevelNumber(type)

    if (type == "IQ Carrier" || type == "Dimitri & Yorick") {
        winTitle += ' "' + levelTitle + '"'
    }

    if (isCompleted)
        winTitle += completedStr

    document.getElementById("navTitle").innerText = winTitle

    document.title = winTitle

}


function XOR(a, b) {
    return (a || b) && !(a && b)
}



















