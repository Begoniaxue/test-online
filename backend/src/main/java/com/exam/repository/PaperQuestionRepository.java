package com.exam.repository;

import com.exam.entity.PaperQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperQuestionRepository extends JpaRepository<PaperQuestion, Long> {
    List<PaperQuestion> findByPaperIdOrderBySortOrderAsc(Long paperId);
    List<PaperQuestion> findByPaperIdAndIsCorrect(Long paperId, Boolean isCorrect);
}
