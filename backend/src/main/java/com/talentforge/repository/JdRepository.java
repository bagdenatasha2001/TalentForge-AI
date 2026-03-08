package com.talentforge.repository;

import com.talentforge.entity.JdRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JdRepository extends JpaRepository<JdRecord, Long> {
    List<JdRecord> findByUserIdOrderByCreatedDateDesc(Long userId);

    List<JdRecord> findTop5ByUserIdOrderByCreatedDateDesc(Long userId);
}
