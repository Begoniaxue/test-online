<template>
  <div class="scores-page">
    <el-card>
      <template #header>
        <h3>我的成绩</h3>
      </template>
      
      <el-table :data="scores" stripe v-if="scores.length > 0">
        <el-table-column prop="id" label="成绩ID" width="100" />
        <el-table-column prop="paperId" label="试卷ID" width="100" />
        <el-table-column label="得分" width="150">
          <template #default="{ row }">
            <span class="score-text">{{ row.studentScore }} / {{ row.totalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正确率" width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.round((row.studentScore / row.totalScore) * 100)" 
              :stroke-width="12"
            />
          </template>
        </el-table-column>
        <el-table-column prop="correctCount" label="正确" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.correctCount }} 题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="wrongCount" label="错误" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.wrongCount }} 题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="考试时间" width="200" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              link 
              @click="viewDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无考试成绩" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStudentScores } from '../../api'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const scores = ref([])

const loadScores = async () => {
  scores.value = await getStudentScores(user.id)
}

const viewDetail = (row) => {
  router.push(`/student/paper-detail/${row.paperId}`)
}

onMounted(() => {
  loadScores()
})
</script>

<style scoped>
.scores-page {
  min-height: 100%;
}
.score-text {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}
</style>
