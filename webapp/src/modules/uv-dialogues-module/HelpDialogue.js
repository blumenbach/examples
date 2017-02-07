var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var HelpDialogue = (function (_super) {
        __extends(HelpDialogue, _super);
        function HelpDialogue($element) {
            _super.call(this, $element);
        }
        HelpDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('helpDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_HELP_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_HELP_DIALOGUE;
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
            this.$message = $('<p></p>');
            this.$scroll.append(this.$message);
            // initialise ui.
            this.$title.text(this.content.title);
            this.$message.html(this.content.text);
            // ensure anchor tags link to _blank.
            this.$message.targetBlank();
            this.$element.hide();
        };
        HelpDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return HelpDialogue;
    })(Dialogue);
    return HelpDialogue;
});
//# sourceMappingURL=HelpDialogue.js.map