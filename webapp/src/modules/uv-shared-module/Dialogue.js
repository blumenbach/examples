var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseView", "./BaseCommands"], function (require, exports, BaseView, Commands) {
    var Dialogue = (function (_super) {
        __extends(Dialogue, _super);
        function Dialogue($element) {
            _super.call(this, $element, false, false);
            this.allowClose = true;
            this.isActive = false;
            this.isUnopened = true;
        }
        Dialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('dialogue');
            _super.prototype.create.call(this);
            // events.
            $.subscribe(Commands.CLOSE_ACTIVE_DIALOGUE, function () {
                if (_this.isActive) {
                    if (_this.allowClose) {
                        _this.close();
                    }
                }
            });
            $.subscribe(Commands.ESCAPE, function () {
                if (_this.isActive) {
                    if (_this.allowClose) {
                        _this.close();
                    }
                }
            });
            this.$top = $('<div class="top"></div>');
            this.$element.append(this.$top);
            this.$closeButton = $('<a href="#" class="close" tabindex="0">' + this.content.close + '</a>');
            this.$top.append(this.$closeButton);
            this.$middle = $('<div class="middle"></div>');
            this.$element.append(this.$middle);
            this.$content = $('<div class="content"></div>');
            this.$middle.append(this.$content);
            this.$bottom = $('<div class="bottom"></div>');
            this.$element.append(this.$bottom);
            this.$closeButton.on('click', function (e) {
                e.preventDefault();
                _this.close();
            });
            this.returnFunc = this.close;
        };
        Dialogue.prototype.enableClose = function () {
            this.allowClose = true;
            this.$closeButton.show();
        };
        Dialogue.prototype.disableClose = function () {
            this.allowClose = false;
            this.$closeButton.hide();
        };
        Dialogue.prototype.setDockedPosition = function () {
            var top = Math.floor(this.extension.height() - this.$element.outerHeight(true));
            var left = 0;
            var arrowLeft = 0;
            if (this.$triggerButton) {
                // get the normalised position of the button
                var buttonPos = Math.normalise(this.$triggerButton.offset().left, 0, this.extension.width());
                left = Math.floor((this.extension.width() * buttonPos) - (this.$element.width() * buttonPos));
                arrowLeft = (this.$element.width() * buttonPos);
            }
            this.$bottom.css('backgroundPosition', arrowLeft + 'px 0px');
            this.$element.css({
                'top': top,
                'left': left
            });
        };
        Dialogue.prototype.open = function ($triggerButton) {
            var _this = this;
            this.$element.show();
            if ($triggerButton && $triggerButton.length) {
                this.$triggerButton = $triggerButton;
                this.$bottom.show();
            }
            else {
                this.$bottom.hide();
            }
            this.isActive = true;
            // set the focus to the default button.
            setTimeout(function () {
                var $defaultButton = _this.$element.find('.default');
                if ($defaultButton.length) {
                    $defaultButton.focus();
                }
                else {
                    // if there's no default button, focus on the first visible input
                    var $input = _this.$element.find('input:visible').first();
                    if ($input.length) {
                        $input.focus();
                    }
                    else {
                        // if there's no visible first input, focus on the close button
                        _this.$closeButton.focus();
                    }
                }
            }, 1);
            $.publish(Commands.SHOW_OVERLAY);
            if (this.isUnopened) {
                this.isUnopened = false;
                this.afterFirstOpen();
            }
            this.resize();
        };
        Dialogue.prototype.afterFirstOpen = function () {
        };
        Dialogue.prototype.close = function () {
            if (!this.isActive)
                return;
            this.$element.hide();
            this.isActive = false;
            $.publish(this.closeCommand);
            $.publish(Commands.HIDE_OVERLAY);
        };
        Dialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$element.css({
                'top': Math.floor((this.extension.height() / 2) - (this.$element.height() / 2)),
                'left': Math.floor((this.extension.width() / 2) - (this.$element.width() / 2))
            });
        };
        return Dialogue;
    })(BaseView);
    return Dialogue;
});
//# sourceMappingURL=Dialogue.js.map