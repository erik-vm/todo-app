<script setup lang="ts">
import HeaderComp from './navigation/HeaderComp.vue';
import FooterComp from './navigation/FooterComp.vue';


import { RouterView } from 'vue-router'
</script>

<template>
  <HeaderComp />
  <main class="container">
    <RouterView />
  </main>
<FooterComp/>
</template>
