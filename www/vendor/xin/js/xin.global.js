(function() {

    "use strict";

    window.xin = window.xin || {};

    Deferred.installInto(window.xin);
    if (!$.Deferred) {
        Deferred.installInto($);
    }

    $.fn.serializeObject = function() {
        var form = {};
        _.each($(this).serializeArray(), function(value) {
            form[value.name] = value.value;
        });
        return form;
    };

    window.alert = function() {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", 'data:text/plain,');
        iframe.setAttribute("style", "width:0");
        document.documentElement.appendChild(iframe);
        var result = window.frames[0].window.alert.apply(window.frames[0].window, arguments);
        iframe.parentNode.removeChild(iframe);
        return result;
    };


    window.confirm = function() {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", 'data:text/plain,');
        iframe.setAttribute("style", "width:0");
        document.documentElement.appendChild(iframe);
        var result = window.frames[0].window.confirm.apply(window.frames[0].window, arguments);
        iframe.parentNode.removeChild(iframe);
        return result;
    };

})();