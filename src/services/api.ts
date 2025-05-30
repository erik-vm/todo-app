import type { ITodoCategory } from '@/domain/ITodoCategory'
import type { ITodoTask } from '@/domain/ITodoTask'
import type { ILoginRequest } from '@/types/ILoginRequest'
import type { ITodoPriority } from '@/types/ITodoPriority'
import type { ITodoTaskCreate, ITodoTaskEdit } from '@/types/ITodoTaskCreate'
import type { ILoginResponse } from '@/types/ILoginReponse'
import axios from 'axios'
const API_BASE_URL = 'https://taltech.akaver.com/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await refreshTokens()
          localStorage.setItem('token', response.token)
          localStorage.setItem('refreshToken', response.refreshToken)
          // Retry original request
          return api.request(error.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const login = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
  const response = await api.post('/Account/Login', credentials)
  return response.data
}

export const register = async (userData: ILoginRequest): Promise<ILoginResponse> => {
  const response = await api.post('/Account/Register', userData)
  return response.data
}

export const refreshTokens = async (): Promise<ILoginResponse> => {
  const refreshToken = localStorage.getItem('refreshToken')
  const token = localStorage.getItem('token')
  const response = await api.post('/Account/RefreshToken', {
    jwt: token,
    refreshToken,
  })
  return response.data
}

// Todo Tasks API
export const getTodoTasks = async (): Promise<ITodoTask[]> => {
  const response = await api.get('/TodoTasks')
  return response.data
}

export const createTodoTask = async (task: ITodoTaskCreate): Promise<ITodoTask> => {
  const response = await api.post('/TodoTasks', task)
  return response.data
}

export const updateTodoTask = async (id: string, task: ITodoTaskEdit): Promise<ITodoTask> => {
  const response = await api.put(`/TodoTasks/${id}`, task)
  return response.data
}

export const deleteTodoTask = async (id: string): Promise<void> => {
  await api.delete(`/TodoTasks/${id}`)
}

// Todo Categories API
export const getTodoCategories = async (): Promise<ITodoCategory[]> => {
  const response = await api.get('/TodoCategories')
  return response.data
}

export const createTodoCategory = async (
  category: Omit<ITodoCategory, 'id' | 'syncDt'>,
): Promise<ITodoCategory> => {
  const response = await api.post('/TodoCategories', category)
  return response.data
}

// Todo Priorities API
export const getTodoPriorities = async (): Promise<ITodoPriority[]> => {
  const response = await api.get('/TodoPriorities')
  return response.data
}

export const createTodoPriority = async (
  priority: Omit<ITodoPriority, 'id' | 'syncDt'>,
): Promise<ITodoPriority> => {
  const response = await api.post('/TodoPriorities', priority)
  return response.data
}
