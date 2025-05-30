<template>
  <div class="card">
    <div class="card-header">
      <h4 class="card-title mb-0">
        <i class="bi bi-plus-circle me-2"></i>
        {{ editingTask ? 'Edit Task' : 'Add New Task' }}
      </h4>
    </div>

    <div class="card-body">
      <!-- Setup Warning -->
      <div v-if="!categories.length || !priorities.length" class="alert alert-warning mb-4">
        <h6 class="alert-heading">
          <i class="bi bi-exclamation-triangle me-2"></i>Setup Required
        </h6>
        <p class="mb-2">To create tasks, you need at least one category and one priority.</p>
        <div class="d-flex gap-2">
          <span v-if="!categories.length" class="badge bg-warning text-dark">No categories</span>
          <span v-if="!priorities.length" class="badge bg-warning text-dark">No priorities</span>
        </div>
        <p class="mb-0 mt-2 small">Use the quick-add section below to create them.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <!-- Task Name -->
          <div class="col-12">
            <label for="taskName" class="form-label">
              Task Name <span class="text-danger">*</span>
            </label>
            <input
              id="taskName"
              v-model="form.taskName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': prohibitedWordsError }"
              placeholder="Enter task name..."
              required
              :disabled="!canCreateTask"
            />
            <div v-if="prohibitedWordsError" class="invalid-feedback">
              Contains prohibited words:
              <span
                v-for="word in prohibitedWordsError"
                :key="word"
                class="badge prohibited-word-tag me-1"
              >
                {{ word }}
              </span>
            </div>
          </div>

          <!-- Category and Priority -->
          <div class="col-md-6">
            <label for="category" class="form-label">
              Category <span class="text-danger">*</span>
            </label>
            <select
              id="category"
              v-model="form.todoCategoryId"
              class="form-select"
              required
              :disabled="!categories.length"
            >
              <option value="">{{ categories.length ? 'Select Category' : 'No categories available' }}</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.categoryName }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="priority" class="form-label">
              Priority <span class="text-danger">*</span>
            </label>
            <select
              id="priority"
              v-model="form.todoPriorityId"
              class="form-select"
              required
              :disabled="!priorities.length"
            >
              <option value="">{{ priorities.length ? 'Select Priority' : 'No priorities available' }}</option>
              <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
                {{ priority.priorityName }}
              </option>
            </select>
          </div>

          <!-- Due Date and Sort Order -->
          <div class="col-md-6">
            <label for="dueDate" class="form-label">Due Date</label>
            <input
              id="dueDate"
              v-model="form.dueDt"
              type="datetime-local"
              class="form-control"
              :disabled="!canCreateTask"
            />
          </div>

          <div class="col-md-6">
            <label for="taskSort" class="form-label">Sort Order</label>
            <input
              id="taskSort"
              v-model.number="form.taskSort"
              type="number"
              min="0"
              class="form-control"
              :disabled="!canCreateTask"
            />
          </div>

          <!-- Status Checkboxes -->
          <div class="col-12">
            <div class="d-flex gap-4">
              <div class="form-check">
                <input
                  id="isCompleted"
                  v-model="form.isCompleted"
                  class="form-check-input"
                  type="checkbox"
                  :disabled="!canCreateTask"
                />
                <label class="form-check-label" for="isCompleted">
                  <i class="bi bi-check-circle me-1"></i>Completed
                </label>
              </div>

              <div class="form-check">
                <input
                  id="isArchived"
                  v-model="form.isArchived"
                  class="form-check-input"
                  type="checkbox"
                  :disabled="!canCreateTask"
                />
                <label class="form-check-label" for="isArchived">
                  <i class="bi bi-archive me-1"></i>Archived
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button
            v-if="editingTask"
            type="button"
            @click="cancelEdit"
            class="btn btn-secondary"
          >
            <i class="bi bi-x-circle me-1"></i>Cancel
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else :class="editingTask ? 'bi bi-save' : 'bi bi-plus-circle'" class="me-1"></i>
            {{ loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Add Task') }}
          </button>
        </div>
      </form>

      <!-- Quick Add Section -->
      <hr class="my-4">
      <div class="row g-3">
        <div class="col-12">
          <h6 class="text-muted mb-3">
            <i class="bi bi-lightning me-1"></i>Quick Setup
          </h6>
        </div>

        <div class="col-md-6">
          <label class="form-label small">Add Category</label>
          <div class="input-group">
            <input
              v-model="newCategoryName"
              type="text"
              class="form-control form-control-sm"
              placeholder="Category name"
              @keyup.enter="addCategory"
            />
            <button
              @click="addCategory"
              :disabled="!newCategoryName.trim()"
              class="btn btn-success btn-sm"
              type="button"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="form-text">
            Categories: {{ categories.length }}
            <span v-if="categories.length === 0" class="text-warning">⚠️ Required</span>
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label small">Add Priority</label>
          <div class="input-group">
            <input
              v-model="newPriorityName"
              type="text"
              class="form-control form-control-sm"
              placeholder="Priority name"
              @keyup.enter="addPriority"
            />
            <button
              @click="addPriority"
              :disabled="!newPriorityName.trim()"
              class="btn btn-success btn-sm"
              type="button"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="form-text">
            Priorities: {{ priorities.length }}
            <span v-if="priorities.length === 0" class="text-warning">⚠️ Required</span>
          </div>
        </div>

        <!-- Quick defaults -->
        <div class="col-12">
          <div class="d-flex gap-2 flex-wrap">
            <button
              v-if="!categories.length"
              @click="addQuickCategory('Personal')"
              class="btn btn-outline-primary btn-sm"
            >
              + Personal
            </button>
            <button
              v-if="!categories.length"
              @click="addQuickCategory('Work')"
              class="btn btn-outline-primary btn-sm"
            >
              + Work
            </button>
            <button
              v-if="!priorities.length"
              @click="addQuickPriority('High')"
              class="btn btn-outline-secondary btn-sm"
            >
              + High Priority
            </button>
            <button
              v-if="!priorities.length"
              @click="addQuickPriority('Normal')"
              class="btn btn-outline-secondary btn-sm"
            >
              + Normal Priority
            </button>
            <button
              v-if="!priorities.length"
              @click="addQuickPriority('Low')"
              class="btn btn-outline-secondary btn-sm"
            >
              + Low Priority
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProhibitedStore } from '../stores/prohibited'
import { TodoTask, TodoCategory, TodoPriority, TodoTaskCreate, TodoTaskEdit } from '../types'
import { getProhibitedWordsFromText, containsProhibitedWords } from '../utils/validation'

interface Props {
  editingTask?: TodoTask | null
  categories: TodoCategory[]
  priorities: TodoPriority[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editingTask: null,
  loading: false
})

const emit = defineEmits<{
  'submit': [data: TodoTaskCreate | TodoTaskEdit]
  'cancel': []
  'add-category': [name: string]
  'add-priority': [name: string]
}>()

const prohibitedStore = useProhibitedStore()

const form = ref<TodoTaskCreate>({
  taskName: '',
  taskSort: 0,
  dueDt: undefined,
  isCompleted: false,
  isArchived: false,
  todoCategoryId: '',
  todoPriorityId: ''
})

const newCategoryName = ref('')
const newPriorityName = ref('')

const canCreateTask = computed(() => props.categories.length > 0 && props.priorities.length > 0)

// Watch for editing task changes
watch(() => props.editingTask, (newTask) => {
  if (newTask) {
    form.value = {
      taskName: newTask.taskName,
      taskSort: newTask.taskSort,
      dueDt: newTask.dueDt,
      isCompleted: newTask.isCompleted,
      isArchived: newTask.isArchived,
      todoCategoryId: newTask.todoCategoryId,
      todoPriorityId: newTask.todoPriorityId
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const prohibitedWordsError = computed(() => {
  if (!form.value.taskName.trim()) return null

  const foundWords = getProhibitedWordsFromText(form.value.taskName, prohibitedStore.prohibitedWords)
  return foundWords.length > 0 ? foundWords : null
})

const isFormValid = computed(() => {
  return canCreateTask.value &&
         form.value.taskName.trim() &&
         form.value.todoCategoryId &&
         form.value.todoPriorityId &&
         !prohibitedWordsError.value
})

const handleSubmit = () => {
  if (!isFormValid.value) return

  if (props.editingTask) {
    const editData: TodoTaskEdit = {
      ...form.value,
      id: props.editingTask.id,
      syncDt: props.editingTask.syncDt
    }
    emit('submit', editData)
  } else {
    emit('submit', form.value)
  }
}

const cancelEdit = () => {
  emit('cancel')
  resetForm()
}

const resetForm = () => {
  form.value = {
    taskName: '',
    taskSort: 0,
    dueDt: undefined,
    isCompleted: false,
    isArchived: false,
    todoCategoryId: '',
    todoPriorityId: ''
  }
}

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return

  if (containsProhibitedWords(newCategoryName.value, prohibitedStore.prohibitedWords)) {
    alert('Category name contains prohibited words!')
    return
  }

  emit('add-category', newCategoryName.value.trim())
  newCategoryName.value = ''
}

const addPriority = async () => {
  if (!newPriorityName.value.trim()) return

  if (containsProhibitedWords(newPriorityName.value, prohibitedStore.prohibitedWords)) {
    alert('Priority name contains prohibited words!')
    return
  }

  emit('add-priority', newPriorityName.value.trim())
  newPriorityName.value = ''
}

const addQuickCategory = (name: string) => {
  emit('add-category', name)
}

const addQuickPriority = (name: string) => {
  emit('add-priority', name)
}
</script>
```# Vue 3 + TypeScript Todo Management Project

## 📁 Complete Project Structure

Copy each file below into your project directory:
