
function swap(x) {
    return x & 3;
}

function rotateByteRight(x, c) {
    var result = 0;
    var l = x >> (8 - c);
    var h = x << c;
    l &= 0xFF;
    h &= 0xFF;
    result = h | l;
    return result;
}

function rotateByteLeft(x, c) {
    var result = 0;
    var l = x >> c;
    var h = x << (8 - c);
    l &= 0xFF;
    h &= 0xFF;
    result = h | l;
    return result;
}

function getObj(i, arr) {

    var n = (i >> 2) * 2;
    switch (index = swap(i)) {
        case 0:
            return rotateByteLeft((arr[n] & 0xE0), 3);
            break;
        case 1:
            return rotateByteRight((arr[n] & 0x0E), 1);
            break;
        case 2:
            return rotateByteLeft((arr[n + 1] & 0xE0), 3);
            break;
        case 3:
            return rotateByteRight((arr[n + 1] & 0x0E), 1);
            break;
        default:
            console.log(index);
            return 0 - index;
            break;

    }
}

function getPacked(i, arr) {
    var n = (i >> 2) * 2
    switch (swap(i)) {
        case 0:
            return (arr[n] & 0x10) != 0;
            break;
        case 1:
            return (arr[n] & 0x01) != 0;
            break;
        case 2:
            return (arr[n + 1] & 0x10) != 0;
            break;
        case 3:
            return (arr[n + 1] & 0x01) != 0;
            break;
        default:
            return false;
            break;
    }
}



function getValue(i, arr) {
    var result = 0;

    var index = swap(i);

    var n = (i >> 2);
    n += n;
    // console.log( n );
    switch (index) {
        case 0:
            result = rotateByteRight((0xF0 & arr[n]), 4);
            break;
        case 1:
            result = (0x0F & arr[n])
            break;
        case 2:
            result = rotateByteRight((0xF0 & arr[n + 1]), 4);
            break;
        case 3:
            result = (0x0F & arr[n + 1]);
            break;
    }

    return result;
}

function unpackLevel(lvl) {
    var index = 0;
    var arr = lvl.rawData
    lvl.objArr = lvl.empty()

    for (var y = 0; y < lvl.rows; y++) {
        for (var x = 0; x < lvl.columns; x++) {

            var pieceChar = getChar(getObj(index, arr))
            if (pieceChar != ' ') {
                lvl.addItem(new SokoPiece({ x: x, y: y }, pieceChar))
            }
            if (getPacked(index, arr) == true) {
                index++
                var count = getValue(index, arr) + x - 1

                if (pieceChar != ' ') {
                    for (var i = x; i <= count; i++) {
                        lvl.addItem(new SokoPiece({ x: i, y: y }, pieceChar))
                    }
                }
                x = count
            }
            index++
        }
    }
}

function getChar(v) {
    switch (v) {
        case 20:
            return " ";
            break;
        case 24:
            return "#";
            break;
        case 12:
            return "$";
            break;
        case 8:
            return ".";
            break;
        case 4:
            return "@";
            break;
        case 28:
            return "+";
            break;
        case 16:
            return "*";
            break;
        case 0:
            return " "
            break;
        default:
            return "?"
            break
    }
}

var allLevels

function LoadAllLevels() {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", "./Levels.json", true)
    xmlhttp.send()

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            allLevels = JSON.parse(this.responseText);
            prepareGame()
            xmlhttp.abort()
        }
    }
}

function LoadMenuLevels(type) {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", "../Levels.json", true)
    xmlhttp.send()

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            allLevels = JSON.parse(this.responseText);
            loadMenu(type)
            xmlhttp.abort()
        }
    }
}

function LoadLevelData(ID) {
    return allLevels[ID] ? allLevels[ID].data : null
}

function LoadLevelName(ID) {
    return allLevels[ID] ? allLevels[ID].name : null
}


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleResponse(e) {
    console.log("click")
    e.classList.toggle("change");
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function Base64ToDec(s) {
    var arr = new Array();
    var str = window.atob(s);

    for (var i = 0; i < str.length; i++) {
        var char = str[i].charCodeAt(0);
        arr[i] = char;
    }
    return arr;
}

function XmlHandle(e) {
    if (e.keyCode === 13) {
        e.preventDefault() // Ensure it is only this code that rusn

        // alert("Enter was pressed was pressed");
        levelNumber = document.getElementById("levelNumber").value
        loadLevel(levelNumber)
    }
}

function parseXML(level) {

    var arr = Base64ToDec(LoadLevelData(level));
    var title = LoadLevelName(level)
    var lvl = new LevelStruct(arr, title)
    var arr2 = arr.slice(6, arr.count)
    unpackLevel(lvl)

    return lvl
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        console.log(vars[i])
        if (pair[0] == variable) {

            var string = pair[1]
            string.replace('%20', ' ')
            string = window.decodeURIComponent(pair[1])
            console.log(string)
            return string
        }
    }
    return (false);
}



