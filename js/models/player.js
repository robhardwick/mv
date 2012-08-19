define(['underscore', 'Backbone', 'jQuery', 'swfobject'], function (_, Backbone, $) {

    var PlayerModel = Backbone.Model.extend({

        // Configuration
        containerId: '#yt',
        trackId: 'VV1XWJN3nJo',
        interval: 200,
        bufferEventFraction: 0.01,

        // State
        trackName: '',

        loaded: false,
        playing: false,

        bufferedFraction: 0,
        currentBufferedFraction: 0,

        initialize: function() {
            this.$container = $(this.containerId);
            this.$container.flash({
                swf: 'http://www.youtube.com/v/' + this.trackId + '?enablejsapi=1&version=3',
                height: 200,
                width: 200,
                hasVersion: 8,
                allowScriptAccess: 'always'
            });
            this.timeoutID = setInterval(_.bind(this.checkState, this), this.interval);
        },

        url: function() {
            return 'http://gdata.youtube.com/feeds/api/videos/' + this.trackId + '?v=2&alt=jsonc';
        },

        change: function() {
            this.trackName = this.get('data')['title'];
            this.trigger('change');
        },

        play: function() {
            if (this.loaded) {
                this.$player.playVideo();
                this.playing = true;
            }
        },

        pause: function() {
            if (this.loaded) {
                this.$player.pauseVideo();
                this.playing = false;
            }
        },

        stop: function() {
            if (this.loaded) {
                this.$player.stopVideo();
                this.playing = false;
            }
        },

        checkState: function() {
            if (!this.loaded) {
                this.$player = this.$container.children('object').get(0);
                if (this.$player.playVideo) {
                    this.loaded = true;
                    this.trigger('loaded');
                }
            } else {
                this.currentBufferedFraction = this.$player.getVideoLoadedFraction();
                if ((this.currentBufferedFraction - this.bufferedFraction) > this.bufferEventFraction) {
                    this.bufferedFraction = this.currentBufferedFraction;
                    this.trigger('buffer');
                }
            }
        }

    });

    return PlayerModel;

});
