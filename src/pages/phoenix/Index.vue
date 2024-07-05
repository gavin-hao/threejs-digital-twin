<template>
  <LayoutScreen>
    <template #header>
      <Header>
        <div class="title">菲尼克斯电气数字孪生平台</div>
      </Header>
    </template>
    <template #left v-if="showMask">
      <div class="panels">
        <Card title="空压机">
          <div class="status-list col-3">
            <Status v-for="i in 7" :status="i == 3 ? 'error' : 'success'" :title="`空压机${i}`" :key="i">
              状态{{ i == 3 ? '异常' : '正常' }}
            </Status>
          </div>
        </Card>
        <Card title="波峰焊">
          <div class="status-list col-3">
            <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :frame="true" :key="i">
              <div class="status">
                <div class="title">波峰焊{{ i }}</div>
                <div class="body">状态{{ i == 5 ? '异常' : '正常' }}</div>
              </div>
            </Status>
          </div>
        </Card>
      </div>
    </template>
    <template #right v-if="showMask">
      <div class="panels">
        <Card title="注塑机">
          <div class="status-list col-2">
            <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :key="i" :frame="true">
              <div class="status flex">
                <span class="title">注塑机{{ i }}</span>
                <span class="body">状态{{ i == 5 ? '异常' : '正常' }}</span>
              </div>
            </Status>
          </div>
        </Card>
        <Card title="冲压机">
          <div class="status-list col-2">
            <Status v-for="i in 8" :status="i == 5 ? 'error' : 'success'" :frame="false" :key="i">
              <div class="status">
                <div class="title">冲压机{{ i }}</div>
                <div class="body">状态{{ i == 5 ? '异常' : '正常' }}</div>
              </div>
            </Status>
          </div>
        </Card>
      </div>
    </template>
    <template #main>
      <Scene />
      <div v-if="showMask" class="mask"></div>
    </template>
  </LayoutScreen>
</template>
<script setup lang="ts">
import LayoutScreen from '@/pages/components/LayoutScreen.vue';
import Header from '@/pages/components/Header.vue';
import Card from '@/components/Card.vue';
import Status from '@/components/charts/Status.vue';
import Scene from './Scene.vue';
import { ref } from 'vue';

const showMask = ref(true);
</script>
<style lang="scss" scoped>
.panels {
  display: flex;
  flex: 1;
  flex-direction: column;
  // grid-gap: 8px;
  height: 100%;
  overflow: hidden;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
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
.status {
  text-align: center;
  .title {
    font-size: 0.16rem;
    color: #fff;
  }
  .body {
    font-size: 0.2rem;
  }
  &.flex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .title {
      font-size: 0.2rem;
    }
    .body {
      font-size: 0.16rem;
    }
  }
}

.mask {
  --color-bg: #121328cc;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle at center, transparent 0%, rgba(18, 19, 40, 0.9) 100%),
    linear-gradient(
      to right,
      rgba(18, 19, 40, 0.8) 0%,
      rgba(18, 19, 40, 0.6) 10%,
      rgba(18, 19, 40, 0.1) 30%,
      rgba(18, 19, 40, 0) 50%,
      rgba(18, 19, 40, 0.1) 70%,
      rgba(18, 19, 40, 0.6) 90%,
      rgba(18, 19, 40, 0.8) 100%
    );
  background-repeat: no-repeat;
  box-shadow: 0 0 0 9999em var(--color-bg);
}
</style>
