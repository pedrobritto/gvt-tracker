function repCountTracker() {
  const repCount = document.querySelector(".rep-tracker-count");
  const repTarget = document.querySelector(".rep-tracker-target");

  if (!repTarget || !repCount) {
    return;
  }

  const repTargetValue = parseInt(repTarget.textContent);

  const addRep = () => {
    const currentRepCount = parseInt(repCount.textContent);

    if (currentRepCount < repTargetValue) {
      repCount.textContent = currentRepCount + 1;
    }
  };

  const button = document.querySelector(".button");

  if (button) {
    button.addEventListener("click", addRep);
  }
}

class Stopwatch {
  constructor({ minutesDOMEl, secondsDOMEl, startButton, resetButton }) {
    this.elapsedTime = 0;
    this.targetTime = 0;

    this.isRunning = false;
    this.intervalRef;

    this.minutesEl = minutesDOMEl;
    this.secondsEl = secondsDOMEl;
    this.startButton = startButton;
    this.resetButton = resetButton;
  }

  // iterate in increments of 100ms or 1000ms (setinterval)
  // add to elapsed time.
  // grab minutes and seconds in each iteration.
  // update DOM.

  updateDOM() {
    const timeInSeconds = Math.floor(this.elapsedTime / 1000);
    const timeInMinutes = Math.floor(timeInSeconds / 60);

    const timeInSecondsWithModulo = timeInSeconds % 60;

    if (this.minutesEl) {
      this.minutesEl.textContent =
        timeInMinutes < 10 ? `0${timeInMinutes}` : timeInMinutes;
    }

    if (this.secondsEl) {
      this.secondsEl.textContent =
        timeInSecondsWithModulo < 10
          ? `0${timeInSecondsWithModulo}`
          : timeInSecondsWithModulo;
    }

    if (this.startButton) {
      if (this.isRunning) {
        this.startButton.textContent = "Stop";
      } else {
        this.startButton.textContent = "Start";
      }
    }
  }

  /** Starts the stopwatch. */
  start() {
    this.isRunning = true;

    this.updateDOM();

    this.intervalRef = setInterval(() => {
      this.elapsedTime += 1000;

      this.updateDOM();
    }, 1000);
  }

  stop() {
    this.isRunning = false;

    clearInterval(this.intervalRef);
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.updateDOM();
  }

  init() {
    this.startButton?.addEventListener("click", () => {
      if (this.isRunning) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.resetButton?.addEventListener("click", () => {
      this.reset();
    });
  }
}

function main() {
  repCountTracker();

  const minutesDOMEl = document.getElementById("timer-minutes");
  const secondsDOMEl = document.getElementById("timer-seconds");
  const startButton = document.getElementById("timer-start");
  const resetButton = document.getElementById("timer-reset");

  const stopwatch = new Stopwatch({
    minutesDOMEl,
    secondsDOMEl,
    startButton,
    resetButton,
  });

  stopwatch.init();
}

main();
