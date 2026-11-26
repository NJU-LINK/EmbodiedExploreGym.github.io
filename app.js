'use strict';

/* ==========================================================================
   0. Paper / arXiv Release Switch
   Set ARXIV_URL (e.g. 'https://arxiv.org/abs/2611.XXXXX') once published
   to automatically activate every Paper / arXiv button across the page.
   ========================================================================== */

const ARXIV_URL = '';

document.querySelectorAll('[data-paper-link]').forEach(el => {
  if (ARXIV_URL) {
    el.href = ARXIV_URL;
    el.target = '_blank';
    el.rel = 'noopener';
    el.removeAttribute('aria-disabled');
    el.removeAttribute('title');
    el.classList.remove('pending', 'pending-inline', 'footer-pending');
    if (el.classList.contains('cta-pill')) el.classList.add('primary');
    const textSpan = el.querySelector('.paper-link-text');
    if (textSpan && el.dataset.liveLabel) textSpan.textContent = el.dataset.liveLabel;
    el.querySelectorAll('.soon-badge, .pill-meta.soon').forEach(b => b.remove());
  } else {
    el.addEventListener('click', e => e.preventDefault());
  }
});

/* ==========================================================================
   1. Benchmark Data (Paper Tables 2, 3, 4, S1, S2, S4, S6, S7 & Appendix D)
   ========================================================================== */

const MODELS = [
  { name: 'Gemini-4-Argon', license: 'closed', sr: [59.38, 56.52, 73.63, 79.63, 63.46, 67.43], scr: [61.72, 81.14, 83.74, 92.53, 75.47, 78.91], inK: 3144.04, outK: 30.44 },
  { name: 'GPT-6.1-Sol', license: 'closed', sr: [50.00, 58.70, 68.13, 79.63, 59.62, 63.52], scr: [54.06, 78.22, 77.55, 89.01, 73.59, 74.10], inK: 1034.73, outK: 1.96 },
  { name: 'Claude-Opus-5.5', license: 'closed', sr: [59.38, 52.17, 71.43, 79.63, 40.38, 62.21], scr: [63.75, 74.46, 80.46, 93.02, 71.48, 76.76], inK: 1347.43, outK: 6.62 },
  { name: 'GPT-6-Astra', license: 'closed', sr: [45.31, 50.00, 72.53, 79.63, 46.15, 60.26], scr: [46.25, 70.54, 77.07, 88.40, 68.81, 70.26], inK: 910.83, outK: 1.80 },
  { name: 'Claude-Sonnet-5.5', license: 'closed', sr: [53.13, 52.17, 63.74, 74.07, 44.23, 58.31], scr: [59.42, 75.04, 78.02, 91.94, 71.78, 75.09], inK: 2009.96, outK: 11.67 },
  { name: 'GPT-6-Sol', license: 'closed', sr: [48.44, 50.00, 59.34, 72.22, 28.85, 52.77], scr: [53.79, 69.20, 73.97, 86.17, 64.24, 69.55], inK: 1628.71, outK: 3.32 },
  { name: 'Qwen3.8-Max', license: 'open', sr: [45.31, 45.65, 61.54, 70.37, 34.62, 52.77], scr: [47.86, 69.17, 72.58, 86.31, 58.86, 67.01], inK: 1423.05, outK: 91.06 },
  { name: 'Gemini-3.8-Flash', license: 'closed', sr: [42.19, 43.48, 57.14, 74.07, 36.54, 51.47], scr: [48.13, 67.17, 70.64, 90.12, 60.76, 67.18], inK: 3995.22, outK: 14.26 },
  { name: 'GPT-5.6-Sol', license: 'closed', sr: [45.31, 45.65, 57.14, 68.52, 17.31, 48.21], scr: [52.46, 66.52, 71.14, 84.96, 55.41, 66.32], inK: 1632.79, outK: 4.89 },
  { name: 'Kimi-K3', license: 'open', sr: [35.94, 39.13, 53.85, 61.11, 17.31, 43.00], scr: [42.95, 53.49, 69.25, 84.36, 46.71, 60.24], inK: 2239.80, outK: 7.14 },
  { name: 'DeepSeek-V4.1-Flash', license: 'open', sr: [39.06, 41.30, 48.35, 66.67, 11.54, 42.35], scr: [44.96, 60.80, 67.12, 87.51, 43.83, 61.19], inK: 2327.37, outK: 40.32 },
  { name: 'GPT-6-Luna', license: 'closed', sr: [23.44, 19.57, 14.29, 11.11, 0.00, 14.01], scr: [33.71, 37.50, 36.83, 54.45, 26.03, 37.55], inK: 975.02, outK: 1.19 }
];

const CATEGORIES = {
  vss: {
    code: 'VSS',
    label: 'Visual Grounding & Candidate Discrimination',
    name: 'Visual Search & Selection',
    count: 64,
    bestSr: '59.38%',
    bestScr: '63.75%',
    description: 'Identify designated people or select qualifying candidates across multiple locations using fine-grained visual attributes, spatial relations, and contextual clues.',
    families: [
      { name: 'NPC Search', count: 40, desc: 'Locate a designated person from appearance, role, or landmark cues and acquire requested facts via dialogue.' },
      { name: 'Comparative Selection', count: 24, desc: 'Inspect multiple candidate areas or objects across rooms and apply multi-stage selection criteria.' }
    ],
    sampleTask: 'Task 001 (Command Center): Compare three work areas across Control Rooms 1 and 2—first filter by full-size seating facing the desk, then select the candidate with a warm-colored surface and justify each exclusion.'
  },
  sare: {
    code: 'SARE',
    label: 'Ordered Routing & Physical Access',
    name: 'Spatial Action & Route Execution',
    count: 46,
    bestSr: '58.70%',
    bestScr: '81.14%',
    description: 'Execute movements satisfying explicit itineraries, ordering dependencies, forbidden-zone constraints, and indoor–outdoor doorway traversals.',
    families: [
      { name: 'Multi-Stage Route', count: 24, desc: 'Acquire an itinerary, visit destinations in strict temporal order, and complete local interactions.' },
      { name: 'Constraint Route', count: 11, desc: 'Identify valid inspection stations from visual clues, register them in order, and avoid forbidden stations.' },
      { name: 'Door Traversal', count: 11, desc: 'Locate and traverse paired indoor–outdoor doorways to reach restricted rooms and return.' }
    ],
    sampleTask: 'Task 114 (Industrial Area): Locate the marked workshop entrance from the outdoor road, cross through the paired doorway to inspect interior equipment, and return outside to complete handoff.'
  },
  igc: {
    code: 'IGC',
    label: 'Multi-Source Evidence & Targeted Reporting',
    name: 'Information Gathering & Communication',
    count: 91,
    bestSr: '73.63%',
    bestScr: '83.74%',
    description: 'Acquire complementary facts through exploration and NPC dialogue, synthesize distributed records, and deliver complete reports to the verified recipient.',
    families: [
      { name: 'Deliver Report', count: 28, desc: 'Obtain an inspection checklist from an NPC, examine target facilities, and report findings to the recipient.' },
      { name: 'Dialogue Handoff', count: 33, desc: 'Receive a message or simulated item via dialogue and convey all required attributes to another person.' },
      { name: 'Distributed Information', count: 30, desc: 'Collect partial records from multiple NPCs across the map and combine them under task constraints.' }
    ],
    sampleTask: 'Task 058 (Hospital): Obtain the operating room inspection brief from medical staff, verify the operating table pad color and surgical light count, and report both facts to the designated nurse.'
  },
  ira: {
    code: 'IRA',
    label: 'Dynamic Rules & Plan Revision',
    name: 'Instruction Reasoning & Adaptation',
    count: 54,
    bestSr: '79.63%',
    bestScr: '93.02%',
    description: 'Select the active execution branch based on observed scene states or update an ongoing plan mid-episode when an NPC revises prior instructions.',
    families: [
      { name: 'Conditional Instruction', count: 29, desc: 'Evaluate observed environmental facts against acquired rules to choose the right recipient or action branch.' },
      { name: 'Instruction Revision', count: 25, desc: 'Adapt to updated mid-task instructions while preserving earlier requirements that remain unchanged.' }
    ],
    sampleTask: 'Figure 1 Example (Industrial Area): Compare supporting surfaces of two indoor fire extinguishers—if identical, report to the woman by the forklift; if different (gray door vs. green wall), report to the man at the entrance.'
  },
  mst: {
    code: 'MST',
    label: 'Long-Horizon Episodic & Spatial Memory',
    name: 'Memory & State Tracking',
    count: 52,
    bestSr: '63.46%',
    bestScr: '75.47%',
    description: 'Retain precise bindings between multiple inspected locations and object attributes, or navigate back to a previously visited spot without teleportation shortcuts.',
    families: [
      { name: 'State Tracking', count: 40, desc: 'Inspect multiple objects across rooms, preserve location-to-attribute correspondence, and compile an exact record.' },
      { name: 'Spatial Memory Return', count: 12, desc: 'Remember an earlier location from ego visual cues and navigate back after intervening activities (go_to disabled).' }
    ],
    sampleTask: 'Task 277 (Supermarket): Collect both seating and checkout inspection checklists, track exact facility counts across aisles, and deliver a unified structured record without omitting earlier observations.'
  }
};

const TOOL_GROUPS = {
  nav: [
    { fn: 'navigate_to_segmented_target', tag: 'SAM2.1 + Depth', title: 'Visual Target Approach', desc: 'Takes a normalized 2D box [x0, y0, x1, y1] and stop distance (50–500 cm). Segments target via SAM2.1, filters depth clusters, and follows a UE NavMesh path.', feedback: '3D surface localization, path displacement, and arrival status.' },
    { fn: 'go_to(point)', tag: 'Semantic Nav', title: 'Semantic Waypoint Travel', desc: 'Travels to a task-visible semantic anchor by teleportation or continuous UE NavMesh movement depending on task constraints (disabled in Spatial Memory Return).', feedback: 'Movement outcome and settled world pose (x, y, z, yaw).' },
    { fn: 'navigate_forward(distance_cm)', tag: 'NavMesh', title: 'Continuous Ego Advance', desc: 'Projects a destination along the current viewing heading (default 1200 cm) and navigates via UE NavMesh with automatic lateral obstacle detouring.', feedback: 'Actual displacement, remaining distance, and 10 s settling check.' }
  ],
  view: [
    { fn: 'turn_left / turn_right / set_yaw', tag: 'Heading', title: 'Relative Yaw Rotation', desc: 'Rotates the agent in place while keeping spatial coordinates fixed; repeated rotations accumulate accurately for directional alignment.', feedback: 'Rotation confirmation and updated compass yaw in degrees.' },
    { fn: 'look_left / right / back / forward', tag: 'Reference View', title: 'Stored-Reference Inspection', desc: 'Faces ±90° or 180° relative to a stored forward heading refreshed after movement, enabling quick side glances without losing path orientation.', feedback: 'Updated heading and new first-person RGB frame.' },
    { fn: 'adjust_view / reset_view', tag: 'Camera Pitch', title: 'Vertical Pitch Control', desc: 'Tilts ego camera between −89° and +89° to inspect floor thresholds, stairs, or overhead signs/lights, or restores level 0° horizontal gaze.', feedback: 'Current pitch angle and refreshed ego RGB observation.' }
  ],
  obs: [
    { fn: 'observe_sweep(query)', tag: '8-View Panorama', title: '360° In-Place Visual Sweep', desc: 'Captures 8 directional ego screenshots (front, front-left, left, back-left, back, back-right, right, front-right) and restores original heading.', feedback: '8 direction-labeled RGB frames appended to visual context.' },
    { fn: 'get_pos()', tag: 'Spatial State', title: 'Ego Pose & Nearby Anchors', desc: 'Queries current world coordinates, orientation, and horizontal distances to up to six nearest task-visible semantic points.', feedback: 'Current pose (x, y, z, yaw) and sorted anchor distance table.' },
    { fn: 'get_target_pos(point)', tag: 'Ablation Only', title: 'Target Coordinate Lookup', desc: 'Returns world [x, y, z] coordinates of a known semantic point while keeping agent pose fixed; enabled specifically in the w/o Go-To ablation.', feedback: 'Exact 3D target coordinates or unavailable-point error.' }
  ],
  npc: [
    { fn: 'talk_to_npc(message, target)', tag: 'Dialogue', title: 'Task-Oriented NPC Inquiry', desc: 'Initiates conversation with a nearby virtual character after verifying horizontal interaction range and floor-height compatibility.', feedback: 'Actual reached NPC identity and scripted contextual reply.' },
    { fn: 'report_to_npc(message, target)', tag: 'Delivery', title: 'Structured Report Handoff', desc: 'Delivers inspection findings, conditional decisions, or relayed items to a designated NPC under strict spatial proximity checks.', feedback: 'Receipt acknowledgment (content scored offline by rubric judge).' },
    { fn: 'Proximity & Identity Gate', tag: 'Anti-Hallucination', title: 'Verified Recipient Binding', desc: 'The simulator logs the actual responding NPC ID rather than the agent’s intended target string—preventing false credit when reporting to the wrong person.', feedback: 'Deterministic source/recipient verification in trace log.' }
  ],
  door: [
    { fn: 'open_door() / cross_nearby_door()', tag: 'Cross I/O', title: 'Indoor–Outdoor Doorway Traversal', desc: 'Interacts with hinged doors or transfers across annotated indoor–outdoor doorway endpoints when within activation distance.', feedback: 'Door state visual update and opposite-endpoint pose verification.' },
    { fn: 'confirm_station(station)', tag: 'Route Check', title: 'Formal Station Registration', desc: 'Formally logs arrival at a named inspection station once settled; first formal confirmation governs strict route-ordering constraints.', feedback: 'Recorded station claim, actual 3D pose, and timestamp.' },
    { fn: 'finish_task(summary)', tag: 'Termination', title: 'Episode Completion & Final Answer', desc: 'Submits the final consolidated answer or execution summary and terminates the episode within the 100-round interaction budget.', feedback: 'Recorded final declaration passed to deterministic + LLM evaluator.' }
  ]
};

const SCENES = [
  { name: 'Modular Building', count: 37, env: 'Cross I/O', demoId: '124', poster: 'assets/demos/124.jpg', desc: 'Urban brick street grid with storefronts, crosswalks, covered benches, and accessible building interiors.' },
  { name: 'Downtown West', count: 36, env: 'Outdoor District', demoId: '022', poster: 'assets/demos/022.jpg', desc: 'Commercial pedestrian avenues with outdoor cafés, advertising columns, public seating, and a footbridge.' },
  { name: 'Hospital', count: 34, env: 'Indoor Facility', demoId: '058', poster: 'assets/demos/058.jpg', desc: 'Connected clinical corridors, operating room, offices, patient beds, wheelchairs, and medical equipment.' },
  { name: 'Supermarket', count: 33, env: 'Cross I/O', demoId: '277', poster: 'assets/demos/277.jpg', desc: 'Retail aisles, checkout counters, storage rooms, entrance hall, and adjacent outdoor parking lot.' },
  { name: 'Hotel Corridor', count: 30, env: 'Indoor Facility', demoId: '089', poster: 'assets/demos/089.jpg', desc: 'Symmetric guest-room hallways linking elevator lobbies and lounges with luggage and service carts.' },
  { name: 'Industrial Area', count: 28, env: 'Cross I/O', demoId: '114', poster: 'assets/demos/114.jpg', desc: 'Container yard and factory roads connected to indoor workshops, storage rooms, and interior stairways.' },
  { name: 'Post-Soviet Village', count: 27, env: 'Cross I/O', demoId: '169', poster: 'assets/demos/169.jpg', desc: 'Snowy residential roads, fenced courtyards, an indoor village kiosk, benches, and mailboxes.' },
  { name: 'Museum', count: 26, env: 'Multi-Level Indoor', demoId: '152', poster: 'assets/demos/152.jpg', desc: 'Multi-floor exhibition galleries connected by grand staircases with paintings, sculptures, and columns.' },
  { name: 'Command Center', count: 24, env: 'Indoor Facility', demoId: '002', poster: 'assets/demos/002.jpg', desc: 'Interconnected control rooms with curved consoles, display walls, and raised observation platforms.' },
  { name: 'University Classroom', count: 19, env: 'Indoor Facility', demoId: '221', poster: 'assets/demos/221.jpg', desc: 'Tiered lecture hall with stepped seating rows, podium, boards, and personal items across desks.' },
  { name: 'Forest Gas Station', count: 13, env: 'Cross I/O', demoId: '045', poster: 'assets/demos/045.jpg', desc: 'Woodland fuel station combining dispensers, convenience café, repair bay, and surrounding grounds.' }
];

const RADAR_MODELS = [
  { name: 'Gemini-4-Argon', color: '#D97236', active: true, scores: [59.38, 56.52, 73.63, 79.63, 63.46] },
  { name: 'GPT-6.1-Sol', color: '#1E5A6A', active: true, scores: [50.00, 58.70, 68.13, 79.63, 59.62] },
  { name: 'Claude-Opus-5.5', color: '#6E5A9E', active: true, scores: [59.38, 52.17, 71.43, 79.63, 40.38] },
  { name: 'Qwen3.8-Max', color: '#266450', active: true, scores: [45.31, 45.65, 61.54, 70.37, 34.62] },
  { name: 'Kimi-K3', color: '#8A7B52', active: false, scores: [35.94, 39.13, 53.85, 61.11, 17.31] },
  { name: 'DeepSeek-V4.1-Flash', color: '#B5546E', active: false, scores: [39.06, 41.30, 48.35, 66.67, 11.54] }
];

const ABLATIONS = {
  map: {
    title: 'Global Semantic Map Prior (+20.19% SR on GPT-6-Sol)',
    desc: 'Providing the complete global semantic map upfront dramatically boosts task success and slashes decision rounds—demonstrating that <strong>active exploration and spatial discovery</strong> account for a major share of benchmark difficulty (Table 3).',
    rows: [
      { label: 'GPT-6-Sol · Default Map', stat: '52.77% SR · 53.73 rounds', width: 52.77, cls: '' },
      { label: 'GPT-6-Sol · Full Global Map', stat: '72.96% SR · 35.17 rounds', width: 72.96, cls: 'accent' },
      { label: 'GPT-6-Luna · Default Map', stat: '14.01% SR · 37.53 rounds', width: 14.01, cls: '' },
      { label: 'GPT-6-Luna · Full Global Map', stat: '19.22% SR · 30.28 rounds', width: 19.22, cls: 'accent' }
    ]
  },
  tools: {
    title: 'Encapsulated Navigation Tools Reduce Execution Burden',
    desc: 'Disabling <strong>Visual Approach (w/o VA)</strong> or <strong>Go To (w/o GT)</strong> lowers success rates while inflating decision rounds: GPT-6-Sol drops by <strong>14.98 points</strong> without Go To even when target coordinates are given, proving that extra turns cannot compensate for lost spatial grounding (Figure 6).',
    rows: [
      { label: 'GPT-6-Sol · Default Tools', stat: '52.77% SR · 53.73 rounds', width: 52.77, cls: 'accent' },
      { label: 'GPT-6-Sol · w/o Visual Approach', stat: '51.47% SR · 59.51 rounds', width: 51.47, cls: '' },
      { label: 'GPT-6-Sol · w/o Go To (coords given)', stat: '37.79% SR · 71.79 rounds', width: 37.79, cls: 'warn' },
      { label: 'GPT-6-Luna · Default → w/o Go To', stat: '14.01% → 4.56% SR (63.79 rounds)', width: 14.01, cls: 'warn' }
    ],
    zoomImg: 'assets/figures/figure6-tools.png',
    zoomLabel: 'Enlarge Paper Figure 6 (Tool Ablation Chart)'
  },
  recovery: {
    title: 'Recovering from Explicit NPC Interaction Failures (n = 35)',
    desc: 'On 35 tasks where all six models experience a failed NPC interaction (e.g., out-of-range or height mismatch) before obtaining their first required clue, <strong>Gemini-4-Argon</strong> and <strong>Claude-Opus-5.5</strong> recover in <strong>48.6%</strong> of episodes—more than double Kimi-K3 (22.9%) (Figure 5c).',
    rows: [
      { label: 'Gemini-4-Argon', stat: '17 / 35 recovered (48.6%)', width: 48.6, cls: 'accent' },
      { label: 'Claude-Opus-5.5', stat: '17 / 35 recovered (48.6%)', width: 48.6, cls: 'accent' },
      { label: 'DeepSeek-V4.1-Flash', stat: '11 / 35 recovered (31.4%)', width: 31.4, cls: '' },
      { label: 'GPT-6-Astra & Qwen3.8-Max', stat: '10 / 35 recovered (28.6%)', width: 28.6, cls: '' },
      { label: 'Kimi-K3', stat: '8 / 35 recovered (22.9%)', width: 22.9, cls: 'warn' }
    ]
  },
  resolution: {
    title: 'Higher Input Resolution Is Non-Monotonic (Table 4 & Table S6)',
    desc: 'Increasing ego RGB resolution from <code>480×360</code> to <code>1080×640</code> trims average decision rounds (53.73 → 50.66 on GPT-6-Sol) without monotonically raising SR, as denser visual tokens increase long-history processing load. Even when all NPC replies arrive by Round 40 (n = 105), SR still spans 66.67%–83.81%.',
    rows: [
      { label: 'GPT-6-Sol · 320 × 240', stat: '55.05% SR · 56.06 rounds', width: 55.05, cls: '' },
      { label: 'GPT-6-Sol · 480 × 360 (Default)', stat: '52.77% SR · 53.73 rounds', width: 52.77, cls: 'accent' },
      { label: 'GPT-6-Sol · 1080 × 640', stat: '54.40% SR · 50.66 rounds', width: 54.40, cls: '' },
      { label: 'Post-Acquisition Execution (n=105)', stat: 'GPT-6-Astra 83.81% vs. DeepSeek 66.67%', width: 83.81, cls: 'warn' }
    ]
  }
};

const CASE_STUDIES = {
  c137: {
    brief: '<strong>Task 137 (Modular Building · NPC Search):</strong> Locate the staff member responsible for nighttime inspection and report tonight’s gathering time. Both models start from the exact same street position and hit initial interaction-range errors.',
    dual: [
      {
        model: 'GPT-6-Astra',
        verdict: 'Unfinished',
        pass: false,
        img: 'assets/figures/strip-137-astra.png',
        rounds: ['Round 2', 'Round 7', 'Round 12'],
        steps: [
          { r: 'R2–R6', cls: 'err', text: 'Visual target approach and forward navigation return NavMesh path errors.' },
          { r: 'Round 7', cls: 'err', text: 'Calls talk_to_npc from afar; simulator returns an interaction-range error.' },
          { r: 'Round 12', cls: 'err', text: 'Terminates early: “The task is incomplete; I cannot confirm tonight’s gathering time.”' }
        ]
      },
      {
        model: 'Gemini-4-Argon',
        verdict: 'Completed',
        pass: true,
        img: 'assets/figures/strip-137-gemini.png',
        rounds: ['Round 15', 'Round 30', 'Round 31'],
        steps: [
          { r: 'Round 29', cls: 'err', text: 'Initial dialogue attempt fails with an explicit interaction-range error.' },
          { r: 'Round 30', cls: 'ok', text: 'Adapts strategy: grounds “crosswalk stripe next to woman” via SAM2+Depth, moving 2.91 m closer.' },
          { r: 'R31–R32', cls: 'ok', text: 'Acquires reply (“gathering is at 20:15 tonight”) and submits accurate final answer.' }
        ]
      }
    ]
  },
  c236: {
    brief: '<strong>Task 236 (Post-Soviet Village · Dialogue Handoff):</strong> Obtain flour registration hours inside the village kiosk, exit through the doorway, and deliver the details to the designated man waiting outside.',
    single: {
      model: 'Kimi-K3 · Spatial State Drift After Rotation',
      verdict: 'Failed at R100',
      pass: false,
      img: 'assets/figures/strip-236.png',
      rounds: ['Round 26 (Inside Kiosk)', 'Round 27 (Yaw +90°)', 'Round 80 (Still Inside)'],
      steps: [
        { r: 'Round 25', cls: 'ok', text: 'Acquires flour registration rules from kiosk_clerk (11:00–12:00 tomorrow, 5 kg limit).' },
        { r: 'Round 26', cls: 'ok', text: 'Calls turn_right(90°); yaw changes from −10.9° to 79.1° facing the window.' },
        { r: 'Round 27', cls: 'err', text: 'Hallucinates exit: states “I have left the kiosk” despite fixed (x, y) coordinates and failed 400 cm move.' },
        { r: 'R80–R81', cls: 'err', text: 'Calls report_to_npc targeting the man outside, but actually reaches kiosk_clerk inside—leaving handoff unmet.' }
      ]
    }
  },
  c248: {
    brief: '<strong>Task 248 (Modular Building · Deliver Report):</strong> Obtain the inspection scope from an NPC, visit a registration point, inspect a roadside shelter (spaced vertical backrest bars + front canopy posts), and report to the recipient.',
    single: {
      model: 'Qwen3.8-Max · Premature Completion via Error Propagation',
      verdict: 'False Completion',
      pass: false,
      img: 'assets/figures/strip-248.png',
      rounds: ['Round 41 (Range Error)', 'Round 62 (Skips Scope)', 'Round 83 (Generic Report)'],
      steps: [
        { r: 'R41 & R46', cls: 'err', text: 'Attempts to query the source NPC fail with interaction-range errors.' },
        { r: 'Round 62', cls: 'err', text: 'Abandons prerequisite inquiry and proceeds with an assumed generic inspection scope.' },
        { r: 'Round 83', cls: 'err', text: 'Submits vague report (“shelter roof, posts, bench intact”), omitting backrest bars and front posts.' },
        { r: 'Round 84', cls: 'err', text: 'Mistakes NPC’s polite receipt (“Your statement has been recorded”) for factual validation and calls finish_task.' }
      ]
    }
  },
  c024: {
    brief: '<strong>Task 024 (Downtown West · Deliver Report):</strong> Acquire checklist (round 13), inspect an advertising column and adjacent canopy frames (poster panels, top structure, base shape), and report to the man near the café.',
    single: {
      model: 'DeepSeek-V4.1-Flash · Over-Inspection Exhausts 100-Round Budget',
      verdict: 'Timeout (R100)',
      pass: false,
      img: 'assets/figures/strip-024.png',
      rounds: ['Round 32 (Column View)', 'Round 57 (Canopy View)', 'Round 100 (Budget Spent)'],
      steps: [
        { r: 'Round 13', cls: 'ok', text: 'Successfully obtains all three required inspection attributes from the source NPC early in the episode.' },
        { r: 'R32 & R57', cls: 'ok', text: 'Locates both the advertising column and canopy frames clearly in ego views.' },
        { r: 'R71–R100', cls: 'err', text: 'Repeatedly seeks “even closer” viewpoints instead of transitioning to delivery, exhausting all 100 rounds before calling report_to_npc.' }
      ]
    }
  }
};

const CLI_SNIPPETS = {
  install: `# 1. Install EmbodiedExploreGym runtime (Linux + NVIDIA GPU + Vulkan)
python3.10 -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[runtime]"
eeb-check

# 2. Point to prebuilt UnrealZoo UE 5.7 Linux package & launch SAM2.1 service
export UnrealEnv=/path/to/UnrealZoo_UE5_7_Linux_v1.0.0
CUDA_VISIBLE_DEVICES=0 .venv-sam2/bin/python sam3/tools/sam2_tool_service.py \\
  --port 7862 --device cuda \\
  --checkpoint checkpoints/sam2.1_hiera_large.pt \\
  --model-config configs/sam2.1/sam2.1_hiera_l.yaml`,

  run: `# Configure your VLM/MLLM endpoint & judge API in .env
cp .env.example .env

# Sanity-check a single task episode
eeb-run --env-file .env --output outputs/my-model --gpu-id 0 \\
  --task-id 001_command_center_comparative_selection

# Run all 307 tasks (480x360 RGB, 100 max rounds) with fault-tolerant resume
eeb-run --env-file .env --output outputs/my-model --gpu-id 0 --resume`,

  score: `# Run deterministic trace checks + Qwen3.8-Max semantic rubric judge
eeb-evaluate \\
  --episodes outputs/my-model/episodes \\
  --env-file .env \\
  --output outputs/my-model/evaluation.json \\
  --resume

# Aggregate Success Rate (SR) & Subtask Completion Rate (SCR) by category
eeb-aggregate \\
  --scores outputs/my-model/evaluation.json \\
  --output outputs/my-model/summary.json`
};

/* ==========================================================================
   2. Navigation Scroll-Spy & Overview Video Sound Control
   ========================================================================== */

const navLinks = [...document.querySelectorAll('.main-nav a[data-nav]')];
const trackedSections = navLinks.map(a => document.getElementById(a.dataset.nav)).filter(Boolean);

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === entry.target.id));
    }
  });
}, { rootMargin: '-28% 0px -60% 0px' });
trackedSections.forEach(sec => spyObserver.observe(sec));

const overviewVideo = document.getElementById('overview-video');
const soundBtn = document.getElementById('toggle-overview-sound');
const soundLabel = document.getElementById('sound-btn-label');

function syncSoundUI() {
  const unmuted = !overviewVideo.muted;
  soundBtn.setAttribute('aria-pressed', String(unmuted));
  soundLabel.textContent = unmuted ? 'Audio on (Mute)' : 'Unmute audio';
}

soundBtn.addEventListener('click', () => {
  overviewVideo.muted = !overviewVideo.muted;
  if (!overviewVideo.muted && overviewVideo.paused) {
    overviewVideo.play().catch(() => {});
  }
  syncSoundUI();
});

document.getElementById('watch-overview').addEventListener('click', () => {
  overviewVideo.muted = false;
  overviewVideo.currentTime = 0;
  overviewVideo.play().catch(() => {});
  syncSoundUI();
});

overviewVideo.addEventListener('volumechange', syncSoundUI);

/* ==========================================================================
   3. Section 03: Unified Tool Explorer
   ========================================================================== */

const toolTabs = [...document.querySelectorAll('[data-tool-group]')];
const toolsGrid = document.getElementById('tools-panel-grid');

function renderToolGroup(groupKey) {
  toolTabs.forEach(btn => btn.setAttribute('aria-selected', String(btn.dataset.toolGroup === groupKey)));
  const items = TOOL_GROUPS[groupKey] || [];
  toolsGrid.innerHTML = items.map(item => `
    <article class="tool-spec-card">
      <div class="tool-spec-top">
        <code class="tool-fn-name">${item.fn}</code>
        <span class="tool-tag">${item.tag}</span>
      </div>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
      <div class="tool-feedback-line"><strong>Returns</strong> ${item.feedback}</div>
    </article>
  `).join('');
}

toolTabs.forEach(btn => btn.addEventListener('click', () => renderToolGroup(btn.dataset.toolGroup)));
renderToolGroup('nav');

/* ==========================================================================
   4. Section 04: Category Explorer & 11 Scenes Showcase
   ========================================================================== */

const categoryTabs = [...document.querySelectorAll('[data-category]')];
const categoryPanel = document.getElementById('category-panel');

function renderCategory(key) {
  const cat = CATEGORIES[key];
  if (!cat) return;
  categoryTabs.forEach(tab => {
    const active = tab.dataset.category === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const activeTab = categoryTabs.find(t => t.dataset.category === key);
  if (activeTab) categoryPanel.setAttribute('aria-labelledby', activeTab.id);

  categoryPanel.innerHTML = `
    <div>
      <div class="cat-stage-head">
        <div>
          <span class="eyebrow-label">${cat.code} · ${cat.label}</span>
          <h3>${cat.name}</h3>
        </div>
        <div class="cat-score-chip">
          <strong>${cat.bestSr} SR</strong>
          <span>Peak (${cat.bestScr} SCR)</span>
        </div>
      </div>
      <p class="cat-stage-desc">${cat.description}</p>
    </div>
    <div class="family-subgrid">
      ${cat.families.map(f => `
        <article class="family-card">
          <div class="family-card-top">
            <h4>${f.name}</h4>
            <span>${f.count} tasks</span>
          </div>
          <p>${f.desc}</p>
        </article>
      `).join('')}
    </div>
    <div class="sample-prompt-box">
      <span>Representative Benchmark Task</span>
      ${cat.sampleTask}
    </div>
  `;
}

categoryTabs.forEach((btn, idx) => {
  btn.addEventListener('click', () => renderCategory(btn.dataset.category));
  btn.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % categoryTabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (idx - 1 + categoryTabs.length) % categoryTabs.length;
    if (next !== undefined) {
      e.preventDefault();
      categoryTabs[next].focus();
      renderCategory(categoryTabs[next].dataset.category);
    }
  });
});
renderCategory('vss');

/* ==========================================================================
   5. Section 05: Interactive Leaderboard & 5-Axis SVG Radar
   ========================================================================== */

let lbMetric = 'sr';
let lbFilter = 'all';
let lbSortCol = 5;
let lbDesc = true;

const COL_LABELS_MAIN = [
  { abbr: 'VSS', title: 'Visual Search & Selection (64 tasks)' },
  { abbr: 'SARE', title: 'Spatial Action & Route Execution (46 tasks)' },
  { abbr: 'IGC', title: 'Information Gathering & Communication (91 tasks)' },
  { abbr: 'IRA', title: 'Instruction Reasoning & Adaptation (54 tasks)' },
  { abbr: 'MST', title: 'Memory & State Tracking (52 tasks)' },
  { abbr: 'Overall', title: 'Overall Benchmark Score (307 tasks)' }
];

const COL_LABELS_COST = [
  { abbr: 'Overall SR', title: 'Whole-Task Success Rate (%)' },
  { abbr: 'Overall SCR', title: 'Subtask Completion Rate (%)' },
  { abbr: 'SCR − SR Gap', title: 'Gap between subtask progress and whole-task completion (percentage points)' },
  { abbr: 'Input (k)', title: 'Mean cumulative input tokens per task in thousands (Table S1)' },
  { abbr: 'Output (k)', title: 'Mean cumulative output tokens per task in thousands (Table S1)' }
];

function getCellValue(model, col) {
  if (lbMetric === 'sr' || lbMetric === 'both') return model.sr[col];
  if (lbMetric === 'scr') return model.scr[col];
  // cost mode
  if (col === 0) return model.sr[5];
  if (col === 1) return model.scr[5];
  if (col === 2) return +(model.scr[5] - model.sr[5]).toFixed(2);
  if (col === 3) return model.inK;
  return model.outK;
}

function renderLeaderboard() {
  const cols = lbMetric === 'cost' ? COL_LABELS_COST : COL_LABELS_MAIN;
  if (lbSortCol >= cols.length) lbSortCol = lbMetric === 'cost' ? 0 : 5;

  const filtered = MODELS.filter(m => lbFilter === 'all' || m.license === lbFilter);

  // Compute top-2 distinct values per column for bold/underline
  const colRanks = cols.map((_, c) => {
    const vals = [...new Set(filtered.map(m => getCellValue(m, c)))];
    // For gap/tokens lower isn't necessarily "best", only highlight SR/SCR columns
    const lowerBetter = lbMetric === 'cost' && c >= 2;
    vals.sort((a, b) => lowerBetter ? a - b : b - a);
    return { first: vals[0], second: vals[1] };
  });

  const sorted = [...filtered].sort((a, b) => {
    const va = getCellValue(a, lbSortCol);
    const vb = getCellValue(b, lbSortCol);
    return (lbDesc ? vb - va : va - vb) || (b.sr[5] - a.sr[5]);
  });

  const thead = document.getElementById('results-head');
  thead.innerHTML = `<tr>
    <th scope="col">Model</th>
    ${cols.map((col, i) => {
      const active = i === lbSortCol;
      const ariaSort = active ? (lbDesc ? 'descending' : 'ascending') : 'none';
      const arrow = active ? (lbDesc ? '↓' : '↑') : '';
      return `<th scope="col" aria-sort="${ariaSort}">
        <button type="button" class="sort-btn" data-sort="${i}" title="${col.title}">
          <span>${col.abbr}</span><span>${arrow}</span>
        </button>
      </th>`;
    }).join('')}
  </tr>`;

  thead.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const col = Number(btn.dataset.sort);
      lbDesc = col === lbSortCol ? !lbDesc : (lbMetric === 'cost' && col >= 2 ? false : true);
      lbSortCol = col;
      renderLeaderboard();
    });
  });

  const tbody = document.getElementById('results-body');
  tbody.innerHTML = sorted.map((m, idx) => {
    const isLeader = idx === 0 && lbDesc && (lbMetric !== 'cost' || lbSortCol <= 1);
    const cells = cols.map((_, c) => {
      const val = getCellValue(m, c);
      const { first, second } = colRanks[c];
      const cls = val === first ? 'best' : val === second ? 'second' : '';

      if (lbMetric === 'both') {
        const scrVal = m.scr[c].toFixed(2);
        return `<td class="${cls}">${val.toFixed(2)}<span class="dual-sub">/ ${scrVal}</span></td>`;
      }
      if (lbMetric !== 'cost' && c === 5) {
        return `<td class="overall-bar-cell ${cls}">
          <div class="score-with-bar">
            <span class="mini-bar" aria-hidden="true"><i style="width:${Math.min(100, val)}%"></i></span>
            <span>${val.toFixed(2)}</span>
          </div>
        </td>`;
      }
      if (lbMetric === 'cost' && c === 3) {
        return `<td class="${cls}">${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
      }
      if (lbMetric === 'cost' && c === 2) {
        return `<td class="${cls}">+${val.toFixed(2)}</td>`;
      }
      return `<td class="${cls}">${val.toFixed(2)}</td>`;
    }).join('');

    return `<tr class="${isLeader ? 'leading' : ''}">
      <th scope="row">
        <span class="rank-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="model-name-cell">
          ${m.name}
          <span class="license-tag ${m.license}">${m.license === 'open' ? 'Open' : 'API'}</span>
        </span>
      </th>
      ${cells}
    </tr>`;
  }).join('');

  document.querySelectorAll('[data-metric]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.metric === lbMetric));
  });
  document.querySelectorAll('[data-model-filter]').forEach(b => {
    b.classList.toggle('active', b.dataset.modelFilter === lbFilter);
  });
  document.getElementById('metric-note').textContent =
    `Showing ${filtered.length} models, sorted by ${cols[lbSortCol].abbr} (${lbDesc ? 'descending' : 'ascending'}).`;
}

document.querySelectorAll('[data-metric]').forEach(btn => {
  btn.addEventListener('click', () => {
    lbMetric = btn.dataset.metric;
    lbSortCol = lbMetric === 'cost' ? 0 : 5;
    lbDesc = true;
    renderLeaderboard();
  });
});

document.querySelectorAll('[data-model-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    lbFilter = btn.dataset.modelFilter;
    renderLeaderboard();
  });
});

renderLeaderboard();

/* Interactive 5-Axis SVG Radar */
const radarContainer = document.getElementById('radar-container');
const radarToggles = document.getElementById('radar-toggles');
const RADAR_AXES = ['VSS', 'SARE', 'IGC', 'IRA', 'MST'];

function renderRadar() {
  const cx = 160, cy = 158, maxR = 108, maxVal = 85;
  const rings = [20, 40, 60, 80];

  const pt = (axisIdx, val) => {
    const angle = -Math.PI / 2 + (axisIdx * 2 * Math.PI) / 5;
    const r = (val / maxVal) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const gridPolys = rings.map(ringVal => {
    const pts = RADAR_AXES.map((_, i) => pt(i, ringVal).map(n => n.toFixed(1)).join(',')).join(' ');
    const [, ly] = pt(0, ringVal);
    return `<polygon points="${pts}" fill="none" stroke="#E2E0D6" stroke-width="1"/>
            <text x="${cx + 4}" y="${(ly + 3).toFixed(1)}" font-size="9" fill="#879699" font-family="JetBrains Mono, monospace">${ringVal}</text>`;
  }).join('');

  const spokes = RADAR_AXES.map((label, i) => {
    const [x, y] = pt(i, maxVal);
    const [lx, ly] = pt(i, maxVal + 14);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E2E0D6" stroke-width="1"/>
            <text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#122024" font-family="JetBrains Mono, monospace">${label}</text>`;
  }).join('');

  const series = RADAR_MODELS.filter(m => m.active).map(m => {
    const pts = m.scores.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(',')).join(' ');
    const dots = m.scores.map((v, i) => {
      const [dx, dy] = pt(i, v);
      return `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="3.2" fill="${m.color}"><title>${m.name} · ${RADAR_AXES[i]}: ${v}%</title></circle>`;
    }).join('');
    return `<g>
      <polygon points="${pts}" fill="${m.color}" fill-opacity="0.11" stroke="${m.color}" stroke-width="2"/>
      ${dots}
    </g>`;
  }).join('');

  radarContainer.innerHTML = `<svg viewBox="0 0 320 310" role="img" aria-label="Capability radar comparing selected MLLMs across VSS, SARE, IGC, IRA, and MST">
    ${gridPolys}
    ${spokes}
    ${series}
  </svg>`;

  radarToggles.innerHTML = RADAR_MODELS.map((m, idx) => `
    <button type="button" class="radar-toggle" data-radar-idx="${idx}" aria-pressed="${m.active}">
      <span class="radar-swatch" style="background:${m.color}"></span>
      <span>${m.name}</span>
    </button>
  `).join('');

  radarToggles.querySelectorAll('[data-radar-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.radarIdx);
      const activeCount = RADAR_MODELS.filter(m => m.active).length;
      if (RADAR_MODELS[idx].active && activeCount <= 1) return;
      RADAR_MODELS[idx].active = !RADAR_MODELS[idx].active;
      renderRadar();
    });
  });
}
renderRadar();

/* ==========================================================================
   6. Section 06: Controlled Ablations & Trajectory Case Studies
   ========================================================================== */

const ablationBtns = [...document.querySelectorAll('[data-ablation]')];
const ablationStage = document.getElementById('ablation-stage');

function renderAblation(key) {
  ablationBtns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.ablation === key)));
  const item = ABLATIONS[key];
  if (!item) return;
  ablationStage.innerHTML = `
    <div class="ablation-split">
      <div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        ${item.zoomImg ? `<button type="button" class="text-zoom-btn" data-zoom="${item.zoomImg}" style="margin-top:12px"><span>${item.zoomLabel}</span><span>↗</span></button>` : ''}
      </div>
      <div class="ablation-bars">
        ${item.rows.map(r => `
          <div class="ab-row">
            <div class="ab-row-top"><span>${r.label}</span><span>${r.stat}</span></div>
            <div class="ab-track ${r.cls}"><i style="width:${r.width}%"></i></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  bindZoomButtons(ablationStage);
}
ablationBtns.forEach(b => b.addEventListener('click', () => renderAblation(b.dataset.ablation)));
renderAblation('map');

const caseBtns = [...document.querySelectorAll('[data-case]')];
const casePanel = document.getElementById('case-panel');

function renderCase(key) {
  caseBtns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.case === key)));
  const c = CASE_STUDIES[key];
  if (!c) return;

  if (c.dual) {
    casePanel.innerHTML = `
      <div class="case-task-brief">${c.brief}</div>
      <div class="case-dual-grid">
        ${c.dual.map(agent => `
          <article class="case-agent-card">
            <div class="case-agent-top">
              <h4>${agent.model}</h4>
              <span class="verdict-pill ${agent.pass ? 'pass' : 'fail'}">${agent.verdict}</span>
            </div>
            <img class="filmstrip-img" src="${agent.img}" alt="${agent.model} trajectory observations" loading="lazy">
            <div class="filmstrip-rounds">${agent.rounds.map(r => `<span>${r}</span>`).join('')}</div>
            <ol class="case-log-steps">
              ${agent.steps.map(s => `<li class="${s.cls}"><b>${s.r}</b><span>${s.text}</span></li>`).join('')}
            </ol>
          </article>
        `).join('')}
      </div>
    `;
  } else if (c.single) {
    const a = c.single;
    casePanel.innerHTML = `
      <div class="case-task-brief">${c.brief}</div>
      <div class="case-single-grid">
        <div>
          <div class="case-agent-top">
            <h4>${a.model}</h4>
            <span class="verdict-pill ${a.pass ? 'pass' : 'fail'}">${a.verdict}</span>
          </div>
          <img class="filmstrip-img" src="${a.img}" alt="${a.model} trajectory strip" loading="lazy">
          <div class="filmstrip-rounds">${a.rounds.map(r => `<span>${r}</span>`).join('')}</div>
        </div>
        <ol class="case-log-steps" style="margin-top:0">
          ${a.steps.map(s => `<li class="${s.cls}"><b>${s.r}</b><span>${s.text}</span></li>`).join('')}
        </ol>
      </div>
    `;
  }
}
caseBtns.forEach(b => b.addEventListener('click', () => renderCase(b.dataset.case)));
renderCase('c137');

/* ==========================================================================
   7. Section 07 & 08: Quickstart CLI Tabs & Clipboard Copy
   ========================================================================== */

let activeCli = 'install';
const cliCodeEl = document.getElementById('cli-code');
const cliTabs = [...document.querySelectorAll('[data-cli]')];

function renderCli(key) {
  activeCli = key;
  cliTabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.cli === key)));
  cliCodeEl.textContent = CLI_SNIPPETS[key] || '';
}
cliTabs.forEach(t => t.addEventListener('click', () => renderCli(t.dataset.cli)));
renderCli('install');

async function copyTextWithFeedback(text, btn, defaultLabel) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied ✓';
    setTimeout(() => { btn.textContent = defaultLabel; }, 2000);
  } catch {
    btn.textContent = 'Press Cmd/Ctrl+C';
    setTimeout(() => { btn.textContent = defaultLabel; }, 2200);
  }
}

document.getElementById('copy-cli').addEventListener('click', e => {
  copyTextWithFeedback(CLI_SNIPPETS[activeCli], e.currentTarget, 'Copy');
});

document.getElementById('copy-citation').addEventListener('click', e => {
  const bib = document.getElementById('bibtex').textContent;
  document.getElementById('copy-status').textContent = 'BibTeX copied to clipboard.';
  copyTextWithFeedback(bib, e.currentTarget, 'Copy BibTeX');
});

/* ==========================================================================
   8. Lightbox Dialog for Paper Figures
   ========================================================================== */

const figureDialog = document.getElementById('figure-dialog');
const dialogImage = document.getElementById('dialog-image');
const lightboxCaption = document.getElementById('lightbox-caption');

function bindZoomButtons(root = document) {
  root.querySelectorAll('[data-zoom]').forEach(btn => {
    if (btn.dataset.zoomBound) return;
    btn.dataset.zoomBound = '1';
    btn.addEventListener('click', () => {
      const imgEl = btn.querySelector('img');
      dialogImage.src = btn.dataset.zoom;
      dialogImage.alt = imgEl ? imgEl.alt : 'Expanded paper figure';
      const topSpan = btn.closest('.figure-frame')?.querySelector('.figure-topline span');
      lightboxCaption.textContent = topSpan ? topSpan.textContent : (btn.textContent.trim() || 'Paper Figure');
      figureDialog.showModal();
    });
  });
}
bindZoomButtons();

document.getElementById('lightbox-close').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', e => {
  if (e.target === figureDialog) figureDialog.close();
});

/* ==========================================================================
   9. Section 02: 30-Episode 2K Trajectory Theater + Interactive Trace Modal
   ========================================================================== */

const wallPanel = document.getElementById('demo-wall-panel');
const cardsPanel = document.getElementById('demo-cards-panel');
const modeBtns = [...document.querySelectorAll('[data-demo-view]')];
const wallVideo = document.getElementById('demo-wall-video');
const demoHotspots = document.getElementById('demo-hotspots');
const demoGrid = document.getElementById('demo-grid');
const sceneFilterBar = document.getElementById('scene-filter-bar');
const speedSelect = document.getElementById('demo-speed');
const previewToggle = document.getElementById('demo-preview-toggle');

const demoDialog = document.getElementById('demo-dialog');
const demoPlayer = document.getElementById('demo-player');
const traceListEl = document.getElementById('demo-trace-list');

let allDemos = [];
let demoViewMode = 'wall';
let activeSceneFilter = 'all';
let previewsPlaying = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let wallInViewport = false;
const visibleCardVideos = new Set();
let selectedDemo = null;
let lastTraceIdx = -1;

function setDemoView(mode, sceneName = null) {
  demoViewMode = mode;
  modeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.demoView === mode)));
  wallPanel.hidden = mode !== 'wall';
  cardsPanel.hidden = mode !== 'cards';
  if (sceneName) {
    activeSceneFilter = sceneName;
    renderDemoCards();
  }
  syncPreviews();
}

modeBtns.forEach(btn => btn.addEventListener('click', () => setDemoView(btn.dataset.demoView)));

function syncPreviews() {
  previewToggle.setAttribute('aria-pressed', String(previewsPlaying));
  previewToggle.textContent = previewsPlaying ? 'Pause previews Ⅱ' : 'Play previews ▶';

  const allowAuto = previewsPlaying && !document.hidden && !demoDialog.open;
  const rate = Number(speedSelect.value) || 1;

  if (allowAuto && demoViewMode === 'wall' && wallInViewport) {
    if (!wallVideo.getAttribute('src')) wallVideo.src = 'assets/demos/wall-5cols-6rows.mp4';
    wallVideo.playbackRate = rate;
    wallVideo.play().catch(() => {});
  } else {
    wallVideo.pause();
  }

  demoGrid.querySelectorAll('video').forEach(v => {
    if (allowAuto && demoViewMode === 'cards' && visibleCardVideos.has(v)) {
      if (!v.getAttribute('src')) v.src = v.dataset.src;
      v.playbackRate = rate;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}

new IntersectionObserver(entries => {
  wallInViewport = entries[0].isIntersecting;
  syncPreviews();
}, { threshold: 0.12 }).observe(wallVideo);

const cardVideoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) visibleCardVideos.add(entry.target);
    else visibleCardVideos.delete(entry.target);
  });
  syncPreviews();
}, { threshold: 0.15 });

speedSelect.addEventListener('change', syncPreviews);
previewToggle.addEventListener('click', () => {
  previewsPlaying = !previewsPlaying;
  syncPreviews();
});
document.addEventListener('visibilitychange', syncPreviews);

function openTrajectoryModal(demo) {
  if (!demo) return;
  overviewVideo.pause();
  selectedDemo = demo;
  lastTraceIdx = -1;

  document.getElementById('demo-dialog-meta').textContent = `${demo.scene} · ${demo.family} · Task ${demo.id} · ${demo.rounds} rounds`;
  document.getElementById('demo-dialog-title').textContent = demo.title;
  document.getElementById('demo-goal').textContent = demo.summary;

  const dl = document.getElementById('demo-download');
  dl.href = demo.video;
  dl.setAttribute('download', `EmbodiedExploreGym-Task${demo.id}.mp4`);

  demoPlayer.poster = demo.poster;
  demoPlayer.src = demo.video;
  demoPlayer.querySelectorAll('track').forEach(t => t.remove());
  if (demo.captions) {
    const track = document.createElement('track');
    track.kind = 'captions';
    track.label = 'Tool actions';
    track.srclang = 'en';
    track.src = demo.captions;
    demoPlayer.append(track);
  }

  // Render interactive round-by-round trace list
  traceListEl.innerHTML = (demo.segments || []).map((seg, i) => `
    <li>
      <button type="button" class="trace-step-btn" data-seg-idx="${i}">
        <span class="trace-step-top">
          <span>Round ${seg.step + 1}</span>
          <code>${seg.tool}</code>
          ${seg.tool_success === false ? '<span class="step-fail">Failed</span>' : ''}
        </span>
        <span class="trace-step-label">${seg.label}</span>
      </button>
    </li>
  `).join('');

  traceListEl.querySelectorAll('[data-seg-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const seg = demo.segments[Number(btn.dataset.segIdx)];
      if (!seg) return;
      demoPlayer.currentTime = Math.max(0, seg.start + 0.04);
      demoPlayer.play().catch(() => {});
    });
  });

  demoDialog.showModal();
  updateLiveTraceStep();
  syncPreviews();
  demoPlayer.play().catch(() => {});
}

function updateLiveTraceStep() {
  if (!selectedDemo || !selectedDemo.segments?.length) return;
  const t = demoPlayer.currentTime;
  let idx = selectedDemo.segments.findIndex(seg => t >= seg.start && t < seg.end);
  if (idx === -1) idx = selectedDemo.segments.length - 1;
  if (idx === lastTraceIdx) return;
  lastTraceIdx = idx;

  const seg = selectedDemo.segments[idx];
  document.getElementById('demo-round').textContent = `Round ${seg.step + 1} / ${selectedDemo.rounds}`;
  document.getElementById('demo-tool-tag').textContent = seg.tool;
  document.getElementById('demo-action').textContent = seg.label;
  document.getElementById('demo-action-speed').textContent = seg.speed >= 1.05 ? `${seg.speed.toFixed(1)}×` : '';

  const statusEl = document.getElementById('demo-action-status');
  statusEl.dataset.failed = String(seg.tool_success === false);
  statusEl.textContent = seg.tool_success === false
    ? 'Tool error'
    : seg.tool === 'finish_task'
      ? 'Completed ✓'
      : seg.tool === 'report_to_npc'
        ? 'Report sent'
        : '';

  const buttons = traceListEl.querySelectorAll('.trace-step-btn');
  buttons.forEach((b, i) => {
    const isCurrent = i === idx;
    b.classList.toggle('active', isCurrent);
    if (isCurrent) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}

demoPlayer.addEventListener('timeupdate', updateLiveTraceStep);
demoPlayer.addEventListener('seeked', updateLiveTraceStep);

document.getElementById('demo-close').addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('close', () => {
  demoPlayer.pause();
  demoPlayer.removeAttribute('src');
  demoPlayer.load();
  selectedDemo = null;
  syncPreviews();
});
demoDialog.addEventListener('click', e => {
  if (e.target === demoDialog) demoDialog.close();
});

function renderSceneFilterBar() {
  const scenes = ['all', ...new Set(allDemos.map(d => d.scene))];
  sceneFilterBar.innerHTML = scenes.map(sc => {
    const count = sc === 'all' ? allDemos.length : allDemos.filter(d => d.scene === sc).length;
    const label = sc === 'all' ? `All Scenes (${count})` : `${sc} (${count})`;
    return `<button type="button" class="scene-chip ${activeSceneFilter === sc ? 'active' : ''}" data-scene-chip="${sc}">${label}</button>`;
  }).join('');

  sceneFilterBar.querySelectorAll('[data-scene-chip]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSceneFilter = btn.dataset.sceneChip;
      renderSceneFilterBar();
      renderDemoCards();
      syncPreviews();
    });
  });
}

function renderDemoCards() {
  visibleCardVideos.clear();
  const subset = activeSceneFilter === 'all'
    ? allDemos
    : allDemos.filter(d => d.scene === activeSceneFilter);

  demoGrid.innerHTML = subset.map(demo => `
    <article class="demo-card">
      <button type="button" class="demo-open" data-open-id="${demo.id}" aria-label="Play 2K trajectory for Task ${demo.id}: ${demo.title}">
        <video muted loop playsinline preload="none" poster="${demo.poster}" data-src="${demo.preview}" aria-hidden="true"></video>
        <span class="demo-play-badge" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M5.5 3 16.5 10 5.5 17Z"/></svg></span>
        <span class="demo-scene-tag">${demo.scene}</span>
        <span class="demo-rounds-tag">${demo.rounds} rounds · 2K</span>
      </button>
      <div class="demo-card-body">
        <div class="demo-card-meta"><span>Task ${demo.id}</span><span>${demo.family}</span></div>
        <h3>${demo.title}</h3>
        <p>${demo.summary}</p>
      </div>
    </article>
  `).join('');

  demoGrid.querySelectorAll('[data-open-id]').forEach(btn => {
    const demo = allDemos.find(d => d.id === btn.dataset.openId);
    btn.addEventListener('click', () => openTrajectoryModal(demo));
    const v = btn.querySelector('video');
    if (v) cardVideoObserver.observe(v);
  });
}

/* Render 11 Scenes Showcase + 12th Summary Anchor Tile in Section 04 */
const scenesGridEl = document.getElementById('scenes-grid');
function renderScenesShowcase() {
  const tilesHtml = SCENES.map(sc => `
    <button type="button" class="scene-tile" data-scene-demo="${sc.demoId}" data-scene-name="${sc.name}" aria-label="Watch 2K demo in ${sc.name} (${sc.count} tasks)">
      <div class="scene-thumb">
        <img src="${sc.poster}" alt="${sc.name} scene in UnrealZoo UE 5.7" width="480" height="270" loading="lazy">
        <span class="scene-env-badge">${sc.env}</span>
        <span class="scene-count-badge">${sc.count} tasks</span>
      </div>
      <div class="scene-info">
        <h4>${sc.name}</h4>
        <p>${sc.desc}</p>
      </div>
    </button>
  `).join('');

  const summaryTile = `
    <button type="button" class="scene-tile summary-tile" id="scenes-explore-all" aria-label="Browse all 30 trajectory replays by scene">
      <div class="summary-tile-inner">
        <span class="summary-kicker">UNREALZOO · UE 5.7</span>
        <strong>307 Tasks<br>1,448 Subtasks</strong>
        <p>5 cross indoor–outdoor worlds &amp; 6 specialized facilities.</p>
        <span class="summary-cta">Browse all 30 replays →</span>
      </div>
    </button>
  `;

  scenesGridEl.innerHTML = tilesHtml + summaryTile;

  scenesGridEl.querySelectorAll('[data-scene-demo]').forEach(tile => {
    tile.addEventListener('click', () => {
      const demo = allDemos.find(d => d.id === tile.dataset.sceneDemo);
      if (demo) {
        openTrajectoryModal(demo);
      } else {
        document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.getElementById('scenes-explore-all')?.addEventListener('click', () => {
    setDemoView('cards', 'all');
    document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
  });
}
renderScenesShowcase();

fetch('assets/demos/demos.json')
  .then(r => {
    if (!r.ok) throw new Error('Failed to load demos.json');
    return r.json();
  })
  .then(demos => {
    allDemos = demos;
    demoHotspots.innerHTML = demos.map(demo => `
      <button type="button" class="demo-hotspot" data-wall-id="${demo.id}" title="${demo.scene} · ${demo.family}: ${demo.title}" aria-label="Play Task ${demo.id}: ${demo.title} in ${demo.scene}">
        <span class="hotspot-id">#${demo.id}</span>
        <span class="hotspot-scene">${demo.scene}</span>
        <span class="hotspot-play" aria-hidden="true"><span>▶</span></span>
      </button>
    `).join('');

    demoHotspots.querySelectorAll('[data-wall-id]').forEach(btn => {
      const demo = demos.find(d => d.id === btn.dataset.wallId);
      btn.addEventListener('click', () => openTrajectoryModal(demo));
    });

    renderSceneFilterBar();
    renderDemoCards();
    syncPreviews();
  })
  .catch(() => {
    demoGrid.innerHTML = '<p style="color:#9FB3B9">Serve this directory over HTTP (e.g., python3 -m http.server) to load the 30 interactive episode manifests.</p>';
  });
