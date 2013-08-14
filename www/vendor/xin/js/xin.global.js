(function() {

    "use strict";

    window.xin = window.xin || {};

    Deferred.installInto(window.xin);
    if (!$.Deferred) {
        Deferred.installInto($);
    }

})();