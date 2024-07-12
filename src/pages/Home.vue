<template>
  <div class="content">
    <nav>
      <ul class="nav">
        <li v-for="route in routes" class="nav-item button" :key="route.path">
          <RouterLink :to="route.path">{{ route.meta?.title || route.name }}</RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { routes } from '@/router';
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  padding: 24px;
  margin: 0 auto;
  font-size: 18px;
}
.nav {
  list-style: none;

  .button {
    display: inline-block;
    padding: 0.6em 1.2em;
    font-family: inherit;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border-color 0.25s;
  }
  .button + .button {
    margin-left: 10px;
  }
  .button:hover {
    border-color: #646cff;
  }

  .button:focus,
  .button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
}
</style>
