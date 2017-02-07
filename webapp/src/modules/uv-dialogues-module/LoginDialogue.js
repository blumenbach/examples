var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var LoginDialogue = (function (_super) {
        __extends(LoginDialogue, _super);
        function LoginDialogue($element) {
            _super.call(this, $element);
        }
        LoginDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('loginDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_LOGIN_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_LOGIN_DIALOGUE;
            $.subscribe(this.openCommand, function (s, e) {
                _this.loginCallback = e.loginCallback;
                _this.logoutCallback = e.logoutCallback;
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
                    <a class="logout btn btn-primary" href="#" target="_parent"></a>\
                    <a class="login btn btn-primary" href="#" target="_parent"></a>\
                    <a class="cancel btn btn-primary" href="#"></a>\
                </div>\
            </div>');
            this.$message = this.$content.find('.message');
            this.$loginButton = this.$content.find('.login');
            this.$loginButton.text(this.content.login);
            this.$logoutButton = this.$content.find('.logout');
            this.$logoutButton.text(this.content.logout);
            this.$cancelButton = this.$content.find('.cancel');
            this.$cancelButton.text(this.content.cancel);
            this.$element.hide();
            this.$loginButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
                if (_this.loginCallback)
                    _this.loginCallback();
            });
            this.$logoutButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
                if (_this.logoutCallback)
                    _this.logoutCallback();
            });
            this.$cancelButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
            });
            this.updateLogoutButton();
        };
        LoginDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
            this.$title.text(this.resource.loginService.getProperty('label'));
            var message = this.resource.loginService.getProperty('description');
            if (this.options.warningMessage) {
                message = '<span class="warning">' + this.extension.config.content[this.options.warningMessage] + '</span><span class="description">' + message + '</span>';
            }
            this.updateLogoutButton();
            this.$message.html(message);
            this.$message.targetBlank();
            this.$message.find('a').on('click', function () {
                var url = $(this).attr('href');
                $.publish(BaseCommands.EXTERNAL_LINK_CLICKED, [url]);
            });
            if (this.options.showCancelButton) {
                this.$cancelButton.show();
            }
            else {
                this.$cancelButton.hide();
            }
            this.resize();
        };
        LoginDialogue.prototype.updateLogoutButton = function () {
            if (this.extension.isLoggedIn) {
                this.$logoutButton.show();
            }
            else {
                this.$logoutButton.hide();
            }
        };
        LoginDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return LoginDialogue;
    })(Dialogue);
    return LoginDialogue;
});
//# sourceMappingURL=LoginDialogue.js.map