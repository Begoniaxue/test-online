package com.exam.repository;

import com.exam.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByStudentIdOrderByCreateTimeDesc(Long studentId);
    Optional<Score> findByPaperId(Long paperId);
}
