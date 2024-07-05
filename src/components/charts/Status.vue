<template>
  <div class="status-container" :class="cls">
    <div class="header" v-if="slots.title || title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = defineProps<{ title?: string; status?: 'error' | 'success'; frame?: boolean }>();
const cls = computed(() => {
  return [`status-${props.status || 'success'}`, props.frame ? 'status-container-frame' : ''];
});
const slots = useSlots();
</script>
<style lang="scss" scoped>
.status-container {
  --body-text-color: #0ff37b;
  --border-frame-color: #2ae3f3;
  --background-color: rgba(7, 85, 140, 0.3);
  --boder-color: rgba(99, 145, 180, 0.6);
  --box-shadow-color: rgba(5, 157, 222, 0.25);
  --header-background-color: rgba(7, 85, 140, 0.5);
  position: relative;
  box-sizing: border-box;
  color: #fff;
  text-align: center;
  backdrop-filter: blur(1px);
  border: 1px solid var(--boder-color);
  box-shadow: inset 0 0 30px var(--box-shadow-color);
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    font-size: 0.16rem;
    line-height: 0.3rem;
    background-color: var(--header-background-color);

    &::after,
    &::before {
      display: block;
      content: ' ';
    }
    // &::before {
    //   width: 13px;
    //   height: 11px;
    //   background: linear-gradient(45deg, #0785de, #dffaff);
    // }
    // &::after {
    //   width: 13px;
    //   height: 11px;
    //   // background: linear-gradient(45deg, #0785de, #dffaff) no-repeat;
    //   background: linear-gradient(45deg, #0785de, #dffaff);
    // }
  }
  .body {
    padding: 12px;
    font-size: 0.2rem;
    color: var(--body-text-color);
  }
  &.status-success {
    --body-text-color: #0ff37b;
  }
  &.status-error {
    --body-text-color: rgba(255, 5, 1, 1);
    --border-frame-color: rgba(255, 5, 5, 1);
    --background-color: rgba(255, 5, 1, 0.1);
    --boder-color: rgba(255, 5, 1, 0.6);
    --box-shadow-color: rgba(255, 5, 1, 0.3);
    --header-background-color: rgba(255, 5, 1, 0.2);
  }
  &.status-container-frame {
    background:
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px top -18px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px top -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px top -18px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px top -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px bottom -18px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px bottom -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px bottom -18px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px bottom -4px;
    background-repeat: no-repeat;
    background-size:
      4px 22px,
      22px 4px;
    .header {
      background-color: transparent;
    }
  }
}
</style>
