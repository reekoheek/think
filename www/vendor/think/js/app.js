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

        this.call = function(options) {
            var deferred = $.Deferred(),
                user = this.app.get('app.user'),
                fragment = Backbone.history.getFragment();

            if (user.isLogin() && fragment != 'login') {
                $('.think-menu-logout span').html(user.get('username'));
            }


            if (xin.data.onLine()) {
                $('.think-online-indicator').removeClass('offline').addClass('online');
            } else {
                $('.think-online-indicator').removeClass('online').addClass('offline');
            }

            if (user.urlAllowed()) {
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

            xin.data.beforeSend = function(options) {
                options.headers = {
                    'X-Auth-Token': user.get('token')
                };
            };

            user.on('sync', function() {
                _.defer(function() {
                    tasks.fetch();
                });
            });
            user.once('sync', function() {
                xin.data.get('index.php/user/check').fail(function() {
                    user.logout().done(function() {
                        if (!user.urlAllowed()) {
                            location.hash = 'login';
                        }
                    });
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
                app.get('app.user').logout().done(function() {
                    location.hash = 'login';
                });
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

        urlAllowed: function() {
            var fragment = Backbone.history.getFragment();

            return ['login', 'logout', 'signup'].indexOf(fragment) >= 0 || this.isLogin();
        },

        login: function(login, password) {
            var deferred = $.Deferred(),
                form = {
                    login: login,
                    password: password
                },
                that = this;

            xin.data
                .post('index.php/user/login', form)
                .done(function(data) {
                var entry = data.entry;
                entry.isLogin = true;
                that.set(entry);
                that.save();
                _.defer(function() {
                    deferred.resolve(that);
                });
            }).fail(function() {
                deferred.reject(that);
            });

            return deferred.promise();
        },

        signup: function(form) {
            var deferred = $.Deferred(),
                that = this;

            xin.data
                .post('index.php/user/signup', form)
                .done(function(data) {
                    var entry = data.entry;
                    entry.isLogin = true;
                    that.set(entry);
                    that.save();
                    _.defer(function() {
                        deferred.resolve(that);
                    });
                }).fail(function() {
                    alert('Signup failed!');
                });

            return deferred.promise();
        },

        logout: function() {
            var that = this,
                deferred = $.Deferred(),
                next = function() {
                that.clear();
                that.save();
                _.defer(deferred.resolve);
            };

            if (this.get('token')) {
                xin.data
                .get('index.php/user/logout')
                .always(function() {
                    next();
                });
            } else {
                next();
            }

            return deferred.promise();
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
     * think.view.Navbar
     */
    think.view.Navbar = xin.ui.Outlet.extend({
        events: {
            'click [href="#menu"]': 'toggleMenu'
        },

        toggleMenu: function(evt) {
            evt.preventDefault();

            if (Backbone.history.getFragment() == 'menu') {
                location.hash = 'home';
            } else {
                location.hash = 'menu';
            }
        }
    });

    /**
     * think.view.Menu
     */
    think.view.Menu = xin.ui.Outlet.extend({
        events: {
            'click .think-menu-update': 'updateApp'
        },

        updateApp: function(evt) {
            evt.preventDefault();
            $('html').data('cache').check();
            location.hash = 'home';
        }
    });

    /**
     * think.view.Login
     */
    think.view.Login = xin.ui.Outlet.extend({
        events: {
            'submit form': 'login'
        },

        login: function(evt) {
            evt.preventDefault();

            this.$('input').blur();

            var form = this.$('form').serializeObject();
            this.model.login(form.login, form.password).done(function() {
                location.hash = '';
            }).fail(function() {
                alert('Username or password wrong!');
            });
        }
    });

    /**
     * think.view.Signup
     */
    think.view.Signup = xin.ui.Outlet.extend({
        events: {
            'submit form': 'signup'
        },

        signup: function(evt) {
            evt.preventDefault();

            this.$('input').blur();

            var form = this.$('form').serializeObject();
            this.model.signup(form).done(function() {
                location.hash = '';
            }).fail(function(errors) {
                console.error(errors);
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

            this.$('input').blur();

            var form = this.$('form').serializeObject(),
                user = this.app.get('app.user'),
                model;

            // FIXME change to created_by
            form.userId = user.get('$id');

            model = new this.collection.model(form);
            model.save();

            this.collection.add(model);

            this.$('form')[0].reset();
        }
    });

    /**
     * think.view.Home
     */
    think.view.Home = xin.ui.Outlet.extend({
        events: {
            'click a[href="#remove"]': 'remove'
        },

        remove: function(evt) {

            evt.preventDefault();

            if (confirm('Are you sure?')) {
                var $target = $(evt.target);
                if ($target[0].tagName != 'A') {
                    $target = $target.parents('a').eq(0);
                }
                var cid = $target.data('cid'),
                    model = this.collection.get(cid);

                this.collection.remove(model);

                model.destroy();
            }

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