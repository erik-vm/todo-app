<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title mb-0">
        <i class="bi bi-funnel me-2"></i>Filters
      </h5>
    </div>

    <div class="card-body">
      <div class="row g-3">
        <!-- Status Filters -->
        <div class="col-md-3">
          <label class="form-label fw-semibold">Status</label>
          <div class="d-flex flex-column gap-2">
            <div class="form-check">
              <input
                id="showCompleted"
                v-model="localFilters.showCompleted"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label" for="showCompleted">
                <i class="bi bi-check-circle me-1"></i>Show Completed
              </label>
            </div>

            <div class="form-check">
              <input
                id="showArchived"
                v-model="localFilters.showArchived"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label" for="showArchived">
                <i class="bi bi-archive me-1"></i>Show Archived
              </label>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="col-md-3">
          <label for="categoryFilter" class="form-label fw-semibold">Category</label>
          <select
            id="categoryFilter"
            v-model="localFilters.categoryId"
            class="form-select"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.categoryName }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="col-md-3">
          <label for="priorityFilter" class="form-label fw-semibold">Priority</label>
          <select
            id="priorityFilter"
            v-model="localFilters.priorityId"
            class="form-select"
          >
            <option value="">All Priorities</option>
            <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
              {{ priority.priorityName }}
            </option>
          </select>
        </div>

        <!-- Actions -->
        <div class="col-md-3 d-flex align-items-end">
          <button
            @click="clearFilters"
            class="btn btn-outline-secondary w-100"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>Clear Filters
          </button>
        </div>
      </div>

      <!-- Filter Summary -->
      <div class="filter-summary mt-3">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-semibold">
            <i class="bi bi-list-task me-1"></i>
            {{ filteredCount }} tasks shown
          </span>
          <div class="d-flex gap-3">
            <span v-if="!localFilters.showCompleted" class="text-warning">
              <i class="bi bi-eye-slash me-1"></i>Hiding completed
            </span>
            <span v-if="!localFilters.showArchived" class="text-warning">
              <i class="bi bi-eye-slash me-1"></i>Hiding archived
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FilterOptions, TodoCategory, TodoPriority } from '../types'

interface Props {
  filters: FilterOptions
  categories: TodoCategory[]
  priorities: TodoPriority[]
  filteredCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-filters': [filters: FilterOptions]
}>()

const localFilters = ref<FilterOptions>({ ...props.filters })

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Watch for local filter changes and emit
watch(localFilters, (newFilters) => {
  emit('update-filters', { ...newFilters })
}, { deep: true })

const clearFilters = () => {
  localFilters.value = {
    showCompleted: true,
    showArchived: false,
    categoryId: undefined,
    priorityId: undefined
  }
}
</script>
