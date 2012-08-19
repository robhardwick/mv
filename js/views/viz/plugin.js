define(['Backbone', 'underscore'], function (Backbone, _) {

    var VizPlugin = Backbone.View.extend({

        interval: 15,

        FRAGMENT_SHADER: 1,
        VERTEX_SHADER: 2,

        initializeTextures: function() { },
        initializeShaders: function() { },
        draw: function() { },

        initialize: function() {
            this.gl = this.options.viz.gl;
            this.initializeTextures();
            this.initializeShaders();
            this.render();
        },

        getTexture: function(url) {
            var texture = this.gl.createTexture();
            texture.image = new Image();
            texture.image.onload = _.bind(this.textureLoaded, this, texture);
            texture.image.src = url;
            return texture;
        },

        textureLoaded: function(texture) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        },

        getShaders: function(shaders) {
            var shaderProgram = this.gl.createProgram();
            for (var i=0; i < shaders.length; i++) {
                var shader = this.getShader(shaders[i].type, shaders[i].src);
                if (shader == null) {
                    return null;
                }
                this.gl.attachShader(shaderProgram, shader);
            }

            this.gl.linkProgram(shaderProgram);
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                console.log('Unable to initialise shaders');
                return null;
            }

            this.gl.useProgram(shaderProgram);

            return shaderProgram;
        },

        getShader: function(type, src) {
            var shader;
            switch (type) {
                case this.FRAGMENT_SHADER:
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                case this.VERTEX_SHADER:
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                default:
                    return null;
            }

            this.gl.shaderSource(shader, src);
            this.gl.compileShader(shader);

            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.log('Unable to compile shader', this.gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        },

        getBuffer: function(data, size, numItems) {
            var buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
            buffer.itemSize = size;
            buffer.numItems = numItems;
            return buffer;
        },

        render: function() {
            if (!this.timeoutID) {
                this.timeoutID = setInterval(_.bind(this.draw, this), this.interval);
            }
        }

    });

    return VizPlugin;

});
