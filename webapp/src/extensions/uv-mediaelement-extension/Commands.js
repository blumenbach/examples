define(["require", "exports"], function (require, exports) {
    var Commands = (function () {
        function Commands() {
        }
        Commands.namespace = 'mediaelementExtension.';
        Commands.MEDIA_ENDED = Commands.namespace + 'onMediaEnded';
        Commands.MEDIA_PAUSED = Commands.namespace + 'onMediaPaused';
        Commands.MEDIA_PLAYED = Commands.namespace + 'onMediaPlayed';
        return Commands;
    })();
    return Commands;
});
//# sourceMappingURL=Commands.js.map