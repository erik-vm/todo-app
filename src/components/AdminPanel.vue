<template>
  <div class="card">
    <div class="card-header admin-panel">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0 text-white">
          <i class="bi bi-shield-lock me-2"></i>Prohibited Words Admin
        </h5>
        <button
          @click="showPanel = !showPanel"
          class="btn btn-light btn-sm"
        >
          <i :class="showPanel ? 'bi bi-eye-slash' : 'bi bi-eye'" class="me-1"></i>
          {{ showPanel ? 'Hide Panel' : 'Show Panel' }}
        </button>
      </div>
    </div>

    <div v-if="showPanel" class="card-body">
      <!-- Add New Word -->
      <div class="mb-4">
        <label for="newWord" class="form-label fw-semibold">Add Prohibited Word</label>
        <div class="input-group">
          <input
            id="newWord"
            v-model="newWord"
            type="text"
            class="form-control"
            placeholder="Enter word to prohibit..."
            @keyup.enter="addWord"
          />
          <button
            @click="addWord"
            :disabled="!newWord.trim()"
            class="btn btn-danger"
            type="button"
          >
            <i class="bi bi-plus-circle me-1"></i>Add Word
          </button>
        </div>
      </div>

      <!-- Current Words List -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <label class="form-label fw-semibold mb-0">
            Current Prohibited Words ({{ prohibitedStore.prohibitedWords.length }})
          </label>
          <button
            @click="resetWords"
            class="btn btn-warning btn-sm"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>Reset to Default
          </button>
        </div>

        <div class="border rounded p-3 bg-light" style="max-height: 300px; overflow-y: auto;">
          <div v-if="prohibitedStore.prohibitedWords.length === 0" class="text-muted text-center py-4">
            <i class="bi bi-info-circle me-2"></i>No prohibited words configured
          </div>
          <div v-else class="d-flex flex-wrap gap-2">
            <div
              v-for="word in prohibitedStore.prohibitedWords"
              :key="word"
              class="badge bg-danger d-flex align-items-center"
              style="font-size: 0.9rem;"
            >
              <span>{{ word }}</span>
              <button
                @click="removeWord(word)"
                class="btn-close btn-close-white ms-2"
                style="font-size: 0.6rem;"
                title="Remove word"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Storage Info -->
      <div class="alert alert-info mb-4">
        <h6 class="alert-heading">
          <i class="bi bi-info-circle me-2"></i>Storage Information
        </h6>
        <p class="mb-0">
          Prohibited words are stored in localStorage and cookies for persistence.
          The list will reset to default when the application is reloaded if storage is cleared.
        </p>
      </div>

      <!-- Test Input -->
      <div>
        <label for="testInput" class="form-label fw-semibold">
          Test Input (Check for prohibited words)
        </label>
        <div class="mb-3">
          <textarea
            id="testInput"
            v-model="testInput"
            class="form-control"
            :class="{
              'is-valid': testInput.trim() && testProhibitedWords.length === 0,
              'is-invalid': testInput.trim() && testProhibitedWords.length > 0
            }"
            placeholder="Type something to test for prohibited words..."
            rows="3"
          ></textarea>
          <div v-if="testInput.trim()" class="mt-2">
            <div v-if="testProhibitedWords.length === 0" class="text-success">
              <i class="bi bi-check-circle me-1"></i>
              <strong>✅ No prohibited words found</strong>
            </div>
            <div v-else class="text-danger">
              <i class="bi bi-exclamation-triangle me-1"></i>
              <strong>❌ Found prohibited words:</strong>
              <div class="d-flex flex-wrap gap-1 mt-2">
                <span
                  v-for="word in testProhibitedWords"
                  :key="word"
                  class="badge prohibited-word-tag"
                >
                  {{ word }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProhibitedStore } from '../stores/prohibited'
import { getProhibitedWordsFromText } from '../utils/validation'

const prohibitedStore = useProhibitedStore()

const showPanel = ref(false)
const newWord = ref('')
const testInput = ref('')

const testProhibitedWords = computed(() => {
  if (!testInput.value.trim()) return []
  return getProhibitedWordsFromText(testInput.value, prohibitedStore.prohibitedWords)
})

const addWord = () => {
  const word = newWord.value.trim().toLowerCase()
  if (!word) return

  if (prohibitedStore.prohibitedWords.includes(word)) {
    alert('This word is already in the prohibited list!')
    return
  }

  prohibitedStore.addProhibitedWord(word)
  newWord.value = ''
}

const removeWord = (word: string) => {
  if (confirm(`Are you sure you want to remove "${word}" from the prohibited words list?`)) {
    prohibitedStore.removeProhibitedWord(word)
  }
}

const resetWords = () => {
  if (confirm('Are you sure you want to reset to the default prohibited words list? This will remove all custom words.')) {
    prohibitedStore.resetToDefault()
  }
}
</script>
