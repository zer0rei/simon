$(document).ready(function() {
	$(window).resize(function() {
		var simonTop = ($(window).height() - $("#simon").height()) / 2;
		$("#simon").css("top", simonTop);
	});

	// Call resize to center simon
	$(window).resize();

});
