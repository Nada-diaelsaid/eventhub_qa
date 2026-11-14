export interface BookingPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  eventId: number;
}

export function createBookingPayload(
  eventId: number,
  overrides: Partial<Omit<BookingPayload, 'eventId'>> = {},
): BookingPayload {
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error('eventId must be a positive integer');
  }

  return {
    customerName: 'API Test Customer',
    customerEmail: 'api.test@example.com',
    customerPhone: '2025550100',
    quantity: 1,
    ...overrides,
    eventId,
  };
}
