(function() {
    "use strict";

    window.xin = window.xin || {};

    var Router = function() {
        Backbone.Router.apply(this, arguments);
    };

    _.extend(Router.prototype, Backbone.Router.prototype, {
        start: function() {
            Backbone.history.handlers.push({
                route: /^(.*?)$/,
                callback: _.bind((this.options && this.options.routeMissing) || this.routeMissing, this)
            });

            Backbone.history.start();
        },

        routeMissing: function(uri) {
            console.error('Missing route for URI: "' + uri + '"');
        },

        show: function(view) {
            if (view) {
                if (typeof view.show == 'function') {
                    view.show();
                } else {
                    view.$el.addClass('hz-show');
                }
            }
        }
    });

    xin.Router = Router;
})();