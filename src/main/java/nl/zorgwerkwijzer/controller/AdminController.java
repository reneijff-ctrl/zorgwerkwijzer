package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.MailConfigValidator;
import nl.zorgwerkwijzer.dto.RoleUpdateRequest;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.dto.admin.*;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.service.AdminAuditLogService;
import nl.zorgwerkwijzer.service.AdminService;
import nl.zorgwerkwijzer.service.AuthService;
import nl.zorgwerkwijzer.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only platform management endpoints")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class AdminController {

    private final AuthService authService;
    private final EmailService emailService;
    private final MailConfigValidator mailConfigValidator;
    private final AdminService adminService;
    private final AdminAuditLogService adminAuditLogService;

    @Value("${app.mail.admin:admin@zorgwerkwijzer.nl}")
    private String adminEmail;

    // ── Statistieken ──────────────────────────────────────────────────────────

    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics", description = "Returns platform-wide statistics for the admin dashboard.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Statistics returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Gebruikers ────────────────────────────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Returns a paginated list of users with optional search and role filter.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Users returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Page<AdminUserDto>> getUsers(
            @Parameter(description = "Search by email (partial match)") @RequestParam(required = false) String q,
            @Parameter(description = "Filter by role") @RequestParam(required = false) UserRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getUsers(q, role, pageable));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminUserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PatchMapping("/users/{userId}/role")
    @Operation(summary = "Update user role", description = "Assigns a new role to an existing user. Requires ADMIN role.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role updated successfully"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody RoleUpdateRequest request) {
        UserDto updatedUser = authService.updateRole(userId, request.getRole());
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Permanently deletes a user. Admin accounts cannot be deleted.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "User deleted"),
        @ApiResponse(responseCode = "400", description = "Cannot delete admin accounts"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── Werkgevers ────────────────────────────────────────────────────────────

    @GetMapping("/employers")
    @Operation(summary = "List all employers", description = "Returns a paginated list of employers with optional search.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Employers returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Page<AdminEmployerDto>> getEmployers(
            @Parameter(description = "Search by name or email") @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getEmployers(q, pageable));
    }

    @GetMapping("/employers/{id}")
    @Operation(summary = "Get employer detail", description = "Returns full employer detail including vacancies and linked users.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Employer found"),
        @ApiResponse(responseCode = "404", description = "Employer not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminEmployerDetailDto> getEmployerById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getEmployerById(id));
    }

    // ── Vacatures ─────────────────────────────────────────────────────────────

    @GetMapping("/vacancies/{id}")
    @Operation(summary = "Get vacancy by ID", description = "Returns full vacancy details for admin management.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Vacancy found"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminVacancyDetailDto> getVacancyById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getVacancyById(id));
    }

    @GetMapping("/vacancies")
    @Operation(summary = "List all vacancies", description = "Returns a paginated list of vacancies with optional filters.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Vacancies returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Page<AdminVacancyDto>> getVacancies(
            @Parameter(description = "Search by title") @RequestParam(required = false) String q,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "Filter by featured status") @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        PageRequest pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getVacancies(q, isActive, isFeatured, pageable));
    }

    @PatchMapping("/vacancies/{id}/featured")
    @Operation(summary = "Toggle vacancy featured status")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Featured status toggled"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminVacancyDto> toggleVacancyFeatured(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleVacancyFeatured(id));
    }

    @PatchMapping("/vacancies/{id}/active")
    @Operation(summary = "Toggle vacancy active status")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Active status toggled"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<AdminVacancyDto> toggleVacancyActive(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleVacancyActive(id));
    }

    @DeleteMapping("/vacancies/{id}")
    @Operation(summary = "Delete vacancy")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Vacancy deleted"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Void> deleteVacancy(@PathVariable Long id) {
        adminService.deleteVacancy(id);
        return ResponseEntity.noContent().build();
    }

    // ── Abonnementen ──────────────────────────────────────────────────────────

    @GetMapping("/subscriptions")
    @Operation(summary = "List all subscriptions", description = "Returns a paginated list of employer subscriptions with optional filters.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Subscriptions returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Page<AdminSubscriptionDto>> getSubscriptions(
            @Parameter(description = "Filter by status (ACTIVE, TRIALING, PAST_DUE, CANCELED, INACTIVE)") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by package ID") @RequestParam(required = false) Long packageId,
            @Parameter(description = "Show only subscriptions cancelled in the last 30 days") @RequestParam(required = false) Boolean canceledLast30Days,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getSubscriptions(status, packageId, canceledLast30Days, pageable));
    }

    // ── Audit Log ─────────────────────────────────────────────────────────────

    @GetMapping("/audit-log")
    @Operation(summary = "Get admin audit log", description = "Returns a paginated audit log of admin mutations. All filters are optional.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Audit log returned"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Page<AdminAuditLogDto>> getAuditLog(
            @Parameter(description = "Filter by admin user ID") @RequestParam(required = false) Long adminUserId,
            @Parameter(description = "Filter by action (e.g. USER_DELETED)") @RequestParam(required = false) AuditAction action,
            @Parameter(description = "Filter by entity type (USER, VACANCY)") @RequestParam(required = false) String entityType,
            @Parameter(description = "From date (ISO 8601)") @RequestParam(required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "To date (ISO 8601)") @RequestParam(required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, Math.min(size, 100));
        return ResponseEntity.ok(adminAuditLogService.getAuditLog(adminUserId, action, entityType, from, to, pageable));
    }

    // ── E-mail test (bestaand) ────────────────────────────────────────────────

    @GetMapping("/test-email")
    @Operation(
        summary = "Send test e-mail",
        description = "Sends a test e-mail to the configured admin address. " +
                      "Returns a JSON report showing the current mail configuration status. " +
                      "Requires ADMIN role."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Test e-mail sent (or attempted)"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Admin role required")
    })
    public ResponseEntity<Map<String, Object>> sendTestEmail() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("smtpConfigured", mailConfigValidator.isConfigured());
        report.put("adminEmail", adminEmail);

        if (!mailConfigValidator.isConfigured()) {
            report.put("status", "SKIPPED");
            report.put("message", "SMTP is not configured. Set MAIL_PASSWORD (and optionally " +
                    "MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_FROM, MAIL_ADMIN) " +
                    "as environment variables and restart the application.");
            log.warn("Admin requested test-email but SMTP is not configured.");
            return ResponseEntity.ok(report);
        }

        try {
            emailService.sendApplicationInvitedEmail(
                    adminEmail,
                    "Admin",
                    "Test Vacature — ZorgWerkwijzer",
                    "ZorgWerkwijzer Platform"
            );
            report.put("status", "SENT");
            report.put("message", "Test e-mail successfully sent to " + adminEmail);
            log.info("Test e-mail sent to {}", adminEmail);
        } catch (Exception ex) {
            report.put("status", "FAILED");
            report.put("message", "Failed to send test e-mail: " + ex.getMessage());
            log.error("Test e-mail failed: {}", ex.getMessage());
        }

        return ResponseEntity.ok(report);
    }
}
