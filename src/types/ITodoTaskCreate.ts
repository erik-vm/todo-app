export interface ITodoTaskCreate {
  taskName: string
  taskSort: number
  dueDt?: string
  isCompleted: boolean
  isArchived: boolean
  todoCategoryId: string
  todoPriorityId: string
}


export interface ITodoTaskEdit extends ITodoTaskCreate {
  id: string
  syncDt?: string
}
