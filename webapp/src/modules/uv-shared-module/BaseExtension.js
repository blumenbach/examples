define(["require", "exports", "./BaseCommands", "../../BootstrapParams", "../../modules/uv-dialogues-module/ClickThroughDialogue", "./InformationArgs", "./InformationType", "../../modules/uv-dialogues-module/LoginDialogue", "./LoginWarningMessages", "../../modules/uv-shared-module/Metrics", "../../Params", "../../modules/uv-dialogues-module/RestrictedDialogue", "./Shell"], function (require, exports, BaseCommands, BootstrapParams, ClickThroughDialogue, InformationArgs, InformationType, LoginDialogue, LoginWarningMessages, Metrics, Params, RestrictedDialogue, Shell) {
    var BaseExtension = (function () {
        function BaseExtension(bootstrapper) {
            this.isCreated = false;
            this.isLoggedIn = false;
            this.shifted = false;
            this.tabbing = false;
            this.bootstrapper = bootstrapper;
            this.config = this.bootstrapper.config;
            this.jsonp = this.bootstrapper.params.jsonp;
            this.locale = this.bootstrapper.params.getLocaleName();
            this.isHomeDomain = this.bootstrapper.params.isHomeDomain;
            this.isReload = this.bootstrapper.params.isReload;
            this.embedDomain = this.bootstrapper.params.embedDomain;
            this.isOnlyInstance = this.bootstrapper.params.isOnlyInstance;
            this.embedScriptUri = this.bootstrapper.params.embedScriptUri;
            this.domain = this.bootstrapper.params.domain;
            this.isLightbox = this.bootstrapper.params.isLightbox;
        }
        BaseExtension.prototype.create = function (overrideDependencies) {
            var _this = this;
            var that = this;
            this.$element = $('#app');
            this.$element.data("bootstrapper", this.bootstrapper);
            // initial sizing.
            var $win = $(window);
            this.embedWidth = $win.width();
            this.embedHeight = $win.height();
            this.$element.width(this.embedWidth);
            this.$element.height(this.embedHeight);
            if (!this.isReload && Utils.Documents.isInIFrame()) {
                // communication with parent frame (if it exists).
                this.bootstrapper.socket = new easyXDM.Socket({
                    onMessage: function (message, origin) {
                        message = $.parseJSON(message);
                        _this.handleParentFrameEvent(message);
                    }
                });
            }
            this.triggerSocket(BaseCommands.LOAD, {
                bootstrapper: {
                    config: this.bootstrapper.config,
                    params: this.bootstrapper.params
                },
                settings: this.getSettings(),
                preview: this.getSharePreview()
            });
            // add/remove classes.
            this.$element.empty();
            this.$element.removeClass();
            this.$element.addClass('browser-' + window.browserDetect.browser);
            this.$element.addClass('browser-version-' + window.browserDetect.version);
            if (!this.isHomeDomain)
                this.$element.addClass('embedded');
            if (this.isLightbox)
                this.$element.addClass('lightbox');
            $(document).on('mousemove', function (e) {
                _this.mouseX = e.pageX;
                _this.mouseY = e.pageY;
            });
            // events
            if (!this.isReload) {
                window.onresize = function () {
                    var $win = $(window);
                    $('body').height($win.height());
                    _this.resize();
                };
                var visibilityProp = Utils.Documents.getHiddenProp();
                if (visibilityProp) {
                    var evtname = visibilityProp.replace(/[H|h]idden/, '') + 'visibilitychange';
                    document.addEventListener(evtname, function () {
                        // resize after a tab has been shown (fixes safari layout issue)
                        if (!Utils.Documents.isHidden()) {
                            _this.resize();
                        }
                    });
                }
                if (Utils.Bools.getBool(this.config.options.dropEnabled, true)) {
                    this.$element.on('drop', (function (e) {
                        e.preventDefault();
                        var dropUrl = e.originalEvent.dataTransfer.getData("URL");
                        var url = Utils.Urls.getUrlParts(dropUrl);
                        var manifestUri = Utils.Urls.getQuerystringParameterFromString('manifest', url.search);
                        //var canvasUri = Utils.Urls.getQuerystringParameterFromString('canvas', url.search);
                        if (manifestUri) {
                            _this.triggerSocket(BaseCommands.DROP, manifestUri);
                            var p = new BootstrapParams();
                            p.manifestUri = manifestUri;
                            _this.reload(p);
                        }
                    }));
                }
                this.$element.on('dragover', (function (e) {
                    // allow drop
                    e.preventDefault();
                }));
                // keyboard events.
                $(document).on('keyup keydown', function (e) {
                    _this.shifted = e.shiftKey;
                    _this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
                });
                $(document).keydown(function (e) {
                    var event = null;
                    var preventDefault = true;
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        if (e.keyCode === KeyCodes.KeyDown.Enter) {
                            event = BaseCommands.RETURN;
                            preventDefault = false;
                        }
                        if (e.keyCode === KeyCodes.KeyDown.Escape)
                            event = BaseCommands.ESCAPE;
                        if (e.keyCode === KeyCodes.KeyDown.PageUp)
                            event = BaseCommands.PAGE_UP;
                        if (e.keyCode === KeyCodes.KeyDown.PageDown)
                            event = BaseCommands.PAGE_DOWN;
                        if (e.keyCode === KeyCodes.KeyDown.End)
                            event = BaseCommands.END;
                        if (e.keyCode === KeyCodes.KeyDown.Home)
                            event = BaseCommands.HOME;
                        if (e.keyCode === KeyCodes.KeyDown.NumpadPlus || e.keyCode === 171 || e.keyCode === KeyCodes.KeyDown.Equals) {
                            event = BaseCommands.PLUS;
                            preventDefault = false;
                        }
                        if (e.keyCode === KeyCodes.KeyDown.NumpadMinus || e.keyCode === 173 || e.keyCode === KeyCodes.KeyDown.Dash) {
                            event = BaseCommands.MINUS;
                            preventDefault = false;
                        }
                        if (that.useArrowKeysToNavigate()) {
                            if (e.keyCode === KeyCodes.KeyDown.LeftArrow)
                                event = BaseCommands.LEFT_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.UpArrow)
                                event = BaseCommands.UP_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.RightArrow)
                                event = BaseCommands.RIGHT_ARROW;
                            if (e.keyCode === KeyCodes.KeyDown.DownArrow)
                                event = BaseCommands.DOWN_ARROW;
                        }
                    }
                    if (event) {
                        if (preventDefault) {
                            e.preventDefault();
                        }
                        $.publish(event);
                    }
                });
                if (this.bootstrapper.params.isHomeDomain && Utils.Documents.isInIFrame()) {
                    $.subscribe(BaseCommands.PARENT_EXIT_FULLSCREEN, function () {
                        if (_this.isOverlayActive()) {
                            $.publish(BaseCommands.ESCAPE);
                        }
                        $.publish(BaseCommands.ESCAPE);
                        $.publish(BaseCommands.RESIZE);
                    });
                }
            }
            this.$element.append('<a href="/" id="top"></a>');
            this.$element.append('<iframe id="commsFrame" style="display:none"></iframe>');
            $.subscribe(BaseCommands.ACCEPT_TERMS, function () {
                _this.triggerSocket(BaseCommands.ACCEPT_TERMS);
            });
            $.subscribe(BaseCommands.LOGIN_FAILED, function () {
                _this.triggerSocket(BaseCommands.LOGIN_FAILED);
                _this.showMessage(_this.config.content.authorisationFailedMessage);
            });
            $.subscribe(BaseCommands.LOGIN, function () {
                _this.isLoggedIn = true;
                _this.triggerSocket(BaseCommands.LOGIN);
            });
            $.subscribe(BaseCommands.LOGOUT, function () {
                _this.isLoggedIn = false;
                _this.triggerSocket(BaseCommands.LOGOUT);
            });
            $.subscribe(BaseCommands.BOOKMARK, function () {
                _this.bookmark();
                _this.triggerSocket(BaseCommands.BOOKMARK);
            });
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, function () {
                _this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
            });
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.triggerSocket(BaseCommands.CANVAS_INDEX_CHANGED, canvasIndex);
            });
            $.subscribe(BaseCommands.CLICKTHROUGH, function () {
                _this.triggerSocket(BaseCommands.CLICKTHROUGH);
            });
            $.subscribe(BaseCommands.CLOSE_ACTIVE_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
            });
            $.subscribe(BaseCommands.CLOSE_LEFT_PANEL, function () {
                _this.triggerSocket(BaseCommands.CLOSE_LEFT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseCommands.CLOSE_RIGHT_PANEL, function () {
                _this.triggerSocket(BaseCommands.CLOSE_RIGHT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseCommands.CREATED, function () {
                _this.isCreated = true;
                _this.triggerSocket(BaseCommands.CREATED);
            });
            $.subscribe(BaseCommands.DOWN_ARROW, function () {
                _this.triggerSocket(BaseCommands.DOWN_ARROW);
            });
            $.subscribe(BaseCommands.DOWNLOAD, function (e, obj) {
                _this.triggerSocket(BaseCommands.DOWNLOAD, obj);
            });
            $.subscribe(BaseCommands.END, function () {
                _this.triggerSocket(BaseCommands.END);
            });
            $.subscribe(BaseCommands.ESCAPE, function () {
                _this.triggerSocket(BaseCommands.ESCAPE);
                if (_this.isFullScreen() && !_this.isOverlayActive()) {
                    $.publish(BaseCommands.TOGGLE_FULLSCREEN);
                }
            });
            $.subscribe(BaseCommands.EXTERNAL_LINK_CLICKED, function (e, url) {
                _this.triggerSocket(BaseCommands.EXTERNAL_LINK_CLICKED, url);
            });
            $.subscribe(BaseCommands.FEEDBACK, function () {
                _this.feedback();
            });
            $.subscribe(BaseCommands.FORBIDDEN, function () {
                _this.triggerSocket(BaseCommands.FORBIDDEN);
                $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE);
            });
            $.subscribe(BaseCommands.HIDE_DOWNLOAD_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_EMBED_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_EMBED_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_GENERIC_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_GENERIC_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_HELP_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_HELP_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_INFORMATION, function () {
                _this.triggerSocket(BaseCommands.HIDE_INFORMATION);
            });
            $.subscribe(BaseCommands.HIDE_LOGIN_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_LOGIN_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_OVERLAY, function () {
                _this.triggerSocket(BaseCommands.HIDE_OVERLAY);
            });
            $.subscribe(BaseCommands.HIDE_RESTRICTED_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_RESTRICTED_DIALOGUE);
            });
            $.subscribe(BaseCommands.HIDE_SETTINGS_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.HIDE_SETTINGS_DIALOGUE);
            });
            $.subscribe(BaseCommands.HOME, function () {
                _this.triggerSocket(BaseCommands.HOME);
            });
            $.subscribe(BaseCommands.LEFT_ARROW, function () {
                _this.triggerSocket(BaseCommands.LEFT_ARROW);
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
                _this.triggerSocket(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, function () {
                _this.triggerSocket(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
            });
            $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH, function () {
                _this.triggerSocket(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
            });
            $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, function () {
                _this.triggerSocket(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
            });
            $.subscribe(BaseCommands.LOAD_FAILED, function () {
                _this.triggerSocket(BaseCommands.LOAD_FAILED);
                if (!_.isNull(that.lastCanvasIndex) && that.lastCanvasIndex !== that.helper.canvasIndex) {
                    _this.viewCanvas(that.lastCanvasIndex);
                }
            });
            $.subscribe(BaseCommands.NOT_FOUND, function () {
                _this.triggerSocket(BaseCommands.NOT_FOUND);
            });
            $.subscribe(BaseCommands.OPEN, function () {
                _this.triggerSocket(BaseCommands.OPEN);
                var openUri = String.format(_this.config.options.openTemplate, _this.helper.iiifResourceUri);
                window.open(openUri);
            });
            $.subscribe(BaseCommands.OPEN_LEFT_PANEL, function () {
                _this.triggerSocket(BaseCommands.OPEN_LEFT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, function () {
                _this.triggerSocket(BaseCommands.OPEN_EXTERNAL_RESOURCE);
            });
            $.subscribe(BaseCommands.OPEN_RIGHT_PANEL, function () {
                _this.triggerSocket(BaseCommands.OPEN_RIGHT_PANEL);
                _this.resize();
            });
            $.subscribe(BaseCommands.PAGE_DOWN, function () {
                _this.triggerSocket(BaseCommands.PAGE_DOWN);
            });
            $.subscribe(BaseCommands.PAGE_UP, function () {
                _this.triggerSocket(BaseCommands.PAGE_UP);
            });
            $.subscribe(BaseCommands.RESOURCE_DEGRADED, function (e, resource) {
                _this.triggerSocket(BaseCommands.RESOURCE_DEGRADED);
                _this.handleDegraded(resource);
            });
            $.subscribe(BaseCommands.RETURN, function () {
                _this.triggerSocket(BaseCommands.RETURN);
            });
            $.subscribe(BaseCommands.RIGHT_ARROW, function () {
                _this.triggerSocket(BaseCommands.RIGHT_ARROW);
            });
            $.subscribe(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_FINISH, function () {
                _this.triggerSocket(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_FINISH);
            });
            $.subscribe(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_START, function () {
                _this.triggerSocket(BaseCommands.RIGHTPANEL_COLLAPSE_FULL_START);
            });
            $.subscribe(BaseCommands.RIGHTPANEL_EXPAND_FULL_FINISH, function () {
                _this.triggerSocket(BaseCommands.RIGHTPANEL_EXPAND_FULL_FINISH);
            });
            $.subscribe(BaseCommands.RIGHTPANEL_EXPAND_FULL_START, function () {
                _this.triggerSocket(BaseCommands.RIGHTPANEL_EXPAND_FULL_START);
            });
            $.subscribe(BaseCommands.SEQUENCE_INDEX_CHANGED, function () {
                _this.triggerSocket(BaseCommands.SEQUENCE_INDEX_CHANGED);
            });
            $.subscribe(BaseCommands.SETTINGS_CHANGED, function (e, args) {
                _this.triggerSocket(BaseCommands.SETTINGS_CHANGED, args);
            });
            $.subscribe(BaseCommands.SHOW_DOWNLOAD_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_DOWNLOAD_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_EMBED_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_EMBED_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_GENERIC_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_GENERIC_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_HELP_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_HELP_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_INFORMATION, function () {
                _this.triggerSocket(BaseCommands.SHOW_INFORMATION);
            });
            $.subscribe(BaseCommands.SHOW_LOGIN_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_LOGIN_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_RESTRICTED_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_RESTRICTED_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_OVERLAY, function () {
                _this.triggerSocket(BaseCommands.SHOW_OVERLAY);
            });
            $.subscribe(BaseCommands.SHOW_SETTINGS_DIALOGUE, function () {
                _this.triggerSocket(BaseCommands.SHOW_SETTINGS_DIALOGUE);
            });
            $.subscribe(BaseCommands.SHOW_TERMS_OF_USE, function () {
                _this.triggerSocket(BaseCommands.SHOW_TERMS_OF_USE);
                // todo: Eventually this should be replaced with a suitable IIIF Presentation API field - until then, use attribution
                var terms = _this.helper.getAttribution();
                _this.showMessage(terms);
            });
            $.subscribe(BaseCommands.THUMB_SELECTED, function (e, thumb) {
                _this.triggerSocket(BaseCommands.THUMB_SELECTED, thumb.index);
            });
            $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, function () {
                $('#top').focus();
                _this.bootstrapper.isFullScreen = !_this.bootstrapper.isFullScreen;
                _this.triggerSocket(BaseCommands.TOGGLE_FULLSCREEN, {
                    isFullScreen: _this.bootstrapper.isFullScreen,
                    overrideFullScreen: _this.config.options.overrideFullScreen
                });
            });
            $.subscribe(BaseCommands.UP_ARROW, function () {
                _this.triggerSocket(BaseCommands.UP_ARROW);
            });
            $.subscribe(BaseCommands.UPDATE_SETTINGS, function () {
                _this.triggerSocket(BaseCommands.UPDATE_SETTINGS);
            });
            $.subscribe(BaseCommands.VIEW_FULL_TERMS, function () {
                _this.triggerSocket(BaseCommands.VIEW_FULL_TERMS);
            });
            $.subscribe(BaseCommands.WINDOW_UNLOAD, function () {
                _this.triggerSocket(BaseCommands.WINDOW_UNLOAD);
            });
            // create shell and shared views.
            this.shell = new Shell(this.$element);
            // dependencies
            if (overrideDependencies) {
                this.loadDependencies(overrideDependencies);
            }
            else {
                this.getDependencies(function (deps) {
                    _this.loadDependencies(deps);
                });
            }
        };
        BaseExtension.prototype.createModules = function () {
            this.$clickThroughDialogue = $('<div class="overlay clickthrough"></div>');
            Shell.$overlays.append(this.$clickThroughDialogue);
            this.clickThroughDialogue = new ClickThroughDialogue(this.$clickThroughDialogue);
            this.$restrictedDialogue = $('<div class="overlay login"></div>');
            Shell.$overlays.append(this.$restrictedDialogue);
            this.restrictedDialogue = new RestrictedDialogue(this.$restrictedDialogue);
            this.$loginDialogue = $('<div class="overlay login"></div>');
            Shell.$overlays.append(this.$loginDialogue);
            this.loginDialogue = new LoginDialogue(this.$loginDialogue);
        };
        BaseExtension.prototype.modulesCreated = function () {
        };
        BaseExtension.prototype.getDependencies = function (cb) {
            var that = this;
            // todo: use compiler flag (when available)
            var depsUri = (window.DEBUG) ? '../../extensions/' + this.name + '/dependencies' : this.name + '-dependencies';
            // check if the deps are already loaded
            var scripts = $('script[data-requiremodule]')
                .filter(function () {
                var attr = $(this).attr('data-requiremodule');
                return (attr.indexOf(that.name) != -1 && attr.indexOf('dependencies') != -1);
            });
            if (!scripts.length) {
                require([depsUri], function (deps) {
                    // if debugging, set the base uri to the extension's directory.
                    // otherwise set it to the current directory (where app.js is hosted).
                    // todo: use compiler flag (when available)
                    var baseUri = (window.DEBUG) ? '../../extensions/' + that.name + '/lib/' : '';
                    // for each dependency, prepend baseUri.
                    for (var i = 0; i < deps.dependencies.length; i++) {
                        deps.dependencies[i] = baseUri + deps.dependencies[i];
                    }
                    cb(deps);
                });
            }
            else {
                cb(null);
            }
        };
        BaseExtension.prototype.loadDependencies = function (deps) {
            var that = this;
            if (deps) {
                require(deps.dependencies, function () {
                    that.dependenciesLoaded();
                });
            }
            else {
                that.dependenciesLoaded();
            }
        };
        BaseExtension.prototype.dependenciesLoaded = function () {
            this.createModules();
            this.modulesCreated();
            $.publish(BaseCommands.RESIZE); // initial sizing
            $.publish(BaseCommands.CREATED);
            this.setParams();
            this.setDefaultFocus();
            this.viewCanvas(this.getCanvasIndexParam());
        };
        BaseExtension.prototype.setParams = function () {
            if (!this.isHomeDomain)
                return;
            this.setParam(Params.collectionIndex, this.helper.collectionIndex);
            this.setParam(Params.manifestIndex, this.helper.manifestIndex);
            this.setParam(Params.sequenceIndex, this.helper.sequenceIndex);
            this.setParam(Params.canvasIndex, this.helper.canvasIndex);
        };
        BaseExtension.prototype.setDefaultFocus = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.config.options.allowStealFocus) {
                    $('[tabindex=0]').focus();
                }
            }, 1);
        };
        BaseExtension.prototype.width = function () {
            return $(window).width();
        };
        BaseExtension.prototype.height = function () {
            return $(window).height();
        };
        BaseExtension.prototype.triggerSocket = function (eventName, eventObject) {
            jQuery(document).trigger(eventName, [eventObject]);
            if (this.bootstrapper.socket) {
                this.bootstrapper.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
            }
        };
        BaseExtension.prototype.redirect = function (uri) {
            this.triggerSocket(BaseCommands.REDIRECT, uri);
        };
        BaseExtension.prototype.refresh = function () {
            this.triggerSocket(BaseCommands.REFRESH, null);
        };
        BaseExtension.prototype._updateMetric = function () {
            var keys = Object.keys(Metrics);
            for (var i = 0; i < keys.length; i++) {
                var metric = Metrics[keys[i]];
                if (this.width() > metric.minWidth && this.width() <= metric.maxWidth) {
                    if (this.metric !== metric) {
                        this.metric = metric;
                        $.publish(BaseCommands.METRIC_CHANGED);
                    }
                }
            }
        };
        BaseExtension.prototype.resize = function () {
            this._updateMetric();
            $.publish(BaseCommands.RESIZE);
        };
        BaseExtension.prototype.handleParentFrameEvent = function (message) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this.isCreated;
            }, function () {
                switch (message.eventName) {
                    case BaseCommands.TOGGLE_FULLSCREEN:
                        $.publish(BaseCommands.TOGGLE_FULLSCREEN, message.eventObject);
                        break;
                    case BaseCommands.PARENT_EXIT_FULLSCREEN:
                        $.publish(BaseCommands.PARENT_EXIT_FULLSCREEN);
                        break;
                }
            });
        };
        // re-bootstraps the application with new querystring params
        BaseExtension.prototype.reload = function (params) {
            var p = new BootstrapParams();
            if (params) {
                p = $.extend(p, params);
            }
            p.isReload = true;
            $.disposePubSub();
            this.bootstrapper.bootstrap(p);
        };
        BaseExtension.prototype.getCanvasIndexParam = function () {
            return this.bootstrapper.params.getParam(Params.canvasIndex);
        };
        BaseExtension.prototype.getSequenceIndexParam = function () {
            return this.bootstrapper.params.getParam(Params.sequenceIndex);
        };
        BaseExtension.prototype.isSeeAlsoEnabled = function () {
            return this.config.options.seeAlsoEnabled !== false;
        };
        BaseExtension.prototype.getShareUrl = function () {
            // If embedded on the home domain and it's the only instance of the UV on the page
            if (this.isDeepLinkingEnabled()) {
                // Use the current page URL with hash params
                if (Utils.Documents.isInIFrame()) {
                    return parent.document.location.href;
                }
                else {
                    return document.location.href;
                }
            }
            else {
                // If there's a `related` property of format `text/html` in the manifest
                if (this.helper.hasRelatedPage()) {
                    // Use the `related` property in the URL box
                    var related = this.helper.getRelated();
                    if (related && related.length) {
                        related = related[0];
                    }
                    return related['@id'];
                }
            }
            return null;
        };
        BaseExtension.prototype.getIIIFShareUrl = function () {
            return this.helper.iiifResourceUri + "?manifest=" + this.helper.iiifResourceUri;
        };
        BaseExtension.prototype.addTimestamp = function (uri) {
            return uri + "?t=" + Utils.Dates.getTimeStamp();
        };
        BaseExtension.prototype.isDeepLinkingEnabled = function () {
            return (this.isHomeDomain && this.isOnlyInstance);
        };
        BaseExtension.prototype.isOnHomeDomain = function () {
            return this.isDeepLinkingEnabled();
        };
        BaseExtension.prototype.getDomain = function () {
            var parts = Utils.Urls.getUrlParts(this.helper.iiifResourceUri);
            return parts.host;
        };
        BaseExtension.prototype.getEmbedDomain = function () {
            return this.embedDomain;
        };
        BaseExtension.prototype.getSettings = function () {
            if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {
                var settings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
                if (settings) {
                    return $.extend(this.config.options, settings.value);
                }
            }
            return this.config.options;
        };
        BaseExtension.prototype.updateSettings = function (settings) {
            if (Utils.Bools.getBool(this.config.options.saveUserSettings, false)) {
                var storedSettings = Utils.Storage.get("uv.settings", Utils.StorageType.local);
                if (storedSettings) {
                    settings = $.extend(storedSettings.value, settings);
                }
                // store for ten years
                Utils.Storage.set("uv.settings", settings, 315360000, Utils.StorageType.local);
            }
            this.config.options = $.extend(this.config.options, settings);
        };
        BaseExtension.prototype.sanitize = function (html) {
            var elem = document.createElement('div');
            var $elem = $(elem);
            $elem.html(html);
            var s = new Sanitize({
                elements: ['a', 'b', 'br', 'img', 'p', 'i', 'span'],
                attributes: {
                    a: ['href'],
                    img: ['src', 'alt']
                },
                protocols: {
                    a: { href: ['http', 'https'] }
                }
            });
            $elem.html(s.clean_node(elem));
            return $elem.html();
        };
        BaseExtension.prototype.getLocales = function () {
            if (this.locales)
                return this.locales;
            // use data-locales to prioritise
            var items = this.config.localisation.locales.clone();
            var sorting = this.bootstrapper.params.locales;
            var result = [];
            // loop through sorting array
            // if items contains sort item, add it to results.
            // if sort item has a label, substitute it
            // mark item as added.
            // if limitLocales is disabled,
            // loop through remaining items and add to results.
            _.each(sorting, function (sortItem) {
                var match = _.filter(items, function (item) { return item.name === sortItem.name; });
                if (match.length) {
                    var m = match[0];
                    if (sortItem.label)
                        m.label = sortItem.label;
                    m.added = true;
                    result.push(m);
                }
            });
            var limitLocales = Utils.Bools.getBool(this.config.options.limitLocales, false);
            if (!limitLocales) {
                _.each(items, function (item) {
                    if (!item.added) {
                        result.push(item);
                    }
                    delete item.added;
                });
            }
            return this.locales = result;
        };
        BaseExtension.prototype.getAlternateLocale = function () {
            var locales = this.getLocales();
            var alternateLocale;
            for (var i = 0; i < locales.length; i++) {
                var l = locales[i];
                if (l.name !== this.locale) {
                    alternateLocale = l;
                }
            }
            return l;
        };
        BaseExtension.prototype.changeLocale = function (locale) {
            // if the current locale is "en-GB:English,cy-GB:Welsh"
            // and "cy-GB" is passed, it becomes "cy-GB:Welsh,en-GB:English"
            // re-order locales so the passed locale is first
            var locales = this.locales.clone();
            var index = locales.indexOfTest(function (l) {
                return l.name === locale;
            });
            locales.move(index, 0);
            // convert to comma-separated string
            var str = this.serializeLocales(locales);
            var p = new BootstrapParams();
            p.setLocale(str);
            this.reload(p);
        };
        BaseExtension.prototype.serializeLocales = function (locales) {
            var str = '';
            for (var i = 0; i < locales.length; i++) {
                var l = locales[i];
                if (i > 0)
                    str += ',';
                str += l.name;
                if (l.label) {
                    str += ':' + l.label;
                }
            }
            return str;
        };
        BaseExtension.prototype.getSerializedLocales = function () {
            return this.serializeLocales(this.locales);
        };
        BaseExtension.prototype.getSharePreview = function () {
            var preview = {};
            preview.title = this.helper.getLabel();
            // todo: use getThumb (when implemented)
            var canvas = this.helper.getCurrentCanvas();
            var thumbnail = canvas.getProperty('thumbnail');
            if (!thumbnail || !_.isString(thumbnail)) {
                thumbnail = canvas.getCanonicalImageUri(this.config.options.bookmarkThumbWidth);
            }
            preview.image = thumbnail;
            return preview;
        };
        BaseExtension.prototype.getPagedIndices = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.helper.canvasIndex;
            return [canvasIndex];
        };
        BaseExtension.prototype.getCurrentCanvases = function () {
            var indices = this.getPagedIndices(this.helper.canvasIndex);
            var canvases = [];
            for (var i = 0; i < indices.length; i++) {
                var index = indices[i];
                var canvas = this.helper.getCanvasByIndex(index);
                canvases.push(canvas);
            }
            return canvases;
        };
        BaseExtension.prototype.getCanvasLabels = function (label) {
            var indices = this.getPagedIndices();
            var labels = "";
            if (indices.length === 1) {
                labels = label;
            }
            else {
                for (var i = 1; i <= indices.length; i++) {
                    if (labels.length)
                        labels += ",";
                    labels += label + " " + i;
                }
            }
            return labels;
        };
        BaseExtension.prototype.getCurrentCanvasRange = function () {
            //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
            //var range: Manifesto.IRange = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
            var range = this.helper.getCanvasRange(this.helper.getCurrentCanvas());
            return range;
        };
        BaseExtension.prototype.getExternalResources = function (resources) {
            var _this = this;
            var indices = this.getPagedIndices();
            var resourcesToLoad = [];
            _.each(indices, function (index) {
                var canvas = _this.helper.getCanvasByIndex(index);
                var r = new Manifold.ExternalResource(canvas, _this.helper.getInfoUri);
                r.index = index;
                // used to reload resources with isResponseHandled = true.
                if (resources) {
                    var found = _.find(resources, function (f) {
                        return f.dataUri === r.dataUri;
                    });
                    if (found) {
                        resourcesToLoad.push(found);
                    }
                    else {
                        resourcesToLoad.push(r);
                    }
                }
                else {
                    resourcesToLoad.push(r);
                }
            });
            var storageStrategy = this.config.options.tokenStorage;
            return new Promise(function (resolve) {
                manifesto.Utils.loadExternalResources(resourcesToLoad, storageStrategy, _this.clickThrough, _this.restricted, _this.login, _this.getAccessToken, _this.storeAccessToken, _this.getStoredAccessToken, _this.handleExternalResourceResponse).then(function (r) {
                    _this.resources = _.map(r, function (resource) {
                        resource.data.index = resource.index;
                        return _.toPlainObject(resource.data);
                    });
                    resolve(_this.resources);
                })['catch'](function (error) {
                    switch (error.name) {
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseCommands.LOGIN_FAILED);
                            break;
                        case manifesto.StatusCodes.FORBIDDEN.toString():
                            $.publish(BaseCommands.FORBIDDEN);
                            break;
                        case manifesto.StatusCodes.RESTRICTED.toString():
                            // do nothing
                            break;
                        default:
                            _this.showMessage(error.message || error);
                    }
                });
            });
        };
        // get hash or data-attribute params depending on whether the UV is embedded.
        BaseExtension.prototype.getParam = function (key) {
            var value;
            // deep linking is only allowed when hosted on home domain.
            if (this.isDeepLinkingEnabled()) {
                // todo: use a static type on bootstrapper.params
                value = Utils.Urls.getHashParameter(this.bootstrapper.params.paramMap[key], parent.document);
            }
            if (!value) {
                // todo: use a static type on bootstrapper.params
                value = Utils.Urls.getQuerystringParameter(this.bootstrapper.params.paramMap[key]);
            }
            return value;
        };
        // set hash params depending on whether the UV is embedded.
        BaseExtension.prototype.setParam = function (key, value) {
            if (this.isDeepLinkingEnabled()) {
                Utils.Urls.setHashParameter(this.bootstrapper.params.paramMap[key], value, parent.document);
            }
        };
        BaseExtension.prototype.viewCanvas = function (canvasIndex) {
            if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
                this.showMessage(this.config.content.canvasIndexOutOfRange);
                canvasIndex = 0;
            }
            this.lastCanvasIndex = this.helper.canvasIndex;
            this.helper.canvasIndex = canvasIndex;
            $.publish(BaseCommands.CANVAS_INDEX_CHANGED, [canvasIndex]);
            $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE);
            this.setParam(Params.canvasIndex, canvasIndex);
        };
        BaseExtension.prototype.showMessage = function (message, acceptCallback, buttonText, allowClose) {
            this.closeActiveDialogue();
            $.publish(BaseCommands.SHOW_GENERIC_DIALOGUE, [
                {
                    message: message,
                    acceptCallback: acceptCallback,
                    buttonText: buttonText,
                    allowClose: allowClose
                }]);
        };
        BaseExtension.prototype.closeActiveDialogue = function () {
            $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
        };
        BaseExtension.prototype.isOverlayActive = function () {
            return Shell.$overlays.is(':visible');
        };
        BaseExtension.prototype.viewManifest = function (manifest) {
            var p = new BootstrapParams();
            p.manifestUri = this.helper.iiifResourceUri;
            p.collectionIndex = this.helper.getCollectionIndex(manifest);
            p.manifestIndex = manifest.index;
            p.sequenceIndex = 0;
            p.canvasIndex = 0;
            this.reload(p);
        };
        BaseExtension.prototype.viewCollection = function (collection) {
            var p = new BootstrapParams();
            p.manifestUri = this.helper.iiifResourceUri;
            p.collectionIndex = collection.index;
            p.manifestIndex = 0;
            p.sequenceIndex = 0;
            p.canvasIndex = 0;
            this.reload(p);
        };
        BaseExtension.prototype.isFullScreen = function () {
            return this.bootstrapper.isFullScreen;
        };
        BaseExtension.prototype.isHeaderPanelEnabled = function () {
            return Utils.Bools.getBool(this.config.options.headerPanelEnabled, true);
        };
        BaseExtension.prototype.isLeftPanelEnabled = function () {
            if (Utils.Bools.getBool(this.config.options.leftPanelEnabled, true)) {
                if (this.helper.hasParentCollection()) {
                    return true;
                }
                else if (this.helper.isMultiCanvas()) {
                    if (this.helper.getViewingHint().toString() !== manifesto.ViewingHint.continuous().toString()) {
                        return true;
                    }
                }
            }
            return false;
        };
        BaseExtension.prototype.isRightPanelEnabled = function () {
            return Utils.Bools.getBool(this.config.options.rightPanelEnabled, true);
        };
        BaseExtension.prototype.isFooterPanelEnabled = function () {
            return Utils.Bools.getBool(this.config.options.footerPanelEnabled, true);
        };
        BaseExtension.prototype.useArrowKeysToNavigate = function () {
            return Utils.Bools.getBool(this.config.options.useArrowKeysToNavigate, true);
        };
        BaseExtension.prototype.bookmark = function () {
            // override for each extension
        };
        BaseExtension.prototype.feedback = function () {
            this.triggerSocket(BaseCommands.FEEDBACK, new BootstrapParams());
        };
        BaseExtension.prototype.getBookmarkUri = function () {
            var absUri = parent.document.URL;
            var parts = Utils.Urls.getUrlParts(absUri);
            var relUri = parts.pathname + parts.search + parent.document.location.hash;
            if (!relUri.startsWith("/")) {
                relUri = "/" + relUri;
            }
            return relUri;
        };
        // auth
        BaseExtension.prototype.clickThrough = function (resource) {
            return new Promise(function (resolve) {
                $.publish(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, [{
                        resource: resource,
                        acceptCallback: function () {
                            var win = window.open(resource.clickThroughService.id);
                            var pollTimer = window.setInterval(function () {
                                if (win.closed) {
                                    window.clearInterval(pollTimer);
                                    $.publish(BaseCommands.CLICKTHROUGH);
                                    resolve();
                                }
                            }, 500);
                        }
                    }]);
            });
        };
        BaseExtension.prototype.restricted = function (resource) {
            return new Promise(function (resolve, reject) {
                $.publish(BaseCommands.SHOW_RESTRICTED_DIALOGUE, [{
                        resource: resource,
                        acceptCallback: function () {
                            $.publish(BaseCommands.LOAD_FAILED);
                            reject(resource);
                        }
                    }]);
            });
        };
        BaseExtension.prototype.login = function (resource) {
            return new Promise(function (resolve) {
                var options = {};
                if (resource.status === HTTPStatusCode.FORBIDDEN) {
                    options.warningMessage = LoginWarningMessages.FORBIDDEN;
                    options.showCancelButton = true;
                }
                $.publish(BaseCommands.SHOW_LOGIN_DIALOGUE, [{
                        resource: resource,
                        loginCallback: function () {
                            var win = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                            var pollTimer = window.setInterval(function () {
                                if (win.closed) {
                                    window.clearInterval(pollTimer);
                                    $.publish(BaseCommands.LOGIN);
                                    resolve();
                                }
                            }, 500);
                        },
                        logoutCallback: function () {
                            var win = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                            var pollTimer = window.setInterval(function () {
                                if (win.closed) {
                                    window.clearInterval(pollTimer);
                                    $.publish(BaseCommands.LOGOUT);
                                    resolve();
                                }
                            }, 500);
                        },
                        options: options
                    }]);
            });
        };
        BaseExtension.prototype.getAccessToken = function (resource, rejectOnError) {
            return new Promise(function (resolve, reject) {
                var serviceUri = resource.tokenService.id;
                // pick an identifier for this message. We might want to keep track of sent messages
                var msgId = serviceUri + "|" + new Date().getTime();
                var receiveAccessToken = function (e) {
                    window.removeEventListener("message", receiveAccessToken);
                    var token = e.data;
                    if (token.error) {
                        if (rejectOnError) {
                            reject(token.errorDescription);
                        }
                        else {
                            resolve(null);
                        }
                    }
                    else {
                        resolve(token);
                    }
                };
                window.addEventListener("message", receiveAccessToken, false);
                var tokenUri = serviceUri + "?messageId=" + msgId;
                $('#commsFrame').prop('src', tokenUri);
            });
            // deprecated JSONP method - keep this around for reference
            //return new Promise<Manifesto.IAccessToken>((resolve, reject) => {
            //    $.getJSON(resource.tokenService.id + "?callback=?", (token: Manifesto.IAccessToken) => {
            //        if (token.error){
            //            if(rejectOnError) {
            //                reject(token.errorDescription);
            //            } else {
            //                resolve(null);
            //            }
            //        } else {
            //            resolve(token);
            //        }
            //    }).fail((error) => {
            //        if(rejectOnError) {
            //            reject(error);
            //        } else {
            //            resolve(null);
            //        }
            //    });
            //});
        };
        BaseExtension.prototype.storeAccessToken = function (resource, token, storageStrategy) {
            return new Promise(function (resolve, reject) {
                Utils.Storage.set(resource.tokenService.id, token, token.expiresIn, new Utils.StorageType(storageStrategy));
                resolve();
            });
        };
        BaseExtension.prototype.getStoredAccessToken = function (resource, storageStrategy) {
            return new Promise(function (resolve, reject) {
                var foundItems = [];
                var item;
                // try to match on the tokenService, if the resource has one:
                if (resource.tokenService) {
                    item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
                }
                if (item) {
                    foundItems.push(item);
                }
                else {
                    // find an access token for the domain
                    var domain = Utils.Urls.getUrlParts(resource.dataUri).hostname;
                    var items = Utils.Storage.getItems(new Utils.StorageType(storageStrategy));
                    for (var i = 0; i < items.length; i++) {
                        item = items[i];
                        if (item.key.contains(domain)) {
                            foundItems.push(item);
                        }
                    }
                }
                // sort by expiresAt
                foundItems = _.sortBy(foundItems, function (item) {
                    return item.expiresAt;
                });
                var foundToken;
                if (foundItems.length) {
                    foundToken = foundItems.last().value;
                }
                resolve(foundToken);
            });
        };
        BaseExtension.prototype.handleExternalResourceResponse = function (resource) {
            return new Promise(function (resolve, reject) {
                resource.isResponseHandled = true;
                if (resource.status === HTTPStatusCode.OK) {
                    resolve(resource);
                }
                else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                    resolve(resource);
                    $.publish(BaseCommands.RESOURCE_DEGRADED, [resource]);
                }
                else {
                    if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                        resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                        // if the browser doesn't support CORS
                        if (!Modernizr.cors) {
                            var informationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
                            $.publish(BaseCommands.SHOW_INFORMATION, [informationArgs]);
                            resolve(resource);
                        }
                        else {
                            reject(resource.error.statusText);
                        }
                    }
                    else if (resource.error.status === HTTPStatusCode.FORBIDDEN) {
                        var error = new Error();
                        error.message = "Forbidden";
                        error.name = manifesto.StatusCodes.FORBIDDEN.toString();
                        reject(error);
                    }
                    else {
                        reject(resource.error.statusText);
                    }
                }
            });
        };
        BaseExtension.prototype.handleDegraded = function (resource) {
            var informationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
            $.publish(BaseCommands.SHOW_INFORMATION, [informationArgs]);
        };
        return BaseExtension;
    })();
    return BaseExtension;
});
//# sourceMappingURL=BaseExtension.js.map