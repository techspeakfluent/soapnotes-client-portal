# Client portal — endpoints needed

What the client portal calls, for the backend team. Every response uses the
standard `ApiResponse<T>` envelope (`data`, `success`, `message`, `metadata`,
`status`, `status_code`, `timestamp`); list endpoints fill `metadata` with the
usual paging fields (`page`, `limit`, `total_count`, `total_pages`,
`current_page`, `hasNextPage`, `hasPrevPage`, …).

All endpoints act for **the signed-in client** — identified by the bearer
token, never by a `client_id` in the request — and are scoped to the one
practice that client signed in to.

Types referenced below live in `src/shared/interface/portal.ts`. Where
soapnotes already has the entity they are `Pick`s of the soapnotes interface,
so field names and meanings are unchanged. Shapes marked **proposed** have no
soapnotes counterpart yet.

The frontend currently serves each of these from mocks in the matching
`features/*/api/service.ts`.

---

## Account

### `GET /client-portal/me`

The signed-in client and their practice. Fetched once per session.

Returns `IPortalClient`:

| Field                                                                  | Notes                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `id`, `first_name`, `middle_name`, `last_name`, `display_name`         | as on `IClient`                                                    |
| `email`, `phone`, `address`, `city`, `state`, `country`, `postal_code` | as on `IClient`                                                    |
| `organization_id`                                                      |                                                                    |
| `client_emails`                                                        | `IClientEmail[]`; one has `is_primary_email: true`                 |
| `organization`                                                         | `{ id, name, slug, logo_url, currency_code }` from `IOrganization` |

A `401` from any endpoint signs the client out (the portal clears its token
and sends them to sign-in).

---

## Dashboard

### `GET /client-portal/dashboard` — proposed

One call for the dashboard's summary, computed on the server.

Returns `IClientDashboard`:

```ts
{
  next_booking: IPortalBooking | null; // soonest upcoming, not cancelled
  metrics: {
    upcoming_sessions: number; // future, not cancelled
    attended_sessions: number; // past, not cancelled
    package_sessions_remaining: number; // sum over ACTIVE packages of total - redeemed
    outstanding: Array<{
      // one per currency owed; [] when nothing due
      currency_code: string;
      amount_due: number;
      invoice_count: number;
      invoice_ids: string[]; // lets "Pay now" open a single invoice directly
    }>; // practice's currency first
  }
  action_items: Array<{
    // overdue first, then soonest due
    id: string;
    type: "invoice_overdue" | "invoice_unpaid" | "form_pending";
    title: string; // e.g. "Invoice 202609-0041", or the form's name
    due_date: string | null;
    invoice_id?: string;
    amount_due?: number;
    currency_code?: string;
    form_url?: string; // public link to fill the form in
  }>;
}
```

Rules the portal assumes:

- An invoice is **open** when `amount_due > 0` and status is not `PAID`,
  `REFUNDED`, `VOID` or `PARTIALLY_REFUNDED`.
- An open invoice is **overdue** when its `due_date` is before today. OVERDUE
  is not a stored status (same as soapnotes); it's derived.
- A booking is **upcoming** when it starts in the future and isn't
  cancelled. Stored booking statuses are `scheduled`, `rescheduled`,
  `cancelled`, as in soapnotes; "completed" is derived from time.

### `GET /client-portal/activity`

Shown on the Profile page. The client's own activity timeline, newest first. Same row shape as soapnotes'
`GET /activities` (`IClientActivity`), limited to types a client should see.

Query: `page`, `limit`.

Types the portal renders, and the `details` keys it reads (the same keys
soapnotes' activity cards read):

| `activity_type`                                                               | `details`                                                      |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `invoice_sent`, `invoice_created`                                             | `invoice_id`, `invoice_number`, `total_price`, `currency_code` |
| `transaction_created`                                                         | `amount`, `currency_code`, `payment_method`, `invoice_number`  |
| `package_refunded`                                                            | `amount`, `currency_code`, `invoice_number`                    |
| `booking_created`, `event_booked`, `booking_rescheduled`, `booking_cancelled` | `event`, `appointment`, `status`                               |
| `form_submitted`                                                              | `form_name` (or `title`)                                       |
| `package_created`                                                             | `package_name`                                                 |

Anything else is shown with a generic label, so new types won't break it —
but internal ones (notes, merges, follow-ups, emails between staff) must not
be returned.

---

## Shared shapes

### `IPortalBooking`

`Pick<IBooking, "id" | "appointment" | "start_time" | "end_time" | "time_zone"
| "status" | "conference_provider" | "meet_link" | "reason_for_cancelling" |
"invoice_id">` plus:

- `service: { id, name, duration_minutes }`
- `slp: { id, first_name, last_name, avatar_url }` — the provider
- `location: string | null` — **proposed**; the address for in-person
  sessions, null when virtual

### `IPortalInvoice`

`Pick<IInvoice, "id" | "invoice_number" | "invoice_date" | "due_date" |
"status" | "currency_code" | "total_price" | "amount_due" | "amount_paid" |
"discount" | "tax_value" | "memo">` plus `items: Array<Pick<IInvoiceItem, "id" |
"product_name" | "description" | "quantity" | "price" | "tax_value">>`.

### `IPortalPackage`

`Pick<IPurchasedPackage, "id" | "package_name" | "status" | "total_sessions" |
"redeemed_sessions">`.

---

## Invoices

### `GET /client-portal/invoices`

Query: `page`, `limit`, `search` (invoice number or item name), `status`,
`sort_by` (`invoice_date` | `due_date` | `total_price` | `amount_due`),
`sort_order` (`ASC` | `DESC`, default `invoice_date DESC`).

`status` takes soapnotes' filter values, one at a time: `UNPAID` (any
amount due), `OVERDUE`, `PARTIALLY_PAID`, `PAID`, `REFUNDED`.

Returns `IPortalInvoice[]`.

### `GET /client-portal/invoices/:id`

Returns `IPortalInvoiceDetail`: the invoice plus `payments`, one row per
payment or refund applied to it —
`Pick<ITransaction, "id" | "transaction_date" | "transaction_type" |
"payment_method" | "status" | "currency_code"> & { allocated_amount }`.
`allocated_amount` is this invoice's share, negative for a refund. `404` when
the invoice isn't the signed-in client's.

### `POST /client-portal/invoices/:id/pay` — proposed

Body: `{ payment_method_id: string, save_card?: boolean }`. Pays the full
`amount_due` to the practice's connected Stripe account.
`payment_method_id` is a saved card, or one Stripe created in the browser —
card numbers never reach this API. Returns the updated
`IPortalInvoiceDetail`. `422` with a readable `message` when the invoice is
already paid or the card is declined.

The receipt PDF is built in the browser from the detail endpoint, so no PDF
endpoint is needed.

---

## Bookings

### `GET /client-portal/bookings`

Query: `page`, `limit`. Latest appointment first.

Returns `IPortalBooking[]`. The page shows the same columns as the old
portal: `created_dt` (booking date), `appointment`, `event`, `email`,
`assigned_to`, `status`. Status reads "Cancelled" for `cancelled`, otherwise
"Created".

---

## Payments

### `GET /client-portal/payment-methods`

Returns `IPortalPaymentMethod[]` — Stripe's PaymentMethod trimmed to
`{ id, card: { brand, display_brand, last4, exp_month, exp_year } }`, plus
`is_default` (**proposed**). Default first.

### `POST /client-portal/payment-methods/setup-intent` — proposed

Returns `{ client_secret }` (soapnotes' `ICardSetupIntent`) for Stripe
Elements to save a card.

### `POST /client-portal/payment-methods` — proposed

Body: `{ payment_method_id }`, after the SetupIntent succeeds. The first card
saved becomes the default. Returns the saved `IPortalPaymentMethod`.

### `DELETE /client-portal/payment-methods/:id` — proposed

If it was the default, the server makes another card the default.

### `PUT /client-portal/payment-methods/:id/default` — proposed

### `GET /client-portal/transactions`

Query: `page`, `limit`. Newest first.

Returns `IPortalTransaction[]`:
`Pick<ITransaction, "id" | "amount" | "currency_code" | "transaction_date" |
"transaction_type" | "payment_method" | "status">` plus
`invoice: { id, invoice_number } | null` and `card: { brand, last4 } | null`
(**proposed**; the card charged, when paid by card).

---

## Profile

### `PATCH /client-portal/me`

Body: any of `first_name`, `middle_name`, `last_name`, `display_name`,
`phone`, `dob`, `address`, `city`, `state`, `postal_code`, `country` (the
fields the old portal let clients edit). Returns the updated `IPortalClient`.
Should log a `profile_updated` activity.

### `POST /client-portal/me/emails`

Body: `{ email }`. `422` if it's already on the account. Returns the updated
`IPortalClient`.

### `DELETE /client-portal/me/emails/:id`

`422` for the primary email. Returns the updated `IPortalClient`.

### `PUT /client-portal/me/emails/:id/primary`

Returns the updated `IPortalClient`.

### `GET` / `PUT /client-portal/me/notification-preferences` — proposed

```ts
{
  session_reminders: boolean;
  invoice_emails: boolean;
  payment_receipts: boolean;
  marketing_emails: boolean; // could map to IClient.email_marketing_consent
}
```

`PUT` takes any subset and returns the full object.

The activity feed (`GET /client-portal/activity`, above) is shown on the
Profile page, and should include `profile_updated`.
