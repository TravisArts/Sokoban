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
    this.neighbors = []
    this.accessable
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
    this.neighbors = []
    this.number = number
}

function Tunnel ( number ) {
    this.spaces = []
    this.egress = []
    this.passable = true
    this.neighbors = []
    this.number = number
}

//
// functions
//

function assign(space, assignment) {
    space.assignment = assignment
    assignment.spaces.push(space)
}

function reassign(space, assignment) {
    var assn2 = space.assignment
    
    
    var i = assn2.spaces.findIndex(function(sp) {
        return sp == space
    })
    sp = assn2.spaces.splice(i, 1)
    
    space.assignment = assignment
    assignment.spaces.push(space)



    // assn2.spaces.filter(function(ele){
    //     return ele != space;
    // });
 

}

function beginAbstraction() {
    document.getElementById("score-space").style.color = "#ff0000";
    
    var canvas = document.getElementById('circle');
    canvas.height = pieceWidth * theLevel.rows
    canvas.style.zIndex = "100";
    
    var potentialRooms = []
    var potentialTunnels = []
    // itterate for theoretical classification
    allSpaces = []
    for (var x = 0; x < theLevel.columns; x++) {
        var xSpaces = []
        for (var y = 0; y < theLevel.rows; y++) {
            var item = theLevel.itemAt(x, y)
            var space = new Space(x, y, true)
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
    
    console.log("#of potential rooms = " + potentialRooms.length)
    console.log("#of potential tunnels = " + potentialTunnels.length)
    
    
    // itterate potential rooms
    var rooms = []
    for (var i = 0; i < potentialRooms.length; i++) {
        var space = potentialRooms[i]
        var x = space.x
        var y = space.y
        
        var u, d, r, l

        u = allSpaces[x][y-1]
        d = allSpaces[x][y+1]
        if ( x < allSpaces.length - 1 ){
            r = allSpaces[x+1][y]
        }
        if (x > 0) {
            l = allSpaces[x-1][y]
        }

        var neighbors = [u, d, r, l]
        
        var room = space.assignment
        
        if (rooms.lengths == 0) {
            room = new Room(0)
            rooms.push(room)
            assign(space, room)
        } else {
            // if (space.assignment) {
            //     room = space.assignment
            // }
            for (j = 0; j < 4; j++) {
                var spot = neighbors[j]
                if (spot) {
                    if (potentialRooms.includes(spot)) {
                        if (room == null && spot.assignment) {
                            room = spot.assignment
                            assign(space, room)
                        } else if (room) {
                            assign(spot, room)
                        }
                    }
                    space.neighbors.push(spot)
                }
            }
            if (room == null) {
                room = new Room(rooms.length + 1)
                rooms.push(room)
                assign(space, room)
            }
        }
    }
    console.log("#of rooms = " + rooms.length)

    // // itterate actual rooms
    // for (var i = 0; i < rooms.length; i++) {
    //     var room = rooms[i]
    //     linesFor(room)
    // }

    // itterate spaces that are potential tunnels
    var tunnels = []
    for (var i = 0; i < potentialTunnels.length; i++) {
        var space = potentialTunnels[i]
        var x = space.x
        var y = space.y
        
        var u, d, r, l

        u = allSpaces[x][y-1]
        d = allSpaces[x][y+1]
        if ( x < allSpaces.length - 1 ){
            r = allSpaces[x+1][y]
        }
        if (x > 0) {
            l = allSpaces[x-1][y]
        }

        var neighbors = [u, d, r, l]
        
        var tunnel = space.assignment
        if (tunnels.lengths == 0) {
            tunnel = new Tunnel(0)
            tunnels.push(tunnel)
            assign(space, tunnel)
        } else {
            // if (space.assignment) {
            //     tunnel = space.assignment
            // }
            for (j = 0; j < 4; j++) {
                var spot = neighbors[j]
                if (spot) {
                    if (potentialTunnels.includes(spot)) {
                        if (tunnel == null && spot.assignment) {
                            tunnel = spot.assignment
                            assign(space, tunnel)
                        } else if (tunnel) {
                            assign(spot, tunnel)
                        }
                    }
                    space.neighbors.push(spot)
                }
            }
            if (tunnel == null) {
                tunnel = new Tunnel(tunnels.length + 1)
                tunnels.push(tunnel)
                assign(space, tunnel)
            }
        }
    }

    // itterate actual tunnels
    var tunnels2Rooms = []
    for (var i = 0; i < tunnels.length; i++) {
        var tunnel = tunnels[i]
        var neighbors = []
        for (let j = 0; j < tunnel.spaces.length; j++) {
            const space = tunnel.spaces[j];
            for (let k = 0; k < space.neighbors.length; k++) {
                const spot = space.neighbors[k];
                if (!neighbors.includes(spot) && spot.assignment != tunnel && spot.type != types.WALL) {
                    neighbors.push(spot)
                }
            }
        }
        if (tunnel.spaces.length <= 2) {
            var n1 = neighbors[0]
            var n2 = neighbors[1]
            if (n2 && n1.assignment == n2.assignment) {
                var rm = n1.assignment
                for (let j = 0; j < tunnel.spaces.length; j++) {
                    var space = tunnel.spaces[j];
                    space.type = types.ROOM
                    assign(space, rm)
                    tunnels2Rooms.push(i)
                }
            }
        }
        linesFor(tunnel)
    }
    console.log("#of tunnels = " + tunnels.length)

    for (let i = 0; i < tunnels2Rooms.length; i++) {
        const j = tunnels2Rooms[i];
        tunnels.splice(j, 1)
    }

    console.log("#of tunnels = " + tunnels.length)

    // itterate actual rooms
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i]
        linesFor(room)
    }
    
}

function makeNeighbors(space1, space2) {
    if (!space1.neighbors.includes(space2)) {
        space1.neighbors.push(space2)
    }
    if (!space2.neighbors.includes(space1)) {
        space2.neighbors.push(space1)
    }
}

var allSpaces = []
var rooms = []
var tunnels = []

function beginAbstraction2 () {

    var canvas = document.getElementById('circle');
    canvas.height = pieceWidth * theLevel.rows
    canvas.style.zIndex = "100";
    
    var potentialRooms = []
    var potentialTunnels = []
    // itterate for theoretical classification
    allSpaces = []
    for (var x = 0; x < theLevel.columns; x++) {
        var ySpaces = []
        for (var y = 0; y < theLevel.rows; y++) {
            var item = theLevel.itemAt(x, y)
            var space = new Space(x, y, true)
            space.classify()
            if (space.type == types.ROOM) {
                potentialRooms.push(space)
            } else if (space.type == types.TUNNEL) {
                potentialTunnels.push(space)
            }
            if (y > 0) {
                makeNeighbors(space, ySpaces[y-1])
            }
            if (x > 0) {
                makeNeighbors(space, allSpaces[x-1][y])
            }
            ySpaces.push(space)
            // drawType(space)
        }
        allSpaces.push(ySpaces)
    }
    
    console.log("#of potential rooms = " + potentialRooms.length)
    console.log("#of potential tunnels = " + potentialTunnels.length)

    // iterate through all newly created spaces spaces
    rooms = []
    tunnels = []
    for (let x = 0; x < allSpaces.length; x++) {
        const column = allSpaces[x];
        for (let y = 0; y < column.length; y++) {
            const space = column[y];
            if (space.type != types.WALL) {
                var assignment = space.assignment
                if (assignment == null) {
                    var sharedSpaces = []

                    space.neighbors.forEach(spot => {
                        if (space.type == spot.type) {
                            var a2 = spot.assignment
                            if (a2 != null) {
                                assignment = a2
                            } else {
                                sharedSpaces.push(spot)
                            }
                        }
                    });
                    if (assignment == null) {
                        switch (space.type) {
                            case types.ROOM:
                                assignment = new Room(rooms.length)
                                rooms.push(assignment)
                                break;
                            case types.TUNNEL:
                                assignment = new Tunnel(tunnels.length)
                                tunnels.push(assignment)
                                break;
                        }
                    }
                    assign(space, assignment)
                    sharedSpaces.forEach(spot => {
                        assign(spot, assignment)
                    });
                }
            }
        }
        
    }
    console.log("#of rooms =   " + rooms.length)
    console.log("#of tunnels = " + tunnels.length)

    // itterate through tunnels
    var tunnels2Rooms = []

    tunnels.forEach(tunnel => {
        var neighbors = []
        var allXs = []
        var allYs = []
        tunnel.spaces.forEach(space => {
            if (!allXs.includes(space.x)) {
                allXs.push(space.x)
            }
            if (!allYs.includes(space.y)) {
                allYs.push(space.y)
            }
            for (let k = 0; k < space.neighbors.length; k++) {
                const spot = space.neighbors[k];
                if (!neighbors.includes(spot) && spot.assignment != tunnel && spot.type != types.WALL) {
                    neighbors.push(spot)
                    if (!allXs.includes(spot.x)) {
                        allXs.push(spot.x)
                    }
                    if (!allYs.includes(spot.y)) {
                        allYs.push(spot.y)
                    }
                }
            }
        });

        // tunnel is not passable if it makes a corner
        if (allXs.length > 1 && allYs.length > 1 || neighbors.length == 1) {
            tunnel.passable = false
        }

        
        if (tunnel.spaces.length <= 2) {
            console.log(neighbors.length)
            var n1 = neighbors[0]
            var n2 = neighbors[1]
            if (n2 && n1.assignment == n2.assignment) {
                var rm = n1.assignment

                for (let i = tunnel.spaces.length; i > 0; i--) {
                    const space = tunnel.spaces[i-1];

                    space.type = types.ROOM
                    reassign(space, rm)
                    
                }
            }
        }
        // linesFor(tunnel)
    });
    // remove empty tunnels
    tunnels = tunnels.filter(function(ele){
        return ele.spaces.length > 0
    });

    // console.log("#of rooms =   " + rooms.length)
    // console.log("#of tunnels = " + tunnels.length)

    findReachable()
    mergeRooms()
    findTunnel0()
    mergeTunnels()

    tunnels.forEach(tunnel => {
        linesFor(tunnel)
    })

    console.log("#of rooms =   " + rooms.length)
    console.log("#of tunnels = " + tunnels.length)

    // itterate actual rooms
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i]
        linesFor(room)
    }

}

function crawlAllSpaces(searched) {
}

function mergeTunnels() {
    var moved = []
    tunnels.forEach(tunnel => {
        var searched = []
        for (let i = 0; i < tunnel.spaces.length; i++) {
            const space = tunnel.spaces[i];
            if (!searched.includes(space)) {
                searched.push(space)
                space.neighbors.forEach(spot => {
                    if (!moved.includes(spot)) {
                        if (spot.type == types.TUNNEL && spot.assignment != tunnel && tunnel.passable == spot.assignment.passable) {
                            // console.log("reassigning (" + spot.x + ", " + spot.y + ") from tunnel " + spot.assignment.number + " to tunnel " + tunnel.number)
                            reassign(spot, tunnel)
                            moved.push(spot)
                        }
                    }
                });
            }
        }
        // console.log("tunnel " + tunnel.number + ": " + tunnel.spaces.length)
    })
}

function mergeRooms() {
    var moved = []
    rooms.forEach(room => {
        var searched = []
        for (let i = 0; i < room.spaces.length; i++) {
            const space = room.spaces[i];
            if (!searched.includes(space)) {
                searched.push(space)
                space.neighbors.forEach(spot => {
                    if (!moved.includes(spot)) {
                        if (spot.type == types.ROOM && spot.assignment != room) {
                            // console.log("reassigning (" + spot.x + ", " + spot.y + ") from room " + spot.assignment.number + " to room " + room.number)
                            reassign(spot, room)
                            moved.push(spot)
                        }
                    }
                });
            }
        }
        // console.log("room " + room.number + ": " + room.spaces.length)
    })
    rooms = rooms.filter(function(ele){
        var req1 = ele.spaces.length > 0
        if (req1) {
            var req2 = ele.spaces[0].y != 0
            var req3 = ele.spaces[0].y != allSpaces[0].length-1
        } else {
            var req2 = false
            var req3 = false
        }
        // console.log("req1: " + req1 + "req2: " + req2 + "req3: " + req3)
        return req1 && req2 && req3
    });
}

function merge2Tunnels(t1, t2) {
    t2.spaces.forEach(space => {
        reassign(space, t1)
    });
    tunnels.filter(ele => {
        return ele != t2
    })
}

function findReachable() {
    tunnels.forEach(tunnel => {
        var searched = []
        tunnel.spaces.forEach(space => {
            if (!searched.includes(space)) {
                searched.push(space)
                space.neighbors.forEach(spot => {
                    if (!searched.includes(spot)) {
                        if (spot.assignment != tunnel && spot.type != types.WALL) {
                            if (rooms.includes(spot.assignment) || tunnels.includes(spot.assignment)) {
                                // if (spot.type == types.TUNNEL) {
                                //     mergeTunnels(tunnel, spot.assignment)
                                // } else {
                                    tunnel.neighbors.push(spot.assignment)
                                    tunnel.egress.push([space, spot])
                                // }
                            }
                        }
                    }
                });
            }
        })
    });
    tunnels = tunnels.filter(function(ele){
        var req1 = ele.neighbors.length > 0
        if (req1) {
            var req2 = ele.spaces[0].y != 0
            var req3 = ele.spaces[0].y != allSpaces[0].length-1
        } else {
            var req2 = false
            var req3 = false
        }
        return req1 && req2 && req3
    });
    rooms.forEach(room => {
        var searched = []
        room.spaces.forEach(space => {
            if (!searched.includes(space)) {
                searched.push(space)
                space.neighbors.forEach(spot => {
                    if (!searched.includes(spot) && spot.assignment != room && spot.type != types.WALL) {
                        if (rooms.includes(spot.assignment) || tunnels.includes(spot.assignment)) {
                            room.neighbors.push(spot.assignment)
                            room.egress.push([space, spot])
                        }
                    }
                });
            }
        })
    });
    rooms = rooms.filter(function(ele){
        var req1 = ele.neighbors.length > 0
        // var req2 = ele.spaces[0].y != 0
        // var req3 = ele.spaces[0].y != allSpaces[0].length-1
        return req1 //&& req2 && req3
    });
}

function findTunnel0() {
    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        var searched = []
        var moved = []

        room.spaces.forEach(space => {
            if (!searched.includes(space)) {
                searched.push(space)
                var ul, u, ur
                var l    , r
                var dl, d, dr
                
                const x = space.x
                const y = space.y
                
                u  = allSpaces[x  ][y-1]
                d  = allSpaces[x  ][y+1]
                if(x < allSpaces.length-1) {
                    ur = allSpaces[x+1][y-1]
                    r  = allSpaces[x+1][y  ]
                    dr = allSpaces[x+1][y+1]
                }
                if (x > 0) {
                    ul = allSpaces[x-1][y-1]
                    l  = allSpaces[x-1][y  ]
                    dl = allSpaces[x-1][y+1]
                }
                
                var array = [ur, d, ul, r, dl, u, dr, l, ur, d, ul, r, dl, u, dr, l]
                for (let j = 0; j < 8; j++) {
                    const space1 = array[j]
                    const space2 = array[j+1]
                    var space3
                    if (j%2 == 0) {
                        space3 = array[j+5]
                    } else {
                        space3 = array[j+4]
                    }
                    if (space1 && space2 && space3) {
                        if (space1.type == types.WALL && space2.type == types.WALL && space3.type != types.WALL) {
                            
                            // we have found a 0 length tunnel
                            const space4 = array[j+3]
                            if (space.assignment == space4.assignment) {
                                var r2 = new Room(rooms.length)
                                reassign(space4, r2)
                                
                                moved.push(space)
                                moved.push(space4)
                                
                                var next = [space4]
                                for (let k = 0; k < next.length; k++) {
                                    const spot = next[k];    
                                    spot.neighbors.forEach(space5 => {
                                        if (!moved.includes(space5)) {
                                            moved.push(space5)
                                            if (space5.type != types.WALL && space5.assignment == room) {
                                                reassign(space5, r2)
                                                next.push(space5)
                                            }
                                        }
                                    });   
                                }
                                rooms.push(r2)
                            }
                            break;
                        }
                    }
                }
                
                space.neighbors.forEach(spot => {
                    if (!searched.includes(spot) && spot.assignment != room && spot.type != types.WALL) {
                    }
                });
            }
        })

        if (room.spaces.length == 1) {
            var space = room.spaces[0]
            var neighbors = space.neighbors.filter(spot => {
                return spot.type != types.WALL
            })
            if (neighbors.length == 3) {
                var n1 = neighbors[0]
                var n2 = neighbors[1]
                var n3 = neighbors[2]
                
                if (space.type == types.ROOM) {
                    space.type = types.TUNNEL
                    var tunnel = new Tunnel(tunnels.length)
                    reassign(space, tunnel)
                    var ns = [n1.assignment, n2.assignment, n3.assignment]
                    tunnel.neighbors = ns
                    var door1 = {"room": n1.assignment, "entry": n1}
                    var door2 = {"room": n2.assignment, "entry": n2}
                    var door3 = {"room": n3.assignment, "entry": n3}
                    tunnel.egress = [door1, door2, door3]
                    tunnels.push(tunnel)
                }
            }
        }
    }
}


function getAbstractionPoint(point) {
    var space = allSpaces[point.x][point.y]
    console.log(space.assignment)
    console.log("user clicked in " + space.type + " " + space.assignment.number)
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = (space.type == types.ROOM) ? '#0000FF' : '#00FF00';
        ctx.stroke();
    }
}

function linesFor(assn2) {
    var canvas = document.getElementById('circle');
    
    var rect = gameBoard.getBoundingClientRect()

    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 1;
    ctx.beginPath();

    

    
    for (var i = 0; i < assn2.spaces.length; i++) {
        var space = assn2.spaces[i]

        var x1 = (space.x + 0.5) * pieceWidth
        var y1 = (space.y + 0.5) * pieceWidth

        ctx.strokeStyle = (space.type == types.ROOM) ? '#0000FF' : '#00FF00';
        if (space.type == types.ROOM) {
            ctx.strokeStyle = '#0000FF'
        } else {
            if (space.assignment.passable == true) {
                ctx.strokeStyle = '#00FF00'
            } else {
                ctx.strokeStyle = '#FF0000'
            }
        }

        for (var j = 0; j < space.neighbors.length; j++) {
            var spot = space.neighbors[j]
            if (spot.type != types.WALL ) {
                var x2 = (spot.x + 0.5) * pieceWidth
                var y2 = (spot.y + 0.5) * pieceWidth
                    
                if (spot.assignment == assn2) {
                    var x3 = (x1+x2)/2
                    var y3 = (y1+y2)/2
        
                } else {
                    var x3 = (3*x1+x2)/4
                    var y3 = (3*y1+y2)/4
                }
                ctx.moveTo(x1, y1);
                ctx.lineTo(x3, y3);
                ctx.stroke();
            }
        }
    }


}
