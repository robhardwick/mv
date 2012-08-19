require.config({
    paths: {
        text: 'libs/require/text',
        jQuery: 'libs/jquery/jquery-1.7.2',
        underscore: 'libs/underscore/underscore',
        Backbone: 'libs/backbone/backbone',
        swfobject: 'libs/swfobject/jquery.swfobject.1-1-1.min',
        bootstrapDropdown: 'libs/bootstrap/bootstrap-dropdown'
    },
    shim: {
        jQuery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        Backbone: {
            deps: ['underscore', 'jQuery'],
            exports: 'Backbone'
        },
        swfobject: {
            exports: 'swfobject'
        }
    }
});

require(['Backbone', 'router'], function(Backbone, Router) {
    var router = new Router();
    Backbone.history.start({pushState: false});
});
