# OpenAI Gateway

This project is a **reverse proxy** built with **Express.js** to securely forward requests to the OpenAI API. It enables interaction with OpenAI models, such as `gpt-4o-mini`, while securely handling your API keys using environment variables.

## Features

- **Secure API Key Handling**: The OpenAI API key is stored securely in an environment variable, keeping it hidden from the client-side.
- **Request Forwarding**: It forwards requests from clients to OpenAI's `/v1/chat/completions` endpoint.
- **CORS Support**: CORS is enabled to allow communication between different origins.
- **Error Handling**: Detailed error messages are logged for debugging, and proper HTTP response codes are returned to the client.

## Prerequisites

- **Node.js** (version 14.x or later)
- **npm** (or **yarn**)
- **Docker** (optional, if you want to run it in a container)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/openai-reverse-proxy.git
cd openai-reverse-proxy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root and add your OpenAI API key:

```bash
touch .env
```

Then, add the following content to the `.env` file:

```
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. Run the Server

Start the server locally:

```bash
npm start
```

By default, the server runs on `http://localhost:3000`.

## Usage

### API Route: `/api/openai/v1/chat/completions`

This route forwards requests to OpenAI's `chat/completions` API.

#### Example Request

You can send a request to the reverse proxy like this:

```bash
curl -X POST http://localhost:3000/api/openai/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Say hello to the world."}],
        "max_tokens": 10
    }'
```

#### Example Response

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1634766363,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello, world!"
      },
      "finish_reason": "stop"
    }
  ]
}
```

### Root Route

You can also test the basic root route by accessing:

```
http://localhost:3000/
```

You should receive:

```
Welcome to the OpenAI Reverse Proxy!
```

## Running with Docker

If you prefer to run the reverse proxy in a Docker container:

### 1. Build the Docker Image

```bash
docker build -t openai-reverse-proxy .
```

### 2. Run the Docker Container

```bash
docker run -d -p 3000:3000 --env-file .env openai-reverse-proxy
```

This will run the proxy on `http://localhost:3000`.

## Error Handling

If there's an error in communicating with the OpenAI API, the proxy will return a `500 Internal Server Error` with details in the response body.

### Example Error Response:

```json
{
  "error": {
    "message": "You must provide a model parameter.",
    "type": "invalid_request_error",
    "code": null
  }
}
```

## Contributing

Feel free to open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
