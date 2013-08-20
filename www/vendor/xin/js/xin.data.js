(function() {

    "use strict";

    window.xin = window.xin || {};

    var data = xin.data = {
        defaultOptions: {
            dataType: 'json'
        },

        get: function(url) {
            var options = _.defaults({
                    type: 'get',
                    url: url
                }, data.defaultOptions);

            if (data.beforeSend) {
                data.beforeSend(options);
            }

            return $.ajax(options);
        },

        post: function(url, form) {
            var options = _.defaults({
                type: 'post',
                url: url,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(form)
            }, data.defaultOptions);

            if (data.beforeSend) {
                data.beforeSend(options);
            }

            return $.ajax(options);
        },

        onLine: function() {
            return navigator.onLine;
        }
    };

})();