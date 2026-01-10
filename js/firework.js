function startFirework() {

    window.addEventListener("resize", resizeCanvas, false);

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    let canvas, ctx, w, h;
    let particles = [];
    let probability = 0.03;
    let xPoint, yPoint;

    function onLoad() {
        canvas = document.getElementById("canvas");
        if (!canvas) {
            console.error("Canvas #canvas không tồn tại");
            return;
        }
        ctx = canvas.getContext("2d");
        resizeCanvas();
        requestAnimationFrame(updateWorld);

        // Pháo lớn theo chu kỳ
        setInterval(() => {
            createFirework(
                Math.random() * (w - 300) + 150,
                Math.random() * (h - 300) + 150
            );
        }, 1500);
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
        if (particles.length < 400 && Math.random() < probability) {
            createFirework(
                Math.random() * (w - 300) + 150,
                Math.random() * (h - 300) + 150
            );
        }
        particles = particles.filter(p => p.move());
    }

    function paint() {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = "lighter";
        particles.forEach(p => p.draw(ctx));
    }

    function createFirework(x, y) {
        xPoint = x;
        yPoint = y;

        const nFire = Math.random() * 120 + 180;
        const color = `rgb(${~~(Math.random() * 200 + 55)},${~~(
            Math.random() * 200 + 55
        )},${~~(Math.random() * 200 + 55)})`;

        for (let i = 0; i < nFire; i++) {
            const p = new Particle();
            p.color = color;
            particles.push(p);
        }
    }

    function Particle() {
        this.w = this.h = Math.random() * 4 + 2;
        this.x = xPoint;
        this.y = yPoint;

        // NỔ TRÒN CHUẨN
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 6;

        this.vx = Math.cos(angle) * speed * (0.9 + Math.random() * 0.2);
        this.vy = Math.sin(angle) * speed * (0.9 + Math.random() * 0.2);

        this.alpha = Math.random() * 0.5 + 0.5;
    }

    Particle.prototype.gravity = 0.04;

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

    onLoad();
}
