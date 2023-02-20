setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

// Is gravity on or off?
var gravity = false;

var Node = function(x, y, static, r) {
    this.pos = new DVector(x, y);
    this.vel = new DVector(0, 0);
    this.static = static || false;
    this.r = r || 6;
    this.mass = PI * sq(this.r) * 0.3;
};
Node.prototype.update = function() {
    if(gravity) this.vel.y += this.mass * dt; // gravity
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
        let k = 18;
        let ang = atan2(n2.pos.y - n1.pos.y, n2.pos.x - n1.pos.x);

        n1.vel.x += dt * k * disp * cos(ang) / n1.mass;
        n1.vel.y += dt * k * disp * sin(ang) / n1.mass;

        n2.vel.x += dt * k * disp * cos(ang + 180) / n2.mass;
        n2.vel.y += dt * k * disp * sin(ang + 180) / n2.mass;
    });

    this.nodes.forEach(node => node.static ? node.reset() : node.update());
};

var loadLevel = function(txt) {
    let dat = txt.split("\n").map(line => line.split(" "));
    let nodes = [];
    let springs = [];
    dat.forEach(obj => {
        switch(obj[0]) { // obj[0] = type
            case "n": // node
                nodes.push(
                    new Node(
                        Number(obj[1]), // x
                        Number(obj[2]), // y
                        false,
                        Number(obj[3])  // radius
                    ));
                break;
            case "x": // static node
                nodes.push(new Node(
                    Number(obj[1]), // x
                    Number(obj[2]), // y
                    true,
                    Number(obj[3])  // radius
                ));
                break;
            case "s":
                // node 1 & node 2
                let n1 = nodes[Number(obj[1])], n2 = nodes[Number(obj[2])];
                springs.push(new Spring(
                    n1,
                    n2,
                    DVector.dist(n1.pos, n2.pos) * 1.5
                ));
                break;
        }
    });
    scene.add.apply(scene, nodes);
    scene.join.apply(scene, springs);
};

var scene = new Scene();

// From https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file-in-the-browser
var raw = new XMLHttpRequest();
raw.open("GET", "data.txt", false);
raw.onreadystatechange = function() {
    if(raw.readyState === 4) {
        if(raw.status === 200 || raw.status == 0) {
            text = raw.responseText;
            loadLevel(text);
        }
    }
};
raw.send(null);

draw = function() {
    background(192, 232, 250);
    pushMatrix();
    translate(width / 2, height / 2);
    scene.update();
    scene.draw();
    popMatrix();
};
