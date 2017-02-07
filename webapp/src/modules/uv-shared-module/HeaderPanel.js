var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseCommands", "./BaseView", "../uv-shared-module/InformationFactory"], function (require, exports, BaseCommands, BaseView, InformationFactory) {
    var HeaderPanel = (function (_super) {
        __extends(HeaderPanel, _super);
        function HeaderPanel($element) {
            _super.call(this, $element, false, false);
        }
        HeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('headerPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.SHOW_INFORMATION, function (e, args) {
                _this.showInformation(args);
            });
            $.subscribe(BaseCommands.HIDE_INFORMATION, function () {
                _this.hideInformation();
            });
            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);
            this.$centerOptions = $('<div class="centerOptions"></div>');
            this.$options.append(this.$centerOptions);
            this.$rightOptions = $('<div class="rightOptions"></div>');
            this.$options.append(this.$rightOptions);
            //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
            //this.$rightOptions.append(this.$helpButton);
            this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
            this.$rightOptions.append(this.$localeToggleButton);
            this.$settingsButton = $('<a class="imageBtn settings" tabindex="0"></a>');
            this.$settingsButton.attr('title', this.content.settings);
            this.$rightOptions.append(this.$settingsButton);
            this.$informationBox = $('<div class="informationBox"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <div class="close"></div> \
                                  </div>');
            this.$element.append(this.$informationBox);
            this.$informationBox.hide();
            this.$informationBox.find('.close').attr('title', this.content.close);
            this.$informationBox.find('.close').on('click', function (e) {
                e.preventDefault();
                $.publish(BaseCommands.HIDE_INFORMATION);
            });
            this.$localeToggleButton.on('click', function () {
                _this.extension.changeLocale(String(_this.$localeToggleButton.data('locale')));
            });
            this.$settingsButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
            });
            this.updateLocaleToggle();
            this.updateSettingsButton();
        };
        HeaderPanel.prototype.updateLocaleToggle = function () {
            if (!this.localeToggleIsVisible()) {
                this.$localeToggleButton.hide();
                return;
            }
            var alternateLocale = this.extension.getAlternateLocale();
            var text = alternateLocale.name.split('-')[0].toUpperCase();
            this.$localeToggleButton.data('locale', alternateLocale.name);
            this.$localeToggleButton.attr('title', alternateLocale.label);
            this.$localeToggleButton.text(text);
        };
        HeaderPanel.prototype.updateSettingsButton = function () {
            var settingsEnabled = Utils.Bools.getBool(this.options.settingsButtonEnabled, true);
            if (!settingsEnabled) {
                this.$settingsButton.hide();
            }
            else {
                this.$settingsButton.show();
            }
        };
        HeaderPanel.prototype.localeToggleIsVisible = function () {
            return this.extension.getLocales().length > 1 && Utils.Bools.getBool(this.options.localeToggleEnabled, false);
        };
        HeaderPanel.prototype.showInformation = function (args) {
            var informationFactory = new InformationFactory(this.extension);
            this.information = informationFactory.Get(args);
            var $message = this.$informationBox.find('.message');
            $message.html(this.information.message).find('a').attr('target', '_top');
            var $actions = this.$informationBox.find('.actions');
            $actions.empty();
            for (var i = 0; i < this.information.actions.length; i++) {
                var action = this.information.actions[i];
                var $action = $('<a href="#" class="btn btn-default">' + action.label + '</a>');
                $action.on('click', action.action);
                $actions.append($action);
            }
            this.$informationBox.show();
            this.$element.addClass('showInformation');
            this.extension.resize();
        };
        HeaderPanel.prototype.hideInformation = function () {
            this.$element.removeClass('showInformation');
            this.$informationBox.hide();
            this.extension.resize();
        };
        HeaderPanel.prototype.getSettings = function () {
            return this.extension.getSettings();
        };
        HeaderPanel.prototype.updateSettings = function (settings) {
            this.extension.updateSettings(settings);
            $.publish(BaseCommands.UPDATE_SETTINGS, [settings]);
        };
        HeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var headerWidth = this.$element.width();
            var center = headerWidth / 2;
            var containerWidth = this.$centerOptions.outerWidth();
            var pos = center - (containerWidth / 2);
            this.$centerOptions.css({
                left: pos
            });
            if (this.$informationBox.is(':visible')) {
                var $actions = this.$informationBox.find('.actions');
                var $message = this.$informationBox.find('.message');
                $message.width(this.$element.width() - $message.horizontalMargins() - $actions.outerWidth(true) - this.$informationBox.find('.close').outerWidth(true) - 1);
                $message.ellipsisFill(this.information.message);
            }
            // hide toggle buttons below minimum width
            if (this.extension.width() < this.extension.config.options.minWidthBreakPoint) {
                if (this.localeToggleIsVisible())
                    this.$localeToggleButton.hide();
            }
            else {
                if (this.localeToggleIsVisible())
                    this.$localeToggleButton.show();
            }
        };
        return HeaderPanel;
    })(BaseView);
    return HeaderPanel;
});
//# sourceMappingURL=HeaderPanel.js.map