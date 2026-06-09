<template>
  <div class="wrong-questions-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>错题本</h3>
          <el-tag type="danger" size="large">共 {{ wrongQuestions.length }} 道错题</el-tag>
        </div>
      </template>
      
      <div v-if="wrongQuestions.length > 0" class="wrong-list">
        <div 
          v-for="(item, index) in wrongQuestions" 
          :key="item.id" 
          class="wrong-item"
        >
          <div class="question-header">
            <span class="question-number">{{ index + 1 }}.</span>
            <el-tag :type="item.question.type === 'SINGLE' ? 'success' : 'warning'">
              {{ item.question.type === 'SINGLE' ? '单选题' : '多选题' }}
            </el-tag>
            <span class="question-meta">（{{ item.question.score }}分）</span>
          </div>
          
          <div class="question-content">
            {{ item.question.content }}
          </div>
          
          <div class="question-options">
            <div class="option-item" :class="{ 
              correct: isCorrectOption(item.question, 'A'),
              wrong: isWrongOption(item, 'A')
            }">
              <span class="option-label">A.</span>
              <span class="option-text">{{ item.question.optionA }}</span>
              <el-icon v-if="isCorrectOption(item.question, 'A')" class="correct-icon"><CircleCheck /></el-icon>
              <el-icon v-if="isWrongOption(item, 'A')" class="wrong-icon"><CircleClose /></el-icon>
            </div>
            <div class="option-item" :class="{ 
              correct: isCorrectOption(item.question, 'B'),
              wrong: isWrongOption(item, 'B')
            }">
              <span class="option-label">B.</span>
              <span class="option-text">{{ item.question.optionB }}</span>
              <el-icon v-if="isCorrectOption(item.question, 'B')" class="correct-icon"><CircleCheck /></el-icon>
              <el-icon v-if="isWrongOption(item, 'B')" class="wrong-icon"><CircleClose /></el-icon>
            </div>
            <div class="option-item" :class="{ 
              correct: isCorrectOption(item.question, 'C'),
              wrong: isWrongOption(item, 'C')
            }">
              <span class="option-label">C.</span>
              <span class="option-text">{{ item.question.optionC }}</span>
              <el-icon v-if="isCorrectOption(item.question, 'C')" class="correct-icon"><CircleCheck /></el-icon>
              <el-icon v-if="isWrongOption(item, 'C')" class="wrong-icon"><CircleClose /></el-icon>
            </div>
            <div class="option-item" :class="{ 
              correct: isCorrectOption(item.question, 'D'),
              wrong: isWrongOption(item, 'D')
            }">
              <span class="option-label">D.</span>
              <span class="option-text">{{ item.question.optionD }}</span>
              <el-icon v-if="isCorrectOption(item.question, 'D')" class="correct-icon"><CircleCheck /></el-icon>
              <el-icon v-if="isWrongOption(item, 'D')" class="wrong-icon"><CircleClose /></el-icon>
            </div>
          </div>
          
          <div class="answer-compare">
            <div class="answer-item">
              <span class="answer-label">你的答案：</span>
              <span class="answer-text wrong">{{ item.studentAnswer || '未作答' }}</span>
            </div>
            <div class="answer-item">
              <span class="answer-label">正确答案：</span>
              <span class="answer-text correct">{{ item.question.answer }}</span>
            </div>
          </div>
          
          <div class="question-meta-info">
            <span>记录时间：{{ item.createTime }}</span>
          </div>
        </div>
      </div>
      
      <el-empty v-else description="暂无错题记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStudentWrongQuestions } from '../../api'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const wrongQuestions = ref([])

const loadWrongQuestions = async () => {
  wrongQuestions.value = await getStudentWrongQuestions(user.id)
}

const isCorrectOption = (question, option) => {
  return question.answer.includes(option)
}

const isWrongOption = (item, option) => {
  const studentAnswer = item.studentAnswer || ''
  return studentAnswer.includes(option) && !item.question.answer.includes(option)
}

onMounted(() => {
  loadWrongQuestions()
})
</script>

<style scoped>
.wrong-questions-page {
  min-height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h3 {
  margin: 0;
}
.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.wrong-item {
  padding: 20px;
  background: #fef0f0;
  border-radius: 8px;
  border-left: 4px solid #f56c6c;
}
.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.question-number {
  font-weight: bold;
  color: #f56c6c;
  font-size: 16px;
}
.question-meta {
  color: #909399;
  font-size: 14px;
}
.question-content {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 16px;
  color: #333;
}
.question-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  transition: all 0.2s;
}
.option-item.correct {
  background: #f0f9eb;
  border-color: #67c23a;
}
.option-item.wrong {
  background: #fef0f0;
  border-color: #f56c6c;
}
.option-label {
  font-weight: bold;
  color: #606266;
  min-width: 24px;
}
.option-text {
  flex: 1;
  color: #333;
}
.correct-icon {
  color: #67c23a;
  font-size: 18px;
}
.wrong-icon {
  color: #f56c6c;
  font-size: 18px;
}
.answer-compare {
  display: flex;
  gap: 40px;
  padding: 12px 0;
  border-top: 1px solid #fbc4c4;
}
.answer-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.answer-label {
  color: #606266;
}
.answer-text {
  font-weight: bold;
  font-size: 16px;
}
.answer-text.correct {
  color: #67c23a;
}
.answer-text.wrong {
  color: #f56c6c;
  text-decoration: line-through;
}
.question-meta-info {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}
</style>
