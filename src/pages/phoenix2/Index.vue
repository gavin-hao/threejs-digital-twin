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
            <Status
              v-for="item in kongyaji"
              :status="airCompress.isWarning(item) ? 'error' : 'success'"
              :title="item.name"
              :key="item.key"
              @click="handleClickStatus(item.key)"
            >
              状态{{ airCompress.isWarning(item) ? '异常' : '正常' }}
            </Status>
          </div>
        </Card>
        <Card title="波峰焊">
          <div class="status-list col-3">
            <Status
              v-for="item in bofenghan"
              :status="waves.isWarning(item) ? 'error' : 'success'"
              :frame="true"
              :key="item.key"
              @click="handleClickStatus(item.key)"
            >
              <div class="status">
                <div class="title">{{ item.name }}</div>
                <div class="body">状态{{ waves.isWarning(item) ? '异常' : '正常' }}</div>
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
            <Status
              v-for="item in zhusuji"
              :status="injectionMolding.isWarning(item) ? 'error' : 'success'"
              :key="item.key"
              :frame="true"
              @click="handleClickStatus(item.key)"
            >
              <div class="status flex">
                <span class="title">{{ item.name }}</span>
                <span class="body">状态{{ injectionMolding.isWarning(item) ? '异常' : '正常' }}</span>
              </div>
            </Status>
          </div>
        </Card>
        <Card title="冲压机">
          <div class="status-list col-2">
            <Status
              v-for="item in chongyaji"
              :status="blanking.isWarning(item) ? 'error' : 'success'"
              :frame="false"
              :key="item.key"
              @click="handleClickStatus(item.key)"
            >
              <div class="status">
                <div class="title">{{ item.name }}</div>
                <div class="body">状态{{ blanking.isWarning(item) ? '异常' : '正常' }}</div>
              </div>
            </Status>
          </div>
        </Card>
      </div>
    </template>
    <template #main>
      <Scene :data="errorN" ref="sceneRef" />
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
import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
import { injectContextKey } from './context';
import signals from 'signals';
import * as Data from '../data/phoenix';

const sceneRef = ref();
const showMask = ref(true);
const errorN = ref<{
  chongyaji: number;
  bofenghan: number;
  zhusuji: number;
  kongyaji: number;
}>({
  chongyaji: 0,
  bofenghan: 1,
  zhusuji: 5,
  kongyaji: 6,
});
const kongyaji = ref<Array<Record<string, any>>>([]);
const zhusuji = ref<Array<Record<string, any>>>([]);
const chongyaji = ref<Array<Record<string, any>>>([]);
const bofenghan = ref<Array<Record<string, any>>>([]);
const airCompress = new Data.AirCompressorInfos(9);
const injectionMolding = new Data.InjectionMoldingMachineInfos(5);
const blanking = new Data.BlankingPressInfos(8);
const waves = new Data.WavesolderingInfos(7);

const events: {
  focusTo: signals.Signal<any>;
  warn: signals.Signal<any>;
} = {
  focusTo: new signals.Signal(),
  warn: new signals.Signal(),
};
const getDatas = () => {
  kongyaji.value = airCompress.update().data;
  zhusuji.value = injectionMolding.update().data;
  chongyaji.value = blanking.update().data;
  bofenghan.value = waves.update().data;
  const error1 = kongyaji.value.filter((v) => airCompress.isWarning(v));
  const error2 = zhusuji.value.filter((v) => injectionMolding.isWarning(v));
  const error3 = chongyaji.value.filter((v) => blanking.isWarning(v));
  const error4 = bofenghan.value.filter((v) => waves.isWarning(v));
  events.warn.dispatch([...error1, ...error2, ...error3, ...error4]);
  setTimeout(getDatas, 30000);
};
const errors = computed(() => {
  const error1 = kongyaji.value.filter((v) => airCompress.isWarning(v));
  const error2 = zhusuji.value.filter((v) => injectionMolding.isWarning(v));
  const error3 = chongyaji.value.filter((v) => blanking.isWarning(v));
  const error4 = bofenghan.value.filter((v) => waves.isWarning(v));
  return [...error1, ...error2, ...error3, ...error4];
});

onMounted(() => {
  getDatas();
  setTimeout(() => {
    events.warn.dispatch(errors.value);
  }, 3000);
});

onUnmounted(() => {});
const handleClickStatus = (name: string) => {
  dispatchFocus(name);
};
// const focusCallbacks: FocusToCallback[] = [];
// const onFocusTo = (callback: FocusToCallback) => {
//   focusCallbacks.push(callback);
// };
const dispatchFocus = (focusKey: string) => {
  // for (const callback of focusCallbacks) {
  //   callback?.(focusKey);
  // }
  events.focusTo.dispatch(focusKey);
};
provide(injectContextKey, {
  kongyaji,
  chongyaji,
  bofenghan,
  zhusuji,
  events,
});
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
  background-image: radial-gradient(circle at center, transparent 0%, rgba(18, 19, 40, 0.5) 100%),
    linear-gradient(
      to right,
      rgba(18, 19, 40, 0.8) 0%,
      rgba(18, 19, 40, 0.5) 10%,
      rgba(18, 19, 40, 0.1) 20%,
      rgba(18, 19, 40, 0) 50%,
      rgba(18, 19, 40, 0.1) 80%,
      rgba(18, 19, 40, 0.5) 90%,
      rgba(18, 19, 40, 0.8) 100%
    );
  background-repeat: no-repeat;
  box-shadow: 0 0 0 9999em var(--color-bg);
}
</style>
