(function() {

    "use strict";

    /**
     * think.view.ListItem
     */
    think.view.ListItem = xin.ui.Outlet.extend({
        events: {
            'click a[href="#remove"]': 'remove',
            'click a[href="#full"]': 'full',
            'click a[href="#moveto"]': 'moveTo',
            'click a[href="#movehere"]': 'moveHere',
            'click a[href="#due"]': 'due',
            'click a[href="#subtask"]': 'subtask',
            'click': 'select'
        },

        initialize: function() {
            xin.ui.Outlet.prototype.initialize.apply(this, arguments);
            var that = this;
            Backbone.Events.on('mode-move', function(v) {
                if (that != v) {
                    that.$el.addClass('mode-move');
                    that.moveObject = v;
                }
            });
        },

        select: function(evt) {
            evt.preventDefault();

            var $el = this.$el,
                $children = this.$el.parent().children().filter('.active');

            $children.removeClass('selected');

            if (this.$el.hasClass('active')) {
                this.$el.toggleClass('active');
            } else {
                $el.addClass('selected');

                if ($children.length) {
                    // $children.on('webkitTransitionEnd', function() {
                    //     $children.off('webkitTransitionEnd');
                        $el.addClass('active');
                    // });
                    $children.removeClass('active');
                } else {
                    $el.addClass('active');
                }
            }

        },

        full: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            comingSoon();
        },

        due: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            comingSoon();
        },

        moveTo: function(evt) {
            var that = this;
            evt.preventDefault();
            evt.stopImmediatePropagation();

            Backbone.Events.trigger('mode-move', this);
        },

        moveHere: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            this.moveObject.model.moveTo(this.model);
            // this.subtask(evt);
        },

        subtask: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            this.model.collection.setParent(this.model.id);
        },

        remove: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            var that = this;

            customConfirm('Are you sure?', function(value) {
                if (value) {
                    that.model.collection.remove(that.model.cid);
                    that.model.destroy();
                }
            });

            return false;
        }
    });

})();