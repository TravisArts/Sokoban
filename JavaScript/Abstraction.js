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
    
    var item = theLevel.itemAt(this.x, this.y)
    
    var isWall = false
    var pieceArr = ['$', '.', '@', '+', '?']
    
    if (item) {
//    window.alert(item.value)
        isWall = !pieceArr.includes(item.value)
    }
    if ( isWall ) {
        this.type = types.WALL
    } else {
        var uv = false
        var dv = false
        var rv = false
        var lv = false
      
        var u = theLevel.itemAt(this.x, this.y-1)
        var d = theLevel.itemAt(this.x, this.y+1)
        var r = theLevel.itemAt(this.x-1, this.y)
        var l = theLevel.itemAt(this.x+1, this.y)
        if (u) {
            uv = !pieceArr.includes(u.value)
        }
        if (d) {
            dv =  !pieceArr.includes(d.value)
        }
        if (r) {
            rv = !pieceArr.includes(r.value)
        }
        if (l) {
            lv = !pieceArr.includes(l.value)
        }
        
//        var uv = (u && u.value == "#")
  //      var dv = (d && d.value == "#")
    //    var rv = (r && r.value == "#")
      //  var lv = (l && l.value == "#")
//        var u = objArr[x][y-1].value == "#"
//        var d = objArr[x][y+1].value == "#"
  //      var r = objArr[x-1][y].value == "#"
    //    var l = objArr[x+1][y].value == "#"
        
        var dirs = uv + dv + rv + lv
        if (dirs <= 2) {
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
    document.getElementById("score-space").style.color = "#00ffff";
    
    var canvas = document.getElementById('circle');
    canvas.height = pieceWidth * theLevel.rows
    canvas.style.zIndex = "100";
    
    var potentialRooms = []
    var potentialTunnels = []
    // itterate for theoretical classification
//    var objArr = theLevel.objArr
    for (var x = 0; x < theLevel.columns; x++) {
//        console.log(objArr[x])
        for (var y = 0; y < theLevel.rows; y++) {
            var item = theLevel.itemAt(x, y)
//            var value = item.value
            var space = new Space(x, y, true)//(value == undefined) )
            space.classify()
            if (space.type == types.ROOM) {
                potentialRooms.push(space)
            } else if (space.type == types.TUNNEL) {
                potentialTunnels.push(space)
            }
            drawType(space)
        }
    }
    // itterate rooms
    
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
        var R = pieceWidth/4
        
        var ctx = canvas.getContext('2d');
//        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(x, y, R, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = (space.type == types.ROOM) ? '#0000FF' : '#00FF00';
        ctx.stroke();
    }
}


