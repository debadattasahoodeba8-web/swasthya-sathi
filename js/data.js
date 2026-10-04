const SYMPTOMS={fever:"Fever",cough:"Cough",cold:"Cold / runny nose",headache:"Headache",bodyache:"Body ache",sore:"Sore throat",acidity:"Acidity / heartburn",stomach:"Stomach pain",loose:"Loose motions",vomit:"Vomiting / nausea",rash:"Skin rash",itch:"Itching",anxiety:"Anxiety / stress",chest:"Chest pain",breath:"Difficulty breathing",faint:"Fainting / dizziness",bleed:"Bleeding",jointpain:"Joint pain",toothache:"Toothache",eye:"Red / painful eye"};
const RED=["chest","breath","faint","bleed"];
const DISEASES=[
{n:"Viral Fever / Flu",s:["fever","cough","cold","bodyache","sore","headache"],sp:"General Physician",otc:["Paracetamol (follow the label)","Rest and plenty of fluids / ORS","Warm salt-water gargle"]},
{n:"Acidity / Gastritis",s:["acidity","stomach","vomit"],sp:"Gastroenterologist",otc:["Antacid (follow the label)","Light food, avoid oily and spicy meals"]},
{n:"Stomach Infection",s:["loose","vomit","stomach","fever"],sp:"General Physician",otc:["ORS solution, sip often","Coconut water, curd rice"]},
{n:"Tension Headache / Migraine",s:["headache","anxiety","eye"],sp:"Neurologist",otc:["Rest in a dark quiet room","Paracetamol (follow the label)"]},
{n:"Allergy / Skin Problem",s:["rash","itch"],sp:"Dermatologist",otc:["Cetirizine (ask a pharmacist)","Cold compress"]},
{n:"Joint / Muscle Pain",s:["jointpain","bodyache"],sp:"Orthopedic",otc:["Warm compress","Gentle stretching"]},
{n:"Dental Problem",s:["toothache"],sp:"Dentist",otc:["Warm salt-water rinse"]},
{n:"Stress / Anxiety",s:["anxiety","faint","headache"],sp:"Psychiatrist",otc:["Deep breathing (4-7-8)","Get enough sleep"]},
{n:"Eye Irritation",s:["eye","headache"],sp:"Eye Specialist",otc:["Rinse with clean water","Take screen breaks"]}];
const PARTS={"🧠 Head":["headache","anxiety","faint"],"👁 Eye":["eye"],"😮 Throat / Nose":["sore","cold","cough"],"🫁 Chest":["chest","breath","cough"],
"🍽 Stomach":["stomach","acidity","vomit","loose"],"💪 Arms / Legs":["jointpain","bodyache"],"🧴 Skin":["rash","itch"],"🦷 Teeth":["toothache"],"🌡 Whole body":["fever","bodyache"]};
const SPECS=["General Physician","Gynecologist","Cardiologist","Gastroenterologist","Neurologist","Dermatologist","Orthopedic","Dentist","Psychiatrist","Eye Specialist","Pediatrician","Hospital Emergency"];
const TIPS={sleep:"Sleep 7-8 hours. Avoid screens one hour before bed.",diet:"Eat home-cooked food, vegetables, protein, 2-3 L water. Cut sugar and junk food.",fever:"Rest, drink fluids, and use the Symptoms tab. See a doctor if it lasts more than 3 days.",
exercise:"Walk or do yoga for 30 minutes daily. Start slowly.",stress:"Try deep breathing, a walk, or talking to a friend. If it is heavy, see a counsellor.",water:"Drink at least 8 glasses of water a day.",
sugar:"Cut sweets, walk daily, and get a sugar test once a year.",bp:"Reduce salt, stay active, and check your BP regularly.",weight:"Small calorie deficit, protein and walking. Avoid crash diets."};
