/*global define,brease,console,describe,it,jasmine,runs,waitsFor*/
define(['brease/events/BreaseEvent'], function (BreaseEvent) {

    'use strict';

    var _langDeferred, _mmsDeferred, _cultureDeferred;

    function switchLang(lang) {
        _langDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.LANGUAGE_CHANGED, switchLang_readyHandler);
        if (brease.language.getCurrentLanguage() !== lang) {
            brease.language.switchLanguage(lang);
        } else {
            _langDeferred.resolve();
        }
        return _langDeferred.promise();
    }

    function switchLang_readyHandler() {
        document.body.removeEventListener(BreaseEvent.LANGUAGE_CHANGED, switchLang_readyHandler);
        _langDeferred.resolve();
    }

    function switchMMS(mms) {
        _mmsDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, switchMMS_readyHandler);
        if (brease.measurementSystem.getCurrentMeasurementSystem() !== mms) {
            brease.measurementSystem.switchMeasurementSystem(mms);
        } else {
            _mmsDeferred.resolve();
        }
        return _mmsDeferred.promise();
    }

    function switchMMS_readyHandler() {
        document.body.removeEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, switchMMS_readyHandler);
        _mmsDeferred.resolve();
    }

    function switchCulture(culture) {
        _cultureDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.CULTURE_CHANGED, switchCulture_readyHandler);
        if (brease.culture.getCurrentCulture().key !== culture) {
            brease.culture.switchCulture(culture);
        } else {
            _cultureDeferred.resolve();
        }
        return _cultureDeferred.promise();
    }

    function switchCulture_readyHandler() {
        document.body.removeEventListener(BreaseEvent.CULTURE_CHANGED, switchCulture_readyHandler);
        _cultureDeferred.resolve();
    }

    function setConditions(conditions, callback) {
        var preconditions = [];
        if (conditions.lang !== undefined) {
            preconditions.push(switchLang(conditions.lang));
        }
        if (conditions.mms !== undefined) {
            preconditions.push(switchMMS(conditions.mms));
        }
        if (conditions.culture !== undefined) {
            preconditions.push(switchCulture(conditions.culture));
        }
        $.when.apply(null, preconditions).then(function () {
            callback();
        });
    }



    var TestUtils = {

        preConditions: function (title, conditions) {

            describe(title, function () {
                it("", function () {
                    var ready = jasmine.createSpy();

                    runs(function () {
                        setConditions(conditions, ready);
                    });

                    waitsFor(function () {
                        return ready.callCount > 0;
                    });

                });
            });
        },

        log: function (flag, color, method) {
            if (flag) {
                return function (spec, config) {
                    if (!config) {
                        config = {};
                    }
                    if (console[method]) {
                        console[method]('%c########### ' + ((config.prefix) ? config.prefix : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + ((color) ? color : '#999999'));
                    } else {
                        console.log('%c########### ' + ((config.prefix) ? config.prefix : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + ((color) ? color : '#999999'));
                    }
                };
            } else {
                return function () { };
            }
        },

        console: function (action, callThrough, config) {
            if (action === 'mock') {
                TestUtils.callThrough = callThrough;
                TestUtils.config = config || {};
                window.console = TestUtils.fakeConsole;
            } else {
                window.console = TestUtils.originalConsole;
            }
        },

        originalConsole: window.console,
        fakeConsole: {

            log: function () {
                if (TestUtils.callThrough || TestUtils.config.log === true) {
                    TestUtils.originalConsole.log.apply(TestUtils.originalConsole, arguments);
                }
            },
            warn: function () {
                if (TestUtils.callThrough || TestUtils.config.warn === true) {
                    TestUtils.originalConsole.warn.apply(TestUtils.originalConsole, arguments);
                }
            },
            debug: function () {
                if (TestUtils.callThrough || TestUtils.config.debug === true) {
                    TestUtils.originalConsole.debug.apply(TestUtils.originalConsole, arguments);
                }
            },
            info: function () {
                if (TestUtils.callThrough || TestUtils.config.info === true) {
                    TestUtils.originalConsole.info.apply(TestUtils.originalConsole, arguments);
                }
            },
            trace: function () {
                if (TestUtils.callThrough || TestUtils.config.trace === true) {
                    TestUtils.originalConsole.trace.apply(TestUtils.originalConsole, arguments);
                }
            },
            time: function () {
                if (TestUtils.callThrough || TestUtils.config.time === true) {
                    TestUtils.originalConsole.time.apply(TestUtils.originalConsole, arguments);
                }
            },
            timeEnd: function () {
                if (TestUtils.callThrough || TestUtils.config.timeEnd === true) {
                    TestUtils.originalConsole.timeEnd.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatWarn: function () {
                if (TestUtils.callThrough || TestUtils.config.iatWarn === true) {
                    TestUtils.originalConsole.iatWarn.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatDebug: function () {
                if (TestUtils.callThrough || TestUtils.config.iatDebug === true) {
                    TestUtils.originalConsole.iatDebug.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatDebugLog: function () {
                if (TestUtils.callThrough || TestUtils.config.iatDebugLog === true) {
                    TestUtils.originalConsole.iatDebug.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatInfo: function () {
                if (TestUtils.callThrough || TestUtils.config.iatInfo === true) {
                    TestUtils.originalConsole.iatInfo.apply(TestUtils.originalConsole, arguments);
                }
            },
            always: function () {
                TestUtils.originalConsole.always.apply(TestUtils.originalConsole, arguments);
            }
        }

    };

    return TestUtils;

});