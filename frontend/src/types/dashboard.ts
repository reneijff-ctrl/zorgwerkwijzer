// TypeScript types voor het werkgeversdashboard
// Gespiegeld aan de backend DashboardVacancyDto, DashboardApplicationDto en DashboardVacancyCreateRequest

import type { ApplicationStatus, EmploymentType, EducationLevel } from '@/types/api';

// ─── Vacature ─────────────────────────────────────────────────────────────────

export interface DashboardVacancyDto {
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  employmentType: EmploymentType | null;
  educationLevel: EducationLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  hoursMin: number | null;
  hoursMax: number | null;
  applicationCount: number;
  publishedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export interface DashboardVacancyCreateRequest {
  cityId?: number | null;
  occupationId?: number | null;
  title: string;
  slug?: string;
  description: string;
  requirements?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  hoursMin?: number | null;
  hoursMax?: number | null;
  employmentType?: EmploymentType | null;
  educationLevel?: EducationLevel | null;
  isActive?: boolean;
  expiresAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
  featuredUntil?: string | null;
}

// ─── Sollicitatie ─────────────────────────────────────────────────────────────

export interface DashboardApplicationDto {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  vacancySlug: string;
  profileId: number;
  applicantName: string;
  applicantEmail: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  appliedAt: string;
  // Profieldetails
  applicantPhone: string | null;
  applicantCity: string | null;
  applicantProfession: string | null;
  applicantEducation: string | null;
  applicantExperienceYears: number | null;
  applicantBio: string | null;
  applicantLinkedinUrl: string | null;
  applicantCvUrl: string | null;
  applicantAvailability: string | null;
  applicantDesiredHours: number | null;
}

export interface VacancyDeleteResult {
  success: boolean;
  action: 'deleted' | 'deactivated';
  message: string;
}
