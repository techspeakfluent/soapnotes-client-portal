export interface ISubscriptionCard {
  id: string;
  object: string;
  allow_redisplay: string;
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string;
    name: string;
    phone: string | null;
    tax_id: string | null;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string;
    };
    country: string;
    display_brand: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: string | null;
    last4: string;
    networks: {
      available: Array<string>;
      preferred: string | null;
    };
    regulated_status: string;
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: {
      dynamic_last4: string | null;
      link: any;
      type: string;
    };
  };
  created: number;
  customer: string;
  customer_account: any;
  livemode: boolean;
  metadata: any;
  shared_payment_granted_token: string | null;
  type: string;
}

export interface ICardSetupIntent {
  client_secret: string;
}

// Subscription invoice record returned by GET /subscriptions/invoices.
export interface ISubscriptionInvoice {
  id: string;
  amount: number;
  currency: string;
  invoice_date: string;
  status: string;
  reference_number: string | null;
  organization_id: string;
  subscription_id: string;
  created_at: string;
  updated_at: string;
}
export interface ISubscription {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  current_period_start: string;
  current_period_end: string;
  organization_id: string;
  plan_id: string;
  plan_price_id: string;
  stripe_subscription_id?: string | null;
  provider_subscription_id?: string | null;
  provider_customer_id?: string | null;
  billing_cycle: string;
  coupon_id?: string | null;
  payment_mode?: string | null;
  payment_provider: string;
  cancel_at_period_end: false;
  cancelled_at?: string | null;
  downgrade_at_period_end: false;
  downgrade_plan_price_id?: string | null;
  created_at: string;
  updated_at: string;
  plan: IPlan;
  plan_price: IPlanPrice;
}

export interface IPlan {
  id: string;
  name: string;
  description: string;
  status: string;
  interval?: string | null;
  currency_code?: string | null;
  features: Array<string>;
  entitlements: Array<{
    limit: number;
    enabled: boolean;
    feature: string;
  }>;
  object: any;
  stripe_product_id: string;
  created_at: string;
  updated_at: string;
}

export interface IPlanPrice {
  id: string;
  name: string;
  amount: number;
  interval: string;
  type: string;
  currency: string;
  status: string;
  plan_id: string;
  object: any;
  stripe_price_id: string;
  created_at: string;
  updated_at: string;
}
