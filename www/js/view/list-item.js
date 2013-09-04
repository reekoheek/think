(function() {

    "use strict";

    /**
     * think.view.ListItem
     */
    think.view.ListItem = xin.ui.Outlet.extend({
        events: {
            'click a[href="#remove"]': 'remove',
            'click a[href="#full"]': 'full',
            // 'click a[href="#note"]': 'note',
            'click a[href="#due"]': 'due',
            'click a[href="#subtask"]': 'subtask',
            'click': 'select'
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

        // note: function(evt) {
        //     evt.preventDefault();
        //     evt.stopImmediatePropagation();

        //     comingSoon();
        // },

        subtask: function(evt) {
            evt.preventDefault();

            var collection = this.model.collection;
            console.log(this.model);
            // collection.parentId = this.model.get('$id');
            // collection.reset();
            // collection.fetch();


            evt.stopImmediatePropagation();
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