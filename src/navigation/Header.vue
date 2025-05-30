<script setup lang="ts">

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useAuthStore();

const logout = async () => {
  userStore.logout()

  await router.push("/login")
}

</script>



<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
      <div class="container">
        <a class="navbar-brand" href="/">Todo App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
          <ul class="navbar-nav flex-grow-1">




          </ul>

          <ul v-if="!userStore.token" class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" to="/register">Register</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" to="/login">Login</RouterLink>
            </li>
          </ul>

          <ul v-else class="navbar-nav">

            <li class="nav-item">
              <RouterLink class="nav-link text-dark" to="/todos">Todos</RouterLink>
            </li>
              <li class="nav-item">
              <RouterLink class="nav-link text-dark" to="/admin">Admin panel</RouterLink>
            </li>

            <li class="nav-item">
              <a class="nav-link text-dark d-flex align-items-center" @click=logout style="cursor: pointer;">
                Logout {{ userStore.user?.firstName }} </a>
            </li>



          </ul>

        </div>
      </div>
    </nav>
  </header>
</template>
