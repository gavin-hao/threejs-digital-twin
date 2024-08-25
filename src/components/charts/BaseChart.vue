<template>
  <div class="chart-container" ref="chartDom"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { merge, cloneDeep } from 'lodash';
const defaultOption = {
  // color: color,
  backgroundColor: 'transparent',
  textStyle: {
    // color: '#4E5969',
    fontSize: 12,
  },
  title: {
    padding: 5,
    left: 0,
    top: 0,
    textStyle: {
      fontSize: '14',
      fontWeight: 'normal',
      color: '#464646',
    },
  },
  legend: {
    bottom: 0,
    itemHeight: 12,
    textStyle: {
      fontSize: 10,
      color: '#fff',
    },
    tooltip: {},
  },
};
const props = defineProps<{
  option: any;
}>();
const chartDom = ref<HTMLElement>();
const chart = ref<echarts.ECharts>();
// watchEffect(
//   () => {
//     // const mergedOption = merge(cloneDeep(defaultOption), props.option);
//     console.log('props.option', props.option);
//     updateChart();
//   },
//   { flush: 'post' }
// );
// watch(props.option, () => {
//   updateChart();
// });

function initChart() {
  chart.value = echarts.init(chartDom.value);
  const mergedOption = merge(cloneDeep(defaultOption), props.option);

  chart.value.setOption(mergedOption);
}
onMounted(() => {
  initChart();
});
onUnmounted(() => {
  chart.value?.dispose();
  chart.value = undefined;
});
</script>
<style lang="scss" scoped>
.chart-container {
  height: 100%;
}
</style>
