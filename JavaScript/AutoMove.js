

function getPlayerPosition() {
	var player = theLevel.player
	var position = { x: player.x, y: player.y }
	return position
}

var grabbing = null

function mouseDown(e) {
	mousedown = true

	var position = detectCoordinate(e)
	var item = theLevel.itemAt(position.x, position.y)

	if (item != null && (item.value == '$' || item.value == '*')) {
		grabbing = item
	} else {
		var playerPosition = getPlayerPosition()

		if (item == null || item.value == '.') {
			var path = findPath(position, playerPosition)
			var route = pathToRoute(path)
			if (route.length > 0) {
				performMoves(route, 0)
			}
		}
	}
}

function mouseMove(e) {
	var position = detectCoordinate(e)
	var playerPosition = getPlayerPosition()

	if (grabbing == null) {
		var path = findPath(position, playerPosition)
		if (path.length == 1 || path.length == 0) {
			setCursor('default')
		} else if (path.length == 2) {
			var route = pathToRoute(path)
			switch (route[0]) {
				case 0:
					setCursor('n-resize')
					break;
				case 1:
					setCursor('e-resize')
					break;
				case 2:
					setCursor('s-resize')
					break;
				case 3:
					setCursor('w-resize')
					break;
				default:
					break;
			}
		} else if (path.length >= 3) {
			setCursor('crosshair')
		}
	} else {
		setCursor('grabbing')
	}
}

function mouseUp(e) {
	if (grabbing != null) {
		var position = detectCoordinate(e)
		var path = findPush(grabbing, position)
		var route = pathToRoute(path)
		pushRoute(route, grabbing)

		setCursor('grab')
		grabbing = null
	}
}

function pushRoute(route, treasure) {
	var backwards = reverseOrder(route)
	var reverse = reverseRoute(route)
	var playerPosition = getPlayerPosition()
	var playerRoute = []
	var point = treasure

	var map = {
		0: { x: 0, y: -1 }, // Up
		1: { x: 1, y: 0 },  // Right
		2: { x: 0, y: 1 },  // Down
		3: { x: -1, y: 0 }   // Left
	};

	var direction = -1
	for (var i = 0; i < reverse.length; i++) {
		// console.log(reverse)
		// console.log(backwards)
		if (direction != backwards[i]) {
			direction = backwards[i]
			var vector = map[direction]
			var position = {
				x: point.x + vector.x,
				y: point.y + vector.y
			}
			var item = theLevel.itemAt(position.x, position.y)
			if (item == null || item.value == '.') {
				var path = findPath(position, playerPosition)
				var newRoute = pathToRoute(path)
				if (newRoute.length == 0) {
					setupPathFinding()
					return
				}
				for (var j = 0; j < newRoute.length; j++) {
					playerPosition = {
						x: playerPosition.x + map[newRoute[j]].x,
						y: playerPosition.y + map[newRoute[j]].y
					}
					playerRoute.push(newRoute[j])
				}
			}
		}
		var V2 = map[reverse[i]]
		graph.grid[point.x][point.y].weight = 1
		point = { x: point.x + V2.x, y: point.y + V2.y }
		graph.grid[point.x][point.y].weight = 2
		playerPosition = {
			x: playerPosition.x + V2.x,
			y: playerPosition.y + V2.y
		}
		playerRoute.push(reverse[i])
	}

	if (playerRoute.length > 0) {
		performMoves(playerRoute, 0)
	}
}



function reverseRoute(route) {
	var reverse = []
	for (var i = route.length - 1; i >= 0; i--) {
		var val = route[i] + 2
		if (val >= 4) {
			val -= 4
		}
		reverse.push(val)
	}
	return reverse
}

function reverseOrder(route) {
	var reverse = []
	for (var i = route.length - 1; i >= 0; i--) {
		reverse.push(route[i])
	}
	return reverse
}

function setCursor(type) {

	document.getElementsByClassName('GameBoard')[0].style.cursor = type
}

function detectCoordinate(e) {
	var rect = document.getElementsByClassName('GameBoard')[0].getBoundingClientRect()
	var x = Math.floor((e.pageX - rect.left) / pieceWidth - 0.5)
	var y = Math.floor((e.pageY - rect.top) / pieceWidth)

	var position = { x: x, y: y }
	return position
}

function performMoves(moves, i) {
	setTimeout(function () {
		var dir = moves[i]
		manager.move(dir)
		j = i + 1
		if (j < moves.length) {
			performMoves(moves, j)
		}
	}, 100);
}




function pathToRoute(path) {
	var route = []
	for (var i = path.length - 1; i > 0; i--) {
		var deltaX = path[i - 1].x - path[i].x
		if (deltaX == -1) {
			route.push(3)
		} else if (deltaX == 1) {
			route.push(1)
		} else {
			var deltaY = path[i - 1].y - path[i].y
			if (deltaY == -1) {
				route.push(0)
			} else {
				route.push(2)
			}
		}
	}
	return route
}


var graph

function setupPathFinding() {
	var nodes = []
	graph = new Graph(nodes)

	for (var x = 0; x < theLevel.columns; x++) {
		var nodeRow = []
		for (var y = 0; y < theLevel.rows; y++) {
			var item = theLevel.itemAt(x, y)
			if (item == null || item.value == '@' || item.value == '+' || item.value == '.') {
				nodeRow.push(1)
			} else if (item.value == '$' || item.value == '*') {
				nodeRow.push(2)
			} else {
				nodeRow.push(0)
			}
		}
		nodes.push(nodeRow)
	}
	graph = new Graph(nodes)
}

function findPath(s, e) {

	if (theLevel.withinBounds(s) && theLevel.withinBounds(e)) {
		var start = graph.grid[s.x][s.y]
		var end = graph.grid[e.x][e.y]

		var path = astar.search(graph, start, end)
		if (path.length != 0) {
			var result = [s]
			for (var i = 0; i < path.length; i++) {
				node = path[i]
				var point = { x: node.x, y: node.y }
				result.push(point)
			}
			// console.log(result)
		} else {
			var result = path
		}
	} else {
		result = []
	}
	return result
}

function findPush(s, e) {
	
		if (theLevel.withinBounds(s) && theLevel.withinBounds(e)) {
			var start = graph.grid[s.x][s.y]
			var end = graph.grid[e.x][e.y]
	
			var path = astar.search2way(graph, start, end)
			if (path.length != 0) {
				var result = [s]
				for (var i = 0; i < path.length; i++) {
					node = path[i]
					var point = { x: node.x, y: node.y }
					result.push(point)
				}
				// console.log(result)
			} else {
				var result = path
			}
		} else {
			result = []
		}
		return result
	}