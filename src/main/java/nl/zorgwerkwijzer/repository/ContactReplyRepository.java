package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.ContactReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactReplyRepository extends JpaRepository<ContactReply, Long> {
    List<ContactReply> findByContactMessageIdOrderByCreatedAtAsc(Long contactMessageId);
}
