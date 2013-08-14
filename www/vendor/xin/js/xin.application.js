(function() {

    "use strict";

    window.xin = window.xin || {};

    var Application = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Application.prototype, {
        initialize: function(options) {

            options = options || {};

            this.container = new xin.IoC();
            this.router = options.router || new xin.Router();
            this.router.app = this;
            this.directiveManager = new xin.DirectiveManager(this);

            this.$el = $(options.el);
            this.$el.addClass('xin-app').attr('data-role', 'app');
        },

        remove: function() {
            this.$el.removeClass('xin-app').removeAttr('data-role');
        },

        start: function() {
            if (typeof this.router.start === 'function') {
                this.router.start();
            } else {
                Backbone.history.start();
            }
        },

        set: function() {
            this.container.set.apply(this.container, arguments);
        },

        get: function() {
            return this.container.get.apply(this.container, arguments);
        },

        resolve: function() {
            return this.container.resolve.apply(this.container, arguments);
        },

        viewForURI: function() {

        }
    });

    window.xin.Application = Application;

})();