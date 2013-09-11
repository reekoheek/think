(function() {
    "use strict";

    window.customAlert = function(message) {
        $.get('templates/alert-modal.html', function(data) {
            var $modal = $(data);
            $modal.appendTo('body').modal({
                backdrop: 'static'
            }).on('hide.bs.modal', function () {
                $modal.remove();
            }).find('.modal-body').html(message);
        });
    };


    window.customConfirm = function(message, callback) {
        var value = false;

        $.get('templates/confirm-modal.html', function(data) {
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

    window.comingSoon = function() {
        customAlert('Coming soon...');
    };

    window.think = {
        provider: {},
        middleware: {},
        view: {},
        model: {}
    };

})();