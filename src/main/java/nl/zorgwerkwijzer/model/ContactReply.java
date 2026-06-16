package nl.zorgwerkwijzer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contact_replies")
@Getter
@Setter
public class ContactReply extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_message_id", nullable = false)
    private ContactMessage contactMessage;

    @Column(name = "admin_user_id", nullable = false)
    private Long adminUserId;

    @Column(name = "admin_email", nullable = false)
    private String adminEmail;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
}
