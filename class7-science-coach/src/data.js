/**
 * Class 7 Science Coach – CBSE Syllabus Data
 * Complete Class 7 Science syllabus with specialized focus on Chapter 10: Electric Current and Its Effects.
 */

export const chapters = [
  {
    id: 1,
    title: "Nutrition in Plants",
    icon: "🌱",
    accent: "hsl(145, 70%, 48%)",
    topics: ["Autotrophic & Heterotrophic Nutrition", "Photosynthesis & Chlorophyll", "Parasitic & Insectivorous Plants", "Saprotrophs & Symbiosis"],
    summary: "Explores how green plants synthesize food using sunlight, water, carbon dioxide, and chlorophyll, alongside non-green plants and symbiotic relations."
  },
  {
    id: 2,
    title: "Nutrition in Animals",
    icon: "🦁",
    accent: "hsl(25, 85%, 52%)",
    topics: ["Modes of Feeding", "Human Digestive System", "Digestion in Ruminants", "Feeding & Digestion in Amoeba"],
    summary: "Traces the journey of food through ingestion, digestion, absorption, assimilation, and egestion across humans and ruminants."
  },
  {
    id: 3,
    title: "Heat & Temperature",
    icon: "🔥",
    accent: "hsl(15, 90%, 55%)",
    topics: ["Clinical & Laboratory Thermometers", "Conduction, Convection & Radiation", "Sea Breeze and Land Breeze", "Woollen clothes in winter"],
    summary: "Covers thermal energy transfer mechanisms, temperature scales, practical thermometer reading, and atmospheric convection currents."
  },
  {
    id: 4,
    title: "Acids, Bases and Salts",
    icon: "🧪",
    accent: "hsl(285, 75%, 60%)",
    topics: ["Natural Indicators (Litmus, Turmeric, China Rose)", "Neutralization Reaction", "Everyday Neutralization (Indigestion, Ant Stings)", "Acid Rain"],
    summary: "Investigates acidic and basic substances, color transitions of chemical and natural indicators, and salt formation through neutralization."
  },
  {
    id: 5,
    title: "Physical and Chemical Changes",
    icon: "⚗️",
    accent: "hsl(205, 80%, 55%)",
    topics: ["Reversible Physical Changes", "Chemical Reactions & New Substances", "Rusting of Iron & Prevention", "Crystallization Techniques"],
    summary: "Distinguishes between reversible phase changes and irreversible chemical bond transformations such as burning, rusting, and copper sulfate reactions."
  },
  {
    id: 6,
    title: "Respiration in Organisms",
    icon: "🫁",
    accent: "hsl(175, 70%, 45%)",
    topics: ["Aerobic vs Anaerobic Respiration", "Human Respiratory System", "Mechanism of Breathing", "Respiration in Fish, Earthworms & Insects"],
    summary: "Examines cellular energy release, oxygen transport, the role of the diaphragm, and specialized gas exchange organs across diverse fauna."
  },
  {
    id: 7,
    title: "Transportation in Animals and Plants",
    icon: "❤️",
    accent: "hsl(350, 75%, 55%)",
    topics: ["Circulatory System (Blood, Vessels & Heart)", "Heartbeat & Pulse Rate", "Human Excretory System", "Xylem & Phloem Transport"],
    summary: "Analyzes nutrient, water, and gas circulation through the human heart, vascular plant tissues (xylem and phloem), and kidney filtration."
  },
  {
    id: 8,
    title: "Reproduction in Plants",
    icon: "🌺",
    accent: "hsl(320, 70%, 60%)",
    topics: ["Asexual Reproduction (Budding, Spores, Fragmentation)", "Flower Structure & Pollination", "Fertilization & Zygote Formation", "Seed Dispersal Mechanisms"],
    summary: "Details vegetative propagation, floral reproductive anatomy, self vs cross-pollination, and adaptations for wind/water/animal seed dispersion."
  },
  {
    id: 9,
    title: "Motion and Time",
    icon: "⏱️",
    accent: "hsl(220, 80%, 60%)",
    topics: ["Speed Calculation (Distance/Time)", "Simple Pendulum & Periodic Oscillation", "Units of Time and Speed", "Distance-Time Graphs"],
    summary: "Introduces standard speed formulas, oscillatory motion of bob pendulums, timekeeping history, and graphical analysis of uniform motion."
  },
  {
    id: 10,
    title: "Electric Current and Its Effects",
    icon: "⚡",
    accent: "hsl(48, 100%, 50%)",
    isFeatured: true,
    badge: "Specialized Deep-Dive Focus",
    topics: [
      "Standard Symbols of Circuit Elements (Cell, Bulb, Switch, Battery, Wire)",
      "Open vs Closed Circuits & Direction of Current (+ to -)",
      "Heating Effect of Electric Current (Nichrome Wire & Joule Heating)",
      "Safety Devices: Electric Fuse (Low Melting Point) & MCBs",
      "Magnetic Effect of Electric Current (Hans Christian Oersted)",
      "Electromagnets (Core, Turns, Current & Strength)",
      "Working of the Electric Bell (Electromagnet, Armature, Gong, Contact Screw)"
    ],
    summary: "Master the fundamentals of electrical circuits, symbols, heating appliances, safety fuses, Oersted's magnetic compass effect, electromagnets, and electric bells with interactive virtual labs."
  },
  {
    id: 11,
    title: "Light & Optical Phenomena",
    icon: "💡",
    accent: "hsl(55, 95%, 55%)",
    topics: ["Rectilinear Propagation of Light", "Reflection from Plane Mirrors (Virtual & Lateral Inversion)", "Spherical Mirrors (Concave & Convex)", "Lenses & Newton's Rainbow Disc"],
    summary: "Explores straight-line ray propagation, mirror image characteristics, convergence/divergence in lenses, and dispersion of white light into spectrum."
  },
  {
    id: 12,
    title: "Forests: Our Lifeline",
    icon: "🌲",
    accent: "hsl(125, 60%, 45%)",
    topics: ["Canopy and Understorey Layers", "Forest Food Chains & Decomposers", "Soil Conservation & Water Cycle", "Interdependence of Plants and Animals"],
    summary: "Presents forests as dynamic living entities maintaining the atmospheric balance of CO2/O2, recharging groundwater, and anchoring topsoil."
  },
  {
    id: 13,
    title: "Wastewater Story",
    icon: "💧",
    accent: "hsl(190, 85%, 45%)",
    topics: ["Sewage & Contaminants", "Wastewater Treatment Plant (WWTP) Stages", "Bar Screens, Grit Chambers & Clarifiers", "Aerobic Digestion & Sanitation Alternatives"],
    summary: "Follows municipal wastewater purification, clarifying physical, chemical, and biological sanitation processes to safeguard freshwater sources."
  }
];

// ───────── Circuit Component Guide for Chapter 10 ─────────
export const electricityGuide = {
  components: [
    {
      name: "Electric Cell",
      symbol: "—| ı—",
      svg: `<svg viewBox="0 0 100 40" class="comp-svg"><line x1="5" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="3"/><line x1="40" y1="5" x2="40" y2="35" stroke="#38bdf8" stroke-width="4"/><line x1="60" y1="12" x2="60" y2="28" stroke="#f43f5e" stroke-width="8"/><line x1="60" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="3"/><text x="35" y="12" fill="#38bdf8" font-size="10" font-weight="bold">+</text><text x="65" y="12" fill="#f43f5e" font-size="10" font-weight="bold">-</text></svg>`,
      rule: "The longer, thinner line represents the Positive (+) terminal, while the shorter, thicker line represents the Negative (-) terminal."
    },
    {
      name: "Electric Battery",
      symbol: "—| ı | ı—",
      svg: `<svg viewBox="0 0 120 40" class="comp-svg"><line x1="5" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="3"/><line x1="30" y1="6" x2="30" y2="34" stroke="#38bdf8" stroke-width="4"/><line x1="45" y1="12" x2="45" y2="28" stroke="#f43f5e" stroke-width="7"/><line x1="45" y1="20" x2="70" y2="20" stroke="currentColor" stroke-width="3"/><line x1="70" y1="6" x2="70" y2="34" stroke="#38bdf8" stroke-width="4"/><line x1="85" y1="12" x2="85" y2="28" stroke="#f43f5e" stroke-width="7"/><line x1="85" y1="20" x2="115" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
      rule: "A combination of two or more cells. Crucial Rule: The positive terminal of one cell must connect to the negative terminal of the next."
    },
    {
      name: "Switch in ON Position",
      symbol: "●——●",
      svg: `<svg viewBox="0 0 100 40" class="comp-svg"><line x1="5" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="20" r="4" fill="#22c55e"/><line x1="30" y1="20" x2="70" y2="20" stroke="#22c55e" stroke-width="3"/><circle cx="70" cy="20" r="4" fill="#22c55e"/><line x1="70" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
      rule: "The circuit is CLOSED. Current flows continuously throughout the entire loop from positive to negative."
    },
    {
      name: "Switch in OFF Position",
      symbol: "● / ●",
      svg: `<svg viewBox="0 0 100 40" class="comp-svg"><line x1="5" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="20" r="4" fill="#f59e0b"/><line x1="30" y1="20" x2="65" y2="6" stroke="#f59e0b" stroke-width="3"/><circle cx="70" cy="20" r="4" fill="#f59e0b"/><line x1="70" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
      rule: "The circuit is OPEN (broken). The air gap prevents current flow; no device in the circuit can operate."
    },
    {
      name: "Electric Bulb",
      symbol: "—( ∿ )—",
      svg: `<svg viewBox="0 0 100 40" class="comp-svg"><line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M 43 20 Q 47 10 50 20 Q 53 30 57 20" fill="none" stroke="#facc15" stroke-width="2.5"/><line x1="65" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
      rule: "Contains a thin filament (typically tungsten) that glows white-hot due to electric resistance when current passes."
    },
    {
      name: "Safety Fuse Wire",
      symbol: "—[ ~ ]—",
      svg: `<svg viewBox="0 0 100 40" class="comp-svg"><rect x="30" y="8" width="40" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="5" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="3"/><path d="M 33 20 Q 40 14 50 20 T 67 20" fill="none" stroke="#f43f5e" stroke-width="2"/><line x1="70" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
      rule: "Made of an alloy with low melting point. Melts and breaks the circuit if dangerous excessive current surges occur."
    }
  ],
  keyConcepts: [
    {
      title: "1. Heating Effect (Joule Heating)",
      desc: "When current flows through high-resistance conductor (Nichrome), electrical energy turns into heat energy. Used in electric irons, toasters, water heaters, and room geysers."
    },
    {
      title: "2. Magnetic Effect (Oersted's Discovery)",
      desc: "In 1820, Hans Christian Oersted discovered that a wire carrying current acts like a magnet and deflects a nearby compass needle. Current produces an invisible magnetic field."
    },
    {
      title: "3. Electromagnets",
      desc: "A soft iron core wrapped with insulated wire becomes a strong magnet when current is switched ON, and instantly loses magnetism when current is switched OFF. Used in cranes, scrap separators, motors, and bells."
    },
    {
      title: "4. The Electric Bell",
      desc: "Uses an electromagnet and a spring-loaded armature with a contact screw. When circuit closes, hammer strikes the gong, which pulls the contact away, breaking the circuit; spring returns armature to restart cycle."
    },
    {
      title: "5. MCB (Miniature Circuit Breaker)",
      desc: "Modern electromagnetic switch that automatically trips OFF when current in a household circuit exceeds safe limits. Can be flipped back ON without needing wire replacement."
    }
  ]
};

// ───────── Worksheet Questions ─────────
// Multi-level diagnostic static questions: Basic, Intermediate, Advanced, Olympiad
export const worksheets = {
  basic: [
    // Chapter 10: Electricity (Focus)
    {
      chapter: 10,
      type: "mcq",
      text: "In the standard circuit symbol for an electric cell, the longer, thinner line represents which terminal?",
      options: ["Positive terminal (+)", "Negative terminal (-)", "Neutral terminal", "Ground terminal"],
      answer: 0,
      solution: "In an electric cell symbol, the longer and thinner vertical line represents the positive terminal, while the shorter and thicker line represents the negative terminal."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "Which of the following materials is most commonly used to make the heating element in electrical appliances like irons and geysers?",
      options: ["Nichrome", "Copper", "Silver", "Aluminium"],
      answer: 0,
      solution: "Nichrome (an alloy of nickel and chromium) has very high electrical resistance and high melting point, making it ideal for heating elements."
    },
    {
      chapter: 10,
      type: "short",
      text: "What happens to the filament of an incandescent bulb if it gets 'fused'?",
      answer: "breaks",
      solution: "When a bulb fuses, its thin tungsten filament breaks. This breaks the electrical circuit loop, so current cannot flow and the bulb cannot glow."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "A battery is formed by connecting cells. To properly connect two cells in series, how must their terminals be linked?",
      options: [
        "Positive terminal of one cell to negative terminal of the next",
        "Positive terminal of one cell to positive terminal of the other",
        "Negative terminal of one cell to negative terminal of the other",
        "Both terminals connected to the same side"
      ],
      answer: 0,
      solution: "In a series battery, the positive terminal of one cell must be connected to the negative terminal of the succeeding cell for electric current to flow properly."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "Who was the first scientist to discover that an electric current produces a magnetic field that deflects a compass needle?",
      options: ["Hans Christian Oersted", "Michael Faraday", "Thomas Edison", "Isaac Newton"],
      answer: 0,
      solution: "Hans Christian Oersted in 1820 observed that a compass needle was deflected whenever an electric current passed through a nearby wire."
    },
    {
      chapter: 10,
      type: "short",
      text: "What property must a fuse wire possess to prevent electrical fires during short circuits? (Answer: high or low melting point)",
      answer: "low melting point",
      solution: "A fuse wire must have a low melting point so that it heats up rapidly and melts, breaking the circuit before excessive current can cause fire."
    },
    // Other chapters basics
    {
      chapter: 1,
      type: "mcq",
      text: "The tiny pores present on the surface of plant leaves through which carbon dioxide is taken in are called:",
      options: ["Stomata", "Chloroplasts", "Guard cells", "Xylem"],
      answer: 0,
      solution: "Stomata are microscopic openings on leaves regulated by guard cells that facilitate gas exchange."
    },
    {
      chapter: 3,
      type: "short",
      text: "What is the normal temperature of a healthy human body in degrees Celsius? (e.g. 37)",
      answer: "37",
      solution: "Normal human body temperature is approximately 37°C (or 98.6°F)."
    },
    {
      chapter: 4,
      type: "mcq",
      text: "What color does blue litmus paper turn when exposed to an acidic solution like lemon juice?",
      options: ["Red", "Blue", "Green", "Yellow"],
      answer: 0,
      solution: "Acids turn blue litmus paper red, while bases turn red litmus paper blue."
    },
    {
      chapter: 9,
      type: "short",
      text: "Calculate the speed of a car that travels a distance of 180 km in 3 hours (in km/h).",
      answer: "60",
      solution: "Speed = Distance / Time = 180 km / 3 h = 60 km/h."
    }
  ],

  intermediate: [
    // Chapter 10: Electricity
    {
      chapter: 10,
      type: "mcq",
      text: "In an electric bell, what component causes the hammer to strike the gong repeatedly when the switch is pressed?",
      options: [
        "Rapid cycling of the electromagnet turning on and breaking contact at the screw",
        "A motorized gear mechanism",
        "A permanent bar magnet rotating continuously",
        "Heat expansion of the bimetallic strip"
      ],
      answer: 0,
      solution: "When current flows, the electromagnet attracts the iron armature and strikes the gong. This movement pulls the armature away from the contact screw, opening the circuit. The electromagnet loses power, the spring pulls the armature back, re-establishing contact, and repeating the cycle."
    },
    {
      chapter: 10,
      type: "short",
      text: "If you increase the number of turns of insulated wire around an iron nail in an electromagnet, does its magnetic strength increase or decrease?",
      answer: "increase",
      solution: "Increasing the number of wire turns amplifies the concentrated magnetic field lines, making the electromagnet significantly stronger."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "Why are MCBs (Miniature Circuit Breakers) preferred over traditional cartridge wire fuses in modern electrical wiring?",
      options: [
        "They automatically trip off and can be simply reset without needing wire replacement",
        "They use zero electrical resistance",
        "They never turn off under any current",
        "They convert electrical current to radio waves"
      ],
      answer: 0,
      solution: "MCBs are automatic electromagnetic switches. When an overcurrent or short circuit occurs, the switch flips off. After fixing the fault, it can simply be flipped back on without rewiring."
    },
    {
      chapter: 10,
      type: "short",
      text: "A student connects 4 electric cells of 1.5 V each in proper series configuration. What is the total voltage of this battery in Volts?",
      answer: "6",
      solution: "In a series connection (+ to -), voltages add up: 1.5 V + 1.5 V + 1.5 V + 1.5 V = 6.0 V."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "Two identical coils A and B are wrapped on identical iron cores. Coil A has 50 turns with 1 A current; Coil B has 100 turns with 1 A current. Which coil will pick up more iron pins?",
      options: ["Coil B", "Coil A", "Both will pick up the same amount", "Neither will attract pins"],
      answer: 0,
      solution: "Magnetic field strength is directly proportional to the number of turns for the same current. 100 turns produces double the magnetomotive force of 50 turns."
    },
    {
      chapter: 5,
      type: "mcq",
      text: "Which of the following is an example of a chemical change?",
      options: ["Rusting of iron in moist air", "Melting of ice into water", "Tearing a sheet of paper", "Dissolving salt in water"],
      answer: 0,
      solution: "Rusting creates a completely new chemical compound (iron oxide: Fe2O3.xH2O) and is irreversible by ordinary physical means."
    },
    {
      chapter: 9,
      type: "short",
      text: "A simple pendulum takes 40 seconds to complete 20 full oscillations. What is its time period in seconds?",
      answer: "2",
      solution: "Time period = Total time / Number of oscillations = 40 s / 20 = 2 seconds."
    }
  ],

  advanced: [
    {
      chapter: 10,
      type: "mcq",
      text: "A student sets up a circuit with a cell, a bulb, and a switch. However, despite connecting both wires to the bulb, the bulb does not glow even when the switch is closed. Which of the following could explain the fault?",
      options: [
        "The bulb filament is broken (fused), creating an internal open circuit",
        "Connecting wires are made of high-conductivity copper",
        "The switch is closed completing the path",
        "The battery has too fresh a charge"
      ],
      answer: 0,
      solution: "If the filament inside the bulb is broken, the circuit path is broken right at the filament. This open circuit prevents current flow, so no glow occurs."
    },
    {
      chapter: 10,
      type: "short",
      text: "Name the two primary causes of excessive current surges that trigger household fuses or MCBs. (e.g. short circuit and overloading)",
      answer: "short circuit and overloading",
      solution: "Direct contact between live and neutral wires (short circuit) and connecting too many high-power appliances to a single socket (overloading) cause dangerous current surges."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "When an electric current is passed through a wire placed parallel and directly above a magnetic compass pointing North-South, the compass needle deflects. If the direction of the current is reversed, what happens?",
      options: [
        "The needle deflects in the opposite direction",
        "The needle stops deflecting entirely",
        "The needle spins continuously like a motor",
        "The needle demagnetizes permanently"
      ],
      answer: 0,
      solution: "The direction of the magnetic field generated by an electric current depends directly on the direction of current flow (Right-Hand Thumb Rule). Reversing the current flips the magnetic polarity, deflecting the needle in the opposite direction."
    },
    {
      chapter: 10,
      type: "short",
      text: "Why is a soft iron piece preferred inside an electromagnet coil over a hard steel piece for use in cranes and electric bells?",
      answer: "loses magnetism quickly",
      solution: "Soft iron is a temporary magnetic material: it magnetizes strongly when current is on and instantly loses its magnetism when current is off, allowing cranes to release scrap metal."
    },
    {
      chapter: 11,
      type: "mcq",
      text: "A rainbow formed after rain demonstrates which fundamental optical property of light through water droplets?",
      options: ["Dispersion of white sunlight into seven component colors", "Total rectilinear shadow formation", "Polarized reflection only", "Lateral inversion of parallel rays"],
      answer: 0,
      solution: "Water droplets act as tiny prisms, refracting and dispersing polychromatic sunlight into its constituent spectral colors (VIBGYOR)."
    }
  ],

  olympiad: [
    {
      chapter: 10,
      type: "mcq",
      text: "In an electric circuit, four identical 1.5 V cells are connected. Accidentally, one cell is connected in reverse polarity (+ to +). What is the effective output voltage across the load terminals?",
      options: ["3.0 V", "6.0 V", "0 V", "4.5 V"],
      answer: 0,
      solution: "Three cells are properly aiding: 3 × 1.5 V = +4.5 V. One reverse cell opposes: -1.5 V. Effective voltage = 4.5 V - 1.5 V = 3.0 V."
    },
    {
      chapter: 10,
      type: "short",
      text: "An electric heater wire of resistance R is cut into two equal halves. Since the heat produced H is proportional to I²·R·t, what happens to the resistance of each half wire? (Answer: halved or doubled)",
      answer: "halved",
      solution: "Resistance of a conductor is directly proportional to its length (R ∝ L). Halving the length halves the resistance."
    },
    {
      chapter: 10,
      type: "mcq",
      text: "Why does a CFL (Compact Fluorescent Lamp) or LED consume significantly less electricity than a traditional incandescent bulb for delivering the exact same brightness?",
      options: [
        "Incandescent bulbs waste the majority of electrical energy as unwanted heat rather than visible light",
        "CFLs violate conservation of energy",
        "LEDs eliminate electric resistance entirely through superconductivity at room temperature",
        "Incandescent bulbs require alternating magnetic fields"
      ],
      answer: 0,
      solution: "In an incandescent bulb, almost 90% of the electrical energy is wasted as heat to make the tungsten filament reach 2500°C before emitting light. LEDs and CFLs convert energy to light with minimal heat wastage."
    },
    {
      chapter: 10,
      type: "short",
      text: "In an electric bell mechanism, if the contact screw is tightened too much so that the armature cannot break contact even when attracted by the electromagnet, will the bell ring continuously or strike just once?",
      answer: "strike just once",
      solution: "If contact is never broken, the circuit remains closed. The electromagnet permanently holds the armature in the attracted position, resulting in only a single initial strike."
    },
    {
      chapter: 9,
      type: "mcq",
      text: "A train moves with a speed of 90 km/h. What is its speed in meters per second (m/s)?",
      options: ["25 m/s", "30 m/s", "15 m/s", "36 m/s"],
      answer: 0,
      solution: "To convert km/h to m/s, multiply by 5/18: 90 × (5/18) = 5 × 5 = 25 m/s."
    }
  ]
};
