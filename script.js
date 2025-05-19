const REPS_STORAGE_KEY = "reps";
const STOPWATCH_STORAGE_KEY = "stopwatch";

class RepsTracker {
  constructor({ countEl, targetCountEl, addCountEl, resetCountEl }) {
    /**
     * @type {HTMLDivElement}
     */
    this.countEl = countEl;
    /**
     * @type {HTMLDivElement}
     */
    this.targetCountEl = targetCountEl;
    /**
     * @type {HTMLButtonElement}
     */
    this.addCountEl = addCountEl;
    /**
     * @type {HTMLButtonElement}
     */
    this.resetCountEl = resetCountEl;

    /**
     * @type {number}
     */
    this.repCount = 0;

    /**
     * @type {number}
     */
    this.targetRepCount = 10;
  }

  updateDOM() {
    this.countEl.textContent = String(this.repCount).padStart(2, "0");

    localStorage.setItem(REPS_STORAGE_KEY, JSON.stringify(this.repCount));
  }

  addRep() {
    if (this.repCount < this.targetRepCount) {
      this.repCount += 1;
    }
  }

  resetReps() {
    this.repCount = 0;
  }

  init() {
    const repFromStorage = localStorage.getItem(REPS_STORAGE_KEY);
    const parsedReps = repFromStorage ? JSON.parse(repFromStorage) : 0;

    this.repCount = parsedReps;

    if (this.addCountEl) {
      this.addCountEl.addEventListener("click", () => {
        this.addRep();
        this.updateDOM();
      });
    }

    if (this.resetCountEl) {
      this.resetCountEl.addEventListener("click", () => {
        this.resetReps();
        this.updateDOM();
      });
    }

    this.updateDOM();
  }
}

class Stopwatch {
  constructor({ minutesEl, secondsEl, startButton, resetButton }) {
    /**
     * @type {number}
     */
    this.elapsedTime = 0;
    /**
     * @type {number}
     */
    this.targetTime = 0;

    /**
     * @type {boolean}
     */
    this.isRunning = false;
    /**
     * @type {number | undefined}
     */
    this.intervalRef;

    /**
     * @type {HTMLSpanElement}
     */
    this.minutesEl = minutesEl;
    /**
     * @type {HTMLSpanElement}
     */
    this.secondsEl = secondsEl;
    /**
     * @type {HTMLButtonElement}
     */
    this.startButton = startButton;
    /**
     * @type {HTMLButtonElement}
     */
    this.resetButton = resetButton;
  }

  updateDOM() {
    const timeInSeconds = Math.floor(this.elapsedTime / 1000);
    const timeInMinutes = Math.floor(timeInSeconds / 60);

    const timeInSecondsWithModulo = timeInSeconds % 60;

    if (this.minutesEl) {
      this.minutesEl.textContent = String(timeInMinutes).padStart(2, "0");
    }

    if (this.secondsEl) {
      this.secondsEl.textContent = String(timeInSecondsWithModulo).padStart(
        2,
        "0"
      );
    }

    if (this.startButton) {
      if (this.isRunning) {
        this.startButton.textContent = "Stop";
        this.startButton.classList.add("is-running");
        this.startButton.classList.remove("is-stopped");
      } else {
        this.startButton.textContent = "Start";
        this.startButton.classList.remove("is-running");
        this.startButton.classList.add("is-stopped");
      }
    }
  }

  /** Starts the stopwatch. */
  start() {
    this.isRunning = true;

    this.updateDOM();

    // To save the elapsed time in the storage, I need to save a starting time instead of incrementing on the fly.
    this.intervalRef = setInterval(() => {
      this.elapsedTime += 1000;

      this.updateDOM();
    }, 1000);
  }

  stop() {
    this.isRunning = false;

    this.updateDOM();

    clearInterval(this.intervalRef);
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.updateDOM();
  }

  init() {
    this.updateDOM();

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
  const stopwatch = new Stopwatch({
    minutesEl: document.getElementById("timer-minutes"),
    secondsEl: document.getElementById("timer-seconds"),
    startButton: document.getElementById("timer-start"),
    resetButton: document.getElementById("timer-reset"),
  });

  stopwatch.init();

  const repsTracker = new RepsTracker({
    countEl: document.getElementById("reps-count"),
    targetCountEl: document.getElementById("reps-target"),
    addCountEl: document.getElementById("reps-add"),
    resetCountEl: document.getElementById("reps-reset"),
  });

  repsTracker.init();
}

main();
