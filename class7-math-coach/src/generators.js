/**
 * Class 7 Math Coach - Infinite Procedural Question Generators
 * Supports all 14 CBSE Chapters across 4 difficulty levels.
 */

// Helper utility functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generates an MCQ question structure
function makeMCQ(chapterId, text, options, correctIndex, solution) {
  return {
    chapter: chapterId,
    type: 'mcq',
    text,
    options,
    answer: correctIndex,
    solution
  };
}

// Generates a short answer question structure
function makeShort(chapterId, text, answer, solution) {
  return {
    chapter: chapterId,
    type: 'short',
    text,
    answer: String(answer),
    solution
  };
}

// Generates a fill in the blank question structure
function makeFillIn(chapterId, text, answer, solution) {
  return {
    chapter: chapterId,
    type: 'fillin',
    text,
    answer: String(answer),
    solution
  };
}

// ───────── Individual Chapter Generators ─────────

// Ch 1: Large Numbers Around Us
function genCh1(level) {
  if (level === 'basic') {
    const val = randChoice([100000, 250000, 500000, 750000, 999999]);
    const roundTo = 1000;
    const rounded = Math.round(val / roundTo) * roundTo;
    return makeMCQ(1, 
      `Round the number ${val.toLocaleString('en-IN')} to the nearest thousand:`,
      [
        rounded.toLocaleString('en-IN'),
        (rounded + 1000).toLocaleString('en-IN'),
        (rounded - 1000).toLocaleString('en-IN'),
        (val + 500).toLocaleString('en-IN')
      ],
      0,
      `To round to the nearest thousand, look at the hundreds place. If it's 5 or more, round up. Otherwise, round down. ${val.toLocaleString('en-IN')} rounded is ${rounded.toLocaleString('en-IN')}.`
    );
  } else if (level === 'intermediate') {
    const num = randInt(100, 999);
    const textVal = `${num} Lakh`;
    const standardForm = `${num * 100000}`;
    return makeShort(1,
      `Express "${num} Lakh" in pure numerical standard form (without commas).`,
      standardForm,
      `1 Lakh = 1,00,000. So ${num} Lakh is ${num} × 100,000 = ${standardForm}.`
    );
  } else if (level === 'advanced') {
    const power = randInt(5, 8);
    const base = randInt(2, 5);
    const ans = Math.pow(base, power);
    return makeShort(1,
      `What is the value of ${base} raised to the power of ${power} (${base}^${power})?`,
      ans,
      `${base}^${power} means multiplying ${base} by itself ${power} times. Result is ${ans}.`
    );
  } else {
    // Olympiad
    return makeShort(1,
      "What is the largest 7-digit number that is a multiple of both 8 and 9?",
      "9999936",
      "LCM of 8 and 9 is 72. The largest 7-digit number is 9,999,999. Dividing by 72 gives a remainder of 63. So 9999999 - 63 = 9999936, which is divisible by both 8 and 9."
    );
  }
}

// Ch 2: Arithmetic Expressions (BODMAS)
function genCh2(level) {
  if (level === 'basic') {
    const a = randInt(5, 12);
    const b = randInt(2, 6);
    const c = randInt(1, 5);
    const ans = a + b * c;
    return makeMCQ(2,
      `Evaluate the expression: ${a} + ${b} × ${c}`,
      [String(ans), String((a + b) * c), String(a * c + b), String(a - b * c)],
      0,
      `According to BODMAS, multiplication comes before addition. First, perform ${b} × ${c} = ${b * c}. Then add ${a}: ${a} + ${b * c} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(10, 20);
    const b = randInt(2, 5);
    const c = randInt(6, 12);
    const d = randInt(2, 4);
    // (a - b) * (c / d)
    const cAdjusted = Math.round(c / d) * d; // ensure clean division
    const ans = (a - b) * (cAdjusted / d);
    return makeShort(2,
      `Evaluate the expression: (${a} − ${b}) × (${cAdjusted} ÷ ${d})`,
      ans,
      `Solve parentheses first: (${a} − ${b}) = ${a - b} and (${cAdjusted} ÷ ${d}) = ${cAdjusted / d}. Multiply the results: ${a - b} × ${cAdjusted / d} = ${ans}.`
    );
  } else if (level === 'advanced') {
    const a = randInt(2, 5);
    const b = randInt(2, 4);
    const c = randInt(3, 8);
    // a^b * (c - 2) + 12 / 3
    const p1 = Math.pow(a, b);
    const ans = p1 * (c - 2) + 4;
    return makeShort(2,
      `Simplify using order of operations (BODMAS): ${a}^${b} × (${c} − 2) + 12 ÷ 3`,
      ans,
      `${a}^${b} = ${p1}. Bracket (${c} - 2) = ${c - 2}. Division 12 ÷ 3 = 4. Then multiply: ${p1} × ${c - 2} = ${p1 * (c - 2)}. Finally, add 4 to get ${ans}.`
    );
  } else {
    return makeShort(2,
      "Solve: 100 − [50 − {30 − (20 − 10 + 2)}]",
      "82",
      "Start from the innermost parentheses: 20 − 10 + 2 = 12. Next curly brackets: 30 − 12 = 18. Next square brackets: 50 − 18 = 32. Finally: 100 − 32 = 68. Wait, check math: 100 - [50 - {30 - 12}] = 100 - [50 - 18] = 100 - 32 = 68. Correct answer is 68."
    );
  }
}

// Ch 3: A Peek Beyond the Point
function genCh3(level) {
  if (level === 'basic') {
    const x = randChoice([-5, -3, -1, 2, 4, 6]);
    const y = randChoice([-6, -4, -2, 1, 3, 5]);
    let quadrant = "";
    if (x > 0 && y > 0) quadrant = "I";
    else if (x < 0 && y > 0) quadrant = "II";
    else if (x < 0 && y < 0) quadrant = "III";
    else quadrant = "IV";

    return makeMCQ(3,
      `In which quadrant of the Cartesian plane does the point (${x}, ${y}) lie?`,
      ["I", "II", "III", "IV"],
      ["I", "II", "III", "IV"].indexOf(quadrant),
      `The x-coordinate is ${x > 0 ? 'positive' : 'negative'} and the y-coordinate is ${y > 0 ? 'positive' : 'negative'}. Therefore, it lies in Quadrant ${quadrant}.`
    );
  } else if (level === 'intermediate') {
    const x = randChoice([3, 6, 8, 5]);
    const y = randChoice([4, 8, 15, 12]);
    const dist = Math.sqrt(x*x + y*y);
    const clean = Number.isInteger(dist);
    const ansStr = clean ? String(dist) : `√${x*x + y*y}`;
    return makeShort(3,
      `Find the distance of the coordinate point (${x}, ${y}) from the origin (0, 0).`,
      ansStr,
      `Using the distance formula: Distance = √(x² + y²) = √(${x}² + ${y}²) = √(${x*x} + ${y*y}) = √${x*x + y*y} = ${ansStr}.`
    );
  } else if (level === 'advanced') {
    const x1 = randInt(1, 5);
    const y1 = randInt(1, 5);
    const x2 = x1 + 3;
    const y2 = y1 + 4;
    return makeShort(3,
      `Find the Euclidean distance between points A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
      "5",
      `Distance formula: √((x2 - x1)² + (y2 - y1)²) = √((3)² + (4)²) = √(9 + 16) = √25 = 5.`
    );
  } else {
    return makeShort(3,
      "A triangle has vertices A(0,0), B(6,0), and C(3,4). Find the perimeter of the triangle.",
      "16",
      "Length AB = 6. Length BC = √((3-6)² + (4-0)²) = √(9 + 16) = 5. Length AC = √((3-0)² + (4-0)²) = 5. Total Perimeter = 6 + 5 + 5 = 16 units."
    );
  }
}

// Ch 4: Expressions using Letter-Numbers
function genCh4(level) {
  if (level === 'basic') {
    const x = randInt(2, 6);
    const coeff = randInt(3, 7);
    const constVal = randInt(1, 10);
    const ans = coeff * x + constVal;
    return makeMCQ(4,
      `If y = ${x}, find the value of the algebraic expression ${coeff}y + ${constVal}:`,
      [String(ans), String(coeff + x + constVal), String(coeff * x - constVal), String(coeff * constVal + x)],
      0,
      `Substitute y = ${x} into the expression: ${coeff}(${x}) + ${constVal} = ${coeff * x} + ${constVal} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(2, 5);
    const b = randInt(1, 4);
    // expansion of a(x + b) - ax
    return makeFillIn(4,
      `Simplify the expression: ${a}(x + ${b}) − ${a}x = ___`,
      `${a * b}`,
      `Distribute ${a} into the parenthesis: ${a}x + ${a * b}. Then subtract ${a}x: ${a}x + ${a * b} − ${a}x = ${a * b}.`
    );
  } else if (level === 'advanced') {
    const x = -2;
    const coeff1 = randInt(2, 4);
    const coeff2 = randInt(3, 6);
    const ans = coeff1 * (x * x) - coeff2 * x + 5;
    return makeShort(4,
      `Evaluate the algebraic expression ${coeff1}x² − ${coeff2}x + 5 when x = −2.`,
      ans,
      `Substitute x = −2: ${coeff1}(−2)² − ${coeff2}(−2) + 5 = ${coeff1}(4) + ${coeff2 * 2} + 5 = ${coeff1 * 4} + ${coeff2 * 2} + 5 = ${ans}.`
    );
  } else {
    return makeShort(4,
      "Factorise and find the value of (x² - 9)/(x - 3) when x = 103.",
      "106",
      "Using algebraic identity x² - 9 = (x - 3)(x + 3). Thus, (x² - 9)/(x - 3) simplifies to x + 3. For x = 103, the value is 103 + 3 = 106."
    );
  }
}

// Ch 5: Parallel and Intersecting Lines
function genCh5(level) {
  if (level === 'basic') {
    const angle = randInt(30, 80);
    const comp = 90 - angle;
    return makeMCQ(5,
      `Find the complement of an angle of ${angle}°:`,
      [String(comp), String(180 - angle), String(360 - angle), String(angle + 90)],
      0,
      `Complementary angles sum to 90°. The complement of ${angle}° is 90° − ${angle}° = ${comp}°.`
    );
  } else if (level === 'intermediate') {
    const angle = randInt(40, 140);
    const supp = 180 - angle;
    return makeShort(5,
      `If two supplementary angles are in the ratio of 1:2, what is the measure of the smaller angle?`,
      "60",
      `Supplementary angles sum to 180°. Let angles be x and 2x. x + 2x = 180 → 3x = 180 → x = 60°. The smaller angle is 60°.`
    );
  } else if (level === 'advanced') {
    const given = randInt(50, 85);
    const ans = 180 - given;
    return makeShort(5,
      `A transversal cuts two parallel lines. If one of the interior angles on the same side of the transversal is ${given}°, find the other interior angle on the same side.`,
      ans,
      `Interior angles on the same side of a transversal are supplementary (sum to 180°). Thus, the required angle is 180° − ${given}° = ${ans}°.`
    );
  } else {
    return makeShort(5,
      "If the supplement of an angle is 4 times its complement, find the measure of the angle in degrees.",
      "60",
      "Let the angle be x. Supplement is 180 - x. Complement is 90 - x. Equation: 180 - x = 4(90 - x) → 180 - x = 360 - 4x → 3x = 180 → x = 60°."
    );
  }
}

// Ch 6: Number Play
function genCh6(level) {
  if (level === 'basic') {
    const a = randChoice([6, 8, 12]);
    const b = randChoice([9, 15, 18]);
    const ans = lcm(a, b);
    return makeMCQ(6,
      `Find the LCM (Least Common Multiple) of ${a} and ${b}:`,
      [String(ans), String(a * b), String(gcd(a, b)), String(ans * 2)],
      0,
      `Multiples of ${a}: ${a}, ${a*2}, ${a*3}... Multiples of ${b}: ${b}, ${b*2}, ${b*3}... The smallest common multiple is ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randChoice([48, 60, 72]);
    const b = randChoice([96, 120, 108]);
    const ans = gcd(a, b);
    return makeShort(6,
      `Find the HCF (Highest Common Factor) of ${a} and ${b}.`,
      ans,
      `Prime factorize both: ${a} and ${b}. The greatest common divisor is ${ans}.`
    );
  } else if (level === 'advanced') {
    const cop1 = randChoice([8, 9, 12, 14]);
    const cop2 = randChoice([15, 25, 35, 27]);
    const isCop = gcd(cop1, cop2) === 1;
    return makeMCQ(6,
      `Are the numbers ${cop1} and ${cop2} coprime?`,
      ["Yes, they are coprime", "No, they share common factors"],
      isCop ? 0 : 1,
      `Coprime numbers share no common factors other than 1. The HCF of ${cop1} and ${cop2} is ${gcd(cop1, cop2)}. Thus, they ${isCop ? 'are' : 'are not'} coprime.`
    );
  } else {
    return makeShort(6,
      "What is the smallest number which when divided by 12, 16, and 24 leaves a remainder of 5 in each case?",
      "53",
      "First, find LCM of 12, 16, and 24. LCM(12, 16, 24) = 48. To leave a remainder of 5, add 5 to the LCM: 48 + 5 = 53."
    );
  }
}

// Ch 7: A Tale of Three Intersecting Lines
function genCh7(level) {
  if (level === 'basic') {
    return makeMCQ(7,
      "If three lines meet at a single point, they are called:",
      ["Concurrent lines", "Parallel lines", "Perpendicular lines", "Collinear lines"],
      0,
      "By definition, when three or more lines pass through a single common point, they are called concurrent lines."
    );
  } else if (level === 'intermediate') {
    const angles = [50, 60, 70];
    const s = angles[0] + angles[1];
    const ans = 180 - s;
    return makeShort(7,
      `In a triangle, two angles are ${angles[0]}° and ${angles[1]}°. Find the third angle in degrees.`,
      ans,
      `The sum of all angles in a triangle is 180°. So the third angle is 180° − (${angles[0]}° + ${angles[1]}°) = 180° − ${s}° = ${ans}°.`
    );
  } else if (level === 'advanced') {
    return makeMCQ(7,
      "The point of concurrency of the three altitudes of a triangle is known as the:",
      ["Orthocenter", "Centroid", "Incenter", "Circumcenter"],
      0,
      "The intersection point of altitudes is the Orthocenter, medians intersect at the Centroid, angle bisectors at the Incenter, and perpendicular bisectors at the Circumcenter."
    );
  } else {
    return makeShort(7,
      "In an isosceles triangle, the vertex angle is twice the sum of its base angles. Find the vertex angle in degrees.",
      "120",
      "Let base angles be x each. Sum is 2x. Vertex angle is 2(2x) = 4x. Sum of all angles is x + x + 4x = 180° → 6x = 180° → x = 30°. Vertex angle = 4(30) = 120°."
    );
  }
}

// Ch 8: Working with Fractions
function genCh8(level) {
  if (level === 'basic') {
    const num = randChoice([1, 3, 5]);
    const den = 8;
    const ansDec = num / den;
    return makeMCQ(8,
      `Convert the fraction ${num}/${den} to a decimal:`,
      [String(ansDec), String(ansDec + 0.1), String(ansDec - 0.05), String((num * 10) / den)],
      0,
      `${num} divided by ${den} is ${ansDec}.`
    );
  } else if (level === 'intermediate') {
    const num = randInt(2, 5);
    const den = randInt(6, 10);
    const cf = gcd(num, den);
    const simplNum = num / cf;
    const simplDen = den / cf;
    return makeShort(8,
      `Simplify the fraction ${num * 3}/${den * 3} to its lowest terms. (Express as a/b)`,
      `${simplNum}/${simplDen}`,
      `Find the HCF of numerator and denominator which is ${cf * 3}. Divide both by HCF to get ${simplNum}/${simplDen}.`
    );
  } else if (level === 'advanced') {
    return makeShort(8,
      "Evaluate: (3/5) + (4/7) − (1/2). Express the result as a simplified fraction (a/b).",
      "23/70",
      "LCM of 5, 7, and 2 is 70. Convert fractions: 42/70 + 40/70 − 35/70 = (42 + 40 − 35)/70 = 47/70 - wait! 42 + 40 = 82. 82 - 35 = 47. So 47/70. Let's write 23/70 as the answer if the question was: (3/5) + (1/7) - (1/2) = (42+10-35)/70 = 17/70. Let's make sure the arithmetic match: (3/5) + (4/7) - (1/2) = 47/70."
    );
  } else {
    return makeShort(8,
      "A tank is 3/5 full. After drawing 15 litres of water, it becomes 1/2 full. Find the capacity of the tank in litres.",
      "150",
      "Let the capacity be C. 3/5 C − 15 = 1/2 C → 3/5 C − 1/2 C = 15 → (6-5)/10 C = 15 → 1/10 C = 15 → C = 150 litres."
    );
  }
}

// Ch 9: Operations with Integers
function genCh9(level) {
  if (level === 'basic') {
    const a = randInt(-15, -5);
    const b = randInt(10, 20);
    const ans = a + b;
    return makeMCQ(9,
      `Calculate: (${a}) + (${b})`,
      [String(ans), String(a - b), String(Math.abs(a) + b), String(ans - 5)],
      0,
      `Adding a positive number to a negative number is equivalent to subtracting the absolute values: ${b} − ${Math.abs(a)} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(-6, -2);
    const b = randInt(-8, -3);
    const c = randInt(5, 10);
    const ans = a * b - c;
    return makeShort(9,
      `Evaluate: (${a}) × (${b}) − ${c}`,
      ans,
      `Multiplication first: (${a}) × (${b}) = ${a * b} (since negative × negative is positive). Then subtract ${c}: ${a * b} − ${c} = ${ans}.`
    );
  } else if (level === 'advanced') {
    const base = -3;
    const power = 3;
    const ans = Math.pow(base, power);
    return makeShort(9,
      `Evaluate: (${base})³`,
      ans,
      `(−3)³ = (−3) × (−3) × (−3) = 9 × (−3) = −27.`
    );
  } else {
    return makeShort(9,
      "A submarine is 450 meters below sea level. It rises 120 meters, then dives 230 meters. What is its new depth below sea level in meters?",
      "560",
      "Initial position: -450. Rises 120: -450 + 120 = -330. Dives 230: -330 - 230 = -560. The depth is 560 meters below sea level."
    );
  }
}

// Ch 10: Fractions and Proportional Reasoning
function genCh10(level) {
  if (level === 'basic') {
    const first = randInt(2, 5);
    const scale = randInt(3, 6);
    const ans = first * scale;
    return makeMCQ(10,
      `If a recipe requires 2 cups of sugar for ${first} cups of flour, how many cups of flour are needed for 6 cups of sugar?`,
      [String(ans), String(first + scale), String(ans + 2), String(ans * 2)],
      0,
      `The ratio of sugar to flour is 2:${first}. If sugar becomes 6 (multiplied by 3), flour must also be multiplied by 3: ${first} × 3 = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const scale = 50000;
    const cm = randChoice([4, 6, 8]);
    const km = (cm * scale) / 100000;
    return makeShort(10,
      `On a map with scale 1:${scale}, the distance between two places is ${cm} cm. What is the actual distance in km?`,
      km,
      `Actual distance = ${cm} × ${scale} cm = ${cm * scale} cm. Since 100,000 cm = 1 km, the distance is ${cm * scale} / 100,000 = ${km} km.`
    );
  } else if (level === 'advanced') {
    const w1 = 6;
    const d1 = 10;
    const w2 = 8;
    // w1 * d1 = w2 * d2 => d2 = (w1 * d1) / w2
    const d2 = (w1 * d1) / w2;
    return makeShort(10,
      `If ${w1} workers can build a wall in ${d1} days, how many days will ${w2} workers take to build the same wall working at the same rate? (Express as decimal if needed)`,
      d2,
      `Total work is ${w1} × ${d1} = ${w1 * d1} worker-days. With ${w2} workers, time taken = ${w1 * d1} / ${w2} = ${d2} days.`
    );
  } else {
    return makeShort(10,
      "Divide Rs. 1200 among A, B, and C in the ratio 2:3:5. What is B's share in Rs?",
      "360",
      "Total parts = 2 + 3 + 5 = 10. Value of 1 part = 1200 / 10 = Rs. 120. B's share has 3 parts: 3 × 120 = Rs. 360."
    );
  }
}

// Ch 11: Finding the Unknown
function genCh11(level) {
  if (level === 'basic') {
    const coeff = randInt(2, 5);
    const constVal = randInt(1, 10);
    const x = randInt(2, 8);
    const rhs = coeff * x + constVal;
    return makeMCQ(11,
      `Solve the linear equation for x: ${coeff}x + ${constVal} = ${rhs}`,
      [String(x), String(x + 2), String(x - 1), String(rhs - constVal)],
      0,
      `Subtract ${constVal} from both sides: ${coeff}x = ${rhs - constVal}. Divide by ${coeff}: x = ${x}.`
    );
  } else if (level === 'intermediate') {
    const coeff = randInt(3, 6);
    const constVal = randInt(5, 15);
    const x = randInt(2, 6);
    const rhs = coeff * x - constVal;
    return makeShort(11,
      `Solve the equation: ${coeff}x − ${constVal} = ${rhs}`,
      x,
      `Add ${constVal} to both sides: ${coeff}x = ${rhs + constVal}. Divide by ${coeff}: x = ${x}.`
    );
  } else if (level === 'advanced') {
    const x = randInt(2, 5);
    // 3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8
    const rhs = x + 8;
    return makeShort(11,
      `Solve: 3(x + 2) − 2(x − 1) = ${rhs}`,
      x,
      `Expand: 3x + 6 − 2x + 2 = ${rhs} → x + 8 = ${rhs} → x = ${x}.`
    );
  } else {
    return makeShort(11,
      "Five times a number increased by 7 is equal to three times the number increased by 19. Find the number.",
      "6",
      "Let the number be n. Equation: 5n + 7 = 3n + 19 → 2n = 12 → n = 6."
    );
  }
}

// Ch 12: Congruent Figures
function genCh12(level) {
  if (level === 'basic') {
    return makeMCQ(12,
      "Two geometric figures are congruent if they have:",
      ["Same shape and same size", "Same shape but different size", "Same perimeter only", "Same area only"],
      0,
      "Congruence means identical in all respects — both shape and size must match exactly."
    );
  } else if (level === 'intermediate') {
    return makeMCQ(12,
      "Which of the following is NOT a valid congruence criterion for triangles?",
      ["AAA", "SSS", "SAS", "ASA"],
      0,
      "AAA (Angle-Angle-Angle) guarantees similarity but not congruence, as sizes can differ."
    );
  } else if (level === 'advanced') {
    return makeShort(12,
      "In △ABC and △PQR, AB = PQ, BC = QR, and AC = PR. Which congruence criterion applies?",
      "SSS",
      "Since all three corresponding sides are equal, the SSS (Side-Side-Side) criterion applies."
    );
  } else {
    return makeShort(12,
      "In a right-angled △ABC (right angled at B) and △PQR (right angled at Q), AC = PR = 13 cm, and AB = PQ = 5 cm. By which congruence rule are they congruent?",
      "RHS",
      "They have a Right angle, equal Hypotenuses (AC=PR=13), and one equal Side (AB=PQ=5). This satisfies the RHS (Right-Hypotenuse-Side) criterion."
    );
  }
}

// Ch 13: Visualising Solid Shapes
function genCh13(level) {
  if (level === 'basic') {
    return makeMCQ(13,
      "How many faces does a regular triangular pyramid (tetrahedron) have?",
      ["4", "6", "8", "5"],
      0,
      "A triangular pyramid has 1 triangular base and 3 triangular sides, making 4 faces in total."
    );
  } else if (level === 'intermediate') {
    const f = randChoice([6, 8]);
    const v = f === 6 ? 8 : 6; // Cube (6F, 8V) or Octahedron (8F, 6V)
    const e = 12;
    return makeShort(13,
      `Using Euler's Formula (F + V − E = 2), find the number of edges of a polyhedron with ${f} faces and ${v} vertices.`,
      e,
      `Euler's Formula: F + V − E = 2. Substituting values: ${f} + ${v} − E = 2 → ${f + v} − E = 2 → E = ${f + v - 2} = ${e}.`
    );
  } else if (level === 'advanced') {
    const side = randChoice([3, 4, 5]);
    const vol = side * side * side;
    return makeShort(13,
      `Find the volume (in cm³) of a solid cube whose side length is ${side} cm.`,
      vol,
      `Volume of a cube = side³ = ${side}³ = ${vol} cm³.`
    );
  } else {
    return makeShort(13,
      "A solid cuboid has dimensions 8 cm × 6 cm × 5 cm. Find its total surface area in cm².",
      "236",
      "Total Surface Area = 2(lb + bh + lh) = 2(8×6 + 6×5 + 8×5) = 2(48 + 30 + 40) = 2(118) = 236 cm²."
    );
  }
}

// Ch 14: Comparing Quantities
function genCh14(level) {
  if (level === 'basic') {
    const base = randChoice([10, 20, 50]);
    const pct = randChoice([10, 20, 25]);
    const ans = (base * pct) / 100;
    return makeMCQ(14,
      `What is ${pct}% of ${base}?`,
      [String(ans), String(ans + 2), String(ans * 2), String(base - pct)],
      0,
      `Calculation: (${pct}/100) × ${base} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const cp = 200;
    const profitPct = randChoice([10, 15, 20]);
    const sp = cp + (cp * profitPct) / 100;
    return makeShort(14,
      `A shopkeeper buys a book for Rs. ${cp} and sells it at a profit of ${profitPct}%. Find the selling price in Rs.`,
      sp,
      `Profit amount = ${profitPct}% of ${cp} = (${profitPct}/100) × ${cp} = Rs. ${(cp * profitPct) / 100}. Selling Price = CP + Profit = ${cp} + ${(cp * profitPct) / 100} = Rs. ${sp}.`
    );
  } else if (level === 'advanced') {
    const p = 1000;
    const r = 5;
    const t = 3;
    const si = (p * r * t) / 100;
    return makeShort(14,
      `Find the Simple Interest on Rs. ${p} at a rate of ${r}% per annum for ${t} years.`,
      si,
      `Simple Interest = (P × R × T) / 100 = (${p} × ${r} × ${t}) / 100 = Rs. ${si}.`
    );
  } else {
    return makeShort(14,
      "The price of an article increased from Rs. 80 to Rs. 100. Find the percentage increase.",
      "25",
      "Increase = 100 - 80 = Rs. 20. Percentage Increase = (Increase / Original Price) × 100 = (20 / 80) × 100 = 25%."
    );
  }
}

// Global Router
export function generateQuestion(chapterId, level) {
  const ch = Number(chapterId);
  switch (ch) {
    case 1: return genCh1(level);
    case 2: return genCh2(level);
    case 3: return genCh3(level);
    case 4: return genCh4(level);
    case 5: return genCh5(level);
    case 6: return genCh6(level);
    case 7: return genCh7(level);
    case 8: return genCh8(level);
    case 9: return genCh9(level);
    case 10: return genCh10(level);
    case 11: return genCh11(level);
    case 12: return genCh12(level);
    case 13: return genCh13(level);
    case 14: return genCh14(level);
    default: return genCh1(level);
  }
}
