/**
 * Class 5 Math Coach - Multi-Template Infinite Procedural Question Generators
 * Sticking to the standard NCERT Class 5 Math-Magic syllabus.
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
  return Math.abs(a * b) / (gcd(a, b) || 1);
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

// ───────── NCERT Chapter Generators ─────────

// Ch 1: The Fish Tale
function genCh1(level) {
  const type = randInt(1, 3);
  if (level === 'basic') {
    const val = randChoice([200000, 300000, 500000, 800000]) + randInt(1, 9) * 10000;
    if (type === 1) {
      return makeMCQ(1,
        `Write the place value of the first digit of ${val.toLocaleString('en-IN')}:`,
        [(val - (val % 100000)).toLocaleString('en-IN'), "10,000", "1,000", "100"],
        0,
        `The first digit is in the lakhs place. So its value is ${val - (val % 100000)}.`
      );
    } else {
      const speed = randChoice([4, 5, 6]);
      const hours = randInt(2, 6);
      const dist = speed * hours;
      return makeShort(1,
        `A basic log boat travels at a speed of ${speed} km/h. How far will it go in ${hours} hours?`,
        dist,
        `Distance = Speed × Time = ${speed} km/h × ${hours} hours = ${dist} km.`
      );
    }
  } else if (level === 'intermediate') {
    const weight = randChoice([10, 20, 30, 40]);
    const pricePerKg = randChoice([80, 120, 150]);
    const total = weight * pricePerKg;
    return makeShort(1,
      `Fazila sold ${weight} kg of Kingfish for Rs ${total}. What was the price per kg?`,
      pricePerKg,
      `Price per kg = Total cost ÷ Weight = Rs ${total} ÷ ${weight} kg = Rs ${pricePerKg} per kg.`
    );
  } else {
    // Advanced/Olympiad
    const speed = 20;
    const distance = randChoice([60, 80, 100, 120]);
    const time = distance / speed;
    return makeShort(1,
      `A motor boat goes at 20 km per hour. How many hours will it take to travel ${distance} km?`,
      time,
      `Time = Distance ÷ Speed = ${distance} km ÷ 20 km/h = ${time} hours.`
    );
  }
}

// Ch 2: Shapes and Angles
function genCh2(level) {
  if (level === 'basic') {
    const angle = randChoice([30, 45, 60]);
    return makeMCQ(2,
      `An angle of ${angle}° is which type of angle?`,
      ["Acute Angle", "Right Angle", "Obtuse Angle", "Straight Angle"],
      0,
      `An angle less than 90° is an Acute Angle.`
    );
  } else if (level === 'intermediate') {
    const time = randChoice(["9:00", "3:00"]);
    return makeMCQ(2,
      `What angle is made by clock hands at ${time}?`,
      ["Acute Angle", "Right Angle", "Obtuse Angle", "Straight Angle"],
      1,
      `At ${time}, the hands form a perfect 90° angle (Right Angle).`
    );
  } else {
    const angle = randChoice([120, 135, 150]);
    return makeMCQ(2,
      `If a clock hand rotates by ${angle} degrees, it has turned more than a right angle. What angle type is this?`,
      ["Acute Angle", "Right Angle", "Obtuse Angle", "Straight Angle"],
      2,
      `An angle greater than 90° but less than 180° is an Obtuse Angle.`
    );
  }
}

// Ch 3: How Many Squares?
function genCh3(level) {
  const l = randInt(4, 9);
  const w = randInt(3, 6);
  if (level === 'basic') {
    const p = 2 * (l + w);
    return makeShort(3,
      `A rectangle grid is made of 1 cm squares. If the length is ${l} cm and width is ${w} cm, find its perimeter.`,
      p,
      `Perimeter = 2 × (Length + Width) = 2 × (${l} + ${w}) = ${p} cm.`
    );
  } else {
    const a = l * w;
    return makeShort(3,
      `Find the area of a card that is ${l} cm long and ${w} cm wide.`,
      a,
      `Area = Length × Width = ${l} × ${w} = ${a} square cm.`
    );
  }
}

// Ch 4: Parts and Wholes
function genCh4(level) {
  if (level === 'basic') {
    const num = randChoice([2, 3, 5]);
    const den = num * 2;
    return makeMCQ(4,
      `Simplify the fraction ${num}/${den}:`,
      ["1/2", "1/3", "2/3", "1/4"],
      0,
      `Divide numerator and denominator by ${num} to get 1/2.`
    );
  } else if (level === 'intermediate') {
    const pieces = randChoice([12, 16, 20]);
    const fraction = "1/4";
    const share = pieces / 4;
    return makeShort(4,
      `Sonu has a chocolate bar with ${pieces} pieces. She gives 1/4 of it to her friend. How many pieces did her friend get?`,
      share,
      `1/4 of ${pieces} = ${pieces} ÷ 4 = ${share} pieces.`
    );
  } else {
    const a = randChoice([1, 2]);
    return makeShort(4,
      `Find the sum: 3/7 + 2/7`,
      "5/7",
      `Since denominators are same, add the numerators: 3 + 2 = 5. Answer is 5/7.`
    );
  }
}

// Ch 5: Does it Look the Same?
function genCh5(level) {
  if (level === 'basic') {
    return makeMCQ(5,
      `Which shape looks exactly the same after a 1/2 turn?`,
      ["Rectangle", "Triangle", "Right Trapezoid", "L-shape"],
      0,
      `A rectangle looks identical when rotated by 180 degrees (1/2 turn).`
    );
  } else {
    return makeMCQ(5,
      `An equilateral triangle looks the same after what fractional turn?`,
      ["1/3 turn", "1/4 turn", "1/2 turn", "1/5 turn"],
      0,
      `An equilateral triangle has 3 identical sides, so it looks the same after a 120° rotation (1/3 turn).`
    );
  }
}

// Ch 6: Be My Multiple, I'll be Your Factor
function genCh6(level) {
  const a = randChoice([4, 6, 8]);
  const b = randChoice([3, 5, 7]);
  if (level === 'basic') {
    return makeMCQ(6,
      `Which of these is a multiple of ${a}?`,
      [(a * 3).toString(), (a * 3 - 1).toString(), (a * 3 + 1).toString(), (a * 2 + 1).toString()],
      0,
      `${a * 3} is a multiple since ${a} × 3 = ${a * 3}.`
    );
  } else if (level === 'intermediate') {
    const ans = lcm(a, b);
    return makeShort(6,
      `Find the Lowest Common Multiple (LCM) of ${a} and ${b}.`,
      ans,
      `Multiples of ${a}: ${a}, ${a*2}, ${a*3}... Multiples of ${b}: ${b}, ${b*2}, ${b*3}... Smallest common multiple is ${ans}.`
    );
  } else {
    const commonGcd = gcd(12, 18);
    return makeShort(6,
      `Find the Highest Common Factor (HCF) of 12 and 18.`,
      commonGcd,
      `Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Highest Common Factor is ${commonGcd}.`
    );
  }
}

// Ch 7: Can You See the Pattern?
function genCh7(level) {
  const start = randInt(5, 20);
  const diff = randInt(3, 7);
  const v1 = start + diff;
  const v2 = v1 + diff;
  const v3 = v2 + diff;
  const ans = v3 + diff;
  return makeShort(7,
    `Complete the pattern: ${start}, ${v1}, ${v2}, ${v3}, ___`,
    ans,
    `Each number increases by ${diff}. So, ${v3} + ${diff} = ${ans}.`
  );
}

// Ch 8: Mapping Your Way
function genCh8(level) {
  const scale = randChoice([2, 3, 5]);
  const mapDist = randInt(3, 8);
  const actualDist = scale * mapDist;
  return makeShort(8,
    `If 1 cm on a map represents ${scale} km on the ground, how many km is ${mapDist} cm on the map?`,
    actualDist,
    `Actual Distance = Map Distance × Scale = ${mapDist} cm × ${scale} km/cm = ${actualDist} km.`
  );
}

// Ch 9: Boxes and Sketches
function genCh9(level) {
  return makeMCQ(9,
    `How many square faces are needed to construct a complete cube box?`,
    ["6", "5", "4", "8"],
    0,
    `A solid cube consists of exactly 6 square faces.`
  );
}

// Ch 10: Tenths and Hundredths
function genCh10(level) {
  if (level === 'basic') {
    const paise = randChoice([25, 75, 50]);
    return makeShort(10,
      `Convert ${paise} paise into Rupees (in decimal form).`,
      `0.${paise}`,
      `${paise} paise = ${paise}/100 Rupees = Rs 0.${paise}.`
    );
  } else {
    const a = randChoice([0.4, 0.7, 0.9]);
    return makeMCQ(10,
      `Which is larger: ${a} or 0.25?`,
      [a.toString(), "0.25", "Both are equal"],
      0,
      `${a} is ${a}0, which is larger than 0.25.`
    );
  }
}

// Ch 11: Area and its Boundary
function genCh11(level) {
  const side = randInt(5, 12);
  if (level === 'basic') {
    return makeShort(11,
      `Calculate the area of a square stamp of side ${side} cm.`,
      side * side,
      `Area of square = Side × Side = ${side} × ${side} = ${side * side} square cm.`
    );
  } else {
    return makeShort(11,
      `A square field has side length ${side} m. Find the length of wire needed to fence its boundary once.`,
      side * 4,
      `Fencing boundary is the perimeter: 4 × side = 4 × ${side} = ${side * 4} meters.`
    );
  }
}

// Ch 12: Smart Charts
function genCh12(level) {
  const cats = randInt(5, 15);
  const dogs = randInt(10, 20);
  const total = cats + dogs;
  return makeShort(12,
    `In a survey, a student finds ${cats} cats and ${dogs} dogs. How many animals did they record in total?`,
    total,
    `Total animals = Cats + Dogs = ${cats} + ${dogs} = ${total}.`
  );
}

// Ch 13: Ways to Multiply and Divide
function genCh13(level) {
  const mult = randChoice([12, 15, 25]);
  const days = randChoice([30, 31]);
  const total = mult * days;
  return makeShort(13,
    `If a helper is paid Rs ${mult} per day, how much will they earn in a month of ${days} days?`,
    total,
    `Earnings = Rs ${mult}/day × ${days} days = Rs ${total}.`
  );
}

// Ch 14: How Big? How Heavy?
function genCh14(level) {
  const l = randInt(2, 5);
  const w = randInt(2, 4);
  const h = randInt(2, 3);
  const vol = l * w * h;
  return makeShort(14,
    `Find the volume of a box with length ${l} cm, width ${w} cm, and height ${h} cm.`,
    vol,
    `Volume = Length × Width × Height = ${l} × ${w} × ${h} = ${vol} cubic cm.`
  );
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
