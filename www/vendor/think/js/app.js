(function() {

    "use strict";

    var think = window.think = {
        view: {},
        model: {},
        collection: {}
    };

    think.model.Task = Backbone.Model.extend({
        idAttribute: '$id',

        urlRoot: function() {
            return 'index.php/task';
        },

        parse: function(resp) {
            if (resp['$type']) {
                return resp;
            } else {
                return resp.entry || null;
            }
        }
    });

    _.extend(think.model.Task, {
        find: function() {
            return new think.model.Task.Collection();
        },
        Collection: Backbone.Collection.extend({
            model: think.model.Task,
            url: think.model.Task.prototype.urlRoot,
            parse: function(resp) {
                return resp.entries;
            }
        })
    });

    // window.x = think.model.Task.find();
    // console.log('x', x);

    // think.collection.Tasks = Backbone.Collection.extend({
    //     sync: function(method, model, options) {
    //         var tasks;

    //         if (method == 'read') {
    //             tasks = localStorage['tasks'];
    //             if (tasks) {
    //                 tasks = JSON.parse(tasks) || [];
    //             } else {
    //                 tasks = [];
    //             }
    //             options.success(tasks);
    //         } else if (method == 'update') {
    //             tasks = this.toJSON();
    //         }

    //         localStorage['tasks'] = JSON.stringify(tasks || []);
    //     },

    //     toJSON: function() {
    //         var collection = [];
    //         this.each(function(model) {
    //             collection.push(model.toJSON());
    //         });
    //         return collection;
    //     }
    // });

    think.collection.tasks = think.model.Task.find();

    think.view.Login = Backbone.View.extend({
        events: {
            'submit form': 'login'
        },

        login: function(evt) {
            evt.preventDefault();
            alert(this.$('form').serializeArray());
        }
    });

    think.view.Add = Backbone.View.extend({
        events: {
            'submit form': 'add'
        },

        add: function(evt) {
            evt.preventDefault();

            var form = {};
            _.each(this.$('form').serializeArray(), function(value) {
                form[value.name] = value.value;
            });

            var model = new this.collection.model(form);
            model.save();

            this.collection.add(model);

            this.$('form')[0].reset();
        }
    });

    think.view.Home = Backbone.View.extend({
        events: {
            'click a[href="#remove"]': 'remove'
        },

        remove: function(evt) {
            evt.preventDefault();
            var cid = $(evt.target).data('cid');

            var model = this.collection.get(cid);

            this.collection.remove(model);

            model.destroy();
        }
    });


    $(function() {
        var app = window.app = new xin.Application({
            el: $('body')
        });

        app.directiveManager.add('[data-role=app]', xin.directive.AppDirective);
        app.directiveManager.add('[data-role=list-*]', xin.directive.ListDirective);
        app.directiveManager.add('[data-role]', xin.directive.RoleDirective);
        app.directiveManager.add('[data-uri]', xin.directive.URIDirective);

        $.when(app.directiveManager.scan()).done(function() {
            var homeList = $('#home-list').data('instance');
            homeList.collection.fetch();
            app.start();
        });
    });

})();