
    (function ledSnakeDots() {
      const path = document.getElementById("ledPath");
      const dotsGroup = document.getElementById("ledDots");
      if (!path || !dotsGroup) return;

      const len = path.getTotalLength();

      // ======= TÙY CHỈNH TẠI ĐÂY =======
      const DOT_COUNT = 15;        // ✅ số hạt (mày muốn 10)
      const DOT_RADIUS = 1.25;     // ✅ size hạt (nhỏ lại cho đẹp)
      const SPACING = 5;          // ✅ khoảng cách giữa các hạt (độ dài theo đường chạy)
      const SPEED = 40;            // ✅ tốc độ chạy (càng nhỏ càng chậm)
      const HUE_SPEED = 60;        // ✅ tốc độ đổi màu 7 sắc
      const FADE_TAIL = true;      // ✅ đuôi mờ dần (true/false)
      // =================================

      // tạo hạt
      const dots = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("r", String(DOT_RADIUS));
        dotsGroup.appendChild(c);
        dots.push(c);
      }

      function mod(n, m) {
        return ((n % m) + m) % m;
      }

      function frame(t) {
        // t: milliseconds
        const time = t / 1000;

        // vị trí "đầu rắn" chạy
        const head = mod(time * SPEED, len);

        for (let i = 0; i < DOT_COUNT; i++) {
          const dist = mod(head - i * SPACING, len);
          const p = path.getPointAtLength(dist);

          const dot = dots[i];
          dot.setAttribute("cx", p.x.toFixed(2));
          dot.setAttribute("cy", p.y.toFixed(2));

          // mỗi hạt có hue khác nhau + đổi theo thời gian
          const hue = mod((time * HUE_SPEED) + i * (360 / DOT_COUNT), 360);

          // màu bảy sắc (hsl)
          dot.setAttribute("fill", `hsl(${hue}, 100%, 60%)`);

          // đuôi mờ (nếu muốn)
          if (FADE_TAIL) {
            const op = Math.max(0.15, 1 - i / (DOT_COUNT * 1.15));
            dot.setAttribute("opacity", op.toFixed(2));
          } else {
            dot.setAttribute("opacity", "1");
          }
        }

        requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    })();
