<template>
  <div class="header">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 1rem;
  font-size: 0.4rem;
  font-weight: 500;
  color: #fff;
  background: url(@/assets/images/top.png) no-repeat;
  background-image: image-set(url(@/assets/images/top.png) 1x, url(@/assets/images/top@2x.png) 2x);
  background-size: 100% 1rem;
}
</style>
