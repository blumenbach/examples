var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/Dialogue", "../uv-shared-module/DownloadOption"], function (require, exports, BaseCommands, Dialogue, DownloadOption) {
    var DownloadDialogue = (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            _super.call(this, $element);
        }
        DownloadDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
            this.openCommand = BaseCommands.SHOW_DOWNLOAD_DIALOGUE;
            this.closeCommand = BaseCommands.HIDE_DOWNLOAD_DIALOGUE;
            $.subscribe(this.openCommand, function (e, $triggerButton) {
                _this.open($triggerButton);
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
            });
            // create ui.
            this.$title = $('<h1>' + this.content.title + '</h1>');
            this.$content.append(this.$title);
            this.$noneAvailable = $('<div class="noneAvailable">' + this.content.noneAvailable + '</div>');
            this.$content.append(this.$noneAvailable);
            this.$downloadOptions = $('<ol class="options"></ol>');
            this.$content.append(this.$downloadOptions);
            this.$footer = $('<div class="footer"></div>');
            this.$content.append(this.$footer);
            this.$termsOfUseButton = $('<a href="#">' + this.extension.config.content.termsOfUse + '</a>');
            this.$footer.append(this.$termsOfUseButton);
            this.$termsOfUseButton.onPressed(function () {
                $.publish(BaseCommands.SHOW_TERMS_OF_USE);
            });
            // hide
            this.$element.hide();
            this.updateTermsOfUseButton();
        };
        DownloadDialogue.prototype.addEntireFileDownloadOptions = function () {
            var _this = this;
            if (this.isDownloadOptionAvailable(DownloadOption.entireFileAsOriginal)) {
                this.$downloadOptions.empty();
                // add each file src
                var canvas = this.extension.helper.getCurrentCanvas();
                var renderingFound = false;
                _.each(canvas.getRenderings(), function (rendering) {
                    var renderingFormat = rendering.getFormat();
                    var format = '';
                    if (renderingFormat) {
                        format = renderingFormat.toString();
                    }
                    _this.addEntireFileDownloadOption(rendering.id, Manifesto.TranslationCollection.getValue(rendering.getLabel()), format);
                    renderingFound = true;
                });
                if (!renderingFound) {
                    this.addEntireFileDownloadOption(canvas.id, null, null);
                }
            }
        };
        DownloadDialogue.prototype.addEntireFileDownloadOption = function (uri, label, format) {
            if (label) {
                label += " ({0})";
            }
            else {
                label = this.content.entireFileAsOriginal;
            }
            var fileType;
            if (format) {
                fileType = Utils.Files.simplifyMimeType(format);
            }
            else {
                fileType = this.getFileExtension(uri);
            }
            this.$downloadOptions.append('<li><a href="' + uri + '" target="_blank" download tabindex="0">' + String.format(label, fileType) + '</li>');
        };
        DownloadDialogue.prototype.updateNoneAvailable = function () {
            if (!this.$downloadOptions.find('li:visible').length) {
                this.$noneAvailable.show();
            }
            else {
                // select first option.
                this.$noneAvailable.hide();
            }
        };
        DownloadDialogue.prototype.updateTermsOfUseButton = function () {
            var attribution = this.extension.helper.getAttribution(); // todo: this should eventually use a suitable IIIF 'terms' field.
            if (Utils.Bools.getBool(this.extension.config.options.termsOfUseEnabled, false) && attribution) {
                this.$termsOfUseButton.show();
            }
            else {
                this.$termsOfUseButton.hide();
            }
        };
        DownloadDialogue.prototype.getFileExtension = function (fileUri) {
            return fileUri.split('.').pop();
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            switch (option) {
                case DownloadOption.entireFileAsOriginal:
                    // check if ui-extensions disable it
                    var uiExtensions = this.extension.helper.manifest.getService(manifesto.ServiceProfile.uiExtensions());
                    if (!this.extension.helper.isUIEnabled('mediaDownload')) {
                        return false;
                    }
            }
            return true;
        };
        DownloadDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        DownloadDialogue.prototype.resize = function () {
            this.setDockedPosition();
        };
        return DownloadDialogue;
    })(Dialogue);
    return DownloadDialogue;
});
//# sourceMappingURL=DownloadDialogue.js.map