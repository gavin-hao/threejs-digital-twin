<template>
  <LayoutScreen>
    <template #header>
      <Header>
        <div class="title">钢铁厂数字孪生平台</div>
      </Header>
    </template>
    <template #left v-if="showMask">
      <div class="panels">
        <div class="status-list">
          <Status
            status="success"
            :frame="true"
            :title="equips.Gaolu.name"
            :key="equips.Gaolu.key"
            @click="handleClickStatus(equips.Gaolu.key)"
          >
            <div class="status-grid col-2">
              <div><Temperature title="温度" :max="2000" :value="Number(equips.Gaolu.温度.value)" /></div>
              <div><Pressure title="压力" :max="10" :value="Number(equips.Gaolu.压力.value)" /></div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Jiarelu.name"
            :key="equips.Jiarelu.key"
            @click="handleClickStatus(equips.Jiarelu.key)"
          >
            <div class="status-grid col-2">
              <div><Statistic title="燃料" :max="10" :value="equips.Jiarelu.燃料.value" /></div>
              <div><Temperature title="温度" :max="2000" :value="Number(equips.Jiarelu.温度.value)" /></div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Tieshuiguan.name"
            :key="equips.Tieshuiguan.key"
            @click="handleClickStatus(equips.Tieshuiguan.key)"
          >
            <div class="status-grid">
              <div><Temperature title="温度" :max="2000" :value="Number(equips.Tieshuiguan.温度.value)" /></div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Zhuanlu.name"
            :key="equips.Zhuanlu.key"
            @click="handleClickStatus(equips.Zhuanlu.key)"
          >
            <div class="status-grid col-2">
              <div><Statistic title="吹氧量" :max="2000" :value="equips.Zhuanlu.吹氧量.value" /></div>
              <div><Statistic title="容量" :max="10" :value="equips.Zhuanlu.容量.value" /></div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Dianhulu.name"
            :key="equips.Dianhulu.key"
            @click="handleClickStatus(equips.Dianhulu.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="电压" :max="10" :value="equips.Dianhulu.电压.value"
                  ><template v-slot:suffix>A</template></Statistic
                >
              </div>
              <div>
                <Statistic title="电流" :value="equips.Dianhulu.电流.value"
                  ><template v-slot:suffix>V</template></Statistic
                >
              </div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Lianzhu.name"
            :key="equips.Lianzhu.key"
            @click="handleClickStatus(equips.Lianzhu.key)"
          >
            <div class="status-grid col-2">
              <div><Statistic title="速度" :max="2000" :value="equips.Lianzhu.速度.value" /></div>
              <div><Temperature title="温度" :max="2000" :value="Number(equips.Lianzhu.温度.value)" /></div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Zhuzhaji.name"
            :key="equips.Zhuzhaji.key"
            @click="handleClickStatus(equips.Zhuzhaji.key)"
          >
            <div class="status-grid">
              <div>
                <Statistic title="速度" :max="2000" :value="equips.Zhuzhaji.速度.value"
                  ><template v-slot:suffix> m/s </template></Statistic
                >
              </div>
            </div>
          </Status>
        </div>
      </div>
    </template>
    <template #right v-if="showMask">
      <div class="panels">
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Cuzhaji.name"
            :key="equips.Cuzhaji.key"
            @click="handleClickStatus(equips.Cuzhaji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="10" :value="equips.Cuzhaji.功率.value"
                  ><template v-slot:suffix>W</template></Statistic
                >
              </div>
              <div>
                <Statistic title="电压" :value="equips.Cuzhaji.电压.value"
                  ><template v-slot:suffix>V</template></Statistic
                >
              </div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Zhongzhaji.name"
            :key="equips.Zhongzhaji.key"
            @click="handleClickStatus(equips.Zhongzhaji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="2000" :value="equips.Zhongzhaji.功率.value">
                  <template v-slot:suffix>W</template>
                </Statistic>
              </div>
              <div>
                <Statistic title="电压" :max="2000" :value="equips.Zhongzhaji.电压.value">
                  <template v-slot:suffix>V</template>
                </Statistic>
              </div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Jingzhaji.name"
            :key="equips.Jingzhaji.key"
            @click="handleClickStatus(equips.Jingzhaji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="10" :value="equips.Jingzhaji.功率.value"
                  ><template v-slot:suffix>W</template></Statistic
                >
              </div>
              <div>
                <Statistic title="电压" :value="equips.Jingzhaji.电压.value"
                  ><template v-slot:suffix>V</template></Statistic
                >
              </div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Duanqieji.name"
            :key="equips.Duanqieji.key"
            @click="handleClickStatus(equips.Duanqieji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="2000" :value="equips.Duanqieji.功率.value">
                  <template v-slot:suffix>W</template>
                </Statistic>
              </div>
              <div>
                <Statistic title="电压" :max="2000" :value="equips.Duanqieji.电压.value">
                  <template v-slot:suffix>V</template>
                </Statistic>
              </div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Bianqieji.name"
            :key="equips.Bianqieji.key"
            @click="handleClickStatus(equips.Bianqieji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="10" :value="equips.Bianqieji.功率.value"
                  ><template v-slot:suffix>W</template></Statistic
                >
              </div>
              <div>
                <Statistic title="电压" :value="equips.Bianqieji.电压.value"
                  ><template v-slot:suffix>V</template></Statistic
                >
              </div>
            </div>
          </Status>
          <Status
            status="success"
            :frame="true"
            :title="equips.Zhengpingji.name"
            :key="equips.Zhengpingji.key"
            @click="handleClickStatus(equips.Zhengpingji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="2000" :value="equips.Zhengpingji.功率.value">
                  <template v-slot:suffix>W</template>
                </Statistic>
              </div>
              <div>
                <Statistic title="电压" :max="2000" :value="equips.Zhengpingji.电压.value">
                  <template v-slot:suffix>V</template>
                </Statistic>
              </div>
            </div>
          </Status>
        </div>
        <div class="status-list col-2">
          <Status
            status="success"
            :frame="true"
            :title="equips.Panjuanji.name"
            :key="equips.Panjuanji.key"
            @click="handleClickStatus(equips.Panjuanji.key)"
          >
            <div class="status-grid col-2">
              <div>
                <Statistic title="功率" :max="10" :value="equips.Panjuanji.功率.value"
                  ><template v-slot:suffix>W</template></Statistic
                >
              </div>
              <div>
                <Statistic title="电压" :value="equips.Panjuanji.电压.value"
                  ><template v-slot:suffix>V</template></Statistic
                >
              </div>
            </div>
          </Status>
        </div>
      </div>
    </template>
    <template #main>
      <Scene ref="sceneRef" />
      <!-- <div v-if="showMask" class="mask"></div> -->
    </template>
  </LayoutScreen>
</template>
<script setup lang="ts">
import LayoutScreen from '@/pages/components/LayoutScreen.vue';
import Header from '@/pages/components/Header.vue';
import Status from './components/Status.vue';
import Scene from './Scene.vue';
import { onMounted, provide, ref } from 'vue';
import { injectContextKey } from './context';
import signals from 'signals';
import equips from '../data/steelmill';
import Temperature from './components/Temperature.vue';
import Pressure from './components/Pressure.vue';
import Statistic from './components/Statistic.vue';
const sceneRef = ref();
const showMask = ref(true);
const status = ref<any[]>([]);
const events: {
  focusTo: signals.Signal<any>;
  warn: signals.Signal<any>;
} = {
  focusTo: new signals.Signal(),
  warn: new signals.Signal(),
};

onMounted(() => {
  status.value = [
    equips.Bianqieji,
    equips.Cuzhaji,
    equips.Dianhulu,
    equips.Duanqieji,
    equips.Gaolu,
    equips.Jiarelu,
    equips.Jingzhaji,
    equips.Lianzhu,
    equips.Panjuanji,
    equips.Tieshuiguan,
    equips.Zhengpingji,
    equips.Zhongzhaji,
    equips.Zhuanlu,
    equips.Zhuzhaji,
  ];
});
const handleClickStatus = (name: string) => {
  console.log('focus to', name);
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
  events,
  status,
});
</script>
<style lang="scss" scoped>
.panels {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  // grid-gap: 8px;
  height: 100%;
  overflow: hidden;
  overflow: auto;
  pointer-events: none;
  scrollbar-width: none;
  > * {
    pointer-events: initial;
  }
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
  grid-gap: 0.1rem;
  align-items: center;
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
  &.grid-auto-flow {
    grid-auto-flow: row dense;
  }
  .col-span-2 {
    grid-column-start: 1;
    grid-column-end: 2;
  }
}
.status-grid {
  display: flex;
  flex: 1;
  gap: 4;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  & > div {
    flex: 1;
    // padding: 4px;
    width: 50%;
  }
  &.col-3 {
    > div {
      width: 33%;
    }
  }
  // display: grid;
  // grid-auto-rows: 1fr;
  // grid-gap: 0.15rem;
  // &.col-3 {
  //   grid-template-columns: repeat(3, 1fr);
  // }
  // &.row-3 {
  //   grid-template-rows: repeat(3, 1fr);
  // }
  // &.col-2 {
  //   grid-template-columns: repeat(2, 1fr);
  // }
  // &.row-2 {
  //   grid-template-rows: repeat(2, 1fr);
  // }
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
