/**
 * Class 7 Math Coach – CBSE Syllabus Data
 * All 14 chapters with topics, summaries, and worksheet questions at 4 difficulty levels.
 */

export const chapters = [
  {
    id: 1, title: "Large Numbers Around Us",
    accent: "hsl(170, 75%, 55%)",
    topics: ["Place value up to 10-digit numbers", "Reading, writing & comparing", "Estimation & rounding", "Real-life applications"],
    summary: "Introduces very large numbers, reinforcing the decimal place-value system beyond the crore with real-world examples."
  },
  {
    id: 2, title: "Arithmetic Expressions",
    accent: "hsl(200, 70%, 55%)",
    topics: ["Algebraic notation", "Forming expressions", "BODMAS / order of operations", "Word-problem translation"],
    summary: "Students learn how symbols represent operations, emphasizing correct use of BODMAS to evaluate expressions."
  },
  {
    id: 3, title: "A Peek Beyond the Point",
    accent: "hsl(260, 70%, 65%)",
    topics: ["Cartesian plane", "Plotting ordered pairs", "Quadrants & distance from origin", "Coordinate mapping"],
    summary: "Opens coordinate geometry — locating points on a plane using ordered pairs and computing distances."
  },
  {
    id: 4, title: "Expressions using Letter-Numbers",
    accent: "hsl(35, 90%, 60%)",
    topics: ["Variables as unknowns", "Algebraic expressions", "Substituting values", "One-step equations"],
    summary: "Introduces variables as placeholders, laying groundwork for systematic algebraic problem-solving."
  },
  {
    id: 5, title: "Parallel and Intersecting Lines",
    accent: "hsl(340, 75%, 60%)",
    topics: ["Parallel, intersecting, perpendicular lines", "Angles from intersecting lines", "Transversal properties", "Real-life geometry"],
    summary: "Explores corresponding, alternate interior, and co-interior angles when a transversal cuts parallel lines."
  },
  {
    id: 6, title: "Number Play",
    accent: "hsl(140, 60%, 50%)",
    topics: ["Factors & multiples", "Prime numbers & factorisation", "HCF & LCM", "Simplifying fractions"],
    summary: "Deepens number-theoretic concepts — HCF/LCM via prime factorisation for fractions and word problems."
  },
  {
    id: 7, title: "A Tale of Three Intersecting Lines",
    accent: "hsl(190, 75%, 50%)",
    topics: ["Concurrent lines", "Types of triangles", "Angle relationships", "Concurrency applications"],
    summary: "Examines three lines meeting at a single point and the various triangles that can arise."
  },
  {
    id: 8, title: "Working with Fractions",
    accent: "hsl(25, 85%, 55%)",
    topics: ["Proper, improper & mixed fractions", "Conversion between forms", "Four arithmetic operations", "Real-life fraction problems"],
    summary: "Comprehensive fraction work: representation, conversion, and all four arithmetic operations."
  },
  {
    id: 9, title: "Operations with Integers",
    accent: "hsl(280, 65%, 60%)",
    topics: ["Number-line visualisation", "Adding & subtracting integers", "Multiplying & dividing integers", "Sign rules & word problems"],
    summary: "Introduces integers with direction (positive/negative) and the four fundamental operations."
  },
  {
    id: 10, title: "Fractions and Proportional Reasoning",
    accent: "hsl(50, 80%, 55%)",
    topics: ["Ratio & proportion", "Cross-multiplication", "Scale factor", "Maps, models & recipes"],
    summary: "Comparing quantities via ratios, solving proportion problems, and real-world scaling applications."
  },
  {
    id: 11, title: "Finding the Unknown",
    accent: "hsl(160, 70%, 50%)",
    topics: ["Linear equations in one variable", "Inverse operations", "Word problems", "Solution verification"],
    summary: "Formalises solving one-step linear equations with inverse operations and verification."
  },
  {
    id: 12, title: "Congruent Figures",
    accent: "hsl(220, 70%, 60%)",
    topics: ["Definition of congruence", "SSS, SAS, ASA, RHS criteria", "Proving geometric properties", "Tiles & patterns"],
    summary: "Explores triangle congruence criteria and their application in proving geometric relationships."
  },
  {
    id: 13, title: "Visualising Solid Shapes",
    accent: "hsl(0, 70%, 60%)",
    topics: ["3D shapes recognition", "Surface area & volume", "Net diagrams", "Packaging applications"],
    summary: "Identifying solid shapes, calculating surface area and volume, and visualising nets."
  },
  {
    id: 14, title: "Comparing Quantities",
    accent: "hsl(300, 60%, 55%)",
    topics: ["Scientific notation", "Orders of magnitude", "Estimation techniques", "Cross-domain comparisons"],
    summary: "Develops ability to compare vastly different quantities using orders of magnitude and scientific notation."
  }
];

// ───────── Worksheet Questions ─────────
// Each question: { chapter, type: 'mcq'|'short'|'fillin', text, options?, answer, solution }

export const worksheets = {
  basic: [
    // Ch 1
    { chapter: 1, type: "mcq", text: "The smallest three-digit number divisible by 9 is:", options: ["108", "117", "126", "135"], answer: 0, solution: "108 ÷ 9 = 12, making it the smallest 3-digit multiple of 9." },
    { chapter: 1, type: "short", text: "Write the standard form of 4,75,000.", answer: "4.75 × 10⁵", solution: "Move the decimal 5 places left: 4.75 × 10⁵." },
    { chapter: 1, type: "fillin", text: "The opposite (additive inverse) of −23 is ___.", answer: "23", solution: "The additive inverse of any number n is −n. So the inverse of −23 is 23." },
    { chapter: 1, type: "mcq", text: "If a = −7 and b = 12, then a + b equals:", options: ["5", "−5", "19", "−19"], answer: 0, solution: "−7 + 12 = 5." },
    { chapter: 1, type: "short", text: "Find the HCF of 48 and 180.", answer: "12", solution: "48 = 2⁴ × 3, 180 = 2² × 3² × 5. Common factors: 2² × 3 = 12." },
    // Ch 2
    { chapter: 2, type: "mcq", text: "Evaluate: 8 + 4 × 2 − 6 ÷ 3", options: ["14", "18", "12", "16"], answer: 0, solution: "BODMAS: 4×2=8, 6÷3=2, then 8+8−2 = 14." },
    { chapter: 2, type: "short", text: "Write an arithmetic expression for 'the sum of 15 and the product of 3 and 7'.", answer: "15 + 3 × 7", solution: "Product of 3 and 7 is 3 × 7 = 21. Sum with 15: 15 + 21 = 36." },
    { chapter: 2, type: "fillin", text: "In BODMAS, the 'O' stands for ___.", answer: "Orders", solution: "BODMAS: Brackets, Orders (powers/roots), Division, Multiplication, Addition, Subtraction." },
    { chapter: 2, type: "mcq", text: "What is the value of 3² + 4²?", options: ["25", "14", "49", "7"], answer: 0, solution: "3² = 9, 4² = 16, total = 25." },
    { chapter: 2, type: "short", text: "Simplify: 5 × (8 − 3) + 2", answer: "27", solution: "Brackets first: 8−3=5. Then 5×5=25, plus 2 = 27." },
    // Ch 3
    { chapter: 3, type: "mcq", text: "The point (−3, 4) lies in which quadrant?", options: ["II", "I", "III", "IV"], answer: 0, solution: "Negative x, positive y → Quadrant II." },
    { chapter: 3, type: "short", text: "Find the distance of point (3, 4) from the origin.", answer: "5", solution: "Distance = √(3² + 4²) = √(9 + 16) = √25 = 5." },
    { chapter: 3, type: "fillin", text: "The x-coordinate of any point on the y-axis is ___.", answer: "0", solution: "Points on the y-axis have the form (0, y)." },
    // Ch 4
    { chapter: 4, type: "mcq", text: "If x = 3, the value of 2x + 5 is:", options: ["11", "13", "8", "10"], answer: 0, solution: "2(3) + 5 = 6 + 5 = 11." },
    { chapter: 4, type: "short", text: "Write the expression for 'three times a number decreased by 4'.", answer: "3n − 4", solution: "Let the number be n. Three times n is 3n; decreased by 4 gives 3n − 4." },
    { chapter: 4, type: "fillin", text: "The coefficient of y in 7y − 2x + 5 is ___.", answer: "7", solution: "The coefficient is the numerical multiplier of the variable, here 7." },
    { chapter: 4, type: "mcq", text: "Which is equivalent to 4(a + 2)?", options: ["4a + 8", "4a + 2", "a + 8", "4a + 4"], answer: 0, solution: "Distribute: 4·a + 4·2 = 4a + 8." },
    { chapter: 4, type: "short", text: "Expand 3(2m − 5).", answer: "6m − 15", solution: "3 × 2m = 6m, 3 × (−5) = −15. Result: 6m − 15." },
    // Ch 5
    { chapter: 5, type: "mcq", text: "The sum of interior angles of a triangle is:", options: ["180°", "360°", "90°", "270°"], answer: 0, solution: "The angle sum property of a triangle: always 180°." },
    { chapter: 5, type: "short", text: "If one angle of a triangle is 70° and another is 55°, find the third.", answer: "55°", solution: "180° − 70° − 55° = 55°." },
    { chapter: 5, type: "fillin", text: "Two adjacent angles that form a linear pair sum to ___ degrees.", answer: "180", solution: "A linear pair of angles always sums to 180°." },
    { chapter: 5, type: "mcq", text: "Which pair of angles are complementary?", options: ["30° and 60°", "45° and 45°", "90° and 30°", "120° and 60°"], answer: 0, solution: "Complementary angles sum to 90°. 30 + 60 = 90." },
    // Ch 6-9 basics
    { chapter: 6, type: "mcq", text: "The LCM of 4 and 6 is:", options: ["12", "24", "6", "2"], answer: 0, solution: "Multiples of 4: 4,8,12… Multiples of 6: 6,12… LCM = 12." },
    { chapter: 7, type: "short", text: "Three lines meet at a single point. What is this point called?", answer: "Point of concurrency", solution: "When three or more lines pass through the same point, it's called a point of concurrency." },
    { chapter: 8, type: "mcq", text: "3/4 expressed as a decimal is:", options: ["0.75", "0.34", "1.33", "0.43"], answer: 0, solution: "3 ÷ 4 = 0.75." },
    { chapter: 8, type: "short", text: "Simplify 24/36.", answer: "2/3", solution: "GCD of 24 and 36 is 12. 24÷12 = 2, 36÷12 = 3." },
    { chapter: 9, type: "mcq", text: "(−5) × (−3) equals:", options: ["15", "−15", "−8", "8"], answer: 0, solution: "Negative × negative = positive. 5 × 3 = 15." },
    { chapter: 9, type: "fillin", text: "0.6 = ___/10.", answer: "6", solution: "0.6 = 6/10." },
    // Ch 10-14 basics
    { chapter: 10, type: "mcq", text: "If 2:3 = x:12, then x is:", options: ["8", "6", "9", "4"], answer: 0, solution: "Cross multiply: 2×12 = 3×x → x = 24/3 = 8." },
    { chapter: 11, type: "short", text: "Solve: 2x + 3 = 11", answer: "x = 4", solution: "2x = 11 − 3 = 8. x = 8/2 = 4." },
    { chapter: 12, type: "mcq", text: "Two triangles are congruent if:", options: ["They have the same shape and size", "They have the same shape only", "Their areas are equal", "Their perimeters are equal"], answer: 0, solution: "Congruent means identical in both shape and size." },
    { chapter: 13, type: "short", text: "How many faces does a cube have?", answer: "6", solution: "A cube has 6 square faces." },
    { chapter: 14, type: "mcq", text: "Express 45000 in scientific notation:", options: ["4.5 × 10⁴", "45 × 10³", "0.45 × 10⁵", "4.5 × 10³"], answer: 0, solution: "Move decimal 4 places: 4.5 × 10⁴." }
  ],

  intermediate: [
    { chapter: 4, type: "short", text: "Simplify: 3x + 4y − 2x + 7 − 5y + 3", answer: "x − y + 10", solution: "Combine like terms: (3x−2x) + (4y−5y) + (7+3) = x − y + 10." },
    { chapter: 4, type: "short", text: "Find the value of 2a² − 3a + 5 when a = −2.", answer: "19", solution: "2(−2)² − 3(−2) + 5 = 2(4) + 6 + 5 = 8 + 6 + 5 = 19." },
    { chapter: 4, type: "short", text: "A rectangle has its length twice its breadth. If the perimeter is 54 cm, find its area.", answer: "162 cm²", solution: "Let breadth = b. Length = 2b. Perimeter = 2(2b+b) = 6b = 54, so b = 9 cm. Area = 18 × 9 = 162 cm²." },
    { chapter: 5, type: "short", text: "A transversal cuts two parallel lines. If a corresponding angle is 65°, find the value of the alternate interior angle on the same side.", answer: "65°", solution: "Corresponding angles are equal when lines are parallel. So the alternate interior angle is also 65°." },
    { chapter: 4, type: "short", text: "Expand and simplify: (x+3)(x−5) − (x−2)²", answer: "2x − 19", solution: "(x+3)(x−5) = x²−2x−15. (x−2)² = x²−4x+4. Subtracting: 2x − 19." },
    { chapter: 8, type: "short", text: "Simplify: (3/4) × (8/9) ÷ (2/3)", answer: "1", solution: "(3/4)×(8/9) = 24/36 = 2/3. Then (2/3)÷(2/3) = 1." },
    { chapter: 8, type: "short", text: "Two cyclists start from the same point at 12 km/h and 18 km/h. After how many hours is the faster one 30 km ahead?", answer: "5 hours", solution: "Relative speed = 18−12 = 6 km/h. Time = 30/6 = 5 hours." },
    { chapter: 3, type: "short", text: "Points P(2/5) and Q(7/10) are on a number line. Find the distance PQ.", answer: "3/10", solution: "Convert to same denominator: P = 4/10, Q = 7/10. Distance = 7/10 − 4/10 = 3/10." },
    { chapter: 12, type: "short", text: "In △ABC, AB = 7 cm, BC = 9 cm, AC = 10 cm. Find its area using Heron's formula.", answer: "6√26 cm²", solution: "s = (7+9+10)/2 = 13. Area = √(13×6×4×3) = √936 = 6√26 cm²." },
    { chapter: 5, type: "short", text: "Opposite angles of a cyclic quadrilateral are 95° and 110°. Find the other two angles.", answer: "85° and 70°", solution: "Opposite angles of a cyclic quad sum to 180°. So 180−95=85° and 180−110=70°." },
    { chapter: 9, type: "short", text: "A ladder 12 m long leans against a wall, foot is 5 m from wall. Find height reached.", answer: "√119 ≈ 10.91 m", solution: "By Pythagoras: h = √(12²−5²) = √(144−25) = √119 ≈ 10.91 m." },
    { chapter: 10, type: "short", text: "The perimeter of a regular hexagon is 84 cm. Find its area.", answer: "294√3 cm²", solution: "Side = 84/6 = 14 cm. Area of hexagon = 6 × (√3/4 × 14²) = 6 × 49√3 = 294√3 cm²." },
    { chapter: 11, type: "short", text: "Solve: (2/(x−1)) + (3/(x+2)) = 5/(x+2)", answer: "No solution", solution: "Multiply by (x−1)(x+2): 2(x+2) + 3(x−1) = 5(x−1) → 5x+1 = 5x−5 → contradiction." },
    { chapter: 8, type: "short", text: "A rope 120 cm long is cut in ratio 7:5. The smaller piece is reduced by 1/4. What's the length of the longer piece?", answer: "70 cm", solution: "Each part = 10 cm. Larger = 70 cm, smaller = 50 cm. The longer piece remains 70 cm." },
    { chapter: 6, type: "short", text: "Find all prime factors of 360.", answer: "2, 3, 5", solution: "360 = 2³ × 3² × 5. Prime factors are 2, 3, and 5." }
  ],

  advanced: [
    { chapter: 10, type: "short", text: "A map has scale 1:50000. Two cities are 8.4 cm apart on the map. Find actual distance in km.", answer: "4.2 km", solution: "Actual = 8.4 × 50000 = 420000 cm = 4200 m = 4.2 km." },
    { chapter: 10, type: "short", text: "If A:B = 3:4 and B:C = 5:7, find A:B:C.", answer: "15:20:28", solution: "Make B common: A:B = 15:20, B:C = 20:28. So A:B:C = 15:20:28." },
    { chapter: 8, type: "short", text: "Simplify: (2/3 + 3/4) ÷ (5/6 − 1/4)", answer: "34/7 or 4 6/7", solution: "Numerator: 8/12 + 9/12 = 17/12. Denominator: 10/12 − 3/12 = 7/12. Division: (17/12) × (12/7) = 17/7." },
    { chapter: 12, type: "short", text: "In △PQR and △XYZ, PQ = XY = 5 cm, QR = YZ = 7 cm, ∠Q = ∠Y = 60°. Are they congruent? By which criterion?", answer: "Yes, by SAS", solution: "Two sides and the included angle are equal: PQ=XY, QR=YZ, ∠Q=∠Y. This is the SAS criterion." },
    { chapter: 12, type: "short", text: "The sides of a triangle are 13, 14, and 15 cm. Find its area.", answer: "84 cm²", solution: "s = (13+14+15)/2 = 21. Area = √(21×8×7×6) = √7056 = 84 cm²." },
    { chapter: 11, type: "short", text: "The sum of three consecutive even numbers is 78. Find them.", answer: "24, 26, 28", solution: "Let them be 2n, 2n+2, 2n+4. Sum = 6n+6 = 78 → n = 12. Numbers: 24, 26, 28." },
    { chapter: 13, type: "short", text: "A cuboid has dimensions 10 cm × 8 cm × 5 cm. Find its total surface area.", answer: "340 cm²", solution: "TSA = 2(lb + bh + lh) = 2(80 + 40 + 50) = 2(170) = 340 cm²." },
    { chapter: 13, type: "short", text: "How many small cubes of side 2 cm can fit in a box of 8 cm × 6 cm × 4 cm?", answer: "24", solution: "Volume of box = 192 cm³. Volume of small cube = 8 cm³. Number = 192/8 = 24." },
    { chapter: 9, type: "short", text: "Evaluate: (−8) × (−3) + (−15) ÷ 5 − (−7)", answer: "28", solution: "(−8)(−3) = 24. (−15)÷5 = −3. −(−7) = +7. Total = 24 − 3 + 7 = 28." },
    { chapter: 14, type: "short", text: "Express 0.000342 in scientific notation.", answer: "3.42 × 10⁻⁴", solution: "Move decimal 4 places right: 3.42 × 10⁻⁴." },
    { chapter: 10, type: "short", text: "If 5 workers can build a wall in 12 days, how many days will 8 workers take (same rate)?", answer: "7.5 days", solution: "Total work = 5 × 12 = 60 worker-days. With 8 workers: 60/8 = 7.5 days." },
    { chapter: 6, type: "short", text: "Find the LCM of 12, 18 and 24.", answer: "72", solution: "12 = 2²×3, 18 = 2×3², 24 = 2³×3. LCM = 2³×3² = 72." }
  ],

  olympiad: [
    { chapter: 1, type: "short", text: "Find the largest 6-digit number that is divisible by 7, 11 and 13 simultaneously.", answer: "999999", solution: "LCM(7,11,13) = 1001. Largest 6-digit multiple of 1001: 999 × 1001 = 999999." },
    { chapter: 6, type: "short", text: "How many positive integers less than 100 are coprime to 100?", answer: "40", solution: "Euler's totient: φ(100) = 100 × (1−1/2) × (1−1/5) = 100 × 1/2 × 4/5 = 40." },
    { chapter: 9, type: "short", text: "Find all integers n such that n² + 3n + 2 is a perfect square.", answer: "n = −1 or n = −2", solution: "n² + 3n + 2 = (n+1)(n+2). For this to be a perfect square, we need consecutive integers whose product is a perfect square. The only consecutive integer pair with product being a perfect square is 0×1 = 0 or (−1)×0 = 0. So n = −1 or n = −2." },
    { chapter: 4, type: "short", text: "If a + b + c = 0, prove that a³ + b³ + c³ = 3abc.", answer: "Proof below", solution: "Since a+b+c = 0, a+b = −c. Cubing both sides and using the identity a³+b³+c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca). Since a+b+c = 0, the RHS = 0, so a³+b³+c³ = 3abc." },
    { chapter: 12, type: "short", text: "In triangle ABC, D is on BC such that AD bisects angle A. If AB = 6, AC = 8, and BC = 10, find BD.", answer: "30/7", solution: "By the angle bisector theorem: BD/DC = AB/AC = 6/8 = 3/4. Since BD + DC = 10, we get BD = 30/7." },
    { chapter: 5, type: "short", text: "Prove that the sum of exterior angles of any convex polygon is 360°.", answer: "Proof below", solution: "At each vertex, the interior and exterior angles sum to 180°. For n vertices, sum of all = 180n. Sum of interior angles = (n−2)×180. Exterior sum = 180n − (n−2)×180 = 360°." },
    { chapter: 13, type: "short", text: "A sphere of radius r is inscribed in a cube. What fraction of the cube's volume does the sphere occupy?", answer: "π/6", solution: "Cube side = 2r. Cube volume = 8r³. Sphere volume = (4/3)πr³. Fraction = (4πr³/3)/(8r³) = π/6 ≈ 0.5236." },
    { chapter: 8, type: "short", text: "Find the sum: 1/(1×2) + 1/(2×3) + 1/(3×4) + ... + 1/(99×100).", answer: "99/100", solution: "Telescoping: 1/(n(n+1)) = 1/n − 1/(n+1). Sum = (1 − 1/2) + (1/2 − 1/3) + ... + (1/99 − 1/100) = 1 − 1/100 = 99/100." },
    { chapter: 14, type: "short", text: "The product of four consecutive integers is always divisible by 24. Prove it.", answer: "Proof below", solution: "Among any 4 consecutive integers: at least two are even (one divisible by 4), and at least one is divisible by 3. So the product is divisible by 4×2×3 = 24." },
    { chapter: 11, type: "short", text: "Find all positive integer solutions to: 1/x + 1/y = 1/6.", answer: "(7,42), (8,24), (9,18), (10,15), (12,12) and reverses", solution: "Rearrange: (x−6)(y−6) = 36. Factor pairs of 36: (1,36), (2,18), (3,12), (4,9), (6,6). Adding 6: (7,42), (8,24), (9,18), (10,15), (12,12)." },
    { chapter: 7, type: "short", text: "Prove that the three medians of a triangle are concurrent.", answer: "Proof below", solution: "Using vectors: Let vertices be A, B, C. Midpoints: D=(B+C)/2, etc. Median from A: P = A + t((B+C)/2 − A). The centroid G = (A+B+C)/3 lies on all three medians at t = 2/3, proving concurrency." },
    { chapter: 3, type: "short", text: "Points A(1,2), B(4,6), C(7,2) form a triangle. Find its area using the coordinate formula.", answer: "12 sq units", solution: "Area = ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)| = ½|1(6−2) + 4(2−2) + 7(2−6)| = ½|4 + 0 − 28| = ½ × 24 = 12." }
  ]
};
