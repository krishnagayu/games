/**
 * Diagram helper module for Class 5 Math Coach.
 * Renders SVG visual diagrams for math questions that require geometric, visual, or spatial aids.
 */

export function renderDiagram(question) {
  if (!question) return '';

  const { chapter, type, text, options } = question;

  // Chapter 2: Shapes & Angles
  if (chapter === 2) {
    if (text.includes("3:00") || text.includes("9:00")) {
      return drawClockSVG(3, 0, "Right Angle (90°)");
    }
    if (text.includes("acute") || text.includes("30°") || text.includes("45°") || text.includes("60°") || text.includes("smaller than a right angle")) {
      return drawAngleSVG(45, "Acute Angle (< 90°)");
    }
    if (text.includes("180") || text.includes("straight")) {
      return drawAngleSVG(180, "Straight Angle (180°)");
    }
    if (text.includes("obtuse") || text.includes("120°") || text.includes("135°") || text.includes("150°") || text.includes("hexagon")) {
      return drawAngleSVG(120, "Obtuse Angle (> 90°)");
    }
    // Default angle diagram for Ch 2
    return drawAngleSVG(90, "Right Angle (90°)");
  }

  // Chapter 3 & 11: Area, Perimeter & Grids
  if (chapter === 3 || chapter === 11) {
    // Square grid or rectangle diagram
    if (text.includes("side of 3 cm") || text.includes("side of 8 cm") || text.includes("side of 12 cm") || text.includes("side 15 m") || text.includes("225 sq meters")) {
      return drawRectangleSVG(4, 4, "Square", "s", "s");
    }
    if (text.includes("length 5 cm and width 4 cm") || text.includes("5 cm long and 4 cm wide") || text.includes("5") || text.includes("rectangle")) {
      return drawRectangleSVG(6, 4, "Rectangle Grid", "Length", "Width");
    }
    return drawGridSVG(5, 4, "Square Grid Area");
  }

  // Chapter 4: Parts and Wholes (Fractions)
  if (chapter === 4) {
    if (text.includes("flag")) {
      return drawFlagSVG();
    }
    if (text.includes("chocolate") || text.includes("pieces") || text.includes("12") || text.includes("16")) {
      return drawFractionGridSVG(3, 4, 3, "Chocolate Bar (3/12 = 1/4 shaded)");
    }
    if (text.includes("3/5") || text.includes("1/5") || text.includes("4/5")) {
      return drawFractionBarSVG(5, 4, "Fraction Bar (4/5 shaded)");
    }
    if (text.includes("2/4") || text.includes("4/8") || text.includes("1/2")) {
      return drawFractionPieSVG(4, 2, "Fraction Circle (2/4 = 1/2)");
    }
    return drawFractionPieSVG(4, 1, "Fraction Circle (1/4)");
  }

  // Chapter 5: Rotational & Reflective Symmetry
  if (chapter === 5) {
    if (text.includes("H") || text.includes("half-turn") || text.includes("Rectangle")) {
      return drawSymmetrySVG("H", true, "1/2 Turn Symmetry (180°)");
    }
    if (text.includes("triangle") || text.includes("1/3 turn")) {
      return drawSymmetryTriangleSVG("1/3 Turn (120°)");
    }
    if (text.includes("pentagon")) {
      return drawPentagonSymmetrySVG("5 Lines of Symmetry");
    }
    return drawSymmetrySVG("A", true, "Line of Symmetry");
  }

  // Chapter 6: Venn diagrams for multiples/factors
  if (chapter === 6) {
    return drawVennDiagramSVG("Multiples of A", "Multiples of B", "LCM / Common");
  }

  // Chapter 7: Patterns & Magic Grids
  if (chapter === 7) {
    if (text.includes("magic square")) {
      return drawMagicSquareSVG();
    }
    if (text.includes("dice") || text.includes("opposite faces")) {
      return drawDiceSVG();
    }
    return drawPatternSVG();
  }

  // Chapter 8: Maps & Grid Scales
  if (chapter === 8) {
    return drawMapSVG();
  }

  // Chapter 9: Boxes & Sketches (3D Net of Cube / Cuboid)
  if (chapter === 9) {
    if (text.includes("no top lid") || text.includes("5")) {
      return drawCubeNetSVG(5, "Net of Open Box (5 faces)");
    }
    return drawCubeNetSVG(6, "Net of Cube (6 faces)");
  }

  // Chapter 10: Decimals & Ruler
  if (chapter === 10) {
    return drawRulerSVG();
  }

  // Chapter 12: Smart Charts (Bar Graph / Chapati Chart)
  if (chapter === 12) {
    if (text.includes("pie chart") || text.includes("Chapati") || text.includes("percentage")) {
      return drawChapatiChartSVG();
    }
    return drawBarChartSVG();
  }

  // Chapter 14: Volume (Cuboid & Cubes)
  if (chapter === 14) {
    return draw3DCuboidSVG();
  }

  return '';
}

// ───────── SVG Helper Generators ─────────

function drawClockSVG(hour, minute, label) {
  const angleHour = (hour % 12) * 30 + minute * 0.5;
  const angleMin = minute * 6;
  const hRad = (angleHour - 90) * (Math.PI / 180);
  const mRad = (angleMin - 90) * (Math.PI / 180);
  const hx = 100 + 45 * Math.cos(hRad);
  const hy = 100 + 45 * Math.sin(hRad);
  const mx = 100 + 65 * Math.cos(mRad);
  const my = 100 + 65 * Math.sin(mRad);

  return `
    <div class="problem-diagram">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="85" fill="hsl(220, 30%, 15%)" stroke="hsl(265, 80%, 70%)" stroke-width="4"/>
        <circle cx="100" cy="100" r="4" fill="#ffffff"/>
        <!-- Clock Numbers -->
        <text x="100" y="32" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">12</text>
        <text x="170" y="105" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">3</text>
        <text x="100" y="178" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">6</text>
        <text x="30" y="105" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">9</text>
        <!-- Hands -->
        <line x1="100" y1="100" x2="${hx}" y2="${hy}" stroke="hsl(330, 85%, 65%)" stroke-width="6" stroke-linecap="round"/>
        <line x1="100" y1="100" x2="${mx}" y2="${my}" stroke="hsl(170, 80%, 55%)" stroke-width="4" stroke-linecap="round"/>
        <!-- Angle Arc -->
        <path d="M 100 65 A 35 35 0 0 1 135 100" fill="none" stroke="hsl(45, 95%, 60%)" stroke-width="3" stroke-dasharray="4"/>
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawAngleSVG(deg, label) {
  const rad = -deg * (Math.PI / 180);
  const x2 = 130 + 70 * Math.cos(rad);
  const y2 = 130 + 70 * Math.sin(rad);
  const arcX = 130 + 30 * Math.cos(rad);
  const arcY = 130 + 30 * Math.sin(rad);

  return `
    <div class="problem-diagram">
      <svg width="220" height="160" viewBox="0 0 220 160">
        <!-- Base Line -->
        <line x1="130" y1="130" x2="200" y2="130" stroke="hsl(200, 80%, 60%)" stroke-width="4" stroke-linecap="round"/>
        <!-- Ray Line -->
        <line x1="130" y1="130" x2="${x2}" y2="${y2}" stroke="hsl(330, 85%, 65%)" stroke-width="4" stroke-linecap="round"/>
        <!-- Vertex -->
        <circle cx="130" cy="130" r="5" fill="hsl(45, 95%, 60%)"/>
        <!-- Angle Arc -->
        <path d="M 160 130 A 30 30 0 0 0 ${arcX} ${arcY}" fill="none" stroke="hsl(45, 95%, 60%)" stroke-width="3"/>
        <text x="145" y="115" fill="hsl(45, 95%, 60%)" font-size="14" font-weight="bold">${deg}°</text>
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawRectangleSVG(unitsW, unitsH, label, lblW, lblH) {
  return `
    <div class="problem-diagram">
      <svg width="220" height="150" viewBox="0 0 220 150">
        <rect x="30" y="20" width="160" height="90" rx="8" fill="hsl(265, 80%, 70%, 0.2)" stroke="hsl(265, 80%, 70%)" stroke-width="3"/>
        <!-- Grid lines inside -->
        <line x1="110" y1="20" x2="110" y2="110" stroke="hsl(265, 80%, 70%, 0.4)" stroke-dasharray="4"/>
        <line x1="30" y1="65" x2="190" y2="65" stroke="hsl(265, 80%, 70%, 0.4)" stroke-dasharray="4"/>
        <!-- Dimension labels -->
        <text x="110" y="14" fill="#ffffff" font-size="13" text-anchor="middle" font-weight="bold">${lblW}</text>
        <text x="16" y="70" fill="#ffffff" font-size="13" text-anchor="middle" font-weight="bold">${lblH}</text>
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawGridSVG(cols, rows, label) {
  let gridLines = '';
  const cellW = 160 / cols;
  const cellH = 100 / rows;
  for (let c = 0; c <= cols; c++) {
    gridLines += `<line x1="${30 + c * cellW}" y1="20" x2="${30 + c * cellW}" y2="120" stroke="hsl(170, 80%, 55%, 0.5)" stroke-width="1.5"/>`;
  }
  for (let r = 0; r <= rows; r++) {
    gridLines += `<line x1="30" y1="${20 + r * cellH}" x2="190" y2="${20 + r * cellH}" stroke="hsl(170, 80%, 55%, 0.5)" stroke-width="1.5"/>`;
  }

  return `
    <div class="problem-diagram">
      <svg width="220" height="150" viewBox="0 0 220 150">
        <rect x="30" y="20" width="160" height="100" fill="hsl(170, 80%, 55%, 0.1)" stroke="hsl(170, 80%, 55%)" stroke-width="3"/>
        ${gridLines}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawFlagSVG() {
  return `
    <div class="problem-diagram">
      <svg width="200" height="130" viewBox="0 0 200 130">
        <!-- Top Stripe (Saffron) -->
        <rect x="20" y="15" width="160" height="30" fill="#FF9933" rx="3"/>
        <!-- Middle Stripe (White) -->
        <rect x="20" y="45" width="160" height="30" fill="#FFFFFF"/>
        <!-- Bottom Stripe (Green) -->
        <rect x="20" y="75" width="160" height="30" fill="#138808" rx="3"/>
        <!-- Ashoka Chakra -->
        <circle cx="100" cy="60" r="12" fill="none" stroke="#000080" stroke-width="2"/>
        <circle cx="100" cy="60" r="2" fill="#000080"/>
        <!-- Border -->
        <rect x="20" y="15" width="160" height="90" fill="none" stroke="hsl(220, 30%, 30%)" stroke-width="2" rx="3"/>
      </svg>
      <div class="diagram-caption">Indian Flag (3 equal horizontal parts = 1/3 each)</div>
    </div>
  `;
}

function drawFractionGridSVG(rows, cols, shadedCount, label) {
  let cells = '';
  const width = 160;
  const height = 90;
  const cellW = width / cols;
  const cellH = height / rows;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      count++;
      const isShaded = count <= shadedCount;
      const fill = isShaded ? 'hsl(45, 95%, 60%)' : 'hsl(220, 20%, 25%)';
      cells += `<rect x="${20 + c * cellW}" y="${15 + r * cellH}" width="${cellW - 2}" height="${cellH - 2}" fill="${fill}" rx="3" stroke="hsl(220, 30%, 40%)"/>`;
    }
  }

  return `
    <div class="problem-diagram">
      <svg width="200" height="120" viewBox="0 0 200 120">
        ${cells}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawFractionBarSVG(total, shaded, label) {
  let segments = '';
  const w = 180 / total;
  for (let i = 0; i < total; i++) {
    const fill = i < shaded ? 'hsl(330, 85%, 65%)' : 'hsl(220, 20%, 25%)';
    segments += `<rect x="${10 + i * w}" y="20" width="${w - 3}" height="40" fill="${fill}" rx="4" stroke="hsl(330, 85%, 85%)" stroke-width="1.5"/>`;
  }
  return `
    <div class="problem-diagram">
      <svg width="200" height="80" viewBox="0 0 200 80">
        ${segments}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawFractionPieSVG(totalParts, shadedParts, label) {
  let paths = '';
  const cx = 100, cy = 60, r = 45;
  for (let i = 0; i < totalParts; i++) {
    const a1 = (i * 360 / totalParts - 90) * (Math.PI / 180);
    const a2 = ((i + 1) * 360 / totalParts - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const fill = i < shadedParts ? 'hsl(170, 80%, 55%)' : 'hsl(220, 25%, 25%)';
    paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="hsl(220, 30%, 80%)" stroke-width="2"/>`;
  }
  return `
    <div class="problem-diagram">
      <svg width="200" height="120" viewBox="0 0 200 120">
        ${paths}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawSymmetrySVG(char, showLine, label) {
  return `
    <div class="problem-diagram">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <text x="90" y="85" fill="hsl(200, 80%, 60%)" font-size="70" font-weight="bold" text-anchor="middle">${char}</text>
        ${showLine ? '<line x1="90" y1="15" x2="90" y2="115" stroke="hsl(330, 85%, 65%)" stroke-width="3" stroke-dasharray="6"/>' : ''}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawSymmetryTriangleSVG(label) {
  return `
    <div class="problem-diagram">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <polygon points="90,15 150,110 30,110" fill="hsl(15, 90%, 65%, 0.2)" stroke="hsl(15, 90%, 65%)" stroke-width="3"/>
        <circle cx="90" cy="75" r="3" fill="#fff"/>
        <path d="M 90 40 A 35 35 0 0 1 120 75" fill="none" stroke="hsl(45, 95%, 60%)" stroke-width="3" stroke-dasharray="4"/>
        <text x="135" y="65" fill="hsl(45, 95%, 60%)" font-size="12" font-weight="bold">120°</text>
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawPentagonSymmetrySVG(label) {
  return `
    <div class="problem-diagram">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <polygon points="90,15 155,55 130,120 50,120 25,55" fill="hsl(310, 75%, 65%, 0.2)" stroke="hsl(310, 75%, 65%)" stroke-width="3"/>
        <line x1="90" y1="15" x2="90" y2="120" stroke="hsl(45, 95%, 60%)" stroke-dasharray="4" stroke-width="2"/>
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawVennDiagramSVG(labelA, labelB, labelCenter) {
  return `
    <div class="problem-diagram">
      <svg width="220" height="130" viewBox="0 0 220 130">
        <circle cx="80" cy="65" r="50" fill="hsl(330, 85%, 65%, 0.3)" stroke="hsl(330, 85%, 65%)" stroke-width="3"/>
        <circle cx="140" cy="65" r="50" fill="hsl(200, 80%, 60%, 0.3)" stroke="hsl(200, 80%, 60%)" stroke-width="3"/>
        <text x="55" y="70" fill="#fff" font-size="12" font-weight="bold">Set A</text>
        <text x="165" y="70" fill="#fff" font-size="12" font-weight="bold">Set B</text>
        <text x="110" y="70" fill="hsl(45, 95%, 60%)" font-size="11" font-weight="bold" text-anchor="middle">Common</text>
      </svg>
      <div class="diagram-caption">Venn Diagram (Factors & Multiples)</div>
    </div>
  `;
}

function drawMagicSquareSVG() {
  return `
    <div class="problem-diagram">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <rect x="30" y="10" width="120" height="110" fill="hsl(220, 30%, 20%)" stroke="hsl(45, 95%, 60%)" stroke-width="3" rx="6"/>
        <line x1="70" y1="10" x2="70" y2="120" stroke="hsl(45, 95%, 60%)"/>
        <line x1="110" y1="10" x2="110" y2="120" stroke="hsl(45, 95%, 60%)"/>
        <line x1="30" y1="46" x2="150" y2="46" stroke="hsl(45, 95%, 60%)"/>
        <line x1="30" y1="83" x2="150" y2="83" stroke="hsl(45, 95%, 60%)"/>

        <!-- Numbers -->
        <text x="50" y="34" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">8</text>
        <text x="90" y="34" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">1</text>
        <text x="130" y="34" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">6</text>
        
        <text x="50" y="71" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">3</text>
        <text x="90" y="71" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">5</text>
        <text x="130" y="71" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">7</text>

        <text x="50" y="108" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">4</text>
        <text x="90" y="108" fill="hsl(330, 85%, 65%)" font-size="18" font-weight="bold" text-anchor="middle">?</text>
        <text x="130" y="108" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">2</text>
      </svg>
      <div class="diagram-caption">Magic Square Grid (Sum = 15)</div>
    </div>
  `;
}

function drawDiceSVG() {
  return `
    <div class="problem-diagram">
      <svg width="160" height="120" viewBox="0 0 160 120">
        <rect x="40" y="20" width="80" height="80" rx="12" fill="hsl(0, 80%, 60%)" stroke="#fff" stroke-width="3"/>
        <circle cx="60" cy="40" fill="#fff" r="6"/>
        <circle cx="100" cy="40" fill="#fff" r="6"/>
        <circle cx="80" cy="60" fill="#fff" r="6"/>
        <circle cx="60" cy="80" fill="#fff" r="6"/>
        <circle cx="100" cy="80" fill="#fff" r="6"/>
      </svg>
      <div class="diagram-caption">Standard Dice (Opposite faces sum to 7)</div>
    </div>
  `;
}

function drawPatternSVG() {
  return `
    <div class="problem-diagram">
      <svg width="220" height="80" viewBox="0 0 220 80">
        <circle cx="30" cy="40" r="18" fill="hsl(330, 85%, 65%)"/>
        <rect x="70" y="22" width="36" height="36" fill="hsl(200, 80%, 60%)" rx="6"/>
        <circle cx="140" cy="40" r="18" fill="hsl(330, 85%, 65%)"/>
        <rect x="180" y="22" width="36" height="36" fill="hsl(45, 95%, 60%)" rx="6" stroke="hsl(330, 85%, 65%)" stroke-width="3"/>
      </svg>
      <div class="diagram-caption">Repeating Visual Pattern</div>
    </div>
  `;
}

function drawMapSVG() {
  return `
    <div class="problem-diagram">
      <svg width="220" height="130" viewBox="0 0 220 130">
        <rect x="20" y="15" width="180" height="100" fill="hsl(120, 40%, 20%)" stroke="hsl(120, 65%, 60%)" stroke-width="3" rx="8"/>
        <!-- Roads -->
        <path d="M 20 65 Q 100 20 200 65" fill="none" stroke="hsl(45, 95%, 60%)" stroke-width="4" stroke-dasharray="6"/>
        <!-- Compass -->
        <circle cx="175" cy="35" r="15" fill="hsl(220, 30%, 15%)" stroke="#fff"/>
        <text x="175" y="30" fill="hsl(330, 85%, 65%)" font-size="11" font-weight="bold" text-anchor="middle">N</text>
        <text x="175" y="46" fill="#fff" font-size="9" text-anchor="middle">S</text>
        <!-- Scale label -->
        <text x="30" y="105" fill="#fff" font-size="11" font-weight="bold">Scale: 1 cm = 2 km</text>
      </svg>
      <div class="diagram-caption">Map Grid & Direction Scale</div>
    </div>
  `;
}

function drawCubeNetSVG(numFaces, label) {
  return `
    <div class="problem-diagram">
      <svg width="200" height="140" viewBox="0 0 200 140">
        <!-- T-shaped cross net of cube -->
        <rect x="85" y="10" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>
        <rect x="25" y="45" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>
        <rect x="55" y="45" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>
        <rect x="85" y="45" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>
        <rect x="115" y="45" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>
        ${numFaces === 6 ? '<rect x="85" y="80" width="30" height="30" fill="hsl(265, 80%, 70%, 0.3)" stroke="hsl(265, 80%, 70%)" stroke-width="2"/>' : ''}
      </svg>
      <div class="diagram-caption">${label}</div>
    </div>
  `;
}

function drawRulerSVG() {
  let marks = '';
  for (let i = 0; i <= 10; i++) {
    const x = 20 + i * 16;
    const h = (i % 5 === 0) ? 25 : 12;
    marks += `<line x1="${x}" y1="20" x2="${x}" y2="${20 + h}" stroke="#fff" stroke-width="1.5"/>`;
    if (i % 5 === 0) {
      marks += `<text x="${x}" y="60" fill="#fff" font-size="11" text-anchor="middle">${i / 10} cm</text>`;
    }
  }
  return `
    <div class="problem-diagram">
      <svg width="200" height="85" viewBox="0 0 200 85">
        <rect x="10" y="15" width="180" height="55" fill="hsl(45, 95%, 60%, 0.2)" stroke="hsl(45, 95%, 60%)" stroke-width="2" rx="4"/>
        ${marks}
      </svg>
      <div class="diagram-caption">Decimal Ruler (Tenths & Millimeters)</div>
    </div>
  `;
}

function drawBarChartSVG() {
  return `
    <div class="problem-diagram">
      <svg width="200" height="130" viewBox="0 0 200 130">
        <!-- Axes -->
        <line x1="30" y1="15" x2="30" y2="105" stroke="#fff" stroke-width="2"/>
        <line x1="30" y1="105" x2="185" y2="105" stroke="#fff" stroke-width="2"/>
        <!-- Bars -->
        <rect x="45" y="45" width="25" height="60" fill="hsl(200, 80%, 60%)" rx="3"/>
        <rect x="85" y="25" width="25" height="80" fill="hsl(330, 85%, 65%)" rx="3"/>
        <rect x="125" y="75" width="25" height="30" fill="hsl(170, 80%, 55%)" rx="3"/>
        <!-- Labels -->
        <text x="57" y="120" fill="#fff" font-size="10" text-anchor="middle">Blue</text>
        <text x="97" y="120" fill="#fff" font-size="10" text-anchor="middle">Pink</text>
        <text x="137" y="120" fill="#fff" font-size="10" text-anchor="middle">Green</text>
      </svg>
      <div class="diagram-caption">Smart Chart (Bar Graph)</div>
    </div>
  `;
}

function drawChapatiChartSVG() {
  return `
    <div class="problem-diagram">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <!-- Pie chart -->
        <circle cx="90" cy="60" r="45" fill="hsl(200, 80%, 60%)" stroke="#fff" stroke-width="2"/>
        <!-- Slices -->
        <path d="M 90 60 L 90 15 A 45 45 0 0 1 135 60 Z" fill="hsl(330, 85%, 65%)" stroke="#fff" stroke-width="2"/>
        <path d="M 90 60 L 135 60 A 45 45 0 0 1 90 105 Z" fill="hsl(45, 95%, 60%)" stroke="#fff" stroke-width="2"/>
      </svg>
      <div class="diagram-caption">Chapati Chart (Pie Chart Data)</div>
    </div>
  `;
}

function draw3DCuboidSVG() {
  return `
    <div class="problem-diagram">
      <svg width="200" height="130" viewBox="0 0 200 130">
        <!-- Front face -->
        <rect x="30" y="45" width="100" height="60" fill="hsl(340, 80%, 65%, 0.3)" stroke="hsl(340, 80%, 65%)" stroke-width="2.5"/>
        <!-- Top face -->
        <polygon points="30,45 60,20 160,20 130,45" fill="hsl(340, 80%, 65%, 0.5)" stroke="hsl(340, 80%, 65%)" stroke-width="2.5"/>
        <!-- Side face -->
        <polygon points="130,45 160,20 160,80 130,105" fill="hsl(340, 80%, 65%, 0.4)" stroke="hsl(340, 80%, 65%)" stroke-width="2.5"/>
        <!-- Labels -->
        <text x="80" y="120" fill="#fff" font-size="11" font-weight="bold">L × W × H</text>
      </svg>
      <div class="diagram-caption">3D Volume Cuboid (Length × Width × Height)</div>
    </div>
  `;
}
