package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.SubscriptionPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPackageRepository extends JpaRepository<SubscriptionPackage, Long> {

    List<SubscriptionPackage> findByIsActiveTrueOrderByPriceMonthlyAsc();

    Optional<SubscriptionPackage> findByName(String name);

    Optional<SubscriptionPackage> findByStripePriceIdMonthly(String stripePriceId);

    Optional<SubscriptionPackage> findByStripePriceIdYearly(String stripePriceId);
}
