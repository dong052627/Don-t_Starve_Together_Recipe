export interface Ingredient {
  id: string;
  name: string;
  englishName: string;
  category: string; // "meat" | "veg" | "fruit" | "egg" | "sweetener" | "dairy" | "filler" | "special"
  values: {
    meat?: number;
    monster?: number;
    veg?: number;
    fruit?: number;
    egg?: number;
    sweetener?: number;
    dairy?: number;
    fish?: number;
    twigs?: number;
    ice?: number;
    drumstick?: number;
    butterfly?: number;
    mandrake?: number;
    birchnut?: number;
    watermelon?: number;
    dragonfruit?: number;
    flower?: number;
    mole?: number;
    lichen?: number;
    eel?: number;
  };
  color: string; // for UI tag illustration
  avatarText: string; // short Emoji or text
}

export interface Recipe {
  id: string;
  name: string;
  englishName: string;
  hp: number;
  hunger: number;
  sanity: number;
  cookTime: number; // in seconds
  perishDays: number; // rot time
  priority: number;
  requirementsZH: string;
  requirementsEN: string;
  canCookWith: (totals: Record<string, number>, ingredients: Ingredient[]) => boolean;
  idealCombo: string[]; // exemplary recipe combo IDs e.g. ["monster_meat", "berries", "berries", "berries"]
  description: string;
  isPortable?: boolean;
}
