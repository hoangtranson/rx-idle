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
var MINUTES = {
    TWO: 120,
    FIVE: 300,
    TEN: 600,
};
MINUTES[MINUTES.TWO] = 'TWO';
MINUTES[MINUTES.FIVE] = 'FIVE';
MINUTES[MINUTES.TEN] = 'TEN';
var RxIdleService = /** @class */ (function () {
    function RxIdleService(config, _ngZone) {
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
     */
    /**
     * Start watching for user idle and setup timer and ping.
     * @return {?}
     */
    RxIdleService.prototype.startWatching = /**
     * Start watching for user idle and setup timer and ping.
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (arr) { return !arr.length && !_this.isIdleDetected && !_this.isInactivityTimer; })), tap((/**
         * @return {?}
         */
        function () { return (_this.isIdleDetected = true); })), switchMap((/**
         * @return {?}
         */
        function () {
            return _this._ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                return interval(1000).pipe(takeUntil(merge(_this.activityEvents$, timer(_this.idle * 1000).pipe(tap((/**
                 * @return {?}
                 */
                function () {
                    _this.isInactivityTimer = true;
                    _this.timerStart$.next(true);
                }))))), finalize((/**
                 * @return {?}
                 */
                function () { return (_this.isIdleDetected = false); })));
            }));
        })))
            .subscribe();
        this.setupTimer(this.timeout);
        this.setPing(this.ping);
    };
    /**
     * Stop watching idle
     */
    /**
     * Stop watching idle
     * @return {?}
     */
    RxIdleService.prototype.stopWatching = /**
     * Stop watching idle
     * @return {?}
     */
    function () {
        this.stopTimer();
        if (this.idleSubscription) {
            this.idleSubscription.unsubscribe();
        }
    };
    /**
     * Stop timer
     */
    /**
     * Stop timer
     * @return {?}
     */
    RxIdleService.prototype.stopTimer = /**
     * Stop timer
     * @return {?}
     */
    function () {
        this.isInactivityTimer = false;
        this.timerStart$.next(false);
    };
    /**
     * Reset timer
     */
    /**
     * Reset timer
     * @return {?}
     */
    RxIdleService.prototype.resetTimer = /**
     * Reset timer
     * @return {?}
     */
    function () {
        this.stopTimer();
        this.isTimeout = false;
    };
    /**
     * Return observable for timer's countdown number that emits after idle.
     */
    /**
     * Return observable for timer's countdown number that emits after idle.
     * @return {?}
     */
    RxIdleService.prototype.onTimerStart = /**
     * Return observable for timer's countdown number that emits after idle.
     * @return {?}
     */
    function () {
        var _this = this;
        return this.timerStart$.pipe(distinctUntilChanged(), switchMap((/**
         * @param {?} start
         * @return {?}
         */
        function (start) { return (start ? _this.timer$ : of(null)); })));
    };
    /**
     * Return observable for timeout is fired.
     */
    /**
     * Return observable for timeout is fired.
     * @return {?}
     */
    RxIdleService.prototype.onTimeout = /**
     * Return observable for timeout is fired.
     * @return {?}
     */
    function () {
        var _this = this;
        return this.timeout$.pipe(filter((/**
         * @param {?} timeout
         * @return {?}
         */
        function (timeout) { return !!timeout; })), tap((/**
         * @return {?}
         */
        function () { return (_this.isTimeout = true); })), map((/**
         * @return {?}
         */
        function () { return true; })));
    };
    /**
     * Get current configuration
     */
    /**
     * Get current configuration
     * @return {?}
     */
    RxIdleService.prototype.getConfigValue = /**
     * Get current configuration
     * @return {?}
     */
    function () {
        return {
            idle: this.idle,
            timeout: this.timeout,
            ping: this.ping
        };
    };
    /**
     * Set config values.
     * @param config
     */
    /**
     * Set config values.
     * @param {?} config
     * @return {?}
     */
    RxIdleService.prototype.setConfigValues = /**
     * Set config values.
     * @param {?} config
     * @return {?}
     */
    function (config) {
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
    };
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
    RxIdleService.prototype.setCustomActivityEvents = /**
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
    function (customEvents) {
        if (this.idleSubscription && !this.idleSubscription.closed) {
            console.error('Call stopWatching() before set custom activity events');
            return;
        }
        this.activityEvents$ = customEvents;
    };
    /**
     * Setup timer.
     *
     * Counts every seconds and return n+1 and fire timeout for last count.
     * @param timeout Timeout in seconds.
     */
    /**
     * Setup timer.
     *
     * Counts every seconds and return n+1 and fire timeout for last count.
     * @private
     * @param {?} timeout Timeout in seconds.
     * @return {?}
     */
    RxIdleService.prototype.setupTimer = /**
     * Setup timer.
     *
     * Counts every seconds and return n+1 and fire timeout for last count.
     * @private
     * @param {?} timeout Timeout in seconds.
     * @return {?}
     */
    function (timeout) {
        var _this = this;
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            _this.timer$ = interval(1000).pipe(take(timeout), map((/**
             * @return {?}
             */
            function () { return 1; })), scan((/**
             * @param {?} acc
             * @param {?} n
             * @return {?}
             */
            function (acc, n) { return acc + n; })), tap((/**
             * @param {?} count
             * @return {?}
             */
            function (count) {
                if (count === timeout) {
                    _this.timeout$.next(true);
                }
            })));
        }));
    };
    /**
     * Setup ping.
     *
     * Pings every ping-seconds only if is not timeout.
     * @param ping
     */
    /**
     * Setup ping.
     *
     * Pings every ping-seconds only if is not timeout.
     * @private
     * @param {?} ping
     * @return {?}
     */
    RxIdleService.prototype.setPing = /**
     * Setup ping.
     *
     * Pings every ping-seconds only if is not timeout.
     * @private
     * @param {?} ping
     * @return {?}
     */
    function (ping) {
        var _this = this;
        this.ping$ = interval(ping * 1000).pipe(filter((/**
         * @return {?}
         */
        function () { return !_this.isTimeout; })));
    };
    /**
     * @return {?}
     */
    RxIdleService.prototype.getPing = /**
     * @return {?}
     */
    function () {
        return this.ping$;
    };
    RxIdleService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    RxIdleService.ctorParameters = function () { return [
        { type: RxIdleConfig, decorators: [{ type: Optional }] },
        { type: NgZone }
    ]; };
    /** @nocollapse */ RxIdleService.ngInjectableDef = i0.defineInjectable({ factory: function RxIdleService_Factory() { return new RxIdleService(i0.inject(i1.RxIdleConfig, 8), i0.inject(i0.NgZone)); }, token: RxIdleService, providedIn: "root" });
    return RxIdleService;
}());
export { RxIdleService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicngtaWRsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcngtaWRsZS8iLCJzb3VyY2VzIjpbImxpYi9yeC1pZGxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxFQUVMLE9BQU8sRUFFUCxLQUFLLEVBQ0wsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLEVBQUUsRUFDSCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLE1BQU0sRUFDTixRQUFRLEVBQ1IsR0FBRyxFQUNILElBQUksRUFDSixTQUFTLEVBQ1QsSUFBSSxFQUNKLFNBQVMsRUFDVCxHQUFHLEVBQ0osTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7SUFHdEIsUUFBUztJQUNULFNBQVU7SUFDVixRQUFTOzs7OztBQUdYO0lBdUJFLHVCQUF3QixNQUFvQixFQUFVLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBYjdELGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUNyQyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUlsQyxTQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNuQixZQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN2QixTQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQU96QixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMs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RUM7UUFEQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07OztRQUFDLGNBQU0sT0FBQSxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQWYsQ0FBZSxFQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7O0lBRUQsK0JBQU87OztJQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7O2dCQW5ORixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQWxDUSxZQUFZLHVCQXVETixRQUFRO2dCQXhEUSxNQUFNOzs7d0JBQXJDO0NBcVBDLEFBcE5ELElBb05DO1NBak5ZLGFBQWE7Ozs7OztJQUV4Qiw4QkFBK0I7Ozs7O0lBQy9CLHdDQUF5Qzs7Ozs7SUFDekMsOEJBQStCOzs7OztJQUMvQiwrQkFBZ0M7Ozs7O0lBRWhDLG9DQUE2Qzs7Ozs7SUFDN0MsaUNBQTBDOzs7OztJQUUxQyx5Q0FBdUM7Ozs7O0lBRXZDLDZCQUEyQjs7Ozs7SUFDM0IsZ0NBQStCOzs7OztJQUMvQiw2QkFBMkI7Ozs7O0lBRTNCLDBDQUFtQzs7Ozs7SUFDbkMsdUNBQWdDOzs7OztJQUNoQyxrQ0FBMkI7Ozs7O0lBRW1CLGdDQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJ4SWRsZUNvbmZpZyB9IGZyb20gJy4vcngtaWRsZS5jb25maWcnO1xuXG5pbXBvcnQge1xuICBPYnNlcnZhYmxlLFxuICBTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG4gIG1lcmdlLFxuICBmcm9tRXZlbnQsXG4gIGZyb20sXG4gIGludGVydmFsLFxuICB0aW1lcixcbiAgb2Zcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBidWZmZXJUaW1lLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBmaW5hbGl6ZSxcbiAgbWFwLFxuICBzY2FuLFxuICBzd2l0Y2hNYXAsXG4gIHRha2UsXG4gIHRha2VVbnRpbCxcbiAgdGFwXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZW51bSBNSU5VVEVTIHtcbiAgVFdPID0gMTIwLFxuICBGSVZFID0gMzAwLFxuICBURU4gPSA2MDBcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnhJZGxlU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBwaW5nJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIGFjdGl2aXR5RXZlbnRzJDogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIGlkbGUkOiBPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgdGltZXIkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgcHJpdmF0ZSB0aW1lclN0YXJ0JCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgdGltZW91dCQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIHByaXZhdGUgaWRsZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByaXZhdGUgaWRsZSA9IE1JTlVURVMuVEVOO1xuICBwcml2YXRlIHRpbWVvdXQgPSBNSU5VVEVTLkZJVkU7XG4gIHByaXZhdGUgcGluZyA9IE1JTlVURVMuVFdPO1xuXG4gIHByaXZhdGUgaXNJbmFjdGl2aXR5VGltZXI6IGJvb2xlYW47XG4gIHByaXZhdGUgaXNJZGxlRGV0ZWN0ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgaXNUaW1lb3V0OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIGNvbmZpZzogUnhJZGxlQ29uZmlnLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuaWRsZSA9IGNvbmZpZy5pZGxlO1xuICAgICAgdGhpcy50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG4gICAgICB0aGlzLnBpbmcgPSBjb25maWcucGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgd2F0Y2hpbmcgZm9yIHVzZXIgaWRsZSBhbmQgc2V0dXAgdGltZXIgYW5kIHBpbmcuXG4gICAqL1xuICBzdGFydFdhdGNoaW5nKCkge1xuICAgIHRoaXMuYWN0aXZpdHlFdmVudHMkID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnQod2luZG93LCAnbW91c2Vtb3ZlJyksXG4gICAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJyksXG4gICAgICBmcm9tRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJylcbiAgICApO1xuXG4gICAgdGhpcy5pZGxlJCA9IGZyb20odGhpcy5hY3Rpdml0eUV2ZW50cyQpO1xuXG4gICAgaWYgKHRoaXMuaWRsZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5pZGxlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pZGxlU3Vic2NyaXB0aW9uID0gdGhpcy5pZGxlJFxuICAgICAgLnBpcGUoXG4gICAgICAgIGJ1ZmZlclRpbWUoNTAwKSwgLy8gU3RhcnRpbmcgcG9pbnQgb2YgZGV0ZWN0aW5nIG9mIHVzZXIncyBpbmFjdGl2aXR5XG4gICAgICAgIGZpbHRlcihcbiAgICAgICAgICBhcnIgPT4gIWFyci5sZW5ndGggJiYgIXRoaXMuaXNJZGxlRGV0ZWN0ZWQgJiYgIXRoaXMuaXNJbmFjdGl2aXR5VGltZXJcbiAgICAgICAgKSxcbiAgICAgICAgdGFwKCgpID0+ICh0aGlzLmlzSWRsZURldGVjdGVkID0gdHJ1ZSkpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgICAgICAgIGludGVydmFsKDEwMDApLnBpcGUoXG4gICAgICAgICAgICAgIHRha2VVbnRpbChcbiAgICAgICAgICAgICAgICBtZXJnZShcbiAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdHlFdmVudHMkLFxuICAgICAgICAgICAgICAgICAgdGltZXIodGhpcy5pZGxlICogMTAwMCkucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzSW5hY3Rpdml0eVRpbWVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVyU3RhcnQkLm5leHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBmaW5hbGl6ZSgoKSA9PiAodGhpcy5pc0lkbGVEZXRlY3RlZCA9IGZhbHNlKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKTtcblxuICAgIHRoaXMuc2V0dXBUaW1lcih0aGlzLnRpbWVvdXQpO1xuICAgIHRoaXMuc2V0UGluZyh0aGlzLnBpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3Agd2F0Y2hpbmcgaWRsZVxuICAgKi9cbiAgc3RvcFdhdGNoaW5nKCkge1xuICAgIHRoaXMuc3RvcFRpbWVyKCk7XG4gICAgaWYgKHRoaXMuaWRsZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5pZGxlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGltZXJcbiAgICovXG4gIHN0b3BUaW1lcigpIHtcbiAgICB0aGlzLmlzSW5hY3Rpdml0eVRpbWVyID0gZmFsc2U7XG4gICAgdGhpcy50aW1lclN0YXJ0JC5uZXh0KGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aW1lclxuICAgKi9cbiAgcmVzZXRUaW1lcigpIHtcbiAgICB0aGlzLnN0b3BUaW1lcigpO1xuICAgIHRoaXMuaXNUaW1lb3V0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIG9ic2VydmFibGUgZm9yIHRpbWVyJ3MgY291bnRkb3duIG51bWJlciB0aGF0IGVtaXRzIGFmdGVyIGlkbGUuXG4gICAqL1xuICBvblRpbWVyU3RhcnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy50aW1lclN0YXJ0JC5waXBlKFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgIHN3aXRjaE1hcChzdGFydCA9PiAoc3RhcnQgPyB0aGlzLnRpbWVyJCA6IG9mKG51bGwpKSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBvYnNlcnZhYmxlIGZvciB0aW1lb3V0IGlzIGZpcmVkLlxuICAgKi9cbiAgb25UaW1lb3V0KCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnRpbWVvdXQkLnBpcGUoXG4gICAgICBmaWx0ZXIodGltZW91dCA9PiAhIXRpbWVvdXQpLFxuICAgICAgdGFwKCgpID0+ICh0aGlzLmlzVGltZW91dCA9IHRydWUpKSxcbiAgICAgIG1hcCgoKSA9PiB0cnVlKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgZ2V0Q29uZmlnVmFsdWUoKTogUnhJZGxlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWRsZTogdGhpcy5pZGxlLFxuICAgICAgdGltZW91dDogdGhpcy50aW1lb3V0LFxuICAgICAgcGluZzogdGhpcy5waW5nXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY29uZmlnIHZhbHVlcy5cbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKi9cbiAgc2V0Q29uZmlnVmFsdWVzKGNvbmZpZzogUnhJZGxlQ29uZmlnKSB7XG4gICAgaWYgKHRoaXMuaWRsZVN1YnNjcmlwdGlvbiAmJiAhdGhpcy5pZGxlU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgY29uc29sZS5lcnJvcignQ2FsbCBzdG9wV2F0Y2hpbmcoKSBiZWZvcmUgc2V0IGNvbmZpZyB2YWx1ZXMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmlkbGUpIHtcbiAgICAgIHRoaXMuaWRsZSA9IGNvbmZpZy5pZGxlO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLnBpbmcpIHtcbiAgICAgIHRoaXMucGluZyA9IGNvbmZpZy5waW5nO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLnRpbWVvdXQpIHtcbiAgICAgIHRoaXMudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY3VzdG9tIGFjdGl2aXR5IGV2ZW50c1xuICAgKlxuICAgKiBAcGFyYW0gY3VzdG9tRXZlbnRzIEV4YW1wbGU6IG1lcmdlKFxuICAgKiAgIGZyb21FdmVudCh3aW5kb3csICdtb3VzZW1vdmUnKSxcbiAgICogICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJyksXG4gICAqICAgZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicpLFxuICAgKiAgIGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNoc3RhcnQnKSxcbiAgICogICBmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaGVuZCcpXG4gICAqIClcbiAgICovXG4gIHNldEN1c3RvbUFjdGl2aXR5RXZlbnRzKGN1c3RvbUV2ZW50czogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgaWYgKHRoaXMuaWRsZVN1YnNjcmlwdGlvbiAmJiAhdGhpcy5pZGxlU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgY29uc29sZS5lcnJvcignQ2FsbCBzdG9wV2F0Y2hpbmcoKSBiZWZvcmUgc2V0IGN1c3RvbSBhY3Rpdml0eSBldmVudHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2aXR5RXZlbnRzJCA9IGN1c3RvbUV2ZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB0aW1lci5cbiAgICpcbiAgICogQ291bnRzIGV2ZXJ5IHNlY29uZHMgYW5kIHJldHVybiBuKzEgYW5kIGZpcmUgdGltZW91dCBmb3IgbGFzdCBjb3VudC5cbiAgICogQHBhcmFtIHRpbWVvdXQgVGltZW91dCBpbiBzZWNvbmRzLlxuICAgKi9cbiAgcHJpdmF0ZSBzZXR1cFRpbWVyKHRpbWVvdXQ6IG51bWJlcikge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnRpbWVyJCA9IGludGVydmFsKDEwMDApLnBpcGUoXG4gICAgICAgIHRha2UodGltZW91dCksXG4gICAgICAgIG1hcCgoKSA9PiAxKSxcbiAgICAgICAgc2NhbigoYWNjLCBuKSA9PiBhY2MgKyBuKSxcbiAgICAgICAgdGFwKGNvdW50ID0+IHtcbiAgICAgICAgICBpZiAoY291bnQgPT09IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCQubmV4dCh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHVwIHBpbmcuXG4gICAqXG4gICAqIFBpbmdzIGV2ZXJ5IHBpbmctc2Vjb25kcyBvbmx5IGlmIGlzIG5vdCB0aW1lb3V0LlxuICAgKiBAcGFyYW0gcGluZ1xuICAgKi9cbiAgcHJpdmF0ZSBzZXRQaW5nKHBpbmc6IG51bWJlcikge1xuICAgIHRoaXMucGluZyQgPSBpbnRlcnZhbChwaW5nICogMTAwMCkucGlwZShmaWx0ZXIoKCkgPT4gIXRoaXMuaXNUaW1lb3V0KSk7XG4gIH1cblxuICBnZXRQaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMucGluZyQ7XG4gIH1cbn1cbiJdfQ==