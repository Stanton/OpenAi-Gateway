const request = require('supertest');
const app = require('./server');

let threadId;

// Testing the root route
describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to the OpenAI Reverse Proxy!');
    });
});

describe('POST /api/openai/v1/chat/completions', () => {
    it('should return a valid response for a chat completion request', async () => {
        const response = await request(app)
            .post('/api/openai/v1/chat/completions')
            .send({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: "Say hello to the world." }
                ],
                max_tokens: 10
            })
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toEqual(200);  // Ensure the status is 200 OK
        expect(response.body).toHaveProperty('choices');  // Check that the response contains the 'choices' field
        expect(response.body.choices[0]).toHaveProperty('message');  // Check that the first choice contains a 'message' field
        expect(response.body.choices[0].message.content).toContain("Hello");  // Validate the response message contains "Hello"
    });
});

// Testing the /api/openai/v1/threads route
describe('POST /api/openai/v1/threads', () => {
    it('should create a new thread and return a thread ID', async () => {
        const response = await request(app)
            .post('/api/openai/v1/threads')
            .set('Content-Type', 'application/json');  // Set the content-type header

        expect(response.statusCode).toEqual(200);  // Check that the status is OK
        expect(response.body).toHaveProperty('id');  // The response should contain the thread ID

        threadId = response.body.id;
    });
});

// Testing the /api/openai/v1/threads/:threadId/messages route
describe('POST /api/openai/v1/threads/:threadId/messages', () => {
    it('should send a message to the thread', async () => {
        const res = await request(app)
            .post(`/api/openai/v1/threads/${threadId}/messages`)
            .send({
                role: 'user',
                content: 'Hello, OpenAI!'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');  // Assuming the response contains a message ID
        console.log(res.body);
    });
});

// Testing the /api/openai/v1/threads/:threadId/runs route
describe('POST /api/openai/v1/threads/:threadId/runs', () => {
    it('should run the assistant on the thread', async () => {
        const res = await request(app)
            .post(`/api/openai/v1/threads/${threadId}/runs`)
            .send({
                assistant_id: 'asst_Xz9ovniKxLLaHf3ocmwB8ELR'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status');
    });
});
