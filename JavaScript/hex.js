let characterArr = ["@","+",".","$","*"," ","#"]
function getChar(v) {
    return characterArr[v]
}

function swap(x) {
    return x & 3;
}

function rotateByteLeft(x, c) {
    var l = x >> (8 - c)
    var h = x << c
    return (h | l) & 0xFF
}

function rotateByteRight(x, c) {
    var l = x >> c
    var h = x << (8 - c)
    return (h | l) & 0xFF
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

function getPiece(i, arr) {
    var n = (i >> 2) * 2;
    
    var object = {}

    switch (index = swap(i)) {
        case 0:
            object.value = rotateByteLeft((arr[n] & 0xE0), 3);
            object.packed = (arr[n] & 0x10) != 0;
            break;
        case 1:
            object.value = rotateByteRight((arr[n] & 0x0E), 1);
            object.packed = (arr[n] & 0x01) != 0;
            break;
        case 2:
            object.value = rotateByteLeft((arr[n + 1] & 0xE0), 3);
            object.packed = (arr[n + 1] & 0x10) != 0;
            break;
        case 3:
            object.value = rotateByteRight((arr[n + 1] & 0x0E), 1);
            object.packed = (arr[n + 1] & 0x01) != 0;
            break;
    }
    return object
}

function getValue(i, arr) {
    var n = (i >> 2) * 2;

    // console.log( n );
    switch (swap(i)) {
        case 0:
            return rotateByteRight((arr[n] & 0xF0), 4);
            break;
        case 1:
            return (arr[n] & 0x0F)
            break;
        case 2:
            return rotateByteRight((arr[n + 1] & 0xF0), 4);
            break;
        case 3:
            return (arr[n + 1] & 0x0F);
            break;
    }
}

function unpackLevel(lvl) {
    var i = 0
    var arr = lvl.rawData
    lvl.objArr = lvl.empty()

    var x, y, lx = lvl.columns
    var ly = lvl.rows
    
    for (y = 0; y < ly; y++) {
        for (x = 0; x < lx; x++) {
            var piece = getPiece(i, arr)
            var pieceChar = getChar(piece.value)
            if (pieceChar != ' ') {
                lvl.addItem(new SokoPiece({ x: x, y: y }, pieceChar))
            }
            if (piece.packed == true) {
                i++
                var count = x + getValue(i, arr) - 1

                if (pieceChar != ' ') {
                    while (++x <= count) {
                        if (x < lx) {
                            lvl.addItem(new SokoPiece({ x: x, y: y }, pieceChar))
                        }
                    }
                    x--
                } else {
                    x = count
                }
            }
            i++
        }
    }

}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleResponse() {
    console.log("click")
    document.getElementById("expand").classList.toggle("change");
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function Base64ToDec(s) {
    var arr = []
    var str = window.atob(s);

    var i, li = str.length
    for (i = 0; i < li; i++) {
        arr[i] = str[i].charCodeAt(0);
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
    // var arr2 = arr.slice(6, arr.count)
    unpackLevel(lvl)

    return lvl
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1).replace(/\//g,'');
    var vars = query.split("+");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        if (pair[0] == variable) {

            var string = pair[1]
            string.replace('%20', ' ')
            string = window.decodeURIComponent(pair[1])
            return string
        }
    }
    return (false);
}

function handleResponse(responseText) {
    var json = JSON.parse(responseText);
    allLevels = json.allLevels//["allLevels"]
    collectionDetails = json["collectionDetails"]
    prepareGame()
    xmlhttp.abort()
}


var allLevels
var collectionDetails

function LoadAllLevels() {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", "./Levels.json", true)
    xmlhttp.send()


    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            handleResponse(this.responseText)
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
            var json = JSON.parse(this.responseText);
            allLevels = json["allLevels"]
            collectionDetails = json["collectionDetails"]
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

function getLevelType(ID) {
    var num = ID
    for (let i = 0; i < collectionDetails.length; i++) {
        const collection = collectionDetails[i];

        if ((collection.start <= num && num <= collection.end) || num == collection.signature) {
            return collection.name
        }
    }
    return ""
}

function getLevelNumber(type, num) {
    var start = collectionDetails.filter(obj => {
        return obj.name === type
    })[0].start
    console.log(num - start)
    return num - start + 1
}