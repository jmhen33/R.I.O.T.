require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = "https://api.clashofclans.com/v1";
const API_TOKEN = process.env.API_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to fetch data from Clash of Clans API
async function fetchClashAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        if (!response.ok) throw new Error(`Clash API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from Clash API: ${error}`);
        throw error;
    }
}

// Routes
app.get('/api/clan', async (req, res) => {
    try {
        const data = await fetchClashAPI(`/clans/%23VQ08UR9R`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clan details' });
    }
});

app.get('/api/pastwars', async (req, res) => {
    try {
        // Example: Replace this with real data or a database query if available
        const pastWars = [
            { result: "Win", stars: 35, destructionPercentage: 85.6 },
            { result: "Loss", stars: 28, destructionPercentage: 78.4 },
            { result: "Win", stars: 40, destructionPercentage: 90.1 },
            { result: "Win", stars: 33, destructionPercentage: 83.3 },
            { result: "Loss", stars: 25, destructionPercentage: 70.2 },
        ];
        res.json(pastWars);
    } catch (error) {
        console.error('Error fetching past wars:', error);
        res.status(500).json({ error: 'Failed to fetch past wars' });
    }
});

app.get('/api/members', async (req, res) => {
    try {
        const data = await fetchClashAPI(`/clans/%23VQ08UR9R/members`);
        res.json(data.items); // Assuming 'items' contains the member list
    } catch (error) {
        console.error('Error fetching clan members:', error);
        res.status(500).json({ error: 'Failed to fetch clan members' });
    }
});

app.get('/api/war', async (req, res) => {
    try {
        const data = await fetchClashAPI(`/clans/%23VQ08UR9R/currentwar`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch war stats' });
    }
});

// Fallback for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
