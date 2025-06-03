<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">


          <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Filters & Actions</h5>
            <div class="row g-3 align-items-end">
              <div class="col-lg-2 col-md-6">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="showCompleted"
                    v-model="localFilters.showCompleted"
                    @change="updateFilters"
                  >
                  <label class="form-check-label" for="showCompleted">
                    Show Completed
                  </label>
                </div>
              </div>

              <div class="col-lg-2 col-md-6">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="showArchived"
                    v-model="localFilters.showArchived"
                    @change="updateFilters"
                  >
                  <label class="form-check-label" for="showArchived">
                    Show Archived
                  </label>
                </div>
              </div>

              <div class="col-lg-3 col-md-6">
                <label class="form-label small text-muted mb-1">Category</label>
                <div class="d-flex">
                  <select
                    class="form-select form-select-sm me-1"
                    v-model="localFilters.categoryId"
                    @change="updateFilters"
                  >
                    <option value="">All Categories</option>
                    <option
                      v-for="category in todoStore.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.categoryName }}
                    </option>
                  </select>
                  <button
                    class="btn btn-outline-secondary btn-sm flex-shrink-0"
                    @click="showCategoryManager = true"
                    title="Manage Categories"
                  >
                    <i class="fas fa-cog"></i>
                  </button>
                </div>
              </div>

              <div class="col-lg-3  col-md-6">
                <label class="form-label small text-muted mb-1">Priority</label>
                <div class="d-flex">
                  <select
                    class="form-select form-select-sm me-1"
                    v-model="localFilters.priorityId"
                    @change="updateFilters"
                  >
                    <option value="">All Priorities</option>
                    <option
                      v-for="priority in todoStore.priorities"
                      :key="priority.id"
                      :value="priority.id"
                    >
                      {{ priority.priorityName }}
                    </option>
                  </select>
                  <button
                    class="btn btn-outline-secondary btn-sm flex-shrink-0"
                    @click="showPriorityManager = true"
                    title="Manage Priorities"
                  >
                    <i class="fas fa-cog"></i>
                  </button>
                </div>
              </div>

              <div class="col-lg-2 col-md-6">
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-success btn-sm flex-fill"
                    @click="openCreateForm"
                  >
                    <i class="fas fa-plus me-1"></i>
                    Add new task
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="requestIsOngoing" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="data.errors && data.errors.length > 0" class="alert alert-danger" role="alert">
          <h6>Errors occurred:</h6>
          <ul class="mb-0">
            <li v-for="error in data.errors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- Tasks Table -->
        <div v-if="!requestIsOngoing">
          <div v-if="!filteredTasks || filteredTasks.length === 0" class="text-center py-5 text-muted">
            <i class="fas fa-inbox fa-3x mb-3"></i>
            <p class="h5">No tasks found</p>
            <p>Create your first task to get started!</p>
          </div>

          <div v-else class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>
                     Task Name
                      </th>
                      <th>
                       Sort
                      </th>
                      <th>
                        Created Date
                      </th>
                      <th>
                       Due Date
                      </th>
                      <th>
                        Category
                      </th>
                      <th>
                        Priority
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                       Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in sortedTasks" :key="item.id" :class="{
                      'table-success': item.isCompleted,
                      'table-warning': !item.isCompleted && isOverdue(item),
                      'opacity-75': item.isArchived
                    }">
                      <td>
                        <span :class="{ 'text-decoration-line-through text-muted': item.isCompleted }"
                          style="cursor: pointer;" @click="openTaskDetails(item)">
                          {{ item.taskName }}
                        </span>
                      </td>
                      <td>
                        {{ item.taskSort }}
                      </td>
                      <td>
                        {{ formatDate(item.createdDt) }}
                      </td>
                      <td>
                        <span v-if="item.dueDt" :class="{ 'text-danger fw-bold': isOverdue(item) }">
                          {{ formatDate(item.dueDt) }}
                        </span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <span class="badge bg-primary">
                          {{ getCategoryName(item.todoCategoryId) }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-warning text-dark">
                          {{ getPriorityName(item.todoPriorityId) }}
                        </span>
                      </td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          <span v-if="item.isCompleted" class="badge bg-success">
                            <i class="fas fa-check me-1"></i>Completed
                          </span>
                          <span v-if="item.isArchived" class="badge bg-secondary">
                            <i class="fas fa-archive me-1"></i>Archived
                          </span>
                          <span v-if="!item.isCompleted && isOverdue(item)" class="badge bg-danger">
                            <i class="fas fa-exclamation-triangle me-1"></i>Overdue
                          </span>
                        </div>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm" role="group">
                          <button type="button" class="btn btn-outline-primary" @click="openEditForm(item)"
                            title="Edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button type="button" class="btn btn-outline-info" @click="openTaskDetails(item)"
                            title="Details">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button v-if="!item.isCompleted" type="button" class="btn btn-outline-success"
                            @click="handleToggleComplete(item.id)" title="Mark Complete">
                            <i class="fas fa-check"></i>
                          </button>
                          <button v-else type="button" class="btn btn-outline-secondary"
                            @click="handleToggleComplete(item.id)" title="Mark Incomplete">
                            <i class="fas fa-undo"></i>
                          </button>
                          <button type="button" class="btn btn-outline-danger" @click="handleDeleteTask(item.id)"
                            title="Delete">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Todo Item Modal -->
    <div v-if="selectedTask && showTaskModal">
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-tasks me-2"></i>
                {{ selectedTask.taskName }}
              </h5>
              <button type="button" class="btn-close" @click="closeTaskModal"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Category:</strong> {{ getCategoryName(selectedTask.todoCategoryId) }}</p>
                  <p><strong>Priority:</strong> {{ getPriorityName(selectedTask.todoPriorityId) }}</p>
                  <p><strong>Sort Order:</strong> {{ selectedTask.taskSort }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Status:</strong> {{ selectedTask.isCompleted ? 'Completed' : 'Pending' }}</p>
                  <p><strong>Created:</strong> {{ formatDate(selectedTask.createdDt) }}</p>
                  <p><strong>Due Date:</strong> {{ selectedTask.dueDt ? formatDate(selectedTask.dueDt) : 'No due date'
                  }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="openEditForm(selectedTask)">
                <i class="fas fa-edit me-1"></i>Edit
              </button>
              <button type="button" class="btn btn-danger" @click="handleDeleteTask(selectedTask.id)">
                <i class="fas fa-trash me-1"></i>Delete
              </button>
              <button type="button" class="btn btn-secondary" @click="closeTaskModal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="closeTaskModal"></div>
    </div>

    <!-- Todo Form Modal -->
    <div v-if="showFormModal">
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h5>
              <button type="button" class="btn-close" @click="closeFormModal"><i class="bi bi-x-lg"></i></button>
            </div>
            <form @submit.prevent="handleQuickSave">
              <div class="modal-body">
                <!-- Form Errors -->
                <div v-if="formErrors.length > 0" class="alert alert-danger" role="alert">
                  <h6 class="alert-heading">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Please fix the following errors:
                  </h6>
                  <ul class="mb-0">
                    <li v-for="error in formErrors" :key="error">{{ error }}</li>
                  </ul>
                </div>

                <div class="mb-3">
                  <label for="taskName" class="form-label">Task Name *</label>
                  <input id="taskName" v-model="formData.taskName" type="text" class="form-control"
                    :class="{ 'is-invalid': formErrors.some(e => e.includes('Task name')) }" required
                    placeholder="Enter task name..." @input="formErrors = []">
                  <div class="form-text">
                    <i class="fas fa-info-circle me-1"></i>
                    Prohibited words: {{ prohibitedStore.prohibitedWords.join(', ') }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="categoryId" class="form-label">Category *</label>
                    <div class="input-group">
                      <select id="categoryId" v-model="formData.todoCategoryId" class="form-select" required>
                        <option value="">Select a category...</option>
                        <option v-for="category in todoStore.categories" :key="category.id" :value="category.id">
                          {{ category.categoryName }}
                        </option>
                      </select>
                      <button type="button" class="btn btn-outline-secondary"
                        @click="showNewCategoryForm = !showNewCategoryForm" title="Add new category">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>

                    <!-- New Category Form -->
                    <div v-if="showNewCategoryForm" class="mt-2 p-2 border rounded bg-light">
                      <div class="input-group input-group-sm">
                        <input v-model="newCategoryName" type="text" class="form-control"
                          placeholder="New category name..." @keyup.enter="createCategory">
                        <button type="button" class="btn btn-success" @click="createCategory"
                          :disabled="!newCategoryName.trim()">
                          <i class="fas fa-check"></i>
                        </button>
                        <button type="button" class="btn btn-secondary" @click="cancelNewCategory">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <div class="form-text mt-1">
                        <small class="text-muted">
                          <i class="fas fa-shield-alt me-1"></i>
                          Cannot contain: {{ prohibitedStore.prohibitedWords.join(', ') }}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="priorityId" class="form-label">Priority *</label>
                    <div class="input-group">
                      <select id="priorityId" v-model="formData.todoPriorityId" class="form-select" required>
                        <option value="">Select a priority...</option>
                        <option v-for="priority in todoStore.priorities" :key="priority.id" :value="priority.id">
                          {{ priority.priorityName }}
                        </option>
                      </select>
                      <button type="button" class="btn btn-outline-secondary"
                        @click="showNewPriorityForm = !showNewPriorityForm" title="Add new priority">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>

                    <!-- New Priority Form -->
                    <div v-if="showNewPriorityForm" class="mt-2 p-2 border rounded bg-light">
                      <div class="input-group input-group-sm">
                        <input v-model="newPriorityName" type="text" class="form-control"
                          placeholder="New priority name..." @keyup.enter="createPriority">
                        <button type="button" class="btn btn-success" @click="createPriority"
                          :disabled="!newPriorityName.trim()">
                          <i class="fas fa-check"></i>
                        </button>
                        <button type="button" class="btn btn-secondary" @click="cancelNewPriority">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <div class="form-text mt-1">
                        <small class="text-muted">
                          <i class="fas fa-shield-alt me-1"></i>
                          Cannot contain: {{ prohibitedStore.prohibitedWords.join(', ') }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="dueDt" class="form-label">Due Date</label>
                    <input id="dueDt" v-model="formData.dueDt" type="datetime-local" class="form-control">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="taskSort" class="form-label">Sort Order</label>
                    <input id="taskSort" v-model.number="formData.taskSort" type="number" class="form-control" min="0">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-check">
                      <input id="isCompleted" v-model="formData.isCompleted" class="form-check-input" type="checkbox">
                      <label class="form-check-label" for="isCompleted">
                        Mark as completed
                      </label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input id="isArchived" v-model="formData.isArchived" class="form-check-input" type="checkbox">
                      <label class="form-check-label" for="isArchived">
                        Archive task
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeFormModal" :disabled="isFormSubmitting">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isFormSubmitting">
                  <span v-if="isFormSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas" :class="isEditMode ? 'fa-save' : 'fa-plus'"></i>
                  {{ isEditMode ? 'Update Task' : 'Create Task' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="closeFormModal"></div>
    </div>

    <!-- Category Manager Modal -->
    <div v-if="showCategoryManager">
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-folder me-2"></i>
                Manage Categories
              </h5>
              <button type="button" class="btn-close" @click="showCategoryManager = false"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="modal-body">
              <!-- Add New Category -->
              <div class="mb-4">
                <h6>Add New Category</h6>
                <div class="input-group">
                  <input v-model="newCategoryName" type="text" class="form-control" placeholder="Category name..."
                    @keyup.enter="createCategory">
                  <button type="button" class="btn btn-success" @click="createCategory"
                    :disabled="!newCategoryName.trim()">
                    <i class="fas fa-plus me-1"></i>Add
                  </button>
                </div>
                <div class="form-text">
                  <small class="text-muted">
                    <i class="fas fa-shield-alt me-1"></i>
                    Cannot contain: {{ prohibitedStore.prohibitedWords.join(', ') }}
                  </small>
                </div>
              </div>

              <!-- Categories List -->
              <div>
                <h6>Existing Categories</h6>
                <div v-if="todoStore.categories.length === 0" class="text-muted text-center py-3">
                  No categories found
                </div>
                <div v-else class="list-group">
                  <div v-for="category in todoStore.categories" :key="category.id"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ category.categoryName }}</strong>
                      <br>
                      <small class="text-muted">Sort: {{ category.categorySort }}</small>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm"
                      @click="deleteCategory(category.id, category.categoryName)" title="Delete Category">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCategoryManager = false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="showCategoryManager = false"></div>
    </div>

    <!-- Priority Manager Modal -->
    <div v-if="showPriorityManager">
      <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-flag me-2"></i>
                Manage Priorities
              </h5>
              <button type="button" class="btn-close" @click="showPriorityManager = false"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="modal-body">
              <!-- Add New Priority -->
              <div class="mb-4">
                <h6>Add New Priority</h6>
                <div class="input-group">
                  <input v-model="newPriorityName" type="text" class="form-control" placeholder="Priority name..."
                    @keyup.enter="createPriority">
                  <button type="button" class="btn btn-success" @click="createPriority"
                    :disabled="!newPriorityName.trim()">
                    <i class="fas fa-plus me-1"></i>Add
                  </button>
                </div>
                <div class="form-text">
                  <small class="text-muted">
                    <i class="fas fa-shield-alt me-1"></i>
                    Cannot contain: {{ prohibitedStore.prohibitedWords.join(', ') }}
                  </small>
                </div>
              </div>

              <!-- Priorities List -->
              <div>
                <h6>Existing Priorities</h6>
                <div v-if="todoStore.priorities.length === 0" class="text-muted text-center py-3">
                  No priorities found
                </div>
                <div v-else class="list-group">
                  <div v-for="priority in todoStore.priorities" :key="priority.id"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ priority.priorityName }}</strong>
                      <br>
                      <small class="text-muted">Sort: {{ priority.prioritySort }}</small>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm"
                      @click="deletePriority(priority.id, priority.priorityName)" title="Delete Priority">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPriorityManager = false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="showPriorityManager = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ITodoTask } from "@/domain/ITodoTask";
import { useTodoStore } from "@/stores/todoStore";
import { useProhibitedStore } from "@/stores/prohibitedWordsStore";
import { IResultObject } from "@/types/IResultObject";
import type { IFilterOptions } from '@/types/IFilterOptions'
import { ref, reactive, onMounted, computed } from "vue";

const requestIsOngoing = ref(false);
const data = reactive<IResultObject<ITodoTask[]>>({});
const todoStore = useTodoStore()
const prohibitedStore = useProhibitedStore()

// Modal state
const showTaskModal = ref(false)
const showFormModal = ref(false)
const selectedTask = ref<ITodoTask | null>(null)
const taskToEdit = ref<ITodoTask | null>(null)
const isEditMode = ref(false)

// Local filters
const localFilters = ref<IFilterOptions>({
  showCompleted: true,
  showArchived: false,
  categoryId: undefined,
  priorityId: undefined,
})

// Form data for the modal
const formData = ref({
  taskName: '',
  taskSort: 0,
  dueDt: '',
  isCompleted: false,
  isArchived: false,
  todoCategoryId: '',
  todoPriorityId: ''
})

// New category/priority form state
const showNewCategoryForm = ref(false)
const showNewPriorityForm = ref(false)
const newCategoryName = ref('')
const newPriorityName = ref('')

// Form validation state
const formErrors = ref<string[]>([])
const isFormSubmitting = ref(false)

// Management modals state
const showCategoryManager = ref(false)
const showPriorityManager = ref(false)

// Computed properties
const filteredTasks = computed(() => {
  if (!data.data) return []

  return data.data.filter((task) => {
    if (!localFilters.value.showCompleted && task.isCompleted) return false
    if (!localFilters.value.showArchived && task.isArchived) return false
    if (localFilters.value.categoryId && task.todoCategoryId !== localFilters.value.categoryId) return false
    if (localFilters.value.priorityId && task.todoPriorityId !== localFilters.value.priorityId) return false
    return true
  })
})

const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort((a, b) => {
    // Sort by completion status first (incomplete first)
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }
    // Then by task sort order
    return a.taskSort - b.taskSort
  })
})

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try {
    // Fixed: await the fetchTasks call and get the result
    const result = await todoStore.fetchTasks();

    // Also fetch categories and priorities for filters
    await todoStore.fetchCategories();
    await todoStore.fetchPriorities();


    // Use the store's tasks data
    data.data = todoStore.tasks;
    // Handle errors if the result has them
    if (result && result.errors) {
      data.errors = result.errors;
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    data.errors = ['Failed to fetch tasks'];
  } finally {
    requestIsOngoing.value = false;
  }
};



const openTaskDetails = (task: ITodoTask) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const openCreateForm = () => {
  taskToEdit.value = null
  isEditMode.value = false
  formData.value = {
    taskName: '',
    taskSort: getNextSortOrder(),
    dueDt: '',
    isCompleted: false,
    isArchived: false,
    todoCategoryId: '',
    todoPriorityId: ''
  }
  showFormModal.value = true
}

const openEditForm = (task: ITodoTask) => {
  taskToEdit.value = task
  isEditMode.value = true
  formData.value = {
    taskName: task.taskName,
    taskSort: task.taskSort,
    dueDt: task.dueDt ? formatDateForInput(task.dueDt) : '',
    isCompleted: task.isCompleted,
    isArchived: task.isArchived,
    todoCategoryId: task.todoCategoryId,
    todoPriorityId: task.todoPriorityId
  }
  showTaskModal.value = false
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  taskToEdit.value = null
  isEditMode.value = false
  formData.value = {
    taskName: '',
    taskSort: 0,
    dueDt: '',
    isCompleted: false,
    isArchived: false,
    todoCategoryId: '',
    todoPriorityId: ''
  }
  // Reset new category/priority forms
  showNewCategoryForm.value = false
  showNewPriorityForm.value = false
  newCategoryName.value = ''
  newPriorityName.value = ''

  // Reset form validation
  formErrors.value = []
  isFormSubmitting.value = false
}

const getNextSortOrder = (): number => {
  if (!data.data || data.data.length === 0) return 1
  const maxSort = Math.max(...data.data.map(t => t.taskSort), 0)
  return maxSort + 1
}

const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const handleQuickSave = async () => {
  if (!validateTaskForm()) {
    return
  }

  isFormSubmitting.value = true

  try {
    const taskData = {
      ...formData.value,
      dueDt: formData.value.dueDt || undefined
    }

    if (isEditMode.value && taskToEdit.value) {
      await todoStore.updateTask(taskToEdit.value.id, {
        ...taskData,
        id: taskToEdit.value.id,
        syncDt: taskToEdit.value.syncDt
      })
    } else {
      await todoStore.addTask(taskData)
    }

    closeFormModal()
    await fetchPageData() // Refresh the data
  } catch (error) {
    console.error('Error saving task:', error)
    formErrors.value.push('Failed to save task. Please try again.')
  } finally {
    isFormSubmitting.value = false
  }
}

const handleDeleteTask = async (taskId: string) => {
  const confirmed = confirm('Are you sure you want to delete this task?')
  if (confirmed) {
    try {
      await todoStore.removeTask(taskId)
      closeTaskModal()
      await fetchPageData() // Refresh the data
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
}

const handleToggleComplete = async (taskId: string) => {
  try {
    await todoStore.toggleTaskCompletion(taskId)
    await fetchPageData() // Refresh the data
  } catch (error) {
    console.error('Error toggling task completion:', error)
  }
}

const getCategoryName = (categoryId: string): string => {
  const category = todoStore.categories.find(c => c.id === categoryId)
  return category?.categoryName || 'Unknown'
}

const getPriorityName = (priorityId: string): string => {
  const priority = todoStore.priorities.find(p => p.id === priorityId)
  return priority?.priorityName || 'Unknown'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const isOverdue = (task: ITodoTask): boolean => {
  if (!task.dueDt || task.isCompleted) return false
  const dueDate = new Date(task.dueDt)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today
}

const createCategory = async () => {
  if (!newCategoryName.value.trim()) return

  // Check for prohibited words in category name
  const prohibitedWordsFound = checkForProhibitedWords(newCategoryName.value)
  if (prohibitedWordsFound.length > 0) {
    alert(`Category name contains prohibited words: ${prohibitedWordsFound.join(', ')}`)
    return
  }

  try {
    const categoryData = {
      categoryName: newCategoryName.value.trim(),
      categorySort: todoStore.categories.length + 1
    }

    const newCategory = await todoStore.addCategory(categoryData)
    formData.value.todoCategoryId = newCategory.id
    cancelNewCategory()
    // Refresh categories
    await todoStore.fetchCategories()
  } catch (error) {
    console.error('Error creating category:', error)
  }
}

const cancelNewCategory = () => {
  showNewCategoryForm.value = false
  newCategoryName.value = ''
}

const createPriority = async () => {
  if (!newPriorityName.value.trim()) return

  // Check for prohibited words in priority name
  const prohibitedWordsFound = checkForProhibitedWords(newPriorityName.value)
  if (prohibitedWordsFound.length > 0) {
    alert(`Priority name contains prohibited words: ${prohibitedWordsFound.join(', ')}`)
    return
  }

  try {
    const priorityData = {
      priorityName: newPriorityName.value.trim(),
      prioritySort: todoStore.priorities.length + 1
    }

    const newPriority = await todoStore.addPriority(priorityData)
    formData.value.todoPriorityId = newPriority.id
    cancelNewPriority()
    // Refresh priorities
    await todoStore.fetchPriorities()
  } catch (error) {
    console.error('Error creating priority:', error)
  }
}

const cancelNewPriority = () => {
  showNewPriorityForm.value = false
  newPriorityName.value = ''
}

const checkForProhibitedWords = (text: string): string[] => {
  const foundWords: string[] = []
  const textLower = text.toLowerCase()

  prohibitedStore.prohibitedWords.forEach(word => {
    if (textLower.includes(word.toLowerCase())) {
      foundWords.push(word)
    }
  })

  return foundWords
}

const validateTaskForm = (): boolean => {
  formErrors.value = []

  // Check for empty task name
  if (!formData.value.taskName.trim()) {
    formErrors.value.push('Task name is required')
    return false
  }

  // Check for prohibited words in task name
  const prohibitedWordsFound = checkForProhibitedWords(formData.value.taskName)
  if (prohibitedWordsFound.length > 0) {
    formErrors.value.push(`Task name contains prohibited words: ${prohibitedWordsFound.join(', ')}`)
    return false
  }

  // Check required fields
  if (!formData.value.todoCategoryId) {
    formErrors.value.push('Category is required')
  }

  if (!formData.value.todoPriorityId) {
    formErrors.value.push('Priority is required')
  }

  return formErrors.value.length === 0
}

const deleteCategory = async (categoryId: string, categoryName: string) => {
  // Check if category is being used by any tasks
  const tasksUsingCategory = data.data?.filter(task => task.todoCategoryId === categoryId) || []

  if (tasksUsingCategory.length > 0) {
    alert(`Cannot delete category "${categoryName}" because it is being used by ${tasksUsingCategory.length} task(s).`)
    return
  }

  const confirmed = confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)
  if (confirmed) {
    try {
      await todoStore.removeCategory(categoryId)
      await todoStore.fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category. Please try again.')
    }
  }
}

const deletePriority = async (priorityId: string, priorityName: string) => {
  // Check if priority is being used by any tasks
  const tasksUsingPriority = data.data?.filter(task => task.todoPriorityId === priorityId) || []

  if (tasksUsingPriority.length > 0) {
    alert(`Cannot delete priority "${priorityName}" because it is being used by ${tasksUsingPriority.length} task(s).`)
    return
  }

  const confirmed = confirm(`Are you sure you want to delete the priority "${priorityName}"? This action cannot be undone.`)
  if (confirmed) {
    try {
      await todoStore.removePriority(priorityId)
      await todoStore.fetchPriorities()
    } catch (error) {
      console.error('Error deleting priority:', error)
      alert('Failed to delete priority. Please try again.')
    }
  }
}

onMounted(async () => {
  // Load prohibited words
  prohibitedStore.loadProhibitedWords()
  // Fetch page data
  await fetchPageData();
});
</script>

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
}

.btn-group .btn {
  border-radius: 0.25rem;
  margin-right: 0.125rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.badge {
  font-size: 0.75rem;
}

.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1050;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.input-group .btn {
  border-left: none;
}

@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn-group .btn {
    margin-right: 0;
  }
}
</style>
