(function() {

    "use strict";

    /**
     * think.provider.DataProvider
     */
    think.provider.DataProvider = function() {

        this.initialize = function(app) {
            var promise,
                deferred = $.Deferred(),
                deferredRules = [],
                tasks = think.model.Task.find(),
                user = new think.model.User();

            think.data.beforeSend = function(options) {
                options.headers = {
                    'X-Auth-Token': user.get('token')
                };
            };

            app.set('app.tasks', tasks);
            app.set('app.user', user);

            var dUser = $.Deferred();
            new xin.data.Repository({name: 'user'}, function(err, repo) {
                app.set('repository.user', repo);
                dUser.resolve();
            });
            deferredRules.push(dUser.promise());

            var dTask = $.Deferred();
            new xin.data.Repository({name: 'task'}, function(err, repo) {
                app.set('repository.task', repo);
                dTask.resolve();
            });
            deferredRules.push(dTask.promise());

            var dTaskJournal = $.Deferred();
            new xin.data.Repository({name: 'taskJournal'}, function(err, repo) {
                app.set('repository.taskJournal', repo);
                dTaskJournal.resolve();
            });
            deferredRules.push(dTaskJournal.promise());

            $.when.apply(null, deferredRules).done(function() {
                console.log('sync-user');
                user.on('sync', function() {
                    _.defer(function() {
                        tasks.reset();
                        tasks.fetch();
                    });
                });
                user.fetch();

                deferred.resolve();
            });

            return deferred.promise();
        };
    };

})();