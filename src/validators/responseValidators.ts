import { expect, type APIResponse } from '@playwright/test';

export async function expectSuccessfulJsonResponse(
  response: APIResponse,
): Promise<unknown> {
  const responseText = await response.text();
  const contentType = response.headers()['content-type'] ?? '';

  expect(
    response.ok(),
    `Request returned ${response.status()}: ${responseText.slice(0, 300)}`,
  ).toBeTruthy();

  return parseJsonResponse(responseText, contentType);
}

export async function expectClientErrorJsonResponse(
  response: APIResponse,
): Promise<unknown> {
  const responseText = await response.text();
  const contentType = response.headers()['content-type'] ?? '';
  const status = response.status();

  expect(status, `Expected a client error, received ${status}`).toBeGreaterThanOrEqual(400);
  expect(status, `Expected a client error, received ${status}`).toBeLessThan(500);
  expect([401, 403], 'Authentication must succeed before validating the event ID')
    .not.toContain(status);

  return parseJsonResponse(responseText, contentType);
}

function parseJsonResponse(responseText: string, contentType: string): unknown {
  expect(
    contentType.toLowerCase(),
    `Expected JSON but received "${contentType}"`,
  ).toContain('application/json');

  return JSON.parse(responseText) as unknown;
}
