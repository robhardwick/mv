define(['Backbone', 'views/viz/plugin',
    'text!views/viz/plugins/particle1/shaders/fragment.glsl',
    'text!views/viz/plugins/particle1/shaders/vertex.glsl'],
    function (Backbone, VizPlugin, particle1FragmentShader, particle1VertexShader) {

    var Particle1VizPlugin = VizPlugin.extend({

        numParticles: 100,
        iterationLength: 3000,

        time: 1,
        lastTime: 0,
        centerPos: 0,
        color: 0,

        texture: null,
        shaderProgram: null,
        pointLifetimesBuffer: null,
        pointStartPositionsBuffer: null,
        pointEndPositionsBuffer: null,

        initializeTextures: function() {
            this.texture = this.getTexture('/img/plugins/particle1/smoke.gif');
        },

        initializeShaders: function() {
            this.shaderProgram = this.getShaders([
                {
                    type: this.FRAGMENT_SHADER,
                    src: particle1FragmentShader
                },
                {
                    type: this.VERTEX_SHADER,
                    src: particle1VertexShader
                }
            ]);
            if (this.shaderProgram == null) {
                return;
            }

            this.shaderProgram.pointLifetimeAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aLifetime');
            this.gl.enableVertexAttribArray(this.shaderProgram.pointLifetimeAttribute);

            this.shaderProgram.pointStartPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aStartPosition');
            this.gl.enableVertexAttribArray(this.shaderProgram.pointStartPositionAttribute);

            this.shaderProgram.pointEndPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aEndPosition');
            this.gl.enableVertexAttribArray(this.shaderProgram.pointEndPositionAttribute);

            this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, 'sTexture');
            this.shaderProgram.centerPositionUniform = this.gl.getUniformLocation(this.shaderProgram, 'uCenterPosition');
            this.shaderProgram.colorUniform = this.gl.getUniformLocation(this.shaderProgram, 'uColor');
            this.shaderProgram.timeUniform = this.gl.getUniformLocation(this.shaderProgram, 'uTime');
        },

        initBuffers: function() {
            var lifetimes = [];
            var startPositions = [];
            var endPositions = [];
            for (var i=0; i < this.numParticles; i++)  {
                lifetimes.push(Math.random());

                startPositions.push((Math.random() * 0.25) - 0.125);
                startPositions.push((Math.random() * 0.25) - 0.125);
                startPositions.push((Math.random() * 0.25) - 0.125);

                endPositions.push((Math.random() * 2) - 1);
                endPositions.push((Math.random() * 2) - 1);
                endPositions.push((Math.random() * 2) - 1);
            }

            this.pointLifetimesBuffer = this.getBuffer(lifetimes, 1, this.numParticles);
            this.pointStartPositionsBuffer = this.getBuffer(startPositions, 3, this.numParticles);
            this.pointEndPositionsBuffer = this.getBuffer(endPositions, 3, this.numParticles);
        },

        draw: function() {

            var now = new Date().getTime();
            if (this.lastTime !== 0) {
                var elapsed = now - this.lastTime;
                this.time += elapsed / this.iterationLength;
            }

            if (this.time >= 1.0) {
                this.time = 0;
                this.centerPos = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
                this.color = [Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, 0.5];
                this.initBuffers();
            }

            this.lastTime = now;

            if (this.pointLifetimesBuffer == null ||
                this.pointStartPositionsBuffer == null ||
                this.pointEndPositionsBuffer == null) {
                return;
            }

            this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointLifetimesBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.pointLifetimeAttribute, this.pointLifetimesBuffer.itemSize,
                this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.pointStartPositionAttribute, this.pointStartPositionsBuffer.itemSize,
                this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.pointEndPositionAttribute, this.pointEndPositionsBuffer.itemSize,
                this.gl.FLOAT, false, 0, 0);

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

            this.gl.uniform3f(this.shaderProgram.centerPositionUniform, this.centerPos[0], this.centerPos[1], this.centerPos[2]);
            this.gl.uniform4f(this.shaderProgram.colorUniform, this.color[0], this.color[1], this.color[2], this.color[3]);
            this.gl.uniform1f(this.shaderProgram.timeUniform, this.time);

            this.gl.drawArrays(this.gl.POINTS, 0, this.pointLifetimesBuffer.numItems);
        }

    });

    return Particle1VizPlugin;

});
