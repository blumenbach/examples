var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseCommands", "./BaseView", "./Metrics"], function (require, exports, BaseCommands, BaseView, Metrics) {
    var FooterPanel = (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            _super.call(this, $element);
        }
        FooterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('footerPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, function () {
                _this.updateFullScreenButton();
            });
            $.subscribe(BaseCommands.METRIC_CHANGED, function () {
                _this.updateMinimisedButtons();
                _this.updateMoreInfoButton();
            });
            $.subscribe(BaseCommands.SETTINGS_CHANGED, function () {
                _this.updateDownloadButton();
            });
            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);
            this.$feedbackButton = $('<a class="feedback" title="' + this.content.feedback + '" tabindex="0">' + this.content.feedback + '</a>');
            this.$options.prepend(this.$feedbackButton);
            this.$openButton = $('<a class="open" title="' + this.content.open + '" tabindex="0">' + this.content.open + '</a>');
            this.$options.prepend(this.$openButton);
            this.$bookmarkButton = $('<a class="bookmark" title="' + this.content.bookmark + '" tabindex="0">' + this.content.bookmark + '</a>');
            this.$options.prepend(this.$bookmarkButton);
            this.$shareButton = $('<a href="#" class="share" title="' + this.content.share + '" tabindex="0">' + this.content.share + '</a>');
            this.$options.append(this.$shareButton);
            this.$embedButton = $('<a href="#" class="embed" title="' + this.content.embed + '" tabindex="0">' + this.content.embed + '</a>');
            this.$options.append(this.$embedButton);
            this.$downloadButton = $('<a class="download" title="' + this.content.download + '" tabindex="0">' + this.content.download + '</a>');
            this.$options.prepend(this.$downloadButton);
            this.$moreInfoButton = $('<a href="#" class="moreInfo" title="' + this.content.moreInfo + '" tabindex="0">' + this.content.moreInfo + '</a>');
            this.$options.prepend(this.$moreInfoButton);
            this.$fullScreenBtn = $('<a href="#" class="fullScreen" title="' + this.content.fullScreen + '" tabindex="0">' + this.content.fullScreen + '</a>');
            this.$options.append(this.$fullScreenBtn);
            this.$openButton.onPressed(function () {
                $.publish(BaseCommands.OPEN);
            });
            this.$feedbackButton.onPressed(function () {
                $.publish(BaseCommands.FEEDBACK);
            });
            this.$bookmarkButton.onPressed(function () {
                $.publish(BaseCommands.BOOKMARK);
            });
            this.$shareButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_SHARE_DIALOGUE, [_this.$shareButton]);
            });
            this.$embedButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_EMBED_DIALOGUE, [_this.$embedButton]);
            });
            this.$downloadButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_DOWNLOAD_DIALOGUE, [_this.$downloadButton]);
            });
            this.$moreInfoButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_MOREINFO_DIALOGUE, [_this.$moreInfoButton]);
            });
            this.$fullScreenBtn.on('click', function (e) {
                e.preventDefault();
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            });
            if (!Utils.Bools.getBool(this.options.embedEnabled, true)) {
                this.$embedButton.hide();
            }
            this.updateMoreInfoButton();
            this.updateOpenButton();
            this.updateFeedbackButton();
            this.updateBookmarkButton();
            this.updateEmbedButton();
            this.updateDownloadButton();
            this.updateFullScreenButton();
            this.updateShareButton();
            this.updateMinimisedButtons();
        };
        FooterPanel.prototype.updateMinimisedButtons = function () {
            // if configured to always minimise buttons
            if (Utils.Bools.getBool(this.options.minimiseButtons, false)) {
                this.$options.addClass('minimiseButtons');
                return;
            }
            // otherwise, check metric
            if (this.extension.metric === Metrics.MOBILE_LANDSCAPE) {
                this.$options.addClass('minimiseButtons');
            }
            else {
                this.$options.removeClass('minimiseButtons');
            }
        };
        FooterPanel.prototype.updateMoreInfoButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.moreInfoEnabled, false);
            if (configEnabled && this.extension.metric === Metrics.MOBILE_LANDSCAPE) {
                this.$moreInfoButton.show();
            }
            else {
                this.$moreInfoButton.hide();
            }
        };
        FooterPanel.prototype.updateOpenButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.openEnabled, false);
            if (configEnabled && !this.extension.isHomeDomain) {
                this.$openButton.show();
            }
            else {
                this.$openButton.hide();
            }
        };
        FooterPanel.prototype.updateFullScreenButton = function () {
            if (!Utils.Bools.getBool(this.options.fullscreenEnabled, true)) {
                this.$fullScreenBtn.hide();
            }
            if (this.extension.isLightbox) {
                this.$fullScreenBtn.addClass('lightbox');
            }
            if (this.extension.isFullScreen()) {
                this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
                this.$fullScreenBtn.text(this.content.exitFullScreen);
                this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
            }
            else {
                this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
                this.$fullScreenBtn.text(this.content.fullScreen);
                this.$fullScreenBtn.attr('title', this.content.fullScreen);
            }
        };
        FooterPanel.prototype.updateEmbedButton = function () {
            if (this.extension.helper.isUIEnabled('embed') && Utils.Bools.getBool(this.options.embedEnabled, false)) {
                //current jquery version sets display to 'inline' in mobile version, while this should remain hidden (see media query)
                if (!$.browser.mobile) {
                    this.$embedButton.show();
                }
            }
            else {
                this.$embedButton.hide();
            }
        };
        FooterPanel.prototype.updateShareButton = function () {
            if (this.extension.helper.isUIEnabled('share') && Utils.Bools.getBool(this.options.shareEnabled, true)) {
                this.$shareButton.show();
            }
            else {
                this.$shareButton.hide();
            }
        };
        FooterPanel.prototype.updateDownloadButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.downloadEnabled, true);
            if (configEnabled) {
                this.$downloadButton.show();
            }
            else {
                this.$downloadButton.hide();
            }
        };
        FooterPanel.prototype.updateFeedbackButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.feedbackEnabled, false);
            if (configEnabled) {
                this.$feedbackButton.show();
            }
            else {
                this.$feedbackButton.hide();
            }
        };
        FooterPanel.prototype.updateBookmarkButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.bookmarkEnabled, false);
            if (configEnabled) {
                this.$bookmarkButton.show();
            }
            else {
                this.$bookmarkButton.hide();
            }
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return FooterPanel;
    })(BaseView);
    return FooterPanel;
});
//# sourceMappingURL=FooterPanel.js.map