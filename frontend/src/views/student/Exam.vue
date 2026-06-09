<template>
  <div class="exam-page">
    <el-card>
      <template #header>
        <h3>开始考试</h3>
      </template>
      
      <div class="exam-intro">
        <el-alert
          title="考试说明"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>1. 系统将从题库中随机抽取指定数量的题目组成试卷</p>
            <p>2. 题型包括单选题和多选题，每题10分</p>
            <p>3. 提交后立即出分，错题将自动归档到错题本</p>
            <p>4. 每道题只能提交一次，请认真作答</p>
          </template>
        </el-alert>
      </div>

      <div class="exam-config">
        <el-form label-width="100px" class="config-form">
          <el-form-item label="题目数量">
            <el-select v-model="questionCount" style="width: 200px">
              <el-option :value="3" label="3题" />
              <el-option :value="5" label="5题" />
              <el-option :value="8" label="8题" />
              <el-option :value="10" label="10题" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="start-btn">
        <el-button type="primary" size="large" :icon="VideoPlay" @click="startExam">
          开始答题
        </el-button>
      </div>

      <el-divider />

      <h4>历史记录</h4>
      <el-table :data="papers" stripe v-if="papers.length > 0">
        <el-table-column prop="id" label="试卷ID" width="100" />
        <el-table-column prop="questionCount" label="题目数" width="100" />
        <el-table-column prop="totalScore" label="总分" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'FINISHED' ? 'success' : 'warning'">
              {{ row.status === 'FINISHED' ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'UNFINISHED'" 
              size="small" 
              type="primary" 
              link 
              @click="continueExam(row)"
            >
              继续答题
            </el-button>
            <el-button 
              v-else 
              size="small" 
              type="info" 
              link 
              @click="viewDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无考试记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import { createPaper, getStudentPapers } from '../../api'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const questionCount = ref(5)
const papers = ref([])

const loadPapers = async () => {
  papers.value = await getStudentPapers(user.id)
}

const startExam = async () => {
  try {
    const paper = await createPaper(user.id, questionCount.value)
    ElMessage.success('试卷生成成功')
    router.push(`/student/paper/${paper.id}`)
  } catch (e) {
    console.error(e)
  }
}

const continueExam = (row) => {
  router.push(`/student/paper/${row.id}`)
}

const viewDetail = (row) => {
  router.push(`/student/paper-detail/${row.id}`)
}

onMounted(() => {
  loadPapers()
})
</script>

<style scoped>
.exam-page {
  min-height: 100%;
}
.exam-intro {
  margin-bottom: 30px;
}
.exam-intro :deep(.el-alert__description) p {
  margin: 8px 0;
  color: #666;
}
.exam-config {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}
.config-form {
  padding: 20px 40px;
  background: #f5f7fa;
  border-radius: 8px;
}
.start-btn {
  text-align: center;
  margin: 30px 0;
}
</style>
