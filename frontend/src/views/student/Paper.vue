<template>
  <div class="paper-page">
    <el-card v-if="questions.length > 0">
      <template #header>
        <div class="card-header">
          <h3>在线答题</h3>
          <div class="progress-info">
            <span>第 {{ currentIndex + 1 }} / {{ questions.length }} 题</span>
          </div>
        </div>
      </template>

      <div class="question-card">
        <div class="question-header">
          <el-tag :type="currentQuestion.question.type === 'SINGLE' ? 'success' : 'warning'">
            {{ currentQuestion.question.type === 'SINGLE' ? '单选题' : '多选题' }}
          </el-tag>
          <span class="question-score">（{{ currentQuestion.question.score }}分）</span>
        </div>
        <div class="question-content">
          <span class="question-number">{{ currentIndex + 1 }}.</span>
          <span class="question-text">{{ currentQuestion.question.content }}</span>
        </div>
        <div class="question-options">
          <el-radio-group 
            v-if="currentQuestion.question.type === 'SINGLE'" 
            v-model="answers[currentQuestion.id]"
          >
            <el-radio value="A">{{ currentQuestion.question.optionA }}</el-radio>
            <el-radio value="B">{{ currentQuestion.question.optionB }}</el-radio>
            <el-radio value="C">{{ currentQuestion.question.optionC }}</el-radio>
            <el-radio value="D">{{ currentQuestion.question.optionD }}</el-radio>
          </el-radio-group>
          <el-checkbox-group 
            v-else 
            v-model="multipleAnswers[currentQuestion.id]"
          >
            <el-checkbox value="A">{{ currentQuestion.question.optionA }}</el-checkbox>
            <el-checkbox value="B">{{ currentQuestion.question.optionB }}</el-checkbox>
            <el-checkbox value="C">{{ currentQuestion.question.optionC }}</el-checkbox>
            <el-checkbox value="D">{{ currentQuestion.question.optionD }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="question-nav">
        <div class="nav-dots">
          <div 
            v-for="(q, index) in questions" 
            :key="q.id"
            class="nav-dot"
            :class="{ 
              active: index === currentIndex, 
              answered: isAnswered(q) 
            }"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <el-button @click="prevQuestion" :disabled="currentIndex === 0">
          上一题
        </el-button>
        <el-button 
          v-if="currentIndex < questions.length - 1" 
          type="primary" 
          @click="nextQuestion"
        >
          下一题
        </el-button>
        <el-button 
          v-else 
          type="success" 
          @click="handleSubmit"
        >
          提交试卷
        </el-button>
      </div>
    </el-card>

    <el-dialog v-model="resultVisible" title="考试结果" width="500px" close-on-click-modal :close-on-press-escape="false">
      <div class="result-content">
        <div class="result-score">
          <div class="score-number">{{ scoreResult.studentScore }}</div>
          <div class="score-total">/ {{ scoreResult.totalScore }} 分</div>
        </div>
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">正确题数</span>
            <span class="stat-value success">{{ scoreResult.correctCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">错误题数</span>
            <span class="stat-value danger">{{ scoreResult.wrongCount }}</span>
          </div>
        </div>
        <div class="result-message">
          <el-alert 
            :title="getMessage()" 
            :type="getAlertType()" 
            show-icon
            :closable="false"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="goToWrongQuestions">查看错题本</el-button>
        <el-button type="primary" @click="goToScores">查看成绩详情</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPaperQuestions, submitPaper } from '../../api'

const route = useRoute()
const router = useRouter()
const paperId = route.params.paperId

const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const multipleAnswers = ref({})
const resultVisible = ref(false)
const scoreResult = ref({
  studentScore: 0,
  totalScore: 0,
  correctCount: 0,
  wrongCount: 0
})

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})

const loadQuestions = async () => {
  questions.value = await getPaperQuestions(paperId)
  questions.value.forEach(q => {
    if (q.studentAnswer) {
      if (q.question.type === 'MULTIPLE') {
        multipleAnswers.value[q.id] = q.studentAnswer.split('')
      } else {
        answers.value[q.id] = q.studentAnswer
      }
    }
  })
}

const isAnswered = (q) => {
  if (q.question.type === 'MULTIPLE') {
    return multipleAnswers.value[q.id] && multipleAnswers.value[q.id].length > 0
  }
  return !!answers.value[q.id]
}

const goToQuestion = (index) => {
  currentIndex.value = index
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const handleSubmit = () => {
  const unanswered = questions.value.filter(q => !isAnswered(q)).length
  if (unanswered > 0) {
    ElMessageBox.confirm(
      `还有 ${unanswered} 道题未作答，确定要提交吗？`,
      '提示',
      { type: 'warning' }
    ).then(() => {
      doSubmit()
    }).catch(() => {})
  } else {
    ElMessageBox.confirm(
      '确定要提交试卷吗？提交后不能修改！',
      '提示',
      { type: 'warning' }
    ).then(() => {
      doSubmit()
    }).catch(() => {})
  }
}

const doSubmit = async () => {
  const submitData = {
    paperId: parseInt(paperId),
    answers: questions.value.map(q => {
      let answer = ''
      if (q.question.type === 'MULTIPLE') {
        const selected = multipleAnswers.value[q.id] || []
        answer = selected.sort().join('')
      } else {
        answer = answers.value[q.id] || ''
      }
      return {
        paperQuestionId: q.id,
        studentAnswer: answer
      }
    })
  }
  
  try {
    const result = await submitPaper(submitData)
    scoreResult.value = result
    resultVisible.value = true
  } catch (e) {
    console.error(e)
  }
}

const getMessage = () => {
  const percent = scoreResult.value.totalScore > 0 
    ? (scoreResult.value.studentScore / scoreResult.value.totalScore) * 100 
    : 0
  if (percent >= 90) return '优秀！继续保持！'
  if (percent >= 70) return '良好！还有提升空间！'
  if (percent >= 60) return '及格了，继续努力！'
  return '需要加强练习哦！'
}

const getAlertType = () => {
  const percent = scoreResult.value.totalScore > 0 
    ? (scoreResult.value.studentScore / scoreResult.value.totalScore) * 100 
    : 0
  if (percent >= 90) return 'success'
  if (percent >= 60) return 'warning'
  return 'error'
}

const goToWrongQuestions = () => {
  resultVisible.value = false
  router.push('/student/wrong-questions')
}

const goToScores = () => {
  resultVisible.value = false
  router.push('/student/scores')
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.paper-page {
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
.progress-info {
  color: #666;
}
.question-card {
  padding: 20px;
  min-height: 300px;
}
.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.question-score {
  color: #909399;
  font-size: 14px;
}
.question-content {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
  display: flex;
  gap: 8px;
}
.question-number {
  font-weight: bold;
  color: #409EFF;
}
.question-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.question-options :deep(.el-radio),
.question-options :deep(.el-checkbox) {
  margin-right: 0;
}
.question-nav {
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  margin: 20px 0;
}
.nav-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.nav-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}
.nav-dot:hover {
  background: #e4e7ed;
}
.nav-dot.active {
  background: #409EFF;
  color: #fff;
}
.nav-dot.answered {
  background: #67C23A;
  color: #fff;
}
.nav-dot.answered.active {
  background: #409EFF;
}
.action-buttons {
  display: flex;
  justify-content: space-between;
}
.result-content {
  text-align: center;
}
.result-score {
  margin-bottom: 30px;
}
.score-number {
  font-size: 72px;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
}
.score-total {
  font-size: 24px;
  color: #909399;
  margin-top: 8px;
}
.result-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 30px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat-label {
  color: #909399;
  font-size: 14px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
}
.stat-value.success {
  color: #67C23A;
}
.stat-value.danger {
  color: #F56C6C;
}
</style>
