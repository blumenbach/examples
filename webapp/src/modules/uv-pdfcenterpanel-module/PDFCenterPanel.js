var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../uv-shared-module/BaseCommands", "../uv-shared-module/CenterPanel", "../../Params"], function (require, exports, BaseCommands, CenterPanel, Params) {
    var PDFCenterPanel = (function (_super) {
        __extends(PDFCenterPanel, _super);
        function PDFCenterPanel($element) {
            _super.call(this, $element);
        }
        PDFCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pdfCenterPanel');
            _super.prototype.create.call(this);
            $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, function (e, resources) {
                _this.openMedia(resources);
            });
        };
        PDFCenterPanel.prototype.openMedia = function (resources) {
            var _this = this;
            var that = this;
            this.extension.getExternalResources(resources).then(function () {
                var canvas = _this.extension.helper.getCurrentCanvas();
                var pdfUri = canvas.id;
                var browser = window.browserDetect.browser;
                var version = window.browserDetect.version;
                if ((browser === 'Explorer' && version < 10) || !_this.config.options.usePdfJs) {
                    // create pdf object
                    new PDFObject({
                        url: pdfUri,
                        id: "PDF"
                    }).embed('content');
                }
                else {
                    var viewerPath;
                    // todo: use compiler conditional
                    if (window.DEBUG) {
                        viewerPath = 'modules/uv-pdfcenterpanel-module/html/viewer.html';
                    }
                    else {
                        viewerPath = 'html/uv-pdfcenterpanel-module/viewer.html';
                    }
                    // load viewer.html
                    _this.$content.load(viewerPath, function () {
                        if (window.DEBUG) {
                            PDFJS.workerSrc = 'extensions/uv-pdf-extension/lib/pdf.worker.min.js';
                        }
                        else {
                            PDFJS.workerSrc = 'lib/pdf.worker.min.js';
                        }
                        PDFJS.DEFAULT_URL = pdfUri;
                        var anchorIndex = (1 + parseInt(that.extension.getParam(Params.anchor))) || 0;
                        PDFView.initialBookmark = "page=" + anchorIndex;
                        window.webViewerLoad();
                        _this.resize();
                    });
                }
            });
        };
        PDFCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return PDFCenterPanel;
    })(CenterPanel);
    return PDFCenterPanel;
});
//# sourceMappingURL=PDFCenterPanel.js.map