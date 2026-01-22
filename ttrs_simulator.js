(function () {

    if (window.__TTRS_RUNNING__) return;
    window.__TTRS_RUNNING__ = true;

    // ---------- STATE ----------
    let score = 0;
    let target = 90;
    let timeLeft = 60;
    let running = false;
    let timer = null;

    let currentQ = "", currentA = 0;
    let nextQ = "", nextA = 0;

    // ---------- HELPERS ----------
    function el(tag, parent, text) {
        const e = document.createElement(tag);
        if (text !== undefined) e.textContent = text;
        parent.appendChild(e);
        return e;
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function genQ() {
        const a = rand(2, 12);
        const b = rand(2, 12);
        return Math.random() < 0.5
            ? [`${a} × ${b}`, a * b]
            : [`${a * b} ÷ ${a}`, b];
    }

    // ---------- ROOT ----------
    const app = el("div", document.body);
    app.style.position = "fixed";
    app.style.top = "40px";
    app.style.left = "40px";
    app.style.width = "420px";
    app.style.height = "520px";
    app.style.zIndex = "2147483647";
    app.style.background = "#f5f7fa";
    app.style.border = "2px solid #9ca3af";
    app.style.borderRadius = "12px";
    app.style.display = "flex";
    app.style.flexDirection = "column";
    app.style.fontFamily = "Arial, sans-serif";

    // ---------- HEADER (DRAG HANDLE) ----------
    const header = el("div", app, "TTRS Studio");
    header.style.height = "40px";
    header.style.background = "#2c3e50";
    header.style.color = "#ffffff";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "center";
    header.style.fontWeight = "bold";
    header.style.cursor = "move";
    header.style.borderTopLeftRadius = "10px";
    header.style.borderTopRightRadius = "10px";

    // ---------- DRAG LOGIC ----------
    let dragging = false, dx = 0, dy = 0;

    header.onmousedown = e => {
        dragging = true;
        dx = e.clientX - app.offsetLeft;
        dy = e.clientY - app.offsetTop;
        document.onmousemove = e => {
            if (!dragging) return;
            app.style.left = Math.max(0, e.clientX - dx) + "px";
            app.style.top = Math.max(0, e.clientY - dy) + "px";
        };
        document.onmouseup = () => {
            dragging = false;
            document.onmousemove = null;
        };
    };

    // ---------- CONTENT ----------
    const content = el("div", app);
    content.style.flex = "1";
    content.style.padding = "16px";
    content.style.textAlign = "center";
    content.style.color = "#1f2937";

    const timerLabel = el("div", content, "Time: 60s");
    const progressLabel = el("div", content, "Progress: 0/90");
    timerLabel.style.fontSize = "16px";

    const nextLabel = el("div", content, "");
    nextLabel.style.marginTop = "6px";
    nextLabel.style.color = "#6b7280";

    const question = el("div", content, "Press Start");
    question.style.fontSize = "32px";
    question.style.fontWeight = "bold";
    question.style.margin = "12px 0";

    const input = el("input", content);
    input.disabled = true;
    input.style.fontSize = "26px";
    input.style.width = "120px";
    input.style.textAlign = "center";
    input.style.border = "2px solid #9ca3af";
    input.style.borderRadius = "6px";

    // ---------- KEYPAD ----------
    const pad = el("div", content);
    pad.style.display = "grid";
    pad.style.gridTemplateColumns = "repeat(3, 1fr)";
    pad.style.gap = "8px";
    pad.style.marginTop = "14px";

    ["7","8","9","4","5","6","1","2","3","0","Clear","Enter"].forEach(k => {
        const b = el("button", pad, k);
        b.style.height = "44px";
        b.style.background = "#e5e7eb";
        b.style.border = "2px solid #9ca3af";
        b.style.fontSize = "16px";
        b.style.cursor = "pointer";
        b.onclick = () => {
            if (!running) return;
            if (k === "Enter") check();
            else if (k === "Clear") input.value = "";
            else input.value += k;
        };
    });

    const status = el("div", content);
    status.style.marginTop = "8px";

    const startBtn = el("button", content, "Start Game");
    startBtn.style.marginTop = "12px";
    startBtn.style.background = "#22c55e";
    startBtn.style.color = "#ffffff";
    startBtn.style.border = "none";
    startBtn.style.fontSize = "18px";
    startBtn.style.padding = "8px";
    startBtn.style.borderRadius = "6px";
    startBtn.style.cursor = "pointer";

    // ---------- GAME LOGIC ----------
    function updateUI() {
        question.textContent = currentQ;
        nextLabel.textContent = "Next: " + nextQ;
        progressLabel.textContent = `Progress: ${score}/${target}`;
    }

    function check() {
        if (parseInt(input.value) === currentA) {
            score++;
            status.textContent = "Correct";
            status.style.color = "#16a34a";
        } else {
            status.textContent = "Wrong (" + currentA + ")";
            status.style.color = "#dc2626";
        }
        [currentQ, currentA] = [nextQ, nextA];
        [nextQ, nextA] = genQ();
        input.value = "";
        updateUI();
    }

    function tick() {
        timerLabel.textContent = "Time: " + timeLeft + "s";
        if (--timeLeft < 0) end();
    }

    function start() {
        running = true;
        score = 0;
        timeLeft = 60;
        input.disabled = false;
        input.value = "";
        input.focus();
        startBtn.disabled = true;

        [currentQ, currentA] = genQ();
        [nextQ, nextA] = genQ();
        updateUI();

        tick();
        timer = setInterval(tick, 1000);
    }

    function end() {
        clearInterval(timer);
        running = false;
        question.textContent = "Game Over";
        nextLabel.textContent = "";
        startBtn.disabled = false;
        input.disabled = true;
    }

    startBtn.onclick = start;

})();
