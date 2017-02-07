define(["require", "exports"], function (require, exports) {
    var DownloadOption = (function () {
        function DownloadOption(value) {
            this.value = value;
        }
        DownloadOption.prototype.toString = function () {
            return this.value;
        };
        DownloadOption.currentViewAsJpg = new DownloadOption("currentViewAsJpg");
        DownloadOption.dynamicCanvasRenderings = new DownloadOption("dynamicCanvasRenderings");
        DownloadOption.dynamicImageRenderings = new DownloadOption("dynamicImageRenderings");
        DownloadOption.dynamicSequenceRenderings = new DownloadOption("dynamicSequenceRenderings");
        DownloadOption.entireFileAsOriginal = new DownloadOption("entireFileAsOriginal");
        DownloadOption.selection = new DownloadOption("selection");
        DownloadOption.wholeImageHighRes = new DownloadOption("wholeImageHighRes");
        DownloadOption.wholeImagesHighRes = new DownloadOption("wholeImagesHighRes");
        DownloadOption.wholeImageLowResAsJpg = new DownloadOption("wholeImageLowResAsJpg");
        return DownloadOption;
    })();
    return DownloadOption;
});
//# sourceMappingURL=DownloadOption.js.map