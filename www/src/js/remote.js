(function() {

    "use strict";

    think.remote = {
        isOnline: function(callback) {
            _.defer(function() {
                // callback(localStorage['online']);
                callback(navigator.onLine);
            });
        }
    };

})();