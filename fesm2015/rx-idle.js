import { Subject, merge, fromEvent, from, interval, timer, of } from 'rxjs';
import { bufferTime, distinctUntilChanged, filter, finalize, map, scan, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Injectable, Optional, NgZone, NgModule, defineInjectable, inject } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RxIdleConfig {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const MINUTES = {
    TWO: 120,
    FIVE: 300,
    TEN: 600,
};
MINUTES[MINUTES.TWO] = 'TWO';
MINUTES[MINUTES.FIVE] = 'FIVE';
MINUTES[MINUTES.TEN] = 'TEN';
class RxIdleService {
    /**
     * @param {?} config
     * @param {?} _ngZone
     */
    constructor(config, _ngZone) {
        this._ngZone = _ngZone;
        this.timerStart$ = new Subject();
        this.timeout$ = new Subject();
        this.idle = MINUTES.TEN;
        this.timeout = MINUTES.FIVE;
        this.ping = MINUTES.TWO;
        if (config) {
            this.idle = config.idle;
            this.timeout = config.timeout;
            this.ping = config.ping;
        }
    }
    /**
     * Start watching for user idle and setup timer and ping.
     * @return {?}
     */
    startWatching() {
        this.activityEvents$ = merge(fromEvent(window, 'mousemove'), fromEvent(window, 'resize'), fromEvent(document, 'keydown'));
        this.idle$ = from(this.activityEvents$);
        if (this.idleSubscription) {
            this.idleSubscription.unsubscribe();
        }
        this.idleSubscription = this.idle$
            .pipe(bufferTime(500), // Starting point of detecting of user's inactivity
        filter((/**
         * @param {?} arr
         * @return {?}
         */
        arr => !arr.length && !this.isIdleDetected && !this.isInactivityTimer)), tap((/**
         * @return {?}
         */
        () => (this.isIdleDetected = true))), switchMap((/**
         * @return {?}
         */
        () => this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => interval(1000).pipe(takeUntil(merge(this.activityEvents$, timer(this.idle * 1000).pipe(tap((/**
         * @return {?}
         */
        () => {
            this.isInactivityTimer = true;
            this.timerStart$.next(true);
        }))))), finalize((/**
         * @return {?}
         */
        () => (this.isIdleDetected = false)))))))))
            .subscribe();
        this.setupTimer(this.timeout);
        this.setPing(this.ping);
    }
    /**
     * Stop watching idle
     * @return {?}
     */
    stopWatching() {
        this.stopTimer();
        if (this.idleSubscription) {
            this.idleSubscription.unsubscribe();
        }
    }
    /**
     * Stop timer
     * @return {?}
     */
    stopTimer() {
        this.isInactivityTimer = false;
        this.timerStart$.next(false);
    }
    /**
     * Reset timer
     * @return {?}
     */
    resetTimer() {
        this.stopTimer();
        this.isTimeout = false;
    }
    /**
     * Return observable for timer's countdown number that emits after idle.
     * @return {?}
     */
    onTimerStart() {
        return this.timerStart$.pipe(distinctUntilChanged(), switchMap((/**
         * @param {?} start
         * @return {?}
         */
        start => (start ? this.timer$ : of(null)))));
    }
    /**
     * Return observable for timeout is fired.
     * @return {?}
     */
    onTimeout() {
        return this.timeout$.pipe(filter((/**
         * @param {?} timeout
         * @return {?}
         */
        timeout => !!timeout)), tap((/**
         * @return {?}
         */
        () => (this.isTimeout = true))), map((/**
         * @return {?}
         */
        () => true)));
    }
    /**
     * Get current configuration
     * @return {?}
     */
    getConfigValue() {
        return {
            idle: this.idle,
            timeout: this.timeout,
            ping: this.ping
        };
    }
    /**
     * Set config values.
     * @param {?} config
     * @return {?}
     */
    setConfigValues(config) {
        if (this.idleSubscription && !this.idleSubscription.closed) {
            console.error('Call stopWatching() before set config values');
            return;
        }
        if (config.idle) {
            this.idle = config.idle;
        }
        if (config.ping) {
            this.ping = config.ping;
        }
        if (config.timeout) {
            this.timeout = config.timeout;
        }
    }
    /**
     * Set custom activity events
     *
     * @param {?} customEvents Example: merge(
     *   fromEvent(window, 'mousemove'),
     *   fromEvent(window, 'resize'),
     *   fromEvent(document, 'keydown'),
     *   fromEvent(document, 'touchstart'),
     *   fromEvent(document, 'touchend')
     * )
     * @return {?}
     */
    setCustomActivityEvents(customEvents) {
        if (this.idleSubscription && !this.idleSubscription.closed) {
            console.error('Call stopWatching() before set custom activity events');
            return;
        }
        this.activityEvents$ = customEvents;
    }
    /**
     * Setup timer.
     *
     * Counts every seconds and return n+1 and fire timeout for last count.
     * @private
     * @param {?} timeout Timeout in seconds.
     * @return {?}
     */
    setupTimer(timeout) {
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.timer$ = interval(1000).pipe(take(timeout), map((/**
             * @return {?}
             */
            () => 1)), scan((/**
             * @param {?} acc
             * @param {?} n
             * @return {?}
             */
            (acc, n) => acc + n)), tap((/**
             * @param {?} count
             * @return {?}
             */
            count => {
                if (count === timeout) {
                    this.timeout$.next(true);
                }
            })));
        }));
    }
    /**
     * Setup ping.
     *
     * Pings every ping-seconds only if is not timeout.
     * @private
     * @param {?} ping
     * @return {?}
     */
    setPing(ping) {
        this.ping$ = interval(ping * 1000).pipe(filter((/**
         * @return {?}
         */
        () => !this.isTimeout)));
    }
    /**
     * @return {?}
     */
    getPing() {
        return this.ping$;
    }
}
RxIdleService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
RxIdleService.ctorParameters = () => [
    { type: RxIdleConfig, decorators: [{ type: Optional }] },
    { type: NgZone }
];
/** @nocollapse */ RxIdleService.ngInjectableDef = defineInjectable({ factory: function RxIdleService_Factory() { return new RxIdleService(inject(RxIdleConfig, 8), inject(NgZone)); }, token: RxIdleService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RxIdleModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: RxIdleModule,
            providers: [
                { provide: RxIdleConfig, useValue: config }
            ]
        };
    }
}
RxIdleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [],
                exports: []
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { RxIdleConfig, RxIdleService, RxIdleModule };

//# sourceMappingURL=rx-idle.js.map