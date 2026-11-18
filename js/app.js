/* =====================================================================
   SATTVIC KITCHEN — APP LOGIC
   - Bilingual (EN / HI) interface and recipe content
   - Daily rotation: day N of the plan is derived from meta.startDate
   - Hash router with animated view transitions
   - Scroll reveals, modal recipe viewer, search & cuisine filters
   ===================================================================== */
(() => {
  "use strict";

  const DATA = window.SATTVIC_DATA;
  const PLAN = DATA.plan;
  const SNACKS = DATA.snacks;
  const PP = DATA.postpartum || { categories: [], dishes: [] };
  const COLLECTION = (DATA.collection && DATA.collection.dishes) || [];
  const N = PLAN.length;

  /* ---------------- UI strings ---------------- */
  const I18N = {
    en: {
      brand: "Sattvic Kitchen",
      navToday: "Today", navPlan: "Daily Plan", navSnacks: "Evening Snacks", navPP: "Post-Partum Care",
      navTodayS: "Today", navPlanS: "Daily Plan", navSnacksS: "Snacks", navPPS: "Mother",
      ppEyebrow: "For new mothers", ppTitle: "Post-Partum Care", ppTeaserTitle: "Post-Partum Care",
      ppSeeAll: "Explore all dishes →", ppNoteTitle: "A gentle note", ppLabel: "Post-Partum",
      ppPromise: ["Light on the stomach", "Mild, no chilli", "Lactation-friendly", "Safe while breastfeeding"],
      benefitsTitle: "Health Benefits for Mother & Baby", cautionTitle: "Please note",
      ppCount: (n) => `${n} dishes`,
      tags: { lactation: "Lactation", iron: "Iron-rich", digestion: "Digestion", energy: "Energy", protein: "Protein", calcium: "Calcium", healing: "Healing", hydration: "Hydration" },
      pdfPP: "Post-Partum Care", pdfPPSub: (n) => `${n} healing recipes`,
      heroTitleA: "Pure food,", heroTitleB: "peaceful mind.",
      heroSub: "Your daily Sattvic menu, with no onion and no garlic, from kitchens around the world.",
      backToday: "Back to today",
      p1: "No Onion", p2: "No Garlic", p3: "No Eggs", p4: "No Mushrooms",
      upNextEyebrow: "Coming up", upNextTitle: "The next few days", seeFullPlan: "See full plan →",
      planEyebrow: "The Calendar", planTitle: "Your Meal Plan",
      planSub: (n) => `A ${n}-day rotating cycle of lunches and dinners. Tap any dish for the full recipe.`,
      searchPh: "Search dishes or ingredients…",
      noResults: "No dishes match your search.",
      snacksEyebrow: "Ready in 15 minutes or less", snacksTitle: "Evening Snacks",
      snacksSub: "Quick, light bites for tea-time, all onion- and garlic-free.",
      footerNote: "Cheese: use vegetarian-rennet brands. Always check masala labels for hidden onion or garlic powder.",
      footerPhotos: "Photos: Unsplash and Wikimedia Commons contributors (CC BY-SA); credits are in each recipe.",
      lunch: "Lunch", dinner: "Dinner", snack: "Snack",
      todays: (m) => `Today's ${m}`, tomorrows: (m) => `Tomorrow's ${m}`, yesterdays: (m) => `Yesterday's ${m}`,
      day: "Day", dayOf: (d, n) => `Day ${d} of ${n}`,
      today: "Today", all: "All",
      week: (n) => `Week ${n}`, weekShort: (n) => `W${n}`, daysRange: (a, b) => `Days ${a}–${b}`, photo: "Photo",
      prep: "Prep", cook: "Cook", total: "Total", serves: "Serves",
      min: "min", quick: "Quick",
      ingredients: "Ingredients", method: "Method", chefTip: "Chef's note:",
      items: (n) => `${n} items`,
      navHome: "Home", navHomeS: "Home", navExplore: "Explore", navExploreS: "Explore",
      collLabel: "Prasadam Collection", prasadamTitle: "Prasadam inspiration", ekadashi: "Ekadashi",
      homeEyebrow: "The Prasadam Collection", homeTitleA: "Food offered with love,", homeTitleB: "shared with everyone.",
      homeSub: (n) => `${n} pure vegetarian dishes, with no onion and no garlic, from North India and kitchens around the world, inspired by ISKCON temple prasadam.`,
      homeSearchPh: "Search dishes, ingredients or cuisines…", homePlanLink: "Prefer a day-by-day menu? Open the Daily Plan →",
      statDishes: "dishes", statCuisines: "cuisines", statEkadashi: "Ekadashi dishes", statPP: "post-partum dishes",
      rowNorth: "North Indian Prasadam", rowNorthSub: "Temple-style sabzis, dals, breads and sweets",
      rowIntl: "Prasadam from Around the World", rowIntlSub: "Govinda's-style global dishes, made Sattvic",
      rowFeast: "Sunday Feast & Festivals", rowFeastSub: "Dishes for the feast table and festival bhoga",
      rowSweets: "Temple Sweets & Desserts", rowSweetsSub: "Halava, laddoos, kheer and more",
      rowEkadashi: "Ekadashi Specials", rowEkadashiSub: "No grains or legumes",
      rowQuick: "Ready in 30 Minutes", rowQuickSub: "For busy days", rowProtein: "High-Protein Picks", rowProteinSub: "15 g+ protein per serving",
      rowPPSub: "Gentle, nourishing food for new mothers", rowPlan: "From the Daily Plan", rowPlanSub: "Lunches and dinners from the 54-day plan",
      seeAll: "See all →", exEyebrow: "Find your dish", exTitle: "Explore", exSearchPh: "Search within results…",
      filters: "Filters", clearAll: "Clear all", any: "Any", showMore: (n) => `Show ${n} more`,
      exCount: (n, t) => `${n} of ${t} dishes`,
      fSource: "Section", fKind: "Category", fGeo: "Region", fMeal: "Meal", fOccasion: "Occasion", fDiet: "Diet & lifestyle",
      fSpice: "Spice level", fLevel: "Difficulty", fTime: "Total time (min)", fKcal: "Calories per serving", fProtein: "Protein (g)",
      sortLabel: "Sort", sortRec: "Recommended", sortQuick: "Quickest first", sortKcal: "Lowest calories", sortProtein: "Highest protein", sortAZ: "A–Z",
      tabToday: "Today", tabCalendar: "54-day calendar",
      pdfCollection: "Prasadam Collection", pdfCollectionSub: (n) => `${n} dishes, by category`,
      pdfExplore: "My Explore results", pdfExploreSub: (n) => `${n} dishes matching your filters`, pdfKindAll: "All categories",
      pdfGroupAll: "North Indian + international", pdfGroupNorth: "North Indian", pdfGroupIntl: "International", pdfGroup: "Collection",
      nutriTitle: "Nutrition", nutriPer: "per serving", microTitle: "Vitamins & minerals", dvShort: "DV", ofKcal: "of kcal",
      n_protein: "Protein", n_carbs: "Carbs", n_fat: "Fat", n_fiber: "Fibre", n_sugar: "Sugars", n_satFat: "Saturated fat",
      n_sodium: "Sodium", n_potassium: "Potassium", n_calcium: "Calcium", n_iron: "Iron", n_magnesium: "Magnesium", n_zinc: "Zinc",
      n_vitA: "Vitamin A", n_vitC: "Vitamin C", n_folate: "Folate", n_vitB12: "Vitamin B12",
      nutriNote: "Estimated from the ingredients using USDA FoodData Central and IFCT 2017 values, with salt “to taste” counted as 1 g per serving. Real values vary with brands and portions. % DV (Daily Value) is based on a 2,000 kcal adult diet.",
      nutriPP: "Breastfeeding mothers generally need about 500–600 kcal more each day, plus extra protein, calcium and iron. Your doctor can advise on your exact needs.",
      dayNutriTitle: (a) => `${a} · nutrition`, dayNutriSub: "Lunch + dinner, per person", proteinShort: "protein",
      gsAnyKcal: "Any kcal", gsKcal: (k) => `≤ ${k} kcal`, gsHighProtein: "High protein (15 g+)",
      pdfNutrition: "Nutrition facts",
      lunchS: "L", dinnerS: "D",
      pdfOneDay: "A specific day", pdfOneDaySub: "Pick any day of the plan",
      pdfRange: "Day range", pdfRangeSub: "Choose a start and end day",
      weekLabel: "Week", pdfFrom: "From", pdfTo: "To", pdfCategory: "Category",
      pdfMeals: "Meals", pdfMealsBoth: "Lunch & dinner", pdfLayout: "Layout",
      pdfLayFull: "Full recipes", pdfLayFullSub: "One recipe per page, with photos",
      pdfLayCompact: "Compact", pdfLayCompactSub: "About 2 recipes a page, no photos",
      pdfLayMenu: "Menu only", pdfLayMenuSub: "A quick table of the dishes",
      pdfLayList: "Shopping list", pdfLayListSub: "All ingredients merged, with ticks",
      pdfBoth: "Both", pdfCover: "Cover page & overview",
      pdfEstimate: (p, r) => `About ${p} pages · ${r} recipes`, pdfRecipes: (n) => `${n} recipes`,
      pdfShopTitle: "Shopping list", pdfShopFor: (n) => `Everything you need for ${n} recipes. Tick items off as you shop.`,
      pdfShopFresh: "Fresh produce, dairy & more", pdfShopPantry: "Pantry & spices",
      colDish: "Dish", colTime: "Time",
      ppGuideTitle: "Healing ingredients guide", ppTipsTitle: "Gentle eating tips",
      ppJumpGuide: "Ingredient guide ↓", ppJumpTips: "Eating tips ↓", ppUsedIn: "Used in", ppHighlights: "Key benefits",
      jumpTitle: "Jump to any day", jumpHint: "Tap to pick a day", yesterday: "Yesterday", tomorrow: "Tomorrow",
      nextWeek: "+1 week", pickDate: "Or pick a date", viewing: "Viewing",
      search: "Search", gsPh: (n) => `Search ${n} dishes, ingredients, cuisines…`, gsAll: "Everything",
      gsAnyTime: "Any time", gsUnder: (m) => `≤ ${m} min`, gsPopular: "Try searching",
      gsSuggest: ["Paneer", "Pasta", "Thai", "Khichdi", "Lactation", "Iron-rich", "Laddoo", "Soup", "Day 30"],
      gsNone: "No dishes found. Try another word.", gsMore: (n) => `+${n} more. Add another word to narrow it down.`,
      gsContains: "Contains", gsDayGo: (n) => `Open Day ${n} on the dashboard`,
      gsHint: "↑ ↓ to move · Enter to open · Esc to close", gsResults: (n) => `${n} results`,
      pdfEyebrow: "Print or save", pdfTitle: "Download as PDF", pdfContent: "What to include",
      pdfToday: "Today's meals", pdfTodaySub: (d) => `${d} · lunch & dinner`,
      pdfWeek: "One week", pdfWeekSub: (n) => `${n} recipes + menu overview`,
      pdfFull: (n) => `Full ${n}-day plan`, pdfFullSub: (n) => `${n} recipes + menu overview`,
      pdfSnacks: "Evening snacks", pdfSnacksSub: (n) => `${n} quick recipes`,
      pdfLang: "PDF language", pdfPhotos: "Include photos", pdfCreate: "Create PDF",
      pdfPreparing: (a, b) => `Preparing PDF… ${a}/${b}`,
      pdfHint: "Your browser's print window will open. Choose “Save as PDF” as the destination.",
      pdfPlanTitle: (n) => `${n}-Day Sattvic Meal Plan`,
      pdfWeekTitle: (w, a, b) => `Week ${w} · Days ${a}–${b}`,
      pdfMenu: "Menu at a glance", pdfCreated: (d) => `Created on ${d}`,
      pdfTagline: "Pure vegetarian · No onion · No garlic · No eggs · No mushrooms",
      colDay: "Day", colDate: "Date",
      locale: "en-IN"
    },
    hi: {
      brand: "सात्विक रसोई",
      navToday: "आज", navPlan: "दैनिक योजना", navSnacks: "शाम का नाश्ता", navPP: "प्रसवोत्तर देखभाल",
      navTodayS: "आज", navPlanS: "योजना", navSnacksS: "नाश्ता", navPPS: "माँ",
      ppEyebrow: "नई माताओं के लिए", ppTitle: "प्रसवोत्तर देखभाल", ppTeaserTitle: "प्रसवोत्तर देखभाल",
      ppSeeAll: "सभी व्यंजन देखें →", ppNoteTitle: "एक ज़रूरी बात", ppLabel: "प्रसवोत्तर",
      ppPromise: ["पेट के लिए हल्का", "हल्के मसाले, बिना मिर्च", "दूध बढ़ाने में सहायक", "स्तनपान में सुरक्षित"],
      benefitsTitle: "माँ और शिशु के लिए स्वास्थ्य लाभ", cautionTitle: "ध्यान दें",
      ppCount: (n) => `${n} व्यंजन`,
      tags: { lactation: "दूध बढ़ाए", iron: "आयरन से भरपूर", digestion: "पाचन", energy: "ऊर्जा", protein: "प्रोटीन", calcium: "कैल्शियम", healing: "रिकवरी", hydration: "हाइड्रेशन" },
      pdfPP: "प्रसवोत्तर देखभाल", pdfPPSub: (n) => `${n} पौष्टिक विधियाँ`,
      heroTitleA: "शुद्ध भोजन,", heroTitleB: "शांत मन।",
      heroSub: "आपका रोज़ का सात्विक मेन्यू: बिना प्याज़, बिना लहसुन, दुनिया भर की रसोइयों से।",
      backToday: "आज पर लौटें",
      p1: "बिना प्याज़", p2: "बिना लहसुन", p3: "बिना अंडा", p4: "बिना मशरूम",
      upNextEyebrow: "आगे क्या है", upNextTitle: "अगले कुछ दिन", seeFullPlan: "पूरी योजना देखें →",
      planEyebrow: "कैलेंडर", planTitle: "आपकी भोजन योजना",
      planSub: (n) => `दोपहर और रात के भोजन का ${n}-दिवसीय चक्र। पूरी विधि के लिए किसी भी व्यंजन पर टैप करें।`,
      searchPh: "व्यंजन या सामग्री खोजें…",
      noResults: "आपकी खोज से कोई व्यंजन नहीं मिला।",
      snacksEyebrow: "15 मिनट या उससे कम में तैयार", snacksTitle: "शाम का नाश्ता",
      snacksSub: "चाय के समय के लिए झटपट, हल्के नाश्ते, सब बिना प्याज़-लहसुन।",
      footerNote: "चीज़: शाकाहारी रेनेट वाले ब्रांड ही लें। मसालों के लेबल पर छिपे प्याज़ या लहसुन पाउडर की जाँच ज़रूर करें।",
      footerPhotos: "फ़ोटो: Unsplash और Wikimedia Commons योगदानकर्ता (CC BY-SA); हर विधि में श्रेय दिया गया है।",
      lunch: "दोपहर का भोजन", dinner: "रात का भोजन", snack: "नाश्ता",
      todays: (m) => `आज का ${m}`, tomorrows: (m) => `कल का ${m}`, yesterdays: (m) => `बीते कल का ${m}`,
      day: "दिन", dayOf: (d, n) => `दिन ${d} / ${n}`,
      today: "आज", all: "सभी",
      week: (n) => `सप्ताह ${n}`, weekShort: (n) => `स${n}`, daysRange: (a, b) => `दिन ${a}–${b}`, photo: "फ़ोटो",
      prep: "तैयारी", cook: "पकाना", total: "कुल", serves: "सर्विंग",
      min: "मिनट", quick: "झटपट",
      ingredients: "सामग्री", method: "विधि", chefTip: "शेफ़ की सलाह:",
      items: (n) => `${n} चीज़ें`,
      navHome: "होम", navHomeS: "होम", navExplore: "एक्सप्लोर", navExploreS: "एक्सप्लोर",
      collLabel: "प्रसादम संग्रह", prasadamTitle: "प्रसादम से प्रेरणा", ekadashi: "एकादशी",
      homeEyebrow: "प्रसादम संग्रह", homeTitleA: "प्रेम से अर्पित भोजन,", homeTitleB: "सबके साथ बाँटा।",
      homeSub: (n) => `${n} शुद्ध शाकाहारी व्यंजन, बिना प्याज़ और बिना लहसुन, उत्तर भारत और दुनिया भर की रसोइयों से, इस्कॉन मंदिरों के प्रसादम से प्रेरित।`,
      homeSearchPh: "व्यंजन, सामग्री या देश खोजें…", homePlanLink: "दिन-ब-दिन मेन्यू चाहिए? दैनिक योजना खोलें →",
      statDishes: "व्यंजन", statCuisines: "व्यंजन-शैलियाँ", statEkadashi: "एकादशी व्यंजन", statPP: "प्रसवोत्तर व्यंजन",
      rowNorth: "उत्तर भारतीय प्रसादम", rowNorthSub: "मंदिर-शैली की सब्ज़ियाँ, दालें, रोटियाँ और मिठाइयाँ",
      rowIntl: "दुनिया भर का प्रसादम", rowIntlSub: "गोविंदाज़-शैली के वैश्विक व्यंजन, सात्विक रूप में",
      rowFeast: "रविवार का प्रीतिभोज और त्योहार", rowFeastSub: "प्रीतिभोज और त्योहार भोग के व्यंजन",
      rowSweets: "मंदिर की मिठाइयाँ", rowSweetsSub: "हलवा, लड्डू, खीर और भी बहुत कुछ",
      rowEkadashi: "एकादशी विशेष", rowEkadashiSub: "बिना अनाज और दालों के",
      rowQuick: "30 मिनट में तैयार", rowQuickSub: "व्यस्त दिनों के लिए", rowProtein: "ज़्यादा प्रोटीन वाले व्यंजन", rowProteinSub: "प्रति सर्विंग 15 ग्राम+ प्रोटीन",
      rowPPSub: "नई माताओं के लिए हल्का, पौष्टिक भोजन", rowPlan: "दैनिक योजना से", rowPlanSub: "54-दिवसीय योजना के दोपहर और रात के भोजन",
      seeAll: "सभी देखें →", exEyebrow: "अपना व्यंजन खोजें", exTitle: "एक्सप्लोर", exSearchPh: "परिणामों में खोजें…",
      filters: "फ़िल्टर", clearAll: "सब हटाएँ", any: "कोई भी", showMore: (n) => `${n} और दिखाएँ`,
      exCount: (n, t) => `${t} में से ${n} व्यंजन`,
      fSource: "भाग", fKind: "श्रेणी", fGeo: "क्षेत्र", fMeal: "भोजन का समय", fOccasion: "अवसर", fDiet: "आहार और जीवनशैली",
      fSpice: "तीखापन", fLevel: "कठिनाई", fTime: "कुल समय (मिनट)", fKcal: "प्रति सर्विंग कैलोरी", fProtein: "प्रोटीन (ग्राम)",
      sortLabel: "क्रम", sortRec: "सुझाया गया", sortQuick: "सबसे जल्दी", sortKcal: "सबसे कम कैलोरी", sortProtein: "सबसे ज़्यादा प्रोटीन", sortAZ: "अ–ज्ञ",
      tabToday: "आज", tabCalendar: "54-दिवसीय कैलेंडर",
      pdfCollection: "प्रसादम संग्रह", pdfCollectionSub: (n) => `${n} व्यंजन, श्रेणी के अनुसार`,
      pdfExplore: "मेरे एक्सप्लोर परिणाम", pdfExploreSub: (n) => `आपके फ़िल्टर से मेल खाते ${n} व्यंजन`, pdfKindAll: "सभी श्रेणियाँ",
      pdfGroupAll: "उत्तर भारतीय + अंतरराष्ट्रीय", pdfGroupNorth: "उत्तर भारतीय", pdfGroupIntl: "अंतरराष्ट्रीय", pdfGroup: "संग्रह",
      nutriTitle: "पोषण", nutriPer: "प्रति सर्विंग", microTitle: "विटामिन और खनिज", dvShort: "DV", ofKcal: "कैलोरी का",
      n_protein: "प्रोटीन", n_carbs: "कार्ब्स", n_fat: "वसा", n_fiber: "फ़ाइबर", n_sugar: "शर्करा", n_satFat: "संतृप्त वसा",
      n_sodium: "सोडियम", n_potassium: "पोटैशियम", n_calcium: "कैल्शियम", n_iron: "आयरन", n_magnesium: "मैग्नीशियम", n_zinc: "ज़िंक",
      n_vitA: "विटामिन A", n_vitC: "विटामिन C", n_folate: "फ़ोलेट", n_vitB12: "विटामिन B12",
      nutriNote: "ये मान सामग्री से USDA FoodData Central और IFCT 2017 के आँकड़ों के आधार पर अनुमानित हैं; “स्वादानुसार” नमक को प्रति सर्विंग 1 ग्राम माना गया है। असली मान ब्रांड और मात्रा के अनुसार बदलते हैं। % DV (दैनिक मात्रा) 2,000 कैलोरी वाले वयस्क आहार पर आधारित है।",
      nutriPP: "स्तनपान कराने वाली माँ को आमतौर पर रोज़ लगभग 500–600 कैलोरी अधिक, और ज़्यादा प्रोटीन, कैल्शियम व आयरन की ज़रूरत होती है। सही मात्रा के लिए डॉक्टर से सलाह लें।",
      dayNutriTitle: (a) => `${a} · पोषण`, dayNutriSub: "दोपहर + रात का भोजन, प्रति व्यक्ति", proteinShort: "प्रोटीन",
      gsAnyKcal: "कोई भी कैलोरी", gsKcal: (k) => `≤ ${k} कैलोरी`, gsHighProtein: "ज़्यादा प्रोटीन (15 ग्राम+)",
      pdfNutrition: "पोषण जानकारी",
      lunchS: "दो.", dinnerS: "रा.",
      pdfOneDay: "कोई एक दिन", pdfOneDaySub: "योजना का कोई भी दिन चुनें",
      pdfRange: "दिनों की सीमा", pdfRangeSub: "शुरू और आख़िरी दिन चुनें",
      weekLabel: "सप्ताह", pdfFrom: "से", pdfTo: "तक", pdfCategory: "श्रेणी",
      pdfMeals: "भोजन", pdfMealsBoth: "दोपहर और रात", pdfLayout: "लेआउट",
      pdfLayFull: "पूरी विधियाँ", pdfLayFullSub: "हर पेज पर एक विधि, फ़ोटो के साथ",
      pdfLayCompact: "संक्षिप्त", pdfLayCompactSub: "एक पेज पर लगभग 2 विधियाँ, बिना फ़ोटो",
      pdfLayMenu: "सिर्फ़ मेन्यू", pdfLayMenuSub: "व्यंजनों की छोटी तालिका",
      pdfLayList: "ख़रीदारी सूची", pdfLayListSub: "सारी सामग्री एक साथ, टिक के साथ",
      pdfBoth: "दोनों", pdfCover: "कवर पेज और सारांश",
      pdfEstimate: (p, r) => `लगभग ${p} पेज · ${r} विधियाँ`, pdfRecipes: (n) => `${n} विधियाँ`,
      pdfShopTitle: "ख़रीदारी सूची", pdfShopFor: (n) => `${n} विधियों के लिए ज़रूरी सारा सामान। ख़रीदते समय टिक करते जाएँ।`,
      pdfShopFresh: "ताज़ी सब्ज़ियाँ, डेयरी आदि", pdfShopPantry: "राशन और मसाले",
      colDish: "व्यंजन", colTime: "समय",
      ppGuideTitle: "सेहत बढ़ाने वाली सामग्री", ppTipsTitle: "खान-पान की आसान सलाह",
      ppJumpGuide: "सामग्री गाइड ↓", ppJumpTips: "खान-पान सलाह ↓", ppUsedIn: "इनमें इस्तेमाल", ppHighlights: "मुख्य लाभ",
      jumpTitle: "किसी भी दिन पर जाएँ", jumpHint: "दिन चुनने के लिए टैप करें", yesterday: "बीता कल", tomorrow: "आने वाला कल",
      nextWeek: "+1 सप्ताह", pickDate: "या तारीख़ चुनें", viewing: "देख रहे हैं",
      search: "खोजें", gsPh: (n) => `${n} व्यंजन, सामग्री, देश खोजें…`, gsAll: "सभी",
      gsAnyTime: "कोई भी समय", gsUnder: (m) => `≤ ${m} मिनट`, gsPopular: "ये खोजकर देखें",
      gsSuggest: ["पनीर", "पास्ता", "थाई", "खिचड़ी", "दूध बढ़ाए", "आयरन", "लड्डू", "सूप", "दिन 30"],
      gsNone: "कोई व्यंजन नहीं मिला। कोई और शब्द आज़माएँ।", gsMore: (n) => `+${n} और। खोज छोटी करने के लिए एक और शब्द जोड़ें।`,
      gsContains: "इसमें है", gsDayGo: (n) => `डैशबोर्ड पर दिन ${n} खोलें`,
      gsHint: "↑ ↓ चुनें · Enter खोलें · Esc बंद करें", gsResults: (n) => `${n} परिणाम`,
      pdfEyebrow: "प्रिंट करें या सहेजें", pdfTitle: "PDF डाउनलोड करें", pdfContent: "क्या शामिल करें",
      pdfToday: "आज का भोजन", pdfTodaySub: (d) => `${d} · दोपहर और रात का भोजन`,
      pdfWeek: "एक सप्ताह", pdfWeekSub: (n) => `${n} विधियाँ + मेन्यू सूची`,
      pdfFull: (n) => `पूरी ${n}-दिवसीय योजना`, pdfFullSub: (n) => `${n} विधियाँ + मेन्यू सूची`,
      pdfSnacks: "शाम का नाश्ता", pdfSnacksSub: (n) => `${n} झटपट विधियाँ`,
      pdfLang: "PDF की भाषा", pdfPhotos: "फ़ोटो शामिल करें", pdfCreate: "PDF बनाएँ",
      pdfPreparing: (a, b) => `PDF तैयार हो रहा है… ${a}/${b}`,
      pdfHint: "ब्राउज़र की प्रिंट विंडो खुलेगी। गंतव्य (Destination) में “Save as PDF” चुनें।",
      pdfPlanTitle: (n) => `${n}-दिवसीय सात्विक भोजन योजना`,
      pdfWeekTitle: (w, a, b) => `सप्ताह ${w} · दिन ${a}–${b}`,
      pdfMenu: "मेन्यू एक नज़र में", pdfCreated: (d) => `बनाया गया: ${d}`,
      pdfTagline: "शुद्ध शाकाहारी · बिना प्याज़ · बिना लहसुन · बिना अंडा · बिना मशरूम",
      colDay: "दिन", colDate: "तारीख़",
      locale: "hi-IN"
    }
  };

  /* Hindi unit words for ingredient quantities */
  const UNIT_HI = [
    [/\bto taste\b/g, "स्वादानुसार"], [/\bas needed\b/g, "आवश्यकतानुसार"],
    [/\btbsp\b/g, "बड़ा चम्मच"], [/\btsp\b/g, "छोटा चम्मच"],
    [/\bcups?\b/g, "कप"], [/\bkg\b/g, "किलो"], [/\bg\b/g, "ग्राम"], [/\bml\b/g, "मि.ली."],
    [/\bpinch\b/g, "चुटकी"], [/\binch\b/g, "इंच"], [/\bleaves\b/g, "पत्ते"],
    [/\bstalks?\b/g, "डंठल"], [/\bslices\b/g, "स्लाइस"], [/\bpieces\b/g, "टुकड़े"],
    [/\blemon-sized\b/g, "नींबू जितनी"], [/\blitres?\b/g, "लीटर"], [/\bloaf\b/g, "पाव/लोफ़"], [/\bsheets?\b/g, "शीट"], [/\blong\b/g, "लंबा"], [/\bsmall\b/g, "छोटा"], [/\bmedium\b/g, "मध्यम"], [/\blarge\b/g, "बड़े"]
  ];

  const ICON = {
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3s5 4.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 1.5-4S9 12 11 12c0-4 1-9 1-9z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>'
  };

  /* ---------------- State ---------------- */
  const state = {
    lang: (() => {
      const q = new URLSearchParams(location.search).get("lang");   // ?lang=hi deep link
      const l = q || localStorage.getItem("sk-lang") || "en";
      return I18N[l] ? l : "en";
    })(),
    route: "today",
    offset: 0,          // day offset from today on the Today view
    cuisine: "all",
    ppCat: "all",
    query: "",
    openRecipe: null    // { recipe, label }
  };

  /* ---------------- Helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const T = (k, ...a) => { const v = I18N[state.lang][k]; return typeof v === "function" ? v(...a) : v; };
  const L = (obj) => (obj && (obj[state.lang] ?? obj.en)) || "";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const FRAC = { "½": .5, "¼": .25, "¾": .75, "⅓": .34, "⅔": .67 };
  const amount = (q) => { const m = q.match(/^(\d+)?\s*([½¼¾⅓⅔])?/); return m && (m[1] || m[2]) ? (Number(m[1] || 0) + (FRAC[m[2]] || 0)) : 1; };
  const qty = (q) => {
    if (state.lang !== "hi") return q;
    const many = amount(q) > 1;   // Hindi plural: 1 बड़ा चम्मच → 2 बड़े चम्मच
    return UNIT_HI.reduce((s, [re, r]) => s.replace(re, r), q)
      .replace("बड़ा चम्मच", many ? "बड़े चम्मच" : "बड़ा चम्मच")
      .replace("छोटा चम्मच", many ? "छोटे चम्मच" : "छोटा चम्मच");
  };
  const mins = (m) => `${m} ${T("min")}`;
  const imgUrl = (r) => r.image + (/images\.unsplash\.com/.test(r.image) && !r.image.includes("?") ? DATA.meta.imageParams : "");

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const parseLocalDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const TODAY = startOfDay(new Date());
  const START = parseLocalDate(DATA.meta.startDate);
  const dayIndexFor = (date) => {
    const diff = Math.round((startOfDay(date) - START) / 86400000);
    return ((diff % N) + N) % N;
  };
  const fmtDate = (d, opts) => d.toLocaleDateString(T("locale"), opts);
  const shortDateOf = (d) => fmtDate(d, { weekday: "short", day: "numeric", month: "short" });

  const recipeIndex = new Map();
  PLAN.forEach((d) => {
    recipeIndex.set(d.lunch.id, { recipe: d.lunch, day: d.day, slot: "lunch" });
    recipeIndex.set(d.dinner.id, { recipe: d.dinner, day: d.day, slot: "dinner" });
  });
  SNACKS.forEach((s) => recipeIndex.set(s.id, { recipe: s, slot: "snack" }));
  PP.dishes.forEach((s) => recipeIndex.set(s.id, { recipe: s, slot: "postpartum" }));
  COLLECTION.forEach((s) => recipeIndex.set(s.id, { recipe: s, slot: "collection" }));
  const ppCategory = (key) => PP.categories.find((c) => c.key === key);

  /* Image with emoji fallback (handled by a global error listener) */
  const img = (r, eager = false) =>
    `<img src="${esc(imgUrl(r))}" alt="${esc(L(r.name))}" ${eager ? "" : 'loading="lazy"'} data-emoji="${esc(r.emoji || "🍽️")}">`;

  document.addEventListener("error", (e) => {
    const el = e.target;
    if (el.tagName !== "IMG" || el.dataset.failed) return;
    el.dataset.failed = "1";
    el.style.visibility = "hidden";
    const fb = document.createElement("div");
    fb.className = "img-fallback";
    fb.textContent = el.dataset.emoji || "🍽️";
    el.parentElement.appendChild(fb);
  }, true);

  /* ---------------- Nutrition ----------------
     Values are stored per serving in data.js (calculated from the ingredients).
     % DV uses the US FDA adult Daily Values (2,000 kcal diet). */
  const DV = { kcal: 2000, protein: 50, carbs: 275, fat: 78, fiber: 28, satFat: 20, sodium: 2300, potassium: 4700, calcium: 1300,
               iron: 18, magnesium: 420, zinc: 11, vitA: 900, vitC: 90, folate: 400, vitB12: 2.4 };
  const NUT_UNIT = { protein: "g", carbs: "g", fat: "g", fiber: "g", sugar: "g", satFat: "g", sodium: "mg", potassium: "mg",
                     calcium: "mg", iron: "mg", magnesium: "mg", zinc: "mg", vitC: "mg", vitA: "µg", folate: "µg", vitB12: "µg" };
  const MICROS = ["iron", "calcium", "folate", "vitA", "vitC", "vitB12", "magnesium", "zinc", "potassium", "sodium"];
  const pctDV = (k, v) => (DV[k] ? Math.round((v / DV[k]) * 100) : null);
  const fmtNum = (v) => (v >= 1000 ? Math.round(v).toLocaleString(T("locale")) : String(v));
  const unitLabel = (u) => (state.lang === "hi" ? { g: "ग्राम", mg: "मि.ग्रा.", "µg": "माइक्रो ग्रा." }[u] : u);
  function macroSplit(n) {
    const p = n.protein * 4, c = n.carbs * 4, f = n.fat * 9, t = p + c + f || 1;
    const P = Math.round((p / t) * 100), C = Math.round((c / t) * 100);
    return { protein: P, carbs: C, fat: Math.max(0, 100 - P - C) };
  }
  function sumNutrition(list) {
    const out = {};
    list.filter(Boolean).forEach((n) => Object.entries(n).forEach(([k, v]) => (out[k] = (out[k] || 0) + v)));
    Object.keys(out).forEach((k) => (out[k] = Math.round(out[k] * 10) / 10));
    if (out.kcal != null) out.kcal = Math.round(out.kcal);
    return out;
  }
  function nutritionPanel(r, pp) {
    const n = r.nutrition;
    if (!n) return "";
    const s = macroSplit(n);
    const ring = `conic-gradient(var(--c-protein) 0 ${s.protein}%, var(--c-carbs) 0 ${s.protein + s.carbs}%, var(--c-fat) 0 100%)`;
    const mrow = (k, share) => `
      <div class="mrow m-${k}"><span class="dot"></span><span class="lbl">${T("n_" + k)}</span>
        <b>${n[k]} ${unitLabel("g")}</b><span class="share">${share}</span></div>`;
    return `
    <section class="nutri">
      <header class="nutri-head"><h3>${T("nutriTitle")}</h3><span>${T("nutriPer")}</span></header>
      <div class="nutri-grid">
        <div class="nutri-ring" style="background:${ring}">
          <div><b>${n.kcal}</b><span>kcal</span><small>${pctDV("kcal", n.kcal)}% ${T("dvShort")}</small></div>
        </div>
        <div class="nutri-macros">
          ${mrow("protein", `${s.protein}% ${T("ofKcal")}`)}
          ${mrow("carbs", `${s.carbs}% ${T("ofKcal")}`)}
          ${mrow("fat", `${s.fat}% ${T("ofKcal")}`)}
          <div class="mrow sub"><span class="lbl">${T("n_fiber")}</span><b>${n.fiber} ${unitLabel("g")}</b><span class="share">${pctDV("fiber", n.fiber)}% ${T("dvShort")}</span></div>
          <div class="mrow sub"><span class="lbl">${T("n_sugar")}</span><b>${n.sugar} ${unitLabel("g")}</b><span class="share"></span></div>
          <div class="mrow sub"><span class="lbl">${T("n_satFat")}</span><b>${n.satFat} ${unitLabel("g")}</b><span class="share">${pctDV("satFat", n.satFat)}% ${T("dvShort")}</span></div>
        </div>
      </div>
      <h4 class="nutri-sub">${T("microTitle")}</h4>
      <div class="micros">${MICROS.map((k) => {
        const p = pctDV(k, n[k]);
        return `<div class="micro${k === "sodium" ? " is-limit" : ""}"><div class="micro-top"><span>${T("n_" + k)}</span><b>${fmtNum(n[k])} ${unitLabel(NUT_UNIT[k])}</b></div>
          <div class="bar"><span style="--w:${Math.min(100, p)}%"></span></div><small>${p}% ${T("dvShort")}</small></div>`;
      }).join("")}</div>
      <p class="nutri-note">${T("nutriNote")}${pp ? " " + T("nutriPP") : ""}</p>
    </section>`;
  }

  const metaPills = (r) => `
    <ul class="meta">
      <li>${ICON.clock}${T("prep")} ${mins(r.prepTime)}</li>
      <li>${ICON.flame}${T("cook")} ${mins(r.cookTime)}</li>
      <li>${ICON.users}${r.servings}</li>
      ${r.nutrition ? `<li class="kcal">${ICON.bolt}${r.nutrition.kcal} kcal · ${r.nutrition.protein} g ${T("proteinShort")}</li>` : ""}
    </ul>`;

  /* ---------------- Static i18n ---------------- */
  function applyStaticI18n() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach((el) => (el.textContent = T(el.dataset.i18n)));
    $$("[data-i18n-placeholder]").forEach((el) => (el.placeholder = T(el.dataset.i18nPlaceholder)));
    document.title = `${T("brand")} · ${state.lang === "hi" ? "सात्विक भोजन योजना" : "Pure Vegetarian Meal Plan"}`;
    $("#planSub").textContent = T("planSub", N);
  }

  /* ---------------- TODAY view ---------------- */
  function slotHeading(slot) {
    const m = T(slot);
    if (state.offset === 0) return T("todays", m);
    if (state.offset === 1) return T("tomorrows", m);
    if (state.offset === -1) return T("yesterdays", m);
    return m;
  }

  function renderToday() {
    const date = addDays(TODAY, state.offset);
    const idx = dayIndexFor(date);
    const day = PLAN[idx];

    $("#heroDate").textContent = fmtDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    $("#dayLabel").textContent = T("dayOf", day.day, N);
    $("#dayProgressBar").style.width = `${(day.day / N) * 100}%`;
    $("#backToday").hidden = state.offset === 0;

    $("#todayGrid").innerHTML = ["lunch", "dinner"].map((slot, i) => {
      const r = day[slot];
      return `
      <article class="feature reveal" style="--d:${i * 0.12}s" tabindex="0" role="button" data-id="${r.id}">
        <div class="media">${img(r, true)}</div>
        <span class="cta">${ICON.arrow}</span>
        <div class="feature-body">
          <span class="tag"><span class="dot"></span>${esc(slotHeading(slot))}</span>
          <h2>${esc(L(r.name))}</h2>
          <p>${esc(L(r.cuisine))} · ${esc(L(r.description))}</p>
          ${metaPills(r)}
        </div>
      </article>`;
    }).join("");

    // Day nutrition summary (lunch + dinner, per person)
    const tot = sumNutrition([day.lunch.nutrition, day.dinner.nutrition]);
    if (tot.kcal) {
      const s = macroSplit(tot);
      const chip = (k) => `<li><span>${T("n_" + k)}</span><b>${fmtNum(tot[k])} ${unitLabel(NUT_UNIT[k])}</b><small>${pctDV(k, tot[k])}% ${T("dvShort")}</small></li>`;
      $("#dayNutri").innerHTML = `
        <div class="dn-head">
          <div><p class="eyebrow">${esc(T("dayNutriTitle", state.offset === 0 ? T("today") : shortDateOf(date)))}</p><p class="dn-sub">${T("dayNutriSub")}</p></div>
          <div class="dn-kcal"><b>${fmtNum(tot.kcal)}</b><span>kcal · ${pctDV("kcal", tot.kcal)}% ${T("dvShort")}</span></div>
        </div>
        <div class="dn-split" aria-hidden="true"><span class="m-protein" style="--w:${s.protein}%"></span><span class="m-carbs" style="--w:${s.carbs}%"></span><span class="m-fat" style="--w:${s.fat}%"></span></div>
        <ul class="dn-legend">
          <li class="m-protein"><span class="dot"></span>${T("n_protein")} <b>${tot.protein} ${unitLabel("g")}</b></li>
          <li class="m-carbs"><span class="dot"></span>${T("n_carbs")} <b>${tot.carbs} ${unitLabel("g")}</b></li>
          <li class="m-fat"><span class="dot"></span>${T("n_fat")} <b>${tot.fat} ${unitLabel("g")}</b></li>
        </ul>
        <ul class="dn-chips">${["fiber", "iron", "calcium", "folate", "vitC", "vitA"].map(chip).join("")}</ul>`;
    }

    // Up next: following 3 days
    const cards = [];
    for (let k = 1; k <= 3; k++) {
      const d = addDays(date, k);
      const pd = PLAN[dayIndexFor(d)];
      ["lunch", "dinner"].forEach((slot) => cards.push(card(pd[slot], `${fmtDate(d, { weekday: "short", day: "numeric", month: "short" })} · ${T(slot)}`)));
    }
    $("#upNext").innerHTML = cards.join("");
    if (PP.dishes.length) {
      const k = PP.dishes.length, start = (dayIndexFor(date) * 3) % k;
      $("#ppTeaser").innerHTML = [0, 1, 2].map((i) => ppCard(PP.dishes[(start + i) % k])).join("");
    }
    observeReveals($("#view-today"));
  }

  function card(r, eyebrow, extraBadge = "") {
    return `
    <article class="card reveal" tabindex="0" role="button" data-id="${r.id}">
      <div class="card-media">${img(r)}<span class="badge">${esc(L(r.cuisine))}</span>${extraBadge}</div>
      <div class="card-body">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h3>${esc(L(r.name))}</h3>
        <p class="desc">${esc(L(r.description))}</p>
        ${metaPills(r)}
      </div>
    </article>`;
  }

  /* ---------------- PLAN view ---------------- */
  /* Cuisines are grouped into regions so the filter stays short as the plan grows.
     A recipe may also set "region" explicitly (india | asia | europe | americas | mea). */
  const REGIONS = [
    { key: "india",    en: "India",                   hi: "भारत",
      re: /indian|punjabi|gujarati|rajasthani|kashmiri|bengali|kerala|tamil|udupi|karnataka|kannad|hyderabadi|mumbai|maharashtrian|goan|odia|sindhi|andhra|bihari|indo-|mughlai|awadhi|braj|mathura|vrindavan|delhi|bihari|himachali|uttar|lucknowi|haryanvi/i },
    { key: "asia",     en: "Asia & Pacific",          hi: "एशिया व प्रशांत",
      re: /thai|japanese|chinese|korean|vietnamese|tibetan|nepali|burmese|indonesian|malaysian|sri lankan|hawaiian|filipino|afghan|asian/i },
    { key: "mea",      en: "Middle East & Africa",    hi: "मध्य-पूर्व व अफ़्रीका",
      re: /middle eastern|moroccan|lebanese|turkish|persian|iranian|african|ethiopian|kenyan|egyptian|levantine/i },
    { key: "europe",   en: "Europe & Mediterranean",  hi: "यूरोप व भूमध्यसागरीय",
      re: /italian|french|greek|spanish|hungarian|swiss|austrian|belgian|dutch|british|english|polish|russian|german|georgian|continental|mediterranean|european/i },
    { key: "americas", en: "The Americas",            hi: "अमेरिका महाद्वीप",
      re: /mexican|brazilian|argentin|colombian|peruvian|chilean|jamaican|trinidad|caribbean|american|cajun|creole|tex-mex|latin/i }
  ];
  const regionOf = (r) => r.region || (REGIONS.find((g) => g.re.test(r.cuisine.en)) || {}).key || "world";

  function renderChips() {
    const used = new Set(PLAN.flatMap((d) => [regionOf(d.lunch), regionOf(d.dinner)]));
    const list = [{ key: "all", label: T("all") }, ...REGIONS.filter((g) => used.has(g.key)).map((g) => ({ key: g.key, label: L(g) }))];
    $("#cuisineChips").innerHTML = list.map((c) =>
      `<button class="chip ${state.cuisine === c.key ? "active" : ""}" data-cuisine="${esc(c.key)}">${esc(c.label)}</button>`
    ).join("");
  }

  function matches(r) {
    if (state.cuisine !== "all" && regionOf(r) !== state.cuisine) return false;
    const terms = termsOf(state.query);
    return !terms.length || !!scoreEntry(SEARCH_BY_ID.get(r.id), terms);
  }

  function dayCard(d, idx, todayIdx) {
    const ahead = (idx - todayIdx + N) % N;
    const date = addDays(TODAY, ahead);
    const isToday = idx === todayIdx;
    const slot = (s) => {
      const r = d[s];
      return `
      <button class="slot" data-id="${r.id}">
        <span class="slot-thumb">${img(r)}</span>
        <span>
          <span class="slot-label">${T(s)}</span>
          <span class="slot-name">${esc(L(r.name))}</span>
          <span class="slot-cuisine">${esc(L(r.cuisine))} · ${mins(r.prepTime + r.cookTime)}${r.nutrition ? ` · ${r.nutrition.kcal} kcal` : ""}</span>
        </span>
      </button>`;
    };
    return `
    <div class="day-card reveal ${isToday ? "is-today" : ""}" data-today="${esc(T("today"))}" data-day="${d.day}">
      <div class="day-card-head">
        <button class="day-num" data-goto-day="${d.day}" title="${esc(T("gsDayGo", d.day))}"><small>${T("day")}</small>${d.day}</button>
        <span class="day-date">${fmtDate(date, { weekday: "short", day: "numeric", month: "short" })}</span>
      </div>
      ${slot("lunch")}${slot("dinner")}
    </div>`;
  }

  function renderPlan() {
    renderChips();
    const todayIdx = dayIndexFor(TODAY);
    const weeks = [];
    for (let i = 0; i < N; i += 7) weeks.push(PLAN.slice(i, i + 7).map((d, k) => [d, i + k]));
    $("#calendar").innerHTML = weeks.map((wk, w) => {
      const first = wk[0][0].day, last = wk[wk.length - 1][0].day;
      const hasToday = wk.some(([, idx]) => idx === todayIdx);
      return `
      <section class="week ${hasToday ? "has-today" : ""}" id="week-${w + 1}">
        <header class="week-head reveal">
          <h2>${esc(T("week", w + 1))}</h2>
          <span>${esc(T("daysRange", first, last))}</span>
        </header>
        <div class="week-grid">${wk.map(([d, idx]) => dayCard(d, idx, todayIdx)).join("")}</div>
      </section>`;
    }).join("");
    $("#weekJump").innerHTML = weeks.map((wk, w) =>
      `<a href="#plan" class="week-pill ${wk.some(([, idx]) => idx === todayIdx) ? "current" : ""}" data-week="${w + 1}">${esc(T("weekShort", w + 1))}</a>`
    ).join("");
    applyFilters();
    observeReveals($("#view-plan"));
  }

  function applyFilters() {
    let visible = 0;
    $$(".day-card").forEach((dc) => {
      const d = PLAN.find((p) => p.day === Number(dc.dataset.day));
      const hits = ["lunch", "dinner"].map((s) => matches(d[s]));
      $$(".slot", dc).forEach((el, i) => el.classList.toggle("dim", !hits[i]));
      const show = hits.some(Boolean);
      dc.classList.toggle("hidden-by-filter", !show);
      if (show) visible++;
    });
    $$(".week").forEach((w) => w.classList.toggle("hidden-by-filter", !$(".day-card:not(.hidden-by-filter)", w)));
    $("#emptyState").hidden = visible > 0;
  }

  /* ---------------- POST-PARTUM view ---------------- */
  function ppCard(r) {
    const cat = ppCategory(r.category);
    return `
    <article class="card pp-card reveal" tabindex="0" role="button" data-id="${r.id}">
      <div class="card-media">${img(r)}<span class="badge">${esc(L(cat.name))}</span></div>
      <div class="card-body">
        <ul class="tag-list">${r.tags.map((t) => `<li class="tag tag-${t}">${esc(T("tags")[t] || t)}</li>`).join("")}</ul>
        <h3>${esc(L(r.name))}</h3>
        ${r.highlights ? `<ul class="hl-list">${L(r.highlights).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="desc">${esc(L(r.benefits))}</p>`}
        ${metaPills(r)}
      </div>
    </article>`;
  }

  function renderPostpartum() {
    $("#ppIntro").textContent = L(PP.intro);
    $("#ppDisclaimer").textContent = L(PP.disclaimer);
    $("#ppPromise").innerHTML = T("ppPromise").map((x) => `<li>${esc(x)}</li>`).join("");
    $("#ppJumps").innerHTML = [PP.guide && ["#ppGuide", T("ppJumpGuide")], PP.tips && ["#ppTips", T("ppJumpTips")]]
      .filter(Boolean).map(([t, l]) => `<button class="text-btn" data-scroll="${t}">${esc(l)}</button>`).join("");
    const chips = [{ key: "all", name: { en: "All", hi: "सभी" } }, ...PP.categories];
    $("#ppChips").innerHTML = chips.map((c) => {
      const n = c.key === "all" ? PP.dishes.length : PP.dishes.filter((d) => d.category === c.key).length;
      return `<button class="chip ${state.ppCat === c.key ? "active" : ""}" data-pp-cat="${c.key}">${esc(L(c.name))} <small>${n}</small></button>`;
    }).join("");
    const cats = state.ppCat === "all" ? PP.categories : PP.categories.filter((c) => c.key === state.ppCat);
    const dishName = (id) => { const d = PP.dishes.find((x) => x.id === id); return d ? L(d.name) : id; };
    $("#ppList").innerHTML = cats.map((c) => {
      const dishes = PP.dishes.filter((d) => d.category === c.key);
      return `
      <section class="pp-cat">
        <header class="week-head reveal"><h2>${esc(L(c.name))}</h2><span>${esc(T("ppCount", dishes.length))}</span></header>
        ${c.note ? `<p class="pp-cat-note reveal">${esc(L(c.note))}</p>` : ""}
        <div class="card-grid">${dishes.map(ppCard).join("")}</div>
      </section>`;
    }).join("") + (PP.guide ? `
      <section class="pp-guide" id="ppGuide">
        <header class="week-head reveal"><h2>${T("ppGuideTitle")}</h2><span>${esc(T("ppCount", PP.guide.length).replace(/dishes|व्यंजन/, state.lang === "hi" ? "सामग्री" : "ingredients"))}</span></header>
        ${PP.guideIntro ? `<p class="pp-cat-note reveal">${esc(L(PP.guideIntro))}</p>` : ""}
        <div class="guide-grid">${PP.guide.map((g) => `
          <article class="guide-card reveal">
            <div class="guide-top"><span class="guide-emoji">${esc(g.emoji || "🌿")}</span><h3>${esc(L(g.name))}</h3></div>
            <p>${esc(L(g.benefit))}</p>
            ${g.caution ? `<p class="guide-caution"><b>${T("cautionTitle")}:</b> ${esc(L(g.caution))}</p>` : ""}
            ${g.usedIn && g.usedIn.length ? `<div class="guide-used"><span>${T("ppUsedIn")}</span>${g.usedIn.slice(0, 6).map((id) => `<button class="guide-dish" data-id="${id}">${esc(dishName(id))}</button>`).join("")}${g.usedIn.length > 6 ? `<span class="guide-more">+${g.usedIn.length - 6}</span>` : ""}</div>` : ""}
          </article>`).join("")}
        </div>
      </section>` : "") + (PP.tips ? `
      <section class="pp-tips" id="ppTips">
        <header class="week-head reveal"><h2>${T("ppTipsTitle")}</h2></header>
        <ol class="tips-grid">${L(PP.tips).map((t) => `<li class="reveal">${esc(t)}</li>`).join("")}</ol>
      </section>` : "");
    observeReveals($("#view-postpartum"));
  }

  /* ---------------- SNACKS view ---------------- */
  function renderSnacks() {
    $("#snackGrid").innerHTML = SNACKS.map((s) => {
      const total = s.prepTime + s.cookTime;
      const quick = total <= 15 ? `<span class="badge quick">⚡ ${T("quick")} · ${mins(total)}</span>` : "";
      return card(s, T("snack"), quick);
    }).join("");
    observeReveals($("#view-snacks"));
  }

  /* ---------------- Modal ---------------- */
  function openRecipe(id) {
    const entry = recipeIndex.get(id);
    if (!entry) return;
    closeSearch();
    closeDayPicker();
    state.openRecipe = id;
    renderModal();
    const modal = $("#modal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $(".modal-panel").scrollTop = 0;
    setTimeout(() => $(".modal-close").focus({ preventScroll: true }), 50);
  }

  function factChips(r) {
    const f = FACETS.get(r.id);
    if (!f) return "";
    const find = (list, k) => (list.find((x) => x.key === k) || {}).name;
    const chips = [
      [`#explore/kind=${f.kind}`, `${kindInfo(f.kind).emoji} ${L(kindInfo(f.kind).name)}`],
      [`#explore/geo=${f.geo}`, L(find(GEOS, f.geo) || { en: "" })],
      f.occasion !== "everyday" ? [`#explore/occasion=${f.occasion}`, L(find(OCCASIONS, f.occasion))] : null,
      [`#explore/spice=${f.spice}`, `🌶 ${L(find(SPICES, f.spice))}`],
      [`#explore/difficulty=${f.difficulty}`, L(find(LEVELS, f.difficulty))],
      ...f.diets.filter((d) => d !== "quick").map((d) => [`#explore/diet=${d}`, L(find(DIETS, d))])
    ].filter(Boolean);
    return `<div class="fact-chips">${chips.map(([h, l]) => `<a href="${h}" class="fact-chip" data-close>${esc(l)}</a>`).join("")}</div>`;
  }

  function recipeLabel(entry) {
    if (entry.slot === "snack") return T("snack");
    if (entry.slot === "postpartum") return `${T("ppLabel")} · ${L(ppCategory(entry.recipe.category).name)}`;
    if (entry.slot === "collection") return `${T("collLabel")} · ${L(kindInfo(entry.recipe.category).name)}`;
    return `${T("day")} ${entry.day} · ${T(entry.slot)}`;
  }

  function renderModal() {
    const entry = recipeIndex.get(state.openRecipe);
    if (!entry) return;
    const r = entry.recipe;
    const label = recipeLabel(entry);
    $("#modalContent").innerHTML = `
      <div class="m-hero">
        ${img(r, true)}
        <div class="m-hero-text">
          <p class="eyebrow">${esc(label)} · ${esc(L(r.cuisine))}</p>
          <h2 id="modalTitle">${esc(L(r.name))}</h2>
        </div>
      </div>
      <div class="m-body">
        <p class="m-desc">${esc(L(r.description))}</p>
        ${factChips(r)}
        ${r.prasadam ? `
        <div class="prasadam-note">
          <span class="prasadam-icon" aria-hidden="true">🪔</span>
          <div><h4>${T("prasadamTitle")}</h4><p>${esc(L(r.prasadam))}</p></div>
        </div>` : ""}
        ${r.benefits ? `
        <div class="benefits">
          <span class="benefits-icon" aria-hidden="true">${ICON.heart}</span>
          <div>
            <h4>${T("benefitsTitle")}</h4>
            ${r.highlights ? `<ul class="hl-list">${L(r.highlights).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
            <p>${esc(L(r.benefits))}</p>
            ${r.tags ? `<ul class="tag-list">${r.tags.map((t) => `<li class="tag tag-${t}">${esc(T("tags")[t] || t)}</li>`).join("")}</ul>` : ""}
          </div>
        </div>` : ""}
        <div class="m-stats">
          <div class="stat"><b>${r.prepTime}</b><span>${T("prep")} · ${T("min")}</span></div>
          <div class="stat"><b>${r.cookTime}</b><span>${T("cook")} · ${T("min")}</span></div>
          <div class="stat"><b>${r.prepTime + r.cookTime}</b><span>${T("total")} · ${T("min")}</span></div>
          <div class="stat"><b>${r.servings}</b><span>${T("serves")}</span></div>
        </div>
        ${nutritionPanel(r, entry.slot === "postpartum")}
        <div class="m-actions">
          <button class="pdf-mini" data-pdf-recipe="${r.id}" data-pdf-lang="en">${ICON.download}PDF · English</button>
          <button class="pdf-mini" data-pdf-recipe="${r.id}" data-pdf-lang="hi">${ICON.download}PDF · हिंदी</button>
        </div>
        <div class="m-cols">
          <section>
            <h3>${T("ingredients")} <small>${T("items", r.ingredients.length)}</small></h3>
            <ul class="ing-list">
              ${r.ingredients.map(([q, en, hi]) => `
                <li><label>
                  <input type="checkbox">
                  <span class="ing-name">${esc(state.lang === "hi" ? hi : en)}</span>
                  <span class="ing-qty">${esc(qty(q))}</span>
                </label></li>`).join("")}
            </ul>
          </section>
          <section>
            <h3>${T("method")}</h3>
            <ol class="steps">${L(r.steps).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
            ${r.tip ? `<div class="tip"><b>${T("chefTip")}</b> ${esc(L(r.tip))}</div>` : ""}
            ${r.caution ? `<div class="caution"><b>${T("cautionTitle")}:</b> ${esc(L(r.caution))}</div>` : ""}
            ${r.imageSource ? `<p class="credit">${T("photo")}: <a href="${esc(r.imageSource)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ""}
          </section>
        </div>
      </div>`;
  }

  function closeModal() {
    const modal = $("#modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    state.openRecipe = null;
  }

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function observeReveals(root) {
    $$(".reveal:not(.in)", root).forEach((el, i) => {
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${(i % 6) * 0.07}s`);
      io.observe(el);
    });
  }

  /* ---------------- Collection taxonomy ----------------
     One vocabulary for every dish (plan, collection, snacks, post-partum) so the
     Home rows and Explore filters work across all of them. */
  const KINDS = [
    ["sabzi", "🥘", "Curries & Sabzis", "सब्ज़ियाँ और करी"], ["dal", "🥣", "Dals & Legumes", "दालें और फलियाँ"],
    ["rice", "🍚", "Rice & Khichdi", "चावल और खिचड़ी"], ["bread", "🥖", "Breads & Parathas", "रोटी और पराठे"],
    ["main", "🍝", "International Mains", "अंतरराष्ट्रीय व्यंजन"], ["soup", "🍲", "Soups", "सूप"], ["salad", "🥗", "Salads", "सलाद"],
    ["snack", "🥟", "Snacks & Chaat", "नाश्ता और चाट"], ["breakfast", "🥞", "Breakfast", "सुबह का नाश्ता"],
    ["sweet", "🍮", "Sweets & Desserts", "मिठाइयाँ"], ["drink", "🥤", "Drinks", "पेय"]
  ].map(([key, emoji, en, hi]) => ({ key, emoji, name: { en, hi } }));
  const GEOS = [
    ["north", "North India", "उत्तर भारत"], ["south", "South India", "दक्षिण भारत"], ["west", "West India", "पश्चिम भारत"],
    ["east", "East India", "पूर्व भारत"], ["asia", "Asia & Pacific", "एशिया व प्रशांत"], ["mea", "Middle East & Africa", "मध्य-पूर्व व अफ़्रीका"],
    ["europe", "Europe", "यूरोप"], ["americas", "The Americas", "अमेरिका महाद्वीप"], ["world", "Global classics", "वैश्विक"]
  ].map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const SOURCES = [
    ["collection", "Prasadam Collection", "प्रसादम संग्रह"], ["plan", "Daily Plan", "दैनिक योजना"],
    ["snacks", "Evening Snacks", "शाम का नाश्ता"], ["postpartum", "Post-Partum Care", "प्रसवोत्तर देखभाल"]
  ].map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const MEALS = [["breakfast", "Breakfast", "सुबह"], ["lunch", "Lunch", "दोपहर"], ["dinner", "Dinner", "रात"], ["snack", "Snack", "शाम"], ["dessert", "Dessert", "मीठा"]]
    .map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const OCCASIONS = [["sunday-feast", "Sunday Feast", "रविवार का प्रीतिभोज"], ["ekadashi", "Ekadashi", "एकादशी"], ["janmashtami", "Janmashtami", "जन्माष्टमी"],
    ["navratri", "Navratri", "नवरात्रि"], ["holi", "Holi", "होली"], ["diwali", "Diwali", "दीवाली"], ["festive", "Festive", "त्योहार"],
    ["summer", "Summer", "गर्मी"], ["winter", "Winter", "सर्दी"], ["everyday", "Everyday", "रोज़ाना"]]
    .map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const SPICES = [["mild", "Mild", "हल्का"], ["medium", "Medium", "मध्यम"], ["hot", "Spicy", "तीखा"]].map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const LEVELS = [["easy", "Easy", "आसान"], ["medium", "Medium", "मध्यम"], ["elaborate", "Elaborate", "विस्तृत"]].map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const DIETS = [["ekadashi", "Ekadashi-friendly", "एकादशी के लिए"], ["high-protein", "High protein (15 g+)", "ज़्यादा प्रोटीन (15 ग्रा.+)"],
    ["quick", "Quick (≤ 30 min)", "झटपट (≤ 30 मिनट)"], ["gluten-free", "Gluten-free", "ग्लूटेन-मुक्त"], ["no-cook", "No-cook", "बिना पकाए"],
    ["kids-favourite", "Kids' favourite", "बच्चों की पसंद"], ["make-ahead", "Make-ahead", "पहले से बनाकर रखें"], ["one-pot", "One-pot", "एक बर्तन में"]]
    .map(([key, en, hi]) => ({ key, name: { en, hi } }));
  const kindInfo = (k) => KINDS.find((x) => x.key === k) || KINDS.find((x) => x.key === "main");
  const SUBREGION = [
    ["north", /punjabi|rajasthani|kashmiri|north indian|mughlai|awadhi|uttar|\bup\b|braj|mathura|vrindavan|delhi|bihari|himachali|indian comfort|festive indian|traditional indian|indo-chinese|lucknowi|haryanvi/i],
    ["south", /south indian|kerala|tamil|udupi|karnataka|kannad|andhra|hyderabad|chettinad|telugu/i],
    ["west", /gujarati|maharashtrian|goan|sindhi|mumbai|parsi|marathi/i],
    ["east", /bengali|odia|oriya|assamese|bihar(?!i)/i]
  ];
  const PP_KIND = { breakfast: "breakfast", meals: "rice", soups: "soup", sweets: "sweet", drinks: "drink" };

  function facetsOf(e) {
    const r = e.recipe;
    const source = e.slot === "collection" ? "collection" : e.slot === "snack" ? "snacks" : e.slot === "postpartum" ? "postpartum" : "plan";
    const kind = r.kind || (e.slot === "collection" ? r.category : e.slot === "snack" ? "snack" : e.slot === "postpartum" ? PP_KIND[r.category] : "main") || "main";
    let geo = regionOf(r);
    if (geo === "india" || (r.collection === "north")) geo = (SUBREGION.find(([, re]) => re.test(r.cuisine.en)) || ["north"])[0];
    if (!GEOS.some((g) => g.key === geo)) geo = "world";
    const meals = r.meals || (e.slot === "lunch" || e.slot === "dinner" ? [e.slot] : e.slot === "snack" ? ["snack"]
      : kind === "breakfast" ? ["breakfast"] : kind === "sweet" ? ["dessert", "snack"] : kind === "drink" ? ["snack"] : ["lunch", "dinner"]);
    const time = r.prepTime + r.cookTime, n = r.nutrition || {};
    const diets = new Set((r.tags || []).filter((t) => DIETS.some((d) => d.key === t)));
    if (time <= 30) diets.add("quick");
    if ((n.protein || 0) >= 15) diets.add("high-protein"); else diets.delete("high-protein");
    if (r.occasion === "ekadashi") diets.add("ekadashi");
    return { source, kind, geo, meals, time, occasion: r.occasion || (diets.has("ekadashi") ? "ekadashi" : "everyday"),
             spice: r.spice || (e.slot === "postpartum" ? "mild" : "medium"), difficulty: r.difficulty || "medium",
             diets: [...diets], kcal: n.kcal || 0, protein: n.protein || 0 };
  }
  const FACETS = new Map([...recipeIndex.values()].map((e) => [e.recipe.id, facetsOf(e)]));
  const ALL_ENTRIES = [...recipeIndex.values()].sort((a, b) =>
    ["collection", "plan", "postpartum", "snacks"].indexOf(FACETS.get(a.recipe.id).source) - ["collection", "plan", "postpartum", "snacks"].indexOf(FACETS.get(b.recipe.id).source));

  /* compact card used on Home rows and Explore results */
  function dishCard(e, opts = {}) {
    const r = e.recipe, f = FACETS.get(r.id), k = kindInfo(f.kind);
    const badges = [f.diets.includes("ekadashi") ? `<span class="badge-mini ek">${esc(T("ekadashi"))}</span>` : "",
      f.source === "postpartum" ? `<span class="badge-mini pp">${esc(T("ppLabel"))}</span>` : ""].join("");
    return `
    <article class="card dish-card ${opts.reveal === false ? "" : "reveal"}" tabindex="0" role="button" data-id="${r.id}">
      <div class="card-media">${img(r)}<span class="badge">${k.emoji} ${esc(L(k.name))}</span>${badges ? `<span class="badge-stack">${badges}</span>` : ""}</div>
      <div class="card-body">
        <p class="eyebrow">${esc(L(r.cuisine))}</p>
        <h3>${esc(L(r.name))}</h3>
        <ul class="meta">
          <li>${ICON.clock}${mins(f.time)}</li>
          ${r.nutrition ? `<li class="kcal">${ICON.bolt}${r.nutrition.kcal} kcal · ${r.nutrition.protein} g</li>` : ""}
        </ul>
      </div>
    </article>`;
  }

  /* ---------------- HOME (collection, no dates) ---------------- */
  const homeRows = () => [
    { key: "north", title: T("rowNorth"), sub: T("rowNorthSub"), filter: { source: ["collection"], group: ["north"] } },
    { key: "intl", title: T("rowIntl"), sub: T("rowIntlSub"), filter: { source: ["collection"], group: ["international"] } },
    { key: "feast", title: T("rowFeast"), sub: T("rowFeastSub"), filter: { occasion: ["sunday-feast", "festive", "janmashtami", "holi", "diwali"] } },
    { key: "sweets", title: T("rowSweets"), sub: T("rowSweetsSub"), filter: { kind: ["sweet"] } },
    { key: "ekadashi", title: T("rowEkadashi"), sub: T("rowEkadashiSub"), filter: { diet: ["ekadashi"] } },
    { key: "quick", title: T("rowQuick"), sub: T("rowQuickSub"), filter: { maxTime: 30 } },
    { key: "protein", title: T("rowProtein"), sub: T("rowProteinSub"), filter: { minProtein: 15 }, sort: "protein" },
    { key: "pp", title: T("navPP"), sub: T("rowPPSub"), filter: { source: ["postpartum"] } },
    { key: "plan", title: T("rowPlan"), sub: T("rowPlanSub"), filter: { source: ["plan"] } }
  ];

  function renderHome() {
    const total = recipeIndex.size, cuisines = new Set([...recipeIndex.values()].map((e) => e.recipe.cuisine.en)).size;
    $("#homeSub").textContent = T("homeSub", total);
    $("#homeStats").innerHTML = [[total, T("statDishes")], [cuisines, T("statCuisines")],
      [ALL_ENTRIES.filter((e) => FACETS.get(e.recipe.id).diets.includes("ekadashi")).length, T("statEkadashi")], [PP.dishes.length, T("statPP")]]
      .map(([n, l]) => `<li><b>${n}</b><span>${esc(l)}</span></li>`).join("");
    $("#homeKinds").innerHTML = KINDS.map((k) => {
      const n = ALL_ENTRIES.filter((e) => FACETS.get(e.recipe.id).kind === k.key).length;
      return n ? `<a class="kind-tile" href="#explore/kind=${k.key}"><span class="kind-emoji">${k.emoji}</span><b>${esc(L(k.name))}</b><small>${n}</small></a>` : "";
    }).join("");
    $("#homeRowsBox").innerHTML = homeRows().map((row) => {
      const list = sortEntries(filterEntries({ ...EX_DEFAULT(), ...row.filter }), row.sort || "recommended");
      if (!list.length) return "";
      return `
      <section class="home-row">
        <header class="section-head reveal">
          <div><h2>${esc(row.title)}</h2><p class="row-sub">${esc(row.sub)} · ${esc(T("ppCount", list.length))}</p></div>
          <div class="row-actions">
            <button class="icon-btn row-prev" data-row-scroll="-1" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button class="icon-btn row-next" data-row-scroll="1" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
            <a class="link-arrow" href="#explore/${exToQuery({ ...EX_DEFAULT(), ...row.filter })}">${esc(T("seeAll"))}</a>
          </div>
        </header>
        <div class="row-scroller">${list.slice(0, 14).map((e) => dishCard(e, { reveal: false })).join("")}</div>
      </section>`;
    }).join("");
    observeReveals($("#view-home"));
  }

  /* ---------------- EXPLORE (filters) ---------------- */
  const EX_DEFAULT = () => ({ q: "", source: [], group: [], geo: [], kind: [], meal: [], occasion: [], spice: [], difficulty: [], diet: [],
                              maxTime: 0, maxKcal: 0, minProtein: 0, sort: "recommended" });
  let ex = EX_DEFAULT();
  const EX_LISTS = ["source", "group", "geo", "kind", "meal", "occasion", "spice", "difficulty", "diet"];
  const EX_NUMS = ["maxTime", "maxKcal", "minProtein"];

  function exToQuery(f) {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    EX_LISTS.forEach((k) => f[k].length && p.set(k, f[k].join(",")));
    EX_NUMS.forEach((k) => f[k] && p.set(k, f[k]));
    if (f.sort && f.sort !== "recommended") p.set("sort", f.sort);
    return p.toString();
  }
  function exFromQuery(qs) {
    const p = new URLSearchParams(qs || ""), f = EX_DEFAULT();
    f.q = p.get("q") || "";
    EX_LISTS.forEach((k) => (f[k] = (p.get(k) || "").split(",").filter(Boolean)));
    EX_NUMS.forEach((k) => (f[k] = Number(p.get(k)) || 0));
    f.sort = p.get("sort") || "recommended";
    return f;
  }

  function matchEntry(e, f, skip) {
    const x = FACETS.get(e.recipe.id);
    if (skip !== "source" && f.source.length && !f.source.includes(x.source)) return false;
    if (f.group.length && !f.group.includes(e.recipe.collection)) return false;
    if (skip !== "geo" && f.geo.length && !f.geo.includes(x.geo)) return false;
    if (skip !== "kind" && f.kind.length && !f.kind.includes(x.kind)) return false;
    if (skip !== "meal" && f.meal.length && !f.meal.some((m) => x.meals.includes(m))) return false;
    if (skip !== "occasion" && f.occasion.length && !f.occasion.includes(x.occasion)) return false;
    if (skip !== "spice" && f.spice.length && !f.spice.includes(x.spice)) return false;
    if (skip !== "difficulty" && f.difficulty.length && !f.difficulty.includes(x.difficulty)) return false;
    if (skip !== "diet" && f.diet.length && !f.diet.every((d) => x.diets.includes(d))) return false;
    if (f.maxTime && x.time > f.maxTime) return false;
    if (f.maxKcal && (!x.kcal || x.kcal > f.maxKcal)) return false;
    if (f.minProtein && x.protein < f.minProtein) return false;
    if (f.q) { const terms = termsOf(f.q); if (terms.length && !scoreEntry(SEARCH_BY_ID.get(e.recipe.id), terms)) return false; }
    return true;
  }
  const filterEntries = (f, skip) => ALL_ENTRIES.filter((e) => matchEntry(e, f, skip));
  function sortEntries(list, sort, q) {
    const F = (e) => FACETS.get(e.recipe.id), out = [...list];
    if (sort === "quick") out.sort((a, b) => F(a).time - F(b).time);
    else if (sort === "kcal") out.sort((a, b) => (F(a).kcal || 1e9) - (F(b).kcal || 1e9));
    else if (sort === "protein") out.sort((a, b) => F(b).protein - F(a).protein);
    else if (sort === "az") out.sort((a, b) => L(a.recipe.name).localeCompare(L(b.recipe.name), T("locale")));
    else if (q) { const t = termsOf(q); out.sort((a, b) => (scoreEntry(SEARCH_BY_ID.get(b.recipe.id), t) || { s: 0 }).s - (scoreEntry(SEARCH_BY_ID.get(a.recipe.id), t) || { s: 0 }).s); }
    return out;
  }

  const EX_GROUPS = () => [
    ["source", T("fSource"), SOURCES], ["kind", T("fKind"), KINDS], ["geo", T("fGeo"), GEOS], ["meal", T("fMeal"), MEALS],
    ["occasion", T("fOccasion"), OCCASIONS], ["diet", T("fDiet"), DIETS], ["spice", T("fSpice"), SPICES], ["difficulty", T("fLevel"), LEVELS]
  ];
  const valueOf = (k, e) => { const x = FACETS.get(e.recipe.id); return k === "meal" ? x.meals : k === "diet" ? x.diets : [x[k]]; };
  const EX_PAGE = 24;
  let exShown = EX_PAGE;

  function renderExploreFilters() {
    const groupHtml = EX_GROUPS().map(([k, title, opts]) => {
      const base = filterEntries(ex, k);
      const items = opts.map((o) => {
        const n = base.filter((e) => valueOf(k, e).includes(o.key)).length;
        const on = ex[k].includes(o.key);
        if (!n && !on) return "";
        return `<label class="fopt ${on ? "on" : ""}"><input type="checkbox" data-f="${k}" value="${o.key}" ${on ? "checked" : ""}>
          <span>${o.emoji ? o.emoji + " " : ""}${esc(L(o.name))}</span><small>${n}</small></label>`;
      }).join("");
      return `<details class="fgroup" ${["source", "kind", "geo", "diet"].includes(k) || ex[k].length ? "open" : ""}><summary>${esc(title)}${ex[k].length ? ` <em>${ex[k].length}</em>` : ""}</summary><div class="fopts">${items}</div></details>`;
    }).join("");
    const range = (k, title, opts) => `<div class="fgroup frange"><p>${esc(title)}</p><div class="seg seg-sm">${opts.map(([v, l]) =>
      `<label><input type="radio" name="${k}" data-fn="${k}" value="${v}" ${ex[k] === v ? "checked" : ""}><span>${esc(l)}</span></label>`).join("")}</div></div>`;
    $("#exFilters").innerHTML = `
      <div class="fhead"><h2>${T("filters")}</h2><button class="text-btn" data-ex-clear>${T("clearAll")}</button></div>
      ${range("maxTime", T("fTime"), [[0, T("any")], [20, "≤20"], [30, "≤30"], [45, "≤45"], [60, "≤60"]])}
      ${range("maxKcal", T("fKcal"), [[0, T("any")], [300, "≤300"], [500, "≤500"], [700, "≤700"]])}
      ${range("minProtein", T("fProtein"), [[0, T("any")], [10, "10+"], [15, "15+"], [20, "20+"]])}
      ${groupHtml}`;
  }

  function renderExplore(keepScroll) {
    const list = sortEntries(filterEntries(ex), ex.sort, ex.q);
    $("#exCount").textContent = T("exCount", list.length, recipeIndex.size);
    if ($("#exSearch").value !== ex.q) $("#exSearch").value = ex.q;
    $("#exSort").innerHTML = [["recommended", T("sortRec")], ["quick", T("sortQuick")], ["kcal", T("sortKcal")], ["protein", T("sortProtein")], ["az", T("sortAZ")]]
      .map(([v, l]) => `<option value="${v}" ${ex.sort === v ? "selected" : ""}>${esc(l)}</option>`).join("");
    const chips = [];
    EX_GROUPS().forEach(([k, , opts]) => ex[k].forEach((v) => { const o = opts.find((x) => x.key === v); if (o) chips.push([k, v, L(o.name)]); }));
    if (ex.maxTime) chips.push(["maxTime", 0, `≤ ${mins(ex.maxTime)}`]);
    if (ex.maxKcal) chips.push(["maxKcal", 0, `≤ ${ex.maxKcal} kcal`]);
    if (ex.minProtein) chips.push(["minProtein", 0, `${T("n_protein")} ${ex.minProtein} g+`]);
    ex.group.forEach((g) => chips.push(["group", g, g === "north" ? T("pdfGroupNorth") : T("pdfGroupIntl")]));
    if (ex.q) chips.push(["q", "", `“${ex.q}”`]);
    $("#exChips").innerHTML = chips.map(([k, v, l]) => `<button class="ex-chip" data-ex-remove="${k}" data-v="${esc(v)}">${esc(l)} ✕</button>`).join("");
    $("#exFilterCount").textContent = chips.length ? `(${chips.length})` : "";
    renderExploreFilters();
    $("#exGrid").innerHTML = list.length ? list.slice(0, exShown).map((e) => dishCard(e)).join("") : `<p class="empty">${T("gsNone")}</p>`;
    $("#exMore").hidden = list.length <= exShown;
    $("#exMore").textContent = T("showMore", Math.min(EX_PAGE, list.length - exShown));
    observeReveals($("#view-explore"));
    const qs = exToQuery(ex);
    if (state.route === "explore") history.replaceState(null, "", "#explore" + (qs ? "/" + qs : ""));
    if (!keepScroll) exShown = Math.max(exShown, EX_PAGE);
  }
  function exUpdate(mut) { mut(); exShown = EX_PAGE; renderExplore(); }

  /* ---------------- Router ---------------- */
  const ROUTES = ["home", "explore", "today", "plan", "snacks", "postpartum"];
  const NAV_ALIAS = { plan: "today" };      // the Daily Plan tab covers Today + Calendar

  function moveNavIndicator() {
    const active = $(`.nav-link[data-route="${NAV_ALIAS[state.route] || state.route}"]`);
    const ind = $("#navIndicator");
    if (!active) return;
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  function showRoute(route, animate = true) {
    if (!ROUTES.includes(route)) route = "home";
    const prev = $(`.view[data-view="${state.route}"]`);
    const next = $(`.view[data-view="${route}"]`);
    state.route = route;
    $$(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.route === (NAV_ALIAS[route] || route)));
    $$(".plan-tab").forEach((a) => a.classList.toggle("active", a.dataset.tab === route));
    moveNavIndicator();

    const swap = () => {
      $$(".view").forEach((v) => { v.hidden = v !== next; v.classList.remove("leaving"); });
      next.style.animation = "none"; void next.offsetWidth; next.style.animation = "";
      window.scrollTo(0, 0);
      $$(".reveal", next).forEach((el) => el.classList.remove("in"));
      renderCurrent();
    };
    if (animate && prev && prev !== next && !prev.hidden) {
      prev.classList.add("leaving");
      setTimeout(swap, 220);
    } else swap();
  }

  function renderCurrent() {
    if (state.route === "home") renderHome();
    else if (state.route === "explore") renderExplore();
    else if (state.route === "today") renderToday();
    else if (state.route === "plan") renderPlan();
    else if (state.route === "snacks") renderSnacks();
    else renderPostpartum();
  }

  /* ---------------- Language toggle ---------------- */
  function setLang(lang) {
    if (lang === state.lang) return;
    document.body.classList.add("lang-switching");
    setTimeout(() => {
      state.lang = lang;
      localStorage.setItem("sk-lang", lang);
      applyStaticI18n();
      renderCurrent();
      $$(".view:not([hidden]) .reveal").forEach((el) => el.classList.add("in"));
      if (state.openRecipe) renderModal();
      if ($("#pdfModal").classList.contains("open")) renderPdfDialog();
      if ($("#searchModal").classList.contains("open")) { $("#gsInput").placeholder = T("gsPh", recipeIndex.size); renderSearch(); }
      if ($("#dayModal").classList.contains("open")) renderDayPicker();
      document.body.classList.remove("ex-open");
      requestAnimationFrame(() => {
        document.body.classList.remove("lang-switching");
        moveNavIndicator();
      });
    }, 280);
  }

  /* ---------------- PDF export ----------------
     Builds a print-only document in #printRoot and opens the browser's print
     dialog ("Save as PDF"). The browser's own text engine is used so Hindi
     conjuncts render correctly. Options:
       scope   today | day | week | range | full | snacks | postpartum | recipe
       meals   both | lunch | dinner           (plan scopes)
       layout  full | compact | menu | list    (list = shopping list)
       lang    en | hi | both                  (both = English section + Hindi section)
       photos, cover (cover page + menu table / ingredient guide) */
  const inLang = (lang, fn) => { const prev = state.lang; state.lang = lang; try { return fn(); } finally { state.lang = prev; } };
  const planDate = (idx) => addDays(TODAY, (idx - dayIndexFor(TODAY) + N) % N);
  const shortDate = (d) => fmtDate(d, { weekday: "short", day: "numeric", month: "short" });
  const safeDecode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
  const WEEKS = Math.ceil(N / 7);
  const clampDay = (n) => Math.min(N, Math.max(1, Number(n) || 1));
  const PLAN_SCOPES = ["today", "day", "week", "range", "full"];
  /* Unsplash serves WebP/AVIF by default, which browsers embed uncompressed in PDFs. Ask for JPEG instead. */
  const printImgUrl = (r) => /images\.unsplash\.com/.test(r.image)
    ? r.image.split("?")[0] + "?fm=jpg&fit=crop&w=1100&h=520&q=72"
    : imgUrl(r);
  const pdf = { scope: "today", day: 1, week: 1, from: 1, to: 7, ppCat: "all", meals: "both", layout: "full",
                lang: "en", photos: true, cover: true, nutrition: true, group: "all", kind: "all", busy: false };
  const kindOrder = (e) => KINDS.findIndex((k) => k.key === FACETS.get(e.recipe.id).kind);
  function listEntriesFor(o) {
    if (o.scope === "explore") return sortEntries(filterEntries(ex), ex.sort, ex.q);
    return ALL_ENTRIES.filter((e) => e.slot === "collection" && (o.group === "all" || e.recipe.collection === o.group)
      && (o.kind === "all" || FACETS.get(e.recipe.id).kind === o.kind)).sort((a, b) => kindOrder(a) - kindOrder(b));
  }
  function printNutrition(r) {
    const n = r.nutrition;
    if (!n) return "";
    const cell = (k, u) => `<td><b>${fmtNum(n[k])}${u ? " " + unitLabel(u) : ""}</b><span>${k === "kcal" ? "kcal" : T("n_" + k)}</span></td>`;
    return `
      <table class="p-nutri"><tbody>
        <tr>${cell("kcal")}${cell("protein", "g")}${cell("carbs", "g")}${cell("fat", "g")}${cell("fiber", "g")}${cell("sugar", "g")}</tr>
        <tr class="p-micro">${["iron", "calcium", "folate", "vitA", "vitC", "sodium"].map((k) => `<td><b>${fmtNum(n[k])} ${unitLabel(NUT_UNIT[k])}</b><span>${T("n_" + k)} · ${pctDV(k, n[k])}%</span></td>`).join("")}</tr>
      </tbody></table>`;
  }

  function printRecipe(r, eyebrow, photos, withNutri = true) {
    const credit = r.imageSource ? safeDecode(r.imageSource.split("File:")[1] || "").replace(/_/g, " ") : "";
    const hl = r.highlights ? L(r.highlights) : null;
    return `
    <article class="p-recipe${r.benefits ? " has-benefits" : ""}">
      <header class="p-head">
        <p class="p-eyebrow">${esc(eyebrow)} · ${esc(L(r.cuisine))}</p>
        <h2>${esc(L(r.name))}</h2>
        <p class="p-desc">${esc(L(r.description))}</p>
      </header>
      <ul class="p-meta">
        <li><b>${r.prepTime}</b><span>${T("prep")} · ${T("min")}</span></li>
        <li><b>${r.cookTime}</b><span>${T("cook")} · ${T("min")}</span></li>
        <li><b>${r.prepTime + r.cookTime}</b><span>${T("total")} · ${T("min")}</span></li>
        <li><b>${r.servings}</b><span>${T("serves")}</span></li>
      </ul>
      ${withNutri ? printNutrition(r) : ""}
      ${photos ? `<figure class="p-photo"><img src="${esc(printImgUrl(r))}" alt="" data-emoji="${esc(r.emoji || "🍽️")}"></figure>` : ""}
      <div class="p-cols">
        <section>
          <h3>${T("ingredients")}</h3>
          <ul class="p-ing">${r.ingredients.map(([q, en, hi]) => `<li><span>${esc(state.lang === "hi" ? hi : en)}</span><b>${esc(qty(q))}</b></li>`).join("")}</ul>
        </section>
        <section>
          <h3>${T("method")}</h3>
          <ol class="p-steps">${L(r.steps).map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
          ${r.tip ? `<div class="p-tip"><b>${T("chefTip")}</b> ${esc(L(r.tip))}</div>` : ""}
          ${r.prasadam ? `<div class="p-tip p-prasadam"><b>${T("prasadamTitle")}:</b> ${esc(L(r.prasadam))}</div>` : ""}
        </section>
      </div>
      ${r.benefits ? `<div class="p-benefits"><b>${T("benefitsTitle")}</b>${hl ? `<ul class="p-hl">${hl.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}<p>${esc(L(r.benefits))}</p></div>` : ""}
      ${r.caution ? `<div class="p-caution"><b>${T("cautionTitle")}:</b> ${esc(L(r.caution))}</div>` : ""}
      ${photos && credit ? `<p class="p-credit">${T("photo")}: ${esc(credit)} · Wikimedia Commons</p>` : ""}
    </article>`;
  }

  function printCover(title, sub, count, note) {
    return `
    <section class="p-cover">
      <div class="p-mark">❋</div>
      <p class="p-eyebrow">${esc(T("brand"))}</p>
      <h1>${esc(title)}</h1>
      ${sub ? `<p class="p-sub">${esc(sub)}</p>` : ""}
      <p class="p-tagline">${esc(T("pdfTagline"))}</p>
      <p class="p-count">${esc(count)}</p>
      ${note ? `<p class="p-note">${esc(note)}</p>` : ""}
      <p class="p-created">${esc(T("pdfCreated", fmtDate(new Date(), { day: "numeric", month: "long", year: "numeric" })))}</p>
    </section>`;
  }

  function printOverview(days, slots, withTimes) {
    const cell = (r) => `${esc(L(r.name))}<small>${esc(L(r.cuisine))}${withTimes ? ` · ${mins(r.prepTime + r.cookTime)}` : ""}${withTimes && r.nutrition ? ` · ${r.nutrition.kcal} kcal · ${r.nutrition.protein} g ${T("proteinShort")}` : ""}</small>`;
    return `
    <section class="p-overview">
      <h2>${T("pdfMenu")}</h2>
      <table>
        <thead><tr><th>${T("colDay")}</th><th>${T("colDate")}</th>${slots.map((s) => `<th>${T(s)}</th>`).join("")}</tr></thead>
        <tbody>${days.map(([d, idx, date]) => `
          <tr>
            <td class="p-daynum">${d.day}</td>
            <td class="p-date">${esc(shortDate(date || planDate(idx)))}</td>
            ${slots.map((s) => `<td>${cell(d[s])}</td>`).join("")}
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;
  }

  function printDishList(items) {
    return `
    <section class="p-overview">
      <h2>${T("pdfMenu")}</h2>
      <table>
        <thead><tr><th>#</th><th>${T("colDish")}</th><th>${T("colTime")}</th><th>${T("serves")}</th></tr></thead>
        <tbody>${items.map(({ r, label }, i) => `
          <tr>
            <td class="p-daynum">${i + 1}</td>
            <td>${esc(L(r.name))}<small>${esc(label)}${r.highlights ? ` · ${esc(L(r.highlights).join(" · "))}` : ""}</small></td>
            <td class="p-date">${mins(r.prepTime + r.cookTime)}${r.nutrition ? `<br>${r.nutrition.kcal} kcal` : ""}</td>
            <td class="p-date">${r.servings}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;
  }

  /* Shopping list: ingredients merged across the selected recipes. */
  const PANTRY = /\b(salt|sugar|jaggery|ghee|oil|butter|flour|atta|maida|besan|sooji|semolina|rice|dal|lentils?|powder|seeds?|masala|hing|asafoetida|turmeric|cumin|ajwain|saunf|fennel|cardamom|cloves?|cinnamon|bay leaf|pepper|oregano|thyme|herbs|baking|yeast|soy sauce|tamarind|honey|nuts?|almonds?|cashews?|raisins?|walnuts?|pistachios?|kasuri|sesame|poppy|cornflour|corn starch|pasta|penne|spaghetti|noodles|oats|quinoa|couscous|sendha|amchur|anardana|coconut milk|tahini|stock|saffron|nutmeg|paprika|chilli flakes|gond|makhana|dates|poha|vermicelli|papad|mangodi|ragi|bajra|jowar|polenta|millet|breadcrumbs|chana|rajma|beans dried|kidney beans|chickpeas|moong|urad|toor|arhar|chhole|sabudana|flax|melon seeds|halim|desiccated|dry coconut|ketchup|mustard|vanilla|cocoa|lasagne|tortillas?|wraps?|pita|bread|buns?|pav)\b/i;
  const ingKey = (en) => en.toLowerCase().replace(/\(.*?\)/g, " ").split(/,|;| – | - |\bor\b|\bfor\b/)[0]
    .replace(/\b(fresh|ripe|small|large|medium|finely|roughly|thinly|chopped|grated|soaked|boiled|cooked|peeled|washed|diced|sliced|cubed|crushed|whole|split|optional)\b/g, " ")
    .replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim().replace(/(es|s)$/, "");
  const shortLabel = (s, n = 26) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  function printShopping(items) {
    const map = new Map();
    items.forEach(({ r, short }) => r.ingredients.forEach(([q, en, hi]) => {
      const key = ingKey(en);
      if (!key || key === "water" || /^warm water|^hot water|^cold water/.test(key)) return;
      if (!map.has(key)) map.set(key, { en, hi, pantry: PANTRY.test(en), uses: [] });
      map.get(key).uses.push(`${qty(q)} (${short})`);
    }));
    const name = (x) => (state.lang === "hi" ? x.hi : x.en).split(/,|\(/)[0].trim();
    const rows = [...map.values()].sort((a, b) => name(a).localeCompare(name(b), state.lang === "hi" ? "hi" : "en"));
    const table = (list, title) => list.length ? `
      <h3 class="p-shop-h">${esc(title)} <small>${list.length}</small></h3>
      <table class="p-shop">
        <tbody>${list.map((x) => `
          <tr><td class="p-box">☐</td><td class="p-item">${esc(name(x))}${x.uses.length > 1 ? ` <small>× ${x.uses.length}</small>` : ""}</td><td class="p-uses">${esc(x.uses.join(", "))}</td></tr>`).join("")}
        </tbody>
      </table>` : "";
    return `
    <section class="p-shopping">
      <h2>${T("pdfShopTitle")}</h2>
      <p class="p-desc">${esc(T("pdfShopFor", items.length))}</p>
      ${table(rows.filter((x) => !x.pantry), T("pdfShopFresh"))}
      ${table(rows.filter((x) => x.pantry), T("pdfShopPantry"))}
    </section>`;
  }

  function printGuide() {
    if (!PP.guide || !PP.guide.length) return "";
    return `
    <section class="p-guide">
      <h2>${T("ppGuideTitle")}</h2>
      ${PP.guideIntro ? `<p class="p-desc">${esc(L(PP.guideIntro))}</p>` : ""}
      <div class="p-guide-grid">${PP.guide.map((g) => `
        <div class="p-guide-item">
          <b>${esc(g.emoji || "")} ${esc(L(g.name))}</b>
          <p>${esc(L(g.benefit))}</p>
          ${g.caution ? `<p class="p-guide-caution">${T("cautionTitle")}: ${esc(L(g.caution))}</p>` : ""}
        </div>`).join("")}
      </div>
      ${PP.tips ? `<h3 class="p-shop-h">${T("ppTipsTitle")}</h3><ol class="p-tips">${L(PP.tips).map((t) => `<li>${esc(t)}</li>`).join("")}</ol>` : ""}
    </section>`;
  }

  function planDaysFor(o) {
    if (o.scope === "today") { const date = addDays(TODAY, state.offset), idx = dayIndexFor(date); return [[PLAN[idx], idx, date]]; }
    if (o.scope === "day") { const i = clampDay(o.day) - 1; return [[PLAN[i], i]]; }
    if (o.scope === "week") return PLAN.slice((o.week - 1) * 7, o.week * 7).map((d, k) => [d, (o.week - 1) * 7 + k]);
    if (o.scope === "range") {
      let a = clampDay(o.from), b = clampDay(o.to);
      if (a > b) [a, b] = [b, a];
      return PLAN.slice(a - 1, b).map((d, k) => [d, a - 1 + k]);
    }
    return PLAN.map((d, i) => [d, i]);
  }
  const slotsFor = (o) => (o.meals === "lunch" ? ["lunch"] : o.meals === "dinner" ? ["dinner"] : ["lunch", "dinner"]);

  /* Everything the document needs, in the current language. */
  function collect(o) {
    if (o.scope === "recipe") {
      const e = recipeIndex.get(o.recipeId);
      return { kind: "single", title: L(e.recipe.name), items: [{ r: e.recipe, label: recipeLabel(e), short: shortLabel(L(e.recipe.name)) }] };
    }
    if (o.scope === "collection" || o.scope === "explore") {
      const list = listEntriesFor(o);
      const groupName = { all: T("pdfGroupAll"), north: T("pdfGroupNorth"), international: T("pdfGroupIntl") }[o.group || "all"];
      const title = o.scope === "explore" ? T("pdfExplore")
        : `${T("pdfCollection")}${o.group && o.group !== "all" ? " · " + groupName : ""}${o.kind && o.kind !== "all" ? " · " + L(kindInfo(o.kind).name) : ""}`;
      return { kind: "list", title, sub: o.scope === "explore" ? T("pdfExploreSub", list.length) : T("homeSub", list.length),
               items: list.map((e) => ({ r: e.recipe, label: recipeLabel(e), short: shortLabel(L(e.recipe.name), 18) })) };
    }
    if (o.scope === "snacks") {
      return { kind: "snacks", title: T("snacksTitle"), sub: T("snacksSub"),
               items: SNACKS.map((r) => ({ r, label: T("snack"), short: shortLabel(L(r.name), 18) })) };
    }
    if (o.scope === "postpartum") {
      const ds = PP.dishes.filter((d) => o.ppCat === "all" || d.category === o.ppCat);
      const cat = o.ppCat === "all" ? "" : L(ppCategory(o.ppCat).name);
      return { kind: "pp", title: T("ppTitle") + (cat ? ` · ${cat}` : ""), sub: L(PP.intro), note: L(PP.disclaimer),
               items: ds.map((r) => ({ r, label: `${T("ppLabel")} · ${L(ppCategory(r.category).name)}`, short: shortLabel(L(r.name), 18) })) };
    }
    const days = planDaysFor(o), slots = slotsFor(o);
    const first = days[0][0].day, last = days[days.length - 1][0].day;
    const title = o.scope === "today" || o.scope === "day"
      ? `${T("day")} ${first} · ${fmtDate(days[0][2] || planDate(days[0][1]), { weekday: "long", day: "numeric", month: "long" })}`
      : o.scope === "week" ? T("pdfWeekTitle", o.week, first, last)
      : o.scope === "range" ? T("daysRange", first, last) : T("pdfPlanTitle", N);
    return {
      kind: "plan", single: days.length === 1, title, sub: T("pdfPlanTitle", N), days, slots,
      items: days.flatMap(([d, idx, date]) => slots.map((s) => ({
        r: d[s], label: `${T("day")} ${d.day} · ${T(s)} · ${shortDate(date || planDate(idx))}`,
        short: `${T("day")} ${d.day}${slots.length > 1 ? " " + T(s + "S") : ""}`
      })))
    };
  }

  function renderDoc(o, lang) {
    return inLang(lang, () => {
      const c = collect(o);
      const brandBar = (sub) => `<div class="p-brand"><b>${esc(T("brand"))}</b><span>${esc(sub)}</span></div>`;
      const small = c.kind === "single" || (c.kind === "plan" && c.single);
      const head = o.cover && !small
        ? printCover(c.title, c.sub, T("pdfRecipes", c.items.length), c.note)
        : brandBar(c.kind === "single" ? T("pdfTagline") : c.title);
      let body = "";
      if (o.layout === "menu") body = c.kind === "plan" ? printOverview(c.days, c.slots, true) : printDishList(c.items);
      else if (o.layout === "list") body = printShopping(c.items);
      else {
        if (o.cover && c.kind === "plan" && !c.single) body += printOverview(c.days, c.slots);
        if (o.cover && c.kind === "pp") body += printGuide();
        body += c.items.map(({ r, label }) => printRecipe(r, label, o.photos && o.layout === "full", o.nutrition !== false)).join("");
      }
      return `<div class="p-doc layout-${o.layout}" lang="${lang}">${head}${body}</div>`;
    });
  }

  function pdfFileName(o) {
    const scope = {
      today: () => `Day-${dayIndexFor(addDays(TODAY, state.offset)) + 1}`, day: () => `Day-${clampDay(o.day)}`,
      week: () => `Week-${o.week}`, range: () => `Days-${Math.min(clampDay(o.from), clampDay(o.to))}-${Math.max(clampDay(o.from), clampDay(o.to))}`,
      full: () => `${N}-Day-Plan`, snacks: () => "Evening-Snacks",
      postpartum: () => "Post-Partum-Care" + (o.ppCat !== "all" ? "-" + o.ppCat : ""),
      collection: () => "Prasadam-Collection" + (o.group && o.group !== "all" ? "-" + o.group : "") + (o.kind && o.kind !== "all" ? "-" + o.kind : ""),
      explore: () => "Explore-Results",
      recipe: () => recipeIndex.get(o.recipeId).recipe.name.en.replace(/[^\w]+/g, "-")
    }[o.scope]();
    const meals = PLAN_SCOPES.includes(o.scope) && o.meals !== "both" ? `_${o.meals === "lunch" ? "Lunch" : "Dinner"}` : "";
    const layout = { full: "", compact: "_Compact", menu: "_Menu", list: "_Shopping-List" }[o.layout || "full"];
    const lang = { en: "English", hi: "Hindi", both: "English-Hindi" }[o.lang];
    return `Sattvic-Kitchen_${scope}${meals}${layout}_${lang}`;
  }

  function buildPrintDoc(o) {
    o = { meals: "both", layout: "full", cover: true, photos: true, ppCat: "all", ...o };
    const langs = o.lang === "both" ? ["en", "hi"] : [o.lang];
    return { html: langs.map((l) => renderDoc(o, l)).join(""), fileName: pdfFileName(o), langs };
  }

  /* Rough page estimate shown in the dialog. */
  function estimatePdf(o) {
    const c = inLang("en", () => collect(o));
    const n = c.items.length, small = c.kind === "single" || (c.kind === "plan" && c.single);
    const cover = o.cover && !small ? 1 : 0;
    const rows = c.kind === "plan" ? c.days.length : n;
    let pages;
    if (o.layout === "menu") pages = cover + Math.ceil(rows / 24);
    else if (o.layout === "list") pages = cover + Math.max(1, Math.ceil(n * 9 / 40));
    else {
      const extras = o.cover && !small ? (c.kind === "plan" ? Math.ceil(rows / 24) : c.kind === "pp" && PP.guide ? 2 : 0) : 0;
      pages = cover + extras + (o.layout === "compact" ? Math.ceil(n / 2) : n);
    }
    return { pages: pages * (o.lang === "both" ? 2 : 1), recipes: n };
  }

  const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
  function loadFonts(langs) {
    if (!document.fonts) return Promise.resolve();
    const specs = langs.flatMap((lang) => lang === "hi"
      ? ['400 16px "Tiro Devanagari Hindi"', '400 16px "Mukta"', '600 16px "Mukta"', '700 16px "Mukta"']
      : ['600 16px "Fraunces"', '400 16px "Manrope"', '600 16px "Manrope"', '700 16px "Manrope"']);
    return withTimeout(Promise.all(specs.map((f) => document.fonts.load(f, /Mukta|Tiro/.test(f) ? "हिंदी क्ष त्र" : "Aa").catch(() => {}))), 6000);
  }
  function waitImages(root, onProgress) {
    const imgs = $$("img", root);
    let done = 0;
    onProgress(0, imgs.length);
    return withTimeout(Promise.all(imgs.map((img) => new Promise((res) => {
      const fin = () => { onProgress(++done, imgs.length); res(); };
      if (img.complete) fin();
      else { img.addEventListener("load", fin, { once: true }); img.addEventListener("error", fin, { once: true }); }
    }))), 30000);
  }

  /* Renders the print document and waits for fonts + photos. Exposed for testing. */
  async function preparePrint(o, onProgress = () => {}) {
    const { html, fileName, langs } = buildPrintDoc(o);
    const root = $("#printRoot");
    root.innerHTML = html;
    await Promise.all([loadFonts(langs), waitImages(root, onProgress)]);
    document.body.classList.add("printing");
    return fileName;
  }

  function cleanupPrint() {
    document.body.classList.remove("printing");
    $("#printRoot").innerHTML = "";
    document.title = pdf.prevTitle || document.title;
    pdf.busy = false;
    setPdfBusy(false);
  }

  async function exportPdf(o) {
    if (pdf.busy) return;
    pdf.busy = true;
    setPdfBusy(true, 0, 0);
    try {
      const fileName = await preparePrint(o, (a, b) => setPdfBusy(true, a, b));
      pdf.prevTitle = document.title;
      document.title = fileName;               // browsers use the title as the PDF file name
      closePdfDialog();
      addEventListener("afterprint", () => setTimeout(cleanupPrint, 100), { once: true });
      setTimeout(() => window.print(), 60);
    } catch (err) {
      console.error(err);
      cleanupPrint();
    }
  }

  function setPdfBusy(on, a, b) {
    const btn = $("#pdfCreate");
    if (btn) { btn.disabled = on; $("span", btn).textContent = on ? T("pdfPreparing", a, b) : T("pdfCreate"); }
    $$("[data-pdf-recipe]").forEach((x) => (x.disabled = on));
  }

  /* ---- dialog ---- */
  const dayOptions = (sel) => PLAN.map((d, i) =>
    `<option value="${d.day}" ${Number(sel) === d.day ? "selected" : ""}>${esc(T("day"))} ${d.day} · ${esc(shortDate(planDate(i)))}</option>`).join("");
  const radioCards = (name, list, current) => list.map(([k, t, sub]) => `
    <label class="opt">
      <input type="radio" name="${name}" value="${k}" ${current === k ? "checked" : ""}>
      <span><b>${esc(t)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</span>
    </label>`).join("");
  const segmented = (name, list, current) => `<div class="seg">${list.map(([k, t]) => `
    <label><input type="radio" name="${name}" value="${k}" ${current === k ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>`;

  function renderPdfDialog() {
    const viewDay = PLAN[dayIndexFor(addDays(TODAY, state.offset))].day;
    const scopes = [
      ["today", T("pdfToday"), T("pdfTodaySub", T("dayOf", viewDay, N))],
      ["day", T("pdfOneDay"), T("pdfOneDaySub")],
      ["week", T("pdfWeek"), T("pdfWeekSub", 14)],
      ["range", T("pdfRange"), T("pdfRangeSub")],
      ["full", T("pdfFull", N), T("pdfFullSub", N * 2)],
      ["snacks", T("pdfSnacks"), T("pdfSnacksSub", SNACKS.length)],
      ["postpartum", T("pdfPP"), T("pdfPPSub", PP.dishes.length)],
      ["collection", T("pdfCollection"), T("pdfCollectionSub", COLLECTION.length)],
      ["explore", T("pdfExplore"), T("pdfExploreSub", filterEntries(ex).length)]
    ];
    let extra = "";
    if (pdf.scope === "day") extra = `<label class="pdf-field"><span>${T("day")}</span><select name="day">${dayOptions(pdf.day)}</select></label>`;
    if (pdf.scope === "week") extra = `<label class="pdf-field"><span>${T("weekLabel")}</span><select name="week">${Array.from({ length: WEEKS }, (_, i) => {
      const a = i * 7 + 1, b = Math.min(N, a + 6);
      return `<option value="${i + 1}" ${pdf.week === i + 1 ? "selected" : ""}>${esc(T("week", i + 1))} · ${esc(T("daysRange", a, b))}</option>`;
    }).join("")}</select></label>`;
    if (pdf.scope === "range") extra = `<div class="pdf-row">
        <label class="pdf-field"><span>${T("pdfFrom")}</span><select name="from">${dayOptions(pdf.from)}</select></label>
        <label class="pdf-field"><span>${T("pdfTo")}</span><select name="to">${dayOptions(pdf.to)}</select></label></div>`;
    if (pdf.scope === "postpartum") extra = `<label class="pdf-field"><span>${T("pdfCategory")}</span><select name="ppCat">
        <option value="all">${esc(T("all"))} (${PP.dishes.length})</option>
        ${PP.categories.map((c) => `<option value="${c.key}" ${pdf.ppCat === c.key ? "selected" : ""}>${esc(L(c.name))} (${PP.dishes.filter((d) => d.category === c.key).length})</option>`).join("")}
      </select></label>`;
    if (pdf.scope === "collection") extra = `<div class="pdf-row">
        <label class="pdf-field"><span>${T("pdfGroup")}</span><select name="group">${[["all", T("pdfGroupAll")], ["north", T("pdfGroupNorth")], ["international", T("pdfGroupIntl")]]
          .map(([v, l]) => `<option value="${v}" ${pdf.group === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
        <label class="pdf-field"><span>${T("fKind")}</span><select name="kind"><option value="all">${esc(T("pdfKindAll"))}</option>${KINDS
          .filter((k) => COLLECTION.some((d) => d.category === k.key))
          .map((k) => `<option value="${k.key}" ${pdf.kind === k.key ? "selected" : ""}>${k.emoji} ${esc(L(k.name))}</option>`).join("")}</select></label></div>`;
    const planScope = PLAN_SCOPES.includes(pdf.scope);
    const est = estimatePdf(pdf);
    $("#pdfForm").innerHTML = `
      <p class="eyebrow">${T("pdfEyebrow")}</p>
      <h2 id="pdfTitle">${T("pdfTitle")}</h2>

      <fieldset>
        <legend>1 · ${T("pdfContent")}</legend>
        <div class="opt-grid">${radioCards("scope", scopes, pdf.scope)}</div>
        ${extra ? `<div class="pdf-extra">${extra}</div>` : ""}
      </fieldset>

      ${planScope ? `<fieldset><legend>2 · ${T("pdfMeals")}</legend>
        ${segmented("meals", [["both", T("pdfMealsBoth")], ["lunch", T("lunch")], ["dinner", T("dinner")]], pdf.meals)}</fieldset>` : ""}

      <fieldset>
        <legend>${planScope ? 3 : 2} · ${T("pdfLayout")}</legend>
        <div class="opt-grid">${radioCards("layout", [
          ["full", T("pdfLayFull"), T("pdfLayFullSub")],
          ["compact", T("pdfLayCompact"), T("pdfLayCompactSub")],
          ["menu", T("pdfLayMenu"), T("pdfLayMenuSub")],
          ["list", T("pdfLayList"), T("pdfLayListSub")]
        ], pdf.layout)}</div>
      </fieldset>

      <fieldset>
        <legend>${planScope ? 4 : 3} · ${T("pdfLang")}</legend>
        ${segmented("lang", [["en", "English"], ["hi", "हिंदी"], ["both", T("pdfBoth")]], pdf.lang)}
      </fieldset>

      <div class="pdf-checks">
        <label class="check ${pdf.layout !== "full" ? "is-disabled" : ""}"><input type="checkbox" name="photos" ${pdf.photos ? "checked" : ""} ${pdf.layout !== "full" ? "disabled" : ""}><span>${T("pdfPhotos")}</span></label>
        <label class="check"><input type="checkbox" name="cover" ${pdf.cover ? "checked" : ""}><span>${T("pdfCover")}</span></label>
        <label class="check ${pdf.layout === "list" ? "is-disabled" : ""}"><input type="checkbox" name="nutrition" ${pdf.nutrition ? "checked" : ""} ${pdf.layout === "list" ? "disabled" : ""}><span>${T("pdfNutrition")}</span></label>
      </div>

      <p class="pdf-estimate">${T("pdfEstimate", est.pages, est.recipes)}</p>
      <button type="submit" class="primary-btn" id="pdfCreate">${ICON.download}<span>${T("pdfCreate")}</span></button>
      <p class="pdf-hint">${T("pdfHint")}</p>`;
    if (pdf.busy) setPdfBusy(true, 0, 0);
  }

  function readPdfForm() {
    const f = $("#pdfForm"), v = (n) => f.elements[n];
    ["scope", "meals", "layout", "lang"].forEach((n) => { const x = f.querySelector(`input[name="${n}"]:checked`); if (x) pdf[n] = x.value; });
    ["day", "week", "from", "to"].forEach((n) => { if (v(n)) pdf[n] = Number(v(n).value); });
    if (v("ppCat")) pdf.ppCat = v("ppCat").value;
    if (v("group")) pdf.group = v("group").value;
    if (v("kind")) pdf.kind = v("kind").value;
    if (v("photos") && !v("photos").disabled) pdf.photos = v("photos").checked;
    if (v("cover")) pdf.cover = v("cover").checked;
    if (v("nutrition") && !v("nutrition").disabled) pdf.nutrition = v("nutrition").checked;
  }

  function openPdfDialog() {
    const viewIdx = dayIndexFor(addDays(TODAY, state.offset));
    pdf.scope = { snacks: "snacks", plan: "week", postpartum: "postpartum", home: "collection", explore: "explore" }[state.route] || "today";
    pdf.day = viewIdx + 1;
    pdf.week = Math.floor(dayIndexFor(TODAY) / 7) + 1;
    pdf.from = viewIdx + 1; pdf.to = Math.min(N, viewIdx + 7);
    pdf.ppCat = state.route === "postpartum" ? state.ppCat : "all";
    pdf.lang = state.lang;
    renderPdfDialog();
    const m = $("#pdfModal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closePdfDialog() {
    const m = $("#pdfModal");
    if (!m.classList.contains("open")) return;
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    if (!state.openRecipe) document.body.classList.remove("modal-open");
  }

  window.SattvicKitchen = { preparePrint, buildPrintDoc, estimatePdf };

  /* ---------------- Global search ----------------
     One index over the plan, snacks and post-partum dishes, in both languages.
     Every word typed must match the name, cuisine, an ingredient, the
     description, benefits or tags. Typing "day 23" / "दिन 23" jumps to a day. */
  const norm = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const both = (o) => (o ? `${o.en || ""} ${o.hi || ""}` : "");
  const listBoth = (o) => (o ? `${(o.en || []).join(" ")} ${(o.hi || []).join(" ")}` : "");
  const tagWords = (tags) => (tags || []).map((t) => `${t} ${I18N.en.tags[t] || ""} ${I18N.hi.tags[t] || ""}`).join(" ");
  const SEARCH = [...recipeIndex.values()].map((e) => {
    const r = e.recipe;
    const section = e.slot === "snack" ? "snacks" : e.slot === "postpartum" ? "postpartum" : e.slot === "collection" ? "collection" : "plan";
    const where = section === "plan" ? `${I18N.en[e.slot]} ${I18N.hi[e.slot]} day ${e.day} दिन ${e.day}`
      : section === "snacks" ? `snack ${I18N.hi.snack}`
      : section === "collection" ? `prasadam प्रसादम ${r.occasion || ""} ${(r.meals || []).join(" ")} ${r.category || ""}`
      : `post-partum postpartum ${I18N.hi.ppLabel} ${both(ppCategory(r.category).name)}`;
    return {
      e, section, time: r.prepTime + r.cookTime,
      name: norm(both(r.name)), cuisine: norm(`${both(r.cuisine)} ${where}`),
      ing: r.ingredients.map((i) => [norm(i[1]), norm(i[2]), i]),
      desc: norm(`${both(r.description)} ${both(r.benefits)} ${both(r.prasadam)} ${both(r.tip)} ${tagWords(r.tags)} ${listBoth(r.highlights)}`)
    };
  });
  const SEARCH_BY_ID = new Map(SEARCH.map((x) => [x.e.recipe.id, x]));
  const termsOf = (q) => norm(q).split(/\s+/).filter(Boolean);

  function scoreEntry(x, terms) {
    let s = 0, hit = null;
    for (const t of terms) {
      if (x.name.includes(t)) s += x.name.startsWith(t) ? 14 : 10;
      else if (x.cuisine.includes(t)) s += 6;
      else {
        const ing = x.ing.find(([a, b]) => a.includes(t) || b.includes(t));
        if (ing) { s += 4; hit = hit || ing[2]; }
        else if (x.desc.includes(t)) s += 2;
        else return null;
      }
    }
    return { s, hit };
  }
  function searchAll(q, { section = "all", maxTime = 0, maxKcal = 0, highProtein = false } = {}) {
    const terms = termsOf(q);
    const n = (x) => x.e.recipe.nutrition || {};
    const filtered = SEARCH.filter((x) => (section === "all" || x.section === section) && (!maxTime || x.time <= maxTime)
      && (!maxKcal || (n(x).kcal || 0) <= maxKcal) && (!highProtein || (n(x).protein || 0) >= 15));
    if (!terms.length) return (maxKcal || highProtein || maxTime || section !== "all") && (maxKcal || highProtein)
      ? filtered.map((x) => ({ ...x, s: 1, hit: null })).sort((a, b) => (n(b).protein || 0) - (n(a).protein || 0)) : [];
    return filtered
      .map((x) => { const m = scoreEntry(x, terms); return m && { ...x, ...m }; })
      .filter(Boolean)
      .sort((a, b) => b.s - a.s || a.time - b.time);
  }
  const markTerms = (text, terms) => terms.filter((t) => t.length > 1 && !/^(amp|lt|gt|quot)$/.test(t))
    .reduce((out, t) => out.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), (m) => `<mark>${m}</mark>`), esc(text));

  const gs = { q: "", section: "all", maxTime: 0, maxKcal: 0, highProtein: false, active: 0 };

  function gsItem(x, terms) {
    const r = x.e.recipe;
    const hit = x.hit ? `<em>${T("gsContains")}: ${esc((state.lang === "hi" ? x.hit[2] : x.hit[1]).split(",")[0])}</em>` : "";
    return `
      <button class="gs-item" data-id="${r.id}">
        <span class="gs-thumb">${img(r)}</span>
        <span class="gs-text">
          <b>${markTerms(L(r.name), terms)}</b>
          <small>${esc(recipeLabel(x.e))} · ${esc(L(r.cuisine))} · ${mins(x.time)}${r.nutrition ? ` · ${r.nutrition.kcal} kcal · ${r.nutrition.protein} g ${T("proteinShort")}` : ""}</small>
          ${hit}
        </span>
      </button>`;
  }

  function renderSearch() {
    const sections = [["all", T("gsAll")], ["collection", T("collLabel")], ["plan", T("navPlan")], ["snacks", T("navSnacks")], ["postpartum", T("navPP")]];
    const times = [[0, T("gsAnyTime")], [20, T("gsUnder", 20)], [30, T("gsUnder", 30)], [45, T("gsUnder", 45)]];
    const kcals = [[0, T("gsAnyKcal")], [300, T("gsKcal", 300)], [500, T("gsKcal", 500)]];
    $("#gsFilters").innerHTML = `
      <div class="gs-chips">${sections.map(([k, t]) => `<button class="gs-chip ${gs.section === k ? "active" : ""}" data-gs-section="${k}">${esc(t)}</button>`).join("")}</div>
      <div class="gs-chips">${times.map(([k, t]) => `<button class="gs-chip ${gs.maxTime === k ? "active" : ""}" data-gs-time="${k}">${esc(t)}</button>`).join("")}</div>
      <div class="gs-chips">${kcals.map(([k, t]) => `<button class="gs-chip ${gs.maxKcal === k ? "active" : ""}" data-gs-kcal="${k}">${esc(t)}</button>`).join("")}
        <button class="gs-chip ${gs.highProtein ? "active" : ""}" data-gs-protein="1">${esc(T("gsHighProtein"))}</button></div>`;
    const q = gs.q.trim(), terms = termsOf(q);
    let html = "", count = 0;
    const nutriOnly = !q && (gs.maxKcal || gs.highProtein);
    if (nutriOnly) {
      const res = searchAll("", gs);
      ["collection", "plan", "snacks", "postpartum"].forEach((sec) => {
        const list = res.filter((x) => x.section === sec);
        if (!list.length) return;
        const label = { collection: T("collLabel"), plan: T("navPlan"), snacks: T("navSnacks"), postpartum: T("navPP") }[sec];
        html += `<div class="gs-group"><p class="gs-label">${esc(label)} <span>${list.length}</span></p>${list.slice(0, 8).map((x) => gsItem(x, [])).join("")}
          ${list.length > 8 ? `<p class="gs-more">${esc(T("gsMore", list.length - 8))}</p>` : ""}</div>`;
        count += Math.min(8, list.length);
      });
      html = count ? `<p class="gs-count">${T("gsResults", res.length)}</p>` + html : `<p class="gs-empty">${T("gsNone")}</p>`;
    } else if (!q) {
      html = `<p class="gs-label">${T("gsPopular")}</p>
        <div class="gs-suggest">${T("gsSuggest").map((w) => `<button class="chip" data-gs-q="${esc(w)}">${esc(w)}</button>`).join("")}</div>`;
    } else {
      const dm = q.match(/^(?:day|दिन)?\s*(\d{1,3})$/i);
      if (dm && +dm[1] >= 1 && +dm[1] <= N) {
        const d = PLAN[+dm[1] - 1];
        html += `<div class="gs-group"><p class="gs-label">${T("day")} ${d.day}</p>
          <button class="gs-item gs-day" data-goto-day="${d.day}"><span class="gs-daynum">${d.day}</span>
            <span class="gs-text"><b>${esc(T("gsDayGo", d.day))}</b><small>${esc(L(d.lunch.name))} · ${esc(L(d.dinner.name))}</small></span></button>
          ${["lunch", "dinner"].map((s) => gsItem(SEARCH_BY_ID.get(d[s].id), [])).join("")}</div>`;
        count += 3;
      }
      const dayOnly = dm && /^(day|दिन)/i.test(q);           // "day 30" → just that day
      const res = dayOnly ? [] : searchAll(q, gs);
      const LIMIT = 8;
      ["collection", "plan", "snacks", "postpartum"].forEach((sec) => {
        const list = res.filter((x) => x.section === sec);
        if (!list.length) return;
        const label = { collection: T("collLabel"), plan: T("navPlan"), snacks: T("navSnacks"), postpartum: T("navPP") }[sec];
        html += `<div class="gs-group"><p class="gs-label">${esc(label)} <span>${list.length}</span></p>
          ${list.slice(0, LIMIT).map((x) => gsItem(x, terms)).join("")}
          ${list.length > LIMIT ? `<p class="gs-more">${esc(T("gsMore", list.length - LIMIT))}</p>` : ""}</div>`;
        count += Math.min(LIMIT, list.length);
      });
      if (!count) html = `<p class="gs-empty">${T("gsNone")}</p>`;
      else if (res.length) html = `<p class="gs-count">${T("gsResults", res.length)}</p>` + html;
    }
    $("#gsResults").innerHTML = html;
    gs.active = 0;
    markActive();
  }
  function markActive() {
    const items = $$("#gsResults .gs-item");
    items.forEach((el, i) => el.classList.toggle("active", i === gs.active));
    if (items[gs.active]) items[gs.active].scrollIntoView({ block: "nearest" });
  }
  function openSearch() {
    const m = $("#searchModal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#gsInput").placeholder = T("gsPh", recipeIndex.size);
    $("#gsInput").value = gs.q;
    renderSearch();
    setTimeout(() => $("#gsInput").focus(), 30);
  }
  function closeSearch() {
    const m = $("#searchModal");
    if (!m.classList.contains("open")) return;
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    if (!state.openRecipe) document.body.classList.remove("modal-open");
  }

  /* ---------------- Day jumping ----------------
     The day pill opens a picker: any day in 2 clicks, quick buttons, or a date.
     The dashboard URL also works as a link: #today/23 opens Day 23. */
  const offsetForDay = (n) => (clampDay(n) - 1 - dayIndexFor(TODAY) + N) % N;
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  function setOffset(o) {
    state.offset = o;
    if (state.route !== "today") { location.hash = o === 0 ? "#today" : `#today/${PLAN[dayIndexFor(addDays(TODAY, o))].day}`; return; }
    renderToday();
    history.replaceState(null, "", o === 0 ? "#today" : `#today/${PLAN[dayIndexFor(addDays(TODAY, o))].day}`);
  }
  function gotoDay(n) { closeSearch(); closeDayPicker(); setOffset(offsetForDay(n)); }

  function renderDayPicker() {
    const view = addDays(TODAY, state.offset), viewIdx = dayIndexFor(view), todayIdx = dayIndexFor(TODAY);
    const quick = [["-1", T("yesterday")], ["0", T("today")], ["1", T("tomorrow")]];
    const weeks = [];
    for (let i = 0; i < N; i += 7) weeks.push(PLAN.slice(i, i + 7).map((d, k) => [d, i + k]));
    $("#dayPickerBody").innerHTML = `
      <p class="eyebrow">${T("viewing")} · ${esc(T("dayOf", viewIdx + 1, N))}</p>
      <h2 id="dayPickerTitle">${T("jumpTitle")}</h2>
      <div class="dp-quick">
        ${quick.map(([o, t]) => `<button class="dp-q ${String(state.offset) === o ? "active" : ""}" data-dp-offset="${o}">${esc(t)}</button>`).join("")}
        <button class="dp-q" data-dp-rel="7">${esc(T("nextWeek"))}</button>
        <label class="dp-date"><span>${T("pickDate")}</span><input type="date" id="dpDate" value="${isoDate(view)}"></label>
      </div>
      <div class="dp-grid">${weeks.map((wk, w) => `
        <div class="dp-week"><span class="dp-wk">${esc(T("weekShort", w + 1))}</span>
          ${wk.map(([d, idx]) => `<button class="dp-day ${idx === viewIdx ? "is-view" : ""} ${idx === todayIdx ? "is-today" : ""}" data-dp-day="${d.day}" title="${esc(L(d.lunch.name))} · ${esc(L(d.dinner.name))}">
            <b>${d.day}</b><small>${esc(fmtDate(planDate(idx), { day: "numeric", month: "short" }))}</small></button>`).join("")}
        </div>`).join("")}
      </div>`;
  }
  function openDayPicker() {
    renderDayPicker();
    const m = $("#dayModal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#dayPill").setAttribute("aria-expanded", "true");
    setTimeout(() => { const el = $(".dp-day.is-view"); if (el) el.focus(); }, 40);
  }
  function closeDayPicker() {
    const m = $("#dayModal");
    if (!m.classList.contains("open")) return;
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    $("#dayPill").setAttribute("aria-expanded", "false");
    if (!state.openRecipe) document.body.classList.remove("modal-open");
  }

  function routeFromHash(fromNav) {
    const raw = location.hash.slice(1), slash = raw.indexOf("/");
    const r = slash < 0 ? raw : raw.slice(0, slash), p = slash < 0 ? "" : raw.slice(slash + 1);
    if (r === "explore") { ex = exFromQuery(p); exShown = EX_PAGE; }
    if (r === "today") {
      if (p && +p >= 1 && +p <= N) state.offset = offsetForDay(+p);
      else if (fromNav) state.offset = 0;
    }
    return r || "home";
  }

  /* ---------------- Events ---------------- */
  function bind() {
    $("#langToggle").addEventListener("click", () => setLang(state.lang === "en" ? "hi" : "en"));

    // PDF export
    $("#pdfBtn").addEventListener("click", openPdfDialog);
    $("#pdfForm").addEventListener("change", () => { readPdfForm(); renderPdfDialog(); });
    $("#pdfForm").addEventListener("submit", (e) => { e.preventDefault(); readPdfForm(); exportPdf({ ...pdf }); });

    window.addEventListener("hashchange", () => showRoute(routeFromHash(true)));

    // global search
    $("#searchBtn").addEventListener("click", openSearch);
    $("#homeSearch").addEventListener("click", openSearch);

    // explore filters
    $("#exFilters").addEventListener("change", (e) => {
      const t = e.target;
      if (t.dataset.f) exUpdate(() => { const k = t.dataset.f; ex[k] = t.checked ? [...new Set([...ex[k], t.value])] : ex[k].filter((v) => v !== t.value); });
      if (t.dataset.fn) exUpdate(() => { ex[t.dataset.fn] = Number(t.value); });
    });
    $("#exSort").addEventListener("change", (e) => exUpdate(() => { ex.sort = e.target.value; }));
    let exTimer;
    $("#exSearch").addEventListener("input", (e) => { clearTimeout(exTimer); exTimer = setTimeout(() => exUpdate(() => { ex.q = e.target.value.trim(); }), 160); });
    $("#exMore").addEventListener("click", () => { exShown += EX_PAGE; renderExplore(true); });
    $("#exFilterToggle").addEventListener("click", () => document.body.classList.toggle("ex-open"));
    $("#gsInput").addEventListener("input", (e) => { gs.q = e.target.value; renderSearch(); });
    $("#gsInput").addEventListener("keydown", (e) => {
      const items = $$("#gsResults .gs-item");
      if (e.key === "ArrowDown") { e.preventDefault(); gs.active = Math.min(items.length - 1, gs.active + 1); markActive(); }
      if (e.key === "ArrowUp") { e.preventDefault(); gs.active = Math.max(0, gs.active - 1); markActive(); }
      if (e.key === "Enter" && items[gs.active]) { e.preventDefault(); items[gs.active].click(); }
    });

    // day picker
    $("#dayPill").addEventListener("click", openDayPicker);
    $("#dayModal").addEventListener("change", (e) => {
      if (e.target.id !== "dpDate" || !e.target.value) return;
      const [y, m, d] = e.target.value.split("-").map(Number);
      closeDayPicker();
      setOffset(Math.round((new Date(y, m - 1, d) - TODAY) / 86400000));
    });

    $("#prevDay").addEventListener("click", () => setOffset(state.offset - 1));
    $("#nextDay").addEventListener("click", () => setOffset(state.offset + 1));
    $("#backToday").addEventListener("click", () => setOffset(0));

    // open recipe from any card/slot
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-pdf-close]")) { closePdfDialog(); return; }
      if (e.target.closest("[data-search-close]")) { closeSearch(); return; }
      if (e.target.closest("[data-day-close]")) { closeDayPicker(); return; }
      if (e.target.closest("[data-ex-clear]")) { exUpdate(() => { const q = ex.q, sort = ex.sort; ex = EX_DEFAULT(); ex.sort = sort; }); return; }
      if (e.target.closest("[data-ex-close]")) { document.body.classList.remove("ex-open"); return; }
      const exr = e.target.closest("[data-ex-remove]");
      if (exr) { const k = exr.dataset.exRemove, v = exr.dataset.v;
        exUpdate(() => { if (k === "q") { ex.q = ""; } else if (EX_NUMS.includes(k)) ex[k] = 0; else ex[k] = ex[k].filter((x) => x !== v); }); return; }
      const rs = e.target.closest("[data-row-scroll]");
      if (rs) { const sc = rs.closest(".home-row").querySelector(".row-scroller"); sc.scrollBy({ left: Math.sign(+rs.dataset.rowScroll) * sc.clientWidth * 0.85, behavior: "smooth" }); return; }
      const gd = e.target.closest("[data-goto-day]");
      if (gd) { gotoDay(+gd.dataset.gotoDay); return; }
      const dpo = e.target.closest("[data-dp-offset]");
      if (dpo) { closeDayPicker(); setOffset(+dpo.dataset.dpOffset); return; }
      const dpr = e.target.closest("[data-dp-rel]");
      if (dpr) { closeDayPicker(); setOffset(state.offset + +dpr.dataset.dpRel); return; }
      const dpd = e.target.closest("[data-dp-day]");
      if (dpd) { gotoDay(+dpd.dataset.dpDay); return; }
      const gsq = e.target.closest("[data-gs-q]");
      if (gsq) { gs.q = gsq.dataset.gsQ; $("#gsInput").value = gs.q; renderSearch(); $("#gsInput").focus(); return; }
      const gsc = e.target.closest("[data-gs-section]");
      if (gsc) { gs.section = gsc.dataset.gsSection; renderSearch(); $("#gsInput").focus(); return; }
      const gsk = e.target.closest("[data-gs-kcal]");
      if (gsk) { gs.maxKcal = +gsk.dataset.gsKcal; renderSearch(); $("#gsInput").focus(); return; }
      const gsp = e.target.closest("[data-gs-protein]");
      if (gsp) { gs.highProtein = !gs.highProtein; renderSearch(); $("#gsInput").focus(); return; }
      const gst = e.target.closest("[data-gs-time]");
      if (gst) { gs.maxTime = +gst.dataset.gsTime; renderSearch(); $("#gsInput").focus(); return; }
      const sc = e.target.closest("[data-scroll]");
      if (sc) { const el = $(sc.dataset.scroll); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: "smooth" }); return; }
      const pr = e.target.closest("[data-pdf-recipe]");
      if (pr) { exportPdf({ scope: "recipe", recipeId: pr.dataset.pdfRecipe, lang: pr.dataset.pdfLang, photos: true, layout: "full", cover: false }); return; }
      const t = e.target.closest("[data-id]");
      if (t && !t.closest("#modal")) openRecipe(t.dataset.id);
      if (e.target.closest("[data-close]")) closeModal();
      const wp = e.target.closest(".week-pill");
      if (wp) {
        e.preventDefault();
        const sec = $(`#week-${wp.dataset.week}`);
        if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + scrollY - 150, behavior: "smooth" });
        return;
      }
      const ppc = e.target.closest("[data-pp-cat]");
      if (ppc) { state.ppCat = ppc.dataset.ppCat; renderPostpartum(); return; }
      const chip = e.target.closest(".chip");
      if (chip) {
        state.cuisine = chip.dataset.cuisine;
        $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
        applyFilters();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if ($("#searchModal").classList.contains("open")) closeSearch();
        else if ($("#dayModal").classList.contains("open")) closeDayPicker();
        else if ($("#pdfModal").classList.contains("open")) closePdfDialog();
        else if (state.openRecipe) closeModal();
      }
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); openSearch(); }
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[role=button][data-id]")) {
        e.preventDefault(); openRecipe(e.target.dataset.id);
      }
      if (state.route === "today" && !state.openRecipe && e.target === document.body) {
        if (e.key === "ArrowLeft") setOffset(state.offset - 1);
        if (e.key === "ArrowRight") setOffset(state.offset + 1);
      }
    });

    let searchTimer;
    $("#searchInput").addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.query = e.target.value; applyFilters(); }, 120);
    });

    // header + scroll progress
    const header = $("#siteHeader");
    const bar = $("#scrollProgress");
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 10);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", moveNavIndicator);
    onScroll();

    // subtle parallax on hero blobs
    const blobs = $$(".blob");
    addEventListener("pointermove", (e) => {
      if (state.route !== "today") return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      blobs.forEach((b, i) => (b.style.translate = `${x * (i + 1) * 18}px ${y * (i + 1) * 18}px`));
    }, { passive: true });
  }

  /* ---------------- Init ---------------- */
  applyStaticI18n();
  bind();
  showRoute(routeFromHash(false), false);
  if (document.fonts) document.fonts.ready.then(moveNavIndicator);
})();
