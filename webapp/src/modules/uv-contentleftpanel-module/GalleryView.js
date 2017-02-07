var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/BaseView", "../../extensions/uv-seadragon-extension/Commands"], function (require, exports, BaseCommands, BaseView, Commands) {
    var GalleryView = (function (_super) {
        __extends(GalleryView, _super);
        function GalleryView($element) {
            _super.call(this, $element, true, true);
            this.isOpen = false;
        }
        GalleryView.prototype.create = function () {
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            // search preview doesn't work well with the gallery because it loads thumbs in "chunks"
            // $.subscribe(Commands.SEARCH_PREVIEW_START, (e, canvasIndex) => {
            //     this.component.searchPreviewStart(canvasIndex);
            // });
            // $.subscribe(Commands.SEARCH_PREVIEW_FINISH, () => {
            //     this.component.searchPreviewFinish();
            // });
            this.$gallery = $('<div class="iiif-gallery-component"></div>');
            this.$element.append(this.$gallery);
        };
        GalleryView.prototype.setup = function () {
            this.component = new IIIFComponents.GalleryComponent(this.galleryOptions);
            this.component.on('thumbSelected', function (args) {
                var thumb = args[0];
                $.publish(Commands.GALLERY_THUMB_SELECTED, [thumb]);
                $.publish(BaseCommands.THUMB_SELECTED, [thumb]);
            });
            this.component.on('decreaseSize', function () {
                $.publish(Commands.GALLERY_DECREASE_SIZE);
            });
            this.component.on('increaseSize', function () {
                $.publish(Commands.GALLERY_INCREASE_SIZE);
            });
        };
        GalleryView.prototype.databind = function () {
            this.component.options = this.galleryOptions;
            this.component.databind();
            this.resize();
        };
        GalleryView.prototype.show = function () {
            var _this = this;
            this.isOpen = true;
            this.$element.show();
            // todo: would be better to have no imperative methods on components and use a reactive pattern
            setTimeout(function () {
                _this.component.selectIndex(_this.extension.helper.canvasIndex);
            }, 10);
        };
        GalleryView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };
        GalleryView.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var $galleryElement = $(this.galleryOptions.element);
            var $main = $galleryElement.find('.main');
            var $header = $galleryElement.find('.header');
            $main.height(this.$element.height() - $header.height());
        };
        return GalleryView;
    })(BaseView);
    return GalleryView;
});
//# sourceMappingURL=GalleryView.js.map