// Importing necessary utility functions from './utils.js'
import { debouncedUpdateDisplay, formatTime, triggerAlert, playSound, updateStyle } from './utils.js';

// Definition of the PomodoroTimer class
export class PomodoroTimer {
  // Constructor that takes an object with configuration options
  constructor({
    circleSelector,
    startSelector,
    settingSelector,
    minutesSelector,
    secondsSelector,
    audioURL
  }){
    // Initializing class properties with provided values
    this.circleSelector = circleSelector;
    this.startSelector = startSelector;
    this.settingSelector = settingSelector;
    this.minutesSelector = minutesSelector;
    this.secondsSelector = secondsSelector;
    this.audioURL = audioURL;

    // Initializing time-related properties
    this.minutes = Number(minutesSelector.firstElementChild.value);
    this.seconds = Number(secondsSelector.firstElementChild.value);

    this.timerId = 0;
    this.timeRemaining = this.minutes * 60 + this.seconds;


    // Additional constants related to SVG circle animation
    this.timeColorThresholds = {
      warning: {
        name: 'middle',
        threshold: 0
      },
      alert: {
        color: 'ending',
        threshold: 0
      }
    }

    // Creating timer constants based on initial time values
    this.setupTimerConstants();
  }

  setupEventListeners() {
    // Event listeners for start, setting, and input elements
    this.startSelector.addEventListener('click', () => {
      if (this.timeRemaining) {
        this.toggleTimer();
        return;
      }
      location.reload();
    });
    this.settingSelector.addEventListener('click', () => {
      this.setupTimerSettings();
    });
    this.minutesSelector.firstElementChild.addEventListener('keyup', (event) => {
      this.minutes = Number(event.target.value);
      debouncedUpdateDisplay(this.updateTimerDisplay());
      this.setupTimerConstants();
    });
    this.secondsSelector.firstElementChild.addEventListener('keyup', (event) => {
      this.seconds = Number(event.target.value);
      debouncedUpdateDisplay(this.updateTimerDisplay());
      this.setupTimerConstants();
    })
  }

  // Method to create timer constants based on current time values
  setupTimerConstants() {
    const totalSeconds = this.minutes * 60 + this.seconds;
    const { warning, alert } = this.timeColorThresholds;

    this.timeRemaining = totalSeconds;
    warning.threshold = totalSeconds / 2;
    alert.threshold = totalSeconds / 4;
    this.setInitialAnimationTime(this.timeRemaining);
  }

  // Method to set initial time properties
  setInitialAnimationTime(totalSeconds) {
    const totalTimeInSeconds = `${totalSeconds}s`;
    document.body.style.setProperty('--total-time', totalTimeInSeconds);
  }

  // Method to toggle between start and stop states
  toggleTimer() {
    const { startSelector, settingSelector } = this;
    const isStarting = startSelector.innerHTML === 'start';

    if (isStarting) {
      settingSelector.setAttribute('disabled', '');
      startSelector.innerHTML = 'stop';
      document.body.style.setProperty('--pomodoro-state', 'running');
      this.timerId = setInterval(() => {
        this.timeRemaining--;
        this.updateTimeRemaining();
        this.updateTimerDisplay();
        this.setRemainingPathColor();
      }, 1000);
    } else {
      startSelector.innerHTML = 'start';
      clearInterval(this.timerId);
      document.body.style.setProperty('--pomodoro-state', 'paused');
    }
  }

  // Method to update the display of minutes and seconds
  updateTimerDisplay() {
    this.minutesSelector.firstElementChild.value = formatTime(this.minutes);
    this.secondsSelector.firstElementChild.value = formatTime(this.seconds);
  }

  // Method to update time during the timer countdown
  updateTimeRemaining() {
    if (this.timeRemaining > 0) {
      this.seconds = (this.timeRemaining) % 60;
      this.minutes = Math.floor((this.timeRemaining) / 60);
    } else {
      this.handleTimerEnd();
    }
  }

  handleTimerEnd() {
    this.seconds = 0;
    playSound(this.audioURL);
    clearInterval(this.timerId);
    triggerAlert('Time is up!');
    this.startSelector.innerHTML = 'new time';
    this.settingSelector.removeAttribute('disabled');
  }

  // Method to set up the timer settings
  setupTimerSettings() {
    // Hide the button
    this.startSelector.classList.toggle('hidden');
    // Toggle disable/enable minutes and seconds input
    this.minutesSelector.firstElementChild.disabled = !this.minutesSelector.firstElementChild.disabled;
    this.secondsSelector.firstElementChild.disabled = !this.secondsSelector.firstElementChild.disabled;
    // Toggle the settings icon
    this.toggleSettingsIcon();
    // Update the timer's display
    this.updateTimerDisplay();
  }

  // Method to toggle the settings icon between gear and check
  toggleSettingsIcon() {
    const imgSource = this.settingSelector.firstElementChild.src;

    if (imgSource.includes('gear')) {
      this.settingSelector.firstElementChild.src = './images/check.svg';
    } else {
      this.settingSelector.firstElementChild.src = './images/gear.svg';
    }
  }

  // Method to set the color of the remaining path based on time thresholds
  setRemainingPathColor() {
    const { warning, alert } = this.timeColorThresholds;

    if (this.timeRemaining <= warning.threshold) {
      updateStyle('.ring', 'initial', 'middle');
    }

    if (this.timeRemaining <= alert.threshold) {
      updateStyle('.ring', 'middle', 'ending');
    }
  }
}
