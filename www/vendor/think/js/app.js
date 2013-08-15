(function() {

    "use strict";

    var think = window.think = {
        provider: {},
        middleware: {},
        view: {},
        model: {}
    };

    /**
     * think.middleware.Auth
     */

    think.middleware.Auth = function() {
        this.isAllowed = function() {
            var user = this.app.get('app.user'),
                fragment = Backbone.history.getFragment();

            return ['login', 'logout'].indexOf(fragment) >= 0 || user.isLogin();
        };

        this.call = function(options) {
            var deferred = $.Deferred(),
                user = this.app.get('app.user'),
                fragment = Backbone.history.getFragment();

            if (user.isLogin() && fragment != 'login') {
                $('.think-user-menu span').html(user.get('username'));
                $('.think-user-menu').show();
                $('.think-global-menu').hide();
            } else {
                user.logout();
                $('.think-user-menu').hide();
                $('.think-global-menu').show();
            }

            if (this.isAllowed()) {
                deferred.resolve();
            } else {
                location.hash = 'login';
                deferred.reject();
            }

            return deferred.promise();
        };
    };

    /**
     * think.provider.DirectiveProvider
     */
    think.provider.DirectiveProvider = function() {

        this.initialize = function(app) {
            app.directiveManager.add('[data-role=app]', xin.directive.AppDirective);
            app.directiveManager.add('[data-role=list-*]', xin.directive.ListDirective);
            app.directiveManager.add('[data-role]', xin.directive.RoleDirective);
            app.directiveManager.add('[data-uri]', xin.directive.URIDirective);
            return app.directiveManager.scan();
        };
    };

    /**
     * think.provider.DataProvider
     */
    think.provider.DataProvider = function() {

        this.initialize = function(app) {
            var tasks = think.model.Task.find(),
                user = new think.model.User();

            user.on('sync', function() {
                _.defer(function() {
                    tasks.fetch();
                });
            });
            user.fetch();

            app.set('app.tasks', tasks);
            app.set('app.user', user);
        };
    };

    /**
     * think.provider.RouterProvider
     */
    think.provider.RouterProvider = function() {

        this.initialize = function(app) {
            app.router.route('logout', function() {
                location.hash = 'login';
            });
        };
    };

    /**
     * think.model.User
     */
    think.model.User = Backbone.Model.extend({
        sync: function(method, model, options) {
            var user,
                deferred = $.Deferred();
            try {
                user = JSON.parse(localStorage['user']);
            } catch(e) {
                user = {};
            }
            switch(method) {
                case 'read':
                    options.success(user);
                    break;
                case 'create':
                    user = this.toJSON();
                    localStorage['user'] = JSON.stringify(user);

                    options.success(user);
                    break;
                default:
                    console.log(arguments);
            }

            _.defer(deferred.resolve);

            return deferred.promise();
        },

        isLogin: function() {
            return this.attributes.isLogin || false;
        },

        login: function(login, password) {
            var deferred = $.Deferred(),
                form = {
                    username: login,
                    password: password
                },
                that = this;

            $.ajax({
                type: 'post',
                url: 'index.php/user/login',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(form)
            }).done(function(data) {
                var entry = data.entry;
                entry.isLogin = true;
                that.set(entry);
                that.save();
                deferred.resolve(that);
            }).fail(function() {
                deferred.reject(that);
            });

            return deferred.promise();
        },

        logout: function() {
            var that = this;
            var next = function() {
                that.clear();
                that.save();
            };

            if (this.get('token')) {
                $.ajax({
                    type: 'post',
                    url: 'index.php/user/logout',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({token:this.get('token')})
                }).always(function() {
                    next();
                });
            } else {
                next();
            }
        }
    });

    /**
     * think.model.Task
     */
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
        },

        sync: function(method, modcol, options) {
            if (!xin.app.get('app.user')) {
                return;
            }
            options.headers = {'X-Auth-Token': xin.app.get('app.user').get('token')};
            return this.constructor.__super__.sync.apply(this, arguments);
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
            },
            sync: think.model.Task.prototype.sync,
        })
    });

    /**
     * think.view.Login
     */
    think.view.Login = Backbone.View.extend({
        events: {
            'submit form': 'login'
        },

        login: function(evt) {
            evt.preventDefault();
            var form = this.$('form').serializeObject();
            this.model.login(form.login, form.password).done(function() {
                location.hash = '';
            }).fail(function() {
                alert('Username or password wrong!');
            });
        }
    });

    /**
     * think.view.Add
     */
    think.view.Add = Backbone.View.extend({
        events: {
            'submit form': 'add'
        },

        add: function(evt) {
            evt.preventDefault();

            var form = this.$('form').serializeObject(),
                user = this.options.app.get('app.user');

            form.userId = user.get('$id');

            var model = new this.collection.model(form);
            model.save();

            this.collection.add(model);

            this.$('form')[0].reset();
        }
    });

    /**
     * think.view.Home
     */
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

        app.providerRepository.add(new think.provider.DataProvider());
        app.providerRepository.add(new think.provider.DirectiveProvider());
        app.providerRepository.add(new think.provider.RouterProvider());

        app.use(new think.middleware.Auth());

        app.start();
    });

})();