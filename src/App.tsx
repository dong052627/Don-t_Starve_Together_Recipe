import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Search,
  BookOpen,
  Plus,
  Trash2,
  Heart,
  Soup,
  Eye,
  Clock,
  Compass,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  UserCheck
} from "lucide-react";
import {
  INGREDIENTS,
  RECIPES,
  cookCrockPot,
  getCookableRecipes,
  sumIngredients,
  Recipe,
  Ingredient,
  isRecipeRelated,
  getMissingRequirements,
} from "./recipesData";

export function getRecipeEmoji(id: string): string {
  const emojiMap: Record<string, string> = {
    mandrake_soup: "🍲",
    mandrakesoup: "🍲",
    waffles: "🧇",
    surf_n_turf: "🍱",
    surfnturf: "🍱",
    ice_cream: "🍧",
    icecream: "🍧",
    pierogi: "🥟",
    perogies: "🥟",
    dragonpie: "🥮",
    fishsticks: "🍤",
    flower_salad: "🥗",
    flowersalad: "🥗",
    trail_mix: "🍒",
    trailmix: "🍒",
    unagi: "🍣",
    guacamole: "🦎",
    bacon_and_eggs: "🍳",
    baconeggs: "🍳",
    butter_muffin: "🧁",
    butterflymuffin: "🧁",
    turkey_dinner: "🦃",
    turkeydinner: "🦃",
    melonsicle: "🍉",
    watermelonicle: "🍉",
    taffy: "🍬",
    meaty_stew: "🥣",
    bonestew: "🥣",
    meatballs: "🧆"
  };
  return emojiMap[id] || "🍛";
}

function RecipeImage({ recipeId, className = "w-8 h-8 object-contain" }: { recipeId: string; className?: string }) {
  const [error, setError] = useState(false);
  const basePath = (import.meta as any).env.BASE_URL || "/";
  const src = `${basePath}images/recipes/${recipeId}.png`;

  if (error) {
    return <span className="text-xl">{getRecipeEmoji(recipeId)}</span>;
  }

  return (
    <img
      src={src}
      onError={() => setError(true)}
      className={className}
      alt=""
    />
  );
}

function IngredientImage({ ingredientId, avatarText, className = "w-6 h-6 object-contain" }: { ingredientId: string; avatarText: string; className?: string }) {
  const [error, setError] = useState(false);
  const basePath = (import.meta as any).env.BASE_URL || "/";
  const src = `${basePath}images/ingredients/${ingredientId}.png`;

  if (error) {
    return <span className="shrink-0">{avatarText}</span>;
  }

  return (
    <img
      src={src}
      onError={() => setError(true)}
      className={className}
      alt=""
    />
  );
}

function StateIcon({ type, className = "w-5 h-5 object-contain" }: { type: "hp" | "hunger" | "sanity"; className?: string }) {
  const basePath = (import.meta as any).env.BASE_URL || "/";
  const filename = type === "hp" ? "HealthMeter.webp" : type === "hunger" ? "Hunger.webp" : "Sanity.webp";
  const src = `${basePath}images/state/${filename}`;
  return (
    <img
      src={src}
      className={className}
      alt={type}
    />
  );
}

export default function App() {
  // Global states
  const [activeTab, setActiveTab] = useState<"simulator" | "recipes">("recipes");

  // Expanded status for category drawers (Tab 1: recipes checklist, Tab 2: simulator panel)
  const [expandedCatRecipes, setExpandedCatRecipes] = useState<Record<string, boolean>>({});
  const [expandedCatSim, setExpandedCatSim] = useState<Record<string, boolean>>({});

  const toggleCatRecipes = (catKey: string) => {
    setExpandedCatRecipes(prev => {
      const isCurrentlyExpanded = !!prev[catKey];
      return {
        [catKey]: !isCurrentlyExpanded
      };
    });
  };

  const toggleCatSim = (catKey: string) => {
    setExpandedCatSim(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };
  
  // States for Ingredient Checker mode
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // States for Crock Pot Simulator mode
  const [potSlots, setPotSlots] = useState<string[]>(["", "", "", ""]);
  const [isCooking, setIsCooking] = useState(false);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [simulatedResult, setSimulatedResult] = useState<Recipe | null>(null);
  const [isPortable, setIsPortable] = useState(false);

  // States for the main Recipe Catalog filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"hp" | "hunger" | "sanity" | "priority">("hp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [onlyShowCookable, setOnlyShowCookable] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter recipes based on checklist, categories, search, and sort
  const filteredRecipes = useMemo(() => {
    // Determine the list of search-space recipes
    let sourceList: Recipe[] = RECIPES;

    if (onlyShowCookable) {
      const cookableSet = new Set(getCookableRecipes(checkedIngredients, isPortable).map(r => r.id));
      sourceList = sourceList.filter(recipe => {
        if (!isPortable && recipe.isPortable) return false;
        return cookableSet.has(recipe.id) || isRecipeRelated(recipe, checkedIngredients);
      });
    }

    // Apply category filter (meat-heavy, veg-heavy, high-sanity, summer-chill etc.)
    if (categoryFilter !== "all") {
      sourceList = sourceList.filter((recipe) => {
        if (categoryFilter === "healing") return recipe.hp >= 30;
        if (categoryFilter === "hunger") return recipe.hunger >= 75;
        if (categoryFilter === "sanity") return recipe.sanity >= 15;
        if (categoryFilter === "ruined") return recipe.hp < 0 || recipe.sanity < 0;
        return true;
      });
    }

    // Apply search query (title, English title, or description)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      sourceList = sourceList.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.englishName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.requirementsZH.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...sourceList].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === "hp") {
        valA = a.hp;
        valB = b.hp;
      } else if (sortBy === "hunger") {
        valA = a.hunger;
        valB = b.hunger;
      } else if (sortBy === "sanity") {
        valA = a.sanity;
        valB = b.sanity;
      } else if (sortBy === "priority") {
        valA = a.priority;
        valB = b.priority;
      }

      const diff = valA - valB;
      return sortDirection === "desc" ? -diff : diff;
    });
  }, [onlyShowCookable, checkedIngredients, searchQuery, sortBy, sortDirection, categoryFilter, isPortable]);

  const cookableRecipeIds = useMemo(() => {
    return new Set(getCookableRecipes(checkedIngredients, isPortable).map(r => r.id));
  }, [checkedIngredients, isPortable]);

  // Handle checking/unchecking ingredient
  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper to select all or clear all checked ingredients
  const selectAllIngredients = () => {
    setCheckedIngredients(INGREDIENTS.map((i) => i.id));
  };

  const clearAllIngredients = () => {
    setCheckedIngredients([]);
  };

  // Handle Simulator interactions
  const handleAddIngredientToPot = (id: string) => {
    // Find the first empty slot in the pot
    const emptyIndex = potSlots.indexOf("");
    if (emptyIndex !== -1) {
      const newSlots = [...potSlots];
      newSlots[emptyIndex] = id;
      setPotSlots(newSlots);
      setSimulatedResult(null); // Clear previous cooking result to invite "cooking" trigger
    }
  };

  const handleRemoveIngredientFromPot = (index: number) => {
    const newSlots = [...potSlots];
    newSlots[index] = "";
    setPotSlots(newSlots);
    setSimulatedResult(null); // Reset
  };

  const clearPot = () => {
    setPotSlots(["", "", "", ""]);
    setSimulatedResult(null);
  };

  const triggerCookProcess = () => {
    // Require 4 ingredients
    const filledCount = potSlots.filter((id) => id !== "").length;
    if (filledCount < 4) return;

    setIsCooking(true);
    setCookingProgress(0);
    setSimulatedResult(null);

    // Dynamic timer
    const interval = setInterval(() => {
      setCookingProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          const outcome = cookCrockPot(potSlots, isPortable);
          setSimulatedResult(outcome);
          setIsCooking(false);
          return 100;
        }
        return old + 20;
      });
    }, 120);
  };

  // Quick preset cooking loaders
  const loadPresetIntoPot = (presetIds: string[]) => {
    // Fill the slots with preset
    const newSlots = ["", "", "", ""];
    for (let i = 0; i < 4; i++) {
      if (presetIds[i]) {
        newSlots[i] = presetIds[i];
      }
    }
    setPotSlots(newSlots);
    setSimulatedResult(null);
  };

  // Calculate simulated values breakdown
  const currentPotValues = useMemo(() => {
    const activeIds = potSlots.filter((id) => id !== "");
    return sumIngredients(activeIds);
  }, [potSlots]);

  // Ingredients grouped by category
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, { title: string; color: string; list: Ingredient[] }> = {
      meat: { title: "🍖 肉食類 (Meats)", color: "border-red-900/30 text-rose-300 bg-red-950/20", list: [] },
      veg: { title: "🥕 蔬菜類 (Vegetables)", color: "border-green-900/30 text-emerald-300 bg-emerald-950/20", list: [] },
      fruit: { title: "🍇 水果類 (Fruits)", color: "border-pink-900/30 text-pink-300 bg-pink-950/20", list: [] },
      fish: { title: "🐟 魚類 (Fish)", color: "border-blue-900/30 text-blue-350 bg-blue-955/20", list: [] },
      egg: { title: "🥚 蛋類 (Eggs)", color: "border-yellow-950/30 text-yellow-105 bg-yellow-950/20", list: [] },
      sweetener: { title: "🍯 甜味劑 (Sweeteners)", color: "border-amber-900/30 text-amber-305 bg-amber-955/20", list: [] },
      miscellaneous: { title: "🥢 雜項 (Miscellaneous)", color: "border-stone-800 text-stone-300 bg-stone-900/20", list: [] },
    };

    INGREDIENTS.forEach((ing) => {
      if (ing.values.fish) {
        groups.fish.list.push(ing);
      } else if (ing.category === "meat") {
        groups.meat.list.push(ing);
      } else if (ing.category === "veg") {
        groups.veg.list.push(ing);
      } else if (ing.category === "fruit") {
        groups.fruit.list.push(ing);
      } else if (ing.category === "egg") {
        groups.egg.list.push(ing);
      } else if (ing.category === "sweetener") {
        groups.sweetener.list.push(ing);
      } else {
        groups.miscellaneous.list.push(ing);
      }
    });

    return Object.entries(groups).filter(([_, data]) => data.list.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-150 font-sans selection:bg-amber-800 selection:text-white" id="main-container">
      {/* Decorative top wooden border-style indicator */}
      <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900 w-full" />

      {/* Header Panel */}
      <header className="border-b border-stone-800 bg-stone-900 py-6" id="header-panel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-600/10 p-3 border border-amber-500/30 animate-dst-glow">
              <Soup className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400">Ver 1.0.3</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide mt-0.5">
                飢荒神級砂鍋食譜模擬器
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "recipes"
                  ? "bg-amber-600 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-900/20"
                  : "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750"
              }`}
              id="tab-recipes-btn"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>智能食譜檢索庫</span>
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-amber-600 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-900/20"
                  : "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750"
              }`}
              id="tab-simulator-btn"
            >
              <Flame className="h-4 w-4" />
              <span>烹飪真實模擬器</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6" id="main-content">
        <AnimatePresence mode="wait">
          {/* TAB 1: SMART RECIPES DETECTOR & FINDER */}
          {activeTab === "recipes" && (
            <motion.div
              key="recipes-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Ingredient Selection Drawer */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5" id="inventory-panel">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                    <div>
                      <h2 className="text-md font-serif font-bold text-amber-500 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-amber-500" />
                        手頭有的食材勾選
                      </h2>
                      <p className="text-xs text-stone-400">勾選後，下方食譜庫會自動找出能用這些食材烹飪的料理。</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={selectAllIngredients}
                      className="flex-1 py-1 px-2 text-xs bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 rounded transition cursor-pointer"
                    >
                      全選食材
                    </button>
                    <button
                      onClick={clearAllIngredients}
                      className="flex-1 py-1 px-2 text-xs bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 rounded transition cursor-pointer"
                    >
                      清空所選
                    </button>
                  </div>

                  {/* Compact Grid of Category Block Tiles */}
                  <div className="grid grid-cols-7 gap-1 mt-2.5 mb-4" id="category-tiles-grid">
                    {groupedIngredients.map(([catKey, categoryData]) => {
                      const isExpanded = !!expandedCatRecipes[catKey];
                      const selectedCount = categoryData.list.filter(i => checkedIngredients.includes(i.id)).length;
                      
                      // Extract emoji
                      const match = categoryData.title.match(/^(\S+)\s/);
                      const emoji = match ? match[1] : "🍽️";
                      
                      const catNamesShort: Record<string, string> = {
                        meat: "肉類",
                        veg: "蔬菜",
                        fruit: "水果",
                        fish: "魚類",
                        egg: "蛋類",
                        sweetener: "甜味",
                        miscellaneous: "雜項"
                      };
                      const shortName = catNamesShort[catKey] || "雜項";

                      return (
                        <button
                          key={catKey}
                          onClick={() => toggleCatRecipes(catKey)}
                          className={`flex flex-col items-center justify-between py-2 px-0.5 rounded-lg border text-center transition-all duration-150 cursor-pointer ${
                            isExpanded
                              ? "bg-amber-600 border-amber-500 text-stone-950 font-bold shadow-md shadow-amber-955/40 scale-[1.03]"
                              : "bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-750 hover:bg-stone-850"
                          }`}
                          id={`cat-tile-${catKey}`}
                        >
                          <span className="text-base sm:text-lg mb-0.5 select-none">{emoji}</span>
                          <span className={`text-[10px] leading-none tracking-tight font-bold truncate max-w-full ${isExpanded ? "text-stone-950" : "text-stone-200"}`}>
                            {shortName}
                          </span>
                          <span className={`text-[8px] font-mono mt-1 leading-none ${isExpanded ? "text-stone-900/95 font-bold" : "text-stone-500"}`}>
                            {selectedCount > 0 ? (
                              <strong className={isExpanded ? "text-stone-950 font-black" : "text-amber-500 font-bold"}>{selectedCount}</strong>
                            ) : (
                              "0"
                            )}/{categoryData.list.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdowns of the Expanded Categories right below */}
                  <div className="space-y-3" id="collapsible-checklists-group">
                    <AnimatePresence initial={false}>
                      {groupedIngredients.map(([catKey, categoryData]) => {
                        const isExpanded = !!expandedCatRecipes[catKey];
                        if (!isExpanded) return null;
                        
                        return (
                          <motion.div
                            key={`rec-cat-list-${catKey}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className={`border rounded-xl overflow-hidden shadow-inner ${categoryData.color}`}
                          >
                            <div className="px-3 py-2 flex items-center justify-between border-b border-stone-850/30 bg-stone-950/20">
                              <span className="text-xs font-bold text-amber-400 font-serif flex items-center gap-1">
                                <span>已展開：</span>
                                <span>{categoryData.title}</span>
                              </span>
                              <button
                                onClick={() => toggleCatRecipes(catKey)}
                                className="text-[10px] text-stone-400 hover:text-stone-200 cursor-pointer flex items-center gap-0.5"
                              >
                                收起 ▲
                              </button>
                            </div>

                            <div className="p-3 grid grid-cols-2 gap-1.5 bg-stone-950/30">
                              {categoryData.list.map((ing) => {
                                const isChecked = checkedIngredients.includes(ing.id);
                                return (
                                  <button
                                    key={ing.id}
                                    onClick={() => toggleIngredientCheck(ing.id)}
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition border cursor-pointer ${
                                      isChecked
                                        ? "bg-amber-600/25 text-white border-amber-500/60 font-medium"
                                        : "bg-stone-900/40 text-stone-400 border-stone-850 hover:border-stone-750"
                                    }`}
                                  >
                                    <IngredientImage ingredientId={ing.id} avatarText={ing.avatarText} className="w-5 h-5 object-contain shrink-0" />
                                    <div className="text-left truncate flex-1 min-w-0">
                                      <div className="truncate font-medium">{ing.name}</div>
                                      <div className="text-[9px] text-stone-500 truncate mt-[-2px]">
                                        {ing.values.meat ? `肉:${ing.values.meat} ` : ""}
                                        {ing.values.veg ? `菜:${ing.values.veg} ` : ""}
                                        {ing.values.fruit ? `果:${ing.values.fruit} ` : ""}
                                        {ing.values.monster ? `怪 ` : ""}
                                        {ing.values.egg ? `蛋:${ing.values.egg} ` : ""}
                                        {ing.values.sweetener ? `糖 ` : ""}
                                        {ing.values.dairy ? `奶 ` : ""}
                                        {ing.values.ice ? `冰 ` : ""}
                                        {ing.values.twigs ? `樹枝 ` : ""}
                                      </div>
                                    </div>
                                    <div className={`h-3.5 w-3.5 rounded flex items-center justify-center border shrink-0 ${isChecked ? "bg-amber-500 border-amber-500" : "border-stone-700"}`}>
                                      {isChecked && <div className="h-1.5 w-1.5 bg-stone-950 rounded-sm" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 bg-stone-905 flex items-center justify-between text-xs text-stone-400">
                    <span>已勾選食材庫：</span>
                    <span className="font-mono text-amber-500 font-bold">{checkedIngredients.length} / {INGREDIENTS.length} 種</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Recipe Catalog & Matching Results */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Search & Sorting Panel */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5" id="filter-controls">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-md font-serif font-bold text-stone-100 flex items-center gap-2">
                        <Layers className="h-4.5 w-4.5 text-amber-500" />
                        遊戲配方資料庫
                      </h2>
                      <p className="text-xs text-stone-400">目前庫存：共 {RECIPES.length} 款官方認證大鍋料理</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={onlyShowCookable}
                          onChange={(e) => setOnlyShowCookable(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                        <span className="ms-2 text-xs font-medium text-stone-300">
                          篩選手頭食材相關 ({getCookableRecipes(checkedIngredients, isPortable).length} 可做 / {RECIPES.filter(r => (!isPortable && r.isPortable) ? false : isRecipeRelated(r, checkedIngredients)).length} 相關)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Search bar */}
                    <div className="relative md:col-span-4">
                      <input
                        type="text"
                        placeholder="搜尋食譜(例：肉丸、海陸)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition"
                      />
                      <Search className="absolute left-3 top-2 text-stone-500 h-3.5 w-3.5" />
                    </div>

                    {/* Sorting criteria */}
                    <div className="flex items-center gap-2 md:col-span-5">
                      <span className="text-[11px] text-stone-400 shrink-0">排序基準:</span>
                      <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800 w-full">
                        <button
                          onClick={() => {
                            setSortBy("hp");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition text-center cursor-pointer ${
                            sortBy === "hp" ? "bg-rose-950/40 text-rose-300 font-bold" : "text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          生命值❤️
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("hunger");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition text-center cursor-pointer ${
                            sortBy === "hunger" ? "bg-amber-950/40 text-amber-300 font-bold" : "text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          飢餓值🍖
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("sanity");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition text-center cursor-pointer ${
                            sortBy === "sanity" ? "bg-sky-950/40 text-sky-300 font-bold" : "text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          精神值🌀
                        </button>
                      </div>
                    </div>

                    {/* Quick filter selection */}
                    <div className="md:col-span-3">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-600 transition"
                      >
                        <option value="all">🔍 全部效果分類</option>
                        <option value="healing">❤️ 神級回血 (HP&gt;=30)</option>
                        <option value="hunger">🍖 大力補腹 (飢餓&gt;=75)</option>
                        <option value="sanity">🌀 養腦提神 (理智&gt;=15)</option>
                        <option value="ruined">💀 副作用料理 (負值)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                    <div className="flex gap-2">
                      <span>當前篩選出：<strong className="text-amber-500 font-mono text-xs">{filteredRecipes.length}</strong> 項配方</span>
                      {searchQuery && <span>• 搜尋「{searchQuery}」</span>}
                      {onlyShowCookable && <span>• 僅限手頭食材</span>}
                      {categoryFilter !== "all" && <span>• 專屬功效</span>}
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                        setSortBy("hp");
                        setSortDirection("desc");
                        setOnlyShowCookable(false);
                      }}
                      className="text-stone-500 hover:text-amber-500 transition cursor-pointer"
                    >
                      重置所有篩選
                    </button>
                  </div>
                </div>

                {/* Recipe Cards Grid */}
                {filteredRecipes.length === 0 ? (
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-12 text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-stone-200 font-serif font-bold text-lg">沒有找到對應的食譜</h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                      在你勾選的手頭食材中，沒有搭配出符合該目標與搜尋關鍵字的菜餚。試試勾選更多的食材（如大肉、蔬菜或樹枝！）
                    </p>
                    <button
                      onClick={() => {
                        selectAllIngredients();
                        setSearchQuery("");
                        setOnlyShowCookable(false);
                      }}
                      className="mt-4 px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg transition cursor-pointer"
                    >
                      啟用並全選所有食材
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecipes.map((recipe) => {
                      // Check if user currently has the "idealCombo" ingredients selected
                      const missingForIdeal = recipe.idealCombo.filter(id => !checkedIngredients.includes(id));
                      const isIdealCookable = missingForIdeal.length === 0;
                      const isFullyCookable = cookableRecipeIds.has(recipe.id);
                      const missingReqs = getMissingRequirements(recipe, checkedIngredients);

                      return (
                        <div
                          key={recipe.id}
                          className="bg-stone-900 border border-stone-700 rounded-xl overflow-hidden hover:border-amber-500/60 transition-all duration-200 flex flex-col justify-between"
                        >
                          {/* Top part */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                                  <RecipeImage recipeId={recipe.id} className="w-6 h-6 object-contain shrink-0" />
                                  {recipe.name}
                                  {recipe.isPortable && (
                                    <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-bold bg-purple-950/80 text-purple-300 border border-purple-900/40 rounded leading-none shrink-0">
                                      Warly
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[10px] text-stone-400 font-mono uppercase">
                                  {recipe.englishName} • 優先級: {recipe.priority}
                                </p>
                              </div>

                              <div className="text-[10px] px-1.5 py-0.5 rounded bg-stone-950 font-mono text-stone-400 border border-stone-800 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5 text-amber-500" />
                                <span>煮:{recipe.cookTime}s • 爛:{recipe.perishDays}天</span>
                              </div>
                            </div>

                            <p className="text-xs text-stone-300 mt-2 line-clamp-2 leading-relaxed bg-stone-950/20 p-2 rounded border border-stone-850">
                              {recipe.description}
                            </p>

                            {/* Requirements & Formula */}
                            <div className="mt-3 space-y-1.5">
                              <div className="text-[11px] text-amber-400 font-medium">
                                🍳 砂鍋配方規則：
                                <span className="text-stone-300 block bg-stone-950 p-1.5 rounded text-[10px] font-mono leading-relaxed mt-0.5 border border-stone-800">
                                  {recipe.requirementsZH}
                                </span>
                              </div>

                              <div className="text-[10px]">
                                <span className="text-stone-400">💡 經典推薦搭配：</span>
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  {recipe.idealCombo.map((id, idx) => {
                                    const ing = INGREDIENTS.find(i => i.id === id);
                                    if (!ing) return null;
                                    const hasIt = checkedIngredients.includes(id);
                                    return (
                                      <span
                                        key={idx}
                                        className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 border font-mono ${
                                          hasIt
                                            ? "bg-amber-955 text-stone-200 border-amber-900/30"
                                            : "bg-stone-950 text-stone-500 line-through border-transparent"
                                        }`}
                                        title={ing.name}
                                      >
                                        <IngredientImage ingredientId={ing.id} avatarText={ing.avatarText} className="w-4 h-4 object-contain" />
                                        <span>{ing.name}</span>
                                      </span>
                                    );
                                  })}

                                  {isFullyCookable ? (
                                    <span className="text-[9px] text-emerald-500 ml-1 font-bold">✓ 可製作</span>
                                  ) : (
                                    <span className="text-[9px] text-amber-500 ml-1 font-bold">⚠️ 缺食材</span>
                                  )}
                                </div>
                              </div>
                              
                              {!isFullyCookable && missingReqs.length > 0 && (
                                <div className="mt-2 text-[10px] bg-amber-955/20 border border-amber-900/35 rounded-lg p-2 text-amber-300">
                                  <span className="font-bold block text-amber-400 mb-0.5">💡 還需滿足以下屬性或食材之一：</span>
                                  <ul className="list-disc list-inside space-y-0.5 font-mono">
                                    {missingReqs.map((req, idx) => (
                                      <li key={idx} className="leading-normal">{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stats bottom bar */}
                          <div className="bg-stone-950/50 border-t border-stone-800/80 px-4 py-2.5 grid grid-cols-3 gap-2">
                            <div className="flex items-center gap-1">
                              <StateIcon type="hp" className="w-5 h-5 object-contain shrink-0" />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">+血量</div>
                                <div className={`text-xs font-bold font-mono ${recipe.hp >= 30 ? "text-rose-400" : recipe.hp < 0 ? "text-red-500" : "text-stone-300"}`}>
                                  {recipe.hp > 0 ? `+${recipe.hp}` : recipe.hp}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <StateIcon type="hunger" className="w-5 h-5 object-contain shrink-0" />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">+飢餓值</div>
                                <div className={`text-xs font-bold font-mono ${recipe.hunger >= 75 ? "text-amber-400" : "text-stone-300"}`}>
                                  +{recipe.hunger}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <StateIcon type="sanity" className="w-5 h-5 object-contain shrink-0" />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">+san值</div>
                                <div className={`text-xs font-bold font-mono ${recipe.sanity >= 20 ? "text-sky-300" : recipe.sanity < 0 ? "text-purple-400" : "text-stone-300"}`}>
                                  {recipe.sanity > 0 ? `+${recipe.sanity}` : recipe.sanity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: CROCK POT COOKING SIMULATOR */}
          {activeTab === "simulator" && (
            <motion.div
              key="simulator-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Visual simulator pot and interactive slots */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]" id="cook-pot-box">
                  {/* Fire visual behind the pot */}
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-orange-650/20 to-transparent pointer-events-none" />

                  <h3 className="text-md font-serif font-bold text-amber-500 mb-6 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                    DST 大砂鍋 (Crock Pot Simulator)
                  </h3>

                  {/* Simulator Grid wrapper */}
                  <div className="w-full max-w-sm flex flex-col items-center gap-6 z-10">
                    
                    {/* The Visual Pot Container */}
                    <div className="relative flex flex-col items-center py-6">
                      
                      {/* Sizzling steam effects */}
                      {isCooking && (
                        <div className="absolute top-[-50px] flex items-center justify-center gap-3">
                          <span className="animate-sizzle-bubble-1 text-2xl filter blur-[1px]">💨</span>
                          <span className="animate-sizzle-bubble-2 text-xl filter blur-[2px]">💨</span>
                          <span className="animate-sizzle-bubble-3 text-2xl filter blur-[1px]">💨</span>
                        </div>
                      )}

                      {/* Cook Pot Graphic */}
                      <div className={`relative h-44 w-44 rounded-full bg-stone-800 border-8 border-stone-950 flex items-center justify-center shadow-xl shadow-stone-950/70 ${isCooking ? "animate-wiggle-pot ring-4 ring-orange-500/30" : "animate-dst-glow"}`}>
                        <div className="absolute inset-2 rounded-full border border-stone-700 bg-stone-900 flex flex-col items-center justify-center text-center p-3">
                          {!isCooking && simulatedResult ? (
                            <div className="flex flex-col items-center justify-center animate-fade-in">
                              <span className="text-4xl">
                                {simulatedResult.id === "wet_goop" ? "💀" : "🍲"}
                              </span>
                              <span className="text-xs font-serif font-bold text-amber-400 mt-1.5">{simulatedResult.name}</span>
                              <span className="text-[9px] text-stone-500 font-mono">烹飪成功!</span>
                            </div>
                          ) : isCooking ? (
                            <div className="flex flex-col items-center justify-center">
                              <Flame className="h-10 w-10 text-orange-500 animate-bounce" />
                              <span className="text-xs text-orange-400 font-mono mt-1 font-bold">COOKING {cookingProgress}%</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-stone-500">
                              <Soup className="h-10 w-10 mb-1 opacity-40 text-stone-400" />
                              <span className="text-[11px] font-medium">放入4種食材</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 4 Interactive Ingredient Slots */}
                    <div className="grid grid-cols-4 gap-3 w-full">
                      {potSlots.map((ingId, idx) => {
                        const ingredient = INGREDIENTS.find((i) => i.id === ingId);
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center"
                          >
                            <button
                              onClick={() => ingId && handleRemoveIngredientFromPot(idx)}
                              disabled={isCooking || !ingId}
                              className={`h-16 w-full rounded-xl border flex flex-col items-center justify-center relative cursor-pointer group transition ${
                                ingId
                                  ? `${ingredient?.color} shadow-md`
                                  : "bg-stone-950 border-stone-800 border-dashed text-stone-650 hover:border-stone-700"
                              }`}
                              title={ingId ? "點擊移除" : "空草位"}
                            >
                              {ingId && ingredient ? (
                                <div className="text-center">
                                   <IngredientImage ingredientId={ingredient.id} avatarText={ingredient.avatarText} className="w-6 h-6 object-contain mx-auto" />
                                  <span className="text-[10px] block mt-0.5 font-bold truncate max-w-[50px]">{ingredient.name}</span>
                                </div>
                              ) : (
                                <Plus className="h-4 w-4 text-stone-600 group-hover:text-amber-500 transition-all" />
                              )}

                              {/* Remove hover ribbon */}
                              {ingId && (
                                <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-950/80 border border-red-900/30 flex items-center justify-center text-[8px] text-red-400 opacity-0 group-hover:opacity-100 transition">
                                  ✕
                                </div>
                              )}
                            </button>
                            <span className="text-[10px] text-stone-500 font-mono mt-1">孔位 {idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Warly Portable Pot Toggle */}
                    <div className="flex items-center justify-between w-full bg-stone-950/60 p-2.5 rounded-xl border border-stone-850/85 mt-2">
                      <label className="text-[11px] text-stone-350 flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPortable}
                          onChange={(e) => {
                            setIsPortable(e.target.checked);
                            setSimulatedResult(null);
                          }}
                          disabled={isCooking}
                          className="rounded border-stone-800 text-amber-600 focus:ring-amber-500 bg-stone-900 h-3.5 w-3.5"
                        />
                        <span>使用 Warly 的可攜式烹飪鍋 (Portable Pot)</span>
                      </label>
                      <span className="text-[8px] px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-mono font-bold">Warly</span>
                    </div>

                    {/* Simulation Controller utilities */}
                    <div className="flex gap-2 w-full mt-2">
                      <button
                        onClick={clearPot}
                        disabled={isCooking}
                        className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        清空砂鍋
                      </button>

                      <button
                        onClick={triggerCookProcess}
                        disabled={isCooking || potSlots.some((id) => id === "")}
                        className={`flex-1 py-1 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          potSlots.some((id) => id === "")
                            ? "bg-stone-800 text-stone-600 border border-stone-850 cursor-not-allowed"
                            : "bg-amber-600 text-stone-950 hover:bg-amber-500 shadow-lg shadow-amber-900/20"
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5" />
                        開火烹飪！
                      </button>
                    </div>

                    {/* Food Values Summary breakdown inside active pot slots */}
                    <div className="bg-stone-950 rounded-xl p-3 border border-stone-850 w-full text-xs">
                      <h4 className="text-stone-400 font-mono mb-1.5 flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-amber-500/80" />
                        當前鍋內食材係數 (Coefficients)
                      </h4>
                      <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-stone-350 font-mono text-[10px]">
                        <div>🍖 肉類: <span className="text-amber-400 font-bold">{currentPotValues.meat || 0}</span></div>
                        <div>🥕 蔬菜: <span className="text-emerald-400 font-bold">{currentPotValues.veg || 0}</span></div>
                        <div>🍉 水果: <span className="text-pink-400 font-bold">{currentPotValues.fruit || 0}</span></div>
                        <div>🥚 蛋類: <span className="text-yellow-250 font-bold">{currentPotValues.egg || 0}</span></div>
                        <div>🍯 糖類: <span className="text-amber-500 font-bold">{currentPotValues.sweetener || 0}</span></div>
                        <div>🥛 奶類: <span className="text-sky-300 font-bold">{currentPotValues.dairy || 0}</span></div>
                        <div>🐟 魚類: <span className="text-blue-400 font-bold">{currentPotValues.fish || 0}</span></div>
                        <div>🪵 樹枝: <span className="text-stone-400 font-bold">{currentPotValues.twigs || 0}</span></div>
                        <div>❄️ 冰塊: <span className="text-cyan-350 font-bold">{currentPotValues.ice || 0}</span></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: Cooking outcome and manual selections drawer */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                
                {/* Result Block with animation details */}
                <AnimatePresence mode="wait">
                  {simulatedResult ? (
                    <motion.div
                      key="result-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-stone-900 border-2 border-amber-500/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-4 border-b border-stone-800 pb-3">
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                        <h4 className="text-md font-serif font-bold text-white">砂鍋烹飪報告 (Result Found!)</h4>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-stone-950 p-4 rounded-xl mb-4 border border-stone-850">
                        <div className="h-16 w-16 rounded-xl bg-amber-500/10 border border-amber-500/20 text-3xl flex items-center justify-center shrink-0">
                          <RecipeImage recipeId={simulatedResult.id} className="w-12 h-12 object-contain" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="text-lg font-serif font-bold text-amber-400">{simulatedResult.name}</h2>
                            {simulatedResult.isPortable && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded leading-none">
                                Warly 專屬
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                              優先級: {simulatedResult.priority}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">{simulatedResult.englishName}</p>
                          <p className="text-xs text-amber-100/90 leading-relaxed mt-1">{simulatedResult.description}</p>
                        </div>
                      </div>

                      {/* Display Restoration Values */}
                      <h4 className="text-xs text-stone-400 font-mono mb-2 uppercase tracking-wider">★ 料理食用恢復值：</h4>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon type="hp" className="w-6 h-6 object-contain mb-1" />
                          <div className="text-[10px] text-stone-400 leading-none">+血量</div>
                          <div className={`text-sm font-bold font-mono mt-1 ${simulatedResult.hp >= 30 ? "text-rose-400" : simulatedResult.hp < 0 ? "text-red-500" : "text-stone-200"}`}>
                            {simulatedResult.hp > 0 ? `+${simulatedResult.hp}` : simulatedResult.hp}
                          </div>
                        </div>

                        <div className="bg-amber-955/20 border border-amber-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon type="hunger" className="w-6 h-6 object-contain mb-1" />
                          <div className="text-[10px] text-stone-400 leading-none">+飢餓值</div>
                          <div className={`text-sm font-bold font-mono mt-1 ${simulatedResult.hunger >= 75 ? "text-amber-400" : "text-stone-200"}`}>
                            +{simulatedResult.hunger}
                          </div>
                        </div>

                        <div className="bg-sky-950/20 border border-sky-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon type="sanity" className="w-6 h-6 object-contain mb-1" />
                          <div className="text-[10px] text-stone-400 leading-none">+san值</div>
                          <div className={`text-sm font-bold font-mono mt-1 ${simulatedResult.sanity >= 20 ? "text-sky-300" : simulatedResult.sanity < 0 ? "text-purple-400" : "text-stone-200"}`}>
                            {simulatedResult.sanity > 0 ? `+${simulatedResult.sanity}` : simulatedResult.sanity}
                          </div>
                        </div>
                      </div>

                      {/* Additional Cooking Info */}
                      <div className="space-y-2 lg:space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-850 text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-stone-400">⏱️ 烘乾/烹飪時間</span>
                          <span className="font-mono text-stone-200 font-bold">{simulatedResult.cookTime} 秒</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-stone-855">
                          <span className="text-stone-400">🍂 食物腐爛天數</span>
                          <span className="font-mono text-stone-200 font-bold">{simulatedResult.perishDays} 天</span>
                        </div>
                        <div className="py-1.5 border-t border-stone-855">
                          <div className="text-stone-400 mb-1">📋 符合此配方的原理：</div>
                          <p className="text-[11px] text-amber-500 font-mono leading-relaxed bg-stone-900 p-2 rounded border border-stone-800">
                            {simulatedResult.requirementsZH}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-stone-900 border border-stone-850 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                      <HelpCircle className="h-8 w-8 text-stone-500 mb-2" />
                      <h4 className="text-stone-300 font-semibold text-sm">砂鍋尚未開爐</h4>
                      <p className="text-xs text-stone-400 max-w-xs mx-auto mt-1">
                        在下方食材庫中，點擊<strong>「 放入 」</strong>按鈕將食材放入4個砂鍋格中，然後點擊「開火烹飪！」模擬化學反應。
                      </p>

                      <div className="mt-4 pt-4 border-t border-stone-800 w-full">
                        <p className="text-[11px] text-stone-400">💡 經典食譜快速入口 preset：</p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                          <button
                            onClick={() => loadPresetIntoPot(["monstermeat", "berries", "berries", "berries"])}
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            肉丸 🧆
                          </button>
                          <button
                            onClick={() => loadPresetIntoPot(["monstermeat", "bird_egg", "carrot", "berries"])}
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            餃子 🥟
                          </button>
                          <button
                            onClick={() => loadPresetIntoPot(["meat", "meat", "smallmeat", "smallmeat"])}
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            肉湯 🥣
                          </button>
                          <button
                            onClick={() => loadPresetIntoPot(["dragonfruit", "twigs", "twigs", "twigs"])}
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            火龍果派 🥮
                          </button>
                          <button
                            onClick={() => loadPresetIntoPot(["goatmilk", "ice", "honey", "honey"])}
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            冰淇淋 🍧
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Ingredient selection list for the simulator */}
                <div className="bg-stone-900 border border-stone-805 rounded-xl p-5">
                  <h4 className="text-sm font-serif font-bold text-amber-500 mb-3 flex items-center gap-1.5 font-bold">
                    <Plus className="h-4.5 w-4.5 text-amber-500" />
                    選擇原材料放入砂鍋 (4個上限)
                  </h4>

                  <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                    {groupedIngredients.map(([catKey, categoryData]) => {
                      const isExpanded = !!expandedCatSim[catKey];
                      const activeCountOfCat = categoryData.list.reduce((acc, ing) => acc + potSlots.filter(id => id === ing.id).length, 0);

                      return (
                        <div key={catKey} className={`border rounded-xl overflow-hidden transition-all duration-200 border-stone-800 bg-stone-950/20`}>
                          {/* Category Button Header */}
                          <button
                            onClick={() => toggleCatSim(catKey)}
                            className="w-full flex items-center justify-between p-3 hover:bg-stone-800/40 transition text-left cursor-pointer font-bold"
                          >
                            <h5 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 text-stone-200">
                              <span>{categoryData.title}</span>
                              {activeCountOfCat > 0 && (
                                <span className="bg-amber-600/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-900/30">
                                  已放 {activeCountOfCat} 個
                                </span>
                              )}
                            </h5>
                            <ChevronRight className={`h-4 w-4 transition-transform duration-200 text-stone-500 ${isExpanded ? "rotate-90 text-amber-500" : ""}`} />
                          </button>

                          {/* Collapsible Panel */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="border-t border-stone-850"
                              >
                                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-stone-950/30">
                                  {categoryData.list.map((ing) => {
                                    const activeCountInPot = potSlots.filter(id => id === ing.id).length;
                                    const isPotFull = potSlots.indexOf("") === -1;
                                    return (
                                      <button
                                        key={ing.id}
                                        disabled={isCooking || isPotFull}
                                        onClick={() => handleAddIngredientToPot(ing.id)}
                                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs border transition cursor-pointer ${
                                          isPotFull
                                            ? "bg-stone-955 text-stone-600 border-transparent cursor-not-allowed"
                                            : "bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-900/40 hover:bg-stone-800"
                                        }`}
                                      >
                                        <span className="flex items-center gap-1 text-left truncate flex-1 min-w-0">
                                           <IngredientImage ingredientId={ing.id} avatarText={ing.avatarText} className="w-5 h-5 object-contain shrink-0" />
                                          <span className="truncate">{ing.name}</span>
                                        </span>
                                        
                                        <span className="flex items-center gap-1 shrink-0 ml-1">
                                          {activeCountInPot > 0 && (
                                            <span className="bg-amber-600 text-stone-950 text-[9px] px-1 font-bold rounded">
                                              x{activeCountInPot}
                                            </span>
                                          )}
                                          <span className="text-[9px] text-amber-500 font-bold shrink-0">＋</span>
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
