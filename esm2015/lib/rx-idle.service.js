/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional, NgZone } from '@angular/core';
import { RxIdleConfig } from './rx-idle.config';
import { Subject, merge, fromEvent, from, interval, timer, of } from 'rxjs';
import { bufferTime, distinctUntilChanged, filter, finalize, map, scan, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./rx-idle.config";
/** @enum {number} */
const MINUTES = {
    TWO: 120,
    FIVE: 300,
    TEN: 600,
};
MINUTES[MINUTES.TWO] = 'TWO';
MINUTES[MINUTES.FIVE] = 'FIVE';
MINUTES[MINUTES.TEN] = 'TEN';
export class RxIdleService {
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
/** @nocollapse */ RxIdleService.ngInjectableDef = i0.defineInjectable({ factory: function RxIdleService_Factory() { return new RxIdleService(i0.inject(i1.RxIdleConfig, 8), i0.inject(i0.NgZone)); }, token: RxIdleService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.ping$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.activityEvents$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.idle$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.timer$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.timerStart$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.timeout$;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.idleSubscription;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.idle;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.timeout;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.ping;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.isInactivityTimer;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.isIdleDetected;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype.isTimeout;
    /**
     * @type {?}
     * @private
     */
    RxIdleService.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtaWRsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcngtaWRsZS8iLCJzb3VyY2VzIjpbImxpYi9yeC1pZGxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxFQUVMLE9BQU8sRUFFUCxLQUFLLEVBQ0wsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLEVBQUUsRUFDSCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLE1BQU0sRUFDTixRQUFRLEVBQ1IsR0FBRyxFQUNILElBQUksRUFDSixTQUFTLEVBQ1QsSUFBSSxFQUNKLFNBQVMsRUFDVCxHQUFHLEVBQ0osTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7SUFHdEIsUUFBUztJQUNULFNBQVU7SUFDVixRQUFTOzs7OztBQU1YLE1BQU0sT0FBTyxhQUFhOzs7OztJQW9CeEIsWUFBd0IsTUFBb0IsRUFBVSxPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWI3RCxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFDckMsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFJbEMsU0FBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDbkIsWUFBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdkIsU0FBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFPekIsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJ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OztJQUVoQyxvQ0FBNkM7Ozs7O0lBQzdDLGlDQUEwQzs7Ozs7SUFFMUMseUNBQXVDOzs7OztJQUV2Qyw2QkFBMkI7Ozs7O0lBQzNCLGdDQUErQjs7Ozs7SUFDL0IsNkJBQTJCOzs7OztJQUUzQiwwQ0FBbUM7Ozs7O0lBQ25DLHVDQUFnQzs7Ozs7SUFDaEMsa0NBQTJCOzs7OztJQUVtQixnQ0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSeElkbGVDb25maWcgfSBmcm9tICcuL3J4LWlkbGUuY29uZmlnJztcblxuaW1wb3J0IHtcbiAgT2JzZXJ2YWJsZSxcbiAgU3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxuICBtZXJnZSxcbiAgZnJvbUV2ZW50LFxuICBmcm9tLFxuICBpbnRlcnZhbCxcbiAgdGltZXIsXG4gIG9mXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgYnVmZmVyVGltZSxcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIGZpbHRlcixcbiAgZmluYWxpemUsXG4gIG1hcCxcbiAgc2NhbixcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIHRhcFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmVudW0gTUlOVVRFUyB7XG4gIFRXTyA9IDEyMCxcbiAgRklWRSA9IDMwMCxcbiAgVEVOID0gNjAwXG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ4SWRsZVNlcnZpY2Uge1xuXG4gIHByaXZhdGUgcGluZyQ6IE9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBhY3Rpdml0eUV2ZW50cyQ6IE9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBpZGxlJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIHRpbWVyJDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIHByaXZhdGUgdGltZXJTdGFydCQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIHRpbWVvdXQkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICBwcml2YXRlIGlkbGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcml2YXRlIGlkbGUgPSBNSU5VVEVTLlRFTjtcbiAgcHJpdmF0ZSB0aW1lb3V0ID0gTUlOVVRFUy5GSVZFO1xuICBwcml2YXRlIHBpbmcgPSBNSU5VVEVTLlRXTztcblxuICBwcml2YXRlIGlzSW5hY3Rpdml0eVRpbWVyOiBib29sZWFuO1xuICBwcml2YXRlIGlzSWRsZURldGVjdGVkOiBib29sZWFuO1xuICBwcml2YXRlIGlzVGltZW91dDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBjb25maWc6IFJ4SWRsZUNvbmZpZywgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLmlkbGUgPSBjb25maWcuaWRsZTtcbiAgICAgIHRoaXMudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuICAgICAgdGhpcy5waW5nID0gY29uZmlnLnBpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHdhdGNoaW5nIGZvciB1c2VyIGlkbGUgYW5kIHNldHVwIHRpbWVyIGFuZCBwaW5nLlxuICAgKi9cbiAgc3RhcnRXYXRjaGluZygpIHtcbiAgICB0aGlzLmFjdGl2aXR5RXZlbnRzJCA9IG1lcmdlKFxuICAgICAgZnJvbUV2ZW50KHdpbmRvdywgJ21vdXNlbW92ZScpLFxuICAgICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpLFxuICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicpXG4gICAgKTtcblxuICAgIHRoaXMuaWRsZSQgPSBmcm9tKHRoaXMuYWN0aXZpdHlFdmVudHMkKTtcblxuICAgIGlmICh0aGlzLmlkbGVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuaWRsZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuaWRsZVN1YnNjcmlwdGlvbiA9IHRoaXMuaWRsZSRcbiAgICAgIC5waXBlKFxuICAgICAgICBidWZmZXJUaW1lKDUwMCksIC8vIFN0YXJ0aW5nIHBvaW50IG9mIGRldGVjdGluZyBvZiB1c2VyJ3MgaW5hY3Rpdml0eVxuICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgYXJyID0+ICFhcnIubGVuZ3RoICYmICF0aGlzLmlzSWRsZURldGVjdGVkICYmICF0aGlzLmlzSW5hY3Rpdml0eVRpbWVyXG4gICAgICAgICksXG4gICAgICAgIHRhcCgoKSA9PiAodGhpcy5pc0lkbGVEZXRlY3RlZCA9IHRydWUpKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgICBpbnRlcnZhbCgxMDAwKS5waXBlKFxuICAgICAgICAgICAgICB0YWtlVW50aWwoXG4gICAgICAgICAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2aXR5RXZlbnRzJCxcbiAgICAgICAgICAgICAgICAgIHRpbWVyKHRoaXMuaWRsZSAqIDEwMDApLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0luYWN0aXZpdHlUaW1lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lclN0YXJ0JC5uZXh0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgZmluYWxpemUoKCkgPT4gKHRoaXMuaXNJZGxlRGV0ZWN0ZWQgPSBmYWxzZSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCk7XG5cbiAgICB0aGlzLnNldHVwVGltZXIodGhpcy50aW1lb3V0KTtcbiAgICB0aGlzLnNldFBpbmcodGhpcy5waW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHdhdGNoaW5nIGlkbGVcbiAgICovXG4gIHN0b3BXYXRjaGluZygpIHtcbiAgICB0aGlzLnN0b3BUaW1lcigpO1xuICAgIGlmICh0aGlzLmlkbGVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuaWRsZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRpbWVyXG4gICAqL1xuICBzdG9wVGltZXIoKSB7XG4gICAgdGhpcy5pc0luYWN0aXZpdHlUaW1lciA9IGZhbHNlO1xuICAgIHRoaXMudGltZXJTdGFydCQubmV4dChmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGltZXJcbiAgICovXG4gIHJlc2V0VGltZXIoKSB7XG4gICAgdGhpcy5zdG9wVGltZXIoKTtcbiAgICB0aGlzLmlzVGltZW91dCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBvYnNlcnZhYmxlIGZvciB0aW1lcidzIGNvdW50ZG93biBudW1iZXIgdGhhdCBlbWl0cyBhZnRlciBpZGxlLlxuICAgKi9cbiAgb25UaW1lclN0YXJ0KCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gICAgcmV0dXJuIHRoaXMudGltZXJTdGFydCQucGlwZShcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICBzd2l0Y2hNYXAoc3RhcnQgPT4gKHN0YXJ0ID8gdGhpcy50aW1lciQgOiBvZihudWxsKSkpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gb2JzZXJ2YWJsZSBmb3IgdGltZW91dCBpcyBmaXJlZC5cbiAgICovXG4gIG9uVGltZW91dCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy50aW1lb3V0JC5waXBlKFxuICAgICAgZmlsdGVyKHRpbWVvdXQgPT4gISF0aW1lb3V0KSxcbiAgICAgIHRhcCgoKSA9PiAodGhpcy5pc1RpbWVvdXQgPSB0cnVlKSksXG4gICAgICBtYXAoKCkgPT4gdHJ1ZSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGdldENvbmZpZ1ZhbHVlKCk6IFJ4SWRsZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkbGU6IHRoaXMuaWRsZSxcbiAgICAgIHRpbWVvdXQ6IHRoaXMudGltZW91dCxcbiAgICAgIHBpbmc6IHRoaXMucGluZ1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvbmZpZyB2YWx1ZXMuXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICovXG4gIHNldENvbmZpZ1ZhbHVlcyhjb25maWc6IFJ4SWRsZUNvbmZpZykge1xuICAgIGlmICh0aGlzLmlkbGVTdWJzY3JpcHRpb24gJiYgIXRoaXMuaWRsZVN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbGwgc3RvcFdhdGNoaW5nKCkgYmVmb3JlIHNldCBjb25maWcgdmFsdWVzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZGxlKSB7XG4gICAgICB0aGlzLmlkbGUgPSBjb25maWcuaWRsZTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5waW5nKSB7XG4gICAgICB0aGlzLnBpbmcgPSBjb25maWcucGluZztcbiAgICB9XG4gICAgaWYgKGNvbmZpZy50aW1lb3V0KSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IGN1c3RvbSBhY3Rpdml0eSBldmVudHNcbiAgICpcbiAgICogQHBhcmFtIGN1c3RvbUV2ZW50cyBFeGFtcGxlOiBtZXJnZShcbiAgICogICBmcm9tRXZlbnQod2luZG93LCAnbW91c2Vtb3ZlJyksXG4gICAqICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpLFxuICAgKiAgIGZyb21FdmVudChkb2N1bWVudCwgJ2tleWRvd24nKSxcbiAgICogICBmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaHN0YXJ0JyksXG4gICAqICAgZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2hlbmQnKVxuICAgKiApXG4gICAqL1xuICBzZXRDdXN0b21BY3Rpdml0eUV2ZW50cyhjdXN0b21FdmVudHM6IE9ic2VydmFibGU8YW55Pikge1xuICAgIGlmICh0aGlzLmlkbGVTdWJzY3JpcHRpb24gJiYgIXRoaXMuaWRsZVN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbGwgc3RvcFdhdGNoaW5nKCkgYmVmb3JlIHNldCBjdXN0b20gYWN0aXZpdHkgZXZlbnRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpdml0eUV2ZW50cyQgPSBjdXN0b21FdmVudHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgdGltZXIuXG4gICAqXG4gICAqIENvdW50cyBldmVyeSBzZWNvbmRzIGFuZCByZXR1cm4gbisxIGFuZCBmaXJlIHRpbWVvdXQgZm9yIGxhc3QgY291bnQuXG4gICAqIEBwYXJhbSB0aW1lb3V0IFRpbWVvdXQgaW4gc2Vjb25kcy5cbiAgICovXG4gIHByaXZhdGUgc2V0dXBUaW1lcih0aW1lb3V0OiBudW1iZXIpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy50aW1lciQgPSBpbnRlcnZhbCgxMDAwKS5waXBlKFxuICAgICAgICB0YWtlKHRpbWVvdXQpLFxuICAgICAgICBtYXAoKCkgPT4gMSksXG4gICAgICAgIHNjYW4oKGFjYywgbikgPT4gYWNjICsgbiksXG4gICAgICAgIHRhcChjb3VudCA9PiB7XG4gICAgICAgICAgaWYgKGNvdW50ID09PSB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQkLm5leHQodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCBwaW5nLlxuICAgKlxuICAgKiBQaW5ncyBldmVyeSBwaW5nLXNlY29uZHMgb25seSBpZiBpcyBub3QgdGltZW91dC5cbiAgICogQHBhcmFtIHBpbmdcbiAgICovXG4gIHByaXZhdGUgc2V0UGluZyhwaW5nOiBudW1iZXIpIHtcbiAgICB0aGlzLnBpbmckID0gaW50ZXJ2YWwocGluZyAqIDEwMDApLnBpcGUoZmlsdGVyKCgpID0+ICF0aGlzLmlzVGltZW91dCkpO1xuICB9XG5cbiAgZ2V0UGluZygpe1xuICAgIHJldHVybiB0aGlzLnBpbmckO1xuICB9XG59XG4iXX0=