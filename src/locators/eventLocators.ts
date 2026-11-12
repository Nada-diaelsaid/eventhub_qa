export const EventLocators = {
  // event card will help us distinguish between different events since all "Book Now" buttons have the same id and data-testid.
  eventCard: '[data-testid="event-card"]',
  bookNowButton: [
    'a[data-testid="book-now-btn"]',
    'a[href^="/events/"]',
    'a:has-text("Book Now")',
  ],
}