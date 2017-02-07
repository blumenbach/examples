var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var RestrictedDialogue = (function (_super) {
        __extends(RestrictedDialogue, _super);
        function RestrictedDialogue($element) {
            _super.call(this, $element);
        }
        RestrictedDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('restrictedDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_RESTRICTED_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_RESTRICTED_DIALOGUE;
            $.subscribe(this.openCommand, function (s, e) {
                _this.acceptCallback = e.acceptCallback;
                _this.options = e.options;
                _this.resource = e.resource;
                _this.open();
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="cancel btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>');
            this.$message = this.$content.find('.message');
            this.$message.targetBlank();
            // todo: revisit?
            //this.$nextVisibleButton = this.$content.find('.nextvisible');
            //this.$nextVisibleButton.text(this.content.nextVisibleItem);
            this.$cancelButton = this.$content.find('.cancel');
            this.$cancelButton.text(this.content.cancel);
            this.$element.hide();
            this.$cancelButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
            });
        };
        RestrictedDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
            this.isAccepted = false;
            this.$title.text(this.resource.restrictedService.getProperty('label'));
            var message = this.resource.restrictedService.getProperty('description');
            this.$message.html(message);
            this.$message.targetBlank();
            this.$message.find('a').on('click', function () {
                var url = $(this).attr('href');
                $.publish(BaseCommands.EXTERNAL_LINK_CLICKED, [url]);
            });
            this.resize();
        };
        RestrictedDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
            if (!this.isAccepted && this.acceptCallback) {
                this.isAccepted = true;
                this.acceptCallback();
            }
        };
        RestrictedDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return RestrictedDialogue;
    })(Dialogue);
    return RestrictedDialogue;
});
//# sourceMappingURL=RestrictedDialogue.js.map