<template>
  <div class="layout">
    <div class="layout-header">
      <div class="layout-header--container"><slot name="header" /></div>
    </div>
    <div class="layout-content">
      <div class="layout-content-left">
        <slot name="left" />
      </div>
      <div class="layout-content-right">
        <slot name="right" />
      </div>
      <div class="layout-content-main">
        <slot name="main" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  // opacity: 0.4;

  background: rgba(181, 179, 179, 0.4);
  &-content {
    width: 100vw;
    height: 100vh;
    &-left {
      position: absolute;
      top: 1rem;
      left: 0.2rem;
      width: 25vw;
    }
    &-right {
      position: absolute;
      top: 1rem;
      right: 0.2rem;
      width: 25vw;
    }
    &-main {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  &-header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    &--container {
      position: relative;
    }
  }
}
</style>
