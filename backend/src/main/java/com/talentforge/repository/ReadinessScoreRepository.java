package com.talentforge.repository;

import com.talentforge.entity.ReadinessScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadinessScoreRepository extends JpaRepository<ReadinessScore, Long> {
    List<ReadinessScore> findByUserIdOrderByCreatedDateDesc(Long userId);

    Optional<ReadinessScore> findFirstByUserIdOrderByCreatedDateDesc(Long userId);

    List<ReadinessScore> findTop10ByUserIdOrderByCreatedDateDesc(Long userId);
}
