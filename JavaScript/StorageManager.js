

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
    this.bestScoreKey = "bestScore"
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
LocalStorageManager.prototype.getBestScore = function (level) {
    var scoreJSON = this.storage.getItem(this.bestScoreKey + level)
    return scoreJSON ? JSON.parse(scoreJSON) : { moves: 0, pushes: 0};
}
LocalStorageManager.prototype.setBestScore = function (moves, pushes, level) {
    var score = { moves: moves, pushes: pushes }
    this.storage.setItem(this.bestScoreKey + level, JSON.stringify(score))
}

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function (level) {
    var stateJSON = this.storage.getItem(this.gameStateKey + level);
    console.log(stateJSON ? JSON.parse(stateJSON) : null)
    return stateJSON ? JSON.parse(stateJSON) : null
};

LocalStorageManager.prototype.setGameState = function (gameState, level) {
    this.storage.setItem(this.gameStateKey + level, JSON.stringify(gameState));
    // console.log(gameState)
};

LocalStorageManager.prototype.clearGameState = function (level) {
    this.storage.removeItem(this.gameStateKey + level);
};

LocalStorageManager.prototype.updateScoreStorage = function () {
    console.log("updating storage")
    for (var levelNumber = 200; levelNumber < 720; levelNumber++) {
        // var bestMoves = this.getBestMoves(levelNumber)
        // var bestPushes = this.getBestPushes(levelNumber)
        // console.log(bestMoves + "," + bestPushes)
        // if (bestMoves != null && bestPushes != null) {
        //     this.setBestScore(bestMoves, bestPushes, levelNumber)
        //     this.storage.removeItem(this.bestMoveKey+levelNumber);
        //     this.storage.removeItem(this.bestPushKey+levelNumber);
        // }

        var bestScore = this.getBestScore(levelNumber)
        console.log(bestScore)
        if (bestScore != null) {
            if (bestScore.moves == 0 && bestScore.pushes == 0) {
                this.storage.removeItem(this.bestScoreKey + levelNumber)
            }
        }
    }
}


function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";"
}

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for ( var i = 0; i < ca.length; i++ ) {
        var c = ca[i]

        while ( c.charAt(0) == ' ' ) {
            c = c.substring(1)
        }
        
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function listCookies() {
    var theCookies = document.cookie.split(';')
    var aString = ''
    for (var i = 1; i<= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n"
    } 

    return aString
}