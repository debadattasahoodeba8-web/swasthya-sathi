const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let DB=null,uid=null,confirmation=null,verifier=null,tm;
firebase.initializeApp(firebaseConfig);const auth=firebase.auth(),fs=firebase.firestore();
const blank=()=>({name:"",phone:"",fcm:[],meds:[],rec:[],water:{},taken:{}}),today=()=>new Date().toISOString().slice(0,10);
function save(){if(!uid)return;clearTimeout(tm);tm=setTimeout(()=>fs.collection("users").doc(uid).set(DB).catch(e=>console.error(e)),400)}
function sendOtp(){const ph=$("#phone").value.trim();
 if(!$("#name").value.trim()||!/^\d{10}$/.test(ph))return alert("Enter your name and a 10-digit mobile number");
 if(!$("#consent").checked)return alert("Please accept the consent checkbox");
 if(firebaseConfig.apiKey.startsWith("PASTE"))return alert("Add your Firebase config in js/firebase-config.js first");
 verifier=verifier||new firebase.auth.RecaptchaVerifier("sendBtn",{size:"invisible"});
 auth.signInWithPhoneNumber("+91"+ph,verifier).then(r=>{confirmation=r;$("#otpBox").hidden=false;alert("OTP sent by SMS")}).catch(e=>{alert("Could not send OTP: "+e.message);try{verifier.clear()}catch(_){}verifier=null})}
function verifyOtp(){if(!confirmation)return;confirmation.confirm($("#otp").value.trim()).catch(()=>alert("Wrong OTP, try again"))}
auth.onAuthStateChanged(async u=>{if(!u)return;uid=u.uid;
 const s=await fs.collection("users").doc(uid).get();DB=Object.assign(blank(),s.exists?s.data():{});
 DB.phone=u.phoneNumber;if(!DB.name)DB.name=$("#name").value.trim()||"Patient";save();start()});
function logout(){auth.signOut().then(()=>location.reload())}
let started=false;
function start(){if(started)return;started=true;$("#auth").hidden=true;$("#app").hidden=false;$("#hi").textContent="Hello, "+DB.name;
 $("#symList").innerHTML=Object.entries(SYMPTOMS).map(([k,v])=>`<label><input type="checkbox" value="${k}">${v}</label>`).join("");
 $("#parts").innerHTML=Object.keys(PARTS).map(p=>`<button onclick="pickPart('${p}')">${p}</button>`).join("");
 $("#spec").innerHTML=SPECS.map(s=>`<option>${s}</option>`).join("");
 $("#gender").onchange=()=>$("#pregL").hidden=$("#gender").value!=="Female";
 $$("#nav button").forEach(b=>b.onclick=()=>show(b.dataset.t));show("dash");if(DB.fcm.length)$("#alertState").innerHTML="✅ Phone alerts are ON";{const q=new URLSearchParams(location.search).get("alarm");if(q)setTimeout(()=>ring(q),500)}
 botSay("Hello! I'm your health bot. Ask me about sleep, diet, exercise, stress, sugar, bp, weight or water.")}
function show(t){$$(".tab").forEach(e=>e.classList.toggle("show",e.id===t));$$("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));renderAll()}
function renderAll(){renderMeds();renderRec();$("#water").textContent=DB.water[today()]||0;$("#streak").textContent=streak();$("#score").textContent=score()}
function addWater(){DB.water[today()]=Math.min(12,(DB.water[today()]||0)+1);save();renderAll()}
function bmi(){const h=$("#h").value/100,w=$("#w").value;if(!h||!w)return;const b=(w/(h*h)).toFixed(1);
 const c=b<18.5?"Underweight":b<25?"Normal ✅":b<30?"Overweight":"Obese";$("#bmiOut").textContent=`BMI ${b} – ${c}`;addRec("BMI "+b+" ("+c+")")}
function pickPart(p){$$("#symList input").forEach(i=>i.checked=PARTS[p].includes(i.value));show("check")}
function runCheck(){const sel=$$("#symList input:checked").map(i=>i.value),age=+$("#age").value,sev=+$("#sev").value,days=+$("#days").value,preg=$("#preg").checked&&$("#gender").value==="Female";
 if(!sel.length)return alert("Select at least one symptom");let h="",sp=null,urgent=false;
 if(sel.some(s=>RED.includes(s))||sev===3){urgent=true;h+=`<div class="alert">🚨 <b>This may be serious.</b> Go to a hospital now or call 112/108.</div>`;sp="Hospital Emergency"}
 else if(preg){urgent=true;sp="Gynecologist";h+=`<div class="alert">🤰 During pregnancy do not take any medicine without a doctor's advice. Please see a gynecologist.</div>`}
 else if(age&&(age<5||age>65)){urgent=true;sp=age<5?"Pediatrician":"General Physician";h+=`<div class="alert">⚠️ At this age please consult a doctor.</div>`}
 const sc=DISEASES.map(d=>({d,m:d.s.filter(s=>sel.includes(s)).length})).filter(x=>x.m>0).sort((a,b)=>b.m-a.m);
 if(!sc.length){urgent=true;sp=sp||"General Physician";h+=`<div class="alert">❓ We could not identify these symptoms. Please see a doctor.</div>`}
 if(days>5){urgent=true;sp=sp||(sc[0]?sc[0].d.sp:"General Physician");h+=`<div class="alert">⏳ Symptoms for more than 5 days. Please see a doctor.</div>`}
 if(sc.length){const t=sc[0].d;h+=`<div class="ok"><b>Possible causes:</b> ${sc.slice(0,3).map(x=>x.d.n).join(", ")}</div>`;
  if(!urgent){h+=`<h4>💊 Home care / general OTC suggestions</h4><ul>${t.otc.map(o=>`<li>${o} <button onclick="quickMed('${o.split(" (")[0].replace(/'/g,"").replace(/\//g,"-")}')">⏰ Remind</button></li>`).join("")}</ul><small>Check dose on the pack label or ask a pharmacist. If you have allergies or ongoing conditions, ask a doctor first.</small>`}
  if(!sp)sp=t.sp}
 if(sp)h+=`<p><button onclick="goDoc('${sp}')">👨‍⚕️ Find ${sp}</button></p>`;
 $("#result").innerHTML=h;addRec("Check: "+sel.map(s=>SYMPTOMS[s]).join(", ")+(sc[0]?" → "+sc[0].d.n:""))}
function goDoc(s){$("#spec").value=s;show("docs");findDoc()}
function findDoc(){const q=encodeURIComponent($("#spec").value+" doctor near me");
 if(!navigator.geolocation)return window.open("https://www.google.com/maps/search/"+q);
 navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.google.com/maps/search/${q}/@${p.coords.latitude},${p.coords.longitude},14z`),()=>window.open("https://www.google.com/maps/search/"+q))}
function quickMed(n){$("#mname").value=n;show("meds")}
function addMed(){const n=$("#mname").value.trim(),t=$("#mtime").value;if(!n||!t)return;DB.meds.push({n,t});save();$("#mname").value="";renderMeds()}
function renderMeds(){$("#medList").innerHTML=DB.meds.map((m,i)=>{const done=(DB.taken[today()]||[]).includes(i);
 return`<li>${m.n} – ${m.t} ${done?"✅":`<button onclick="took(${i})">Taken</button>`} <button class="ghost" onclick="ics(${i})">📅 Phone alarm</button> <button class="ghost" onclick="delMed(${i})">✖</button></li>`}).join("")||"<li>No reminders yet</li>"}
function took(i){(DB.taken[today()]=DB.taken[today()]||[]).push(i);save();renderAll()}
function delMed(i){DB.meds.splice(i,1);DB.taken={};save();renderAll()}
function streak(){let s=0,d=new Date();for(;;){const k=d.toISOString().slice(0,10),t=(DB.taken[k]||[]).length;if(!DB.meds.length||t<DB.meds.length)break;s++;d.setDate(d.getDate()-1)}return s}
function score(){let s=40;s+=Math.min(20,(DB.water[today()]||0)*2.5);if(DB.meds.length)s+=((DB.taken[today()]||[]).length/DB.meds.length)*25;s+=Math.min(15,DB.rec.length*3);return Math.round(s)}
setInterval(()=>{if(!DB)return;const hm=new Date().toTimeString().slice(0,5);DB.meds.forEach((m,i)=>{const k="al"+today()+i;
 if(m.t===hm&&!sessionStorage[k]){sessionStorage[k]=1;ring(m.n)}})},20000);
function addRec(t){DB.rec.unshift({t,d:new Date().toLocaleString()});DB.rec=DB.rec.slice(0,100);save();renderRec()}
function renderRec(){$("#recList").innerHTML=DB.rec.map(r=>`<li>${r.d} – ${r.t}</li>`).join("")||"<li>No records yet</li>"}
function exportData(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(DB,null,2)],{type:"application/json"}));a.download="my-health-data.json";a.click()}
function requestDelete(){if(confirm("Send a request to delete your data? Our team will review it."))DB.deleteRequested=new Date().toISOString(),save(),alert("Request sent.")}
function botSay(t,c="b"){$("#chat").innerHTML+=`<div class="${c}">${c==="u"?"":"🤖 "}${t}</div>`;$("#chat").scrollTop=1e5}
function ask(){const raw=$("#msg").value,m=raw.toLowerCase().trim();if(!m)return;botSay(raw.replace(/</g,"&lt;"),"u");$("#msg").value="";
 const k=Object.keys(TIPS).find(x=>m.includes(x)),sym=Object.keys(SYMPTOMS).find(x=>m.includes(x));
 botSay(k?TIPS[k]:sym?"Please use the Symptoms tab for a full check.":"I can help with sleep, diet, exercise, stress, sugar, bp, weight and water.")}
function sos(){const p=$("#ecPhone").value.replace(/\D/g,"");if(!p)return alert("Enter an emergency contact number");
 const go=l=>window.open(`https://wa.me/${p}?text=${encodeURIComponent("🚨 EMERGENCY! "+DB.name+" needs help. Location: "+l)}`);
 navigator.geolocation?navigator.geolocation.getCurrentPosition(x=>go(`https://maps.google.com/?q=${x.coords.latitude},${x.coords.longitude}`),()=>go("unavailable")):go("unavailable")}
async function enableAlerts(){try{
 if(vapidKey.startsWith("PASTE"))return alert("Add your VAPID key in js/firebase-config.js first");
 if(await Notification.requestPermission()!=="granted")return alert("Please allow notifications in your browser settings");
 const reg=await navigator.serviceWorker.register("firebase-messaging-sw.js");
 const t=await firebase.messaging().getToken({vapidKey,serviceWorkerRegistration:reg});
 DB.fcm=[...new Set([...(DB.fcm||[]),t])];DB.tz=Intl.DateTimeFormat().resolvedOptions().timeZone;save();$("#alertState").innerHTML="✅ Phone alerts are ON"}catch(e){alert("Could not enable alerts: "+e.message)}}
if("serviceWorker"in navigator)navigator.serviceWorker.register("firebase-messaging-sw.js");

let actx,rt,vt,cur=null;
document.addEventListener("click",()=>{actx=actx||new(window.AudioContext||window.webkitAudioContext)();actx.resume()});
function beep(){if(!actx)return;const o=actx.createOscillator(),g=actx.createGain();o.type="square";o.frequency.value=880;g.gain.value=.25;o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+.18)}
function ring(name){if(cur)return;cur=name;const tick=()=>{beep();setTimeout(beep,250);setTimeout(beep,500)};tick();rt=setInterval(tick,1500);
 vt=setInterval(()=>navigator.vibrate&&navigator.vibrate([400,200,400]),1500);
 const d=document.createElement("div");d.id="alarm";d.innerHTML=`<div><div style="font-size:64px">⏰</div><h2>Medicine time</h2><p style="font-size:20px">${name.replace(/</g,"&lt;")}</p><button onclick="stopAlarm(true)">✅ Taken</button><button class="ghost" onclick="stopAlarm(false)">😴 Snooze 5 min</button></div>`;document.body.appendChild(d);
 setTimeout(()=>{if(cur===name)stopAlarm(false)},120000)}
function stopAlarm(taken){const n=cur;cur=null;clearInterval(rt);clearInterval(vt);navigator.vibrate&&navigator.vibrate(0);const d=$("#alarm");if(d)d.remove();
 if(taken){const i=DB.meds.findIndex(m=>m.n===n);if(i>=0&&!(DB.taken[today()]||[]).includes(i))took(i)}else setTimeout(()=>ring(n),300000)}
function ics(i){const m=DB.meds[i],d=new Date(),[h,mi]=m.t.split(":"),p=n=>String(n).padStart(2,"0"),ds=d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"T"+h+mi+"00",nm=m.n.replace(/[\r\n,;]/g," ");
 const t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SwasthyaSathi//EN","BEGIN:VEVENT","UID:"+Date.now()+"@swasthya","DTSTAMP:"+ds,"DTSTART:"+ds,"DURATION:PT5M","RRULE:FREQ=DAILY","SUMMARY:Take "+nm,"BEGIN:VALARM","ACTION:AUDIO","TRIGGER:PT0S","END:VALARM","BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Medicine time","TRIGGER:PT0S","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/calendar"}));a.download="medicine-alarm.ics";a.click()}
try{firebase.messaging().onMessage(p=>ring((p.data&&p.data.med)||"your medicine"))}catch(e){}
