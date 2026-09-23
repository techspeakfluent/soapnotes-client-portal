export const customQueryKey = {
  client: {
    me: "client-me",
    preferences: "client-notification-preferences",
    activity: "client-activity",
  },
  dashboard: {
    summary: "dashboard-summary",
  },
  invoices: {
    list: "invoices-list",
    detail: "invoices-detail",
  },
  bookings: {
    list: "bookings-list",
  },
  payments: {
    methods: "payment-methods",
    history: "payment-history",
  },
} as const;
