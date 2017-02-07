define(["require", "exports", "./BaseCommands"], function (require, exports, BaseCommands) {
    var Panel = (function () {
        function Panel($element, fitToParentWidth, fitToParentHeight) {
            this.isResized = false;
            this.$element = $element;
            this.fitToParentWidth = fitToParentWidth || false;
            this.fitToParentHeight = fitToParentHeight || false;
            this.create();
        }
        Panel.prototype.create = function () {
            var _this = this;
            $.subscribe(BaseCommands.RESIZE, function () {
                _this.resize();
            });
        };
        Panel.prototype.resize = function () {
            var $parent = this.$element.parent();
            if (this.fitToParentWidth) {
                this.$element.width($parent.width());
            }
            if (this.fitToParentHeight) {
                this.$element.height($parent.height());
            }
            this.isResized = true;
        };
        return Panel;
    })();
    return Panel;
});
//# sourceMappingURL=Panel.js.map