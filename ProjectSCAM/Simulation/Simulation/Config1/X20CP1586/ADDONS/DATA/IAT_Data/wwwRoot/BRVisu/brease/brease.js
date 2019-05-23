/*global define,console,CustomEvent,brease*/
define(['brease/controller/objects/Client', 'brease/core/Utils', 'brease/events/BreaseEvent', 'brease/events/ServerEvent', 'brease/controller/libs/LogCode', 'brease/helper/Scroller', 'brease/controller/PopUpManager', 'brease/helper/Messenger', 'brease/helper/SystemMessage', 'brease/config', 'brease/settings'], function (Client, Utils, BreaseEvent, ServerEvent, LogCode, Scroller, popupManager, Messenger, systemMessage, config, settings) {
    /*jshint validthis:true, smarttabs:true, white:false */
    'use strict';

    var _runtimeService,
        _services = {},
        _controller = {},

    /**
    * @class brease.brease
    * @extends core.javascript.Object
    * @alternateClassName brease
    * Main application controller.  
    * Available through global namespace (brease or window.brease).  
    * Example of usage:
    * 
    *     <script>
    *         brease.uiController.parse(widget.elem);
    *         console.log(brease.language.getCurrentLanguage());
    *     </script>
    *  
    * @singleton
    */

    Brease = function Brease() {

        Utils.defineProperty(this, 'config', config);
        Utils.defineProperty(this, 'services', {});
        this.messenger = new Messenger(systemMessage);

        _defineElements.call(this);
        _defineSettings.call(this);
        _prepareDOM.call(this);
    },

    p = Brease.prototype;

    /**
    * @method callWidget
    * Method to invoke methods of widgets (shortcut for {@link brease.controller.UIController#method-callWidget UIController.callWidget})
    * @param {String} id id of widget
    * @param {String} method name of method
    * @paramComment First two parameters are required, more are optional, dependent on the method invoked.
    * @return {ANY} returnValue return value of method. Data type depends on the method invoked.
    */
    Utils.defineProperty(p, 'callWidget', function callWidget() {
        return brease.uiController.callWidget.apply(brease.uiController, arguments);
    });
    Utils.defineProperty(p, 'setOptions', function setOptions(id, value) {
        return brease.uiController.setOptions(id, value);
    });

    p.init = function (runtimeService, services, controller) {

        _runtimeService = runtimeService;
        Client.init(runtimeService);

        _defineServices.call(this, services);
        _defineControllers.call(this, controller);

        _initServices.call(this, runtimeService);
        _initControllers.call(this, runtimeService, this.settings, systemMessage);

    };

    // start of brease with a visualization
    p.startVisu = function (visuId) {
        //console.log('%c1) brease.startVisu(visuId=' + visuId + ')', 'color:#cc00cc;');
        this.messenger.announce('START_VISU', { visuId: visuId });
        config.visuId = visuId;
        config.contentId = undefined;
        this.appView.html('');// empty appContainer only for visus, not for "content start"
        _start.call(this);
    };

    // start of brease without a visualization, e.g. editor
    p.startContent = function (contentId) {
        //console.log('%c1) brease.startContent(contentId=' + contentId + ')', 'color:#cc00cc;');
        this.messenger.announce('START_CONTENT', { contentId: contentId });
        config.contentId = contentId;
        config.visuId = undefined;
        _start.call(this);
    };

    p.getClientId = function () {
        return Client.id;
    };

    /**
    * @event app_resize
    * Fired when application root element (=brease.appElem) resizes  
    * That means: either layout is changed or zoom=true and browser window resizes  
    * Attention: for watching browser resizes in all cases you have to use window.onresize
    * @param {String} type {@link brease.events.BreaseEvent#static-property-APP_RESIZE BreaseEvent.APP_RESIZE}
    * @param {HTMLElement} target document.body
    */
    p.dispatchResize = function () {
        document.body.dispatchEvent(new CustomEvent(BreaseEvent.APP_RESIZE));
    };

    function _start() {

        Scroller.init(popupManager);

        window.performanceMonitor.profile('registerClient', 0);
        /* START-ORDER NR 2 */
        /* service call registerClient has to be the first service call -> allocation of cookies */

        //console.log('%c2.) registerClient', 'color:#cc00cc;');
        _runtimeService.registerClient(config.visuId, _registerClientResponse);
    }

    function _defineElements() {

        /**
        * @property {HTMLElement} appElem
        * Reference to the root HTMLElement, namely document.getElementById('appContainer').
        * @readonly
        */
        Utils.defineProperty(this, 'appElem', document.getElementById('appContainer'));
        /**
        * @property {jQuery} appView
        * Reference to the jQuery object of root HTMLElement, namely $('#appContainer').
        * @readonly
        */
        Utils.defineProperty(this, 'appView', $(this.appElem));
        /**
        * @property {jQuery} bodyEl
        * Reference to the jQuery object of document.body, namely $(document.body).
        * @readonly
        */
        Utils.defineProperty(this, 'bodyEl', $(document.body));
        Utils.defineProperty(this, 'docEl', $(document));
    }

    function _prepareDOM() {
        if (!this.bodyEl.hasClass('system_brease_Scrollbar_style_default')) {
            this.bodyEl.addClass('system_brease_Scrollbar_style_default');
        }
        if (!this.bodyEl.hasClass('system_brease_Body_style_default')) {
            this.bodyEl.addClass('system_brease_Body_style_default');
        }
    }

    function _defineSettings() {
        /**
        * @property {Object} settings
        * @readonly
        * @property {String} [settings.noKeyValue=''] This value is used internally to check if a textkey is set and can be used to reset a textkey in options.
        */
        Utils.defineProperty(this, 'settings', settings);
    }

    function _defineControllers(controller) {

        for (var c in controller) {
            _controller[c] = controller[c];
        }
        /**
        * @property {brease.helper.NumberFormatter} formatter
        * Reference to the actual instance of singleton NumberFormatter
        * @readonly
        */
        _definePublicMethod(this, 'formatter', _controller);
        _definePublicMethod(this, 'action', _controller);

        /**
        * @property {brease.controller.OverlayController} overlayController
        * Reference to the actual instance of singleton OverlayController
        * @readonly
        */
        _definePublicMethod(this, 'dialogController', _controller, 'overlayController');
        _definePublicMethod(this, 'overlayController', _controller);

        /**
        * @property {brease.controller.PageController} pageController
        * Reference to the actual instance of singleton PageController
        * @readonly
        */
        _definePublicMethod(this, 'pageController', _controller);

        /**
        * @property {brease.controller.UIController} uiController
        * Reference to the actual instance of singleton UIController
        * @readonly
        */
        _definePublicMethod(this, 'uiController', _controller);
    }

    function _definePublicMethod(obj, prop, source, sourceProp) {
        Object.defineProperty(obj, prop, {
            get: function () { return source[sourceProp || prop]; },
            set: function () { },
            enumerable: true,
            configurable: true
        });
    }

    function _defineServices(services) {

        for (var c in services) {
            _services[c] = services[c];
        }
        /**
        * @property {brease.services.MeasurementSystem} measurementSystem
        * Reference to the actual instance of singleton MeasurementSystem service
        * @readonly
        */
        _definePublicMethod(this, 'measurementSystem', _services);
        _definePublicMethod(this.services, 'measurementSystem', _services);

        /**
        * @property {brease.services.Language} language
        * Reference to the actual instance of singleton language service
        * @readonly
        */
        _definePublicMethod(this, 'language', _services);
        _definePublicMethod(this.services, 'language', _services);

        _definePublicMethod(this, 'user', _services);
        _definePublicMethod(this.services, 'user', _services);
        _definePublicMethod(this, 'culture', _services);
        _definePublicMethod(this.services, 'culture', _services);

        /**
        * @property {brease.services.TextFormatter} textFormatter
        * Reference to the actual instance of singleton textFormatter service
        * @readonly
        */
        _definePublicMethod(this, 'textFormatter', _services);
        _definePublicMethod(this, 'loggerService', _services);

        _definePublicMethod(this.services, 'opcua', _services);
    }

    function _initControllers(runtimeService, settings, systemMessage) {

        _controller.bindingController.init(runtimeService);
        _controller.connectionController.init(runtimeService, systemMessage);
        _controller.infoController.init(runtimeService);
        _controller.eventController.init(runtimeService, _controller.bindingController);
        this.action.init(runtimeService);
        this.pageController.init(runtimeService);
        this.uiController.init(_controller.bindingController, _controller.widgetsController);
    }

    function _initServices(runtimeService) {

        this.measurementSystem.init(runtimeService);
        this.language.init(runtimeService);
        this.culture.init();
        this.user.init(runtimeService);
        this.textFormatter.init(runtimeService);
        this.loggerService.init(runtimeService);
        _services.configuration.init(runtimeService);
    }

    function _registerClientResponse(response) {

        //console.log('%cregisterClient.response(' + JSON.stringify(response) + ')', 'color:green;');

        window.performanceMonitor.profile('registerClient', 1);
        if (response !== undefined && response.status !== undefined && response.status.code === 0) {
            brease.messenger.announce('REGISTER_CLIENT_SUCCESS', { response: response, clientId: response.ClientId });
            Client.setId(response.ClientId);
            _startServices();

        } else {
            if (Client.isValid === undefined) {
                Client.setValid(false);
                brease.messenger.announce('REGISTER_CLIENT_FAILED', { response: response, visuId: config.visuId });
            }
            window.setTimeout(function () {
                _runtimeService.registerClient(config.visuId, _registerClientResponse);
            }, 1000);
        }
    }

    function _startServices() {
        /* START-ORDER NR 3 */
        //console.log('%c3.) startServices', 'color:#cc00cc;');
        $.when(
            brease.language.isReady(),
            brease.measurementSystem.isReady(),
            brease.user.isReady(),
            brease.textFormatter.isReady()
        ).then(function () {
            _loadCulture();
        }, function (message) {
            brease.messenger.announce('START_SERVICES_FAILED', { message: message });
        });
    }

    function _loadCulture() {

        brease.culture.isReady().then(function () {
            brease.messenger.announce('START_SERVICES_SUCCESS', { clientId: Client.id });
            _loadVisuData();
        }, function (message) {
            brease.messenger.announce('START_SERVICES_FAILED', { message: message });
        });
    }

    function _loadVisuData() {
        /* START-ORDER NR 4 */
        //console.log('%c4.) _loadVisuData(visuId=' + brease.config.visuId + ')', 'color:#cc00cc;');
        if (config.visuId) {
            _controller.visuData.loadVisuData(brease.config.visuId, brease.appElem.id).then(
                function (visuConfig) {
                    _loadConfigurations(visuConfig);
                },
                function (visuId) {
                    brease.messenger.announce(LogCode.VISU_NOT_FOUND, { visuId: visuId });
                    _loadConfigurations();
                }
            );
        } else {
            _loadConfigurations();
        }
    }

    function _loadConfigurations(visuConfig) {
        /* START-ORDER NR 5 */
        //console.log('%c5.) _loadConfigurations(visuId=' + brease.config.visuId + ')', 'color:#cc00cc;');
        _services.configuration.loadConfigurations(visuConfig).then(_startSocket, function () {
            brease.messenger.announce('CONFIGURATION_LOAD_ERROR');
            _startSocket();
        });
    }

    function _startSocket() {
        /* START-ORDER NR 6 */
        /* socket connection has to be established befor the loading of user texts, 
           in order that initial snippets can be solved (see A&P 454280) */

        //console.log('%c6.) startSocket', 'color:#cc00cc;');
        window.performanceMonitor.profile('socketConnection', 0);
        brease.messenger.announce('SERVER_CONNECTION_START');

        // server sends SessionActivated event, when he is ready after socket start
        _runtimeService.addEventListener(ServerEvent.SESSION_ACTIVATED, _sessionActivatedHandler);
        $.when(
            _runtimeService.socketIsReady() // try to establish socket connection
        ).then(function () {
            //console.time('TIME FOR sessionActivated');
            //console.log('%cstartSocket.success', 'color:green;');
            window.performanceMonitor.profile('socketConnection', 1);
        }, function () {
            brease.messenger.announce('SERVER_CONNECTION_ERROR');
        });
    }

    function _sessionActivatedHandler() {
        //console.timeEnd('TIME FOR sessionActivated');
        brease.messenger.announce('SERVER_CONNECTION_SUCCESS');
        _controller.bindingController.startListen();
        _serviceTextLoad();
    }

    function _serviceTextLoad() {
        /* START-ORDER NR 7 */
        /* loading texts after socket connection -> see NR 6 */

        brease.messenger.announce('TEXT_LOAD_START');
        window.performanceMonitor.profile('textLoad', 0);
        //console.log('%c7.) loadTexts', 'color:#cc00cc;');
        //console.time('TIME FOR loadTexts');
        $.when(
            brease.language.allTextsLoaded()
        ).then(function () {
            //console.timeEnd('TIME FOR loadTexts');
            //console.log('%cloadTexts.success', 'color:green;');
            window.performanceMonitor.profile('textLoad', 1);
            brease.messenger.announce('TEXT_LOAD_SUCCESS');
            _resourcesLoadedHandler();
        },
        function () {
            brease.messenger.announce('TEXT_LOAD_ERROR');
        });
    }

    function _resourcesLoadedHandler() {

        /**
        * @event resources_loaded
        * Fired when resources (languages, texts, cultures) are loaded   
        * @param {String} type {@link brease.events.BreaseEvent#static-property-RESOURCES_LOADED BreaseEvent.RESOURCES_LOADED}
        * @param {HTMLElement} target brease.appElem
        */
        brease.appElem.dispatchEvent(new CustomEvent(BreaseEvent.RESOURCES_LOADED));
        $.when(
            _startContentIsActivated(),
            brease.overlayController.init()
        ).then(function () {
            if (config.contentId !== undefined) {
                brease.appElem.addEventListener(BreaseEvent.CONTENT_PARSED, _appContainerParsedHandler);
                brease.uiController.parse(brease.appElem, false); // parse appContainer
            } else {
                _finishBreaseStart();
            }
        });
    }

    function _startContentIsActivated() {
        // if brease started with a contentId we have to activate this content, otherwise continue
        if (config.contentId !== undefined) {
            Client.setValid(true);
            return _controller.bindingController.activateContent(config.contentId); // activate and load subscriptions for main content
        } else {
            var deferred = $.Deferred();
            deferred.resolve();
            return deferred.promise();
        }
    }

    function _appContainerParsedHandler() {
        brease.appElem.removeEventListener(BreaseEvent.CONTENT_PARSED, _appContainerParsedHandler);
        _controller.bindingController.sendInitialValues(config.contentId, _finishBreaseStart);
    }

    function _finishBreaseStart() {
        _controller.infoController.start(config.visu.activityCount); // send client info after optional start content is ready
        if (config.visuId !== undefined) {
            brease.pageController.start(config.visuId, brease.appElem, config.ContentCaching);
        }
        /**
        * @event app_ready
        * Fired when application is ready  
        * That means: resources (languages, texts, cultures) loaded and optional main content is active and parsed  
        * @param {String} type {@link brease.events.BreaseEvent#static-property-APP_READY BreaseEvent.APP_READY}
        * @param {HTMLElement} target brease.appElem
        */
        brease.appElem.dispatchEvent(new CustomEvent(BreaseEvent.APP_READY, { bubbles: true }));
        window.performanceMonitor.profile(BreaseEvent.APP_READY);
        /* START-ORDER NR 8 */
        //console.log('%c8.) startHeartbeat', 'color:#cc00cc;');
        _runtimeService.startHeartbeat();
        $('#splashscreen').remove();
        console.log('app ready');
    }

    var brease = new Brease();
    Utils.defineProperty(window, 'brease', brease);

    return brease;

});
