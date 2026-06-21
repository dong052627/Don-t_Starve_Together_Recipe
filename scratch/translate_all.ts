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

    // Try by English name
    const cleanEng = englishName.toLowerCase().trim();
    if (engMap[cleanEng]) {
      return engMap[cleanEng];
    }

    return null;
  }

  // 1. Translate Ingredients in src/data/ingredients.ts
  const ingredientsPath = 'src/data/ingredients.ts';
  let ingredientsContent = fs.readFileSync(ingredientsPath, 'utf8');

  // We can parse the file or use a regex to replace the names.
  // Since we want to update the file while keeping its structure, let's parse the array of ingredients,
  // translate each name, and reconstruct it.
  // Wait, let's load INGREDIENTS dynamically by evaluating it, or parsing it.
  // Let's write a small script that reads it, matches the objects, and replaces the names.
  // A safer way is to read the file, locate each ingredient entry by regex:
  // "id": "...", \n\s*"name": "...", \n\s*"englishName": "..."
  // Let's extract the array elements.
  // Or since it's just a JSON array defined in code, we can parse it as JSON if we extract the array text!
  // Let's find the INGREDIENTS array content:
  const matchArray = ingredientsContent.match(/export const INGREDIENTS: Ingredient\[\] = (\[[\s\S]*?\]);/);
  if (!matchArray) {
    console.error("Could not find INGREDIENTS array in ingredients.ts");
    return;
  }
  const arrayStr = matchArray[1];
  // Parse it (it is valid JSON because we wrote it cleanly)
  // Let's try JSON.parse after replacing any single quotes or tailing commas if any (but it's written as JSON style)
  // Let's use eval to be safe with TypeScript file formats
  const INGREDIENTS = eval(arrayStr);
  console.log(`Loaded ${INGREDIENTS.length} ingredients.`);

  let ingChanges = 0;
  for (const ing of INGREDIENTS) {
    const translation = getTranslation(ing.englishName, ing.id);
    if (translation && translation !== ing.name) {
      console.log(`Ingredient translation: ${ing.id} (${ing.name}) -> ${translation}`);
      ing.name = translation;
      ingChanges++;
    }
  }
  console.log(`Updated ${ingChanges} ingredients.`);

  // Write back ingredients.ts
  const newIngredientsContent = ingredientsContent.replace(
    /export const INGREDIENTS: Ingredient\[\] = \[[\s\S]*?\];/,
    `export const INGREDIENTS: Ingredient[] = ${JSON.stringify(INGREDIENTS, null, 2)};`
  );
  fs.writeFileSync(ingredientsPath, newIngredientsContent, 'utf8');
  console.log(`Wrote updated ingredients to ${ingredientsPath}`);


  // 2. Translate recipeNameTranslations in src/recipesData.ts
  const recipesDataPath = 'src/recipesData.ts';
  let recipesDataContent = fs.readFileSync(recipesDataPath, 'utf8');

  // Let's find the recipeNameTranslations block:
  const matchRecipes = recipesDataContent.match(/const recipeNameTranslations: Record<string, string> = ({[\s\S]*?});/);
  if (!matchRecipes) {
    console.error("Could not find recipeNameTranslations in recipesData.ts");
    return;
  }
  const translationsStr = matchRecipes[1];
  const translations = eval(`(${translationsStr})`);

  let recipeChanges = 0;
  for (const key of Object.keys(translations)) {
    // Try to find the recipe ID matching the key
    // E.g. "Bacon and Eggs" -> "baconeggs"
    const recipeId = key.toLowerCase().replace(/['\s-]/g, '');
    const translation = getTranslation(key, recipeId);
    if (translation && translation !== translations[key]) {
      console.log(`Recipe translation: ${key} (${translations[key]}) -> ${translation}`);
      translations[key] = translation;
      recipeChanges++;
    }
  }
  console.log(`Updated ${recipeChanges} recipes.`);

  // Write back recipesData.ts
  const newRecipesDataContent = recipesDataContent.replace(
    /const recipeNameTranslations: Record<string, string> = {[\s\S]*?};/,
    `const recipeNameTranslations: Record<string, string> = ${JSON.stringify(translations, null, 2)};`
  );
  fs.writeFileSync(recipesDataPath, newRecipesDataContent, 'utf8');
  console.log(`Wrote updated recipe translations to ${recipesDataPath}`);
}

run().catch(console.error);
