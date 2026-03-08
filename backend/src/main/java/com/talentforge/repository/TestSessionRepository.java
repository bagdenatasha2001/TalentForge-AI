package com.talentforge.repository;

import com.talentforge.entity.TestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    List<TestSession> findByUserIdOrderByCreatedDateDesc(Long userId);

    List<TestSession> findByUserIdAndJdRecordIdOrderByCreatedDateDesc(Long userId, Long jdRecordId);

    List<TestSession> findByUserIdAndStatus(Long userId, TestSession.TestStatus status);
}
