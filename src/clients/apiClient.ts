import type { APIRequestContext, APIResponse } from '@playwright/test';

export default class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  get(path: string): Promise<APIResponse> {
    return this.request.get(path);
  }

  post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(path, { data });
  }

  delete(path: string): Promise<APIResponse> {
    return this.request.delete(path);
  }

  // TODO: Add other HTTP methods (PUT, PATCH, etc.) as needed
}
