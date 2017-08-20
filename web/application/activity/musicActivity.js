define(['system', 'jquery', 'jquery-draggable'], function (system, $) {



    return {

        id: 'musicActivity',
        title: '음악',
        icon: 'ic_music.png',
        layoutHTML: 'activity_music.html',

        init: function () {
            console.log('music init');
          
          $('.wrap').draggable({axis: 'y'});
          
          var audioPlayer = $(".audio-player")[0];

function pad(n) {
	if (n < 10) {
		return "0" + n;
	} else {
		return n.toString();
	}
}

function formatTime(seconds) {
	seconds = Math.floor(seconds);
	if (seconds < 60) {
		return "00:" + pad(seconds);
	} else {
		return pad(parseInt(seconds / 60, 10)) + ":" + pad(seconds % 60);
	}
}

function getTracksDurations() {
	var tracks = $(".track-list li");
	var i = 0;
	$(tracks).each(function() {
		var track = this, url = $(track).data("url");
		var a = '<audio src="' + url + '" id="temp-player-' + i + '">';
		$(".wrap").append(a);
		$("#temp-player-" + i).on("loadedmetadata", function() {
			var str = formatTime(this.duration);
			$(this).remove();
			$(track).find(".time").html(str);
		});
		i++;
	});
}

window.RAF = (function() {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

function updatePlayer() {
	var percent = audioPlayer.currentTime / audioPlayer.duration * 100;
	$(".progress").val(percent);
	$(".timer").html(formatTime(audioPlayer.currentTime));
}

$(function() {
	getTracksDurations();

	$("li.track-info").on("click", function() {
		$(this).addClass("active").siblings().removeClass("active");
		$(audioPlayer).attr("src", $(this).data("url"));
		$(".cover").css({
			"background-image": "linear-gradient(to bottom, rgba(0, 0, 0, .75), rgba(0, 0, 0, 0)), url(" +
				$(this).data("cover") +
				")"
		});
		audioPlayer.play();
	});

	$(".play").on("click", function() {
		audioPlayer.play();
		$(this).hide();
		$(".pause").show();
	});

	$(".pause").on("click", function() {
		audioPlayer.pause();
		$(this).hide();
		$(".play").show();
	});

	$(".stop").on("click", function() {
		audioPlayer.currentTime = 0;
		audioPlayer.pause();
	});

	$(".prev").on("click", function() {
		$(".track-list li.active:not(:first-child)")
			.removeClass("active")
			.prev()
			.addClass("active")
			.click();
	});

	$(".next").on("click", function() {
		$(".track-list li.active:not(:last-child)")
			.removeClass("active")
			.next()
			.addClass("active")
			.click();
	});

	$(".volume-down").on("click", function() {
		audioPlayer.volume -= 0.1;
	});
	$(".volume-up").on("click", function() {
		audioPlayer.volume += 0.1;
	});

	$(".progress").on("click", function(e) {
		var percent = (e.clientX - $(this).offset().left) / $(this).width() * 100;
		audioPlayer.currentTime = percent * audioPlayer.duration / 100;
	});

	$(audioPlayer).on("pause", function() {
		$(".pause").hide();
		$(".play").show();
	});

	$(audioPlayer).on("play", function() {
		$(".play").hide();
		$(".pause").show();
	});

	$(audioPlayer).on("ended", function() {
		$(".track-list li.active:not(:last-child)").next().click();
	});

	//load first track
	$(audioPlayer).attr("src", $(".track-list li.active").data("url"));
	$(".cover").css({
		"background-image": "linear-gradient(to bottom, rgba(0, 0, 0, .75), rgba(0, 0, 0, 0)), url(" +
			$(".track-list li.active").data("cover") +
			")"
	});

	(function animLoop() {
		RAF(animLoop);
		updatePlayer();
	})();
});
        },

        resume: function () {
            console.log('music resume');
            
              
        },

        pause: function () {
            console.log('music pause');
        },

        destroy: function () {
            console.log('music destroy');
        },
    }
})