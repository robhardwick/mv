define(['Backbone', 'views/viz/plugins/particle1/particle1'],
    function (Backbone, Particle1VizPlugin) {

    var VizView = Backbone.View.extend({

        el: '#viz',

        plugins: [Particle1VizPlugin],

        initialize: function() {
            this.gl = null;
            this.canvas = this.$el.get(0);

            try {
                this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            }
            catch(e) {}

            if (!this.gl) {
                this.gl = null;
                return;
            }

            this.gl.viewportWidth = this.canvas.width;
            this.gl.viewportHeight = this.canvas.height;

            console.log(this.canvas.width, this.canvas.height);
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black
            //this.gl.enable(this.gl.DEPTH_TEST);
            //this.gl.depthFunc(this.gl.LEQUAL);
            //this.gl.enable(0x8642);

            this.plugin = new this.plugins[0]({viz: this});
        },

        render: function() {
            if (this.gl == null) {
                return;
            }
            this.plugin.render();
        }

    });

    return VizView;

});
