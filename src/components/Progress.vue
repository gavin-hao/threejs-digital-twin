<template>
  <div class="progress">
    <div class="progress-inner">
      <el-progress :percentage="50" :indeterminate="true" :show-text="false"> </el-progress>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElProgress } from 'element-plus';
</script>
<style lang="scss" scoped>
.progress {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgb(18, 19, 40);
  .progress-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    font-size: 12px;
    transform: translate(-50%, -50%);
  }
}
</style>
