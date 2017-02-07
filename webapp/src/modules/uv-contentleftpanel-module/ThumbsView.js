var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/ThumbsView", "../../extensions/uv-seadragon-extension/Commands", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, BaseThumbsView, Commands, Mode) {
    var ThumbsView = (function (_super) {
        __extends(ThumbsView, _super);
        function ThumbsView() {
            _super.apply(this, arguments);
        }
        ThumbsView.prototype.create = function () {
            var _this = this;
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            // todo: this should be a setting
            $.subscribe(Commands.MODE_CHANGED, function (e, mode) {
                _this.setLabel();
            });
            $.subscribe(Commands.SEARCH_PREVIEW_START, function (e, canvasIndex) {
                _this.searchPreviewStart(canvasIndex);
            });
            $.subscribe(Commands.SEARCH_PREVIEW_FINISH, function () {
                _this.searchPreviewFinish();
            });
            if (this.extension.helper.isPaged()) {
                this.$thumbs.addClass('paged');
            }
            var that = this;
            $.views.helpers({
                separator: function () {
                    if (that.extension.helper.isVerticallyAligned()) {
                        return true; // one thumb per line
                    }
                    // two thumbs per line
                    if (that.extension.helper.isPaged()) {
                        return ((this.data.index - 1) % 2 == 0) ? false : true;
                    }
                    return false;
                }
            });
        };
        ThumbsView.prototype.addSelectedClassToThumbs = function (index) {
            if (this.extension.isPagingSettingEnabled()) {
                var indices = this.extension.getPagedIndices(index);
                for (var i = 0; i < indices.length; i++) {
                    this.getThumbByIndex(indices[i]).addClass('selected');
                }
            }
            else {
                this.getThumbByIndex(index).addClass('selected');
            }
        };
        ThumbsView.prototype.isPageModeEnabled = function () {
            if (typeof this.extension.getMode === "function") {
                return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode.page.toString();
            }
            return this.config.options.pageModeEnabled;
        };
        ThumbsView.prototype.searchPreviewStart = function (canvasIndex) {
            this.scrollToThumb(canvasIndex);
            var $thumb = this.getThumbByIndex(canvasIndex);
            $thumb.addClass('searchpreview');
        };
        ThumbsView.prototype.searchPreviewFinish = function () {
            this.scrollToThumb(this.extension.helper.canvasIndex);
            this.getAllThumbs().removeClass('searchpreview');
        };
        ThumbsView.prototype.setLabel = function () {
            if (this.isPDF()) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').hide();
            }
            else {
                if (this.isPageModeEnabled()) {
                    $(this.$thumbs).find('span.index').hide();
                    $(this.$thumbs).find('span.label').show();
                }
                else {
                    $(this.$thumbs).find('span.index').show();
                    $(this.$thumbs).find('span.label').hide();
                }
            }
        };
        return ThumbsView;
    })(BaseThumbsView);
    return ThumbsView;
});
//# sourceMappingURL=ThumbsView.js.map