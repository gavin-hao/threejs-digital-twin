<template>
  <div class="status-container" :class="cls">
    <div class="status-warpper">
      <div class="header" v-if="slots.title || title">
        <div class="title">
          <slot name="title">{{ title }}</slot>
        </div>
      </div>
      <div class="body">
        <slot></slot>
      </div>
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
  --boder-color: rgba(99, 145, 180, 0.3);
  --box-shadow-color: rgba(5, 157, 222, 0.25);
  --header-background-color: rgba(7, 85, 140, 0.5);
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-self: stretch;
  padding: 0;
  color: #fff;
  text-align: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  border: 1px solid var(--boder-color);
  box-shadow: inset 0 0 30px var(--box-shadow-color);
  .status-warpper {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-self: center;
    width: 100%;
    background-color: rgb(7, 84, 140, 0.3);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 8px;
    font-size: 0.16rem;
    line-height: 0.3rem;
    .title {
      position: relative;
      flex: 1;
      padding: 4px;
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background-image: linear-gradient(
          244deg,
          rgba(255, 255, 255, 0) 0%,

          rgb(42, 227, 243) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        // background-image: linear-gradient(to right, rgba(7, 85, 140, 0.3), yellow);
      }
    }
  }
  .body {
    // width: 100%;

    display: flex;
    flex: 1;
    align-items: center;
    padding: 8px;
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
    --boder-color: rgba(255, 5, 1, 0.3);
    --box-shadow-color: rgba(255, 5, 1, 0.3);
    --header-background-color: rgba(255, 5, 1, 0.2);
  }
  &.status-container-frame {
    background:
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -2px top -16px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -2px top -2px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -2px top -16px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -2px top -2px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -2px bottom -16px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -2px bottom -2px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -2px bottom -16px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -2px bottom -2px;
    background-repeat: no-repeat;
    background-size:
      4px 22px,
      22px 4px;
    // .header {
    //   background-color: transparent;
    // }
  }
}
</style>
