import { useAuthStore } from '@/stores/authStore'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import TodoView from '@/views/TodoView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
    {
      path: '/',
      redirect: '/todos'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodoView,
      meta: { requiresAuth: true }
    }

  ]
})
// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth state
  authStore.initAuth()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/todos')
  } else {
    next()
  }
})

export default router
