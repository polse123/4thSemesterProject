/*global define,brease*/
define(function () {

    'use strict';

    /**
    * @class brease.services.Configuration
    * @extends core.javascript.Object
    * Configuration service; available via brease.configuration  
    * 
    * @singleton
    */
    var Configuration = {

        init: function (runtimeService) {
            _runtimeService = runtimeService;
            return this;
        },

        loadConfigurations: function (visuConfig) {
            if (visuConfig) {
                _mergeConfig(visuConfig);
            }
            var deferred = $.Deferred();
            _runtimeService.loadConfiguration(_loadConfigurationResponseHandler, { deferred: deferred });
            return deferred.promise();
        }
    },
    _runtimeService;

    function _loadConfigurationResponseHandler(response, callbackInfo) {
        if (response.success === true) {

            if (response.configuration) {
                _mergeConfig(response.configuration);
            }
            callbackInfo.deferred.resolve();
        } else {
            callbackInfo.deferred.reject();
        }
    }

    function _mergeConfig(configurations) {

        // config from .visu file
        if (configurations.zoom !== undefined) {
            brease.config.visu.zoom = (configurations.zoom === 'true' || configurations.zoom === true) ? true : false;
        }
        if (configurations.activityCount !== undefined) {
            brease.config.visu.activityCount = (configurations.activityCount === 'true' || configurations.activityCount === true) ? true : false;
        }
        if (configurations.watchdog !== undefined && brease.config.watchdog === undefined) {
            brease.config.watchdog = parseInt(configurations.watchdog, 10);
        }

        // config from .mappviewcfg file
        if (configurations.ContentCaching !== undefined) {
            brease.config.ContentCaching = configurations.ContentCaching;
            brease.config.ContentCaching.preserveOldValues = (brease.config.ContentCaching.preserveOldValues === 'TRUE') ? true : false;
            if (configurations.ContentCaching.cachingSlots !== undefined) {
                brease.config.ContentCaching.cachingSlots = parseInt(configurations.ContentCaching.cachingSlots, 10);
            }
        }
    }

    return Configuration;

});