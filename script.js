setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

var Node = function(x, y, static, r) {
    this.pos = new DVector(x, y);
    this.vel = new DVector(0, 0);
    this.static = static || false;
    this.r = r || 5;
    this.mass = PI * sq(this.r) * 0.2;
};
Node.prototype.update = function() {
    // this.vel.y += this.mass * dt; // gravity
    this.vel.mult(0.97);
    this.pos.add(this.vel);

    if(this.pos.y + this.r >= height) {
        this.pos.y = height - this.r;
        this.vel.y *= -0.3;
        this.vel.mult(0.9);
    };
};
Node.prototype.reset = function() {
    this.vel.zero2D();
};

// TODO: Add tightness (k)
var Spring = function(p1, p2, len) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = len;
};

var Scene = function() {
    this.nodes = [];
    this.springs = [];
};
Scene.prototype.add = function(...args) {
    args.forEach(node => this.nodes.push(node));
};
Scene.prototype.join = function(...args) {
    args.forEach(spring => this.springs.push(spring));
};
Scene.prototype.draw = function() {
    strokeWeight(3);
    stroke(210, 0, 0);
    this.springs.forEach(spring => {
        line(spring.p1.pos.x, spring.p1.pos.y, spring.p2.pos.x, spring.p2.pos.y);
    });
    stroke(0);
    this.nodes.forEach(node => {
        strokeWeight(node.r * 2);
        point(node.pos.x, node.pos.y);
    });
};
Scene.prototype.update = function() {
    this.springs.forEach(spring => {
        let n1 = spring.p1;
        let n2 = spring.p2;

        let dist = DVector.dist(n1.pos, n2.pos);
        let disp = dist - spring.len;
        let k = 17;
        let ang = atan2(n2.pos.y - n1.pos.y, n2.pos.x - n1.pos.x);

        n1.vel.x += dt * k * disp * cos(ang) / n1.mass;
        n1.vel.y += dt * k * disp * sin(ang) / n1.mass;

        n2.vel.x += dt * k * disp * cos(ang + 180) / n2.mass;
        n2.vel.y += dt * k * disp * sin(ang + 180) / n2.mass;
    });

    this.nodes.forEach(node => node.static ? node.reset() : node.update());
};

var scene = new Scene();

var point1 = new Node(0, 0, true);
var point2 = new Node(100, 0);
var point3 = new Node(100, 100);
var point4 = new Node(0, 100);

scene.add(
    point1,
    point2,
    point3,
    point4
);

scene.join(
    new Spring(
        point1,
        point2,
        150 // resting length
    ),
    new Spring(
        point2,
        point3,
        150
    ),
    new Spring(
        point3,
        point4,
        150
    ),
    new Spring(
        point4,
        point1,
        150
    ),
    new Spring(
        point1,
        point3,
        150 * sqrt(2)
    ),
    new Spring(
        point2,
        point4,
        150 * sqrt(2)
    )
);

draw = function() {
    background(192, 232, 250);
    pushMatrix();
    translate(width / 2, height / 2);
    scene.update();
    scene.draw();
    popMatrix();
};
