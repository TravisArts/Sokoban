


var tableWidth = 0



function loadMenu(type) {

    // LoadResFork( "Sokoban");

    // LoadAllLevels()

    let qVar = getQueryVariable("collection")
    if ( qVar != false ) {
        var str = qVar.replace("and", "&")
        console.log( 'str =' + str)
        loadSubMenu(str)
    } else {
        loadSubMenu(type)
    }
    // document.getElementById("levels").innerHTML = str

}

function loadSubMenu(type) {

    setWindowTitle(type)

    var startNum = 0
    var endNum = 0

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


    var xIndex = 0;
    tableWidth = getTableWidth()


    var str = "" 
    for( var i = startNum; i <= endNum; i++ ){
        // if (xIndex == tableWidth) {
        //     str += "</>\n<tr>"
        //     xIndex = 0
        // }

        // str += "<td onClick=prepareForLevel(" + i +")>"
        str += "<div class=list> <a href= '..?level=" + i + "'>"
        str += "<span class='soko-room'>"
        str += getString(i)
        str += "</span>"

        str += "<div class=levelName> "
        if (type == "IQ Carrier" || type == "Dimitri & Yorick") {
            let levelTitle = GetResourceName('MAPR', i)
            str += levelTitle
        } else {
            str += "Level " + ( i - startNum + 1)
        }
        str += "</div>"


        
        str += "</a>"
        str += "</input>"

        str += "</div>"

        xIndex++
    }

    document.getElementById("levels").innerHTML = str
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

function getTableWidth() {
    
    let width = window.innerWidth
    let body = document.getElementById('body')
    let fontSize = 0.5 * parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'))
    
    var xFloat = width / ( (4 + fontSize) * 20) 
    var x = Math.round( xFloat + 0.5 ) - 1
    
    console.log(xFloat)
    console.log(x)
    return x
}


function windowDidResize() {

    var width = getTableWidth()
    
    if ( width != tableWidth ) {
         tableWidth = width
         reformatTable()
    }
}

function reformatTable() {

    var levels = document.getElementsByTagName("td")

    var str = "" 
    for( var i = 0; i < levels.length; i++ ) {
        if (i != 0 &&  i%tableWidth == 0) {
            str += "</tr>\n<tr>"
        }
        str += "<td onmouseover='mouseOver(this)' onmouseout='mouseOut(this)' >" + levels[i].innerHTML + "</td>"
    }
    document.getElementById("levels").innerHTML = str

}

function getString(i) {


    var theLevel = parseXML(i)

    var text = ""

    for (var y = 0; y < theLevel.rows; y++) {
        for ( var x = 0; x < theLevel.columns; x++) {
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

    var pieceArr = [' ','$','.','@','+','*','?']

    var isWall = true
    for (i = 0; i < 7; i++) {
        if ( s == pieceArr[i] ) {
            isWall = false;
        }
    }
    if (isWall == true){
        r += '<span class="wall" piece=' + s + '>' + s + '</span>';
    } else {
        r += '<span piece=' + s + '>' + s + '</span>'; 
    }
    return r;
}

function mouseOver(sender) {

    sender.style.outline=  '#333333'
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