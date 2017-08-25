
var manager

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {






});

function prepareGame() {

	// LoadAllLevels()


	let qVar = getQueryVariable("level")
	let last = getCookie("level")

	if (qVar != false) {
		levelNumber = qVar
	} else if (last != "") {
		levelNumber = last
	} else {
		levelNumber = 201
	}

	manager = new SokobanManager(KeyboardInputManager, HTMLActuator, LocalStorageManager);

	console.log("manager is ready")

	// TODO: This code is in need of a refactor (along with the rest)
	var storage = new LocalStorageManager;
	// var noticeClose = document.querySelector(".notice-close-button");
	// var notice = document.querySelector(".app-notice");
	// if (storage.getNoticeClosed()) {
	// 	notice.parentNode.removeChild(notice);
	// } else {
	// 	noticeClose.addEventListener("click", function () {
	// 		notice.parentNode.removeChild(notice);
	// 		storage.setNoticeClosed(true);
	// 		ga("send", "event", "notice", "closed");
	// 	});
	// }
}

function doOnOrientationChange() {
	switch (window.orientation) {
		case -90 || 90:
			// alert('landscape');
			break;
		default:
			// alert('portrait');
			break;
	}
	manager.setup()	
}

var resizeTimer
function windowDidResize(e) {
	clearTimeout(resizeTimer)
	resizeTimer = setTimeout(function() {
		// run code here, resizing has "stopped"
	}, 250)
}


window.addEventListener('orientationchange', doOnOrientationChange);

// window.onload = function() {
// 	    LoadAllLevels();
// }


window.addEventListener('resize', windowDidResize(event))