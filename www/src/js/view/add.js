(function() {

    "use strict";

    /**
     * think.view.Add
     */
    think.view.Add = Backbone.View.extend({
        events: {
            'submit form': 'add',
            'click a[href="#full"]': 'full'
        },

        full: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            comingSoon();
        },

        add: function(evt) {
            evt.preventDefault();

            // this.$('input').blur();

            var form = this.$('form').serializeObject(),
                user = this.app.get('app.user'),
                model;

            if (!form.subject) {
                return;
            }

            form.user_id = user.get('$id');

            model = new this.collection.model(form);
            model.set('parent_id', this.collection.parent);
            model.save();

            this.collection.add(model);

            this.$('form')[0].reset();
        }
    });

})();