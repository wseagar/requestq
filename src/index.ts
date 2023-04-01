import express from "express";
import { requestQueue, RequestData } from "./requestQueue";
import { QueueProcessor } from "./queueProcessor";
import { IncomingHttpHeaders } from "http";

const app = express();
const port = process.env.PORT || 3888;
const queueProcessor = new QueueProcessor();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function preprocessHeaders(headers: IncomingHttpHeaders): {
  [header: string]: string;
} {
  const excludedHeaders = [
    "host",
    "accept-encoding",
    "content-length",
    "connection",
    "transfer-encoding",
    "te",
    "trailer",
    "upgrade",
    "proxy-authorization",
    "proxy-authenticate",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
  ];

  const filteredHeaders: { [header: string]: string } = {};

  for (const key in headers) {
    if (!excludedHeaders.includes(key.toLowerCase())) {
      filteredHeaders[key] = headers[key] as string;
    }
  }

  return filteredHeaders;
}

app.all("*", (req, res) => {
  const originalUrl = req.originalUrl.substr(1);
  console.log(`Received request: ${req.method} ${originalUrl}`);
  // This is to suit my needs but localhost should be http rather than https

  const isLocalhost = originalUrl.startsWith("localhost");

  const targetUrl = isLocalhost
    ? `http://${originalUrl}`
    : `https://${originalUrl}`;

  const requestData: RequestData = {
    url: targetUrl,
    method: req.method,
    body: req.body,
    headers: preprocessHeaders(req.headers),
  };

  requestQueue.enqueue(requestData);
  res.status(202).json({ message: "Request queued" });

  // Process the queue for the target URL
  queueProcessor.process(targetUrl).catch((error) => {
    console.error("Error processing the queue:", error);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
