package com.talentforge.repository;

import com.talentforge.document.GeneratedQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneratedQuestionRepository extends MongoRepository<GeneratedQuestion, String> {
    List<GeneratedQuestion> findByUserIdAndJdRecordIdOrderByCreatedAtDesc(Long userId, Long jdRecordId);

    List<GeneratedQuestion> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    long countByUserIdAndJdRecordId(Long userId, Long jdRecordId);
}
