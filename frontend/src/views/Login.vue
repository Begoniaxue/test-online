<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <el-icon :size="32" color="#409EFF"><Reading /></el-icon>
          <h2>在线刷题考试系统</h2>
        </div>
      </template>
      <el-form :model="form" label-width="80px" @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>管理员：admin / 123456</p>
        <p>考生：student1 / 123456 或 student2 / 123456</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  try {
    const user = await login(form.value)
    localStorage.setItem('user', JSON.stringify(user))
    ElMessage.success('登录成功')
    if (user.role === 'ADMIN') {
      router.push('/admin/questions')
    } else {
      router.push('/student/exam')
    }
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
  padding: 20px;
}
.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.login-header h2 {
  margin: 0;
  color: #333;
}
.login-tips {
  margin-top: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
.login-tips p {
  margin: 4px 0;
}
</style>
