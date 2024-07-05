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
  // padding: 0.2rem;
  position: relative;
  box-sizing: border-box;
  color: #fff;
  text-align: center;

  backdrop-filter: blur(1px);
  // background: rgba(255, 255, 255, 0);
  // border: 1px solid #07548c;
  border: 1px solid rgba(99, 145, 180, 0.59);
  // box-shadow: 0px -12px 40px 3px rgba(5, 158, 222, 0.22);
  box-shadow: inset 0 0 30px rgba(5, 158, 222, 0.35);
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    font-size: 0.16rem;
    line-height: 0.3rem;
    background: rgba(7, 84, 140, 0.3);
    // margin-bottom: 8px;
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
  }
  &.status-success {
    .body {
      color: #0ff37b;
    }
  }
  --border-frame-color: #2ae3f3;
  &.status-error {
    .body {
      color: #ff3701;
    }
    .header {
      background-color: rgba(255, 5, 5, 0.1);
    }
    background-color: rgba(255, 5, 5, 0.1);
    border: 1px solid rgba(255, 5, 5, 0.3);
    box-shadow: inset 0 0 30px rgba(255, 5, 5, 0.25);
    --border-frame-color: #ff3701;
  }
  &.status-container-frame {
    background:
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -3px top 0,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -3px top -3px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -3px top 0,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -3px top -3px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -3px bottom 0,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -3px bottom -3px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -3px bottom 0,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -3px bottom -3px;
    background-repeat: no-repeat;
    // background-size:
    //   20px 20px,
    //   20px 20px;
    background-size:
      3px 16px,
      16px 3px;
    .header {
      background-color: transparent;
    }
  }
}
</style>
