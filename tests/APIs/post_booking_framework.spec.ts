import { expect, test } from '../../fixtures/apiFixtures';
import { createBookingPayload } from '../../src/payloads/bookingPayload';
import {
  expectClientErrorJsonResponse,
  expectSuccessfulJsonResponse,
} from '../../src/validators/responseValidators';

test('books an event', async ({ bookingService }) => {
  const eventId = Number(process.env.EVENTHUB_TEST_EVENT_ID);
  const response = await bookingService.createBooking(createBookingPayload(eventId));

  await expectSuccessfulJsonResponse(response);
});

test('gets a booking created by the POST API', async ({ bookingService }) => {
  const createResponse = await bookingService.createBooking(
    createBookingPayload(Number(process.env.EVENTHUB_TEST_EVENT_ID)),
  );
  expect(createResponse.ok()).toBeTruthy();

  const bookingId = (await createResponse.json()).data.id;
  console.log('Created booking ID:', bookingId);
  expect(bookingId).toBeTruthy();

  const getResponse = await bookingService.getBooking(bookingId);
  expect(
    getResponse.ok(),
    `GET /api/bookings/${bookingId} returned ${getResponse.status()}`,
  ).toBeTruthy();
  const fetchedBooking = await getResponse.json();
  expect(fetchedBooking.data.id).toBe(bookingId);
});

test(
  'Delete a created booking and verifies it is no longer available',
  async ({ bookingService }) => {
    const createResponse = await bookingService.createBooking(
      createBookingPayload(Number(process.env.EVENTHUB_TEST_EVENT_ID)),
    );
    expect(createResponse.ok()).toBeTruthy();

    const bookingId = (await createResponse.json()).data.id;
    expect(bookingId).toBeTruthy();

    const deleteResponse = await bookingService.deleteBooking(bookingId);
    expect(deleteResponse.ok()).toBeTruthy();
    expect(await deleteResponse.json()).toEqual({
      success: true,
      message: 'Booking cancelled',
    });

    const getResponse = await bookingService.getBooking(bookingId);
    expect(getResponse.status()).toBe(404);
  },
);

test('rejects a booking with an invalid event ID', async ({ bookingService }) => {
  const payload = {
    ...createBookingPayload(1),
    eventId: 0,
  };
  const response = await bookingService.createBooking(payload);

  await expectClientErrorJsonResponse(response);
});
