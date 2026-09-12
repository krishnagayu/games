/**
 * Class 7 Science Coach - Procedural Infinite Question Generators
 * Infinite randomized diagnostic questions with special focus on Chapter 10: Electric Current and Its Effects.
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

function makeFillIn(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'fillin', text, answer: String(answer), solution };
}

// ───────── Chapter 10: Electricity Specialized Generators ─────────

export function genElectricity(level) {
  const templateType = randInt(1, 5);

  if (level === 'basic') {
    // Basic: Component symbols, polarities, simple series battery, open/closed definition
    if (templateType === 1) {
      const numCells = randChoice([2, 3, 4, 5, 6]);
      const cellVoltage = 1.5;
      const totalV = (numCells * cellVoltage).toFixed(1);
      const options = shuffle([
        `${totalV} V`,
        `${(totalV * 2).toFixed(1)} V`,
        `1.5 V`,
        `${((numCells - 1) * cellVoltage).toFixed(1)} V`
      ]);
      const correctIdx = options.indexOf(`${totalV} V`);

      return makeMCQ(10,
        `A torch battery is formed by connecting ${numCells} standard cells of 1.5 V in series (positive to negative). What is the total voltage supplied?`,
        options,
        correctIdx,
        `In a series battery connection, the voltages of all cells add up directly: ${numCells} × 1.5 V = ${totalV} V.`
      );
    } else if (templateType === 2) {
      const components = [
        { name: "Electric Cell", desc: "One long thin vertical line (+) and one shorter thicker line (-)" },
        { name: "Electric Bulb", desc: "A circle enclosing a coiled loop or squiggle representing the filament" },
        { name: "Open Switch", desc: "A key with an open gap or lifted line that breaks current continuity" },
        { name: "Closed Switch", desc: "A continuous horizontal bar touching both terminal dots" },
        { name: "Electric Battery", desc: "Alternating long thin and short thick lines indicating multiple connected cells" }
      ];
      const target = randChoice(components);
      const others = components.filter(c => c.name !== target.name).map(c => c.name);
      const options = shuffle([target.name, ...others.slice(0, 3)]);
      const correctIdx = options.indexOf(target.name);

      return makeMCQ(10,
        `In a standard circuit diagram, which electrical component is depicted by "${target.desc}"?`,
        options,
        correctIdx,
        `By international CBSE/NCERT circuit conventions, ${target.desc} specifically represents the ${target.name}.`
      );
    } else if (templateType === 3) {
      const appliances = ["electric toaster", "room heater", "electric iron", "electric immersion rod", "electric kettle"];
      const chosen = randChoice(appliances);
      return makeMCQ(10,
        `Which fundamental effect of electric current is primarily utilized by an ${chosen}?`,
        ["Heating effect of electric current", "Magnetic effect of electric current", "Chemical electrolysis effect", "Electrostatic friction effect"],
        0,
        `An ${chosen} contains a high-resistance coil (usually Nichrome) that converts electrical energy into heat (Joule heating).`
      );
    } else if (templateType === 4) {
      const parts = [
        { part: "Tungsten filament", role: "glows white hot and emits light when electric current flows through it" },
        { part: "Nichrome element", role: "generates intense heat due to high resistance and high melting point" },
        { part: "Safety fuse wire", role: "melts immediately when excessive current flows, breaking the circuit" },
        { part: "Copper wire", role: "conducts electricity with very low resistance to connect circuit parts" }
      ];
      const chosen = randChoice(parts);
      const others = parts.filter(p => p.part !== chosen.part).map(p => p.part);
      const options = shuffle([chosen.part, ...others.slice(0, 3)]);
      const correctIdx = options.indexOf(chosen.part);

      return makeMCQ(10,
        `Which specific circuit element or conductor "${chosen.role}"?`,
        options,
        correctIdx,
        `${chosen.part} is specifically engineered for this purpose: it ${chosen.role}.`
      );
    } else {
      const nCells = randChoice([2, 4, 6]);
      const totalV = nCells * 1.5;
      return makeShort(10,
        `How many 1.5 V cells are needed to construct a ${totalV} V torch battery connected in series?`,
        nCells,
        `Number of cells = Total Voltage / Voltage per cell = ${totalV} V / 1.5 V = ${nCells} cells.`
      );
    }
  } else if (level === 'intermediate') {
    // Intermediate: Electromagnet turns vs strength, Oersted compass deflection, circuit troubleshooting
    if (templateType === 1) {
      const turnsA = randChoice([40, 50, 60]);
      const turnsB = turnsA * randChoice([2, 3]);
      const factor = turnsB / turnsA;
      const options = shuffle([
        `Electromagnet B is about ${factor} times stronger than A`,
        `Electromagnet A is stronger than B`,
        `Both electromagnets have identical magnetic strength`,
        `Neither coil will exhibit any magnetism`
      ]);
      const correctIdx = options.indexOf(`Electromagnet B is about ${factor} times stronger than A`);

      return makeMCQ(10,
        `Student A winds ${turnsA} turns of wire on an iron nail, while Student B winds ${turnsB} turns on an identical nail. Both connect their coils to the same 3 V battery. What is the expected comparison?`,
        options,
        correctIdx,
        `The strength of an electromagnet is directly proportional to the number of turns of the coil when the same current flows. Since ${turnsB} / ${turnsA} = ${factor}, Electromagnet B is ~${factor} times stronger.`
      );
    } else if (templateType === 2) {
      const numTotal = randChoice([4, 5, 6]);
      const numReversed = 1;
      const normalVoltage = (numTotal - 2 * numReversed) * 1.5;
      return makeShort(10,
        `A student attempts to make a battery using ${numTotal} identical 1.5 V cells in series. Accidentally, 1 cell is inserted in reverse. What is the net voltage (in V)?`,
        normalVoltage,
        `Each reversed cell cancels out its own voltage AND neutralizes one forward-facing cell. Net aiding cells = ${numTotal} - 2 × 1 = ${numTotal - 2}. Net voltage = ${numTotal - 2} × 1.5 V = ${normalVoltage} V.`
      );
    } else if (templateType === 3) {
      const scenarios = [
        {
          setup: "A circuit has 2 bulbs connected in series. One bulb burns out (filament breaks).",
          question: "What happens to the second bulb?",
          correct: "It stops glowing because the circuit is broken",
          distractors: ["It glows twice as brightly", "It flashes periodically", "It remains unaffected"]
        },
        {
          setup: "A compass is placed right next to a straight wire. The switch is turned ON.",
          question: "What happens to the compass needle?",
          correct: "It deflects away from its North-South alignment",
          distractors: ["It begins spinning continuously at high speed", "It breaks in half", "It remains completely stationary"]
        },
        {
          setup: "Current in an electromagnet is switched completely OFF.",
          question: "What happens to the paper clips held by the iron core?",
          correct: "They fall off because soft iron loses its magnetism without current",
          distractors: ["They stick permanently forever", "They get repelled into the air", "They melt due to sudden heat"]
        }
      ];
      const s = randChoice(scenarios);
      const options = shuffle([s.correct, ...s.distractors]);
      const correctIdx = options.indexOf(s.correct);

      return makeMCQ(10,
        `${s.setup} ${s.question}`,
        options,
        correctIdx,
        `Scientific principle: ${s.correct}. Current generates magnetic force and needs an unbroken closed path to sustain electron drift.`
      );
    } else if (templateType === 4) {
      return makeMCQ(10,
        `Why is pure copper wire NEVER used as a heating element in an electric toaster or heater?`,
        [
          "Copper has very low resistance, so it produces almost negligible heat without burning the supply",
          "Copper is an insulator and cannot carry current",
          "Copper reacts with air to produce hydrogen gas",
          "Copper is magnetic and creates an electromagnetic brake"
        ],
        0,
        `Heating elements require HIGH resistance materials like Nichrome ($H = I^2Rt$). Copper has exceptionally low resistance, which would cause a dead short circuit rather than generating controlled radiant heat.`
      );
    } else {
      const pins = randChoice([12, 18, 24, 30]);
      const turns = randChoice([50, 100]);
      const targetPins = pins * 2;
      return makeShort(10,
        `An electromagnet with ${turns} turns attracts ${pins} steel pins. If we increase the turns to ${turns * 2} (assuming constant current), approximately how many pins will it attract?`,
        targetPins,
        `Doubling the number of turns doubles the magnetic field strength (Ampere-turns), so the carrying capacity doubles from ${pins} to ${targetPins} pins.`
      );
    }
  } else if (level === 'advanced') {
    // Advanced: Joule's heating law proportionality, fuse calculations, electric bell contact dynamics
    if (templateType === 1) {
      const currentMultiplier = randChoice([2, 3]);
      const heatFactor = currentMultiplier * currentMultiplier;
      const options = shuffle([
        `${heatFactor} times`,
        `${currentMultiplier} times`,
        `${currentMultiplier * 2} times`,
        `No change in heat`
      ]);
      const correctIdx = options.indexOf(`${heatFactor} times`);

      return makeMCQ(10,
        `According to Joule's law of heating (H ∝ I² · R · t), if the current I flowing through a resistor is multiplied by ${currentMultiplier} (keeping resistance R and time t constant), the heat generated increases by:`,
        options,
        correctIdx,
        `Heat produced varies with the square of electric current ($H \\propto I^2$). Multiplying current by ${currentMultiplier} increases heat production by ${currentMultiplier}² = ${heatFactor} times.`
      );
    } else if (templateType === 2) {
      const current = randChoice([6, 8, 12]);
      const fuseSafe = current + 3;
      const options = shuffle([
        `${fuseSafe} A fuse`,
        `${current - 2} A fuse`,
        `30 A fuse`,
        `0.5 A fuse`
      ]);
      const correctIdx = options.indexOf(`${fuseSafe} A fuse`);

      return makeMCQ(10,
        `An air conditioner normal operating load draws a steady current of ${current} A. Which fuse rating is safest and most appropriate to protect this circuit without nuisance tripping?`,
        options,
        correctIdx,
        `A fuse rating should be marginally above the standard operating current (e.g. ${fuseSafe} A). A ${current - 2} A fuse will melt during normal use, while a 30 A fuse is too high to protect against dangerous overloads.`
      );
    } else if (templateType === 3) {
      return makeMCQ(10,
        `In an electric bell, what immediately happens the instant the hammer strikes the metallic gong?`,
        [
          "The contact screw loses connection with the armature, breaking the electrical circuit",
          "The electromagnet permanently locks the hammer against the gong",
          "The battery reverses polarity automatically",
          "The gong generates electricity back into the battery"
        ],
        0,
        `As the armature is drawn towards the electromagnet to strike the gong, it moves away from the tip of the contact screw. This opens the circuit, switching the electromagnet off and allowing the spring to snap the armature back.`
      );
    } else if (templateType === 4) {
      const timeSec = randChoice([60, 120, 180]);
      return makeShort(10,
        `If the duration of current flow through a heater wire is increased from 60 seconds to ${timeSec} seconds at constant current and resistance, by what factor does the total heat produced increase?`,
        timeSec / 60,
        `Heat produced is directly proportional to time (H ∝ t). Increasing time from 60 s to ${timeSec} s increases heat by ${timeSec} / 60 = ${timeSec / 60} times.`
      );
    } else {
      return makeMCQ(10,
        `Which device uses the magnetic effect of electric current to automatically interrupt current flow during excessive surge without burning any wire element?`,
        ["MCB (Miniature Circuit Breaker)", "Cartridge wire fuse", "Incandescent filament bulb", "Nichrome heating strip"],
        0,
        `An MCB uses an internal solenoid/electromagnet mechanism to mechanically trip its toggle lever when current exceeds the safe threshold.`
      );
    }
  } else {
    // Olympiad level: Complex multi-step reasoning, polarity configurations, efficiency & energy transformations
    if (templateType === 1) {
      const totalCells = 6;
      const reversedCells = randChoice([1, 2]);
      const netEffective = totalCells - 2 * reversedCells;
      const netV = (netEffective * 1.5).toFixed(1);
      const options = shuffle([
        `${netV} V`,
        `${(totalCells * 1.5).toFixed(1)} V`,
        `0.0 V`,
        `${((totalCells - reversedCells) * 1.5).toFixed(1)} V`
      ]);
      const correctIdx = options.indexOf(`${netV} V`);

      return makeMCQ(10,
        `[Olympiad / NTSE] A circuit is powered by 6 identical 1.5 V cells connected in a series train. Due to an assembly defect, exactly ${reversedCells} cell(s) are soldered in reverse polarity. What is the true potential difference across the load terminals?`,
        options,
        correctIdx,
        `Total forward cells = ${totalCells - reversedCells}. Reversed opposing cells = ${reversedCells}. Net aiding cells = (${totalCells - reversedCells}) - ${reversedCells} = ${netEffective} cells. Net voltage = ${netEffective} × 1.5 V = ${netV} V.`
      );
    } else if (templateType === 2) {
      return makeMCQ(10,
        `[Olympiad / NTSE] Two identical bulbs B1 and B2 are connected in parallel across a 3 V battery. A third identical bulb B3 is then connected in parallel with them. What happens to the brightness of B1 and B2?`,
        [
          "Brightness of B1 and B2 remains unchanged",
          "Brightness of B1 and B2 decreases by half",
          "B1 and B2 stop glowing entirely",
          "B1 glows brighter while B2 dims"
        ],
        0,
        `In a parallel circuit, each branch experiences the full battery voltage independently. Adding another parallel branch does not change the voltage or current through the existing branches (assuming ideal battery internal resistance).`
      );
    } else if (templateType === 3) {
      return makeMCQ(10,
        `[Olympiad / NTSE] A compass needle rests horizontally on a table aligned with Earth's magnetic North. A straight wire is held directly ABOVE the needle running North to South. When current flows from SOUTH to NORTH, according to Ampere's Swimming Rule (SNOW rule), the North pole of the needle deflects towards:`,
        ["West", "East", "Upwards towards the ceiling", "Downwards into the table"],
        0,
        `By the classic SNOW rule: if current flows from South to North in a wire Over the needle, the North pole of the needle is deflected towards the West.`
      );
    } else if (templateType === 4) {
      return makeShort(10,
        `[Olympiad] A wire of resistance 20 Ohms produces 100 Joules of heat in 5 seconds. If the current is doubled and resistance is halved, how many Joules of heat are produced in the same 5 seconds?`,
        200,
        `Heat H ∝ I² · R · t. Here I becomes 2I (factor of 4), R becomes R/2 (factor of 1/2). Net factor = 4 × (1/2) = 2. New heat = 100 J × 2 = 200 Joules.`
      );
    } else {
      return makeMCQ(10,
        `[Olympiad / NTSE] What core material is specifically used in the electromagnet of an industrial scrap crane, and why?`,
        [
          "Soft iron, because of high magnetic permeability and near-zero magnetic retentivity (remanence)",
          "Hard tempered steel, because it remains magnetized even after current is turned off",
          "Solid copper, because it conducts electricity best",
          "Hard wood, because it is an electrical insulator"
        ],
        0,
        `Soft iron magnetizes rapidly under current and demagnetizes virtually instantaneously when current stops. This allows the crane operator to lift scrap metal and drop it precisely at will.`
      );
    }
  }
}

// ───────── Other Chapter Procedural Generators ─────────

function genMotionTime(level) {
  if (level === 'basic' || level === 'intermediate') {
    const d = randChoice([60, 120, 150, 240, 300]);
    const t = randChoice([2, 3, 4, 5]);
    const spd = d / t;
    return makeShort(9,
      `A cyclist covers a straight road distance of ${d} km in ${t} hours. Calculate the uniform speed in km/h.`,
      spd,
      `Speed = Distance / Time = ${d} km / ${t} h = ${spd} km/h.`
    );
  } else {
    const oscillations = randChoice([20, 40, 50]);
    const timeSec = randChoice([30, 60, 100]);
    const T = (timeSec / oscillations).toFixed(1);
    return makeShort(9,
      `A simple pendulum completes ${oscillations} oscillations in ${timeSec} seconds. What is the time period in seconds?`,
      T,
      `Time period T = Total Time / Number of Oscillations = ${timeSec} s / ${oscillations} = ${T} seconds.`
    );
  }
}

function genHeat(level) {
  const temps = [35, 37, 39, 40];
  const c = randChoice(temps);
  const f = Math.round((c * 9/5) + 32);
  if (level === 'basic') {
    return makeMCQ(3,
      `Heat transfers through solid metallic cooking utensils predominantly via which process?`,
      ["Conduction", "Convection", "Radiation", "Transpiration"],
      0,
      `In solids, heat transfers particle-to-particle without bodily movement of matter via conduction.`
    );
  } else {
    return makeShort(3,
      `Convert ${c}°C to degrees Fahrenheit using F = (C × 9/5) + 32.`,
      f,
      `F = (${c} × 9/5) + 32 = ${c * 1.8} + 32 = ${f}°F.`
    );
  }
}

function genAcidsBases(level) {
  const substances = [
    { name: "Lemon juice (Citric acid)", nature: "Acidic", litmus: "Turns blue litmus red" },
    { name: "Baking soda solution (Sodium bicarbonate)", nature: "Basic", litmus: "Turns red litmus blue" },
    { name: "Pure distilled water", nature: "Neutral", litmus: "No color change on either litmus" },
    { name: "Vinegar (Acetic acid)", nature: "Acidic", litmus: "Turns blue litmus red" }
  ];
  const item = randChoice(substances);
  return makeMCQ(4,
    `What will happen when a drop of ${item.name} is placed on a litmus paper?`,
    [item.litmus, "Turns green immediately", "Releases yellow vapors", "Bleaches the paper white"],
    0,
    `${item.name} is ${item.nature}. Consequently, it ${item.litmus.toLowerCase()}.`
  );
}

// ───────── Master Question Dispatcher ─────────
export function generateQuestion(chapterId, level) {
  // If Chapter 10 (Electricity) or requested, generate Electricity questions
  if (chapterId === 10) {
    return genElectricity(level);
  } else if (chapterId === 9) {
    return genMotionTime(level);
  } else if (chapterId === 3) {
    return genHeat(level);
  } else if (chapterId === 4) {
    return genAcidsBases(level);
  } else {
    // Default fallback to Electricity specialized or general science question
    return genElectricity(level);
  }
}
