package com.exam.repository;

import com.exam.entity.ExamPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Long> {
    List<ExamPaper> findByStudentIdOrderByCreateTimeDesc(Long studentId);
    List<ExamPaper> findByStudentIdAndStatusOrderByCreateTimeDesc(Long studentId, String status);
}
