const timerDuration = 60 * 30 * 1000;

const timerElement = document.querySelector("#timer");
const restartButton = document.querySelector("#restart");
restartButton.onclick = restartTimer;
const stopButton = document.querySelector("#stop");
stopButton.onclick = clearTimer;

let canShowNotification = false;
let timerRunning = false;
let notification = null;

Notification.requestPermission().then(permission => {
    console.info("Notification.requestPermission()", permission);
    canShowNotification = permission == "granted";
});

function restartTimer() {
    clearTimer();

    let start = performance.now();
    let end = start + timerDuration;
    let lastUpdate = 0;
    const updateTimer = (now, forceUpdate) => {
        if (now - lastUpdate >= 500 || forceUpdate) {
            const delta = now - start;
            let totalRemainingSeconds = Math.floor((timerDuration - delta) / 1000);
            
            if (totalRemainingSeconds < 0) {
                totalRemainingSeconds = 0;
            }

            let minutes = (Math.floor(totalRemainingSeconds / 60)).toString();
            if (minutes.length == 1) {
                minutes = `0${minutes}`;
            }
            
            let seconds = (totalRemainingSeconds % 60).toString();
            if (seconds.length == 1) {
                seconds = `0${seconds}`;
            }

            const timer = `${minutes}:${seconds}`;
            timerElement.innerHTML = timer;
            document.title = `(${timer}) Time to Move`;

            lastUpdate = now;
        }

        if (now >= end) {
            clearTimer();
            showNotification();
        }

        if (timerRunning) {
            requestAnimationFrame(updateTimer);
        }
    };

    timerRunning = true;
    updateTimer(start, true);
}

function clearTimer() {
    timerRunning = false;
}

function showNotification() {
    if (!canShowNotification) {
        return;
    }
    
    const title = "Time to Move";    
    const body = "It's time to move around.";
    const icon = "icon.png";
    notification = new Notification(title, { body, icon });
    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    };
}
