

var ResFork // = new Document();


function Point(x, y) {
    this.x = x;
    this.y = y;
}


function LoadResFork(name) {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", name + ".xml", false)
    xmlhttp.send()
    // console.log(xmlhttp);
    var xmlDoc = xmlhttp.responseText;
    var parser = new DOMParser();
    ResFork = parser.parseFromString(xmlDoc, "text/xml");
    // console.log(ResFork);
}



function GetResource(theType, ID) {
    var result;

    var typeNodes = ResFork.getElementsByTagName('TypeCode');
    var resources;
    for (var i = 0; i < typeNodes.length; i++) {
        if (typeNodes[i].childNodes[0].nodeValue == theType) {
            resources = typeNodes[i].parentElement;
        }
    }

    var finalResult = ""
    var ResIDs = resources.getElementsByTagName('ResourceID');
    if (resources != undefined) {
        for (var i = 0; i < ResIDs.length; i++) {
            if (ResIDs[i].childNodes[0].nodeValue == ID) {
                result = ResIDs[i].parentElement;
                result = result.getElementsByTagName('ResourceData');
                // result = result[0].childNodes[0].nodeValue;
                if (result[0].childNodes.length > 0) {
                    finalResult = result[0].childNodes[0].nodeValue;
                }
            }
        }
    }
    // result = result.trim();
    // result = result.replace(/(\r\n|\n|\r)/gm,"");
    // result = result.replace(/(\r\n|\n|\r|	)/gm,"");
    // result = result.trim();

    return finalResult;
}


function GetResourceName(theType, ID) {
    var result;

    var typeNodes = ResFork.getElementsByTagName('TypeCode');
    var resources;
    for (var i = 0; i < typeNodes.length; i++) {
        if (typeNodes[i].childNodes[0].nodeValue == theType) {
            resources = typeNodes[i].parentElement;
        }
    }

    var ResIDs = resources.getElementsByTagName('ResourceID');
    if (resources != undefined) {
        for (var i = 0; i < ResIDs.length; i++) {
            if (ResIDs[i].childNodes[0].nodeValue == ID) {
                result = ResIDs[i].parentElement;
                result = result.getElementsByTagName('ResourceName');
                if (result[0].childNodes.length > 0) {
                    result = result[0].childNodes[0].nodeValue;
                } else {
                    result = ""
                }
            }
        }
    }
    return result
}





var allLevels

function LoadAllLevels() {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.overrideMimeType("application/json");

    xmlhttp.open("GET", "./Levels.json", true)
    xmlhttp.send()

    xmlhttp.onreadystatechange = function () {

        // console.log(this.readyState, this.status)

        if (this.readyState == 4 && this.status == 200) {
            allLevels = JSON.parse(this.responseText);
            // console.log(allLevels)
            // manager.setup()
            prepareGame()
            xmlhttp.abort()
        }
    }
}

function LoadMenuLevels(type) {
    var response = "";
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.overrideMimeType("application/json");

    xmlhttp.open("GET", "Levels.json", true)
    xmlhttp.send()

    xmlhttp.onreadystatechange = function () {

        // console.log(this.readyState, this.status)

        if (this.readyState == 4 && this.status == 200) {
            allLevels = JSON.parse(this.responseText);
            // console.log(allLevels)
            // manager.setup()
            loadMenu(type)
            xmlhttp.abort()
        }
    }
}


function LoadLevelData(ID) {
    won = false

    // var finalResult = ""
    // var ResIDs = allLevels.getElementsByTagName('ResourceID');
    // for (var i = 0; i < ResIDs.length; i++) {
    //     if (ResIDs[i].childNodes[0].nodeValue == ID) {
    //         result = ResIDs[i].parentElement;
    //         result = result.getElementsByTagName('ResourceData');
    //         // result = result[0].childNodes[0].nodeValue;
    //         if (result[0].childNodes.length > 0) {
    //             finalResult = result[0].childNodes[0].nodeValue;
    //         }
    //     }
    // }

    return allLevels[ID].data

    // result = result.trim();
    // result = result.replace(/(\r\n|\n|\r)/gm,"");
    // result = result.replace(/(\r\n|\n|\r|	)/gm,"");
    // result = result.trim();

    // return finalResult;
}

function LoadLevelName(ID) {

    return allLevels[ID].name


    // var result

    // var ResIDs = allLevels.getElementsByTagName('ResourceID');
    // for (var i = 0; i < ResIDs.length; i++) {
    //     if (ResIDs[i].childNodes[0].nodeValue == ID) {
    //         result = ResIDs[i].parentElement;
    //         result = result.getElementsByTagName('ResourceName');
    //         if (result[0].childNodes.length > 0) {
    //             result = result[0].childNodes[0].nodeValue;
    //         } else {
    //             result = ""
    //         }
    //     }
    // }
    // return result
}









































