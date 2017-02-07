var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/ThumbsView"], function (require, exports, BaseView) {
    var ThumbsView = (function (_super) {
        __extends(ThumbsView, _super);
        function ThumbsView() {
            _super.apply(this, arguments);
        }
        ThumbsView.prototype.create = function () {
            this.setConfig('resourcesLeftPanel');
            _super.prototype.create.call(this);
        };
        return ThumbsView;
    })(BaseView);
    return ThumbsView;
});
//# sourceMappingURL=ThumbsView.js.map