<template>
  <div class="card-container">
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

defineProps<{
  title?: string;
  icon?: VNode;
}>();
</script>
<style lang="scss" scoped>
.card-container {
  position: relative;
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
