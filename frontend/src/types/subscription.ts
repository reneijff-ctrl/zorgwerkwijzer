export interface SubscriptionPackage {
  id: number;
  name: 'STARTER' | 'PROFESSIONAL' | 'PREMIUM';
  displayName: string;
  priceMonthly: number;       // in centen
  priceYearly: number;        // in centen
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  maxActiveVacancies: number | null; // null = onbeperkt
  canViewCv: boolean;
  canSeeApplicantContact: boolean;
  isFeaturedIncluded: boolean;
}

export interface EmployerSubscription {
  id: number;
  packageName: string;
  packageDisplayName: string;
  status: 'INACTIVE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
  billingInterval: 'MONTHLY' | 'YEARLY';
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  periodEndDate: string | null;
}

export interface CheckoutRequest {
  packageId: number;
  billingInterval: 'MONTHLY' | 'YEARLY';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface PortalRequest {
  returnUrl: string;
}
export interface PortalResponse {
  portalUrl: string;
}
export interface ChangeSubscriptionRequest {
  packageId: number;
  billingInterval: 'MONTHLY' | 'YEARLY';
}

// ── Vacancy Credits ────────────────────────────────────────────────────────

export type BundleType = 'single' | 'bundle3' | 'bundle5';

export interface VacancyCreditCheckoutRequest {
  bundleType: BundleType;
}

export interface CreditTransactionDto {
  id: number;
  creditsAdded: number;
  creditsUsed: number;
  reason: string | null;
  bundleType: BundleType | null;
  createdAt: string;
}

export interface VacancyCreditStatusDto {
  availableCredits: number;
  recentTransactions: CreditTransactionDto[];
}

export interface VacancyCreditCheckoutResponse {
  checkoutUrl: string;
}
