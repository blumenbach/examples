var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseView", "../../extensions/uv-seadragon-extension/Commands"], function (require, exports, BaseView, Commands) {
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView($element) {
            _super.call(this, $element, true, true);
            this.isOpen = false;
        }
        TreeView.prototype.create = function () {
            this.setConfig('contentLeftPanel');
            _super.prototype.create.call(this);
            this.$tree = $('<div class="iiif-tree-component"></div>');
            this.$element.append(this.$tree);
        };
        TreeView.prototype.setup = function () {
            var that = this;
            this.component = new IIIFComponents.TreeComponent(this.treeOptions);
            // todo: casting as <any> is necessary because IBaseComponent doesn't implement ITinyEmitter
            // it is mixed-in a runtime. figure out how to add .on etc to IBaseComponent without needing
            // to implement it in BaseComponent.
            this.component.on('treeNodeSelected', function (args) {
                var node = args[0];
                $.publish(Commands.TREE_NODE_SELECTED, [node]);
            });
            this.component.on('treeNodeMultiSelected', function (args) {
                var node = args[0];
                $.publish(Commands.TREE_NODE_MULTISELECTED, [node]);
            });
        };
        TreeView.prototype.databind = function () {
            this.component.options = this.treeOptions;
            this.component.databind();
            this.resize();
        };
        TreeView.prototype.show = function () {
            this.isOpen = true;
            this.$element.show();
        };
        TreeView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };
        TreeView.prototype.selectNode = function (node) {
            this.component.selectNode(node);
        };
        TreeView.prototype.deselectCurrentNode = function () {
            this.component.deselectCurrentNode();
        };
        TreeView.prototype.getNodeById = function (id) {
            return this.component.getNodeById(id);
        };
        TreeView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return TreeView;
    })(BaseView);
    return TreeView;
});
//# sourceMappingURL=TreeView.js.map