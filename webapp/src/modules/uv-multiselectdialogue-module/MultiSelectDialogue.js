var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../extensions/uv-seadragon-extension/Commands", "../../modules/uv-shared-module/Dialogue", "../../extensions/uv-seadragon-extension/Mode"], function (require, exports, Commands, Dialogue, Mode) {
    var MultiSelectDialogue = (function (_super) {
        __extends(MultiSelectDialogue, _super);
        function MultiSelectDialogue($element) {
            _super.call(this, $element);
        }
        MultiSelectDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('multiSelectDialogue');
            _super.prototype.create.call(this);
            var that = this;
            this.openCommand = Commands.SHOW_MULTISELECT_DIALOGUE;
            this.closeCommand = Commands.HIDE_MULTISELECT_DIALOGUE;
            $.subscribe(this.openCommand, function (e, params) {
                _this.open();
                var multiSelectState = _this.extension.helper.getMultiSelectState();
                multiSelectState.setEnabled(true);
                _this.component.databind();
            });
            $.subscribe(this.closeCommand, function (e) {
                _this.close();
                var multiSelectState = _this.extension.helper.getMultiSelectState();
                multiSelectState.setEnabled(false);
            });
            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);
            this.$title.text(this.content.title);
            this.$gallery = $('<div class="iiif-gallery-component"></div>');
            this.$content.append(this.$gallery);
            this.options = {
                element: ".overlay.multiSelect .iiif-gallery-component",
                helper: this.extension.helper,
                chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
                content: this.config.content,
                debug: false,
                imageFadeInDuration: 300,
                initialZoom: 4,
                minLabelWidth: 20,
                pageModeEnabled: this.isPageModeEnabled(),
                searchResults: [],
                scrollStopDuration: 100,
                sizingEnabled: true,
                thumbHeight: this.config.options.galleryThumbHeight,
                thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
                thumbWidth: this.config.options.galleryThumbWidth,
                viewingDirection: this.extension.helper.getViewingDirection()
            };
            this.component = new IIIFComponents.GalleryComponent(this.options);
            var $selectButton = $(this.options.element).find('a.select');
            $selectButton.addClass('btn btn-primary');
            this.component.on('multiSelectionMade', function (args) {
                var ids = args[0];
                $.publish(Commands.MULTISELECTION_MADE, [ids]);
                that.close();
            });
            this.$element.hide();
        };
        MultiSelectDialogue.prototype.isPageModeEnabled = function () {
            return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && this.extension.getMode().toString() === Mode.page.toString();
        };
        MultiSelectDialogue.prototype.open = function () {
            _super.prototype.open.call(this);
        };
        MultiSelectDialogue.prototype.close = function () {
            _super.prototype.close.call(this);
        };
        MultiSelectDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var $galleryElement = $(this.options.element);
            var $main = $galleryElement.find('.main');
            var $header = $galleryElement.find('.header');
            $main.height(this.$content.height() - this.$title.outerHeight() - this.$title.verticalMargins() - $header.height());
        };
        return MultiSelectDialogue;
    })(Dialogue);
    return MultiSelectDialogue;
});
//# sourceMappingURL=MultiSelectDialogue.js.map