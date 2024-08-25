<template>
  <div class="statistic">
    <div class="head">
      <span class="title">{{ title }}</span>
    </div>

    <div class="con">
      <span class="prefix"><slot name="prefix"></slot></span>
      <span class="num">{{ value }}</span
      ><span class="suffix"><slot name="suffix"></slot></span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string; value: string }>();
</script>
<style lang="scss" scoped>
.statistic {
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  margin: 0;
  font-feature-settings: 'tnum';
  font-variant: tabular-nums;
  color: #000;
  text-align: center;
  list-style: none;
  .head {
    margin-bottom: 4px;
    font-size: 0.18rem;
    line-height: 0.3rem;
    color: #ddd;
  }
  .con {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.22rem;
    color: #f00;
    .num {
      padding: 0 4px;
    }
    .suffix {
      font-size: 0.18rem;
      color: #e6a23c;
    }
  }
}
</style>
