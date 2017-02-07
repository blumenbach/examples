var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-shared-module/BaseCommands", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "./Commands", "./DownloadDialogue", "./ShareDialogue", "../../modules/uv-shared-module/FooterPanel", "../../modules/uv-shared-module/HeaderPanel", "../../modules/uv-dialogues-module/HelpDialogue", "../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel", "./SettingsDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, BaseCommands, BaseExtension, Bookmark, Commands, DownloadDialogue, ShareDialogue, FooterPanel, HeaderPanel, HelpDialogue, MediaElementCenterPanel, MoreInfoRightPanel, ResourcesLeftPanel, SettingsDialogue, Shell) {
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(bootstrapper) {
            _super.call(this, bootstrapper);
        }
        Extension.prototype.create = function (overrideDependencies) {
            var _this = this;
            _super.prototype.create.call(this, overrideDependencies);
            // listen for mediaelement enter/exit fullscreen events.
            $(window).bind('enterfullscreen', function () {
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            });
            $(window).bind('exitfullscreen', function () {
                $.publish(BaseCommands.TOGGLE_FULLSCREEN);
            });
            $.subscribe(BaseCommands.THUMB_SELECTED, function (e, canvasIndex) {
                _this.viewCanvas(canvasIndex);
            });
            $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, function (e) {
                Shell.$centerPanel.hide();
                Shell.$rightPanel.hide();
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, function (e) {
                Shell.$centerPanel.show();
                Shell.$rightPanel.show();
                _this.resize();
            });
            $.subscribe(Commands.MEDIA_ENDED, function (e) {
                _this.triggerSocket(Commands.MEDIA_ENDED);
            });
            $.subscribe(Commands.MEDIA_PAUSED, function (e) {
                _this.triggerSocket(Commands.MEDIA_PAUSED);
            });
            $.subscribe(Commands.MEDIA_PLAYED, function (e) {
                _this.triggerSocket(Commands.MEDIA_PLAYED);
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
                this.leftPanel = new ResourcesLeftPanel(Shell.$leftPanel);
            }
            this.centerPanel = new MediaElementCenterPanel(Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel(Shell.$footerPanel);
            }
            else {
                Shell.$footerPanel.hide();
            }
            this.$helpDialogue = $('<div class="overlay help"></div>');
            Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new HelpDialogue(this.$helpDialogue);
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
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
        };
        Extension.prototype.isLeftPanelEnabled = function () {
            return Utils.Bools.getBool(this.config.options.leftPanelEnabled, true)
                && ((this.helper.isMultiCanvas() || this.helper.isMultiSequence()) || this.helper.hasResources());
        };
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.extensions.helper.getCurrentCanvas();
            var bookmark = new Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
            bookmark.path = this.getBookmarkUri();
            bookmark.thumb = canvas.getProperty('thumbnail');
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            if (this.isVideo()) {
                bookmark.type = manifesto.ElementType.movingimage().toString();
            }
            else {
                bookmark.type = manifesto.ElementType.sound().toString();
            }
            this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
        };
        Extension.prototype.getEmbedScript = function (template, width, height) {
            var configUri = this.config.uri || '';
            var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.embedScriptUri);
            return script;
        };
        // todo: use canvas.getThumbnail()
        Extension.prototype.getPosterImageUri = function () {
            return this.helper.getCurrentCanvas().getProperty('thumbnail');
        };
        Extension.prototype.isVideo = function () {
            var elementType = this.helper.getElementType();
            return elementType.toString() === manifesto.ElementType.movingimage().toString();
        };
        return Extension;
    })(BaseExtension);
    return Extension;
});
//# sourceMappingURL=Extension.js.map