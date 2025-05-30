<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    @click.self="handleCancel"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            <i class="fas" :class="isEdit ? 'fa-edit' : 'fa-plus'" class="me-2"></i>
            {{ isEdit ? 'Edit Task' : 'Create New Task' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="handleCancel"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Task Name -->
            <div class="mb-3">
              <label for="taskName" class="form-label required">
                <i class="fas fa-tasks me-2"></i>Task Name
              </label>
              <input
                id="taskName"
                v-model="formData.taskName"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.taskName }"
                placeholder="Enter task name..."
                required
              >
              <div v-if="errors.taskName" class="invalid-feedback">
                {{ errors.taskName }}
              </div>
            </div>

            <div class="row">
              <!-- Category -->
              <div class="col-md-6 mb-3">
                <label for="categoryId" class="form-label required">
                  <i class="fas fa-folder me-2"></i>Category
                </label>
                <div class="input-group">
                  <select
                    id="categoryId"
                    v-model="formData.todoCategoryId"
                    class="form-select"
                    :class="{ 'is-invalid': errors.todoCategoryId }"
                    required
                  >
                    <option value="">Select a category...</option>
                    <option
                      v-for="category in todoStore.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.categoryName }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showNewCategoryForm = !showNewCategoryForm"
                    title="Add new category"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div v-if="errors.todoCategoryId" class="invalid-feedback d-block">
                  {{ errors.todoCategoryId }}
                </div>

                <!-- New Category Form -->
                <div v-if="showNewCategoryForm" class="mt-2 p-2 border rounded bg-light">
                  <div class="input-group input-group-sm">
                    <input
                      v-model="newCategoryName"
                      type="text"
                      class="form-control"
                      placeholder="New category name..."
                    >
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="createCategory"
                      :disabled="!newCategoryName.trim()"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="cancelNewCategory"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <!-- Priority -->
              <div class="col-md-6 mb-3">
                <label for="priorityId" class="form-label required">
                  <i class="fas fa-flag me-2"></i>Priority
                </label>
                <div class="input-group">
                  <select
                    id="priorityId"
                    v-model="formData.todoPriorityId"
                    class="form-select"
                    :class="{ 'is-invalid': errors.todoPriorityId }"
                    required
                  >
                    <option value="">Select a priority...</option>
                    <option
                      v-for="priority in todoStore.priorities"
                      :key="priority.id"
                      :value="priority.id"
                    >
                      {{ priority.priorityName }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showNewPriorityForm = !showNewPriorityForm"
                    title="Add new priority"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div v-if="errors.todoPriorityId" class="invalid-feedback d-block">
                  {{ errors.todoPriorityId }}
                </div>

                <!-- New Priority Form -->
                <div v-if="showNewPriorityForm" class="mt-2 p-2 border rounded bg-light">
                  <div class="input-group input-group-sm">
                    <input
                      v-model="newPriorityName"
                      type="text"
                      class="form-control"
                      placeholder="New priority name..."
                    >
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="createPriority"
                      :disabled="!newPriorityName.trim()"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="cancelNewPriority"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Due Date -->
              <div class="col-md-6 mb-3">
                <label for="dueDt" class="form-label">
                  <i class="fas fa-calendar-alt me-2"></i>Due Date
                </label>
                <input
                  id="dueDt"
                  v-model="formData.dueDt"
                  type="datetime-local"
                  class="form-control"
                >
                <div class="form-text">Optional - leave empty if no due date</div>
              </div>

              <!-- Task Sort -->
              <div class="col-md-6 mb-3">
                <label for="taskSort" class="form-label">
                  <i class="fas fa-sort-numeric-up me-2"></i>Sort Order
                </label>
                <input
                  id="taskSort"
                  v-model.number="formData.taskSort"
                  type="number"
                  class="form-control"
                  min="0"
                  step="1"
                >
                <div class="form-text">Lower numbers appear first</div>
              </div>
            </div>

            <!-- Status Options -->
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-toggle-on me-2"></i>Status Options
              </label>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      id="isCompleted"
                      v-model="formData.isCompleted"
                      class="form-check-input"
                      type="checkbox"
                    >
                    <label class="form-check-label" for="isCompleted">
                      <i class="fas fa-check me-1"></i>Mark as completed
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      id="isArchived"
                      v-model="formData.isArchived"
                      class="form-check-input"
                      type="checkbox"
                    >
                    <label class="form-check-label" for="isArchived">
                      <i class="fas fa-archive me-1"></i>Archive task
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas" :class="isEdit ? 'fa-save' : 'fa-plus'"></i>
              {{ isEdit ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="modal-backdrop fade show"
    @click="handleCancel"
  ></div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

export default defineComponent({
  name: 'TodoForm',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const todoStore = useTodoStore()

    // Form state
    const loading = ref(false)
    const errors = ref({})
    const showNewCategoryForm = ref(false)
    const showNewPriorityForm = ref(false)
    const newCategoryName = ref('')
    const newPriorityName = ref('')

    // Form data
    const formData = ref({
      taskName: '',
      taskSort: 0,
      dueDt: '',
      isCompleted: false,
      isArchived: false,
      todoCategoryId: '',
      todoPriorityId: ''
    })

    // Computed properties
    const isFormValid = computed(() => {
      return formData.value.taskName.trim() !== '' &&
             formData.value.todoCategoryId !== '' &&
             formData.value.todoPriorityId !== ''
    })

    // Methods
    const resetForm = () => {
      formData.value = {
        taskName: '',
        taskSort: getNextSortOrder(),
        dueDt: '',
        isCompleted: false,
        isArchived: false,
        todoCategoryId: '',
        todoPriorityId: ''
      }
      errors.value = {}
      showNewCategoryForm.value = false
      showNewPriorityForm.value = false
      newCategoryName.value = ''
      newPriorityName.value = ''
    }

    const getNextSortOrder = () => {
      if (todoStore.tasks.length === 0) return 1
      const maxSort = Math.max(...todoStore.tasks.map(t => t.taskSort), 0)
      return maxSort + 1
    }

    const populateForm = (task) => {
      if (!task) return

      formData.value = {
        taskName: task.taskName,
        taskSort: task.taskSort,
        dueDt: task.dueDt ? formatDateForInput(task.dueDt) : '',
        isCompleted: task.isCompleted,
        isArchived: task.isArchived,
        todoCategoryId: task.todoCategoryId,
        todoPriorityId: task.todoPriorityId
      }
    }

    const formatDateForInput = (dateString) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const validateForm = () => {
      errors.value = {}

      if (!formData.value.taskName.trim()) {
        errors.value.taskName = 'Task name is required'
      }

      if (!formData.value.todoCategoryId) {
        errors.value.todoCategoryId = 'Category is required'
      }

      if (!formData.value.todoPriorityId) {
        errors.value.todoPriorityId = 'Priority is required'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        const taskData = {
          ...formData.value,
          dueDt: formData.value.dueDt || undefined
        }

        if (props.isEdit && props.task) {
          const editData = {
            ...taskData,
            id: props.task.id,
            syncDt: props.task.syncDt
          }
          await todoStore.updateTask(props.task.id, editData)
        } else {
          await todoStore.addTask(taskData)
        }

        emit('save')
        resetForm()
      } catch (error) {
        console.error('Error saving task:', error)
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      resetForm()
      emit('close')
    }

    const createCategory = async () => {
      if (!newCategoryName.value.trim()) return

      try {
        const categoryData = {
          categoryName: newCategoryName.value.trim(),
          categorySort: todoStore.categories.length + 1
        }

        const newCategory = await todoStore.addCategory(categoryData)
        formData.value.todoCategoryId = newCategory.id
        cancelNewCategory()
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

      try {
        const priorityData = {
          priorityName: newPriorityName.value.trim(),
          prioritySort: todoStore.priorities.length + 1
        }

        const newPriority = await todoStore.addPriority(priorityData)
        formData.value.todoPriorityId = newPriority.id
        cancelNewPriority()
      } catch (error) {
        console.error('Error creating priority:', error)
      }
    }

    const cancelNewPriority = () => {
      showNewPriorityForm.value = false
      newPriorityName.value = ''
    }

    // Watchers
    watch(() => props.show, async (newShow) => {
      if (newShow) {
        if (props.isEdit && props.task) {
          populateForm(props.task)
        } else {
          resetForm()
        }
        await nextTick()
        // Focus on the task name input
        const taskNameInput = document.getElementById('taskName')
        if (taskNameInput) {
          taskNameInput.focus()
        }
      }
    })

    watch(() => props.task, (newTask) => {
      if (newTask && props.isEdit) {
        populateForm(newTask)
      }
    })

    return {
      // Store
      todoStore,
      // Reactive data
      loading,
      errors,
      showNewCategoryForm,
      showNewPriorityForm,
      newCategoryName,
      newPriorityName,
      formData,
      // Computed
      isFormValid,
      // Methods
      handleSubmit,
      handleCancel,
      createCategory,
      cancelNewCategory,
      createPriority,
      cancelNewPriority
    }
  }
})
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.required::after {
  content: " *";
  color: #dc3545;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.input-group .btn {
  border-left: none;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .row > .col-md-6 {
    margin-bottom: 1rem;
  }
}
</style>
