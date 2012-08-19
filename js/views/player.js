define(['Backbone', 'underscore', 'text!templates/player.html'],
    function (Backbone, _, playerTemplate) {

    var PlayerView = Backbone.View.extend({

        el: '#player',

        events: {
            'click .btn.play' : 'play',
            'click .btn.stop' : 'stop'
        },

        initialize: function() {
            this.template = _.template(playerTemplate);
            this.model.bind('loaded', _.bind(this.loaded, this));
            this.model.bind('buffer', _.bind(this.buffer, this));
            this.model.bind('change', _.bind(this.render, this));
        },

        render: function() {
            this.$el.html(this.template(this.model));
            this.$buttons = this.$el.find('.btn');
            this.$progress = this.$el.find('.progress .bar');
            return this;
        },

        play: function() {
            if (this.model.playing) {
                this.model.pause();
                this.setButton('play', 'icon-play');
            } else {
                this.model.play();
                this.setButton('play', 'icon-pause');
            }
        },

        stop: function() {
            this.model.stop();
            this.setButton('play', 'icon-play');
        },

        setButton: function(btn, state) {
            var icon = this.make('i', {'class': state});
            this.$el.find('.btn.' + btn + ' i').replaceWith(icon);
        },

        loaded: function() {
            this.$buttons.removeClass('disabled');
        },

        buffer: function() {
            this.$progress.css('width', (this.model.bufferedFraction * 100) + '%');
        },

        info: function() {
            this.$trackName.text(this.model.trackName);
        }

    });

    return PlayerView;

});
