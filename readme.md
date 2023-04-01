# requestq

requestq is a simple Node.js Express server that acts as a proxy and queues incoming HTTP requests before forwarding them to their respective destinations. It helps to manage the request rate, allowing you to control the number of requests being sent to the target server. This is useful when interacting with APIs that have strict rate limits or when you want to control the load on a server.

## Features

- Queues HTTP requests
- Prevents duplicate requests
- Retries failed requests with exponential backoff
- Filters out unwanted headers

## Installation

1. Clone the repository:

git clone https://github.com/wseagar/requestq.git

2. Install dependencies:

cd requestq
npm install

3. Run the server:

npm start

The server will start on port 3888 by default. You can change the port by setting the `PORT` environment variable.

## Usage

To send requests through requestq, simply send the request to the requestq server with the desired target URL as the path. The server will queue the request, process it, and return a 202 status with a JSON response indicating that the request has been queued.

For example, if your requestq server is running at `http://localhost:3888`, to send a request to `https://example.com/api/data`, you would send the request to `http://localhost:3888/example.com/api/data`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
