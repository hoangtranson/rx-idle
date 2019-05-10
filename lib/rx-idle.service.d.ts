import { NgZone } from '@angular/core';
import { RxIdleConfig } from './rx-idle.config';
import { Observable } from 'rxjs';
export declare class RxIdleService {
    private _ngZone;
    private ping$;
    private activityEvents$;
    private idle$;
    private timer$;
    private timerStart$;
    private timeout$;
    private idleSubscription;
    private idle;
    private timeout;
    private ping;
    private isInactivityTimer;
    private isIdleDetected;
    private isTimeout;
    constructor(config: RxIdleConfig, _ngZone: NgZone);
    /**
     * Start watching for user idle and setup timer and ping.
     */
    startWatching(): void;
    /**
     * Stop watching idle
     */
    stopWatching(): void;
    /**
     * Stop timer
     */
    stopTimer(): void;
    /**
     * Reset timer
     */
    resetTimer(): void;
    /**
     * Return observable for timer's countdown number that emits after idle.
     */
    onTimerStart(): Observable<number>;
    /**
     * Return observable for timeout is fired.
     */
    onTimeout(): Observable<boolean>;
    /**
     * Get current configuration
     */
    getConfigValue(): RxIdleConfig;
    /**
     * Set config values.
     * @param config
     */
    setConfigValues(config: RxIdleConfig): void;
    /**
     * Set custom activity events
     *
     * @param customEvents Example: merge(
     *   fromEvent(window, 'mousemove'),
     *   fromEvent(window, 'resize'),
     *   fromEvent(document, 'keydown'),
     *   fromEvent(document, 'touchstart'),
     *   fromEvent(document, 'touchend')
     * )
     */
    setCustomActivityEvents(customEvents: Observable<any>): void;
    /**
     * Setup timer.
     *
     * Counts every seconds and return n+1 and fire timeout for last count.
     * @param timeout Timeout in seconds.
     */
    private setupTimer;
    /**
     * Setup ping.
     *
     * Pings every ping-seconds only if is not timeout.
     * @param ping
     */
    private setPing;
    getPing(): Observable<any>;
}
