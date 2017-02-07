var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/CenterPanel"], function (require, exports, BaseCommands, CenterPanel) {
    var VirtexCenterPanel = (function (_super) {
        __extends(VirtexCenterPanel, _super);
        function VirtexCenterPanel($element) {
            _super.call(this, $element);
        }
        VirtexCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('virtexCenterPanel');
            _super.prototype.create.call(this);
            var that = this;
            $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                that.openMedia(resources);
            });
            this.$navigation = $('<div class="navigation"></div>');
            this.$content.prepend(this.$navigation);
            this.$zoomInButton = $('<a class="imageBtn zoomIn" title="' + this.content.zoomIn + '"></a>');
            this.$navigation.append(this.$zoomInButton);
            this.$zoomOutButton = $('<a class="imageBtn zoomOut" title="' + this.content.zoomOut + '"></a>');
            this.$navigation.append(this.$zoomOutButton);
            this.$viewport = $('<div class="virtex"></div>');
            this.$content.prepend(this.$viewport);
            this.title = this.extension.helper.getLabel();
            this.updateAttribution();
            this.$zoomInButton.on('click', function (e) {
                e.preventDefault();
                _this.viewport.zoomIn();
            });
            this.$zoomOutButton.on('click', function (e) {
                e.preventDefault();
                _this.viewport.zoomOut();
            });
        };
        VirtexCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.extension.getExternalResources(resources).then(function () {
                _this.$viewport.empty();
                var canvas = _this.extension.helper.getCurrentCanvas();
                _this.viewport = virtex.create({
                    element: "#content .virtex",
                    object: canvas.id,
                    showStats: _this.options.showStats
                });
                _this.resize();
            });
        };
        VirtexCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$title.ellipsisFill(this.title);
            this.$viewport.width(this.$content.width());
            this.$viewport.height(this.$content.height());
        };
        return VirtexCenterPanel;
    })(CenterPanel);
    return VirtexCenterPanel;
});
//# sourceMappingURL=VirtexCenterPanel.js.map