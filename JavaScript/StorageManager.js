

window.fakeStorage = {
    _data: {},

    setItem: function (id, val) {
        return this._data[id] = String(val);
    },

    getItem: function (id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },

    removeItem: function (id) {
        return delete this._data[id];
    },

    clear: function () {
        return this._data = {};
    }
};

function LocalStorageManager() {
    this.bestMoveKey = "bestMove";
    this.bestPushKey = "bestPush";
    this.gameStateKey = "gameState";

      var supported = this.localStorageSupported();
      this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
    var testKey = "test";
    var storage = window.localStorage;

    try {
        storage.setItem(testKey, "1");
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestPushes = function (level) {
    return this.storage.getItem(this.bestPushKey+level) || 0
};

LocalStorageManager.prototype.getBestMoves = function (level) {
    return this.storage.getItem(this.bestMoveKey+level) || 0
};

LocalStorageManager.prototype.setBestPushes = function (pushes, level) {
    this.storage.setItem(this.bestPushKey+level, pushes);
};

LocalStorageManager.prototype.setBestMoves = function (moves, level) {
    this.storage.setItem(this.bestMoveKey+level, moves);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function (level) {
    var stateJSON = this.storage.getItem(this.gameStateKey+level);
    console.log(stateJSON ? JSON.parse(stateJSON) : null)
    return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState,level) {
    this.storage.setItem(this.gameStateKey+level, JSON.stringify(gameState));
    // console.log(gameState)
};

LocalStorageManager.prototype.clearGameState = function (level) {
    this.storage.removeItem(this.gameStateKey+level);
};
