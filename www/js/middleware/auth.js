(function() {

    "use strict";

    /**
     * think.middleware.Auth
     */

    think.middleware.Auth = function() {

        this.call = function(options) {
            var deferred = $.Deferred(),
                user = this.app.get('app.user'),
                fragment = Backbone.history.getFragment();

            if (user.isLogin() && fragment != 'login') {
                $('.think-menu-logout span').html(user.get('username'));
                $('.think-btn-menu').show();
            } else {
                $('.think-btn-menu').hide();
            }

            think.remote.isOnline(function(online) {
                if (online) {
                    $('.think-online-indicator').removeClass('offline').addClass('online');
                } else {
                    $('.think-online-indicator').removeClass('online').addClass('offline');
                }
            });

            if (user.urlAllowed()) {
                deferred.resolve();
            } else {
                location.hash = 'login';
                deferred.reject();
            }

            return deferred.promise();
        };
    };

})();