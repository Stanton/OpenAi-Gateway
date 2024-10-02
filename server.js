const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Enable CORS if needed
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Proxy route for OpenAI API (Chat Completion)
app.post('/api/openai/v1/chat/completions', async (req, res) => {
    try {
        const openaiResponse = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Use the API key from the environment variable
                'Content-Type': 'application/json'
            },
            data: {
                model: req.body.model || "gpt-4o-mini",  // Use the model passed in the request, default to gpt-4o-mini
                messages: req.body.messages,  // Forward the messages array from the client
                max_tokens: req.body.max_tokens || 10  // Forward max_tokens or set a default
            }
        });

        res.json(openaiResponse.data);  // Send OpenAI's response back to the client
    } catch (error) {
        console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : error.message
        });
    }
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the OpenAI Reverse Proxy!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
