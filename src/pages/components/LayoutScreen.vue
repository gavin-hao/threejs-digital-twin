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
    <slot name="progress"></slot>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  // opacity: 0.4;

  // background: #121328cc;
  background-image: url('@/assets/images/bg.jpg'),
    radial-gradient(circle at center, rgba(9, 49, 152, 0.706) 0%, rgba(19, 30, 58, 0.9) 100%),
    linear-gradient(
      to right,
      rgba(9, 49, 152, 0.8) 0%,
      rgba(9, 49, 152, 0.5) 10%,
      rgba(9, 49, 152, 0.1) 30%,
      rgba(9, 49, 152, 0) 50%,
      rgba(9, 49, 152, 0.1) 70%,
      rgba(9, 49, 152, 0.5) 90%,
      rgba(9, 49, 152, 0.8) 100%
    );
  background-repeat: no-repeat;
  background-size: cover;
  &-content {
    width: 100vw;
    height: 100vh;
    &-left {
      position: absolute;
      top: 1rem;
      bottom: 0.2rem;
      left: 0.2rem;
      z-index: 100;
      display: flex;
      grid-gap: 10px;
      width: 25vw;
      transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
      // height: calc(100% - 1rem);
    }
    &-right {
      position: absolute;
      top: 1rem;
      right: 0.2rem;
      bottom: 0.2rem;
      z-index: 100;
      display: flex;
      grid-gap: 10px;
      width: 25vw;
      transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
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
    z-index: 100;
    width: 100%;
    &--container {
      position: relative;
    }
  }
}
</style>
