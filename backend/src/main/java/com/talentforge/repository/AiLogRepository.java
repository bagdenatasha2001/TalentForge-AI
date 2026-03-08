package com.talentforge.repository;

import com.talentforge.document.AiLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiLogRepository extends MongoRepository<AiLog, String> {
    List<AiLog> findTop50ByOrderByCreatedAtDesc();

    List<AiLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}
