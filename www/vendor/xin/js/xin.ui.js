(function() {

    "use strict";

    window.xin = window.xin || {};

    window.xin.ui = window.xin.ui || {};

    var Outlet = Backbone.View.extend({
    });
    window.xin.ui.Outlet = Outlet;

    var Pager = Outlet.extend({

        initialize: function(options) {
            this.transition = options.transition || 'plain';
            this.activePage = null;
            this.pages = {};
        },

        addChild: function(view) {
            var object = {};
            object[view.cid] = view;
            _.extend(this.pages, object);

            this.pageKeys = _.keys(this.pages);
            this.pageValues = _.values(this.pages);

            view.parent = this;

            return this;
        },

        showChild: function(view) {
            var inIndex = -1, outIndex = -1, deferred = $.Deferred();

            if (this.activePage == view) return deferred.resolve().promise();

            if (view) {
                inIndex = _.indexOf(this.pageValues, view);
            }
            if (this.activePage) {
                outIndex = _.indexOf(this.pageValues, this.activePage);
            }

            // console.log(inIndex, outIndex);
            //
            this.$el.scrollTop(0);

            xin.ui.Pager.transitions[this.transition](this, view, this.activePage, outIndex - inIndex)
                .done(deferred.resolve);

            this.activePage = view;

            return deferred.promise();
        }
    });

    _.extend(Pager, {
        transitions: {
            plain: function(pager, inView, outView, direction) {
                var deferred = $.Deferred();

                if (outView) {
                    outView.$el.removeClass('xin-show');
                }
                inView.$el.addClass('xin-show');
                deferred.resolve();

                return deferred.promise();
            },

            slide: function(pager, inView, outView, direction) {
                var method, inFx, outFx, deferred = $.Deferred();
                if (direction < 0) {
                    method = "left";
                } else {
                    method = "right";
                }
                //in
                if (inView) {
                    inFx = new xin.fx.SlideIn(inView.$el, method);
                }
                //out
                if (outView) {
                    outFx = new xin.fx.SlideOut(outView.$el, method);
                }

                if (inFx) inFx.play();
                if (outFx) outFx.play().then(function() {
                    $(this).removeClass('xin-show');
                    _.defer(deferred.resolve);
                });

                return deferred.promise();
            }
        }
    });

    window.xin.ui.Pager = Pager;


    var List = Outlet.extend({
        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);
        },

        render: function() {
            // TODO template exist? do render template first
            // no template render here

            if (!this.collection.length) {
                if (this.emptyTemplate) {
                    this.$('[data-empty-attach-point]').html('');
                    this.$('[data-item-attach-point]').html('');

                    this.$('[data-empty-attach-point]').html(this.emptyTemplate(this));
                }
            } else {
                if (this.itemTemplate) {
                    this.$('[data-empty-attach-point]').html('');
                    this.$('[data-item-attach-point]').html('');

                    this.collection.each(_.bind(function(model) {
                        this.$('[data-item-attach-point]').append(this.itemTemplate({
                            view: this,
                            model: model
                        }));
                    }, this));
                }
            }
        }
    });

    window.xin.ui.List = List;

    _.extend(window.xin.ui, {
        show: function(view) {
            _.defer(function() {
                if (view.parent && view.parent.showChild) {
                    view.parent.showChild(view).done(function() {
                        view.$el.addClass('xin-show');
                    });
                } else {
                   view.$el.addClass('xin-show');
                }
            });
        }
    });

})();