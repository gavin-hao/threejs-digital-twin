<template>
  <div :class="['card-container', backgroud ? 'card-background' : '']">
    <div class="card-header">
      <div class="icon">
        <slot name="icon">
          <img src="@/assets/images/data.png" alt="icon" />
        </slot>
      </div>
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VNode } from 'vue';
withDefaults(
  defineProps<{
    title?: string;
    icon?: VNode;
    backgroud?: boolean;
  }>(),
  {
    title: '',
    icon: undefined,
    backgroud: false,
  }
);
</script>
<style lang="scss" scoped>
.card-container {
  position: relative;
  backdrop-filter: blur(1px);

  border: 1px solid transparent;
  // padding: 8px 12px;
  &.card-background {
    // background-color: rgb(7, 84, 140, 0.3);
    background-color: rgba(0, 34, 51, 0.2);
  }
  .card-header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px;
    font-size: 0.25rem;
    font-weight: bold;
    color: #ffffff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 24px;
      height: 4px;
      content: ' ';
      background-color: #f8fb10;
    }
    .icon {
      display: inline-block;
      margin-right: 12px;
      line-height: 0;
    }
  }
  .card-body {
    padding: 12px 4px;
  }
}
</style>
