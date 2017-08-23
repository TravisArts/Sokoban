

function LevelStruct(dataArray, title) {
	this.rows = dataArray[0]
	this.columns = dataArray[1]
	this.packs = dataArray[2]
	this.savedPacks = dataArray[3]
	this.playerV = dataArray[4] - 1
	this.playerH = dataArray[5] - 1
	this.rawData = dataArray.slice(6, dataArray.count)
	this.title = title

	this.moves = 0
	this.pushes = 0


	this.objArr = new Array()

	this.player // = new SokoPiece({x: this.playerH, y: this.playerV }, '@')

}

LevelStruct.prototype.addPlayer = function () {
	var position = { x: this.playerH, y: this.playerV }
	var item = this.itemAt(position)
	if (item == null || item.value == "@") {
		this.player = new SokoPiece(position, "@")		
	} else if (item.value == '.' || item.value == '+') {
		this.player = new SokoPiece(position, "+")		
	}

}

LevelStruct.prototype.cleanWalls = function () {


	var WallObjs = this.empty()

	var wallArr = ['•', '╹', '╸', '┛', '╺', '┗', '━', '┻', '╻', '┃', '┓', '┫', '┏', '┣', '┳', '╋',
	'•', '╹', '╸', '╝', '╺', '┗', '━', '┹', '╻', '┃', '┓', '┩', '┏', '┣', '┳', '╃',
	'•', '╹', '╸', '┛', '╺', '╚', '━', '┺', '╻', '┃', '┓', '┫', '┏', '┡', '┳', '╄',
	'•', '╹', '╸', '╝', '╺', '╚', '━', '╩', '╻', '┃', '┓', '┩', '┏', '┡', '┳', '╇',
	'•', '╹', '╸', '┛', '╺', '┗', '━', '┻', '╻', '┃', '╗', '┪', '┏', '┣', '┱', '╅',
	'•', '╹', '╸', '╝', '╺', '┗', '━', '┹', '╻', '┃', '╗', '╣', '┏', '┣', '┱', '╉',
	'•', '╹', '╸', '┛', '╺', '╚', '━', '┺', '╻', '┃', '╗', '┪', '┏', '┡', '┱', '╱',
	'•', '╹', '╸', '╝', '╺', '╚', '━', '╩', '╻', '┃', '╗', '╣', '┏', '┡', '┱', '╭',
	'•', '╹', '╸', '┛', '╺', '┗', '━', '┻', '╻', '┃', '┓', '┫', '╔', '┢', '┲', '╆',
	'•', '╹', '╸', '╝', '╺', '┗', '━', '┹', '╻', '┃', '┓', '┩', '╔', '┢', '┲', '╲',
	'•', '╹', '╸', '┛', '╺', '╚', '━', '┺', '╻', '┃', '┓', '┫', '╔', '╠', '┲', '╊',
	'•', '╹', '╸', '╝', '╺', '╚', '━', '╩', '╻', '┃', '┓', '┩', '╔', '╠', '┲', '╮',
	'•', '╹', '╸', '┛', '╺', '┗', '━', '┻', '╻', '┃', '╗', '┪', '╔', '┢', '╦', '╈',
	'•', '╹', '╸', '╝', '╺', '┗', '━', '┹', '╻', '┃', '╗', '╣', '╔', '┢', '╦', '╰',
	'•', '╹', '╸', '┛', '╺', '╚', '━', '┺', '╻', '┃', '╗', '┪', '╔', '╠', '╦', '╯',
	'•', '╹', '╸', '╝', '╺', '╚', '━', '╩', '╻', '┃', '╗', '╣', '╔', '╠', '╦', '╬']




	for (var y = 0; y < this.rows; y++) {
		for (var x = 0; x < this.columns; x++) {
			let item = this.itemAt(x, y)
			if (item && item.value == "#") {
				var flags = this.checkSurroundings(x, y)

				WallObjs[x][y] = wallArr[flags]
			}
		}
	}

	for (var y = 0; y < this.rows; y++) {
		for (var x = 0; x < this.columns; x++) {
			let item = this.itemAt(x, y)
			if (item && item.value == "#") {
				this.itemAt(x, y).value = WallObjs[x][y]
			}
		}
	}

}

LevelStruct.prototype.checkSurroundings = function (x, y) {
	var result = 0;

	var Ty = (y - 1)
	var By = (y + 1)
	var Lx = x - 1
	var Rx = x + 1

	var TL, T, TR
	var L, S, R
	var BL, B, BR

	TL = this.itemAt(Lx,Ty)
	T = this.itemAt(x, Ty)
	TR = this.itemAt(Rx, Ty)
	L = this.itemAt(Lx, y)
	S = this.itemAt(x, y)

	R = this.itemAt(Rx, y)
	BL = this.itemAt(Lx, By)
	B = this.itemAt(x, By)
	BR = this.itemAt(Rx, By)


	// alert(TL + T + TR + "\n" + L + S + R + "\n" + BL + B + BR);

	if (T != null) {
		if (T.value == '#') result |= 1
	}
	if (L != null) {
		if (L.value == '#') result |= 2
	}
	if (R != null) {
		if (R.value == '#') result |= 4
	}
	if (B != null) {
		if (B.value == '#') result |= 8
	}
	if (TL != null) {
		if (TL.value == '#') result |= 16
	}
	if (TR != null) {
		if (TR.value == '#') result |= 32
	}
	if (BL != null) {
		if (BL.value == '#') result |= 64
	}
	if (BR != null) {
		if (BR.value == '#') result |= 128
	}
	return result;

}

LevelStruct.prototype.empty = function () {
	var cells = []

	for (var x = 0; x < this.columns; x++) {
		var row = cells[x] = []

		for (var y = 0; y < this.rows; y++) {
			row.push(null)
		}
	}

	return cells
}

LevelStruct.prototype.getPlayer = function () {
	console.log('{x:' + this.playerH + ',y:' + this.playerV + '}')
	return this.itemAt(this.playerH, this.playerV)
}

LevelStruct.prototype.itemAt = function (X, Y) {
	var x, y
	if (Y != null) {
		x = X
		y = Y
	} else {
		x = X.x
		y = X.y
	}

	if (this.withinBounds({ x: x, y: y })) {
		return this.objArr[x][y]
	} else {
		return null
	}
}

LevelStruct.prototype.changeItem = function (X, Y, value) {
	var x, y
	if (value != null) {
		x = X
		y = Y
	} else {
		x = X.x
		y = X.y
	}
	if (Y != null) {
		if (this.itemAt(x, y) == null) {
			this.addItem(new SokoPiece({ x: x, y: y }, value))
		} else {
			this.objArr[x][y].value = value
		}
	} else {
		theLevel.objArr[x][y] = null		
	}
}

LevelStruct.prototype.addItem = function (piece) {
	// console.log(piece)
	this.objArr[piece.x][piece.y] = piece
}


LevelStruct.prototype.serialize = function () {
	var result = new Array


	// var arr = new Array(this.rawData.length)
	var arr = new Array
	arr = this.empty()

	for (var x = 0; x < this.columns; x++) {
		for (var y = 0; y < this.rows; y++) {
			var item = this.itemAt(x, y)

			if (item != null) {
				arr[x][y] = item.value
			}
		}
	}
	this.playerH = this.player.x
	this.playerV = this.player.y
	
	return {
		rows: this.rows,
		columns: this.columns,
		packs: this.packs,
		savedPacks: this.savedPacks,
		playerV: this.playerV,
		playerH: this.playerH,
		moves: this.moves,
		pushes: this.pushes,
		objArr: arr
	}

}

LevelStruct.prototype.withinBounds = function (position) {
	return position.x >= 0 && position.x < this.columns &&
		position.y >= 0 && position.y < this.rows
};


// Call callback for every cell
LevelStruct.prototype.eachCell = function (callback) {
	for (var x = 0; x < this.columns; x++) {
		for (var y = 0; y < this.rows; y++) {
			callback(x, y, this.objArr[x][y])
		}
	}
};

LevelStruct.prototype.removeItem = function (piece) {
	this.objArr[piece.x][piece.y] = null;
};


