define(["require", "exports", "./modules/uv-shared-module/BaseCommands", "./BootstrapParams"], function (require, exports, BaseCommands, BootstrapParams) {
    // The Bootstrapper is concerned with loading the manifest/collection (iiifResource)
    // then determining which extension to use and instantiating it.
    var Bootstrapper = (function () {
        function Bootstrapper(extensions) {
            this.isFullScreen = false;
            this.extensions = extensions;
        }
        Bootstrapper.prototype.bootstrap = function (params) {
            var _this = this;
            this.params = new BootstrapParams();
            // merge new params
            if (params) {
                this.params = $.extend(true, this.params, params);
            }
            if (!this.params.manifestUri)
                return;
            // empty app div
            $('#app').empty();
            // add loading class
            $('#app').addClass('loading');
            // remove any existing css
            $('link[type*="text/css"]').remove();
            jQuery.support.cors = true;
            Manifold.loadManifest({
                iiifResourceUri: this.params.manifestUri,
                collectionIndex: this.params.collectionIndex,
                manifestIndex: this.params.manifestIndex,
                sequenceIndex: this.params.sequenceIndex,
                canvasIndex: this.params.canvasIndex,
                locale: this.params.localeName
            }).then(function (helper) {
                var trackingLabel = helper.getTrackingLabel();
                trackingLabel += ', URI: ' + _this.params.embedDomain;
                window.trackingLabel = trackingLabel;
                var sequence = helper.getSequenceByIndex(_this.params.sequenceIndex);
                if (!sequence) {
                    _this.notFound();
                    return;
                }
                var canvas = helper.getCanvasByIndex(_this.params.canvasIndex);
                if (!canvas) {
                    _this.notFound();
                    return;
                }
                var canvasType = canvas.getType();
                // try using canvasType
                var extension = _this.extensions[canvasType.toString()];
                // if there isn't an extension for the canvasType, try the format
                if (!extension) {
                    var format = canvas.getProperty('format');
                    extension = _this.extensions[format];
                }
                // if there still isn't a matching extension, show an error.
                if (!extension) {
                    alert("No matching UV extension found.");
                    return;
                }
                extension.helper = helper;
                _this.featureDetect(function () {
                    _this.configure(extension, function (config) {
                        _this.injectCss(extension, config, function () {
                            _this.createExtension(extension, config);
                        });
                    });
                });
            }).catch(function () {
                this.notFound();
            });
        };
        Bootstrapper.prototype.isCORSEnabled = function () {
            // No jsonp setting? Then use autodetection. Otherwise, use explicit setting.
            return (null === this.params.jsonp) ? Modernizr.cors : !this.params.jsonp;
        };
        Bootstrapper.prototype.notFound = function () {
            try {
                parent.$(parent.document).trigger(BaseCommands.NOT_FOUND);
                return;
            }
            catch (e) { }
        };
        Bootstrapper.prototype.featureDetect = function (cb) {
            yepnope({
                test: window.btoa && window.atob,
                nope: 'lib/base64.min.js',
                complete: function () {
                    cb();
                }
            });
        };
        Bootstrapper.prototype.configure = function (extension, cb) {
            var _this = this;
            var that = this;
            this.getConfigExtension(extension, function (configExtension) {
                // todo: use a compiler flag when available
                var configPath = (window.DEBUG) ? 'extensions/' + extension.name + '/build/' + that.params.getLocaleName() + '.config.json' : 'lib/' + extension.name + '.' + that.params.getLocaleName() + '.config.json';
                $.getJSON(configPath, function (config) {
                    _this.extendConfig(extension, config, configExtension, cb);
                });
            });
        };
        Bootstrapper.prototype.extendConfig = function (extension, config, configExtension, cb) {
            config.name = extension.name;
            // if data-config has been set, extend the existing config object.
            if (configExtension) {
                // save a reference to the config extension uri.
                config.uri = this.params.config;
                $.extend(true, config, configExtension);
            }
            cb(config);
        };
        Bootstrapper.prototype.getConfigExtension = function (extension, cb) {
            var sessionConfig = sessionStorage.getItem(extension.name + '.' + this.params.localeName);
            if (sessionConfig) {
                cb(JSON.parse(sessionConfig));
            }
            else if (this.params.config) {
                if (this.isCORSEnabled()) {
                    $.getJSON(this.params.config, function (configExtension) {
                        cb(configExtension);
                    });
                }
                else {
                    // use jsonp
                    var settings = {
                        url: this.params.config,
                        type: 'GET',
                        dataType: 'jsonp',
                        jsonp: 'callback',
                        jsonpCallback: 'configExtensionCallback'
                    };
                    $.ajax(settings);
                    window.configExtensionCallback = function (configExtension) {
                        cb(configExtension);
                    };
                }
            }
            else {
                cb(null);
            }
        };
        Bootstrapper.prototype.injectCss = function (extension, config, cb) {
            // todo: use a compiler flag when available
            var cssPath = (window.DEBUG) ? 'extensions/' + extension.name + '/build/' + config.options.theme + '.css' : 'themes/' + config.options.theme + '/css/' + extension.name + '/theme.css';
            yepnope.injectCss(cssPath, function () {
                cb();
            });
        };
        Bootstrapper.prototype.createExtension = function (extension, config) {
            this.config = config;
            var helper = extension.helper;
            this.extension = new extension.type(this);
            this.extension.helper = helper;
            this.extension.name = extension.name;
            this.extension.create();
        };
        return Bootstrapper;
    })();
    return Bootstrapper;
});
//# sourceMappingURL=Bootstrapper.js.map