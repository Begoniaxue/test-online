import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../views/AdminLayout.vue'),
    children: [
      {
        path: 'questions',
        name: 'AdminQuestions',
        component: () => import('../views/admin/Questions.vue')
      }
    ]
  },
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('../views/StudentLayout.vue'),
    children: [
      {
        path: 'exam',
        name: 'StudentExam',
        component: () => import('../views/student/Exam.vue')
      },
      {
        path: 'paper/:paperId',
        name: 'StudentPaper',
        component: () => import('../views/student/Paper.vue')
      },
      {
        path: 'scores',
        name: 'StudentScores',
        component: () => import('../views/student/Scores.vue')
      },
      {
        path: 'wrong-questions',
        name: 'StudentWrongQuestions',
        component: () => import('../views/student/WrongQuestions.vue')
      },
      {
        path: 'paper-detail/:paperId',
        name: 'PaperDetail',
        component: () => import('../views/student/PaperDetail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  if (to.path !== '/login' && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
