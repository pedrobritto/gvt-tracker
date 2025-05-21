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

    /**
     * @type {number}
     */
    this.temporaryDisableTime = 5000;

    /**
     * @type {number | undefined}
     */
    this.timeoutRef;
  }

  updateDOM() {
    this.countEl.textContent = String(this.repCount).padStart(2, "0");

    localStorage.setItem(REPS_STORAGE_KEY, JSON.stringify(this.repCount));
  }

  addRep() {
    if (this.repCount < this.targetRepCount) {
      this.repCount += 1;
    }

    this.addCountEl.disabled = true;

    setTimeout(() => {
      this.addCountEl.disabled = false;
    }, this.temporaryDisableTime);
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
  constructor({
    minutesEl,
    secondsEl,
    millisecondsEl,
    startButton,
    resetButton,
    resetOnStart,
  }) {
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
     * @type {HTMLSpanElement}
     */
    this.millisecondsEl = millisecondsEl;
    /**
     * @type {HTMLButtonElement}
     */
    this.startButton = startButton;
    /**
     * @type {HTMLButtonElement}
     */
    this.resetButton = resetButton;
    /**
     * @type {boolean}
     */
    this.resetOnStart = resetOnStart;
  }

  updateDOM() {
    const timeInMilliseconds = Math.floor((this.elapsedTime / 10) % 100);
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

    console.log(`this.millisecondsEl`, this.millisecondsEl);

    if (this.millisecondsEl) {
      this.millisecondsEl.textContent = String(timeInMilliseconds).padStart(
        2,
        "0"
      );
    }
  }

  /** Starts the stopwatch. */
  start() {
    this.isRunning = true;

    this.updateDOM();

    // To save the elapsed time in the storage, I need to save a starting time instead of incrementing on the fly.
    this.intervalRef = setInterval(() => {
      this.elapsedTime += 83;

      this.updateDOM();
    }, 83);
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
      if (this.resetOnStart) {
        this.reset();
        this.start();

        return;
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
    millisecondsEl: document.getElementById("timer-milliseconds"),
    startButton: document.getElementById("reps-add"),
    resetButton: document.getElementById("reps-reset"),
    resetOnStart: true,
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
