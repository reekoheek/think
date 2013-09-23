(function() {

    "use strict";

    /**
     * think.view.Navbar
     */
    think.view.Navbar = xin.ui.Outlet.extend({

        events: {
            'click [href="#menu"]': 'toggleMenu'
        },

        initialize: function() {
            xin.ui.Outlet.prototype.initialize.apply(this, arguments);

            this.$el.addClass('xin-navbar');
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