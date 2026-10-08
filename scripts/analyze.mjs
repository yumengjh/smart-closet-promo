import fs from 'fs';
const raw=fs.readFileSync(process.argv[2]); const di=raw.indexOf('data')+8; const b=raw.subarray(di);
const s=new Int16Array(b.buffer,b.byteOffset,Math.floor(b.length/2)); const sr=11025;
const hop=Math.round(sr*0.05); const rms=[];
for(let i=0;i+hop<s.length;i+=hop){let e=0;for(let j=0;j<hop;j++)e+=s[i+j]**2;rms.push(Math.sqrt(e/hop)/32768)}
let line='';for(let t=0;t<rms.length;t+=20){const v=rms.slice(t,t+20).reduce((a,b)=>a+b,0)/20;line+=`${(t/20).toString().padStart(3)}s ${'#'.repeat(Math.round(v*120))}\n`}
console.log(line);
const h2=Math.round(sr*0.01);const env=[];for(let i=0;i+h2<s.length;i+=h2){let e=0;for(let j=0;j<h2;j++)e+=Math.abs(s[i+j]);env.push(e)}
const on=env.map((v,i)=>Math.max(0,v-(env[i-1]||0)));
let best=[];for(let lag=30;lag<=100;lag++){let c=0;for(let i=0;i+lag<on.length;i++)c+=on[i]*on[i+lag];best.push([c,lag])}
best.sort((a,b)=>b[0]-a[0]);console.log('top lags(10ms):',best.slice(0,5).map(x=>x[1]),'bpm',best.slice(0,3).map(x=>(6000/x[1]).toFixed(1)));
const lag=best[0][1];let bp=[0,0];for(let o=0;o<lag;o++){let c=0;for(let i=o;i<on.length;i+=lag)c+=on[i];if(c>bp[0])bp=[c,o]}console.log('phase s',bp[1]/100);
{const lag=40;let bp=[0,0];for(let o=0;o<lag;o++){let c=0;for(let i=o;i<on.length;i+=lag)c+=on[i];if(c>bp[0])bp=[c,o]}console.log('phase150',bp[1]/100);
// rms at 100ms for 0-45s
const r=[];for(let t=0;t<450;t++){const a=Math.floor(t*sr/10),n=Math.floor(sr/10);let e=0;for(let j=0;j<n;j++)e+=s[a+j]**2;r.push(Math.sqrt(e/n)/32768)}
console.log(r.map((v,i)=>i%10==0?`\n${i/10}s `+Math.round(v*99):Math.round(v*99)).join(' '))}
