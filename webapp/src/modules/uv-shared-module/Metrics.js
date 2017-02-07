define(["require", "exports", "./Metric"], function (require, exports, Metric) {
    var Metrics = (function () {
        function Metrics() {
        }
        Metrics.MOBILE_LANDSCAPE = new Metric(0, 640);
        Metrics.LAPTOP = new Metric(640, Infinity);
        return Metrics;
    })();
    return Metrics;
});
//# sourceMappingURL=Metrics.js.map