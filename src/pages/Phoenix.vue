<template>
  <LayoutScreen>
    <template #header>
      <Header>
        <div class="title">菲尼克斯电气数字孪生平台</div>
      </Header>
    </template>
    <template #left>
      <Card title="空压机">
        <div class="status-list col-3">
          <Status v-for="i in 7" :status="i == 3 ? 'error' : 'success'" :title="`空压机${i}`" :key="i">
            状态{{ i == 3 ? '异常' : '正常' }}
          </Status>
        </div>
      </Card>
      <Card title="波峰焊">
        <div class="status-list col-3">
          <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :key="i">
            <template #title>空压机{{ i }}</template>
            状态{{ i == 5 ? '异常' : '正常' }}
          </Status>
        </div>
      </Card>
    </template>
    <template #right>
      <Card title="注塑机">
        <div class="status-list col-2">
          <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :key="i">
            <template #title>空压机{{ i }}</template>
            状态{{ i == 5 ? '异常' : '正常' }}
          </Status>
        </div>
      </Card>
      <Card title="冲压机">
        <div class="status-list col-2">
          <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :key="i">
            <div>冲压机{{ i }}</div>
            状态{{ i == 5 ? '异常' : '正常' }}
          </Status>
        </div>
      </Card>
    </template>
    <template #main>
      <Scene />
    </template>
  </LayoutScreen>
</template>
<script setup lang="ts">
import LayoutScreen from '@/pages/components/LayoutScreen.vue';
import Header from '@/pages/components/Header.vue';
import Card from '@/components/Card.vue';
import Status from '@/components/charts/Status.vue';
import Scene from './Scene.vue';
</script>
<style lang="scss" scoped>
.title {
  background: linear-gradient(181deg, #8fe1ff 0%, #dffaff 99.31640625%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.status-list {
  display: grid;
  grid-auto-rows: 1fr;
  grid-gap: 0.15rem;
  &.col-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &.row-3 {
    grid-template-rows: repeat(3, 1fr);
  }
  &.col-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  &.row-2 {
    grid-template-rows: repeat(2, 1fr);
  }
}
</style>
