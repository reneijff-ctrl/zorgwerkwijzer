package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Platform-wide statistics for the admin dashboard")
public class AdminStatsDto {

    // ── Gebruikers ────────────────────────────────────────────────────────────
    @Schema(description = "Total number of registered users")
    private long totalUsers;

    @Schema(description = "Total number of candidates (ROLE_USER)")
    private long totalCandidates;

    @Schema(description = "Total number of employers (ROLE_EMPLOYER)")
    private long totalEmployers;

    @Schema(description = "New user registrations in the last 30 days")
    private long newUsersLast30Days;

    @Schema(description = "New employer registrations in the last 30 days")
    private long newEmployersLast30Days;

    // ── Vacatures ─────────────────────────────────────────────────────────────
    @Schema(description = "Total number of vacancies")
    private long totalVacancies;

    @Schema(description = "Number of active vacancies")
    private long activeVacancies;

    @Schema(description = "Number of featured vacancies")
    private long featuredVacancies;

    // ── Sollicitaties ─────────────────────────────────────────────────────────
    @Schema(description = "Total number of applications")
    private long totalApplications;

    // ── Abonnementen ──────────────────────────────────────────────────────────
    @Schema(description = "Number of active subscriptions (ACTIVE + TRIALING)")
    private long activeSubscriptions;

    @Schema(description = "Number of trialing subscriptions")
    private long trialingCount;

    @Schema(description = "Number of past-due subscriptions")
    private long pastDueCount;

    @Schema(description = "Number of subscriptions cancelled in the last 30 days")
    private long canceledLast30DaysCount;

    @Schema(description = "Subscriptions grouped by package name")
    private Map<String, Long> subscriptionsByPackage;

    // ── Omzet ─────────────────────────────────────────────────────────────────
    @Schema(description = "Monthly Recurring Revenue in cents")
    private long mrr;

    @Schema(description = "Annual Run Rate in cents (MRR x 12)")
    private long arr;

    @Schema(description = "MRR contribution per package name in cents")
    private Map<String, Long> mrrByPackage;

    @Schema(description = "Total subscription revenue (all time) in cents")
    private long subscriptionRevenue;

    @Schema(description = "Total vacancy credit revenue (all time) in cents")
    private long creditRevenue;

    @Schema(description = "Total lifetime revenue (subscriptions + credits) in cents")
    private long lifetimeRevenue;

    @Schema(description = "Revenue in the current calendar month in cents")
    private long revenueThisMonth;

    @Schema(description = "Revenue in the previous calendar month in cents")
    private long revenuePrevMonth;

    @Schema(description = "Average revenue per employer in cents")
    private long avgRevenuePerEmployer;

    @Schema(description = "Number of subscriptions with cancel_at_period_end = true")
    private long cancelAtPeriodEndCount;

    @Schema(description = "Total credits sold (all time)")
    private long totalCreditsSold;

    @Schema(description = "Credits sold per bundle type")
    private Map<String, Long> creditsByBundle;

    @Schema(description = "Revenue per bundle type in cents")
    private Map<String, Long> creditRevenueByBundle;

    // ── Recente activiteit ────────────────────────────────────────────────────
    @Schema(description = "Last 5 registered employers")
    private List<AdminEmployerSummaryDto> recentEmployers;

    @Schema(description = "Last 5 published vacancies")
    private List<AdminVacancySummaryDto> recentVacancies;

    @Schema(description = "Subscriptions with PAST_DUE status")
    private List<AdminSubscriptionDto> pastDueSubscriptions;

    @Schema(description = "Subscriptions cancelled in the last 30 days")
    private List<AdminSubscriptionDto> recentCancellations;
}
