package com.exam.service;

import com.exam.entity.Question;
import com.exam.repository.QuestionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll(Sort.by(Sort.Direction.DESC, "createTime"));
    }

    public List<Question> getQuestionsByType(String type) {
        return questionRepository.findByType(type);
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Question question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public Question getById(Long id) {
        Optional<Question> opt = questionRepository.findById(id);
        return opt.orElse(null);
    }

    public List<Question> getRandomQuestions(int count) {
        return questionRepository.findRandomQuestions(count);
    }
}
