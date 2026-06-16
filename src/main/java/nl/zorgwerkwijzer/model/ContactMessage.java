package nl.zorgwerkwijzer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
public class ContactMessage extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContactMessageStatus status = ContactMessageStatus.NEW;

    @OneToMany(mappedBy = "contactMessage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    private List<ContactReply> replies = new ArrayList<>();
}
