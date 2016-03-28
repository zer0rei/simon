// // // // // // //
// SIMON (by HE)  //
// // // // // // //

// SIMON PROTOTYPE
// // // // // //

function Simon(maxLevel, isStrict) {
	this.maxLevel = maxLevel;
	this.isStrict = isStrict;
	this.replayArray = [];
	this.lightsOn = undefined;
	this.lightsOff= undefined;
	this.gameButton = undefined;
	this.levelDisplay = undefined;
	this.stopped = false;
}

// Setters
// // // //

Simon.prototype.setLights = function(lightsOn, lightsOff) {
	this.lightsOn = lightsOn;
	this.lightsOff = lightsOff;
};

Simon.prototype.setGameButton = function(gameButton) {
	this.gameButton = gameButton;
};

Simon.prototype.setLevelDisplay = function(levelDisplay) {
	this.levelDisplay = levelDisplay;
};

Simon.prototype.setStrict = function(isStrict) {
	this.isStrict = isStrict;
};

// Controles
// // // // //

Simon.prototype.start = function() {
	var that = this;

	// Set defaults
	this.replayArray = [];
	this.stopped = false;
	this.lightsOff();

	// Blink the display
	this.levelDisplay.html("--");
	for (var i = 0; i < 2; i++)
		this.levelDisplay.delay(200).hide(0).delay(200).show(0);

	// Start with level 1
	setTimeout(function() {
		that.previewLevel(1);
	}, 700);
};

Simon.prototype.stop = function() {
	this.stopped = true;
};

// Game
// // //

Simon.prototype.previewLevel = function(level) {
	if (this.stopped)
		return;

	// Show current level
	this.levelDisplay.html((level < 10) ? "0" + level : level);

	// Preview current level
	var that = this;
	var i = 0;
	var previewInterval = setInterval(function() {
		// Game stopped
		if (that.stopped) {
			clearInterval(previewInterval);
			return;
		}

		// Case new level
		if (that.replayArray.length < level)
			that.replayArray.push(Math.floor(Math.random() * 4));

		// Lights
		that.lightsOn(that.replayArray[i]);
		setTimeout(that.lightsOff, 500);

		// Play the level
		if (++i === level) {
			that.playLevel(level);
			clearInterval(previewInterval);
		}
	}, 800);

};

Simon.prototype.playLevel = function(level) {

	var that = this;

	// Wrong play
	function clickedWrongButton() {
		setTimeout(function() {
			that.levelDisplay.html("<span class='glyphicon glyphicon-thumbs-down'></span>");
			setTimeout(function() {
				if (that.isStrict) {
					clearInterval(gameStopInterval);
					that.start();
				}
				else {
					clearInterval(gameStopInterval);
					that.previewLevel(level);
				}
			}, 700);
		}, 300);
	}

	// Game stop interval
	var gameStopInterval = setInterval(function() {
		if (that.stopped) {
			that.gameButton.off("click");
			clearTimeout(playTimeLimit);
			clearInterval(gameStopInterval);
		}
	}, 200);

	// Reset if no clicks in 4 seconds
	var playTimeLimit = setTimeout(function() {
		that.gameButton.off("click");
		clickedWrongButton();
	}, 4000);

	// if clicked
	var numClicks = 0;
	// Click event handler
	function gameButtonClicked() {
		// Clicked
		numClicks++;
		that.gameButton.off("click");

		// Stop the time limit timer
		clearTimeout(playTimeLimit);
		// Start another timer
		playTimeLimit = setTimeout(function() {
			clickedWrongButton();
		}, 4000);

		// Lights
		var index = Number(this.id.replace(/^\D+/g, "")) - 1;
		that.lightsOn(index);
		setTimeout(that.lightsOff, 500);

		// If Wrong Play
		if (that.replayArray[numClicks - 1] !== index) {
			clearTimeout(playTimeLimit);
			clickedWrongButton();
			return false;
		}

		// If Played the whole sequence right
		if (numClicks === level) {
			setTimeout(function() {
				clearTimeout(playTimeLimit);
				clearInterval(gameStopInterval);
				if (level === that.maxLevel)
					that.celebrate();
				else
					that.previewLevel(level + 1);
			}, 500);
		}
		else {
			setTimeout(function() {
				that.gameButton.one("click", gameButtonClicked);
			}, 500);
		}
	}

	// First click
	this.gameButton.one("click", gameButtonClicked);

};

// Celebration
// // // // //

Simon.prototype.celebrate = function() {
	this.levelDisplay.html("<span class='glyphicon glyphicon-thumbs-up'></span>");
	this.lightsOn();
};

// DOCUMENT READY
// // // // // //

$(document).ready(function() {

	// Layout
	// // //
	$(window).resize(function() {
		var simonTop = ($(window).height() - $("#simon").height()) / 2;
		$("#simon").css("top", simonTop);

		// Circle button height
		$(".circleBox").css("height", $(".circleBox").width());
	});

	// Call resize to center simon
	$(window).resize();

	// SIMON LOGIC
	// // // // //

	// Game buttons
	var buttonsArray = ["#button1", "#button2", "#button3", "#button4"];

	// Normal colors
	var green = "#19956C",
		red = "#DC3C31",
		yellow = "#F8C319",
		blue = "#2978C4";
	var colorArray = [green, red, yellow, blue];

	// Light colors
	var lightGreen = "#2FE488",
		lightRed = "#FC4950",
		lightYellow = "#FEFF0F",
		lightBlue = "#41C9FF";
	var lightColorArray = [lightGreen, lightRed, lightYellow, lightBlue];

	// Start and Strict buttons
	var startColor = "#4EAD4A",
		strictColor = "#EB9D3E",
		lightStartColor = "#25FF06",
		lightStrictColor = "#F3FF0F";

	// Lights On/Off
	function lightsOn(buttonIndex) {
		if (arguments.length === 0)
			for (var i = 0; i < 4; i++)
				$(buttonsArray[i]).css("background-color", lightColorArray[i]);
		else {
			$(buttonsArray[buttonIndex]).css("background-color", lightColorArray[buttonIndex]);
		}
	}

	function lightsOff() {
		for (var i = 0; i < 4; i++)
			$(buttonsArray[i]).css("background-color", colorArray[i]);
	}

	// Color Swirl
	function colorSwirl(times) {
		if (times < 1 || isNaN(times))
			times = 1;

		var colorCopy = lightColorArray.slice();
		// Light Up
		var i = 0;
		var interval = setInterval(function() {
			colorCopy.unshift(colorCopy.pop());
			$("#button1").css("background-color", colorCopy[0]);
			$("#button2").css("background-color", colorCopy[1]);
			$("#button4").css("background-color", colorCopy[2]);
			$("#button3").css("background-color", colorCopy[3]);
			if (i++ === 4 * times) {
				clearInterval(interval);
				lightsOff();
			}
		}, 100);
	}

	// SET SIMON GAME
	var game = new Simon(20, strictOn);
	game.setLights(lightsOn, lightsOff);
	game.setGameButton($(".gameButton"));
	game.setLevelDisplay($("#levelDisplay p"));

	// On/Off Switches
	var switchedOn = false;
	var gameStarted = false;
	var strictOn = false;

	$("#switchButton").click(function() {
		if (!switchedOn) {
			switchedOn = true;
			$(this).children("#switchToggle").css("float", "left");
			colorSwirl(2);

			// Start button
			$("#startButton").click(function() {
				if (gameStarted) {
					game.stop();
					setTimeout(function() {
						game.start();
					}, 200);
				}
				else {
					gameStarted = true;
					$(this).css("background-color", lightStartColor);
					game.start();
				}
			});

			// Strict button
			$("#strictButton").click(function() {
				if (strictOn) {
					strictOn = false;
					if (typeof game !== "undefined")
						game.setStrict(strictOn);
					$(this).css("background-color", strictColor);
				}
				else {
					strictOn = true;
					if (typeof game !== "undefined")
						game.setStrict(strictOn);
					$(this).css("background-color", lightStrictColor);
				}
			});
		}
		else {
			// Set state off
			switchedOn = false;
			gameStarted = false;
			game.stop();

			// Set display off
			lightsOff();
			setTimeout(function() {
				$("#levelDisplay p").html("--");
			}, 200);
			$(this).children("#switchToggle").css("float", "right");
			$("#startButton").css("background-color", startColor);
			$("#strictButton").css("background-color", strictColor);
			$("#startButton, #strictButton").off();
		}

	}); // <<< switchButton

}); // <<< ready
