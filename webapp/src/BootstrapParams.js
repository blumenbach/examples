define(["require", "exports", "./Params"], function (require, exports, Params) {
    var BootstrapParams = (function () {
        function BootstrapParams() {
            this.paramMap = ['c', 'm', 's', 'cv', 'xywh', 'r', 'h', 'a']; // todo: move xywh, r, h, a to their respective extensions
            this.config = Utils.Urls.getQuerystringParameter('config');
            this.domain = Utils.Urls.getQuerystringParameter('domain');
            this.embedDomain = Utils.Urls.getQuerystringParameter('embedDomain');
            this.embedScriptUri = Utils.Urls.getQuerystringParameter('embedScriptUri');
            this.isHomeDomain = Utils.Urls.getQuerystringParameter('isHomeDomain') === 'true';
            this.isLightbox = Utils.Urls.getQuerystringParameter('isLightbox') === 'true';
            this.isOnlyInstance = Utils.Urls.getQuerystringParameter('isOnlyInstance') === 'true';
            this.isReload = Utils.Urls.getQuerystringParameter('isReload') === 'true';
            var jsonpParam = Utils.Urls.getQuerystringParameter('jsonp');
            this.jsonp = jsonpParam === null ? null : !(jsonpParam === 'false' || jsonpParam === '0');
            this.manifestUri = Utils.Urls.getQuerystringParameter('manifestUri');
            var locale = Utils.Urls.getQuerystringParameter('locale') || 'en-GB';
            this.setLocale(locale);
            this.collectionIndex = this.getParam(Params.collectionIndex);
            this.manifestIndex = this.getParam(Params.manifestIndex);
            this.sequenceIndex = this.getParam(Params.sequenceIndex);
            this.canvasIndex = this.getParam(Params.canvasIndex);
        }
        BootstrapParams.prototype.getLocaleName = function () {
            return this.localeName;
        };
        BootstrapParams.prototype.getParam = function (param) {
            if (this.hashParamsAvailable()) {
                // get param from parent document
                var p = parseInt(Utils.Urls.getHashParameter(this.paramMap[param], parent.document));
                if (p || p === 0)
                    return p;
            }
            // get param from iframe querystring
            return parseInt(Utils.Urls.getQuerystringParameter(this.paramMap[param])) || 0;
        };
        BootstrapParams.prototype.hashParamsAvailable = function () {
            return (this.isHomeDomain && !this.isReload && this.isOnlyInstance);
        };
        // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' into array
        BootstrapParams.prototype.setLocale = function (locale) {
            this.locale = locale;
            this.locales = [];
            var l = this.locale.split(',');
            for (var i = 0; i < l.length; i++) {
                var v = l[i].split(':');
                this.locales.push({
                    name: v[0].trim(),
                    label: (v[1]) ? v[1].trim() : ""
                });
            }
            this.localeName = this.locales[0].name;
        };
        return BootstrapParams;
    })();
    return BootstrapParams;
});
//# sourceMappingURL=BootstrapParams.js.map