(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('rx-idle', ['exports', 'rxjs', 'rxjs/operators', '@angular/core'], factory) :
    (factory((global['rx-idle'] = {}),global.rxjs,global.rxjs.operators,global.ng.core));
}(this, (function (exports,rxjs,operators,i0) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RxIdleConfig = /** @class */ (function () {
        function RxIdleConfig() {
        }
        return RxIdleConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
            this.timerStart$ = new rxjs.Subject();
            this.timeout$ = new rxjs.Subject();
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
                this.activityEvents$ = rxjs.merge(rxjs.fromEvent(window, 'mousemove'), rxjs.fromEvent(window, 'resize'), rxjs.fromEvent(document, 'keydown'));
                this.idle$ = rxjs.from(this.activityEvents$);
                if (this.idleSubscription) {
                    this.idleSubscription.unsubscribe();
                }
                this.idleSubscription = this.idle$
                    .pipe(operators.bufferTime(500), // Starting point of detecting of user's inactivity
                operators.filter(( /**
                 * @param {?} arr
                 * @return {?}
                 */function (arr) { return !arr.length && !_this.isIdleDetected && !_this.isInactivityTimer; })), operators.tap(( /**
                 * @return {?}
                 */function () { return (_this.isIdleDetected = true); })), operators.switchMap(( /**
                 * @return {?}
                 */function () {
                    return _this._ngZone.runOutsideAngular(( /**
                     * @return {?}
                     */function () {
                        return rxjs.interval(1000).pipe(operators.takeUntil(rxjs.merge(_this.activityEvents$, rxjs.timer(_this.idle * 1000).pipe(operators.tap(( /**
                         * @return {?}
                         */function () {
                            _this.isInactivityTimer = true;
                            _this.timerStart$.next(true);
                        }))))), operators.finalize(( /**
                         * @return {?}
                         */function () { return (_this.isIdleDetected = false); })));
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
                return this.timerStart$.pipe(operators.distinctUntilChanged(), operators.switchMap(( /**
                 * @param {?} start
                 * @return {?}
                 */function (start) { return (start ? _this.timer$ : rxjs.of(null)); })));
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
                return this.timeout$.pipe(operators.filter(( /**
                 * @param {?} timeout
                 * @return {?}
                 */function (timeout) { return !!timeout; })), operators.tap(( /**
                 * @return {?}
                 */function () { return (_this.isTimeout = true); })), operators.map(( /**
                 * @return {?}
                 */function () { return true; })));
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
                this._ngZone.runOutsideAngular(( /**
                 * @return {?}
                 */function () {
                    _this.timer$ = rxjs.interval(1000).pipe(operators.take(timeout), operators.map(( /**
                     * @return {?}
                     */function () { return 1; })), operators.scan(( /**
                     * @param {?} acc
                     * @param {?} n
                     * @return {?}
                     */function (acc, n) { return acc + n; })), operators.tap(( /**
                     * @param {?} count
                     * @return {?}
                     */function (count) {
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
                this.ping$ = rxjs.interval(ping * 1000).pipe(operators.filter(( /**
                 * @return {?}
                 */function () { return !_this.isTimeout; })));
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        RxIdleService.ctorParameters = function () {
            return [
                { type: RxIdleConfig, decorators: [{ type: i0.Optional }] },
                { type: i0.NgZone }
            ];
        };
        /** @nocollapse */ RxIdleService.ngInjectableDef = i0.defineInjectable({ factory: function RxIdleService_Factory() { return new RxIdleService(i0.inject(RxIdleConfig, 8), i0.inject(i0.NgZone)); }, token: RxIdleService, providedIn: "root" });
        return RxIdleService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RxIdleModule = /** @class */ (function () {
        function RxIdleModule() {
        }
        /**
         * @param {?} config
         * @return {?}
         */
        RxIdleModule.forRoot = /**
         * @param {?} config
         * @return {?}
         */
            function (config) {
                return {
                    ngModule: RxIdleModule,
                    providers: [
                        { provide: RxIdleConfig, useValue: config }
                    ]
                };
            };
        RxIdleModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [],
                        imports: [],
                        exports: []
                    },] }
        ];
        return RxIdleModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.RxIdleConfig = RxIdleConfig;
    exports.RxIdleService = RxIdleService;
    exports.RxIdleModule = RxIdleModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=rx-idle.umd.js.map