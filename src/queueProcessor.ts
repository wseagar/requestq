import { requestQueue, RequestData } from "./requestQueue";
import axios from "axios";

export class QueueProcessor {
  private processing: { [url: string]: boolean } = {};

  public async process(url: string): Promise<void> {
    if (this.processing[url]) return;

    this.processing[url] = true;

    while (!requestQueue.isEmpty(url)) {
      const requestData = requestQueue.dequeue(url) as RequestData;

      try {
        await this.makeRequestWithRetry(requestData);
        console.log(
          `Request processed: ${requestData.method} ${requestData.url}`
        );
      } catch (error) {
        console.error(
          `Request failed: ${requestData.method} ${requestData.url}`,
          error
        );
      }
    }

    this.processing[url] = false;
  }

  private async makeRequestWithRetry(
    requestData: RequestData,
    maxRetries: number = 3,
    delayMs: number = 3000
  ): Promise<void> {
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
      try {
        await axios({
          url: requestData.url,
          method: requestData.method,
          data: requestData.body,
          headers: requestData.headers,
        });
        return;
      } catch (error) {
        if (retryCount === maxRetries - 1) {
          throw error;
        }

        console.log(
          `Retrying request in ${delayMs} ms (${
            retryCount + 1
          }/${maxRetries}): ${requestData.method} ${requestData.url}`
        );
        await this.sleep(delayMs);

        // Increase the delay for the next retry, using exponential backoff
        delayMs *= 2;
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
