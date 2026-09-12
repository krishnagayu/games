/**
 * Class 7 Science Coach - Procedural Question Generators
 * Strictly based on concepts covered in the NCERT Class 7 Science Textbook.
 * Supports all 13 chapters with randomized parameters, diagnostic options, and step-by-step NCERT solutions.
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeMCQ(chapterId, text, options, correctIndex, solution) {
  return { chapter: chapterId, type: 'mcq', text, options, answer: correctIndex, solution };
}

function makeShort(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'short', text, answer: String(answer), solution };
}

// ─────────────────────────────────────────────────────────────
// Chapter 1: Nutrition in Plants
// ─────────────────────────────────────────────────────────────
export function genChapter1(level) {
  const templateType = randInt(1, 5);

  if (level === 'basic') {
    if (templateType === 1) {
      const parts = [
        { name: "Chlorophyll", role: "green pigment in leaves that captures the energy of sunlight" },
        { name: "Stomata", role: "tiny pores on leaves through which carbon dioxide is taken in from the air" },
        { name: "Vessels", role: "pipe-like tubes that transport water and minerals from roots to leaves" },
        { name: "Guard cells", role: "specialized cells that surround and regulate the opening of stomatal pores" }
      ];
      const p = randChoice(parts);
      const others = parts.filter(item => item.name !== p.name).map(item => item.name);
      const options = shuffle([p.name, ...others]);
      return makeMCQ(1,
        `Which part or structure in green plants is described as "${p.role}"?`,
        options,
        options.indexOf(p.name),
        `According to NCERT Chapter 1, ${p.name} is the ${p.role}.`
      );
    } else if (templateType === 2) {
      return makeMCQ(1,
        `What are the essential raw materials required by green plants to carry out photosynthesis?`,
        [
          "Carbon dioxide, water, sunlight, and chlorophyll",
          "Oxygen, sugar, soil, and nitrogen gas",
          "Carbon monoxide, alcohol, and hydrogen",
          "Fertilizers, glucose, and oxygen"
        ],
        0,
        "Photosynthesis requires carbon dioxide (from air via stomata), water (from soil via roots), sunlight (energy source), and chlorophyll (green pigment)."
      );
    } else if (templateType === 3) {
      return makeShort(1,
        `Which chemical solution is used to test the presence of starch in leaves after photosynthesis? (Answer: iodine or benedict)`,
        "iodine",
        "Dilute iodine solution turns blue-black in the presence of starch, confirming that photosynthesis has taken place."
      );
    } else if (templateType === 4) {
      const examples = [
        { plant: "Cuscuta (Amarbel)", mode: "Parasite (absorbs ready-made food from host tree)" },
        { plant: "Pitcher plant", mode: "Insectivorous plant (traps and digests insects for nitrogen)" },
        { plant: "Mushroom", mode: "Saprotroph (absorbs nutrients from dead and decaying matter)" },
        { plant: "Lichen", mode: "Symbiotic relationship (association between an alga and a fungus)" }
      ];
      const ex = randChoice(examples);
      const others = examples.filter(item => item.plant !== ex.plant).map(item => item.mode);
      const options = shuffle([ex.mode, ...others]);
      return makeMCQ(1,
        `What is the mode of nutrition exhibited by ${ex.plant}?`,
        options,
        options.indexOf(ex.mode),
        `${ex.plant} is an example of a ${ex.mode} as described in NCERT Class 7 Science.`
      );
    } else {
      return makeShort(1,
        `Name the bacterium living in the root nodules of leguminous plants that fixes atmospheric nitrogen into soluble form for the plant.`,
        "rhizobium",
        "Rhizobium bacteria convert atmospheric nitrogen into usable soluble compounds for leguminous plants (pulses, gram, peas) in return for food and shelter."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(1,
        `Why does an insectivorous plant like the Pitcher plant eat insects even though it has green leaves and performs photosynthesis?`,
        [
          "It grows in nitrogen-deficient soil and traps insects to fulfil its nitrogen requirement",
          "It cannot absorb water from the soil",
          "Its chlorophyll cannot absorb green sunlight",
          "It needs animal blood to produce flowers"
        ],
        0,
        "Insectivorous plants grow in soils lacking vital nitrogen nutrients. They digest trapped insects using digestive juices secreted in the pitcher to obtain nitrogen."
      );
    } else if (templateType === 2) {
      return makeMCQ(1,
        `In a lichen, what does the fungal partner provide to the alga, and what does the alga provide in return?`,
        [
          "Fungus provides shelter, water, and minerals; Alga provides food prepared by photosynthesis",
          "Fungus provides sunlight; Alga provides roots for anchorage",
          "Alga provides shelter; Fungus synthesizes carbohydrates",
          "Both partners absorb food directly from dead wood"
        ],
        0,
        "In the symbiotic relationship of lichens, the fungus provides shelter, water, and minerals, while the chlorophyll-containing alga synthesizes and provides food."
      );
    } else {
      return makeMCQ(1,
        `Why do farmers not need to add nitrogenous fertilizer to the soil in which leguminous crops like gram or peas are grown?`,
        [
          "Rhizobium bacteria in root nodules naturally convert atmospheric nitrogen into plant-usable compounds",
          "Legumes do not require nitrogen for protein synthesis",
          "Legumes absorb nitrogen directly through leaf stomata",
          "Earthworms convert dead roots into nitrogen gas"
        ],
        0,
        "Rhizobium bacteria living symbiotically in the root nodules of leguminous plants naturally enrich the soil with nitrogen, eliminating the need for nitrogenous fertilizers."
      );
    }
  } else {
    // Advanced & Mastery
    return makeMCQ(1,
      `Two potted plants A and B are destarched by keeping them in a dark room for 3 days. Plant A is left in sunlight with its leaves exposed, while Plant B is kept in sunlight with its leaves enclosed in a transparent bottle containing potassium hydroxide (KOH, which absorbs CO2). After 6 hours, iodine test is performed on both. What will be observed?`,
      [
        "Leaves of Plant A turn blue-black, while leaves of Plant B do not turn blue-black",
        "Both Plant A and B turn dark blue-black",
        "Leaves of Plant B turn blue-black because KOH provides extra oxygen",
        "Neither plant shows any starch"
      ],
      0,
      "Plant B lacked carbon dioxide because KOH absorbed all the CO2 inside the sealed bottle. Without CO2, photosynthesis could not occur and no starch was formed."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 2: Nutrition in Animals
// ─────────────────────────────────────────────────────────────
export function genChapter2(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      const organs = [
        { organ: "Stomach", secretion: "Hydrochloric acid (HCl) and digestive juices that break down proteins" },
        { organ: "Liver", secretion: "Bile juice stored in the gall bladder for digesting fats" },
        { organ: "Salivary glands", secretion: "Saliva that breaks down starch into simple sugars" },
        { organ: "Pancreas", secretion: "Pancreatic juice that acts on carbohydrates, fats, and proteins" }
      ];
      const o = randChoice(organs);
      const others = organs.filter(item => item.organ !== o.organ).map(item => item.organ);
      const options = shuffle([o.organ, ...others]);
      return makeMCQ(2,
        `Which organ or gland of the human digestive system is responsible for: "${o.secretion}"?`,
        options,
        options.indexOf(o.organ),
        `According to NCERT Chapter 2, the ${o.organ} produces ${o.secretion}.`
      );
    } else if (templateType === 2) {
      return makeShort(2,
        `What are the thousands of tiny finger-like outgrowths on the inner surface of the small intestine called?`,
        "villi",
        "Villi greatly increase the surface area of the small intestine for the absorption of digested food into blood vessels."
      );
    } else if (templateType === 3) {
      return makeMCQ(2,
        `Which projections help Amoeba in capturing food particles and in movement?`,
        ["Pseudopodia (false feet)", "Cilia", "Flagella", "Tentacles"],
        0,
        "Amoeba pushes out one or more finger-like projections called pseudopodia ('false feet') to engulf food into a food vacuole."
      );
    } else {
      const teethTypes = [
        { type: "Incisors", role: "biting and cutting food (front 4 in each jaw)" },
        { type: "Canines", role: "piercing and tearing food (2 in each jaw)" },
        { type: "Molars", role: "chewing and grinding food (6 in each jaw)" }
      ];
      const t = randChoice(teethTypes);
      const others = teethTypes.filter(item => item.type !== t.type).map(item => item.type);
      const options = shuffle([t.type, ...others, "Premolars"].slice(0, 4));
      return makeMCQ(2,
        `Which specific type of teeth are adapted for "${t.role}"?`,
        options,
        options.indexOf(t.type),
        `${t.type} are used for ${t.role}.`
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(2,
        `Why can grass-eating animals (ruminants) like cows digest cellulose present in grass, whereas humans cannot?`,
        [
          "Ruminants have special bacteria in their rumen/caecum that produce cellulose-digesting enzymes",
          "Humans have too much bile juice in the stomach",
          "Cows have four stomachs that boil the grass at high temperature",
          "Grass contains no cellulose when swallowed"
        ],
        0,
        "Cellulose is a complex carbohydrate. Ruminants possess specialized bacteria in their rumen and caecum that ferment and digest cellulose, which humans lack."
      );
    } else {
      return makeMCQ(2,
        `What is the correct sequence of steps involved in the process of nutrition in human beings?`,
        [
          "Ingestion → Digestion → Absorption → Assimilation → Egestion",
          "Digestion → Ingestion → Assimilation → Absorption → Egestion",
          "Ingestion → Absorption → Digestion → Egestion → Assimilation",
          "Absorption → Ingestion → Digestion → Assimilation → Egestion"
        ],
        0,
        "The standard biological sequence of animal nutrition is Ingestion (taking food in), Digestion (breaking down), Absorption (into blood), Assimilation (utilization by cells), and Egestion (removal of undigested waste)."
      );
    }
  } else {
    return makeMCQ(2,
      `A person's gall bladder is surgically removed due to gallstones. Which type of dietary component will this person have the most difficulty digesting?`,
      ["Fats", "Proteins", "Starch", "Vitamins"],
      0,
      "The gall bladder stores and concentrates bile juice produced by the liver. Bile is crucial for emulsifying and digesting fats in the small intestine."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 3: Heat
// ─────────────────────────────────────────────────────────────
export function genChapter3(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      return makeShort(3,
        `What is the temperature range of a standard clinical thermometer in degrees Celsius (°C)? (e.g. 35 to 42)`,
        "35 to 42",
        "A clinical thermometer is designed to measure human body temperature and has a scale reading from 35°C to 42°C."
      );
    } else if (templateType === 2) {
      return makeShort(3,
        `What feature near the bulb of a clinical thermometer prevents the mercury level from falling on its own when removed from the mouth?`,
        "kink",
        "A kink (constriction) near the bulb prevents the mercury thread from falling back automatically before the reading is recorded."
      );
    } else if (templateType === 3) {
      return makeMCQ(3,
        `Heat transfer through metallic cooking pans occurs primarily through which mechanism?`,
        ["Conduction", "Convection", "Radiation", "Transpiration"],
        0,
        "In solids, heat transfers from the hotter end to the colder end through conduction, as adjacent particles pass on vibrational energy."
      );
    } else {
      return makeMCQ(3,
        `Why do we prefer to wear light-coloured clothes in summer and dark-coloured clothes in winter?`,
        [
          "Light clothes reflect most of the radiant heat keeping us cool; dark clothes absorb heat keeping us warm",
          "Light clothes conduct heat rapidly out of the body",
          "Dark clothes trap moisture and prevent evaporation",
          "Light clothes prevent wind from touching the skin"
        ],
        0,
        "Dark surfaces absorb more heat radiation from the sun, keeping us warm in winter; light surfaces reflect radiation, keeping us cooler in summer."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(3,
        `In coastal areas during the daytime, why does a cool 'Sea Breeze' blow from the sea towards the land?`,
        [
          "Land heats up faster than water, so hot air over land rises and cooler air from the sea rushes in",
          "Water heats up faster than land, creating low pressure over the ocean",
          "The rotation of the Earth pulls ocean water towards the shore",
          "Clouds over the sea push air forward"
        ],
        0,
        "During the day, land heats up faster than sea water. Warm air over land rises (convection), and cool air from the sea blows in towards land to take its place (Sea Breeze)."
      );
    } else {
      return makeMCQ(3,
        `Why do woollen clothes keep us much warmer in winter than a cotton shirt of equal thickness?`,
        [
          "Wool fibres trap air between them, and trapped air is a poor conductor of heat that prevents body heat from escaping",
          "Wool produces electricity when touching skin",
          "Wool fibres conduct heat inward from the surroundings",
          "Wool reacts chemically with atmospheric oxygen to release thermal energy"
        ],
        0,
        "Wool fibres have crimp that traps air pockets. Air is an excellent insulator (poor conductor of heat), preventing our body heat from escaping into the cold environment."
      );
    }
  } else {
    return makeMCQ(3,
      `A laboratory thermometer has a scale from -10°C to 110°C. Why should a laboratory thermometer NOT be used to measure human body temperature?`,
      [
        "It lacks a kink, so the mercury level drops immediately as soon as it is removed from the body",
        "Its glass expands too much in human saliva",
        "It contains toxic alcohol rather than mercury",
        "Its scale starts too high above body temperature"
      ],
      0,
      "Unlike a clinical thermometer, a laboratory thermometer does not have a kink. Its mercury level immediately falls as soon as it is removed from the mouth or underarm."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 4: Acids, Bases and Salts
// ─────────────────────────────────────────────────────────────
export function genChapter4(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      const acids = [
        { acid: "Acetic acid", source: "Vinegar" },
        { acid: "Citric acid", source: "Lemons and oranges (citrus fruits)" },
        { acid: "Lactic acid", source: "Curd (sour milk)" },
        { acid: "Formic acid", source: "Ant's sting" },
        { acid: "Tartaric acid", source: "Tamarind and unripe grapes" },
        { acid: "Oxalic acid", source: "Spinach" },
        { acid: "Ascorbic acid (Vitamin C)", source: "Amla and citrus fruits" }
      ];
      const a = randChoice(acids);
      const others = acids.filter(item => item.acid !== a.acid).map(item => item.acid);
      const options = shuffle([a.acid, ...others.slice(0, 3)]);
      return makeMCQ(4,
        `Which acid is naturally found in "${a.source}"?`,
        options,
        options.indexOf(a.acid),
        `As listed in Table 4.1 of NCERT Class 7 Chapter 4, ${a.source} contains ${a.acid}.`
      );
    } else if (templateType === 2) {
      const bases = [
        { base: "Calcium hydroxide", source: "Lime water" },
        { base: "Ammonium hydroxide", source: "Window cleaner" },
        { base: "Sodium hydroxide / Potassium hydroxide", source: "Soap" },
        { base: "Magnesium hydroxide", source: "Milk of magnesia" }
      ];
      const b = randChoice(bases);
      const others = bases.filter(item => item.base !== b.base).map(item => item.base);
      const options = shuffle([b.base, ...others.slice(0, 3)]);
      return makeMCQ(4,
        `Which base is the active ingredient in "${b.source}"?`,
        options,
        options.indexOf(b.base),
        `According to NCERT Chapter 4, ${b.source} contains ${b.base}.`
      );
    } else if (templateType === 3) {
      return makeMCQ(4,
        `Litmus, the most commonly used natural indicator, is extracted from which living organism?`,
        ["Lichens", "Earthworms", "Pitcher plants", "Ferns"],
        0,
        "Litmus is a natural dye extracted from lichens. It turns red in acidic solution and blue in basic solution."
      );
    } else {
      return makeMCQ(4,
        `What color does turmeric paper turn when brought into contact with a basic solution like soap water?`,
        ["Reddish-brown", "Bright yellow", "Deep green", "Colorless"],
        0,
        "Turmeric remains yellow in neutral or acidic media, but turns reddish-brown when exposed to basic substances like soap or lime water."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(4,
        `What is the general chemical reaction for Neutralization?`,
        [
          "Acid + Base → Salt + Water + Heat is evolved",
          "Acid + Acid → Salt + Oxygen gas",
          "Base + Base → Water + Hydrogen gas",
          "Salt + Water → Acid + Base"
        ],
        0,
        "In a neutralization reaction, an acid reacts with a base to form a salt and water, with the evolution of heat."
      );
    } else {
      return makeMCQ(4,
        `When an ant stings a person, it injects acidic liquid (formic acid). Which substance can be applied on the skin to neutralize it?`,
        [
          "Moist baking soda (sodium hydrogen carbonate) or calamine solution",
          "Vinegar (acetic acid)",
          "Lemon juice (citric acid)",
          "Dilute hydrochloric acid"
        ],
        0,
        "The effect of formic acid from an ant sting can be neutralized by rubbing moist baking soda or calamine lotion (which contains basic zinc carbonate)."
      );
    }
  } else {
    return makeMCQ(4,
      `A student tests three unknown colorless liquids with phenolphthalein indicator: Solution X stays colorless; Solution Y turns dark pink; Solution Z stays colorless. Adding Solution Y dropwise to Solution X turns it pink, but adding Solution Y to Solution Z leaves it colorless for a long time. What are X, Y, and Z?`,
      [
        "X is neutral (distilled water), Y is basic (NaOH), Z is acidic (HCl)",
        "X is basic, Y is acidic, Z is neutral",
        "All three solutions are strong acids",
        "Y is neutral, while X and Z are strong bases"
      ],
      0,
      "Phenolphthalein turns pink only in basic solution (Y is base). Solution X (water) turns pink with a little base, but acidic Solution Z neutralizes the added base first before changing color."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 5: Physical and Chemical Changes
// ─────────────────────────────────────────────────────────────
export function genChapter5(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      return makeMCQ(5,
        `Which of the following describes a physical change?`,
        [
          "Only physical properties (shape, size, state) change; no new substance is formed",
          "A new chemical substance with different molecular formula is always formed",
          "It is always irreversible by physical means",
          "Light and sound are permanently emitted"
        ],
        0,
        "A physical change involves changes in physical properties such as shape, size, color, or state without the formation of any new chemical substance."
      );
    } else if (templateType === 2) {
      return makeShort(5,
        `What is the white powdery ash formed when a magnesium ribbon is burnt in air? (Answer: magnesium oxide)`,
        "magnesium oxide",
        "Magnesium burns with a brilliant white flame to form magnesium oxide (2Mg + O2 → 2MgO), which is a chemical change."
      );
    } else if (templateType === 3) {
      return makeMCQ(5,
        `What process involves depositing a protective layer of zinc metal on iron to prevent rusting?`,
        ["Galvanization", "Crystallization", "Neutralization", "Transpiration"],
        0,
        "Galvanization is the process of coating iron or steel with a protective layer of zinc to shield it from moisture and oxygen, preventing rust."
      );
    } else {
      return makeShort(5,
        `What are the two essential substances that iron must be exposed to in order to form rust? (Answer: oxygen and water)`,
        "oxygen and water",
        "Rusting of iron requires both oxygen (from air) and moisture (water/water vapour): Iron + Oxygen + Water → Rust (Iron oxide)."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(5,
        `When an iron nail is placed in a blue copper sulphate solution, the blue color changes to green and a reddish-brown deposit appears on the nail. Why?`,
        [
          "Iron displaces copper, forming green iron sulphate solution and depositing reddish-brown copper metal",
          "The copper sulphate dissolves the iron nail into blue ink",
          "Oxygen gas oxidizes copper into iron",
          "It is a reversible physical change caused by temperature change"
        ],
        0,
        "CuSO4 (blue) + Fe (iron) → FeSO4 (iron sulphate, green) + Cu (copper, reddish-brown deposit). This is a classic chemical change."
      );
    } else {
      return makeMCQ(5,
        `When baking soda is added to vinegar, gas bubbles are vigorously produced. When this gas is bubbled through lime water, it turns milky. What is this gas?`,
        ["Carbon dioxide (CO2)", "Oxygen (O2)", "Hydrogen (H2)", "Nitrogen (N2)"],
        0,
        "Vinegar (acetic acid) reacts with baking soda (sodium hydrogen carbonate) to release carbon dioxide gas, which forms insoluble white calcium carbonate in lime water."
      );
    }
  } else {
    return makeMCQ(5,
      `Why is the tearing of a sheet of paper considered a physical change, whereas the burning of the same paper is considered a chemical change?`,
      [
        "Tearing changes only paper size without forming a new substance, while burning forms entirely new substances (ash, smoke, CO2)",
        "Tearing cannot be reversed while burning can be easily reversed",
        "Paper atoms decompose into hydrogen during tearing",
        "Both are chemical changes because energy is expended"
      ],
      0,
      "Tearing changes only physical dimensions. Burning breaks chemical bonds, consuming oxygen and forming new chemical compounds (carbon dioxide, water vapour, ash)."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 6: Respiration in Organisms
// ─────────────────────────────────────────────────────────────
export function genChapter6(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      return makeMCQ(6,
        `What is the primary difference between aerobic and anaerobic respiration?`,
        [
          "Aerobic respiration occurs in the presence of oxygen, while anaerobic respiration occurs without oxygen",
          "Aerobic respiration occurs only in plants, anaerobic only in animals",
          "Aerobic respiration does not produce energy",
          "Anaerobic respiration consumes carbon dioxide"
        ],
        0,
        "Aerobic respiration breaks down glucose completely in the presence of oxygen. Anaerobic respiration breaks down food without using oxygen."
      );
    } else if (templateType === 2) {
      const organs = [
        { animal: "Cockroach", organ: "Spiracles and Tracheae (air tube network)" },
        { animal: "Earthworm", organ: "Moist and slimy skin" },
        { animal: "Fish", organ: "Gills with rich blood capillaries" },
        { animal: "Human", organ: "Lungs" }
      ];
      const o = randChoice(organs);
      const others = organs.filter(item => item.animal !== o.animal).map(item => item.organ);
      const options = shuffle([o.organ, ...others]);
      return makeMCQ(6,
        `Which specialized breathing organ or structure is used by a "${o.animal}" for gas exchange?`,
        options,
        options.indexOf(o.organ),
        `According to NCERT Chapter 6, the ${o.animal} breathes through its ${o.organ}.`
      );
    } else if (templateType === 3) {
      return makeShort(6,
        `What single-celled organism respira anaerobically to produce alcohol, making it widely used in wine and beer making?`,
        "yeast",
        "Yeast breaks down glucose anaerobically into alcohol and carbon dioxide: Glucose → Alcohol + CO2 + Energy."
      );
    } else {
      return makeMCQ(6,
        `What happens to the diaphragm during the process of Inhalation (breathing in)?`,
        [
          "It moves downwards (flattens), expanding the chest cavity",
          "It moves upwards, compressing the lungs",
          "It remains completely motionless",
          "It rotates sideways to compress the ribs"
        ],
        0,
        "During inhalation, ribs move up and outwards while the diaphragm moves down. This expands the chest cavity, lowering internal pressure so air rushes into lungs."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(6,
        `Why do athletes develop painful muscle cramps after sprinting fast, and why does a hot water bath relieve the cramp?`,
        [
          "Anaerobic respiration produces lactic acid; a hot bath improves blood circulation, supplying oxygen to break down lactic acid",
          "Muscle bones fracture slightly; hot water glues them back",
          "Too much oxygen accumulates in the muscles; hot water evaporates the oxygen",
          "Water inside muscle cells boils into steam"
        ],
        0,
        "Oxygen deficit causes muscles to respire anaerobically, forming lactic acid. A hot bath or massage improves blood flow, delivering oxygen that converts lactic acid back to CO2 and water."
      );
    } else {
      return makeMCQ(6,
        `When exhaled air is blown through a straw into freshly prepared lime water, the lime water turns milky. What does this test prove?`,
        [
          "Exhaled air contains a significantly higher percentage of carbon dioxide than atmospheric air",
          "Exhaled air contains pure nitrogen",
          "The human body exhales calcium powder",
          "The straw dissolves into the solution"
        ],
        0,
        "Exhaled air contains ~4.4% CO2 (compared to 0.04% in inhaled air). This carbon dioxide reacts with calcium hydroxide in lime water to form insoluble white calcium carbonate."
      );
    }
  } else {
    return makeMCQ(6,
      `How do roots of plants take up oxygen needed for cellular respiration underground?`,
      [
        "Root hair cells absorb air present in the microscopic spaces between soil particles",
        "Roots receive oxygen pumped downwards through xylem vessels from flowers",
        "Roots perform photosynthesis in dark underground soil",
        "Roots absorb oxygen molecules directly bound to sand grains"
      ],
      0,
      "Root hair cells are in contact with the air present in the air spaces between soil particles. They take in oxygen and give out carbon dioxide by diffusion."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 7: Transportation in Animals and Plants
// ─────────────────────────────────────────────────────────────
export function genChapter7(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      const vessels = [
        { name: "Xylem", role: "transports water and dissolved minerals upwards from roots to leaves" },
        { name: "Phloem", role: "transports food prepared in the leaves to all other parts of the plant" }
      ];
      const v = randChoice(vessels);
      return makeMCQ(7,
        `Which vascular tissue in plants "${v.role}"?`,
        [v.name, v.name === "Xylem" ? "Phloem" : "Xylem", "Stomata", "Chloroplast"],
        0,
        `In vascular plants, ${v.name} is the tissue that ${v.role}.`
      );
    } else if (templateType === 2) {
      return makeShort(7,
        `What is the normal resting pulse rate of a healthy adult human being in beats per minute? (e.g. 72 to 80)`,
        "72 to 80",
        "As stated in NCERT Class 7 Chapter 7, the resting pulse rate of a healthy person is usually between 72 and 80 beats per minute."
      );
    } else if (templateType === 3) {
      const bloodCells = [
        { name: "Red Blood Cells (RBCs)", role: "contain haemoglobin to carry oxygen to cells" },
        { name: "White Blood Cells (WBCs)", role: "fight against germs and infections that enter the body" },
        { name: "Platelets", role: "help in the formation of blood clots to stop bleeding from wounds" }
      ];
      const bc = randChoice(bloodCells);
      const others = bloodCells.filter(item => item.name !== bc.name).map(item => item.name);
      const options = shuffle([bc.name, ...others, "Plasma"].slice(0, 4));
      return makeMCQ(7,
        `Which component of human blood "${bc.role}"?`,
        options,
        options.indexOf(bc.name),
        `${bc.name} are responsible for: ${bc.role}.`
      );
    } else {
      return makeMCQ(7,
        `Why are valves present in veins but not in arteries?`,
        [
          "Valves ensure that blood flows in only one direction toward the heart under lower pressure",
          "Valves filter out red blood cells",
          "Valves cool the blood before it reaches the brain",
          "Valves speed up blood flow to supersonic speeds"
        ],
        0,
        "Blood pressure is lower in veins than in arteries. Valves prevent backflow and keep blood moving steadily toward the heart."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(7,
        `What is the structural feature of the human heart that prevents the mixing of oxygen-rich blood and carbon dioxide-rich blood?`,
        [
          "A thick muscular partition called the septum dividing the left and right halves",
          "A membrane enclosing the lungs",
          "A valve in the pulmonary artery",
          "The pericardium fluid sac"
        ],
        0,
        "The heart has four chambers: two atria and two ventricles. A central muscular wall called the septum completely separates the left (oxygenated) and right (deoxygenated) sides."
      );
    } else {
      return makeMCQ(7,
        `How does transpiration through leaf stomata help tall trees pull water up to heights of dozens of meters from the roots?`,
        [
          "Evaporation creates a powerful suction pull (transpiration pull) inside xylem vessels, like sucking through a straw",
          "Water molecules get pushed down by atmospheric pressure",
          "Roots physically pump water by contracting muscles",
          "Leaves absorb water vapor from clouds"
        ],
        0,
        "Transpiration evaporates water from stomata, creating continuous negative tension or suction pull (transpiration pull) that draws water up the continuous xylem column."
      );
    }
  } else {
    return makeMCQ(7,
      `Which of the following blood vessels carries oxygen-rich blood, representing the famous exception to the general rule that arteries carry oxygenated blood and veins carry deoxygenated blood?`,
      [
        "Pulmonary vein (carries oxygen-rich blood from lungs to left atrium)",
        "Pulmonary artery",
        "Renal vein",
        "Vena cava"
      ],
      0,
      "Although veins generally carry deoxygenated blood, the Pulmonary Vein carries oxygen-rich blood from the lungs to the left atrium of the heart."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 8: Reproduction in Plants
// ─────────────────────────────────────────────────────────────
export function genChapter8(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      const vegetative = [
        { plant: "Bryophyllum", part: "buds in leaf margins" },
        { plant: "Potato", part: "scars or 'eyes' on the stem tuber" },
        { plant: "Ginger", part: "underground modified stem (rhizome)" },
        { plant: "Sweet potato", part: "fleshy root tubers" },
        { plant: "Rose", part: "stem cutting" }
      ];
      const v = randChoice(vegetative);
      const others = vegetative.filter(item => item.plant !== v.plant).map(item => item.part);
      const options = shuffle([v.part, ...others.slice(0, 3)]);
      return makeMCQ(8,
        `Through which vegetative part does ${v.plant} reproduce asexually?`,
        options,
        options.indexOf(v.part),
        `${v.plant} reproduces vegetatively through its ${v.part}.`
      );
    } else if (templateType === 2) {
      return makeShort(8,
        `What asexual reproduction process is seen in yeast where a small bulb-like projection grows, matures, and detaches from the parent cell?`,
        "budding",
        "In yeast, a small bulb-like projection called a bud forms from the parent cell, grows, and eventually detaches to form a new individual."
      );
    } else if (templateType === 3) {
      return makeMCQ(8,
        `What are the male and female reproductive parts of a flower called?`,
        ["Stamen (male) and Pistil/Carpel (female)", "Sepal (male) and Petal (female)", "Style (male) and Stigma (female)", "Anther (female) and Ovary (male)"],
        0,
        "The stamen is the male reproductive part (consisting of anther and filament), and the pistil/carpel is the female part (stigma, style, and ovary)."
      );
    } else {
      return makeMCQ(8,
        `What is the process of transfer of pollen grains from the anther to the stigma of a flower called?`,
        ["Pollination", "Fertilization", "Transpiration", "Germination"],
        0,
        "The transfer of pollen grains from anther to stigma is known as pollination. It can be self-pollination or cross-pollination."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      const dispersals = [
        { seed: "Drumstick and Maple", feature: "winged seeds carried by wind" },
        { seed: "Madar (Aak) and Sunflower", feature: "light and hairy seeds carried by wind" },
        { seed: "Xanthium and Urena", feature: "spiny seeds with hooks that attach to animal fur" },
        { seed: "Coconut", feature: "spongy fibrous outer coat that floats on water" },
        { seed: "Castor and Balsam", feature: "fruits that burst open with sudden jerks, scattering seeds" }
      ];
      const d = randChoice(dispersals);
      const others = dispersals.filter(item => item.seed !== d.seed).map(item => item.feature);
      const options = shuffle([d.feature, ...others.slice(0, 3)]);
      return makeMCQ(8,
        `What seed dispersal adaptation is found in "${d.seed}"?`,
        options,
        options.indexOf(d.feature),
        `According to NCERT Chapter 8, ${d.seed} seeds have ${d.feature}.`
      );
    } else {
      return makeMCQ(8,
        `What happens immediately following successful pollination when a pollen grain lands on the stigma?`,
        [
          "A pollen tube grows down through the style to deliver the male gamete to the ovule for fertilization",
          "The flower immediately drops all petals and dies",
          "The stigma explodes into a spore cloud",
          "The pollen grain turns into a fruit on the stigma surface"
        ],
        0,
        "The pollen grain germinates on the sticky stigma, producing a pollen tube that grows down the style into the ovary, where fertilization creates a zygote."
      );
    }
  } else {
    return makeMCQ(8,
      `After fertilization in a flowering plant, what do the ovary and ovules develop into?`,
      [
        "Ovary develops into the fruit; ovules develop into seeds",
        "Ovary develops into seeds; ovules develop into petals",
        "Ovary develops into leaves; ovules develop into roots",
        "Both ovary and ovules dissolve into nectar"
      ],
      0,
      "Following fertilization, the ovary enlarges and ripens to form the fruit, while the ovules inside the ovary develop into seeds containing the embryo."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 9: Motion and Time
// ─────────────────────────────────────────────────────────────
export function genChapter9(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      const d = randChoice([60, 100, 120, 180, 240, 300]);
      const t = randChoice([2, 3, 4, 5]);
      const spd = d / t;
      return makeShort(9,
        `A train covers a distance of ${d} km in ${t} hours. Calculate its speed in km/h.`,
        spd,
        `Speed = Total Distance / Total Time = ${d} km / ${t} h = ${spd} km/h.`
      );
    } else if (templateType === 2) {
      return makeMCQ(9,
        `Which instrument fitted on an automobile dashboard measures and indicates speed directly in km/h?`,
        ["Speedometer", "Odometer", "Barometer", "Thermometer"],
        0,
        "A speedometer measures speed directly in km/h, while an odometer records the total distance travelled in kilometres."
      );
    } else if (templateType === 3) {
      return makeShort(9,
        `What is the basic standard SI unit of time? (e.g. second, minute, hour)`,
        "second",
        "The basic unit of time in the International System of Units (SI) is the second (s)."
      );
    } else {
      const osc = randChoice([20, 25, 40]);
      const timeSec = randChoice([40, 50, 80]);
      const T = (timeSec / osc).toFixed(1);
      return makeShort(9,
        `A simple pendulum completes ${osc} oscillations in ${timeSec} seconds. What is its time period in seconds?`,
        parseFloat(T),
        `Time period = Total time taken / Number of oscillations = ${timeSec} s / ${osc} = ${T} seconds.`
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(9,
        `What did Italian scientist Galileo Galilei discover about a simple pendulum?`,
        [
          "A pendulum of a given fixed length always takes the exact same time to complete one oscillation",
          "A heavier bob completes oscillations in much less time",
          "A pendulum stops moving if placed in sunlight",
          "Pendulum clocks can only swing from North to South"
        ],
        0,
        "Galileo discovered that the time period of a simple pendulum depends only on the length of the string, and not on the mass of the bob or the extent of swing."
      );
    } else {
      return makeMCQ(9,
        `What does a straight diagonal line on a distance-time graph indicate about the motion of a vehicle?`,
        [
          "The vehicle is moving with uniform speed (constant speed)",
          "The vehicle is stationary (at rest)",
          "The vehicle is accelerating with variable speed",
          "The vehicle has run out of fuel"
        ],
        0,
        "A straight sloping line on a distance-time graph represents uniform motion, meaning the object covers equal distances in equal intervals of time."
      );
    }
  } else {
    // Advanced & Mastery
    const d1 = randChoice([30, 40]);
    const t1 = randChoice([1, 2]);
    const d2 = randChoice([60, 80]);
    const t2 = randChoice([2, 3]);
    const totalD = d1 + d2;
    const totalT = t1 + t2;
    const avgSpd = (totalD / totalT).toFixed(1);
    return makeShort(9,
      `A car travels ${d1} km in the first ${t1} hours, and then covers ${d2} km in the next ${t2} hours. What is its average speed for the entire journey in km/h?`,
      parseFloat(avgSpd),
      `Average speed = Total distance / Total time = (${d1} + ${d2}) km / (${t1} + ${t2}) h = ${totalD} / ${totalT} = ${avgSpd} km/h.`
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 10: Electric Current and its Effects
// ─────────────────────────────────────────────────────────────
export function genChapter10(level) {
  const templateType = randInt(1, 5);

  if (level === 'basic') {
    if (templateType === 1) {
      const numCells = randChoice([2, 3, 4, 5]);
      const cellVoltage = 1.5;
      const totalV = (numCells * cellVoltage).toFixed(1);
      const options = shuffle([
        `${totalV} V`,
        `${(totalV * 2).toFixed(1)} V`,
        `1.5 V`,
        `${((numCells - 1) * cellVoltage).toFixed(1)} V`
      ]);
      return makeMCQ(10,
        `A torch battery is formed by connecting ${numCells} standard cells of 1.5 V in proper series connection (positive to negative). What is the total voltage supplied?`,
        options,
        options.indexOf(`${totalV} V`),
        `In a series battery connection, the voltages of all cells add up directly: ${numCells} × 1.5 V = ${totalV} V.`
      );
    } else if (templateType === 2) {
      const components = [
        { name: "Electric Cell", desc: "One long thin vertical line representing the positive (+) terminal and one shorter thicker line representing the negative (-) terminal" },
        { name: "Electric Bulb", desc: "A circle enclosing a coiled loop or squiggle representing the thin filament" },
        { name: "Switch in OFF Position", desc: "Two dots with an open gap where the key line is tilted up, breaking the circuit" },
        { name: "Switch in ON Position", desc: "Two dots connected by a continuous closed bar completing the circuit" },
        { name: "Electric Battery", desc: "A combination of alternating long thin and short thick lines indicating connected cells" }
      ];
      const target = randChoice(components);
      const others = components.filter(c => c.name !== target.name).map(c => c.name);
      const options = shuffle([target.name, ...others.slice(0, 3)]);
      return makeMCQ(10,
        `In a standard NCERT circuit diagram, which electrical component is represented by "${target.desc}"?`,
        options,
        options.indexOf(target.name),
        `By standard NCERT circuit conventions, ${target.desc} represents the ${target.name}.`
      );
    } else if (templateType === 3) {
      const appliances = ["electric iron", "room heater", "electric toaster", "geyser", "electric kettle"];
      const chosen = randChoice(appliances);
      return makeMCQ(10,
        `Which fundamental effect of electric current is utilized by an ${chosen}?`,
        ["Heating effect of electric current", "Magnetic effect of electric current", "Chemical electrolysis effect", "Electrostatic friction effect"],
        0,
        `An ${chosen} contains a high-resistance coil called an 'element' (usually Nichrome) that heats up when electric current passes through it.`
      );
    } else if (templateType === 4) {
      return makeMCQ(10,
        `What is the direction of electric current flow in a standard closed circuit?`,
        [
          "From the positive terminal (+) to the negative terminal (-) through the external circuit",
          "From the negative terminal (-) to the positive terminal (+)",
          "Back and forth randomly without direction",
          "Only around the negative terminal"
        ],
        0,
        "By scientific convention taught in NCERT Class 7 Chapter 10, current is taken to flow from the positive terminal of the cell to the negative terminal."
      );
    } else {
      return makeShort(10,
        `What is the name of the thin wire inside an incandescent bulb that heats up and glows when current flows?`,
        "filament",
        "Inside the bulb is a thin wire called the filament that gets heated and glows when current passes through it."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      return makeMCQ(10,
        `According to the NCERT textbook, which factors determine the amount of heat produced in an electric wire?`,
        [
          "Material, length, and thickness of the wire",
          "Only the color of the plastic insulation",
          "Only the atmospheric humidity",
          "The weight of the battery"
        ],
        0,
        "NCERT Chapter 10 explicitly states: 'The amount of heat produced in a wire depends on its material, length and thickness.' Different appliances use wires tailored to their heating requirements."
      );
    } else if (templateType === 2) {
      return makeMCQ(10,
        `What happens when a compass is placed near a current-carrying wire, as first observed by Hans Christian Oersted in 1820?`,
        [
          "The compass needle deflects away from its North-South alignment",
          "The compass needle stops pointing anywhere and melts",
          "The compass needle spins continuously at high speed",
          "No deflection occurs under any circumstances"
        ],
        0,
        "Oersted noticed that whenever current was switched on in a nearby wire, the magnetic compass needle deflected, proving that electric current produces a magnetic effect."
      );
    } else if (templateType === 3) {
      return makeMCQ(10,
        `Why does a fuse wire protect electrical appliances and home wiring from catching fire during a short circuit?`,
        [
          "It is made of a special material with a low melting point that melts and breaks the circuit when excessive current flows",
          "It absorbs excess electricity and converts it into cold water",
          "It increases electrical current to clear blockages",
          "It reverses battery polarity automatically"
        ],
        0,
        "Fuse wire has a low melting point. If excessive current flows due to short circuits or overloading, the fuse wire heats up rapidly, melts, and breaks the circuit before fire can break out."
      );
    } else if (templateType === 4) {
      return makeShort(10,
        `What modern electrical safety device is an automatic switch that trips OFF when current in a circuit exceeds safe limits, and can simply be reset without wire replacement?`,
        "mcb",
        "MCB stands for Miniature Circuit Breaker. It automatically switches off during excessive current and can be flipped back on after fixing the fault."
      );
    } else {
      const turnsA = randChoice([30, 40, 50]);
      const turnsB = turnsA * 2;
      return makeMCQ(10,
        `Student A winds ${turnsA} turns of insulated wire on an iron nail, while Student B winds ${turnsB} turns on an identical nail. When connected to identical batteries, which electromagnet will attract more steel paper clips?`,
        [
          `Student B's electromagnet with ${turnsB} turns`,
          `Student A's electromagnet with ${turnsA} turns`,
          "Both will attract the exact same number of clips",
          "Neither will exhibit any magnetism"
        ],
        0,
        "An electromagnet's magnetic strength increases with the number of turns of wire around the iron core for the same current."
      );
    }
  } else {
    // Advanced & Mastery
    if (templateType === 1) {
      return makeMCQ(10,
        `In an electric bell, what immediately happens the instant the hammer strikes the metallic gong?`,
        [
          "The armature pulls away from the contact screw, opening the circuit so the electromagnet loses its magnetism",
          "The electromagnet permanently locks the hammer against the gong",
          "The battery reverses polarity automatically",
          "The gong generates electricity back into the battery"
        ],
        0,
        "As the armature is drawn towards the electromagnet to strike the gong, its contact with the screw tip breaks. The circuit opens, turning off the electromagnet so the spring pulls the armature back."
      );
    } else if (templateType === 2) {
      return makeMCQ(10,
        `Why are CFLs (Compact Fluorescent Lamps) and LEDs preferred over traditional filament electric bulbs for lighting homes?`,
        [
          "Traditional bulbs waste most electrical energy as heat rather than light, whereas CFLs and LEDs produce light with minimal heat wastage",
          "Filament bulbs require magnetic compasses to work",
          "LEDs produce cold ice rays",
          "CFLs violate conservation of energy"
        ],
        0,
        "In a traditional filament bulb, a large part of the electricity is wasted as heat. CFLs and LEDs do not rely on high-temperature heating, making them far more energy-efficient."
      );
    } else if (templateType === 3) {
      return makeShort(10,
        `What safety mark issued by the Bureau of Indian Standards (BIS) should always be checked on electrical appliances before purchase?`,
        "isi",
        "The ISI mark ensures that the appliance conforms to safety specifications and does not waste energy."
      );
    } else {
      return makeMCQ(10,
        `A student sets up an electromagnet using an iron nail and insulated copper wire. When connected to a cell, it picks up several pins. When the switch is turned OFF, what happens to the pins?`,
        [
          "The pins fall off because soft iron loses its magnetism when current stops",
          "The pins remain permanently glued to the nail forever",
          "The pins get violently repelled into the air",
          "The pins melt from residual heat"
        ],
        0,
        "Electromagnets made with soft iron cores are temporary magnets: they behave as magnets only as long as electric current flows through the coil."
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 11: Light
// ─────────────────────────────────────────────────────────────
export function genChapter11(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      return makeMCQ(11,
        `Which fundamental property of light is demonstrated when light passes through three straight aligned pinholes in cardboard?`,
        ["Light travels along straight lines (Rectilinear propagation)", "Light bends around corners easily", "Light only travels through glass", "Light is magnetic in nature"],
        0,
        "Light travels along straight lines. If the pinholes are not in a straight line, light cannot pass through."
      );
    } else if (templateType === 2) {
      return makeMCQ(11,
        `What are the characteristics of an image formed by a plane mirror?`,
        [
          "Erect, virtual, same size as object, and laterally inverted",
          "Inverted, real, magnified, and colored",
          "Upside down, diminished, and real",
          "Diminished, virtual, and horizontal"
        ],
        0,
        "An image formed by a plane mirror is erect, virtual (cannot be formed on a screen), the same size as the object, and laterally inverted."
      );
    } else if (templateType === 3) {
      return makeShort(11,
        `What optical phenomenon causes the word 'AMBULANCE' to be painted in reverse on emergency vehicles? (Answer: lateral inversion)`,
        "lateral inversion",
        "In a mirror, the left side appears on the right and the right side appears on the left (lateral inversion). When seen in rear-view mirrors, it reads correctly."
      );
    } else {
      return makeShort(11,
        `How many colours constitute white sunlight as demonstrated by a glass prism or rainbow?`,
        "7",
        "Sunlight is a mixture of seven colours: Violet, Indigo, Blue, Green, Yellow, Orange, and Red (VIBGYOR)."
      );
    }
  } else if (level === 'intermediate') {
    if (templateType === 1) {
      const mirrors = [
        { type: "Concave mirror", use: "Dentists' examination mirror and reflectors in vehicle headlights / torches" },
        { type: "Convex mirror", use: "Rear-view / side mirrors in automobiles to give a wide field of view" },
        { type: "Convex lens", use: "Magnifying glass to read tiny print" }
      ];
      const m = randChoice(mirrors);
      const others = mirrors.filter(item => item.type !== m.type).map(item => item.type);
      const options = shuffle([m.type, ...others, "Concave lens"].slice(0, 4));
      return makeMCQ(11,
        `Which optical device is specifically used for: "${m.use}"?`,
        options,
        options.indexOf(m.type),
        `According to NCERT Chapter 11, the ${m.type} is used for ${m.use}.`
      );
    } else {
      return makeMCQ(11,
        `What happens when a Newton's disc painted with seven rainbow sectors is spun rapidly?`,
        [
          "The colours blend together and the disc appears grayish-white",
          "The disc turns solid black",
          "The disc produces sparks of fire",
          "The disc reflects ultraviolet rays"
        ],
        0,
        "When Newton's disc is rotated fast, persistence of vision causes all seven colours to blend on the retina, appearing nearly white."
      );
    }
  } else {
    return makeMCQ(11,
      `What is the difference between a Real image and a Virtual image in Class 7 Science?`,
      [
        "A real image can be captured on a screen (formed by converging rays), whereas a virtual image cannot be captured on a screen",
        "A real image is always formed by plane mirrors",
        "A virtual image is always inverted and larger",
        "Real images cannot be seen with naked eyes"
      ],
      0,
      "An image that can be obtained on a screen is called a real image (e.g. image formed by a concave mirror or cinema projector). An image that cannot be obtained on a screen is a virtual image."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 12: Forests: Our Lifeline
// ─────────────────────────────────────────────────────────────
export function genChapter12(level) {
  const templateType = randInt(1, 3);

  if (level === 'basic') {
    if (templateType === 1) {
      const layers = [
        { name: "Canopy", desc: "the uppermost branches and leaves of tall trees that form a continuous green roof over the forest" },
        { name: "Understorey", desc: "the layer of smaller trees, shrubs, and tall grasses beneath the canopy" },
        { name: "Forest floor", desc: "the ground level covered with dead leaves, twigs, fruits, and nutrient-rich humus" }
      ];
      const l = randChoice(layers);
      const others = layers.filter(item => item.name !== l.name).map(item => item.name);
      const options = shuffle([l.name, ...others]);
      return makeMCQ(12,
        `In a forest ecosystem, which horizontal layer is described as "${l.desc}"?`,
        options,
        options.indexOf(l.name),
        `NCERT Chapter 12 defines the ${l.name} as ${l.desc}.`
      );
    } else if (templateType === 2) {
      return makeShort(12,
        `What dark, nutrient-rich substance is formed on the forest floor by decomposers breaking down dead plant and animal matter?`,
        "humus",
        "Microorganisms (decomposers) convert dead leaves and animal waste into dark, organic humus that enriches the soil."
      );
    } else {
      return makeMCQ(12,
        `Why are forests popularly referred to as the 'Green Lungs' of the Earth?`,
        [
          "Forest plants release oxygen through photosynthesis and absorb carbon dioxide, maintaining atmospheric balance",
          "Trees exhale water vapor that blows away storms",
          "Forest soil filters methane out of the atmosphere",
          "Trees have physical lungs inside their trunks"
        ],
        0,
        "Plants in forests absorb CO2 for photosynthesis and release O2, acting as giant living purifiers or 'green lungs'."
      );
    }
  } else {
    return makeMCQ(12,
      `How do tree roots and the forest canopy prevent severe floods and soil erosion during heavy torrential rains?`,
      [
        "Canopy breaks the heavy force of raindrops, and roots bind soil while allowing rainwater to seep into ground aquifers",
        "Trees absorb all rainwater into wood cells without letting any drop touch the soil",
        "Forest animals build dams across every river",
        "Leaves vaporize raindrops instantly into dry air"
      ],
      0,
      "The leafy canopy intercepts hard rain, and tree roots bind topsoil particles tightly while creating porous channels for rainwater percolation into groundwater aquifers."
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chapter 13: Wastewater Story
// ─────────────────────────────────────────────────────────────
export function genChapter13(level) {
  const templateType = randInt(1, 4);

  if (level === 'basic') {
    if (templateType === 1) {
      return makeMCQ(13,
        `In a Wastewater Treatment Plant (WWTP), what is the primary function of Bar Screens?`,
        [
          "To remove large physical objects such as sticks, rags, cans, and plastic bags",
          "To kill harmful bacteria using ultraviolet light",
          "To decompose human faeces into biogas",
          "To filter dissolved salts out of water"
        ],
        0,
        "Wastewater first passes through bar screens, which remove large solid objects like rags, sticks, plastic packets, and cans."
      );
    } else if (templateType === 2) {
      return makeShort(13,
        `What chemical disinfectant is commonly added to treated wastewater to kill germs before discharging it into rivers? (Answer: chlorine or ozone)`,
        "chlorine",
        "Treated water is disinfected with chemicals like chlorine or ozone to destroy pathogenic microbes."
      );
    } else if (templateType === 3) {
      return makeShort(13,
        `What are the solid human wastes that settle at the bottom of the sedimentation tank in a WWTP called?`,
        "sludge",
        "Solid faeces that settle at the bottom of the clarifier tank are called sludge. Sludge is scraped out and digested by anaerobic bacteria to produce biogas."
      );
    } else {
      return makeMCQ(13,
        `Why should used cooking oils and fats NEVER be poured down kitchen sinks and drains?`,
        [
          "They harden and block the drain pipes, and choke soil pores reducing water filtering",
          "They explode when touching water",
          "They dissolve plastic pipes instantly",
          "They turn drinking water into gasoline"
        ],
        0,
        "Fats and oils harden and block drainage pipes. In open drains, grease clogs soil pores, preventing water filtration."
      );
    }
  } else {
    if (templateType === 1) {
      return makeMCQ(13,
        `In the aeration tank of a WWTP, air is continuously pumped into the clarified water. What is the biological reason for this?`,
        [
          "To supply oxygen to aerobic bacteria so they can consume human waste, food scraps, and soaps",
          "To evaporate water into clouds",
          "To cool the water so that fats freeze into ice",
          "To separate sand grains from pebbles"
        ],
        0,
        "Pumping air encourages aerobic bacteria to multiply and consume leftover human waste, food particles, and soaps."
      );
    } else {
      return makeMCQ(13,
        `What is a 'Vermi-processing toilet' described in the NCERT Class 7 textbook?`,
        [
          "A toilet where human excreta is treated by earthworms, transforming it into high-quality nutrient compost",
          "A toilet that uses lasers to incinerate waste",
          "A toilet connected directly to river streams without pipes",
          "A toilet flushed exclusively with chemical acids"
        ],
        0,
        "In a vermi-processing toilet, earthworms digest human excreta completely into vermi-compost cakes, providing safe, low-water sanitation."
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Master Question Dispatcher
// Strictly dispatches to each chapter's NCERT generator!
// ─────────────────────────────────────────────────────────────
export function generateQuestion(chapterId, level) {
  switch (Number(chapterId)) {
    case 1:  return genChapter1(level);
    case 2:  return genChapter2(level);
    case 3:  return genChapter3(level);
    case 4:  return genChapter4(level);
    case 5:  return genChapter5(level);
    case 6:  return genChapter6(level);
    case 7:  return genChapter7(level);
    case 8:  return genChapter8(level);
    case 9:  return genChapter9(level);
    case 10: return genChapter10(level);
    case 11: return genChapter11(level);
    case 12: return genChapter12(level);
    case 13: return genChapter13(level);
    default: return genChapter10(level);
  }
}
