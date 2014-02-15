
$(function () {
	
	$("body").keydown(playAcapella).keyup(stopAcapella);

});

var acapella_sound_state = {
	Q: new Audio("./moosic/britney-toxic.mp3"),
	W: new Audio("./moosic/carly-call-me-maybe.mp3"),
	E: new Audio("./moosic/adele-set-fire.mp3"),
	R: new Audio("./moosic/britney-toxic.mp3")
}

var acapella_on_page = $("#acapella-midi-controls");
var acapella_doms = {
	Q: acapella_on_page.find("#Q"),
	W: acapella_on_page.find("#W"),
	E: acapella_on_page.find("#E"),
	R: acapella_on_page.find("#R")
}

function playAcapella (evt) {
	
	var keycode = evt.keyCode || evt.which;

	//console.log(keycode);

	// Q
	if (keycode == 81){
		startAcapellaAudio("Q");
	}

	// W
	if (keycode == 87){
		startAcapellaAudio("W");
	}

	// E
	if (keycode == 69){
		startAcapellaAudio("E");
	}

	// R
	if (keycode == 82){
		startAcapellaAudio("R");
	}

}

function stopAcapella (evt) {

	var keycode = evt.keyCode || evt.which;

	//console.log(keycode);

	// Q
	if (keycode == 81){
		stopAcapellaAudio("Q");
	}

	// W
	if (keycode == 87){
		stopAcapellaAudio("W");
	}

	// E
	if (keycode == 69){
		stopAcapellaAudio("E");
	}

	// R
	if (keycode == 82){
		stopAcapellaAudio("R");
	}

}

function startAcapellaAudio (key) {
	acapella_doms[key].addClass("pressed");
	acapella_sound_state[key].play();
	//console.log(acapella_sound_state[key].ended);
}

function stopAcapellaAudio (key) {
	//console.log(key);
	acapella_doms[key].removeClass("pressed");
	acapella_sound_state[key].pause();
	var filename = $(acapella_sound_state[key]).attr("src");
	acapella_sound_state[key] = new Audio(filename);
}