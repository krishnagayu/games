/**
 * Class 7 Science Coach - Interactive Virtual Electricity Lab
 * 5 Live Interactive Science Experiments:
 * 1. Simple Circuit with Bulb, Switch, and Polarity
 * 2. Heating Effect & Safety Fuse / MCB Trip
 * 3. Oersted's Magnetic Compass Deflection
 * 4. Electromagnet & Paperclip Attraction
 * 5. Electric Bell Step-by-Step Mechanism
 */

export function createElectricityLab() {
  const container = document.createElement('div');
  container.className = 'lab-container';

  container.innerHTML = `
    <div class="lab-header">
      <div class="lab-header__badge">
        <span>⚡</span> Hands-On Virtual Science Lab
      </div>
      <h3 class="lab-header__title">Class 7 Electric Current & Circuits Laboratory</h3>
      <p class="lab-header__desc">Interact with live simulations to visually understand open/closed circuits, heating, fuses, Oersted's compass deflection, electromagnets, and the electric bell.</p>
      
      <div class="lab-tabs">
        <button class="lab-tab active" data-tab="circuit">1. Circuit & Bulb</button>
        <button class="lab-tab" data-tab="fuse">2. Heating & Fuse / MCB</button>
        <button class="lab-tab" data-tab="oersted">3. Oersted's Compass</button>
        <button class="lab-tab" data-tab="electromagnet">4. Electromagnet Picker</button>
        <button class="lab-tab" data-tab="bell">5. Electric Bell</button>
      </div>
    </div>

    <div class="lab-body" id="lab-body"></div>
  `;

  const tabs = container.querySelectorAll('.lab-tab');
  const body = container.querySelector('#lab-body');

  function renderTab(tabName) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    body.innerHTML = '';

    if (tabName === 'circuit') {
      body.appendChild(createCircuitSim());
    } else if (tabName === 'fuse') {
      body.appendChild(createFuseSim());
    } else if (tabName === 'oersted') {
      body.appendChild(createOerstedSim());
    } else if (tabName === 'electromagnet') {
      body.appendChild(createElectromagnetSim());
    } else if (tabName === 'bell') {
      body.appendChild(createBellSim());
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      renderTab(tab.dataset.tab);
    });
  });

  // Default initial tab
  renderTab('circuit');

  return container;
}

// ─────────────────────────────────────────────────────────────
// Experiment 1: Circuit & Bulb Simulator
// ─────────────────────────────────────────────────────────────
function createCircuitSim() {
  const el = document.createElement('div');
  el.className = 'sim-box';

  let switchClosed = true;
  let cellCount = 2; // 1, 2, 3
  let reversedCell = false;
  let filamentBroken = false;

  el.innerHTML = `
    <div class="sim-grid">
      <div class="sim-stage" id="circuit-stage">
        <!-- SVG Circuit Diagram dynamically rendered -->
      </div>

      <div class="sim-panel">
        <h4 class="sim-panel__title">Circuit Controls</h4>
        
        <div class="sim-control-group">
          <label>Switch Position:</label>
          <div class="btn-toggle-group">
            <button class="sim-btn ${switchClosed ? 'active' : ''}" id="btn-sw-on">CLOSED (ON)</button>
            <button class="sim-btn ${!switchClosed ? 'active' : ''}" id="btn-sw-off">OPEN (OFF)</button>
          </div>
        </div>

        <div class="sim-control-group">
          <label>Battery Cells (1.5 V each in series):</label>
          <div class="btn-toggle-group">
            <button class="sim-btn ${cellCount === 1 ? 'active' : ''}" id="btn-cells-1">1 Cell (1.5V)</button>
            <button class="sim-btn ${cellCount === 2 ? 'active' : ''}" id="btn-cells-2">2 Cells (3.0V)</button>
            <button class="sim-btn ${cellCount === 3 ? 'active' : ''}" id="btn-cells-3">3 Cells (4.5V)</button>
          </div>
        </div>

        <div class="sim-control-group">
          <label>Defect Diagnostics:</label>
          <div style="display: flex; gap: 0.5rem; flex-direction: column;">
            <button class="sim-btn outline" id="btn-toggle-reverse">
              ${reversedCell ? '✔ Reverse Cell Corrected' : '⚠️ Invert 1 Cell Polarity'}
            </button>
            <button class="sim-btn outline" id="btn-toggle-filament">
              ${filamentBroken ? '🔧 Repair Bulb Filament' : '💥 Burn / Fuse Filament'}
            </button>
          </div>
        </div>

        <div class="sim-readout" id="circuit-readout"></div>
      </div>
    </div>
  `;

  function update() {
    const stage = el.querySelector('#circuit-stage');
    const readout = el.querySelector('#circuit-readout');

    let netVoltage = cellCount * 1.5;
    if (reversedCell) {
      // 1 reversed cancels 1 aiding: net = (N - 2)*1.5
      netVoltage = Math.max(0, (cellCount - 2) * 1.5);
    }

    const isCurrentFlowing = switchClosed && !filamentBroken && netVoltage > 0;
    const brightnessRatio = isCurrentFlowing ? Math.min(1, netVoltage / 4.5) : 0;

    // Glowing colors
    const glowAlpha = (brightnessRatio * 0.85).toFixed(2);
    const bulbColor = isCurrentFlowing ? `rgba(250, 204, 21, ${glowAlpha})` : '#334155';
    const filamentColor = filamentBroken ? '#ef4444' : (isCurrentFlowing ? '#fef08a' : '#94a3b8');

    // Build SVG
    stage.innerHTML = `
      <svg viewBox="0 0 460 280" class="sim-canvas">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Wires -->
        <!-- Top wire -->
        <path d="M 120 60 L 340 60" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Right wire to bulb -->
        <path d="M 340 60 L 340 100" stroke="#38bdf8" stroke-width="4" fill="none"/>
        <!-- Bulb to bottom right -->
        <path d="M 340 180 L 340 220 L 260 220" stroke="#38bdf8" stroke-width="4" fill="none"/>
        <!-- Switch to bottom left -->
        <path d="M 200 220 L 120 220 L 120 60" stroke="#38bdf8" stroke-width="4" fill="none"/>

        <!-- Animated current flow dots if active -->
        ${isCurrentFlowing ? `
          <g class="electron-flow">
            <circle cx="200" cy="60" r="4" fill="#facc15" />
            <circle cx="280" cy="60" r="4" fill="#facc15" />
            <circle cx="340" cy="140" r="4" fill="#facc15" />
            <circle cx="300" cy="220" r="4" fill="#facc15" />
            <circle cx="160" cy="220" r="4" fill="#facc15" />
            <circle cx="120" cy="140" r="4" fill="#facc15" />
          </g>
        ` : ''}

        <!-- Battery representation on Top Wire -->
        <g transform="translate(190, 40)">
          <rect x="-10" y="-5" width="80" height="50" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
          ${renderBatteryCells(cellCount, reversedCell)}
          <text x="30" y="55" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">${netVoltage.toFixed(1)} V Battery</text>
        </g>

        <!-- Bulb at Right -->
        <g transform="translate(340, 140)">
          <!-- Glow aura -->
          ${isCurrentFlowing ? `<circle cx="0" cy="0" r="${28 + brightnessRatio * 20}" fill="rgba(250, 204, 21, ${glowAlpha})" filter="url(#glow)"/>` : ''}
          <circle cx="0" cy="0" r="24" fill="${bulbColor}" stroke="#64748b" stroke-width="3"/>
          <!-- Bulb base -->
          <rect x="-10" y="24" width="20" height="12" fill="#64748b" rx="2"/>
          <line x1="-8" y1="30" x2="8" y2="30" stroke="#475569" stroke-width="2"/>
          <!-- Filament -->
          ${filamentBroken ? `
            <path d="M -8 10 L -4 -6" stroke="${filamentColor}" stroke-width="2.5"/>
            <path d="M 8 10 L 4 -2" stroke="${filamentColor}" stroke-width="2.5"/>
            <text x="0" y="-12" fill="#ef4444" font-size="9" text-anchor="middle" font-weight="700">BROKEN</text>
          ` : `
            <path d="M -8 12 L -4 -4 Q 0 -14 4 -4 L 8 12" fill="none" stroke="${filamentColor}" stroke-width="3" stroke-linecap="round"/>
          `}
          <text x="0" y="50" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">Bulb</text>
        </g>

        <!-- Switch at Bottom -->
        <g transform="translate(230, 220)">
          <circle cx="-30" cy="0" r="5" fill="#22c55e"/>
          <circle cx="30" cy="0" r="5" fill="#22c55e"/>
          ${switchClosed ? `
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/>
          ` : `
            <line x1="-30" y1="0" x2="20" y2="-22" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
          `}
          <text x="0" y="20" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">Switch (${switchClosed ? 'ON' : 'OFF'})</text>
        </g>
      </svg>
    `;

    // Status diagnostics card
    let statusTitle = "Circuit Status: ";
    let statusClass = "status-ok";
    let explanation = "";

    if (!switchClosed) {
      statusTitle += "OPEN CIRCUIT (Switch OFF)";
      statusClass = "status-warn";
      explanation = "Current cannot cross the gap at the open switch. The circuit loop is broken.";
    } else if (filamentBroken) {
      statusTitle += "OPEN CIRCUIT (Fused Bulb)";
      statusClass = "status-error";
      explanation = "The bulb filament is melted/broken. Because current cannot complete the circuit loop, no electrical flow occurs.";
    } else if (reversedCell && cellCount === 2) {
      statusTitle += "ZERO NET VOLTAGE (Opposing Cells)";
      statusClass = "status-error";
      explanation = "The two 1.5 V cells oppose each other (+ to +), giving 1.5 V - 1.5 V = 0 V.";
    } else if (isCurrentFlowing) {
      statusTitle += `CLOSED CIRCUIT (Glow: ${(brightnessRatio * 100).toFixed(0)}%)`;
      statusClass = "status-success";
      explanation = `Current flows smoothly from Positive (+) terminal to Negative (-) terminal through the intact tungsten filament. Output: ${netVoltage.toFixed(1)} V.`;
    }

    readout.innerHTML = `
      <div class="readout-card ${statusClass}">
        <div class="readout-title">${statusTitle}</div>
        <div class="readout-desc">${explanation}</div>
      </div>
    `;
  }

  function renderBatteryCells(count, isReversed) {
    let out = '';
    const startX = 5;
    const spacing = 20;

    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing;
      const reverseThis = isReversed && i === 1;

      if (!reverseThis) {
        // Normal: Long line (+), short thick line (-)
        out += `
          <line x1="${x}" y1="5" x2="${x}" y2="35" stroke="#38bdf8" stroke-width="2.5"/>
          <line x1="${x + 10}" y1="12" x2="${x + 10}" y2="28" stroke="#f43f5e" stroke-width="5"/>
        `;
      } else {
        // Inverted polarity
        out += `
          <line x1="${x}" y1="12" x2="${x}" y2="28" stroke="#f43f5e" stroke-width="5"/>
          <line x1="${x + 10}" y1="5" x2="${x + 10}" y2="35" stroke="#38bdf8" stroke-width="2.5"/>
        `;
      }
    }
    return out;
  }

  // Bind controls
  el.querySelector('#btn-sw-on').addEventListener('click', () => { switchClosed = true; updateBtns(); update(); });
  el.querySelector('#btn-sw-off').addEventListener('click', () => { switchClosed = false; updateBtns(); update(); });

  el.querySelector('#btn-cells-1').addEventListener('click', () => { cellCount = 1; reversedCell = false; updateBtns(); update(); });
  el.querySelector('#btn-cells-2').addEventListener('click', () => { cellCount = 2; updateBtns(); update(); });
  el.querySelector('#btn-cells-3').addEventListener('click', () => { cellCount = 3; updateBtns(); update(); });

  el.querySelector('#btn-toggle-reverse').addEventListener('click', () => {
    reversedCell = !reversedCell;
    updateBtns();
    update();
  });

  el.querySelector('#btn-toggle-filament').addEventListener('click', () => {
    filamentBroken = !filamentBroken;
    updateBtns();
    update();
  });

  function updateBtns() {
    el.querySelector('#btn-sw-on').classList.toggle('active', switchClosed);
    el.querySelector('#btn-sw-off').classList.toggle('active', !switchClosed);

    el.querySelector('#btn-cells-1').classList.toggle('active', cellCount === 1);
    el.querySelector('#btn-cells-2').classList.toggle('active', cellCount === 2);
    el.querySelector('#btn-cells-3').classList.toggle('active', cellCount === 3);

    el.querySelector('#btn-toggle-reverse').innerHTML = reversedCell ? '✔ Reverse Cell Corrected' : '⚠️ Invert 1 Cell Polarity';
    el.querySelector('#btn-toggle-filament').innerHTML = filamentBroken ? '🔧 Repair Bulb Filament' : '💥 Burn / Fuse Filament';
  }

  update();
  return el;
}

// ─────────────────────────────────────────────────────────────
// Experiment 2: Heating Effect & Safety Fuse / MCB Simulator
// ─────────────────────────────────────────────────────────────
function createFuseSim() {
  const el = document.createElement('div');
  el.className = 'sim-box';

  let currentA = 5;
  let fuseBlown = false;
  let mcbTripped = false;
  const FUSE_LIMIT = 8; // Amperes

  el.innerHTML = `
    <div class="sim-grid">
      <div class="sim-stage" id="fuse-stage"></div>

      <div class="sim-panel">
        <h4 class="sim-panel__title">Heating & Fuse Controls</h4>

        <div class="sim-control-group">
          <div style="display: flex; justify-content: space-between;">
            <label>Load Current:</label>
            <strong id="current-label" style="color: var(--accent); font-size: 1.1rem;">5.0 A</strong>
          </div>
          <input type="range" min="1" max="15" step="0.5" value="5" id="slider-current" style="width: 100%; accent-color: var(--accent); margin-top: 0.5rem;"/>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Safety Limit: 8.0 A (Exceeding causes fuse to blow / MCB trip)</span>
        </div>

        <div class="sim-control-group">
          <label>Safety Devices Status:</label>
          <div style="display: flex; gap: 0.5rem; flex-direction: column;">
            <button class="sim-btn outline" id="btn-reset-fuse">
              ${fuseBlown ? '🔄 Replace Blown Fuse Wire' : 'Fuse Wire (Intact)'}
            </button>
            <button class="sim-btn outline" id="btn-reset-mcb">
              ${mcbTripped ? '⚡ Reset Tripped MCB Lever' : 'MCB Switch (Armed)'}
            </button>
          </div>
        </div>

        <div class="sim-readout" id="fuse-readout"></div>
      </div>
    </div>
  `;

  function update() {
    const stage = el.querySelector('#fuse-stage');
    const readout = el.querySelector('#fuse-readout');
    const label = el.querySelector('#current-label');

    label.textContent = `${currentA.toFixed(1)} A`;

    // Check if fuse blows or MCB trips
    if (currentA > FUSE_LIMIT) {
      fuseBlown = true;
      mcbTripped = true;
    }

    const isCurrentActive = !fuseBlown && !mcbTripped;

    // Heating color interpolation based on current
    let wireColor = "#64748b";
    let heatLabel = "Room Temp (Cold)";
    let tempEstimate = 25;

    if (isCurrentActive) {
      tempEstimate = Math.round(25 + Math.pow(currentA, 2) * 5.5);
      if (currentA < 4) {
        wireColor = "#f59e0b";
        heatLabel = "Warm (~80°C)";
      } else if (currentA < 7) {
        wireColor = "#ef4444";
        heatLabel = "Hot Red Glow (~200°C)";
      } else {
        wireColor = "#facc15";
        heatLabel = "Intense Incandescent (~400°C)";
      }
    }

    stage.innerHTML = `
      <svg viewBox="0 0 460 280" class="sim-canvas">
        <!-- Background Appliance Outline (Heater / Iron) -->
        <rect x="230" y="70" width="180" height="150" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="320" y="95" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="700">HEATING APPLIANCE</text>

        <!-- Nichrome Coiled Element inside Appliance -->
        <path d="M 260 120 C 270 110, 270 140, 280 130 C 290 120, 290 150, 300 140 C 310 130, 310 160, 320 150 C 330 140, 330 170, 340 160 C 350 150, 350 180, 360 170" 
              fill="none" stroke="${wireColor}" stroke-width="5" stroke-linecap="round"/>
        <text x="320" y="195" fill="${wireColor}" font-size="11" text-anchor="middle" font-weight="700">
          Nichrome Element: ${isCurrentActive ? `${tempEstimate}°C` : 'OFF'}
        </text>

        <!-- Connecting circuit wires -->
        <path d="M 70 80 L 140 80" stroke="#38bdf8" stroke-width="4" fill="none"/>
        <path d="M 200 80 L 250 80 L 250 120" stroke="#38bdf8" stroke-width="4" fill="none"/>
        <path d="M 370 170 L 390 170 L 390 230 L 70 230 L 70 80" stroke="#38bdf8" stroke-width="4" fill="none"/>

        <!-- Safety Fuse Chamber -->
        <g transform="translate(140, 65)">
          <rect x="0" y="0" width="60" height="30" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
          <text x="30" y="-8" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="600">FUSE (8 A)</text>
          ${fuseBlown ? `
            <!-- Melted Fuse Wire -->
            <path d="M 5 15 L 22 15" stroke="#ef4444" stroke-width="2.5"/>
            <path d="M 38 15 L 55 15" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="30" cy="15" r="4" fill="#f43f5e"/>
            <text x="30" y="22" fill="#ef4444" font-size="8" text-anchor="middle" font-weight="bold">MELTED</text>
          ` : `
            <!-- Intact Fuse Wire -->
            <path d="M 5 15 Q 20 8 30 15 T 55 15" fill="none" stroke="#f43f5e" stroke-width="3"/>
          `}
        </g>

        <!-- MCB representation -->
        <g transform="translate(70, 130)">
          <rect x="-20" y="0" width="40" height="60" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
          <text x="0" y="-8" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="600">MCB</text>
          ${mcbTripped ? `
            <!-- Lever tripped down -->
            <rect x="-6" y="32" width="12" height="18" rx="2" fill="#ef4444"/>
            <text x="0" y="55" fill="#ef4444" font-size="7" text-anchor="middle" font-weight="bold">TRIPPED</text>
          ` : `
            <!-- Lever up -->
            <rect x="-6" y="10" width="12" height="18" rx="2" fill="#22c55e"/>
            <text x="0" y="55" fill="#22c55e" font-size="7" text-anchor="middle" font-weight="bold">ARMED</text>
          `}
        </g>
      </svg>
    `;

    if (fuseBlown) {
      readout.innerHTML = `
        <div class="readout-card status-error">
          <div class="readout-title">⚠️ FUSE MELTED / CIRCUIT TRIPPED!</div>
          <div class="readout-desc">
            Load current reached <strong>${currentA.toFixed(1)} A</strong>, exceeding the 8 A limit! The low-melting-point fuse wire melted instantly to protect the house from an electrical fire.
          </div>
        </div>
      `;
    } else {
      readout.innerHTML = `
        <div class="readout-card status-success">
          <div class="readout-title">JOULE HEATING ACTIVE (H ∝ I² · R · t)</div>
          <div class="readout-desc">
            Current: ${currentA.toFixed(1)} A. Heating status: <strong>${heatLabel}</strong>. Both the Fuse wire and MCB are safely conducting current.
          </div>
        </div>
      `;
    }

    el.querySelector('#btn-reset-fuse').innerHTML = fuseBlown ? '🔄 Replace Blown Fuse Wire' : 'Fuse Wire (Intact)';
    el.querySelector('#btn-reset-mcb').innerHTML = mcbTripped ? '⚡ Reset Tripped MCB Lever' : 'MCB Switch (Armed)';
  }

  el.querySelector('#slider-current').addEventListener('input', (e) => {
    currentA = parseFloat(e.target.value);
    update();
  });

  el.querySelector('#btn-reset-fuse').addEventListener('click', () => {
    fuseBlown = false;
    if (currentA > FUSE_LIMIT) {
      currentA = 5;
      el.querySelector('#slider-current').value = 5;
    }
    update();
  });

  el.querySelector('#btn-reset-mcb').addEventListener('click', () => {
    mcbTripped = false;
    if (currentA > FUSE_LIMIT) {
      currentA = 5;
      el.querySelector('#slider-current').value = 5;
    }
    update();
  });

  update();
  return el;
}

// ─────────────────────────────────────────────────────────────
// Experiment 3: Oersted's Magnetic Compass Deflection
// ─────────────────────────────────────────────────────────────
function createOerstedSim() {
  const el = document.createElement('div');
  el.className = 'sim-box';

  let currentOn = false;
  let reversedDirection = false; // Normal = South to North

  el.innerHTML = `
    <div class="sim-grid">
      <div class="sim-stage" id="oersted-stage"></div>

      <div class="sim-panel">
        <h4 class="sim-panel__title">Oersted Experiment Controls</h4>

        <div class="sim-control-group">
          <label>Electric Circuit State:</label>
          <div class="btn-toggle-group">
            <button class="sim-btn ${currentOn ? 'active' : ''}" id="btn-oersted-on">Current ON</button>
            <button class="sim-btn ${!currentOn ? 'active' : ''}" id="btn-oersted-off">Current OFF</button>
          </div>
        </div>

        <div class="sim-control-group">
          <label>Current Direction:</label>
          <button class="sim-btn outline" id="btn-oersted-reverse">
            ${reversedDirection ? '⇄ Current: North to South' : '⇄ Current: South to North'}
          </button>
        </div>

        <div class="sim-readout" id="oersted-readout"></div>
      </div>
    </div>
  `;

  function update() {
    const stage = el.querySelector('#oersted-stage');
    const readout = el.querySelector('#oersted-readout');

    // Needle deflection angle
    // At rest (OFF): Points North (0 deg)
    // SNOW rule: Current South to North over needle -> North pole deflects West (-40 deg)
    // Reversed (North to South) -> North pole deflects East (+40 deg)
    let needleAngle = 0;
    if (currentOn) {
      needleAngle = reversedDirection ? 42 : -42;
    }

    stage.innerHTML = `
      <svg viewBox="0 0 460 280" class="sim-canvas">
        <!-- Earth compass directions -->
        <text x="230" y="30" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">NORTH (N)</text>
        <text x="230" y="270" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">SOUTH (S)</text>
        <text x="60" y="150" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">WEST (W)</text>
        <text x="400" y="150" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">EAST (E)</text>

        <!-- Magnetic Compass Dial -->
        <g transform="translate(230, 150)">
          <circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#475569" stroke-width="4"/>
          <circle cx="0" cy="0" r="55" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          
          <!-- Dial tick marks -->
          <line x1="0" y1="-55" x2="0" y2="-45" stroke="#94a3b8" stroke-width="2"/>
          <line x1="0" y1="55" x2="0" y2="45" stroke="#94a3b8" stroke-width="2"/>
          <line x1="-55" y1="0" x2="-45" y2="0" stroke="#94a3b8" stroke-width="2"/>
          <line x1="55" y1="0" x2="45" y2="0" stroke="#94a3b8" stroke-width="2"/>

          <!-- Magnetic Needle (Rotates with needleAngle) -->
          <g transform="rotate(${needleAngle})" style="transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <!-- North Pole (Red) -->
            <polygon points="0,-48 -7,0 7,0" fill="#f43f5e" />
            <text x="0" y="-20" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">N</text>

            <!-- South Pole (Blue) -->
            <polygon points="0,48 -7,0 7,0" fill="#38bdf8" />
            <text x="0" y="30" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">S</text>

            <circle cx="0" cy="0" r="5" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
          </g>
        </g>

        <!-- Conducting Wire stretched right ABOVE the compass -->
        <line x1="230" y1="40" x2="230" y2="250" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
        
        <!-- Direction arrows along wire if current is ON -->
        ${currentOn ? `
          <g fill="#f59e0b">
            ${reversedDirection ? `
              <!-- Pointing South (Downwards) -->
              <polygon points="230,110 224,95 236,95" />
              <polygon points="230,210 224,195 236,195" />
              <text x="250" y="105" fill="#f59e0b" font-size="10" font-weight="bold">Current ↓</text>
            ` : `
              <!-- Pointing North (Upwards) -->
              <polygon points="230,90 224,105 236,105" />
              <polygon points="230,190 224,205 236,205" />
              <text x="250" y="105" fill="#f59e0b" font-size="10" font-weight="bold">Current ↑</text>
            `}
          </g>
        ` : ''}
      </svg>
    `;

    if (!currentOn) {
      readout.innerHTML = `
        <div class="readout-card status-warn">
          <div class="readout-title">Current is OFF: Compass Points North</div>
          <div class="readout-desc">
            With no electric current flowing, the compass needle is governed exclusively by Earth's natural magnetic field.
          </div>
        </div>
      `;
    } else {
      const dirText = reversedDirection ? "East (+42°)" : "West (-42°)";
      readout.innerHTML = `
        <div class="readout-card status-success">
          <div class="readout-title">Oersted Deflection: Needle Swings ${dirText}</div>
          <div class="readout-desc">
            Hans Christian Oersted (1820): Electric current generates a circular magnetic field around the wire, exerting magnetic torque that deflects the compass!
          </div>
        </div>
      `;
    }

    el.querySelector('#btn-oersted-on').classList.toggle('active', currentOn);
    el.querySelector('#btn-oersted-off').classList.toggle('active', !currentOn);
    el.querySelector('#btn-oersted-reverse').textContent = reversedDirection ? '⇄ Current: North to South' : '⇄ Current: South to North';
  }

  el.querySelector('#btn-oersted-on').addEventListener('click', () => { currentOn = true; update(); });
  el.querySelector('#btn-oersted-off').addEventListener('click', () => { currentOn = false; update(); });
  el.querySelector('#btn-oersted-reverse').addEventListener('click', () => {
    reversedDirection = !reversedDirection;
    update();
  });

  update();
  return el;
}

// ─────────────────────────────────────────────────────────────
// Experiment 4: Electromagnet & Paperclip Picker
// ─────────────────────────────────────────────────────────────
function createElectromagnetSim() {
  const el = document.createElement('div');
  el.className = 'sim-box';

  let powerOn = true;
  let turns = 30; // 10 to 60
  let currentA = 2; // 1 to 4
  let coreType = 'iron'; // 'iron' or 'wood'

  el.innerHTML = `
    <div class="sim-grid">
      <div class="sim-stage" id="magnet-stage"></div>

      <div class="sim-panel">
        <h4 class="sim-panel__title">Electromagnet Parameters</h4>

        <div class="sim-control-group">
          <label>Power Switch:</label>
          <div class="btn-toggle-group">
            <button class="sim-btn ${powerOn ? 'active' : ''}" id="btn-mag-on">POWER ON</button>
            <button class="sim-btn ${!powerOn ? 'active' : ''}" id="btn-mag-off">POWER OFF</button>
          </div>
        </div>

        <div class="sim-control-group">
          <div style="display: flex; justify-content: space-between;">
            <label>Coil Wire Turns:</label>
            <strong id="turns-label" style="color: var(--accent);">${turns} Turns</strong>
          </div>
          <input type="range" min="10" max="60" step="10" value="${turns}" id="slider-turns" style="width: 100%; accent-color: var(--accent); margin-top: 0.5rem;"/>
        </div>

        <div class="sim-control-group">
          <div style="display: flex; justify-content: space-between;">
            <label>Current Strength:</label>
            <strong id="current-mag-label" style="color: var(--accent);">${currentA} A</strong>
          </div>
          <input type="range" min="1" max="4" step="1" value="${currentA}" id="slider-mag-current" style="width: 100%; accent-color: var(--accent); margin-top: 0.5rem;"/>
        </div>

        <div class="sim-control-group">
          <label>Core Material:</label>
          <div class="btn-toggle-group">
            <button class="sim-btn ${coreType === 'iron' ? 'active' : ''}" id="btn-core-iron">Soft Iron Core</button>
            <button class="sim-btn ${coreType === 'wood' ? 'active' : ''}" id="btn-core-wood">Wood Core (No Iron)</button>
          </div>
        </div>

        <div class="sim-readout" id="magnet-readout"></div>
      </div>
    </div>
  `;

  function update() {
    const stage = el.querySelector('#magnet-stage');
    const readout = el.querySelector('#magnet-readout');

    el.querySelector('#turns-label').textContent = `${turns} Turns`;
    el.querySelector('#current-mag-label').textContent = `${currentA} A`;

    // Calculate attracted clips
    let clipCount = 0;
    if (powerOn) {
      const coreMultiplier = coreType === 'iron' ? 1.0 : 0.05;
      clipCount = Math.floor((turns * currentA * coreMultiplier) / 12);
    }

    stage.innerHTML = `
      <svg viewBox="0 0 460 280" class="sim-canvas">
        <!-- Magnetic Field Rings if ON -->
        ${powerOn && coreType === 'iron' ? `
          <ellipse cx="230" cy="110" rx="140" ry="70" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="2" stroke-dasharray="6 6"/>
          <ellipse cx="230" cy="110" rx="170" ry="90" fill="none" stroke="rgba(56, 189, 248, 0.1)" stroke-width="1.5" stroke-dasharray="8 8"/>
        ` : ''}

        <!-- Iron Nail / Core -->
        <g transform="translate(140, 95)">
          <rect x="0" y="0" width="180" height="28" rx="4" fill="${coreType === 'iron' ? '#475569' : '#b45309'}" stroke="#334155" stroke-width="2"/>
          <!-- Nail head -->
          <polygon points="0,-8 0,36 -12,28 -12,0" fill="${coreType === 'iron' ? '#334155' : '#78350f'}"/>
          <!-- Nail point -->
          <polygon points="180,0 205,14 180,28" fill="${coreType === 'iron' ? '#64748b' : '#d97706'}"/>
        </g>

        <!-- Wire windings around nail -->
        ${renderCoilWindings(turns, powerOn)}

        <!-- Paperclips -->
        <g id="clips-group">
          ${renderClips(clipCount, powerOn)}
        </g>
      </svg>
    `;

    if (!powerOn) {
      readout.innerHTML = `
        <div class="readout-card status-warn">
          <div class="readout-title">Power OFF: Magnetism Instantly Drops to Zero</div>
          <div class="readout-desc">
            Soft iron core immediately demagnetizes. All paper clips fall off because electromagnets are temporary magnets!
          </div>
        </div>
      `;
    } else if (coreType === 'wood') {
      readout.innerHTML = `
        <div class="readout-card status-warn">
          <div class="readout-title">Non-Magnetic Core (Wood)</div>
          <div class="readout-desc">
            Without a ferromagnetic soft iron core to concentrate magnetic flux lines, the coil cannot generate enough force to lift heavy paper clips.
          </div>
        </div>
      `;
    } else {
      readout.innerHTML = `
        <div class="readout-card status-success">
          <div class="readout-title">Electromagnet Active: Attracted ${clipCount} Paperclips!</div>
          <div class="readout-desc">
            Magnetic strength increases with <strong>more coil turns (${turns})</strong>, <strong>higher current (${currentA} A)</strong>, and a <strong>soft iron core</strong>.
          </div>
        </div>
      `;
    }

    el.querySelector('#btn-mag-on').classList.toggle('active', powerOn);
    el.querySelector('#btn-mag-off').classList.toggle('active', !powerOn);
    el.querySelector('#btn-core-iron').classList.toggle('active', coreType === 'iron');
    el.querySelector('#btn-core-wood').classList.toggle('active', coreType === 'wood');
  }

  function renderCoilWindings(turnsCount, isPowerOn) {
    const numVisibleCoils = Math.min(22, Math.floor(turnsCount / 2.5));
    let out = '';
    const startX = 160;
    const spacing = 120 / numVisibleCoils;
    const wireStroke = isPowerOn ? '#f59e0b' : '#b45309';

    for (let i = 0; i < numVisibleCoils; i++) {
      const x = startX + i * spacing;
      out += `
        <path d="M ${x} 90 Q ${x + 6} 80 ${x + 8} 108 T ${x + 12} 128" fill="none" stroke="${wireStroke}" stroke-width="4.5" stroke-linecap="round"/>
      `;
    }
    return out;
  }

  function renderClips(count, isPowerOn) {
    let out = '';
    if (count === 0) {
      // Fallen paperclips resting at table bottom
      out = `
        <g opacity="0.6">
          <rect x="290" y="240" width="22" height="8" rx="4" fill="none" stroke="#94a3b8" stroke-width="2" transform="rotate(15 290 240)"/>
          <rect x="320" y="245" width="22" height="8" rx="4" fill="none" stroke="#94a3b8" stroke-width="2" transform="rotate(-20 320 245)"/>
          <rect x="345" y="242" width="22" height="8" rx="4" fill="none" stroke="#94a3b8" stroke-width="2"/>
          <text x="320" y="265" fill="#64748b" font-size="9" text-anchor="middle">Clips Fallen to Base</text>
        </g>
      `;
      return out;
    }

    // Attracted clips hanging from tip of nail (X: ~345, Y: ~110)
    for (let i = 0; i < count; i++) {
      const angle = (i % 2 === 0 ? 1 : -1) * (15 + (i * 12) % 35);
      const cx = 345 + (i % 3) * 6;
      const cy = 115 + (i * 10);
      out += `
        <g transform="rotate(${angle} ${cx} ${cy})">
          <rect x="${cx}" y="${cy}" width="24" height="9" rx="4.5" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
        </g>
      `;
    }
    return out;
  }

  el.querySelector('#btn-mag-on').addEventListener('click', () => { powerOn = true; update(); });
  el.querySelector('#btn-mag-off').addEventListener('click', () => { powerOn = false; update(); });
  el.querySelector('#slider-turns').addEventListener('input', (e) => { turns = parseInt(e.target.value); update(); });
  el.querySelector('#slider-mag-current').addEventListener('input', (e) => { currentA = parseInt(e.target.value); update(); });
  el.querySelector('#btn-core-iron').addEventListener('click', () => { coreType = 'iron'; update(); });
  el.querySelector('#btn-core-wood').addEventListener('click', () => { coreType = 'wood'; update(); });

  update();
  return el;
}

// ─────────────────────────────────────────────────────────────
// Experiment 5: Electric Bell Mechanism
// ─────────────────────────────────────────────────────────────
function createBellSim() {
  const el = document.createElement('div');
  el.className = 'sim-box';

  let currentStep = 0; // 0 = resting, 1 = switch pressed & coil magnetizes, 2 = hammer strikes gong & contact breaks, 3 = coil off & spring pulls back
  let isRingingLoop = false;
  let loopTimer = null;

  const steps = [
    {
      title: "Step 1: Circuit Resting (Switch Open)",
      desc: "No current flows. The spring holds the iron armature firmly in contact with the tip of the contact screw."
    },
    {
      title: "Step 2: Switch Pressed -> Coil Becomes Electromagnet",
      desc: "Circuit closes through the contact screw. Current energizes the electromagnet, which attracts the soft iron armature."
    },
    {
      title: "Step 3: Hammer Strikes Gong & Contact Breaks!",
      desc: "The hammer attached to the armature strikes the metallic gong with a loud chime. In doing so, it pulls away from the contact screw, opening the circuit!"
    },
    {
      title: "Step 4: Electromagnet Demagnetizes & Spring Returns",
      desc: "With current cut off, the electromagnet loses magnetism. The spring snaps the armature back to touch the contact screw, restarting the sequence."
    }
  ];

  el.innerHTML = `
    <div class="sim-grid">
      <div class="sim-stage" id="bell-stage"></div>

      <div class="sim-panel">
        <h4 class="sim-panel__title">Electric Bell Explorer</h4>

        <div class="sim-control-group">
          <label>Operating Modes:</label>
          <div class="btn-toggle-group">
            <button class="sim-btn" id="btn-bell-step">➜ Step Forward</button>
            <button class="sim-btn" id="btn-bell-auto">🔔 Continuous Ring</button>
          </div>
        </div>

        <div class="sim-readout" id="bell-readout"></div>
      </div>
    </div>
  `;

  function update() {
    const stage = el.querySelector('#bell-stage');
    const readout = el.querySelector('#bell-readout');

    const isAttracted = currentStep === 2; // Armature pulled toward magnet
    const isContactTouching = currentStep === 0 || currentStep === 1 || currentStep === 3;
    const isMagnetized = currentStep === 1;
    const isGongHit = currentStep === 2;

    stage.innerHTML = `
      <svg viewBox="0 0 460 280" class="sim-canvas">
        <!-- Brass Gong Dome -->
        <g transform="translate(360, 140)">
          <!-- Gong bowl -->
          <path d="M 0 -60 C 40 -40, 40 40, 0 60 Z" fill="#eab308" stroke="#ca8a04" stroke-width="3"/>
          <circle cx="0" cy="0" r="10" fill="#a16207"/>
          <text x="35" y="5" fill="#eab308" font-size="11" font-weight="bold">Gong</text>
          ${isGongHit ? `
            <!-- Sound waves -->
            <path d="M 25 -30 Q 40 -15 25 0" fill="none" stroke="#facc15" stroke-width="2.5"/>
            <path d="M 35 -40 Q 55 -20 35 10" fill="none" stroke="#facc15" stroke-width="2"/>
            <text x="25" y="-45" fill="#facc15" font-size="12" font-weight="900">DING!</text>
          ` : ''}
        </g>

        <!-- Electromagnet U-core -->
        <g transform="translate(180, 90)">
          <!-- Iron core -->
          <path d="M 0 0 L 50 0 L 50 100 L 0 100" fill="none" stroke="#475569" stroke-width="18" stroke-linejoin="round"/>
          <!-- Coil windings -->
          <rect x="5" y="-8" width="40" height="16" fill="${isMagnetized ? '#f59e0b' : '#334155'}" rx="3"/>
          <rect x="5" y="92" width="40" height="16" fill="${isMagnetized ? '#f59e0b' : '#334155'}" rx="3"/>
          <text x="25" y="55" fill="#94a3b8" font-size="9" text-anchor="middle" font-weight="600">Electromagnet</text>
        </g>

        <!-- Armature, Hammer & Spring -->
        <g transform="translate(${isAttracted ? 250 : 265}, 140)" style="transition: transform 0.15s ease-out;">
          <!-- Soft Iron Armature -->
          <rect x="0" y="-45" width="10" height="90" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
          <!-- Hammer Rod & Ball -->
          <line x1="5" y1="0" x2="${isAttracted ? 110 : 80}" y2="0" stroke="#cbd5e1" stroke-width="3.5"/>
          <circle cx="${isAttracted ? 110 : 80}" cy="0" r="10" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
          <text x="5" y="-52" fill="#94a3b8" font-size="9" text-anchor="middle">Armature</text>
        </g>

        <!-- Contact Screw at Left of Armature -->
        <g transform="translate(245, 140)">
          <line x1="-30" y1="0" x2="0" y2="0" stroke="#f59e0b" stroke-width="4"/>
          <circle cx="0" cy="0" r="4" fill="${isContactTouching ? '#22c55e' : '#ef4444'}"/>
          <text x="-15" y="-8" fill="#94a3b8" font-size="8" text-anchor="middle">Contact Screw</text>
          ${!isContactTouching ? `
            <text x="12" y="20" fill="#ef4444" font-size="8" font-weight="bold">GAP OPEN!</text>
          ` : ''}
        </g>

        <!-- Circuit Wires -->
        <path d="M 60 70 L 180 70" stroke="#38bdf8" stroke-width="3" fill="none"/>
        <path d="M 60 210 L 215 210 L 215 140" stroke="#38bdf8" stroke-width="3" fill="none"/>
        
        <!-- Push Button Switch -->
        <g transform="translate(60, 140)">
          <circle cx="0" cy="0" r="12" fill="${currentStep > 0 ? '#22c55e' : '#0f172a'}" stroke="#38bdf8" stroke-width="2"/>
          <text x="0" y="25" fill="#94a3b8" font-size="8" text-anchor="middle">Push Switch</text>
        </g>
      </svg>
    `;

    const info = steps[currentStep];
    readout.innerHTML = `
      <div class="readout-card ${currentStep === 2 ? 'status-success' : 'status-ok'}">
        <div class="readout-title">${info.title}</div>
        <div class="readout-desc">${info.desc}</div>
      </div>
    `;
  }

  el.querySelector('#btn-bell-step').addEventListener('click', () => {
    stopAuto();
    currentStep = (currentStep + 1) % steps.length;
    update();
  });

  const autoBtn = el.querySelector('#btn-bell-auto');
  function stopAuto() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
    isRingingLoop = false;
    autoBtn.textContent = '🔔 Continuous Ring';
  }

  autoBtn.addEventListener('click', () => {
    if (isRingingLoop) {
      stopAuto();
      currentStep = 0;
      update();
    } else {
      isRingingLoop = true;
      autoBtn.textContent = '⏹ Stop Ringing';
      loopTimer = setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        update();
      }, 350);
    }
  });

  update();
  return el;
}
