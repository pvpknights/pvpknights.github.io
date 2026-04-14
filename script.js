let allPlayerData = [];

const rankOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

async function init() {
    try {
        const response = await fetch('all_players_master.json');
        allPlayerData = await response.json();
        
        // Start on S Tier, but only show S+ on the very first load
        renderRankGroup('S', true); 
    } catch (err) {
        document.getElementById('container').innerHTML = "Error loading players.";
    }
}

function renderRankGroup(tierLetter, isLanding = false) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    // Filter by the letter (e.g., "S")
    let players = allPlayerData.filter(p => p.rank.startsWith(tierLetter));

    // Landing page logic: Only show S+ initially
    if (isLanding) {
        players = players.filter(p => p.rank === "S+");
        document.getElementById('origin-title').innerText = "THE ELITE";
    } else {
        document.getElementById('origin-title').innerText = `${tierLetter} TIER`;
    }

    // Sort by our rankOrder list
    players.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

    players.forEach(p => {
        const row = document.createElement('div');
        row.className = 'player-row';
        
        row.innerHTML = `
            <img class="player-avatar" src="https://render.crafty.gg/3d/bust/${p.uuid}?shadow=true" 
                 onerror="this.src='https://render.crafty.gg/3d/bust/char?shadow=true';">
            <div class="player-info">
                <h3 class="player-name">${p.name}</h3>
            </div>
            <div class="rank-badge">${p.rank}</div>
        `;
        container.appendChild(row);
    });

    // Toggle active button visuals
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.startsWith(tierLetter));
    });
}

init();