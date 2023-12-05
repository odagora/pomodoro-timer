import { PomodoroTimer } from './pomodoro.js'

const url = 'https://res.cloudinary.com/dagrstwwf/video/upload/v1697845804/alert-sound_twr3z8.wav'

const newPomodoro = new PomodoroTimer({
  circleSelector: document.querySelector('.circle'),
  startSelector: document.querySelector('.start'),
  settingSelector: document.querySelector('.settings'),
  minutesSelector: document.querySelector('.minutes'),
  secondsSelector: document.querySelector('.seconds'),
  audioURL: url,
})

console.log(newPomodoro);