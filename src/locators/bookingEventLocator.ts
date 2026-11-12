export const BookingEventLocators = {
  bookingPanel: [
    'div:has(> div > h2:text-is("Book Tickets"))',
    'div:has(> div > h2:has-text("Book Tickets"))',
  ],

  bookingForm: [
    'form:has(#confirm-booking)',
    'form:has(button[type="submit"]:has-text("Confirm Booking"))',
  ],
  
  bookingHeading: [
    'h2:text-is("Book Tickets")',
    'h2:has-text("Book Tickets")',
  ],
  
  pricePerTicket: [
    'div:has(> h2:text-is("Book Tickets")) > span',
    'h2:text-is("Book Tickets") + span',
  ],
  
  perTicketLabel: [
    'p:text-is("per ticket")',
    'p:has-text("per ticket")',
  ],
  
  ticketControls: [
    'div:has(> label:text-is("Tickets"))',
    'div:has(> label:has-text("Tickets"))',
  ],
  
  decreaseTicketsButton: [
    'button[type="button"]:text-is("−")',
    'button[type="button"]:has-text("−")',
  ],
  
  ticketCount: [
    '#ticket-count',
    '.ticket-count',
  ],
  
  increaseTicketsButton: [
    'button[type="button"]:text-is("+")',
    'button[type="button"]:has-text("+")',
  ],
  
  fullNameInput: [
    '#customerName',
    'input[name="customerName"]',
    'input[placeholder="Your full name"]',
  ],
  
  emailInput: [
    '[data-testid="customer-email"]',
    '#customer-email',
    'input[name="customerEmail"]',
    'input[type="email"]',
  ],
  
  phoneInput: [
    '#phone',
    'input[name="phone"]',
    'input[type="tel"]',
  ],
  
  totalAmount: [
    'form div:has(> span:text-is("Total")) > span:last-child',
    'form div:has(> span:has-text("Total")) > span:last-child',
  ],
  
  confirmBookingButton: [
    '#confirm-booking',
    'button.confirm-booking-btn',
    'button[type="submit"]:has-text("Confirm Booking")',
  ],
};