/*global define,console*/
define(['brease/helper/XHRPool'], function (XHRPool) {

    'use strict';

    var _baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/services/';

    return {

        /************************
        *** BINDING related ****
        ************************/
        activateVisu: function (visuId, callback, callbackInfo) {
            if (visuId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'activateVisu?visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined visuId in method activateVisu');
            }
        },

        deactivateVisu: function (visuId, callback, callbackInfo) {
            if (visuId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'deactivateVisu?visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined visuId in method deactivateVisu');
            }
        },

        deactivateContent: function (contentId, visuId, callback, callbackInfo) {
            if (contentId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'deactivateContent?contentId=' + contentId + '&visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined contentId in method deactivateContent');
            }
        },

        getSubscription: function (contentId, visuId, callback, callbackInfo) {
            if (contentId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'getSubscription?contentId=' + contentId + '&visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined contentId in method getSubscription');
            }
        },

        activateContent: function (contentId, visuId, callback, callbackInfo) {
            if (contentId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'activateContent?contentId=' + contentId + '&visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined contentId in method activateContent');
            }
        },

        loadConfiguration: function (callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('GET', _baseUrl + 'getConfiguration');
            request.send(null, callback);
        },

        loadVisuData: function (visuId, callback, callbackInfo) {
            $.getJSON('/' + visuId + '.json', function (data) {
                callback({
                    success: true,
                    visuData: data
                }, callbackInfo);
            }).fail(function (jqxhr, textStatus, error) {
                console.log('error:' + JSON.stringify({ status: textStatus, errorMessage: error.toString() }));
                callback({ success: false, status: textStatus }, callbackInfo);
            });
        },

        createBindings: function (contentId, visuId, bindings, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'createBindings');
            request.send(JSON.stringify({
                'Parameter': {
                    'visuId': visuId,
                    'contentId': contentId
                },
                'Data': bindings
            }), callback);
        },

        deleteBindings: function (contentId, visuId, targets, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'deleteBindings');
            request.send(JSON.stringify({
                'Parameter': {
                    'visuId': visuId,
                    'contentId': contentId
                },
                'Data': targets
            }), callback);
        },

        /*#######################
        ### Action Event related ###
        #######################*/

        getEventSubscription: function (contentId, visuId, callback, callbackInfo) {
            if (contentId !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'getEventSubscription?contentId=' + contentId + '&visuId=' + visuId);
                request.send(null, callback);
            } else {
                console.iatWarn('undefined contentId in method getEventSubscription');
            }
        },

        getSessionEventSubscription: function (callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('GET', _baseUrl + 'getSessionEventSubscription');
            request.send(null, callback);

        },

        /********************
        *** TEXT related ****
        *********************/
        loadLanguages: function (callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'getLanguages');
            request.send(null, callback);
        },

        switchLanguage: function (langKey, callback) {
            if (langKey !== undefined) {
                var request = XHRPool.getXHR();
                request.open('GET', _baseUrl + 'switchLanguage?language=' + langKey);
                request.send(null, callback);
            }
        },

        loadTexts: function (langKey, callback, callbackInfo) {
            if (langKey !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'getText?language=' + langKey);
                request.send(null, callback);
            }
        },

        loadSystemTexts: function (langKey, callback, callbackInfo) {
            if (langKey !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'getSystemTexts?language=' + langKey);
                request.send(null, callback);
            }
        },

        getAllUnitSymbols: function (langKey, callback, callbackInfo) {
            if (langKey !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'getAllUnitSymbols?language=' + langKey);
                request.send(null, callback);
            }
        },

        getUnitSymbols: function (langKey, arrCode, callback, callbackInfo) {
            if (langKey !== undefined) {

                var request = XHRPool.getXHR(callbackInfo);
                request.open('POST', _baseUrl + 'getUnitSymbols');
                request.send(JSON.stringify({
                    Data: {
                        'language': langKey,
                        'commonCodes': arrCode
                    }
                }), callback);
            }
        },

        /***********************
        *** CULTURE related ***
        ***********************/
        loadCultures: function (callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'loadCultures');
            request.send(null, callback);
        },

        switchCulture: function (key, callback) {
            if (key !== undefined) {
                var request = XHRPool.getXHR();
                request.open('GET', _baseUrl + 'switchCulture?culture=' + key);
                request.send(null, callback);
            }
        },

        /***********************
        *** MeasurementSystem related ***
        ***********************/
        loadMeasurementSystemList: function (callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'getMeasurementSystemList');
            request.send(null, callback);
        },

        switchMeasurementSystem: function (key, callback, callbackInfo) {
            if (key !== undefined) {
                var request = XHRPool.getXHR(callbackInfo);
                request.open('GET', _baseUrl + 'setMeasurementSystem?measurementSystem=' + key);
                request.send(null, callback);
            }
        },

        /***********************
        *** EVENTLOGGING related ***
        ***********************/
        logEvents: function (data, callback) {
            var request = XHRPool.getXHR();
            request.open('POST', _baseUrl + 'sendEventLog');
            request.send(JSON.stringify({
                Data: data
            }), callback);
        },

        /***********************
        *** USER related ***
        ***********************/
        authenticateUser: function (username, password, callback) {
            var request = XHRPool.getXHR(),
                data = {
                    userID: username,
                    password: password
                };
            request.open('POST', _baseUrl + 'authenticate');
            request.send(JSON.stringify({
                Data: data
            }), callback);
        },

        setCurrentUser: function (user, callback) {
            var request = XHRPool.getXHR();
            request.open('POST', _baseUrl + 'setCurrentUser');
            request.send(JSON.stringify({
                Data: {
                    'user': user
                }
            }), callback);
        },

        loadCurrentUser: function (callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'getCurrentUser');
            request.send(null, callback);
        },

        setDefaultUser: function (callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'setDefaultUser');
            request.send(null, callback);
        },

        userHasRoles: function (roles, callback) {
            var request = XHRPool.getXHR();
            request.open('POST', _baseUrl + 'userHasRoles');
            request.send(JSON.stringify({
                Data: {
                    'roles': roles
                }
            }), callback);
        },

        loadUserRoles: function (callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('GET', _baseUrl + 'getUserRoles');
            request.send(null, callback);
        },

        /*####################
        ### TextFormatter ###
        #####################*/

        formatText: function (text, args, callback) {
            var request = XHRPool.getXHR(),
                data = {
                    formatstring: text,
                    args: args
                };
            request.open('POST', _baseUrl + 'format');
            request.send(JSON.stringify({
                Data: data
            }), callback);
        },


        /*#######################
        ### CLIENTINFO ###
        #######################*/

        /**
        * @method setClientInformation
        * @param {String} data stringified info object
        */
        setClientInformation: function (data) {
            var request = XHRPool.getXHR();
            request.open('POST', _baseUrl + 'setClientInformation');
            request.send('{"Data":' + data + '}');
        },

        registerClient: function (visuId, callback) {
            var request = XHRPool.getXHR();
            request.open('GET', _baseUrl + 'registerclient' + ((visuId !== undefined) ? '?visuId=' + visuId : ''));
            request.send(null, callback);
        },


        /*#######################
        ### OPC UA ###
        #######################*/

        opcuaReadNodeHistory: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/readHistory');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaReadHistoryCount: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/readHistoryCount');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaReadHistoryStart: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/readHistoryStart');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaReadHistoryEnd: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/readHistoryEnd');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaBrowse: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/browse');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaCallMethod: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/callMethod');
            request.send(JSON.stringify({ Data: data }), callback);
        },

        opcuaRead: function (data, callback, callbackInfo) {
            var request = XHRPool.getXHR(callbackInfo);
            request.open('POST', _baseUrl + 'opcua/read');
            request.send(JSON.stringify({ Data: data }), callback);
        }
    };
});