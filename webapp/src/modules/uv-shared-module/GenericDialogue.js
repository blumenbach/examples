var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseCommands", "./Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var GenericDialogue = (function (_super) {
        __extends(GenericDialogue, _super);
        function GenericDialogue($element) {
            _super.call(this, $element);
        }
        GenericDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('genericDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_GENERIC_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_GENERIC_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.acceptCallback = params.acceptCallback;
                _this.showMessage(params);
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            this.$message = $('<p></p>');
            this.$content.append(this.$message);
            this.$acceptButton = $('<a href="#" class="btn btn-primary accept default"></a>');
            this.$content.append(this.$acceptButton);
            this.$acceptButton.text(this.content.ok);
            this.$acceptButton.onPressed(function () {
                _this.accept();
            });
            this.returnFunc = function () {
                if (_this.isActive) {
                    _this.accept();
                }
            };
            this.$element.hide();
        };
        GenericDialogue.prototype.accept = function () {
            $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
            if (this.acceptCallback)
                this.acceptCallback();
        };
        GenericDialogue.prototype.showMessage = function (params) {
            this.$message.html(params.message);
            if (params.buttonText) {
                this.$acceptButton.text(params.buttonText);
            }
            else {
                this.$acceptButton.text(this.content.ok);
            }
            if (params.allowClose === false) {
                this.disableClose();
            }
            this.open();
        };
        GenericDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return GenericDialogue;
    })(Dialogue);
    return GenericDialogue;
});
//# sourceMappingURL=GenericDialogue.js.map