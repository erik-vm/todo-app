<script setup lang="ts">
import { register } from '@/services/API';
import type { ILoginRequest } from '@/types/ILoginRequest';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useUserDataStore();


const form  = ref({
  firstName: '',
lastName: '',
  email: '',
  password: '',
})



const error = ref<string | null>(null);



const doRegister = async () => {

}
</script>

<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <h1>Register</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doRegister" id="register" method="post" novalidate="novalidate">

            <div class="form-floating mb-3">
              <input v-model="form.firstName" class="form-control" autocomplete="first-name" aria-required="true"
                placeholder="first name" type="text">
              <label class="form-label" for="Input_Password">First name</label>
            </div>

            <div class="form-floating mb-3">
              <input v-model="form.lastName" class="form-control" autocomplete="last-name" aria-required="true"
                placeholder="last name" type="text">
              <label class="form-label" for="Input_Password">Last name</label>
            </div>

            <div class="form-floating mb-3">
              <input v-model="form.email" class="form-control" autocomplete="email" aria-required="true"
                placeholder="name@example.com" type="email">
              <label class="form-label" for="Input_Email">Email</label>
            </div>

            <div class="form-floating mb-3">
              <input v-model="form.password" class="form-control" autocomplete="password" aria-required="true"
                placeholder="password" type="password">
              <label class="form-label" for="Input_Password">Password</label>
            </div>





            <div>
              <button id="register-submit" type="submit" class="w-100 btn btn-lg btn-primary">Register</button>
            </div>

            <div>

              <p>
                <a href="/Identity/Account/Login">Already a user? Login</a>
              </p>
            </div>
          </form>
        </section>
      </div>

    </div>
  </main>
</template>
