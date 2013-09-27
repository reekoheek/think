(function() {

    "use strict";

    /**
     * think.view.Login
     */
    think.view.Login = xin.ui.Outlet.extend({
        // events: {
        //     'submit form': 'login'
        // },

        login: function(evt) {
            evt.preventDefault();

            this.$('input').blur();

            var form = this.$('form').serializeObject();
            this.model.login(form.login, form.password).done(function() {
                location.hash = '';
            }).fail(function() {
                customAlert('Username or password wrong!');
            });
        }
    });

})();