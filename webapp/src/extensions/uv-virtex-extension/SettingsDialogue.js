var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-dialogues-module/SettingsDialogue"], function (require, exports, BaseSettingsDialogue) {
    var SettingsDialogue = (function (_super) {
        __extends(SettingsDialogue, _super);
        function SettingsDialogue($element) {
            _super.call(this, $element);
        }
        SettingsDialogue.prototype.create = function () {
            this.setConfig('settingsDialogue');
            _super.prototype.create.call(this);
        };
        return SettingsDialogue;
    })(BaseSettingsDialogue);
    return SettingsDialogue;
});
//# sourceMappingURL=SettingsDialogue.js.map