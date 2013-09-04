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
                user = new think.model.User(),
                lawnchair = Lawnchair;

            xin.data.beforeSend = function(options) {
                options.headers = {
                    'X-Auth-Token': user.get('token')
                };
            };

            app.set('app.tasks', tasks);
            app.set('app.user', user);

            var dUser = $.Deferred();
            new Lawnchair({name: 'user'}, function(repo) {
                app.set('repository.user', repo);
                dUser.resolve();
            });
            deferredRules.push(dUser.promise());

            var dTask = $.Deferred();
            new Lawnchair({name: 'task'}, function(repo) {
                app.set('repository.task', repo);
                dTask.resolve();
            });
            deferredRules.push(dTask.promise());

            var dTaskJournal = $.Deferred();
            new Lawnchair({name: 'taskJournal'}, function(repo) {
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