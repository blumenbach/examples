var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-dialogues-module/DownloadDialogue"], function (require, exports, BaseDownloadDialogue) {
    var DownloadDialogue = (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            _super.call(this, $element);
        }
        DownloadDialogue.prototype.create = function () {
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
        };
        DownloadDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            this.addEntireFileDownloadOptions();
            this.updateNoneAvailable();
            this.resize();
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            return _super.prototype.isDownloadOptionAvailable.call(this, option);
        };
        return DownloadDialogue;
    })(BaseDownloadDialogue);
    return DownloadDialogue;
});
//# sourceMappingURL=DownloadDialogue.js.map