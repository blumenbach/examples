var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue", "../../_Version"], function (require, exports, BaseCommands, Commands, Dialogue, Version) {
    var SettingsDialogue = (function (_super) {
        __extends(SettingsDialogue, _super);
        function SettingsDialogue($element) {
            _super.call(this, $element);
        }
        SettingsDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('settingsDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_SETTINGS_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_SETTINGS_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.open();
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$scroll = $('<div class="scroll"></div>');
            this.$content.append(this.$scroll);
            this.$version = $('<div class="version"></div>');
            this.$content.append(this.$version);
            this.$website = $('<div class="website"></div>');
            this.$content.append(this.$website);
            this.$locale = $('<div class="setting locale"></div>');
            this.$scroll.append(this.$locale);
            this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
            this.$locale.append(this.$localeLabel);
            this.$localeDropDown = $('<select id="locale"></select>');
            this.$locale.append(this.$localeDropDown);
            // initialise ui.
            this.$title.text(this.content.title);
            this.$version.text("v" + Version.Version);
            this.$website.html(this.content.website);
            this.$website.targetBlank();
            var locales = this.extension.getLocales();
            for (var i = 0; i < locales.length; i++) {
                var locale = locales[i];
                this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
            }
            this.$localeDropDown.val(this.extension.locale);
            this.$localeDropDown.change(function () {
                _this.extension.changeLocale(_this.$localeDropDown.val());
            });
            if (this.extension.getLocales().length < 2) {
                this.$locale.hide();
            }
            this.$element.hide();
        };
        SettingsDialogue.prototype.getSettings = function () {
            return this.extension.getSettings();
        };
        SettingsDialogue.prototype.updateSettings = function (settings) {
            this.extension.updateSettings(settings);
            $.publish(Commands.UPDATE_SETTINGS, [settings]);
        };
        SettingsDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
        };
        SettingsDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return SettingsDialogue;
    })(Dialogue);
    return SettingsDialogue;
});
//# sourceMappingURL=SettingsDialogue.js.map