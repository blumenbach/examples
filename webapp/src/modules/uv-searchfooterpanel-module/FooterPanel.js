var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/AutoComplete", "../uv-shared-module/BaseCommands", "../uv-shared-module/FooterPanel", "../../extensions/uv-seadragon-extension/Commands", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, AutoComplete, BaseCommands, BaseFooterPanel, Commands, Mode) {
    var FooterPanel = (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            _super.call(this, $element);
            this.placemarkerTouched = false;
        }
        FooterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('searchFooterPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.canvasIndexChanged();
                _this.setCurrentSearchResultPlacemarker();
                _this.updatePrevButton();
                _this.updateNextButton();
            });
            // todo: this should be a setting
            $.subscribe(Commands.MODE_CHANGED, function (e, mode) {
                _this.settingsChanged();
            });
            $.subscribe(Commands.SEARCH, function (e, terms) {
                _this.terms = terms;
            });
            $.subscribe(Commands.SEARCH_RESULTS, function (e, obj) {
                _this.displaySearchResults(obj.terms, obj.results);
                _this.setCurrentSearchResultPlacemarker();
            });
            $.subscribe(Commands.SEARCH_RESULTS_EMPTY, function () {
                _this.hideSearchSpinner();
            });
            $.subscribe(Commands.SEARCH_RESULT_RECT_CHANGED, function () {
                _this.updatePrevButton();
                _this.updateNextButton();
            });
            this.$printButton = $('<a class="print" title="' + this.content.print + '" tabindex="0">' + this.content.print + '</a>');
            this.$options.prepend(this.$printButton);
            // search input.
            this.$searchContainer = $('<div class="search"></div>');
            this.$element.prepend(this.$searchContainer);
            this.$searchOptions = $('<div class="searchOptions"></div>');
            this.$searchContainer.append(this.$searchOptions);
            this.$searchLabel = $('<span class="label">' + this.content.searchWithin + '</span>');
            this.$searchOptions.append(this.$searchLabel);
            this.$searchTextContainer = $('<div class="searchTextContainer"></div>');
            this.$searchOptions.append(this.$searchTextContainer);
            this.$searchText = $('<input class="searchText" type="text" maxlength="100" value="' + this.content.enterKeyword + '" />');
            this.$searchTextContainer.append(this.$searchText);
            this.$searchButton = $('<a class="imageButton searchButton" tabindex="0"></a>');
            this.$searchTextContainer.append(this.$searchButton);
            // search results.
            this.$searchPagerContainer = $('<div class="searchPager"></div>');
            this.$element.prepend(this.$searchPagerContainer);
            this.$searchPagerControls = $('<div class="controls"></div>');
            this.$searchPagerContainer.prepend(this.$searchPagerControls);
            this.$previousResultButton = $('<a class="previousResult" title="' + this.content.previousResult + '">' + this.content.previousResult + '</a>');
            this.$searchPagerControls.append(this.$previousResultButton);
            this.$searchResultsInfo = $('<div class="searchResultsInfo"><span class="number">x</span> <span class="foundFor"></span> \'<span class="terms">y</span>\'</div>');
            this.$searchPagerControls.append(this.$searchResultsInfo);
            this.$clearSearchResultsButton = $('<a class="clearSearch" title="' + this.content.clearSearch + '">' + this.content.clearSearch + '</a>');
            this.$searchResultsInfo.append(this.$clearSearchResultsButton);
            this.$nextResultButton = $('<a class="nextResult" title="' + this.content.nextResult + '">' + this.content.nextResult + '</a>');
            this.$searchPagerControls.append(this.$nextResultButton);
            // placemarker line.
            this.$searchResultsContainer = $('<div class="searchResults"></div>');
            this.$element.prepend(this.$searchResultsContainer);
            this.$line = $('<div class="line"></div>');
            this.$searchResultsContainer.append(this.$line);
            this.$pagePositionMarker = $('<div class="positionPlacemarker"></div>');
            this.$searchResultsContainer.append(this.$pagePositionMarker);
            this.$pagePositionLabel = $('<div class="label"></div>');
            this.$searchResultsContainer.append(this.$pagePositionLabel);
            this.$placemarkerDetails = $('<div class="placeMarkerDetails"></div>');
            this.$searchResultsContainer.append(this.$placemarkerDetails);
            this.$placemarkerDetailsTop = $('<h1></h1>');
            this.$placemarkerDetails.append(this.$placemarkerDetailsTop);
            this.$placemarkerDetailsBottom = $('<p></p>');
            this.$placemarkerDetails.append(this.$placemarkerDetailsBottom);
            // initialise ui.
            this.$searchPagerContainer.hide();
            this.$placemarkerDetails.hide();
            // ui event handlers.
            var that = this;
            this.$searchButton.on('click', function (e) {
                e.preventDefault();
                _this.search(_this.$searchText.val());
            });
            this.$searchText.on('focus', function () {
                // clear initial text.
                if (_this.$searchText.val() === _this.content.enterKeyword)
                    _this.$searchText.val('');
            });
            this.$placemarkerDetails.on('mouseover', function () {
                $.publish(Commands.SEARCH_PREVIEW_START, [_this.currentPlacemarkerIndex]);
            });
            this.$placemarkerDetails.on('mouseleave', function () {
                $(this).hide();
                $.publish(Commands.SEARCH_PREVIEW_FINISH);
                // reset all placemarkers.
                var placemarkers = that.getSearchResultPlacemarkers();
                placemarkers.removeClass('hover');
            });
            this.$placemarkerDetails.on('click', function (e) {
                $.publish(Commands.VIEW_PAGE, [_this.currentPlacemarkerIndex]);
            });
            this.$previousResultButton.on('click', function (e) {
                e.preventDefault();
                $.publish(Commands.PREV_SEARCH_RESULT);
            });
            this.$nextResultButton.on('click', function (e) {
                e.preventDefault();
                $.publish(Commands.NEXT_SEARCH_RESULT);
            });
            this.$clearSearchResultsButton.on('click', function (e) {
                e.preventDefault();
                $.publish(Commands.CLEAR_SEARCH);
                _this.clearSearchResults();
            });
            // hide search options if not enabled/supported.
            if (!this.extension.isSearchWithinEnabled()) {
                this.$searchContainer.hide();
                this.$searchPagerContainer.hide();
                this.$searchResultsContainer.hide();
                this.$element.addClass('min');
            }
            if (this.extension.helper.getTotalCanvases() === 1) {
                this.$searchResultsContainer.hide();
            }
            var autocompleteService = this.extension.getAutoCompleteUri();
            if (autocompleteService) {
                new AutoComplete(this.$searchText, function (terms, cb) {
                    $.getJSON(String.format(autocompleteService, terms), function (results) {
                        cb(results);
                    });
                }, function (results) {
                    return _.map(results.terms, function (result) {
                        return result.match;
                    });
                }, function (terms) {
                    _this.search(terms);
                }, 300, 2, true);
            }
            else {
                this.$searchText.on("keyup", function (e) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) {
                        that.search(that.$searchText.val());
                    }
                });
            }
            this.$printButton.onPressed(function () {
                $.publish(Commands.PRINT);
            });
            this.updatePrintButton();
            var positionMarkerEnabled = Utils.Bools.getBool(this.config.options.positionMarkerEnabled, true);
            if (!positionMarkerEnabled) {
                this.$pagePositionMarker.hide();
                this.$pagePositionLabel.hide();
            }
        };
        FooterPanel.prototype.isZoomToSearchResultEnabled = function () {
            return Utils.Bools.getBool(this.extension.config.options.zoomToSearchResultEnabled, true);
        };
        FooterPanel.prototype.isPreviousButtonEnabled = function () {
            var currentCanvasIndex = this.extension.helper.canvasIndex;
            var firstSearchResultCanvasIndex = this.getFirstSearchResultCanvasIndex();
            var currentSearchResultRectIndex = this.getCurrentSearchResultRectIndex();
            // if zoom to search result is enabled and there is a highlighted search result.
            if (this.isZoomToSearchResultEnabled() && this.extension.currentSearchResultRect) {
                if (currentCanvasIndex < firstSearchResultCanvasIndex) {
                    return false;
                }
                else if (currentCanvasIndex === firstSearchResultCanvasIndex) {
                    if (currentSearchResultRectIndex === 0) {
                        return false;
                    }
                }
                return true;
            }
            return (currentCanvasIndex > firstSearchResultCanvasIndex);
        };
        FooterPanel.prototype.isCanvasIndexLessThanFirstSearchResultIndex = function () {
            var searchResults = this.extension.searchResults;
            return this.extension.helper.canvasIndex <= searchResults[0].canvasIndex;
        };
        FooterPanel.prototype.isNextButtonEnabled = function () {
            var currentCanvasIndex = this.extension.helper.canvasIndex;
            var lastSearchResultCanvasIndex = this.getLastSearchResultCanvasIndex();
            var currentSearchResultRectIndex = this.getCurrentSearchResultRectIndex();
            // if zoom to search result is enabled and there is a highlighted search result.
            if (this.isZoomToSearchResultEnabled() && this.extension.currentSearchResultRect) {
                if (currentCanvasIndex > lastSearchResultCanvasIndex) {
                    return false;
                }
                else if (currentCanvasIndex === lastSearchResultCanvasIndex) {
                    if (currentSearchResultRectIndex === this.getLastSearchResultRectIndex()) {
                        return false;
                    }
                }
                return true;
            }
            return (currentCanvasIndex < lastSearchResultCanvasIndex);
        };
        FooterPanel.prototype.getSearchResults = function () {
            return this.extension.searchResults;
        };
        FooterPanel.prototype.getCurrentSearchResultRectIndex = function () {
            return this.extension.getCurrentSearchResultRectIndex();
        };
        FooterPanel.prototype.getFirstSearchResultCanvasIndex = function () {
            var searchResults = this.getSearchResults();
            var firstSearchResultCanvasIndex = searchResults[0].canvasIndex;
            return firstSearchResultCanvasIndex;
        };
        FooterPanel.prototype.getLastSearchResultCanvasIndex = function () {
            var searchResults = this.getSearchResults();
            var lastSearchResultCanvasIndex = searchResults[searchResults.length - 1].canvasIndex;
            return lastSearchResultCanvasIndex;
        };
        FooterPanel.prototype.getLastSearchResultRectIndex = function () {
            return this.extension.getLastSearchResultRectIndex();
        };
        FooterPanel.prototype.updateNextButton = function () {
            var searchResults = this.extension.searchResults;
            if (searchResults && searchResults.length) {
                if (this.isNextButtonEnabled()) {
                    this.$nextResultButton.removeClass('disabled');
                }
                else {
                    this.$nextResultButton.addClass('disabled');
                }
            }
        };
        FooterPanel.prototype.updatePrevButton = function () {
            var searchResults = this.extension.searchResults;
            if (searchResults && searchResults.length) {
                if (this.isPreviousButtonEnabled()) {
                    this.$previousResultButton.removeClass('disabled');
                }
                else {
                    this.$previousResultButton.addClass('disabled');
                }
            }
        };
        FooterPanel.prototype.updatePrintButton = function () {
            var configEnabled = Utils.Bools.getBool(this.options.printEnabled, false);
            //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
            //if (configEnabled && printService && this.extension.isOnHomeDomain()){
            if (configEnabled) {
                this.$printButton.show();
            }
            else {
                this.$printButton.hide();
            }
        };
        FooterPanel.prototype.search = function (terms) {
            this.terms = terms;
            if (this.terms === '' || this.terms === this.content.enterKeyword) {
                this.extension.showMessage(this.config.modules.genericDialogue.content.emptyValue, function () {
                    this.$searchText.focus();
                });
                return;
            }
            // blur search field
            this.$searchText.blur();
            this.showSearchSpinner();
            $.publish(Commands.SEARCH, [this.terms]);
        };
        FooterPanel.prototype.getSearchResultPlacemarkers = function () {
            return this.$searchResultsContainer.find('.searchResultPlacemarker');
        };
        FooterPanel.prototype.setCurrentSearchResultPlacemarker = function () {
            var placemarkers = this.getSearchResultPlacemarkers();
            placemarkers.parent().find('.current').removeClass('current');
            var $current = $('.searchResultPlacemarker[data-index="' + this.extension.helper.canvasIndex + '"]');
            $current.addClass('current');
        };
        FooterPanel.prototype.positionSearchResultPlacemarkers = function () {
            var results = this.extension.searchResults;
            if (!results.length)
                return;
            // clear all existing placemarkers
            var placemarkers = this.getSearchResultPlacemarkers();
            placemarkers.remove();
            var pageWidth = this.getPageLineRatio();
            var lineTop = this.$line.position().top;
            var lineLeft = this.$line.position().left;
            var that = this;
            // for each page with a result, place a marker along the line.
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var distance = result.canvasIndex * pageWidth;
                var $placemarker = $('<div class="searchResultPlacemarker" data-index="' + result.canvasIndex + '"></div>');
                $placemarker[0].ontouchstart = function (e) { that.onPlacemarkerTouchStart.call(this, that); };
                $placemarker.click(function (e) { that.onPlacemarkerClick.call(this, that); });
                $placemarker.mouseenter(function (e) { that.onPlacemarkerMouseEnter.call(this, that); });
                $placemarker.mouseleave(function (e) { that.onPlacemarkerMouseLeave.call(this, e, that); });
                this.$searchResultsContainer.append($placemarker);
                var top = lineTop - $placemarker.height();
                var left = lineLeft + distance - ($placemarker.width() / 2);
                $placemarker.css({
                    top: top,
                    left: left
                });
            }
        };
        FooterPanel.prototype.onPlacemarkerTouchStart = function (that) {
            that.placemarkerTouched = true;
            var $placemarker = $(this);
            var index = parseInt($placemarker.attr('data-index'));
            $.publish(Commands.VIEW_PAGE, [index]);
        };
        FooterPanel.prototype.onPlacemarkerClick = function (that) {
            if (that.placemarkerTouched)
                return;
            that.placemarkerTouched = false;
            var $placemarker = $(this);
            var index = parseInt($placemarker.attr('data-index'));
            $.publish(Commands.VIEW_PAGE, [index]);
        };
        FooterPanel.prototype.onPlacemarkerMouseEnter = function (that) {
            if (that.placemarkerTouched)
                return;
            var $placemarker = $(this);
            $placemarker.addClass('hover');
            var canvasIndex = parseInt($placemarker.attr('data-index'));
            $.publish(Commands.SEARCH_PREVIEW_START, [canvasIndex]);
            var placemarkers = that.getSearchResultPlacemarkers();
            var elemIndex = placemarkers.index($placemarker[0]);
            that.currentPlacemarkerIndex = canvasIndex;
            that.$placemarkerDetails.show();
            var title = "{0} {1}";
            var mode = that.extension.getMode();
            if (mode.toString() === Mode.page.toString()) {
                var canvas = that.extension.helper.getCanvasByIndex(canvasIndex);
                var label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
                if (label === "") {
                    label = this.extension.helper.manifest.options.defaultLabel;
                }
                title = String.format(title, that.content.pageCaps, label);
            }
            else {
                title = String.format(title, that.content.imageCaps, canvasIndex + 1);
            }
            that.$placemarkerDetailsTop.html(title);
            var result = that.extension.searchResults[elemIndex];
            var terms = Utils.Strings.ellipsis(that.terms, that.options.elideDetailsTermsCount);
            var instancesFoundText;
            if (result.rects.length === 1) {
                instancesFoundText = that.content.instanceFound;
                instancesFoundText = String.format(instancesFoundText, terms);
            }
            else {
                instancesFoundText = that.content.instancesFound;
                instancesFoundText = String.format(instancesFoundText, result.rects.length, terms);
            }
            that.$placemarkerDetailsBottom.html(instancesFoundText);
            var pos = $placemarker.position();
            var top = pos.top - that.$placemarkerDetails.height();
            var left = pos.left;
            if (left < that.$placemarkerDetails.width() / 2) {
                left = 0 - ($placemarker.width() / 2);
            }
            else if (left > that.$line.width() - (that.$placemarkerDetails.width() / 2)) {
                left = that.$line.width() - that.$placemarkerDetails.width() + ($placemarker.width() / 2);
            }
            else {
                left -= (that.$placemarkerDetails.width() / 2);
            }
            that.$placemarkerDetails.css({
                top: top,
                left: left
            });
        };
        FooterPanel.prototype.onPlacemarkerMouseLeave = function (e, that) {
            $.publish(Commands.SEARCH_PREVIEW_FINISH);
            var $placemarker = $(this);
            var newElement = e.toElement || e.relatedTarget;
            var isChild = $(newElement).closest(that.$placemarkerDetails).length;
            if (newElement != that.$placemarkerDetails.get(0) && isChild === 0) {
                that.$placemarkerDetails.hide();
                $placemarker.removeClass('hover');
            }
        };
        FooterPanel.prototype.setPageMarkerPosition = function () {
            if (this.extension.helper.canvasIndex == null)
                return;
            // position placemarker showing current page.
            var pageLineRatio = this.getPageLineRatio();
            var lineTop = this.$line.position().top;
            var lineLeft = this.$line.position().left;
            var position = this.extension.helper.canvasIndex * pageLineRatio;
            var top = lineTop;
            var left = lineLeft + position;
            this.$pagePositionMarker.css({
                top: top,
                left: left
            });
            // if the remaining distance to the right is less than the width of the label
            // shift it to the left.
            var lineWidth = this.$line.width();
            if (left + this.$pagePositionLabel.outerWidth(true) > lineWidth) {
                left -= this.$pagePositionLabel.outerWidth(true);
                this.$pagePositionLabel.removeClass('right');
                this.$pagePositionLabel.addClass('left');
            }
            else {
                this.$pagePositionLabel.removeClass('left');
                this.$pagePositionLabel.addClass('right');
            }
            this.$pagePositionLabel.css({
                top: top,
                left: left
            });
        };
        FooterPanel.prototype.clearSearchResults = function () {
            this.extension.searchResults = [];
            // clear all existing placemarkers
            var placemarkers = this.getSearchResultPlacemarkers();
            placemarkers.remove();
            // clear search input field.
            this.$searchText.val(this.content.enterKeyword);
            // hide pager.
            this.$searchContainer.show();
            this.$searchPagerContainer.hide();
            // set focus to search box.
            this.$searchText.focus();
        };
        FooterPanel.prototype.getPageLineRatio = function () {
            var lineWidth = this.$line.width();
            // find page/width ratio by dividing the line width by the number of pages in the book.
            if (this.extension.helper.getTotalCanvases() === 1)
                return 0;
            return lineWidth / (this.extension.helper.getTotalCanvases() - 1);
        };
        FooterPanel.prototype.canvasIndexChanged = function () {
            this.setPageMarkerPosition();
            this.setPlacemarkerLabel();
        };
        FooterPanel.prototype.settingsChanged = function () {
            this.setPlacemarkerLabel();
        };
        FooterPanel.prototype.setPlacemarkerLabel = function () {
            var displaying = this.content.displaying;
            var index = this.extension.helper.canvasIndex;
            if (this.isPageModeEnabled()) {
                var canvas = this.extension.helper.getCanvasByIndex(index);
                var label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
                if (label === "") {
                    label = this.content.defaultLabel;
                }
                var lastCanvasOrderLabel = this.extension.helper.getLastCanvasLabel(true);
                this.$pagePositionLabel.html(String.format(displaying, this.content.page, this.extension.sanitize(label), this.extension.sanitize(lastCanvasOrderLabel)));
            }
            else {
                this.$pagePositionLabel.html(String.format(displaying, this.content.image, index + 1, this.extension.helper.getTotalCanvases()));
            }
        };
        FooterPanel.prototype.isPageModeEnabled = function () {
            return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode.page.toString();
        };
        FooterPanel.prototype.showSearchSpinner = function () {
            this.$searchText.addClass('searching');
        };
        FooterPanel.prototype.hideSearchSpinner = function () {
            this.$searchText.removeClass('searching');
        };
        FooterPanel.prototype.displaySearchResults = function (terms, results) {
            if (!results)
                return;
            this.hideSearchSpinner();
            this.positionSearchResultPlacemarkers();
            // show pager.
            this.$searchContainer.hide();
            this.$searchPagerControls.css({
                'left': 0
            });
            var $number = this.$searchPagerContainer.find('.number');
            $number.text(this.extension.getTotalSearchResultRects());
            var foundFor = this.$searchResultsInfo.find('.foundFor');
            if (results.length === 1) {
                foundFor.html(this.content.resultFoundFor);
            }
            else {
                foundFor.html(this.content.resultsFoundFor);
            }
            var $terms = this.$searchPagerContainer.find('.terms');
            $terms.html(Utils.Strings.ellipsis(terms, this.options.elideResultsTermsCount));
            $terms.prop('title', terms);
            this.$searchPagerContainer.show();
            this.resize();
        };
        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var searchResults = this.extension.searchResults;
            if (searchResults && searchResults.length) {
                this.positionSearchResultPlacemarkers();
            }
            this.setPageMarkerPosition();
            this.$searchPagerContainer.width(this.$element.width());
            var center = this.$element.width() / 2;
            // position search pager controls.
            this.$searchPagerControls.css({
                'left': center - (this.$searchPagerControls.width() / 2)
            });
            // position search input.
            this.$searchOptions.css({
                'left': center - (this.$searchOptions.outerWidth() / 2)
            });
        };
        return FooterPanel;
    })(BaseFooterPanel);
    return FooterPanel;
});
//# sourceMappingURL=FooterPanel.js.map