
$(function () {
	
	$("body").keydown(playAcapella).keyup(stopAcapella);
});

var acapella_sound_state = {
	Q: new Audio("./moosic/britney-toxic.mp3"),
	W: new Audio("./moosic/carly-call-me-maybe.mp3"),
	E: new Audio("./moosic/adele-set-fire.mp3"),
	R: new Audio("./moosic/zedd-clarity.mp3"),

	A: new Audio("./moosic/kanye-touch-the-sky.mp3"),
	S: new Audio("./moosic/rihanna-where-have-you-been.mp3"),
	D: new Audio("./moosic/danza-kuduro.mp3"),
	F: new Audio("./moosic/maroon5-payphone.mp3"),

	H: new Audio("./moosic/effects/fade1.mp3"),
	J: new Audio("./moosic/effects/fade2.mp3"),
	K: new Audio("./moosic/effects/longzap.mp3"),
	L: new Audio("./moosic/effects/shortzap.mp3"),
	M: new Audio("./moosic/effects/severalzips.mp3"),
}
var sounds_on_page = $("#music-dashboard");
var map = {
	81: false, 
	87: false, 
	69: false, 
	82: false,

	65: false,
	83: false,
	68: false,
	70: false,

	//  DJ effects
	72: false,
	74: false,
	75: false,
	76: false,
	77: false,
}
var keycode_to_key = {
	81: "Q",
	87: "W",
	69: "E",
	82: "R",

	65: "A",
	83: "S",
	68: "D",
	70: "F",

	//  DJ effects
	72: "H",
	74: "J",
	75: "K",
	76: "L",
	77: "M",
}

function playAcapella (evt) {
	
	var keycode = evt.keyCode || evt.which;

	console.log(keycode);
    if (keycode in map) {
        map[keycode] = true;
    }

   for (var key in map) {
      // important check that this is objects own property 
      // not from prototype prop inherited
      if(map.hasOwnProperty(key) && map[key]){
        	// Q
		var keyname = keycode_to_key[key];
		startAcapellaAudio(keyname);
      }
   }

}

function stopAcapella (evt) {

	var keycode = evt.keyCode || evt.which;

	//console.log(keycode);
    if (keycode in map) {
        map[keycode] = false;
    }
    for (var key in map) {
      // important check that this is objects own property 
      // not from prototype prop inherited
      if(map.hasOwnProperty(key) && !map[key]){
			
			var keyname = keycode_to_key[key];
			stopAcapellaAudio(keyname);
      }
   }

}

function startAcapellaAudio (key) {
	sounds_on_page.find("#" + key).addClass("pressed");
	acapella_sound_state[key].play();
	if (acapella_sound_state[key].ended){
		var filename = $(acapella_sound_state[key]).attr("src");
		acapella_sound_state[key] = new Audio(filename);
	}
	//console.log(acapella_sound_state[key].ended);
}

function stopAcapellaAudio (key) {
	//console.log(key);

	sounds_on_page.find("#" + key).removeClass("pressed");
	acapella_sound_state[key].pause();
	var filename = $(acapella_sound_state[key]).attr("src");
	acapella_sound_state[key] = new Audio(filename);
}