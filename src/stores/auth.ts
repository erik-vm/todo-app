import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register } from '@/services/api'
import type { LoginRequest, RegisterRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<{ firstName: string; lastName: string } | null>(null)
  const token = ref<string | null>(null)

  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
    }
  }

  const loginUser = async (credentials: LoginRequest): Promise<void> => {
    const response = await login(credentials)

    token.value = response.token
    user.value = {
      firstName: response.firstName,
      lastName: response.lastName
    }
    isAuthenticated.value = true

    localStorage.setItem('token', response.token)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const registerUser = async (userData: RegisterRequest): Promise<void> => {
    const response = await register(userData)

    token.value = response.token
    user.value = {
      firstName: response.firstName,
      lastName: response.lastName
    }
    isAuthenticated.value = true

    localStorage.setItem('token', response.token)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.clear()
  }

  return {
    isAuthenticated,
    user,
    token,
    initAuth,
    loginUser,
    registerUser,
    logout
  }
})
