(function() {

    "use strict";

    window._alert = window.alert;
    window._confirm = window.confirm;

    window.alert = function(message) {
        $.get('vendor/think/templates/alert-modal.html', function(data) {
            var $modal = $(data);
            $modal.appendTo('body').modal({
                backdrop: 'static'
            }).on('hide.bs.modal', function () {
                $modal.remove();
            }).find('.modal-body').html(message);
        });
    };


    window.confirm = function(message, callback) {
        var value = false;

        $.get('vendor/think/templates/confirm-modal.html', function(data) {
            var $modal = $(data);
            $modal.appendTo('body').modal({
                backdrop: 'static'
            });
            $modal.on('hide.bs.modal', function () {
                callback(value);
                $modal.remove();
            }).on('click', '.btn-primary', function() {
                value = true;
                $modal.modal('hide');
            });

            $modal.find('.modal-body').html(message);
        });
    };

    function comingSoon() {
        alert('Coming soon...');
    }

    var think = window.think = {
        provider: {},
        middleware: {},
        view: {},
        model: {},
        data: {},
    };

    think.data = {
        get: function(name) {
            var object = null;
            try {
                object = JSON.parse(localStorage[name]);
            } catch(e) {
                object = null;
            }
            return object;
        },
        set: function(name, value) {
            if (!value) {
                try {
                    delete localStorage[name];
                } catch(e) {}
                return;
            }

            localStorage[name] = JSON.stringify(value);
        },
        S4: function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        generateId: function() {
          return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4();
        }
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
                $('.think-btn-menu').show();
            } else {
                $('.think-btn-menu').hide();
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
            // app.directiveManager.add('[data-role=list-*]', xin.directive.ListDirective);
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
                    tasks.reset();
                    tasks.fetch();
                });
            });
            // user.once('sync', function() {
            //     xin.data.get('index.php/user/check').fail(function() {
            //         user.logout().done(function() {
            //             if (!user.urlAllowed()) {
            //                 location.hash = 'login';
            //             }
            //         });
            //     });
            // });
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

            app.router.route('refresh', function() {
                var tasks = app.get('app.tasks');
                if (tasks) {
                    tasks.reset();
                    tasks.fetch();
                }
            });
        };
    };

    /**
     * think.model.User
     */
    think.model.User = Backbone.Model.extend({
        sync: function(method, model, options) {
            var user = think.data.get('user') || {},
                deferred = $.Deferred();

            switch(method) {
                case 'read':
                    options.success(user);
                    break;
                case 'create':
                    user = this.toJSON();
                    think.data.set('user', user);

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
            localStorage.clear();

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
            if (resp['$type'] || resp['lid']) {
                return resp;
            } else {
                return resp.entry || null;
            }
        },

        syncDirty: function() {
            var methodMap = {
                'create': 'POST',
                'update': 'PUT',
                'patch': 'PATCH',
                'delete': 'DELETE',
                'read': 'GET'
            };
            var promise = null;

            var journalTask = think.data.get('journal:task') || [];
            _.each(journalTask, function(action) {
                if (action.object.lid) {
                    delete action.object.lid;
                }
                var model = new think.model.Task(action.object);
                if (!promise) {
                    promise = Backbone.sync(action.method, model, {});
                } else {
                    promise = promise.then(function() {
                        return Backbone.sync(action.method, model, {});
                    });
                }
            });

            if (!promise) {
                promise = $.Deferred().resolve().promise();
            }

            promise.then(function() {
                think.data.set('journal:task', null);
            });

            return promise;
        },

        sync: function(method, modcol, options) {
            var that = this;

            var originalSync = function(method, modcol, options) {
                if (!xin.app.get('app.user')) {
                    return;
                }
                options.headers = {'X-Auth-Token': xin.app.get('app.user').get('token')};
                return that.constructor.__super__.sync.apply(that, arguments);
            };

            var _success = options.success,
                journalTask,
                parentObject,
                tasks;

            switch (method) {
                case 'read':
                    parentObject = modcol.parentObject;

                    if (xin.data.onLine()) {
                        this.syncDirty().done(function() {
                            options.success = function(resp) {
                                think.data.set('task:' + parentObject, resp.entries);
                                _success.apply(null, arguments);
                            };
                            originalSync.call(that, method, modcol, options);
                        });
                        return;
                    }

                    var entries = think.data.get('task:' + parentObject) || [];
                    options.success({
                        entries: entries
                    });
                    _.each(modcol.models, function(model) {
                        model.id = model.id || model.get('lid');
                    });
                    return;
                case 'create':
                    parentObject = '';
                    if (modcol.collection) {
                        parentObject = modcol.collection.parentObject || '';
                    }

                    if (xin.data.onLine()) {

                        this.syncDirty().done(function() {
                            options.success = function(resp) {
                                var name = 'task:' + parentObject;
                                var tasks = think.data.get(name) || [];
                                tasks.push(resp.entry);
                                think.data.set(name, tasks);
                                _success.apply(null, arguments);
                            };
                            originalSync.call(that, method, modcol, options);
                        });

                        return;
                    } else {
                        journalTask = think.data.get('journal:task') || [];
                        modcol.id = think.data.generateId();
                        modcol.set('lid', modcol.id);

                        journalTask.push({method: 'create', object: modcol.toJSON()});
                        think.data.set('journal:task', journalTask);

                        tasks = think.data.get('task:' + parentObject) || [];
                        tasks.push(modcol.toJSON());
                        think.data.set('task:' + parentObject, tasks);
                    }
                    return;
                case 'delete':
                    parentObject = '';
                    if (modcol.collection) {
                        parentObject = modcol.collection.parentObject || '';
                    }

                    if (xin.data.onLine()) {

                        this.syncDirty().done(function() {
                            options.success = function(resp) {
                                var name = 'task:' + parentObject;
                                var tasks = think.data.get(name) || [];
                                tasks = _.filter(tasks, function(task) {
                                    return task['$id'] != modcol.id && task['lid'] != modcol.id;
                                });
                                think.data.set(name, tasks);
                                _success.apply(null, arguments);
                            };
                            originalSync.call(that, method, modcol, options);
                        });
                        return;
                    } else {
                        journalTask = think.data.get('journal:task') || [];
                        var lid = modcol.get('lid');
                        if (lid) {
                            journalTask = _.filter(journalTask, function(action) {
                                return action.object.lid !== lid;
                            });
                        } else {
                            journalTask.push({method: 'delete', object: modcol.toJSON()});
                        }
                        think.data.set('journal:task', journalTask);

                        tasks = think.data.get('task:' + parentObject) || [];
                        tasks = tasks.filter(function(task) {
                            return task.lid != lid;
                        });
                        think.data.set('task:' + parentObject, tasks);
                    }
                    return;
                default:
                    console.log('sync', 'method', method);
                    console.log('sync', 'modcol', modcol);
                    console.log('sync', 'options', options);
                    originalSync.apply(this, arguments);
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
            parentObject: '',

            remote: true,

            parse: function(resp) {
                return resp.entries;
            },
            sync: think.model.Task.prototype.sync,
            syncDirty: think.model.Task.prototype.syncDirty
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
            model.save();

            this.collection.add(model);

            this.$('form')[0].reset();
        }
    });

    /**
     * think.view.Home
     */
    think.view.Home = xin.ui.Outlet.extend({});

    /**
     * think.view.ListItem
     */
    think.view.ListItem = xin.ui.Outlet.extend({
        events: {
            'click a[href="#remove"]': 'remove',
            'click a[href="#full"]': 'full',
            'click a[href="#note"]': 'note',
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

        note: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            comingSoon();
        },

        subtask: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            comingSoon();
        },

        remove: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();

            var that = this;

            confirm('Are you sure?', function(value) {
                if (value) {
                    that.model.collection.remove(that.model.cid);
                    that.model.destroy();
                }
            });

            return false;
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