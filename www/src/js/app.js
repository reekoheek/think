(function() {

    "use strict";

    $(function() {
        var app = window.app = new xin.Application({
            el: $('body')
        });

        app.providerRepository.add(new think.provider.DataProvider());
        app.providerRepository.add(new think.provider.DirectiveProvider());
        app.providerRepository.add(new think.provider.RouterProvider());

        app.use(new think.middleware.Auth());

        app.start();
    });

})();