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
    var pieceArr = ['$', '.', '@', '+', '?', '*']
    
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
        if (dirs <= 1) {
            this.type = types.ROOM
        } else {
            this.type = types.TUNNEL
        }
    }
}



function Room ( number ) {
    this.spaces = []
    this.egress = []
    this.neighbors []
    this.number = number
}

/*

function Tunnel ( ) {
    this.spaces = []
    this.egress = []
    this.passable = true
    this.neighbors = []
}

//
// functions
//
*/
function assign(space, assignment) {
    space.assignment = assignment
    assignment.spaces.push(spaces)
}

function beginAbstraction() {
    document.getElementById("score-space").style.color = "#000000";
    
    var canvas = document.getElementById('circle');
    canvas.height = pieceWidth * theLevel.rows
    canvas.style.zIndex = "100";
    
    var potentialRooms = []
    var potentialTunnels = []
    // itterate for theoretical classification
//    var objArr = theLevel.objArr
    var allSpaces = []
    for (var x = 0; x < theLevel.columns; x++) {
//        console.log(objArr[x])
        var xSpaces = []
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
            xSpaces.push(space)
            drawType(space)
        }
        allSpaces.push(xSpaces)
    }
    
    var rooms = []
    /*
    // itterate rooms
    for (var i = 0; i < potentialRooms.length; i++) {
        var space = potentialRooms[i]
        var x = space.x
        var y = space.y
        
        var u = allSpaces[x][y-1]
        var d = allSpaces[x][y+1]
        var r = allSpaces[x+1][y]
        var l = allSpaces[x-1][y]
        var neighbors = [u, d, r, l]
        
        var room
        
        if (rooms.lengths == 0) {
            room = new Room(0)
            assign(space, room)
            rooms.push(room)
        } else {
            for (j = 0; j < 4; j++) {
                var spot = neighbors[j]
                if (spot && potentialRooms.includes(spot)) {
                    if (spot.assignment) {
                        assign(space, spot.assignment)
                        break;
                    }
                }
            }
            if (space.assignment == null) {
                room = new Room(rooms.length + 1)
                rooms.push(room)
                assign(space, room)
            }
        }
    }*/
    window.alert(rooms.length)
    
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


