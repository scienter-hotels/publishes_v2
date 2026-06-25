$(document).ready(function () {
    // Constants
    const countdownTime22222 = 20 * 60; // 20 minutes in seconds
    const countdownDisplay2222 = $('#countdownsasasasasas');
    let timeLeft = countdownTime22222;

    // Update the timer display
    function updateTimer() {
        const interval = setInterval(function () {
            if (timeLeft <= 0) {
                clearInterval(interval);
                //alert('Your session has been ended. Please login again');
                countdownDisplay2222.text('00:00');
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                countdownDisplay2222.text(`${pad(minutes)}:${pad(seconds)}`);
                timeLeft--;
            }
        }, 1000);
    }

    // Pad single digit numbers with a leading zero
    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    // Start the countdown
    updateTimer();
});
