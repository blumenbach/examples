var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var ExternalContentDialogue = (function (_super) {
        __extends(ExternalContentDialogue, _super);
        function ExternalContentDialogue($element) {
            _super.call(this, $element);
        }
        ExternalContentDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('externalContentDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.open();
                _this.$iframe.prop('src', params.uri);
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            this.$iframe = $('<iframe></iframe>');
            this.$content.append(this.$iframe);
            this.$element.hide();
        };
        ExternalContentDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$iframe.width(this.$content.width());
            this.$iframe.height(this.$content.height());
        };
        return ExternalContentDialogue;
    })(Dialogue);
    return ExternalContentDialogue;
});
//# sourceMappingURL=ExternalContentDialogue.js.map