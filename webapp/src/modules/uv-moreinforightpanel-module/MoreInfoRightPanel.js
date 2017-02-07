var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/RightPanel"], function (require, exports, BaseCommands, RightPanel) {
    var MoreInfoRightPanel = (function (_super) {
        __extends(MoreInfoRightPanel, _super);
        function MoreInfoRightPanel($element) {
            _super.call(this, $element);
        }
        MoreInfoRightPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('moreInfoRightPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.databind();
            });
            this.setTitle(this.config.content.title);
            this.$metadata = $('<div class="iiif-metadata-component"></div>');
            this.$main.append(this.$metadata);
            this.component = new IIIFComponents.MetadataComponent(this._getOptions());
        };
        MoreInfoRightPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);
            this.databind();
        };
        MoreInfoRightPanel.prototype.databind = function () {
            this.component.options = this._getOptions();
            this.component.databind();
        };
        MoreInfoRightPanel.prototype._getOptions = function () {
            var _this = this;
            return {
                canvasDisplayOrder: this.config.options.canvasDisplayOrder,
                canvases: this.extension.getCurrentCanvases(),
                canvasExclude: this.config.options.canvasExclude,
                canvasLabels: this.extension.getCanvasLabels(this.content.page),
                content: this.config.content,
                copiedMessageDuration: 2000,
                copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
                element: ".rightPanel .iiif-metadata-component",
                helper: this.extension.helper,
                licenseFormatter: null,
                limit: this.config.options.textLimit || 4,
                limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
                manifestDisplayOrder: this.config.options.manifestDisplayOrder,
                manifestExclude: this.config.options.manifestExclude,
                range: this.extension.getCurrentCanvasRange(),
                rtlLanguageCodes: this.config.options.rtlLanguageCodes,
                sanitizer: function (html) {
                    return _this.extension.sanitize(html);
                },
                showAllLanguages: this.config.options.showAllLanguages
            };
        };
        MoreInfoRightPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
        };
        return MoreInfoRightPanel;
    })(RightPanel);
    return MoreInfoRightPanel;
});
//# sourceMappingURL=MoreInfoRightPanel.js.map