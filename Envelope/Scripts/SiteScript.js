var current_item = 0;

var section_hide_time = 900;
var section_show_time = 900;

$().ready(function() {

// Switch section
	$(".menue h2").on("click", function() {
		if (!$(this).hasClass("active")) {
			current_item = this;
			// close all visible divs with the class of .section
			$(".section:visible").fadeOut(section_hide_time, function() {
				$(".menue h2").removeClass("active");
				$(current_item).addClass("active");
				var new_section = $($(current_item).attr("id"));
				new_section.fadeIn(section_show_time);
			});
		} else {

		}

	});

});

function fadeMyDiv() {
	$("#head").fadeOut(1500);
}