const {test}=require('node:test');
const assert=require('node:assert/strict');
const {calculate,decimal,parseDecimal}=require('./dist/model.js');
const base={dau:'50000',sessions:'1.6',slots:'3',fill:'70',ecpm:'6',share:'50',fx:'7',cost:'220000',ua:'0',cash:'2000000'};
test('基准收入由独立手算的2419200次有效展示推导',()=>{
 const m=calculate(base);assert.equal(decimal(m.usdN,m.usdD),'15,120.00');assert.equal(decimal(m.cnyN,m.cnyD),'105,840.00');assert.equal(decimal(m.surplusN,m.surplusD),'−114,160.00');assert.equal(m.breakEven,103931n);assert.equal(decimal(m.runwayN,m.runwayD,1),'17.5');
});
test('低量与高表现情景核对静态报告',()=>{
 const low=calculate({...base,dau:'10000',sessions:'1.3',slots:'2',fill:'50',ecpm:'3'});assert.equal(decimal(low.cnyN,low.cnyD),'4,095.00');
 const high=calculate({...base,dau:'150000',sessions:'1.8',slots:'3.5',fill:'80',ecpm:'10'});assert.equal(decimal(high.cnyN,high.cnyD),'793,800.00');assert.equal(high.hasBurn,false);
});
test('零展示仍有成本，盈亏平衡不可达；零DAU仍可计算目标DAU',()=>{
 const zero=calculate({...base,fill:'0'});assert.equal(zero.cnyN,0n);assert.equal(zero.breakEven,null);assert.equal(decimal(zero.runwayN,zero.runwayD,1),'9.1');
 assert.equal(calculate({...base,dau:'0'}).breakEven,103931n);
});
test('成本为零与收入为零不产生除零',()=>{const m=calculate({...base,cost:'0',fill:'0'});assert.equal(m.breakEven,0n);assert.equal(m.hasBurn,false);});
test('实得比例100%不重复扣分成，增加费用准确减少结余',()=>{const m=calculate({...base,share:'100',ua:'10000'});assert.equal(decimal(m.cnyN,m.cnyD),'211,680.00');assert.equal(decimal(m.surplusN,m.surplusD),'−18,320.00');});
test('非法输入、越界比例、零汇率、非整数DAU均拒绝',()=>{
 for(const value of ['','-1','NaN','Infinity','1e6','<script>','0.00001','1000000000000'])assert.throws(()=>parseDecimal(value));
 for(const patch of [{fill:'100.0001'},{share:'101'},{fx:'0'},{dau:'0.5'}])assert.throws(()=>calculate({...base,...patch}));
});
test('金额最小输入及极大输入保持整数精度，不使用二进制浮点',()=>{
 assert.equal(parseDecimal('0.0001'),1n);const m=calculate({...base,dau:'999999999999'});assert.equal(m.cnyN/m.cnyD,2116799999997n);
 assert.equal(decimal(1n,200n),'0.01');assert.equal(decimal(-1n,200n),'−0.01');
});
test('盈亏平衡向上取整：目标人数能覆盖成本，少1人不能',()=>{
 const m=calculate(base);const enough=calculate({...base,dau:m.breakEven.toString()});const below=calculate({...base,dau:(m.breakEven-1n).toString()});assert.ok(enough.surplusN>=0n);assert.ok(below.surplusN<0n);
});
