/**
 * Class 7 Math Coach - Multi-Template Infinite Procedural Question Generators
 * Supports multiple distinct question types per difficulty tier for high variety.
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { let t = b; b = a % b; a = t; }
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

function makeMCQ(chapterId, text, options, correctIndex, solution) {
  return { chapter: chapterId, type: 'mcq', text, options, answer: correctIndex, solution };
}

function makeShort(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'short', text, answer: String(answer), solution };
}

function makeFillIn(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'fillin', text, answer: String(answer), solution };
}

// ───────── Multi-Template Chapter Generators ─────────

// Ch 1: Large Numbers Around Us
function genCh1(level) {
  const type = randInt(1, 3);
  if (level === 'basic') {
    if (type === 1) {
      const val = randChoice([150000, 280000, 430000, 780000, 920000]) + randInt(1, 999);
      const rounded = Math.round(val / 1000) * 1000;
      return makeMCQ(1,
        `Round the number ${val.toLocaleString('en-IN')} to the nearest thousand:`,
        [rounded.toLocaleString('en-IN'), (rounded + 1000).toLocaleString('en-IN'), (rounded - 1000).toLocaleString('en-IN'), (val + 500).toLocaleString('en-IN')],
        0,
        `Look at the hundreds digit of ${val.toLocaleString('en-IN')}. Since it is less than 500, we round down to ${rounded.toLocaleString('en-IN')}.`
      );
    } else if (type === 2) {
      const digits = [3, 4, 5, 6, 7, 8, 9];
      const selected = randChoice(digits);
      const val = `4${selected}82500`;
      const placeVal = selected * 100000;
      return makeMCQ(1,
        `What is the place value of the digit ${selected} in the number ${Number(val).toLocaleString('en-IN')}?`,
        [placeVal.toLocaleString('en-IN'), (selected * 10000).toLocaleString('en-IN'), (selected * 1000000).toLocaleString('en-IN'), selected.toString()],
        0,
        `The digit ${selected} is in the Lakhs place. So its place value is ${selected} × 1,00,000 = ${placeVal.toLocaleString('en-IN')}.`
      );
    } else {
      const a = randChoice([4500000, 8200000, 3100000]);
      const b = a + randChoice([10000, -10000, 50000]);
      const isGreater = a > b;
      return makeMCQ(1,
        `Is the statement true or false: ${a.toLocaleString('en-IN')} > ${b.toLocaleString('en-IN')}?`,
        ["True", "False"],
        isGreater ? 0 : 1,
        `Comparing the place values from left to right, we find that ${a.toLocaleString('en-IN')} is ${isGreater ? 'greater' : 'less'} than ${b.toLocaleString('en-IN')}.`
      );
    }
  } else if (level === 'intermediate') {
    if (type === 1) {
      const num = randInt(10, 99);
      return makeShort(1,
        `Express "${num} Crore" in numerical standard form without commas (e.g. 50000000).`,
        `${num}0000000`,
        `1 Crore = 1,00,00000. So ${num} Crore is ${num} × 10,000,000 = ${num}0000000.`
      );
    } else if (type === 2) {
      const scale = randChoice([100, 200, 500]);
      return makeShort(1,
        `How many thousands make up ${scale} Lakh?`,
        scale * 100,
        `1 Lakh = 100 thousands. So ${scale} Lakh = ${scale} × 100 = ${scale * 100} thousands.`
      );
    } else {
      const a = randChoice([12, 16, 20]);
      const b = randChoice([18, 24, 30]);
      const ans = gcd(a, b);
      return makeShort(1,
        `Find the Highest Common Factor (HCF) of ${a} and ${b}.`,
        ans,
        `Factors of ${a} are ${Array.from({length:a},(_,i)=>i+1).filter(x=>a%x===0).join(', ')}. Factors of ${b} are ${Array.from({length:b},(_,i)=>i+1).filter(x=>b%x===0).join(', ')}. The HCF is ${ans}.`
      );
    }
  } else if (level === 'advanced') {
    if (type === 1) {
      const base = randInt(2, 4);
      const power = base === 2 ? randInt(6, 8) : randInt(4, 5);
      const ans = Math.pow(base, power);
      return makeShort(1,
        `Evaluate the exponent: ${base}^${power}`,
        ans,
        `${base} multiplied by itself ${power} times yields ${ans}.`
      );
    } else {
      const mag = randInt(3, 5);
      const factor = Math.pow(10, mag);
      return makeShort(1,
        `How many times larger is 7 × 10^${mag + 2} compared to 7 × 10^2?`,
        factor,
        `Dividing: (7 × 10^${mag + 2}) / (7 × 10^2) = 10^(${mag + 2} - 2) = 10^${mag} = ${factor}.`
      );
    }
  } else {
    // Olympiad
    if (type === 1) {
      const div = randChoice([72, 36, 45]);
      const largest = 999999;
      const rem = largest % div;
      const ans = largest - rem;
      return makeShort(1,
        `What is the largest 6-digit number that is completely divisible by ${div}?`,
        ans,
        `The largest 6-digit number is 999,999. 999,999 ÷ ${div} leaves a remainder of ${rem}. Subtracting the remainder: 999,999 − ${rem} = ${ans}.`
      );
    } else {
      return makeShort(1,
        "How many zeros are at the end of the product: 5 × 10 × 15 × 20 × 25 × 30 × 35 × 40?",
        "8",
        "Count the factors of 5 and 2 in the product. The number of trailing zeros is determined by the pairs of 2 and 5. There are 8 factors of 5 in total, and plenty of 2s, resulting in 8 trailing zeros."
      );
    }
  }
}

// Ch 2: Arithmetic Expressions (BODMAS)
function genCh2(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const a = randInt(6, 15);
    const b = randInt(3, 6);
    const c = randInt(2, 4);
    if (type === 1) {
      const ans = a + b * c;
      return makeMCQ(2,
        `Evaluate the expression: ${a} + ${b} × ${c}`,
        [String(ans), String((a + b) * c), String(a * c + b), String(a - b * c)],
        0,
        `BODMAS rule applies: Multiplication first. ${b} × ${c} = ${b*c}. Then addition: ${a} + ${b*c} = ${ans}.`
      );
    } else {
      const ans = a * b - c;
      return makeMCQ(2,
        `Evaluate the expression: ${a} × ${b} − ${c}`,
        [String(ans), String(a * (b - c)), String(a - b * c), String(ans + 10)],
        0,
        `BODMAS: Multiply ${a} × ${b} = ${a*b}. Then subtract ${c}: ${a*b} − ${c} = ${ans}.`
      );
    }
  } else if (level === 'intermediate') {
    const a = randInt(12, 24);
    const b = randInt(3, 6);
    const c = randInt(8, 16);
    const d = randInt(2, 4);
    const cClean = Math.round(c / d) * d;
    if (type === 1) {
      const ans = (a - b) * (cClean / d);
      return makeShort(2,
        `Evaluate the expression: (${a} − ${b}) × (${cClean} ÷ ${d})`,
        ans,
        `Solve brackets: (${a} − ${b}) = ${a-b} and (${cClean} ÷ ${d}) = ${cClean/d}. Multiply results: ${a-b} × ${cClean/d} = ${ans}.`
      );
    } else {
      const ans = a + b * (cClean - d);
      return makeShort(2,
        `Evaluate the expression: ${a} + ${b} × (${cClean} − ${d})`,
        ans,
        `Evaluate bracket first: (${cClean} − ${d}) = ${cClean - d}. Multiply next: ${b} × ${cClean - d} = ${b * (cClean - d)}. Finally add: ${a} + ${b * (cClean - d)} = ${ans}.`
      );
    }
  } else if (level === 'advanced') {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const c = randInt(4, 9);
    const ans = Math.pow(a, b) * (c - 2) + 6;
    return makeShort(2,
      `Simplify: ${a}^${b} × (${c} − 2) + 18 ÷ 3`,
      ans,
      `BODMAS order: Exponent ${a}^${b} = ${Math.pow(a,b)}. Bracket (${c} - 2) = ${c-2}. Division 18 ÷ 3 = 6. Multiply: ${Math.pow(a,b)} × ${c-2} = ${Math.pow(a,b)*(c-2)}. Add 6 to get ${ans}.`
    );
  } else {
    // Olympiad
    if (type === 1) {
      return makeShort(2,
        "Simplify the nested expression: 120 − [45 − {25 − (18 − 6 + 3)}]",
        "90",
        "Innermost bracket: 18 - 6 + 3 = 15. Curly bracket: 25 - 15 = 10. Square bracket: 45 - 10 = 35. Final subtraction: 120 - 35 = 85."
      );
    } else {
      return makeShort(2,
        "Evaluate: 4² × 5 − [30 ÷ {12 − (8 − 2)}] + 3",
        "78",
        "Parenthesis: 8 - 2 = 6. Curly brackets: 12 - 6 = 6. Division inside square: 30 ÷ 6 = 5. Exponent: 4² = 16. Multiply: 16 × 5 = 80. Expression: 80 - 5 + 3 = 78."
      );
    }
  }
}

// Ch 3: A Peek Beyond the Point
function genCh3(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const x = randChoice([-4, -2, 3, 5]);
    const y = randChoice([-5, -3, 2, 6]);
    let quad = x > 0 ? (y > 0 ? "I" : "IV") : (y > 0 ? "II" : "III");
    return makeMCQ(3,
      `In which quadrant of the coordinate plane does the point (${x}, ${y}) lie?`,
      ["I", "II", "III", "IV"],
      ["I", "II", "III", "IV"].indexOf(quad),
      `X-coordinate is ${x > 0 ? 'positive' : 'negative'} and Y-coordinate is ${y > 0 ? 'positive' : 'negative'}. Hence, it lies in Quadrant ${quad}.`
    );
  } else if (level === 'intermediate') {
    const x = randChoice([3, 5, 8]);
    const y = randChoice([4, 12, 15]);
    const dist = Math.sqrt(x*x + y*y);
    const ans = Number.isInteger(dist) ? String(dist) : `√${x*x + y*y}`;
    return makeShort(3,
      `Find the distance of the point (${x}, ${y}) from the origin (0, 0).`,
      ans,
      `Distance formula: √(x² + y²) = √(${x}² + ${y}²) = √(${x*x} + ${y*y}) = √${x*x + y*y} = ${ans}.`
    );
  } else if (level === 'advanced') {
    const x1 = randInt(1, 4);
    const y1 = randInt(1, 4);
    const x2 = x1 + 3;
    const y2 = y1 + 4;
    return makeShort(3,
      `Find the distance between the two points A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
      "5",
      `Using the coordinate distance formula: √((x2 - x1)² + (y2 - y1)²) = √((3)² + (4)²) = √25 = 5.`
    );
  } else {
    return makeShort(3,
      "Find the area of a triangle with vertices A(1,1), B(7,1), and C(4,5) in square units.",
      "12",
      "Base AB = 7 - 1 = 6 units. Height = difference in y-coordinates of C and A/B = 5 - 1 = 4 units. Area = 0.5 × Base × Height = 0.5 × 6 × 4 = 12 square units."
    );
  }
}

// Ch 4: Expressions using Letter-Numbers
function genCh4(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const x = randInt(2, 5);
    const a = randInt(3, 6);
    const b = randInt(2, 9);
    const ans = a * x + b;
    return makeMCQ(4,
      `If z = ${x}, find the value of the algebraic expression: ${a}z + ${b}`,
      [String(ans), String(a + x + b), String(ans - 3), String(a * (x + b))],
      0,
      `Substitute z = ${x}: ${a}(${x}) + ${b} = ${a*x} + ${b} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(3, 7);
    const b = randInt(2, 5);
    return makeFillIn(4,
      `Simplify by expanding: ${a}(x + ${b}) − ${a}x = ___`,
      `${a * b}`,
      `Distribute the ${a}: ${a}x + ${a * b}. Subtracting ${a}x leaves ${a * b}.`
    );
  } else if (level === 'advanced') {
    const x = -2;
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const ans = a * (x * x) - b * x + 7;
    return makeShort(4,
      `Evaluate the algebraic expression: ${a}x² − ${b}x + 7 when x = −2`,
      ans,
      `Substitute x = −2: ${a}(−2)² − ${b}(−2) + 7 = ${a}(4) + ${b*2} + 7 = ${a*4} + ${b*2} + 7 = ${ans}.`
    );
  } else {
    return makeShort(4,
      "If x + y = 12 and xy = 35, find the value of x² + y².",
      "74",
      "Using algebraic identity: (x + y)² = x² + y² + 2xy. Substituting values: 12² = x² + y² + 2(35) → 144 = x² + y² + 70 → x² + y² = 144 − 70 = 74."
    );
  }
}

// Ch 5: Parallel and Intersecting Lines
function genCh5(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const angle = randInt(25, 75);
    const comp = 90 - angle;
    return makeMCQ(5,
      `Find the complement of an angle of ${angle}°:`,
      [String(comp), String(180 - angle), String(360 - angle), String(angle + 90)],
      0,
      `Complementary angles sum to 90°. Hence, 90° − ${angle}° = ${comp}°.`
    );
  } else if (level === 'intermediate') {
    const angle = randInt(50, 130);
    const supp = 180 - angle;
    return makeShort(5,
      `If an angle is supplementary to ${angle}°, what is its measure in degrees?`,
      supp,
      `Supplementary angles sum to 180°. So the supplement is 180° − ${angle}° = ${supp}°.`
    );
  } else if (level === 'advanced') {
    const angle = randInt(60, 80);
    const sameSide = 180 - angle;
    return makeShort(5,
      `A transversal cuts two parallel lines. If a corresponding angle is ${angle}°, find the co-interior angle on the same side.`,
      sameSide,
      `The interior angles on the same side of a transversal are supplementary (sum to 180°). Thus, 180° − ${angle}° = ${sameSide}°.`
    );
  } else {
    return makeShort(5,
      "Two parallel lines are cut by a transversal. If the ratio of two consecutive interior angles is 2:3, find the larger angle in degrees.",
      "108",
      "Consecutive interior angles are supplementary (sum to 180°). Let the angles be 2x and 3x. 2x + 3x = 180 → 5x = 180 → x = 36°. The larger angle is 3 × 36 = 108°."
    );
  }
}

// Ch 6: Number Play
function genCh6(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const a = randChoice([6, 8, 10]);
    const b = randChoice([12, 15, 18]);
    const ans = lcm(a, b);
    return makeMCQ(6,
      `Find the Least Common Multiple (LCM) of ${a} and ${b}:`,
      [String(ans), String(a * b), String(gcd(a, b)), String(ans * 2)],
      0,
      `LCM of ${a} and ${b} is the smallest positive integer divisible by both: ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randChoice([36, 48, 60]);
    const b = randChoice([72, 96, 120]);
    const ans = gcd(a, b);
    return makeShort(6,
      `Find the Highest Common Factor (HCF) of ${a} and ${b}.`,
      ans,
      `The greatest common divisor of ${a} and ${b} is ${ans}.`
    );
  } else if (level === 'advanced') {
    const isCop = type === 1;
    const a = isCop ? 15 : 12;
    const b = isCop ? 28 : 18;
    return makeMCQ(6,
      `Are ${a} and ${b} coprime numbers?`,
      ["Yes, they are coprime", "No, they share a common factor other than 1"],
      isCop ? 0 : 1,
      `Coprime numbers share only 1 as a common factor. HCF(${a}, ${b}) is ${gcd(a, b)}. Thus they ${isCop ? 'are' : 'are not'} coprime.`
    );
  } else {
    return makeShort(6,
      "What is the smallest positive integer that leaves a remainder of 3 when divided by 15, 20, or 30?",
      "63",
      "Find LCM(15, 20, 30) which is 60. To leave a remainder of 3, add 3 to the LCM: 60 + 3 = 63."
    );
  }
}

// Ch 7: A Tale of Three Intersecting Lines
function genCh7(level) {
  if (level === 'basic') {
    return makeMCQ(7,
      "When three or more lines intersect at a single point, they are known as:",
      ["Concurrent lines", "Parallel lines", "Perpendicular lines", "Collinear lines"],
      0,
      "Lines that meet at a single common point are defined as concurrent lines."
    );
  } else if (level === 'intermediate') {
    const a = randInt(40, 70);
    const b = randInt(50, 75);
    const ans = 180 - (a + b);
    return makeShort(7,
      `In a triangle, two of the interior angles measure ${a}° and ${b}°. Find the measure of the third angle in degrees.`,
      ans,
      `The sum of all interior angles of any triangle is 180°. So the third angle is 180° − (${a}° + ${b}°) = ${ans}°.`
    );
  } else if (level === 'advanced') {
    return makeMCQ(7,
      "The orthocenter of a triangle is the point of concurrency of its:",
      ["Altitudes", "Medians", "Angle bisectors", "Perpendicular bisectors"],
      0,
      "Altitudes intersect at the Orthocenter, medians at the Centroid, angle bisectors at the Incenter, and perpendicular bisectors at the Circumcenter."
    );
  } else {
    return makeShort(7,
      "An exterior angle of a triangle measures 120°, and one of its interior opposite angles is 50°. Find the other interior opposite angle in degrees.",
      "70",
      "The exterior angle of a triangle is equal to the sum of its two interior opposite angles. Equation: 50 + x = 120 → x = 70°."
    );
  }
}

// Ch 8: Working with Fractions
function genCh8(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const num = randChoice([1, 3, 5]);
    const den = 4;
    const dec = num / den;
    return makeMCQ(8,
      `Convert the fraction ${num}/${den} into a decimal value:`,
      [String(dec), String(dec + 0.1), String(dec - 0.05), String(dec * 10)],
      0,
      `${num} divided by ${den} is exactly ${dec}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(10, 20);
    const b = randInt(25, 35);
    const cf = gcd(a, b);
    return makeShort(8,
      `Simplify the fraction ${a}/${b} to its simplest form (e.g. a/b):`,
      `${a/cf}/${b/cf}`,
      `Dividing both the numerator and denominator by their greatest common divisor HCF = ${cf} yields ${a/cf}/${b/cf}.`
    );
  } else if (level === 'advanced') {
    return makeShort(8,
      "Solve: (2/3) + (1/4) − (1/6). Express as a simplified fraction (a/b).",
      "3/4",
      "LCM of 3, 4, and 6 is 12. Convert the fractions: 8/12 + 3/12 − 2/12 = 9/12, which simplifies to 3/4."
    );
  } else {
    return makeShort(8,
      "A student read 2/5 of a book on Saturday and 1/3 of the remaining pages on Sunday. If 60 pages are still left, how many pages does the book have?",
      "150",
      "Let total pages be P. Saturday: reads 2/5 P, leaving 3/5 P. Sunday: reads 1/3 of (3/5 P) = 1/5 P. Total read = 2/5 + 1/5 = 3/5 P. Left = 2/5 P = 60 pages → P = 150 pages."
    );
  }
}

// Ch 9: Operations with Integers
function genCh9(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const a = randInt(-20, -10);
    const b = randInt(15, 30);
    const ans = a + b;
    return makeMCQ(9,
      `Calculate: (${a}) + (${b})`,
      [String(ans), String(a - b), String(Math.abs(a) + b), String(ans - 5)],
      0,
      `Adding a positive number is the same as subtracting absolute values: ${b} − ${Math.abs(a)} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const a = randInt(-5, -2);
    const b = randInt(-6, -3);
    const c = randInt(10, 15);
    const ans = a * b - c;
    return makeShort(9,
      `Evaluate: (${a}) × (${b}) − ${c}`,
      ans,
      `Multiplication first: (${a}) × (${b}) = ${a*b} (negative × negative is positive). Subtracting ${c}: ${a*b} − ${c} = ${ans}.`
    );
  } else if (level === 'advanced') {
    const a = -2;
    const b = 4;
    const ans = Math.pow(a, b);
    return makeShort(9,
      `Evaluate: (${a})^${b}`,
      ans,
      `Multiplying −2 by itself 4 times: (−2) × (−2) × (−2) × (−2) = 16. (Even exponent yields positive).`
    );
  } else {
    return makeShort(9,
      "An elevator starts 20 meters below ground level. It rises 55 meters, then drops 45 meters. What is its final position relative to ground level in meters? (Use negative sign if below ground)",
      "-10",
      "Start: -20. Rises 55: -20 + 55 = 35. Drops 45: 35 - 45 = -10 meters (which means 10 meters below ground level)."
    );
  }
}

// Ch 10: Fractions and Proportional Reasoning
function genCh10(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const cups = randInt(2, 4);
    const scale = randInt(3, 5);
    return makeMCQ(10,
      `If 3 bags of cement weigh ${cups * 10} kg, how many kg will ${3 * scale} bags of cement weigh?`,
      [String(cups * 10 * scale), String(cups * 10 + scale), String(cups * scale), String(cups * 10 * scale + 10)],
      0,
      `The ratio of bags to weight is 3:${cups * 10}. Multiplied by scale ${scale}: the weight is ${cups * 10} × ${scale} = ${cups * 10 * scale} kg.`
    );
  } else if (level === 'intermediate') {
    const scale = 40000;
    const cm = randChoice([5, 10]);
    const km = (cm * scale) / 100000;
    return makeShort(10,
      `On a map with scale 1:${scale}, two towns are ${cm} cm apart. What is the actual distance between them in km?`,
      km,
      `Actual distance = ${cm} × ${scale} = ${cm * scale} cm = ${cm * scale / 100000} km.`
    );
  } else if (level === 'advanced') {
    return makeShort(10,
      "If 12 men can complete a construction project in 8 days, how many days will 16 men take working at the same pace?",
      "6",
      "Total effort is 12 men × 8 days = 96 man-days. With 16 men: 96 / 16 = 6 days."
    );
  } else {
    return makeShort(10,
      "A sum of money is shared among three friends X, Y, and Z in ratio 4:5:6. If Z receives Rs. 120 more than X, what is the total sum of money in Rs?",
      "900",
      "Ratios are X=4p, Y=5p, Z=6p. Difference between Z and X is 6p − 4p = 2p = Rs. 120 → p = 60. Total sum is 4p + 5p + 6p = 15p = 15 × 60 = Rs. 900."
    );
  }
}

// Ch 11: Finding the Unknown
function genCh11(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const coeff = randInt(2, 5);
    const constVal = randInt(2, 8);
    const x = randInt(3, 7);
    const rhs = coeff * x + constVal;
    return makeMCQ(11,
      `Solve the linear equation for x: ${coeff}x + ${constVal} = ${rhs}`,
      [String(x), String(x + 2), String(x - 1), String(rhs - constVal)],
      0,
      `Subtract ${constVal}: ${coeff}x = ${rhs - constVal}. Divide by ${coeff}: x = ${x}.`
    );
  } else if (level === 'intermediate') {
    const coeff = randInt(3, 5);
    const constVal = randInt(5, 12);
    const x = randInt(2, 6);
    const rhs = coeff * x - constVal;
    return makeShort(11,
      `Solve the linear equation: ${coeff}x − ${constVal} = ${rhs}`,
      x,
      `Add ${constVal} to both sides: ${coeff}x = ${rhs + constVal}. Divide by ${coeff}: x = ${x}.`
    );
  } else if (level === 'advanced') {
    const x = randInt(2, 5);
    const rhs = 2*x + 10;
    return makeShort(11,
      `Solve the equation: 4(x + 3) − 2(x + 1) = ${rhs}`,
      x,
      `Expand: 4x + 12 − 2x − 2 = ${rhs} → 2x + 10 = ${rhs} → x = ${x}.`
    );
  } else {
    return makeShort(11,
      "The sum of three consecutive odd integers is 57. Find the smallest of these integers.",
      "17",
      "Let the integers be n, n+2, n+4. Sum = 3n + 6 = 57 → 3n = 51 → n = 17. The smallest integer is 17."
    );
  }
}

// Ch 12: Congruent Figures
function genCh12(level) {
  if (level === 'basic') {
    return makeMCQ(12,
      "Two figures are congruent if they have:",
      ["Same shape and same size", "Same shape but different size", "Same perimeter only", "Same area only"],
      0,
      "Congruent shapes are exact duplicates — both shape and size must match precisely."
    );
  } else if (level === 'intermediate') {
    return makeMCQ(12,
      "Under which of the following criteria are two triangles congruent if their corresponding angles are equal?",
      ["AAA (Not a valid congruence criterion)", "SSS", "SAS", "ASA"],
      0,
      "AAA (Angle-Angle-Angle) ensures identical shapes (similarity) but does not guarantee identical sizes, so it is not a valid congruence rule."
    );
  } else if (level === 'advanced') {
    return makeShort(12,
      "In △ABC and △DEF, AB = DE, BC = EF, and ∠B = ∠E. Which congruence criterion applies?",
      "SAS",
      "Since two sides and the included angle are equal, the SAS (Side-Angle-Side) criterion applies."
    );
  } else {
    return makeShort(12,
      "In right-angled △XYZ (∠Y = 90°) and right-angled △PQR (∠Q = 90°), hypotenuse XZ = PR and side XY = PQ. Which congruence criterion proves their congruence?",
      "RHS",
      "Since the hypotenuse and one side of a right-angled triangle are equal to the corresponding parts of another, the RHS (Right-Hypotenuse-Side) criterion applies."
    );
  }
}

// Ch 13: Visualising Solid Shapes
function genCh13(level) {
  if (level === 'basic') {
    return makeMCQ(13,
      "How many faces does a regular square pyramid have?",
      ["5", "6", "4", "8"],
      0,
      "A square pyramid has 1 square base and 4 triangular lateral faces, making 5 faces in total."
    );
  } else if (level === 'intermediate') {
    const f = randChoice([6, 8]);
    const v = f === 6 ? 8 : 6;
    return makeShort(13,
      `According to Euler's formula (F + V − E = 2), how many edges does a polyhedron with ${f} faces and ${v} vertices have?`,
      "12",
      `F + V − E = 2 → ${f} + ${v} − E = 2 → 14 − E = 2 → E = 12.`
    );
  } else if (level === 'advanced') {
    const s = randChoice([3, 4, 5]);
    return makeShort(13,
      `Calculate the volume (in cm³) of a solid cube with side length ${s} cm.`,
      s * s * s,
      `Volume of cube = side³ = ${s}³ = ${s * s * s} cm³.`
    );
  } else {
    return makeShort(13,
      "A solid cuboid has dimensions 10 cm × 6 cm × 4 cm. Find its total surface area in cm².",
      "248",
      "Total Surface Area = 2(lb + bh + lh) = 2(10×6 + 6×4 + 10×4) = 2(60 + 24 + 40) = 2(124) = 248 cm²."
    );
  }
}

// Ch 14: Comparing Quantities
function genCh14(level) {
  const type = randInt(1, 2);
  if (level === 'basic') {
    const base = randChoice([20, 40, 80]);
    const pct = randChoice([10, 25, 50]);
    const ans = (base * pct) / 100;
    return makeMCQ(14,
      `What is ${pct}% of ${base}?`,
      [String(ans), String(ans + 2), String(ans * 2), String(base - pct)],
      0,
      `Calculation: (${pct}/100) × ${base} = ${ans}.`
    );
  } else if (level === 'intermediate') {
    const cp = 500;
    const profitPct = randChoice([10, 20]);
    const sp = cp + (cp * profitPct) / 100;
    return makeShort(14,
      `An item is purchased for Rs. ${cp} and sold at a profit of ${profitPct}%. Find its selling price in Rs.`,
      sp,
      `Profit amount = ${profitPct}% of ${cp} = Rs. ${(cp * profitPct)/100}. Selling Price = CP + Profit = ${cp} + ${(cp * profitPct)/100} = Rs. ${sp}.`
    );
  } else if (level === 'advanced') {
    const p = 2000;
    const r = 6;
    const t = 2;
    const si = (p * r * t) / 100;
    return makeShort(14,
      `Find the Simple Interest on Rs. ${p} at a rate of ${r}% per annum for ${t} years.`,
      si,
      `Simple Interest = (P × R × T) / 100 = (${p} × ${r} × ${t}) / 100 = Rs. ${si}.`
    );
  } else {
    return makeShort(14,
      "An article was sold for Rs. 240 at a loss of 20%. What was its cost price in Rs?",
      "300",
      "SP = Cost Price (CP) × (1 − Loss%). Equation: 240 = CP × (1 − 0.20) → 240 = CP × 0.80 → CP = 240 / 0.80 = Rs. 300."
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
