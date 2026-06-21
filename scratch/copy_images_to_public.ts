import * as fs from "fs";
import * as path from "path";
import { INGREDIENTS } from "../src/data/ingredients";
import { RECIPES } from "../src/recipesData";

const sourceDir = `C:\\Users\\aszx1\\Desktop\\games\\don't st\\dst-images_game-items`;
const projectRoot = process.cwd();
const publicImagesDir = path.join(projectRoot, "public", "images");
const destIngredientsDir = path.join(publicImagesDir, "ingredients");
const destRecipesDir = path.join(publicImagesDir, "recipes");

// 1. Create directories
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}
if (!fs.existsSync(destIngredientsDir)) {
  fs.mkdirSync(destIngredientsDir, { recursive: true });
}
if (!fs.existsSync(destRecipesDir)) {
  fs.mkdirSync(destRecipesDir, { recursive: true });
}

console.log("Source directory:", sourceDir);
console.log("Dest Ingredients:", destIngredientsDir);
console.log("Dest Recipes:", destRecipesDir);

// Mapping files in target subfolders back
const sourceIngredientsDir = path.join(sourceDir, "食材");
const sourceRecipesDir = path.join(sourceDir, "食譜");

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

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_\-]/g, "");
}

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

// Copy recipes
if (fs.existsSync(sourceRecipesDir)) {
  const files = fs.readdirSync(sourceRecipesDir);
  for (const file of files) {
    const baseName = path.basename(file, ".png");
    const normBase = normalize(baseName);
    
    let matchedRecipe = RECIPES.find(r => {
      if (normalize(r.id) === normBase) return true;
      if (normalize(r.name) === normBase) return true;
      if (normalize(r.englishName) === normBase) return true;
      if (oldToNewIdMap[r.id] && normalize(oldToNewIdMap[r.id]) === normBase) return true;
      const mappedOldId = newToOldIdMap[r.id];
      if (mappedOldId && normalize(mappedOldId) === normBase) return true;
      return false;
    });

    if (matchedRecipe) {
      const srcPath = path.join(sourceRecipesDir, file);
      const destPath = path.join(destRecipesDir, `${matchedRecipe.id}.png`);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied recipe: ${file} -> recipes/${matchedRecipe.id}.png`);
    }
  }
}

// Copy ingredients
if (fs.existsSync(sourceIngredientsDir)) {
  const files = fs.readdirSync(sourceIngredientsDir);
  for (const file of files) {
    const baseName = path.basename(file, ".png");
    const normBase = normalize(baseName);
    
    let matchedIngredient = INGREDIENTS.find(i => {
      if (normalize(i.id) === normBase) return true;
      if (normalize(i.name) === normBase) return true;
      if (normalize(i.englishName) === normBase) return true;
      
      const mappedId = synonymMap[normBase];
      if (mappedId && i.id === mappedId) return true;
      
      return false;
    });

    if (matchedIngredient) {
      const srcPath = path.join(sourceIngredientsDir, file);
      const destPath = path.join(destIngredientsDir, `${matchedIngredient.id}.png`);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ingredient: ${file} -> ingredients/${matchedIngredient.id}.png`);
    }
  }
}

console.log("Copy and rename complete!");
