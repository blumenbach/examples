define(["require", "exports"], function (require, exports) {
    var DownloadType = (function () {
        function DownloadType() {
        }
        DownloadType.CURRENTVIEW = "currentView";
        DownloadType.ENTIREDOCUMENTASPDF = "entireDocumentAsPdf";
        DownloadType.ENTIREDOCUMENTASTEXT = "entireDocumentAsText";
        DownloadType.WHOLEIMAGEHIGHRES = "wholeImageHighRes";
        DownloadType.WHOLEIMAGESHIGHRES = "wholeImageHighRes";
        DownloadType.WHOLEIMAGELOWRES = "wholeImageLowRes";
        DownloadType.UNKNOWN = "unknown";
        return DownloadType;
    })();
    return DownloadType;
});
//# sourceMappingURL=DownloadType.js.map