import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getTodoTasks,
  createTodoTask,
  updateTodoTask,
  deleteTodoTask,
  getTodoCategories,
  getTodoPriorities,
  createTodoCategory,
  createTodoPriority,
} from '../services/API'
import type { ITodoTask } from '@/domain/ITodoTask'
import type { ITodoCategory } from '@/domain/ITodoCategory'
import type { IFilterOptions } from '@/types/IFilterOptions'
import type { ITodoPriority } from '@/types/ITodoPriority'
import type { ITodoTaskCreate, ITodoTaskEdit } from '@/types/ITodoTaskCreate'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref<ITodoTask[]>([])
  const categories = ref<ITodoCategory[]>([])
  const priorities = ref<ITodoPriority[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref<IFilterOptions>({
    showCompleted: true,
    showArchived: false,
    categoryId: undefined,
    priorityId: undefined,
  })

  const filteredTasks = computed(() => {
    return tasks.value.filter((task) => {
      if (!filters.value.showCompleted && task.isCompleted) return false
      if (!filters.value.showArchived && task.isArchived) return false
      if (filters.value.categoryId && task.todoCategoryId !== filters.value.categoryId) return false
      if (filters.value.priorityId && task.todoPriorityId !== filters.value.priorityId) return false
      return true
    })
  })

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      tasks.value = await getTodoTasks()
    } catch (err) {
      error.value = 'Failed to fetch tasks'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      categories.value = await getTodoCategories()
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchPriorities = async () => {
    try {
      priorities.value = await getTodoPriorities()
    } catch (err) {
      console.error('Failed to fetch priorities:', err)
    }
  }

  const addTask = async (taskData: ITodoTaskCreate) => {
    try {
      const newTask = await createTodoTask(taskData)
      tasks.value.push(newTask)
    } catch (err) {
      error.value = 'Failed to create task'
      throw err
    }
  }

  const updateTask = async (id: string, taskData: ITodoTaskEdit) => {
    try {
      const updatedTask = await updateTodoTask(id, taskData)
      const index = tasks.value.findIndex((task) => task.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    } catch (err) {
      error.value = 'Failed to update task'
      throw err
    }
  }

  const removeTask = async (id: string) => {
    try {
      await deleteTodoTask(id)
      tasks.value = tasks.value.filter((task) => task.id !== id)
    } catch (err) {
      error.value = 'Failed to delete task'
      throw err
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { ...task, isCompleted: !task.isCompleted })
    }
  }

  const archiveTask = async (id: string) => {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { ...task, isArchived: true })
    }
  }

  const addCategory = async (categoryData: Omit<ITodoCategory, 'id' | 'syncDt'>) => {
    try {
      const newCategory = await createTodoCategory(categoryData)
      categories.value.push(newCategory)
      return newCategory
    } catch (err) {
      console.error('Failed to create category:', err)
      throw err
    }
  }

  const addPriority = async (priorityData: Omit<ITodoPriority, 'id' | 'syncDt'>) => {
    try {
      const newPriority = await createTodoPriority(priorityData)
      priorities.value.push(newPriority)
      return newPriority
    } catch (err) {
      console.error('Failed to create priority:', err)
      throw err
    }
  }

  const setFilters = (newFilters: Partial<IFilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    tasks,
    categories,
    priorities,
    loading,
    error,
    filters,
    filteredTasks,
    fetchTasks,
    fetchCategories,
    fetchPriorities,
    addTask,
    updateTask,
    removeTask,
    toggleTaskCompletion,
    archiveTask,
    addCategory,
    addPriority,
    setFilters,
  }
})
