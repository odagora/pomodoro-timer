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

    this.timeLeft = 0;
    this.timerId = 0;
    this.timePassed = 0;

    // Creating timer constants based on initial time values
    this.createTimerConstants();

    // Additional constants related to SVG circle animation
    this.TIME_COLORS = {
      warning: {
        name: 'middle',
        threshold: this.WARNING_THRESHOLD
      },
      alert: {
        color: 'ending',
        threshold: this.ALERT_THRESHOLD
      }
    }
  }

  setupEventListeners() {
    // Event listeners for start, setting, and input elements
    this.startSelector.addEventListener('click', () => {
      this.toggle(this.startSelector);
    });
    this.settingSelector.addEventListener('click', () => {
      this.setupTimer();
    });
    this.minutesSelector.firstElementChild.addEventListener('keyup', (event) => {
      this.minutes = Number(event.target.value);
      debouncedUpdateDisplay(this.updateDisplay());
      this.setInitialTime();
    });
    this.secondsSelector.firstElementChild.addEventListener('keyup', (event) => {
      this.seconds = Number(event.target.value);
      debouncedUpdateDisplay(this.updateDisplay());
      this.setInitialTime();
    })
  }

  // Method to create timer constants based on current time values
  createTimerConstants() {
    this.TIME_LIMIT = this.minutes * 60 + this.seconds;
    this.WARNING_THRESHOLD = this.TIME_LIMIT / 2;
    this.ALERT_THRESHOLD = this.WARNING_THRESHOLD / 2;
  }

  // Method to set initial time properties
  setInitialTime() {
    const { warning, alert } = this.TIME_COLORS;
    this.createTimerConstants();
    this.setInitialAnimationTime();

    warning.threshold = this.WARNING_THRESHOLD;
    alert.threshold = this.ALERT_THRESHOLD;
    this.timeLeft = this.TIME_LIMIT;
  }

  setInitialAnimationTime() {
    document.body.style.setProperty('--total-time', `${this.TIME_LIMIT}s`);
  }

  // Method to toggle between start and stop states
  toggle() {
    switch (this.startSelector.innerHTML) {
      case 'start':
        // Disable the settings button
        this.settingSelector.setAttribute('disabled', '');
        // Change the button label to 'stop'
        this.startSelector.innerHTML = 'stop';
        // Start the ring animation
        document.body.style.setProperty('--pomodoro-state', 'running');
        // Start the timer and execute updateTime() and updateDisplay() every second
        this.timerId = setInterval(() => {
          // Update the time passed and time left
          this.timePassed++;
          this.timeLeft = this.TIME_LIMIT - this.timePassed;
          // Update the timer's properties
          this.updateTime();
          this.updateDisplay();
          this.setRemainingPathColor(this.timeLeft);
        }, 1000);
        break;
      case 'stop':
        // Change the button label to 'start'
        this.startSelector.innerHTML = 'start';
        // Stop the timer
        clearInterval(this.timerId);
        // Pause the ring animation
        document.body.style.setProperty('--pomodoro-state', 'paused');
        break;
    }
  }

  // Method to update the display of minutes and seconds
  updateDisplay() {
    this.minutesSelector.firstElementChild.value = formatTime(this.minutes);
    this.secondsSelector.firstElementChild.value = formatTime(this.seconds);
  }

  // Method to update time during the timer countdown
  updateTime() {
    if (this.minutes === 0 && this.seconds === 0) {
      // Disable the settings button
      this.settingSelector.removeAttribute('disabled');
      // Reset the time passed
      this.timePassed = 0;
      // Play an alert sound when the timer reaches zero
      playSound(this.audioURL);
      // Stop the timer
      clearInterval(this.timerId);
      // Display an alert message
      triggerAlert('Time is up!');
      // Change the button label
      this.startSelector.innerHTML = 'new time';
    } else {
      // Update the displayed minutes and seconds
      if (this.seconds === 0) {
        this.seconds = 59;
        this.minutes--;
      } else {
        this.seconds--;
      }
    }
  }

  // Method to set up the timer settings
  setupTimer() {
    // Hide the button
    this.startSelector.classList.toggle('hidden');
    // Toggle disable/enable minutes and seconds input
    this.minutesSelector.firstElementChild.disabled = !this.minutesSelector.firstElementChild.disabled;
    this.secondsSelector.firstElementChild.disabled = !this.secondsSelector.firstElementChild.disabled;
    // Toggle the settings icon
    this.toggleSettingsIcon();
    // Update the timer's display
    this.updateDisplay()

    // Perform updates upon timer's end
    if (this.minutes !== 0 || this.seconds !== 0) {
      this.startSelector.innerHTML = 'start';
      updateStyle('.ring', 'ending', 'initial');
    } else {
      this.startSelector.innerHTML = 'new time';
    }
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
  setRemainingPathColor(timeLeft) {
    const { warning, alert } = this.TIME_COLORS;

    if (timeLeft <= warning.threshold) {
      updateStyle('.ring', 'initial', 'middle');
    }

    if (timeLeft <= alert.threshold) {
      updateStyle('.ring', 'middle', 'ending');
    }
  }
}
