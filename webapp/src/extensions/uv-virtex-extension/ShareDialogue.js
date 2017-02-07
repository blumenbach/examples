var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-dialogues-module/ShareDialogue"], function (require, exports, BaseShareDialogue) {
    var ShareDialogue = (function (_super) {
        __extends(ShareDialogue, _super);
        function ShareDialogue($element) {
            _super.call(this, $element);
        }
        ShareDialogue.prototype.create = function () {
            this.setConfig('shareDialogue');
            _super.prototype.create.call(this);
        };
        ShareDialogue.prototype.update = function () {
            _super.prototype.update.call(this);
            this.code = this.extension.getEmbedScript(this.options.embedTemplate, this.currentWidth, this.currentHeight);
            this.$code.val(this.code);
        };
        ShareDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return ShareDialogue;
    })(BaseShareDialogue);
    return ShareDialogue;
});
//# sourceMappingURL=ShareDialogue.js.map