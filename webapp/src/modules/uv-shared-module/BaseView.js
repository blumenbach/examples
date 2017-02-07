var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Panel"], function (require, exports, Panel) {
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView($element, fitToParentWidth, fitToParentHeight) {
            this.modules = [];
            this.bootstrapper = $("body > #app").data("bootstrapper");
            _super.call(this, $element, fitToParentWidth, fitToParentHeight);
        }
        BaseView.prototype.create = function () {
            _super.prototype.create.call(this);
            this.extension = this.bootstrapper.extension;
            this.config = {};
            this.config.content = {};
            this.config.options = {};
            this.content = this.config.content;
            this.options = this.config.options;
            var that = this;
            // build config inheritance chain
            if (that.modules.length) {
                that.modules = that.modules.reverse();
                _.each(that.modules, function (moduleName) {
                    that.config = $.extend(true, that.config, that.extension.config.modules[moduleName]);
                });
            }
        };
        BaseView.prototype.init = function () {
        };
        BaseView.prototype.setConfig = function (moduleName) {
            this.modules.push(moduleName);
        };
        BaseView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return BaseView;
    })(Panel);
    return BaseView;
});
//# sourceMappingURL=BaseView.js.map