var apiKey = 'IJMOFOATE6IHSZVFT'; //echoNest api key
var soundCloudApiKey = '7f3d2944e383b89225583a4a8ad4dac1'; //soundcloud client id key

var remixer;
var player;
var track;
var remixed;
var intervalVar; //(should not be global) holds event trigger for updating waveform 

//zeroeth mix - no mix
function mix0(track){
  var redo = new Array();

  if(!track.status || track.status != "ok")
    return redo;

  for(var i=0; i<track.analysis.beats.length; i++){
	redo.push(track.analysis.beats[i]);
  }

  return redo;
}

//first mix -s swapper - doubles first beat, swaps 2nd and 3rd beats
function mix1(track){

  var redo = new Array();
  
  if(!track.status || track.status != "ok")
    return redo;
			
  var meter = parseInt(track.analysis.track.time_signature);
  
  console.log("starting length: "+track.analysis.beats.length);
  
  for (var i=0; i < track.analysis.beats.length; i++) {
      switch (i % meter) {
      	case 0: redo.push(track.analysis.beats[i]);
  		redo.push(track.analysis.beats[i]);
  		break;
  	case 1: break;
  	case 2: redo.push(track.analysis.beats[i]);
  		redo.push(track.analysis.beats[i-1]);
  		break;
  	default:redo.push(track.analysis.beats[i]);
  		break;
      }
  }

  console.log("ending length: "+redo.length);
  
  return redo;
}

//second mix - reverses beats in song
function mix2(track){

  var redo = new Array();

  if(!track || track.status != "ok")
    return redo;

  console.log("reversing song");
  for (var i=track.analysis.beats.length-1; i>=0; i--) {
    redo.push(track.analysis.beats[i]);
  }

  return redo;
}

//third mix - scrambles beats in each measure
function mix3(track){

  var redo = new Array();

  var meter = parseInt(track.analysis.track.time_signature);
  var beatArray = new Array();

  for(var i=0; i<meter; i++)
    beatArray.push(i);

  if(!track || track.status != "ok")
    return redo;

  console.log("scrambling music");
  for (var i=0; i < track.analysis.bars.length - 1; i++) {
    shuffle(beatArray);
    
    for(var ind=0; ind<meter; ind++)
      redo.push(track.analysis.beats[i*meter+beatArray[ind]]);
  }

  return redo;

}

//function that shuffles array
function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//slicer - replace one random beats per measure with another beat
function mix4(track){

  var redo = new Array();

  var meter = parseInt(track.analysis.track.time_signature);

  if(!track || track.status != "ok")
    return redo;

  console.log("slicing music");
  var remove;
  for (var i=0; i < track.analysis.bars.length - 1; i++) {
    
    remove = Math.floor(Math.random()*meter);

    for(var ind=0; ind<meter; ind++){
    
      if(ind!=remove){	
	redo.push(track.analysis.beats[i*meter+ind]);
      } else{
	redo.push(track.analysis.beats[i*meter+ind+1]);
      }
    }

  }

  return redo;

}

//twinsies - mix the beginning of the song with the end of the song
function mix5(track){

  var redo = new Array();

  if(!track || track.status != "ok")
    return redo;

  console.log("twinsies!");

  for(var i=0, j=track.analysis.beats.length-1; 
      i<track.analysis.beats.length/2; i++, j--){    

    redo.push(track.analysis.beats[i]);
    redo.push(track.analysis.beats[j]);

  }

  return redo;
}

//random walk - randomly move from the middle of the music, assembling the beats
function mix6(track){
  
  var redo = new Array();

  if(!track || track.status != "ok")
    return redo;

  console.log("random walk!");

  var indices = new Array();
  for(var ind=0; ind<track.analysis.beats.length; ind++)
    indices.push(ind);

  var pos = indices.length/2;
  while(indices.length > 0){

    if(indices.length > pos && pos >= 0)
    	redo.push(track.analysis.beats[indices.splice(pos, 1)]);
    else
        redo.push(track.analysis.beats[indices.splice(indices.length/2, 1)]);

    pos = indices.length/2;
 
    if(Math.random() > 0.5)
      pos--;
    else
      pos++;

  }

  return redo;
}

function init(){
    if (window.webkitAudioContext === undefined) {
        error("Sorry, this app needs advanced web audio. Your browser doesn't"
            + " support it. Try the latest version of Chrome");
    } else {

        // initialize the waveform object
        var wavesurfer = Object.create(WaveSurfer);
        wavesurfer.init({
                canvas: document.querySelector('#wave'),
        	    waveColor: 'violet',
        	    progressColor: 'purple',
             loadingColor: 'purple',
             cursorColor: 'navy'
        });


	      // initialize the web audio player
        var context = new webkitAudioContext();
        remixer = createJRemixer(context, $, apiKey);
        player = remixer.getPlayer();
        $("#info").text("Please enter a SoundCloud URL");

	      $("#soundcloud-submit").click(function() {

		    $("#info").text("Getting data from SoundCloud...");
		    var soundCloudURL = $("#soundcloud-url").val();

        remixer.remixTrackBySoundCloudURL(soundCloudURL, soundCloudApiKey, function(t, percent) {
         	 track = t;

        	 $("#info").text(percent + "% of the track loaded");
        	 if (percent == 100) {
        	        $("#info").text(percent + "% of the track loaded, done uploading...");
        	 }

        	 if (track && track.status == 'ok') {
                  
                  remixed = track.analysis.beats;
                  wavesurfer.loadBuffer(remixed);
                  $("#play").show();
                  $("#stop").show();
                  $("#start-mixing").show();

                 $("#play").click(function(){
                    console.log("starts playing");          
                    player.stop();
                    if(intervalVar){
                       window.clearInterval(intervalVar);
                       wavesurfer.drawer.progress(0);
                    }   
           
                     player.play(0, remixed);
           
                     // function to force progress bar for waveform 
                     var currentTime = 0; //currentTime, incremented by intervalVar
                     var timeInt = 100; //refreshing of cursor in milliseconds
                     intervalVar = window.setInterval(function(){
                        currentTime += timeInt/1000;
                         wavesurfer.drawer.progress(currentTime/track.analysis.meta.seconds);
                      }, timeInt);
  
                   }); //end of start.click();
     
                  $("#stop").click(function () {
                      console.log("stop playing");

                      player.stop();
                      window.clearInterval(intervalVar);
                      wavesurfer.drawer.progress(0);
                   }); //end of stop.click();
                  
                  $("#info").text("Original Song, Select Remix");


              $("#select-mix-styles").show();
		      	  $("#select-mix-styles").find("input").click(function(evt){
                  //make the remixer based on switching the value of the form
          			  switch($(evt.currentTarget).attr("id")){ 
          			  	case "no-mix": remixed = mix0(track);
          				       break;
          			  	case "dice": remixed = mix1(track);
          				       break;
          			  	case "reverse": remixed = mix2(track);
          				       break;
          			  	case "scramble": remixed = mix3(track);
          				       break;
          			  	case "slice": remixed = mix4(track);
          				       break;
          			  	case "twins": remixed = mix5(track);
          				       break;
          			  	case "random": remixed = mix6(track);
          				       break;
          			  }

  		       	  //load the remix into the waveform
  		          wavesurfer.loadBuffer(remixed);
          	          
  		  	      $("#info").text("Remix complete!");
  
                // Handle play and stop now that remix complete 

  
        	    	}); //end of select-mix-styles.click();

              $("#start-mixing").click(function (evt) {
                
                $("#info").hide('slow', function(){ $("#info").remove(); });

                $("#start-mixing").hide('slow', function(){ $("#start-mixing").remove(); });

                $("#textbox-div").hide('slow', function(){ $("#textbox-div").remove(); });

                $("#select-mix-styles").hide('slow', function(){ $("#select-mix-styles").remove(); });

                $("#acapella-midi-controls").show("slow");
                $("#dj-effects-midi-controls").show("slow");

                //  STARTS THE MIDI STUFF
                $("body").keydown(playAcapella).keyup(stopAcapella);

              });
		    }
      }); //end of remixer

	   }); //end of sound-cloud submit button
    }
}

window.onload = init;
