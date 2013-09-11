(function() {

    "use strict";

    /**
     * think.view.Navbar
     */
    think.view.Navbar = xin.ui.Outlet.extend({
        events: {
            'click [href="#menu"]': 'toggleMenu'
        },

        toggleMenu: function(evt) {
            evt.preventDefault();

            if (Backbone.history.getFragment() == 'menu') {
                location.hash = 'home';
            } else {
                location.hash = 'menu';
            }
        }
    });

})();