(function() {

    "use strict";

    var taskRepository; // = app.get('repository.task');

    /**
     * think.view.Home
     */
    think.view.Home = xin.ui.Outlet.extend({
        events: {
            'click .show-super': 'showSuper'
        },

        showSuper: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var that = this,
                p = this.collection.parent;

            if (!taskRepository) {
                taskRepository = app.get('repository.task');
            }

            if (p) {
                taskRepository.all(function(err, rows) {
                    var parent;
                    _.each(rows, function(row) {
                        if (row.$id == p) {
                            parent = row.parent_id;
                        }
                    });
                    that.collection.setParent(parent);
                });
            }
        }
    });

})();