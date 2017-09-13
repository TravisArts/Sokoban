

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
	// this.bindButtonPress(".keep-playing-button", this.keepPlaying);

	// Respond to swipe events
	var touchStartClientX, touchStartClientY;
	var gameContainer = document.getElementsByClassName("gameArea")[0];

	gameContainer.addEventListener(this.eventTouchstart, function (event) {
		console.log(event)
		if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
			event.targetTouches.length > 1 ||
			self.targetIsInput(event)) {
			return; // Ignore if touching with more than 1 finger or touching input
		}

		var touch = event.touches[0]
		// var radiusX = touch.radiusX
		// var radiusY = touch.radiusY
		// var rect = document.getElementsByClassName('GameBoard')[0].getBoundingClientRect()
		// var point = { clientX: touch.clientX - rect.left, clientY: touch.clientY - rect.top }

		// var position = detectCoordinate(touch)

		var position = detectAllCoordinates(touch, touch.radiusX)
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
	});

	gameContainer.addEventListener(this.eventTouchmove, function (event) {
		event.preventDefault();
		if (grabbing != null) {
			dragTreasure(event)
		}
	});

	gameContainer.addEventListener(this.eventTouchend, function (event) {
		if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
			event.targetTouches.length > 0 ||
			self.targetIsInput(event)) {
			return; // Ignore if still touching with one or more fingers or input
		}

		if (grabbing != null) {
			var position = detectCoordinate(event.touches[0])
			var path = findPush(grabbing, position)
			if (path.length != 0) {
				var route = pathToRoute(path)
				// console.log(route)
				performMoves(route, 0)
			}
			grabbing = null
		} else {
			var touchEndClientX, touchEndClientY;

			if (window.navigator.msPointerEnabled) {
				touchEndClientX = event.pageX;
				touchEndClientY = event.pageY;
			} else {
				touchEndClientX = event.changedTouches[0].clientX;
				touchEndClientY = event.changedTouches[0].clientY;
			}

			var dx = touchEndClientX - touchStartClientX;
			var absDx = Math.abs(dx);

			var dy = touchEndClientY - touchStartClientY;
			var absDy = Math.abs(dy);

			if (Math.max(absDx, absDy) > 10) {
				// (right : left) : (down : up)
				self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
			} else {
				var position = detectCoordinate(event.changedTouches[0])
				var item = theLevel.itemAt(position.x, position.y)

				var route = []

				var playerPosition = getPlayerPosition()

				if (item == null || item.value == '.') {
					var path = findPath(position, playerPosition)
					route = pathToRoute(path)

				}
				if (route.length > 0) {
					performMoves(route, 0)
				}

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

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
	var button = document.querySelector(selector);
	button.addEventListener("click", fn.bind(this));
	button.addEventListener(this.eventTouchend, fn.bind(this));
};

KeyboardInputManager.prototype.targetIsInput = function (event) {
	return event.target.tagName.toLowerCase() === "input";
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
