define(["require", "exports"], function (require, exports) {
    var Mode = (function () {
        function Mode(value) {
            this.value = value;
        }
        Mode.prototype.toString = function () {
            return this.value;
        };
        Mode.image = new Mode("image");
        Mode.page = new Mode("page");
        return Mode;
    })();
    return Mode;
});
//# sourceMappingURL=Mode.js.map