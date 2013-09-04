(function() {

    "use strict";

    /**
     * think.model.User
     */
    think.model.User = Backbone.Model.extend({
        sync: function(method, model, options) {
            var that = this,
                user,
                userRepository = app.get('repository.user'),
                deferred = $.Deferred();

            userRepository.all(function(users) {
                user = users[0] || {};

                switch(method) {
                    case 'read':
                        options.success(user);
                        break;
                    case 'create':
                        user = that.toJSON();
                        userRepository.nuke().save(user);

                        options.success(user);
                        break;
                    default:
                        console.log(arguments);
                }

                _.defer(deferred.resolve);

            });

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
                    customAlert('Signup failed!');
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

})();