export interface TodoTask {
  id: string
  taskName: string
  taskSort: number
  createdDt: string
  dueDt?: string
  isCompleted: boolean
  isArchived: boolean
  todoCategoryId: string
  todoPriorityId: string
  syncDt: string
}

export interface TodoCategory {
  id: string
  categoryName: string
  categorySort: number
  syncDt: string
  tag?: string
}

export interface TodoPriority {
  id: string
  priorityName: string
  prioritySort: number
  syncDt: string
  tag?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface JwtResponse {
  token: string
  refreshToken: string
  firstName: string
  lastName: string
}

export interface TodoTaskCreate {
  taskName: string
  taskSort: number
  dueDt?: string
  isCompleted: boolean
  isArchived: boolean
  todoCategoryId: string
  todoPriorityId: string
}

export interface TodoTaskEdit extends TodoTaskCreate {
  id: string
  syncDt?: string
}

export interface FilterOptions {
  showCompleted: boolean
  showArchived: boolean
  categoryId?: string
  priorityId?: string
}
