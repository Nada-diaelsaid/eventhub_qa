import type { APIResponse } from '@playwright/test';
import type { BookingPayload } from '../payloads/bookingPayload';
import ApiClient from '../clients/apiClient';

export default class BookingService {
  constructor(private readonly apiClient: ApiClient) {}

  createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.apiClient.post('/api/bookings', payload);
  }

  getBooking(bookingId: string | number): Promise<APIResponse> {
    return this.apiClient.get(
      `/api/bookings/${encodeURIComponent(String(bookingId))}`,
    );
  }

  deleteBooking(bookingId: string | number): Promise<APIResponse> {
    return this.apiClient.delete(
      `/api/bookings/${encodeURIComponent(String(bookingId))}`,
    );
  }
}
