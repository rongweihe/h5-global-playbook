// 核心金额计算使用 BigInt 有理数：最多四位输入小数，中间不截断，展示时四舍五入到分。
// 此模型仅用于商业情景研究；收入单位为美元/人民币，百分比以0–100输入，不触发资金操作。
(function(root){
  const S=10000n;
  function parseDecimal(value){
    const text=String(value).trim();
    if(!/^\d{1,12}(\.\d{1,4})?$/.test(text)) throw new Error('请输入非负数字，最多12位整数和4位小数。');
    const [whole,fraction='']=text.split('.');
    return BigInt(whole)*S+BigInt(fraction.padEnd(4,'0'));
  }
  function roundRatio(n,d){if(d<=0n)throw new Error('无效分母');const sign=n<0n?-1n:1n;const a=n<0n?-n:n;return sign*((a+d/2n)/d);}
  function decimal(n,d,digits=2){const power=10n**BigInt(digits);const q=roundRatio(n*power,d);const abs=q<0n?-q:q;let whole=(abs/power).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');return (q<0n?'−':'')+whole+(digits?'.'+(abs%power).toString().padStart(digits,'0'):'');}
  // calculate 维护展示与分成单位一致；按完整分子/分母计算，避免低金额与多次乘除的提前舍入。
  function calculate(raw){
    const x={};for(const k of ['dau','sessions','slots','fill','ecpm','share','fx','cost','ua','cash'])x[k]=parseDecimal(raw[k]);
    if(x.dau%S!==0n)throw new Error('DAU 请使用整数人数。');
    if(x.fill>100n*S||x.share>100n*S)throw new Error('有效展示率和实得比例必须在0–100%之间。');
    if(x.fx===0n)throw new Error('汇率必须大于0。');
    const unitUsdN=x.sessions*x.slots*x.fill*x.ecpm*x.share*30n;
    const unitUsdD=S**5n*1000n*100n*100n;
    const usdN=x.dau*unitUsdN, usdD=S*unitUsdD;
    const cnyN=usdN*x.fx, cnyD=usdD*S;
    const spend=x.cost+x.ua;
    const surplusN=cnyN*S-spend*cnyD, surplusD=cnyD*S;
    const perDauN=unitUsdN*x.fx, perDauD=unitUsdD*S;
    const breakEven=spend===0n?0n:perDauN===0n?null:(spend*perDauD+S*perDauN-1n)/(S*perDauN);
    const lossN=-surplusN;
    return {usdN,usdD,cnyN,cnyD,surplusN,surplusD,breakEven,runwayN:x.cash*surplusD,runwayD:S*lossN,hasBurn:lossN>0n};
  }
  const api={calculate,decimal,parseDecimal};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.H5Model=api;
})(typeof globalThis!=='undefined'?globalThis:this);
