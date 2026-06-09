<template>
  <div class="questions-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>题库管理</h3>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            新增题目
          </el-button>
        </div>
      </template>
      
      <el-table :data="questions" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="题型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'SINGLE' ? 'success' : 'warning'">
              {{ row.type === 'SINGLE' ? '单选题' : '多选题' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="题目内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="optionA" label="选项A" width="150" show-overflow-tooltip />
        <el-table-column prop="optionB" label="选项B" width="150" show-overflow-tooltip />
        <el-table-column prop="optionC" label="选项C" width="150" show-overflow-tooltip />
        <el-table-column prop="optionD" label="选项D" width="150" show-overflow-tooltip />
        <el-table-column prop="answer" label="答案" width="80" />
        <el-table-column prop="score" label="分值" width="80" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑题目' : '新增题目'" width="600px" @close="resetForm">
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio value="SINGLE">单选题</el-radio>
            <el-radio value="MULTIPLE">多选题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="选项A" prop="optionA">
          <el-input v-model="form.optionA" placeholder="请输入选项A" />
        </el-form-item>
        <el-form-item label="选项B" prop="optionB">
          <el-input v-model="form.optionB" placeholder="请输入选项B" />
        </el-form-item>
        <el-form-item label="选项C" prop="optionC">
          <el-input v-model="form.optionC" placeholder="请输入选项C" />
        </el-form-item>
        <el-form-item label="选项D" prop="optionD">
          <el-input v-model="form.optionD" placeholder="请输入选项D" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" placeholder="如A或ABD" />
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="form.score" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../../api'

const questions = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const getInitialForm = () => ({
  id: null,
  type: 'SINGLE',
  content: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  answer: '',
  score: 10
})

const form = ref(getInitialForm())

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = getInitialForm()
}

const rules = {
  type: [{ required: true, message: '请选择题型', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  optionA: [{ required: true, message: '请输入选项A', trigger: 'blur' }],
  optionB: [{ required: true, message: '请输入选项B', trigger: 'blur' }],
  optionC: [{ required: true, message: '请输入选项C', trigger: 'blur' }],
  optionD: [{ required: true, message: '请输入选项D', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
}

const loadQuestions = async () => {
  questions.value = await getQuestions()
}

const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  resetForm()
  nextTick(() => {
    form.value = { ...row }
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await updateQuestion(form.value)
      ElMessage.success('更新成功')
    } else {
      await addQuestion(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    resetForm()
    loadQuestions()
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该题目吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteQuestion(row.id)
    ElMessage.success('删除成功')
    loadQuestions()
  }).catch(() => {})
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.questions-page {
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
</style>
