let allPlayerData = [];

const rankOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

async function init() {
    try {
        const response = await fetch('all_players_master.json');
        const data = await response.json();
        
        allPlayerData = data.sort((a, b) => {
            return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
        });

        showHome();
    } catch (err) {
        console.error("JSON Error:", err);
        document.getElementById('container').innerHTML = "<p style='text-align:center;'>Error loading data.</p>";
    }
}

function showHome() {
    updateUI("THE ELITE", p => p.rank === "S+", 'home-btn');
}

function showRank(tier) {
    updateUI(`${tier} TIER`, p => p.rank.startsWith(tier), null, tier);
}

function showRatings() {
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = '';
    title.innerText = "RATING GUIDE";

    const infoCard = document.createElement('div');
    infoCard.className = 'info-card';
    infoCard.innerHTML = `
        <h2>Tier Explanations</h2>
        <div class="rating-item"><b>S+:</b> Absolute dominance. Mastered all mechanics.</div>
        <div class="rating-item"><b>S:</b> Expert combatants. A threat to everyone.</div>
        <div class="rating-item"><b>A:</b> Advanced game sense and performance.</div>
        <div class="rating-item"><b>B:</b> Competent fighters. Solid understanding.</div>
        <div class="rating-item"><b>C:</b> Average skill. Still honing tactics.</div>
        <div class="rating-item"><b>D:</b> Novice level. Learning the ropes.</div>
        <div class="rating-item"><b>E:</b> Recruit. The starting rank.</div>
    `;
    container.appendChild(infoCard);

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('info-btn').classList.add('active');
}

function updateUI(titleText, filterFn, activeId, tierLetter) {
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = '';
    title.innerText = titleText;

    const filtered = allPlayerData.filter(filterFn);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.3; margin-top:50px;">No members found.</p>`;
    } else {
        filtered.forEach(p => {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.innerHTML = `
                <img class="player-avatar" src="https://render.crafty.gg/3d/bust/${p.uuid}?shadow=true" 
                     onerror="this.src='https://render.crafty.gg/3d/bust/char?shadow=true';">
                <div class="player-info"><h3 class="player-name">${p.name}</h3></div>
                <div class="rank-badge">${p.rank}</div>
            `;
            container.appendChild(row);
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (activeId && btn.id === activeId) btn.classList.add('active');
        if (tierLetter && btn.innerText.startsWith(tierLetter) && btn.id !== 'home-btn' && btn.id !== 'info-btn') btn.classList.add('active');
    });
}

init();
