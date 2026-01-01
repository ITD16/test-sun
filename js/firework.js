function startFirework() {

    window.addEventListener("resize", resizeCanvas, false);

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var canvas, ctx, w, h, particles = [], probability = 0.015,
        xPoint, yPoint;

    function onLoad() {
        canvas = document.getElementById("canvas");
        if (!canvas) {
            console.error("Canvas #canvas không tồn tại");
            return;
        }
        ctx = canvas.getContext("2d");
        resizeCanvas();
        requestAnimationFrame(updateWorld);

        setInterval(() => {
            createFirework(
                Math.random() * (w - 200) + 100,
                Math.random() * (h - 200) + 100
            );
        }, 4000);
    }

    function resizeCanvas() {
        if (canvas) {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
    }

    function updateWorld() {
        updateParticles();
        paint();
        requestAnimationFrame(updateWorld);
    }

    function updateParticles() {
        if (particles.length < 100 && Math.random() < probability) {
            createFirework(
                Math.random() * (w - 200) + 100,
                Math.random() * (h - 200) + 100
            );
        }
        particles = particles.filter(p => p.move());
    }

    function paint() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        particles.forEach(p => p.draw(ctx));
    }

    function createFirework(x, y) {
        xPoint = x;
        yPoint = y;
        const nFire = Math.random() * 50 + 80;
        const c = `rgb(${~~(Math.random()*200+55)},${~~(Math.random()*200+55)},${~~(Math.random()*200+55)})`;
        for (let i = 0; i < nFire; i++) {
            const p = new Particle();
            p.color = c;
            particles.push(p);
        }
    }

    function Particle() {
        this.w = this.h = Math.random() * 3 + 1;
        this.x = xPoint;
        this.y = yPoint;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = Math.random() * .5 + .5;
    }

    Particle.prototype.gravity = 0.05;
    Particle.prototype.move = function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.012;
        return this.alpha > 0;
    };
    Particle.prototype.draw = function (c) {
        c.save();
        c.translate(this.x, this.y);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fill();
        c.restore();
    };

    // ⭐ GỌI NGAY
    onLoad();
}
