import * as fs from 'fs';
import * as readline from 'readline';

async function run() {
  const poPath = 'c:/Users/aszx1/Desktop/games/don\'t starve/scripts/scripts/languages/chinese_t.po';
  const fileStream = fs.createReadStream(poPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentContext = '';
  let currentMsgId = '';
  let currentMsgStr = '';
  let parsingState: 'none' | 'msgctxt' | 'msgid' | 'msgstr' = 'none';

  const ctxtMap: Record<string, string> = {};
  const engMap: Record<string, string> = {};

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.startsWith('msgctxt ')) {
      parsingState = 'msgctxt';
      const match = line.match(/"([^"]+)"/);
      currentContext = match ? match[1] : '';
    } else if (trimmed.startsWith('msgid ')) {
      parsingState = 'msgid';
      const match = line.match(/"([^"]*)"/);
      currentMsgId = match ? match[1] : '';
    } else if (trimmed.startsWith('msgstr ')) {
      parsingState = 'msgstr';
      const match = line.match(/"([^"]*)"/);
      currentMsgStr = match ? match[1] : '';
    } else if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      const match = line.match(/"([^"]*)"/);
      const content = match ? match[1] : '';
      if (parsingState === 'msgctxt') {
        currentContext += content;
      } else if (parsingState === 'msgid') {
        currentMsgId += content;
      } else if (parsingState === 'msgstr') {
        currentMsgStr += content;
      }
    } else if (trimmed === '') {
      if (currentMsgId && currentMsgStr) {
        if (currentContext) {
          ctxtMap[currentContext.toUpperCase()] = currentMsgStr;
        }
        engMap[currentMsgId.toLowerCase()] = currentMsgStr;
      }
      currentContext = '';
      currentMsgId = '';
      currentMsgStr = '';
      parsingState = 'none';
    }
  }

  if (currentMsgId && currentMsgStr) {
    if (currentContext) {
      ctxtMap[currentContext.toUpperCase()] = currentMsgStr;
    }
    engMap[currentMsgId.toLowerCase()] = currentMsgStr;
  }

  console.log(`Parsed PO file. ctxtMap keys: ${Object.keys(ctxtMap).length}, engMap keys: ${Object.keys(engMap).length}`);

  // Helper to translate a name
  function getTranslation(englishName: string, id: string): string | null {
    // Try by ID context first
    const cleanId = id.toUpperCase();
    const possibleCtxts = [
      `STRINGS.NAMES.${cleanId}`,
      `STRINGS.NAMES.${cleanId.replace(/_/g, '')}`,
      `STRINGS.NAMES.${cleanId}_COOKED`,
      `STRINGS.NAMES.COOKED_${cleanId}`
    ];
    for (const ctxt of possibleCtxts) {
      if (ctxtMap[ctxt]) {
        return ctxtMap[ctxt];
      }
    }

    // Try by English name (normalize unicode / accent characters first, then try exact)
    const normalizedEng = englishName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // e.g. Soufflé -> Souffle
    const possibleEngs = [
      englishName.toLowerCase().trim(),
      normalizedEng.toLowerCase().trim()
    ];
    for (const eng of possibleEngs) {
      if (engMap[eng]) {
        return engMap[eng];
      }
    }

    return null;
  }

  // 1. Translate Ingredients in src/data/ingredients.ts
  const ingredientsPath = 'src/data/ingredients.ts';
  let ingredientsContent = fs.readFileSync(ingredientsPath, 'utf8');
  const matchArray = ingredientsContent.match(/export const INGREDIENTS: Ingredient\[\] = (\[[\s\S]*?\]);/);
  if (!matchArray) {
    console.error("Could not find INGREDIENTS array in ingredients.ts");
    return;
  }
  const arrayStr = matchArray[1];
  const INGREDIENTS = eval(arrayStr);

  let ingChanges = 0;
  for (const ing of INGREDIENTS) {
    const translation = getTranslation(ing.englishName, ing.id);
    if (translation && translation !== ing.name) {
      console.log(`Ingredient: ${ing.id} (${ing.name}) -> ${translation}`);
      ing.name = translation;
      ingChanges++;
    }
  }
  console.log(`Updated ${ingChanges} ingredients.`);

  const newIngredientsContent = ingredientsContent.replace(
    /export const INGREDIENTS: Ingredient\[\] = \[[\s\S]*?\];/,
    `export const INGREDIENTS: Ingredient[] = ${JSON.stringify(INGREDIENTS, null, 2)};`
  );
  fs.writeFileSync(ingredientsPath, newIngredientsContent, 'utf8');


  // 2. Load recipes from src/data/recipes.ts to translate EVERY recipe name
  const recipesPath = 'src/data/recipes.ts';
  const recipesContent = fs.readFileSync(recipesPath, 'utf8');
  // Match recipe objects to get all names
  // A clean way is to import them or evaluate the file structure, or run regex to find all name values
  // Since we are running in tsx, we can import them!
  const { cookingRecipes } = await import('../src/data/recipes');
  console.log(`Loaded ${cookingRecipes.length} recipes from recipes.ts`);

  // Load existing translations in src/recipesData.ts
  const recipesDataPath = 'src/recipesData.ts';
  let recipesDataContent = fs.readFileSync(recipesDataPath, 'utf8');
  const matchRecipes = recipesDataContent.match(/const recipeNameTranslations: Record<string, string> = ({[\s\S]*?});/);
  if (!matchRecipes) {
    console.error("Could not find recipeNameTranslations in recipesData.ts");
    return;
  }
  const translationsStr = matchRecipes[1];
  const translations = eval(`(${translationsStr})`);

  let recipeChanges = 0;
  // Make sure EVERY recipe in cookingRecipes is in translations
  for (const recipe of cookingRecipes) {
    const recipeId = recipe.id;
    // Puffed Potato Soufflé is named "Puffed Potato Soufflé" with accented e. Let's make sure it translates.
    const translation = getTranslation(recipe.name, recipeId);
    if (translation) {
      if (translations[recipe.name] !== translation) {
        console.log(`Recipe: "${recipe.name}" (${translations[recipe.name] || 'NEW'}) -> ${translation}`);
        translations[recipe.name] = translation;
        recipeChanges++;
      }
    } else {
      console.log(`WARNING: Could not translate recipe name "${recipe.name}" (ID: ${recipeId})`);
    }
  }
  console.log(`Updated/added ${recipeChanges} recipe translations.`);

  // Re-write recipesData.ts
  const newRecipesDataContent = recipesDataContent.replace(
    /const recipeNameTranslations: Record<string, string> = {[\s\S]*?};/,
    `const recipeNameTranslations: Record<string, string> = ${JSON.stringify(translations, null, 2)};`
  );
  fs.writeFileSync(recipesDataPath, newRecipesDataContent, 'utf8');
  console.log("Done!");
}

run().catch(console.error);
