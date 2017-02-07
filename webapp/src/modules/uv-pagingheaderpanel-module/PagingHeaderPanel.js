var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/AutoComplete", "../uv-shared-module/BaseCommands", "../../extensions/uv-seadragon-extension/Commands", "../uv-shared-module/HeaderPanel", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, AutoComplete, BaseCommands, Commands, HeaderPanel, Mode) {
    var PagingHeaderPanel = (function (_super) {
        __extends(PagingHeaderPanel, _super);
        function PagingHeaderPanel($element) {
            _super.call(this, $element);
            this.firstButtonEnabled = false;
            this.lastButtonEnabled = false;
            this.nextButtonEnabled = false;
            this.prevButtonEnabled = false;
        }
        PagingHeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pagingHeaderPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.canvasIndexChanged(canvasIndex);
            });
            $.subscribe(BaseCommands.SETTINGS_CHANGED, function (e) {
                _this.modeChanged();
                _this.updatePagingToggle();
            });
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, function (e) {
                _this.setSearchFieldValue(_this.extension.helper.canvasIndex);
            });
            $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, function (e) {
                _this.openGallery();
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, function (e) {
                _this.closeGallery();
            });
            this.$prevOptions = $('<div class="prevOptions"></div>');
            this.$centerOptions.append(this.$prevOptions);
            this.$firstButton = $('<a class="imageBtn first" tabindex="0"></a>');
            this.$prevOptions.append(this.$firstButton);
            this.$prevButton = $('<a class="imageBtn prev" tabindex="0"></a>');
            this.$prevOptions.append(this.$prevButton);
            this.$modeOptions = $('<div class="mode"></div>');
            this.$centerOptions.append(this.$modeOptions);
            this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
            this.$modeOptions.append(this.$imageModeLabel);
            this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="0"/>');
            this.$modeOptions.append(this.$imageModeOption);
            this.$pageModeLabel = $('<label for="page"></label>');
            this.$modeOptions.append(this.$pageModeLabel);
            this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="0"/>');
            this.$modeOptions.append(this.$pageModeOption);
            this.$search = $('<div class="search"></div>');
            this.$centerOptions.append(this.$search);
            this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0"/>');
            this.$search.append(this.$searchText);
            if (Utils.Bools.getBool(this.options.autoCompleteBoxEnabled, true)) {
                this.$searchText.hide();
                this.$autoCompleteBox = $('<input class="autocompleteText" type="text" maxlength="100" />');
                this.$search.append(this.$autoCompleteBox);
                new AutoComplete(this.$autoCompleteBox, function (term, cb) {
                    var results = [];
                    var canvases = _this.extension.helper.getCanvases();
                    // if in page mode, get canvases by label.
                    if (_this.isPageModeEnabled()) {
                        for (var i = 0; i < canvases.length; i++) {
                            var canvas = canvases[i];
                            var label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
                            if (label.startsWith(term)) {
                                results.push(label);
                            }
                        }
                    }
                    else {
                        // get canvas by index
                        for (var i = 0; i < canvases.length; i++) {
                            var canvas = canvases[i];
                            if (canvas.index.toString().startsWith(term)) {
                                results.push(canvas.index.toString());
                            }
                        }
                    }
                    cb(results);
                }, function (results) {
                    return results;
                }, function (terms) {
                    _this.search(terms);
                }, 300, 0);
            }
            else if (Utils.Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
                this.$selectionBoxOptions = $('<div class="image-selectionbox-options"></div>');
                this.$centerOptions.append(this.$selectionBoxOptions);
                this.$imageSelectionBox = $('<select class="image-selectionbox" name="image-select" tabindex="0" ></select>');
                this.$selectionBoxOptions.append(this.$imageSelectionBox);
                for (var imageIndex = 0; imageIndex < this.extension.helper.getTotalCanvases(); imageIndex++) {
                    var canvas = this.extension.helper.getCanvasByIndex(imageIndex);
                    var label = this.extension.sanitize(Manifesto.TranslationCollection.getValue(canvas.getLabel()));
                    this.$imageSelectionBox.append('<option value=' + (imageIndex) + '>' + label + '</option>');
                }
                this.$imageSelectionBox.change(function () {
                    var imageIndex = parseInt(_this.$imageSelectionBox.val());
                    $.publish(Commands.IMAGE_SEARCH, [imageIndex]);
                });
            }
            this.$total = $('<span class="total"></span>');
            this.$search.append(this.$total);
            this.$searchButton = $('<a class="go btn btn-primary" tabindex="0">' + this.content.go + '</a>');
            this.$search.append(this.$searchButton);
            this.$nextOptions = $('<div class="nextOptions"></div>');
            this.$centerOptions.append(this.$nextOptions);
            this.$nextButton = $('<a class="imageBtn next" tabindex="0"></a>');
            this.$nextOptions.append(this.$nextButton);
            this.$lastButton = $('<a class="imageBtn last" tabindex="0"></a>');
            this.$nextOptions.append(this.$lastButton);
            if (this.isPageModeEnabled()) {
                this.$pageModeOption.attr('checked', 'checked');
                this.$pageModeOption.removeAttr('disabled');
                this.$pageModeLabel.removeClass('disabled');
            }
            else {
                this.$imageModeOption.attr('checked', 'checked');
                // disable page mode option.
                this.$pageModeOption.attr('disabled', 'disabled');
                this.$pageModeLabel.addClass('disabled');
            }
            if (this.extension.helper.getManifestType().toString() === manifesto.ManifestType.manuscript().toString()) {
                this.$pageModeLabel.text(this.content.folio);
            }
            else {
                this.$pageModeLabel.text(this.content.page);
            }
            this.$galleryButton = $('<a class="imageBtn gallery" title="' + this.content.gallery + '" tabindex="0"></a>');
            this.$rightOptions.prepend(this.$galleryButton);
            this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
            this.$rightOptions.prepend(this.$pagingToggleButtons);
            this.$oneUpButton = $('<a class="imageBtn one-up" title="' + this.content.oneUp + '" tabindex="0"></a>');
            this.$pagingToggleButtons.append(this.$oneUpButton);
            this.$twoUpButton = $('<a class="imageBtn two-up" title="' + this.content.twoUp + '" tabindex="0"></a>');
            this.$pagingToggleButtons.append(this.$twoUpButton);
            this.updatePagingToggle();
            this.updateGalleryButton();
            this.$oneUpButton.onPressed(function () {
                var enabled = false;
                _this.updateSettings({ pagingEnabled: enabled });
                $.publish(Commands.PAGING_TOGGLED, [enabled]);
            });
            this.$twoUpButton.onPressed(function () {
                var enabled = true;
                _this.updateSettings({ pagingEnabled: enabled });
                $.publish(Commands.PAGING_TOGGLED, [enabled]);
            });
            this.$galleryButton.onPressed(function () {
                $.publish(BaseCommands.TOGGLE_EXPAND_LEFT_PANEL);
            });
            this.setTitles();
            this.setTotal();
            var viewingDirection = this.extension.helper.getViewingDirection();
            // check if the book has more than one page, otherwise hide prev/next options.
            if (this.extension.helper.getTotalCanvases() === 1) {
                this.$centerOptions.hide();
            }
            // ui event handlers.
            this.$firstButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        $.publish(Commands.FIRST);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(Commands.LAST);
                        break;
                }
            });
            this.$prevButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(Commands.PREV);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(Commands.NEXT);
                        break;
                }
            });
            this.$nextButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                        $.publish(Commands.NEXT);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(Commands.PREV);
                        break;
                }
            });
            this.$lastButton.onPressed(function () {
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.leftToRight().toString():
                    case manifesto.ViewingDirection.topToBottom().toString():
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        $.publish(Commands.LAST);
                        break;
                    case manifesto.ViewingDirection.rightToLeft().toString():
                        $.publish(Commands.FIRST);
                        break;
                }
            });
            // If page mode is disabled, we don't need to show radio buttons since
            // there is only one option:
            if (!this.config.options.pageModeEnabled) {
                this.$imageModeOption.hide();
                this.$pageModeLabel.hide();
                this.$pageModeOption.hide();
            }
            else {
                // Only activate click actions for mode buttons when controls are
                // visible, since otherwise, clicking on the "Image" label can
                // trigger unexpected/undesired side effects.
                this.$imageModeOption.on('click', function (e) {
                    $.publish(Commands.MODE_CHANGED, [Mode.image.toString()]);
                });
                this.$pageModeOption.on('click', function (e) {
                    $.publish(Commands.MODE_CHANGED, [Mode.page.toString()]);
                });
            }
            this.$searchText.onEnter(function () {
                _this.$searchText.blur();
                _this.search(_this.$searchText.val());
            });
            this.$searchText.click(function () {
                $(this).select();
            });
            this.$searchButton.onPressed(function () {
                if (_this.options.autoCompleteBoxEnabled) {
                    _this.search(_this.$autoCompleteBox.val());
                }
                else {
                    _this.search(_this.$searchText.val());
                }
            });
            if (this.options.modeOptionsEnabled === false) {
                this.$modeOptions.hide();
                this.$centerOptions.addClass('modeOptionsDisabled');
            }
            // Search is shown as default
            if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true) {
                this.$search.hide();
            }
            if (this.options.helpEnabled === false) {
                this.$helpButton.hide();
            }
            // todo: discuss on community call
            // Get visible element in centerOptions with greatest tabIndex
            // var $elementWithGreatestTabIndex: JQuery = this.$centerOptions.getVisibleElementWithGreatestTabIndex();
            // // cycle focus back to start.
            // if ($elementWithGreatestTabIndex) {
            //     $elementWithGreatestTabIndex.blur(() => {
            //         if (this.extension.tabbing && !this.extension.shifted) {
            //             this.$nextButton.focus();
            //         }
            //     });
            // }
            // this.$nextButton.blur(() => {
            //     if (this.extension.tabbing && this.extension.shifted) {
            //         setTimeout(() => {
            //             $elementWithGreatestTabIndex.focus();
            //         }, 100);
            //     }
            // });
            if (!Utils.Bools.getBool(this.options.pagingToggleEnabled, true)) {
                this.$pagingToggleButtons.hide();
            }
        };
        PagingHeaderPanel.prototype.openGallery = function () {
            this.$oneUpButton.removeClass('on');
            this.$twoUpButton.removeClass('on');
            this.$galleryButton.addClass('on');
        };
        PagingHeaderPanel.prototype.closeGallery = function () {
            this.updatePagingToggle();
            this.$galleryButton.removeClass('on');
        };
        PagingHeaderPanel.prototype.isPageModeEnabled = function () {
            return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode.page.toString();
        };
        PagingHeaderPanel.prototype.setTitles = function () {
            if (this.isPageModeEnabled()) {
                this.$firstButton.prop('title', this.content.firstPage);
                this.$prevButton.prop('title', this.content.previousPage);
                this.$nextButton.prop('title', this.content.nextPage);
                this.$lastButton.prop('title', this.content.lastPage);
            }
            else {
                this.$firstButton.prop('title', this.content.firstImage);
                this.$prevButton.prop('title', this.content.previousImage);
                this.$nextButton.prop('title', this.content.nextImage);
                this.$lastButton.prop('title', this.content.lastImage);
            }
            this.$searchButton.prop('title', this.content.go);
        };
        PagingHeaderPanel.prototype.updatePagingToggle = function () {
            if (!this.pagingToggleIsVisible()) {
                this.$pagingToggleButtons.hide();
                return;
            }
            if (this.extension.isPagingSettingEnabled()) {
                this.$oneUpButton.removeClass('on');
                this.$twoUpButton.addClass('on');
            }
            else {
                this.$twoUpButton.removeClass('on');
                this.$oneUpButton.addClass('on');
            }
        };
        PagingHeaderPanel.prototype.pagingToggleIsVisible = function () {
            return Utils.Bools.getBool(this.options.pagingToggleEnabled, true) && this.extension.helper.isPagingAvailable();
        };
        PagingHeaderPanel.prototype.updateGalleryButton = function () {
            if (!this.galleryIsVisible()) {
                this.$galleryButton.hide();
            }
        };
        PagingHeaderPanel.prototype.galleryIsVisible = function () {
            return Utils.Bools.getBool(this.options.galleryButtonEnabled, true) && this.extension.isLeftPanelEnabled();
        };
        PagingHeaderPanel.prototype.setTotal = function () {
            var of = this.content.of;
            if (this.isPageModeEnabled()) {
                this.$total.html(String.format(of, this.extension.helper.getLastCanvasLabel(true)));
            }
            else {
                this.$total.html(String.format(of, this.extension.helper.getTotalCanvases()));
            }
        };
        PagingHeaderPanel.prototype.setSearchFieldValue = function (index) {
            var canvas = this.extension.helper.getCanvasByIndex(index);
            var value;
            if (this.isPageModeEnabled()) {
                var orderLabel = Manifesto.TranslationCollection.getValue(canvas.getLabel());
                if (orderLabel === "-") {
                    value = "";
                }
                else {
                    value = orderLabel;
                }
            }
            else {
                index += 1;
                value = index;
            }
            if (this.options.autoCompleteBoxEnabled) {
                this.$autoCompleteBox.val(value);
            }
            else {
                this.$searchText.val(value);
            }
        };
        PagingHeaderPanel.prototype.search = function (value) {
            if (!value) {
                this.extension.showMessage(this.content.emptyValue);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            if (this.isPageModeEnabled()) {
                $.publish(Commands.PAGE_SEARCH, [value]);
            }
            else {
                var index;
                if (this.options.autoCompleteBoxEnabled) {
                    index = parseInt(this.$autoCompleteBox.val(), 10);
                }
                else {
                    index = parseInt(this.$searchText.val(), 10);
                }
                index -= 1;
                if (isNaN(index)) {
                    this.extension.showMessage(this.extension.config.modules.genericDialogue.content.invalidNumber);
                    $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                    return;
                }
                var asset = this.extension.helper.getCanvasByIndex(index);
                if (!asset) {
                    this.extension.showMessage(this.extension.config.modules.genericDialogue.content.pageNotFound);
                    $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                    return;
                }
                $.publish(Commands.IMAGE_SEARCH, [index]);
            }
        };
        PagingHeaderPanel.prototype.canvasIndexChanged = function (index) {
            this.setSearchFieldValue(index);
            if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true) {
                this.$imageSelectionBox.val(index);
            }
            var viewingDirection = this.extension.helper.getViewingDirection();
            if (viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString()) {
                if (this.extension.helper.isFirstCanvas()) {
                    this.disableLastButton();
                    this.disableNextButton();
                }
                else {
                    this.enableLastButton();
                    this.enableNextButton();
                }
                if (this.extension.helper.isLastCanvas()) {
                    this.disableFirstButton();
                    this.disablePrevButton();
                }
                else {
                    this.enableFirstButton();
                    this.enablePrevButton();
                }
            }
            else {
                if (this.extension.helper.isFirstCanvas()) {
                    this.disableFirstButton();
                    this.disablePrevButton();
                }
                else {
                    this.enableFirstButton();
                    this.enablePrevButton();
                }
                if (this.extension.helper.isLastCanvas()) {
                    this.disableLastButton();
                    this.disableNextButton();
                }
                else {
                    this.enableLastButton();
                    this.enableNextButton();
                }
            }
        };
        PagingHeaderPanel.prototype.disableFirstButton = function () {
            this.firstButtonEnabled = false;
            this.$firstButton.disable();
        };
        PagingHeaderPanel.prototype.enableFirstButton = function () {
            this.firstButtonEnabled = true;
            this.$firstButton.enable();
        };
        PagingHeaderPanel.prototype.disableLastButton = function () {
            this.lastButtonEnabled = false;
            this.$lastButton.disable();
        };
        PagingHeaderPanel.prototype.enableLastButton = function () {
            this.lastButtonEnabled = true;
            this.$lastButton.enable();
        };
        PagingHeaderPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.disable();
        };
        PagingHeaderPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.enable();
        };
        PagingHeaderPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.disable();
        };
        PagingHeaderPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.enable();
        };
        PagingHeaderPanel.prototype.modeChanged = function () {
            this.setSearchFieldValue(this.extension.helper.canvasIndex);
            this.setTitles();
            this.setTotal();
        };
        PagingHeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            // hide toggle buttons below minimum width
            if (this.extension.width() < this.extension.config.options.minWidthBreakPoint) {
                if (this.pagingToggleIsVisible())
                    this.$pagingToggleButtons.hide();
                if (this.galleryIsVisible())
                    this.$galleryButton.hide();
            }
            else {
                if (this.pagingToggleIsVisible())
                    this.$pagingToggleButtons.show();
                if (this.galleryIsVisible())
                    this.$galleryButton.show();
            }
        };
        return PagingHeaderPanel;
    })(HeaderPanel);
    return PagingHeaderPanel;
});
//# sourceMappingURL=PagingHeaderPanel.js.map