define(["require", "exports", "../../modules/uv-shared-module/Point"], function (require, exports, Point) {
    var Size = Utils.Measurements.Size;
    var CroppedImageDimensions = (function () {
        function CroppedImageDimensions() {
            this.region = new Size(0, 0);
            this.regionPos = new Point(0, 0);
            this.size = new Size(0, 0);
        }
        return CroppedImageDimensions;
    })();
    return CroppedImageDimensions;
});
//# sourceMappingURL=CroppedImageDimensions.js.map