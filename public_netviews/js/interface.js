const DEV = false;
var IS_PLAYING = false;


function toggleLiveStream(){
	var i = document.getElementsByTagName("iframe")[0];
	var b = document.getElementsByTagName("button")[0];

	if(i.style.visibility == "hidden"){
		b.innerText = "hide stream";
		i.style.visibility = "visible";
	}else{
		b.innerText = "show stream";
		i.style.visibility = "hidden";
	}
}

function toggleFullScreen(){
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
