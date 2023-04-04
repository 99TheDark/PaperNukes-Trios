setCanvas(document.getElementById("game"));
size(innerWidth, innerHeight);

// Globals
var gravity = true;
var showVelocities = false;
var nodeMode = false;
var windSpeed = 0.1;
var bounciness = 10;
var airPressure = 120;
var paused = false;
var currentScene = "logo";

/**genral**/
// {
var transition, runBackground, cam, player;

var mc = false;
mousePressed = () => mc = true;

//}
/**Logo made by Ace Rogers**/
//{
var nukeX = width + width / 1.5;
var textFade = 1;


// Line stuff {

var lineX = [];
var lineY = [];
var lineLength = [];
var lineSpeed = [];

for(var i = 0; i < 100; i++) {
    lineX.push(random(-600, 0));
    lineY.push(random(-height - 60, height));
    lineLength.push(random(20, 100));
    lineSpeed.push(random(25, 50));
}

// }
// Smoke stuff {

var smokeX = [];
var smokeY = [];
var smokeSize = [];
var smokeSpeed = [];

for(var i = 0; i < 300; i++) {
    smokeX.push(random(-25, 25));
    smokeY.push(random(175, 400));
    smokeSize.push(random(10, 15));
    smokeSpeed.push(random(10, 20));
}

// }

var timer = 0;
var nuke = function(x, y, sizeX, sizeY, r) {
    pushMatrix();
    translate(x, y);
    scale(sizeX, sizeY);
    rotate(r);

    noStroke();
    rectMode(CENTER);

    for(var i = 0; i < smokeY.length; i++) {
        noStroke();
        fill(100, 175);
        ellipse(smokeX[i], smokeY[i], smokeSize[i], smokeSize[i]);

        smokeY[i] += smokeSpeed[i];

        if(smokeY[i] >= height) {
            smokeY[i] = random(175, 200);
            smokeX[i] = random(-25, 25);
            smokeSize[i] = (random(10, 15));
            smokeSpeed[i] = (random(10, 20));
        }
    }

    // Nuke {

    for(var i = 54; i > 0; i--) {
        fill(89 - (1 * i), 63 - (1 * i), 98 - (1 * i));
        rect(0, 0, i, 30);
    } // Purple part

    for(var i = 50; i > 0; i--) {
        fill(239 - (2 * i), 241 - (2 * i), 243 - (2 * i));
        arc(0, -115, i, i * 5, -179, 0);
    } // Nike tip

    for(var i = 40; i > 0; i--) {
        fill(239 - (2 * i), 241 - (2 * i), 243 - (2 * i));
        triangle(-i, 200, 0, 150 - i * 2, i, 200);
    } // Rocket

    for(var i = 60; i > 0; i--) {
        fill(87 - (1.5 * i), 167 - (1.5 * i), 115 - (1.5 * i));
        rect(0, -65, i, 100); // Top green part
        rect(0, 85, i, 140); // Bottom green part
    } // Green parts

    // }

    // Nuke symbol {

    fill(0);
    ellipse(0, -65, 40, 40);

    for(var i = 0; i < 3; i++) {
        pushMatrix();
        translate(0, -65);
        rotate(i * 122);

        fill(255, 255, 0);
        arc(0, 0, 20, 20, 0, 60);

        popMatrix();
    }

    noFill();
    stroke(255, 255, 0);
    strokeWeight(3);
    ellipse(0, -65, 30, 30);

    // }

    popMatrix();
};
var introSpeed = 2;
var intro = function() {
    pushMatrix();
    translate(width / 2, height / 1.7);
    scale(width / 800, height / 800);

    background(0);
    rectMode(CORNER);

    for(var i = -width; i < width; i += 2) {

        noStroke();
        fill(75 - (0.2 * i), 75 - (0.2 * i), 200 - (0.2 * i));
        rect(i, -height * 1.2, 3, height * 2.1);

    }// Background

    for(var i = 0; i < lineY.length; i++) {

        stroke(100, 200, 255);
        line(lineX[i], lineY[i], lineX[i] + lineLength[i], lineY[i]);

        lineX[i] += lineSpeed[i];

        if(lineX[i] >= width) {

            lineY[i] = random(-height - 60, height);
            lineX[i] = random(-600, 0);
            lineLength[i] = (random(20, 100));
            lineSpeed[i] = (random(25, 50));

        }

    } // Lines

    noStroke();

    // "TEAM" {

    pushMatrix();
    translate(-67, -165);
    scale(0.7, 0.7);

    rectMode(CENTER);

    // T {

    pushMatrix();
    translate(-110, -280);

    fill(200, textFade);
    quad(-20, -31, -20, -24, 20, -24, 20, -31);

    fill(210, textFade);
    quad(-20, -31, -20, -24, 4, -24, -2, -31);

    fill(230, textFade);
    rect(0, 2, 6, 56);

    popMatrix();

    // }

    // E {

    pushMatrix();
    translate(-85, -280);

    fill(190, textFade);
    quad(6, 30, 0, 24, 30, 24, 30, 30);

    fill(200, textFade);
    rect(13, 0, 20, 6);

    fill(210, textFade);
    quad(6, 30, 0, 24, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    // A {

    pushMatrix();
    translate(-18, -280);

    fill(190, textFade);
    rect(0, 6, 35, 8);

    fill(210, textFade);
    quad(-32, 30, -24, 30, 3, -30, -5, -30);

    fill(230, textFade);
    quad(32, 30, 24, 30, -3, -30, 5, -30);

    popMatrix();

    // }

    // N {

    pushMatrix();
    translate(25, -280);

    fill(170, textFade);
    rect(26, 0, 8, 60);

    fill(190, textFade);
    quad(15, 30, 11, 30, 21, -30, 28, -30);

    fill(210, textFade);
    quad(11, 30, 15, 30, 4, -30, -4, -30);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    popMatrix();

    // }

    // "PAPERNUKE" {

    pushMatrix();
    translate(-67, 600);
    scale(2.1, 3);

    rectMode(CENTER);

    // P {

    pushMatrix();
    translate(-145, -280);

    fill(190, textFade);
    quad(-4, 16, 4, 4, 30, -10, 30, -2);

    fill(210, textFade);
    quad(-4, -30, 4, -30, 30, -10, 30, -2);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // A {

    pushMatrix();
    translate(-85, -280);

    fill(190, textFade);
    rect(0, 6, 35, 8);

    fill(210, textFade);
    quad(-32, 30, -24, 30, 3, -30, -5, -30);

    fill(230, textFade);
    quad(32, 30, 24, 30, -3, -30, 5, -30);

    popMatrix();

    // }

    // P {

    pushMatrix();
    translate(-45, -280);

    fill(190, textFade);
    quad(-4, 16, 4, 4, 30, -10, 30, -2);

    fill(210, textFade);
    quad(-4, -30, 4, -30, 30, -10, 30, -2);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // E {

    pushMatrix();
    translate(-6, -280);

    fill(190, textFade);
    quad(6, 30, 0, 24, 30, 24, 30, 30);

    fill(200, textFade);
    rect(13, 0, 20, 6);

    fill(210, textFade);
    quad(6, 30, 0, 24, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    // R {

    pushMatrix();
    translate(35, -280);

    fill(170, textFade);
    quad(-4, 6, 4, 4, 30, 30, 20, 30);

    fill(190, textFade);
    quad(-4, 16, 4, 4, 30, -10, 30, -2);

    fill(210, textFade);
    quad(-4, -30, 4, -30, 30, -10, 30, -2);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // N {

    pushMatrix();
    translate(75, -280);

    fill(190, textFade);
    rect(26, 0, 8, 60);

    fill(210, textFade);
    quad(23, 30, 30, 30, 4, -30, -4, -30);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // U {

    pushMatrix();
    translate(115, -280);

    fill(190, textFade);
    rect(26, -2, 8, 56);

    fill(210, textFade);
    quad(2, 30, -4, 26, 30, 26, 24, 30);

    fill(230, textFade);
    rect(0, -2, 8, 56);

    popMatrix();

    // }

    // K {

    pushMatrix();
    translate(155, -280);

    fill(190, textFade);
    quad(4, 3, -4, 5, 24, -30, 30, -30);

    fill(210, textFade);
    quad(4, 7, -4, -14, 30, 30, 24, 30);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // E {

    pushMatrix();
    translate(185, -280);

    fill(190, textFade);
    quad(6, 30, 0, 24, 30, 24, 30, 30);

    fill(200, textFade);
    rect(13, 0, 20, 6);

    fill(210, textFade);
    quad(6, 30, 0, 24, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    popMatrix();

    // }

    // "PRESENTS" {

    pushMatrix();
    translate(80, 450);
    scale(1, 1);

    rectMode(CENTER);

    // P {

    pushMatrix();
    translate(-145, -280);

    fill(190, textFade);
    quad(-4, 16, 4, 4, 30, -10, 30, -2);

    fill(210, textFade);
    quad(-4, -30, 4, -30, 30, -10, 30, -2);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // R {

    pushMatrix();
    translate(-110, -280);

    fill(170, textFade);
    quad(-4, 6, 4, 4, 30, 30, 20, 30);

    fill(190, textFade);
    quad(-4, 16, 4, 4, 30, -10, 30, -2);

    fill(210, textFade);
    quad(-4, -30, 4, -30, 30, -10, 30, -2);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // E {

    pushMatrix();
    translate(-75, -280);

    fill(190, textFade);
    quad(6, 30, 0, 24, 30, 24, 30, 30);

    fill(200, textFade);
    rect(13, 0, 20, 6);

    fill(210, textFade);
    quad(6, 30, 0, 24, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    // S {

    pushMatrix();
    translate(-40, -280);

    fill(150, textFade);
    quad(6, 30, 0, 24, 30, 24, 24, 30);

    fill(170, textFade);
    quad(24, -4, 30, 3, 30, 24, 24, 30);

    fill(190, textFade);
    quad(24, -4, 30, 3, 5, 4, -1, -4);

    fill(210, textFade);
    quad(6, 4, 0, -4, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    // E {

    pushMatrix();
    translate(-5, -280);

    fill(190, textFade);
    quad(6, 30, 0, 24, 30, 24, 30, 30);

    fill(200, textFade);
    rect(13, 0, 20, 6);

    fill(210, textFade);
    quad(6, 30, 0, 24, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    // N {

    pushMatrix();
    translate(35, -280);

    fill(190, textFade);
    rect(26, 0, 8, 60);

    fill(210, textFade);
    quad(23, 30, 30, 30, 4, -30, -4, -30);

    fill(230, textFade);
    rect(0, 0, 8, 60);

    popMatrix();

    // }

    // T {

    pushMatrix();
    translate(89, -280);

    fill(200, textFade);
    quad(-20, -31, -20, -24, 20, -24, 20, -31);

    fill(210, textFade);
    quad(-20, -31, -20, -24, 4, -24, -2, -31);

    fill(230, textFade);
    rect(0, 2, 6, 56);

    popMatrix();

    // }

    // S {

    pushMatrix();
    translate(112, -280);

    fill(150, textFade);
    quad(6, 30, 0, 24, 30, 24, 24, 30);

    fill(170, textFade);
    quad(24, -4, 30, 3, 30, 24, 24, 30);

    fill(190, textFade);
    quad(24, -4, 30, 3, 5, 4, -1, -4);

    fill(210, textFade);
    quad(6, 4, 0, -4, 0, -24, 6, -30);

    fill(230, textFade);
    quad(30, -30, 30, -24, 0, -24, 6, -30);

    popMatrix();

    // }

    popMatrix();

    // }

    nuke(nukeX + sin(frameCount * 8) * 5, 0 + sin(frameCount * 12) * 7, 1, 1, -90);

    if(nukeX > width / 10 && timer < 50) {

        nukeX -= 25 * introSpeed;

    }
    // This makes that nuke come on to the screen

    if(nukeX <= width / 10) {

        textFade += (2.5 * introSpeed);

    }
    // This makes tha text fade in

    if(timer >= 175) {

        nukeX -= 50 * introSpeed;

    }
    // This makes the nuke fly off the screen

    if(timer >= 200) {
        transition.transitionTo("menu");


    } else {

        timer += 1 * introSpeed;

    }

    popMatrix();
};
//}

/**scenes**/
//{
var runScenes = () => {
    background(248, 248, 246);
    runBackground();
    switch(currentScene) {
        case "logo": {
            intro();
        } break;
        case "menu": {

            fill(160, 195, 226, 255 / 2 - sin(frameCount * 10) * 122);
            textSize(70);
            textAlign(CENTER);
            noStroke();
            text("Click to Start", width / 2, height / 1.5);
            if(mc) {
                transition.transitionTo("game");
            }

        } break;
        case "game":
            pushMatrix();
            translate(round(width / 2 - cam.x), round(height / 2 - cam.y));
            cam.lerp(player, 0.1);
            background(192, 232, 250);
            if(!paused) scene.update();
            scene.draw();
            popMatrix();
            break;
        default:
            Dark.error(`"${scene}" is not a vaild scene`);
    }
    particles.run();
    transition.runBands();
};
//}
/**particles**/
//{
var Particle = function(position, type) {

    this.type = type;
    this.position = position.get();
    this.timeToLive = 255;
    this.acceleration = new DVector(0, 0);
    switch(this.type) {
        case "snow": {

            this.velocityNum = 5;
            this.velocity = new DVector(random(-this.velocityNum, this.velocityNum), random(-this.velocityNum, this.velocityNum));
            this.size = random(5, 20);
            this.acceleration = new DVector(0, this.size / 60);
            this.decayRate = 2;

            this.velocityLimit = 3;

        } break;
    }
};

Particle.prototype.display = function() {
    noStroke();

    fill(255);

    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.rot);
    ellipse(0, 0, this.size, this.size);
    popMatrix();

};
Particle.prototype.update = function() {
    this.velocity.add(this.acceleration);

    this.velocity.limit(this.velocityLimit);

    this.position.add(this.velocity);

    this.rot += this.rotSpeed;

    if(this.position.x < 0 - this.size / 2 || this.position.y < 0 - this.size / 2 || this.position.x > width + this.size / 2 || this.position.y > height + this.size / 2) {
        this.gone = true;
    }

};
Particle.prototype.run = function() {
    this.update();
    this.display();
};

var ParticleSystem = function() {
    this.particles = [];
};

ParticleSystem.prototype.run = function() {
    for(var i = 0; i < this.particles.length; i++) {
        this.particles[i].run();
        if(this.particles[i].timeToLive < 0 || this.particles[i].gone) {
            this.particles.splice(i, 1);
        }
    }
};

ParticleSystem.prototype.killParticles = function() {
    this.particles.splice(0, this.particles.length);
};

ParticleSystem.prototype.addParticles = function(position, num, type, col) {
    if(num <= 0) {
        num = 1;
    }
    for(var i = 0; i < num; i++) {
        this.particles.push(new Particle(position.get(), type, col));
    }
};

var particles = new ParticleSystem();

//}
/**transition**/
//{
var transition = {
    bands: [],
    addBands: function() {
        var wid = 20;
        for(var i = 0; i < width / wid; i++) {
            var x = i * wid;
            var y = 0;
            var heit = height;
            var yAcel = 0.1 + random(0.5);
            if(floor(random(2)) === 0) {
                yAcel *= -1;
            }
            transition.bands.push({
                x: x,
                yVelo: random(-5, 5),
                yAcel: yAcel,
                y: y,
                wid: wid,
                heit: heit,
                img: get(x, y, wid, heit)
            });
        }
    },
    runBands: function() {
        imageMode(CORNER);
        var bandsLength = transition.bands.length;
        fill(0);
        for(var i = 0; i < bandsLength; i++) {
            transition.bands[i].y += transition.bands[i].yVelo;
            transition.bands[i].yVelo += transition.bands[i].yAcel;
            image(transition.bands[i].img, transition.bands[i].x, transition.bands[i].y);
        }
        imageMode(CENTER);
    },

    transitionTo: function(destScene) {
        transition.addBands();
        currentScene = destScene;
        particles.killParticles();
    },

};
background(0);
//}
/**Moving Background**/
//{
var backgroundXPos = 0;

clear();
noStroke();
fill(160, 195, 226, 100);
for(var i = 0; i < 8; i++) {
    var a = random(30);
    ellipse(random(150, 450), random(0, 600), a * 10, a / 3);
}
var abc = [];
for(var i = 0; i < width; i++) {
    abc.push(get(i, 0, 1, height));
}
clear();
for(var i = 0; i < abc.length; i++) {
    image(abc[i], i, 0 + sin(i) * 14, 1, height);
}
var streaks = get();

var runBackground = function() {
    imageMode(CENTER, CENTER);
    backgroundXPos += 15;
    pushMatrix();
    translate(300, 300);
    rotate(20);
    image(streaks, 600 - ((backgroundXPos + 500) % 1500), 0, 1000, 700);
    image(streaks, 600 - (backgroundXPos % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 300) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 600) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 900) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 1500) % 1500), 0, 1000, 700);
    translate(800, -300);
    image(streaks, 600 - ((backgroundXPos + 500) % 1500), 0, 1000, 700);
    image(streaks, 600 - (backgroundXPos % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 300) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 600) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 900) % 1500), 0, 1000, 700);
    image(streaks, 600 - ((backgroundXPos - 1500) % 1500), 0, 1000, 700);
    popMatrix();
};
//}

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
    this.pos = new DVector(x, y);
    this.lastPos = new DVector(this.pos.x, this.pos.y);
    this.vel = new DVector(0, 0); // give rotational energy, not final
    this.static = static || false;
    this.r = r || 6;
    this.mass = PI * sq(this.r) * 0.3;
};
Node.prototype.update = function() {
    [this.lastPos.x, this.lastPos.y] = [this.pos.x, this.pos.y];

    if(gravity) this.vel.y += this.mass / 60; // gravity
    this.vel.mult(0.95);
    this.pos.add(this.vel);

    /*if(this.pos.y + this.r >= height) {
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
    }*/
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
    if(spring.p1 != this && spring.p2 != this && !spring.isPressure && !this.static) {
        let springStart = spring.p1.pos.get();
        let springEnd = spring.p2.pos.get();
        let springDir = DVector.normalize(DVector.sub(springEnd, springStart));
        springStart.sub(DVector.mult(springDir, spring.p1.r));
        springEnd.add(DVector.mult(springDir, spring.p2.r));

        let nodeStart = this.lastPos.get();
        let nodeEnd = this.pos.get();
        /*let nodeDir = DVector.normalize(DVector.sub(nodeEnd, nodeStart));
        nodeStart.sub(DVector.mult(nodeDir, this.r));
        nodeEnd.add(DVector.mult(nodeDir, this.r));*/

        let collision = lineCollision(
            springStart.x,
            springStart.y,
            springEnd.x,
            springEnd.y,
            nodeStart.x,
            nodeStart.y,
            nodeEnd.x,
            nodeEnd.y
        );

        if(collision) { // @COL
            let short = shortestDistance(spring.p1.lastPos, spring.p2.lastPos, this.lastPos);

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
            let v = DVector.sub(cpos, this.lastPos);

            // reflection across surface normal
            let delta = DVector.sub(spring.p1.pos, spring.p2.pos);
            let normal = new DVector(delta.y, -delta.x);
            normal.normalize();
            normal = DVector.mult(normal, -sign(DVector.dot(this.vel, normal)));
            v = DVector.sub(
                v,
                DVector.mult(
                    normal,
                    2 * DVector.dot(normal, v)
                )
            );

            let dpos = DVector.sub(cpos, this.pos);
            this.pos.add(dpos);

            this.vel.set(v);
            this.vel.add(DVector.mult(normal, 10));

            let friction = new DVector(1 - normal.x * 0.3, 1 - normal.y * 0.3);

            this.vel.mult(friction);
            this.vel.mult(0.85);
        }
    }
};

var Spring = function(p1, p2, len, i1, i2, isPressure = false) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = len;
    this.disp = 0;
    this.k = isPressure ? airPressure : bounciness;
    this.isPressure = isPressure;

    this.i1 = i1;
    this.i2 = i2;
};
Spring.prototype.update = function() {
    this.disp = DVector.dist(this.p1.pos, this.p2.pos) - this.len;
    let ang = atan2(this.p2.pos.y - this.p1.pos.y, this.p2.pos.x - this.p1.pos.x);

    this.p1.vel.x += this.k * this.disp * cos(ang) / this.p1.mass / 60;
    this.p1.vel.y += this.k * this.disp * sin(ang) / this.p1.mass / 60;

    this.p2.vel.x += this.k * this.disp * cos(ang + 180) / this.p2.mass / 60;
    this.p2.vel.y += this.k * this.disp * sin(ang + 180) / this.p2.mass / 60;
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
        if(nodeMode) {
            strokeWeight(3);
            obj.springs.forEach(spring => {
                let col = lerpColor(
                    color(255, 0, 0),
                    color(0, 0, 0),
                    abs(spring.disp) / spring.k
                );
                stroke(col);
                line(spring.p1.pos.x, spring.p1.pos.y, spring.p2.pos.x, spring.p2.pos.y);
            });
        
            let m = 5;
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
        } else {
            beginShape();
            strokeWeight(5);
            stroke(200);
            fill(255);
            obj.nodes.forEach(node => {
                vertex(node.pos.x, node.pos.y);
            });
            endShape(CLOSE);
        }
    });
};
Scene.prototype.update = function() {
    this.objs.forEach(obj => {
        obj.springs.forEach(spring => spring.update());
        obj.nodes.forEach(node => (node.vel.x += windSpeed) & (node.static ? node.reset() : node.update()));
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
                    false
                ));
                break;
            case "p":
                var n1 = curObj.nodes[Number(obj[1])], n2 = curObj.nodes[Number(obj[2])];
                curObj.springs.push(new Spring(
                    n1,
                    n2,
                    DVector.dist(n1.pos, n2.pos),
                    Number(obj[1]),
                    Number(obj[2]),
                    true
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
        for(let j = i; j < numOfPoints; j++) {
            if(abs(i - j) == 1 || abs(i - j) == numOfPoints - 1) {
                circleCode += "s " + i + " " + j + "\n";
            } else {
                circleCode += "p " + i + " " + j + "\n";
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

generateBall(200, -250, 0, 5, 100, 18);

player = scene.objs[1].nodes[0].pos;
var cam = DVector.zero2D();

draw = function() {
    runScenes();
};

pageResized = function() {
    size(innerWidth, innerHeight);
};
