// Spring Boot API Response Types
// Gebaseerd op VacancyListDto, VacancyDetailDto en EmployerDto

export interface VacancyListItem {
  id: number;
  title: string;
  slug: string;
  employerName: string;
  employerSlug: string;
  employerLogoUrl: string | null;
  cityName: string | null;
  occupationName: string | null;
  employmentType: EmploymentType | null;
  educationLevel: EducationLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  hoursMin: number | null;
  hoursMax: number | null;
  publishedAt: string;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export interface VacancyDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  employerName: string;
  employerSlug: string;
  employerLogoUrl: string | null;
  employerWebsiteUrl: string | null;
  cityName: string | null;
  occupationName: string | null;
  employmentType: EmploymentType | null;
  educationLevel: EducationLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  hoursMin: number | null;
  hoursMax: number | null;
  isActive: boolean;
  publishedAt: string;
  expiresAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export interface EmployerDetail {
  id: number;
  name: string;
  slug: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  coverImageUrl: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  employeeCount: string | null;
  foundedYear: number | null;
  isPremium: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  vacancyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerUpdateRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  coverImageUrl?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  employeeCount?: string;
  foundedYear?: number;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
}

// Spring Boot 3 Page wrapper — pagination metadata zit genest in `page` object
export interface PageMeta {
  size: number;
  number: number;       // huidige pagina (0-indexed)
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  page: PageMeta;
  // Spring Boot 2 / backwards-compat velden (optioneel)
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export type EmploymentType =
  | 'VAST'
  | 'TIJDELIJK'
  | 'ZZP'
  | 'DETACHERING'
  | 'BIJBAAN'
  | 'STAGE';

export type EducationLevel =
  | 'MBO2'
  | 'MBO3'
  | 'MBO4'
  | 'HBO'
  | 'WO'
  | 'GEEN_VEREISTE';

// Leesbare labels voor weergave
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  VAST: 'Vast',
  TIJDELIJK: 'Tijdelijk',
  ZZP: 'ZZP / Freelance',
  DETACHERING: 'Detachering',
  BIJBAAN: 'Bijbaan',
  STAGE: 'Stage',
};

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  MBO2: 'MBO niveau 2',
  MBO3: 'MBO niveau 3',
  MBO4: 'MBO niveau 4',
  HBO: 'HBO',
  WO: 'WO / Universiteit',
  GEEN_VEREISTE: 'Geen vereiste',
};

// ─── Calculator types (Spring Boot salary / ORT / end-of-year endpoints) ────

export interface SalaryCalculationRequest {
  hourlySalary: number;
  weeklyHours: number;
}

export interface SalaryCalculationResponse {
  hourlySalary: number;
  weeklyHours: number;
  // Velden gebruikt door de salaris-calculator pagina
  monthlyGrossSalary: number;
  yearlyGrossSalary: number;
  holidayAllowance: number;
  endOfYearBonus: number;
  // Alternatieve namen die de backend mogelijk retourneert
  grossMonthlySalary?: number;
  grossAnnualSalary?: number;
  totalAnnualCompensation?: number;
}

export interface OrtCalculationRequest {
  hourlyWage: number;
  eveningHours?: number;
  nightHours?: number;
  saturdayHours?: number;
  sundayHours?: number;
  holidayHours?: number;
}

export interface OrtCalculationResponse {
  hourlyWage: number;
  // Veld-namen als gebruikt door de ORT-calculator pagina
  eveningAllowance: number;
  nightAllowance: number;
  saturdayAllowance: number;
  sundayAllowance: number;
  holidayAllowance: number;
  totalOrt: number;
  // Alternatieve namen die de backend mogelijk retourneert
  eveningOrt?: number;
  nightOrt?: number;
  saturdayOrt?: number;
  sundayOrt?: number;
  holidayOrt?: number;
}

export interface EndOfYearCalculationRequest {
  grossMonthlySalary?: number;
  monthlyGrossSalary?: number; // alias gebruikt door eindejaarsuitkering-berekenen/page.tsx
  weeklyHours?: number;
  fulltimeHours?: number;
  monthsWorked?: number;
  averageMonthlyOrt?: number;
  includeOrt?: boolean;
}

export interface EndOfYearCalculationResponse {
  grossMonthlySalary: number;
  monthsWorked: number;
  endOfYearBonus: number;
  holidayAllowance: number;
  totalBenefit: number;
  // Velden die de eindejaarsuitkering-pagina direct gebruikt (required)
  totalBonus: number;
  monthlyAccrual: number;
  percentage: number;
  ortContribution: number;
  calculationBasis: number;
  // Optionele extra velden
  baseBenefit?: number;
  ortComponent?: number;
  totalGrossBenefit?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

// ─── Profiel ───────────────────────────────────────────────────────────────

export interface ProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  cvUrl: string | null;
  currentOccupationId: number | null;
  isSearching: boolean;
  city: string | null;
  postalCode: string | null;
  profession: string | null;
  education: string | null;
  experienceYears: number | null;
  bio: string | null;
  linkedinUrl: string | null;
  availability: string | null;
  desiredHours: number | null;
  createdAt: string;
}

export interface ProfileCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isSearching?: boolean;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  isSearching?: boolean;
  cvUrl?: string | null;
  city?: string | null;
  postalCode?: string | null;
  profession?: string | null;
  education?: string | null;
  experienceYears?: number | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  availability?: string | null;
  desiredHours?: number | null;
}

// ─── Sollicitatie ──────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'INVITED'
  | 'REJECTED'
  | 'HIRED';

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: 'Verstuurd',
  REVIEWED: 'Bekeken',
  INVITED: 'Uitgenodigd',
  REJECTED: 'Afgewezen',
  HIRED: 'Aangenomen',
};

export interface ApplicationResponseDto {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  vacancySlug: string;
  employerName: string;
  profileId: number;
  profileName: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
}

export interface ApplicationRequestDto {
  vacancyId: number;
  profileId: number;
  coverLetter?: string;
}

// ─── Opgeslagen Vacatures ─────────────────────────────────────────────────

export interface SavedJobDto {
  id: number;
  vacancyId: number;
  profileId: number;
  vacancyTitle: string;
  vacancySlug: string;
  employerName: string;
  cityName: string | null;
  savedAt: string;
}

export interface SavedJobRequest {
  vacancyId: number;
  profileId: number;
}
