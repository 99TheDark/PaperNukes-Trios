setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

// Globals
var gravity = true;
var showVelocities = false;
var windSpeed = 0.07;
var bounciness = 20;
var airPressure = 80;

// From https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
var lineCollision = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    let dx1 = x2 - x1;
    let dy1 = y2 - y1;
    let dx2 = x4 - x3;
    let dy2 = y4 - y3;

    let s = (-dy1 * (x1 - x3) + dx1 * (y1 - y3)) / (-dx2 * dy1 + dx1 * dy2);
    let t = (dx2 * (y1 - y3) - dy2 * (x1 - x3)) / (-dx2 * dy1 + dx1 * dy2);

    if(s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return new DVector(
            x1 + t * dx1,
            y1 + t * dy1
        );
    }
    return null;
};
var shortestDistance = function(p, q, n) {
    var len2 = pow(DVector.dist(p, q), 2);
    if(len2 === 0) {
        return DVector.dist(p, n);
    }
    var diff = DVector.sub(q, p);
    var dot = DVector.dot(DVector.sub(n, p), diff);
    var t = constrain(dot / len2, 0, 1);
    diff.mult(t);
    var proj = DVector.add(p, diff);
    return {
        "proj": proj,
        "dist": DVector.dist(n, proj)
    };
};

var Node = function(x, y, static, r) {
    this.pos = new DVector(x, y + height / 2);
    this.lastPos = new DVector(this.pos.x, this.pos.y);
    this.vel = new DVector((this.pos.y / 8 - 70) * 0, -20); // give rotational energy, not final
    this.static = static || false;
    this.r = r || 6;
    this.mass = PI * sq(this.r) * 0.3;
};
Node.prototype.update = function() {
    [this.lastPos.x, this.lastPos.y] = [this.pos.x, this.pos.y];

    if(gravity) this.vel.y += this.mass * dt; // gravity
    this.vel.mult(0.97);
    this.pos.add(this.vel);

    if(this.pos.y + this.r >= height) {
        this.pos.y = height - this.r;
        this.vel.y *= -0.7;
        this.vel.mult(0.85);
    }
    if(this.pos.x + this.r >= width) {
        this.pos.x = width - this.r;
        this.vel.x *= -0.7;
        this.vel.mult(0.85);
    }
    if(this.pos.x - this.r <= 0) {
        this.pos.x = this.r;
        this.vel.x *= -0.7;
        this.vel.mult(0.85);
    }
};
Node.prototype.reset = function() {
    this.vel.zero2D();
};
Node.prototype.copy = function() {
    let n = new Node(this.pos.x, this.pos.y, this.static, this.r);
    n.vel.set(this.vel);
    return n;
};
Node.prototype.collideSpring = function(spring) {
    let collision = lineCollision(
        spring.p1.pos.x,
        spring.p1.pos.y,
        spring.p2.pos.x,
        spring.p2.pos.y,
        this.lastPos.x,
        this.lastPos.y,
        this.pos.x,
        this.pos.y
    );

    if(collision && spring.p1 != this && spring.p2 != this) {
        let short = shortestDistance(spring.p1.pos, spring.p2.pos, this.lastPos);

        let cpos = DVector.sub(
            collision,
            DVector.mult(
                DVector.mult(
                    DVector.normalize(this.vel),
                    DVector.dist(collision, this.lastPos) / short.dist
                ),
                this.r
            )
        );
        let v = DVector.sub(cpos, this.pos);

        let dpos = DVector.sub(cpos, this.pos);
        this.pos.add(dpos);
        this.vel.add(v);

        spring.p1.vel.sub(v);
        spring.p2.vel.sub(v);

        // this.mesh.nodes.forEach(node => node.vel.add(DVector.mult(v, 0.5)));
        // spring.mesh.nodes.forEach(node => node.vel.sub(DVector.mult(v, 0.5)));
    }
};

var Spring = function(p1, p2, len, i1, i2, k) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = len;
    this.disp = 0;
    this.k = k;

    this.i1 = i1;
    this.i2 = i2;
};
Spring.prototype.update = function() {
    this.disp = DVector.dist(this.p1.pos, this.p2.pos) - this.len;
    let ang = atan2(this.p2.pos.y - this.p1.pos.y, this.p2.pos.x - this.p1.pos.x);

    this.p1.vel.x += dt * this.k * this.disp * cos(ang) / this.p1.mass;
    this.p1.vel.y += dt * this.k * this.disp * sin(ang) / this.p1.mass;

    this.p2.vel.x += dt * this.k * this.disp * cos(ang + 180) / this.p2.mass;
    this.p2.vel.y += dt * this.k * this.disp * sin(ang + 180) / this.p2.mass;
};

var Mesh = function() {
    this.nodes = [];
    this.springs = [];
};
Mesh.prototype.add = function(...args) {
    args.forEach(node => this.nodes.push(node) & (node.mesh = this));
};
Mesh.prototype.join = function(...args) {
    args.forEach(spring => this.springs.push(spring) & (spring.mesh = this));
};

var Scene = function() {
    this.objs = [];
};
Scene.prototype.add = function(mesh) {
    this.objs.push(mesh);
};
Scene.prototype.draw = function() {
    this.objs.forEach(obj => {
        strokeWeight(3);
        obj.springs.forEach(spring => {
            let col = lerpColor(color(255, 0, 0), color(0, 0, 0), abs(spring.disp) / 40);
            stroke(col);
            line(spring.p1.pos.x, spring.p1.pos.y, spring.p2.pos.x, spring.p2.pos.y);
        });
        let m = 10;
        obj.nodes.forEach(node => {
            stroke(0);
            strokeWeight(node.r * 2);
            point(node.pos.x, node.pos.y);

            if(showVelocities) {
                stroke(0, 150, 0);
                strokeWeight(3);
                line(node.pos.x, node.pos.y, node.pos.x + node.vel.x * m, node.pos.y + node.vel.y * m);
            }
        });
    });
};
Scene.prototype.update = function() {
    this.objs.forEach(obj => {
        obj.springs.forEach(spring => spring.update());
        obj.nodes.forEach(node => (node.vel.x += windSpeed) && node.static ? node.reset() : node.update());
    });
    this.objs.forEach(obj => {
        this.objs.forEach(collisionObj => {
            if(collisionObj != obj) {
                obj.nodes.forEach(node => collisionObj.springs.forEach(spring => node.collideSpring(spring)));
            }
        });
    });
};

var loadLevel = function(txt) {
    txt = txt.replaceAll("\r", "");
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
                var n1 = curObj.nodes[Number(obj[1])], n2 = curObj.nodes[Number(obj[2])];
                curObj.springs.push(new Spring(
                    n1,
                    n2,
                    DVector.dist(n1.pos, n2.pos),
                    Number(obj[1]),
                    Number(obj[2]),
                    bounciness
                ));
                break;
            case "a":
                var n1 = curObj.nodes[Number(obj[1])], n2 = curObj.nodes[Number(obj[2])];
                curObj.springs.push(new Spring(
                    n1,
                    n2,
                    DVector.dist(n1.pos, n2.pos),
                    Number(obj[1]),
                    Number(obj[2]),
                    airPressure
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
                                s.i2,
                                s.k
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
                        break;
                    case "scale":
                        let scaleVal = Number(obj[2]);
                        curObj.nodes.forEach(node => node.pos.mult(scaleVal));
                        curObj.springs.forEach(spring => spring.len *= scaleVal);
                        break;
                }
                break;
        }
    });

    objs.forEach(obj => {
        let mesh = new Mesh();
        mesh.add.apply(mesh, obj.nodes),
            mesh.join.apply(mesh, obj.springs);
        scene.add(
            mesh
        );
    });
};

var generateBall = function(xPos, yPos, xVel, yVel, radiusSize, numOfPoints) {
    let circleCode = "o new\n";

    for(let i = 0; i < numOfPoints; i++) {
        let x = xPos + sin(i * 360 / numOfPoints) * radiusSize;
        let y = yPos + cos(i * 360 / numOfPoints) * radiusSize;
        circleCode += "n " + round(x) + " " + round(y) + "\n";
    }

    for(let i = 0; i < numOfPoints; i++) {
        for(let j = 0; j < numOfPoints; j++) {
            if(i != j) {
                if(abs(i - j) == 1 || abs(i - j) == numOfPoints - 1) {
                    circleCode += "s " + i + " " + j + "\n";
                } else {
                    circleCode += "a " + i + " " + j + "\n";
                }
            }
        }
    }

    circleCode += "o push " + xVel + " " + yVel;

    loadLevel(circleCode);
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

generateBall(200, 200, 10, -5, 100, 10);
generateBall(1000, 100, -17, -8, 50, 10);

draw = function() {
    background(192, 232, 250);
    scene.update();
    scene.draw();
};

pageResized = function() {
    size(innerWidth, innerHeight);
};
