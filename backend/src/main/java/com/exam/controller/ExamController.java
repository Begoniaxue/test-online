package com.exam.controller;

import com.exam.common.Result;
import com.exam.dto.SubmitAnswerDTO;
import com.exam.entity.*;
import com.exam.service.ExamService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/paper")
    public Result<ExamPaper> createPaper(@RequestParam Long studentId,
                                         @RequestParam(required = false) Integer questionCount) {
        try {
            ExamPaper paper = examService.createPaper(studentId, questionCount);
            return Result.success(paper);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/paper/{paperId}/questions")
    public Result<List<PaperQuestion>> getPaperQuestions(@PathVariable Long paperId) {
        return Result.success(examService.getPaperQuestions(paperId));
    }

    @PostMapping("/submit")
    public Result<Score> submitPaper(@RequestBody SubmitAnswerDTO dto) {
        try {
            Score score = examService.submitPaper(dto);
            return Result.success(score);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/student/{studentId}/papers")
    public Result<List<ExamPaper>> getStudentPapers(@PathVariable Long studentId) {
        return Result.success(examService.getStudentPapers(studentId));
    }

    @GetMapping("/score/{paperId}")
    public Result<Score> getScoreByPaperId(@PathVariable Long paperId) {
        return Result.success(examService.getScoreByPaperId(paperId));
    }

    @GetMapping("/student/{studentId}/scores")
    public Result<List<Score>> getStudentScores(@PathVariable Long studentId) {
        return Result.success(examService.getStudentScores(studentId));
    }

    @GetMapping("/student/{studentId}/wrong-questions")
    public Result<List<WrongQuestion>> getStudentWrongQuestions(@PathVariable Long studentId) {
        return Result.success(examService.getStudentWrongQuestions(studentId));
    }

    @GetMapping("/paper/{paperId}")
    public Result<ExamPaper> getPaperById(@PathVariable Long paperId) {
        return Result.success(examService.getPaperById(paperId));
    }

    @GetMapping("/paper/{paperId}/detail")
    public Result<List<PaperQuestion>> getPaperDetail(@PathVariable Long paperId) {
        return Result.success(examService.getPaperDetailWithAnswers(paperId));
    }
}
