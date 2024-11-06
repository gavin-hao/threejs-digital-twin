class SteelmillEquipments {
  Jiarelu = {
    name: '加热炉',
    key: 'Jiarelu',
    温度: { value: '1335.00', unit: '°C' },
    // 燃料: { value: '31.8', unit: '' },
    加热速度: { value: '88', unit: '°C/s' },
    基准氧含量: { value: '5', unit: '%' },
    热负荷: { value: '300', unit: '°C' },
  };
  Tieshuiguan = {
    name: '铁水罐',
    key: 'TieShuiGuan',
    // 温度: { value: '1335.00', unit: '°C' },
    容量: { value: '150', unit: '吨' },
    周转率: { value: '80', unit: '%' },
    铁水温降: { value: '78', unit: '°C' },
    在线数量: { value: '5', unit: '' },
  };
  Zhuanlu = {
    name: '转炉',
    key: 'zhuan_lu',
    利用系数: { value: '38', unit: '吨/公称吨' },
    作业率: { value: '95', unit: '%' },
    倒命中率: { value: '80', unit: '%' },
    冶炼周期: { value: '35', unit: 'min' },
  };
  Dianhulu = {
    name: '电弧炉',
    key: 'Dianhulu',
    利用系数: { value: '28', unit: '吨/(MV.A·天)' },
    合格率: { value: '0.9', unit: '' },
    电力消耗: { value: '500', unit: 'kWh/t' },
    电极消耗: { value: '8.5', unit: 'kg/t' },
  };
  Lianzhu = {
    name: '连铸',
    key: 'Lianzhu',
    作业率: { value: '88', unit: '%' },
    铸坯合格率: { value: '99', unit: '%' },
    中间包使用寿命: { value: '1070', unit: 'min' },
    连浇炉数: { value: '4', unit: '' },
  };
  Zhuzhaji = {
    name: '主轧机',
    key: 'Zhuzhaji',
    平均小时产量: { value: '50', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Cuzhaji = {
    name: '粗轧机',
    key: 'Cuzhaji',
    平均小时产量: { value: '151', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Zhongzhaji = {
    name: '中轧机',
    key: 'Zhongzhaji',
    平均小时产量: { value: '151', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Jingzhaji = {
    name: '精轧机',
    key: 'Jingzhaji',
    平均小时产量: { value: '152', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99.9', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Duanqieji = {
    name: '端切机',
    key: 'Duanqieji',
    平均小时产量: { value: '151', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99.8', unit: '%' },
    成材率: { value: '99', unit: '%' },
  };
  Bianqieji = {
    name: '边切机',
    key: 'Bianqieji',
    平均小时产量: { value: '154', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Zhengpingji = {
    name: '整平机',
    key: 'Zhengpingji',
    平均小时产量: { value: '151', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Panjuanji = {
    name: '盘卷机',
    key: 'Panjuanji',
    平均小时产量: { value: '152', unit: '吨' },
    日历作业率: { value: '95', unit: '%' },
    钢材合格率: { value: '99', unit: '%' },
    成材率: { value: '98', unit: '%' },
  };
  Gaolu = {
    name: '高炉',
    key: 'GaoLu',
    温度: { value: '1590.00', unit: '°C' },
    压力: { value: '4.00', unit: 'Pa' },
  };
}

const data = new SteelmillEquipments();

export default data;
