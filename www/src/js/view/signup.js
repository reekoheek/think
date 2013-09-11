(function() {

    "use strict";

    /**
     * think.view.Signup
     */
    think.view.Signup = xin.ui.Outlet.extend({
        events: {
            'submit form': 'signup'
        },

        signup: function(evt) {
            evt.preventDefault();

            this.$('input').blur();

            var form = this.$('form').serializeObject();
            this.model.signup(form).done(function() {
                location.hash = '';
            }).fail(function(errors) {
                console.error(errors);
            });
        }
    });

})();