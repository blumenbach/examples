var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-shared-module/BaseCommands", "../../modules/uv-dialogues-module/DownloadDialogue", "./Commands", "../../modules/uv-shared-module/DownloadOption", "./DownloadType"], function (require, exports, BaseCommands, BaseDownloadDialogue, Commands, DownloadOption, DownloadType) {
    var Size = Utils.Measurements.Size;
    var DownloadDialogue = (function (_super) {
        __extends(DownloadDialogue, _super);
        function DownloadDialogue($element) {
            _super.call(this, $element);
        }
        DownloadDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('downloadDialogue');
            _super.prototype.create.call(this);
            // create ui.
            // this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + '</a>');
            // this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + ' </div>');
            // this.$pagingNote.append(this.$settingsButton);
            // this.$content.append(this.$pagingNote);
            this.$imageOptionsContainer = $('<li class="group image"></li>');
            this.$downloadOptions.append(this.$imageOptionsContainer);
            this.$imageOptions = $('<ul></ul>');
            this.$imageOptionsContainer.append(this.$imageOptions);
            this.$currentViewAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.currentViewAsJpg.toString() + '"></label></li>');
            this.$imageOptions.append(this.$currentViewAsJpgButton);
            this.$currentViewAsJpgButton.hide();
            this.$wholeImageHighResButton = $('<li class="option single"><input id="' + DownloadOption.wholeImageHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.wholeImageHighRes.toString() + 'label" for="' + DownloadOption.wholeImageHighRes.toString() + '"></label></li>');
            this.$imageOptions.append(this.$wholeImageHighResButton);
            this.$wholeImageHighResButton.hide();
            this.$wholeImagesHighResButton = $('<li class="option multiple"><input id="' + DownloadOption.wholeImagesHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.wholeImagesHighRes.toString() + 'label" for="' + DownloadOption.wholeImagesHighRes.toString() + '"></label></li>');
            this.$imageOptions.append(this.$wholeImagesHighResButton);
            this.$wholeImageHighResButton.hide();
            this.$wholeImageLowResAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
            this.$imageOptions.append(this.$wholeImageLowResAsJpgButton);
            this.$wholeImageLowResAsJpgButton.hide();
            this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
            this.$downloadOptions.append(this.$canvasOptionsContainer);
            this.$canvasOptions = $('<ul></ul>');
            this.$canvasOptionsContainer.append(this.$canvasOptions);
            this.$sequenceOptionsContainer = $('<li class="group sequence"></li>');
            this.$downloadOptions.append(this.$sequenceOptionsContainer);
            this.$sequenceOptions = $('<ul></ul>');
            this.$sequenceOptionsContainer.append(this.$sequenceOptions);
            this.$selectionButton = $('<li class="option"><input id="' + DownloadOption.selection.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.selection.toString() + 'label" for="' + DownloadOption.selection.toString() + '"></label></li>');
            this.$sequenceOptions.append(this.$selectionButton);
            this.$selectionButton.hide();
            this.$buttonsContainer = $('<div class="buttons"></div>');
            this.$content.append(this.$buttonsContainer);
            this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
            this.$buttonsContainer.append(this.$downloadButton);
            this.$explanatoryTextTemplate = $('<span class="explanatory"></span>');
            var that = this;
            this.$downloadButton.on('click', function (e) {
                e.preventDefault();
                var $selectedOption = that.getSelectedOption();
                var id = $selectedOption.attr('id');
                var label = $selectedOption.attr('title');
                var mime = $selectedOption.data('mime');
                var type = DownloadType.UNKNOWN;
                var canvas = _this.extension.helper.getCurrentCanvas();
                if (_this.renderingUrls[id]) {
                    if (mime) {
                        if (mime.toLowerCase().indexOf('pdf') !== -1) {
                            type = DownloadType.ENTIREDOCUMENTASPDF;
                        }
                        else if (mime.toLowerCase().indexOf('txt') !== -1) {
                            type = DownloadType.ENTIREDOCUMENTASTEXT;
                        }
                    }
                    if (type = DownloadType.ENTIREDOCUMENTASPDF) {
                        //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
                        // if downloading a pdf - if there's a print service, generate an event instead of opening a new window.
                        // if (printService && this.extension.isOnHomeDomain()){
                        //     $.publish(Commands.PRINT);
                        // } else {
                        window.open(_this.renderingUrls[id]);
                    }
                }
                else {
                    switch (id) {
                        case DownloadOption.currentViewAsJpg.toString():
                            var viewer = that.extension.getViewer();
                            window.open(that.extension.getCroppedImageUri(canvas, viewer));
                            type = DownloadType.CURRENTVIEW;
                            break;
                        case DownloadOption.selection.toString():
                            Utils.Async.waitFor(function () {
                                return !_this.isActive;
                            }, function () {
                                $.publish(Commands.SHOW_MULTISELECT_DIALOGUE);
                            });
                            break;
                        case DownloadOption.wholeImageHighRes.toString():
                            window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCurrentCanvas()));
                            type = DownloadType.WHOLEIMAGEHIGHRES;
                            break;
                        case DownloadOption.wholeImagesHighRes.toString():
                            var indices = _this.extension.getPagedIndices();
                            for (var i = 0; i < indices.length; i++) {
                                window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCanvasByIndex(indices[i])));
                            }
                            type = DownloadType.WHOLEIMAGESHIGHRES;
                            break;
                        case DownloadOption.wholeImageLowResAsJpg.toString():
                            window.open(that.extension.getConfinedImageUri(canvas, that.options.confinedImageSize));
                            type = DownloadType.WHOLEIMAGELOWRES;
                            break;
                    }
                }
                $.publish(BaseCommands.DOWNLOAD, [{
                        "type": type,
                        "label": label
                    }]);
                _this.close();
            });
            // this.$settingsButton.onPressed(() => {
            //     $.publish(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
            //     $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
            // });
        };
        DownloadDialogue.prototype.open = function ($triggerButton) {
            _super.prototype.open.call(this, $triggerButton);
            var canvas = this.extension.helper.getCurrentCanvas();
            var rotation = this.extension.getViewerRotation();
            var hasNormalDimensions = rotation % 180 == 0;
            if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
                var $input = this.$currentViewAsJpgButton.find('input');
                var $label = this.$currentViewAsJpgButton.find('label');
                var label = this.content.currentViewAsJpg;
                var viewer = this.extension.getViewer();
                var dimensions = this.extension.getCroppedImageDimensions(canvas, viewer);
                // dimensions
                if (dimensions) {
                    label = hasNormalDimensions ?
                        String.format(label, dimensions.size.width, dimensions.size.height) :
                        String.format(label, dimensions.size.height, dimensions.size.width);
                    $label.text(label);
                    $input.prop('title', label);
                    this.$currentViewAsJpgButton.data('width', dimensions.size.width);
                    this.$currentViewAsJpgButton.data('height', dimensions.size.height);
                    this.$currentViewAsJpgButton.show();
                }
                else {
                    this.$currentViewAsJpgButton.hide();
                }
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.currentViewAsJpgExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$currentViewAsJpgButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption.wholeImageHighRes)) {
                var $input = this.$wholeImageHighResButton.find('input');
                var $label = this.$wholeImageHighResButton.find('label');
                var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
                if (mime) {
                    mime = Utils.Files.simplifyMimeType(mime);
                }
                else {
                    mime = '?';
                }
                // dimensions
                var size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());
                if (!size) {
                    this.$wholeImageHighResButton.hide();
                }
                else {
                    var label = hasNormalDimensions ?
                        String.format(this.content.wholeImageHighRes, size.width, size.height, mime) :
                        String.format(this.content.wholeImageHighRes, size.height, size.width, mime);
                    $label.text(label);
                    $input.prop('title', label);
                    this.$wholeImageHighResButton.data('width', size.width);
                    this.$wholeImageHighResButton.data('height', size.height);
                    this.$wholeImageHighResButton.show();
                }
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImageHighResExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImageHighResButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption.wholeImagesHighRes)) {
                var $input = this.$wholeImagesHighResButton.find('input');
                var $label = this.$wholeImagesHighResButton.find('label');
                var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
                if (mime) {
                    mime = Utils.Files.simplifyMimeType(mime);
                }
                else {
                    mime = '?';
                }
                var label = String.format(this.content.wholeImagesHighRes, mime);
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImagesHighResButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImagesHighResExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImagesHighResButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption.wholeImageLowResAsJpg)) {
                var $input = this.$wholeImageLowResAsJpgButton.find('input');
                var $label = this.$wholeImageLowResAsJpgButton.find('label');
                var size = this.extension.getConfinedImageDimensions(canvas, this.options.confinedImageSize);
                var label = hasNormalDimensions ?
                    String.format(this.content.wholeImageLowResAsJpg, size.width, size.height) :
                    String.format(this.content.wholeImageLowResAsJpg, size.height, size.width);
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImageLowResAsJpgButton.data('width', size.width);
                this.$wholeImageLowResAsJpgButton.data('height', size.height);
                this.$wholeImageLowResAsJpgButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.wholeImageLowResAsJpgExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$wholeImageLowResAsJpgButton.hide();
            }
            if (this.isDownloadOptionAvailable(DownloadOption.selection)) {
                var $input = this.$selectionButton.find('input');
                var $label = this.$selectionButton.find('label');
                $label.text(this.content.downloadSelection);
                $input.prop('title', this.content.downloadSelection);
                this.$selectionButton.show();
                // explanatory text
                if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                    var text = this.content.selectionExplanation;
                    if (text) {
                        var $span = this.$explanatoryTextTemplate.clone();
                        $span.text(text);
                        $label.append($span);
                    }
                }
            }
            else {
                this.$selectionButton.hide();
            }
            this.resetDynamicDownloadOptions();
            if (this.isDownloadOptionAvailable(DownloadOption.dynamicImageRenderings)) {
                var images = canvas.getImages();
                for (var i = 0; i < images.length; i++) {
                    this.addDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption.dynamicImageRenderings);
                }
            }
            if (this.isDownloadOptionAvailable(DownloadOption.dynamicCanvasRenderings)) {
                this.addDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption.dynamicCanvasRenderings);
            }
            if (this.isDownloadOptionAvailable(DownloadOption.dynamicSequenceRenderings)) {
                this.addDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption.dynamicSequenceRenderings);
            }
            // hide the current view option if it's equivalent to whole image.
            if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
                var currentWidth = parseInt(this.$currentViewAsJpgButton.data('width').toString());
                var currentHeight = parseInt(this.$currentViewAsJpgButton.data('height').toString());
                var wholeWidth = parseInt(this.$wholeImageHighResButton.data('width').toString());
                var wholeHeight = parseInt(this.$wholeImageHighResButton.data('height').toString());
                var percentageWidth = (currentWidth / wholeWidth) * 100;
                var percentageHeight = (currentHeight / wholeHeight) * 100;
                var disabledPercentage = this.options.currentViewDisabledPercentage;
                // if over disabledPercentage of the size of whole image
                if (percentageWidth >= disabledPercentage && percentageHeight >= disabledPercentage) {
                    this.$currentViewAsJpgButton.hide();
                }
                else {
                    this.$currentViewAsJpgButton.show();
                }
            }
            // order by image area
            var $options = this.$imageOptions.find('li.single');
            $options = $options.sort(function (a, b) {
                var aWidth = $(a).data('width');
                aWidth ? aWidth = parseInt(aWidth.toString()) : 0;
                var aHeight = $(a).data('height');
                aHeight ? aHeight = parseInt(aHeight.toString()) : 0;
                var bWidth = $(b).data('width');
                bWidth ? bWidth = parseInt(bWidth.toString()) : 0;
                var bHeight = $(b).data('height');
                bHeight ? bHeight = parseInt(bHeight.toString()) : 0;
                var aArea = aWidth * aHeight;
                var bArea = bWidth * bHeight;
                if (aArea < bArea) {
                    return -1;
                }
                if (aArea > bArea) {
                    return 1;
                }
                return 0;
            });
            $options.detach().appendTo(this.$imageOptions);
            // hide empty groups
            var $groups = this.$downloadOptions.find('li.group');
            $groups.each(function (index, group) {
                var $group = $(group);
                $group.show();
                if ($group.find('li.option:hidden').length === $group.find('li.option').length) {
                    // all options are hidden, hide group.
                    $group.hide();
                }
            });
            this.$downloadOptions.find('li.group:visible').last().addClass('lastVisible');
            if (!this.$downloadOptions.find('li.option:visible').length) {
                this.$noneAvailable.show();
                this.$downloadButton.hide();
            }
            else {
                // select first option.
                this.$downloadOptions.find('li.option input:visible:first').prop("checked", true);
                this.$noneAvailable.hide();
                this.$downloadButton.show();
            }
            this.resize();
        };
        DownloadDialogue.prototype.resetDynamicDownloadOptions = function () {
            this.renderingUrls = [];
            this.renderingUrlsCount = 0;
            this.$downloadOptions.find('li.dynamic').remove();
        };
        DownloadDialogue.prototype.addDownloadOptionsForRenderings = function (resource, defaultLabel, type) {
            var renderings = resource.getRenderings();
            for (var i = 0; i < renderings.length; i++) {
                var rendering = renderings[i];
                if (rendering) {
                    var label = Manifesto.TranslationCollection.getValue(rendering.getLabel());
                    var currentId = "downloadOption" + ++this.renderingUrlsCount;
                    if (label) {
                        label += " ({0})";
                    }
                    else {
                        label = defaultLabel;
                    }
                    var mime = Utils.Files.simplifyMimeType(rendering.getFormat().toString());
                    label = String.format(label, mime);
                    this.renderingUrls[currentId] = rendering.id;
                    var $button = $('<li class="option dynamic"><input id="' + currentId + '" data-mime="' + mime + '" title="' + label + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + currentId + '">' + label + '</label></li>');
                    switch (type) {
                        case DownloadOption.dynamicImageRenderings:
                            this.$imageOptions.append($button);
                            break;
                        case DownloadOption.dynamicCanvasRenderings:
                            this.$canvasOptions.append($button);
                            break;
                        case DownloadOption.dynamicSequenceRenderings:
                            this.$sequenceOptions.append($button);
                            break;
                    }
                }
            }
        };
        DownloadDialogue.prototype.getSelectedOption = function () {
            return this.$downloadOptions.find("li.option input:checked");
        };
        DownloadDialogue.prototype.getCanvasImageResource = function (canvas) {
            var images = canvas.getImages();
            if (images[0]) {
                return images[0].getResource();
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasHighResImageUri = function (canvas) {
            var size = this.getCanvasComputedDimensions(canvas);
            if (size) {
                var width = size.width;
                var uri = canvas.getCanonicalImageUri(width);
                var uri_parts = uri.split('/');
                var rotation = this.extension.getViewerRotation();
                uri_parts[uri_parts.length - 2] = String(rotation);
                uri = uri_parts.join('/');
                return uri;
            }
            return '';
        };
        DownloadDialogue.prototype.getCanvasMimeType = function (canvas) {
            var resource = this.getCanvasImageResource(canvas);
            var format = resource.getFormat();
            if (format) {
                return format.toString();
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasDimensions = function (canvas) {
            // externalResource may not have loaded yet
            if (canvas.externalResource.data) {
                return new Size(canvas.externalResource.data.width, canvas.externalResource.data.height);
            }
            return new Size(0, 0);
        };
        DownloadDialogue.prototype.getCanvasMaxDimensions = function (canvas) {
            if (canvas.externalResource.data && canvas.externalResource.data.profile[1]) {
                return new Size(canvas.externalResource.data.profile[1].maxWidth, canvas.externalResource.data.profile[1].maxHeight);
            }
            return null;
        };
        DownloadDialogue.prototype.getCanvasComputedDimensions = function (canvas) {
            var size = this.getCanvasDimensions(canvas);
            var maxSize = this.getCanvasMaxDimensions(canvas);
            if (!maxSize)
                return null;
            var finalWidth = size.width;
            var finalHeight = size.height;
            // if the maxWidth is less than the advertised width
            if (!_.isUndefined(maxSize.width) && maxSize.width < size.width) {
                finalWidth = maxSize.width;
                if (!_.isUndefined(maxSize.height)) {
                    finalHeight = maxSize.height;
                }
                else {
                    // calculate finalHeight
                    var ratio = Math.normalise(maxSize.width, 0, size.width);
                    finalHeight = Math.floor(size.height * ratio);
                }
            }
            return new Size(finalWidth, finalHeight);
        };
        DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
            switch (option) {
                case DownloadOption.currentViewAsJpg:
                case DownloadOption.dynamicCanvasRenderings:
                case DownloadOption.dynamicImageRenderings:
                case DownloadOption.wholeImageHighRes:
                    // if in one-up mode, or in two-up mode with a single page being shown
                    if (!this.extension.isPagingSettingEnabled() ||
                        this.extension.isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {
                        var maxSize = this.getCanvasMaxDimensions(this.extension.helper.getCurrentCanvas());
                        if (maxSize) {
                            if (_.isUndefined(maxSize.width)) {
                                return true;
                            }
                            else if (maxSize.width <= this.options.maxImageWidth) {
                                return true;
                            }
                        }
                    }
                    return false;
                case DownloadOption.wholeImagesHighRes:
                    if (this.extension.isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length > 1) {
                        return true;
                    }
                    return false;
                case DownloadOption.wholeImageLowResAsJpg:
                    // hide low-res option if hi-res width is smaller than constraint
                    var size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());
                    if (!size)
                        return false;
                    return (!this.extension.isPagingSettingEnabled() && (size.width > this.options.confinedImageSize));
                case DownloadOption.selection:
                    return this.options.selectionEnabled;
                default:
                    return _super.prototype.isDownloadOptionAvailable.call(this, option);
            }
        };
        return DownloadDialogue;
    })(BaseDownloadDialogue);
    return DownloadDialogue;
});
//# sourceMappingURL=DownloadDialogue.js.map