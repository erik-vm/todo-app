<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            <i class="fas fa-tasks me-2"></i>
            Task Details
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <div v-if="task">
            <!-- Task Name -->
            <div class="mb-4">
              <h4
                class="mb-2"
                :class="{ 'text-decoration-line-through text-muted': task.isCompleted }"
              >
                {{ task.taskName }}
              </h4>

              <!-- Status Badges -->
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span
                  v-if="task.isCompleted"
                  class="badge bg-success fs-6"
                >
                  <i class="fas fa-check me-1"></i>
                  Completed
                </span>
                <span
                  v-else
                  class="badge bg-secondary fs-6"
                >
                  <i class="fas fa-clock me-1"></i>
                  Pending
                </span>

                <span
                  v-if="task.isArchived"
                  class="badge bg-warning text-dark fs-6"
                >
                  <i class="fas fa-archive me-1"></i>
                  Archived
                </span>

                <span
                  v-if="!task.isCompleted && isOverdue"
                  class="badge bg-danger fs-6"
                >
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  Overdue
                </span>
              </div>
            </div>

            <!-- Task Details -->
            <div class="row">
              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-folder me-2 text-primary"></i>
                      Category
                    </h6>
                    <p class="card-text">
                      {{ categoryName || 'No category assigned' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-flag me-2 text-warning"></i>
                      Priority
                    </h6>
                    <p class="card-text">
                      {{ priorityName || 'No priority assigned' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-calendar-plus me-2 text-success"></i>
                      Created Date
                    </h6>
                    <p class="card-text">
                      {{ formatDateTime(task.createdDt) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-calendar-alt me-2" :class="isOverdue ? 'text-danger' : 'text-info'"></i>
                      Due Date
                    </h6>
                    <p class="card-text" :class="{ 'text-danger fw-bold': isOverdue }">
                      {{ task.dueDt ? formatDateTime(task.dueDt) : 'No due date set' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-sort-numeric-up me-2 text-secondary"></i>
                      Sort Order
                    </h6>
                    <p class="card-text">
                      {{ task.taskSort }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card bg-light mb-3">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-sync me-2 text-muted"></i>
                      Last Synced
                    </h6>
                    <p class="card-text">
                      {{ formatDateTime(task.syncDt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="d-flex justify-content-between w-100">
            <!-- Action Buttons Left Side -->
            <div class="btn-group" role="group">
              <button
                v-if="!task?.isCompleted"
                type="button"
                class="btn btn-success btn-sm"
                @click="$emit('toggle-complete', task?.id)"
              >
                <i class="fas fa-check me-1"></i>
                Mark Complete
              </button>

              <button
                v-else
                type="button"
                class="btn btn-outline-secondary btn-sm"
                @click="$emit('toggle-complete', task?.id)"
              >
                <i class="fas fa-undo me-1"></i>
                Mark Incomplete
              </button>

              <button
                v-if="!task?.isArchived"
                type="button"
                class="btn btn-warning btn-sm"
                @click="confirmArchive"
              >
                <i class="fas fa-archive me-1"></i>
                Archive
              </button>
            </div>

            <!-- Edit/Delete/Close Buttons Right Side -->
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="$emit('edit', task)"
              >
                <i class="fas fa-edit me-1"></i>
                Edit
              </button>

              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="confirmDelete"
              >
                <i class="fas fa-trash me-1"></i>
                Delete
              </button>

              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="$emit('close')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="modal-backdrop fade show"
    @click="$emit('close')"
  ></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import type { ITodoTask } from '@/domain/ITodoTask'

export default defineComponent({
  name: 'TodoItem',
  props: {
    task: {
      type: Object as () => ITodoTask | null,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'edit', 'delete', 'toggle-complete', 'archive'],
  setup(props, { emit }) {

const todoStore = useTodoStore()

// Computed properties
const categoryName = computed(() => {
  if (!props.task?.todoCategoryId) return ''
  const category = todoStore.categories.find(c => c.id === props.task?.todoCategoryId)
  return category?.categoryName || ''
})

const priorityName = computed(() => {
  if (!props.task?.todoPriorityId) return ''
  const priority = todoStore.priorities.find(p => p.id === props.task?.todoPriorityId)
  return priority?.priorityName || ''
})

const isOverdue = computed(() => {
  if (!props.task?.dueDt || props.task?.isCompleted) return false
  const dueDate = new Date(props.task.dueDt)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today
})

// Methods
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const confirmDelete = () => {
  if (!props.task) return

  const confirmed = confirm(`Are you sure you want to delete the task "${props.task.taskName}"? This action cannot be undone.`)
  if (confirmed) {
    emit('delete', props.task.id)
  }
}

const confirmArchive = () => {
  if (!props.task) return

  const confirmed = confirm(`Are you sure you want to archive the task "${props.task.taskName}"?`)
  if (confirmed) {
    emit('archive', props.task.id)
  }
}

return {
  categoryName,
  priorityName,
  isOverdue,
  formatDateTime,
  confirmDelete,
  confirmArchive
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

.card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.badge {
  font-size: 0.8rem;
}

.btn-group .btn {
  border-radius: 0.25rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

@media (max-width: 768px) {
  .modal-footer .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-group {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>
