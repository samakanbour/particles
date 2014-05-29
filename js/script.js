var MAX_PARTICLES = 200;
var MIN_RADIUS = 4;
var MAX_RADIUS = 10;
var MAX_DRAG = 0.6;
var MAX_FORCE = 5;
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
var SOUNDS = [ "bell-01", "bell-02", "bell-03", "bell-04", "bell-05", "bell-06", "bell-07", "bell-08", "bell-09", "bell-10", "bell-11", "bell-12", "bell-13", "bell-14", "bell-15", "bell-16", "bell-17", "bell-18" ];

ion.sound.init({ 
    sounds: SOUNDS,
    path: "sounds/",    // set path to sounds
    multiPlay: true,    // play multiple sounds at once
    volume: "0.8"
});

function Particle( x, y, radius ) {
    this.init( x, y, radius );
}

$(document).ready(function() {
    Particle.prototype = {

        init: function( x, y, radius ) {
            this.alive = true;
            this.radius = radius || 10;
            this.wander = 0.15;
            this.theta = random( TWO_PI );
            this.drag = 0.92;
            this.color = '#fff';
            this.x = x || 0.0;
            this.y = y || 0.0;
            this.vx = 0.0;
            this.vy = 0.0;
        },

        move: function() {
            this.x += this.vx;
            this.y += this.vy;

            this.vx *= this.drag;
            this.vy *= this.drag;

            this.theta += random( -0.5, 0.5 ) * this.wander;
            this.vx += sin( this.theta ) * 0.1;
            this.vy += cos( this.theta ) * 0.1;

            this.radius *= 0.96;
            this.alive = this.radius > 0.5;
        },

        draw: function( ctx ) {
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };

    var particles = [];
    var pool = [];
    var demo = Sketch.create();

    // Draw 100 initial particles
    demo.setup = function() {
        var i, x, y;
        for ( i = 0; i < 100; i++ ) {
            x = ( demo.width * 0.5 ) + random( -100, 100 );
            y = ( demo.height * 0.5 ) + random( -100, 100 );
            demo.spawn( x, y );
        }
    };

    demo.spawn = function( x, y ) {

        if ( particles.length >= MAX_PARTICLES ){
            pool.push( particles.shift() );
        }

        particle = pool.length ? pool.pop() : new Particle();
        particle.init( x, y, random( MIN_RADIUS, MAX_RADIUS ) );
        particle.wander = random( 0.5, 0.9 );
        particle.color = random( COLOURS );
        particle.drag = random( 0.1, MAX_DRAG );
        ion.sound.play(random( SOUNDS ));
        theta = random( TWO_PI );
        force = random( 1, MAX_FORCE );

        particle.vx = sin( theta ) * force;
        particle.vy = cos( theta ) * force;
        particles.push( particle );
    };

    demo.update = function() {
        var i, particle;
        for ( i = particles.length - 1; i >= 0; i-- ) {
            particle = particles[i];
            if ( particle.alive ) particle.move();
            else pool.push( particles.splice( i, 1 )[0] );
        }
    };

    demo.draw = function() {
        demo.globalCompositeOperation  = 'lighter';
        for ( var i = particles.length - 1; i >= 0; i-- ) {
            particles[i].draw( demo );
        }
    };

    demo.mousemove = function() {
        var particle, theta, force, touch, max, i, j, n;
        for ( i = 0, n = demo.touches.length; i < n; i++ ) {
            touch = demo.touches[i], max = random( 1, 3 );
            for ( j = 0; j < max; j++ ) {
              demo.spawn( touch.x, touch.y );
            }
        }
    };
});