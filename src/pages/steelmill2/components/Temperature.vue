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
        name: '温度',
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: props.min || 0,
        max: props.max || 90,
        center: ['50%', '60%'],
        radius: '90%',
        itemStyle: {
          color: '#FFAB91',
        },
        pointer: {
          show: false,
        },
        axisLabel: {
          show: false,
          fontSize: 8,
        },
        axisLine: {
          lineStyle: {
            width: 4,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          distance: 1,
          length: 3,
          lineStyle: {
            width: 1,
          },
        },
        progress: {
          show: true,
          width: 4,
        },
        detail: {
          offsetCenter: [0, '20%'],
          formatter: '{value} °C',
          color: 'inherit',
          fontSize: 12,
          valueAnimation: true,
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 12,
          color: '#fefefe',
        },
        data: [
          {
            value,
            name: '温度',
          },
        ],
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '90%',
        startAngle: 200,
        endAngle: -20,
        min: props.min || 0,
        max: props.max || 90,
        itemStyle: {
          color: '#FD7347',
        },
        progress: {
          show: true,
          width: 1,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value,
          },
        ],
      },
    ],
  };
});
</script>
<style lang="scss" scoped>
.guage-chart {
  min-height: 80px;
}
</style>
