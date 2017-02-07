var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../../extensions/uv-mediaelement-extension/Commands", "../uv-shared-module/CenterPanel"], function (require, exports, BaseCommands, Commands, CenterPanel) {
    var MediaElementCenterPanel = (function (_super) {
        __extends(MediaElementCenterPanel, _super);
        function MediaElementCenterPanel($element) {
            _super.call(this, $element);
        }
        MediaElementCenterPanel.prototype.create = function () {
            this.setConfig('mediaelementCenterPanel');
            _super.prototype.create.call(this);
            var that = this;
            // events.
            // only full screen video
            if (this.extension.isVideo()) {
                $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, function (e) {
                    if (that.bootstrapper.isFullScreen) {
                        that.$container.css('backgroundColor', '#000');
                        that.player.enterFullScreen(false);
                    }
                    else {
                        that.$container.css('backgroundColor', 'transparent');
                        that.player.exitFullScreen(false);
                    }
                });
            }
            $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                that.openMedia(resources);
            });
            this.$container = $('<div class="container"></div>');
            this.$content.append(this.$container);
            this.title = this.extension.helper.getLabel();
        };
        MediaElementCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            var that = this;
            this.extension.getExternalResources(resources).then(function () {
                _this.$container.empty();
                var canvas = _this.extension.helper.getCurrentCanvas();
                _this.mediaHeight = _this.config.defaultHeight;
                _this.mediaWidth = _this.config.defaultWidth;
                _this.$container.height(_this.mediaHeight);
                _this.$container.width(_this.mediaWidth);
                var id = Utils.Dates.getTimeStamp();
                var poster = _this.extension.getPosterImageUri();
                var posterAttr = poster ? ' poster="' + poster + '"' : '';
                var sources = [];
                _.each(canvas.getRenderings(), function (rendering) {
                    sources.push({
                        type: rendering.getFormat().toString(),
                        src: rendering.id
                    });
                });
                if (_this.extension.isVideo()) {
                    _this.media = _this.$container.append('<video id="' + id + '" type="video/mp4" class="mejs-uv" controls="controls" preload="none"' + posterAttr + '></video>');
                    _this.player = new MediaElementPlayer("#" + id, {
                        type: ['video/mp4', 'video/webm', 'video/flv'],
                        plugins: ['flash'],
                        alwaysShowControls: false,
                        autosizeProgress: false,
                        success: function (media) {
                            media.addEventListener('canplay', function (e) {
                                that.resize();
                            });
                            media.addEventListener('play', function (e) {
                                $.publish(Commands.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                            });
                            media.addEventListener('pause', function (e) {
                                // mediaelement creates a pause event before the ended event. ignore this.
                                if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                    $.publish(Commands.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                                }
                            });
                            media.addEventListener('ended', function (e) {
                                $.publish(Commands.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                            });
                            media.setSrc(sources);
                            try {
                                media.load();
                            }
                            catch (e) {
                            }
                        }
                    });
                }
                else {
                    // Try to find an MP3, since this is most likely to work:
                    var preferredSource = 0;
                    for (var i in sources) {
                        if (sources[i].type === "audio/mp3") {
                            preferredSource = i;
                            break;
                        }
                    }
                    _this.media = _this.$container.append('<audio id="' + id + '" type="' + sources[preferredSource].type + '" src="' + sources[preferredSource].src + '" class="mejs-uv" controls="controls" preload="none"' + posterAttr + '></audio>');
                    _this.player = new MediaElementPlayer("#" + id, {
                        plugins: ['flash'],
                        alwaysShowControls: false,
                        autosizeProgress: false,
                        defaultVideoWidth: that.mediaWidth,
                        defaultVideoHeight: that.mediaHeight,
                        success: function (media) {
                            media.addEventListener('canplay', function (e) {
                                that.resize();
                            });
                            media.addEventListener('play', function (e) {
                                $.publish(Commands.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                            });
                            media.addEventListener('pause', function (e) {
                                // mediaelement creates a pause event before the ended event. ignore this.
                                if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                    $.publish(Commands.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                                }
                            });
                            media.addEventListener('ended', function (e) {
                                $.publish(Commands.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                            });
                            //media.setSrc(sources);
                            try {
                                media.load();
                            }
                            catch (e) {
                            }
                        }
                    });
                }
                _this.resize();
            });
        };
        MediaElementCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            // if in Firefox < v13 don't resize the media container.
            if (window.browserDetect.browser === 'Firefox' && window.browserDetect.version < 13) {
                this.$container.width(this.mediaWidth);
                this.$container.height(this.mediaHeight);
            }
            else {
                // fit media to available space.
                var size = Utils.Measurements.Dimensions.fitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());
                this.$container.height(size.height);
                this.$container.width(size.width);
            }
            if (this.player && !this.extension.isFullScreen()) {
                this.player.resize();
            }
            var left = Math.floor((this.$content.width() - this.$container.width()) / 2);
            var top = Math.floor((this.$content.height() - this.$container.height()) / 2);
            this.$container.css({
                'left': left,
                'top': top
            });
            this.$title.ellipsisFill(this.title);
        };
        return MediaElementCenterPanel;
    })(CenterPanel);
    return MediaElementCenterPanel;
});
//# sourceMappingURL=MediaElementCenterPanel.js.map