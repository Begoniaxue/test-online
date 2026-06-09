<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <el-icon :size="24" color="#fff"><Reading /></el-icon>
        <span>在线考试系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#1f2d3d"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/student/exam">
          <el-icon><Tickets /></el-icon>
          <span>开始考试</span>
        </el-menu-item>
        <el-menu-item index="/student/scores">
          <el-icon><Trophy /></el-icon>
          <span>我的成绩</span>
        </el-menu-item>
        <el-menu-item index="/student/wrong-questions">
          <el-icon><Warning /></el-icon>
          <span>错题本</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="user-info">
          <span>欢迎，{{ user.name }}</span>
          <el-button type="danger" size="small" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('/paper/')) return '/student/exam'
  if (path.includes('/paper-detail/')) return '/student/scores'
  return path
})

const logout = () => {
  localStorage.removeItem('user')
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.sidebar {
  background-color: #1f2d3d;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #2d3a4b;
}
.sidebar-menu {
  border-right: none;
}
.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
