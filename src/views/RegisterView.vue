<template>
  <div class=" d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="card-title">
                  <i class="bi bi-person-plus me-2"></i>Create Account
                </h2>
                <p class="text-muted">Create your new account</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div class="col-12">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div class="col-12">
                    <label for="password" class="form-label">Password</label>
                    <input
                      id="password"
                      v-model="form.password"
                      type="password"
                      class="form-control"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger mt-3" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary w-100 mt-3 mb-3"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-person-plus me-2"></i>
                  {{ loading ? 'Creating account...' : 'Create account' }}
                </button>
              </form>

              <div class="text-center">
                <p class="text-muted mb-0">
                  Already have an account?
                  <router-link to="/login" class="text-decoration-none">
                    Sign in here
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.registerUser(form.value)
    router.push('/todos')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
