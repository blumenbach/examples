define(["require", "exports", "./BaseCommands", "./Information", "./InformationAction", "./InformationType"], function (require, exports, BaseCommands, Information, InformationAction, InformationType) {
    var InformationFactory = (function () {
        function InformationFactory(extension) {
            this.extension = extension;
        }
        InformationFactory.prototype.Get = function (args) {
            switch (args.informationType) {
                case (InformationType.AUTH_CORS_ERROR):
                    return new Information(this.extension.config.content.authCORSError, []);
                case (InformationType.DEGRADED_RESOURCE):
                    var actions = [];
                    var loginAction = new InformationAction();
                    loginAction.label = this.extension.config.content.degradedResourceLogin;
                    loginAction.action = function () {
                        $.publish(BaseCommands.HIDE_INFORMATION);
                        $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE, [[args.param]]);
                    };
                    actions.push(loginAction);
                    return new Information(this.extension.config.content.degradedResourceMessage, actions);
            }
        };
        return InformationFactory;
    })();
    return InformationFactory;
});
//# sourceMappingURL=InformationFactory.js.map