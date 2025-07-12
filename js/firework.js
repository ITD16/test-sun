if (window.ENABLE_FIREWORK === true)
{
    // ============== PHẦN PHÁO HOA ==============
    window.addEventListener("resize", resizeCanvas, false);
    window.addEventListener("DOMContentLoaded", onLoad, false);
    
    window.requestAnimationFrame = 
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function (callback) {
            window.setTimeout(callback, 1000/60);
        };
    
    var canvas, ctx, w, h, particles = [], probability = 0.015,
        xPoint, yPoint;
    
    function onLoad() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        resizeCanvas();
        
        // Bắt đầu animation
        window.requestAnimationFrame(updateWorld);
        
        // Tự động bắn pháo hoa mỗi 2 giây
        setInterval(function() {
          createFirework(
            Math.random() * (w - 200) + 100,
            Math.random() * (h - 200) + 100
          );
        }, 4000);
    } 
    
    function resizeCanvas() {
        if (!!canvas) {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
    } 
    
    function updateWorld() {
        updateParticles();
        paint();
        window.requestAnimationFrame(updateWorld);
    } 
    
    function updateParticles() {
        if (particles.length < 100 && Math.random() < probability) {
            createFirework(
              Math.random() * (w - 200) + 100,
              Math.random() * (h - 200) + 100
            );
        }
        var alive = [];
        for (var i=0; i<particles.length; i++) {
            if (particles[i].move()) {
                alive.push(particles[i]);
            }
        }
        particles = alive;
    } 
    
    function paint() {
        // Thay đổi ở đây: chỉ clear một phần thay vì toàn bộ
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(0,0,0,0.1)"; // Độ mờ giảm xuống để thấy vệt đuôi
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        
        for (var i=0; i<particles.length; i++) {
            particles[i].draw(ctx);
        }
    } 
    
    function createFirework(x, y) {
        xPoint = x;
        yPoint = y;
        var nFire = Math.random()*50+100;
        var c = "rgb("+(~~(Math.random()*200+55))+","
             +(~~(Math.random()*200+55))+","+(~~(Math.random()*200+55))+")";
        for (var i=0; i<nFire; i++) {
            var particle = new Particle();
            particle.color = c;
            var vy = Math.sqrt(25-particle.vx*particle.vx);
            if (Math.abs(particle.vy) > vy) {
                particle.vy = particle.vy>0 ? vy: -vy;
            }
            particles.push(particle);
        }
    } 
    
    function Particle() {
        this.w = this.h = Math.random()*4+1;
        
        this.x = xPoint-this.w/2;
        this.y = yPoint-this.h/2;
        
        this.vx = (Math.random()-0.5)*10;
        this.vy = (Math.random()-0.5)*10;
        
        this.alpha = Math.random()*.5+.5;
        
        this.color;
    } 
    
    Particle.prototype = {
        gravity: 0.05,
        move: function () {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.alpha -= 0.01;
            if (this.x <= -this.w || this.x >= screen.width ||
                this.y >= screen.height ||
                this.alpha <= 0) {
                    return false;
            }
            return true;
        },
        draw: function (c) {
            c.save();
            c.beginPath();
            
            c.translate(this.x+this.w/2, this.y+this.h/2);
            c.arc(0, 0, this.w, 0, Math.PI*2);
            c.fillStyle = this.color;
            c.globalAlpha = this.alpha;
            
            c.closePath();
            c.fill();
            c.restore();
        }
    }
    // ============== HẾT PHẦN PHÁO HOA ==============

    // Phần đồng hồ
    function updateClock() {
      const now = moment().tz('Asia/Bangkok');
      document.getElementById('LocalTime').textContent = now.format('HH:mm:ss');
      document.getElementById('LocalDate').textContent = now.format('DD/MM/YYYY');
      
      const container = document.querySelector('.time-container');
      if (container.offsetHeight > window.innerHeight * 0.8) {
        const newSize = Math.min(15, window.innerWidth * 0.8 / 10);
        document.querySelectorAll('.time-text').forEach(el => {
          el.style.fontSize = `${newSize}vw`;
        });
      }
    }

    updateClock();
    setInterval(updateClock, 1000);

    function openFullscreen() {
      const elem = document.getElementById("fullscreen");
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }
}
