/**
 * Timer constructor
 */

export function Timer() {

    /**
     * Registered time snapshot
     */

    this._snapshot = new Date().getTime();
    this._paused = null;
    this._delta = 0;
};

/**
 * Reset the time snapshot
 */

Timer.prototype.reset = function() {
    this._snapshot = new Date().getTime();
    this._paused = null;
    this._delta = 0;
    return this._snapshot;
};

/**
 * Get delta in milliseconds based on the latest snapshot
 */

Timer.prototype.delta = function() {
    if (this._paused) {
        return this._delta;
    } else {
        return this._delta = new Date().getTime() - this._snapshot;
    }
};

/**
 * Pause the timer
 */

Timer.prototype.pause = function() {
    this._paused = new Date().getTime();
    return this;
};

/**
 * Resume the timer
 */

Timer.prototype.resume = function() {
    if (this._paused) {
        this._snapshot += new Date().getTime() - this._paused;
        this._paused = null;
    }
    return this;
};