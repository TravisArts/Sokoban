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

    var container = document.getElementById("levels")
    container.innerText = ''

    var storageManager = new LocalStorageManager

    var str = ""


    var i, levelTitle, wrapper, link, layout, name, level, moves
    for (i = startNum; i <= endNum; i++) {


        wrapper = document.createElement("div")
        wrapper.setAttribute("class", "list")

        link = document.createElement("a")
        link.setAttribute("href", "..?level=" + i)

        layout = document.createElement("span")
        layout.setAttribute("class", "soko-room")

        name = document.createElement("div")
        name.setAttribute("class", "levelName")
        layout.innerHTML = getString(i)

        if (type == "IQ Carrier" || type == "Dimitri & Yorick") {
            levelTitle = LoadLevelName(i)
        } else {
            levelTitle = "Level " + (i - startNum + 1)
        }
        name.textContent = levelTitle

        moves = storageManager.getBestScore(i).moves
        // console.log(moves)
        if (moves != 0) {
            // console.log("complete")
            var complete = document.createElement("div")
            complete.setAttribute("class", "completionStar")
            var star = document.createElement("i")
            star.setAttribute("class", "material-icons")
            star.setAttribute("id", "star")
            star.innerText = "star"
            complete.appendChild(star)

            wrapper.appendChild(complete)
        }


        link.appendChild(layout)
        link.appendChild(name)
        wrapper.appendChild(link)
        container.appendChild(wrapper)
    }

}

function setWindowTitle(type) {

    var winTitle = "Sokoban - " + type

    // if (type == "IQ Carrier" || type == "Dimitri & Yorick") {
    //     winTitle += ' "' + levelTitle + '"'
    // }

    // if (isCompleted)
    //     winTitle += completedStr

    document.title = winTitle
}

function getString(i) {


    var theLevel = parseXML(i)

    var text = ""

    for (var y = 0; y < theLevel.rows; y++) {
        for (var x = 0; x < theLevel.columns; x++) {
            var item = theLevel.itemAt(x, y)
            var value = " "
            if (item != null) {
                value = item.value
            }
            if (value != null) {

                text += formatChar(value);
            } else {
                text += "_-"
            }
        }
        text += "<br/>";
        // text += '<span class="soko-indent"> &nbsp; </span>';
    }
    return text
}




function formatChar(s) {
    var r = ""

    var pieceArr = [' ', '$', '.', '@', '+', '*', '?']

    r += '<span piece=' + s + '>' + s + '</span>';
    return r;
}

function mouseOver(sender) {

    sender.style.outline = '#333333'
    sender.style.outlineWidth = 10
    sender.style.outlineStyle = 'solid'
    sender.style.outlineOffset = -10;

    sender.style.border = '10 solid #ff0000'
    // sender.style.backgroundColor = '#333333'
    // sender.getElementsByClassName("levelName")[0].style.color = '#dddddd'
}

function mouseOut(sender) {

    sender.style.outline = '#dddddd'
    sender.style.outlineWidth = 0
    sender.style.outlineStyle = 'none'

    // sender.style.backgroundColor = '#dddddd'
    // sender.getElementsByClassName("levelName")[0].style.color = '#000000'
}