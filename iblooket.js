(() => {
    // Remove old GUI
    const old = document.getElementById("blooketChromaGUI");
    if(old) old.remove();

    // Create main container
    const container = document.createElement("div");
    container.id = "blooketChromaGUI";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.width = "480px";
    container.style.maxHeight = "85vh";
    container.style.padding = "15px";
    container.style.background = "#ffffff";
    container.style.border = "2px solid #333";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "3px 3px 15px rgba(0,0,0,0.4)";
    container.style.zIndex = 99999;
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "14px";
    container.style.color = "#111";
    container.style.overflowY = "auto";

    container.innerHTML = `
        <h2 style="margin-top:0; text-align:center; color:#222;">Blooket Chroma Pack Simulator</h2>
        <div style="margin-bottom:10px;">
            <label for="packSelect"><strong>Pack:</strong></label>
            <select id="packSelect" style="width:100%; padding:5px; margin-top:5px;"></select>
        </div>
        <div style="margin-bottom:10px;">
            <label for="openInput"><strong>Number of Opens:</strong></label>
            <input type="number" id="openInput" value="1000" style="width:100%; padding:5px; margin-top:5px;">
        </div>
        <button id="simulateBtn" style="width:100%; padding:8px; font-weight:bold; margin-bottom:10px; cursor:pointer;">Simulate</button>
        <div id="resultArea" style="background:#f0f0f0; padding:10px; border-radius:5px;"></div>
    `;

    document.body.appendChild(container);

    // Packs data
    const PACKS = {
        "Lunch Pack":      [["Uncommon", 75], ["Rare", 21], ["Epic", 3.31], ["Legendary", 0.65], ["Chroma", 0.04]],
        "Blizzard Pack":   [["Uncommon", 72.5], ["Rare", 21.3], ["Epic", 5.15], ["Legendary", 1.0], ["Chroma", 0.05]],
        "Spooky Pack":     [["Uncommon", 76], ["Rare", 20], ["Epic", 3.29], ["Legendary", 0.65], ["Chroma", 0.06]],
        "Autumn Pack":     [["Uncommon", 78], ["Rare", 18], ["Epic", 2.95], ["Legendary", 1.0], ["Chroma", 0.05]],
        "Pirate Pack":     [["Uncommon", 80], ["Rare", 16], ["Epic", 3.67], ["Legendary", 0.30], ["Chroma", 0.03]],
        "Outback Pack":    [["Uncommon", 75], ["Rare", 21], ["Epic", 3.60], ["Legendary", 0.37], ["Chroma", 0.03]],
        "Bug Pack":        [["Uncommon", 78.5], ["Rare", 18], ["Epic", 2.97], ["Legendary", 0.50], ["Chroma", 0.03]],
        "Space Pack":      [["Uncommon", 75], ["Rare", 20], ["Epic", 4.50], ["Legendary", 0.45], ["Chroma", 0.05]],
        "Ice Monster Pack":[["Uncommon", 78], ["Rare", 17], ["Epic", 4.50], ["Legendary", 0.35], ["Chroma", 0.15]]
    };

    const RARITIES = ["Uncommon","Rare","Epic","Legendary","Chroma"];

    // Populate dropdown
    const packSelect = container.querySelector("#packSelect");
    Object.keys(PACKS).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        packSelect.appendChild(opt);
    });

    const openInput = container.querySelector("#openInput");
    const resultArea = container.querySelector("#resultArea");
    const simulateBtn = container.querySelector("#simulateBtn");

    function simulatePack(packName, opens){
        const results = {Uncommon:0,Rare:0,Epic:0,Legendary:0,Chroma:0};
        for(let i=0;i<opens;i++){
            const roll = Math.random()*100;
            let cumulative = 0;
            for(const [rarity, pct] of PACKS[packName]){
                cumulative += pct;
                if(roll <= cumulative){
                    results[rarity]++;
                    break;
                }
            }
        }
        return results;
    }

    simulateBtn.onclick = () => {
        const pack = packSelect.value;
        const opens = parseInt(openInput.value);
        if(isNaN(opens) || opens <= 0){
            resultArea.innerHTML = "<span style='color:red;'>Enter a valid number of opens.</span>";
            return;
        }

        const results = simulatePack(pack, opens);
        const chromas = results["Chroma"];
        const chromaChance = (chromas/opens*100).toFixed(4);

        // Build table
        let html = `<h3>${pack} — ${opens} opens</h3>`;
        html += `<p>🌈 <strong>Chromas pulled:</strong> ${chromas} | 📊 <strong>Overall Chroma chance:</strong> ${chromaChance}%</p>`;
        html += `<table style="width:100%; border-collapse: collapse; text-align:left;">`;
        html += `<tr style="background:#ddd;"><th>Rarity</th><th>Count</th><th>Percentage</th></tr>`;
        RARITIES.forEach(r => {
            const count = results[r];
            const pct = (count/opens*100).toFixed(4);
            html += `<tr style="border-top:1px solid #ccc;"><td>${r}</td><td>${count}</td><td>${pct}%</td></tr>`;
        });
        html += `</table>`;

        resultArea.innerHTML = html;
    };
})();
