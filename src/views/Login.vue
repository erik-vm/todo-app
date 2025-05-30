<script setup lang="ts">

import { useUserDataStore } from '../stores/userDataStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useUserDataStore();

const form = ref({
  email: 'evainu@taltech.ee',
  password: 'Foobar.1'
})

const loading = ref(false)
const error = ref('')

const doLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await store.loginUser(form.value)
    router.push('/todos')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <h1>Log in</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doLogin" id="account" method="post" novalidate="novalidate">
            <div class="form-floating mb-3">
              <input v-model="form.email" class="form-control" autocomplete="username" aria-required="true"
                placeholder="name@example.com" type="email">
              <label class="form-label" for="Input_Email">Email</label>
            </div>

            <div class="form-floating mb-3">
              <input v-model="form.password" class="form-control" autocomplete="current-password" aria-required="true"
                placeholder="password" type="password">
              <label class="form-label" for="Input_Password">Password</label>
            </div>

            <div>
              <button id="login-submit" type="submit" class="w-100 btn btn-lg btn-primary">Log in</button>
            </div>

            <div>
              <p>
                <a id="forgot-password" href="/Identity/Account/ForgotPassword">Forgot your password?</a>
              </p>
              <p>
                <a href="/Identity/Account/Register?returnUrl=%2F">Register as a new user</a>
              </p>
            </div>
          </form>
        </section>
      </div>

    </div>
  </main>
</template>
