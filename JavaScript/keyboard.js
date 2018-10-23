

function KeyboardInputManager() {
	this.events = {};

	if (window.navigator.msPointerEnabled) {
		//Internet Explorer 10 style
		this.eventTouchstart = "MSPointerDown";
		this.eventTouchmove = "MSPointerMove";
		this.eventTouchend = "MSPointerUp";
	} else {
		this.eventTouchstart = "touchstart";
		this.eventTouchmove = "touchmove";
		this.eventTouchend = "touchend";
	}

	this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
	if (!this.events[event]) {
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
	var callbacks = this.events[event];
	// console.log(this.events)
	if (callbacks) {
		callbacks.forEach(function (callback) {
			callback(data);
		});
	}
};

// keypress has 83ms itteration
KeyboardInputManager.prototype.listen = function () {

	var self = this;

	var map = {
		38: 0, // Up
		39: 1, // Right
		40: 2, // Down
		37: 3, // Left
		// 75: 0, // Vim up
		// 76: 1, // Vim right
		// 74: 2, // Vim down
		// 72: 3, // Vim left
		87: 0, // W
		68: 1, // D
		83: 2, // S
		65: 3  // A
	};

	// Respond to direction keys
	document.addEventListener("keydown", function (event) {

		// console.log("keyDown = " + event.which)

		var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
		var mapped = map[event.which];

		// Ignore the event if it's happening in a text field
		if (self.targetIsInput(event)) return;

		if (!modifiers) {
			if (mapped !== undefined) {
				event.preventDefault();
				self.emit("move", mapped);
				clearTimeout(autoMoveTimout);
			}
		}

		// R key restarts the game
		if (!modifiers && event.which === 82) {
			event.preventDefault();
			self.restart.call(self, event);
		}

		// Z key undoes last move
		if (modifiers && event.which === 90) {
			event.preventDefault();
			self.undo.call(self, event);
		}
		// Y key redoes last move
		if (modifiers && event.which === 89) {
			event.preventDefault();
			self.redo.call(self, event);
		}
		// M key mutes/unmutes game
		if (!modifiers && event.which === 77) {
			self.toggleMute.call(self, event);
		}

	});

	// Respond to button presses
	// this.bindButtonPress(".retry-button", this.restart);
	this.bindButtonPress(".restart-button", this.restart);
	this.bindButtonPress(".mute-button", this.toggleMute);
	this.bindButtonPress(".redo-button", this.redo);
	this.bindButtonPress(".undo-button", this.undo);
	this.bindButtonPress(".info-button", this.info)
	this.bindButtonPress(".fullscreen-button", this.fullScreen)
	// this.bindButtonPress(".keep-playing-button", this.keepPlaying);

	// Respond to swipe events
	var touchStartClientX, touchStartClientY;
	var gameContainer = document.getElementsByClassName("gameArea")[0];

	gameContainer.addEventListener(this.eventTouchstart, function (event) {
		// console.log(event)
		if ((!window.navigator.msPointerEnabled && event.touches.length > 1)
			|| event.targetTouches.length > 1 || self.targetIsInput(event)) {
			return; // Ignore if touching with more than 1 finger or touching input
		}

		var touch = event.touches[0]
		// var radiusX = touch.radiusX
		// var radiusY = touch.radiusY
		// var rect = gameBoard.getBoundingClientRect()
		// var point = { clientX: touch.clientX - rect.left, clientY: touch.clientY - rect.top }

		// var position = detectCoordinate(touch)

		var position = detectAllCoordinates(touch, touch.radiusX)[0]
		// var str = "touch radius: " + touch.radiusX
		// str += "<br>"
		// str += "piece width: " + pieceWidth
		// document.getElementById("console").innerHTML = str

		// var pointUp = detectCoordinate({ clientX: touch.clientX, clientY: touch.clientY - radiusY })
		// var pointDown = detectCoordinate({ clientX: touch.clientX, clientY: touch.clientY + radiusY })
		// var pointLeft = detectCoordinate({ clientX: touch.clientX - radiusX, clientY: touch.clientY })
		// var pointRight = detectCoordinate({ clientX: touch.clientX + radiusX, clientY: touch.clientY })

		var item = theLevel.itemAt(position.x, position.y)
		if (item != null && (item.value == '$' || item.value == '*')) {
			grabbing = item
			console.log("grabbing " + item)
		} else {
			// var route = []

			// var playerPosition = getPlayerPosition()

			// if (item == null || item.value == '.') {
			// 	var path = findPath(position, playerPosition)
			// 	route = pathToRoute(path)

			// }
			// if (route.length > 0) {
			// 	performMoves(route, 0)
			// } else {
			if (window.navigator.msPointerEnabled) {
				touchStartClientX = event.pageX;
				touchStartClientY = event.pageY;
			} else {
				touchStartClientX = event.touches[0].clientX;
				touchStartClientY = event.touches[0].clientY;
			}
			// }
		}

		event.preventDefault();
	}, { passive: false });

	gameContainer.addEventListener(this.eventTouchmove, function (event) {
		event.preventDefault();
		if (grabbing != null) {
			dragTreasure(event)
		}
	}, { passive: false });

	gameContainer.addEventListener(this.eventTouchend, function (event) {
		if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
			event.targetTouches.length > 0 ||
			self.targetIsInput(event)) {
			return; // Ignore if still touching with one or more fingers or input
		}

		var performedMove = false;

		var touch = event.changedTouches[0]

		if (grabbing != null) {
			var positions = detectAllCoordinates(touch, touch.radiusX, true)
			// var position = detectCoordinate(touch)
			console.log(positions)
			var i = 0
			while (!performedMove && i < positions.length) {
				var path = findPush(grabbing, positions[i])
				if (path.length != 0) {
					performedMove = true;
					var route = pathToRoute(path)
					// console.log(route)
					performMoves(route, 0)
				} else {
					i += 1;
				}
			}
			grabbing = null
		} else {
			var touchEndClientX, touchEndClientY;

			if (window.navigator.msPointerEnabled) {
				touchEndClientX = event.pageX;
				touchEndClientY = event.pageY;
			} else {
				touchEndClientX = touch.clientX;
				touchEndClientY = touch.clientY;
			}

			var dx = touchEndClientX - touchStartClientX;
			var absDx = Math.abs(dx);

			var dy = touchEndClientY - touchStartClientY;
			var absDy = Math.abs(dy);

			if (Math.max(absDx, absDy) > 10) {
				// (right : left) : (down : up)
				self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
				performedMove = true;
			} else {
				var positions = detectAllCoordinates(touch, touch.radiusX)

				var i = 0;
				while (!performedMove && i < positions.length) {
					position = positions[i]
					var item = theLevel.itemAt(position.x, position.y)

					var path = [];

					var playerPosition = getPlayerPosition()

					if (item == null || item.value == '.') {
						var sTime = performance ? performance.now() : new Date().getTime();
						path = findPath(position, playerPosition)
						var fTime = performance ? performance.now() : new Date().getTime(),
							duration = (fTime - sTime).toFixed(2);

						// if (path.length === 0) {
						// 	pathFindingEvent("move-failed", duration)
						// } else {
						// 	pathFindingEvent("move", duration)
						// }

					}
					if (path.length > 0) {
						performedMove = true;
						var route = pathToRoute(path)
						performMoves(route, 0)
					} else {
						i += 1;
					}
				}

			}
		}

		if (performedMove == false) {
			var classes = Array.from(event.target.classList)
			if (classes.includes("wall") || classes.includes("piece") || classes.includes("GameBoard")) {
				// if (event.target.className == "GameBoard") {
				animateNoPath()
			}
		}
	});
}

KeyboardInputManager.prototype.restart = function (event) {
	event.preventDefault();
	this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
	event.preventDefault();
	this.emit("keepPlaying");
};

KeyboardInputManager.prototype.toggleMute = function (event) {
	event.preventDefault();
	this.emit("toggleMute");
};

KeyboardInputManager.prototype.undo = function (event) {
	event.preventDefault()
	this.emit("undo")
}

KeyboardInputManager.prototype.redo = function (event) {
	event.preventDefault()
	this.emit("redo")
}

KeyboardInputManager.prototype.info = function (event) {
	event.preventDefault()
	var modal = document.getElementById('info-modal');
	modal.style.display = "block";
}

KeyboardInputManager.prototype.fullScreen = function (event) {
	event.preventDefault()
	// var body = document.getElementsByTagName("body")

	if (document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		document.getElementById("fullscreen-icon").innerHTML = "enter_fullscreen"
	} else {
		var element = document.documentElement
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
		document.getElementById("fullscreen-icon").innerHTML = "exit_fullscreen"
	}
}

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
	var button = document.querySelector(selector);
	button.addEventListener("click", fn.bind(this));
	button.addEventListener(this.eventTouchend, fn.bind(this));
};

KeyboardInputManager.prototype.targetIsInput = function (event) {
	return event.target != document && event.target.tagName.toLowerCase() === "input";
};

Function.prototype.bind = Function.prototype.bind || function (target) {
	var self = this;
	return function (args) {
		if (!(args instanceof Array)) {
			args = [args];
		}
		self.apply(target, args);
	};
};


var event; // The custom event that will be created
var intervalId; // keep the ret val from setTimeout()
var keyRepeatTimout;
function buttonDown(direction) {
	var key;
	var keyCode;
	console.log(direction)
	switch (direction) {
		case "up":
			key = "ArrowUp"
			keyCode = 38;
			break;
		case "down":
			key = "ArrowDown"
			keyCode = 40;
			break;
		case "left":
			key = "ArrowLeft"
			keyCode = 37;
			break;
		case "right":
			key = "ArrowRight"
			keyCode = 39;
			break;

		default:
			break;
	}
	event = new KeyboardEvent("keydown", { "key": key, "code": key, "keyCode": keyCode, "which": keyCode })
	// console.log(event)
	document.dispatchEvent(event)

	keyRepeatTimout = setTimeout(function () {
		document.dispatchEvent(event)
		intervalId = setInterval(function () {
			document.dispatchEvent(event)
		}, 83)
	}, 500)
}

function buttonUp() {
	clearTimeout(keyRepeatTimout);
	clearInterval(intervalId);
	var key = event.key;
	var keyCode = event.keyCode;
	event = new KeyboardEvent("keyup", { "key": key, "code": key, "keyCode": keyCode, "which": keyCode })
	document.dispatchEvent(event);
}

