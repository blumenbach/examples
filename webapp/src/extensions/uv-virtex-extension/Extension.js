var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-shared-module/BaseCommands", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "../../modules/uv-contentleftpanel-module/ContentLeftPanel", "./DownloadDialogue", "./ShareDialogue", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "./SettingsDialogue", "../../modules/uv-shared-module/Shell", "../../modules/uv-virtexcenterpanel-module/VirtexCenterPanel"], function (require, exports, BaseCommands, BaseExtension, Bookmark, ContentLeftPanel, DownloadDialogue, ShareDialogue, FooterPanel, HeaderPanel, MoreInfoRightPanel, SettingsDialogue, Shell, VirtexCenterPanel) {
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(bootstrapper) {
            _super.call(this, bootstrapper);
        }
        Extension.prototype.create = function (overrideDependencies) {
            var _this = this;
            _super.prototype.create.call(this, overrideDependencies);
            $.subscribe(BaseCommands.THUMB_SELECTED, function (e, canvasIndex) {
                _this.viewCanvas(canvasIndex);
            });
        };
        Extension.prototype.createModules = function () {
            _super.prototype.createModules.call(this);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel = new HeaderPanel(Shell.$headerPanel);
            }
            else {
                Shell.$headerPanel.hide();
            }
            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new ContentLeftPanel(Shell.$leftPanel);
            }
            this.centerPanel = new VirtexCenterPanel(Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel(Shell.$footerPanel);
            }
            else {
                Shell.$footerPanel.hide();
            }
            this.$downloadDialogue = $('<div class="overlay download"></div>');
            Shell.$overlays.append(this.$downloadDialogue);
            this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);
            this.$shareDialogue = $('<div class="overlay share"></div>');
            Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue(this.$shareDialogue);
            this.$settingsDialogue = $('<div class="overlay settings"></div>');
            Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);
            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
            else {
                Shell.$leftPanel.hide();
            }
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
            else {
                Shell.$rightPanel.hide();
            }
        };
        Extension.prototype.isLeftPanelEnabled = function () {
            return Utils.Bools.getBool(this.config.options.leftPanelEnabled, true)
                && (this.helper.isMultiCanvas() || this.helper.isMultiSequence());
        };
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.helper.getCurrentCanvas();
            var bookmark = new Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
            bookmark.path = this.getBookmarkUri();
            bookmark.thumb = canvas.getProperty('thumbnail');
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            bookmark.type = manifesto.ElementType.physicalobject().toString();
            this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
        };
        Extension.prototype.getEmbedScript = function (template, width, height) {
            var configUri = this.config.uri || '';
            var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.embedScriptUri);
            return script;
        };
        return Extension;
    })(BaseExtension);
    return Extension;
});
//# sourceMappingURL=Extension.js.map