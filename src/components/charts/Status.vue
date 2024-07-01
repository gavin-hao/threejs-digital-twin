<template>
  <div class="status-container" :class="cls">
    <div class="header" v-if="title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ title?: string; status?: 'error' | 'success' }>();
const cls = computed(() => {
  return [`status-${props.status || 'success'}`];
});
</script>
<style lang="scss" scoped>
.status-container {
  // padding: 0.2rem;
  position: relative;
  box-sizing: border-box;
  // border: 1px solid rgba(99, 145, 180, 0.59);
  // background:
  //   linear-gradient(#99fffe, #99fffe) left -3px top 0,
  //   linear-gradient(#99fffe, #99fffe) left -3px top -3px,
  //   linear-gradient(#99fffe, #99fffe) right -3px top 0,
  //   linear-gradient(#99fffe, #99fffe) right -3px top -3px,
  //   linear-gradient(#99fffe, #99fffe) left -3px bottom 0,
  //   linear-gradient(#99fffe, #99fffe) left -3px bottom -3px,
  //   linear-gradient(#99fffe, #99fffe) right -3px bottom 0,
  //   linear-gradient(#99fffe, #99fffe) right -3px bottom -3px;
  // background-color: rgba(247, 53, 4, 0);
  // background-repeat: no-repeat;
  // background-size:
  //   20px 20px,
  //   20px 20px;
  // background-size:
  //   3px 16px,
  //   16px 3px;
  // backdrop-filter: blur(1px);
  color: #fff;
  text-align: center;
  background: rgba(255, 255, 255, 0);
  border: 1px solid #07548c;
  // box-shadow: 0px -12px 40px 3px rgba(5, 158, 222, 0.22);
  box-shadow: inset 0 0 30px rgba(5, 158, 222, 0.22);
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    font-size: 0.18rem;
    line-height: 0.3rem;
    background: rgba(7, 84, 140, 0.3);
    &::after,
    &::before {
      display: block;
      content: ' ';
    }
    &::before {
      width: 13px;
      height: 11px;
      background: linear-gradient(45deg, #0785de, #dffaff);
    }
    &::after {
      width: 13px;
      height: 11px;
      // background: linear-gradient(45deg, #0785de, #dffaff) no-repeat;
      background: linear-gradient(45deg, #0785de, #dffaff);
    }
  }
  .body {
    margin-top: 10px;
    font-size: 0.24rem;
  }
  &.status-success {
    .body {
      color: #0ff37b;
    }
  }
  &.status-error {
    .body {
      color: #ff3701;
    }
  }
}
</style>
