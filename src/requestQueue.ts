export type RequestData = {
  url: string;
  method: string;
  body: any;
  headers: { [header: string]: string };
};

class RequestQueue {
  private queues: { [url: string]: RequestData[] } = {};

  public enqueue(request: RequestData): void {
    const { url } = request;
    if (!this.queues[url]) {
      this.queues[url] = [];
    }
    // Check if the request already exists in the queue
    const isDuplicate = this.queues[url].some((existingRequest) => {
      return (
        existingRequest.url === request.url &&
        existingRequest.method === request.method &&
        JSON.stringify(existingRequest.body) === JSON.stringify(request.body) &&
        JSON.stringify(existingRequest.headers) ===
          JSON.stringify(request.headers)
      );
    });

    // Enqueue the request only if it's not a duplicate
    if (!isDuplicate) {
      this.queues[url].push(request);
    }
  }

  public dequeue(url: string): RequestData | undefined {
    const queue = this.queues[url];
    if (queue && queue.length > 0) {
      return queue.shift();
    }
    return undefined;
  }

  public isEmpty(url: string): boolean {
    const queue = this.queues[url];
    return !queue || queue.length === 0;
  }

  public getAllUrls(): string[] {
    return Object.keys(this.queues);
  }
}

export const requestQueue = new RequestQueue();
