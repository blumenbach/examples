var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../../extensions/uv-seadragon-extension/Commands", "./GalleryView", "../uv-shared-module/LeftPanel", "../uv-shared-module/Metrics", "../../extensions/uv-seadragon-extension/Mode", "./ThumbsView", "./TreeView"], function (require, exports, BaseCommands, Commands, GalleryView, LeftPanel, Metrics, Mode, ThumbsView, TreeView) {
    var ContentLeftPanel = (function (_super) {
        __extends(ContentLeftPanel, _super);
        function ContentLeftPanel($element) {
            _super.call(this, $element);
            this.expandFullEnabled = false;
            this.isThumbsViewOpen = false;
            this.isTreeViewOpen = false;
            this.treeSortType = Manifold.TreeSortType.NONE;
        }
        ContentLeftPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            var that = this;
            $.subscribe(BaseCommands.SETTINGS_CHANGED, function () {
                _this.databind();
            });
            $.subscribe(Commands.GALLERY_THUMB_SELECTED, function () {
                _this.collapseFull();
            });
            $.subscribe(BaseCommands.METRIC_CHANGED, function () {
                if (_this.extension.metric === Metrics.MOBILE_LANDSCAPE) {
                    if (_this.isFullyExpanded) {
                        _this.collapseFull();
                    }
                }
            });
            $.subscribe(Commands.SEARCH_RESULTS, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(Commands.SEARCH_RESULTS_CLEARED, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(Commands.SEARCH_RESULTS_EMPTY, function () {
                _this.databindThumbsView();
                _this.databindGalleryView();
            });
            $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, function (e, index) {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
                _this.selectCurrentTreeNode();
                _this.updateTreeTabBySelection();
            });
            this.$tabs = $('<div class="tabs"></div>');
            this.$main.append(this.$tabs);
            this.$treeButton = $('<a class="index tab" tabindex="0">' + this.content.index + '</a>');
            this.$tabs.append(this.$treeButton);
            this.$thumbsButton = $('<a class="thumbs tab" tabindex="0">' + this.content.thumbnails + '</a>');
            this.$thumbsButton.prop('title', this.content.thumbnails);
            this.$tabs.append(this.$thumbsButton);
            this.$tabsContent = $('<div class="tabsContent"></div>');
            this.$main.append(this.$tabsContent);
            this.$options = $('<div class="options"></div>');
            this.$tabsContent.append(this.$options);
            this.$topOptions = $('<div class="top"></div>');
            this.$options.append(this.$topOptions);
            this.$treeSelect = $('<select></select>');
            this.$topOptions.append(this.$treeSelect);
            this.$bottomOptions = $('<div class="bottom"></div>');
            this.$options.append(this.$bottomOptions);
            this.$leftOptions = $('<div class="left"></div>');
            this.$bottomOptions.append(this.$leftOptions);
            this.$rightOptions = $('<div class="right"></div>');
            this.$bottomOptions.append(this.$rightOptions);
            this.$treeViewOptions = $('<div class="treeView"></div>');
            this.$leftOptions.append(this.$treeViewOptions);
            this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + '</span>');
            this.$treeViewOptions.append(this.$sortByLabel);
            this.$sortButtonGroup = $('<div class="btn-group"></div>');
            this.$treeViewOptions.append(this.$sortButtonGroup);
            this.$sortByDateButton = $('<button class="btn tabindex="0"">' + this.content.date + '</button>');
            this.$sortButtonGroup.append(this.$sortByDateButton);
            this.$sortByVolumeButton = $('<button class="btn" tabindex="0">' + this.content.volume + '</button>');
            this.$sortButtonGroup.append(this.$sortByVolumeButton);
            this.$views = $('<div class="views"></div>');
            this.$tabsContent.append(this.$views);
            this.$treeView = $('<div class="treeView"></div>');
            this.$views.append(this.$treeView);
            this.$thumbsView = $('<div class="thumbsView" tabindex="0"></div>');
            this.$views.append(this.$thumbsView);
            this.$galleryView = $('<div class="galleryView"></div>');
            this.$views.append(this.$galleryView);
            this.$treeSelect.hide();
            this.$treeSelect.change(function () {
                _this.databindTreeView();
                _this.selectCurrentTreeNode();
                _this.updateTreeTabBySelection();
            });
            this.$sortByDateButton.on('click', function () {
                _this.sortByDate();
            });
            this.$sortByVolumeButton.on('click', function () {
                _this.sortByVolume();
            });
            this.$treeViewOptions.hide();
            this.$treeButton.onPressed(function () {
                _this.openTreeView();
                $.publish(Commands.OPEN_TREE_VIEW);
            });
            this.$thumbsButton.onPressed(function () {
                _this.openThumbsView();
                $.publish(Commands.OPEN_THUMBS_VIEW);
            });
            this.setTitle(this.content.title);
            this.$sortByVolumeButton.addClass('on');
            var tabOrderConfig = this.options.tabOrder;
            if (tabOrderConfig) {
                // sort tabs
                tabOrderConfig = tabOrderConfig.toLowerCase();
                tabOrderConfig = tabOrderConfig.replace(/ /g, "");
                var tabOrder = tabOrderConfig.split(',');
                if (tabOrder[0] === 'thumbs') {
                    this.$treeButton.before(this.$thumbsButton);
                    this.$thumbsButton.addClass('first');
                }
                else {
                    this.$treeButton.addClass('first');
                }
            }
        };
        ContentLeftPanel.prototype.createTreeView = function () {
            this.treeView = new TreeView(this.$treeView);
            this.treeView.treeOptions = this.getTreeOptions();
            this.treeView.setup();
            this.databindTreeView();
            // populate the tree select drop down when there are multiple top-level ranges
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                for (var i = 0; i < topRanges.length; i++) {
                    var range = topRanges[i];
                    this.$treeSelect.append('<option value="' + range.id + '">' + Manifesto.TranslationCollection.getValue(range.getLabel()) + '</option>');
                }
            }
            this.updateTreeViewOptions();
        };
        ContentLeftPanel.prototype.databind = function () {
            this.databindThumbsView();
            this.databindTreeView();
            this.databindGalleryView();
        };
        ContentLeftPanel.prototype.updateTreeViewOptions = function () {
            var treeData = this.getTreeData();
            if (this.isCollection() && this.extension.helper.treeHasNavDates(treeData)) {
                this.$treeViewOptions.show();
            }
            else {
                this.$treeViewOptions.hide();
            }
            if (this.$treeSelect.find('option').length) {
                this.$treeSelect.show();
            }
            else {
                this.$treeSelect.hide();
            }
        };
        ContentLeftPanel.prototype.sortByDate = function () {
            this.treeSortType = Manifold.TreeSortType.DATE;
            this.treeView.treeOptions = this.getTreeOptions();
            this.treeView.databind();
            this.selectCurrentTreeNode();
            this.$sortByDateButton.addClass('on');
            this.$sortByVolumeButton.removeClass('on');
            this.resize();
        };
        ContentLeftPanel.prototype.sortByVolume = function () {
            this.treeSortType = Manifold.TreeSortType.NONE;
            this.treeView.treeOptions = this.getTreeOptions();
            this.treeView.databind();
            this.selectCurrentTreeNode();
            this.$sortByDateButton.removeClass('on');
            this.$sortByVolumeButton.addClass('on');
            this.resize();
        };
        ContentLeftPanel.prototype.isCollection = function () {
            var treeData = this.getTreeData();
            return treeData.data.type === manifesto.TreeNodeType.collection().toString();
        };
        ContentLeftPanel.prototype.databindTreeView = function () {
            if (!this.treeView)
                return;
            this.treeView.treeOptions = this.getTreeOptions();
            this.treeView.databind();
            this.selectCurrentTreeNode();
        };
        ContentLeftPanel.prototype.getTreeOptions = function () {
            return {
                branchNodesSelectable: false,
                element: ".views .treeView .iiif-tree-component",
                helper: this.extension.helper,
                topRangeIndex: this.getSelectedTopRangeIndex(),
                treeSortType: this.treeSortType
            };
        };
        ContentLeftPanel.prototype.updateTreeTabByCanvasIndex = function () {
            // update tab to current top range label (if there is one)
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                var index = this.getCurrentCanvasTopRangeIndex();
                var currentRange = topRanges[index];
                this.setTreeTabTitle(Manifesto.TranslationCollection.getValue(currentRange.getLabel()));
            }
            else {
                this.setTreeTabTitle(this.content.index);
            }
        };
        ContentLeftPanel.prototype.setTreeTabTitle = function (title) {
            this.$treeButton.text(title);
            this.$treeButton.prop('title', title);
        };
        ContentLeftPanel.prototype.updateTreeTabBySelection = function () {
            var title;
            var topRanges = this.extension.helper.getTopRanges();
            if (topRanges.length > 1) {
                if (this.treeView) {
                    title = this.getSelectedTree().text();
                }
                else {
                    title = Manifesto.TranslationCollection.getValue(topRanges[0].getLabel());
                }
            }
            if (title) {
                this.setTreeTabTitle(title);
            }
            else {
                this.setTreeTabTitle(this.content.index);
            }
        };
        ContentLeftPanel.prototype.getViewingDirection = function () {
            return this.extension.helper.getViewingDirection();
        };
        ContentLeftPanel.prototype.createThumbsView = function () {
            this.thumbsView = new ThumbsView(this.$thumbsView);
            this.databindThumbsView();
        };
        ContentLeftPanel.prototype.databindThumbsView = function () {
            if (!this.thumbsView)
                return;
            var width, height;
            var viewingDirection = this.getViewingDirection().toString();
            if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()) {
                width = this.config.options.oneColThumbWidth;
                height = this.config.options.oneColThumbHeight;
            }
            else {
                width = this.config.options.twoColThumbWidth;
                height = this.config.options.twoColThumbHeight;
            }
            var thumbs = this.extension.helper.getThumbs(width, height);
            if (viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()) {
                thumbs.reverse();
            }
            // add a search result icon for pages with results
            var searchResults = this.extension.searchResults;
            if (searchResults && searchResults.length) {
                for (var i = 0; i < searchResults.length; i++) {
                    var searchResult = searchResults[i];
                    // find the thumb with the same canvasIndex and add the searchResult
                    var thumb = thumbs.en().where(function (t) { return t.index === searchResult.canvasIndex; }).first();
                    // clone the data so searchResults isn't persisted on the canvas.
                    var data = $.extend(true, {}, thumb.data);
                    data.searchResults = searchResult.rects.length;
                    thumb.data = data;
                }
            }
            this.thumbsView.thumbs = thumbs;
            this.thumbsView.databind();
        };
        ContentLeftPanel.prototype.createGalleryView = function () {
            this.galleryView = new GalleryView(this.$galleryView);
            this.galleryView.galleryOptions = this.getGalleryOptions();
            this.galleryView.setup();
            this.databindGalleryView();
        };
        ContentLeftPanel.prototype.databindGalleryView = function () {
            if (!this.galleryView)
                return;
            this.galleryView.galleryOptions = this.getGalleryOptions();
            this.galleryView.databind();
        };
        ContentLeftPanel.prototype.getGalleryOptions = function () {
            return {
                element: ".views .galleryView .iiif-gallery-component",
                helper: this.extension.helper,
                chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
                content: this.config.content,
                debug: false,
                imageFadeInDuration: 300,
                initialZoom: 6,
                minLabelWidth: 20,
                pageModeEnabled: this.isPageModeEnabled(),
                scrollStopDuration: 100,
                searchResults: this.extension.searchResults,
                sizingEnabled: Modernizr.inputtypes.range,
                thumbHeight: this.config.options.galleryThumbHeight,
                thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
                thumbWidth: this.config.options.galleryThumbWidth,
                viewingDirection: this.getViewingDirection()
            };
        };
        ContentLeftPanel.prototype.isPageModeEnabled = function () {
            // todo: checks if the panel is being used in the openseadragon extension.
            // pass a `isPageModeEnabled` function to the panel's constructor instead?
            if (typeof this.extension.getMode === "function") {
                return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && this.extension.getMode().toString() === Mode.page.toString();
            }
            return Utils.Bools.getBool(this.config.options.pageModeEnabled, true);
        };
        ContentLeftPanel.prototype.getSelectedTree = function () {
            return this.$treeSelect.find(':selected');
        };
        ContentLeftPanel.prototype.getSelectedTopRangeIndex = function () {
            var topRangeIndex = this.getSelectedTree().index();
            if (topRangeIndex === -1) {
                topRangeIndex = 0;
            }
            return topRangeIndex;
        };
        ContentLeftPanel.prototype.getTreeData = function () {
            var topRangeIndex = this.getSelectedTopRangeIndex();
            return this.extension.helper.getTree(topRangeIndex, Manifold.TreeSortType.NONE);
        };
        ContentLeftPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);
            if (this.isUnopened) {
                var treeEnabled = Utils.Bools.getBool(this.config.options.treeEnabled, true);
                var thumbsEnabled = Utils.Bools.getBool(this.config.options.thumbsEnabled, true);
                var treeData = this.getTreeData();
                if (!treeData || !treeData.nodes.length) {
                    treeEnabled = false;
                }
                // hide the tabs if either tree or thumbs are disabled
                if (!treeEnabled || !thumbsEnabled)
                    this.$tabs.hide();
                if (thumbsEnabled && this.defaultToThumbsView()) {
                    this.openThumbsView();
                }
                else if (treeEnabled) {
                    this.openTreeView();
                }
            }
        };
        ContentLeftPanel.prototype.defaultToThumbsView = function () {
            var defaultToTreeEnabled = Utils.Bools.getBool(this.config.options.defaultToTreeEnabled, false);
            var defaultToTreeIfGreaterThan = this.config.options.defaultToTreeIfGreaterThan || 0;
            var treeData = this.getTreeData();
            if (defaultToTreeEnabled) {
                if (treeData.nodes.length > defaultToTreeIfGreaterThan) {
                    return false;
                }
            }
            return true;
        };
        ContentLeftPanel.prototype.expandFullStart = function () {
            _super.prototype.expandFullStart.call(this);
            $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
        };
        ContentLeftPanel.prototype.expandFullFinish = function () {
            _super.prototype.expandFullFinish.call(this);
            if (this.$treeButton.hasClass('on')) {
                this.openTreeView();
            }
            else if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }
            $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
        };
        ContentLeftPanel.prototype.collapseFullStart = function () {
            _super.prototype.collapseFullStart.call(this);
            $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
        };
        ContentLeftPanel.prototype.collapseFullFinish = function () {
            _super.prototype.collapseFullFinish.call(this);
            // todo: write a more generic tabs system with base tab class.
            // thumbsView may not necessarily have been created yet.
            // replace thumbsView with galleryView.
            if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }
            $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
        };
        ContentLeftPanel.prototype.openTreeView = function () {
            this.isTreeViewOpen = true;
            this.isThumbsViewOpen = false;
            if (!this.treeView) {
                this.createTreeView();
            }
            this.$treeButton.addClass('on');
            this.$thumbsButton.removeClass('on');
            this.treeView.show();
            if (this.thumbsView)
                this.thumbsView.hide();
            if (this.galleryView)
                this.galleryView.hide();
            this.updateTreeViewOptions();
            this.selectCurrentTreeNode();
            this.resize();
            this.treeView.resize();
        };
        ContentLeftPanel.prototype.openThumbsView = function () {
            this.isTreeViewOpen = false;
            this.isThumbsViewOpen = true;
            if (!this.thumbsView) {
                this.createThumbsView();
            }
            if (this.isFullyExpanded && !this.galleryView) {
                this.createGalleryView();
            }
            this.$treeButton.removeClass('on');
            this.$thumbsButton.addClass('on');
            if (this.treeView)
                this.treeView.hide();
            this.$treeSelect.hide();
            this.$treeViewOptions.hide();
            this.resize();
            if (this.isFullyExpanded) {
                this.thumbsView.hide();
                if (this.galleryView)
                    this.galleryView.show();
                if (this.galleryView)
                    this.galleryView.resize();
            }
            else {
                if (this.galleryView)
                    this.galleryView.hide();
                this.thumbsView.show();
                this.thumbsView.resize();
            }
        };
        ContentLeftPanel.prototype.selectTopRangeIndex = function (index) {
            this.$treeSelect.prop('selectedIndex', index);
        };
        ContentLeftPanel.prototype.getCurrentCanvasTopRangeIndex = function () {
            var topRangeIndex = -1;
            var range = this.extension.getCurrentCanvasRange();
            if (range) {
                topRangeIndex = Number(range.path.split('/')[0]);
            }
            return topRangeIndex;
        };
        ContentLeftPanel.prototype.selectCurrentTreeNode = function () {
            if (this.treeView) {
                var id;
                var node;
                var currentCanvasTopRangeIndex = this.getCurrentCanvasTopRangeIndex();
                var selectedTopRangeIndex = this.getSelectedTopRangeIndex();
                var usingCorrectTree = currentCanvasTopRangeIndex === selectedTopRangeIndex;
                if (currentCanvasTopRangeIndex != -1) {
                    var range = this.extension.getCurrentCanvasRange();
                    if (range && range.treeNode) {
                        node = this.treeView.getNodeById(range.treeNode.id);
                    }
                }
                // use manifest root node
                // if (!node){
                //     id = this.extension.helper.manifest.defaultTree.id;
                //     node = this.treeView.getNodeById(id);
                // }
                if (node && usingCorrectTree) {
                    this.treeView.selectNode(node);
                }
                else {
                    this.treeView.deselectCurrentNode();
                }
            }
        };
        ContentLeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
            this.$views.height(this.$tabsContent.height() - this.$options.outerHeight());
        };
        return ContentLeftPanel;
    })(LeftPanel);
    return ContentLeftPanel;
});
//# sourceMappingURL=ContentLeftPanel.js.map