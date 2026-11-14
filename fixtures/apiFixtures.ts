import { test as base, expect, request } from '@playwright/test';
import ApiClient from '../src/clients/apiClient';
import BookingService from '../src/services/BookingService';

type ApiFixtures = {
  authToken: string;
  apiClient: ApiClient;
  bookingService: BookingService;
};

export const test = base.extend<ApiFixtures>({
  authToken: async ({}, use) => {
    const token = process.env.EVENTHUB_API_TOKEN;
    if (!token) {
      throw new Error('EVENTHUB_API_TOKEN must be set to run API tests');
    }

    await use(token);
  },
  apiClient: async ({ authToken }, use) => {
    const apiUrl = process.env.API_URL;
    console.log('API_URL:', apiUrl);
    if (!apiUrl) {
      throw new Error('API_URL must be set to run API tests');
    }

    const apiContext = await request.newContext({
      baseURL: apiUrl,
      extraHTTPHeaders: {
        authorization: `Bearer ${authToken}`,
        accept: 'application/json',
      },
    });

    try {
      await use(new ApiClient(apiContext));
    } finally {
      await apiContext.dispose();
    }
  },
  bookingService: async ({ apiClient }, use) => {
    await use(new BookingService(apiClient));
  },
});

export { expect };
