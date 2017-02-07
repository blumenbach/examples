var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./BaseCommands", "./BaseExpandPanel"], function (require, exports, BaseCommands, BaseExpandPanel) {
    var LeftPanel = (function (_super) {
        __extends(LeftPanel, _super);
        function LeftPanel($element) {
            _super.call(this, $element);
        }
        LeftPanel.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.$element.width(this.options.panelCollapsedWidth);
            $.subscribe(BaseCommands.TOGGLE_EXPAND_LEFT_PANEL, function () {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                else {
                    _this.expandFull();
                }
            });
        };
        LeftPanel.prototype.init = function () {
            _super.prototype.init.call(this);
            var shouldOpenPanel = Utils.Bools.getBool(this.extension.getSettings().leftPanelOpen, this.options.panelOpen);
            if (shouldOpenPanel) {
                this.toggle(true);
            }
        };
        LeftPanel.prototype.getTargetWidth = function () {
            if (this.isFullyExpanded || !this.isExpanded) {
                return this.options.panelExpandedWidth;
            }
            else {
                return this.options.panelCollapsedWidth;
            }
        };
        LeftPanel.prototype.getFullTargetWidth = function () {
            return this.$element.parent().width();
        };
        LeftPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);
            if (this.isExpanded) {
                $.publish(BaseCommands.OPEN_LEFT_PANEL);
            }
            else {
                $.publish(BaseCommands.CLOSE_LEFT_PANEL);
            }
            this.extension.updateSettings({ leftPanelOpen: this.isExpanded });
        };
        LeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.isFullyExpanded) {
                this.$element.width(this.$element.parent().width());
            }
        };
        return LeftPanel;
    })(BaseExpandPanel);
    return LeftPanel;
});
//# sourceMappingURL=LeftPanel.js.map