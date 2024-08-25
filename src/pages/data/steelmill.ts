class SteelmillEquipments {
  Jiarelu = {
    name: '加热炉',
    key: 'Jiarelu',
    温度: { value: '1335.00', unit: '°C' },
    燃料: { value: '31.8', unit: '' },
  };
  Tieshuiguan = {
    name: '铁水罐',
    key: 'TieShuiGuan',
    温度: { value: '1335.00', unit: '°C' },
  };
  Zhuanlu = {
    name: '转炉',
    key: 'zhuan_lu',
    吹氧量: { value: '102', unit: '' },
    容量: { value: '29', unit: '' },
  };
  Dianhulu = {
    name: '电弧炉',
    key: 'Dianhulu',
    电流: { value: '48', unit: 'A' },
    电压: { value: '730.00', unit: 'V' },
  };
  Lianzhu = {
    name: '连铸',
    key: 'Lianzhu',
    温度: { value: '1497.00', unit: '°C' },
    速度: { value: '31.70', unit: 'm/min' },
  };
  Zhuzhaji = {
    name: '主轧机',
    key: 'Zhuzhaji',
    速度: { value: '18.00', unit: 'm/s' },
  };
  Cuzhaji = {
    name: '粗轧机',
    key: 'Cuzhaji',
    功率: { value: '163.00', unit: 'W' },
    电压: { value: '197.00', unit: 'V' },
  };
  Zhongzhaji = {
    name: '中轧机',
    key: 'Zhongzhaji',
    功率: { value: '222.00', unit: 'W' },
    电压: { value: '197.00', unit: 'V' },
  };
  Jingzhaji = {
    name: '精轧机',
    key: 'Jingzhaji',
    功率: { value: '188.00', unit: 'W' },
    电压: { value: '223.00', unit: 'V' },
  };
  Duanqieji = {
    name: '端切机',
    key: 'Duanqieji',
    功率: { value: '153.00', unit: 'W' },
    电压: { value: '320.00', unit: 'V' },
  };
  Bianqieji = {
    name: '边切机',
    key: 'Bianqieji',
    功率: { value: '33.00', unit: 'W' },
    电压: { value: '32.00', unit: 'V' },
  };
  Zhengpingji = {
    name: '整平机',
    key: 'Zhengpingji',
    功率: { value: '225.00', unit: 'W' },
    电压: { value: '304.00', unit: 'V' },
  };
  Panjuanji = {
    name: '盘卷机',
    key: 'Panjuanji',
    功率: { value: '265.00', unit: 'W' },
    电压: { value: '157.00', unit: 'V' },
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
