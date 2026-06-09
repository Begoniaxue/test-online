<template>
  <div class="paper-detail-page">
    <el-card v-if="questions.length > 0">
      <template #header>
        <div class="card-header">
          <h3>试卷详情</h3>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </template>

      <div class="score-summary" v-if="score">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="stat-card primary">
              <div class="stat-label">总分</div>
              <div class="stat-value">{{ score.studentScore }} / {{ score.totalScore }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-card success">
              <div class="stat-label">正确</div>
              <div class="stat-value">{{ score.correctCount }} 题</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-card danger">
              <div class="stat-label">错误</div>
              <div class="stat-value">{{ score.wrongCount }} 题</div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="question-list">
        <div 
          v-for="(item, index) in questions" 
          :key="item.id" 
          class="question-item"
          :class="{ 'wrong-item': item.isCorrect === false }"
        >
          <div class="question-header">
            <span class="question-number">{{ index + 1 }}.</span>
            <el-tag :type="item.question.type === 'SINGLE' ? 'success' : 'warning'">
              {{ item.question.type === 'SINGLE' ? '单选题' : '多选题' }}
            </el-tag>
            <span class="question-meta">（{{ item.question.score }}分）</span>
            <el-tag v-if="item.isCorrect === true" type="success" effect="dark" size="small">
              <el-icon><CircleCheck /></el-icon>
              正确
            </el-tag>
            <el-tag v-else-if="item.isCorrect === false" type="danger" effect="dark" size="small">
              <el-icon><CircleClose /></el-icon>
              错误
            </el-tag>
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
              <span :class="item.isCorrect ? 'answer-text correct' : 'answer-text wrong'">
                {{ item.studentAnswer || '未作答' }}
              </span>
            </div>
            <div class="answer-item">
              <span class="answer-label">正确答案：</span>
              <span class="answer-text correct">{{ item.question.answer }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPaperDetail, getScoreByPaperId } from '../../api'

const route = useRoute()
const router = useRouter()
const paperId = route.params.paperId

const questions = ref([])
const score = ref(null)

const loadData = async () => {
  questions.value = await getPaperDetail(paperId)
  score.value = await getScoreByPaperId(paperId)
}

const isCorrectOption = (question, option) => {
  return question.answer.includes(option)
}

const isWrongOption = (item, option) => {
  const studentAnswer = item.studentAnswer || ''
  return studentAnswer.includes(option) && !item.question.answer.includes(option)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.paper-detail-page {
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
.score-summary {
  margin-bottom: 30px;
}
.stat-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}
.stat-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.stat-card.success {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}
.stat-card.danger {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
}
.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
}
.question-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.question-item {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
.question-item.wrong-item {
  background: #fef0f0;
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
  color: #409EFF;
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
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid transparent;
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
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
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
</style>
