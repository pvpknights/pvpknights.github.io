let allPlayerData = [];


const rankOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

async function init() {
    try {

        const response = await fetch('all_players_master.json');
        allPlayerData = await response.json();
        

        renderHome(); 
    } catch (err) {
        console.error(err);
        document.getElementById('container').innerHTML = "Error loading player data. Check your JSON format.";
    }
}


function renderHome() {
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = '';
    title.innerText = "THE ELITE";

    // Filter ONLY S+ members
    const elite = allPlayerData.filter(p => p.rank === "S+");

    if (elite.length === 0) {
        container.innerHTML = "<p style='text-align:center'>No S+ Knights recorded yet.</p>";
    } else {
        displayPlayers(elite);
    }


    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('home-btn').classList.add('active');
}


function renderRankGroup(tierLetter) {
    const container = document.getElementById('container');
    const title = document.getElementById('origin-title');
    container.innerHTML = '';
    title.innerText = `${tierLetter} TIER`;


    let players = allPlayerData.filter(p => p.rank.startsWith(tierLetter));


    players.sort((a, b) => {
        return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    });

    displayPlayers(players);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.startsWith(tierLetter) && btn.id !== 'home-btn');
    });
}

function displayPlayers(playerList) {
    const container = document.getElementById('container');
    playerList.forEach(p => {
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
}

init();
