import * as fs from "fs";
import * as path from "path";

const targetDir = `C:\\Users\\aszx1\\Desktop\\games\\don't st\\game-items-v1`;
const ingredientsDir = path.join(targetDir, "食材");
const recipesDir = path.join(targetDir, "食譜");

console.log("=== Reverting Moved Files ===");

if (fs.existsSync(ingredientsDir)) {
  const files = fs.readdirSync(ingredientsDir);
  for (const file of files) {
    const oldPath = path.join(ingredientsDir, file);
    const newPath = path.join(targetDir, file);
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved back: 食材/${file} -> ${file}`);
    } catch (err: any) {
      console.error(`Failed to move back 食材/${file}:`, err.message);
    }
  }
  try {
    fs.rmdirSync(ingredientsDir);
    console.log("Deleted directory:", ingredientsDir);
  } catch (err: any) {
    console.error("Failed to delete directory 食材:", err.message);
  }
} else {
  console.log("Ingredients directory does not exist:", ingredientsDir);
}

if (fs.existsSync(recipesDir)) {
  const files = fs.readdirSync(recipesDir);
  for (const file of files) {
    const oldPath = path.join(recipesDir, file);
    const newPath = path.join(targetDir, file);
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved back: 食譜/${file} -> ${file}`);
    } catch (err: any) {
      console.error(`Failed to move back 食譜/${file}:`, err.message);
    }
  }
  try {
    fs.rmdirSync(recipesDir);
    console.log("Deleted directory:", recipesDir);
  } catch (err: any) {
    console.error("Failed to delete directory 食譜:", err.message);
  }
} else {
  console.log("Recipes directory does not exist:", recipesDir);
}

console.log("=== Reversion Done ===");
