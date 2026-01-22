(() => {
    // ---------- STATE ----------
    let score = 0;
    let target = 90;
    let timeLeft = 60;
    let running = false;
    let timer;

    let currentQ, currentA;
    let nextQ, nextA;

    // ---------- HELPERS ----------
    const el = (tag, parent, text = "") => {
        const e = document.createElement(tag);
        if (text) e.textContent = text;
        parent.appendChild(e);
        return e;
    };

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateQuestion = () => {
        const a = rand(2, 12);
        const b = rand(2, 12);
        if (Math.random() < 0.5) {
            return [`${a} × ${b}`, a * b];
        } else {
            return [`${a * b} ÷ ${a}`, b];
        }
    };

    // ---------- WINDOW ----------
    const app = el("div", document.body);
    Object.assign(app.style, {
        width: "600px",
        height: "600px",
        margin: "40px auto",
        display: "flex",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        fontFamily: "Arial"
    });

    const main = el("div", app);
    main.style.flex = "1";
    main.style.padding = "20px";
    main.style.textAlign = "center";

    const side = el("div", app);
    Object.assign(side.style, {
        width: "30px",
        margin: "20px",
        background: "#ddd",
        borderRadius: "6px",
        display: "flex",
        alignItems: "flex-end"
    });

    const progressFill = el("div", side);
    Object.assign(progressFill.style, {
        width: "100%",
        height: "0%",
        background: "#4CAF50",
        borderRadius: "6px",
        transition: "height 0.2s"
    });

    const timerLabel = el("div", main, "Time: 60s");
    timerLabel.style.fontSize = "18px";

    const progressLabel = el("div", main, "Progress: 0/90");
    progressLabel.style.fontSize = "14px";

    const nextLabel = el("div", main);
    nextLabel.style.color = "gray";
    nextLabel.style.marginTop = "10px";

    const questionLabel = el("div", main, "Press Start!");
    questionLabel.style.fontSize = "32px";
    questionLabel.style.fontWeight = "bold";
    questionLabel.style.margin = "15px 0";

    const input = el("input", main);
    input.disabled = true;
    Object.assign(input.style, {
        fontSize: "26px",
        textAlign: "center",
        width: "140px"
    });

    const keypad = el("div", main);
    Object.assign(keypad.style, {
        display: "grid",
        gridTemplateColumns: "repeat(3, 80px)",
        gap: "8px",
        justifyContent: "center",
        marginTop: "15px"
    });

    const status = el("div", main);
    status.style.marginTop = "10px";

    const startBtn = el("button", main, "Start Game");
    Object.assign(startBtn.style, {
        marginTop: "15px",
        fontSize: "18px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "6px",
        cursor: "pointer"
    });

    // ---------- KEYPAD ----------
    ["7","8","9","4","5","6","1","2","3","0","Clear","Enter"].forEach(k => {
        const b = el("button", keypad, k);
        b.style.height = "50px";
        b.style.fontWeight = "bold";
        b.onclick = () => {
            if (!running) return;
            if (k === "Enter") check();
            else if (k === "Clear") input.value = "";
            else input.value += k;
        };
    });

    // ---------- GAME ----------
    const updateUI = () => {
        questionLabel.textContent = currentQ;
        nextLabel.textContent = "Next: " + nextQ;
        progressLabel.textContent = `Progress: ${score}/${target}`;
        progressFill.style.height = `${(score / target) * 100}%`;
    };

    const check = () => {
        if (!input.value) return;
        if (+input.value === currentA) {
            score++;
            status.textContent = "Correct!";
            status.style.color = "green";
        } else {
            status.textContent = `Wrong! (${currentA})`;
            status.style.color = "red";
        }

        if (score >= target) return end();

        currentQ = nextQ;
        currentA = nextA;
        [nextQ, nextA] = generateQuestion();

        input.value = "";
        updateUI();
    };

    const tick = () => {
        timerLabel.textContent = `Time: ${timeLeft}s`;
        if (timeLeft-- <= 0) end();
    };

    const start = () => {
        running = true;
        score = 0;
        timeLeft = 60;
        input.disabled = false;
        input.focus();
        startBtn.disabled = true;
        status.textContent = "";

        [currentQ, currentA] = generateQuestion();
        [nextQ, nextA] = generateQuestion();

        updateUI();
        tick();
        timer = setInterval(tick, 1000);
    };

    const end = () => {
        running = false;
        clearInterval(timer);
        questionLabel.textContent = "Game Over!";
        nextLabel.textContent = "";
        input.disabled = true;
        startBtn.disabled = false;
        status.textContent = `Final: ${score} (${score ? (60/score).toFixed(2) : 0}s/q)`;
        status.style.fontWeight = "bold";
    };

    startBtn.onclick = start;
})();
