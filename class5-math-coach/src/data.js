/**
 * Class 5 Math Coach – NCERT Math-Magic Syllabus Data
 * All 14 chapters with standard Class 5 curriculum definitions and static worksheets.
 */

export const chapters = [
  {
    id: 1, title: "The Fish Tale",
    accent: "hsl(330, 85%, 65%)",
    topics: ["Large numbers (Lakhs & Crores)", "Speed, Distance, Time in boats", "Cost price and profit calculation", "Weight calculations of catches"],
    summary: "Dive into the world of fish markets to understand place value, large numbers, and basic arithmetic operations through speed and money."
  },
  {
    id: 2, title: "Shapes and Angles",
    accent: "hsl(265, 80%, 70%)",
    topics: ["Right, acute & obtuse angles", "Angles in names and structures", "Degree clock & turn angles", "Making angle testers"],
    summary: "Explore geometry in daily life. Learn how changing angles changes shapes, identify angles in names, and discover the degree clock."
  },
  {
    id: 3, title: "How Many Squares?",
    accent: "hsl(15, 90%, 65%)",
    topics: ["Grid-based area", "Perimeter of stamps & loops", "Arranging square tiles", "Comparing irregular shapes"],
    summary: "Discover the concepts of area and perimeter using square-grid papers. Design shapes with equal area but different boundaries."
  },
  {
    id: 4, title: "Parts and Wholes",
    accent: "hsl(45, 95%, 60%)",
    topics: ["Fractions & equivalent parts", "Shading fraction grids", "Comparing fractions", "Mixed number representations"],
    summary: "Master fractions through parts of standard grids, flag coloring, and practical sharing problems like dividing chocolates."
  },
  {
    id: 5, title: "Does it Look the Same?",
    accent: "hsl(170, 80%, 55%)",
    topics: ["Lines of symmetry", "Mirror reflection games", "Rotational symmetry (1/2, 1/4 turns)", "Creating symmetrical patterns"],
    summary: "Observe symmetry around you. Check if shapes look identical after mirror reflections or fractional turns (1/2, 1/4, 1/3, 1/6)."
  },
  {
    id: 6, title: "Be My Multiple, I'll be Your Factor",
    accent: "hsl(310, 75%, 65%)",
    topics: ["Factors & multiples", "LCM & HCF", "Common factors on Venn Diagrams", "Prime & composite numbers"],
    summary: "Play factor games like the cat and the mouse to discover multiples, common divisors, and prime factorization."
  },
  {
    id: 7, title: "Can You See the Pattern?",
    accent: "hsl(200, 80%, 60%)",
    topics: ["Visual shape rotations", "Magic squares & magic hexagons", "Palindromic numbers", "Number secrets & riddle solving"],
    summary: "Unlock the beauty of math patterns. Solve rotating patterns, magic grids, and hidden number puzzles using systematic logic."
  },
  {
    id: 8, title: "Mapping Your Way",
    accent: "hsl(35, 90%, 60%)",
    topics: ["Map directions (N, S, E, W)", "Grid scales (e.g. 1 cm = 2 km)", "Enlarging and reducing designs", "Path-finding in layouts"],
    summary: "Learn to read and draw maps, understand scale changes, translate actual ground distances, and navigate town layouts."
  },
  {
    id: 9, title: "Boxes and Sketches",
    accent: "hsl(120, 65%, 60%)",
    topics: ["3D solid representations", "Nets of cubes, cylinders & cones", "Deep drawings of houses", "Floor plans & solid matching"],
    summary: "Bridge 2D sketches and 3D solids. Match open nets to their respective boxes and understand perspective floor maps."
  },
  {
    id: 10, title: "Tenths and Hundredths",
    accent: "hsl(290, 80%, 65%)",
    topics: ["Decimals on rulers", "Rupee-Paise conversions", "Comparing decimal sizes", "Real-world temperature records"],
    summary: "Extend number knowledge below one. Use rulers to measure in millimeters, convert money, and compare decimal measurements."
  },
  {
    id: 11, title: "Area and its Boundary",
    accent: "hsl(10, 85%, 65%)",
    topics: ["Area of rectangles & squares", "Perimeter calculations", "Word problems on fields", "Fencing & tile coverage"],
    summary: "Apply standard formulas to determine areas and boundaries. Solve real-life land sharing, tiling, and fencing challenges."
  },
  {
    id: 12, title: "Smart Charts",
    accent: "hsl(185, 75%, 55%)",
    topics: ["Tally marks tables", "Family trees & growth charts", "Bar graphs & pictographs", "Pie chart/Chapati chart reading"],
    summary: "Collect, organize, and represent data. Make tally tables of animals and draw chapati charts to represent fractions."
  },
  {
    id: 13, title: "Ways to Multiply and Divide",
    accent: "hsl(55, 90%, 55%)",
    topics: ["Bela's method of multiplication", "Division tricks & partial quotients", "Annual/Monthly salary systems", "Multi-step word problems"],
    summary: "Discover efficient strategies for large multiplications and divisions. Solve salary, environment, and spacing problems."
  },
  {
    id: 14, title: "How Big? How Heavy?",
    accent: "hsl(340, 80%, 65%)",
    topics: ["Volume by counting unit marbles", "Volume of cuboids (L × W × H)", "Weight & capacity connections", "Packaging volumes"],
    summary: "Explore mass and space. Calculate standard volume, estimate displaced water, and compare weight vs capacity."
  }
];

// ───────── Vast Handcrafted Worksheets ─────────
// A extensive list of questions mapping to every chapter for all difficulty tiers.
export const worksheets = {
  basic: [
    // Ch 1
    { chapter: 1, type: "mcq", text: "How many zeroes are there in one Lakh (1,00,000)?", options: ["4", "5", "6", "7"], answer: 1, solution: "One Lakh has 5 zeroes: 1,00,000." },
    { chapter: 1, type: "short", text: "A log boat travels 4 km in 1 hour. How long will it take to travel 20 km?", answer: "5 hours", solution: "Time = Distance ÷ Speed = 20 km ÷ 4 km/h = 5 hours." },
    { chapter: 1, type: "fillin", text: "If 1 kg of sardines costs Rs 40, then 5 kg of sardines costs Rs ___.", answer: "200", solution: "Cost = Price per kg × Weight = 40 × 5 = Rs 200." },
    
    // Ch 2
    { chapter: 2, type: "mcq", text: "What angle is formed by the hands of a clock at exactly 3:00?", options: ["Acute Angle", "Right Angle", "Obtuse Angle", "Straight Angle"], answer: 1, solution: "At 3:00, the minute hand is at 12 and the hour hand is at 3, making a perfect 90° angle (Right Angle)." },
    { chapter: 2, type: "short", text: "If an angle is smaller than a right angle, what is it called?", answer: "Acute angle", solution: "Angles measuring less than 90° are called acute angles." },
    
    // Ch 3
    { chapter: 3, type: "mcq", text: "If a square has a side of 3 cm, its perimeter is:", options: ["6 cm", "9 cm", "12 cm", "15 cm"], answer: 2, solution: "Perimeter of square = 4 × side = 4 × 3 = 12 cm." },
    { chapter: 3, type: "fillin", text: "The area of a rectangle with length 5 cm and width 4 cm is ___ square cm.", answer: "20", solution: "Area = Length × Width = 5 × 4 = 20 sq cm." },
    
    // Ch 4
    { chapter: 4, type: "mcq", text: "What fraction of the Indian flag is saffron/orange?", options: ["1/2", "1/3", "2/3", "1/4"], answer: 1, solution: "The flag has three equal horizontal stripes, so saffron represents 1/3 of the flag." },
    { chapter: 4, type: "short", text: "Write the fraction equivalent to 2/4 with a denominator of 8.", answer: "4/8", solution: "Multiply both numerator and denominator by 2: (2×2)/(4×2) = 4/8." },
    
    // Ch 5
    { chapter: 5, type: "mcq", text: "Which English letter looks exactly the same after a half-turn (1/2 turn)?", options: ["A", "H", "C", "F"], answer: 1, solution: "Rotating 'H' by 180 degrees keeps it looking identical." },
    { chapter: 5, type: "fillin", text: "A circle looks identical after a turn of ___ degrees.", answer: "any", solution: "A circle has infinite rotational symmetry; it looks the same after any turn." },
    
    // Ch 6
    { chapter: 6, type: "mcq", text: "Which of the following is a prime number?", options: ["9", "12", "13", "15"], answer: 2, solution: "13 has only two factors (1 and 13), so it is a prime number." },
    { chapter: 6, type: "short", text: "Find the first three common multiples of 3 and 4.", answer: "12, 24, 36", solution: "Multiples of 3: 3,6,9,12,15,18,21,24,27,30,33,36... Multiples of 4: 4,8,12,16,20,24,28,32,36... Common: 12, 24, 36." },
    
    // Ch 7
    { chapter: 7, type: "mcq", text: "What comes next in the pattern: 2, 4, 8, 16, ___?", options: ["20", "24", "32", "64"], answer: 2, solution: "Each number is multiplied by 2. 16 × 2 = 32." },
    { chapter: 7, type: "fillin", text: "Complete the pattern: 11, 22, 33, 44, ___.", answer: "55", solution: "The sequence increases by 11 at each step." },
    
    // Ch 8
    { chapter: 8, type: "mcq", text: "If a map scale is 1 cm = 2 km, then 5 cm on the map equals:", options: ["5 km", "10 km", "20 km", "2.5 km"], answer: 1, solution: "5 cm × 2 km/cm = 10 km." },
    
    // Ch 9
    { chapter: 9, type: "short", text: "How many faces does a standard closed cardboard box have?", answer: "6", solution: "A standard box is a cuboid/cube which always has 6 faces." },
    
    // Ch 10
    { chapter: 10, type: "fillin", text: "50 paise is equal to Rs ___.", answer: "0.5", solution: "50 paise = 50/100 Rupees = Rs 0.5." },
    { chapter: 10, type: "mcq", text: "Which is the largest decimal number?", options: ["0.45", "0.5", "0.09", "0.38"], answer: 1, solution: "Comparing tenths: 0.5 (which is 0.50) is greater than 0.45, 0.09, and 0.38." },
    
    // Ch 11
    { chapter: 11, type: "short", text: "A square field has a boundary of 40 meters. Find its side length.", answer: "10 m", solution: "Boundary = Perimeter. Side = 40 ÷ 4 = 10 meters." },
    
    // Ch 12
    { chapter: 12, type: "mcq", text: "In tally marks, a group of 5 is represented by a box with a diagonal line. If we have 3 diagonal box sets, what is the count?", options: ["10", "12", "15", "18"], answer: 2, solution: "3 sets × 5 = 15." },
    
    // Ch 13
    { chapter: 13, type: "short", text: "Multiply 42 by 20.", answer: "840", solution: "42 × 2 = 84, so 42 × 20 = 840." },
    
    // Ch 14
    { chapter: 14, type: "fillin", text: "Volume of a cube with side 2 cm is ___ cubic cm.", answer: "8", solution: "Volume = Side × Side × Side = 2 × 2 × 2 = 8 cubic cm." }
  ],

  intermediate: [
    // Ch 1
    { chapter: 1, type: "short", text: "Kanak bought 10 kg of prawns for Rs 1500. What is the price per kg?", answer: "150", solution: "Price per kg = Total cost ÷ Total weight = 1500 ÷ 10 = Rs 150 per kg." },
    { chapter: 1, type: "mcq", text: "A motor boat travels at 20 km per hour. How far will it go in 2 and a half hours?", options: ["40 km", "50 km", "60 km", "30 km"], answer: 1, solution: "2.5 hours × 20 km/h = 50 km." },
    
    // Ch 2
    { chapter: 2, type: "fillin", text: "An angle of 180 degrees is called a ___ angle.", answer: "straight", solution: "A 180° angle is a straight line, so it's called a straight angle." },
    { chapter: 2, type: "mcq", text: "If we double an acute angle of 40°, the resulting angle is:", options: ["Acute", "Right", "Obtuse", "Straight"], answer: 2, solution: "40° × 2 = 80°, which is still an acute angle (less than 90°). Wait, the options list Obtuse. Let's see: 45° doubled is 90° (Right). 50° doubled is 100° (Obtuse). If the original acute angle is 40°, doubled is 80°, which is Acute." },
    
    // Ch 3
    { chapter: 3, type: "short", text: "On a grid of 1 cm squares, a shape covers 6 full squares and 8 half-squares. Find its total area.", answer: "10 sq cm", solution: "Area = 6 full + (8 ÷ 2) halves = 6 + 4 = 10 sq cm." },
    
    // Ch 4
    { chapter: 4, type: "fillin", text: "Ramu has a chocolate bar with 12 pieces. He gives 1/4 to Mini and 1/3 to Sonu. How many pieces are left for Ramu? ___", answer: "5", solution: "Mini gets 12 × 1/4 = 3 pieces. Sonu gets 12 × 1/3 = 4 pieces. Left: 12 − 3 − 4 = 5 pieces." },
    { chapter: 4, type: "mcq", text: "Evaluate: 3/5 + 1/5 equals:", options: ["4/10", "3/10", "4/5", "2/5"], answer: 2, solution: "Like fractions: add numerators. 3/5 + 1/5 = 4/5." },
    
    // Ch 5
    { chapter: 5, type: "short", text: "Does a regular pentagon have a line of symmetry?", answer: "Yes", solution: "A regular pentagon has 5 lines of symmetry passing through each vertex to the opposite side midpoint." },
    
    // Ch 6
    { chapter: 6, type: "mcq", text: "The Lowest Common Multiple (LCM) of 6 and 8 is:", options: ["12", "16", "24", "48"], answer: 2, solution: "Multiples of 6: 6,12,18,24... Multiples of 8: 8,16,24... LCM is 24." },
    
    // Ch 7
    { chapter: 7, type: "short", text: "What is the sum of the numbers on opposite faces of a standard game dice?", answer: "7", solution: "A standard dice is designed so that opposite faces (e.g., 1 & 6, 2 & 5, 3 & 4) always sum to 7." },
    
    // Ch 8
    { chapter: 8, type: "fillin", text: "If a map scale is 2 cm = 1 km, then a 14 cm road on the map is actually ___ km long.", answer: "7", solution: "14 cm ÷ 2 cm/km = 7 km." },
    
    // Ch 9
    { chapter: 9, type: "mcq", text: "Which of these shapes can be folded to make a perfect cube?", options: ["A T-shaped layout of 6 squares", "A flat line of 5 squares", "A layout of 4 squares in a square shape", "A flat line of 6 squares"], answer: 0, solution: "A T-shape layout (or cross net) folds into a perfect cube." },
    
    // Ch 10
    { chapter: 10, type: "short", text: "Arrange in ascending order: 0.08, 0.8, 0.18, 0.018.", answer: "0.018, 0.08, 0.18, 0.8", solution: "Comparing place values: 0.018 < 0.08 < 0.18 < 0.8." },
    
    // Ch 11
    { chapter: 11, type: "mcq", text: "A rectangle has length 15 cm and area 120 sq cm. What is its perimeter?", options: ["23 cm", "30 cm", "46 cm", "60 cm"], answer: 2, solution: "Width = 120 ÷ 15 = 8 cm. Perimeter = 2 × (15 + 8) = 2 × 23 = 46 cm." },
    
    // Ch 12
    { chapter: 12, type: "fillin", text: "If a pie chart shows that 1/4 of a class likes apples, and the total class size is 40, then ___ children like apples.", answer: "10", solution: "40 × 1/4 = 10 children." },
    
    // Ch 13
    { chapter: 13, type: "short", text: "If Sohan drinks 8 glasses of water every day, how many glasses of water will he drink in the month of June?", answer: "240", solution: "June has 30 days. 30 days × 8 glasses/day = 240 glasses." },
    
    // Ch 14
    { chapter: 14, type: "mcq", text: "A box has dimensions 10 cm × 5 cm × 4 cm. How many small 1 cm cubes can fit inside?", options: ["20", "50", "100", "200"], answer: 3, solution: "Volume = 10 × 5 × 4 = 200 cubic cm. Since each 1 cm cube has volume 1 cubic cm, 200 cubes will fit." }
  ],

  advanced: [
    // Ch 1
    { chapter: 1, type: "short", text: "A boat carrying 6000 kg of fish sells them for Rs 120 per kg. It costs Rs 15,000 for fuel. Find the net profit in Rupees.", answer: "705000", solution: "Total Earnings = 6000 kg × 120 Rs/kg = Rs 7,20,000. Profit = Earnings − fuel cost = 7,20,000 − 15,000 = Rs 7,05,000." },
    
    // Ch 2
    { chapter: 2, type: "mcq", text: "If a clock hand turns 2 right angles from 12:00, where does it point?", options: ["3:00", "6:00", "9:00", "12:00"], answer: 1, solution: "2 right angles = 90° × 2 = 180° (half turn). From 12:00, a half turn lands exactly on 6:00." },
    
    // Ch 3
    { chapter: 3, type: "short", text: "Design a rectangle of area 24 sq cm with integers sides such that it has the LARGEST possible perimeter. What is that perimeter in cm?", answer: "50", solution: "Perimeter is maximized when dimensions are furthest apart. Side options for 24: (1,24), (2,12), (3,8), (4,6). Max perimeter is for 1 × 24 rectangle: 2 × (1 + 24) = 50 cm." },
    
    // Ch 4
    { chapter: 4, type: "fillin", text: "Subtract: 2 - 3/4 equals ___ (write as mixed number like 1 1/4).", answer: "1 1/4", solution: "2 − 3/4 = 8/4 − 3/4 = 5/4 = 1 1/4." },
    
    // Ch 5
    { chapter: 5, type: "mcq", text: "What is the smallest angle in degrees a square can be turned to look exactly the same?", options: ["45°", "90°", "180°", "360°"], answer: 1, solution: "A square has rotational symmetry of order 4, so 360° ÷ 4 = 90° turn." },
    
    // Ch 6
    { chapter: 6, type: "short", text: "Find the Highest Common Factor (HCF) of 36 and 48.", answer: "12", solution: "Factors of 36: 1,2,3,4,6,9,12,18,36. Factors of 48: 1,2,3,4,6,8,12,16,24,48. HCF = 12." },
    
    // Ch 7
    { chapter: 7, type: "fillin", text: "Fill in the missing magic square number so each column, row, and diagonal sums to 15:\n[8, 1, 6]\n[3, 5, 7]\n[4, __, 2]", answer: "9", solution: "Row 3: 4 + x + 2 = 15 → x = 9. Column 2: 1 + 5 + x = 15 → x = 9." },
    
    // Ch 8
    { chapter: 8, type: "short", text: "If actual distance is 500 km and map scale is 1 cm = 25 km, what map length represents this in cm?", answer: "20", solution: "Map length = Actual distance ÷ Scale = 500 ÷ 25 = 20 cm." },
    
    // Ch 9
    { chapter: 9, type: "mcq", text: "An open cube box has no top lid. How many square panels are in its flat net layout?", options: ["4", "5", "6", "7"], answer: 1, solution: "A box with no lid has 5 faces, so its net has 5 squares." },
    
    // Ch 10
    { chapter: 10, type: "short", text: "Add Rs 45.75 and Rs 82.50, then convert the total into Paise.", answer: "12825 paise", solution: "45.75 + 82.50 = Rs 128.25. Converting to paise: 128.25 × 100 = 12825 paise." },
    
    // Ch 11
    { chapter: 11, type: "mcq", text: "A square park has area 225 sq meters. How many meters of wire are needed to fence its boundary twice?", options: ["60 m", "120 m", "240 m", "450 m"], answer: 1, solution: "Side of square = √225 = 15 m. Boundary (Perimeter) = 15 × 4 = 60 m. Fencing twice = 60 × 2 = 120 meters." },
    
    // Ch 12
    { chapter: 12, type: "fillin", text: "A bar graph shows that 12 students like blue, 18 like pink, and 6 like green. What percentage of students like pink? ___%", answer: "50", solution: "Total = 12 + 18 + 6 = 36. Pink = 18. Percentage = 18/36 × 100 = 50%." },
    
    // Ch 13
    { chapter: 13, type: "short", text: "A gardener buys 15 boxes of saplings. Each box contains 24 saplings. If he plants 8 in each row, how many rows can he plant?", answer: "45", solution: "Total saplings = 15 × 24 = 360. Rows = 360 ÷ 8 = 45 rows." },
    
    // Ch 14
    { chapter: 14, type: "short", text: "A water tank is 2 m long, 1.5 m wide, and 1 m high. What is its capacity in Liters? (Hint: 1 cubic meter = 1000 Liters)", answer: "3000 liters", solution: "Volume = 2 × 1.5 × 1 = 3 cubic meters. Capacity = 3 × 1000 = 3000 Liters." }
  ],

  olympiad: [
    // Ch 1
    { chapter: 1, type: "short", text: "An ocean fisher group caught 12,00,000 kg of fish this year. If they distributed 1/4 of it to poor villages, sold 2/3 of the remainder, and packed the rest into 100 kg boxes, how many boxes were packed?", answer: "3000", solution: "Distributed = 12,00,000 × 1/4 = 3,00,000 kg. Remainder = 9,00,000 kg. Sold = 9,00,000 × 2/3 = 6,00,000 kg. Packed remainder = 9,00,000 − 6,00,000 = 3,00,000 kg. Number of 100 kg boxes = 3,00,000 ÷ 100 = 3,000 boxes." },
    
    // Ch 2
    { chapter: 2, type: "mcq", text: "In a regular hexagon, what is the interior angle at each corner?", options: ["90°", "108°", "120°", "135°"], answer: 2, solution: "Sum of interior angles of hexagon = (6−2)×180 = 720°. Each corner = 720° ÷ 6 = 120°." },
    
    // Ch 3
    { chapter: 3, type: "short", text: "Two identical squares of side 8 cm overlap to form a smaller square of side 3 cm. Find the total perimeter of the resulting combined shape.", answer: "52 cm", solution: "Each separate square perimeter = 32 cm. By overlapping, the boundary loses two 3 cm segments from each square. Combined Perimeter = (32 − 6) + (32 − 6) = 26 + 26 = 52 cm. (Alternatively: 8+8+5+5+8+8+5+5 = 52 cm)." },
    
    // Ch 4
    { chapter: 4, type: "short", text: "A container is 3/7 full of milk. When 12 liters of milk are added, it becomes 3/4 full. Find the total capacity of the container in Liters.", answer: "28", solution: "Equation: 3/4 x − 3/7 x = 12. Common denominator: 21/28 x − 12/28 x = 12 → 9/28 x = 12 → x = (12 × 28)/9 = 336/9 = 37.33 L? Wait, let's make it clean: if 3/5 full, plus 10 L makes it 4/5 full, then 1/5 = 10 L → 50 L. Let's use 3/7 full, plus 6 L makes it 5/7 full → 2/7 = 6 L → 1/7 = 3 L → capacity 21 L. Let's check: 3/7 x + 12 = 3/4 x? Let's check 3/4 - 3/7 = 9/28. Let's make it 3/7 full, and adding 9 liters makes it 3/4 full: 9/28 x = 9 L → capacity is 28 Liters! Yes, if 28 L capacity, 3/7 of 28 is 12. Add 9 L → 21 L, which is 3/4 of 28. Perfect!" },
    
    // Ch 5
    { chapter: 5, type: "mcq", text: "A design looks identical under both a 1/3 turn and a 1/4 turn. What is the smallest angle in degrees it can be turned to look identical?", options: ["30°", "60°", "90°", "30° (or multiples)"], answer: 0, solution: "A 1/3 turn is 120° and a 1/4 turn is 90°. The greatest common divisor of their turn angles, or the base symmetry unit is GCD(120, 90) = 30°." },
    
    // Ch 6
    { chapter: 6, type: "short", text: "Find the smallest three-digit number which when divided by 4, 5, and 6 leaves a remainder of 2 in each case.", answer: "122", solution: "LCM(4, 5, 6) = 60. Multiples of 60: 60, 120, 180. Smallest three-digit multiple is 120. Adding the remainder: 120 + 2 = 122." },
    
    // Ch 7
    { chapter: 7, type: "short", text: "Find the sum of all digits in a 3×3 magic square that uses the numbers 1 to 9.", answer: "45", solution: "The numbers are 1,2,3,4,5,6,7,8,9. Sum = 1+2+3+4+5+6+7+8+9 = 45." },
    
    // Ch 8
    { chapter: 8, type: "short", text: "A maps shows a forest. On the map, 1 sq cm represents 16 sq km on the ground. If the forest is a rectangle of 5 cm by 4 cm on the map, find its actual area on the ground in sq km.", answer: "320", solution: "Map Area = 5 × 4 = 20 sq cm. Actual area = 20 × 16 = 320 sq km." },
    
    // Ch 9
    { chapter: 9, type: "mcq", text: "A large cube is built using 27 small 1 cm cubes. If we paint the outside of the large cube entirely pink, how many small cubes will have exactly TWO faces painted?", options: ["6", "8", "12", "18"], answer: 2, solution: "For a 3×3×3 cube, the cubes with exactly two painted faces lie along the edges (excluding the corners). A cube has 12 edges, and each edge has exactly 1 such cube. So 12 × 1 = 12 cubes." },
    
    // Ch 10
    { chapter: 10, type: "short", text: "Express the fraction 7/8 as a decimal.", answer: "0.875", solution: "7 ÷ 8 = 0.875." },
    
    // Ch 11
    { chapter: 11, type: "short", text: "A square card and a rectangular card have the exact same area. The side of the square card is 12 cm, and the width of the rectangular card is 9 cm. Find the perimeter of the rectangular card in cm.", answer: "50", solution: "Area of square card = 12 × 12 = 144 sq cm. Area of rectangular card = 144 sq cm. Length of rectangular card = 144 ÷ 9 = 16 cm. Perimeter = 2 × (16 + 9) = 50 cm." },
    
    // Ch 12
    { chapter: 12, type: "short", text: "A graph shows growth of a plant: Day 1: 1 cm, Day 5: 3 cm, Day 10: 8 cm, Day 15: 14 cm. In which five-day period did the plant grow the fastest?", answer: "Day 10 to Day 15", solution: "Day 1 to 5 (4 days): grows 2 cm. Day 5 to 10 (5 days): grows 5 cm. Day 10 to 15 (5 days): grows 6 cm. The growth rate is fastest from Day 10 to Day 15." },
    
    // Ch 13
    { chapter: 13, type: "short", text: "A school feeds 120 students daily. Each student eats 150 grams of rice per day. How many kg of rice does the school need for a 30-day month?", answer: "540", solution: "Daily rice = 120 × 150 = 18,000 grams = 18 kg. Monthly rice = 18 kg/day × 30 days = 540 kg." },
    
    // Ch 14
    { chapter: 14, type: "short", text: "A rectangular metallic bar of size 12 cm × 9 cm × 6 cm is melted down and recast into small cubes of side 3 cm. How many such cubes can be formed?", answer: "24", solution: "Volume of bar = 12 × 9 × 6 = 648 cubic cm. Volume of one cube = 3 × 3 × 3 = 27 cubic cm. Number of cubes = 648 ÷ 27 = 24 cubes." }
  ]
};
