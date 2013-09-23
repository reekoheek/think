(function() {

    "use strict";

    /**
     * think.model.Task
     */
    think.model.Task = Backbone.Model.extend({
        idAttribute: '$id',

        urlRoot: function() {
            return 'index.php/task';
        },

        parse: function(resp) {
            if (resp.$type || resp.key) {
                return resp;
            } else {
                return resp.entry || null;
            }
        },

        moveTo: function(parent) {
            this.set('parent_id', parent.id);
            this.save();
        },

        syncDirty: function() {
            var methodMap = {
                    'create': 'POST',
                    'update': 'PUT',
                    'patch': 'PATCH',
                    'delete': 'DELETE',
                    'read': 'GET'
                },
                promise = null,
                taskJournalRepository = app.get('repository.taskJournal'),
                xhrOptions = { headers: {'X-Auth-Token': xin.app.get('app.user').get('token')} };


            taskJournalRepository.all(function(err, journals) {
                _.each(journals, function(action) {
                    var p = $.Deferred();

                    if (action.object.key) {
                        delete action.object.key;
                    }
                    var model = new think.model.Task(action.object);
                    if (!promise) {
                        promise = p.promise();

                        Backbone.sync(action.method, model, _.clone(xhrOptions)).done(function() {
                            p.resolve();
                        }).fail(function(xhr) {
                            if (xhr.status == 404) {
                                p.resolve();
                            } else {
                                p.reject();
                            }
                        });
                    } else {
                        promise = promise.then(function() {
                            Backbone.sync(action.method, model, _.clone(xhrOptions)).done(function() {
                                p.resolve();
                            }).fail(function(xhr) {
                                if (xhr.status == 404) {
                                    p.resolve();
                                } else {
                                    p.reject();
                                }
                            });
                            return p.promise();
                        });
                    }
                });

                if (!promise) {
                    promise = $.Deferred().resolve().promise();
                }

                promise.then(function() {
                    var d = $.Deferred();
                    taskJournalRepository.nuke(d.resolve);
                    return d.promise();
                });

            });

            return promise;
        },

        sync: function(method, modcol, options) {
            var that = this,
                taskRepository = app.get('repository.task'),
                taskJournalRepository = app.get('repository.taskJournal'),
                _success = options.success;

            var originalSync = function(method, modcol, options) {
                if (!xin.app.get('app.user')) {
                    return;
                }
                options = _.defaults(options || {}, think.data.defaultOptions);
                think.data.beforeSend(options);
                return that.constructor.__super__.sync.apply(that, arguments);
            };


            think.remote.isOnline(function(online) {
                switch (method) {
                    case 'read':

                        if (online) {
                            console.log('read');
                            that.syncDirty().done(function() {
                                taskRepository.nuke(function() {
                                    options.success = function(resp) {
                                        var whens = [], newResp = {entries:[]};
                                        _.each(resp.entries, function(o) {
                                            var deferred = $.Deferred();

                                            whens.push(deferred);

                                            delete o.key;
                                            taskRepository.save(o, function(err, o) {
                                                if (o.parent_id == that.parent) {
                                                    newResp.entries.push(o);
                                                }
                                                deferred.resolve();
                                            });
                                        });

                                        $.when.apply(null, whens).done(function() {
                                            _success.call(null, newResp);
                                        });
                                    };
                                    originalSync.call(that, method, modcol, options);
                                });
                            });
                        } else {
                            taskRepository.all(function(err, entries) {
                                options.success({
                                    entries: entries
                                });
                                _.each(modcol.models, function(model) {
                                    model.id = model.id || model.get('key');
                                });
                            });
                        }
                        return;
                    case 'create':
                        if (online) {
                            // alert('Not implemented yet!');

                            that.syncDirty().done(function() {
                                options.success = function(resp) {
                                    taskRepository.save(resp.entry, function(err, o) {
                                        _success.call(null, o);
                                    });
                                };
                                originalSync.call(that, method, modcol, options);
                            });

                        } else {
                            taskRepository.save(modcol.toJSON(), function(err, o) {
                                modcol.set('key', modcol.id = o.key);

                                taskJournalRepository.save({
                                    method: 'create',
                                    object: o
                                });
                            });
                        }
                        return;
                    case 'delete':
                        if (online) {

                            that.syncDirty().done(function() {

                                options.success = function(resp) {
                                    taskRepository.remove(modcol.get('key'));
                                    _success.apply(null, arguments);
                                };
                                originalSync.call(that, method, modcol, options);
                            });
                        } else {
                            var remoteID = modcol.get('$id'),
                                key = modcol.get('key');

                            taskJournalRepository.all(function(err, journals) {
                                var keys = [];
                                _.each(journals, function(journal) {
                                    if (journal.object.key && key == journal.object.key) {
                                        taskJournalRepository.remove(journal.key);
                                    }
                                });

                                if (remoteID) {
                                    taskJournalRepository.save({
                                        method: 'delete',
                                        object: modcol.toJSON()
                                    });
                                }

                            });

                            taskRepository.remove(key);
                        }
                        return;
                    case 'update':
                        if (online) {
                            that.syncDirty().done(function() {
                                options.success = function(resp) {
                                    console.log(resp);
                                    // taskRepository.save(resp.entry, function(err, o) {
                                    //     _success.call(null, o);
                                    // });
                                };
                                originalSync.call(that, method, modcol, options);
                            });

                        } else {
                            // taskRepository.save(modcol.toJSON(), function(err, o) {
                            //     modcol.set('key', modcol.id = o.key);

                            //     taskJournalRepository.save({
                            //         method: 'create',
                            //         object: o
                            //     });
                            // });
                        }
                        return;
                    default:
                        console.log('sync', 'method', method);
                        console.log('sync', 'modcol', modcol);
                        console.log('sync', 'options', options);
                        originalSync.apply(this, arguments);
                }

            });

        }
    });

    _.extend(think.model.Task, {
        find: function() {
            return new think.model.Task.Collection();
        },
        Collection: Backbone.Collection.extend({
            model: think.model.Task,
            url: think.model.Task.prototype.urlRoot,

            remote: true,

            parse: function(resp) {
                return resp.entries;
            },
            setParent: function(parent) {
                this.parent = parent;
                this.reset();
                this.fetch();
            },
            sync: think.model.Task.prototype.sync,
            syncDirty: think.model.Task.prototype.syncDirty
        })
    });

})();