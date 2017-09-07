function loadMenu(type) {

    // var i
    // for (i = 0; i < 712; i++) {

    // 	var data = LoadLevelData(i)
    // 	if (data != null) {
    // 		allLevels[i].data = Base64ToDec(data);
    // 	}
    // }


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

    setWindowTitle(type)

    history.pushState(0, "" + type, "?collection=" + type)

    var startNum, endNum = 0

    switch (type) {
        case "Original Levels":
            startNum = 201
            endNum = 250
            break;
        case "Boxxle":
            startNum = 480
            endNum = 645
            break;
        case "Dimitri & Yorick":
            startNum = 651
            endNum = 711
            break;
        case "Extra":
            startNum = 251
            endNum = 290
            break;
        case "IQ Carrier":
            startNum = 450
            endNum = 478
            break;
        case "Simple Sokoban":
            startNum = 351
            endNum = 441
            break;
        case "Still More":
            startNum = 301
            endNum = 335
            break;
        default:
            return;
    }

    var storageManager = new LocalStorageManager

    var container = document.getElementById("levels")
    container.innerHTML = ''

    var sTime = performance ? performance.now() : new Date().getTime();

    var str = ""

    var complete = '<div class="completion-star"><i class="material-icons" id="star">star</i></div>'
    var i, levelTitle

    var hasName = (type == "IQ Carrier" || type == "Dimitri & Yorick")


    for (i = startNum; i <= endNum; i++) {

        if (hasName) {
            levelTitle = LoadLevelName(i)
        } else {
            levelTitle = "Level " + (i - startNum + 1)
        }


        var wrapper = '<div class=list>'
        if (storageManager.getBestScore(i).moves != 0) {
            wrapper += complete
        }

        wrapper += '<a href=..?level=' + i + '><span class=soko-room>'
        wrapper += getString(i)
        wrapper += '</span><div class=levelName>' + levelTitle + '</div></a></div>'

        str += wrapper
    }
    container.innerHTML = str

    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime - sTime).toFixed(2);
    console.log("loading menu took " + duration + "ms")
}

function setWindowTitle(type) {
    document.title = "Sokoban - " + type
}

function getString(i) {

    var arr = Base64ToDec(LoadLevelData(i));
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
    return '<span piece=' + s + '>' + s + '</span>'
}
