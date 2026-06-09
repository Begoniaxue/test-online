package com.exam.repository;

import com.exam.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByType(String type);

    @Query(value = "SELECT * FROM question ORDER BY RAND() LIMIT ?1", nativeQuery = true)
    List<Question> findRandomQuestions(int count);
}
