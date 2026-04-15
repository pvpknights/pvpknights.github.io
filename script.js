let allPlayerData = [];
const rankOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

async function init() {
    try {
        
        const response = await fetch('all_players_master.json');
        const data = await response.json();
        
        
        allPlayerData = Array.isArray(data) ? data : [];
        allPlayerData.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));
        
        showHome();
    } catch (err) {
        console.error("Failed to load player data:", err);
        document.getElementById('container').innerHTML = "Error loading data. Check console for details.";
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
            <div class="tier-desc"><b>S+ Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>S Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>A Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>B Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>C Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>D Tier:</b> To be updated.</div>
            <div class="tier-desc"><b>Unrated:</b> Players not yet officially tiered.</div>
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

            const kClass = k > d ? 'stat-pos' : (k < d ? 'stat-neg' : '');
            const dClass = d > k ? 'stat-pos' : (d < k ? 'stat-neg' : '');
            const wClass = w > l ? 'stat-pos' : (w < l ? 'stat-neg' : '');
            const lClass = l > w ? 'stat-pos' : (l < w ? 'stat-neg' : '');

            const row = document.createElement('div');
            row.className = 'player-row';
            row.style.animationDelay = `${index * 0.05}s`;
            row.innerHTML = `
                <img class="player-avatar" src="https://render.crafty.gg/3d/bust/${p.uuid}?shadow=true" 
                     onerror="this.src='https://render.crafty.gg/3d/bust/char?shadow=true';">
                <div class="player-info">
                    <h3 class="player-name">${p.name || 'Unknown'}</h3>
                    <div class="player-stats">
                        <div class="stat-item"><b>Kills:</b> <span class="stat-value ${kClass}">${k}</span></div>
                        <div class="stat-item"><b>Deaths:</b> <span class="stat-value ${dClass}">${d}</span></div>
                        <div class="stat-item"><b>Wins:</b> <span class="stat-value ${wClass}">${w}</span></div>
                        <div class="stat-item"><b>Losses:</b> <span class="stat-value ${lClass}">${l}</span></div>
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
