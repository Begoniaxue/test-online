package com.exam.repository;

import com.exam.entity.WrongQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WrongQuestionRepository extends JpaRepository<WrongQuestion, Long> {
    List<WrongQuestion> findByStudentIdOrderByCreateTimeDesc(Long studentId);
}
