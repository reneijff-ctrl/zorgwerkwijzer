// ── Admin Summary Types ───────────────────────────────────────────────────────

export interface AdminEmployerSummary {
  id: number;
  name: string;
  slug: string;
  subscriptionStatus: string | null;
  createdAt: string;
}

export interface AdminVacancySummary {
  id: number;
  title: string;
  slug: string;
  employerName: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
}

// ── Admin Stats ───────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalVacancies: number;
  activeVacancies: number;
  featuredVacancies: number;
  totalApplications: number;
  activeSubscriptions: number;
  trialingCount: number;
  pastDueCount: number;
  canceledLast30DaysCount: number;
  subscriptionsByPackage: Record<string, number>;
  mrr: number; // in centen
  arr: number; // in centen
  mrrByPackage: Record<string, number>; // pakket naam → maandelijkse bijdrage in centen
  subscriptionRevenue: number; // in centen
  creditRevenue: number; // in centen
  lifetimeRevenue: number; // in centen
  revenueThisMonth: number; // in centen
  revenuePrevMonth: number; // in centen
  avgRevenuePerEmployer: number; // in centen
  cancelAtPeriodEndCount: number;
  totalCreditsSold: number;
  creditsByBundle: Record<string, number>;
  creditRevenueByBundle: Record<string, number>;
  newUsersLast30Days: number;
  newEmployersLast30Days: number;
  recentEmployers: AdminEmployerSummary[];
  recentVacancies: AdminVacancySummary[];
  pastDueSubscriptions: AdminSubscription[];
  recentCancellations: AdminSubscription[];
}

// ── Admin User ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  email: string;
  role: 'ROLE_USER' | 'ROLE_EMPLOYER' | 'ROLE_ADMIN';
  employerId: number | null;
  employerName: string | null;
  createdAt: string;
  isLastEmployerUser: boolean;
}

// ── Admin Employer ────────────────────────────────────────────────────────────

export interface AdminEmployer {
  id: number;
  name: string;
  email: string;
  slug: string;
  city: string | null;
  subscriptionStatus: string | null;
  packageName: string | null;
  activeVacancyCount: number;
  createdAt: string;
}

export interface AdminEmployerDetail extends AdminEmployer {
  phoneNumber: string | null;
  address: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  employeeCount: string | null;
  foundedYear: number | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  billingInterval: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  vacancies: AdminVacancySummary[];
  linkedUsers: AdminUser[];
}

// ── Admin Vacancy ─────────────────────────────────────────────────────────────

export interface AdminVacancy {
  id: number;
  title: string;
  slug: string;
  employerId: number | null;
  employerName: string;
  isActive: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
  applicationCount: number;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface AdminVacancyDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  requirements: string | null;
  // werkgever
  employerId: number | null;
  employerName: string;
  employerSlug: string | null;
  employerEmail: string | null;
  // locatie & classificatie
  cityId: number | null;
  occupationId: number | null;
  employmentType: string | null;
  educationLevel: string | null;
  // salaris & uren
  salaryMin: number | null;
  salaryMax: number | null;
  hoursMin: number | null;
  hoursMax: number | null;
  // status
  isActive: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
  // seo
  seoTitle: string | null;
  seoDescription: string | null;
  // statistieken
  applicationCount: number;
  // tijdstempels
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Admin Subscription ────────────────────────────────────────────────────────

export interface AdminAuditLog {
  id: number
  adminUserId: number
  adminEmail: string
  action: string
  entityType: string
  entityId: number | null
  entityName: string | null
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

export interface AdminSubscription {
  id: number;
  employerId: number;
  employerName: string;
  employerEmail: string;
  packageName: string | null;
  packageDisplayName: string | null;
  priceMonthly: number | null; // in centen
  priceYearly: number | null;  // in centen
  status: string;
  billingInterval: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  trialEnd: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  cancelAtPeriodEnd: boolean;
  lifetimeRevenue: number; // in centen
}
