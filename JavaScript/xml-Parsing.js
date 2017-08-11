


function Base64ToDec(s) {
    var arr = new Array();
    var str = window.atob(s);

    for (var i = 0; i < str.length; i++) {
        var char = str[i].charCodeAt(0);
        arr[i] = char;
    }
    return arr;
}

function DecToBase64(arr) {
    var str = ""

    for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i])
    }
    // console.log(str)
    var s = window.btoa(str)
    return s
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
    console.log(level)
    // var arr = Base64ToDec(GetResource('MAPR', level));
    var arr = Base64ToDec(LoadLevelData(level));

    // console.log(arr)
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


































