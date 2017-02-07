var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue"], function (require, exports, BaseCommands, Dialogue) {
    var MoreInfoDialogue = (function (_super) {
        __extends(MoreInfoDialogue, _super);
        function MoreInfoDialogue($element) {
            _super.call(this, $element);
        }
        MoreInfoDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('moreInfoDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_MOREINFO_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_MOREINFO_DIALOGUE;
            $.subscribe(this.openCommand, function (e, $triggerButton) {
                _this.open($triggerButton);
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            this.config.content = this.extension.config.modules.moreInfoRightPanel.content;
            this.config.options = this.extension.config.modules.moreInfoRightPanel.options;
            // create ui
            this.$title = $('<h1>' + this.config.content.title + '</h1>');
            this.$content.append(this.$title);
            this.$metadata = $('<div class="iiif-metadata-component"></div>');
            this.$content.append(this.$metadata);
            this.component = new IIIFComponents.MetadataComponent(this._getOptions());
            // hide
            this.$element.hide();
        };
        MoreInfoDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            this.component.databind();
        };
        MoreInfoDialogue.prototype._getOptions = function () {
            var _this = this;
            return {
                canvasDisplayOrder: this.config.options.canvasDisplayOrder,
                canvases: this.extension.getCurrentCanvases(),
                canvasExclude: this.config.options.canvasExclude,
                canvasLabels: "Left Page, Right Page",
                content: this.config.content,
                copiedMessageDuration: 2000,
                copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
                element: ".overlay.moreInfo .iiif-metadata-component",
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
        MoreInfoDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        MoreInfoDialogue.prototype.resize = function () {
            this.setDockedPosition();
        };
        return MoreInfoDialogue;
    })(Dialogue);
    return MoreInfoDialogue;
});
//# sourceMappingURL=MoreInfoDialogue.js.map