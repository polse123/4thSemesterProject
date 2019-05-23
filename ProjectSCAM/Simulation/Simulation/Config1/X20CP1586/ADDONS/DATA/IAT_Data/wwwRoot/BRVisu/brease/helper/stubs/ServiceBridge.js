/*global define,console,brease*/
define(['brease/helper/stubs/Server', 'brease/controller/objects/VisuStatus', 'brease/controller/libs/ErrorCode', 'brease/events/ServerEvent'], function (Server, VisuStatus, ErrorCode, ServerEvent) {
    /*jshint white:false*/
    'use strict';

    var timeoutForTextLoad = 0;

    // MOCK EXTENSIONS
    var testServices = {

        addSubscriptions: function () {
            Server.addSubscriptions.apply(Server, arguments);
        },

        addEventSubscriptions: function () {
            Server.addEventSubscriptions.apply(Server, arguments);
        },

        getModelData: function () {
            return Server.getModelData.apply(Server, arguments);
        },

        setModelData: function () {
            Server.setModelData.apply(Server, arguments);
        },
        setData: function (key, value) {
            data[key] = value;
        },
        getData: function (key) {
            return data[key];
        }
    },
    data = {
        registerClientResponseCode: 0,
        activateVisuSuccessResponseCode: 0,
        activateVisuFailResponseCode: ErrorCode.NO_LICENSE,
        visusWithoutLicense: ['visuwithoutlicense']
    },
    //"code": 2148270092 //no license
    //"code": 2148073484 //no further sessions
    //"code": 2148139020 //max clients
    //"code": 2148204556 //not enough licenses
    timeout = {
        activateContent: 10,
        activateVisu: 50,
        registerClient: 25
    };

    function respondWithTimeout(methodName, callback, response, callbackInfo) {
        if (timeout[methodName] > 0) {
            window.setTimeout(function () {
                callback(response, callbackInfo);
            }, timeout[methodName]);
        } else {
            callback(response, callbackInfo);
        }
    }

    var user = {
        authenticate: function (username, password) {
            var secret = new Date().valueOf();
            for (var i in users) {
                //console.log(users[i], username, password);
                if (compare(users[i].username, username)) {
                    if (compare(users[i].password, password)) {
                        users[i].signature = secret;
                        return {
                            userID: username,
                            isAuthenticated: true,
                            signature: secret
                        };
                    }
                }
            }

            return {
                userID: username,
                isAuthenticated: false,
                signature: secret
            };
        },

        setCurrentUser: function () {

        },

        triggerUserChange: function (userobj) {
            user.currentUser = userobj;
            var type = ServerEvent.USER_CHANGED;
            Server.dispatchEvent({
                "event": type,
                "detail": {
                    user: userobj
                }
            }, type);
        }
    };

    user.currentUser = user.authenticate('anonymous', '');

    var users = [
        { username: "anonymous", password: "" },
        { username: "martin", password: "iat" }
    ],
    _roles = {
        "anonymous": ['Everyone'],
        "TestUser99": ['Everyone', 'Administrators']
    };

    function compare(s1, s2) {
        //console.log("compare", s1, s2);
        if (s1.indexOf(s2) === 0 && s1.length === s2.length) {
            return true;
        }

        else {
            return false;
        }
    }

    function _respondWith(response, data, callback, callbackInfo) {
        callback(response, callbackInfo);
    }

    function _respondWithData(data, callback, callbackInfo) {
        callback(data, callbackInfo);
    }

    return {

        respondWith: function (method, response) {
            if (response === "data") {
                this[method] = _respondWithData;
            } else {
                this[method] = _respondWith.bind(null, response);
            }
        },

        /************************
        *** BINDING related ****
        ************************/
        deactivateContent: function (contentId, visuId, callback, callbackInfo) {
            var response = { success: true, contentId: contentId },
                type = ServerEvent.CONTENT_DEACTIVATED,
                event = {
                    event: type,
                    detail: {
                        contentId: contentId,
                        success: true
                    }
                };
            callback(response, callbackInfo);
            window.setTimeout(function () {
                Server.dispatchEvent(event, type);
            }, 100);
        },

        getSubscription: function (contentId, visuId, callback, callbackInfo) {
            var response = {
                "contentId": contentId,
                "success": true
            };
            response.subscriptions = Server.getSubscriptions(contentId);
            callback(response, callbackInfo);
        },

        activateContent: function (contentId, visuId, callback, callbackInfo) {
            var response = {
                "success": true
            };
            respondWithTimeout('activateContent', callback, response, callbackInfo);

            var type = ServerEvent.CONTENT_ACTIVATED,
                event = {
                    event: type,
                    detail: {
                        contentId: contentId,
                        success: true
                    }
                };
            window.setTimeout(function () {
                Server.dispatchEvent(event, type);
            }, 100);
        },

        activateVisu: function (visuId, callback, callbackInfo) {
            //console.always('activateVisu:'+visuId);
            var code = data.activateVisuSuccessResponseCode;
            if (data.visusWithoutLicense.indexOf(visuId.toLowerCase()) !== -1) {
                code = data.activateVisuFailResponseCode;
            }
            var response = {
                success: true,
                status: {
                    code: code
                }
            };
            respondWithTimeout('activateVisu', callback, response, callbackInfo);

            var type = ServerEvent.VISU_ACTIVATED,
                event = {
                    event: type,
                    detail: {
                        visuId: visuId.toLowerCase()
                    }
                };
            window.setTimeout(function () {
                //console.always('Server.dispatchEvent:',event, type);
                Server.dispatchEvent(event, type);
            }, timeout['activateVisu'] + 10);

        },

        registerClient: function (visuId, callback) {
            var response = {
                "status": {
                    "code": data.registerClientResponseCode
                }
            };
            if (data.registerClientResponseCode !== 0) {
                response.Error = {
                    "Code": 9,
                    "Text": "Visualization already open on this client, no further sessions allowed"
                };
            } else {
                response.success = true;
                response.ClientId = testServices.getModelData('client', 'id');
            }
            respondWithTimeout('registerClient', callback, response);
        },

        deactivateVisu: function (visuId, callback, callbackInfo) {
            var response = {
                success: true
            };
            if (typeof callback === 'function') {
                callback(response, callbackInfo);
            }
        },

        loadConfiguration: function (callback, callbackInfo) {
            callback({
                success: true,
                configuration: {
                    ContentCaching: {
                        cachingSlots: "0",
                        preserveOldValues: "TRUE"
                    }
                }
            }, callbackInfo);
        },

        loadVisuData: function (visuId, callback, callbackInfo) {

            if (brease.config.mockType === 'project') {

                $.getJSON('/' + visuId + '.json', function (data) {
                    callback({
                        success: true,
                        visuData: data
                    }, callbackInfo);
                }).fail(function (jqxhr, textStatus, error) {
                    console.log("error:" + JSON.stringify({
                        status: textStatus, errorMessage: error.toString()
                    }));
                    callback({
                        success: false, status: textStatus
                    }, callbackInfo);
                });
            } else {

                if (visuId.toLowerCase() === 'malformedvisu') {
                    callback({
                        success: false, status: 'parsererror'
                    }, callbackInfo);
                } else {
                    var visuData = Server.getVisuData(visuId);

                    if (visuData) {
                        callback({
                            success: true,
                            visuData: visuData
                        }, callbackInfo);
                    } else {
                        //console.log("error", { status: '', errorMessage: 'visu not found' });
                        callback({
                            success: false, status: VisuStatus.NOT_FOUND
                        }, callbackInfo);
                    }
                }
            }
        },

        logEvents: function (data, callback) {

            var response = {
                success: true,
                verboseLvl: 255
            };
            callback(response);
        },

        /********************
        *** TEXT related ****
        *********************/
        loadLanguages: function (callback) {
            var response = Server.getLanguages();
            response.success = true;
            callback(response);
        },

        switchLanguage: function (langKey, callback) {
            Server.setCurrentLanguage(langKey);
            callback({
                langKey: langKey, success: true
            });
        },

        loadTexts: function (langKey, callback, callbackInfo) {
            var response = Server.getCurrentText();
            response.success = true;
            if (timeoutForTextLoad > 0) {
                window.setTimeout(function () {
                    callback(response, callbackInfo);
                }, timeoutForTextLoad);
            } else {
                callback(response, callbackInfo);
            }
        },

        loadSystemTexts: function (langKey, callback, callbackInfo) {
            var response = Server.getCurrentText();
            response.success = true;
            callback(response, callbackInfo);
        },

        getAllUnitSymbols: function (langKey, callback, callbackInfo) {
            if (langKey !== undefined) {
                var response = {
                    unitSymbols: Server.getAllUnitSymbols(),
                    success: true
                };
                callback(response, callbackInfo);
            }
        },

        getUnitSymbols: function (langKey, commonCodes, callback, callbackInfo) {
            if (langKey !== undefined) {
                var symbols = {
                };
                for (var i = 0; i < commonCodes.length; i += 1) {
                    symbols[commonCodes[i]] = Server.getUnitSymbol(commonCodes[i]);
                }
                var response = {
                    unitSymbols: symbols,
                    success: true
                };
                callback(response, callbackInfo);
            }
        },

        /***********************
        *** CULTURE related ***
        ***********************/
        loadCultures: function (callback) {
            var response = Server.getCultures();
            response.success = true;
            callback(response);
        },

        switchCulture: function (cultureKey, callback) {
            Server.setCurrentCulture(cultureKey);
            callback({
                cultureKey: cultureKey, success: true
            });
        },

        /***********************
        *** MeasurementSystem related ***
        ***********************/
        loadMeasurementSystemList: function (callback) {
            var response = Server.getMMSystems();
            response.success = true;
            callback(response);
        },

        switchMeasurementSystem: function (key, callback, callbackInfo) {
            if (key !== undefined) {
                Server.setCurrentMMS(key);
                callback({
                    success: true
                }, callbackInfo);
            }
        },

        /***********************
        *** USER related ***
        ***********************/
        authenticateUser: function (username, password, callback) {
            var auth = user.authenticate(username, password);

            if (auth !== undefined) {
                callback({
                    success: true, user: auth
                });
            } else {
                callback({
                    success: false
                });
            }

        },

        setCurrentUser: function (userobj, callback) {
            user.currentUser = userobj;
            if (typeof callback === 'function') {
                callback({
                    success: true
                });
            }
            user.triggerUserChange(userobj);


        },

        loadCurrentUser: function (callback) {
            callback({
                success: true, user: user.currentUser
            });

        },

        setDefaultUser: function (callback) {
            var userobj = user.authenticate("anonymous", "");

            user.currentUser = userobj;
            callback({
                success: true, user: user.currentUser
            });
            user.triggerUserChange(userobj);


        },

        userHasRoles: function (roles, callback) {
            var response = {
            };
            for (var i = 0; i < roles.length; i += 1) {
                response[roles[i]] = (roles[i] === 'NotInRole') ? false : true;
            }
            callback({
                success: true, roles: response
            });
        },

        loadUserRoles: function (callback, callbackInfo) {
            callback({
                success: true, roles: _roles[user.currentUser.userID] || ['Everyone']
            }, callbackInfo);
        },

        formatText: function (text, args, callback) {
            if (text.indexOf('snippetError') !== -1) {
                callback({
                    success: false, string: text
                });
            } else {
                for (var i = 0; i < args.length; i += 1) {
                    text = text.replace(new RegExp("\\{" + (i + 1) + "\\}", ["g"]), args[i]);
                }
                callback({
                    success: true, string: text
                });
            }
        },

        setClientInformation: function () {

        },

        /*#######################
        ### Action Event related ###
        #######################*/

        getEventSubscription: function (contentId, visuId, callback, callbackInfo) {
            var response = {
                "contentId": contentId,
                "success": true
            };
            response.eventSubscriptions = Server.getEventSubscriptions(contentId);
            callback(response, callbackInfo);
        },
        getSessionEventSubscription: function (callback, callbackInfo) {
            var response = {
                "contentId": "_session",
                "success": true
            };
            response.eventSubscriptions = Server.getEventSubscriptions();
            callback(response, callbackInfo);
        },
        testServices: testServices,
        mocked: true

    };
});