
function swap(x) {
    var c = 16;
    var result = 0;
    result = (x >> c | x << c);
    // return result;

    result = x & 3;
    return result;
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

function hexToDec(s) {
    var arr = new Array();

    var i;
    for (i = 0; i < s.length; i += 2) {
        var str = "0x" + s[i] + s[i + 1]
        var int = parseInt(str, 16);
        arr[i / 2] = int;
        // alert( int);
    }
    return arr;
}
function setObj(returnValue, arr1, i) {

    var index = swap(i)

    var n = (i >> 2)
    n += n;

    var arr = arr1

    switch (index) {
        case 0:
            arr[n] |= rotateByteRight(returnValue, 3) & 0xE0
            break;
        case 1:
            arr[n] |= rotateByteLeft(returnValue, 1) & 0x0E
            break;
        case 2:
            arr[n + 1] |= rotateByteRight(returnValue, 3) & 0xE0
            break;
        case 3:
            arr[n + 1] |= rotateByteLeft(returnValue, 1) & 0x0E
            break;
        default:
            returnValue = 0 - index;
            // console.log(index);
            break;

    }
    // console.log(arr)

    return arr
}

function getObj(i, arr) {

    var returnValue = 0;
    var index = swap(i);

    var n = (i >> 2);
    n += n;
    switch (index) {
        case 0:
            returnValue = rotateByteLeft((arr[n] & 0xE0), 3);
            break;
        case 1:
            returnValue = rotateByteRight((arr[n] & 0x0E), 1);
            break;
        case 2:
            returnValue = rotateByteLeft((arr[n + 1] & 0xE0), 3);
            break;
        case 3:
            returnValue = rotateByteRight((arr[n + 1] & 0x0E), 1);
            break;
        default:
            returnValue = 0 - index;
            console.log(index);
            break;

    }
    // returnValue &= 0xFF;
    return returnValue;
}

function getPacked(i, arr) {
    var result = false;

    var index = swap(i);

    var n = (i >> 2);
    n += n;
    switch (index) {
        case 0:
            result = (arr[n] & 0x10) != 0;
            break;
        case 1:
            result = (arr[n] & 0x01) != 0;
            break;
        case 2:
            result = (arr[n + 1] & 0x10) != 0;
            break;
        case 3:
            result = (arr[n + 1] & 0x01) != 0;
            break;
    }
    return result;
}

function setPacked(i, arr1, condition) {

    var index = swap(i)
    var arr = arr1

    var n = (i >> 2)
    n += n
    switch (index) {
        case 0:
            arr[n] &= ~0x10
            if (condition) {
                arr[n] |= 0x10
            }
            break;
        case 1:
            arr[n] &= ~0x01

            break;
        case 2:
            arr[n + 1] &= ~0x10

            break;
        case 3:
            arr[n + 1] &= ~0x01

            break;
    }
    return

}

// function setPacked(i, param2, param3) {
//     var arr = param3

//     var result = false;

//     var index = swap(i / 4)

//     switch (index) {
//         case 0:
//             D0 = (D7/4) * 2
//             arr[D0 + 6] &= ~(1 << 4)
//             rotateByteLeft(D1, 4)
//             D1 = (D6 & 0x10) | arr[D0 + 6]
//             break;
//         case 1:
//             D0 = (D7 / 4) * 2
//             A4[D0 + 6] &= ~(1 << 0)
//             D1 = (D6 & 1) | A4[D0 + 6]
//             break;
//         case 2:
//             D0 = (D7/4) * 2
//             A4[D0 + 7] &= ~(1 << 4)
//             rotateByteLeft(D6, 4)
//             D1 = (D6 & 0x10) | A4[D0 + 7]
//             break;
//         case 3:
//             D0 = (D7/4) * 2
//             A4[D0 + 7] &= ~(1 << 0)
//             D1 = (D6 & 1) | A4[D0 + 7]
//             break;
//     }





// }

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

    var vji_1;

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
                var D1 = getValue(index, arr)
                vji_1 = D1 + x - 1
                // console.log(D1);
                // while (x <= vji_1) {
                //     lvl.addItem(new SokoPiece({ x: x, y: y }, pieceChar))
                //     x++
                // }

                if (pieceChar != ' ') {
                    for (var i = x; i <= vji_1; i++) {
                        lvl.addItem(new SokoPiece({ x: i, y: y }, pieceChar))
                    }
                }
                x = vji_1
            }
            index++
        }
    }
}

var text = "";




function printLevel(lvl) {

    text = '<span class="soko-room">';
    for (var y = 0; y < lvl.rows; y++) {
        for (var x = 0; x < lvl.columns; x++) {
            var piece = lvl.itemAt(x, y)
            if (piece != null) {
                text += formatChar(piece.value);
            } else {
                text += " "
            }
        }
        text += "<br/>";
    }

    text += '</span>';
}

function getColor(v) {
    var result = "";
    switch (v) {
        case 20:
            result = "lightgray";
            break;
        case 24:
            result = "Indigo";
            break;
        case 12:
            result = "Orange";
            break;
        default:
            result = "black"
            break
    }
    return result;
}

function setChar(v) {
    var result = "";
    switch (v) {
        case " ":
            result = 20;
            break;
        case "#":
            result = 24;
            break;
        case "$":
            result = 12;
            break;
        case ".":
            result = 8;
            break;
        case "@":
            result = 4;
            break;
        case "+":
            result = 28;
            break;
        case "*":
            result = 16;
            break;
        case " ":
            result = 0
            break;
        default:
            result = 24
            // console.log( "getChar failed given value" + v);
            break
    }
    return result;
}

function getChar(v) {
    var result = "";
    switch (v) {
        case 20:
            result = " ";
            break;
        case 24:
            result = "#";
            break;
        case 12:
            result = "$";
            break;
        case 8:
            result = ".";
            break;
        case 4:
            result = "@";
            break;
        case 28:
            result = "+";
            break;
        case 16:
            result = "*";
            break;
        case 0:
            result = " "
            break;
        default:
            result = "?"
            console.log("getChar failed given value" + v);
            break
    }
    return result;
}


function formatChar(s) {
    var r = ""
    var c = "";
    switch (s) {
        case " ":
            c = "floor";
            break;

        case "#":
            c = "wall";
            break;

        case "$":
            c = "treasure";
            break;

        case ".":
            c = "goal";
            break;

        case "@":
            c = "player";
            break;

        case "+":
            c = "player .soko-goal";
            break;

        case "*":
            c = "treasure .soko-goal";
            break;
        case "?":
            c = "unknown";
            break;

    }


    var pieceArr = [' ', '$', '.', '@', '+', '*', '?']

    var isWall = true
    for (i = 0; i < 7; i++) {
        if (s == pieceArr[i]) {
            isWall = false;
        }
    }
    if (isWall == true) {
        r += '<span class="wall" obj-id=' + s + '>' + s + '</span>';
    } else {
        r += '<span class="piece" obj-id=' + s + '>' + s + '</span>';
    }

    // r += '<span class="' + "soko-" + c + '">' + s + '</span>';
    return r;
}





