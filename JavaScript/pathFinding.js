

Array.prototype.contains = function(obj) {
    var i = this.length
    while (i--) {
        if (this[i] === obj) {
            return true
        }
    }
    return false
}

function Point(x,y) {
    this.x = x
    this.y = y
}

var dir = {
     up : new Point(0, -1),
     down : new Point(0, 1),
     left : new Point(-1, 0),
     right : new Point(1, 0)
 }



// function findDeadzones() {

//     let objArr = theLevel.objArr
//     var objArr2 = []

//     let notAccessable = ['•','╹','╸','┛','╺','┗','━','┻','╻','┃','┓','┫','┏','┣','┳','╋']
    
//     for ( var y = 0; y < theLevel.rows; y++ ) {
//         for ( var x = 0; x < theLevel.columns; x++ ) {
//             if ( notAccessable.contains(objArr[y*34 + x]) ) {
//                 // objArr[y*34 + x] = objArr2[y*34 + x]
//                 console.log("not accessable")
//             }
//         }
//     }

//     var problem = new Point(17, 6)
//     var node = new Point(5, 7)
//     console.log( breadthFirstSearch( problem, node ) )

// }


function canMove(direction) {
    let y = direction.y
    let x = direction.x

    let obj = theLevel.itemAt(x, y).value
    if ( obj == ' ' || obj == '.') {
        return true
    }


    return false
}

function breadthFirstSearch(problem, node) {
    // var d = new dir()
    let actions = [dir.up, dir.down, dir.left, dir.right]

    if (problem == node) {
        return []
    }

    var frontier = new Array ()//[node]
    var explored = new Array()


    frontier.push(node)
    
    var i = 0

    while ( frontier.length != 0 && i < 100 ) {
        node = frontier.pop(); /* Returns the shallowest node in frontier */
        explored.push(node)

        for (var direction in actions) {
            if (actions.hasOwnProperty(direction)) {
                var x = actions[direction].x
                var y = actions[direction].y
                var child = new Point( node.x + x, node.y + y)

                console.log(child)

                if ( canMove(child) ) {
                    if ( explored.contains(child) == false || frontier.contains(child) == false ) {
                        if ( child == problem) {
                            return true
                        }
                        frontier.push(child)
                    }
                }
            }
        }
        i++
        
    }

    console.log(frontier)
    
    return false
}