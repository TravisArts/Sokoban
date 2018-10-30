


var won = false
var pieceWidth = 0;

function SokobanManager(InputManager, Actuator, StorageManager) {


    this.inputManager = new InputManager
    this.storageManager = new StorageManager
    this.actuator = new Actuator;

    this.mute = false
    this.pastStates = new Array()
    this.nextStates = new Array()

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("toggleMute", this.toggleMute.bind(this))
    this.inputManager.on("redo", this.redo.bind(this))
    this.inputManager.on("undo", this.undo.bind(this))
    // this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
}

SokobanManager.prototype.setup = function () {
	var sTime = performance ? performance.now() : new Date().getTime();

    history.pushState(0, "" + levelNumber, "?level=" + levelNumber)
    setCookie("level", levelNumber)

    var previousState = this.storageManager.getGameState(levelNumber);

    this.mute = (getCookie("mute") != "true") ? true : false
    this.toggleMute()
    // this.storageManager.updateScoreStorage()

    var bestScore = this.storageManager.getBestScore(levelNumber)
    bestMoves = bestScore.moves
    bestPushes = bestScore.pushes
    // console.log(previousState)

    // Reload the game from a previous game if present
    if (previousState != null) {


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
            for (var y = 0; y < theLevel.rows; y++) {
                var value = previousState.objArr[x][y]
                if (value != null) {
                    theLevel.addItem(new SokoPiece({ x: x, y: y }, value))
                }
            }
        }
        // var playerPosition = { x: theLevel.playerH, y: theLevel.playerV }
        // theLevel.player = theLevel.itemAt(playerPosition)
        theLevel.addPlayer()
        // new SokoPiece(playerPosition, '@')



        isCompleted = (bestMoves != 0)
        // console.log(listCookies())
        theLevel.title = LoadLevelName(levelNumber)
        setWindowTitle()


    } else {

        gotoLevel(levelNumber);

    }

    this.pastStates = []
    this.nextStates = []

    this.actuator.clearContainer(this.actuator.gameContainer)
    this.actuator.clearContainer(this.actuator.wallContainer)

    this.setStyles()

    setupPathFinding()

    // Update the actuator
    this.actuator.actuateWalls(theLevel)
    this.actuate(true)

    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime - sTime).toFixed(2);

    console.log(duration)
    // if (isMobile) {
    //     drawNavigation()
    // }
}

SokobanManager.prototype.clearStyle = function () {
    document.getElementById("dynamicStyle").innerText = ""
}

SokobanManager.prototype.setStyles = function () {

    var style = document.getElementById("dynamicStyle")

    if (style == null) {
        style = document.createElement('style')
        style.setAttribute("id", "dynamicStyle")
        document.head.appendChild(style)
    }
    var stylesheet = style.sheet


    var topnav = document.getElementById("myTopnav")
    var buttons = document.getElementsByClassName("button-space")[0]
    var stats = document.getElementsByClassName("stats")[0]
    var dPad = document.getElementById("dPad")
    var footer = document.getElementsByClassName("navigation-footer")[0]
    var gameArea = document.getElementsByClassName("gameArea")[0]
    
    console.log(isMobile)
    var usedHeight
    var availableWidth
    if (dPad.offsetParent === null) {
        if (isMobile) {
            usedHeight = topnav.offsetHeight + stats.offsetHeight
            availableWidth = window.innerWidth - 100

        } else {
            usedHeight = topnav.offsetHeight + buttons.offsetHeight + stats.offsetHeight + footer.offsetHeight
            availableWidth = gameArea.getBoundingClientRect().width
        }
    } else {
        usedHeight = topnav.offsetHeight + buttons.offsetHeight + stats.offsetHeight + dPad.offsetHeight
        availableWidth = gameArea.getBoundingClientRect().width

    }

    // console.log(topnav.offsetHeight + ", " + buttons.offsetHeight + ", " + stats.offsetHeight + ", " + dPad.offsetHeight)
    // console.log(topnav.getBoundingClientRect().height + ", " + buttons.getBoundingClientRect().height + ", " + stats.getBoundingClientRect().height + ", " + dPad.getBoundingClientRect().height)
    // usedHeight = topnav.offsetHeight + buttons.offsetHeight + stats.offsetHeight + dPad.offsetHeight
    var availableHeight = window.innerHeight - usedHeight - 45

    // console.log("body: " + document.getElementsByClassName("gameArea")[0].offsetHeight + ", available: " + availableHeight)
    var height = availableHeight / (theLevel.rows)
    var width = availableWidth / (theLevel.columns)
    
    console.log("width: " + width.toFixed(2) + " height: " + height.toFixed(2))

    pieceWidth = (width < height) ? width : height

    var size = 'font-size:' + (pieceWidth + 1) + 'px;'
    var heightStr = 'height:' + pieceWidth * theLevel.rows + 'px;'
    var widthStr = 'width:' + pieceWidth * theLevel.columns + 'px;'

    var styleString = '.drag {' + size + '}'
    styleString += '.GameBoard {' + size + heightStr + widthStr + '}'

    for (var x = 0; x < theLevel.columns; x++) {
        styleString += '.x-' + x + '{left: ' + (pieceWidth * x) + 'px;}'
    }
    for (var y = 0; y < theLevel.rows; y++) {
        styleString += '.y-' + y + '{top: ' + (pieceWidth * (y + 0.5)) + 'px;}'
    }

    
    styleString += ".gameArea { top:" + window.getComputedStyle(topnav).height + "; }"

    style.innerText = styleString
}


// Move tiles on the grid in the specified direction
SokobanManager.prototype.move = function (direction, shouldSave) {
    
    var self = this;

    var cell, tile;

    var vector = this.getVector(direction);

    theLevel.eachCell(function (x, y, piece) {
        var pieceArr = ['$', '@', '+', '*', '?']


        if (piece != null) {
            piece.savePosition()
        }
    })


    var player = theLevel.player
    var nextPosition = { x: player.x + vector.x, y: player.y + vector.y }
    var playerPosition = { x: player.x, y: player.y }

    var item = theLevel.itemAt(nextPosition)

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
        this.play("walk")
        this.movePiece(player, nextPosition)
        theLevel.moves++
    }

    this.nextStates = []
    
    if (shouldSave == null) {
        this.actuate(true)
    } else {
        this.actuate(shouldSave)
    }

};

// Move a piece and its representation
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
            this.play("push-out")
        }
    }

    if (willBeOnGoal) {
        if (piece.value == '*' || piece.value == '$') {
            this.play("push-in")
        }
    } else if (!onGoal) {
        if (piece.value == '$') {
            this.play("push")
        }
    }

    piece.updatePosition(cell);
    theLevel.addItem(piece)

    if (onGoal) {
        theLevel.addItem(new SokoPiece(position, '.'))
    } else {
        theLevel.objArr[position.x][position.y] = null;
    }

    setupPathFinding()

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

SokobanManager.prototype.play = function (sound) {
    if (!this.mute) {
        ion.sound.play(sound)
    }
}

SokobanManager.prototype.restart = function () {
    this.storageManager.clearGameState(levelNumber)
    // TODO: uncomment these lines
    // might speed up resets

    console.log("restart")
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
SokobanManager.prototype.actuate = function (shouldSave) {
    // if (this.storageManager.getBestScore() < this.score) {
    //     this.storageManager.setBestScore(this.score);
    // }

    // Clear the state when the game is over (game over only, not win)
    // if (this.over) {
    //     this.storageManager.clearGameState();
    // } else {

    countSavedPackets()

    if (shouldSave) {
        var serial = theLevel.serialize()
        // console.log(serial)
        if (theLevel.moves > 0) {
            this.storageManager.setGameState(serial, levelNumber);
        }
        this.pastStates.push(serial)
    }

    this.actuator.actuate(theLevel)
    // this.actuator.actuate(foo, {
    //     moves: theLevel.moves,
    //     pushes: theLevel.pushes,
    //     saved: theLevel.saved
    // })

    if (theLevel.savedPacks == theLevel.packs) {

        // var cookieTitle = "level" + levelNumber
        // setCookie(cookieTitle, true)

        var self = this

        setTimeout(function () {

            var newBestMoves = bestMoves > theLevel.moves || bestMoves == 0
            var newBestPushes = bestPushes > theLevel.pushes || bestPushes == 0

            if (newBestMoves || newBestPushes) {
                var moves = newBestMoves ? theLevel.moves : bestMoves
                var pushes = newBestPushes ? theLevel.pushes : bestPushes
                self.storageManager.setBestScore(theLevel.moves, theLevel.pushes, levelNumber)
            }
            self.storageManager.clearGameState(levelNumber)

            self.showCompletion()
        }, 100);

        console.log("you win")



    }
    if (this.pastStates.length == 1) {
        document.querySelector(".undo-button").classList.add("unavailable")
    } else if (this.pastStates.length == 2) {
        document.querySelector(".undo-button").classList.remove("unavailable")
    }

    if (this.nextStates.length == 0) {
        document.querySelector(".redo-button").classList.add("unavailable")
    } else if (this.nextStates.length == 1) {
        document.querySelector(".redo-button").classList.remove("unavailable")
    }
};

SokobanManager.prototype.toggleMute = function () {

    this.mute = !this.mute
    var button = document.getElementById("mute-icon")
    if (this.mute) {
        button
        button.innerHTML = "volume_off"
        // button.setAttribute("-webkit-mask-box-image", "url('Buttons/mute.png')")
    } else {
        button.innerHTML = "volume_up"
        // button.attributes["webkit-mask-box-image"] = "url('Buttons/unmute.png')"
        // button.setAttribute("-webkit-mask-box-image", "url('Buttons/unmute.png')")        
    }
    setCookie("mute", this.mute)
}

SokobanManager.prototype.undo = function () {
    console.log("undo")
    // console.log("undo " + performance.now().toFixed(2) + "ms")
    var previousState = this.pastStates.pop()
    this.nextStates.push(previousState)
    previousState = this.pastStates.pop()
    // console.log(previousState)
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
            for (var y = 0; y < theLevel.rows; y++) {
                var value = previousState.objArr[x][y]
                if (value != null) {
                    theLevel.addItem(new SokoPiece({ x: x, y: y }, value))
                }
            }
        }
        // var playerPosition = { x: theLevel.playerH, y: theLevel.playerV }
        // theLevel.player = new SokoPiece(playerPosition, '@')
        theLevel.addPlayer()

        setupPathFinding()
        isCompleted = (bestMoves != 0)
        this.actuate(true)
    }

}

SokobanManager.prototype.redo = function () {
    console.log("redo")
    var redoState = this.nextStates.pop()
    if (redoState) {

        theLevel = new LevelStruct([0, 0, 0, 0, 0, 0, 0], redoState.title)
        theLevel.rows = redoState.rows
        theLevel.columns = redoState.columns
        theLevel.packs = redoState.packs
        theLevel.savedPacks = redoState.savedPacks
        theLevel.playerV = redoState.playerV
        theLevel.playerH = redoState.playerH

        theLevel.pushes = redoState.pushes
        theLevel.moves = redoState.moves

        // theLevel.objArr = redoState.objArr
        theLevel.objArr = theLevel.empty()

        for (var x = 0; x < theLevel.columns; x++) {
            for (var y = 0; y < theLevel.rows; y++) {
                var value = redoState.objArr[x][y]
                if (value != null) {
                    theLevel.addItem(new SokoPiece({ x: x, y: y }, value))
                }
            }
        }
        // var playerPosition = { x: theLevel.playerH, y: theLevel.playerV }
        // theLevel.player = new SokoPiece(playerPosition, '@')
        theLevel.addPlayer()

        setupPathFinding()
        isCompleted = (bestMoves != 0)
        this.actuate(true)
    }
}

SokobanManager.prototype.showCompletion = function () {

   setWindowTitle()

    document.getElementById('completion-moves').innerText = theLevel.moves + " moves"
    document.getElementById('completion-pushes').innerText = theLevel.pushes + " pushes"


    var modal = document.getElementById('completion-modal')
    var closeD = document.getElementById('completion-closeD')
    var closeM = document.getElementById('completion-closeM')
    var share = document.getElementById('completion-share')
    var nextD = document.getElementById('completion-nextD')
    var nextM = document.getElementById('completion-nextM')

    modal.style.display = "block"

    closeD.onclick = function () {
        modal.style.display = "none"
    }
    closeM.onclick = function () {
        modal.style.display = "none"
    }

    nextD.onclick = function () {
        modal.style.display = "none"
        nextLevel()
    }
    nextM.onclick = function () {
        modal.style.display = "none"
        nextLevel()
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none"
        }
    }

    // history.pushState(0, "" + levelNumber, "?level=" + levelNumber)
    // nextLevel()

}




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
        { name: "push-in" },
        { name: "push-out" },
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


// function move(yofs, xofs) {
//     var xPos = 0;
//     var yPos = 0;

//     PlayerH = theLevel.playerH
//     PlayerV = theLevel.playerV

//     xPos = PlayerH + xofs;
//     yPos = PlayerV + yofs;

//     var item = theLevel.itemAt(xPos, yPos);
//     var oldItem = theLevel.itemAt(PlayerH, PlayerV);
//     // console.log( "was: " + itemAt( xPos, yPos ) + ", " + itemAt( PlayerH, PlayerV ) + " location : " + PlayerH + ", " + PlayerV);

//     // console.log(item);


//     var didMove = false;
//     var didPush = false;

//     undoBuffer.push(theLevel.objArr)

//     /* empty */
//     if (item == ' ') {
//         theLevel.addItem(xPos, yPos, '@');
//         if (oldItem == '@') {
//             theLevel.addItem(PlayerH, PlayerV, ' ');
//         } else if (oldItem == '+') {
//             theLevel.addItem(PlayerH, PlayerV, '.');
//         }

//         ion.sound.play("walk")

//         didMove = true
//     }

//     /* goal */
//     if (item == '.') {
//         theLevel.addItem(xPos, yPos, '+');
//         if (oldItem == '@' /* player */) {
//             theLevel.addItem(PlayerH, PlayerV, ' '); /* empty */
//         } else if (oldItem == '+' /* player on goal */) {
//             theLevel.addItem(PlayerH, PlayerV, '.'); /* goal */
//         }

//         ion.sound.play("walk")

//         didMove = true


//     }

//     /*treasure*/
//     if (item == '$') {
//         var nextItem = theLevel.itemAt(xPos + xofs, yPos + yofs);

//         /* empty or goal */
//         if (nextItem == ' ' || nextItem == '.') {


//             if (oldItem == '@'/* player */) {
//                 theLevel.addItem(PlayerH, PlayerV, ' ');
//             } else if (oldItem == '+' /* player on goal */) {
//                 theLevel.addItem(PlayerH, PlayerV, '.');
//             }

//             theLevel.addItem(xPos, yPos, '@');

//             if (nextItem == ' ' /* empty */) {
//                 theLevel.addItem(xPos + xofs, yPos + yofs, '$');
//                 ion.sound.play("push")
//             } else if (nextItem == '.' /* goal */) {
//                 theLevel.addItem(xPos + xofs, yPos + yofs, '*'); // treasure on goal;
//                 ion.sound.play("push in")
//             }

//             didMove = true
//             didPush = true
//         }
//     }

//     /* treasure on goal */
//     if (item == '*') {
//         var otherItem = theLevel.itemAt(xPos + xofs, yPos + yofs);
//         if (otherItem == ' ' || otherItem == '.') {
//             if (oldItem == '@') {
//                 theLevel.addItem(PlayerH, PlayerV, ' ');
//             } else if (oldItem == '+') {
//                 theLevel.addItem(PlayerH, PlayerV, '.');
//             }

//             theLevel.addItem(xPos, yPos, '+');

//             if (otherItem == ' ' /* empty */) {
//                 ion.sound.play("push out")

//                 theLevel.addItem(xPos + xofs, yPos + yofs, '$'); // tresure
//             } else if (otherItem == '.' /* goal */) {
//                 theLevel.addItem(xPos + xofs, yPos + yofs, '*'); // treasure on goal;
//                 ion.sound.play("push in")
//             }

//             didMove = true
//             didPush = true
//         }
//     }

//     if (didMove) {
//         theLevel.playerH += xofs
//         theLevel.playerV += yofs
//         theLevel.moves++
//     } else {
//         undoBuffer.pop()
//     }

//     if (didPush) {
//         theLevel.pushes++
//     }



//     countSavedPackets()
// }




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

    // while (runLoop) {

    //     levelNumber--

    //     var lvl = LoadLevelData(levelNumber)


    //     if (typeof lvl != "undefined") {
    //         runLoop = false;
    //     }

    // }
    var lvl = null

    while (lvl == null) {

        levelNumber--

        lvl = LoadLevelData(levelNumber)

    }
    manager.clearStyle()
    manager.setup()
}

function nextLevel() {

    var runLoop = true


    won = false

    var lvl = null

    while (lvl == null) {

        levelNumber++

        lvl = LoadLevelData(levelNumber)

    }

    history.pushState(0, "" + levelNumber, "?level=" + levelNumber)

    // setCookie("level", levelNumber)
    manager.clearStyle()
    manager.setup()
}

function gotoLevel(num) {
    loadLevel(num)
}

function loadLevel(level) {

    theLevel = parseXML(level)

    theLevel.addPlayer()
    theLevel.cleanWalls()

    moves = 0
    pushes = 0

    isCompleted = (bestMoves != 0)
    // console.log(listCookies())
    setWindowTitle()
}


var isCompleted = false
var eventLabel

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

    let type = getLevelType()

    var levelTitle = type //+ " Level " + getLevelNumber(type)
    var pageTitle = type

    if (type != "") {
        levelTitle += " "
        pageTitle += '<br>'
    }
    if (type == "IQ Carrier" || type == "Dimitri & Yorick") {
        levelTitle += ' "' + theLevel.title + '"'
        pageTitle += '"' + theLevel.title + '"'
    } else {
        levelTitle += "Level " + getLevelNumber(type)
        pageTitle += "Level " + getLevelNumber(type)
    }

    var winTitle = levelTitle

    document.getElementById("navTitle").innerText = winTitle
    document.getElementById("pageTitle").innerHTML = pageTitle
    document.getElementById('completion-title').innerHTML = pageTitle

    // document.querySelector('meta[property="og:title"]').setAttribute("content", levelTitle);

    if (isCompleted)
        winTitle += completedStr

    document.title = winTitle

    eventLabel = levelTitle + " (" + levelNumber + ")"
}



function XOR(a, b) {
    return (a || b) && !(a && b)
}

function loadMenu(type) {
    window.location.href = "Menu/?collection=" + type
}

















