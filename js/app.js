const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let DB=JSON.parse(localStorage.getItem("ss_db")||'{"user":null,"meds":[],"rec":[],"water":{},"taken":{}}'),otpCode=null;
const save=()=>localStorage.setItem("ss_db",JSON.stringify(DB)),today=()=>new Date().toISOString().slice(0,10);
async function hash(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function sendOtp(){if(!/^\d{10}$/.test($("#phone").value)||!$("#name").value||!/^\d{4}$/.test($("#pin").value))return alert("Naam, 10 digit phone aur 4 digit PIN daalein");
 otpCode=String(Math.floor(1000+Math.random()*9000));alert("DEMO OTP: "+otpCode+"\n(Real SMS ke liye README mein Firebase step dekhein)");$("#otpBox").hidden=false}
async function verifyOtp(){if($("#otp").value!==otpCode)return alert("Galat OTP");const ph=await hash($("#phone").value),pin=await hash($("#pin").value);
 if(DB.user&&DB.user.ph===ph&&DB.user.pin!==pin)return alert("Galat PIN");DB.user={name:$("#name").value,ph,pin,phone:$("#phone").value};save();start()}
function logout(){DB.user=null;save();location.reload()}
function start(){$("#auth").hidden=true;$("#app").hidden=false;$("#hi").textContent="Namaste, "+DB.user.name;
 $("#symList").innerHTML=Object.entries(SYMPTOMS).map(([k,v])=>`<label><input type="checkbox" value="${k}">${v}</label>`).join("");
 $("#parts").innerHTML=Object.keys(PARTS).map(p=>`<button onclick="pickPart('${p}')">${p}</button>`).join("");
 $("#spec").innerHTML=SPECS.map(s=>`<option>${s}</option>`).join("");
 $("#gender").onchange=()=>$("#pregL").hidden=$("#gender").value!=="Female";
 $$("#nav button").forEach(b=>b.onclick=()=>show(b.dataset.t));show("dash");renderAll();
 botSay("Namaste! Main aapka health bot hoon. Neend, diet, vyayam, stress, sugar, bp, weight ke baare mein puchiye.")}
function show(t){$$(".tab").forEach(e=>e.classList.toggle("show",e.id===t));$$("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));renderAll()}
function renderAll(){renderMeds();renderRec();$("#water").textContent=DB.water[today()]||0;$("#streak").textContent=streak();$("#score").textContent=score()}
function addWater(){DB.water[today()]=Math.min(12,(DB.water[today()]||0)+1);save();renderAll()}
function bmi(){const h=$("#h").value/100,w=$("#w").value;if(!h||!w)return;const b=(w/(h*h)).toFixed(1);
 const c=b<18.5?"Kam wazan":b<25?"Normal ✅":b<30?"Zyada wazan":"Motapa";$("#bmiOut").textContent=`BMI ${b} – ${c}`;addRec("BMI "+b+" ("+c+")")}
function pickPart(p){$$("#symList input").forEach(i=>i.checked=PARTS[p].includes(i.value));show("check")}
function runCheck(){const sel=$$("#symList input:checked").map(i=>i.value),age=+$("#age").value,sev=+$("#sev").value,days=+$("#days").value,preg=$("#preg").checked&&$("#gender").value==="Female";
 if(!sel.length)return alert("Kam se kam ek symptom chunein");let h="",sp=null,urgent=false;
 if(sel.some(s=>RED.includes(s))||sev===3){urgent=true;h+=`<div class="alert">🚨 <b>Yeh serious ho sakta hai.</b> Turant hospital jaayein ya 112/108 call karein.</div>`;sp="Hospital Emergency"}
 else if(preg){urgent=true;sp="Gynecologist";h+=`<div class="alert">🤰 Pregnancy mein bina doctor ki salah ke koi dawai na lein. Gynecologist se milein.</div>`}
 else if(age&&(age<5||age>65)){urgent=true;sp=age<5?"Pediatrician":"General Physician";h+=`<div class="alert">⚠️ Is umar mein doctor se salah zaroori hai.</div>`}
 const sc=DISEASES.map(d=>({d,m:d.s.filter(s=>sel.includes(s)).length})).filter(x=>x.m>0).sort((a,b)=>b.m-a.m);
 if(!sc.length){urgent=true;sp=sp||"General Physician";h+=`<div class="alert">❓ Symptoms pehchane nahi gaye. Doctor se milein.</div>`}
 if(days>5){urgent=true;sp=sp||(sc[0]?sc[0].d.sp:"General Physician");h+=`<div class="alert">⏳ 5 din se zyada ho gaye – doctor ko dikhayein.</div>`}
 if(sc.length){const t=sc[0].d;h+=`<div class="ok"><b>Sambhav problem:</b> ${sc.slice(0,3).map(x=>x.d.n).join(", ")}</div>`;
  if(!urgent||(!preg&&sev<3&&!sel.some(s=>RED.includes(s)))){h+=`<h4>💊 Ghar ke upay / general OTC suggestion</h4><ul>${t.otc.map(o=>`<li>${o} <button onclick="quickMed('${o.split(" (")[0].replace(/'/g,"")}')">⏰ Reminder</button></li>`).join("")}</ul><small>Dose packet ke label ya pharmacist se confirm karein. Allergy ya purani bimari ho to doctor se puchein.</small>`}
  if(!sp)sp=t.sp}
 if(sp)h+=`<p><button onclick="goDoc('${sp}')">👨‍⚕️ ${sp} dhundein</button></p>`;
 $("#result").innerHTML=h;addRec("Check: "+sel.map(s=>SYMPTOMS[s]).join(", ")+(sc[0]?" → "+sc[0].d.n:""))}
function goDoc(s){$("#spec").value=s;show("docs");findDoc()}
function findDoc(){const q=encodeURIComponent($("#spec").value+" doctor near me");
 if(!navigator.geolocation)return window.open("https://www.google.com/maps/search/"+q);
 navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.google.com/maps/search/${q}/@${p.coords.latitude},${p.coords.longitude},14z`),()=>window.open("https://www.google.com/maps/search/"+q))}
function quickMed(n){$("#mname").value=n;show("meds")}
function addMed(){const n=$("#mname").value,t=$("#mtime").value;if(!n||!t)return;DB.meds.push({n,t});save();$("#mname").value="";renderMeds()}
function renderMeds(){$("#medList").innerHTML=DB.meds.map((m,i)=>{const done=(DB.taken[today()]||[]).includes(i);
 return`<li>${m.n} – ${m.t} ${done?"✅":`<button onclick="took(${i})">Kha li</button>`} <button class="ghost" onclick="delMed(${i})">✖</button></li>`}).join("")||"<li>Koi reminder nahi</li>"}
function took(i){(DB.taken[today()]=DB.taken[today()]||[]).push(i);save();renderAll()}
function delMed(i){DB.meds.splice(i,1);DB.taken={};save();renderAll()}
function streak(){let s=0,d=new Date();for(;;){const k=d.toISOString().slice(0,10),t=(DB.taken[k]||[]).length;if(!DB.meds.length||t<DB.meds.length)break;s++;d.setDate(d.getDate()-1)}return s}
function score(){let s=40;s+=Math.min(20,(DB.water[today()]||0)*2.5);if(DB.meds.length)s+=((DB.taken[today()]||[]).length/DB.meds.length)*25;s+=Math.min(15,DB.rec.length*3);return Math.round(s)}
setInterval(()=>{if(!DB.user)return;const n=new Date(),hm=n.toTimeString().slice(0,5);DB.meds.forEach((m,i)=>{const k="al"+today()+i;
 if(m.t===hm&&!sessionStorage[k]){sessionStorage[k]=1;if(window.Notification&&Notification.permission==="granted")new Notification("💊 Dawai ka time",{body:m.n+" kha lijiye"});alert("💊 "+m.n+" ka time ho gaya!")}})},20000);
function addRec(t){DB.rec.unshift({t,d:new Date().toLocaleString()});DB.rec=DB.rec.slice(0,100);save();renderRec()}
function renderRec(){$("#recList").innerHTML=DB.rec.map(r=>`<li>${r.d} – ${r.t}</li>`).join("")||"<li>Abhi koi record nahi</li>"}
function exportData(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify({meds:DB.meds,rec:DB.rec},null,2)],{type:"application/json"}));a.download="my-health-data.json";a.click()}
function wipe(){if(confirm("Saara data delete hoga. Pakka?")){localStorage.removeItem("ss_db");location.reload()}}
function botSay(t,c="b"){$("#chat").innerHTML+=`<div class="${c}">${c==="u"?"":"🤖 "}${t}</div>`;$("#chat").scrollTop=1e5}
function ask(){const m=$("#msg").value.toLowerCase().trim();if(!m)return;botSay($("#msg").value,"u");$("#msg").value="";
 const k=Object.keys(TIPS).find(x=>m.includes(x)),sym=Object.keys(SYMPTOMS).find(x=>m.includes(x));
 botSay(k?TIPS[k]:sym?"Is ke liye 'Symptoms' tab mein poora check karein.":"Main neend, diet, vyayam, stress, sugar, bp, weight, paani ke baare mein bata sakta hoon.")}
function sos(){const n=$("#ecName").value,p=$("#ecPhone").value.replace(/\D/g,"");
 const go=(loc)=>window.open(`https://wa.me/${p}?text=${encodeURIComponent("🚨 EMERGENCY! "+DB.user.name+" ko madad chahiye. Location: "+loc)}`);
 navigator.geolocation?navigator.geolocation.getCurrentPosition(x=>go(`https://maps.google.com/?q=${x.coords.latitude},${x.coords.longitude}`),()=>go("pata nahi chal paya")):go("unknown")}
if(DB.user)start();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
