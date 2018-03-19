
var manager

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {

});

var isMobile = false
var isTablet = false

function prepareGame() {

	let qVar = getQueryVariable("level")
	let last = getCookie("level")

	if (qVar != false) {
		levelNumber = qVar
	} else if (last != "") {
		levelNumber = last
	} else {
		levelNumber = 201
	}


	isMobile = window.mobilecheck()
	if (isMobile) {
		
		switch (Math.abs(window.orientation)) {
			case 90:
				// alert('landscape');
				if (!isTablet) {
					document.getElementById("dPad").innerHTML = ""
				}
				break;
			default:
				if (!isTablet) {
					drawNavigation()
				}
				// alert('portrait');
				break;
		}
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


	setupInfo()
}

function doOnOrientationChange() {
	switch (Math.abs(window.orientation)) {
		case 90:
			// alert('landscape');
			if (!isTablet) {
				document.getElementById("dPad").innerHTML = ""
			}
			break;
		default:
			if (!isTablet) {
				drawNavigation()
			}
			// alert('portrait');
			break;
	}
	manager.setup()
}

var resizeTimer
function windowDidResize(e) {
	clearTimeout(resizeTimer)
	resizeTimer = setTimeout(function () {
		// run code here, resizing has "stopped"
	}, 250)
}


window.addEventListener('orientationchange', doOnOrientationChange);

// window.onload = function() {
// 	    LoadAllLevels();
// }


window.addEventListener('resize', windowDidResize(this))


window.mobilecheck = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

function drawNavigation() {
	console.log("thisIsMobile")
	// 		< div style= "text-align:center;width:480px;" >
	// 			<button onclick="moveup()">UP</button> <br><br>
	// 				<button onclick="moveleft()">LEFT</button>
	// 				<button onclick="moveright()">RIGHT</button><br><br>
	// 					<button onclick="movedown()">DOWN</button>
	//   </div>

	var navigation = document.getElementById("dPad");

	// var navigation = document.createElement("div")
	var up = document.createElement("button")
	var down = document.createElement("button")
	var left = document.createElement("button")
	var right = document.createElement("button")
	// navigation.setAttribute("style", "text-align:center;width:480px;bottom: 10px;position: absolute;")
	up.className = "move-button"
	up.id = "mvUp"
	up.innerHTML = '<i class="material-icons navigation-button">up_arrow</i>';

	left.className = "move-button"
	left.id = "mvLeft"
	left.innerHTML = '<i class="material-icons navigation-button">left_arrow</i>';

	down.className = "move-button"
	down.id = "mvDown"
	down.innerHTML = '<i class="material-icons navigation-button">down_arrow</i>';

	right.className = "move-button"
	right.id = "mvRight"
	right.innerHTML = '<i class="material-icons navigation-button">right_arrow</i>';

	console.log(up.attributes);

	// up.setAttribute("onclick", "manager.move(0)")
	// down.setAttribute("onclick", "manager.move(2)")
	// left.setAttribute("onclick", "manager.move(3)")
	// right.setAttribute("onclick", "manager.move(1)")

	// <button class="move-button" id="mvUp">
	//     <i class="material-icons navigation-button">up_arrow</i>
	// </button>
	// <br>
	// <button class="move-button" id="mvLeft">
	//     <i class="material-icons navigation-button">left_arrow</i>
	// </button>
	// <button class="move-button" id="mvDown">
	//     <i class="material-icons navigation-button">down_arrow</i>
	// </button>
	// <button class="move-button" id="mvRight">
	//     <i class="material-icons navigation-button">right_arrow</i>
	// </button>
	// <br>
	// <br>


	// up.innerText = "⇧"
	// down.innerText = "⇩"
	// left.innerText = "⇦"
	// right.innerText = "⇨"
	navigation.appendChild(up)
	navigation.innerHTML += "<br>"
	navigation.appendChild(left)
	navigation.appendChild(down)
	navigation.appendChild(right)
	// navigation.innerHTML += "<br><br>"
	// document.body.appendChild(navigation)

	var upBtn = document.getElementById("mvUp");
	var leftBtn = document.getElementById("mvLeft");
	var downBtn = document.getElementById("mvDown");
	var rightBtn = document.getElementById("mvRight");

	upBtn.addEventListener("touchstart", function () { buttonDown("up") });
	leftBtn.addEventListener("touchstart", function () { buttonDown("left") });
	downBtn.addEventListener("touchstart", function () { buttonDown("down") });
	rightBtn.addEventListener("touchstart", function () { buttonDown("right") });

	upBtn.addEventListener("touchend", buttonUp);
	leftBtn.addEventListener("touchend", buttonUp);
	downBtn.addEventListener("touchend", buttonUp);
	rightBtn.addEventListener("touchend", buttonUp);


	// upBtn.addEventListener("mousedown", function () { buttonDown("up") });
	// leftBtn.addEventListener("mousedown", function () { buttonDown("left") });
	// downBtn.addEventListener("mousedown", function () { buttonDown("down") });
	// rightBtn.addEventListener("mousedown", function () { buttonDown("right") });

	// upBtn.addEventListener("mouseup", buttonUp);
	// leftBtn.addEventListener("mouseup", buttonUp);
	// downBtn.addEventListener("mouseup", buttonUp);
	// rightBtn.addEventListener("mouseup", buttonUp);

}


function setupInfo() {

	// Get the modal
	var modal = document.getElementById('info-modal');

	// Get the button that opens the modal
	// var btn = document.getElementsByClassName("info-button")[0];

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal 
	// btn.onclick = function () {
	// 	modal.style.display = "block";
	// }

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

}