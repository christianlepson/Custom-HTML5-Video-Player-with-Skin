
///////////////////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////////////////
var video = document.getElementById('video');
var playButton = document.getElementById('play-pause');
var volumeButton = document.getElementById('volume');
var fullscreenButton = document.getElementById('fullscreen');
var timeDisplay = document.getElementById('time-display');
var progressBar = document.getElementById('progress-bar');
var playedBar = document.getElementById('progress-played');
$videoContainer = $('#video-container');
$controls = $('#controls');



///////////////////////////////////////////////////////////////////
// Custom Functions
///////////////////////////////////////////////////////////////////

function togglePlayPause() {
	if (video.paused === true) {
		video.play();
		playButton.style.background = "url('icons/pause-icon.png') no-repeat";
	} else {
		video.pause();
		playButton.style.background = "url('icons/play-icon.png') no-repeat";
	}
	
}

function toggleVolume() {
	if (video.muted === true) {
		video.volume = 1.0;
		volumeButton.style.background = "url('icons/volume-on-icon.png') no-repeat";
		video.muted = false;
	} else {
		video.volume = 0.0;
		video.muted = true;
		volumeButton.style.background = "url('icons/volume-off-icon.png') no-repeat";
	}
	
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

///////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////

// Turn off autoplay
video.autoplay = false;

//Hide and show control buttons panel when user hovers over video
$videoContainer.mouseenter(function() {
	$controls.fadeIn(600);
});
$videoContainer.mouseleave(function() {
	$controls.fadeOut(300);
});

// Bind control funcions to control buttons
playButton.addEventListener('click', togglePlayPause);
volumeButton.addEventListener('click', toggleVolume);
fullscreenButton.addEventListener('click', toggleFullScreen);

// Switch Pause button to Play when video ends
video.addEventListener('ended', function() {
	playButton.style.background = "url('icons/play-icon.png') no-repeat";
});

// When video metadata is available (Chrome, Safari)
video.addEventListener('loadedmetadata', initiateControls);

// When video metadata is available (Firefox)
if (video.readyState >= 2) {
      initiateControls();
 }

function initiateControls() {
	console.log(video.duration);
	function updateTime() {
		var playbackTime = formatTime(video.currentTime);
		timeDisplay.innerText = playbackTime + ' / ' + formatTime(video.duration);
	}

	function updatePlayedProgress() {
		var playedPercent = (video.currentTime / video.duration * 100) + "%";
		playedBar.style.width = playedPercent;
	}

	function scrubProgressBar(e) {
		//Get corresponding video time of scrubber's position
		var progressBarPosition = Math.floor(this.getBoundingClientRect().left);
		var hoverPosition = e.pageX;
		var scrubberPosition = (hoverPosition - progressBarPosition);
		var progressBarWidth = this.offsetWidth;
		var scrubberPercentage = (scrubberPosition / progressBarWidth).toFixed(2);
		var scrubberTime = video.duration * scrubberPercentage;
		//update playback time to scrubber's time when progress bar is clicked
		this.addEventListener('click', function() {
			video.currentTime = scrubberTime;
		});
	}

	function highlightText() {
		//Create array of caption elements
		var captions = document.getElementsByClassName('caption');
		var intervals = [];

		//For each caption element, create an object that contains start time,
		//end time, and the caption itself. Add to the intervals[] array
		for (var i = 0; i < captions.length; i++) {
			intervals.push({
				captionStart : captions[i].getAttribute('data-start'),
				captionEnd : captions[i].getAttribute('data-end'),
				caption : captions[i]
			});
		}

		//When video updates
		video.addEventListener('timeupdate', function() {
			//Iterate through the intervals array
			for (var i = 0; i < intervals.length; i++) {
				//Remove highlight class if present
				if (intervals[i].caption.classList.contains('highlight')) {
					intervals[i].caption.classList.remove('highlight');
				}
				//If video is playing during caption time, add highlight class
				if (video.currentTime >= intervals[i].captionStart && video.currentTime < intervals[i].captionEnd) {
					//console.log(intervals[i].caption);
					intervals[i].caption.classList.add('highlight');
				}
			}
		});
	}

	// When playback time changes, change the video display time and 'Played' Bar
	video.addEventListener('timeupdate', function() {
		updateTime(); 
		updatePlayedProgress();
	});

	//Highlight caption text
	highlightText();
	
	// Adjust time when user clicks progress bar
	progressBar.addEventListener('mousemove', scrubProgressBar);



}
	






