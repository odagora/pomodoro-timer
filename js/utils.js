export function playSound(url) {
  const audio = new Audio(url);

  audio.play();
}

export function triggerAlert(message) {
  setTimeout(() => {
    alert(message);
  }, 500);
}

export function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

export function updateStyle(element, firstClass, secondClass) {
  const target = document.querySelector(element);
  target.classList.replace(firstClass, secondClass);
}

export function debouncedUpdateDisplay(callback) {
  debounce(() => {
    callback;
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