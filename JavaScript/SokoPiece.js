

function SokoPiece(position, value) {
	this.x = position.x
	this.y = position.y
	this.value = value

	this.previousPosition = null
}

SokoPiece.prototype.savePosition = function () {
	this.previousPosition = { x: this.x, y: this.y }
}

SokoPiece.prototype.updatePosition = function (position) {
	this.x = position.x
	this.y = position.y
}

SokoPiece.prototype.serialize = function () {
	return {
		position: {
			x: this.x,
			y: this.y
		},
		value: this.value
	}
}

SokoPiece.prototype.didMove = function() {
	if (previousPosition == null) {
		return true
	}
	var sameX = (previousPosition.x == this.x)
	var sameY = (previousPosition.y == this.y)
	if (sameX && sameY) {
		return false
	} else {
		return true
	}
}