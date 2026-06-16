package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.ContactMessage;
import nl.zorgwerkwijzer.model.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long>, JpaSpecificationExecutor<ContactMessage> {

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(ContactMessageStatus status);

    List<ContactMessage> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(m) FROM ContactMessage m WHERE m.status = nl.zorgwerkwijzer.model.ContactMessageStatus.NEW")
    long countNew();
}
