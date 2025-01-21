document.addEventListener("DOMContentLoaded", () => {
    updateWarStats();

    async function updateWarStats() {
        try {
            // Fetch current war stats
            const response = await fetch("/api/war");
            if (!response.ok) {
                throw new Error(`Failed to fetch war stats: ${response.status} ${response.statusText}`);
            }
            const warData = await response.json();

            // Populate Current Matchup
            populateCurrentMatchup(warData);

            // Populate Participants
            populateParticipantsTable("your-clan-participants", warData.clan.members);
            populateParticipantsTable("opponent-clan-participants", warData.opponent.members);

            // Fetch Last 5 Wars
            try {
                const pastWarsResponse = await fetch("/api/pastwars");
                if (!pastWarsResponse.ok) {
                    throw new Error(`Failed to fetch past wars: ${pastWarsResponse.status} ${pastWarsResponse.statusText}`);
                }
                const pastWars = await pastWarsResponse.json();
                populateLast5Wars(pastWars);
            } catch (error) {
                console.error("Error fetching past wars:", error);
                showError("Unable to load past wars.");
            }

            // Fetch clan info for war league
            try {
                const clanResponse = await fetch("/api/clan");
                if (!clanResponse.ok) {
                    throw new Error(`Failed to fetch clan data: ${clanResponse.status} ${clanResponse.statusText}`);
                }
                const clanData = await clanResponse.json();
                populateWarLeague(clanData.warLeague);
            } catch (error) {
                console.error("Error fetching clan info:", error);
                showError("Unable to load war league.");
            }
        } catch (error) {
            console.error("Error in updateWarStats:", error);
            showError("Unable to load war stats.");
        }
    }

    function populateCurrentMatchup(data) {
        document.getElementById("your-clan-name").textContent = data.clan.name;
        document.getElementById("your-clan-level").textContent = data.clan.clanLevel;
        document.getElementById("your-clan-score").textContent = data.clan.stars;
        document.getElementById("your-clan-destruction").textContent = data.clan.destructionPercentage.toFixed(1);
        document.getElementById("your-clan-badge").src = data.clan.badgeUrls.medium;

        document.getElementById("opponent-clan-name").textContent = data.opponent.name;
        document.getElementById("opponent-clan-level").textContent = data.opponent.clanLevel;
        document.getElementById("opponent-clan-score").textContent = data.opponent.stars;
        document.getElementById("opponent-clan-destruction").textContent = data.opponent.destructionPercentage.toFixed(1);
        document.getElementById("opponent-clan-badge").src = data.opponent.badgeUrls.medium;
    }

    function populateParticipantsTable(tableId, members) {
        const tableBody = document.querySelector(`#${tableId} tbody`);

        if (!tableBody) {
            console.error(`Table with ID "${tableId}" not found.`);
            return;
        }

        const sortedMembers = members.sort((a, b) => a.mapPosition - b.mapPosition);
        tableBody.innerHTML = sortedMembers
            .map(
                member => `
            <tr>
                <td>${member.mapPosition}</td>
                <td>${member.name}</td>
                <td>TH ${member.townhallLevel}</td>
            </tr>`
            )
            .join("");
    }

    function populateLast5Wars(pastWars) {
        const lastWarsElement = document.getElementById("last-5-wars");
        lastWarsElement.innerHTML = pastWars
            .map(
                war => `
            <li>
                <strong>${war.result}</strong> - ${war.stars} Stars (${war.destructionPercentage.toFixed(1)}% Destruction)
            </li>`
            )
            .join("");
    }

    function populateWarLeague(warLeague) {
        const leagueName = warLeague?.name || "No War League";
        document.getElementById("war-league-name").textContent = leagueName;
    }

    function showError(message) {
        const errorElement = document.createElement("p");
        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.style.textAlign = "center";

        const mainContainer = document.querySelector("body");
        mainContainer.appendChild(errorElement);
    }
});

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

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".navbar-toggle");
    const menu = document.querySelector(".navbar-menu");

    toggle.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
});
