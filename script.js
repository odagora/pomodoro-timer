// URL for an alert sound
const audioURL = 'https://res.cloudinary.com/dagrstwwf/video/upload/v1697845804/alert-sound_twr3z8.wav';

// DOM elements for various components of the timer
const circle = document.querySelector('.circle');
const startButton = document.querySelector('.start');
const settingsButton = document.querySelector('.settings');
const minutesContainer = document.querySelector('.minutes');
const secondsContainer = document.querySelector('.seconds');

// Default initial values
let minutes = Number(minutesContainer.firstElementChild.value);
let seconds = Number(secondsContainer.firstElementChild.value);

// Time constants
let timeLeft, timerId, timePassed = 0;
let { TIME_LIMIT, WARNING_THRESHOLD, ALERT_THRESHOLD } = createTimerConstants(minutes, seconds);

// Styles related constants
const FULL_DASH_ARRAY = 1700;
const TIME_COLORS = {
  warning: {
    name: 'middle',
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: 'ending',
    threshold: ALERT_THRESHOLD
  }
}

// Function to create timer constants
function createTimerConstants(minutes, seconds) {
  const TIME_LIMIT = minutes * 60 + seconds;
  const WARNING_THRESHOLD = TIME_LIMIT / 2;
  const ALERT_THRESHOLD = WARNING_THRESHOLD / 2;

  return {
    TIME_LIMIT,
    WARNING_THRESHOLD,
    ALERT_THRESHOLD
  }
}

// Set the initial time limit based on the user's input
function setInitialTime() {
  const {warning, alert} = TIME_COLORS;
  ({TIME_LIMIT, WARNING_THRESHOLD, ALERT_THRESHOLD} = createTimerConstants(minutes, seconds));

  warning.threshold = WARNING_THRESHOLD;
  alert.threshold = ALERT_THRESHOLD;
  timeLeft = TIME_LIMIT;
}

// Function to toggle the timer (start or stop)
function toggle(button) {
  switch (button.innerHTML) {
    case 'start':
      // Disable the settings button
      settingsButton.setAttribute('disabled', '');
      // Change the button label to 'stop'
      button.innerHTML = 'stop';
      // Start the timer and execute updateTime() and updateDisplay() every second
      timerId = setInterval(() => {
        // Update the time passed and time left
        timePassed++;
        timeLeft = TIME_LIMIT - timePassed;
        // Update the timer's properties
        updateTime();
        updateDisplay();
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
      }, 1000);
      break;
    case 'stop':
      // Change the button label to 'start'
      button.innerHTML = 'start';
      // Stop the timer
      clearInterval(timerId);
      break;
  }
}

// Function to update the timer display
function updateDisplay() {
  // Update the displayed minutes and seconds
  minutesContainer.firstElementChild.value = formatTime(minutes);
  secondsContainer.firstElementChild.value = formatTime(seconds);
}

// Function to format time values with leading zeros
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Function to update the timer's time
function updateTime() {
  if (minutes === 0 && seconds === 0) {
    // Disable the settings button
    settingsButton.removeAttribute('disabled');
    // Reset the time passed
    timePassed = 0;
    // Play an alert sound when the timer reaches zero
    playSound();
    // Stop the timer
    clearInterval(timerId);
    // Display an alert message
    triggerAlert('Time is up!');
    // Change the button label
    startButton.innerHTML = 'new time';
  } else {
    // Update the displayed minutes and seconds
    if (seconds === 0) {
      seconds = 59;
      minutes--;
    } else {
      seconds--;
    }
  }
}

// Function to update the style of an element
function updateStyle(element, firstClass, secondClass) {
  const ring = document.querySelector(element);
  ring.classList.replace(firstClass, secondClass);
}

// Function to display an alert message with a delay
function triggerAlert(message) {
  setTimeout(() => {
    alert(message);
  }, 500);
}

// Function to set up the timer and toggle settings
function setupTimer() {
  // Hide the button
  startButton.classList.toggle('hidden');
  // Toggle disable/enable minutes and seconds input
  minutesContainer.firstElementChild.disabled = !minutesContainer.firstElementChild.disabled;
  secondsContainer.firstElementChild.disabled = !secondsContainer.firstElementChild.disabled;
  // Toggle the settings icon
  toggleSettingsIcon();
  // Update the timer's display
  updateDisplay()

  // Perform updates upon timer's end
  if (minutes !== 0 || seconds !== 0) {
    startButton.innerHTML = 'start';
    updateStyle('.ring', 'ending', 'initial');
  } else {
    startButton.innerHTML = 'new time';
  }
}

// Function to toggle the settings icon
function toggleSettingsIcon() {
  const imgSource = settingsButton.firstElementChild.src;
  if (imgSource.includes('gear')) {
    settingsButton.firstElementChild.src = './images/check.svg';
  } else {
    settingsButton.firstElementChild.src = './images/gear.svg';
  }
}

// Function to play an alert sound
function playSound() {
  const audio = new Audio(audioURL);
  audio.play();
}

// Function to calculate the time fraction
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  //Return a reduced value to match timer with the ring animation as it approaches to zero
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// Function to calculate the circle 'stroke-dasharray' property
function setCircleDasharray() {
  const setCircleDashArray = `${calculateTimeFraction() * FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`;
  circle.setAttribute("stroke-dasharray", setCircleDashArray);
}

// Function to set the remaining path color
function setRemainingPathColor(timeLeft) {
  const { warning, alert } = TIME_COLORS;

  if (timeLeft <= warning.threshold) {
    updateStyle('.ring', 'initial', 'middle');
  }

  if (timeLeft <= alert.threshold) {
    updateStyle('.ring', 'middle', 'ending');
  }
}

// Event listeners to control timer actions
startButton.addEventListener('click', () => {
  toggle(startButton);
});

settingsButton.addEventListener('click', () => {
  setupTimer();
});

minutesContainer.firstElementChild.addEventListener('keyup', (event) => {
  minutes = Number(event.target.value);
  debouncedUpdateDisplay()
  setInitialTime();
});

secondsContainer.firstElementChild.addEventListener('keyup', (event) => {
  seconds = Number(event.target.value);
  debouncedUpdateDisplay()
  setInitialTime();
});

/* Utils */
function debouncedUpdateDisplay() {
  debounce(() => {
    updateDisplay();
  });
}

function debounce(callBack, delay = 100) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callBack(...args)
    }, delay)
  }
}