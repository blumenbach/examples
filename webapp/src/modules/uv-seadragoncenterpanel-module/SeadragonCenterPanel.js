var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../../extensions/uv-seadragon-extension/Bounds", "../uv-shared-module/CenterPanel", "../../extensions/uv-seadragon-extension/Commands", "../uv-shared-module/Metrics", "../../Params"], function (require, exports, BaseCommands, Bounds, CenterPanel, Commands, Metrics, Params) {
    var SeadragonCenterPanel = (function (_super) {
        __extends(SeadragonCenterPanel, _super);
        function SeadragonCenterPanel($element) {
            _super.call(this, $element);
            this.controlsVisible = false;
            this.isCreated = false;
            this.isFirstLoad = true;
            this.nextButtonEnabled = false;
            this.prevButtonEnabled = false;
        }
        SeadragonCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('seadragonCenterPanel');
            _super.prototype.create.call(this);
            this.$viewer = $('<div id="viewer"></div>');
            this.$content.prepend(this.$viewer);
            $.subscribe(BaseCommands.SETTINGS_CHANGED, function (e, args) {
                _this.viewer.gestureSettingsMouse.clickToZoom = args.clickToZoomEnabled;
            });
            $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                _this.whenResized(function () {
                    if (!_this.isCreated)
                        _this.createUI();
                    _this.openMedia(resources);
                });
            });
            $.subscribe(Commands.CLEAR_SEARCH, function () {
                _this.whenCreated(function () {
                    _this.extension.currentSearchResultRect = null;
                    _this.clearSearchResults();
                });
            });
            $.subscribe(Commands.VIEW_PAGE, function () {
                _this.extension.previousSearchResultRect = null;
                _this.extension.currentSearchResultRect = null;
            });
            $.subscribe(Commands.NEXT_SEARCH_RESULT, function () {
                _this.whenCreated(function () {
                    _this.nextSearchResult();
                });
            });
            $.subscribe(Commands.PREV_SEARCH_RESULT, function () {
                _this.whenCreated(function () {
                    _this.prevSearchResult();
                });
            });
            $.subscribe(Commands.ZOOM_IN, function () {
                _this.whenCreated(function () {
                    _this.zoomIn();
                });
            });
            $.subscribe(Commands.ZOOM_OUT, function () {
                _this.whenCreated(function () {
                    _this.zoomOut();
                });
            });
            $.subscribe(Commands.ROTATE, function () {
                _this.whenCreated(function () {
                    _this.rotateRight();
                });
            });
            $.subscribe(BaseCommands.METRIC_CHANGED, function () {
                _this.whenCreated(function () {
                    _this.updateResponsiveView();
                });
            });
        };
        SeadragonCenterPanel.prototype.whenResized = function (cb) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this.isResized;
            }, cb);
        };
        SeadragonCenterPanel.prototype.whenCreated = function (cb) {
            var _this = this;
            Utils.Async.waitFor(function () {
                return _this.isCreated;
            }, cb);
        };
        SeadragonCenterPanel.prototype.zoomIn = function () {
            this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 2);
        };
        SeadragonCenterPanel.prototype.zoomOut = function () {
            this.viewer.viewport.zoomTo(this.viewer.viewport.getZoom(true) * 0.5);
        };
        SeadragonCenterPanel.prototype.rotateRight = function () {
            this.viewer.viewport.setRotation(this.viewer.viewport.getRotation() + 90);
        };
        SeadragonCenterPanel.prototype.updateResponsiveView = function () {
            this.setNavigatorVisible();
            if (this.extension.metric === Metrics.MOBILE_LANDSCAPE) {
                this.viewer.autoHideControls = false;
                this.$viewportNavButtons.hide();
            }
            else {
                this.viewer.autoHideControls = true;
                this.$viewportNavButtons.show();
            }
        };
        SeadragonCenterPanel.prototype.createUI = function () {
            var _this = this;
            var that = this;
            this.$spinner = $('<div class="spinner"></div>');
            this.$content.append(this.$spinner);
            this.updateAttribution();
            // todo: use compiler flag (when available)
            var prefixUrl = (window.DEBUG) ? 'modules/uv-seadragoncenterpanel-module/img/' : 'themes/' + this.extension.config.options.theme + '/img/uv-seadragoncenterpanel-module/';
            // add to window object for testing automation purposes.
            window.openSeadragonViewer = this.viewer = OpenSeadragon({
                id: "viewer",
                ajaxWithCredentials: false,
                showNavigationControl: true,
                showNavigator: true,
                showRotationControl: true,
                showHomeControl: Utils.Bools.getBool(this.config.options.showHomeControl, false),
                showFullPageControl: false,
                defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
                maxZoomPixelRatio: this.config.options.maxZoomPixelRatio || 2,
                controlsFadeDelay: this.config.options.controlsFadeDelay || 250,
                controlsFadeLength: this.config.options.controlsFadeLength || 250,
                navigatorPosition: this.config.options.navigatorPosition || "BOTTOM_RIGHT",
                animationTime: this.config.options.animationTime || 1.2,
                visibilityRatio: this.config.options.visibilityRatio || 0.5,
                constrainDuringPan: Utils.Bools.getBool(this.config.options.constrainDuringPan, false),
                immediateRender: Utils.Bools.getBool(this.config.options.immediateRender, false),
                blendTime: this.config.options.blendTime || 0,
                autoHideControls: Utils.Bools.getBool(this.config.options.autoHideControls, true),
                prefixUrl: prefixUrl,
                gestureSettingsMouse: {
                    clickToZoom: !!this.extension.config.options.clickToZoomEnabled
                },
                navImages: {
                    zoomIn: {
                        REST: 'zoom_in.png',
                        GROUP: 'zoom_in.png',
                        HOVER: 'zoom_in.png',
                        DOWN: 'zoom_in.png'
                    },
                    zoomOut: {
                        REST: 'zoom_out.png',
                        GROUP: 'zoom_out.png',
                        HOVER: 'zoom_out.png',
                        DOWN: 'zoom_out.png'
                    },
                    home: {
                        REST: 'home.png',
                        GROUP: 'home.png',
                        HOVER: 'home.png',
                        DOWN: 'home.png'
                    },
                    rotateright: {
                        REST: 'rotate_right.png',
                        GROUP: 'rotate_right.png',
                        HOVER: 'rotate_right.png',
                        DOWN: 'rotate_right.png'
                    },
                    rotateleft: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    next: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    previous: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    }
                }
            });
            this.$zoomInButton = this.$viewer.find('div[title="Zoom in"]');
            this.$zoomInButton.attr('tabindex', 0);
            this.$zoomInButton.prop('title', this.content.zoomIn);
            this.$zoomInButton.addClass('zoomIn viewportNavButton');
            this.$zoomOutButton = this.$viewer.find('div[title="Zoom out"]');
            this.$zoomOutButton.attr('tabindex', 0);
            this.$zoomOutButton.prop('title', this.content.zoomOut);
            this.$zoomOutButton.addClass('zoomOut viewportNavButton');
            this.$goHomeButton = this.$viewer.find('div[title="Go home"]');
            this.$goHomeButton.attr('tabindex', 0);
            this.$goHomeButton.prop('title', this.content.goHome);
            this.$goHomeButton.addClass('goHome viewportNavButton');
            this.$rotateButton = this.$viewer.find('div[title="Rotate right"]');
            this.$rotateButton.attr('tabindex', 0);
            this.$rotateButton.prop('title', this.content.rotateRight);
            this.$rotateButton.addClass('rotate viewportNavButton');
            this.$viewportNavButtonsContainer = this.$viewer.find('.openseadragon-container > div:not(.openseadragon-canvas):first');
            this.$viewportNavButtons = this.$viewportNavButtonsContainer.find('.viewportNavButton');
            this.$canvas = $(this.viewer.canvas);
            if (!window.DEBUG) {
                this.$canvas.on('contextmenu', function (e) { return false; });
            }
            this.$navigator = this.$viewer.find(".navigator");
            this.setNavigatorVisible();
            // events
            this.$element.on('mousemove', function (e) {
                if (_this.controlsVisible)
                    return;
                _this.controlsVisible = true;
                _this.viewer.setControlsEnabled(true);
            });
            this.$element.on('mouseleave', function (e) {
                if (!_this.controlsVisible)
                    return;
                _this.controlsVisible = false;
                _this.viewer.setControlsEnabled(false);
            });
            // when mouse move stopped
            this.$element.on('mousemove', function (e) {
                // if over element, hide controls.
                if (!_this.$viewer.find('.navigator').ismouseover()) {
                    if (!_this.controlsVisible)
                        return;
                    _this.controlsVisible = false;
                    _this.viewer.setControlsEnabled(false);
                }
            }, this.config.options.controlsFadeAfterInactive);
            this.viewer.addHandler('tile-drawn', function () {
                _this.$spinner.hide();
            });
            //this.viewer.addHandler("open-failed", () => {
            //});
            this.viewer.addHandler('resize', function (viewer) {
                $.publish(Commands.SEADRAGON_RESIZE, [viewer]);
                _this.viewerResize(viewer);
            });
            this.viewer.addHandler('animation-start', function (viewer) {
                $.publish(Commands.SEADRAGON_ANIMATION_START, [viewer]);
            });
            this.viewer.addHandler('animation', function (viewer) {
                $.publish(Commands.SEADRAGON_ANIMATION, [viewer]);
            });
            this.viewer.addHandler('animation-finish', function (viewer) {
                _this.currentBounds = _this.getViewportBounds();
                _this.updateVisibleSearchResultRects();
                $.publish(Commands.SEADRAGON_ANIMATION_FINISH, [viewer]);
            });
            this.viewer.addHandler('rotate', function (args) {
                $.publish(Commands.SEADRAGON_ROTATION, [args.degrees]);
            });
            this.title = this.extension.helper.getLabel();
            this.createNavigationButtons();
            this.hidePrevButton();
            this.hideNextButton();
            this.isCreated = true;
            this.resize();
        };
        SeadragonCenterPanel.prototype.createNavigationButtons = function () {
            var viewingDirection = this.extension.helper.getViewingDirection();
            this.$prevButton = $('<div class="paging btn prev" tabindex="0"></div>');
            this.$prevButton.prop('title', this.content.previous);
            this.$nextButton = $('<div class="paging btn next" tabindex="0"></div>');
            this.$nextButton.prop('title', this.content.next);
            this.viewer.addControl(this.$prevButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
            this.viewer.addControl(this.$nextButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT });
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.bottomToTop().toString():
                case manifesto.ViewingDirection.topToBottom().toString():
                    this.$prevButton.addClass('vertical');
                    this.$nextButton.addClass('vertical');
                    ;
                    break;
            }
            var that = this;
            this.$prevButton.onPressed(function (e) {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
                if (!that.prevButtonEnabled)
                    return;
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
            this.$nextButton.onPressed(function (e) {
                e.preventDefault();
                OpenSeadragon.cancelEvent(e);
                if (!that.nextButtonEnabled)
                    return;
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
        };
        SeadragonCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            this.$spinner.show();
            this.items = [];
            // todo: this should be a more specific Manifold.IImageResource
            this.extension.getExternalResources(resources).then(function (resources) {
                // OSD can open an array info.json objects
                //this.viewer.open(resources);
                _this.viewer.close();
                resources = _this.getPagePositions(resources);
                for (var i = 0; i < resources.length; i++) {
                    var resource = resources[i];
                    _this.viewer.addTiledImage({
                        tileSource: resource,
                        x: resource.x,
                        y: resource.y,
                        width: resource.width,
                        success: function (item) {
                            _this.items.push(item);
                            if (_this.items.length === resources.length) {
                                _this.openPagesHandler();
                            }
                        }
                    });
                }
            });
        };
        SeadragonCenterPanel.prototype.getPagePositions = function (resources) {
            var leftPage;
            var rightPage;
            var topPage;
            var bottomPage;
            var page;
            var nextPage;
            // if there's more than one image, determine alignment strategy
            if (resources.length > 1) {
                if (resources.length === 2) {
                    // recto verso
                    if (this.extension.helper.isVerticallyAligned()) {
                        // vertical alignment
                        topPage = resources[0];
                        topPage.y = 0;
                        bottomPage = resources[1];
                        bottomPage.y = topPage.height + this.config.options.pageGap;
                    }
                    else {
                        // horizontal alignment
                        leftPage = resources[0];
                        leftPage.x = 0;
                        rightPage = resources[1];
                        rightPage.x = leftPage.width + this.config.options.pageGap;
                    }
                }
                else {
                    // scroll
                    if (this.extension.helper.isVerticallyAligned()) {
                        // vertical alignment
                        if (this.extension.helper.isTopToBottom()) {
                            // top to bottom
                            for (var i = 0; i < resources.length - 1; i++) {
                                page = resources[i];
                                nextPage = resources[i + 1];
                                nextPage.y = (page.y || 0) + page.height;
                                ;
                            }
                        }
                        else {
                            // bottom to top
                            for (var i = resources.length; i > 0; i--) {
                                page = resources[i];
                                nextPage = resources[i - 1];
                                nextPage.y = (page.y || 0) - page.height;
                            }
                        }
                    }
                    else {
                        // horizontal alignment
                        if (this.extension.helper.isLeftToRight()) {
                            // left to right
                            for (var i = 0; i < resources.length - 1; i++) {
                                page = resources[i];
                                nextPage = resources[i + 1];
                                nextPage.x = (page.x || 0) + page.width;
                            }
                        }
                        else {
                            // right to left
                            for (var i = resources.length - 1; i > 0; i--) {
                                page = resources[i];
                                nextPage = resources[i - 1];
                                nextPage.x = (page.x || 0) - page.width;
                            }
                        }
                    }
                }
            }
            return resources;
        };
        SeadragonCenterPanel.prototype.openPagesHandler = function () {
            $.publish(Commands.SEADRAGON_OPEN);
            // check for initial zoom/rotation params.
            if (this.isFirstLoad) {
                this.initialRotation = this.extension.getParam(Params.rotation);
                if (this.initialRotation) {
                    this.viewer.viewport.setRotation(parseInt(this.initialRotation));
                }
                this.initialBounds = this.extension.getParam(Params.xywh);
                if (this.initialBounds) {
                    this.initialBounds = Bounds.fromString(this.initialBounds);
                    this.currentBounds = this.initialBounds;
                    this.fitToBounds(this.currentBounds);
                }
                else {
                    this.goHome();
                }
            }
            else {
                // it's not the first load
                var settings = this.extension.getSettings();
                // zoom to bounds unless setting disabled
                if (settings.preserveViewport && this.currentBounds) {
                    this.fitToBounds(this.currentBounds);
                }
                else {
                    this.goHome();
                }
            }
            if (this.extension.helper.isMultiCanvas() && !this.extension.helper.isContinuous()) {
                this.showPrevButton();
                this.showNextButton();
                $('.navigator').addClass('extraMargin');
                var viewingDirection = this.extension.helper.getViewingDirection();
                if (viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString()) {
                    if (this.extension.helper.isFirstCanvas()) {
                        this.disableNextButton();
                    }
                    else {
                        this.enableNextButton();
                    }
                    if (this.extension.helper.isLastCanvas()) {
                        this.disablePrevButton();
                    }
                    else {
                        this.enablePrevButton();
                    }
                }
                else {
                    if (this.extension.helper.isFirstCanvas()) {
                        this.disablePrevButton();
                    }
                    else {
                        this.enablePrevButton();
                    }
                    if (this.extension.helper.isLastCanvas()) {
                        this.disableNextButton();
                    }
                    else {
                        this.enableNextButton();
                    }
                }
            }
            this.setNavigatorVisible();
            this.isFirstLoad = false;
            this.overlaySearchResults();
            var searchResultRect = this.getInitialSearchResultRect();
            this.extension.previousSearchResultRect = null;
            this.extension.currentSearchResultRect = null;
            if (searchResultRect && this.isZoomToSearchResultEnabled()) {
                this.zoomToSearchResult(searchResultRect);
            }
        };
        SeadragonCenterPanel.prototype.goHome = function () {
            this.viewer.viewport.goHome(true);
        };
        SeadragonCenterPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.addClass('disabled');
        };
        SeadragonCenterPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.removeClass('disabled');
        };
        SeadragonCenterPanel.prototype.hidePrevButton = function () {
            this.disablePrevButton();
            this.$prevButton.hide();
        };
        SeadragonCenterPanel.prototype.showPrevButton = function () {
            this.enablePrevButton();
            this.$prevButton.show();
        };
        SeadragonCenterPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.addClass('disabled');
        };
        SeadragonCenterPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.removeClass('disabled');
        };
        SeadragonCenterPanel.prototype.hideNextButton = function () {
            this.disableNextButton();
            this.$nextButton.hide();
        };
        SeadragonCenterPanel.prototype.showNextButton = function () {
            this.enableNextButton();
            this.$nextButton.show();
        };
        SeadragonCenterPanel.prototype.serialiseBounds = function (bounds) {
            return bounds.x + ',' + bounds.y + ',' + bounds.width + ',' + bounds.height;
        };
        SeadragonCenterPanel.prototype.fitToBounds = function (bounds, immediate) {
            if (immediate === void 0) { immediate = true; }
            var rect = new OpenSeadragon.Rect();
            rect.x = Number(bounds.x);
            rect.y = Number(bounds.y);
            rect.width = Number(bounds.w);
            rect.height = Number(bounds.h);
            this.viewer.viewport.fitBoundsWithConstraints(rect, immediate);
        };
        SeadragonCenterPanel.prototype.getCroppedImageBounds = function () {
            if (!this.viewer || !this.viewer.viewport)
                return null;
            var canvas = this.extension.helper.getCurrentCanvas();
            var dimensions = this.extension.getCroppedImageDimensions(canvas, this.viewer);
            var bounds = new Bounds(dimensions.regionPos.x, dimensions.regionPos.y, dimensions.region.width, dimensions.region.height);
            return bounds.toString();
        };
        SeadragonCenterPanel.prototype.getViewportBounds = function () {
            if (!this.viewer || !this.viewer.viewport)
                return null;
            var b = this.viewer.viewport.getBounds(true);
            var bounds = new Bounds(Math.floor(b.x), Math.floor(b.y), Math.floor(b.width), Math.floor(b.height));
            return bounds.toString();
        };
        SeadragonCenterPanel.prototype.viewerResize = function (viewer) {
            if (!viewer.viewport)
                return;
            var center = viewer.viewport.getCenter(true);
            if (!center)
                return;
            // postpone pan for a millisecond - fixes iPad image stretching/squashing issue.
            setTimeout(function () {
                viewer.viewport.panTo(center, true);
            }, 1);
        };
        SeadragonCenterPanel.prototype.clearSearchResults = function () {
            this.$canvas.find('.searchOverlay').hide();
        };
        SeadragonCenterPanel.prototype.overlaySearchResults = function () {
            var searchResults = this.getSearchResultsForCurrentImages();
            for (var i = 0; i < searchResults.length; i++) {
                var searchResult = searchResults[i];
                var overlayRects = this.getSearchOverlayRects(searchResult);
                for (var k = 0; k < overlayRects.length; k++) {
                    var overlayRect = overlayRects[k];
                    var div = document.createElement('div');
                    div.id = 'searchResult-' + overlayRect.canvasIndex + '-' + overlayRect.resultIndex;
                    div.className = 'searchOverlay';
                    div.title = this.extension.sanitize(overlayRect.chars);
                    this.viewer.addOverlay(div, overlayRect);
                }
            }
        };
        SeadragonCenterPanel.prototype.getSearchResultsForCurrentImages = function () {
            var searchResultsForCurrentImages = [];
            var searchResults = this.extension.searchResults;
            if (!searchResults.length)
                return searchResultsForCurrentImages;
            var indices = this.extension.getPagedIndices();
            for (var i = 0; i < indices.length; i++) {
                var canvasIndex = indices[i];
                for (var j = 0; j < searchResults.length; j++) {
                    if (searchResults[j].canvasIndex === canvasIndex) {
                        searchResultsForCurrentImages.push(searchResults[j]);
                        break;
                    }
                }
            }
            return searchResultsForCurrentImages;
        };
        SeadragonCenterPanel.prototype.getSearchResultRectsForCurrentImages = function () {
            var searchResults = this.getSearchResultsForCurrentImages();
            return searchResults.en().selectMany(function (x) { return x.rects; }).toArray();
        };
        SeadragonCenterPanel.prototype.updateVisibleSearchResultRects = function () {
            // after animating, loop through all search result rects and flag their visibility based on whether they are inside the current viewport.
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            for (var i = 0; i < searchResultRects.length; i++) {
                var rect = searchResultRects[i];
                var viewportBounds = this.viewer.viewport.getBounds();
                rect.isVisible = Utils.Measurements.Dimensions.hitRect(viewportBounds.x, viewportBounds.y, viewportBounds.width, viewportBounds.height, rect.viewportX, rect.viewportY);
            }
        };
        SeadragonCenterPanel.prototype.getSearchResultRectIndex = function (searchResultRect) {
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            return searchResultRects.indexOf(searchResultRect);
        };
        SeadragonCenterPanel.prototype.isZoomToSearchResultEnabled = function () {
            return Utils.Bools.getBool(this.extension.config.options.zoomToSearchResultEnabled, true);
        };
        SeadragonCenterPanel.prototype.nextSearchResult = function () {
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            var currentSearchResultRectIndex = this.getSearchResultRectIndex(this.extension.currentSearchResultRect);
            var foundRect;
            for (var i = currentSearchResultRectIndex + 1; i < searchResultRects.length; i++) {
                var rect = searchResultRects[i];
                // this was removed as users found it confusing.
                // find the next visible or non-visible rect.
                //if (rect.isVisible) {
                //    continue;
                //} else {
                foundRect = rect;
                break;
            }
            if (foundRect && this.isZoomToSearchResultEnabled()) {
                // if the rect's canvasIndex is greater than the current canvasIndex
                if (rect.canvasIndex > this.extension.helper.canvasIndex) {
                    this.extension.currentSearchResultRect = rect;
                    $.publish(Commands.SEARCH_RESULT_CANVAS_CHANGED, [rect]);
                }
                else {
                    this.zoomToSearchResult(rect);
                }
            }
            else {
                $.publish(Commands.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            }
        };
        SeadragonCenterPanel.prototype.prevSearchResult = function () {
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            var currentSearchResultRectIndex = this.getSearchResultRectIndex(this.extension.currentSearchResultRect);
            var foundRect;
            for (var i = currentSearchResultRectIndex - 1; i >= 0; i--) {
                var rect = searchResultRects[i];
                // this was removed as users found it confusing.
                // find the prev visible or non-visible rect.
                //if (rect.isVisible) {
                //    continue;
                //} else {
                foundRect = rect;
                break;
            }
            if (foundRect && this.isZoomToSearchResultEnabled()) {
                // if the rect's canvasIndex is less than the current canvasIndex
                if (rect.canvasIndex < this.extension.helper.canvasIndex) {
                    this.extension.currentSearchResultRect = rect;
                    $.publish(Commands.SEARCH_RESULT_CANVAS_CHANGED, [rect]);
                }
                else {
                    this.zoomToSearchResult(rect);
                }
            }
            else {
                $.publish(Commands.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            }
        };
        SeadragonCenterPanel.prototype.getSearchResultRectByIndex = function (index) {
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            if (!searchResultRects.length)
                return null;
            return searchResultRects[index];
        };
        SeadragonCenterPanel.prototype.getInitialSearchResultRect = function () {
            var _this = this;
            var searchResultRects = this.getSearchResultRectsForCurrentImages();
            if (!searchResultRects.length)
                return null;
            // if the previous SearchResultRect had a canvasIndex higher than the current canvasIndex
            if (this.extension.previousSearchResultRect && this.extension.previousSearchResultRect.canvasIndex > this.extension.helper.canvasIndex) {
                return searchResultRects.en().where(function (x) { return x.canvasIndex === _this.extension.helper.canvasIndex; }).last();
            }
            // get the first rect with the current canvasindex.
            return searchResultRects.en().where(function (x) { return x.canvasIndex === _this.extension.helper.canvasIndex; }).first();
        };
        SeadragonCenterPanel.prototype.zoomToSearchResult = function (searchResultRect) {
            this.extension.previousSearchResultRect = this.extension.currentSearchResultRect || searchResultRect;
            this.extension.currentSearchResultRect = searchResultRect;
            this.fitToBounds(new Bounds(searchResultRect.viewportX, searchResultRect.viewportY, searchResultRect.width, searchResultRect.height), false);
            this.highlightSearchResultRect(searchResultRect);
            $.publish(Commands.SEARCH_RESULT_RECT_CHANGED);
        };
        SeadragonCenterPanel.prototype.highlightSearchResultRect = function (searchResultRect) {
            var $rect = $('#searchResult-' + searchResultRect.canvasIndex + '-' + searchResultRect.index);
            $rect.addClass('current');
            $('.searchOverlay').not($rect).removeClass('current');
        };
        SeadragonCenterPanel.prototype.getSearchOverlayRects = function (searchResult) {
            var newRects = [];
            var resource = this.extension.resources.en().where(function (x) { return x.index === searchResult.canvasIndex; }).first();
            var index = this.extension.resources.indexOf(resource);
            var width = this.extension.resources[index].width;
            var offsetX = 0;
            if (index > 0) {
                offsetX = this.extension.resources[index - 1].width;
            }
            for (var i = 0; i < searchResult.rects.length; i++) {
                var searchRect = searchResult.rects[i];
                var x = (searchRect.x + offsetX) + ((index > 0) ? this.config.options.pageGap : 0);
                var y = searchRect.y;
                var w = searchRect.width;
                var h = searchRect.height;
                var rect = new OpenSeadragon.Rect(x, y, w, h);
                searchRect.viewportX = x;
                searchRect.viewportY = y;
                rect.canvasIndex = searchRect.canvasIndex;
                rect.resultIndex = searchRect.index;
                rect.chars = searchRect.chars;
                newRects.push(rect);
            }
            return newRects;
        };
        SeadragonCenterPanel.prototype.resize = function () {
            var _this = this;
            _super.prototype.resize.call(this);
            this.$viewer.height(this.$content.height() - this.$viewer.verticalMargins());
            this.$viewer.width(this.$content.width() - this.$viewer.horizontalMargins());
            if (!this.isCreated)
                return;
            if (this.currentBounds) {
                this.fitToBounds(typeof (this.currentBounds) == "string" ? Bounds.fromString(this.currentBounds) : this.currentBounds);
            }
            this.$title.ellipsisFill(this.extension.sanitize(this.title));
            this.$spinner.css('top', (this.$content.height() / 2) - (this.$spinner.height() / 2));
            this.$spinner.css('left', (this.$content.width() / 2) - (this.$spinner.width() / 2));
            var viewingDirection = this.extension.helper.getViewingDirection();
            if (this.extension.helper.isMultiCanvas() && this.$prevButton && this.$nextButton) {
                var verticalButtonPos = Math.floor(this.$content.width() / 2);
                switch (viewingDirection.toString()) {
                    case manifesto.ViewingDirection.bottomToTop().toString():
                        this.$prevButton.addClass('down');
                        this.$nextButton.addClass('up');
                        this.$prevButton.css('left', verticalButtonPos - (this.$prevButton.outerWidth() / 2));
                        this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()));
                        this.$nextButton.css('left', (verticalButtonPos * -1) - (this.$nextButton.outerWidth() / 2));
                        break;
                    case manifesto.ViewingDirection.topToBottom().toString():
                        this.$prevButton.css('left', verticalButtonPos - (this.$prevButton.outerWidth() / 2));
                        this.$nextButton.css('left', (verticalButtonPos * -1) - (this.$nextButton.outerWidth() / 2));
                        this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()));
                        break;
                    default:
                        this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
                        this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
                        break;
                }
            }
            // stretch navigator, allowing time for OSD to resize
            setTimeout(function () {
                if (_this.extension.helper.isContinuous()) {
                    if (_this.extension.helper.isHorizontallyAligned()) {
                        var width = _this.$viewer.width() - _this.$viewer.rightMargin();
                        _this.$navigator.width(width);
                    }
                    else {
                        _this.$navigator.height(_this.$viewer.height());
                    }
                }
            }, 100);
        };
        SeadragonCenterPanel.prototype.setFocus = function () {
            if (!this.$canvas.is(":focus")) {
                if (this.extension.config.options.allowStealFocus) {
                    this.$canvas.focus();
                }
            }
        };
        SeadragonCenterPanel.prototype.setNavigatorVisible = function () {
            var navigatorEnabled = Utils.Bools.getBool(this.extension.getSettings().navigatorEnabled, true) && this.extension.metric !== Metrics.MOBILE_LANDSCAPE;
            this.viewer.navigator.setVisible(navigatorEnabled);
            if (navigatorEnabled) {
                this.$navigator.show();
            }
            else {
                this.$navigator.hide();
            }
        };
        return SeadragonCenterPanel;
    })(CenterPanel);
    return SeadragonCenterPanel;
});
//# sourceMappingURL=SeadragonCenterPanel.js.map