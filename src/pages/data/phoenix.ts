function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  // return Math.fround(Math.random() * (max - min)) + min;
}
function formatNumberWithZero(num: number) {
  const strNum = new Intl.NumberFormat('zh-CN', { minimumIntegerDigits: 2, minimumFractionDigits: 0 }).format(num);
  return strNum;
}
class BaseInfos<T = any> {
  protected count: number;
  protected equipmentList: Array<Record<string, T>>;
  constructor(count: number) {
    this.count = count;
    this.equipmentList = [];
  }
  get data() {
    return this.equipmentList;
  }
  update(): BaseInfos {
    return this;
  }
  isWarning(item: Record<string, any>) {
    for (const k in item) {
      if (item[k].value !== undefined && item[k].min !== undefined && item[k].max !== undefined) {
        if (item[k].value < item[k].min || item[k].value > item[k].max) {
          // console.log('----', k, item[k].value);
          return true;
        }
      }
    }
    return false;
  }
}
export class AirCompressorInfos extends BaseInfos {
  constructor(count: number) {
    super(count);
  }
  update() {
    this.equipmentList = [];
    for (let i = 1; i <= this.count; i++) {
      const equipment = {
        name: `空压机_${formatNumberWithZero(i)}`,
        key: `kongyaji_${formatNumberWithZero(i)}`,
        排气压力: { value: generateRandomNumber(7, 14) / 10, unit: 'MPa', min: 0.7, max: 1.3 },
        第二级进口压力: { value: generateRandomNumber(7, 8) / 10, unit: 'Mpa', min: 0.7, max: 0.8 },
        第二级排放压力: { value: generateRandomNumber(7, 13) / 10, unit: 'Mpa', min: 0.7, max: 1.3 },
        轴承油压: { value: generateRandomNumber(1, 4) / 10, unit: 'Mpa', min: 0.1, max: 0.3 },
        第二级进口温度: { value: generateRandomNumber(34, 150), unit: '°C', min: 35, max: 150 },
        机组排放温度: { value: generateRandomNumber(75, 95), unit: '°C', min: 75, max: 95 },
        轴承油温: { value: generateRandomNumber(40, 60), unit: '°C', min: 40, max: 60 },
        第二级排放温度: { value: generateRandomNumber(70, 150), unit: '°C', min: 70, max: 150 },
        第一级排放温度: { value: generateRandomNumber(60, 80), unit: '°C', min: 60, max: 80 },
      };
      this.equipmentList.push(equipment);
      Intl.NumberFormat();
    }
    return this;
  }
}
export class BlankingPressInfos extends BaseInfos {
  constructor(count: number) {
    super(count);
  }
  override update() {
    this.equipmentList = [];
    for (let i = 1; i <= this.count; i++) {
      const equipment = {
        name: `冲压机_${formatNumberWithZero(i)}`,
        key: `chongyaji_${formatNumberWithZero(i)}`,
        冲压次数: { value: generateRandomNumber(200, 1205), unit: '次/分钟', min: 200, max: 1200 },
        历史冲压次数: { value: generateRandomNumber(200, 1200), unit: '次/分钟', min: 200, max: 1200 },
      };
      this.equipmentList.push(equipment);
    }
    return this;
  }
}
export class InjectionMoldingMachineInfos extends BaseInfos {
  constructor(count: number) {
    super(count);
  }
  override update() {
    this.equipmentList = [];
    for (let i = 1; i <= this.count; i++) {
      const equipment = {
        name: `注塑机_${formatNumberWithZero(i)}`,
        key: `zhusuji_${formatNumberWithZero(i)}`,
        峰值压力: { value: generateRandomNumber(50, 150), unit: 'MPa', min: 50, max: 150 },
        最小缓冲: { value: generateRandomNumber(3, 6), unit: '次/分钟', min: 3, max: 5 },
        'V-P位置': { value: generateRandomNumber(3, 5), unit: '次/分钟', min: 3, max: 5 },
        'V-P压力': { value: generateRandomNumber(30, 102), unit: 'MPa', min: 30, max: 100 },
      };
      this.equipmentList.push(equipment);
    }
    return this;
  }
}
export class WavesolderingInfos extends BaseInfos {
  constructor(count: number) {
    super(count);
  }
  override update(): BaseInfos<any> {
    this.equipmentList = [];
    for (let i = 1; i <= this.count; i++) {
      const equipment = {
        name: `波峰焊_${formatNumberWithZero(i)}`,
        key: `bofenghan_${formatNumberWithZero(i)}`,
        顶部预热: { value: generateRandomNumber(90, 131), unit: '°C', min: 90, max: 130 },
        底部预热: { value: generateRandomNumber(90, 120), unit: '°C', min: 90, max: 120 },
        锡缸热桥: { value: generateRandomNumber(250, 265), unit: '°C', min: 250, max: 265 },
        氮气控制: { value: generateRandomNumber(100, 100), unit: '%', min: 99.99, max: 100 },
        热交换器: { value: generateRandomNumber(80, 280), unit: '°C', min: 80, max: 280 },
        高温计: { value: generateRandomNumber(89, 120), unit: '°C', min: 90, max: 120 },
      };
      this.equipmentList.push(equipment);
    }
    return this;
  }
}
// 冲压机：
// 冲压次数（冲压次数告警）200-1200次/分钟
// 历史冲压次数（历史冲压次数告警）

// 注塑机：
// 峰值压力（峰值压力告警）50~150MPa
// 最小缓冲（最小缓冲告警）3-5mm
// V-P位置（V-P位置告警）
// V-P压力（V-P压力告警）30~100 MPa

// 空压机：
// 排气压力（排气压力告警）0.7~1.3 MPa
// 第二级进口压力（第二级进口压力告警）0.7~0.8 MPa
// 第二级排放压力（第二级排放压力告警）0.7 MPa~1.3 MPa
// 轴承油压（轴承油压告警）0.1 MPa~0.3 MPa
// 第二级进口温度（第二级进口温度告警）35℃~150℃
// 机组排放温度（机组排放温度告警）75℃~95℃
// 轴承油温（轴承油温告警）40°C~60°C
// 第二级排放温度（第二级排放温度告警）70°C~150°C
// 第一级排放温度（第一级排放温度告警）60℃~80C

// 波峰焊：
// 顶部预热（顶部预热告警）90℃~130℃
// 底部预热（底部预热告警）90°C到120°C
// 锡缸热桥（锡缸热桥告警）250℃~265℃
// 氮气控制（氮气控制告警）99.99%~100%
// 热交换器（热交换器告警）80℃~280℃
// 高温计（高温计告警）90°C~120°C
