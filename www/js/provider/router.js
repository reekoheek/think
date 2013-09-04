(function() {

    "use strict";

    /**
     * think.provider.RouterProvider
     */
    think.provider.RouterProvider = function() {

        this.initialize = function(app) {
            app.router.route('logout', function() {
                app.get('app.user').logout().done(function() {
                    location.hash = 'login';
                });
            });

            app.router.route('refresh', function() {
                var tasks = app.get('app.tasks');
                if (tasks) {
                    tasks.reset();
                    tasks.fetch();
                }
                location.hash = 'home';
            });
        };
    };

})();