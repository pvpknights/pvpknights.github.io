let allPlayerData = [];
const rankOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

async function init() {
    try {
        const response = await fetch('all_players_master.json?v=' + Date.now());
        const data = await response.json();
        
        allPlayerData = Array.isArray(data) ? data : [];
        allPlayerData.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));
        
        showHome();
    } catch (err) {
        console.error("Failed to load player data:", err);
        document.getElementById('container').innerHTML = "Error loading data.";
    }
}

function showHome() {
    document.body.className = ""; 
    updateUI("The Knights of Honor", p => p.rank === "S+", 'home-btn');
}

function showRank(tier) {
    document.body.className = `theme-${tier.toLowerCase()}`;
    let displayTitle = (tier === 'E') ? "UNRATED" : `${tier} TIER`;
    updateUI(displayTitle, p => p.rank && p.rank.startsWith(tier));
}

function showRatings() {
    document.body.className = "";
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = `
        <div class="explanation-card">
            <div class="tier-desc"><b>S+ Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>S Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>A Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>B Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>C Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>D Tier:</b> To be Updated</div>
            <div class="tier-desc"><b>Unrated:</b> We lowk haven't rated them..</div>
        </div>
    `;
    title.innerText = "RATINGS EXPLAINED";
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('info-btn').classList.add('active');
}

function handleSearch() {
    document.body.className = "";
    const query = document.getElementById('playerSearch').value.toLowerCase();
    updateUI("SEARCH RESULTS", p => p.name && p.name.toLowerCase().includes(query));
}

function updateUI(titleText, filterFn, activeId) {
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = '';
    title.innerText = titleText;

    const filtered = allPlayerData.filter(filterFn);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:50px;">No knights found.</p>`;
    } else {
        filtered.forEach((p, index) => {
            const k = p.kills || 0;
            const d = p.deaths || 0;
            const w = p.wins || 0;
            const l = p.losses || 0;
            
            const kdVal = d > 0 ? (k / d) : k;
            const wlVal = l > 0 ? (w / l) : w;

            const kdClass = kdVal >= 1 ? 'kills-text' : 'deaths-text';
            const wlClass = wlVal >= 1 ? 'kills-text' : 'deaths-text';

            const row = document.createElement('div');
            row.className = 'player-row';
            row.style.animationDelay = `${index * 0.05}s`;
            row.innerHTML = `
                <img class="player-avatar" src="https://render.crafty.gg/3d/bust/${p.uuid}?shadow=true" 
                     onerror="this.src='https://render.crafty.gg/3d/bust/char?shadow=true';">
                <div class="player-info">
                    <h3 class="player-name">${p.name || 'Unknown'}</h3>
                    <div class="player-stats">
                        <div class="stat-item"><b>Kills:</b> <span class="stat-value kills-text">${k}</span></div>
                        <div class="stat-item"><b>Deaths:</b> <span class="stat-value deaths-text">${d}</span></div>
                        <div class="stat-item"><b>K/D:</b> <span class="stat-value ${kdClass}">${kdVal.toFixed(2)}</span></div>
                        <div class="stat-item"><b>Wins:</b> <span class="stat-value wins-text">${w}</span></div>
                        <div class="stat-item"><b>Losses:</b> <span class="stat-value losses-text">${l}</span></div>
                        <div class="stat-item"><b>W/L:</b> <span class="stat-value ${wlClass}">${wlVal.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="rank-badge">${p.rank || 'N/A'}</div>
            `;
            container.appendChild(row);
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.innerText.toUpperCase();
        const currentTitle = titleText.toUpperCase();

        if (activeId && btn.id === activeId) {
            btn.classList.add('active');
        } else if (currentTitle === `${btnText} TIER` || (currentTitle === "UNRATED" && btnText === "UNRATED")) {
            btn.classList.add('active');
        } else if (currentTitle === "THE KNIGHTS OF HONOR" && btn.id === 'home-btn') {
            btn.classList.add('active');
        }
    });
}

init();
