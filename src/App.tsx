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
  UserCheck,
  Cpu,
  Zap,
  Lock,
  Unlock,
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
import { CHARACTERS, Character, Circuit } from "./data/characters";
import { WX78_SKILL_TREE } from "./data/skilltree";

const SPECIAL_INGREDIENTS = [
  { id: "mandrake", names: ["曼德拉草", "mandrake"] },
  { id: "royal_jelly", names: ["蜂王漿", "royal jelly"] },
  { id: "butter", names: ["黃油", "butter"] },
  { id: "wobster_sheller_land", names: ["龍蝦", "wobster"] },
  { id: "lightninggoathorn", names: ["伏特羊角", "volt goat horn"] },
  { id: "dragonfruit", names: ["火龍果", "dragon fruit"] },
  { id: "cactus_flower", names: ["仙人掌花", "cactus flower"] },
  { id: "trunk_summer", names: ["象鼻", "koalefant trunk"] },
  { id: "trunk_winter", names: ["冬象鼻", "winter koalefant trunk"] },
  { id: "plantmeat", names: ["葉肉", "leafy meat"] },
  { id: "forgetmelots", names: ["必忘我", "forget-me-lots"] },
  { id: "wormlight", names: ["發光漿果", "glow berry"] },
  { id: "refined_dust", names: ["塵埃", "collected dust"] },
  { id: "nightmarefuel", names: ["噩夢燃料", "nightmare fuel"] },
  { id: "boneshard", names: ["骨頭碎片", "bone shards"] },
  { id: "batnose", names: ["裸露鼻孔", "batnose"] },
  { id: "tallbirdegg", names: ["高腳鳥蛋", "tallbird egg"] },
];

function isStronglyBoundTo(recipe: Recipe, ingredientId: string): boolean {
  const reqLower = (recipe.requirementsEN || "").toLowerCase();
  const idToTerms: Record<string, string[]> = {
    mandrake: ["mandrake"],
    royal_jelly: ["royal jelly"],
    butter: ["butter"],
    wobster_sheller_land: ["wobster"],
    lightninggoathorn: ["volt goat horn", "goat horn"],
    dragonfruit: ["dragon fruit"],
    cactus_flower: ["cactus flower"],
    trunk_summer: ["koalefant trunk", "trunk"],
    trunk_winter: ["koalefant trunk", "trunk"],
    plantmeat: ["leafy meat"],
    forgetmelots: ["forget-me-lots"],
    wormlight: ["glow berry", "lesser glow berry"],
    refined_dust: ["collected dust"],
    nightmarefuel: ["nightmare fuel"],
    boneshard: ["bone shards", "bone shard"],
    batnose: ["batnose"],
    tallbirdegg: ["tallbird egg"],
  };

  const terms = idToTerms[ingredientId];
  if (!terms) return false;
  return terms.some((term) => reqLower.includes(term));
}

export function getRecipeEmoji(id: string): string {
  const emojiMap: Record<string, string> = {
    mandrakesoup: "🍲",
    waffles: "🧇",
    surfnturf: "🍱",
    icecream: "🍧",
    perogies: "🥟",
    dragonpie: "🥮",
    fishsticks: "🍤",
    flowersalad: "🥗",
    trailmix: "🍒",
    unagi: "🍣",
    guacamole: "🦎",
    baconeggs: "🍳",
    butterflymuffin: "🧁",
    turkeydinner: "🦃",
    watermelonicle: "🍉",
    taffy: "🍬",
    bonestew: "🥣",
    meatballs: "🧆",
  };
  return emojiMap[id] || "🍛";
}

function RecipeImage({
  recipeId,
  className = "w-8 h-8 object-contain",
}: {
  recipeId: string;
  className?: string;
}) {
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

function IngredientImage({
  ingredientId,
  avatarText,
  className = "w-6 h-6 object-contain",
}: {
  ingredientId: string;
  avatarText: string;
  className?: string;
}) {
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

function StateIcon({
  type,
  className = "w-5 h-5 object-contain",
}: {
  type: "hp" | "hunger" | "sanity";
  className?: string;
}) {
  const basePath = (import.meta as any).env.BASE_URL || "/";
  const filename =
    type === "hp"
      ? "HealthMeter.webp"
      : type === "hunger"
        ? "Hunger.webp"
        : "Sanity.webp";
  const src = `${basePath}images/state/${filename}`;
  return <img src={src} className={className} alt={type} />;
}

function CircuitImage({
  circuitId,
  className = "w-8 h-8 object-contain",
}: {
  circuitId: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const basePath = (import.meta as any).env.BASE_URL || "/";
  const src = `${basePath}images/circuits/${circuitId}.png`;

  if (error) {
    return <span className="text-stone-400 font-mono text-[10px]">⚙️</span>;
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


export default function App() {
  // Global states
  const [activeTab, setActiveTab] = useState<
    "recipes" | "simulator" | "characters"
  >("recipes");

  // Character Encyclopedia States
  const [activeCharacterId, setActiveCharacterId] = useState<string>("wx78");
  const [wxCircuits, setWxCircuits] = useState<string[]>([]);
  const [showCircuitSuggestions, setShowCircuitSuggestions] = useState<boolean>(false);
  const [expandedCircuitIds, setExpandedCircuitIds] = useState<
    Record<string, boolean>
  >({});
  const [wxSkills, setWxSkills] = useState<string[]>([
    "wx78_circuitry_alphabuffs_1",
    "wx78_circuitry_alphabuffs_2",
    "wx78_circuitry_betabuffs_1",
    "wx78_circuitry_betabuffs_2",
    "wx78_circuitry_slot_1",
    "wx78_extrabody_1",
    "wx78_ghostrevive_1",
    "wx78_extrabody_2",
    "wx78_extrabody_3",
    "wx78_remotebodyswap",
    "wx78_scoutdrone_1",
    "wx78_deliverydrone_1",
    "wx78_deliverydrone_2",
    "wx78_extradronerange",
    "wx78_allegiance_shadow",
  ]);
  const [celestialDefeated, setCelestialDefeated] = useState<boolean>(false);
  const [shadowDefeated, setShadowDefeated] = useState<boolean>(true);

  const currentCharacter = useMemo(() => {
    return CHARACTERS.find((c) => c.id === activeCharacterId) || CHARACTERS[0];
  }, [activeCharacterId]);

  const getNodePosPct = (pos: [number, number]): { x: number; y: number } => {
    // scale_x = 1.18, offset_x = 288
    // scale_y = 1.25, offset_y = 350
    // Percentages of container width=594, height=374:
    const x = ((288 + pos[0] * 1.18) / 594) * 100;
    const y = ((350 - pos[1] * 1.25) / 374) * 100;
    return { x, y };
  };





  // Helper function to recursively validate skill dependencies
  const getValidSkills = (
    active: string[],
    celDefeated: boolean,
    shaDefeated: boolean
  ): string[] => {
    let current = [...active];
    let changed = true;
    while (changed) {
      changed = false;
      const next: string[] = [];
      for (const skillId of current) {
        let valid = false;

        // Check root status and parent requirements
        if (skillId === "wx78_circuitry_betterunplug") valid = true;
        else if (skillId === "wx78_circuitry_bettercharge") valid = true;
        else if (skillId === "wx78_circuitry_alphabuffs_1") valid = true;
        else if (skillId === "wx78_circuitry_alphabuffs_2") valid = current.includes("wx78_circuitry_alphabuffs_1");
        else if (skillId === "wx78_circuitry_betabuffs_1") valid = true;
        else if (skillId === "wx78_circuitry_betabuffs_2") valid = current.includes("wx78_circuitry_betabuffs_1");
        else if (skillId === "wx78_circuitry_gammabuffs_1") valid = true;
        else if (skillId === "wx78_circuitry_gammabuffs_2") valid = current.includes("wx78_circuitry_gammabuffs_1");
        else if (skillId === "wx78_circuitry_slot_1") {
          valid = current.includes("wx78_circuitry_alphabuffs_2") ||
            current.includes("wx78_circuitry_betabuffs_2") ||
            current.includes("wx78_circuitry_gammabuffs_2");
        }
        else if (skillId === "wx78_extrabody_1") valid = true;
        else if (skillId === "wx78_ghostrevive_1") valid = current.includes("wx78_extrabody_1");
        else if (skillId === "wx78_ghostrevive_2") valid = current.includes("wx78_ghostrevive_1");
        else if (skillId === "wx78_ghostrevive_3") valid = current.includes("wx78_ghostrevive_2");
        else if (skillId === "wx78_extrabody_2") valid = current.includes("wx78_ghostrevive_1");
        else if (skillId === "wx78_extrabody_3") valid = current.includes("wx78_extrabody_2");
        else if (skillId === "wx78_remotebodyswap") valid = current.includes("wx78_extrabody_3");
        else if (skillId === "wx78_bodycircuits") valid = current.includes("wx78_ghostrevive_1");
        else if (skillId === "wx78_scoutdrone_1") valid = true;
        else if (skillId === "wx78_extradronerange") valid = true;
        else if (skillId === "wx78_deliverydrone_1") valid = true;
        else if (skillId === "wx78_deliverydrone_2") valid = current.includes("wx78_deliverydrone_1");
        else if (skillId === "wx78_zapdrone_1") valid = true;
        else if (skillId === "wx78_zapdrone_2") valid = current.includes("wx78_zapdrone_1");
        else if (skillId === "wx78_allegiance_lunar") {
          const maxbodies = current.includes("wx78_extrabody_1");
          const noShadow = !current.includes("wx78_allegiance_shadow");
          valid = maxbodies && noShadow && celDefeated;
        }
        else if (skillId === "wx78_allegiance_shadow") {
          const maxbodies = current.includes("wx78_extrabody_1");
          const noLunar = !current.includes("wx78_allegiance_lunar");
          valid = maxbodies && noLunar && shaDefeated;
        }

        if (valid) {
          next.push(skillId);
        } else {
          changed = true;
        }
      }
      current = next;
    }
    return current;
  };

  const canUnlockSkill = (
    skillId: string,
    activeList: string[],
    celDefeated: boolean,
    shaDefeated: boolean
  ): boolean => {
    const node = (WX78_SKILL_TREE as any)[skillId];
    if (!node || node.isLock) return false;
    if (activeList.includes(skillId)) return false;
    if (activeList.length >= 15) return false;

    // Check locks
    if (skillId === "wx78_allegiance_lunar") {
      const lockSatisfied =
        activeList.includes("wx78_extrabody_1") &&
        !activeList.includes("wx78_allegiance_shadow") &&
        celDefeated;
      return lockSatisfied;
    }
    if (skillId === "wx78_allegiance_shadow") {
      const lockSatisfied =
        activeList.includes("wx78_extrabody_1") &&
        !activeList.includes("wx78_allegiance_lunar") &&
        shaDefeated;
      return lockSatisfied;
    }

    // Check parent
    if (node.root) return true;

    // Otherwise, find if any active node connects to this node
    const hasActiveParent = Object.values(WX78_SKILL_TREE).some(parent =>
      parent.connects.includes(skillId) && activeList.includes(parent.id)
    );

    return hasActiveParent;
  };

  const maxSlots = wxSkills.includes("wx78_circuitry_slot_1") ? 7 : 6;

  // Sync effect: automatically uninstall circuits exceeding 6 slots if slot expansion is deactivated
  useEffect(() => {
    if (!wxSkills.includes("wx78_circuitry_slot_1")) {
      let newCircuits = [...wxCircuits];
      const checkAndTrim = (type: "alpha" | "beta" | "gamma") => {
        let slotsUsed = 0;
        const indexesToKeep: number[] = [];
        newCircuits.forEach((cId, idx) => {
          const circ = currentCharacter.circuits?.find((c) => c.id === cId);
          if (circ && circ.type === type) {
            if (slotsUsed + circ.slots <= 6) {
              slotsUsed += circ.slots;
              indexesToKeep.push(idx);
            }
          } else {
            indexesToKeep.push(idx);
          }
        });
        newCircuits = newCircuits.filter((_, idx) => indexesToKeep.includes(idx));
      };

      checkAndTrim("alpha");
      checkAndTrim("beta");
      checkAndTrim("gamma");

      if (newCircuits.length !== wxCircuits.length) {
        setWxCircuits(newCircuits);
      }
    }
  }, [wxSkills, wxCircuits, currentCharacter]);

  const toggleCircuitExpand = (id: string) => {
    setExpandedCircuitIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalSlotsUsed = useMemo(() => {
    const result = { alpha: 0, beta: 0, gamma: 0 };
    if (currentCharacter.id !== "wx78") return result;

    wxCircuits.forEach((cId) => {
      const circ = currentCharacter.circuits?.find((c) => c.id === cId);
      if (circ) {
        const type = circ.type as "alpha" | "beta" | "gamma";
        result[type] += circ.slots;
      }
    });
    return result;
  }, [wxCircuits, currentCharacter]);

  const slotsAllocation = useMemo(() => {
    const getCategoryAllocation = (type: "alpha" | "beta" | "gamma") => {
      const representation: {
        circuitId: string;
        name: string;
        color: string;
        slots: number;
        originalIndex: number;
      }[] = [];

      wxCircuits.forEach((cId, originalIndex) => {
        const circ = currentCharacter.circuits?.find((c) => c.id === cId);
        if (!circ || circ.type !== type) return;

        let color = "";
        if (type === "alpha")
          color = "bg-rose-950/60 border-rose-500/60 text-rose-300";
        if (type === "beta")
          color = "bg-amber-950/60 border-amber-500/60 text-amber-300";
        if (type === "gamma")
          color = "bg-emerald-950/60 border-emerald-500/60 text-emerald-300";

        representation.push({
          circuitId: circ.id,
          name: circ.name,
          color,
          slots: circ.slots,
          originalIndex,
        });
      });

      const result: (
        | {
          empty: true;
          circuitId?: undefined;
          name?: undefined;
          color?: undefined;
          slots?: undefined;
          originalIndex?: undefined;
        }
        | {
          empty: false;
          circuitId: string;
          name: string;
          color: string;
          slots: number;
          originalIndex: number;
        }
      )[] = representation.map((r) => ({ empty: false, ...r }));

      const totalOccupied = representation.reduce((sum, r) => sum + r.slots, 0);
      const remaining = maxSlots - totalOccupied;
      for (let i = 0; i < remaining; i++) {
        result.push({ empty: true });
      }
      return result;
    };

    return {
      alpha: getCategoryAllocation("alpha"),
      beta: getCategoryAllocation("beta"),
      gamma: getCategoryAllocation("gamma"),
    };
  }, [wxCircuits, currentCharacter, maxSlots]);

  const calculatedStats = useMemo(() => {
    let health = currentCharacter.health;
    let hunger = currentCharacter.hunger;
    let sanity = currentCharacter.sanity;
    let speedBonus = 0;
    let light = false;
    let thermal = false;
    let refrigerant = false;

    // Custom special perks calculations
    let sanityRegen = 0;
    let healthRegen = 0;
    let hungerRateText = "";
    let physicalReduction = "";
    let pocketCount = 0;
    let chessBonus = 0;
    let hasElectric = false;
    let hasDigest = false;
    let hasBlock = false;
    let hasSonic = false;
    let hasSpin = false;

    // Talent tree specific stats
    let backupChassisLimit = 0;
    let hasWarmStandby = false;
    let hasRemoteTransfer = false;
    let hasScoutDrone = false;
    let hasDeliveryDrone = false;
    let hasZapDrone = false;
    let hasSignalBooster = false;
    let hasLunarVessel = false;
    let hasShadowServitor = false;

    if (currentCharacter.id === "wx78") {
      let speedCount = 0;
      let hardyCount = 0;

      // Extract talent tree flags
      if (wxSkills.includes("wx78_extrabody_3")) backupChassisLimit = 3;
      else if (wxSkills.includes("wx78_extrabody_2")) backupChassisLimit = 2;
      else if (wxSkills.includes("wx78_extrabody_1")) backupChassisLimit = 1;

      hasWarmStandby = wxSkills.includes("wx78_bodycircuits");
      hasRemoteTransfer = wxSkills.includes("wx78_remotebodyswap");
      hasScoutDrone = wxSkills.includes("wx78_scoutdrone_1");
      hasDeliveryDrone = wxSkills.includes("wx78_deliverydrone_1");
      hasZapDrone = wxSkills.includes("wx78_zapdrone_1");
      hasSignalBooster = wxSkills.includes("wx78_extradronerange");
      hasLunarVessel = wxSkills.includes("wx78_allegiance_lunar");
      hasShadowServitor = wxSkills.includes("wx78_allegiance_shadow");

      // Calculate hunger reduction percentage
      let hungerReduction = 0;
      wxCircuits.forEach((cId) => {
        if (cId === "alpha_hunger_1") {
          let r = 5;
          if (wxSkills.includes("wx78_circuitry_alphabuffs_1")) r = 10;
          hungerReduction += r;
        }
        if (cId === "alpha_hunger_2") {
          let r = 20;
          if (wxSkills.includes("wx78_circuitry_alphabuffs_2")) r = 30;
          else if (wxSkills.includes("wx78_circuitry_alphabuffs_1")) r = 25;
          hungerReduction += r;
        }
      });
      if (hungerReduction > 0) {
        hungerRateText = `飢餓率降低 ${hungerReduction}%`;
      }

      wxCircuits.forEach((cId) => {
        const circ = currentCharacter.circuits?.find((c) => c.id === cId);
        if (!circ) return;

        // 1. Basic Stats
        if (circ.statBonus) {
          if (circ.statBonus.health) health += circ.statBonus.health;
          if (circ.statBonus.hunger) hunger += circ.statBonus.hunger;
          if (circ.statBonus.sanity) sanity += circ.statBonus.sanity;
        }

        // 2. Extra effects
        if (cId === "alpha_health_1" || cId === "alpha_health_2") {
          hardyCount++;
        }
        if (cId === "alpha_sanity_2") {
          sanityRegen += 2;
        }
        if (cId === "alpha_combo_1") {
          sanityRegen += 2;
          healthRegen += 10;
        }
        if (cId === "beta_speed_1") {
          speedBonus += 25;
        }
        if (cId === "beta_speed_2") {
          speedCount++;
          if (speedCount === 1) speedBonus += 25;
          else if (speedCount === 2) speedBonus += 15;
          else if (speedCount === 3) speedBonus += 10;
        }
        if (cId === "beta_light_1" || cId === "beta_light_2") {
          light = true;
        }
        if (cId === "beta_thermal") {
          thermal = true;
        }
        if (cId === "beta_refrigerant") {
          refrigerant = true;
        }
        if (cId === "beta_electric") {
          hasElectric = true;
        }
        if (cId === "beta_pocket") {
          pocketCount += 1;
        }
        if (cId === "gamma_digest") {
          hasDigest = true;
        }
        if (cId === "gamma_chess") {
          chessBonus += 1;
        }
        if (cId === "gamma_block") {
          hasBlock = true;
        }
        if (cId === "gamma_sonic") {
          hasSonic = true;
        }
        if (cId === "gamma_spin") {
          hasSpin = true;
        }
      });

      // Calculate armor percent from hardy circuits if Alpha Tinkering II is active
      let armorPercent = 0;
      if (wxSkills.includes("wx78_circuitry_alphabuffs_2")) {
        const health1Count = wxCircuits.filter(c => c === "alpha_health_1").length;
        const health2Count = wxCircuits.filter(c => c === "alpha_health_2").length;
        armorPercent = health1Count * 2.5 + health2Count * 5;
      }

      if (armorPercent > 0) {
        physicalReduction = `外殼防禦 +${armorPercent}% (物理減免)`;
      } else if (hardyCount > 0) {
        physicalReduction =
          hardyCount >= 2 ? "較多物理傷害減免" : "少量物理傷害減免";
      }
    }

    return {
      health,
      hunger,
      sanity,
      speedBonus,
      light,
      thermal,
      refrigerant,
      sanityRegen,
      healthRegen,
      hungerRateText,
      physicalReduction,
      hasElectric,
      pocketCount,
      hasDigest,
      chessBonus,
      hasBlock,
      hasSonic,
      hasSpin,
      backupChassisLimit,
      hasWarmStandby,
      hasRemoteTransfer,
      hasScoutDrone,
      hasDeliveryDrone,
      hasZapDrone,
      hasSignalBooster,
      hasLunarVessel,
      hasShadowServitor,
    };
  }, [wxCircuits, currentCharacter, wxSkills]);

  const handleInstallCircuit = (circuit: Circuit) => {
    const currentCount = wxCircuits.filter((id) => id === circuit.id).length;
    if (currentCount >= circuit.maxCount) return;

    // Check total slots used for this specific type
    const slotsOfThisType = wxCircuits.reduce((acc, cId) => {
      const circ = currentCharacter.circuits?.find((c) => c.id === cId);
      if (circ && circ.type === circuit.type) {
        return acc + circ.slots;
      }
      return acc;
    }, 0);

    if (slotsOfThisType + circuit.slots > maxSlots) return;
    setWxCircuits([...wxCircuits, circuit.id]);
  };

  const handleUninstallCircuit = (index: number) => {
    setWxCircuits((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFavoriteFoodClick = () => {
    setActiveTab("recipes");
    setSearchQuery("蝴蝶松餅");
    setOnlyShowCookable(false);
  };

  // Expanded status for category drawers (Tab 1: recipes checklist, Tab 2: simulator panel)
  const [expandedCatRecipes, setExpandedCatRecipes] = useState<
    Record<string, boolean>
  >({});
  const [expandedCatSim, setExpandedCatSim] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCatRecipes = (catKey: string) => {
    setExpandedCatRecipes((prev) => {
      const isCurrentlyExpanded = !!prev[catKey];
      return {
        [catKey]: !isCurrentlyExpanded,
      };
    });
  };

  const toggleCatSim = (catKey: string) => {
    setExpandedCatSim((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
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
  const [sortBy, setSortBy] = useState<"hp" | "hunger" | "sanity" | "priority">(
    "hp",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [onlyShowCookable, setOnlyShowCookable] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Auto-enable "onlyShowCookable" when user starts selecting ingredients, disable when empty
  useEffect(() => {
    if (checkedIngredients.length > 0) {
      setOnlyShowCookable(true);
    } else {
      setOnlyShowCookable(false);
    }
  }, [checkedIngredients.length > 0]);

  // Identify active special ingredients based on checklist or search query
  const activeSpecialIngredients = useMemo(() => {
    const activeIds = new Set<string>();

    // 1. From checked ingredients
    SPECIAL_INGREDIENTS.forEach((sp) => {
      if (checkedIngredients.includes(sp.id)) {
        activeIds.add(sp.id);
      }
      if (
        sp.id === "trunk_summer" &&
        (checkedIngredients.includes("trunk_winter") ||
          checkedIngredients.includes("trunk_cooked"))
      ) {
        activeIds.add("trunk_summer");
      }
      if (
        sp.id === "plantmeat" &&
        checkedIngredients.includes("plantmeat_cooked")
      ) {
        activeIds.add("plantmeat");
      }
      if (
        sp.id === "tallbirdegg" &&
        checkedIngredients.includes("tallbirdegg_cooked")
      ) {
        activeIds.add("tallbirdegg");
      }
    });

    // 2. From search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      SPECIAL_INGREDIENTS.forEach((sp) => {
        const matchesQuery = sp.names.some(
          (name) => q.includes(name) || name.includes(q),
        );
        if (matchesQuery) {
          activeIds.add(sp.id);
        }
      });
    }

    return activeIds;
  }, [checkedIngredients, searchQuery]);

  // Filter recipes based on checklist, categories, search, and sort
  const filteredRecipes = useMemo(() => {
    // Determine the list of search-space recipes
    let sourceList: Recipe[] = RECIPES;

    if (onlyShowCookable && checkedIngredients.length > 0) {
      const cookableSet = new Set(
        getCookableRecipes(checkedIngredients, isPortable).map((r) => r.id),
      );
      sourceList = sourceList.filter((recipe) => {
        if (!isPortable && recipe.isPortable) return false;
        return (
          cookableSet.has(recipe.id) ||
          isRecipeRelated(recipe, checkedIngredients)
        );
      });
    }

    // Apply category filter (meat-heavy, veg-heavy, high-sanity, summer-chill etc.)
    if (categoryFilter !== "all") {
      sourceList = sourceList.filter((recipe) => {
        if (categoryFilter === "healing") return recipe.hp >= 30;
        if (categoryFilter === "hunger") return recipe.hunger >= 75;
        if (categoryFilter === "sanity") return recipe.sanity >= 15;
        if (categoryFilter === "ruined")
          return recipe.hp < 0 || recipe.sanity < 0;
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
          r.requirementsZH.toLowerCase().includes(q),
      );
    }

    const isSpecialRecipe = (recipe: Recipe) => {
      return Array.from(activeSpecialIngredients).some((spId) =>
        isStronglyBoundTo(recipe, spId as string),
      );
    };

    // Sort
    return [...sourceList].sort((a, b) => {
      const aSpecial = isSpecialRecipe(a);
      const bSpecial = isSpecialRecipe(b);

      if (aSpecial && !bSpecial) return -1;
      if (!aSpecial && bSpecial) return 1;

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
  }, [
    onlyShowCookable,
    checkedIngredients,
    searchQuery,
    sortBy,
    sortDirection,
    categoryFilter,
    isPortable,
    activeSpecialIngredients,
  ]);

  const cookableRecipeIds = useMemo(() => {
    return new Set(
      getCookableRecipes(checkedIngredients, isPortable).map((r) => r.id),
    );
  }, [checkedIngredients, isPortable]);

  // Handle checking/unchecking ingredient
  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
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
    const groups: Record<
      string,
      { title: string; color: string; list: Ingredient[] }
    > = {
      meat: {
        title: "🍖 肉食類 (Meats)",
        color: "border-red-900/30 text-rose-300 bg-red-950/20",
        list: [],
      },
      veg: {
        title: "🥕 蔬菜類 (Vegetables)",
        color: "border-green-900/30 text-emerald-300 bg-emerald-950/20",
        list: [],
      },
      fruit: {
        title: "🍇 水果類 (Fruits)",
        color: "border-pink-900/30 text-pink-300 bg-pink-950/20",
        list: [],
      },
      fish: {
        title: "🐟 魚類 (Fish)",
        color: "border-blue-900/30 text-blue-300 bg-blue-950/20",
        list: [],
      },
      egg: {
        title: "🥚 蛋類 (Eggs)",
        color: "border-yellow-950/30 text-yellow-105 bg-yellow-950/20",
        list: [],
      },
      sweetener: {
        title: "🍯 甜味劑 (Sweeteners)",
        color: "border-amber-900/30 text-amber-300 bg-amber-950/20",
        list: [],
      },
      miscellaneous: {
        title: "🥢 雜項 (Miscellaneous)",
        color: "border-stone-800 text-stone-300 bg-stone-900/20",
        list: [],
      },
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

    const getBaseId = (id: string) => {
      return id
        .replace(/_cooked$/, "")
        .replace(/^cooked_/, "")
        .replace(/_dried$/, "")
        .replace(/^dried_/, "")
        .replace(/_ripe$/, "")
        .replace(/^ripe_/, "");
    };

    const getVariantPriority = (id: string) => {
      if (id.endsWith("_cooked") || id.startsWith("cooked_")) return 1;
      if (id.endsWith("_dried") || id.startsWith("dried_")) return 2;
      return 0; // Raw
    };

    // Sort lists to place similar food variants (e.g. raw, cooked, dried) next to each other
    Object.values(groups).forEach((group) => {
      const baseIdFirstIndex: Record<string, number> = {};
      group.list.forEach((ing, index) => {
        const bId = getBaseId(ing.id);
        if (baseIdFirstIndex[bId] === undefined) {
          baseIdFirstIndex[bId] = index;
        }
      });

      group.list.sort((a, b) => {
        const aBase = getBaseId(a.id);
        const bBase = getBaseId(b.id);
        if (aBase !== bBase) {
          return baseIdFirstIndex[aBase] - baseIdFirstIndex[bBase];
        }
        return getVariantPriority(a.id) - getVariantPriority(b.id);
      });
    });

    return Object.entries(groups).filter(([_, data]) => data.list.length > 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-150 font-sans selection:bg-amber-800 selection:text-white"
      id="main-container"
    >
      {/* Decorative top wooden border-style indicator */}
      <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900 w-full" />

      {/* Header Panel */}
      <header
        className="border-b border-stone-800 bg-stone-900 py-6"
        id="header-panel"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-1 border border-amber-500/30 bg-stone-950/60 animate-dst-glow overflow-hidden h-14 w-14 flex items-center justify-center">
              <img
                src={`${(import.meta as any).env.BASE_URL || "/"}Don't_Starve_Together_icon.png`}
                className="h-12 w-12 object-contain"
                alt="DST Logo"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide mt-0.5">
                東方靈飢荒百科
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${activeTab === "recipes"
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
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${activeTab === "simulator"
                ? "bg-amber-600 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-900/20"
                : "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750"
                }`}
              id="tab-simulator-btn"
            >
              <Flame className="h-4 w-4" />
              <span>烹飪真實模擬器</span>
            </button>

            <button
              onClick={() => setActiveTab("characters")}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${activeTab === "characters"
                ? "bg-amber-600 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-900/20"
                : "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750"
                }`}
              id="tab-characters-btn"
            >
              <UserCheck className="h-4 w-4" />
              <span>人物百科</span>
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
                <div
                  className="bg-stone-900 border border-stone-800 rounded-xl p-5"
                  id="inventory-panel"
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                    <div>
                      <h2 className="text-md font-serif font-bold text-amber-500 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-amber-500" />
                        手頭有的食材勾選
                      </h2>
                      <p className="text-xs text-stone-400">
                        勾選後，下方食譜庫會自動找出能用這些食材烹飪的料理。
                      </p>
                    </div>
                  </div>

                  {/* Compact Grid of Category Block Tiles */}
                  <div
                    className="grid grid-cols-7 gap-1 mt-2.5 mb-4"
                    id="category-tiles-grid"
                  >
                    {groupedIngredients.map(([catKey, categoryData]) => {
                      const isExpanded = !!expandedCatRecipes[catKey];
                      const selectedCount = categoryData.list.filter((i) =>
                        checkedIngredients.includes(i.id),
                      ).length;

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
                        miscellaneous: "雜項",
                      };
                      const shortName = catNamesShort[catKey] || "雜項";

                      return (
                        <button
                          key={catKey}
                          onClick={() => toggleCatRecipes(catKey)}
                          className={`flex flex-col items-center justify-between py-2 px-0.5 rounded-lg border text-center transition-all duration-150 cursor-pointer ${isExpanded
                            ? "bg-amber-600 border-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/40 scale-[1.03]"
                            : "bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-750 hover:bg-stone-850"
                            }`}
                          id={`cat-tile-${catKey}`}
                        >
                          <span className="text-base sm:text-lg mb-0.5 select-none">
                            {emoji}
                          </span>
                          <span
                            className={`text-[10px] leading-none tracking-tight font-bold truncate max-w-full ${isExpanded ? "text-stone-950" : "text-stone-200"}`}
                          >
                            {shortName}
                          </span>
                          <span
                            className={`text-[8px] font-mono mt-1 leading-none ${isExpanded ? "text-stone-900/95 font-bold" : "text-stone-500"}`}
                          >
                            {selectedCount > 0 ? (
                              <strong
                                className={
                                  isExpanded
                                    ? "text-stone-950 font-black"
                                    : "text-amber-500 font-bold"
                                }
                              >
                                {selectedCount}
                              </strong>
                            ) : (
                              "0"
                            )}
                            /{categoryData.list.length}
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
                                const isChecked = checkedIngredients.includes(
                                  ing.id,
                                );
                                return (
                                  <button
                                    key={ing.id}
                                    onClick={() =>
                                      toggleIngredientCheck(ing.id)
                                    }
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition border cursor-pointer ${isChecked
                                      ? "bg-amber-600/25 text-white border-amber-500/60 font-medium"
                                      : "bg-stone-900/40 text-stone-400 border-stone-850 hover:border-stone-750"
                                      }`}
                                  >
                                    <IngredientImage
                                      ingredientId={ing.id}
                                      avatarText={ing.avatarText}
                                      className="w-5 h-5 object-contain shrink-0"
                                    />
                                    <div className="text-left truncate flex-1 min-w-0">
                                      <div className="truncate font-medium">
                                        {ing.name}
                                      </div>
                                      <div className="text-[9px] text-stone-500 truncate mt-[-2px]">
                                        {ing.values.meat
                                          ? `肉:${ing.values.meat} `
                                          : ""}
                                        {ing.values.veg
                                          ? `菜:${ing.values.veg} `
                                          : ""}
                                        {ing.values.fruit
                                          ? `果:${ing.values.fruit} `
                                          : ""}
                                        {ing.values.monster ? `怪 ` : ""}
                                        {ing.values.egg
                                          ? `蛋:${ing.values.egg} `
                                          : ""}
                                        {ing.values.sweetener ? `糖 ` : ""}
                                        {ing.values.dairy ? `奶 ` : ""}
                                        {ing.values.ice ? `冰 ` : ""}
                                        {ing.values.twigs ? `樹枝 ` : ""}
                                      </div>
                                    </div>
                                    <div
                                      className={`h-3.5 w-3.5 rounded flex items-center justify-center border shrink-0 ${isChecked ? "bg-amber-500 border-amber-500" : "border-stone-700"}`}
                                    >
                                      {isChecked && (
                                        <div className="h-1.5 w-1.5 bg-stone-950 rounded-sm" />
                                      )}
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
                    <span className="flex items-center gap-1.5">
                      <span>已勾選食材庫：</span>
                      <span className="font-mono text-amber-500 font-bold">
                        {checkedIngredients.length} / {INGREDIENTS.length} 種
                      </span>
                    </span>
                    <button
                      onClick={clearAllIngredients}
                      className="py-1 px-2.5 text-xs bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 rounded-lg transition cursor-pointer font-medium"
                    >
                      清空所選
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Recipe Catalog & Matching Results */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Search & Sorting Panel */}
                <div
                  className="bg-stone-900 border border-stone-800 rounded-xl p-5"
                  id="filter-controls"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-md font-serif font-bold text-stone-100 flex items-center gap-2">
                        <Layers className="h-4.5 w-4.5 text-amber-500" />
                        遊戲配方資料庫
                      </h2>
                      <p className="text-xs text-stone-400">
                        目前庫存：共 {RECIPES.length} 款官方認證大鍋料理
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={onlyShowCookable}
                          onChange={(e) =>
                            setOnlyShowCookable(e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                        <span className="ms-2 text-xs font-medium text-stone-300">
                          篩選手頭食材相關 (
                          {
                            getCookableRecipes(checkedIngredients, isPortable)
                              .length
                          }{" "}
                          可做 /{" "}
                          {
                            RECIPES.filter((r) =>
                              !isPortable && r.isPortable
                                ? false
                                : isRecipeRelated(r, checkedIngredients),
                            ).length
                          }{" "}
                          相關)
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
                      <span className="text-[11px] text-stone-400 shrink-0">
                        排序基準:
                      </span>
                      <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800 w-full">
                        <button
                          onClick={() => {
                            setSortBy("hp");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition cursor-pointer flex items-center justify-center gap-1 ${sortBy === "hp"
                            ? "bg-rose-950/40 text-rose-300 font-bold"
                            : "text-stone-400 hover:text-stone-200"
                            }`}
                        >
                          <StateIcon
                            type="hp"
                            className="w-3.5 h-3.5 object-contain shrink-0"
                          />
                          <span>+血量</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("hunger");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition cursor-pointer flex items-center justify-center gap-1 ${sortBy === "hunger"
                            ? "bg-amber-950/40 text-amber-300 font-bold"
                            : "text-stone-400 hover:text-stone-200"
                            }`}
                        >
                          <StateIcon
                            type="hunger"
                            className="w-3.5 h-3.5 object-contain shrink-0"
                          />
                          <span>+飢餓值</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortBy("sanity");
                            setSortDirection("desc");
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition cursor-pointer flex items-center justify-center gap-1 ${sortBy === "sanity"
                            ? "bg-sky-950/40 text-sky-300 font-bold"
                            : "text-stone-400 hover:text-stone-200"
                            }`}
                        >
                          <StateIcon
                            type="sanity"
                            className="w-3.5 h-3.5 object-contain shrink-0"
                          />
                          <span>+san值</span>
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
                        <option value="hunger">
                          🍖 大力補腹 (飢餓&gt;=75)
                        </option>
                        <option value="sanity">
                          🌀 養腦提神 (理智&gt;=15)
                        </option>
                        <option value="ruined">💀 副作用料理 (負值)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                    <div className="flex gap-2">
                      <span>
                        當前篩選出：
                        <strong className="text-amber-500 font-mono text-xs">
                          {filteredRecipes.length}
                        </strong>{" "}
                        項配方
                      </span>
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
                    <h3 className="text-stone-200 font-serif font-bold text-lg">
                      沒有找到對應的食譜
                    </h3>
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
                      const missingForIdeal = recipe.idealCombo.filter(
                        (id) => !checkedIngredients.includes(id),
                      );
                      const isFullyCookable = cookableRecipeIds.has(recipe.id);
                      const missingReqs = getMissingRequirements(
                        recipe,
                        checkedIngredients,
                      );
                      const isSpecial = Array.from(
                        activeSpecialIngredients,
                      ).some((spId) =>
                        isStronglyBoundTo(recipe, spId as string),
                      );

                      return (
                        <div
                          key={recipe.id}
                          className={`bg-stone-900 border rounded-xl overflow-hidden hover:border-amber-500/60 transition-all duration-200 flex flex-col justify-between ${isSpecial
                            ? "border-amber-500 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/30 animate-dst-glow"
                            : "border-stone-700"
                            }`}
                        >
                          {/* Top part */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                                  <RecipeImage
                                    recipeId={recipe.id}
                                    className="w-6 h-6 object-contain shrink-0"
                                  />
                                  {recipe.name}
                                  {isSpecial && (
                                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-amber-500 text-stone-950 rounded flex items-center gap-0.5 leading-none shrink-0 shadow-sm animate-pulse">
                                      ⭐ 特殊料理
                                    </span>
                                  )}
                                  {recipe.isPortable && (
                                    <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-bold bg-purple-950/80 text-purple-300 border border-purple-900/40 rounded leading-none shrink-0">
                                      Warly
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[10px] text-stone-400 font-mono uppercase">
                                  {recipe.englishName} • 優先級:{" "}
                                  {recipe.priority}
                                </p>
                              </div>

                              <div className="text-[10px] px-1.5 py-0.5 rounded bg-stone-950 font-mono text-stone-400 border border-stone-800 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5 text-amber-500" />
                                <span>
                                  煮:{recipe.cookTime}s • 爛:{recipe.perishDays}
                                  天
                                </span>
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
                                <span className="text-stone-400">
                                  💡 經典推薦搭配：
                                </span>
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  {recipe.idealCombo.map((id, idx) => {
                                    const ing = INGREDIENTS.find(
                                      (i) => i.id === id,
                                    );
                                    if (!ing) return null;
                                    const hasIt =
                                      checkedIngredients.includes(id);
                                    return (
                                      <span
                                        key={idx}
                                        className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 border font-mono ${hasIt
                                          ? "bg-amber-950 text-stone-200 border-amber-900/30"
                                          : "bg-stone-950 text-stone-500 line-through border-transparent"
                                          }`}
                                        title={ing.name}
                                      >
                                        <IngredientImage
                                          ingredientId={ing.id}
                                          avatarText={ing.avatarText}
                                          className="w-4 h-4 object-contain"
                                        />
                                        <span>{ing.name}</span>
                                      </span>
                                    );
                                  })}

                                  {isFullyCookable ? (
                                    <span className="text-[9px] text-emerald-500 ml-1 font-bold">
                                      ✓ 可製作
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-amber-500 ml-1 font-bold">
                                      ⚠️ 缺食材
                                    </span>
                                  )}
                                </div>
                              </div>

                              {!isFullyCookable && missingReqs.length > 0 && (
                                <div className="mt-2 text-[10px] bg-amber-950/20 border border-amber-900/35 rounded-lg p-2 text-amber-300">
                                  <span className="font-bold block text-amber-400 mb-0.5">
                                    💡 還需滿足以下屬性或食材之一：
                                  </span>
                                  <ul className="list-disc list-inside space-y-0.5 font-mono">
                                    {missingReqs.map((req, idx) => (
                                      <li key={idx} className="leading-normal">
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stats bottom bar */}
                          <div className="bg-stone-950/50 border-t border-stone-800/80 px-4 py-2.5 grid grid-cols-3 gap-2">
                            <div className="flex items-center gap-1">
                              <StateIcon
                                type="hp"
                                className="w-5 h-5 object-contain shrink-0"
                              />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">
                                  +血量
                                </div>
                                <div
                                  className={`text-xs font-bold font-mono ${recipe.hp >= 30 ? "text-rose-400" : recipe.hp < 0 ? "text-red-500" : "text-stone-300"}`}
                                >
                                  {recipe.hp > 0 ? `+${recipe.hp}` : recipe.hp}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <StateIcon
                                type="hunger"
                                className="w-5 h-5 object-contain shrink-0"
                              />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">
                                  +飢餓值
                                </div>
                                <div
                                  className={`text-xs font-bold font-mono ${recipe.hunger >= 75 ? "text-amber-400" : "text-stone-300"}`}
                                >
                                  +{recipe.hunger}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <StateIcon
                                type="sanity"
                                className="w-5 h-5 object-contain shrink-0"
                              />
                              <div className="leading-none">
                                <div className="text-[9px] text-stone-400">
                                  +san值
                                </div>
                                <div
                                  className={`text-xs font-bold font-mono ${recipe.sanity >= 20 ? "text-sky-300" : recipe.sanity < 0 ? "text-purple-400" : "text-stone-300"}`}
                                >
                                  {recipe.sanity > 0
                                    ? `+${recipe.sanity}`
                                    : recipe.sanity}
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
                <div
                  className="bg-stone-900 border border-stone-850 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
                  id="cook-pot-box"
                >
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
                          <span className="animate-sizzle-bubble-1 text-2xl filter blur-[1px]">
                            💨
                          </span>
                          <span className="animate-sizzle-bubble-2 text-xl filter blur-[2px]">
                            💨
                          </span>
                          <span className="animate-sizzle-bubble-3 text-2xl filter blur-[1px]">
                            💨
                          </span>
                        </div>
                      )}

                      {/* Cook Pot Graphic */}
                      <div
                        className={`relative h-44 w-44 rounded-full bg-stone-800 border-8 border-stone-950 flex items-center justify-center shadow-xl shadow-stone-950/70 ${isCooking ? "animate-wiggle-pot ring-4 ring-orange-500/30" : "animate-dst-glow"}`}
                      >
                        <div className="absolute inset-2 rounded-full border border-stone-700 bg-stone-900 flex flex-col items-center justify-center text-center p-3">
                          {!isCooking && simulatedResult ? (
                            <div className="flex flex-col items-center justify-center animate-fade-in">
                              <span className="text-4xl">
                                {simulatedResult.id === "wet_goop"
                                  ? "💀"
                                  : "🍲"}
                              </span>
                              <span className="text-xs font-serif font-bold text-amber-400 mt-1.5">
                                {simulatedResult.name}
                              </span>
                              <span className="text-[9px] text-stone-500 font-mono">
                                烹飪成功!
                              </span>
                            </div>
                          ) : isCooking ? (
                            <div className="flex flex-col items-center justify-center">
                              <Flame className="h-10 w-10 text-orange-500 animate-bounce" />
                              <span className="text-xs text-orange-400 font-mono mt-1 font-bold">
                                COOKING {cookingProgress}%
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-stone-500">
                              <Soup className="h-10 w-10 mb-1 opacity-40 text-stone-400" />
                              <span className="text-[11px] font-medium">
                                放入4種食材
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 4 Interactive Ingredient Slots */}
                    <div className="grid grid-cols-4 gap-3 w-full">
                      {potSlots.map((ingId, idx) => {
                        const ingredient = INGREDIENTS.find(
                          (i) => i.id === ingId,
                        );
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <button
                              onClick={() =>
                                ingId && handleRemoveIngredientFromPot(idx)
                              }
                              disabled={isCooking || !ingId}
                              className={`h-16 w-full rounded-xl border flex flex-col items-center justify-center relative cursor-pointer group transition ${ingId
                                ? `${ingredient?.color} shadow-md`
                                : "bg-stone-950 border-stone-800 border-dashed text-stone-650 hover:border-stone-700"
                                }`}
                              title={ingId ? "點擊移除" : "空草位"}
                            >
                              {ingId && ingredient ? (
                                <div className="text-center">
                                  <IngredientImage
                                    ingredientId={ingredient.id}
                                    avatarText={ingredient.avatarText}
                                    className="w-6 h-6 object-contain mx-auto"
                                  />
                                  <span className="text-[10px] block mt-0.5 font-bold truncate max-w-[50px]">
                                    {ingredient.name}
                                  </span>
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
                            <span className="text-[10px] text-stone-500 font-mono mt-1">
                              孔位 {idx + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Warly Portable Pot Toggle */}
                    <div className="flex items-center justify-between w-full bg-stone-950/60 p-2.5 rounded-xl border border-stone-850/85 mt-2">
                      <label className="text-[11px] text-stone-300 flex items-center gap-1.5 cursor-pointer">
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
                      <span className="text-[8px] px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-mono font-bold">
                        Warly
                      </span>
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
                        className={`flex-1 py-1 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${potSlots.some((id) => id === "")
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
                      <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-stone-300 font-mono text-[10px]">
                        <div>
                          🍖 肉類:{" "}
                          <span className="text-amber-400 font-bold">
                            {currentPotValues.meat || 0}
                          </span>
                        </div>
                        <div>
                          🥕 蔬菜:{" "}
                          <span className="text-emerald-400 font-bold">
                            {currentPotValues.veg || 0}
                          </span>
                        </div>
                        <div>
                          🍉 水果:{" "}
                          <span className="text-pink-400 font-bold">
                            {currentPotValues.fruit || 0}
                          </span>
                        </div>
                        <div>
                          🥚 蛋類:{" "}
                          <span className="text-yellow-250 font-bold">
                            {currentPotValues.egg || 0}
                          </span>
                        </div>
                        <div>
                          🍯 糖類:{" "}
                          <span className="text-amber-500 font-bold">
                            {currentPotValues.sweetener || 0}
                          </span>
                        </div>
                        <div>
                          🥛 奶類:{" "}
                          <span className="text-sky-300 font-bold">
                            {currentPotValues.dairy || 0}
                          </span>
                        </div>
                        <div>
                          🐟 魚類:{" "}
                          <span className="text-blue-400 font-bold">
                            {currentPotValues.fish || 0}
                          </span>
                        </div>
                        <div>
                          🪵 樹枝:{" "}
                          <span className="text-stone-400 font-bold">
                            {currentPotValues.twigs || 0}
                          </span>
                        </div>
                        <div>
                          ❄️ 冰塊:{" "}
                          <span className="text-cyan-300 font-bold">
                            {currentPotValues.ice || 0}
                          </span>
                        </div>
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
                        <h4 className="text-md font-serif font-bold text-white">
                          砂鍋烹飪報告 (Result Found!)
                        </h4>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-stone-950 p-4 rounded-xl mb-4 border border-stone-850">
                        <div className="h-16 w-16 rounded-xl bg-amber-500/10 border border-amber-500/20 text-3xl flex items-center justify-center shrink-0">
                          <RecipeImage
                            recipeId={simulatedResult.id}
                            className="w-12 h-12 object-contain"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="text-lg font-serif font-bold text-amber-400">
                              {simulatedResult.name}
                            </h2>
                            {simulatedResult.isPortable && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded leading-none">
                                Warly 專屬
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                              優先級: {simulatedResult.priority}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {simulatedResult.englishName}
                          </p>
                          <p className="text-xs text-amber-100/90 leading-relaxed mt-1">
                            {simulatedResult.description}
                          </p>
                        </div>
                      </div>

                      {/* Display Restoration Values */}
                      <h4 className="text-xs text-stone-400 font-mono mb-2 uppercase tracking-wider">
                        ★ 料理食用恢復值：
                      </h4>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon
                            type="hp"
                            className="w-6 h-6 object-contain mb-1"
                          />
                          <div className="text-[10px] text-stone-400 leading-none">
                            +血量
                          </div>
                          <div
                            className={`text-sm font-bold font-mono mt-1 ${simulatedResult.hp >= 30 ? "text-rose-400" : simulatedResult.hp < 0 ? "text-red-500" : "text-stone-200"}`}
                          >
                            {simulatedResult.hp > 0
                              ? `+${simulatedResult.hp}`
                              : simulatedResult.hp}
                          </div>
                        </div>

                        <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon
                            type="hunger"
                            className="w-6 h-6 object-contain mb-1"
                          />
                          <div className="text-[10px] text-stone-400 leading-none">
                            +飢餓值
                          </div>
                          <div
                            className={`text-sm font-bold font-mono mt-1 ${simulatedResult.hunger >= 75 ? "text-amber-400" : "text-stone-200"}`}
                          >
                            +{simulatedResult.hunger}
                          </div>
                        </div>

                        <div className="bg-sky-950/20 border border-sky-900/30 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                          <StateIcon
                            type="sanity"
                            className="w-6 h-6 object-contain mb-1"
                          />
                          <div className="text-[10px] text-stone-400 leading-none">
                            +san值
                          </div>
                          <div
                            className={`text-sm font-bold font-mono mt-1 ${simulatedResult.sanity >= 20 ? "text-sky-300" : simulatedResult.sanity < 0 ? "text-purple-400" : "text-stone-200"}`}
                          >
                            {simulatedResult.sanity > 0
                              ? `+${simulatedResult.sanity}`
                              : simulatedResult.sanity}
                          </div>
                        </div>
                      </div>

                      {/* Additional Cooking Info */}
                      <div className="space-y-2 lg:space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-850 text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-stone-400">
                            ⏱️ 烘乾/烹飪時間
                          </span>
                          <span className="font-mono text-stone-200 font-bold">
                            {simulatedResult.cookTime} 秒
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-stone-855">
                          <span className="text-stone-400">
                            🍂 食物腐爛天數
                          </span>
                          <span className="font-mono text-stone-200 font-bold">
                            {simulatedResult.perishDays} 天
                          </span>
                        </div>
                        <div className="py-1.5 border-t border-stone-855">
                          <div className="text-stone-400 mb-1">
                            📋 符合此配方的原理：
                          </div>
                          <p className="text-[11px] text-amber-500 font-mono leading-relaxed bg-stone-900 p-2 rounded border border-stone-800">
                            {simulatedResult.requirementsZH}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-stone-900 border border-stone-850 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                      <HelpCircle className="h-8 w-8 text-stone-500 mb-2" />
                      <h4 className="text-stone-300 font-semibold text-sm">
                        砂鍋尚未開爐
                      </h4>
                      <p className="text-xs text-stone-400 max-w-xs mx-auto mt-1">
                        在下方食材庫中，點擊<strong>「 放入 」</strong>
                        按鈕將食材放入4個砂鍋格中，然後點擊「開火烹飪！」模擬化學反應。
                      </p>

                      <div className="mt-4 pt-4 border-t border-stone-800 w-full">
                        <p className="text-[11px] text-stone-400">
                          💡 經典食譜快速入口 preset：
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                          <button
                            onClick={() =>
                              loadPresetIntoPot([
                                "monstermeat",
                                "berries",
                                "berries",
                                "berries",
                              ])
                            }
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            肉丸 🧆
                          </button>
                          <button
                            onClick={() =>
                              loadPresetIntoPot([
                                "monstermeat",
                                "bird_egg",
                                "carrot",
                                "berries",
                              ])
                            }
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            餃子 🥟
                          </button>
                          <button
                            onClick={() =>
                              loadPresetIntoPot([
                                "meat",
                                "meat",
                                "smallmeat",
                                "smallmeat",
                              ])
                            }
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            肉湯 🥣
                          </button>
                          <button
                            onClick={() =>
                              loadPresetIntoPot([
                                "dragonfruit",
                                "twigs",
                                "twigs",
                                "twigs",
                              ])
                            }
                            className="bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            火龍果派 🥮
                          </button>
                          <button
                            onClick={() =>
                              loadPresetIntoPot([
                                "goatmilk",
                                "ice",
                                "honey",
                                "honey",
                              ])
                            }
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
                      const activeCountOfCat = categoryData.list.reduce(
                        (acc, ing) =>
                          acc + potSlots.filter((id) => id === ing.id).length,
                        0,
                      );

                      return (
                        <div
                          key={catKey}
                          className={`border rounded-xl overflow-hidden transition-all duration-200 border-stone-800 bg-stone-950/20`}
                        >
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
                            <ChevronRight
                              className={`h-4 w-4 transition-transform duration-200 text-stone-500 ${isExpanded ? "rotate-90 text-amber-500" : ""}`}
                            />
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
                                    const activeCountInPot = potSlots.filter(
                                      (id) => id === ing.id,
                                    ).length;
                                    const isPotFull =
                                      potSlots.indexOf("") === -1;
                                    return (
                                      <button
                                        key={ing.id}
                                        disabled={isCooking || isPotFull}
                                        onClick={() =>
                                          handleAddIngredientToPot(ing.id)
                                        }
                                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs border transition cursor-pointer ${isPotFull
                                          ? "bg-stone-950 text-stone-600 border-transparent cursor-not-allowed"
                                          : "bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-900/40 hover:bg-stone-800"
                                          }`}
                                      >
                                        <span className="flex items-center gap-1 text-left truncate flex-1 min-w-0">
                                          <IngredientImage
                                            ingredientId={ing.id}
                                            avatarText={ing.avatarText}
                                            className="w-5 h-5 object-contain shrink-0"
                                          />
                                          <span className="truncate">
                                            {ing.name}
                                          </span>
                                        </span>

                                        <span className="flex items-center gap-1 shrink-0 ml-1">
                                          {activeCountInPot > 0 && (
                                            <span className="bg-amber-600 text-stone-950 text-[9px] px-1 font-bold rounded">
                                              x{activeCountInPot}
                                            </span>
                                          )}
                                          <span className="text-[9px] text-amber-500 font-bold shrink-0">
                                            ＋
                                          </span>
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

          {/* TAB 3: CHARACTER ENCYCLOPEDIA */}
          {activeTab === "characters" && (
            <motion.div
              key="characters-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Character List Selector */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4">
                  <h3 className="text-md font-serif font-bold text-amber-500 mb-4 pb-2 border-b border-stone-800">
                    人物百科角色目錄
                  </h3>

                  <div className="space-y-3">
                    {/* WX-78 */}
                    <button
                      onClick={() => setActiveCharacterId("wx78")}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${activeCharacterId === "wx78"
                        ? "bg-amber-600/10 border-amber-500/60 shadow-md shadow-amber-900/10"
                        : "bg-stone-950/40 border-stone-850 hover:border-stone-750"
                        }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                        <img
                          src={`${(import.meta as any).env.BASE_URL || "/"}images/characters/wx78.png`}
                          className="w-full h-full object-cover"
                          alt="WX-78"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-stone-950 text-[9px] font-bold text-center py-0.5">
                          已上線
                        </div>
                      </div>
                      <div className="min-w-0 font-serif">
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>WX-78</span>
                          <span className="text-[10px] bg-amber-600/20 text-amber-400 px-1 rounded">
                            🤖
                          </span>
                        </h4>
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          殘酷的機器人
                        </p>
                      </div>
                    </button>

                    {/* Locked Placeholder: Wilson */}
                    <div className="p-3 rounded-xl border border-stone-850/60 bg-stone-950/20 opacity-50 flex items-center gap-3 relative select-none">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center relative grayscale">
                        <span className="text-xl">🧑‍🔬</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-stone-500 flex items-center gap-1.5">
                          <span>威爾森</span>
                          <span className="text-[10px] bg-stone-800 text-stone-500 px-1 rounded">
                            鎖定
                          </span>
                        </h4>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          紳士科學家
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-stone-950/20 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-bold tracking-wider text-amber-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded shadow">
                          敬請期待
                        </span>
                      </div>
                    </div>

                    {/* Locked Placeholder: Willow */}
                    <div className="p-3 rounded-xl border border-stone-850/60 bg-stone-950/20 opacity-50 flex items-center gap-3 relative select-none">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center relative grayscale">
                        <span className="text-xl">🔥</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-stone-500 flex items-center gap-1.5">
                          <span>薇洛</span>
                          <span className="text-[10px] bg-stone-800 text-stone-500 px-1 rounded">
                            鎖定
                          </span>
                        </h4>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          縱火者
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-stone-950/20 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-bold tracking-wider text-amber-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded shadow">
                          敬請期待
                        </span>
                      </div>
                    </div>

                    {/* Locked Placeholder: Wendy */}
                    <div className="p-3 rounded-xl border border-stone-850/60 bg-stone-950/20 opacity-50 flex items-center gap-3 relative select-none">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center relative grayscale">
                        <span className="text-xl">💀</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-stone-500 flex items-center gap-1.5">
                          <span>溫蒂</span>
                          <span className="text-[10px] bg-stone-800 text-stone-500 px-1 rounded">
                            鎖定
                          </span>
                        </h4>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          喪親孤女
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-stone-950/20 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-bold tracking-wider text-amber-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded shadow">
                          敬請期待
                        </span>
                      </div>
                    </div>

                    {/* Locked Placeholder: Wolfgang */}
                    <div className="p-3 rounded-xl border border-stone-850/60 bg-stone-950/20 opacity-50 flex items-center gap-3 relative select-none">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center relative grayscale">
                        <span className="text-xl">💪</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-stone-500 flex items-center gap-1.5">
                          <span>沃爾夫岡</span>
                          <span className="text-[10px] bg-stone-800 text-stone-500 px-1 rounded">
                            鎖定
                          </span>
                        </h4>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          大力士
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-stone-950/20 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-bold tracking-wider text-amber-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded shadow">
                          敬請期待
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Character Details & Upgrades */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                {/* Main Profile Info */}
                <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 relative overflow-hidden">
                  {/* Decorative background glow if slots full */}
                  {totalSlotsUsed.alpha +
                    totalSlotsUsed.beta +
                    totalSlotsUsed.gamma ===
                    18 && (
                      <div className="absolute inset-0 bg-radial from-amber-600/5 via-transparent to-transparent pointer-events-none animate-pulse" />
                    )}

                  <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/30 shadow-lg shadow-black/40 shrink-0 flex items-center justify-center">
                      <img
                        src={`${(import.meta as any).env.BASE_URL || "/"}images/characters/wx78.png`}
                        className="w-full h-full object-cover"
                        alt="WX-78 Avatar"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                          {currentCharacter.name}
                        </h2>
                        <span className="text-xs text-stone-400 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800 font-serif">
                          {currentCharacter.englishName}
                        </span>
                        {totalSlotsUsed.alpha +
                          totalSlotsUsed.beta +
                          totalSlotsUsed.gamma ===
                          18 && (
                            <span className="text-xs font-bold bg-amber-600 text-stone-950 px-2 py-0.5 rounded animate-bounce">
                              ⚡ 系統已滿載 (Fully Overloaded)
                            </span>
                          )}
                      </div>
                      <p className="text-amber-500/80 font-serif font-bold text-sm mt-1">
                        {currentCharacter.title}
                      </p>
                      <p className="text-stone-300 text-sm mt-3 leading-relaxed">
                        {currentCharacter.description}
                      </p>
                    </div>
                  </div>

                  <hr className="border-stone-850 my-6" />

                  {/* WX-78 Skill Tree Section */}
                  {activeCharacterId === "wx78" && (
                    <div className="bg-stone-950/40 border border-stone-850 rounded-xl p-4 mb-6 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-sm font-serif font-bold text-amber-500 flex items-center gap-1.5">
                            <Cpu className="h-4 w-4" />
                            機器人天賦樹 (WX-78 Skillset)
                          </h3>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            官方 Insight 系統：使用 15 點啟迪點數啟動技能組，遵循排他性與解鎖規則
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setWxSkills([])}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-stone-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            重置面板
                          </button>
                        </div>
                      </div>

                      {/* Boss defeat check boxes */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 bg-stone-950/20 border border-stone-850/40 rounded-lg p-2.5 text-xs text-stone-400">
                        <span className="font-bold text-stone-300 font-serif">解鎖進度模擬 (Boss Defeated Status):</span>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-stone-200 select-none">
                          <input
                            type="checkbox"
                            checked={celestialDefeated}
                            onChange={(e) => {
                              setCelestialDefeated(e.target.checked);
                              if (!e.target.checked) {
                                setWxSkills(prev => getValidSkills(prev, false, shadowDefeated));
                              }
                            }}
                            className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-950 bg-stone-900 w-4 h-4"
                          />
                          <span>已擊敗天體英雄 (Celestial Champion Killed)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-stone-200 select-none">
                          <input
                            type="checkbox"
                            checked={shadowDefeated}
                            onChange={(e) => {
                              setShadowDefeated(e.target.checked);
                              if (!e.target.checked) {
                                setWxSkills(prev => getValidSkills(prev, celestialDefeated, false));
                              }
                            }}
                            className="rounded border-stone-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-950 bg-stone-900 w-4 h-4"
                          />
                          <span>已擊敗織影者 (Ancient Fuelweaver Killed)</span>
                        </label>
                      </div>

                      {/* Canvas Container */}
                      <div
                        className="relative w-full bg-stone-950 border border-stone-850 rounded-xl shadow-inner max-w-[750px] mx-auto group"
                        style={{ aspectRatio: "594/374" }}
                      >
                        {/* Remaining Skill Points Overlay (Eye Outline) */}
                        <div
                          className="absolute flex items-center justify-center pointer-events-none"
                          style={{
                            left: "50%",
                            top: "21.7%",
                            width: "9.2%",
                            height: "14.6%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 5,
                          }}
                        >
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img
                              src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/skill_icon_textbox.png`}
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                              alt="Remaining Points Eye Frame"
                            />
                            {/* Remaining Points Text inside the eye outline */}
                            <span 
                              className={`relative z-10 font-bold font-mono ${15 - wxSkills.length > 0 ? "text-amber-400" : "text-stone-400"} text-[10px] sm:text-xs md:text-sm mt-[6%] drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.85)]`}
                            >
                              {15 - wxSkills.length}
                            </span>
                          </div>
                        </div>

                        {/* Clipped background layers wrapper */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                          {/* Scroll Paper Background */}
                          <img
                            src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/scroll_background.png`}
                            className="absolute inset-0 w-full h-full object-fill select-none opacity-95 brightness-90 scale-105"
                            alt="Scroll Paper Background"
                          />

                          {/* Gears Background Overlay */}
                          <img
                            src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/wx78_background.png`}
                            className="absolute inset-0 w-full h-full object-cover select-none opacity-85 brightness-95"
                            alt="WX-78 Skill Tree Gears"
                          />
                        </div>


                        {/* SVG Connections Overlay */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 3 }}
                        >

                          <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Draw background lines first */}
                          {Object.values(WX78_SKILL_TREE).map((node) => {
                            return node.connects.map((childId) => {
                              const childNode = (WX78_SKILL_TREE as any)[childId];
                              if (!childNode) return null;

                              const p1 = getNodePosPct(node.pos);
                              const p2 = getNodePosPct(childNode.pos);
                              const x1 = p1.x;
                              const y1 = p1.y;
                              const x2 = p2.x;
                              const y2 = p2.y;

                              const isParentActive = wxSkills.includes(node.id);
                              const isChildActive = wxSkills.includes(childId);
                              const isActive = isParentActive && isChildActive;
                              const isConnecting = isParentActive && !isChildActive && canUnlockSkill(childId, wxSkills, celestialDefeated, shadowDefeated);

                              let strokeColor = "#292524"; // stone-800
                              let strokeWidth = "1.5";
                              let strokeDash = undefined;
                              let filter = undefined;

                              if (isActive) {
                                strokeColor = node.group === "allegiance" ? "#10b981" : "#f59e0b"; // emerald or amber
                                strokeWidth = "2.5";
                                filter = "url(#glow)";
                              } else if (isConnecting) {
                                strokeColor = "#78716c"; // stone-500
                                strokeWidth = "1.5";
                                strokeDash = "3,3";
                              }

                              return (
                                <line
                                  key={`line-${node.id}-${childId}`}
                                  x1={`${x1}%`}
                                  y1={`${y1}%`}
                                  x2={`${x2}%`}
                                  y2={`${y2}%`}
                                  stroke={strokeColor}
                                  strokeWidth={strokeWidth}
                                  strokeDasharray={strokeDash}
                                  filter={filter}
                                  className="transition-all duration-300"
                                />
                              );
                            });
                          })}

                          {/* Draw Lock connections */}
                          {Object.values(WX78_SKILL_TREE).filter(n => n.locks && n.locks.length > 0).map((node) => {
                            return node.locks!.map((lockId) => {
                              const lockNode = (WX78_SKILL_TREE as any)[lockId];
                              if (!lockNode) return null;

                              const p1 = getNodePosPct(node.pos);
                              const p2 = getNodePosPct(lockNode.pos);
                              const x1 = p1.x;
                              const y1 = p1.y;
                              const x2 = p2.x;
                              const y2 = p2.y;

                              const isLockOpen =
                                wxSkills.includes("wx78_extrabody_1") &&
                                (lockId === "wx78_allegiance_lunar_lock_1" ? !wxSkills.includes("wx78_allegiance_shadow") && celestialDefeated : !wxSkills.includes("wx78_allegiance_lunar") && shadowDefeated);

                              const isSkillActive = wxSkills.includes(node.id);

                              let strokeColor = "#292524"; // stone-800
                              let strokeWidth = "1.5";
                              let filter = undefined;

                              if (isSkillActive && isLockOpen) {
                                strokeColor = "#10b981"; // emerald-500
                                strokeWidth = "2.5";
                                filter = "url(#glow)";
                              } else if (isLockOpen) {
                                strokeColor = "#f59e0b"; // amber-500
                                strokeWidth = "1.5";
                              }

                              return (
                                <line
                                  key={`line-${node.id}-${lockId}`}
                                  x1={`${x1}%`}
                                  y1={`${y1}%`}
                                  x2={`${x2}%`}
                                  y2={`${y2}%`}
                                  stroke={strokeColor}
                                  strokeWidth={strokeWidth}
                                  filter={filter}
                                  className="transition-all duration-300"
                                />
                              );
                            });
                          })}
                        </svg>

                        {/* Render Node Buttons */}
                        {Object.values(WX78_SKILL_TREE).map((node) => {
                          const p = getNodePosPct(node.pos);
                          const left_pct = p.x;
                          const top_pct = p.y;

                          const isActive = wxSkills.includes(node.id);

                          if (node.isLock) {
                            const maxbodiesActive = wxSkills.includes("wx78_extrabody_1");
                            const isLunar = node.id === "wx78_allegiance_lunar_lock_1";
                            const noOpposingAlliance = isLunar ? !wxSkills.includes("wx78_allegiance_shadow") : !wxSkills.includes("wx78_allegiance_lunar");
                            const bossDefeated = isLunar ? celestialDefeated : shadowDefeated;

                            const requirementsMet = maxbodiesActive && noOpposingAlliance;
                            const isLockOpen = requirementsMet && bossDefeated;

                            // Determine lock state frames
                            const lockBgFrame = isLockOpen
                              ? "node_selected.png"
                              : (requirementsMet ? "node_unselected.png" : "node_locked.png");

                            const lockGlowClass = isLockOpen
                              ? "drop-shadow-[0_0_6px_rgba(16,185,129,0.85)]"
                              : (requirementsMet ? "drop-shadow-[0_0_6px_rgba(245,158,11,0.7)] animate-pulse" : "opacity-60");

                            const lockIconColorClass = isLockOpen
                              ? "text-emerald-400"
                              : (requirementsMet ? "text-amber-400 animate-pulse" : "text-stone-500");

                            return (
                              <div
                                key={node.id}
                                style={{
                                  left: `${left_pct}%`,
                                  top: `${top_pct}%`,
                                  transform: "translate(-50%, -50%)",
                                }}
                                className="absolute z-10 group/node hover:z-30"
                              >
                                <button
                                  onClick={() => {
                                    if (isLunar) {
                                      setCelestialDefeated(prev => {
                                        const next = !prev;
                                        if (!next) {
                                          setWxSkills(skills => getValidSkills(skills, false, shadowDefeated));
                                        }
                                        return next;
                                      });
                                    } else {
                                      setShadowDefeated(prev => {
                                        const next = !prev;
                                        if (!next) {
                                          setWxSkills(skills => getValidSkills(skills, celestialDefeated, false));
                                        }
                                        return next;
                                      });
                                    }
                                  }}
                                  className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none bg-transparent border-none outline-none"
                                >
                                  {/* Background frame image */}
                                  <img
                                    src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/${lockBgFrame}`}
                                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-300 ${lockGlowClass}`}
                                    alt="lock-bg"
                                  />
                                  {/* Icon centered on top of frame */}
                                  <div className={`relative z-10 flex items-center justify-center transition-all duration-300 ${lockIconColorClass}`}>
                                    {isLockOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                  </div>
                                </button>

                                {/* Lock Node Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-905 border border-stone-800 rounded-lg p-2 shadow-xl opacity-0 scale-95 pointer-events-none group-hover/node:opacity-100 group-hover/node:scale-100 transition-all duration-200 z-50 text-stone-300 text-[10px] space-y-1 font-sans">
                                  <div className="font-bold text-white text-xs">{node.title_zh}</div>
                                  <div className="text-stone-500 font-mono">{node.title_en}</div>
                                  <hr className="border-stone-800 my-1" />
                                  <div className="text-[9px] leading-relaxed text-stone-400">
                                    {node.desc_zh}
                                  </div>
                                  <hr className="border-stone-800 my-1" />
                                  <div className="flex items-center justify-between text-[9px] font-bold">
                                    <span>解鎖狀態:</span>
                                    <span className={isLockOpen ? "text-emerald-400" : requirementsMet ? "text-amber-400" : "text-rose-400"}>
                                      {isLockOpen ? "已開啟" : requirementsMet ? "可點擊解鎖" : "前置未達"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          const isUnlockable = canUnlockSkill(node.id, wxSkills, celestialDefeated, shadowDefeated);

                          // Determine background frame and styling
                          const nodeBgFrame = isActive
                            ? "node_selected.png"
                            : (isUnlockable ? "node_unselected.png" : "node_locked.png");

                          const nodeGlowClass = isActive
                            ? (node.group === "allegiance"
                              ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.95)]"
                              : "drop-shadow-[0_0_8px_rgba(245,158,11,0.95)]")
                            : "";

                          return (
                            <div
                              key={node.id}
                              style={{
                                left: `${left_pct}%`,
                                top: `${top_pct}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                              className="absolute z-10 group/node hover:z-30"
                            >
                              <button
                                onClick={() => {
                                  if (isActive) {
                                    const nextSkills = wxSkills.filter(id => id !== node.id);
                                    setWxSkills(getValidSkills(nextSkills, celestialDefeated, shadowDefeated));
                                  } else if (isUnlockable) {
                                    setWxSkills([...wxSkills, node.id]);
                                  }
                                }}
                                className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 active:scale-95 select-none focus:outline-none bg-transparent border-none outline-none ${isUnlockable ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
                              >
                                {/* Background frame image */}
                                <img
                                  src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/${nodeBgFrame}`}
                                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-300 ${nodeGlowClass} ${isActive ? "" : isUnlockable ? "group-hover/node:brightness-110" : "opacity-65"}`}
                                  alt="node-bg"
                                />
                                {/* Skill Icon */}
                                <img
                                  src={`${(import.meta as any).env.BASE_URL || "/"}images/skilltree/${node.icon}.png`}
                                  className={`relative z-10 w-[62%] h-[62%] object-contain pointer-events-none transition-all duration-300 ${isActive ? "" : isUnlockable ? "grayscale-0 opacity-85 group-hover/node:opacity-100 group-hover/node:scale-105" : "grayscale opacity-50 brightness-75"}`}
                                  alt={node.title_zh}
                                />
                              </button>

                              {/* Skill Node Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-stone-900 border border-stone-850 rounded-lg p-2.5 shadow-xl opacity-0 scale-95 pointer-events-none group-hover/node:opacity-100 group-hover/node:scale-100 transition-all duration-200 z-50 text-stone-300 text-xs space-y-1.5 font-sans">
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-white">{node.title_zh}</span>
                                  {isActive && (
                                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-serif font-bold shrink-0">
                                      已啟動
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stone-500 font-mono">{node.title_en}</div>
                                <hr className="border-stone-850" />
                                <p className="text-[10px] text-stone-400 leading-normal">
                                  {node.desc_zh}
                                </p>
                                <hr className="border-stone-850" />
                                <div className="flex items-center justify-between text-[9px] text-stone-500">
                                  <span>分組: {
                                    node.group === "circuitry" ? "電路插槽" :
                                      node.group === "chassis" ? "機體備用" :
                                        node.group === "drones" ? "無人機系統" : "陣營信仰"
                                  }</span>
                                  {isActive ? (
                                    <span className="text-amber-500 font-bold">點擊退還點數</span>
                                  ) : isUnlockable ? (
                                    <span className="text-emerald-500 font-bold">點擊啟動 (消耗1點)</span>
                                  ) : (
                                    <span className="text-rose-500">前置鎖定/點數不足</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Top Block: Real-time Stats & Favorite Food */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 mb-6 font-sans">
                    {/* Dynamic Stats */}
                    <div className="md:col-span-8 bg-stone-950/20 border border-stone-850 rounded-xl p-4">
                      <h3 className="text-sm font-serif font-bold text-amber-500 mb-4 pb-1 border-b border-stone-850 flex items-center gap-1.5">
                        <Layers className="h-4 w-4" />
                        動態屬性值 (Real-time Stats)
                      </h3>

                      <div className="space-y-4">
                        {/* Health Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                              <StateIcon
                                type="hp"
                                className="w-4.5 h-4.5 object-contain"
                              />
                              生命值 (Health)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              <span className="text-red-400">
                                {calculatedStats.health}
                              </span>
                              <span className="text-stone-600"> / 400</span>
                              <span className="text-[10px] text-stone-500 ml-1">
                                (100 + {calculatedStats.health - 100})
                              </span>
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-850 p-0.5">
                            <div
                              className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full transition-all duration-300 shadow-inner"
                              style={{
                                width: `${(calculatedStats.health / 400) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Hunger Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                              <StateIcon
                                type="hunger"
                                className="w-4.5 h-4.5 object-contain"
                              />
                              飢餓值 (Hunger)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              <span className="text-amber-500">
                                {calculatedStats.hunger}
                              </span>
                              <span className="text-stone-600"> / 400</span>
                              <span className="text-[10px] text-stone-500 ml-1">
                                (100 + {calculatedStats.hunger - 100})
                              </span>
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-850 p-0.5">
                            <div
                              className="h-full bg-gradient-to-r from-amber-700 to-amber-550 rounded-full transition-all duration-300 shadow-inner"
                              style={{
                                width: `${(calculatedStats.hunger / 400) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Sanity Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                              <StateIcon
                                type="sanity"
                                className="w-4.5 h-4.5 object-contain"
                              />
                              理智值 (Sanity)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              <span className="text-cyan-400">
                                {calculatedStats.sanity}
                              </span>
                              <span className="text-stone-600"> / 400</span>
                              <span className="text-[10px] text-stone-500 ml-1">
                                (100 + {calculatedStats.sanity - 100})
                              </span>
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-850 p-0.5">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-700 to-cyan-550 rounded-full transition-all duration-300 shadow-inner"
                              style={{
                                width: `${(calculatedStats.sanity / 400) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Extra Status Buffs */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {/* Speed */}
                        {calculatedStats.speedBonus > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/60 text-amber-300 border-amber-500/30 font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3 shrink-0" />
                            移動速度: +{calculatedStats.speedBonus}%
                          </span>
                        )}
                        {/* Light */}
                        {calculatedStats.light && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-yellow-950/40 text-yellow-300 border-yellow-500/30 font-medium flex items-center gap-1">
                            <Lightbulb className="h-3 w-3 shrink-0" />
                            隨身光源: 已啟用
                          </span>
                        )}
                        {/* Warmth */}
                        {calculatedStats.thermal && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-orange-950/60 text-orange-300 border-orange-500/30 font-medium flex items-center gap-1">
                            <Flame className="h-3 w-3 shrink-0" />
                            體溫調溫: 熱源 (防寒)
                          </span>
                        )}
                        {/* Cool */}
                        {calculatedStats.refrigerant && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-sky-950/60 text-sky-300 border-sky-500/30 font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3 shrink-0" />
                            體溫調溫: 冷源 (散熱)
                          </span>
                        )}
                        {/* Sanity Regen */}
                        {calculatedStats.sanityRegen > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-cyan-950/40 text-cyan-300 border-cyan-500/30 font-medium flex items-center gap-1">
                            <Eye className="h-3 w-3 shrink-0" />
                            理智回復: +{calculatedStats.sanityRegen}/分
                          </span>
                        )}
                        {/* Health Regen */}
                        {calculatedStats.healthRegen > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-rose-950/40 text-rose-300 border-rose-500/30 font-medium flex items-center gap-1">
                            <Heart className="h-3 w-3 shrink-0" />
                            生命回復: +{calculatedStats.healthRegen}/分
                          </span>
                        )}
                        {/* Hunger rate reduction */}
                        {calculatedStats.hungerRateText !== "" && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-emerald-950/40 text-emerald-300 border-emerald-500/30 font-medium flex items-center gap-1">
                            <Soup className="h-3 w-3 shrink-0" />
                            飢餓減緩: {calculatedStats.hungerRateText}
                          </span>
                        )}
                        {/* Damage Reduction */}
                        {calculatedStats.physicalReduction !== "" && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-rose-950/40 text-rose-300 border-rose-500/30 font-medium flex items-center gap-1">
                            <Layers className="h-3 w-3 shrink-0" />
                            物理減免: {calculatedStats.physicalReduction}
                          </span>
                        )}
                        {/* Electric retaliate */}
                        {calculatedStats.hasElectric && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/40 text-yellow-400 border-amber-500/30 font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3 shrink-0 text-yellow-400" />
                            電氣化: 20點帶電反傷
                          </span>
                        )}
                        {/* Pocket expansion */}
                        {calculatedStats.pocketCount > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-900 border-stone-700 text-stone-300 font-medium flex items-center gap-1">
                            <Compass className="h-3 w-3 shrink-0" />
                            空間擴展: {calculatedStats.pocketCount}個擴展物品欄
                          </span>
                        )}
                        {/* Redigest */}
                        {calculatedStats.hasDigest && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-emerald-950/20 text-emerald-300 border-emerald-500/30 font-medium flex items-center gap-1">
                            <Soup className="h-3 w-3 shrink-0" />
                            再消化: 可食變質物產營養磚
                          </span>
                        )}
                        {/* Chess count */}
                        {calculatedStats.chessBonus > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-indigo-950/40 text-indigo-300 border-indigo-500/30 font-medium flex items-center gap-1">
                            <UserCheck className="h-3 w-3 shrink-0" />
                            棋聖: 發條上限 +{calculatedStats.chessBonus}
                          </span>
                        )}
                        {/* Parrying block */}
                        {calculatedStats.hasBlock && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-950 text-stone-200 border-stone-605 font-medium flex items-center gap-1">
                            <Layers className="h-3 w-3 shrink-0" />
                            格擋: 80%防禦並持續嘲諷
                          </span>
                        )}
                        {/* Sonic fear */}
                        {calculatedStats.hasSonic && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-rose-950/40 text-rose-300 border-rose-500/30 font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3 shrink-0 text-rose-400" />
                            聲波激發: 驚醒/恐懼周圍生物
                          </span>
                        )}
                        {/* Spin harvesting */}
                        {calculatedStats.hasSpin && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/40 text-amber-200 border-amber-500/30 font-medium flex items-center gap-1">
                            <RotateCcw className="h-3 w-3 shrink-0 animate-spin" />
                            旋轉週期: 工作/攻擊旋轉收割
                          </span>
                        )}
                        {/* Backup Chassis Limit */}
                        {calculatedStats.backupChassisLimit > 0 && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/20 text-amber-300 border-amber-500/20 font-medium flex items-center gap-1">
                            <Cpu className="h-3 w-3 shrink-0 text-amber-400" />
                            冷啟動: 備用機體上限 {calculatedStats.backupChassisLimit} 個
                          </span>
                        )}
                        {/* Warm Standby */}
                        {calculatedStats.hasWarmStandby && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/25 text-amber-200 border-amber-500/30 font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3 shrink-0 text-amber-400" />
                            熱啟動: 備用機體電路保持運作
                          </span>
                        )}
                        {/* Remote Transfer */}
                        {calculatedStats.hasRemoteTransfer && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/40 text-amber-200 border-amber-500/30 font-medium flex items-center gap-1">
                            <Compass className="h-3 w-3 shrink-0 text-amber-400" />
                            意識傳輸: 可遠端傳輸意識
                          </span>
                        )}
                        {/* Drones */}
                        {calculatedStats.hasScoutDrone && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-900 border-stone-800 text-stone-300 font-medium flex items-center gap-1">
                            <Cpu className="h-3 w-3 shrink-0 text-stone-500" />
                            探路無人機 (Scott) 可製作
                          </span>
                        )}
                        {/* Delivery Drone */}
                        {calculatedStats.hasDeliveryDrone && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-900 border-stone-800 text-stone-300 font-medium flex items-center gap-1">
                            <Cpu className="h-3 w-3 shrink-0 text-stone-500" />
                            運輸無人機 (Drew) 可製作
                          </span>
                        )}
                        {/* Zap Drone */}
                        {calculatedStats.hasZapDrone && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-900 border-stone-800 text-stone-300 font-medium flex items-center gap-1">
                            <Cpu className="h-3 w-3 shrink-0 text-stone-500" />
                            電擊無人機 (Jules) 可製作
                          </span>
                        )}
                        {/* Signal Booster */}
                        {calculatedStats.hasSignalBooster && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-amber-900/40 text-amber-200 border-amber-500/30 font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3 shrink-0 text-amber-400" />
                            信號放大: 探測與作戰範圍提升
                          </span>
                        )}
                        {/* Lunar Vessel */}
                        {calculatedStats.hasLunarVessel && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-emerald-950/40 text-emerald-300 border-emerald-500/30 font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3 shrink-0 text-emerald-400" />
                            信仰親和: 亮白容器 (天體屬性)
                          </span>
                        )}
                        {/* Shadow Servitor */}
                        {calculatedStats.hasShadowServitor && (
                          <span className="text-[11px] px-2 py-1 rounded-md border bg-purple-950/40 text-purple-300 border-purple-500/30 font-medium flex items-center gap-1">
                            <Eye className="h-3 w-3 shrink-0 text-purple-400" />
                            信仰親和: 暗影伺服 (暗影屬性)
                          </span>
                        )}
                        {/* Empty placeholder */}
                        {calculatedStats.speedBonus === 0 &&
                          !calculatedStats.light &&
                          !calculatedStats.thermal &&
                          !calculatedStats.refrigerant &&
                          calculatedStats.sanityRegen === 0 &&
                          calculatedStats.healthRegen === 0 &&
                          calculatedStats.hungerRateText === "" &&
                          calculatedStats.physicalReduction === "" &&
                          !calculatedStats.hasElectric &&
                          calculatedStats.pocketCount === 0 &&
                          !calculatedStats.hasDigest &&
                          calculatedStats.chessBonus === 0 &&
                          !calculatedStats.hasBlock &&
                          !calculatedStats.hasSonic &&
                          !calculatedStats.hasSpin &&
                          calculatedStats.backupChassisLimit === 0 &&
                          !calculatedStats.hasWarmStandby &&
                          !calculatedStats.hasRemoteTransfer &&
                          !calculatedStats.hasScoutDrone &&
                          !calculatedStats.hasDeliveryDrone &&
                          !calculatedStats.hasZapDrone &&
                          !calculatedStats.hasSignalBooster &&
                          !calculatedStats.hasLunarVessel &&
                          !calculatedStats.hasShadowServitor && (
                            <span className="text-[11px] px-2 py-1 rounded-md border bg-stone-950/20 text-stone-500 border-stone-850 font-medium">
                              無特殊加成狀態 (無晶片裝載與天賦啟用)
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Favorite Food */}
                    <div className="md:col-span-4 bg-stone-950/40 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-serif font-bold text-amber-500 mb-2 flex items-center gap-1.5">
                          <Soup className="h-4 w-4 text-amber-500" />
                          最愛料理 (Favorite Food)
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed mb-4">
                          {currentCharacter.favoriteFoodBonus}
                        </p>
                      </div>
                      <button
                        onClick={handleFavoriteFoodClick}
                        className="w-full py-2 px-3 bg-stone-850 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-lg text-[11px] font-semibold text-amber-500 hover:text-amber-400 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                      >
                        <span>在食譜庫中檢索「蝴蝶松餅」</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <hr className="border-stone-850 my-6" />

                  {/* Middle Block: Circuit Upgrade System */}
                  <div className="relative z-10 mb-6 font-sans">
                    <h3 className="text-sm font-serif font-bold text-amber-500 mb-4 pb-1 border-b border-stone-850 flex items-center gap-1.5">
                      <Cpu className="h-4 w-4" />
                      電路板升級系統 (Circuit Upgrade System)
                    </h3>

                    {/* Quick Preset Buttons */}
                    <div className="mb-4 flex flex-wrap gap-2 items-center bg-stone-900 border border-stone-800 rounded-xl p-3">
                      <span className="text-xs text-stone-400 font-bold font-serif flex items-center gap-1 shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        一鍵裝載預設：
                      </span>
                      <button
                        onClick={() => setWxCircuits([
                          "alpha_health_2", "alpha_hunger_2", "alpha_sanity_2",
                          "beta_speed_2", "beta_nightvision", "beta_range",
                          "gamma_chess"
                        ])}
                        className="px-3 py-1.5 text-xs bg-stone-850 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-lg text-amber-300 transition cursor-pointer font-bold"
                      >
                        前期下地 🎒
                      </button>
                      <button
                        onClick={() => setWxCircuits([
                          "alpha_health_2", "alpha_combo_1", "alpha_hunger_2",
                          "beta_speed_2", "beta_speed_2", "beta_electric", "beta_light_2",
                          "gamma_chess", "gamma_spin", "gamma_spin"
                        ])}
                        className="px-3 py-1.5 text-xs bg-stone-850 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-lg text-amber-300 transition cursor-pointer font-bold"
                      >
                        常用萬金油 🌟
                      </button>
                      <button
                        onClick={() => setWxCircuits([
                          "alpha_health_2", "alpha_combo_1", "alpha_hunger_2",
                          "beta_speed_2", "beta_speed_2", "beta_thermal",
                          "gamma_chess", "gamma_spin", "gamma_spin"
                        ])}
                        className="px-3 py-1.5 text-xs bg-stone-850 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-lg text-amber-300 transition cursor-pointer font-bold"
                      >
                        冬季 ❄️
                      </button>
                      <button
                        onClick={() => setWxCircuits([
                          "alpha_health_2", "alpha_combo_1", "alpha_hunger_2",
                          "beta_speed_2", "beta_speed_2", "beta_refrigerant",
                          "gamma_chess", "gamma_spin", "gamma_spin"
                        ])}
                        className="px-3 py-1.5 text-xs bg-stone-850 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-lg text-amber-300 transition cursor-pointer font-bold"
                      >
                        夏季 ☀️
                      </button>
                    </div>

                    {/* Beginner Circuit Suggestions Button */}
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => setShowCircuitSuggestions(true)}
                        className="px-3.5 py-2 text-xs bg-amber-600 hover:bg-amber-500 border border-amber-600 hover:border-amber-500 rounded-lg text-stone-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/20 active:scale-95 duration-200"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        新手電路獲取建議 💡
                      </button>
                    </div>

                    {/* Equipped Circuits List / Log */}
                    <div className="bg-stone-950 border border-stone-850 rounded-xl p-3 min-h-[80px] flex flex-col justify-center mb-6">
                      {wxCircuits.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-stone-500">
                            尚未安裝任何電路板
                          </p>
                          <p className="text-[10px] text-stone-600 mt-1">
                            點擊下方各分類清單中的「＋安裝」來裝載屬性
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>已裝載晶片 ({wxCircuits.length})</span>
                            <button
                              onClick={() => setWxCircuits([])}
                              className="text-red-500 hover:text-red-400 hover:underline cursor-pointer font-bold lowercase text-[10px]"
                            >
                              清空全部
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {wxCircuits.map((cId, idx) => {
                              const circ = currentCharacter.circuits?.find(
                                (c) => c.id === cId,
                              );
                              if (!circ) return null;
                              return (
                                <div
                                  key={`${cId}-${idx}`}
                                  className="inline-flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded px-2 py-0.5 text-xs text-stone-300"
                                >
                                  <CircuitImage circuitId={cId} className="w-4 h-4 object-contain shrink-0" />
                                  <span>{circ.name}</span>
                                  <span className="text-[9px] text-stone-500 font-mono">
                                    ({circ.slots}P)
                                  </span>
                                  <button
                                    onClick={() => handleUninstallCircuit(idx)}
                                    className="text-red-500 hover:text-red-400 font-bold ml-1 px-0.5 cursor-pointer text-[10px]"
                                    title="解除裝載"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3 Columns in parallel */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Alpha Slots & Available Boards */}
                      <div className="bg-stone-950/20 border border-stone-850/50 rounded-xl p-4 flex flex-col gap-4">
                        {/* Alpha Slot Visualizer */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-rose-400 font-bold font-serif flex items-center gap-1">
                              🟥 阿爾法插槽 (Alpha Slots)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              {totalSlotsUsed.alpha} / {maxSlots}
                            </span>
                          </div>
                          <div className={`grid gap-2 ${maxSlots === 7 ? "grid-cols-7" : "grid-cols-6"}`}>
                            {(() => {
                              let currentSlotNum = 1;
                              return slotsAllocation.alpha.map((slot, index) => {
                                if (slot.empty) {
                                  const displayNum = currentSlotNum;
                                  currentSlotNum += 1;
                                  return (
                                    <div
                                      key={`empty-alpha-${index}`}
                                      className="w-full h-10 md:h-12 rounded-xl border border-dashed border-rose-900/20 bg-stone-950/60 flex items-center justify-center text-[10px] text-stone-700 font-mono select-none"
                                      title={`阿爾法插槽 ${displayNum} (空)`}
                                    >
                                      α-{displayNum}
                                    </div>
                                  );
                                } else {
                                  const startSlot = currentSlotNum;
                                  currentSlotNum += slot.slots!;
                                  const endSlot = currentSlotNum - 1;
                                  const slotRangeStr = startSlot === endSlot ? `${startSlot}` : `${startSlot}-${endSlot}`;
                                  return (
                                    <button
                                      key={`filled-alpha-${index}`}
                                      onClick={() =>
                                        handleUninstallCircuit(slot.originalIndex!)
                                      }
                                      style={{ gridColumn: `span ${slot.slots}` }}
                                      className={`h-10 md:h-12 rounded-xl border p-1 flex items-center justify-center gap-1 transition-all cursor-pointer hover:brightness-125 hover:scale-105 active:scale-95 ${slot.color}`}
                                      title={`${slot.name} (佔用插槽 ${slotRangeStr}/${maxSlots}) - 點擊解除安裝`}
                                    >
                                      <CircuitImage circuitId={slot.circuitId!} className="w-7 h-7 object-contain" />
                                    </button>
                                  );
                                }
                              });
                            })()}
                          </div>
                        </div>

                        {/* Alpha Available Circuits List */}
                        <div className="border-t border-stone-850/60 pt-4 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-rose-400 bg-rose-950/20 px-2.5 py-1.5 rounded-lg border border-rose-900/30 mb-2.5 flex items-center justify-between font-serif">
                            <span>阿爾法電路 (物理與三維)</span>
                            <span className="text-[10px] text-rose-500 font-mono">
                              α - Alpha
                            </span>
                          </div>

                          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                            {currentCharacter.circuits
                              ?.filter((c) => c.type === "alpha")
                              .map((circuit) => {
                                const currentCount = wxCircuits.filter(
                                  (id) => id === circuit.id,
                                ).length;
                                const isLimitReached =
                                  currentCount >= circuit.maxCount;
                                const isSlotsExceeded =
                                  totalSlotsUsed.alpha + circuit.slots > maxSlots;
                                const canEquip =
                                  !isLimitReached && !isSlotsExceeded;

                                let colorTheme =
                                  "border-stone-850 bg-stone-950/20";
                                if (currentCount > 0) {
                                  colorTheme =
                                    "border-rose-500/20 bg-rose-950/5";
                                }

                                const isExpanded =
                                  !!expandedCircuitIds[circuit.id];

                                return (
                                  <div
                                    key={circuit.id}
                                    className={`w-full rounded-xl border transition-all overflow-hidden flex flex-col ${colorTheme}`}
                                  >
                                    {/* Header Toggle Row */}
                                    <div
                                      onClick={() =>
                                        toggleCircuitExpand(circuit.id)
                                      }
                                      className="w-full flex items-center justify-between p-2 hover:bg-stone-900/40 transition cursor-pointer select-none"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <ChevronRight
                                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-stone-500 ${isExpanded
                                            ? "rotate-90 text-rose-400"
                                            : ""
                                            }`}
                                        />
                                        <CircuitImage circuitId={circuit.id} className="w-6 h-6 object-contain shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-xs text-white truncate">
                                            {circuit.name}
                                          </h4>
                                          <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono text-stone-400">
                                            <span className="bg-stone-900 px-1 rounded text-stone-300">
                                              {circuit.slots}P
                                            </span>
                                            {currentCount > 0 && (
                                              <span className="bg-rose-950/40 text-rose-400 font-bold px-1 rounded">
                                                已裝 {currentCount}/
                                                {circuit.maxCount}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Install Button (Alpha) */}
                                      <button
                                        disabled={!canEquip}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInstallCircuit(circuit);
                                        }}
                                        className={`shrink-0 text-[9px] px-2 py-1 rounded transition font-bold font-serif shadow-sm ml-2 ${isLimitReached
                                          ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                          : isSlotsExceeded
                                            ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                            : "text-rose-400 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-600 hover:text-stone-950 cursor-pointer"
                                          }`}
                                      >
                                        {isLimitReached
                                          ? "已達上限"
                                          : isSlotsExceeded
                                            ? "插槽不足"
                                            : "＋ 安裝"}
                                      </button>
                                    </div>

                                    {/* Collapsible Details (Alpha) */}
                                    <AnimatePresence initial={false}>
                                      {isExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="border-t border-stone-850/50 bg-stone-950/40 p-2.5 text-[10px] space-y-1 text-stone-300 font-sans"
                                        >
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              英文名稱:
                                            </span>{" "}
                                            <span className="font-mono text-stone-400">
                                              {circuit.englishName}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              功能效果:
                                            </span>{" "}
                                            <span className="text-rose-300 font-medium">
                                              {circuit.effect}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              製作配方:
                                            </span>{" "}
                                            <span className="font-mono">
                                              {circuit.recipe}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              掃描對象:
                                            </span>{" "}
                                            <span className="text-rose-400 font-mono">
                                              {circuit.scanTarget}
                                            </span>
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

                      {/* Beta Slots & Available Boards */}
                      <div className="bg-stone-950/20 border border-stone-850/50 rounded-xl p-4 flex flex-col gap-4">
                        {/* Beta Slot Visualizer */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-amber-400 font-bold font-serif flex items-center gap-1">
                              🟨 貝塔插槽 (Beta Slots)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              {totalSlotsUsed.beta} / {maxSlots}
                            </span>
                          </div>
                          <div className={`grid gap-2 ${maxSlots === 7 ? "grid-cols-7" : "grid-cols-6"}`}>
                            {(() => {
                              let currentSlotNum = 1;
                              return slotsAllocation.beta.map((slot, index) => {
                                if (slot.empty) {
                                  const displayNum = currentSlotNum;
                                  currentSlotNum += 1;
                                  return (
                                    <div
                                      key={`empty-beta-${index}`}
                                      className="w-full h-10 md:h-12 rounded-xl border border-dashed border-amber-900/20 bg-stone-950/60 flex items-center justify-center text-[10px] text-stone-700 font-mono select-none"
                                      title={`貝塔插槽 ${displayNum} (空)`}
                                    >
                                      β-{displayNum}
                                    </div>
                                  );
                                } else {
                                  const startSlot = currentSlotNum;
                                  currentSlotNum += slot.slots!;
                                  const endSlot = currentSlotNum - 1;
                                  const slotRangeStr = startSlot === endSlot ? `${startSlot}` : `${startSlot}-${endSlot}`;
                                  return (
                                    <button
                                      key={`filled-beta-${index}`}
                                      onClick={() =>
                                        handleUninstallCircuit(slot.originalIndex!)
                                      }
                                      style={{ gridColumn: `span ${slot.slots}` }}
                                      className={`h-10 md:h-12 rounded-xl border p-1 flex items-center justify-center gap-1 transition-all cursor-pointer hover:brightness-125 hover:scale-105 active:scale-95 ${slot.color}`}
                                      title={`${slot.name} (佔用插槽 ${slotRangeStr}/${maxSlots}) - 點擊解除安裝`}
                                    >
                                      <CircuitImage circuitId={slot.circuitId!} className="w-7 h-7 object-contain" />
                                    </button>
                                  );
                                }
                              });
                            })()}
                          </div>
                        </div>

                        {/* Beta Available Circuits List */}
                        <div className="border-t border-stone-850/60 pt-4 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-amber-400 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-900/30 mb-2.5 flex items-center justify-between font-serif">
                            <span>貝塔電路 (速度與功能)</span>
                            <span className="text-[10px] text-amber-500 font-mono">
                              β - Beta
                            </span>
                          </div>

                          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                            {currentCharacter.circuits
                              ?.filter((c) => c.type === "beta")
                              .map((circuit) => {
                                const currentCount = wxCircuits.filter(
                                  (id) => id === circuit.id,
                                ).length;
                                const isLimitReached =
                                  currentCount >= circuit.maxCount;
                                const isSlotsExceeded =
                                  totalSlotsUsed.beta + circuit.slots > maxSlots;
                                const canEquip =
                                  !isLimitReached && !isSlotsExceeded;

                                let colorTheme =
                                  "border-stone-855 bg-stone-950/20";
                                if (currentCount > 0) {
                                  colorTheme =
                                    "border-amber-500/20 bg-amber-950/5";
                                }

                                const isExpanded =
                                  !!expandedCircuitIds[circuit.id];

                                return (
                                  <div
                                    key={circuit.id}
                                    className={`w-full rounded-xl border transition-all overflow-hidden flex flex-col ${colorTheme}`}
                                  >
                                    {/* Header Toggle Row */}
                                    <div
                                      onClick={() =>
                                        toggleCircuitExpand(circuit.id)
                                      }
                                      className="w-full flex items-center justify-between p-2 hover:bg-stone-900/40 transition cursor-pointer select-none"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <ChevronRight
                                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-stone-500 ${isExpanded
                                            ? "rotate-90 text-amber-400"
                                            : ""
                                            }`}
                                        />
                                        <CircuitImage circuitId={circuit.id} className="w-6 h-6 object-contain shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-xs text-white truncate">
                                            {circuit.name}
                                          </h4>
                                          <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono text-stone-400">
                                            <span className="bg-stone-900 px-1 rounded text-stone-300">
                                              {circuit.slots}P
                                            </span>
                                            {currentCount > 0 && (
                                              <span className="bg-amber-950/40 text-amber-400 font-bold px-1 rounded">
                                                已裝 {currentCount}/
                                                {circuit.maxCount}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Install Button (Beta) */}
                                      <button
                                        disabled={!canEquip}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInstallCircuit(circuit);
                                        }}
                                        className={`shrink-0 text-[9px] px-2 py-1 rounded transition font-bold font-serif shadow-sm ml-2 ${isLimitReached
                                          ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                          : isSlotsExceeded
                                            ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                            : "text-amber-400 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-600 hover:text-stone-950 cursor-pointer"
                                          }`}
                                      >
                                        {isLimitReached
                                          ? "已達上限"
                                          : isSlotsExceeded
                                            ? "插槽不足"
                                            : "＋ 安裝"}
                                      </button>
                                    </div>

                                    {/* Collapsible Details (Beta) */}
                                    <AnimatePresence initial={false}>
                                      {isExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="border-t border-stone-850/50 bg-stone-950/40 p-2.5 text-[10px] space-y-1 text-stone-300 font-sans"
                                        >
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              英文名稱:
                                            </span>{" "}
                                            <span className="font-mono text-stone-400">
                                              {circuit.englishName}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              功能效果:
                                            </span>{" "}
                                            <span className="text-amber-300 font-medium">
                                              {circuit.effect}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              製作配方:
                                            </span>{" "}
                                            <span className="font-mono">
                                              {circuit.recipe}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              掃描對象:
                                            </span>{" "}
                                            <span className="text-amber-400 font-mono">
                                              {circuit.scanTarget}
                                            </span>
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

                      {/* Gamma Slots & Available Boards */}
                      <div className="bg-stone-950/20 border border-stone-850/50 rounded-xl p-4 flex flex-col gap-4">
                        {/* Gamma Slot Visualizer */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-emerald-400 font-bold font-serif flex items-center gap-1">
                              🟩 伽馬插槽 (Gamma Slots)
                            </span>
                            <span className="font-mono text-stone-400 font-bold">
                              {totalSlotsUsed.gamma} / {maxSlots}
                            </span>
                          </div>
                          <div className={`grid gap-2 ${maxSlots === 7 ? "grid-cols-7" : "grid-cols-6"}`}>
                            {(() => {
                              let currentSlotNum = 1;
                              return slotsAllocation.gamma.map((slot, index) => {
                                if (slot.empty) {
                                  const displayNum = currentSlotNum;
                                  currentSlotNum += 1;
                                  return (
                                    <div
                                      key={`empty-gamma-${index}`}
                                      className="w-full h-10 md:h-12 rounded-xl border border-dashed border-emerald-900/20 bg-stone-950/60 flex items-center justify-center text-[10px] text-stone-700 font-mono select-none"
                                      title={`伽馬插槽 ${displayNum} (空)`}
                                    >
                                      γ-{displayNum}
                                    </div>
                                  );
                                } else {
                                  const startSlot = currentSlotNum;
                                  currentSlotNum += slot.slots!;
                                  const endSlot = currentSlotNum - 1;
                                  const slotRangeStr = startSlot === endSlot ? `${startSlot}` : `${startSlot}-${endSlot}`;
                                  return (
                                    <button
                                      key={`filled-gamma-${index}`}
                                      onClick={() =>
                                        handleUninstallCircuit(slot.originalIndex!)
                                      }
                                      style={{ gridColumn: `span ${slot.slots}` }}
                                      className={`h-10 md:h-12 rounded-xl border p-1 flex items-center justify-center gap-1 transition-all cursor-pointer hover:brightness-125 hover:scale-105 active:scale-95 ${slot.color}`}
                                      title={`${slot.name} (佔用插槽 ${slotRangeStr}/${maxSlots}) - 點擊解除安裝`}
                                    >
                                      <CircuitImage circuitId={slot.circuitId!} className="w-7 h-7 object-contain" />
                                    </button>
                                  );
                                }
                              });
                            })()}
                          </div>
                        </div>

                        {/* Gamma Available Circuits List */}
                        <div className="border-t border-stone-850/60 pt-4 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-emerald-400 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-900/30 mb-2.5 flex items-center justify-between font-serif">
                            <span>探討與其他電路 (戰鬥與工作)</span>
                            <span className="text-[10px] text-emerald-500 font-mono">
                              γ - Gamma
                            </span>
                          </div>

                          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                            {currentCharacter.circuits
                              ?.filter((c) => c.type === "gamma")
                              .map((circuit) => {
                                const currentCount = wxCircuits.filter(
                                  (id) => id === circuit.id,
                                ).length;
                                const isLimitReached =
                                  currentCount >= circuit.maxCount;
                                const isSlotsExceeded =
                                  totalSlotsUsed.gamma + circuit.slots > maxSlots;
                                const canEquip =
                                  !isLimitReached && !isSlotsExceeded;

                                let colorTheme =
                                  "border-stone-855 bg-stone-950/20";
                                if (currentCount > 0) {
                                  colorTheme =
                                    "border-emerald-500/20 bg-emerald-950/5";
                                }

                                const isExpanded =
                                  !!expandedCircuitIds[circuit.id];

                                return (
                                  <div
                                    key={circuit.id}
                                    className={`w-full rounded-xl border transition-all overflow-hidden flex flex-col ${colorTheme}`}
                                  >
                                    {/* Header Toggle Row */}
                                    <div
                                      onClick={() =>
                                        toggleCircuitExpand(circuit.id)
                                      }
                                      className="w-full flex items-center justify-between p-2.5 hover:bg-stone-900/40 transition cursor-pointer select-none"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <ChevronRight
                                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-stone-500 ${isExpanded
                                            ? "rotate-90 text-emerald-400"
                                            : ""
                                            }`}
                                        />
                                        <CircuitImage circuitId={circuit.id} className="w-6 h-6 object-contain shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-xs text-white truncate">
                                            {circuit.name}
                                          </h4>
                                          <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono text-stone-400">
                                            <span className="bg-stone-900 px-1 rounded text-stone-300">
                                              {circuit.slots}P
                                            </span>
                                            {currentCount > 0 && (
                                              <span className="bg-emerald-950/40 text-emerald-400 font-bold px-1 rounded">
                                                已裝 {currentCount}/
                                                {circuit.maxCount}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Install Button (Gamma) */}
                                      <button
                                        disabled={!canEquip}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInstallCircuit(circuit);
                                        }}
                                        className={`shrink-0 text-[9px] px-2 py-1 rounded transition font-bold font-serif shadow-sm ml-2 ${isLimitReached
                                          ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                          : isSlotsExceeded
                                            ? "text-stone-600 bg-stone-900 border border-stone-850 cursor-not-allowed"
                                            : "text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-600 hover:text-stone-950 cursor-pointer"
                                          }`}
                                      >
                                        {isLimitReached
                                          ? "已達上限"
                                          : isSlotsExceeded
                                            ? "插槽不足"
                                            : "＋ 安裝"}
                                      </button>
                                    </div>

                                    {/* Collapsible Details (Gamma) */}
                                    <AnimatePresence initial={false}>
                                      {isExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="border-t border-stone-850/50 bg-stone-950/40 p-2.5 text-[10px] space-y-1 text-stone-300 font-sans"
                                        >
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              英文名稱:
                                            </span>{" "}
                                            <span className="font-mono text-stone-400">
                                              {circuit.englishName}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              功能效果:
                                            </span>{" "}
                                            <span className="text-emerald-300 font-medium">
                                              {circuit.effect}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              製作配方:
                                            </span>{" "}
                                            <span className="font-mono">
                                              {circuit.recipe}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-stone-500 font-mono">
                                              掃描對象:
                                            </span>{" "}
                                            <span className="text-emerald-400 font-mono">
                                              {circuit.scanTarget}
                                            </span>
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
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Beginner Circuit Suggestions Modal */}
      <AnimatePresence>
        {showCircuitSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCircuitSuggestions(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-stone-900 border border-stone-850 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col font-sans text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-850 bg-stone-950/40">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  <span className="font-serif font-bold text-lg text-white">
                    新手電路獲取建議
                  </span>
                </div>
                <button
                  onClick={() => setShowCircuitSuggestions(false)}
                  className="text-stone-400 hover:text-white transition text-xl font-bold px-2 py-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-stone-300 text-sm">
                
                {/* 遠古順序 */}
                <div>
                  <h3 className="text-sm font-serif font-bold text-amber-500 mb-3 pb-1 border-b border-stone-850 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    遠古順序 (推薦獲取流程)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { target: "蝶", scan: "蝴蝶、月蛾", desc: "處理器電路 (增加理智上限)", icon: <CircuitImage circuitId="alpha_sanity_1" className="w-16 h-16 object-contain" />, creatureImg: "butterfly.png" },
                      { target: "兔子", scan: "兔子", desc: "加速電路 (增加移動速度)", icon: <CircuitImage circuitId="beta_speed_1" className="w-16 h-16 object-contain" />, creatureImg: "rabbit.png" },
                      { target: "挖墳墓san歸零影怪", scan: "爬行恐懼、爬行夢魘、恐怖尖喙、夢魘尖喙、恐怖利爪、潛伏夢魘", desc: "超級處理器電路 (增加高額理智與理智恢復)", icon: <CircuitImage circuitId="alpha_sanity_2" className="w-16 h-16 object-contain" />, creatureImg: "shadow.png" },
                      { target: "蜘蛛腺體", scan: "蜘蛛", desc: "強化電路 (增加生命上限)", icon: <CircuitImage circuitId="alpha_health_1" className="w-16 h-16 object-contain" />, creatureImg: "spider.png" },
                      { target: "螢火蟲", scan: "螢火蟲", desc: "照明電路", icon: <CircuitImage circuitId="beta_light_1" className="w-16 h-16 object-contain" />, creatureImg: "firefly.png" },
                      { target: "地下球狀光蟲", scan: "魷魚、洞穴蠕蟲、球狀光蟲", desc: "超級照明電路", icon: <CircuitImage circuitId="beta_light_2" className="w-16 h-16 object-contain" />, creatureImg: "lightbug.png" },
                      { target: "裸鼴蝠", scan: "裸鼴鼠", desc: "聲波激發電路 (遇到等半分鐘有兩隻)", icon: <CircuitImage circuitId="gamma_sonic" className="w-16 h-16 object-contain" />, creatureImg: "molebat.png" },
                      { target: "發條戰車", scan: "發條戰車、損壞的發條戰車、遠古守衛者", desc: "超級加速電路", icon: <CircuitImage circuitId="beta_speed_2" className="w-16 h-16 object-contain" />, creatureImg: "rook.png" },
                      { target: "發條騎士", scan: "發條騎士、損壞的發條騎士、鍍金騎士", desc: "棋聖電路", icon: <CircuitImage circuitId="gamma_chess" className="w-16 h-16 object-contain" />, creatureImg: "clockwork_knight.png" },
                      { target: "啜食者", scan: "熊獾、啜食者", desc: "超級胃增益電路", icon: <CircuitImage circuitId="alpha_hunger_2" className="w-16 h-16 object-contain" />, creatureImg: "slurper.png" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3 rounded-lg bg-stone-950/40 border border-stone-850 hover:border-stone-800 transition">
                        <div className="bg-stone-900 p-2 rounded-lg border border-stone-800 shrink-0 flex items-center gap-2 animate-fade-in">
                          {item.icon}
                          <span className="text-stone-500 text-xs font-semibold">→</span>
                          <img
                            src={`${(import.meta as any).env.BASE_URL || "/"}images/creatures/${item.creatureImg}`}
                            className="w-16 h-16 object-contain shrink-0"
                            alt={item.target}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded font-mono shrink-0 scale-90">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white text-xs">{item.target}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{item.desc}</p>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">掃描對象: {item.scan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 常規生物與電路 */}
                <div>
                  <h3 className="text-sm font-serif font-bold text-amber-500 mb-3 pb-1 border-b border-stone-850 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-amber-500" />
                    常規生物與電路
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { target: "鼴鼠", scan: "鼴鼠", desc: "光電電路 (可夜視)", icon: <CircuitImage circuitId="beta_nightvision" className="w-16 h-16 object-contain" />, creatureImg: "mole.png" },
                      { target: "鳥", scan: "烏鴉、紅雀、雪雀、海鸚、金絲雀", desc: "增程電路 (無人機/聲波範圍)", icon: <CircuitImage circuitId="beta_range" className="w-16 h-16 object-contain" />, creatureImg: "bird.png" },
                      { target: "浣貓", scan: "浣貓", desc: "再消化電路 (食物效益)", icon: <CircuitImage circuitId="gamma_digest" className="w-16 h-16 object-contain" />, creatureImg: "catcoon.png" },
                      { target: "龍蠅", scan: "龍蠅、火焰獵犬、地熱蟎", desc: "熱能電路 (提供體溫加熱)", icon: <CircuitImage circuitId="beta_thermal" className="w-16 h-16 object-contain" />, creatureImg: "dragonfly.png" },
                      { target: "獵犬", scan: "獵犬", desc: "胃增益電路 (飢餓減緩)", icon: <CircuitImage circuitId="alpha_hunger_1" className="w-16 h-16 object-contain" />, creatureImg: "hound.png" },
                      { target: "電羊", scan: "伏特羊", desc: "電氣化電路 (受擊帶電反傷)", icon: <CircuitImage circuitId="beta_electric" className="w-16 h-16 object-contain" />, creatureImg: "voltgoat.png" },
                      { target: "蛞蝓龜", scan: "蛞蝓龜、蝸牛龜、石蝦", desc: "格擋電路 (受擊防禦與嘲諷)", icon: <CircuitImage circuitId="gamma_block" className="w-16 h-16 object-contain" />, creatureImg: "slurtle.png" },
                      { target: "寄居蟹奶奶", scan: "寄居蟹隱士、帝王蟹", desc: "合唱盒電路 (及其他增益電路)", icon: <CircuitImage circuitId="beta_choral" className="w-16 h-16 object-contain" />, creatureImg: "hermit.png" },
                      { target: "蜂后", scan: "蜂王", desc: "蜂王蜜糖/豆增益電路", icon: <CircuitImage circuitId="alpha_combo_1" className="w-16 h-16 object-contain" />, creatureImg: "beequeen.png" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3 rounded-lg bg-stone-950/40 border border-stone-850 hover:border-stone-800 transition">
                        <div className="bg-stone-900 p-2 rounded-lg border border-stone-800 shrink-0 flex items-center gap-2">
                          {item.icon}
                          <span className="text-stone-500 text-xs font-semibold">→</span>
                          <img
                            src={`${(import.meta as any).env.BASE_URL || "/"}images/creatures/${item.creatureImg}`}
                            className="w-16 h-16 object-contain shrink-0"
                            alt={item.target}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-white text-xs block">{item.target}</span>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{item.desc}</p>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">掃描對象: {item.scan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 特殊與進階生物 */}
                <div>
                  <h3 className="text-sm font-serif font-bold text-amber-500 mb-3 pb-1 border-b border-stone-850 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-amber-500" />
                    特殊與進階生物
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { target: "護士蜘蛛", scan: "護士蜘蛛", desc: "超級強化電路 (召喚護盾/防禦強化)", icon: <CircuitImage circuitId="alpha_health_2" className="w-16 h-16 object-contain" />, creatureImg: "nurse_spider.png" },
                      { target: "坎普斯", scan: "坎普斯", desc: "空間擴展電路 (額外背包欄位)", icon: <CircuitImage circuitId="beta_pocket" className="w-16 h-16 object-contain" />, creatureImg: "krampus.png" },
                      { target: "寒冰獵犬", scan: "獨眼巨鹿、寒冰獵犬", desc: "製冷電路 (提供體溫降溫)", icon: <CircuitImage circuitId="beta_refrigerant" className="w-16 h-16 object-contain" />, creatureImg: "ice_hound.png" },
                      { target: "鳥寶寶 (春季王的小鳥)", scan: "麋鹿鵝幼崽", desc: "旋轉週期電路 (工作/戰鬥旋轉收割)", icon: <CircuitImage circuitId="gamma_spin" className="w-16 h-16 object-contain" />, creatureImg: "mossling.png" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3 rounded-lg bg-stone-950/40 border border-stone-850 hover:border-stone-800 transition">
                        <div className="bg-stone-900 p-2 rounded-lg border border-stone-800 shrink-0 flex items-center gap-2">
                          {item.icon}
                          <span className="text-stone-500 text-xs font-semibold">→</span>
                          <img
                            src={`${(import.meta as any).env.BASE_URL || "/"}images/creatures/${item.creatureImg}`}
                            className="w-16 h-16 object-contain shrink-0"
                            alt={item.target}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-white text-xs block">{item.target}</span>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{item.desc}</p>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">掃描對象: {item.scan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-850 bg-stone-950/40 flex justify-end">
                <button
                  onClick={() => setShowCircuitSuggestions(false)}
                  className="px-4 py-2 text-xs font-bold bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-700 hover:border-stone-600 rounded-lg transition cursor-pointer"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
