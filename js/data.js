const SYMPTOMS={fever:"Bukhar",cough:"Khansi",cold:"Sardi/Naak behna",headache:"Sir dard",bodyache:"Badan dard",sore:"Gale mein dard",
acidity:"Acidity/Jalan",stomach:"Pet dard",loose:"Loose motion",vomit:"Ulti/Matli",rash:"Skin rash",itch:"Khujli",anxiety:"Ghabrahat/Stress",
chest:"Seene mein dard",breath:"Saans lene mein takleef",faint:"Behoshi/Chakkar",bleed:"Khoon behna",jointpain:"Jodon ka dard",toothache:"Daant dard",eye:"Aankh lal/dard"};
const RED=["chest","breath","faint","bleed"];
const DISEASES=[
{n:"Viral Fever / Flu",s:["fever","cough","cold","bodyache","sore","headache"],sp:"General Physician",otc:["Paracetamol (label ke hisaab se)","Aaram aur paani/ORS","Garm paani ke gargle"]},
{n:"Acidity / Gastritis",s:["acidity","stomach","vomit"],sp:"Gastroenterologist",otc:["Antacid (label dekhein)","Halka khana, tel-masale kam"]},
{n:"Stomach Infection",s:["loose","vomit","stomach","fever"],sp:"General Physician",otc:["ORS ghol baar baar","Naariyal paani, dahi-chawal"]},
{n:"Tension Headache / Migraine",s:["headache","anxiety","eye"],sp:"Neurologist",otc:["Aaram, andhera kamra","Paracetamol (label ke hisaab se)"]},
{n:"Allergy / Skin Problem",s:["rash","itch"],sp:"Dermatologist",otc:["Cetirizine (pharmacist se puchein)","Thanda sek"]},
{n:"Joint / Muscle Pain",s:["jointpain","bodyache"],sp:"Orthopedic",otc:["Garm sek","Halki stretching"]},
{n:"Dental Problem",s:["toothache"],sp:"Dentist",otc:["Namak ke paani se kulla"]},
{n:"Stress / Anxiety",s:["anxiety","faint","headache"],sp:"Psychiatrist",otc:["Deep breathing 4-7-8","Neend poori karein"]},
{n:"Eye Irritation",s:["eye","headache"],sp:"Eye Specialist",otc:["Saaf paani se dhoyein","Screen break"]}];
const PARTS={"🧠 Sir":["headache","anxiety","faint"],"👁 Aankh":["eye"],"😮 Gala/Naak":["sore","cold","cough"],"🫁 Seena":["chest","breath","cough"],
"🍽 Pet":["stomach","acidity","vomit","loose"],"💪 Haath-Pair":["jointpain","bodyache"],"🧴 Skin":["rash","itch"],"🦷 Daant":["toothache"],"🌡 Poora badan":["fever","bodyache"]};
const SPECS=["General Physician","Gynecologist","Cardiologist","Gastroenterologist","Neurologist","Dermatologist","Orthopedic","Dentist","Psychiatrist","Eye Specialist","Pediatrician","Hospital Emergency"];
const TIPS={neend:"Roz 7-8 ghante sona, sone se 1 ghanta pehle screen band karein.",diet:"Ghar ka khana, hari sabzi, protein, 2-3L paani. Cheeni aur junk kam.",bukhar:"Aaram, paani, 'Symptoms' tab se check karein. 3 din se zyada ho to doctor.",
vyayam:"Roz 30 min walk ya yoga. Dheere se shuru karein.",stress:"Deep breathing, walk, dost se baat. Zyada ho to counsellor se milein.",paani:"Din mein kam se kam 8 glass paani piyein.",
sugar:"Meetha kam karein, roz walk, saal mein ek baar sugar test.",bp:"Namak kam, walk, tension kam. Regular BP check karwayein.",weight:"Chhota calorie deficit, protein, walk. Crash diet na karein."};
