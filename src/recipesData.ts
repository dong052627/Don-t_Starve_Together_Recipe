import { Ingredient, Recipe } from "./data/types";
import { INGREDIENTS, INGREDIENT_MAP } from "./data/ingredients";
import { cookingRecipes } from "./data/recipes";

export type { Ingredient, Recipe };
export { INGREDIENTS, INGREDIENT_MAP };

// Map from new ID to old ID for the 23 original recipes
const recipeNameTranslations: Record<string, string> = {
  "Amberosia": "琥珀美食",
  "Asparagazpacho": "蘆筍冷湯",
  "Asparagus Soup": "蘆筍湯",
  "Bacon and Eggs": "培根煎蛋",
  "Banana Pop": "香蕉凍",
  "Banana Shake": "香蕉奶昔",
  "Barnacle Linguine": "藤壺中細面",
  "Barnacle Nigiri": "藤壺握壽司",
  "Barnacle Pita": "藤壺皮塔餅",
  "Beefalo Treats": "皮弗婁牛零食",
  "Beefy Greens": "牛肉綠葉菜",
  "Bird Egg": "熟蛋",
  "Bone Bouillon": "骨頭湯",
  "Braised Eggplant": "烤茄子",
  "Breakfast Skillet": "早餐鍋",
  "Bunny Stew": "燉兔子",
  "Butter Muffin": "蝴蝶松餅",
  "California Roll": "加州卷",
  "Ceviche": "酸橘汁醃魚",
  "Cooked Asparagus": "烤蘆筍",
  "Cooked Barnacle": "熟藤壺",
  "Cooked Batilisk Wing": "熟蝙蝠翅膀",
  "Cooked Blue Cap": "熟藍蘑菇",
  "Cooked Cactus Flesh": "熟仙人掌肉",
  "Cooked Eel": "熟鰻魚",
  "Cooked Egg": "熟鳥蛋",
  "Cooked Fish": "魚排",
  "Cooked Frog Legs": "熟蛙腿",
  "Cooked Green Cap": "熟綠蘑菇",
  "Cooked Leafy Meat": "熟葉肉",
  "Cooked Meat": "熟肉",
  "Cooked Monster Meat": "熟怪物肉",
  "Cooked Moon Shroom": "熟月亮蘑菇",
  "Cooked Red Cap": "熟紅蘑菇",
  "Cooked Small Fish": "熟小魚塊",
  "Cooked Small Meat": "熟小肉",
  "Creamy Potato Purée": "奶油土豆泥",
  "Dark Petal Tea": "深色花瓣茶",
  "Dragonpie": "火龍果派",
  "Dried Kelp Fronds": "乾海帶葉",
  "Dried Kelp Fronds (Dried Kelp)": "乾海帶",
  "Fancy Spiralled Tubers": "花式迴旋塊莖",
  "Fig-Stuffed Trunk": "無花果釀象鼻",
  "Figatoni": "無花果意面",
  "Figgy Frogwich": "無花果蛙腿三明治",
  "Figkabab": "無花果烤串",
  "Fire Nettle Tea": "火蕁麻茶",
  "Fish Cordon Bleu": "藍帶魚排",
  "Fish Morsel": "魚肉乾",
  "Fish Tacos": "魚肉玉米卷",
  "Fishsticks": "炸魚排",
  "Fist Full of Jam": "果醬",
  "Flower Salad": "花沙拉",
  "Foliage Tea": "蕨葉茶",
  "Forget-Me-Lots Tea": "必忘我茶",
  "Fresh Fruit Crepes": "鮮果可麗餅",
  "Fried Drumstick": "炸鳥腿",
  "Froggle Bunwich": "蛙腿三明治",
  "Frozen Banana Daiquiri": "冰香蕉凍唇蜜",
  "Fruit Medley": "水果聖代",
  "Glow Berry Mousse": "發光漿果慕斯",
  "Grim Galette": "恐怖國王餅",
  "Guacamole": "鱷梨醬",
  "Honey Ham": "蜜汁火腿",
  "Honey Nuggets": "蜜汁鹵肉",
  "Hot Dragon Chili Salad": "辣龍椒沙拉",
  "Hot Pumpkin": "烤南瓜",
  "Ice Cream": "霜淇淋",
  "Jelly Salad": "果凍沙拉",
  "Jellybeans": "彩虹糖豆",
  "Jerky": "風乾肉",
  "Kabobs": "肉串",
  "Leafy Meatloaf": "葉肉糕",
  "Lobster Bisque": "龍蝦湯",
  "Lobster Dinner": "龍蝦正餐",
  "Lune Tree Blossom Tea": "月樹花茶",
  "Mandrake Soup": "曼德拉草湯",
  "Meatballs": "肉丸",
  "Meaty Stew": "燉肉湯",
  "Melonsicle": "西瓜冰棒",
  "Milkmade Hat": "牛奶帽",
  "Monster Jerky": "怪物肉乾",
  "Monster Lasagna": "怪物千層餅",
  "Monster Tartare": "怪物韃靼",
  "Moqueca": "海鮮雜燴",
  "Mushy Cake": "蘑菇蛋糕",
  "Petal Tea": "花瓣茶",
  "Pierogi": "波蘭水餃",
  "Plain Omelette": "普通煎蛋",
  "Popcorn": "爆米花",
  "Powdercake": "粉末蛋糕",
  "Prepared Dragon Fruit": "烤火龍果",
  "Pumpkin Cookies": "南瓜餅乾",
  "Ratatouille": "蔬菜雜燴",
  "Roasted Berries": "烤漿果",
  "Roasted Carrot": "烤胡蘿蔔",
  "Roasted Garlic": "烤大蒜",
  "Roasted Onion": "烤洋蔥",
  "Roasted Pepper": "烤辣椒",
  "Roasted Potato": "烤土豆",
  "Roasted Tomato": "烤番茄",
  "Salsa Fresca": "生鮮薩爾薩醬",
  "Seafood Gumbo": "海鮮濃湯",
  "Sliced Pomegranate": "切片熟石榴",
  "Small Fish Morsel": "小魚乾",
  "Small Jerky": "小肉乾",
  "Soothing Tea": "舒緩茶",
  "Spicy Chili": "辣椒燉肉",
  "Steamed Twigs": "蒸樹枝",
  "Stuffed Eggplant": "釀茄子",
  "Stuffed Fish Heads": "釀魚頭",
  "Stuffed Night Cap": "釀夜帽",
  "Stuffed Pepper Poppers": "爆炒填餡辣椒",
  "Succulent Tea": "多肉茶",
  "Surf 'n' Turf": "海鮮牛排",
  "Taffy": "太妃糖",
  "Tall Scotch Eggs": "蘇格蘭高鳥蛋",
  "Tillweed Tea": "犁地草茶",
  "Toasted Seeds": "烤種子",
  "Trail Mix": "什錦乾果",
  "Turkey Dinner": "火雞正餐",
  "Unagi": "鰻魚料理",
  "Vegetable Stinger": "蔬菜雞尾酒",
  "Veggie Burger": "素食堡",
  "Volt Goat Chaud-Froid": "伏特羊肉凍",
  "Waffles": "華夫餅",
  "Wet Goop": "潮濕黏糊",
  "Puffed Potato Soufflé": "蓬鬆土豆蛋奶酥"
};

function mapCategoryToTag(name: string): string {
  name = name.toLowerCase().trim();
  if (name === "veggie") return "veg";
  if (name === "inedible") return "twigs";
  if (name === "frozen") return "ice";
  return name;
}

function mapNameToId(name: string): string {
  name = name.toLowerCase().trim();
  const nameToIdMap: Record<string, string> = {
    "asparagus": "asparagus",
    "cave banana": "cave_banana",
    "barnacle": "barnacle",
    "butter": "butter",
    "egg": "bird_egg",
    "royal jelly": "royal_jelly",
    "forget-me-lots": "forgetmelots",
    "small meat": "smallmeat",
    "dragon fruit": "dragonfruit",
    "fig": "fig",
    "twigs": "twigs",
    "cactus flower": "cactus_flower",
    "frog legs": "froglegs",
    "moleworm": "mole",
    "meat": "meat",
    "onion": "onion",
    "ripe stone fruit": "rock_avocado_fruit_ripe",
    "cactus flesh": "cactus_meat",
    "fish": "fishmeat",
    "kelp": "kelp",
    "acorn": "acorn_cooked",
    "sweetener": "honey",
    "drumstick": "drumstick",
    "seed": "seeds",
    "seeds": "seeds",
    "butterfly wings": "butterflywings",
    "koalefant trunk": "trunk_summer",
    "leafy meat": "plantmeat",
    "wobster": "wobster_sheller_land",
    "moon shroom": "moon_cap",
    "red cap": "red_cap",
    "blue cap": "blue_cap",
    "green cap": "green_cap",
    "monster meat": "monstermeat",
    "tallbird egg": "tallbirdegg",
    "lichen": "cutlichen",
    "bone shards": "boneshard",
    "nightmare fuel": "nightmarefuel",
    "volt goat horn": "lightninggoathorn",
    "collected dust": "refined_dust",
    "glow berry": "wormlight",
    "lesser glow berry": "wormlight_lesser",
    "fruit": "berries",
    "veggie": "carrot"
  };
  return nameToIdMap[name] || name;
}


function parseRequirements(reqStr: string) {
  if (reqStr.includes("Anything")) {
    return () => true;
  }

  const parts = reqStr.split(",").map(s => s.trim());
  const checks: ((t: Record<string, number>, ings: Ingredient[]) => boolean)[] = [];

  for (const part of parts) {
    if (part.toLowerCase().includes("glow berry") && part.toLowerCase().includes("lesser")) {
      checks.push((t, ings) => {
        const glowBerryCount = ings.filter(i => i.id === "wormlight").length;
        const lesserGlowBerryCount = ings.filter(i => i.id === "wormlight_lesser").length;
        return glowBerryCount >= 1 || lesserGlowBerryCount >= 2;
      });
      continue;
    }
    if (part.startsWith("No ")) {
      const category = part.replace("No ", "").toLowerCase();
      const tag = mapCategoryToTag(category);
      checks.push((t) => (t[tag] || 0) === 0);
    } else if (part.includes("×")) {
      const match = part.match(/(.+) ×([\d.]+)/);
      if (match) {
        const namePart = match[1].trim().toLowerCase();
        const count = parseFloat(match[2]);
        const tag = mapCategoryToTag(namePart);
        const categoriesList = ["meat", "veg", "fruit", "egg", "sweetener", "dairy", "fish", "twigs", "ice"];
        if (categoriesList.includes(tag)) {
          checks.push((t) => (t[tag] || 0) >= count);
        } else {
          const subNames = namePart.split("/").map(n => n.trim());
          const subIds = subNames.map(mapNameToId);
          checks.push((t, ings) => {
            const matchedIngs = ings.filter(i => subIds.includes(i.id));
            return matchedIngs.length >= count;
          });
        }
      }
    } else if (part.includes(">") || part.includes("<") || part.includes("≥") || part.includes("≤") || part.includes("=")) {
      const match = part.match(/(.+?)\s*([><≥≤=]|>=|<=)\s*([\d.]+)/);
      if (match) {
        const category = match[1].trim().toLowerCase();
        const op = match[2];
        const val = parseFloat(match[3]);
        const tag = mapCategoryToTag(category);
        checks.push((t) => {
          const currentVal = t[tag] || 0;
          const minVal = (tag === "meat" && (op === "≤" || op === "<=" || op === "<")) ? 0.25 : 0;
          if (op === ">") return currentVal > val;
          if (op === "<") return currentVal < val && currentVal >= minVal;
          if (op === "≥" || op === ">=") return currentVal >= val;
          if (op === "≤" || op === "<=") return currentVal <= val && currentVal >= minVal;
          if (op === "=") return currentVal === val;
          return false;
        });
      }
    } else {
      const name = part.toLowerCase().trim();
      const tag = mapCategoryToTag(name);
      if (tag === "meat" || tag === "veg" || tag === "fruit" || tag === "egg" || tag === "sweetener" || tag === "dairy" || tag === "fish" || tag === "twigs" || tag === "ice") {
        checks.push((t) => (t[tag] || 0) >= 0.5);
      } else {
        const ingId = mapNameToId(name);
        checks.push((t, ings) => ings.some(i => i.id === ingId));
      }
    }
  }

  return (t: Record<string, number>, ings: Ingredient[]) => {
    return checks.every(c => c(t, ings));
  };
}

const INGREDIENT_COSTS: Record<string, number> = {
  "twigs": 1,
  "ice": 2,
  "berries": 5,
  "berries_juicy": 6,
  "carrot": 10,
  "red_mushroom": 12,
  "green_mushroom": 12,
  "blue_mushroom": 12,
  "smallmeat": 20,
  "monstermeat": 25,
  "bird_egg": 30,
  "honey": 35,
  "froglegs": 40,
  "drumstick": 45,
  "fish": 50,
  "meat": 60,
  "potato": 30,
  "onion": 35,
  "garlic": 40,
  "pepper": 45,
  "cactus_meat": 20,
  "kelp": 15,
  "cactus_flower": 100,
  "watermelon": 80,
  "dragonfruit": 150,
  "fig": 50,
  "cave_banana": 40,
  "acorn_cooked": 30,
  "tallbirdegg": 200,
  "wobster_sheller_land": 300,
  "barnacle": 100,
  "goatmilk": 250,
  "butter": 1000,
  "royal_jelly": 2000,
  "mandrake": 5000,
  "forgetmelots": 50,
  "mole": 100,
  "cutlichen": 80,
  "eel": 120,
  "moon_cap": 30,
  "boneshard": 50,
  "refined_dust": 200,
  "nightmarefuel": 150,
  "lightninggoathorn": 300,
  "seeds": 15,
};

function solveIdealCombo(recipe: Recipe): string[] {
  // Try existing idealCombo first
  try {
    const checkResult = cookCrockPot(recipe.idealCombo, recipe.isPortable);
    if (checkResult.id === recipe.id) {
      return recipe.idealCombo;
    }
  } catch {
    // Ignore and solve
  }

  // 1. Gather candidate ingredients
  const candidatesSet = new Set<string>([
    "twigs",
    "ice",
    "berries",
    "cave_banana",
    "pomegranate",
    "carrot",
    "onion",
    "smallmeat",
    "meat",
    "monstermeat",
    "bird_egg",
    "honey",
    "fishmeat",
    "eel",
  ]);

  // Extract from requirements EN/ZH
  const reqStr = recipe.requirementsEN || recipe.requirementsZH;
  if (reqStr) {
    const parts = reqStr.split(",").map(s => s.trim());
    for (const part of parts) {
      if (part.toLowerCase().includes("glow berry") && part.toLowerCase().includes("lesser")) {
        candidatesSet.add("wormlight");
        candidatesSet.add("wormlight_lesser");
        continue;
      }
      if (part.includes("×")) {
        const match = part.match(/(.+) ×([\d.]+)/);
        if (match) {
          const namePart = match[1].trim().toLowerCase();
          const subNames = namePart.split("/").map(n => n.trim());
          for (const s of subNames) {
            candidatesSet.add(mapNameToId(s));
          }
        }
      } else if (part.includes(">") || part.includes("<") || part.includes("≥") || part.includes("≤") || part.includes("=")) {
        const match = part.match(/(.+?)\s*([><≥≤=]|>=|<=)\s*([\d.]+)/);
        if (match) {
          const category = match[1].trim().toLowerCase();
          candidatesSet.add(mapNameToId(category));
        }
      } else {
        const name = part.toLowerCase().trim();
        if (!name.startsWith("no ")) {
          candidatesSet.add(mapNameToId(name));
        }
      }
    }
  }

  // Convert to array
  const candidates = Array.from(candidatesSet).filter(id => !!INGREDIENT_MAP[id]);

  let bestCombo: string[] = ["twigs", "twigs", "twigs", "twigs"];
  let bestCost = Infinity;

  // 2. Loop through combinations of length 4 with replacement
  const n = candidates.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      for (let k = j; k < n; k++) {
        for (let l = k; l < n; l++) {
          const combo = [candidates[i], candidates[j], candidates[k], candidates[l]];
          try {
            const result = cookCrockPot(combo, recipe.isPortable);
            if (result.id === recipe.id) {
              const cost = combo.reduce((sum, id) => sum + (INGREDIENT_COSTS[id] || 50), 0);
              if (cost < bestCost) {
                bestCost = cost;
                bestCombo = combo;
              }
            }
          } catch {
            // Ignore
          }
        }
      }
    }
  }

  return bestCombo;
}

function translateCategoryOrTerm(name: string): string {
  name = name.toLowerCase().trim();
  const map: Record<string, string> = {
    meat: "肉類",
    veg: "蔬菜",
    veggie: "蔬菜",
    fruit: "水果",
    egg: "蛋類",
    sweetener: "甜味劑",
    dairy: "乳製品",
    fish: "魚類",
    twigs: "樹枝",
    ice: "冰塊",
    frozen: "冰屬性",
    monster: "怪物食材",
    inedible: "不可食用物",
    honey: "蜂蜜",
    fat: "油脂",
    magic: "魔法食材"
  };
  
  if (map[name]) return map[name];
  
  const id = mapNameToId(name);
  if (INGREDIENT_MAP[id]) {
    return INGREDIENT_MAP[id].name;
  }
  
  const singular = name.replace(/s$/, "");
  if (map[singular]) return map[singular];
  
  const singularId = mapNameToId(singular);
  if (INGREDIENT_MAP[singularId]) {
    return INGREDIENT_MAP[singularId].name;
  }
  
  const translations: Record<string, string> = {
    "asparagus": "蘆筍",
    "cave banana": "香蕉",
    "barnacle": "藤壺",
    "butter": "黃油",
    "royal jelly": "蜂王漿",
    "forget-me-lots": "必忘我",
    "small meat": "小肉",
    "dragon fruit": "火龍果",
    "fig": "無花果",
    "cactus flower": "仙人掌花",
    "frog legs": "蛙腿",
    "moleworm": "鼴鼠",
    "onion": "洋蔥",
    "ripe stone fruit": "成熟石果",
    "cactus flesh": "仙人掌肉",
    "kelp": "海帶",
    "acorn": "烤樺栗果",
    "drumstick": "鳥腿",
    "seed": "種子",
    "seeds": "種子",
    "butterfly wings": "蝴蝶翅膀",
    "koalefant trunk": "象鼻",
    "leafy meat": "葉肉",
    "wobster": "龍蝦",
    "moon shroom": "月亮蘑菇",
    "red cap": "紅蘑菇",
    "blue cap": "藍蘑菇",
    "green cap": "綠蘑菇",
    "tallbird egg": "高腳鳥蛋",
    "lichen": "地衣",
    "bone shards": "骨頭碎片",
    "nightmare fuel": "噩夢燃料",
    "volt goat horn": "伏特羊角",
    "collected dust": "塵埃",
    "glow berry": "發光漿果",
    "lesser glow berry": "小發光漿果",
    "pumpkin": "南瓜",
    "eggplant": "茄子"
  };
  
  return translations[name] || translations[singular] || name;
}

export function translateRequirementsToZH(reqStr: string): string {
  if (!reqStr || reqStr.includes("Anything")) return "無限制（任意食材）";
  
  const cleanStr = reqStr.replace(/\.(?!\d)/g, ",");
  const parts = cleanStr.split(",").map(s => s.trim()).filter(Boolean);
  const translatedParts = parts.map(part => {
    if (part.toLowerCase().includes("glow berry") && part.toLowerCase().includes("lesser")) {
      return "發光漿果 ×1 或 小發光漿果 ×2";
    }
    
    if (part.startsWith("No ")) {
      const category = part.replace("No ", "").trim();
      return `不能含有${translateCategoryOrTerm(category)}`;
    }
    
    if (part.includes("×")) {
      const match = part.match(/(.+) ×([\d.]+)/);
      if (match) {
        const namePart = match[1].trim();
        const count = parseFloat(match[2]);
        const subNames = namePart.split("/").map(n => n.trim());
        const translatedNames = subNames.map(n => translateCategoryOrTerm(n)).join("或");
        return `${translatedNames} ×${count}`;
      }
    }
    
    const countFirstMatch = part.match(/^([\d.]+)\s+(.+)$/);
    if (countFirstMatch) {
      const count = parseFloat(countFirstMatch[1]);
      const namePart = countFirstMatch[2].trim();
      const subNames = namePart.split("/").map(n => n.trim());
      const translatedNames = subNames.map(n => translateCategoryOrTerm(n)).join("或");
      return `${translatedNames} ×${count}`;
    }
    
    if (part.includes(">") || part.includes("<") || part.includes("≥") || part.includes("≤") || part.includes("=")) {
      const match = part.match(/(.+?)\s*([><≥≤=]|>=|<=)\s*([\d.]+)/);
      if (match) {
        const category = match[1].trim();
        const op = match[2];
        const val = parseFloat(match[3]);
        return `${translateCategoryOrTerm(category)} ${op} ${val}`;
      }
    }
    
    return `包含 ${translateCategoryOrTerm(part)}`;
  });
  
  return translatedParts.join("，");
}

// Compile and merge the lists
const compiledRecipes: Recipe[] = [];

// Filter cooking recipes to include only cookpot and portablecookpot
const validCookingRecipes = cookingRecipes.filter(
  r => r.station === "cookpot" || r.station === "portablecookpot"
);

for (const raw of validCookingRecipes) {
  const tcName = recipeNameTranslations[raw.name] || raw.name;
  const canCookWith = parseRequirements(raw.requirements);

  // Expand idealCombo from cardIngredients
  const idealCombo: string[] = [];
  if (raw.cardIngredients) {
    for (const [ingId, count] of raw.cardIngredients) {
      for (let i = 0; i < count; i++) {
        idealCombo.push(mapNameToId(ingId));
      }
    }
  }
  // Fill to 4 slots if under 4 slots using twigs / filler
  while (idealCombo.length < 4) {
    idealCombo.push("twigs");
  }

  const recipe: Recipe = {
    id: raw.id,
    name: tcName,
    englishName: raw.name,
    hp: raw.health,
    hunger: raw.hunger,
    sanity: raw.sanity,
    cookTime: raw.cookTime * 20,
    perishDays: raw.perishDays === null ? 999 : raw.perishDays,
    priority: raw.priority,
    requirementsZH: translateRequirementsToZH(raw.requirements),
    requirementsEN: raw.requirements,
    canCookWith: canCookWith,
    idealCombo: idealCombo.slice(0, 4),
    description: raw.description || `《DST》官方食譜中的經典烹飪菜餚，優先度為 ${raw.priority}。`,
    isPortable: raw.station === "portablecookpot"
  };

  compiledRecipes.push(recipe);
}

// Solve/verify idealCombo for all compiled recipes
for (const recipe of compiledRecipes) {
  recipe.idealCombo = solveIdealCombo(recipe);
}

// Export combined RECIPES
export const RECIPES: Recipe[] = compiledRecipes;

// Helper function to sum up parameters
export function sumIngredients(ingredientIds: string[]): Record<string, number> {
  const totals: Record<string, number> = {
    meat: 0,
    monster: 0,
    veg: 0,
    fruit: 0,
    egg: 0,
    sweetener: 0,
    dairy: 0,
    fish: 0,
    twigs: 0,
    ice: 0,
    drumstick: 0,
    butterfly: 0,
    mandrake: 0,
    birchnut: 0,
    watermelon: 0,
    dragonfruit: 0,
    flower: 0,
    mole: 0,
    lichen: 0,
    eel: 0,
    fat: 0,
    magic: 0,
  };

  for (const id of ingredientIds) {
    const ing = INGREDIENT_MAP[id];
    if (ing && ing.values) {
      for (const [key, val] of Object.entries(ing.values)) {
        if (typeof val === "number") {
          totals[key] = (totals[key] || 0) + val;
        }
      }
    }
    // Handle special tags like fat and magic for soothing tea
    if (id === "butter") totals.fat = (totals.fat || 0) + 1;
    if (id === "mandrake") totals.magic = (totals.magic || 0) + 1;
  }
  return totals;
}

// Helper function to calculate Crock Pot output for 4 selected ingredient IDs
export function cookCrockPot(selectedIds: string[], isPortable: boolean = false): Recipe {
  if (selectedIds.length !== 4) {
    return compiledRecipes.find((r) => r.id === "wet_goop")!;
  }

  const totals = sumIngredients(selectedIds);
  const selectedIngredients = selectedIds.map((id) => INGREDIENT_MAP[id]).filter(Boolean);

  // Filter recipes whose requirements are satisfied
  const matchingRecipes = compiledRecipes.filter((recipe) => {
    if (recipe.id === "wet_goop") return true;
    
    // Ignore Warly-exclusive recipes if not using a portable crockpot
    if (!isPortable && recipe.isPortable) return false;

    try {
      return recipe.canCookWith(totals, selectedIngredients);
    } catch {
      return false;
    }
  });

  if (matchingRecipes.length === 0) {
    return compiledRecipes.find((r) => r.id === "wet_goop")!;
  }

  // Sort by priority landing the highest priority on index 0
  matchingRecipes.sort((a, b) => b.priority - a.priority);

  return matchingRecipes[0];
}

// Check what recipes are "cookable" if the user has ONLY access to the subset of checkedIngredients
export function getCookableRecipes(checkedIds: string[], isPortable: boolean = false): Recipe[] {
  if (checkedIds.length === 0) return [];

  const cookableMap: Record<string, boolean> = {};
  const combinations: string[][] = [];
  const n = checkedIds.length;

  const current: string[] = [];
  function generateCombos(index: number, depth: number) {
    if (depth === 4) {
      combinations.push([...current]);
      return;
    }
    for (let i = index; i < n; i++) {
      current.push(checkedIds[i]);
      generateCombos(i, depth + 1);
      current.pop();
    }
  }

  generateCombos(0, 0);

  for (const combo of combinations) {
    const result = cookCrockPot(combo, isPortable);
    cookableMap[result.id] = true;
  }

  return compiledRecipes.filter((r) => cookableMap[r.id]);
}

export function isRecipeRelated(recipe: Recipe, checkedIds: string[]): boolean {
  if (checkedIds.length === 0) return false;
  
  // 1. Check if any checked ingredient is in the idealCombo
  if (recipe.idealCombo.some(id => checkedIds.includes(id))) {
    return true;
  }
  
  // 2. Check if any checked ingredient's category is used in the requirements
  const checkedIngs = checkedIds.map(id => INGREDIENT_MAP[id]).filter(Boolean);
  
  const reqStr = recipe.requirementsEN || recipe.requirementsZH;
  if (!reqStr) return false;
  
  const parts = reqStr.split(",").map(s => s.trim());
  for (const part of parts) {
    if (part.startsWith("No ")) continue; // Skip negative requirements
    
    // Check if category matches
    for (const ing of checkedIngs) {
      const tags = Object.keys(ing.values || {});
      for (const tag of tags) {
        const regex = new RegExp(`\\b${tag}\\b`, "i");
        if (regex.test(part)) return true;
        
        const tag1 = mapCategoryToTag(tag);
        const partWords = part.split(/[^a-zA-Z]/).map(w => w.trim().toLowerCase());
        if (partWords.some(pw => mapCategoryToTag(pw) === tag1)) {
          return true;
        }
      }
      
      const nameRegex = new RegExp(`\\b${ing.englishName}\\b`, "i");
      if (nameRegex.test(part)) return true;
    }
  }
  
  return false;
}

export function translateCategory(tag: string): string {
  const map: Record<string, string> = {
    meat: "肉類",
    veg: "蔬菜",
    fruit: "水果",
    egg: "蛋類",
    sweetener: "甜味劑",
    dairy: "乳製品",
    fish: "魚類",
    twigs: "樹枝",
    ice: "冰塊",
    frozen: "冰屬性",
    monster: "怪物食材",
    inedible: "不可食用物"
  };
  return map[tag] || tag;
}

export function translateTerm(name: string): string {
  const map: Record<string, string> = {
    "honey": "蜂蜜",
    "asparagus": "蘆筍",
    "cave banana": "洞穴香蕉",
    "barnacle": "藤壺",
    "butter": "黃油",
    "royal jelly": "蜂王乳",
    "forget-me-lots": "勿忘我",
    "small meat": "小肉",
    "dragon fruit": "火龍果",
    "fig": "無花果",
    "cactus flower": "仙人掌花",
    "frog legs": "蛙腿",
    "moleworm": "活鼴鼠",
    "onion": "洋蔥",
    "ripe stone fruit": "成熟石果",
    "cactus flesh": "仙人掌肉",
    "kelp": "海帶",
    "acorn": "烤樺木果",
    "drumstick": "火雞腿",
    "seed": "種子",
    "seeds": "種子",
    "butterfly wings": "蝴蝶翅膀",
    "koalefant trunk": "象鼻",
    "leafy meat": "葉肉",
    "wobster": "龍蝦",
    "moon shroom": "月亮蘑菇",
    "red cap": "紅蘑菇",
    "blue cap": "藍蘑菇",
    "green cap": "綠蘑菇",
    "tallbird egg": "高鳥蛋",
    "lichen": "地衣",
    "bone shards": "骨片",
    "nightmare fuel": "噩夢燃料",
    "volt goat horn": "伏特羊角",
    "collected dust": "精煉粉塵",
    "glow berry": "發光漿果",
    "lesser glow berry": "小發光漿果",
    "pumpkin": "南瓜",
    "eggplant": "茄子"
  };
  return map[name.toLowerCase().trim()] || name;
}

export function getMissingRequirements(recipe: Recipe, checkedIds: string[]): string[] {
  const totals = sumIngredients(checkedIds);
  const checkedIngredients = checkedIds.map(id => INGREDIENT_MAP[id]).filter(Boolean);

  const missing: string[] = [];
  
  const reqStr = recipe.requirementsEN || recipe.requirementsZH;
  if (!reqStr || reqStr.includes("Anything")) return [];

  const cleanStr = reqStr.replace(/\.(?!\d)/g, ",");
  const parts = cleanStr.split(",").map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    if (part.toLowerCase().includes("glow berry") && part.toLowerCase().includes("lesser")) {
      const glowBerryCount = checkedIngredients.filter(i => i.id === "wormlight").length;
      const lesserGlowBerryCount = checkedIngredients.filter(i => i.id === "wormlight_lesser").length;
      if (glowBerryCount < 1 && lesserGlowBerryCount < 2) {
        missing.push("發光漿果 ×1 或 小發光漿果 ×2");
      }
      continue;
    }
    
    if (part.startsWith("No ")) {
      const category = part.replace("No ", "").trim();
      const tag = mapCategoryToTag(category);
      if ((totals[tag] || 0) > 0) {
        missing.push(`不能含有${translateCategoryOrTerm(category)}`);
      }
      continue;
    }
    
    // Format: "Name ×Count"
    if (part.includes("×")) {
      const match = part.match(/(.+) ×([\d.]+)/);
      if (match) {
        const namePart = match[1].trim();
        const count = parseFloat(match[2]);
        const tag = mapCategoryToTag(namePart);
        const categoriesList = ["meat", "veg", "fruit", "egg", "sweetener", "dairy", "fish", "twigs", "ice"];
        if (categoriesList.includes(tag)) {
          const current = totals[tag] || 0;
          if (current < count) {
            missing.push(`${translateCategoryOrTerm(namePart)} 需包含 ×${count}`);
          }
        } else {
          const subNames = namePart.split("/").map(n => n.trim());
          const subIds = subNames.map(mapNameToId);
          const matchedIngsCount = checkedIngredients.filter(i => subIds.includes(i.id)).length;
          if (matchedIngsCount < count) {
            const translatedNames = subNames.map(n => translateCategoryOrTerm(n)).join("或");
            missing.push(`必須包含 ${translatedNames} ×${count}`);
          }
        }
      }
      continue;
    }
    
    // Format: "Count Name" (e.g. "1 Butterfly Wings")
    const countFirstMatch = part.match(/^([\d.]+)\s+(.+)$/);
    if (countFirstMatch) {
      const count = parseFloat(countFirstMatch[1]);
      const namePart = countFirstMatch[2].trim();
      const tag = mapCategoryToTag(namePart);
      const categoriesList = ["meat", "veg", "fruit", "egg", "sweetener", "dairy", "fish", "twigs", "ice"];
      if (categoriesList.includes(tag)) {
        const current = totals[tag] || 0;
        if (current < count) {
          missing.push(`${translateCategoryOrTerm(namePart)} 需包含 ×${count}`);
        }
      } else {
        const subNames = namePart.split("/").map(n => n.trim());
        const subIds = subNames.map(mapNameToId);
        const matchedIngsCount = checkedIngredients.filter(i => subIds.includes(i.id)).length;
        if (matchedIngsCount < count) {
          const translatedNames = subNames.map(n => translateCategoryOrTerm(n)).join("或");
          missing.push(`必須包含 ${translatedNames} ×${count}`);
        }
      }
      continue;
    }
    
    // Format: "Category/Name >= Count" etc.
    if (part.includes(">") || part.includes("<") || part.includes("≥") || part.includes("≤") || part.includes("=")) {
      const match = part.match(/(.+?)\s*([><≥≤=]|>=|<=)\s*([\d.]+)/);
      if (match) {
        const category = match[1].trim();
        const op = match[2];
        const val = parseFloat(match[3]);
        const tag = mapCategoryToTag(category);
        const currentVal = totals[tag] || 0;

        let satisfied = false;
        if (op === ">") satisfied = currentVal > val;
        else if (op === "<") satisfied = currentVal < val;
        else if (op === "≥" || op === ">=") satisfied = currentVal >= val;
        else if (op === "≤" || op === "<=") satisfied = currentVal <= val;
        else if (op === "=") satisfied = currentVal === val;

        if (!satisfied) {
          missing.push(`${translateCategoryOrTerm(category)} 需滿足 ${op} ${val}`);
        }
      }
      continue;
    }
    
    // Single word requirement
    const name = part.trim();
    const tag = mapCategoryToTag(name);
    const categoriesList = ["meat", "veg", "fruit", "egg", "sweetener", "dairy", "fish", "twigs", "ice"];
    if (categoriesList.includes(tag)) {
      const current = totals[tag] || 0;
      if (current < 0.5) {
        missing.push(`需要包含 ${translateCategoryOrTerm(name)} (至少 0.5)`);
      }
    } else {
      const ingId = mapNameToId(name);
      if (!checkedIds.includes(ingId)) {
        missing.push(`必須包含 ${translateCategoryOrTerm(name)}`);
      }
    }
  }

  return missing;
}
