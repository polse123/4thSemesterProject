/*global define*/
define(['brease/events/EventDispatcher', 'brease/events/ServerEvent', 'brease/events/ClientSystemEvent'], function (EventDispatcher, ServerEvent, ClientSystemEvent) {
    /*jshint white:false */
    'use strict';

    var _model = {
        client: {
            id: 'ClientIdFromServerStub'
        },
        subscriptions: {
        },
        eventSubscriptions: {
        },
        sessionEventSubscriptions: [
            {
                event: ClientSystemEvent.KEY_PRESS
            },
            {
                event: ClientSystemEvent.KEY_UP
            },
            {
                event: ClientSystemEvent.KEY_DOWN
            }
        ],
        measurementSystems: {
            measurementSystemList: {
                "metric": {
                    description: 'Metrisch'
                },
                "imperial": {
                    description: 'Imperial'
                },
                "imperial-us": {
                    description: 'Imperial U.S.'
                }
            },
            current_measurementSystem: 'metric'
        },
        language: {
            data: {
                languages: {
                    de: {
                        description: 'Deutsch',
                        index: 2
                    },
                    en: {
                        description: 'English',
                        index: 1
                    },
                    fr: {
                        description: 'Français',
                        index: 5
                    },
                    zh: {
                        description: '普通话', //chinesisch
                        index: 4
                    },
                    ko: {
                        description: '한국말', //koreanisch
                        index: 3
                    }
                },
                current_language: 'de'
            },

            texts: {
                de: {
                    "BR/IAT/brease.common.attention": "Achtung",
                    "BR/IAT/brease.common.connectionError.text": "Die Verbindung zum Server wurde unterbrochen!",
                    "BR/IAT/brease.common.transferStart": "Transfer gestartet - bitte warten Sie bis der Server bereit ist!",
                    "BR/IAT/brease.common.ok": "ok",
                    "BR/IAT/brease.common.yes": "ja",
                    "BR/IAT/brease.common.no": "nein",
                    "BR/IAT/brease.common.cancel": "abbrechen",
                    "BR/IAT/brease.common.abort": "abort",
                    "BR/IAT/brease.common.retry": "retry",
                    "BR/IAT/brease.common.ignore": "ignore",
                    "BR/IAT/brease.common.enter": "enter",
                    "BR/IAT/brease.common.reset": "reset",
                    "BR/IAT/brease.common.pageloading": "Seite wird geladen...",
                    "BR/IAT/brease.error.STARTPAGE_NOT_FOUND": "Startseite nicht gefunden!",
                    "BR/IAT/brease.error.DIALOG_NOT_FOUND": "Dialog nicht gefunden!",
                    "BR/IAT/brease.error.NO_PAGES_FOUND": "Achtung: keine Pages in Visualisierung angegeben!",
                    "BR/IAT/brease.error.NO_LAYOUTS_FOUND": "Achtung: keine Layouts in Visualisierung angegeben!",
                    "BR/IAT/brease.error.INCORRECT_VISU": "Visualisierung (id=\"{1}\") kann nicht dargestellt werden!",
                    "BR/IAT/brease.error.VISU_NOT_FOUND": "Visualisierung (id=\"{1}\") nicht gefunden!",
                    "BR/IAT/brease.error.LAYOUT_NOT_FOUND": "Layout nicht gefunden!",
                    "BR/IAT/brease.error.CONTENT_NOT_FOUND": "Content nicht gefunden!",
                    "BR/IAT/brease.error.ACTIVATE_VISU_FAILED": "Zugriff verweigert! Lizenz für die Visualisierung \"{1}\" nicht vorhanden!",
                    "IAT/brease.unittest.text1": "text1_de",
                    "IAT/brease.unittest.text2": "text2_de",
                    "IAT/unit.temp.gc": "°C",
                    "IAT/unit.time.sec": "s",
                    "IAT/unit.pieces": "Stk",
                    "IAT/brease.common.today": "heute",
                    "IAT/brease.common.languages": "Sprachen",
                    "IAT/brease.demo.home": "Startseite",
                    "IAT/brease.demo.table.status1": "status 1",
                    "IAT/brease.demo.table.status2": "status 2",
                    "IAT/brease.demo.table.status3": "status 3",
                    "IAT/brease.demo.table.status4": "status 4",
                    "IAT/brease.demo.buttonbar.btn01": "Startseite",
                    "IAT/brease.demo.buttonbar.btn02": "Trends",
                    "IAT/brease.demo.buttonbar.btn03": "Kontakt",
                    "IAT/brease.demo.buttonbar.btn04": "Hilfe",
                    "IAT/brease.demo.buttons.example": "Beispiel Button",
                    "IAT/brease.demo.differentText": "anderer text",
                    "IAT/brease.demo.dropdown.prompt": "bitte wählen",
                    "IAT/brease.demo.dropdown.testoption1": "Auswahl 1",
                    "IAT/brease.demo.dropdown.testoption2": "Auswahl 2",
                    "IAT/brease.demo.dropdown.testoption3": "Auswahl 3",
                    "IAT/brease.demo.dropdown.testoption4": "Auswahl 4",
                    "IAT/brease.demo.dropdown.testoption5": "Auswahl 5",
                    "IAT/brease.format.y": "Y",
                    "IAT/snippetSample": "enthaelt ein snippet: {$IAT/unit.temp.gc}",
                    "IAT/snippetError": "snippetError: {$IAT/unit.temp.gc}"
                },
                en: {
                    "BR/IAT/brease.common.attention": "Attention",
                    "BR/IAT/brease.common.connectionError.text": "Connection to server is lost!",
                    "BR/IAT/brease.common.transferStart": "Server transfer started - please wait for reconnection!",
                    "BR/IAT/brease.common.ok": "ok",
                    "BR/IAT/brease.common.yes": "yes",
                    "BR/IAT/brease.common.no": "no",
                    "BR/IAT/brease.common.cancel": "cancel",
                    "BR/IAT/brease.common.abort": "abort",
                    "BR/IAT/brease.common.retry": "retry",
                    "BR/IAT/brease.common.ignore": "ignore",
                    "BR/IAT/brease.common.enter": "enter",
                    "BR/IAT/brease.common.reset": "reset",
                    "BR/IAT/brease.common.pageloading": "page is loading...",
                    "BR/IAT/brease.error.STARTPAGE_NOT_FOUND": "Startpage not found!",
                    "BR/IAT/brease.error.DIALOG_NOT_FOUND": "Dialog not found!",
                    "BR/IAT/brease.error.NO_PAGES_FOUND": "Attention: no pages declared!",
                    "BR/IAT/brease.error.NO_LAYOUTS_FOUND": "Attention: no layouts declared",
                    "BR/IAT/brease.error.INCORRECT_VISU": "Visualization (id=\"{1}\") could not be displayed!",
                    "BR/IAT/brease.error.VISU_NOT_FOUND": "Visualization (id=\"{1}\") not found!",
                    "BR/IAT/brease.error.LAYOUT_NOT_FOUND": "Layout not found!",
                    "BR/IAT/brease.error.CONTENT_NOT_FOUND": "Content not found!",
                    "BR/IAT/brease.error.ACTIVATE_VISU_FAILED": "Not allowed! License not available for visualization \"{1}\"!",
                    "IAT/brease.unittest.text1": "text1_en",
                    "IAT/brease.unittest.text2": "text2_en",
                    "IAT/unit.temp.gc": "°C",
                    "IAT/unit.time.sec": "s",
                    "IAT/unit.pieces": "pcs",
                    "IAT/brease.common.today": "today",
                    "IAT/brease.common.languages": "Languages",
                    "IAT/brease.demo.home": "Home",
                    "IAT/brease.demo.table.status1": "status 1",
                    "IAT/brease.demo.table.status2": "status 2",
                    "IAT/brease.demo.table.status3": "status 3",
                    "IAT/brease.demo.table.status4": "status 4",
                    "IAT/brease.demo.buttonbar.btn01": "Startpage",
                    "IAT/brease.demo.buttonbar.btn02": "Trends",
                    "IAT/brease.demo.buttonbar.btn03": "Contact",
                    "IAT/brease.demo.buttonbar.btn04": "Help",
                    "IAT/brease.demo.buttons.example": "Example Button",
                    "IAT/brease.demo.differentText": "different text",
                    "IAT/brease.demo.dropdown.prompt": "please select",
                    "IAT/brease.demo.dropdown.testoption1": "option 1",
                    "IAT/brease.demo.dropdown.testoption2": "option 2",
                    "IAT/brease.demo.dropdown.testoption3": "option 3",
                    "IAT/brease.demo.dropdown.testoption4": "option 4",
                    "IAT/brease.demo.dropdown.testoption5": "option 5",
                    "IAT/brease.format.y": "t",
                    "IAT/snippetSample": "enthaelt ein snippet: {$IAT/unit.temp.gc}",
                    "IAT/snippetError": "snippetError: {$IAT/unit.temp.gc}"
                },
                fr: {
                    "IAT/unit.temp.gc": "°C",
                    "IAT/unit.time.sec": "s",
                    "IAT/brease.unittest.text1": "text1_fr",
                    "IAT/brease.unittest.text2": "text2_fr"
                },
                zh: {
                    "IAT/unit.temp.gc": "°C",
                    "IAT/unit.time.sec": "s",
                    "IAT/brease.unittest.text1": "text1_zh",
                    "IAT/brease.unittest.text2": "text2_zh"
                },
                ko: {
                    "BR/IAT/brease.common.attention": "Attention",
                    "BR/IAT/brease.common.transferStart": "transferStart",
                    "BR/IAT/brease.common.yes": "예",
                    "BR/IAT/brease.common.no": "아니",
                    "BR/IAT/brease.common.ok": "확인",
                    "BR/IAT/brease.common.retry": "retry",
                    "BR/IAT/brease.common.abort": "abort",
                    "BR/IAT/brease.common.ignore": "ignore",
                    "BR/IAT/brease.common.cancel": "취소",
                    "IAT/brease.unittest.text1": "text1_kr",
                    "IAT/brease.unittest.text2": "text2_kr",
                    "IAT/unit.temp.gc": "섭씨",
                    "IAT/unit.time.sec": "s",
                    "IAT/unit.pieces": "조각",
                    "IAT/brease.common.today": "today",
                    "IAT/brease.common.languages": "언어 선택",
                    "IAT/brease.demo.home": "홈",
                    "IAT/brease.demo.table.status1": "status 1",
                    "IAT/brease.demo.table.status2": "status 2",
                    "IAT/brease.demo.table.status3": "status 3",
                    "IAT/brease.demo.table.status4": "status 4",
                    "IAT/brease.demo.buttonbar.btn01": "Startpage",
                    "IAT/brease.demo.buttonbar.btn02": "Trends",
                    "IAT/brease.demo.buttonbar.btn03": "Contact",
                    "IAT/brease.demo.buttonbar.btn04": "Help",
                    "IAT/brease.demo.buttons.example": "Example Button",
                    "IAT/brease.demo.differentText": "different text",
                    "IAT/brease.demo.dropdown.prompt": "please select",
                    "IAT/brease.demo.dropdown.testoption1": "option 1",
                    "IAT/brease.demo.dropdown.testoption2": "option 2",
                    "IAT/brease.demo.dropdown.testoption3": "option 3",
                    "IAT/brease.demo.dropdown.testoption4": "option 4",
                    "IAT/brease.demo.dropdown.testoption5": "option 5"
                }
            },
            units: {
                "INH": "in",
                "MTR": "m",
                "GRM": "g"
            }
        },
        culture: {

            data: {
                cultures: {
                    de: {
                        description: "German"
                    },
                    en: {
                        description: "English"
                    },
                    fr: {
                        description: "French"
                    },
                    zh: {
                        description: "Chinese"
                    }
                },
                current_culture: 'de'
            }
        },
        visus: {
            Visu: {
                "startPage": "miscPage",
                "startTheme": "DemoTheme",
                "pages": {
                    "miscPage": {
                        "layout": "main",
                        "assignments": [
                            {
                                "areaId": "A0",
                                "contentId": "navigationContent",
                                "type": "Content",
                                "style": "navigation"
                            },
                            {
                                "areaId": "A1",
                                "contentId": "miscContent",
                                "type": "Content"
                            }
                        ]
                    },
                    "groupBoxPage": {
                        "layout": "main",
                        "assignments": [
                            {
                                "areaId": "A0",
                                "contentId": "navigationContent",
                                "type": "Content",
                                "style": "navigation"
                            },
                                { "areaId": "A1", "contentId": "embeddedVisu", "type": "Visu" }
                        ]
                    }
                },
                "navigations": {
                    "mainNav": {
                        "pages": {
                            "miscPage": {
                                "targets": ["groupBoxPage"]
                            },
                            "groupBoxPage": {
                                "targets": ["miscPage"]
                            }
                        }
                    }
                },
                "layouts": {
                    "main": {
                        "areas": {
                            "A0": {
                                "height": 50,
                                "width": 780,
                                "top": 0,
                                "left": 0,
                                "zIndex": 2
                            },
                            "A1": {
                                "height": 500,
                                "width": 780,
                                "top": 50,
                                "left": 0,
                                "zIndex": 1
                            }
                        },
                        "width": 780,
                        "height": 550
                    }
                },
                "contents": {
                    "navigationContent": {
                        "path": "/contents/mappView/navigationContent.html",
                        "height": 50,
                        "width": 780
                    },
                    "miscContent": {
                        "path": "/contents/mappView/miscContent.html",
                        "height": 500,
                        "width": 780
                    }
                },
                "themes": ["DemoTheme", "BuRThemeFlat1"],
                "configurations": {
                    "activityCount": false,
                    "watchdog": 0,
                    "zoom": false,
                    "bootLogo": "Media/images/DKT.png",
                    "bootColor": "rgb(156,26,32)",
                    "favicon": "Media/images/DKTicon.png"
                }
            },
            embeddedVisu: {
                startPage: "embedded_page1",
                pages: {
                    embedded_page1: {
                        layout: "embedded_L1",
                        assignments: [
            { "areaId": "A1", "contentId": "groupBoxContent", "type": "Content" }
                        ]
                    }
                },
                layouts: {
                    embedded_L1: {
                        "width": 780, "height": 500, "areas": {
                            "A1": {
                                "height": 500, "width": 780, "top": 0, "left": 0
                            }
                        }
                    }
                },
                contents: {
                    "groupBoxContent": {
                        "path": "/contents/mappView/groupBoxContent.html",
                        "height": 500,
                        "width": 780
                    }
                }
            }
        }
    };



    function _setDeepValue(obj, path, data) {
        var parts = path.split('.');
        if (parts.length === 1) {
            obj[path] = data;
        } else {
            for (var i = 0, len = parts.length; i < len - 1; i += 1) {
                obj = obj[parts[i]];
            }
            obj[parts[len - 1]] = data;
        }
    }

    var server = new EventDispatcher();
    server.getModelData = function (widgetId, attribute) {
        //console.log('Server.getModelData.widgetId=' + widgetId + ',attribute=' + attribute);
        return (_model[widgetId]) ? _model[widgetId][attribute] : undefined;
    };
    server.setModelData = function (path, data) {

        _setDeepValue(_model, path, data);
    };

    server.setData = function (data) {

        for (var i = 0; i < data.length; i += 1) {
            if (data[i].event === ServerEvent.PROPERTY_VALUE_CHANGED) {

                for (var j = 0; j < data[i].eventArgs.length; j += 1) {
                    var item = data[i].eventArgs[j];
                    for (var k = 0; k < item.data.length; k += 1) {
                        var itemData = item.data[k];
                        _model[item.refId] = _model[item.refId] || {};
                        _model[item.refId][itemData.attribute] = itemData.value;
                    }
                }
            }
        }
    };
    server.addSubscriptions = function (data) {
        var contentId = data.contentId;
        _model.subscriptions[contentId] = _model.subscriptions[contentId] || { subscriptions: [] };

        for (var i = 0; i < data.subscriptions.length; i += 1) {
            _model.subscriptions[contentId].subscriptions.push(data.subscriptions[i]);
        }
    };

    server.addEventSubscriptions = function (data) {
        var contentId = data.contentId;
        _model.eventSubscriptions[contentId] = _model.eventSubscriptions[contentId] || { eventSubscriptions: [] };

        for (var i = 0; i < data.eventSubscriptions.length; i += 1) {
            _model.eventSubscriptions[contentId].eventSubscriptions.push(data.eventSubscriptions[i]);
        }
    };
    server.getSubscriptions = function (contentId) {
        if (_model.subscriptions[contentId] !== undefined) {
            return _model.subscriptions[contentId].subscriptions;
        } else {
            return [];
        }
    };
    server.getVisuData = function (visuId) {
        return _model.visus[visuId];
    };
    server.setCurrentLanguage = function (langKey) {
        _model.language.data.current_language = langKey;
    };
    server.getCurrentText = function () {
        var texts = $.extend({}, _model.language.texts['de'], _model.language.texts[_model.language.data.current_language]);

        return texts;
    };
    server.getLanguages = function () {
        return _model.language.data;
    };
    server.getAllUnitSymbols = function () {
        return _model.language.units;
    };
    server.getUnitSymbol = function (commonCode) {
        return _model.language.units[commonCode];
    };
    server.getCultures = function () {
        return _model.culture.data;
    };
    server.setCurrentCulture = function (cultureKey) {
        _model.culture.data.current_culture = cultureKey;
    };
    server.getMMSystems = function () {
        return _model.measurementSystems;
    };
    server.setCurrentMMS = function (key) {
        _model.measurementSystems.current_measurementSystem = key;
    };
    server.getEventSubscriptions = function (contentId) {
        if (_model.eventSubscriptions[contentId] !== undefined) {
            return _model.eventSubscriptions[contentId].eventSubscriptions;
        } else {
            return [];
        }
    };
    server.getSessionEventSubscriptions = function () {
        if (_model.sessionEventSubscriptions !== undefined) {
            return _model.sessionEventSubscriptions;
        } else {
            return [];
        }
    };

    return server;

});