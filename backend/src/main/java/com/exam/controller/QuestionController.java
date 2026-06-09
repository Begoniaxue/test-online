package com.exam.controller;

import com.exam.common.Result;
import com.exam.entity.Question;
import com.exam.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public Result<List<Question>> getAllQuestions() {
        return Result.success(questionService.getAllQuestions());
    }

    @GetMapping("/type/{type}")
    public Result<List<Question>> getQuestionsByType(@PathVariable String type) {
        return Result.success(questionService.getQuestionsByType(type));
    }

    @PostMapping
    public Result<Question> addQuestion(@RequestBody Question question) {
        return Result.success(questionService.addQuestion(question));
    }

    @PutMapping
    public Result<Question> updateQuestion(@RequestBody Question question) {
        return Result.success(questionService.updateQuestion(question));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return Result.success();
    }

    @GetMapping("/{id}")
    public Result<Question> getById(@PathVariable Long id) {
        return Result.success(questionService.getById(id));
    }
}
