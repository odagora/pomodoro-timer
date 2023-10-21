// URL for an alert sound
const audioURL = 'https://res.cloudinary.com/dagrstwwf/video/upload/v1697845804/alert-sound_twr3z8.wav';

// DOM elements for various components of the timer
const startButton = document.querySelector('.start');
const settingsButton = document.querySelector('.settings');
const minutesContainer = document.querySelector('.minutes');
const secondsContainer = document.querySelector('.seconds');

// Initial values for minutes and seconds
let minutes = Number(minutesContainer.firstElementChild.value);
let seconds = Number(secondsContainer.firstElementChild.value);

// Timer identifier
let timerId;

// Function to toggle the timer (start or stop)
function toggle(button) {
  switch (button.innerHTML) {
    case 'start':
      button.innerHTML = 'stop';
      // Start the timer and execute updateTime() and updateDisplay() every second
      timerId = setInterval(() => {
        updateTime();
        updateDisplay();
      }, 1000);
      break;
    case 'stop':
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
    playSound(); // Play an alert sound when the timer reaches zero
    clearInterval(timerId); // Stop the timer
    updateStyle('.ring', 'ending'); // Update the timer style
    triggerAlert('Time is up!'); // Display an alert message
    startButton.innerHTML = 'new time'; // Change the button label
  } else {
    if (seconds === 0) {
      seconds = 59;
      minutes--;
    } else {
      seconds--;
    }
  }
}

// Function to update the style of an element
function updateStyle(element, className) {
  const ring = document.querySelector(element);
  ring.classList.toggle(className);
}

// Function to display an alert message with a delay
function triggerAlert(message) {
  setTimeout(() => {
    alert(message);
  }, 500);
}

// Function to set up the timer and toggle settings
function setupTimer() {
  startButton.classList.toggle('hidden'); // Hide the button
  minutesContainer.firstElementChild.disabled = !minutesContainer.firstElementChild.disabled;
  secondsContainer.firstElementChild.disabled = !secondsContainer.firstElementChild.disabled;
  toggleSettingsIcon(); // Toggle the settings icon

  if (minutes !== 0 || seconds !== 0) {
    startButton.innerHTML = 'start';
    updateStyle('.ring', 'ending');
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

// Event listeners to control timer actions
startButton.addEventListener('click', () => {
  toggle(startButton);
});

settingsButton.addEventListener('click', () => {
  setupTimer();
});

minutesContainer.firstElementChild.addEventListener('keyup', (event) => {
  minutes = Number(event.target.value);
  updateDisplay();
});

secondsContainer.firstElementChild.addEventListener('keyup', (event) => {
  seconds = Number(event.target.value);
  updateDisplay();
});
