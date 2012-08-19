define(['Backbone', 'models/player', 'views/player', 'views/viz'],
    function (Backbone, PlayerModel, PlayerView, VizView) {

    var Router = Backbone.Router.extend({

        routes : {
            '': 'index'
        },

        initialize: function() {
            this.model = new PlayerModel();
            this.model.fetch();
        },

        index: function() {
            this.player = new PlayerView({model: this.model});
            this.player.render();
            this.viz = new VizView({model: this.model});
            this.viz.render();
        }

    });

    return Router;

});
