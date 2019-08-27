//
// variables
//

const types = {
    ROOM: 'room',
    TUNNEL: 'tunnel',
    WALL: 'wall'
}

//
// objects
//

function Space (x, y, vacant) {
    this.x = x
    this.y = y
    this.vacant = vacant
    this.type
    this.assignment
}

Space.prototype.classify = function() {
//    var objArr = theLevel.objArr
    var value = theLevel.itemAt(x, y).value
    if ( value == "#" ) {
        this.type = types.wall
    } else {
        var u = theLevel.itemAt(x, y).value == "#"
        var d = theLevel.itemAt(x, y).value == "#"
        var r = theLevel.itemAt(x, y).value == "#"
        var l = theLevel.itemAt(x, y).value == "#"
//        var u = objArr[x][y-1].value == "#"
//        var d = objArr[x][y+1].value == "#"
  //      var r = objArr[x-1][y].value == "#"
    //    var l = objArr[x+1][y].value == "#"
        
        var dirs = u + d + r + l
        if (dirs > 2) {
            this.type = types.ROOM
        } else {
            this.type = types.TUNNEL
        }
    }
}

/*

function Room ( ) {
    this.spaces = []
    this.egress = []
    this.neighbors []
}


function Tunnel ( ) {
    this.spaces = []
    this.egress = []
    this.passable = true
    this.neighbors = []
}

//
// functions
//

function assign(space, assignment) {
    space.assignment = assignment
    assignment.spaces.push(spaces)
}
*/
function beginAbstraction() {
    document.getElementById("score-space").style.color = "#ff0000";
    
    var canvas = document.getElementById('circle');
    canvas.height = pieceWidth * theLevel.rows
    
    var potentialRooms = []
    var potentialTunnels = []
/*    // itterate for theoretical classification
//    var objArr = theLevel.objArr
    for (var x = 0; x < theLevel.columns; x++) {
//        console.log(objArr[x])
        for (var y = 0; y < theLevel.rows; y++) {
            var value = theLevel.itemAt(x, y)
            var space = new Space(x, y, (value != null) )
            space.classify()
            if (space.type == types.ROOM) {
                potentialRooms.push(space)
            } else if (space.type == types.ROOM) {
                potentialTunnels.push(space)
            }
        }
    }
    drawType()
    // itterate rooms
    */
}


//
// debugging
//

function drawType(space) {
    var canvas = document.getElementById('circle');
//    if (canvas.getContext && (space.type != types.WALL)) {
    if (space.type != types.WALL) {
        var rect = gameBoard.getBoundingClientRect()
        
        var x = (space.x + 0.5) * pieceWidth
        var y = (space.y + 0.5) * pieceWidth
        var R = pieceWidth/3
        
        var ctx = canvas.getContext('2d');
//        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(x, y, R, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = (space.type == types.ROOM) ? '#0000FF' : '#00FF00';
        ctx.stroke();
    }
}


