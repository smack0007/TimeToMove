const timerDuration = 30 * 60 * 1000;

const timerElement = document.querySelector("#timer");
const restartButton = document.querySelector("#restart");
restartButton.onclick = restartTimer;
const stopButton = document.querySelector("#stop");
stopButton.onclick = clearTimer;

let canShowNotification = false;
let timerRunning = false;
let timerStart = 0;
let timerEnd = 0;
let timerLastUpdate = 0;
let notification = null;

Notification.requestPermission().then(permission => {
    console.info("Notification.requestPermission()", permission);
    canShowNotification = permission == "granted";
});

function onVisibilityChange() {
    // If the tab was in the background and the timer stopped
    // in the meantime update the display.
    if (document.visibilityState == "visible" && !timerRunning) {
        updateTimer(Date.now());
    }
};

document.addEventListener("visibilitychange", onVisibilityChange, false);

function restartTimer() {
    clearTimer();

    timerStart = Date.now();
    timerEnd = timerStart + timerDuration;
    timerLastUpdate = timerStart;
    timerRunning = true;

    updateTimer(timerStart, true);
}

function updateTimer(now, forceUpdate) {    
    if ((document.visibilityState == "visible" && now - timerLastUpdate >= 500) || forceUpdate) {
        const delta = now - timerStart;
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

        timerElement.innerHTML = `${minutes}:${seconds}`;

        lastUpdate = now;
    }

    if (timerRunning) {
        if (now >= timerEnd) {
            clearTimer();
            showNotification();
        } else {
            setTimeout(() => { updateTimer(Date.now()) }, 500);
        }
    }
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
