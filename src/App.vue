<script setup lang="ts">
import Layout from './components/Layout.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <Layout>
    <router-view v-slot="{ Component }">
      <transition name="fade"> <component :is="Component" /> </transition>
    </router-view>
  </Layout>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
