(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();let x=null,h=!0;const te=new Set;function fe(e){te.add(e),e.textContent=h?"🔊":"🔇"}function ue(){h=!h;const e=h?"🔊":"🔇";te.forEach(t=>{t.textContent=e})}function I(){x&&(x.close(),x=null)}function b(){return x||(x=new(window.AudioContext||window.webkitAudioContext)),x.state==="suspended"&&x.resume(),x}function p(e,t,n,s,a=.28,i=null){const l=b(),g=l.createOscillator(),f=l.createGain();g.connect(f),f.connect(l.destination),g.type=e,i?(g.frequency.setValueAtTime(i,n),g.frequency.linearRampToValueAtTime(t,n+s*.6)):g.frequency.setValueAtTime(t,n),f.gain.setValueAtTime(0,n),f.gain.linearRampToValueAtTime(a,n+.01),f.gain.setValueAtTime(a,n+s*.5),f.gain.exponentialRampToValueAtTime(1e-4,n+s),g.start(n),g.stop(n+s+.05)}function me(e,t=.08,n=.12){const s=b(),a=Math.ceil(s.sampleRate*t),i=s.createBuffer(1,a,s.sampleRate),l=i.getChannelData(0);for(let m=0;m<a;m++)l[m]=Math.random()*2-1;const g=s.createBufferSource(),f=s.createBiquadFilter(),d=s.createGain();g.buffer=i,f.type="highpass",f.frequency.value=1800,d.gain.setValueAtTime(n,e),d.gain.exponentialRampToValueAtTime(1e-4,e+t),g.connect(f),f.connect(d),d.connect(s.destination),g.start(e),g.stop(e+t+.02)}function G(){if(!h)return;const e=b(),t=e.currentTime;p("sine",320,t,.08,.1,300)}function ne(){if(!h)return;const e=b(),t=e.currentTime;p("sine",523.25,t,.18,.3),p("sine",659.25,t+.1,.22,.28)}function se(){if(!h)return;const e=b(),t=e.currentTime;p("sawtooth",174.61,t,.35,.18,220)}function ae(){if(!h)return;const e=b(),t=e.currentTime;[523.25,659.25,783.99,1046.5].forEach((s,a)=>{p("sine",s,t+a*.13,.3,.26),p("triangle",s,t+a*.13,.28,.1)}),p("sine",1318.51,t+.6,.4,.14)}function oe(){if(!h)return;const e=b(),t=e.currentTime;p("triangle",261.63,t,.4,.22,300),p("triangle",220,t+.35,.4,.2,280),p("triangle",174.61,t+.7,.5,.18,240)}function ve(){if(!h)return;const e=b(),t=e.currentTime;me(t,.07,.1);const n=[1046.5,1174.66,1318.51,1396.91,1567.98];p("sine",n[Math.floor(Math.random()*n.length)],t+.01,.18,.12)}const pe=[{id:"game1",title:"🐸 Find the Numbers",desc:"Move Munchie around the grid and eat all the numbers that match the prompt.",topics:{K:`• Numbers 1 to 10
• Greater than / less than`,1:`• Numbers 1 to 20
• Odd and even
• + and − equations`,2:`• Two-digit numbers
• Even / odd
• Harder + and − equations`,3:`• Multiples of 2–9
• × and ÷ equations
• Odd and even`}},{id:"game2",title:"🍽️ Eat the Answer",desc:"An answer appears above Munchie. Move left or right to eat the equation that equals it.",topics:{K:`• Addition within 10
• Subtraction within 10`,1:`• Addition within 20
• Subtraction within 20`,2:`• Two-digit + and −
• Harder equations`,3:`• Multiplication
• Division`}}],he=["K","1","2","3"],ye={K:"gk",1:"g1",2:"g2",3:"g3"};let V=null;function xe(e,t){V=t,e.innerHTML=be();const n=e.querySelector("#gs-snd-btn");fe(n),n.addEventListener("click",ue),e.querySelectorAll(".gs-grade-btn").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.game,i=s.dataset.grade;V(a,i)})})}function be(){return`
    <div id="gs-header">
      <div>
        <div class="gs-main-title">🐸 Munchie's Math Munch</div>
        <div class="gs-main-sub">Pick a game and a grade to start!</div>
      </div>
      <button class="snd-btn" id="gs-snd-btn" title="Toggle sound">🔊</button>
    </div>
    <div id="gs-games">${pe.map(t=>`
    <div class="gs-game-card">
      <div class="gs-game-header">
        <div>
          <div class="gs-game-title">${t.title}</div>
          <div class="gs-game-desc">${t.desc}</div>
        </div>
      </div>
      <div class="gs-grade-row">
        ${he.map(n=>`
          <button class="gs-grade-btn grade-btn ${ye[n]}" data-game="${t.id}" data-grade="${n}">
            <div class="grade-header">
              <p class="grade-label">${n==="K"?"Kindergarten":"Grade "+n}</p>
            </div>
            <div class="grade-body">
              <p class="grade-topics">${t.topics[n].replace(/\n/g,"<br>")}</p>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `).join("")}</div>
  `}function o(e,t){return Math.floor(Math.random()*(t-e+1))+e}function y(e,t,n){let s,a=0;do s=o(e,t),a++;while(n.includes(s)&&a<200);return s}const ie={K:[{text:"greater than 3",fn:e=>e>3,gen:()=>o(1,10)},{text:"less than 4",fn:e=>e<4,gen:()=>o(1,10)},{text:"greater than 5",fn:e=>e>5,gen:()=>o(1,10)},{text:"less than 6",fn:e=>e<6,gen:()=>o(1,10)},{text:"greater than 7",fn:e=>e>7,gen:()=>o(1,10)},{text:"less than 3",fn:e=>e<3,gen:()=>o(1,10)},{text:"greater than 2",fn:e=>e>2,gen:()=>o(1,10)},{text:"less than 8",fn:e=>e<8,gen:()=>o(1,10)}],1:[{text:"odd numbers",fn:e=>e%2!==0,gen:()=>o(1,20)},{text:"even numbers",fn:e=>e%2===0,gen:()=>o(1,20)},{text:"greater than 10",fn:e=>e>10,gen:()=>o(1,20)},{text:"less than 10",fn:e=>e<10,gen:()=>o(1,20)},{text:"greater than 14",fn:e=>e>14,gen:()=>o(1,20)},{text:"less than 6",fn:e=>e<6,gen:()=>o(1,20)},{text:"greater than 3 + 5",fn:e=>e>8,gen:()=>o(1,20)},{text:"less than 6 + 7",fn:e=>e<13,gen:()=>o(1,20)},{text:"greater than 9 + 4",fn:e=>e>13,gen:()=>o(1,20)},{text:"less than 8 + 3",fn:e=>e<11,gen:()=>o(1,20)},{text:"greater than 12 − 4",fn:e=>e>8,gen:()=>o(1,20)},{text:"less than 15 − 3",fn:e=>e<12,gen:()=>o(1,20)},{text:"greater than 10 − 6",fn:e=>e>4,gen:()=>o(1,20)},{text:"less than 18 − 5",fn:e=>e<13,gen:()=>o(1,20)}],2:[{text:"even numbers",fn:e=>e%2===0,gen:()=>o(10,99)},{text:"odd numbers",fn:e=>e%2!==0,gen:()=>o(10,99)},{text:"greater than 50",fn:e=>e>50,gen:()=>o(10,99)},{text:"less than 50",fn:e=>e<50,gen:()=>o(10,99)},{text:"between 40 and 49",fn:e=>e>=40&&e<=49,gen:()=>o(10,99)},{text:"between 60 and 69",fn:e=>e>=60&&e<=69,gen:()=>o(10,99)},{text:"between 20 and 29",fn:e=>e>=20&&e<=29,gen:()=>o(10,99)},{text:"greater than 30 + 12",fn:e=>e>42,gen:()=>o(10,99)},{text:"less than 20 + 35",fn:e=>e<55,gen:()=>o(10,99)},{text:"greater than 45 + 14",fn:e=>e>59,gen:()=>o(10,99)},{text:"less than 61 + 18",fn:e=>e<79,gen:()=>o(10,99)},{text:"greater than 22 + 31",fn:e=>e>53,gen:()=>o(10,99)},{text:"less than 80 − 15",fn:e=>e<65,gen:()=>o(10,99)},{text:"greater than 70 − 24",fn:e=>e>46,gen:()=>o(10,99)},{text:"less than 95 − 30",fn:e=>e<65,gen:()=>o(10,99)},{text:"greater than 60 − 17",fn:e=>e>43,gen:()=>o(10,99)},{text:"less than 50 − 11",fn:e=>e<39,gen:()=>o(10,99)}],3:[{text:"multiples of 2",fn:e=>e%2===0&&e!==2,gen:()=>y(4,60,[2])},{text:"multiples of 3",fn:e=>e%3===0&&e!==3,gen:()=>y(4,60,[3])},{text:"multiples of 4",fn:e=>e%4===0&&e!==4,gen:()=>y(5,60,[4])},{text:"multiples of 5",fn:e=>e%5===0&&e!==5,gen:()=>y(6,60,[5])},{text:"multiples of 6",fn:e=>e%6===0&&e!==6,gen:()=>y(7,60,[6])},{text:"multiples of 7",fn:e=>e%7===0&&e!==7,gen:()=>y(8,60,[7])},{text:"multiples of 8",fn:e=>e%8===0&&e!==8,gen:()=>y(9,60,[8])},{text:"multiples of 9",fn:e=>e%9===0&&e!==9,gen:()=>y(10,60,[9])},{text:"odd numbers",fn:e=>e%2!==0,gen:()=>o(1,60)},{text:"even numbers",fn:e=>e%2===0,gen:()=>o(2,60)},{text:"greater than 4 × 3",fn:e=>e>12,gen:()=>o(1,60)},{text:"less than 6 × 4",fn:e=>e<24,gen:()=>o(1,60)},{text:"greater than 7 × 3",fn:e=>e>21,gen:()=>o(1,60)},{text:"less than 5 × 8",fn:e=>e<40,gen:()=>o(1,60)},{text:"greater than 3 × 9",fn:e=>e>27,gen:()=>o(1,60)},{text:"less than 6 × 7",fn:e=>e<42,gen:()=>o(1,60)},{text:"greater than 24 ÷ 4",fn:e=>e>6,gen:()=>o(1,60)},{text:"less than 36 ÷ 3",fn:e=>e<12,gen:()=>o(1,60)},{text:"greater than 45 ÷ 5",fn:e=>e>9,gen:()=>o(1,60)},{text:"less than 56 ÷ 7",fn:e=>e<8,gen:()=>o(1,60)},{text:"greater than 32 ÷ 4",fn:e=>e>8,gen:()=>o(1,60)},{text:"less than 63 ÷ 9",fn:e=>e<7,gen:()=>o(1,60)}]},D=["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff922b","#cc5de8","#f06595","#74c0fc","#a9e34b","#ff99c8"];let A=null,H=[];function j(e,t){return Math.floor(Math.random()*(t-e+1))+e}function L(){A&&(cancelAnimationFrame(A),A=null),H.forEach(t=>clearTimeout(t)),H=[];const e=document.getElementById("fw-canvas");e&&e.getContext("2d").clearRect(0,0,e.width,e.height)}function re(e){const t=document.getElementById("fw-canvas");t.width=e.offsetWidth||370,t.height=e.offsetHeight||375;const n=t.getContext("2d"),s=[];function a(d,m,u){const M=Math.random()*Math.PI*2,F=.6+Math.random()*2.8;return{x:d,y:m,color:u,vx:Math.cos(M)*F,vy:Math.sin(M)*F,alpha:1,radius:.8+Math.random()*1.4,decay:.006+Math.random()*.006,gravity:.04}}function i(d,m){const u=D[Math.floor(Math.random()*D.length)];for(let M=0;M<55+Math.floor(Math.random()*16);M++)s.push(a(d,m,u));ve()}const l=[0,400,800,1300,1800,2300,2900,3500,4e3,4500],g=performance.now();l.forEach(d=>H.push(setTimeout(()=>i(j(t.width*.1,t.width*.9),j(t.height*.08,t.height*.65)),d)));function f(d){n.fillStyle="rgba(255,255,255,0.14)",n.fillRect(0,0,t.width,t.height);for(let m=s.length-1;m>=0;m--){const u=s[m];if(u.x+=u.vx,u.y+=u.vy,u.vy+=u.gravity,u.vx*=.99,u.vy*=.99,u.alpha-=u.decay,u.alpha<=0){s.splice(m,1);continue}n.globalAlpha=u.alpha,n.fillStyle=u.color,n.beginPath(),n.arc(u.x,u.y,u.radius,0,Math.PI*2),n.fill()}n.globalAlpha=1,d-g<6500||s.length>0?A=requestAnimationFrame(f):n.clearRect(0,0,t.width,t.height)}A=requestAnimationFrame(f)}const v=6,z=2,N=2,we=3,Ee=3,Me=3,T={};let c={},O=null,_=null;function S(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}function Ae(e){const t=ie[e].map((n,s)=>s);S(t),T[e]={deck:t,recentWins:[]}}function Be(e){T[e]||Ae(e);const t=T[e],n=ie[e],s=new Set(t.recentWins);let a=t.deck.findIndex(l=>!s.has(n[l].text));a===-1&&(a=0);const i=t.deck.splice(a,1)[0];if(t.deck.length===0){const l=n.map((g,f)=>f);S(l),t.deck=l}return n[i]}function Ce(e,t){const n=T[e];n.recentWins.push(t),n.recentWins.length>Me&&n.recentWins.shift()}function q(e,t){return e*v+t}function ke(e,t,n){O=t,_=n,e.innerHTML=Ie(),e.querySelectorAll(".g1-back-btn").forEach(s=>s.addEventListener("click",()=>{L(),I(),_()})),e.querySelector("#g1-play-again-btn").addEventListener("click",()=>{L(),I(),U()}),U()}function Ie(){return`
  <div id="g1-screen" style="display:flex;flex-direction:column;gap:0;">
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;gap:10px;align-items:center;">
          <div id="g1-cur-val-box"><div id="g1-cur-val-label">on this square</div><div id="g1-cur-val">—</div></div>
          <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.9;">↑↓←→ move<br>Space eat</div>
        </div>
        <div style="position:relative;">
          <div id="g1-grid"></div>
          <div class="overlay" id="g1-end-overlay" style="display:none;">
            <canvas id="fw-canvas"></canvas>
            <div class="overlay-content" id="g1-overlay-content">
              <div id="g1-ov-anim"></div>
              <h2 id="g1-ov-title"></h2>
              <p id="g1-ov-msg"></p>
              <div class="btn-row" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                <button class="action-btn" id="g1-play-again-btn">Play again</button>
                <button class="action-btn g1-back-btn">Change game</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;padding-top:2px;min-width:170px;">
        <div id="g1-prompt-box"><div id="g1-prompt-label">Eat all numbers that are</div><div id="g1-prompt-text"></div></div>
        <div>
          <div style="font-size:10px;color:var(--color-text-secondary);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Correct</div>
          <div style="display:flex;gap:6px;margin-bottom:12px;">
            <div class="result-slot" id="g1-c0"></div><div class="result-slot" id="g1-c1"></div><div class="result-slot" id="g1-c2"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Wrong</div>
          <div style="display:flex;gap:6px;">
            <div class="result-slot" id="g1-w0"></div><div class="result-slot" id="g1-w1"></div><div class="result-slot" id="g1-w2"></div>
          </div>
        </div>
        <button class="action-btn g1-back-btn" style="font-size:12px;padding:6px 14px;margin-top:6px;">← Change game</button>
      </div>
    </div>
  </div>`}function U(){const e=Be(O),t=[];for(let a=0;a<v;a++)for(let i=0;i<v;i++)a===z&&i===N||t.push(q(a,i));S(t);const n=Array.from({length:v*v},(a,i)=>{const l=Math.floor(i/v),g=i%v;return{val:l===z&&g===N?null:e.gen(),eaten:!1}}),s=(a,i)=>{const l=t.filter(d=>!a(n[d].val));S(l);let g=t.filter(d=>a(n[d].val)).length,f=0;for(;g<i&&f<l.length;){let d,m=0;do d=e.gen(),m++;while(!a(d)&&m<200);a(d)&&(n[l[f]].val=d,g++),f++}};s(e.fn,6),s(a=>!e.fn(a),8),c={cells:n,frog:{r:z,c:N},prompt:e,correct:0,wrong:0,over:!1},document.getElementById("g1-prompt-text").textContent=e.text;for(let a=0;a<3;a++)["g1-c","g1-w"].forEach(i=>{const l=document.getElementById(i+a);l.className="result-slot",l.textContent=""});document.getElementById("g1-end-overlay").style.display="none",document.getElementById("g1-overlay-content").className="overlay-content",K(),P()}function P(){const e=document.getElementById("g1-grid");e.innerHTML="";for(let t=0;t<v;t++)for(let n=0;n<v;n++){const s=c.cells[q(t,n)],a=c.frog.r===t&&c.frog.c===n,i=document.createElement("div");i.className="g1-cell",a?(i.classList.add("munchie"),i.textContent="🐸"):s.eaten?(i.classList.add("eaten"),i.textContent=s.val??""):s.val!==null&&(i.textContent=s.val),e.appendChild(i)}}function K(){const e=c.cells[q(c.frog.r,c.frog.c)];document.getElementById("g1-cur-val").textContent=e.val===null||e.eaten?"—":e.val}function k(e,t){if(c.over)return;const n=c.frog.r+e,s=c.frog.c+t;n<0||n>=v||s<0||s>=v||(c.frog={r:n,c:s},G(),K(),P())}function Le(){if(c.over)return;const e=c.cells[q(c.frog.r,c.frog.c)];if(e.val===null||e.eaten)return;if(e.eaten=!0,c.prompt.fn(e.val)){const n=document.getElementById("g1-c"+c.correct);n.classList.add("correct"),n.textContent="✓",c.correct++,ne(),c.correct>=we&&Y(!0)}else{const n=document.getElementById("g1-w"+c.wrong);n.classList.add("wrong"),n.textContent="✗",c.wrong++,se(),c.wrong>=Ee&&Y(!1)}K(),P()}function Y(e){c.over=!0;const t=document.getElementById("g1-end-overlay"),n=document.getElementById("g1-overlay-content");t.style.display="flex",e?(t.style.background="transparent",n.className="overlay-content win-content",document.getElementById("g1-ov-anim").innerHTML='<span style="font-size:48px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🎉</span>',document.getElementById("g1-ov-title").textContent="Amazing job!",document.getElementById("g1-ov-msg").textContent="Munchie ate all the right numbers! You're a math star!",ae(),re(t),Ce(O,c.prompt.text)):(t.style.background="transparent",n.className="overlay-content lose-content",document.getElementById("g1-ov-anim").innerHTML='<div class="dizzy-wrap"><span class="lose-frog">🐸</span><span class="dizzy-star" style="animation-delay:0s">⭐</span><span class="dizzy-star" style="animation-delay:-0.33s">⭐</span><span class="dizzy-star" style="animation-delay:-0.66s">⭐</span></div>',document.getElementById("g1-ov-title").textContent="Oof! Tummy ache!",document.getElementById("g1-ov-msg").textContent="Munchie ate too many wrong numbers and his tummy hurts! Let's try again!",oe())}function Te(e){c.frog&&(e.key==="ArrowUp"?k(-1,0):e.key==="ArrowDown"?k(1,0):e.key==="ArrowLeft"?k(0,-1):e.key==="ArrowRight"?k(0,1):e.key===" "&&Le())}function E(e,t){return Math.floor(Math.random()*(t-e+1))+e}function B(e,t){const n=E(e,t),s=E(e,t-n+e),a=Math.random()<.5?"+":"-",i=a==="+"?n+s:n-s;return i<1?B(e,t):{text:a==="+"?`${n} + ${s}`:`${n} − ${s}`,value:i}}function le(e){const t=E(2,e),n=E(2,e);return{text:`${t} × ${n}`,value:t*n}}function ce(){const e=E(2,9),t=E(2,9);return{text:`${t*e} ÷ ${e}`,value:t}}function Se(e,t){let n,s=0;do n=t==="3"?Math.random()<.5?le(9):ce():B(t==="K"||t==="1"?1:10,t==="K"?9:t==="1"?18:90),s++;while(n.value===e&&s<50);return n}function de(e){let t;e==="K"?t=B(1,9):e==="1"?t=B(1,18):e==="2"?t=B(10,90):t=Math.random()<.5?le(9):ce();const n=Se(t.value,e),s=Math.random()<.5;return{answer:t.value,left:s?n:t,right:s?t:n,correctSide:s?"right":"left"}}const $e=3,qe=3;let r={},W=null,X=null;function ze(e,t,n){W=t,X=n,e.innerHTML=Ne(),e.querySelector("#g2-play-again-btn").addEventListener("click",()=>{L(),I(),Q()}),e.querySelectorAll(".g2-back-btn").forEach(s=>s.addEventListener("click",()=>{L(),I(),X()})),Q()}function Ne(){return`
  <div id="g2-screen" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div id="g2-answer-box">
      <div id="g2-answer-label">Answer</div>
      <div id="g2-answer-value">—</div>
    </div>
    <div id="g2-arena">
      <div class="g2-eq-cell gap-right" id="g2-left">
        <span class="g2-frog-icon">🐸</span>
        <span class="g2-eq-text"></span>
      </div>
      <div class="g2-frog-cell" id="g2-frog">🐸</div>
      <div class="g2-eq-cell gap-left" id="g2-right">
        <span class="g2-frog-icon">🐸</span>
        <span class="g2-eq-text"></span>
      </div>
    </div>
    <div style="font-size:12px;color:var(--color-text-secondary);">← → move &nbsp;|&nbsp; Space eat</div>
    <div id="g2-scores">
      <div class="g2-score-group">
        <div class="g2-score-label">Correct</div>
        <div class="g2-slots">
          <div class="result-slot" id="g2-c0"></div>
          <div class="result-slot" id="g2-c1"></div>
          <div class="result-slot" id="g2-c2"></div>
        </div>
      </div>
      <div class="g2-score-group">
        <div class="g2-score-label">Wrong</div>
        <div class="g2-slots">
          <div class="result-slot" id="g2-w0"></div>
          <div class="result-slot" id="g2-w1"></div>
          <div class="result-slot" id="g2-w2"></div>
        </div>
      </div>
    </div>
    <button class="action-btn g2-back-btn" style="font-size:12px;padding:6px 14px;">← Change game</button>

    <div class="overlay" id="g2-end-overlay" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;">
      <canvas id="fw-canvas"></canvas>
      <div class="overlay-content" id="g2-overlay-content">
        <div id="g2-ov-anim"></div>
        <h2 id="g2-ov-title"></h2>
        <p id="g2-ov-msg"></p>
        <div class="btn-row" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <button class="action-btn" id="g2-play-again-btn">Play again</button>
          <button class="action-btn g2-back-btn">Change game</button>
        </div>
      </div>
    </div>
  </div>`}function Q(){r={round:de(W),pos:"center",correct:0,wrong:0,over:!1};for(let e=0;e<3;e++)["g2-c","g2-w"].forEach(t=>{const n=document.getElementById(t+e);n.className="result-slot",n.textContent=""});document.getElementById("g2-end-overlay").style.display="none",document.getElementById("g2-overlay-content").className="overlay-content",$()}function $(){document.getElementById("g2-answer-value").textContent=r.round.answer;const e=document.getElementById("g2-left"),t=document.getElementById("g2-right"),n=document.getElementById("g2-frog");e.querySelector(".g2-eq-text").textContent=r.round.left.text,t.querySelector(".g2-eq-text").textContent=r.round.right.text,e.classList.toggle("munchie-here",r.pos==="left"),t.classList.toggle("munchie-here",r.pos==="right"),n.classList.toggle("hidden",r.pos!=="center")}function J(e){r.over||(e==="left"&&r.pos!=="left"?(r.pos=r.pos==="center"?"left":"center",G(),$()):e==="right"&&r.pos!=="right"&&(r.pos=r.pos==="center"?"right":"center",G(),$()))}function Ge(){if(r.over||r.pos==="center")return;if(r.pos===r.round.correctSide){const t=document.getElementById("g2-c"+r.correct);if(t.classList.add("correct"),t.textContent="✓",r.correct++,ne(),r.correct>=$e){Z(!0);return}}else{const t=document.getElementById("g2-w"+r.wrong);if(t.classList.add("wrong"),t.textContent="✗",r.wrong++,se(),r.wrong>=qe){Z(!1);return}}r.round=de(W),r.pos="center",$()}function Z(e){r.over=!0;const t=document.getElementById("g2-end-overlay"),n=document.getElementById("g2-overlay-content");t.style.display="flex",e?(t.style.background="transparent",n.className="overlay-content win-content",document.getElementById("g2-ov-anim").innerHTML='<span style="font-size:48px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🎉</span>',document.getElementById("g2-ov-title").textContent="Amazing job!",document.getElementById("g2-ov-msg").textContent="Munchie ate the right answers! You're a math star!",ae(),re(t)):(t.style.background="transparent",n.className="overlay-content lose-content",document.getElementById("g2-ov-anim").innerHTML='<div class="dizzy-wrap"><span class="lose-frog">🐸</span><span class="dizzy-star" style="animation-delay:0s">⭐</span><span class="dizzy-star" style="animation-delay:-0.33s">⭐</span><span class="dizzy-star" style="animation-delay:-0.66s">⭐</span></div>',document.getElementById("g2-ov-title").textContent="Oof! Tummy ache!",document.getElementById("g2-ov-msg").textContent="Munchie ate too many wrong answers and his tummy hurts! Let's try again!",oe())}function He(e){e.key==="ArrowLeft"?J("left"):e.key==="ArrowRight"?J("right"):e.key===" "&&Ge()}const ge=document.getElementById("app-root"),R=document.getElementById("screen-game-select"),w=document.getElementById("screen-game");let C=null;document.addEventListener("keydown",e=>{["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)&&e.preventDefault(),C&&C(e)});function ee(){C=null,ge.removeAttribute("data-grade"),R.style.display="flex",w.style.display="none",w.innerHTML=""}xe(R,(e,t)=>{ge.dataset.grade=t,R.style.display="none",w.style.display="flex",w.innerHTML="",e==="game1"?(C=Te,ke(w,t,ee)):e==="game2"&&(C=He,ze(w,t,ee))});
