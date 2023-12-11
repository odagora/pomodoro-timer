# Brief

In this project, we're creating a Pomodoro timer.

**Users should be able to:**

- Start the timer by clicking on the start link/button.
- Once the user clicks start, the word start will change to stop. Then, the user can click on the stop button to make the timer stop.
- Click on the gear icon to change the length (minutes and seconds) of the timer.
- Once the timer finishes, the ring should change from green to red and an alert message is passed to the browser.

# Screenshots

## Initial state
![Initial state](https://bit.ly/4afXSfS)

## Edit time state
![Edit time state](https://bit.ly/3Tiua3O)

## Warning state
![Warning state](https://bit.ly/3tcMCQG)

## Alert state
![Alert state](https://bit.ly/3RCCfip)

## Final state
![Final state](https://bit.ly/3GDZC53)

## My process

### Built with

- Vanilla JavaScript
- CSS transformations
- SVG manipulation

### What I learned

1. Use of `setInterval` and `clearInterval`:
    ```js
    toggle() {
      switch (this.startSelector.innerHTML) {
        case 'start':
          // Disable the settings button
          this.settingSelector.setAttribute('disabled', '');
          // Change the button label to 'stop'
          this.startSelector.innerHTML = 'stop';
          // Start the timer and execute updateTime() and updateDisplay() every second
          this.timerId = setInterval(() => {
            // Update the time passed and time left
            this.timePassed++;
            this.timeLeft = this.TIME_LIMIT - this.timePassed;
            // Update the timer's properties
            this.updateTime();
            this.updateDisplay();
            this.setCircleDasharray();
            this.setRemainingPathColor(this.timeLeft);
          }, 1000);
          break;
        case 'stop':
          // Change the button label to 'start'
          this.startSelector.innerHTML = 'start';
          // Stop the timer
          clearInterval(this.timerId);
          break;
      }
    }
2. Use of `replace` for toggling between css classes with JavaScript:
    ```js
    export function updateStyle(element, firstClass, secondClass) {
      const target = document.querySelector(element);
      target.classList.replace(firstClass, secondClass);
    }

3. Use of `debounce` for delaying events:
    ```js
    function debounce(callBack, delay = 100) {
      let timeout;

      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          callBack(...args)
        }, delay)
      }
    }

## Author

- Website - [Daniel González](https://odagora.com)