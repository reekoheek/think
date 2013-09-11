(function() {

    "use strict";

    /**
     * think.view.Menu
     */
    think.view.Menu = xin.ui.Outlet.extend({
        events: {
            'click .think-menu-update': 'updateApp'
        },

        updateApp: function(evt) {
            evt.preventDefault();
            $('html').data('cache').check();
            location.hash = 'home';
        }
    });

})();