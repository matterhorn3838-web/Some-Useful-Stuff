(function () {

    function startTTRS() {

        if (window.__TTRS_RUNNING__) return;
        window.__TTRS_RUNNING__ = true;

        // ---------- STATE ----------
        var score = 0;
        var target = 90;
        var timeLeft = 60;
        var running = false;
        var timer = null;

        var currentQ = "";
        var currentA = 0;
        var nextQ = "";
        var nextA = 0;

        // ---------- HELPERS ----------
        function create(tag, parent, text) {
            var e = document.createElement(tag);
            if (text !== undefined) e.textContent = text;
            parent.appendChild(e);
            return e;
        }

        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function generateQuestion() {
            var a = rand(2, 12);
            var b = rand(2, 12);
            if (Math.random() < 0.5) {
                return [a + " × " + b, a * b];
            } else {
                return [(a * b) + " ÷ " + a, b];
            }
        }

        // ---------- ROOT ----------
        var app = create("div", document.body);
        app.id = "ttrs-app";
        app.style.position = "fixed";
        app.style.top = "20px";
        app.style.left = "20px";
        app.style.zIndex = "2147483647";
        app.style.width = "600px";
        app.style.height = "600px";
        app.style.display = "flex";
        app.style.background = "#ffffff";
        app.style.border = "2px solid #000";
        app.style.borderRadius = "10px";
        app.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
        app.style.fontFamily = "Arial, sans-serif";
        app.style.color = "#000";

        // ---------- MAIN ----------
        var main = create("div", app);
        main.style.flex = "1";
        main.style.padding = "20px";
        main.style.textAlign = "center";
        main.style.color = "#000";

        // ---------- PROGRESS BAR ----------
        var bar = create("div", app);
        bar.style.width = "30px";
        bar.style.margin = "20px";
        bar.style.background = "#ddd";
        bar.style.border = "1px solid #000";
        bar.style.borderRadius = "6px";
        bar.style.display = "flex";
        bar.style.alignItems = "flex-end";

        var fill = create("div", bar);
        fill.style.width = "100%";
        fill.style.height = "0%";
        fill.style.background = "#4CAF50";

        // ---------- LABELS ----------
        var timerLabel = create("div", main, "Time: 60s");
        timerLabel.style.fontSize = "18px";
        timerLabel.style.color = "#000";

        var progressLabel = create("div", main, "Progress: 0/90");
        progressLabel.style.fontSize = "14px";
        progressLabel.style.color = "#000";

        var nextLabel = create("div", main, "");
        nextLabel.style.marginTop = "10px";
        nextLabel.style.fontSize = "16px";
        nextLabel.style.color = "#555";

        var questionLabel = create("div", main, "Press Start!");
        questionLabel.style.fontSize = "32px";
        questionLabel.style.fontWeight = "bold";
        questionLabel.style.margin = "15px 0";
        questionLabel.style.color = "#000";

        // ---------- INPUT ----------
        var input = create("input", main);
        input.id = "ttrs-answer";
        input.name = "answer";
        input.disabled = true;
        input.style.fontSize = "26px";
        input.style.textAlign = "center";
        input.style.width = "140px";
        input.style.color = "#000";
        input.style.background = "#fff";
        input.style.border = "2px solid #000";
        input.style.marginTop = "5px";

        input.onkeydown = function (e) {
            if (e.key === "Enter") check();
        };

        // ---------- KEYPAD ----------
        var keypad = create("div", main);
        keypad.style.display = "grid";
        keypad.style.gridTemplateColumns = "repeat(3, 80px)";
        keypad.style.gap = "8px";
        keypad.style.justifyContent = "center";
        keypad.style.marginTop = "15px";

        var keys = ["7","8","9","4","5","6","1","2","3","0","Clear","Enter"];
        for (var i = 0; i < keys.length; i++) {
            (function (k) {
                var b = create("button", keypad, k);
                b.style.height = "50px";
                b.style.fontWeight = "bold";
                b.style.fontSize = "16px";
                b.style.color = "#000";
                b.style.background = "#f0f0f0";
                b.style.border = "2px solid #000";
                b.style.cursor = "pointer";
                b.onclick = function () {
                    if (!running) return;
                    if (k === "Enter") check();
                    else if (k === "Clear") input.value = "";
                    else input.value += k;
                };
            })(keys[i]);
        }

        // ---------- STATUS ----------
        var status = create("div", main);
        status.style.marginTop = "10px";
        status.style.fontSize = "14px";
        status.style.color = "#000";

        // ---------- START BUTTON ----------
        var startBtn = create("button", main, "Start Game");
        startBtn.style.marginTop = "15px";
        startBtn.style.fontSize = "18px";
        startBtn.style.background = "#4CAF50";
        startBtn.style.color = "#fff";
        startBtn.style.border = "2px solid #000";
        startBtn.style.padding = "10px";
        startBtn.style.cursor = "pointer";

        // ---------- GAME LOGIC ----------
        function updateUI() {
            questionLabel.textContent = currentQ;
            nextLabel.textContent = "Next: " + nextQ;
            progressLabel.textContent = "Progress: " + score + "/" + target;
            fill.style.height = (score / target * 100) + "%";
        }

        function check() {
            if (!input.value) return;

            if (parseInt(input.value, 10) === currentA) {
                score++;
                status.textContent = "Correct!";
                status.style.color = "green";
            } else {
                status.textContent = "Wrong! (" + currentA + ")";
                status.style.color = "red";
            }

            currentQ = nextQ;
            currentA = nextA;
            var q = generateQuestion();
            nextQ = q[0];
            nextA = q[1];

            input.value = "";
            updateUI();
        }

        function tick() {
            timerLabel.textContent = "Time: " + timeLeft + "s";
            timeLeft--;
            if (timeLeft < 0) endGame();
        }

        function startGame() {
            running = true;
            score = 0;
            timeLeft = 60;
            input.disabled = false;
            input.focus();
            startBtn.disabled = true;
            status.textContent = "";

            var q1 = generateQuestion();
            var q2 = generateQuestion();
            currentQ = q1[0];
            currentA = q1[1];
            nextQ = q2[0];
            nextA = q2[1];

            updateUI();
            tick();
            timer = setInterval(tick, 1000);
        }

        function endGame() {
            running = false;
            clearInterval(timer);
            questionLabel.textContent = "Game Over!";
            nextLabel.textContent = "";
            input.disabled = true;
            startBtn.disabled = false;
        }

        startBtn.onclick = startGame;
    }

    if (document.body) startTTRS();
    else window.addEventListener("load", startTTRS);

})();
