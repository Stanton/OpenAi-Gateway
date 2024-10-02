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

// Route to create a new thread
app.post('/api/openai/v1/threads', async (req, res) => {
    try {
        console.log('payload', req.body);
        const openaiResponse = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/threads',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'  // Required for Assistants API
            }
        });

        res.json(openaiResponse.data);
    } catch (error) {
        console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : error.message
        });
    }
});

// Route to send a message to a thread
app.post('/api/openai/v1/threads/:threadId/messages', async (req, res) => {
    try {
        const { threadId } = req.params;
        const openaiResponse = await axios({
            method: 'post',
            url: `https://api.openai.com/v1/threads/${threadId}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            },
            data: req.body  // Forward the body directly to OpenAI API
        });

        res.json(openaiResponse.data);
    } catch (error) {
        console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : error.message
        });
    }
});

// Route to run the assistant on a thread
app.post('/api/openai/v1/threads/:threadId/runs', async (req, res) => {
    try {
        const { threadId } = req.params;
        const openaiResponse = await axios({
            method: 'post',
            url: `https://api.openai.com/v1/threads/${threadId}/runs`,
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            },
            data: req.body  // Forward the body directly to OpenAI API
        });

        res.json(openaiResponse.data);
    } catch (error) {
        console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : error.message
        });
    }
});

// Route to get the status of an assistant run
app.get('/api/openai/v1/threads/:threadId/runs/:runId', async (req, res) => {
    try {
        const { threadId, runId } = req.params;
        const openaiResponse = await axios({
            method: 'get',
            url: `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        res.json(openaiResponse.data);
    } catch (error) {
        console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : error.message
        });
    }
});

// Route to get messages from a specific thread
app.get('/api/openai/v1/threads/:threadId/messages', async (req, res) => {
    try {
        const { threadId } = req.params;
        const openaiResponse = await axios({
            method: 'get',
            url: `https://api.openai.com/v1/threads/${threadId}/messages`,
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'  // Include the header for Assistants API v2
            }
        });

        res.json(openaiResponse.data);
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

// Export the app for testing purposes
module.exports = app;

// Start the server only if not in a test environment
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
