package com.exam.service;

import com.exam.dto.SubmitAnswerDTO;
import com.exam.entity.*;
import com.exam.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ExamService {

    private final ExamPaperRepository examPaperRepository;
    private final PaperQuestionRepository paperQuestionRepository;
    private final ScoreRepository scoreRepository;
    private final WrongQuestionRepository wrongQuestionRepository;
    private final QuestionService questionService;
    private final int defaultQuestionCount = 5;

    public ExamService(ExamPaperRepository examPaperRepository,
                       PaperQuestionRepository paperQuestionRepository,
                       ScoreRepository scoreRepository,
                       WrongQuestionRepository wrongQuestionRepository,
                       QuestionService questionService) {
        this.examPaperRepository = examPaperRepository;
        this.paperQuestionRepository = paperQuestionRepository;
        this.scoreRepository = scoreRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
        this.questionService = questionService;
    }

    @Transactional
    public ExamPaper createPaper(Long studentId, Integer questionCount) {
        int count = questionCount != null ? questionCount : defaultQuestionCount;
        List<Question> questions = questionService.getRandomQuestions(count);
        
        if (questions.isEmpty()) {
            throw new RuntimeException("题库中没有题目");
        }

        ExamPaper paper = new ExamPaper();
        paper.setStudentId(studentId);
        paper.setQuestionCount(questions.size());
        paper.setTotalScore(questions.stream().mapToInt(Question::getScore).sum());
        paper.setStatus("UNFINISHED");
        paper = examPaperRepository.save(paper);

        int sortOrder = 1;
        for (Question question : questions) {
            PaperQuestion pq = new PaperQuestion();
            pq.setPaperId(paper.getId());
            pq.setQuestionId(question.getId());
            pq.setSortOrder(sortOrder++);
            paperQuestionRepository.save(pq);
        }

        return paper;
    }

    public List<PaperQuestion> getPaperQuestions(Long paperId) {
        List<PaperQuestion> paperQuestions = paperQuestionRepository.findByPaperIdOrderBySortOrderAsc(paperId);
        for (PaperQuestion pq : paperQuestions) {
            Question question = questionService.getById(pq.getQuestionId());
            pq.setQuestion(question);
        }
        return paperQuestions;
    }

    @Transactional
    public Score submitPaper(SubmitAnswerDTO dto) {
        ExamPaper paper = examPaperRepository.findById(dto.getPaperId())
                .orElseThrow(() -> new RuntimeException("试卷不存在"));

        if ("FINISHED".equals(paper.getStatus())) {
            throw new RuntimeException("试卷已提交，不能重复提交");
        }

        List<PaperQuestion> paperQuestions = paperQuestionRepository.findByPaperIdOrderBySortOrderAsc(paper.getId());
        
        int studentScore = 0;
        int correctCount = 0;
        int wrongCount = 0;
        List<WrongQuestion> wrongQuestions = new ArrayList<>();

        for (PaperQuestion pq : paperQuestions) {
            String studentAnswer = dto.getAnswers().stream()
                    .filter(a -> a.getPaperQuestionId().equals(pq.getId()))
                    .map(SubmitAnswerDTO.AnswerItem::getStudentAnswer)
                    .findFirst()
                    .orElse("");

            pq.setStudentAnswer(studentAnswer);

            Question question = questionService.getById(pq.getQuestionId());
            boolean isCorrect = studentAnswer != null && sortString(studentAnswer).equals(sortString(question.getAnswer()));
            pq.setIsCorrect(isCorrect);

            if (isCorrect) {
                studentScore += question.getScore();
                correctCount++;
            } else {
                wrongCount++;
                WrongQuestion wq = new WrongQuestion();
                wq.setStudentId(paper.getStudentId());
                wq.setQuestionId(question.getId());
                wq.setPaperId(paper.getId());
                wq.setStudentAnswer(studentAnswer);
                wrongQuestions.add(wq);
            }

            paperQuestionRepository.save(pq);
        }

        if (!wrongQuestions.isEmpty()) {
            wrongQuestionRepository.saveAll(wrongQuestions);
        }

        paper.setStatus("FINISHED");
        paper.setSubmitTime(LocalDateTime.now());
        examPaperRepository.save(paper);

        Score score = new Score();
        score.setStudentId(paper.getStudentId());
        score.setPaperId(paper.getId());
        score.setTotalScore(paper.getTotalScore());
        score.setStudentScore(studentScore);
        score.setCorrectCount(correctCount);
        score.setWrongCount(wrongCount);
        score = scoreRepository.save(score);

        return score;
    }

    private String sortString(String str) {
        if (str == null || str.isEmpty()) {
            return "";
        }
        char[] chars = str.toUpperCase().toCharArray();
        java.util.Arrays.sort(chars);
        return new String(chars);
    }

    public List<ExamPaper> getStudentPapers(Long studentId) {
        return examPaperRepository.findByStudentIdOrderByCreateTimeDesc(studentId);
    }

    public Score getScoreByPaperId(Long paperId) {
        return scoreRepository.findByPaperId(paperId).orElse(null);
    }

    public List<Score> getStudentScores(Long studentId) {
        return scoreRepository.findByStudentIdOrderByCreateTimeDesc(studentId);
    }

    public List<WrongQuestion> getStudentWrongQuestions(Long studentId) {
        List<WrongQuestion> wrongQuestions = wrongQuestionRepository.findByStudentIdOrderByCreateTimeDesc(studentId);
        for (WrongQuestion wq : wrongQuestions) {
            Question question = questionService.getById(wq.getQuestionId());
            wq.setQuestion(question);
        }
        return wrongQuestions;
    }

    public ExamPaper getPaperById(Long paperId) {
        return examPaperRepository.findById(paperId).orElse(null);
    }

    public List<PaperQuestion> getPaperDetailWithAnswers(Long paperId) {
        List<PaperQuestion> paperQuestions = paperQuestionRepository.findByPaperIdOrderBySortOrderAsc(paperId);
        for (PaperQuestion pq : paperQuestions) {
            Question question = questionService.getById(pq.getQuestionId());
            pq.setQuestion(question);
        }
        paperQuestions.sort(Comparator.comparing(PaperQuestion::getSortOrder));
        return paperQuestions;
    }
}
