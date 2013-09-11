(function() {

    "use strict";

    /**
     * think.provider.DirectiveProvider
     */
    think.provider.DirectiveProvider = function() {

        this.initialize = function(app) {
            app.directiveManager.add('[data-role=app]', xin.directive.AppDirective);
            // app.directiveManager.add('[data-role=list-*]', xin.directive.ListDirective);
            app.directiveManager.add('[data-role]', xin.directive.RoleDirective);
            app.directiveManager.add('[data-uri]', xin.directive.URIDirective);
            return app.directiveManager.scan();
        };
    };

})();