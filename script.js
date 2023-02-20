setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

// Is gravity on or off?
var gravity = true;

// From https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
var lineCollision = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    let dx1 = x2 - x1;
    let dy1 = y2 - y1;
    let dx2 = x4 - x3;
    let dy2 = y4 - y3;

    let s = (-dy1 * (x1 - x3) + dx1 * (y1 - y3)) / (-dx2 * dy1 + dx1 * dy2);
    let t = (dx2 * (y1 - y3) - dy2 * (x1 - x3)) / (-dx2 * dy1 + dx1 * dy2);

    if(s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return {
            "x": x1 + t * dx1,
            "y": y1 + t * dy1
        };
    }
    return null;
};

var Node = function(x, y, static, r) {
    this.pos = new DVector(x, y + height / 2);
    this.vel = new DVector(this.pos.y / 12, -20); // give rotational energy, not final
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
Node.prototype.copy = function() {
    let n = new Node(this.pos.x, this.pos.y, this.static, this.r);
    n.vel.set(this.vel);
    return n;
};

var Spring = function(p1, p2, len, i1, i2) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = len;
    this.disp = 0;

    this.i1 = i1;
    this.i2 = i2;
};
Spring.prototype.update = function() {
    this.disp =  DVector.dist(this.p1.pos, this.p2.pos) - this.len;
    let k = 70;
    let ang = atan2(this.p2.pos.y - this.p1.pos.y, this.p2.pos.x - this.p1.pos.x);

    this.p1.vel.x += dt * k * this.disp * cos(ang) / this.p1.mass;
    this.p1.vel.y += dt * k * this.disp * sin(ang) / this.p1.mass;

    this.p2.vel.x += dt * k * this.disp * cos(ang + 180) / this.p2.mass;
    this.p2.vel.y += dt * k * this.disp * sin(ang + 180) / this.p2.mass;
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
    this.springs.forEach(spring => {
        let col = lerpColor(color(255, 0, 0), color(0, 0, 0), abs(spring.disp) / 40);
        stroke(red(col), green(col), blue(col), alpha(col)); // gotta fix this glitch in Dark.js
        line(spring.p1.pos.x, spring.p1.pos.y, spring.p2.pos.x, spring.p2.pos.y);
    });
    let m = 10;
    this.nodes.forEach(node => {
        stroke(0);
        strokeWeight(node.r * 2);
        point(node.pos.x, node.pos.y);

        // Show velocities
        /*stroke(0, 150, 0);
        strokeWeight(3);
        line(node.pos.x, node.pos.y, node.pos.x + node.vel.x * m, node.pos.y + node.vel.y * m);*/
    });
};
Scene.prototype.update = function() {
    this.springs.forEach(spring => spring.update());

    this.nodes.forEach(node => node.static ? node.reset() : node.update());
};

var loadLevel = function(txt) {
    let dat = txt.split("\n").map(line => line.split(" "));
    let objs = [];
    let curObj;
    dat.forEach(obj => {
        switch(obj[0]) { // obj[0] = type
            case "n": // node
                curObj.nodes.push(
                    new Node(
                        Number(obj[1]), // x
                        Number(obj[2]), // y
                        false,
                        Number(obj[3])  // radius
                    ));
                break;
            case "x": // static node
                curObj.nodes.push(new Node(
                    Number(obj[1]), // x
                    Number(obj[2]), // y
                    true,
                    Number(obj[3])  // radius
                ));
                break;
            case "s": // spring
                // node 1 & node 2
                let n1 = curObj.nodes[Number(obj[1])], n2 = curObj.nodes[Number(obj[2])];
                curObj.springs.push(new Spring(
                    n1,
                    n2,
                    DVector.dist(n1.pos, n2.pos),
                    Number(obj[1]),
                    Number(obj[2])
                ));
                break;
            case "o": // object
                switch(obj[1]) {
                    case "new":
                        curObj = {
                            nodes: [],
                            springs: []
                        };
                        objs.push(curObj);
                        break;
                    case "copy":
                        // I need a better way of doing this, but structuredClone deletes prototype
                        let o = objs[Number(obj[2])];
                        curObj = {
                            nodes: [],
                            springs: []
                        };
                        o.nodes.forEach(n => curObj.nodes.push(n.copy()));
                        o.springs.forEach(s => {
                            curObj.springs.push(new Spring(
                                curObj.nodes[s.i1],
                                curObj.nodes[s.i2],
                                s.len,
                                s.i1,
                                s.i2
                            ));
                        });
                        curObj.nodes.forEach(n => n.vel.y += 20);
                        objs.push(curObj);
                        break;
                    case "move":
                        let movement = new DVector(Number(obj[2]), Number(obj[3]));
                        curObj.nodes.forEach(node => node.pos.add(movement));
                        break;
                    case "push":
                        let velocity = new DVector(Number(obj[2]), Number(obj[3]));
                        curObj.nodes.forEach(node => node.vel.add(velocity));
                }
                break;
        }
    });

    objs.forEach(obj => {
        scene.add.apply(scene, obj.nodes);
        scene.join.apply(scene, obj.springs);
    });
};

var scene = new Scene();

// From https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file-in-the-browser
var raw = new XMLHttpRequest();
raw.open("GET", "data.txt", false);
raw.onreadystatechange = function() {
    if(raw.readyState == 4) {
        if(raw.status == 200 || raw.status == 0) {
            text = raw.responseText;
            loadLevel(text);
        }
    }
};
raw.send(null);

draw = function() {
    background(192, 232, 250);
    scene.update();
    scene.draw();
};
