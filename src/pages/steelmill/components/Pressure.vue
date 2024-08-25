<template>
  <BaseChart class="guage-chart" :option="option"></BaseChart>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseChart from '@/components/charts/BaseChart.vue';
const props = defineProps<{
  value: number;
  title?: string;
  min?: number;
  max?: number;
}>();
const option = computed(() => {
  const value = props.value;
  return {
    textStyle: {
      fontSize: 10,
    },
    title: {
      show: false,
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: 'gauge',
        splitNumber: 10,
        radius: '70%',
        min: 0,
        max: 10,
        axisLine: {
          lineStyle: {
            color: [[1, '#f00']],
            width: 1,
          },
        },
        splitLine: {
          distance: -5,
          length: 4,
          lineStyle: {
            color: '#000',
          },
        },
        axisTick: {
          distance: -5,
          length: 2,
          lineStyle: {
            color: '#000',
          },
        },
        axisLabel: {
          distance: -13,
          color: '#f00',
          fontSize: 10,
        },
        anchor: {
          show: true,
          size: 5,
          itemStyle: {
            borderColor: '#000',
            borderWidth: 2,
          },
        },
        pointer: {
          offsetCenter: [0, '10%'],
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '115%',
          itemStyle: {
            color: '#000',
          },
        },
        detail: {
          valueAnimation: true,
          precision: 1,
          formatter: '{value} Pa',
          color: 'inherit',
          fontSize: 12,
        },
        title: {
          offsetCenter: [0, '-50%'],
          fontSize: 12,
          color: '#fefefe',
        },
        data: [
          {
            value: value,
            name: '压力',
          },
        ],
      },
    ],
  };
});
</script>
<style lang="scss" scoped>
.guage-chart {
  height: 100px;
}
</style>
