function createTimer(date) {
	var daysInner = document.getElementById("days"),
		hoursInner = document.getElementById("hours"),
		minutesInner = document.getElementById("minutes"),
		secondsInner = document.getElementById("seconds");
	var daysText = document.getElementById("days-text"),
		hoursText = document.getElementById("hours-text"),
		minutesText = document.getElementById("minutes-text"),
		secondsText = document.getElementById("seconds-text");

	var dayArray1 = [1, 21, 31, 41, 51, 61],
		dayArray2 = [2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54];

	var hourArray1 = [1, 21],
		hourArray2 = [2, 3, 4, 22, 23, 24];

	var minutesAndSecondsArray1 = [1, 21, 31, 41, 51],
		minutesAndSecondsArray2 = [2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54];

	var countDownDate = new Date(date)
		.getTime();

	var x = setInterval(function() {

		var now = new Date()
			.getTime();
		var distance = countDownDate - now;

		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		daysInner.innerHTML = days;
		if (dayArray1.indexOf(days) !== -1) {
			daysText.innerHTML = 'день';
		} else if (dayArray2.indexOf(days) !== -1) {
			daysText.innerHTML = 'дня';
		} else {
			daysText.innerHTML = 'дней';
		}


		hoursInner.innerHTML = hours;
		if (hourArray1.indexOf(hours) !== -1) {
			hoursText.innerHTML = 'час';
		} else if (hourArray2.indexOf(hours) !== -1) {
			hoursText.innerHTML = 'часа';
		} else {
			hoursText.innerHTML = 'часов';
		}

		minutesInner.innerHTML = minutes;
		if (minutesAndSecondsArray1.indexOf(minutes) !== -1) {
			minutesText.innerHTML = 'минута';
		} else if (minutesAndSecondsArray2.indexOf(minutes) !== -1) {
			minutesText.innerHTML = 'минуты';
		} else {
			minutesText.innerHTML = 'минут';
		}


		secondsInner.innerHTML = seconds;
		if (minutesAndSecondsArray1.indexOf(seconds) !== -1) {
			secondsText.innerHTML = 'секунда';
		} else if (minutesAndSecondsArray2.indexOf(seconds) !== -1) {
			secondsText.innerHTML = 'секунды';
		} else {
			secondsText.innerHTML = 'секунд';
		}

		if (distance < 0) {
			clearInterval(x);
			daysInner.innerHTML = '';
			daysText.innerHTML = '';
			hoursInner.innerHTML = '';
			hoursText.innerHTML = '';
			minutesInner.innerHTML = '';
			minutesText.innerHTML = '';
			secondsInner.innerHTML = '';
			secondsText.innerHTML = '';
		}
	}, 1000);
}