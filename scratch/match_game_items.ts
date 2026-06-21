import * as fs from "fs";
import * as path from "path";
import { INGREDIENTS } from "../src/data/ingredients";
import { RECIPES } from "../src/recipesData";

const targetDir = `C:\\Users\\aszx1\\Desktop\\games\\don't st\\dst-images_game-items`;

if (!fs.existsSync(targetDir)) {
  console.error("Directory not found:", targetDir);
  process.exit(1);
}

const newToOldIdMap: Record<string, string> = {
  "mandrakesoup": "mandrake_soup",
  "waffles": "waffles",
  "surfnturf": "surf_n_turf",
  "icecream": "ice_cream",
  "perogies": "pierogi",
  "dragonpie": "dragonpie",
  "fishsticks": "fishsticks",
  "flowersalad": "flower_salad",
  "trailmix": "trail_mix",
  "unagi": "unagi",
  "guacamole": "guacamole",
  "butterflymuffin": "butter_muffin",
  "turkeydinner": "turkey_dinner",
  "baconeggs": "bacon_and_eggs",
  "watermelonicle": "melonsicle",
  "taffy": "taffy",
  "bonestew": "meaty_stew",
  "meatballs": "meatballs",
  "jammypreserves": "fist_full_of_jam",
  "ratatouille": "ratatouille",
  "kabobs": "kabobs",
  "monsterlasagna": "monster_lasagna",
  "wetgoop": "wet_goop"
};

const oldToNewIdMap: Record<string, string> = {};
for (const [newId, oldId] of Object.entries(newToOldIdMap)) {
  oldToNewIdMap[oldId] = newId;
}

const files = fs.readdirSync(targetDir);
const pngFiles = files.filter(f => f.toLowerCase().endsWith(".png"));

interface MatchResult {
  fileName: string;
  type: "ingredient" | "recipe" | "other";
  matchedItem: any;
}

const results: MatchResult[] = [];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_\-]/g, "");
}

// Synonym mapping to align filenames with ingredients.ts IDs
const synonymMap: Record<string, string> = {
  "morsel": "smallmeat",
  "cookedmorsel": "smallmeat_cooked",
  "morselcooked": "smallmeat_cooked",
  "cookedsmallmeat": "smallmeat_cooked",
  "smallmeatcooked": "smallmeat_cooked",
  "driedmorsel": "smallmeat_dried",
  "morseldried": "smallmeat_dried",
  "smallmeatdried": "smallmeat_dried",
  
  "meatcooked": "meat_cooked",
  "cookedmeat": "meat_cooked",
  "meatdried": "meat_dried",
  "driedmeat": "meat_dried",
  "jerky": "meat_dried",
  
  "monstermeatcooked": "monstermeat_cooked",
  "cookedmonstermeat": "monstermeat_cooked",
  "monstermeatdried": "monstermeat_dried",
  "driedmonstermeat": "monstermeat_dried",
  "monsterjerky": "monstermeat_dried",
  
  "cookedmandrake": "mandrake_cooked",
  "mandrakecooked": "mandrake_cooked",
  
  "egg": "bird_egg",
  "eggcooked": "bird_egg_cooked",
  "cookedegg": "bird_egg_cooked",
  
  "cookedfish": "fishmeat_cooked",
  "fishcooked": "fishmeat_cooked",
  "driedfish": "fishmeat_dried",
  "fishdried": "fishmeat_dried",
  
  "cookedfroglegs": "froglegs_cooked",
  "froglegscooked": "froglegs_cooked",
  
  "forgetmelot": "forgetmelots",
  "forgetmelotdried": "forgetmelots_dried"
};

// Keep track of which database items are matched
const matchedRecipeIds = new Set<string>();
const matchedIngredientIds = new Set<string>();

for (const file of pngFiles) {
  const baseName = path.basename(file, ".png");
  const normBase = normalize(baseName);
  
  // Try matching recipes
  let matchedRecipe = RECIPES.find(r => {
    if (normalize(r.id) === normBase) return true;
    if (normalize(r.name) === normBase) return true;
    if (normalize(r.englishName) === normBase) return true;
    if (oldToNewIdMap[r.id] && normalize(oldToNewIdMap[r.id]) === normBase) return true;
    const mappedOldId = newToOldIdMap[r.id];
    if (mappedOldId && normalize(mappedOldId) === normBase) return true;
    return false;
  });
  
  // Try matching ingredients
  let matchedIngredient = INGREDIENTS.find(i => {
    if (normalize(i.id) === normBase) return true;
    if (normalize(i.name) === normBase) return true;
    if (normalize(i.englishName) === normBase) return true;
    
    const mappedId = synonymMap[normBase];
    if (mappedId && i.id === mappedId) return true;
    
    return false;
  });

  if (matchedRecipe) {
    results.push({
      fileName: file,
      type: "recipe",
      matchedItem: matchedRecipe
    });
    matchedRecipeIds.add(matchedRecipe.id);
  } else if (matchedIngredient) {
    results.push({
      fileName: file,
      type: "ingredient",
      matchedItem: matchedIngredient
    });
    matchedIngredientIds.add(matchedIngredient.id);
  } else {
    results.push({
      fileName: file,
      type: "other",
      matchedItem: null
    });
  }
}

// Find missing recipes and ingredients from the database
const missingRecipes = RECIPES.filter(r => !matchedRecipeIds.has(r.id));
const missingIngredients = INGREDIENTS.filter(i => !matchedIngredientIds.has(i.id));

const recipes = results.filter(r => r.type === "recipe");
const ingredients = results.filter(r => r.type === "ingredient");

// Create subfolders in targetDir
const ingredientsDir = path.join(targetDir, "食材");
const recipesDir = path.join(targetDir, "食譜");

if (!fs.existsSync(ingredientsDir)) {
  fs.mkdirSync(ingredientsDir);
  console.log("Created directory:", ingredientsDir);
}
if (!fs.existsSync(recipesDir)) {
  fs.mkdirSync(recipesDir);
  console.log("Created directory:", recipesDir);
}

// Move files
console.log("\n=== Moving Recipes ===");
for (const r of recipes) {
  const oldPath = path.join(targetDir, r.fileName);
  const newPath = path.join(recipesDir, r.fileName);
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved recipe: ${r.fileName} -> 食譜/${r.fileName}`);
  } catch (err: any) {
    console.error(`Failed to move recipe ${r.fileName}:`, err.message);
  }
}

console.log("\n=== Moving Ingredients ===");
for (const i of ingredients) {
  const oldPath = path.join(targetDir, i.fileName);
  const newPath = path.join(ingredientsDir, i.fileName);
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ingredient: ${i.fileName} -> 食材/${i.fileName}`);
  } catch (err: any) {
    console.error(`Failed to move ingredient ${i.fileName}:`, err.message);
  }
}

console.log("\n=== MISSING RECIPES FROM THE FOLDER ===");
if (missingRecipes.length === 0) {
  console.log("All recipes in the database have corresponding PNG files!");
} else {
  missingRecipes.forEach(r => {
    console.log(`- Missing Recipe: ${r.name} (${r.englishName}) [ID: ${r.id}]`);
  });
}

console.log("\n=== MISSING INGREDIENTS FROM THE FOLDER ===");
if (missingIngredients.length === 0) {
  console.log("All ingredients in the database have corresponding PNG files!");
} else {
  missingIngredients.forEach(i => {
    console.log(`- Missing Ingredient: ${i.name} (${i.englishName}) [ID: ${i.id}]`);
  });
}

console.log("\n=== Operation Summary ===");
console.log(`Total PNG Files in root: ${pngFiles.length}`);
console.log(`Moved Recipes: ${recipes.length}`);
console.log(`Moved Ingredients: ${ingredients.length}`);
console.log(`Missing Recipes (not in folder): ${missingRecipes.length}`);
console.log(`Missing Ingredients (not in folder): ${missingIngredients.length}`);
