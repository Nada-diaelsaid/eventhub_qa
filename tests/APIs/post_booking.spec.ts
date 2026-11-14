import { test, expect } from '@playwright/test';

test('Book an event', async ({ request }) => {
  const token = process.env.EVENTHUB_API_TOKEN;
  if (!token) {
    throw new Error('EVENTHUB_API_TOKEN must be set to run this API test');
  }

  const response = await request.post(
    process.env.API_URL+'/api/bookings',
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      data:
      {
        "customerName":"Nada Dia",
        "customerEmail":"nada_diaelsaid@hotmail.com",
        "customerPhone":"01007760802",
        "quantity":1,
        "eventId":284 // event name: "Hollywood Monsoon Night — Los Angeles"
      }
    },
  );

  const responseText = await response.text();
  const contentType = response.headers()['content-type'] ?? '';
  expect(
    response.ok(),
    `POST /api/bookings returned ${response.status()}: ${responseText.slice(0, 300)}`,
  ).toBeTruthy();
  expect(
    contentType.toLowerCase(),
    `Expected JSON but received "${contentType}": ${responseText.slice(0, 300)}`,
  ).toContain('application/json');

  const responseBody = JSON.parse(responseText);
  console.log('Booking Response:', responseBody);
});

