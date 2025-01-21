// Persist ranks across updates
let previousRanks = {};

async function loadLeaderboard() {
    const leaderboardLeft = document.getElementById('leaderboard-left');
    const leaderboardRight = document.getElementById('leaderboard-right');

    try {
        const response = await fetch('/api/members');
        const members = await response.json();

        // Sort members by trophies (or desired ranking criteria)
        const sortedMembers = members.sort((a, b) => b.trophies - a.trophies);

        // Log sorted members for debugging
        console.log("Sorted Members:", sortedMembers);

        // Update movement indicators
        updateMovement(sortedMembers);

        // Render leaderboard
        const midpoint = Math.ceil(sortedMembers.length / 2);
        renderLeaderboard(leaderboardLeft, sortedMembers.slice(0, midpoint), sortedMembers, 0);
        renderLeaderboard(leaderboardRight, sortedMembers.slice(midpoint), sortedMembers, midpoint);

        // Save current ranks for the next update
        saveRanks(sortedMembers);

        // Animate leaderboard
        animateLeaderboard();
    } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
    }
}

function renderLeaderboard(container, players, allPlayers, offset = 0) {
    container.innerHTML = players
        .map((player, index) => {
            const leagueName = player.league?.name || 'No League';
            const leagueIconUrl = player.league?.iconUrls?.small || '';
            const movement = getMovementIcon(player.tag);

            // Debug: Log movement icon for each player
            console.log(`Player: ${player.name}, Movement: ${movement}`);

            return `
            <li data-index="${allPlayers.indexOf(player)}" class="player-item">
                <div class="rank-badge-container">
                    <span class="rank-number">#${index + 1 + offset}</span>
                    <img src="${leagueIconUrl}" alt="${leagueName}" class="league-badge">
                </div>
                <strong>${player.name}</strong>
                <span class="movement-indicator">${movement}</span>
            </li>`;
        })
        .join('');

    container.querySelectorAll('.player-item').forEach((item) => {
        item.addEventListener('click', () =>
            openModal(allPlayers[item.dataset.index])
        );
    });
}

function updateMovement(sortedMembers) {
    sortedMembers.forEach((player, index) => {
        const currentRank = index + 1;
        const previousRank = previousRanks[player.tag]?.rank || currentRank;

        // Update previousRanks with the current movement
        previousRanks[player.tag] = {
            rank: currentRank,
            movement: previousRank - currentRank, // Positive = moved up, Negative = moved down
        };

        // Debug: Log rank changes
        console.log(
            `Player: ${player.name}, Previous Rank: ${previousRank}, Current Rank: ${currentRank}, Movement: ${previousRank - currentRank}`
        );
    });
}

function saveRanks(sortedMembers) {
    sortedMembers.forEach((player, index) => {
        previousRanks[player.tag] = {
            rank: index + 1,
            movement: previousRanks[player.tag]?.movement || 0,
        };
    });

    // Debug: Log updated previousRanks
    console.log("Updated Previous Ranks:", previousRanks);
}

function getMovementIcon(tag) {
    const movement = previousRanks[tag]?.movement;

    if (movement === undefined || movement === 0) {
        return '<span class="neutral">#</span>'; // No movement
    } else if (movement > 0) {
        return '<span class="up">▲</span>'; // Moved up
    } else {
        return '<span class="down">▼</span>'; // Moved down
    }
}

function animateLeaderboard() {
    const leaderboardItems = document.querySelectorAll('.player-item');
    gsap.fromTo(
        leaderboardItems,
        { opacity: 0, y: 50 }, // Starting state: fade in from below
        {
            opacity: 1,
            y: 0, // Ending state: original position
            duration: 1.2,
            stagger: 0.1, // Delay between each item's animation
            ease: 'power3.out',
        }
    );
}

function openModal(player) {
    const modal = document.getElementById('player-modal');
    const leagueName = player.league?.name || 'No League';
    const leagueIconUrl = player.league?.iconUrls?.medium || '';

    modal.querySelector('#player-name').textContent = player.name;
    modal.querySelector('#player-townhall').textContent = player.townHallLevel;
    modal.querySelector('#player-trophies').textContent = player.trophies;
    modal.querySelector('#player-donations').textContent =
        player.donations || 'N/A';
    modal.querySelector('#player-bh').textContent = player.role || 'N/A';
    modal.querySelector('#player-bh-trophies').textContent =
        player.expLevel || 'N/A';
    modal.querySelector('#player-league').textContent = leagueName;

    const badgeImage = modal.querySelector('.league-badge');
    badgeImage.src = leagueIconUrl;
    badgeImage.alt = `${leagueName} Badge`;

    modal.classList.add('visible');
}

function closeModal() {
    document.getElementById('player-modal').classList.remove('visible');
}

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('player-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('player-modal')) closeModal();
});

document.addEventListener('DOMContentLoaded', loadLeaderboard);
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
});
