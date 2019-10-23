function loadMenu(type) {


    if (type == undefined) {
        let qVar = getQueryVariable("collection")
        if (qVar != false) {
            var str = qVar.replace("and", "&")
            console.log('str =' + str)
            loadSubMenu(str)
        } else {
            loadSubMenu('Original Levels')
        }
    } else {
        loadSubMenu(type)
    }
}

function loadSubMenu(type) {

    document.getElementById("menustate").checked = false

    setWindowTitle(type)

    history.pushState(0, "" + type, "?collection=" + type)

    var startNum, endNum, signatureNum = 0

    var collection = collectionDetails.filter(obj => {
        return obj.name === type
    })[0]
    startNum = collection.start
    endNum = collection.end
    signatureNum = collection.signature
    /*
    switch (type) {
        case "Original Levels":     // 49 levels
            startNum = 201
            endNum = 250
            break;
        case "Boxxle":              // 165 levels
            startNum = 480
            endNum = 645
            break;
        case "Dimitri & Yorick":    //  60 levels
            startNum = 651
            endNum = 711
            break;
        case "Extra":               // 39 levels
            startNum = 251
            endNum = 290
            break;
        case "IQ Carrier":          // 28 levels
            startNum = 450
            endNum = 478
            break;
        case "Simple Sokoban":      // 60 levels
            startNum = 351
            endNum = 411
            break;
        case "Still More":          // 34 levels
            startNum = 301
            endNum = 335
            break;
        default:
            return;
    }*/

    var storageManager = new LocalStorageManager

    var container = document.getElementById("levels")
    container.innerHTML = ''

    var sTime = performance ? performance.now() : new Date().getTime();

    var str = ""

    var i, levelTitle

    // var hasName = (type == "IQ Carrier" || type == "Dimitri & Yorick")

    if (signatureNum != 0 && !(startNum <= signatureNum && signatureNum <= endNum)) {
        str += createLevelStr(signatureNum, startNum, storageManager)
    }

    for (i = startNum; i <= endNum; i++) {
        str += createLevelStr(i, startNum, storageManager)
    }
    container.innerHTML += str

    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime - sTime).toFixed(2);
    console.log("loading menu took " + duration + "ms")
}

var complete = '<div class="completion-star"><i class="material-icons" id="star">star</i></div>'

function createLevelStr(num, startNum, storageManager) {
    var i = num

    levelTitle = LoadLevelName(i)
    if (levelTitle == "") {
        levelTitle = "Level " + (i - startNum + 1)
    }

    var arr = Base64ToDec(LoadLevelData(i));

    var columns = arr[1]

    var fontSize = Math.floor(280/columns)

    var wrapper = '<div class=list>'
    
    wrapper += '<a href=..?level=' + i + '><span class=soko-room style="font-size:' + fontSize + 'px;line-height:' + fontSize + 'px;">'
    var highScore = storageManager.getBestScore(i)
    var scoreString = '<div class=menuScore> </div>'
    if (highScore.moves != 0) {
        wrapper += complete
        scoreString = '<div class=menuScore>' + highScore.moves + ' moves, ' + highScore.pushes + ' pushes</div>'
    }
    wrapper += getString(arr)
    wrapper += '</span><div class=levelName>' + levelTitle + '</div>'
    wrapper += scoreString + '</a></div>'
    return wrapper
}

function setWindowTitle(type) {

    var winTitle = "Sokoban - " + type

    document.getElementById("navTitle").innerText = winTitle
    document.getElementById("pageTitle").innerText = winTitle
    document.title = winTitle
}

function getString(arr) {

    // var arr = LoadLevelData(i)

    var rows = arr.shift()
    var columns = arr.shift()
    var packs = arr.shift()
    var savedPacks = arr.shift()
    arr.shift()
    arr.shift()
    // var playerV = arr.shift() - 1
    // var playerH = arr.shift() - 1

    var i = 0

    var x, y, lx = columns
    var ly = rows

    // console.log(arr)
    var text = ""
    for (y = 0; y < ly; y++) {
        for (x = 0; x < lx; x++) {

            var piece = getPiece(i, arr)
            var pieceChar = characterArr[piece.value]//getChar(piece.value)
            var value = formatChar(pieceChar)
            text += value
            if (piece.packed == true) {
                i++
                var count = x + getValue(i, arr) - 1

                while (++x <= count) {
                    text += value
                }
                x--
            }
            i++
        }
        text += "<br/>";
    }

    return text
}

function formatChar(s) {
    if (characterArr.includes(s)) {
        if (s == ".") {
            return '<span piece=' + s + '>' + "*" + '</span>'
        }
        return '<span piece=' + s + '>' + s + '</span>'
    }
    return '<span piece=' + s + ' class="wall">' + s + '</span>'
}

var loaded = false
function loadMainMenu() {
    if (loaded == true) {
        return
    }
    loaded = true
    var container = document.getElementById("levels")

    var sTime = performance ? performance.now() : new Date().getTime();

    var str = ""
    for (let i = 0; i < collectionDetails.length; i++) {
        const collection = collectionDetails[i];
        var num = (collection.signature == 0) ? collection.start : collection.signature
        var name = collection.name

        var arr = Base64ToDec(LoadLevelData(num));
        var columns = arr[1]
        var fontSize = Math.floor(280/columns)

        console.log(encodeURIComponent(name))
        
        var wrapper = '<div class=list>'
        wrapper += '<a href=..?collection=' + encodeURIComponent(name) + '><span class=soko-room style="font-size:' + fontSize + 'px;line-height:' + fontSize + 'px;">'

        var lvl = new LevelStruct(arr, name)
        unpackLevel(lvl)
        lvl.cleanWalls()

        wrapper += getMainString(lvl)
        wrapper += '</span><div class=levelName>' + name + '</div></a></div>'
        str += wrapper
    }
    console.log(str)

    container.innerHTML += str


    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime - sTime).toFixed(2);
    console.log("loading menu took " + duration + "ms")
}

function getMainString(lvl) {
    var i = 0

    var x, y, lx = lvl.columns
    var ly = lvl.rows

    var text = ""
    for (y = 0; y < ly; y++) {
        for (x = 0; x < lx; x++) {

            var piece = lvl.itemAt(x, y) //getPiece(i, arr)
            var pieceChar = " "  //getChar(piece.value)
            if (piece != null) {
                pieceChar = piece.value
            }
            var value = formatChar(pieceChar)
            text += value
        }
        text += "<br/>";
    }

    return text
}