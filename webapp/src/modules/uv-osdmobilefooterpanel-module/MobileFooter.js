var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/FooterPanel", "../../extensions/uv-seadragon-extension/Commands"], function (require, exports, BaseFooterPanel, Commands) {
    var FooterPanel = (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            _super.call(this, $element);
        }
        FooterPanel.prototype.create = function () {
            this.setConfig('mobileFooterPanel');
            _super.prototype.create.call(this);
            this.$spacer = $('<div class="spacer"></div>');
            this.$options.prepend(this.$spacer);
            this.$rotateButton = $('<a class="rotate" title="' + this.content.rotateRight + '" tabindex="0">' + this.content.rotateRight + '</a>');
            this.$options.prepend(this.$rotateButton);
            this.$zoomOutButton = $('<a class="zoomOut" title="' + this.content.zoomOut + '" tabindex="0">' + this.content.zoomOut + '</a>');
            this.$options.prepend(this.$zoomOutButton);
            this.$zoomInButton = $('<a class="zoomIn" title="' + this.content.zoomIn + '" tabindex="0">' + this.content.zoomIn + '</a>');
            this.$options.prepend(this.$zoomInButton);
            this.$zoomInButton.onPressed(function () {
                $.publish(Commands.ZOOM_IN);
            });
            this.$zoomOutButton.onPressed(function () {
                $.publish(Commands.ZOOM_OUT);
            });
            this.$rotateButton.onPressed(function () {
                $.publish(Commands.ROTATE);
            });
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$options.css('left', Math.floor((this.$element.width() / 2) - (this.$options.width() / 2)));
        };
        return FooterPanel;
    })(BaseFooterPanel);
    return FooterPanel;
});
//# sourceMappingURL=MobileFooter.js.map