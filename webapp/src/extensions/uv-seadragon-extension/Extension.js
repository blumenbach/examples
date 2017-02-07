var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../modules/uv-shared-module/BaseCommands", "../../modules/uv-shared-module/BaseExtension", "../../modules/uv-shared-module/Bookmark", "./Commands", "../../modules/uv-contentleftpanel-module/ContentLeftPanel", "./CroppedImageDimensions", "./DownloadDialogue", "../../modules/uv-dialogues-module/ExternalContentDialogue", "../../modules/uv-searchfooterpanel-module/FooterPanel", "../../modules/uv-dialogues-module/HelpDialogue", "../../modules/uv-shared-module/Metrics", "../../modules/uv-osdmobilefooterpanel-module/MobileFooter", "./Mode", "../../modules/uv-dialogues-module/MoreInfoDialogue", "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel", "../../modules/uv-multiselectdialogue-module/MultiSelectDialogue", "./MultiSelectionArgs", "../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel", "../../Params", "../../modules/uv-shared-module/Point", "../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel", "./SettingsDialogue", "./ShareDialogue", "../../modules/uv-shared-module/Shell"], function (require, exports, BaseCommands, BaseExtension, Bookmark, Commands, ContentLeftPanel, CroppedImageDimensions, DownloadDialogue, ExternalContentDialogue, FooterPanel, HelpDialogue, Metrics, MobileFooterPanel, Mode, MoreInfoDialogue, MoreInfoRightPanel, MultiSelectDialogue, MultiSelectionArgs, PagingHeaderPanel, Params, Point, SeadragonCenterPanel, SettingsDialogue, ShareDialogue, Shell) {
    var SearchResult = Manifold.SearchResult;
    var Size = Utils.Measurements.Size;
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(bootstrapper) {
            _super.call(this, bootstrapper);
            this.currentRotation = 0;
            this.isSearching = false;
            this.searchResults = [];
        }
        Extension.prototype.create = function (overrideDependencies) {
            var _this = this;
            _super.prototype.create.call(this, overrideDependencies);
            var that = this;
            $.subscribe(BaseCommands.METRIC_CHANGED, function () {
                if (_this.metric === Metrics.MOBILE_LANDSCAPE) {
                    var settings = {};
                    settings.pagingEnabled = false;
                    _this.updateSettings(settings);
                    $.publish(BaseCommands.UPDATE_SETTINGS);
                    Shell.$rightPanel.hide();
                }
                else {
                    Shell.$rightPanel.show();
                }
            });
            $.subscribe(Commands.CLEAR_SEARCH, function (e) {
                _this.searchResults = null;
                $.publish(Commands.SEARCH_RESULTS_CLEARED);
                _this.triggerSocket(Commands.CLEAR_SEARCH);
            });
            $.subscribe(BaseCommands.DOWN_ARROW, function (e) {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseCommands.END, function (e) {
                _this.viewPage(_this.helper.getLastPageIndex());
            });
            $.subscribe(Commands.FIRST, function (e) {
                _this.triggerSocket(Commands.FIRST);
                _this.viewPage(_this.helper.getFirstPageIndex());
            });
            $.subscribe(Commands.GALLERY_DECREASE_SIZE, function (e) {
                _this.triggerSocket(Commands.GALLERY_DECREASE_SIZE);
            });
            $.subscribe(Commands.GALLERY_INCREASE_SIZE, function (e) {
                _this.triggerSocket(Commands.GALLERY_INCREASE_SIZE);
            });
            $.subscribe(Commands.GALLERY_THUMB_SELECTED, function (e) {
                _this.triggerSocket(Commands.GALLERY_THUMB_SELECTED);
            });
            $.subscribe(BaseCommands.HOME, function (e) {
                _this.viewPage(_this.helper.getFirstPageIndex());
            });
            $.subscribe(Commands.IMAGE_SEARCH, function (e, index) {
                _this.triggerSocket(Commands.IMAGE_SEARCH, index);
                _this.viewPage(index);
            });
            $.subscribe(Commands.LAST, function (e) {
                _this.triggerSocket(Commands.LAST);
                _this.viewPage(_this.helper.getLastPageIndex());
            });
            $.subscribe(BaseCommands.LEFT_ARROW, function (e) {
                if (_this.useArrowKeysToNavigate()) {
                    _this.viewPage(_this.getPrevPageIndex());
                }
                else {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, function (e) {
                if (_this.metric !== Metrics.MOBILE_LANDSCAPE) {
                    Shell.$rightPanel.show();
                }
            });
            $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, function (e) {
                Shell.$centerPanel.show();
                _this.resize();
            });
            $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, function (e) {
                Shell.$centerPanel.hide();
                Shell.$rightPanel.hide();
            });
            $.subscribe(BaseCommands.MINUS, function (e) {
                _this.centerPanel.setFocus();
            });
            $.subscribe(Commands.MODE_CHANGED, function (e, mode) {
                _this.triggerSocket(Commands.MODE_CHANGED, mode);
                _this.mode = new Mode(mode);
                var settings = _this.getSettings();
                $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
            });
            $.subscribe(Commands.MULTISELECTION_MADE, function (e, ids) {
                var args = new MultiSelectionArgs();
                args.manifestUri = _this.helper.iiifResourceUri;
                args.allCanvases = ids.length === _this.helper.getCanvases().length;
                args.canvases = ids;
                args.format = _this.config.options.multiSelectionMimeType;
                args.sequence = _this.helper.getCurrentSequence().id;
                _this.triggerSocket(Commands.MULTISELECTION_MADE, args);
            });
            $.subscribe(Commands.NEXT, function (e) {
                _this.triggerSocket(Commands.NEXT);
                _this.viewPage(_this.getNextPageIndex());
            });
            $.subscribe(Commands.NEXT_SEARCH_RESULT, function () {
                _this.triggerSocket(Commands.NEXT_SEARCH_RESULT);
            });
            $.subscribe(Commands.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
                _this.triggerSocket(Commands.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
                _this.nextSearchResult();
            });
            $.subscribe(Commands.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
                _this.triggerSocket(Commands.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
                _this.prevSearchResult();
            });
            $.subscribe(Commands.OPEN_THUMBS_VIEW, function (e) {
                _this.triggerSocket(Commands.OPEN_THUMBS_VIEW);
            });
            $.subscribe(Commands.OPEN_TREE_VIEW, function (e) {
                _this.triggerSocket(Commands.OPEN_TREE_VIEW);
            });
            $.subscribe(BaseCommands.PAGE_DOWN, function (e) {
                _this.viewPage(_this.getNextPageIndex());
            });
            $.subscribe(Commands.PAGE_SEARCH, function (e, value) {
                _this.triggerSocket(Commands.PAGE_SEARCH, value);
                _this.viewLabel(value);
            });
            $.subscribe(BaseCommands.PAGE_UP, function (e) {
                _this.viewPage(_this.getPrevPageIndex());
            });
            $.subscribe(Commands.PAGING_TOGGLED, function (e, obj) {
                _this.triggerSocket(Commands.PAGING_TOGGLED, obj);
            });
            $.subscribe(BaseCommands.PLUS, function (e) {
                _this.centerPanel.setFocus();
            });
            $.subscribe(Commands.PREV, function (e) {
                _this.triggerSocket(Commands.PREV);
                _this.viewPage(_this.getPrevPageIndex());
            });
            $.subscribe(Commands.PREV_SEARCH_RESULT, function () {
                _this.triggerSocket(Commands.PREV_SEARCH_RESULT);
            });
            $.subscribe(Commands.PRINT, function () {
                _this.print();
            });
            $.subscribe(BaseCommands.RIGHT_ARROW, function (e) {
                if (_this.useArrowKeysToNavigate()) {
                    _this.viewPage(_this.getNextPageIndex());
                }
                else {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(Commands.SEADRAGON_ANIMATION, function () {
                _this.triggerSocket(Commands.SEADRAGON_ANIMATION);
            });
            $.subscribe(Commands.SEADRAGON_ANIMATION_FINISH, function (e, viewer) {
                if (_this.centerPanel && _this.centerPanel.currentBounds) {
                    _this.setParam(Params.xywh, _this.centerPanel.getViewportBounds());
                }
                var canvas = _this.helper.getCurrentCanvas();
                _this.triggerSocket(Commands.CURRENT_VIEW_URI, {
                    cropUri: _this.getCroppedImageUri(canvas, _this.getViewer()),
                    fullUri: _this.getConfinedImageUri(canvas, canvas.getWidth())
                });
            });
            $.subscribe(Commands.SEADRAGON_ANIMATION_START, function () {
                _this.triggerSocket(Commands.SEADRAGON_ANIMATION_START);
            });
            $.subscribe(Commands.SEADRAGON_OPEN, function () {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(Commands.SEADRAGON_RESIZE, function () {
                _this.triggerSocket(Commands.SEADRAGON_RESIZE);
            });
            $.subscribe(Commands.SEADRAGON_ROTATION, function (e, rotation) {
                _this.triggerSocket(Commands.SEADRAGON_ROTATION);
                _this.currentRotation = rotation;
                _this.setParam(Params.rotation, rotation);
            });
            $.subscribe(Commands.SEARCH, function (e, terms) {
                _this.triggerSocket(Commands.SEARCH, terms);
                _this.searchWithin(terms);
            });
            $.subscribe(Commands.SEARCH_PREVIEW_FINISH, function (e) {
                _this.triggerSocket(Commands.SEARCH_PREVIEW_FINISH);
            });
            $.subscribe(Commands.SEARCH_PREVIEW_START, function (e) {
                _this.triggerSocket(Commands.SEARCH_PREVIEW_START);
            });
            $.subscribe(Commands.SEARCH_RESULTS, function (e, obj) {
                _this.triggerSocket(Commands.SEARCH_RESULTS, obj);
            });
            $.subscribe(Commands.SEARCH_RESULT_CANVAS_CHANGED, function (e, rect) {
                _this.viewPage(rect.canvasIndex);
            });
            $.subscribe(Commands.SEARCH_RESULTS_EMPTY, function (e) {
                _this.triggerSocket(Commands.SEARCH_RESULTS_EMPTY);
            });
            $.subscribe(BaseCommands.THUMB_SELECTED, function (e, thumb) {
                _this.viewPage(thumb.index);
            });
            $.subscribe(Commands.TREE_NODE_SELECTED, function (e, node) {
                _this.triggerSocket(Commands.TREE_NODE_SELECTED, node.data.path);
                _this.treeNodeSelected(node);
            });
            $.subscribe(BaseCommands.UP_ARROW, function (e) {
                if (!_this.useArrowKeysToNavigate()) {
                    _this.centerPanel.setFocus();
                }
            });
            $.subscribe(BaseCommands.UPDATE_SETTINGS, function (e) {
                _this.viewPage(_this.helper.canvasIndex, true);
                var settings = _this.getSettings();
                $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
            });
            $.subscribe(Commands.VIEW_PAGE, function (e, index) {
                _this.triggerSocket(Commands.VIEW_PAGE, index);
                _this.viewPage(index);
            });
            Utils.Async.waitFor(function () {
                return _this.centerPanel && _this.centerPanel.isCreated;
            }, function () {
                _this.checkForSearchParam();
                _this.checkForRotationParam();
            });
        };
        Extension.prototype.createModules = function () {
            _super.prototype.createModules.call(this);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel = new PagingHeaderPanel(Shell.$headerPanel);
            }
            else {
                Shell.$headerPanel.hide();
            }
            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new ContentLeftPanel(Shell.$leftPanel);
            }
            else {
                Shell.$leftPanel.hide();
            }
            this.centerPanel = new SeadragonCenterPanel(Shell.$centerPanel);
            if (this.isRightPanelEnabled()) {
                this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
            }
            else {
                Shell.$rightPanel.hide();
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel = new FooterPanel(Shell.$footerPanel);
                this.mobileFooterPanel = new MobileFooterPanel(Shell.$mobileFooterPanel);
            }
            else {
                Shell.$footerPanel.hide();
            }
            this.$helpDialogue = $('<div class="overlay help"></div>');
            Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new HelpDialogue(this.$helpDialogue);
            this.$moreInfoDialogue = $('<div class="overlay moreInfo"></div>');
            Shell.$overlays.append(this.$moreInfoDialogue);
            this.moreInfoDialogue = new MoreInfoDialogue(this.$moreInfoDialogue);
            this.$multiSelectDialogue = $('<div class="overlay multiSelect"></div>');
            Shell.$overlays.append(this.$multiSelectDialogue);
            this.multiSelectDialogue = new MultiSelectDialogue(this.$multiSelectDialogue);
            this.$shareDialogue = $('<div class="overlay share"></div>');
            Shell.$overlays.append(this.$shareDialogue);
            this.shareDialogue = new ShareDialogue(this.$shareDialogue);
            this.$downloadDialogue = $('<div class="overlay download"></div>');
            Shell.$overlays.append(this.$downloadDialogue);
            this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);
            this.$settingsDialogue = $('<div class="overlay settings"></div>');
            Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);
            this.$externalContentDialogue = $('<div class="overlay externalContent"></div>');
            Shell.$overlays.append(this.$externalContentDialogue);
            this.externalContentDialogue = new ExternalContentDialogue(this.$externalContentDialogue);
            if (this.isHeaderPanelEnabled()) {
                this.headerPanel.init();
            }
            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
            if (this.isFooterPanelEnabled()) {
                this.footerPanel.init();
            }
        };
        Extension.prototype.checkForSearchParam = function () {
            // if a h value is in the hash params, do a search.
            if (this.isDeepLinkingEnabled()) {
                // if a highlight param is set, use it to search.
                var highlight = this.getParam(Params.highlight);
                if (highlight) {
                    highlight.replace(/\+/g, " ").replace(/"/g, "");
                    $.publish(Commands.SEARCH, [highlight]);
                }
            }
        };
        Extension.prototype.checkForRotationParam = function () {
            // if a rotation value is in the hash params, set currentRotation
            if (this.isDeepLinkingEnabled()) {
                var rotation = Number(this.getParam(Params.rotation));
                if (rotation) {
                    $.publish(Commands.SEADRAGON_ROTATION, [rotation]);
                }
            }
        };
        Extension.prototype.viewPage = function (canvasIndex, isReload) {
            // if it's a valid canvas index.
            if (canvasIndex === -1)
                return;
            if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
                this.showMessage(this.config.content.canvasIndexOutOfRange);
                canvasIndex = 0;
            }
            if (this.isPagingSettingEnabled() && !isReload) {
                var indices = this.getPagedIndices(canvasIndex);
                // if the page is already displayed, only advance canvasIndex.
                if (indices.contains(this.helper.canvasIndex)) {
                    this.viewCanvas(canvasIndex);
                    return;
                }
            }
            this.viewCanvas(canvasIndex);
        };
        Extension.prototype.getViewer = function () {
            return this.centerPanel.viewer;
        };
        Extension.prototype.getMode = function () {
            if (this.mode)
                return this.mode;
            switch (this.helper.getManifestType().toString()) {
                case manifesto.ManifestType.monograph().toString():
                    return Mode.page;
                    break;
                case manifesto.ManifestType.manuscript().toString():
                    return Mode.page;
                    break;
                default:
                    return Mode.image;
            }
        };
        Extension.prototype.getViewportBounds = function () {
            if (!this.centerPanel)
                return null;
            var bounds = this.centerPanel.getViewportBounds();
            return bounds;
        };
        Extension.prototype.getViewerRotation = function () {
            if (!this.centerPanel)
                return null;
            return this.currentRotation;
        };
        Extension.prototype.viewRange = function (path) {
            //this.currentRangePath = path;
            var range = this.helper.getRangeByPath(path);
            if (!range)
                return;
            var canvasId = range.getCanvasIds()[0];
            var index = this.helper.getCanvasIndexById(canvasId);
            this.viewPage(index);
        };
        Extension.prototype.viewLabel = function (label) {
            if (!label) {
                this.showMessage(this.config.modules.genericDialogue.content.emptyValue);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }
            var index = this.helper.getCanvasIndexByLabel(label);
            if (index != -1) {
                this.viewPage(index);
            }
            else {
                this.showMessage(this.config.modules.genericDialogue.content.pageNotFound);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
            }
        };
        Extension.prototype.treeNodeSelected = function (node) {
            var data = node.data;
            if (!data.type)
                return;
            switch (data.type) {
                case manifesto.IIIFResourceType.manifest().toString():
                    this.viewManifest(data);
                    break;
                case manifesto.IIIFResourceType.collection().toString():
                    // note: this won't get called as the tree component now has branchNodesSelectable = false
                    // useful to keep around for reference
                    this.viewCollection(data);
                    break;
                default:
                    this.viewRange(data.path);
                    break;
            }
        };
        Extension.prototype.clearSearch = function () {
            this.searchResults = [];
            // reload current index as it may contain results.
            this.viewPage(this.helper.canvasIndex);
        };
        Extension.prototype.prevSearchResult = function () {
            var foundResult;
            // get the first result with a canvasIndex less than the current index.
            for (var i = this.searchResults.length - 1; i >= 0; i--) {
                var result = this.searchResults[i];
                if (result.canvasIndex <= this.getPrevPageIndex()) {
                    foundResult = result;
                    this.viewPage(foundResult.canvasIndex);
                    break;
                }
            }
        };
        Extension.prototype.nextSearchResult = function () {
            var foundResult;
            // get the first result with an index greater than the current index.
            for (var i = 0; i < this.searchResults.length; i++) {
                var result = this.searchResults[i];
                if (result.canvasIndex >= this.getNextPageIndex()) {
                    foundResult = result;
                    this.viewPage(result.canvasIndex);
                    break;
                }
            }
        };
        Extension.prototype.bookmark = function () {
            _super.prototype.bookmark.call(this);
            var canvas = this.helper.getCurrentCanvas();
            var bookmark = new Bookmark();
            bookmark.index = this.helper.canvasIndex;
            bookmark.label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
            bookmark.path = this.getCroppedImageUri(canvas, this.getViewer());
            bookmark.thumb = canvas.getCanonicalImageUri(this.config.options.bookmarkThumbWidth);
            bookmark.title = this.helper.getLabel();
            bookmark.trackingLabel = window.trackingLabel;
            bookmark.type = manifesto.ElementType.image().toString();
            this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
        };
        Extension.prototype.print = function () {
            // var args: MultiSelectionArgs = new MultiSelectionArgs();
            // args.manifestUri = this.helper.iiifResourceUri;
            // args.allCanvases = true;
            // args.format = this.config.options.printMimeType;
            // args.sequence = this.helper.getCurrentSequence().id;
            window.print();
            this.triggerSocket(Commands.PRINT);
        };
        Extension.prototype.getCroppedImageDimensions = function (canvas, viewer) {
            if (!viewer)
                return null;
            if (!viewer.viewport)
                return null;
            if (!canvas.getHeight() || !canvas.getWidth()) {
                return null;
            }
            var bounds = viewer.viewport.getBounds(true);
            var dimensions = new CroppedImageDimensions();
            var width = Math.floor(bounds.width);
            var height = Math.floor(bounds.height);
            var x = Math.floor(bounds.x);
            var y = Math.floor(bounds.y);
            // constrain to image bounds
            if (x + width > canvas.getWidth()) {
                width = canvas.getWidth() - x;
            }
            else if (x < 0) {
                width = width + x;
                x = 0;
            }
            if (y + height > canvas.getHeight()) {
                height = canvas.getHeight() - y;
            }
            else if (y < 0) {
                height = height + y;
                y = 0;
            }
            width = Math.min(width, canvas.getWidth());
            height = Math.min(height, canvas.getHeight());
            var regionWidth = width;
            var regionHeight = height;
            if (canvas.externalResource.data && canvas.externalResource.data.profile && canvas.externalResource.data.profile[1]) {
                var maxSize = new Size(canvas.externalResource.data.profile[1].maxWidth, canvas.externalResource.data.profile[1].maxHeight);
                if (!_.isUndefined(maxSize.width) && !_.isUndefined(maxSize.height)) {
                    if (width > maxSize.width) {
                        var newWidth = maxSize.width;
                        height = Math.round(newWidth * (height / width));
                        width = newWidth;
                    }
                    if (height > maxSize.height) {
                        var newHeight = maxSize.height;
                        width = Math.round((width / height) * newHeight);
                        height = newHeight;
                    }
                }
            }
            dimensions.region = new Size(regionWidth, regionHeight);
            dimensions.regionPos = new Point(x, y);
            dimensions.size = new Size(width, height);
            return dimensions;
        };
        // keep this around for reference
        // getOnScreenCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {
        //     if (!viewer) return null;
        //     if (!viewer.viewport) return null;
        //     if (!canvas.getHeight() || !canvas.getWidth()){
        //         return null;
        //     }
        //     var bounds = viewer.viewport.getBounds(true);
        //     var containerSize = viewer.viewport.getContainerSize();
        //     var zoom = viewer.viewport.getZoom(true);
        //     var top = Math.max(0, bounds.y);
        //     var left = Math.max(0, bounds.x);
        //     // change top to be normalised value proportional to height of image, not width (as per OSD).
        //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));
        //     // get on-screen pixel sizes.
        //     var viewportWidthPx = containerSize.x;
        //     var viewportHeightPx = containerSize.y;
        //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
        //     var ratio = canvas.getWidth() / imageWidthPx;
        //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));
        //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
        //     var viewportTopPx = parseInt(String(top * imageHeightPx));
        //     var rect1Left = 0;
        //     var rect1Right = imageWidthPx;
        //     var rect1Top = 0;
        //     var rect1Bottom = imageHeightPx;
        //     var rect2Left = viewportLeftPx;
        //     var rect2Right = viewportLeftPx + viewportWidthPx;
        //     var rect2Top = viewportTopPx;
        //     var rect2Bottom = viewportTopPx + viewportHeightPx;
        //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
        //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));
        //     // get original image pixel sizes.
        //     var ratio2 = canvas.getWidth() / imageWidthPx;
        //     var regionWidth = parseInt(String(sizeWidth * ratio2));
        //     var regionHeight = parseInt(String(sizeHeight * ratio2));
        //     var regionTop = parseInt(String(canvas.getHeight() * top));
        //     var regionLeft = parseInt(String(canvas.getWidth() * left));
        //     if (regionTop < 0) regionTop = 0;
        //     if (regionLeft < 0) regionLeft = 0;
        //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();
        //     dimensions.region = new Size(regionWidth, regionHeight);
        //     dimensions.regionPos = new Point(regionLeft, regionTop);
        //     dimensions.size = new Size(sizeWidth, sizeHeight);
        //     return dimensions;
        // }
        Extension.prototype.getCroppedImageUri = function (canvas, viewer) {
            if (!viewer)
                return null;
            if (!viewer.viewport)
                return null;
            var dimensions = this.getCroppedImageDimensions(canvas, viewer);
            // construct uri
            // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            var baseUri = this.getImageBaseUri(canvas);
            var id = this.getImageId(canvas);
            var region = dimensions.regionPos.x + "," + dimensions.regionPos.y + "," + dimensions.region.width + "," + dimensions.region.height;
            var size = dimensions.size.width + ',' + dimensions.size.height;
            var rotation = this.getViewerRotation();
            var quality = 'default';
            return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
        };
        Extension.prototype.getConfinedImageDimensions = function (canvas, width) {
            var dimensions = new Size(0, 0);
            dimensions.width = width;
            var normWidth = Math.normalise(width, 0, canvas.getWidth());
            dimensions.height = Math.floor(canvas.getHeight() * normWidth);
            return dimensions;
        };
        Extension.prototype.getConfinedImageUri = function (canvas, width) {
            var baseUri = this.getImageBaseUri(canvas);
            // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            var id = this.getImageId(canvas);
            var region = 'full';
            var dimensions = this.getConfinedImageDimensions(canvas, width);
            var size = dimensions.width + ',' + dimensions.height;
            var rotation = this.getViewerRotation();
            var quality = 'default';
            return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
        };
        Extension.prototype.getImageId = function (canvas) {
            var id = this.getInfoUri(canvas);
            // First trim off info.json, then extract ID:
            id = id.substr(0, id.lastIndexOf("/"));
            return id.substr(id.lastIndexOf("/") + 1);
        };
        Extension.prototype.getImageBaseUri = function (canvas) {
            var uri = this.getInfoUri(canvas);
            // First trim off info.json, then trim off ID....
            uri = uri.substr(0, uri.lastIndexOf("/"));
            return uri.substr(0, uri.lastIndexOf("/"));
        };
        Extension.prototype.getInfoUri = function (canvas) {
            var infoUri;
            var images = canvas.getImages();
            if (images && images.length) {
                var firstImage = images[0];
                var resource = firstImage.getResource();
                var services = resource.getServices();
                for (var i = 0; i < services.length; i++) {
                    var service = services[i];
                    var id = service.id;
                    if (!_.endsWith(id, '/')) {
                        id += '/';
                    }
                    if (manifesto.Utils.isImageProfile(service.getProfile())) {
                        infoUri = id + 'info.json';
                    }
                }
            }
            if (!infoUri) {
                // todo: use compiler flag (when available)
                infoUri = (window.DEBUG) ? '/src/extensions/uv-seadragon-extension/lib/imageunavailable.json' : 'lib/imageunavailable.json';
            }
            return infoUri;
        };
        Extension.prototype.getEmbedScript = function (template, width, height, zoom, rotation) {
            var configUri = this.config.uri || '';
            var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, zoom, rotation, width, height, this.embedScriptUri);
            return script;
        };
        Extension.prototype.getPrevPageIndex = function (canvasIndex) {
            if (_.isUndefined(canvasIndex))
                canvasIndex = this.helper.canvasIndex;
            var index;
            if (this.isPagingSettingEnabled()) {
                var indices = this.getPagedIndices(canvasIndex);
                if (this.helper.isRightToLeft()) {
                    index = indices.last() - 1;
                }
                else {
                    index = indices[0] - 1;
                }
            }
            else {
                index = canvasIndex - 1;
            }
            return index;
        };
        Extension.prototype.isSearchWithinEnabled = function () {
            if (!Utils.Bools.getBool(this.config.options.searchWithinEnabled, false)) {
                return false;
            }
            if (!this.helper.getSearchWithinService()) {
                return false;
            }
            return true;
        };
        Extension.prototype.isPagingSettingEnabled = function () {
            if (this.helper.isPagingAvailable()) {
                return this.getSettings().pagingEnabled;
            }
            return false;
        };
        Extension.prototype.getNextPageIndex = function (canvasIndex) {
            if (_.isUndefined(canvasIndex))
                canvasIndex = this.helper.canvasIndex;
            var index;
            if (this.isPagingSettingEnabled()) {
                var indices = this.getPagedIndices(canvasIndex);
                if (this.helper.isRightToLeft()) {
                    index = indices[0] + 1;
                }
                else {
                    index = indices.last() + 1;
                }
            }
            else {
                index = canvasIndex + 1;
            }
            if (index > this.helper.getTotalCanvases() - 1) {
                return -1;
            }
            return index;
        };
        Extension.prototype.getAutoCompleteService = function () {
            var service = this.helper.getSearchWithinService();
            if (!service)
                return null;
            return service.getService(manifesto.ServiceProfile.autoComplete());
        };
        Extension.prototype.getAutoCompleteUri = function () {
            var service = this.getAutoCompleteService();
            if (!service)
                return null;
            return service.id + '?q={0}';
        };
        Extension.prototype.getSearchWithinServiceUri = function () {
            var service = this.helper.getSearchWithinService();
            if (!service)
                return null;
            var uri = service.id;
            uri = uri + "?q={0}";
            return uri;
        };
        Extension.prototype.searchWithin = function (terms) {
            var _this = this;
            if (this.isSearching)
                return;
            this.isSearching = true;
            // clear search results
            this.searchResults = [];
            var that = this;
            var searchUri = this.getSearchWithinServiceUri();
            searchUri = String.format(searchUri, terms);
            this.getSearchResults(searchUri, terms, this.searchResults, function (results) {
                _this.isSearching = false;
                if (results.length) {
                    _this.searchResults = results.sort(function (a, b) {
                        return a.canvasIndex - b.canvasIndex;
                    });
                    $.publish(Commands.SEARCH_RESULTS, [{ terms: terms, results: results }]);
                    // reload current index as it may contain results.
                    that.viewPage(that.helper.canvasIndex, true);
                }
                else {
                    that.showMessage(that.config.modules.genericDialogue.content.noMatches, function () {
                        $.publish(Commands.SEARCH_RESULTS_EMPTY);
                    });
                }
            });
        };
        Extension.prototype.getSearchResults = function (searchUri, terms, searchResults, cb) {
            var _this = this;
            $.getJSON(searchUri, function (results) {
                if (results.resources && results.resources.length) {
                    searchResults = searchResults.concat(_this.parseSearchJson(results, searchResults));
                }
                if (results.next) {
                    _this.getSearchResults(results.next, terms, searchResults, cb);
                }
                else {
                    cb(searchResults);
                }
            });
        };
        Extension.prototype.parseSearchJson = function (resultsToParse, searchResults) {
            var parsedResults = [];
            for (var i = 0; i < resultsToParse.resources.length; i++) {
                var resource = resultsToParse.resources[i];
                var canvasIndex = this.helper.getCanvasIndexById(resource.on.match(/(.*)#/)[1]);
                var searchResult = new SearchResult(resource, canvasIndex);
                var match = parsedResults.en().where(function (x) { return x.canvasIndex === searchResult.canvasIndex; }).first();
                // if there's already a SearchResult for the canvas index, add a rect to it, otherwise create a new SearchResult
                if (match) {
                    match.addRect(resource);
                }
                else {
                    parsedResults.push(searchResult);
                }
            }
            // sort by canvasIndex
            parsedResults.sort(function (a, b) {
                return a.canvasIndex - b.canvasIndex;
            });
            return parsedResults;
        };
        Extension.prototype.getSearchResultRects = function () {
            return this.searchResults.en().selectMany(function (x) { return x.rects; }).toArray();
        };
        Extension.prototype.getCurrentSearchResultRectIndex = function () {
            var searchResultRects = this.getSearchResultRects();
            return searchResultRects.indexOf(this.currentSearchResultRect);
        };
        Extension.prototype.getTotalSearchResultRects = function () {
            var searchResultRects = this.getSearchResultRects();
            return searchResultRects.length;
        };
        Extension.prototype.isFirstSearchResultRect = function () {
            return this.getCurrentSearchResultRectIndex() === 0;
        };
        Extension.prototype.getLastSearchResultRectIndex = function () {
            return this.getTotalSearchResultRects() - 1;
        };
        Extension.prototype.getPagedIndices = function (canvasIndex) {
            if (_.isUndefined(canvasIndex))
                canvasIndex = this.helper.canvasIndex;
            var indices = [];
            // if it's a continuous manifest, get all resources.
            if (this.helper.isContinuous()) {
                indices = _.map(this.helper.getCanvases(), function (c, index) {
                    return index;
                });
            }
            else {
                if (!this.isPagingSettingEnabled()) {
                    indices.push(this.helper.canvasIndex);
                }
                else {
                    if (this.helper.isFirstCanvas(canvasIndex) || (this.helper.isLastCanvas(canvasIndex) && this.helper.isTotalCanvasesEven())) {
                        indices = [canvasIndex];
                    }
                    else if (canvasIndex % 2) {
                        indices = [canvasIndex, canvasIndex + 1];
                    }
                    else {
                        indices = [canvasIndex - 1, canvasIndex];
                    }
                    if (this.helper.isRightToLeft()) {
                        indices = indices.reverse();
                    }
                }
            }
            return indices;
        };
        return Extension;
    })(BaseExtension);
    return Extension;
});
//# sourceMappingURL=Extension.js.map