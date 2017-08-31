

function getPlayerPosition() {
	var player = theLevel.player
	var position = { x: player.x, y: player.y }
	return position
}

var grabbing = null

function mouseDown(e) {

	var position = detectCoordinate(e)
	var item = theLevel.itemAt(position.x, position.y)

	if (item != null && (item.value == '$' || item.value == '*')) {
		grabbing = item
		setupPathFinding()
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
		dragTreasure(e)
	}
}

function mouseUp(e) {
	if (grabbing != null) {
		var wrapper = document.getElementsByClassName("drag")[0]
		if (wrapper != null) {
			wrapper.remove()
		}

		var position = detectCoordinate(e)
		var path = findPush(grabbing, position)
		
		if (path.length != 0) {
			var route = pathToRoute(path)
			// console.log(route)
			performMoves(route, 0)
		}

		setCursor('grab')
		grabbing = null
	}
}

function dragTreasure(e) {
	// var wrapper = document.getElementsByClassName("drag")[0]
	// if (wrapper == null) {
	// 	wrapper = document.createElement("div")
	// 	wrapper.setAttribute("class", "drag")
	// 	wrapper.textContent = "$"
	// 	document.body.appendChild(wrapper)
	// }
	// wrapper.style.webkitTransform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, 0)'
	// wrapper.style.MozTransform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, 0)'
	// wrapper.style.msTransform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, 0)'
	// wrapper.style.OTransform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, 0)'
	// wrapper.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, 0)'

	// wrapper.style.fontSize = document.getElementById("GameBoard")[0].style.fontSize

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
		theGraph.grid[point.x][point.y].weight = 1
		point = { x: point.x + V2.x, y: point.y + V2.y }
		theGraph.grid[point.x][point.y].weight = 2
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
	var x = Math.floor((e.pageX - rect.left) / pieceWidth)
	var y = Math.floor((e.pageY - rect.top) / pieceWidth)

	var position = { x: x, y: y }
	return position
}

function performMoves(moves, i) {
	setTimeout(function () {
		var dir = moves[i]
		j = i + 1
		if (j < moves.length) {
			manager.move(dir, false)
			performMoves(moves, j)
		} else {
			manager.move(dir, true)
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


var theGraph

function setupPathFinding() {
	var nodes = []

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
	theGraph = new Graph(nodes)
}

function findPath(s, e) {

	if (theLevel.withinBounds(s) && theLevel.withinBounds(e)) {
		var start = theGraph.grid[s.x][s.y]
		var end = theGraph.grid[e.x][e.y]

		var path = astar.search(theGraph, start, end)
		if (path != null) {
			var result = [s]
			for (var i = 0; i < path.length; i++) {
				node = path[i]
				var point = { x: node.x, y: node.y }
				result.push(point)
			}
			// console.log(result)
		} else {
			var result = []
		}
	} else {
		result = []
	}
	return result
}

function findPush(s, e) {

	var sTime = performance ? performance.now() : new Date().getTime();

	if (theLevel.withinBounds(s) && theLevel.withinBounds(e)) {
		var start = theGraph.grid[s.x][s.y]
		var end = theGraph.grid[e.x][e.y]
		var p = getPlayerPosition()
		var player = theGraph.grid[p.x][p.y]

		// var graphCopy = new Graph(theGraph.gridIn)
		
		var path = astar.search2way(theGraph, start, end, player)

		// setupPathFinding()
		// theGraph = graphCopy

		// console.log(path + "")
		if (path.length != 0) {
			var result = [p]
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
	var fTime = performance ? performance.now() : new Date().getTime(),
		duration = (fTime - sTime).toFixed(2);
	if (result.length === 0) {
		console.log("couldn't find a path (" + duration + "ms)")
	} else {
		console.log("search took " + duration + "ms.")
	}
	// console.log(result)

	return result.reverse()
}



function pathTo(node) {
	var curr = node;
	var path = [];
	while (curr.parent) {
		path.unshift(curr);
		curr = curr.parent;
	}
	return path;
}

function pathTo2(node) {
	var curr = node;
	var path = [];
	var path2 = []
	while (curr.parent) {
		for (var i = curr.pathTo.length - 1; i >= 0; i--) {
			path.unshift(curr.pathTo[i]);
		}
		path2.unshift(curr);
		curr = curr.parent;
	}
	for (var i = curr.pathTo.length - 1; i >= 0; i--) {
		path.unshift(curr.pathTo[i]);
	}
	path2.unshift(curr);
	// console.log("node path: " + path2)
	// path.unshift(curr.pathTo)
	return path;
}

function getHeap() {
	return new BinaryHeap(function (node) {
		return node.f;
	});
}

function getHeap2() {
	return new BinaryHeap(function (state) {
		return state.node.f;
	});
}

var astar = {
	/**
	* Perform an A* Search on a graph given a start and end node.
	* @param {Graph} graph
	* @param {GridNode} start
	* @param {GridNode} end
	* @param {Object} [options]
	* @param {bool} [options.closest] Specifies whether to return the
			   path to the closest node if the target is unreachable.
	* @param {Function} [options.heuristic] Heuristic function (see
	*          astar.heuristics).
	*/
	search: function (graph, start, end) {
		// graph.cleanDirty();
		var heuristic = astar.heuristics.manhattan;

		var openHeap = getHeap();

		start.h = heuristic(start, end);
		// graph.markDirty(start);

		openHeap.push(start);

		while (openHeap.size() > 0) {

			// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
			var currentNode = openHeap.pop();

			// End case -- result has been found, return the traced path.
			if (currentNode === end) {
				// console.log("you made it" + currentNode)
				return pathTo(currentNode);
			}

			// Normal case -- move currentNode from open to closed, process each of its neighbors.
			currentNode.closed = true;

			// Find all neighbors for the current node.
			var neighbors = graph.neighbors(currentNode);
			var i, il = neighbors.length
			for (i = 0; i < il; ++i) {
				var neighbor = neighbors[i];

				if (neighbor.closed || neighbor.isWall()) {
					// Not a valid node to process, skip to next neighbor.
					continue;
				}

				// The g score is the shortest distance from start to current node.
				// We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
				var gScore = currentNode.g + 1
				var beenVisited = neighbor.visited;

				if (!beenVisited || gScore < neighbor.g) {

					// Found an optimal (so far) path to this node.  Take score for node to see how good it is.
					neighbor.visited = true;
					neighbor.parent = currentNode;
					neighbor.h = neighbor.h || heuristic(neighbor, end);
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
					// graph.markDirty(neighbor);

					if (!beenVisited) {
						// Pushing to heap will put it in proper place based on the 'f' value.
						openHeap.push(neighbor);
					} else {
						// Already seen the node, but since it has been rescored we need to reorder it in the heap
						openHeap.rescoreElement(neighbor);
					}
				}
			}
		}

		// No result was found - empty array signifies failure to find path.
		return null;
	},
	search2way: function (graph, start, end, player) {
		// console.log(graph.dirtyNodes)
		// graph.cleanDirty();
		var heuristic = astar.heuristics.manhattan;
		var openHeap = getHeap2();

		start.h = heuristic(start, end);
		// graph.markDirty(start);

		openHeap.push({
			graph: graph,
			player: player,
			node: start
		});


		while (openHeap.size() > 0) {

			// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
			var state = openHeap.pop()
			var currentNode = state.node

			// End case -- result has been found, return the traced path.
			// Find all neighbors for the current node.
			var x_old = currentNode.x
			var y_old = currentNode.y
			if (x_old == end.x && y_old == end.y) {
				var path = pathTo2(currentNode);
				return path;
			}

			// Normal case -- move currentNode from open to closed, process each of its neighbors.
			currentNode.closed = true;

			var G2 = state.graph

			var neighbors = G2.neighbors(currentNode);
			var i, il = neighbors.length
			for (i = 0; i < il; ++i) {
				var neighbor = neighbors[i];




				if (neighbor.closed || neighbor.isWall()) {
					// Not a valid node to process, skip to next neighbor.
					continue;
				}
				// determine the neighber on the oposite side
				var j = (i + 2 >= 4) ? i - 2 : i + 2
				var neighbor2 = neighbors[j]

				if (neighbor2.isWall()) {
					continue;
				}

				var Gsearch = new Graph(G2.gridIn)

				var E2 = Gsearch.grid[neighbor2.x][neighbor2.y]
				var P2 = Gsearch.grid[state.player.x][state.player.y]
				var path2 = astar.search(Gsearch, P2, E2)

				// console.log("path from " + P2 + " to " + E2 + " on\n" + Gsearch + "\ngives path:" + path2)

				if (path2 == null) {
					continue;
				}

				path2.push(currentNode)

				// The g score is the shortest distance from start to current node.
				// We need to check if the path we have arrived at this neighbor is
				// the shortest one we have seen yet.
				var gScore = currentNode.g + 1
				var beenVisited = neighbor.visited

				if (!beenVisited) {

					var nodes = []
					for (var x = 0; x < G2.gridIn.length; x++) {
						nodes.push(G2.gridIn[x].slice())
					}
					nodes[neighbor.x][neighbor.y] = 2
					nodes[x_old][y_old] = 1

					var Gsearch2 = new Graph(nodes)
					var newEnd = Gsearch2.grid[end.x][end.y]
					var S2 = Gsearch2.grid[neighbor.x][neighbor.y]
					var pathNew = astar.search(Gsearch2, S2, newEnd)

					// Found an optimal (so far) path to this node.
					// Take score for node to see how good it is.
					neighbor.visited = true
					neighbor.parent = currentNode
					neighbor.h = pathNew.length//neighbor.h || heuristic(neighbor, end)
					neighbor.g = gScore
					neighbor.f = neighbor.g + neighbor.h + path2.length + currentNode.f
					neighbor.pathTo = path2
					// G2.markDirty(neighbor)




					if (neighbor.h > currentNode.h) {
						currentNode.closed = false
						currentNode.visited = false
					}

					// if (!beenVisited) {
					// Pushing to heap will put it in proper place based on the 'f' value.


					var newGraph = new Graph(nodes)
					newGraph.markAll(G2)

					var newState = {
						graph: newGraph,
						player: currentNode,
						node: newGraph.grid[neighbor.x][neighbor.y]
					}

					openHeap.push(newState)
					// } else {
					// }
				} else if (gScore < neighbor.g) {
					neighbor.visited = true
					neighbor.parent = currentNode
					neighbor.h = neighbor.h
					neighbor.g = gScore
					neighbor.f = neighbor.g + neighbor.h + path2.length + currentNode.f
					neighbor.pathTo = path2
					// G2.markDirty(neighbor)
					// Already seen the node, but since it has been rescored we need to reorder it in the heap
					openHeap.rescoreElement(state);

				}
			}

		}

		// No result was found - empty array signifies failure to find path.
		return [];
	},

	// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
	heuristics: {
		manhattan: function (pos0, pos1) {
			var d1 = Math.abs(pos1.x - pos0.x);
			var d2 = Math.abs(pos1.y - pos0.y);
			return d1 + d2;
		},
		diagonal: function (pos0, pos1) {
			var D = 1;
			var D2 = Math.sqrt(2);
			var d1 = Math.abs(pos1.x - pos0.x);
			var d2 = Math.abs(pos1.y - pos0.y);
			return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
		}
	},
	cleanNode: function (node) {
		node.f = 0;
		node.g = 0;
		node.h = 0;
		node.pathTo = []
		node.visited = false;
		node.closed = false;
		node.parent = null;
	}
};

/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
function Graph(gridIn, options) {
	options = options || {};
	this.gridIn = gridIn
	this.nodes = [];
	this.diagonal = !!options.diagonal;
	this.grid = [];
	for (var x = 0; x < gridIn.length; x++) {
		this.grid[x] = [];

		for (var y = 0, row = gridIn[x]; y < row.length; y++) {
			var node = new GridNode(x, y, row[y]);
			this.grid[x][y] = node;
			this.nodes.push(node);
		}
	}
	this.init();
}

Graph.prototype.init = function () {
	this.dirtyNodes = [];
	for (var i = 0; i < this.nodes.length; i++) {
		astar.cleanNode(this.nodes[i]);
	}
};

Graph.prototype.cleanDirty = function () {
	for (var i = 0; i < this.dirtyNodes.length; i++) {
		astar.cleanNode(this.dirtyNodes[i]);
	}
	this.dirtyNodes = [];
};

Graph.prototype.markDirty = function (node) {
	this.dirtyNodes.push(node);
};
Graph.prototype.markAll = function (graph) {
	for (var x = 0; x < this.grid.length; x++) {
		var row2 = graph.grid[x]
		for (var y = 0, row = this.grid[x]; y < row.length; y++) {
			var node = row[y]
			var node2 = row2[y]
			node.f = node2.f
			node.g = node2.g
			node.h = node2.h
			node.visited = node2.visited
			node.closed = node2.closed
			node.pathTo = node2.pathTo
			node.parent = node2.parent
			// if (graph.dirtyNodes.includes(node2)) {
			// 	this.markDirty(node)
			// }
		}
	}
}

Graph.prototype.neighbors = function (node) {
	var ret = [];
	var x = node.x;
	var y = node.y;
	var grid = this.grid;

	// North
	if (grid[x] && grid[x][y + 1]) {
		ret.push(grid[x][y + 1]);
	}
	// East
	if (grid[x + 1] && grid[x + 1][y]) {
		ret.push(grid[x + 1][y]);
	}
	// South
	if (grid[x] && grid[x][y - 1]) {
		ret.push(grid[x][y - 1]);
	}
	// West
	if (grid[x - 1] && grid[x - 1][y]) {
		ret.push(grid[x - 1][y]);
	}







	if (this.diagonal) {
		// Southwest
		if (grid[x - 1] && grid[x - 1][y - 1]) {
			ret.push(grid[x - 1][y - 1]);
		}

		// Southeast
		if (grid[x + 1] && grid[x + 1][y - 1]) {
			ret.push(grid[x + 1][y - 1]);
		}

		// Northwest
		if (grid[x - 1] && grid[x - 1][y + 1]) {
			ret.push(grid[x - 1][y + 1]);
		}

		// Northeast
		if (grid[x + 1] && grid[x + 1][y + 1]) {
			ret.push(grid[x + 1][y + 1]);
		}
	}

	return ret;
};

Graph.prototype.diagNeighbors = function (node) {
	var ret = [];
	var x = node.x;
	var y = node.y;
	var grid = this.grid;

	if (this.diagonal) {
		// Southwest
		if (grid[x - 1] && grid[x - 1][y - 1]) {
			ret.push(grid[x - 1][y - 1]);
		}

		// Southeast
		if (grid[x + 1] && grid[x + 1][y - 1]) {
			ret.push(grid[x + 1][y - 1]);
		}

		// Northwest
		if (grid[x - 1] && grid[x - 1][y + 1]) {
			ret.push(grid[x - 1][y + 1]);
		}

		// Northeast
		if (grid[x + 1] && grid[x + 1][y + 1]) {
			ret.push(grid[x + 1][y + 1]);
		}
	}

	return ret;
};



Graph.prototype.toString = function () {
	var graphString = [];
	var nodes = this.grid;
	var rowLength = nodes[0].length
	for (var y = 0; y < rowLength; y++) {
		var rowDebug = [];
		for (var x = 0; x < nodes.length; x++) {
			var value = ""
			switch (nodes[x][y].weight) {
				case 0:
					value = "#"
					break;
				case 1:
					value = " "
					break;
				case 2:
					value = "$"
					break;

				default:
					break;
			}
			rowDebug.push(value);
		}
		graphString.push(rowDebug.join(""));
	}
	return graphString.join("\n");
};

// Graph.prototype.toString = function () {
// 	var graphString = [];
// 	var nodes = this.grid;
// 	var rowLength = nodes[0].length
// 	for (var y = 0; y < rowLength; y++) {
// 		var rowDebug = [];
// 		for (var x = 0; x < nodes.length; x++) {
// 			var value = ""
// 			if (nodes[x][y].weight == 0) {
// 				value = "#"
// 			} else {
// 				value = "" + nodes[x][y].f
// 			}
// 			rowDebug.push(value);
// 		}
// 		graphString.push(rowDebug.join(""));
// 	}
// 	return graphString.join("\n");
// };


function GridNode(x, y, weight) {
	this.x = x;
	this.y = y;
	this.weight = weight;
}

GridNode.prototype.toString = function () {
	return "[" + this.x + " " + this.y + "]";
};

// GridNode.prototype.toString = function () {
// 	return "[" + this.x + " " + this.y + " " + this.closed + "]"
// };

GridNode.prototype.getCost = function (fromNeighbor) {
	// Take diagonal weight into consideration.
	if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
		return this.weight * 1.41421;
	}
	return this.weight;
};

GridNode.prototype.isWall = function () {
	return this.weight !== 1;
};
GridNode.prototype.isTreasure = function () {
	return this.weight === 2;
};

function BinaryHeap(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function (element) {
		// Add the new element to the end of the array.
		this.content.push(element);

		// Allow it to sink down.
		this.sinkDown(this.content.length - 1);
	},
	pop: function () {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it bubble up.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.bubbleUp(0);
		}
		return result;
	},
	remove: function (node) {
		var i = this.content.indexOf(node);

		// When it is found, the process seen in 'pop' is repeated
		// to fill up the hole.
		var end = this.content.pop();

		if (i !== this.content.length - 1) {
			this.content[i] = end;

			if (this.scoreFunction(end) < this.scoreFunction(node)) {
				this.sinkDown(i);
			} else {
				this.bubbleUp(i);
			}
		}
	},
	size: function () {
		return this.content.length;
	},
	rescoreElement: function (node) {
		this.sinkDown(this.content.indexOf(node));
	},
	sinkDown: function (n) {
		// Fetch the element that has to be sunk.
		var element = this.content[n];

		// When at 0, an element can not sink any further.
		while (n > 0) {

			// Compute the parent element's index, and fetch it.
			var parentN = ((n + 1) >> 1) - 1;
			var parent = this.content[parentN];
			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				// Update 'n' to continue at the new position.
				n = parentN;
			}
			// Found a parent that is less, no need to sink any further.
			else {
				break;
			}
		}
	},
	bubbleUp: function (n) {
		// Look up the target element and its score.
		var length = this.content.length;
		var element = this.content[n];
		var elemScore = this.scoreFunction(element);

		while (true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) << 1;
			var child1N = child2N - 1;
			// This is used to store the new position of the element, if any.
			var swap = null;
			var child1Score;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N];
				child1Score = this.scoreFunction(child1);

				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore) {
					swap = child1N;
				}
			}

			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N];
				var child2Score = this.scoreFunction(child2);
				if (child2Score < (swap === null ? elemScore : child1Score)) {
					swap = child2N;
				}
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap !== null) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}
			// Otherwise, we are done.
			else {
				break;
			}
		}
	}
};