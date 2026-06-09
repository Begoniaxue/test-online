package com.exam.dto;

import java.util.List;

public class SubmitAnswerDTO {
    private Long paperId;
    private List<AnswerItem> answers;

    public Long getPaperId() { return paperId; }
    public void setPaperId(Long paperId) { this.paperId = paperId; }
    public List<AnswerItem> getAnswers() { return answers; }
    public void setAnswers(List<AnswerItem> answers) { this.answers = answers; }

    public static class AnswerItem {
        private Long paperQuestionId;
        private String studentAnswer;

        public Long getPaperQuestionId() { return paperQuestionId; }
        public void setPaperQuestionId(Long paperQuestionId) { this.paperQuestionId = paperQuestionId; }
        public String getStudentAnswer() { return studentAnswer; }
        public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
    }
}
