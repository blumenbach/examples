var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseCommands", "./BaseView", "./GenericDialogue"], function (require, exports, BaseCommands, BaseView, GenericDialogue) {
    var Shell = (function (_super) {
        __extends(Shell, _super);
        function Shell($element) {
            Shell.$element = $element;
            _super.call(this, Shell.$element, true, true);
        }
        Shell.prototype.create = function () {
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.SHOW_OVERLAY, function () {
                Shell.$overlays.show();
            });
            $.subscribe(BaseCommands.HIDE_OVERLAY, function () {
                Shell.$overlays.hide();
            });
            Shell.$headerPanel = $('<div class="headerPanel"></div>');
            Shell.$element.append(Shell.$headerPanel);
            Shell.$mainPanel = $('<div class="mainPanel"></div>');
            Shell.$element.append(Shell.$mainPanel);
            Shell.$centerPanel = $('<div class="centerPanel"></div>');
            Shell.$mainPanel.append(Shell.$centerPanel);
            Shell.$leftPanel = $('<div class="leftPanel"></div>');
            Shell.$mainPanel.append(Shell.$leftPanel);
            Shell.$rightPanel = $('<div class="rightPanel"></div>');
            Shell.$mainPanel.append(Shell.$rightPanel);
            Shell.$footerPanel = $('<div class="footerPanel"></div>');
            Shell.$element.append(Shell.$footerPanel);
            Shell.$mobileFooterPanel = $('<div class="footerPanel mobile"></div>');
            Shell.$element.append(Shell.$mobileFooterPanel);
            Shell.$overlays = $('<div class="overlays"></div>');
            Shell.$element.append(Shell.$overlays);
            Shell.$genericDialogue = $('<div class="overlay genericDialogue"></div>');
            Shell.$overlays.append(Shell.$genericDialogue);
            Shell.$overlays.on('click', function (e) {
                if ($(e.target).hasClass('overlays')) {
                    e.preventDefault();
                    $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);
                }
            });
            // create shared views.
            new GenericDialogue(Shell.$genericDialogue);
        };
        Shell.prototype.resize = function () {
            _super.prototype.resize.call(this);
            Shell.$overlays.width(this.extension.width());
            Shell.$overlays.height(this.extension.height());
            var mainHeight = this.$element.height() - parseInt(Shell.$mainPanel.css('marginTop'))
                - (Shell.$headerPanel.is(':visible') ? Shell.$headerPanel.height() : 0)
                - (Shell.$footerPanel.is(':visible') ? Shell.$footerPanel.height() : 0)
                - (Shell.$mobileFooterPanel.is(':visible') ? Shell.$mobileFooterPanel.height() : 0);
            Shell.$mainPanel.height(mainHeight);
        };
        return Shell;
    })(BaseView);
    return Shell;
});
//# sourceMappingURL=Shell.js.map