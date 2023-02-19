setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

var Node = function(x, y) {
    this.pos = new DVector(x, y);
    this.vel = new DVector(0, 0);
    this.mass = random(20, 30);
};
Node.prototype.update = function() {
    this.vel.y += this.mass * dt;
    this.vel.mult(0.98)
    this.pos.add(this.vel);

    if(this.pos.y + 5 >= height) {
        this.pos.y = height - 5;
        this.vel.y *= -0.5;
        this.vel.mult(0.9);
    };
};

// TODO: Add tightness
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
    stroke(0);
    strokeWeight(10);
    this.nodes.forEach(node => point(node.pos.x, node.pos.y));
    strokeWeight(3);
    this.springs.forEach(spring => line(spring.p1.pos.x, spring.p1.pos.y, spring.p2.pos.x, spring.p2.pos.y));
};
Scene.prototype.update = function() {
    this.springs.forEach(spring => {
        let n1 = spring.p1;
        let n2 = spring.p2;
        let dist = DVector.dist(n1.pos, n2.pos);
        let disp = dist - spring.len;
        let k = 0.3;
        let ang = atan2(n2.pos.y - n1.pos.y, n2.pos.x - n1.pos.x);

        n1.vel.x += dt * k * disp * cos(ang);
        n1.vel.y += dt * k * disp * sin(ang);

        n2.vel.x += dt * k * disp * cos(ang + 180);
        n2.vel.y += dt * k * disp * sin(ang + 180);
    });

    this.nodes.forEach(node => node.update());
};

var scene = new Scene();

// Why do so many variables just already exist?!
var point1 = new Node(156, 179);
var point2 = new Node(426, 300);

scene.add(
    point1,
    point2
);

scene.join(
    new Spring(
        point1,
        point2,
        150 // sitting length
    )
);

draw = function() {
    background(192, 232, 250);
    scene.update();
    scene.draw();
};