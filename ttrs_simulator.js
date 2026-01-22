(function () {

    if (window.__TTRS_RUNNING__) return;
    window.__TTRS_RUNNING__ = true;

    // ================= STATE =================
    let score = 0;
    let timeLeft = 60;
    let running = false;
    let timerId = null;

    let currentQ = "", currentA = 0;
    let nextQ = "", nextA = 0;

    // ================= HELPERS =================
    const el = (t, p, txt) => {
        const e = document.createElement(t);
        if (txt !== undefined) e.textContent = txt;
        p.appendChild(e);
        return e;
    };

    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    const genQ = () => {
        const a = rand(2, 12);
        const b = rand(2, 12);
        return Math.random() < 0.5
            ? [`${a} × ${b}`, a * b]
            : [`${a * b} ÷ ${a}`, b];
    };

    // ================= ROOT =================
    const app = el("div", document.body);
    Object.assign(app.style, {
        position: "fixed",
        top: "40px",
        left: "40px",
        width: "460px",
        height: "520px",
        background: "#f5f7fa",
        border: "2px solid #9ca3af",
        borderRadius: "12px",
        zIndex: "2147483647",
        display: "flex",
        fontFamily: "Arial, sans-serif"
    });

    // ================= MAIN COLUMN =================
    const main = el("div", app);
    Object.assign(main.style, {
        flex: "1",
        display: "flex",
        flexDirection: "column"
    });

    // ================= HEADER (DRAG) =================
    const header = el("div", main, "TTRS Studio");
    Object.assign(header.style, {
        height: "40px",
        background: "#2c3e50",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        cursor: "move",
        borderTopLeftRadius: "10px"
    });

    // Drag logic
    let drag = false, dx = 0, dy = 0;
    header.onmousedown = e => {
        drag = true;
        dx = e.clientX - app.offsetLeft;
        dy = e.clientY - app.offsetTop;
        document.onmousemove = e => {
            if (!drag) return;
            app.style.left = Math.max(0, e.clientX - dx) + "px";
            app.style.top = Math.max(0, e.clientY - dy) + "px";
        };
        document.onmouseup = () => {
            drag = false;
            document.onmousemove = null;
        };
    };

    // ================= CONTENT =================
    const content = el("div", main);
    Object.assign(content.style, {
        flex: "1",
        padding: "16px",
        textAlign: "center",
        color: "#1f2937"
    });

    const timerLabel = el("div", content, "Time: 60s");
    timerLabel.style.fontSize = "16px";

    const progressLabel = el("div", content, "Progress: 0");
    progressLabel.style.marginBottom = "4px";

    const nextLabel = el("div", content, "");
    Object.assign(nextLabel.style, {
        color: "#6b7280",
        marginBottom: "6px"
    });

    const question = el("div", content, "Press Start");
    Object.assign(question.style, {
        fontSize: "32px",
        fontWeight: "bold",
        margin: "10px 0"
    });

    const input = el("input", content);
    Object.assign(input.style, {
        fontSize: "26px",
        width: "140px",
        textAlign: "center",
        border: "2px solid #9ca3af",
        borderRadius: "6px"
    });
    input.disabled = true;

    input.addEventListener("keydown", e => {
        if (e.key === "Enter" && running && input.value !== "") {
            check();
        }
    });

    // ================= KEYPAD =================
    const pad = el("div", content);
    Object.assign(pad.style, {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
        marginTop: "14px"
    });

    ["7","8","9","4","5","6","1","2","3","0","Clear","Enter"].forEach(k => {
        const b = el("button", pad, k);
        Object.assign(b.style, {
            height: "44px",
            background: "#e5e7eb",
            border: "2px solid #9ca3af",
            fontSize: "16px",
            cursor: "pointer"
        });

        b.onclick = () => {
            if (!running) return;
            if (k === "Enter") {
                if (input.value !== "") check();
            } else if (k === "Clear") {
                input.value = "";
            } else {
                input.value += k;
            }
        };
    });

    const status = el("div", content);
    status.style.marginTop = "6px";

    const startBtn = el("button", content, "Start Game");
    Object.assign(startBtn.style, {
        marginTop: "12px",
        background: "#22c55e",
        color: "#fff",
        border: "none",
        fontSize: "18px",
        padding: "8px",
        borderRadius: "6px",
        cursor: "pointer"
    });

    // ================= PROGRESS BAR =================
    const barWrap = el("div", app);
    Object.assign(barWrap.style, {
        width: "24px",
        margin: "40px 10px 16px 0",
        background: "#e5e7eb",
        border: "2px solid #9ca3af",
        borderRadius: "6px",
        position: "relative"
    });

    const barFill = el("div", barWrap);
    Object.assign(barFill.style, {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "0%",
        background: "#22c55e",
        borderRadius: "4px"
    });

    // ================= GAME LOGIC =================
    function updateUI() {
        question.textContent = currentQ;
        nextLabel.textContent = "Next: " + nextQ;
        progressLabel.textContent = "Progress: " + score;

        // TTRS-style visual bar (target ≈ 90 questions)
        const percent = Math.min(score / 90, 1) * 100;
        barFill.style.height = percent + "%";
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
        timeLeft--;
        if (timeLeft < 0) end();
    }

    function start() {
        running = true;
        score = 0;
        timeLeft = 60;
        input.disabled = false;
        input.value = "";
        input.focus();
        startBtn.disabled = true;
        status.textContent = "";
        barFill.style.height = "0%";

        [currentQ, currentA] = genQ();
        [nextQ, nextA] = genQ();
        updateUI();

        tick(); // immediate start (TTRS rule)
        timerId = setInterval(tick, 1000);
    }

    function end() {
        clearInterval(timerId);
        running = false;
        question.textContent = "Game Over";
        nextLabel.textContent = "";
        input.disabled = true;
        startBtn.disabled = false;
        status.textContent = `Final: ${score} (${(score / 60).toFixed(2)} q/s)`;
        status.style.color = "#111827";
    }

    startBtn.onclick = start;

})();
