const FACES = ["🌀 SPIRAL", "💧 LUCIDITY", "⚡ ENERGY", "⛓️ SUBMISSION", "🔥 AROUSAL", "👁️ TRANSFORM"];
// Each character has a gender field ("male" / "female"). It is used for things like the Master / Mistress title.
const CHARACTERS = [
    { name: "Alex",      gender: "male" },
    { name: "Roz",       gender: "female" },
    { name: "Xander",    gender: "male" },
    { name: "Siobhán",   gender: "female" },
    { name: "Tex",       gender: "male" },
    { name: "Cassandra", gender: "female" },
    { name: "Zixuan",    gender: "male" },
    { name: "Hyeri", 	 gender: "female" },
    { name: "Mark",       gender: "male" },
    { name: "Fable",     gender: "female" }
];
const NAMES = CHARACTERS.map(c => c.name);
function getGender(name) {
    const c = CHARACTERS.find(c => c.name === String(name || "").split(" ")[0]);
    return c ? c.gender : null;
}
const TRANSFORMS = ["Statue", "Cow", "Cat", "Dog", "Werewolf", "Fox", "Horse", "Pig", "Gender", "Puppet", "Bunny","Otter","Eevee","Squirrel","Robot","Doll","Dragon","Bat"];

const CHARACTER_MANIFEST = {
    "Alex": ["Bunny", "Pig","Dog","Cat","Gender"],
    "Roz": ["Werewolf","Cow","Eevee"],
    "Xander": ["Robot","Werewolf","Otter","Bat"],
    "Siobhán": ["Horse", "Cat", "Bunny","Fox","Otter","Pig","Doll","Gender","Werewolf","Dog","Statue","Puppet"],
    "Tex": ["Cow", "Cat","Werewolf","Horse"],
    "Cassandra": [],
    "Zixuan": ["Dog","Fox","Pig","Doll"],
    "Hyeri": ["Bunny","Squirrel","Cat","Dragon"],
    "Mark": ["Robot","Puppet","Statue","Gender"],
    "Fable": ["Cat", "Bunny", "Cow","Otter","Werewolf","Statue"]
	};



// --- DEBUG CONFIGURATION ---
const cardDebugOn = false;
const debugCards = [56, 59, 2]; // Set the 3 card IDs you want dealt first

// remove virtual dice: 5, 21
// add "Hypnotic Dominance", Keep, 4, You can purchase cards from the opponent. Pay them the energy cost

const KNOWN_CARDS = [
    { id: 0, name: "Deep Gaze", cost: 5, type: "Keep", desc: "When you use 🌀, deepen the opponent's trance by 1 level more.", ai: {transformer: 12, adaptive: 30, aggressive: 50, defensive: 10, v23low: 40} },
	{ id: 1, name: "Sudden Flash", cost: 7, type: "Instant", desc: "When you purchase this card, take another turn immediately after this one.", ai: {transformer: 40, adaptive: 30, aggressive: 30, defensive: 30, v23low: 30} },
	{ id: 2, name: "Dream State", cost: 5, type: "Keep", desc: "Rolling 3+ Transform dice deals 1 extra Transform damage.", ai: {transformer: 85, adaptive: 60, aggressive: 75, defensive: 10, v23low: 60} },
	{ id: 3, name: "Trigger Word", cost: 3, type: "Keep", desc: "If you roll ⛓️👁️🔥🌀💧⚡, opponent takes +5 Transform damage.", ai: {transformer: 30, adaptive: 62, aggressive: 40, defensive: 10, v23low: 30} },
	{ id: 4, name: "Whispered Command", cost: 6, type: "Instant", desc: "Transform the opponent once and reduce your trance to 0.", ai: {transformer: 55, adaptive: 45, aggressive: 65, defensive: 30, v23low: 60} },
    { id: 5, name: "Hypnotic Dominance", cost: 4, type: "Keep", desc: "You can purchase cards from the opponent. Pay them the ⚡cost.", ai: {transformer: 25, adaptive: 28, aggressive: 35, defensive: 15, v23low: 55} },
	{ id: 6, name: "Velvet Voice", cost: 3, type: "Instant", desc: "Deepen the opponent's arousal by 2.", ai: {transformer: 12, adaptive: 40, aggressive: 70, defensive: 10, v23low: 50} },
	{ id: 7, name: "Trance Anchor", cost: 7, type: "Keep", desc: "You get one extra die.", ai: {transformer: 80, adaptive: 70, aggressive: 80, defensive: 80, v23low: 90} },
	{ id: 8, name: "Mind Fog", cost: 6, type: "Instant", desc: "Deepen the opponent's trance by 2 and submission by 2.", ai: {transformer: 10, adaptive: 45, aggressive: 75, defensive: 15, v23low: 65} },
	{ id: 9, name: "Deep Safeties", cost: 4, type: "Keep", desc: "When you use 💧 Lucidity, add 1 to its effect.", ai: {transformer: 25, adaptive: 30, aggressive: 15, defensive: 85, v23low: 55} },
	{ id: 10, name: "Subconscious Prompt", cost: 7, type: "Instant", desc: "Deepen the opponent's submission by 4.", ai: {transformer: 15, adaptive: 50, aggressive: 70, defensive: 70, v23low: 70} },
	{ id: 11, name: "Sluggish Mind", cost: 4, type: "Instant", desc: "Deepen the opponent's submission by 2.", ai: {transformer: 12, adaptive: 32, aggressive: 40, defensive: 40, v23low: 30} },
	{ id: 12, name: "Rapid Pulse", cost: 6, type: "Keep", desc: "Spend 2⚡ during your roll phase to negate Trance and Arousal to you for a turn.", ai: {transformer: 30, adaptive: 35, aggressive: 50, defensive: 50, v23low: 40} },
	{ id: 13, name: "Stoking Fires", cost: 4, type: "Keep", desc: "When you increase the opponent's 🔥, increase their 🔥 1 level more.", ai: {transformer: 8, adaptive: 45, aggressive: 60, defensive: 10, v23low: 40} },
	{ id: 14, name: "Spiral Descent", cost: 3, type: "Instant", desc: "Deepen the opponent's trance by 2.", ai: {transformer: 8, adaptive: 38, aggressive: 55, defensive: 50, v23low: 40} },
	{ id: 15, name: "Altered State", cost: 6, type: "Keep", desc: "Deepen the opponent's submission by 1 each turn.", ai: {transformer: 15, adaptive: 58, aggressive: 50, defensive: 50, v23low: 40} },
    { id: 16, name: "Hypnotic Suggestion", cost: 4, type: "Keep", desc: "Spend 1 energy to get 1 extra reroll when rolling.", ai: {transformer: 72, adaptive: 65, aggressive: 40, defensive: 40, v23low: 35} },
    { id: 17, name: "Physical Manipulation", cost: 7, type: "Keep", desc: "When you trance the opponent completely, you have the option to transform them.", ai: {transformer: 15, adaptive: 50, aggressive: 85, defensive: 50, v23low: 90} },
    { id: 18, name: "Pulsing Light", cost: 5, type: "Instant", desc: "Deepen the opponent's submission by 2 and their trance by 1.", ai: {transformer: 10, adaptive: 40, aggressive: 60, defensive: 20, v23low: 30} },
    { id: 19, name: "Primal Surge", cost: 8, type: "Instant", desc: "Gain 9 ⚡", ai: {transformer: 40, adaptive: 40, aggressive: 20, defensive: 20, v23low: 20} },
    { id: 20, name: "Absolute Focus", cost: 4, type: "Keep", desc: "Starts with 3 charges. Spend a charge for an extra reroll. Discard when spent.", charges: 3, ai: {transformer: 55, adaptive: 42, aggressive: 50, defensive: 50, v23low: 50} },
    { id: 21, name: "Switch Play", cost: 6, type: "Keep", desc: "When the opponent adds any amount of 🌀 to you, add 1 🌀 back to them.", ai: {transformer: 15, adaptive: 25, aggressive: 15, defensive: 60, v23low: 55} },
    { id: 22, name: "Mental Shackles", cost: 3, type: "Keep", desc: "When you roll 👁️👁️👁️ also deepen the opponent's submission by 1.", ai: {transformer: 50, adaptive: 38, aggressive: 65, defensive: 15, v23low: 55} },
    { id: 23, name: "Submissive Flush", cost: 4, type: "Keep", desc: "When you roll ⛓️⛓️⛓️ also increase the opponent's arousal by 1.", ai: {transformer: 8, adaptive: 35, aggressive: 60, defensive: 15, v23low: 45} },
    { id: 24, name: "Somnambulism", cost: 5, type: "Keep", desc: "When you roll ⛓️⛓️⛓️ you automatically gain another turn with one less die.", ai: {transformer: 12, adaptive: 48, aggressive: 55, defensive: 45, v23low: 45} },
    { id: 25, name: "Pendulum Swing", cost: 3, type: "Instant", desc: "Deepen your submission by 2 and transform the opponent 1.", ai: {transformer: 45, adaptive: 45, aggressive: 30, defensive: 30, v23low: 30} },
    { id: 26, name: "Waking Trance", cost: 4, type: "Keep", desc: "Gain an active button to Sell this card for +2 Energy.", ai: {transformer: 12, adaptive: 15, aggressive: 50, defensive: 50, v23low: 40} },
    { id: 27, name: "Endless Staircase", cost: 2, type: "Keep", desc: "At the end of your turn, if you have no ⚡, gain 1 ⚡.", ai: {transformer: 25, adaptive: 25, aggressive: 35, defensive: 35, v23low: 25} },
	{ id: 28, name: "Hypnotic Focus", cost: 5, type: "Keep", desc: "The first card you buy each turn costs 2 less energy.", ai: {transformer: 55, adaptive: 45, aggressive: 50, defensive: 50, v23low: 60} },
    { id: 29, name: "Compliant Mind", cost: 3, type: "Keep", desc: "Buying cards costs you 1 less ⚡.", ai: {transformer: 55, adaptive: 45, aggressive: 30, defensive: 30, v23low: 40} },
    { id: 30, name: "Shattered Ego", cost: 5, type: "Instant", desc: "Deepen your submission by 4 and transform the opponent 2.", ai: {transformer: 55, adaptive: 55, aggressive: 60, defensive: 20, v23low: 35} },
    { id: 31, name: "Falling Sensation", cost: 3, type: "Keep", desc: "Deepen the opponent's trance by 2 for every 6 ⚡ you have at the end of your turn.", ai: {transformer: 12, adaptive: 35, aggressive: 30, defensive: 5, v23low: 20} },
    { id: 32, name: "Guided Heat", cost: 3, type: "Keep", desc: "When your arousal level increases, gain 1 ⚡.", ai: {transformer: 12, adaptive: 20, aggressive: 10, defensive: 40, v23low: 15} },
    { id: 33, name: "Quiet Mind", cost: 3, type: "Keep", desc: "Spend 2 ⚡ during the shop phase to decrease your trance or arousal level by 1.", ai: {transformer: 25, adaptive: 20, aggressive: 10, defensive: 40, v23low: 10} },
    { id: 34, name: "Cognitive Override", cost: 3, type: "Keep", desc: "At the end of your turn, if the submission level is on your side, deepen the opponent's submission level by 1.", ai: {transformer: 18, adaptive: 30, aggressive: 15, defensive: 80, v23low: 60} },
    { id: 35, name: "Mesmerizing Rhythm", cost: 4, type: "Keep", desc: "Blocks the opponent from pushing the submission track by exactly 1 point.", ai: {transformer: 12, adaptive: 20, aggressive: 10, defensive: 70, v23low: 40} },
    { id: 36, name: "Deeper Trance", cost: 5, type: "Keep", desc: "When you deepen the opponent's submission level, deepen it by one more.", ai: {transformer: 12, adaptive: 50, aggressive: 65, defensive: 20, v23low: 60} },
    { id: 37, name: "Swinging Pendulum", cost: 6, type: "Instant", desc: "Set your trance level to 0. Opponent loses 1 ⚡ for every 2 ⚡ they have.", ai: {transformer: 22, adaptive: 25, aggressive: 25, defensive: 40, v23low: 20} },
    { id: 38, name: "New Identity", cost: 7, type: "Keep", desc: "If completely transformed, shift to stage 5, discard all cards and set arousal to 5.", ai: {transformer: 30, adaptive: 30, aggressive: 10, defensive: 80, v23low: 65} },
    { id: 39, name: "Subconscious Prompt", cost: 7, type: "Instant", desc: "Deepen the opponent's submission by 4.", ai: {transformer: 15, adaptive: 50, aggressive: 60, defensive: 60, v23low: 55} },
    { id: 40, name: "Global Change", cost: 4, type: "Instant", desc: "Both you and your opponent take a transformation.", ai: {transformer: 30, adaptive: 30, aggressive: 40, defensive: 40, v23low: 40} },
    { id: 41, name: "Powerful Transform", cost: 6, type: "Keep", desc: "When you transform the opponent, give them a vulnerability counter (rolls 1 less die). Max 1 counter per turn. Removed by 💧.", ai: {transformer: 88, adaptive: 58, aggressive: 80, defensive: 15, v23low: 75} },
	{ id: 42, name: "Mirror Image", cost: 6, type: "Keep", desc: "On your turn, discard this card to buy any card from the card row for free.", ai: {transformer: 40, adaptive: 38, aggressive: 25, defensive: 25, v23low: 55} },
    { id: 43, name: "Mental Awakening", cost: 5, type: "Keep", desc: "You have 1 extra reroll each turn.", ai: {transformer: 80, adaptive: 68, aggressive: 40, defensive: 40, v23low: 50} },
    { id: 44, name: "Flow Reversal", cost: 4, type: "Instant", desc: "Reduce your transformation by 1.", ai: {transformer: 28, adaptive: 25, aggressive: 25, defensive: 65, v23low: 50} },
    { id: 45, name: "Power Boost", cost: 3, type: "Keep", desc: "When you gain any ⚡ from dice, gain 1 extra ⚡.", ai: {transformer: 65, adaptive: 50, aggressive: 50, defensive: 30, v23low: 40} },
    { id: 46, name: "Bondage", cost: 3, type: "Keep", desc: "Deepen your opponent's submission whenever you buy a card from the market.", ai: {transformer: 12, adaptive: 42, aggressive: 70, defensive: 40, v23low: 55} },
    { id: 47, name: "Fading Reality", cost: 4, type: "Keep", desc: "You can always reroll any 👁️ you have.", ai: {transformer: 35, adaptive: 20, aggressive: 25, defensive: 30, v23low: 20} },
    { id: 48, name: "Burning Intensity", cost: 6, type: "Keep", desc: "The opponent must now use a minimum of two 💧 to decrease their arousal.", ai: {transformer: 12, adaptive: 30, aggressive: 15, defensive: 65, v23low: 45} },
    { id: 49, name: "Simmering Arousal", cost: 3, type: "Keep", desc: "You can change one of your dice to a 🔥 each turn.", ai: {transformer: 8, adaptive: 38, aggressive: 50, defensive: 10, v23low: 30} },
	{ id: 50, name: "Mutual Heat", cost: 6, type: "Keep", desc: "When the opponent adds any amount of arousal to you, increase their arousal by 1.", ai: {transformer: 18, adaptive: 20,  aggressive: 15, defensive: 65, v23low: 55 } },
	{ id: 51, name: "Transitive Energy", cost: 6, type: "Instant", desc: "Transfer 1 level of Transform from yourself to the opponent.", ai: {transformer: 50, adaptive: 40,  aggressive: 20, defensive: 80, v23low: 50 } },
	{ id: 52, name: "You Will Obey", cost: 7, type: "Instant", desc: "If the submission tracker is on the oppenent's side, deepen their submission all the way to the end.", ai: {transformer: 15, adaptive: 45, aggressive: 60, defensive: 15, v23low: 55} },
	{ id: 53, name: "I Will Not Obey", cost: 6, type: "Instant", desc: "If the submission tracker is on your side, reduce your submission to neutral.", ai: {transformer: 25, adaptive: 25, aggressive: 15, defensive: 60, v23low: 55} },
    { id: 54, name: "Burning Up", cost: 6, type: "Keep", desc: "🔥 Once per turn, gain up to 2 extra rerolls. After the first extra reroll, your 🔥 rises by 1; after the second, it rises by 2 more.", ai: {transformer: 85, adaptive: 50, aggressive: 40, defensive: 45, v23low: 40} },
    { id: 55, name: "Transformation Ritual", cost: 6, type: "Keep", desc: "⚡ At the start of your turn, gain 2 ⚡. After rolling, if you did not keep an 👁️ die, lose 3 ⚡ (to a minimum of 0).", ai: {transformer: 93, adaptive: 90, aggressive: 90, defensive: 85, v23low: 90} },
    { id: 56, name: "Deeper Bargains", cost: 7, type: "Keep", desc: "👁️ When purchased, choose a face. One of your dice becomes a special die with three copies of that face and three ⬜ blank faces.", ai: {transformer: 100, adaptive: 65, aggressive: 70, defensive: 80, v23low: 60} },
    { id: 57, name: "Mental Fortitude", cost: 4, type: "Keep", desc: "🌀 At the start of your turn, reduce your 🌀 by 1 (to a minimum of 0).", ai: {transformer: 15, adaptive: 55, aggressive: 25, defensive: 60, v23low: 35} },
    { id: 58, name: "Submissive Break", cost: 6, type: "Keep", desc: "⛓️ When purchased, discard one active Keep card belonging to either player, provided it has not resolved this turn. Its owner gains 2 ⚡. Then discard this card.", ai: {transformer: 45, adaptive: 55, aggressive: 45, defensive: 55, v23low: 50} },
    { id: 59, name: "Transformation Sigil", cost: 5, type: "Keep", desc: "👁️ When you would be transformed, roll 2 dice. If at least one shows 👁️, reduce that transformation by 1. If both show 👁️, also reflect 1 👁️ back at the opponent.", ai: {transformer: 30, adaptive: 50, aggressive: 30, defensive: 55, v23low: 35} },
    { id: 60, name: "Mirror Trance", cost: 5, type: "Instant", desc: "🪞 Swap your 🌀 and 🔥 levels with your opponent's corresponding levels.", ai: {transformer: 35, adaptive: 45, aggressive: 40, defensive: 45, v23low: 40} },
    { id: 61, name: "Blank", cost: 7, type: "Instant", desc: "⬜ Clear your 🌀, 🔥, and ⚡ to 0, and return the ⛓️ tracker to neutral. Your 👁️ level is unchanged.", ai: {transformer: 25, adaptive: 45, aggressive: 35, defensive: 55, v23low: 40} },
];

// Put card IDs here to keep them out of the draw deck and market.
// Example: const SUPPRESSED_CARD_IDS = [56, 61];
const SUPPRESSED_CARD_IDS = [];

// Emergency Submission Cards list
const SUBMISSION_RECOVERY_CARDS = [10, 11, 15, 18, 34, 39, 53, 61];
let cardResolvedThisTurn = new Set();

let deck = [];
let market = [];
let discardPile = [];
let gameState = {
    gameMode: "solo",
    p1: { name: "", transformTarget: "", trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, burningUpPending: 0 },
    p2: { name: "", transformTarget: "", difficulty: "smart", trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, burningUpPending: 0 },
    submission: 0, activePlayer: 1, round: 1, phase: "waiting",
    dice: Array(6).fill({ face: "-", kept: false }),
    rerollsLeft: 0, gameEnded: false, showDiceText: true, showEnergyActions: false, freeBuyActive: false, extraTurn: false, somnambulismTurn: false, endReason: null, forfeitingPlayerId: null, forfeitWinnerId: null,
	log: [] // Store log messages here
};

let onlineRoomId = "";
let onlineLocalRole = 1; // 1 for Host (P1), 2 for Guest (P2)
let isSyncingFromFirebase = false;
let localForfeitPending = false;
let onlineConnectionState = "idle"; // idle | connecting | connected | disconnected
let lastCinematicLoserId = null; // for game-over "Replay Cinematic"
let cpuTelegraphActive = false; // true while CPU kept dice are highlighted before a reroll
let lastEffectTickerText = "";
let lastEffectTickerTimer = null;

// Presentation-only state: never participates in game rules or online game-state sync.
let soundEnabled = true;
let soundAudioContext = null;
let musicEnabled = false;          // default off
let currentMusicTrack = null;      // "setup" | "game" | "challenge" | "final" | null
let currentGameIndex = -1;          // which game track is playing
const musicAudio = { setup: null, challenge: null, final: null };
const gamePlaylist = [
    "audio/bgm-game-1.mp3",
    "audio/bgm-game-2.mp3",
    "audio/bgm-game-3.mp3",
    "audio/bgm-game-4.mp3",
	"audio/bgm-game-5.mp3",
	"audio/bgm-game-6.mp3"
];
let gameAudio = null;
let musicVolume = 0.18;
// Presentation preferences are local to this browser, not shared game-state rules.
let localShowDiceText = true;
let localShowGameLog = false;
let localShowBrainComments = false;
let gameOverSeen = false;
let gameOverPresentationStarted = false;
let selectedHistoryIndex = -1; // -1 follows the newest available turn
let optionsReturnTarget = "game";
let diceAnimating = new Set();
let diceAnimationToken = 0;
let diceComboFlashUntil = 0;
let diceAnimationInterval = null;
let diceAnimationFaces = new Map();
let lastPlayerTransformationTaunt = null;
let regularTauntTimer = null;


let lucidityState = { available: 0, total: 0, allocations: { trance: 0, arousal: 0, vuln: 0 }, maxes: { trance: 0, arousal: 0, vuln: 0 } };
let lucidityResolve = null;

window.onload = () => {
    loadLocalDisplayPreferences();
    setGameLogVisible(localShowGameLog);
    const diceOption = document.getElementById("dice-text-option");
    if (diceOption) diceOption.value = localShowDiceText ? "on" : "off";
	const musicToggle = document.getElementById("music-option");
	if (musicToggle) musicToggle.checked = musicEnabled;
	const volSlider = document.getElementById("music-volume-slider");
	const volLabel = document.getElementById("music-volume-label");
	if (volSlider) volSlider.value = String(Math.round(musicVolume * 100));
	if (volLabel) volLabel.textContent = Math.round(musicVolume * 100) + "%";
    const populate = (id, arr, addRandom = false) => {
        const select = document.getElementById(id);
        select.innerHTML = "";
        if(addRandom) select.innerHTML += `<option value="Random">Random</option>`;
        arr.forEach(item => select.innerHTML += `<option value="${item}">${item}</option>`);
    };

    populate("p1-name", NAMES);
    populate("cpu-name", NAMES, true);
    populate("p1-lookup", TRANSFORMS);
    populate("cpu-lookup", TRANSFORMS);

    if (typeof generateDeck === 'function') generateDeck();
	deck = prepareDebugDeck(deck);

    // Initial trigger to cross-link labels and options
    onP1NameChange();
    onCpuNameChange();
    toggleGameMode();
};

// ---------- Lookup Transform ----------
// Names and transform lists are crossed: Player 1's "Transform [CPU name] into" list comes from the CPU's character, and
// the CPU's list comes from Player 1's character. Each side's Lookup dropdown mirrors that side's Transform dropdown.
const SETUP_SIDES = {
    p1:  { transform: "p1-transform-type",  lookup: "p1-lookup",  otherName: "cpu-name" },
    cpu: { transform: "cpu-transform-type", lookup: "cpu-lookup", otherName: "p1-name" }
};
let setupWasOnline = false;
function isOnlineSetup() { const m = document.getElementById("game-mode-option"); return !!m && m.value === "online"; }
function fillSelect(selectEl, items, selected) {
    selectEl.innerHTML = "";
    items.forEach(item => selectEl.innerHTML += `<option value="${item}">${item}</option>`);
    if (selected != null && items.includes(selected)) selectEl.value = selected;
}
function fullNameList(selectId) { return selectId === "cpu-name" ? ["Random"].concat(NAMES) : NAMES.slice(); }
function restoreNameList(selectId) {          // undo a Lookup filter, keeping the current name selected
    const sel = document.getElementById(selectId);
    const cur = sel.value;
    fillSelect(sel, fullNameList(selectId), cur);
    delete sel.dataset.filteredBy;
}
function syncLookup(transformSelectId) {      // Lookup dropdown always shows what the Transform dropdown has
    const side = transformSelectId === "p1-transform-type" ? "p1" : "cpu";
    const look = document.getElementById(SETUP_SIDES[side].lookup), t = document.getElementById(transformSelectId);
    if (look && t && t.value) look.value = t.value;
}
function onTransformSelectChange(transformSelectId) {
    syncLookup(transformSelectId);
    if (transformSelectId === "p1-transform-type" && lobbyActive) { lobbyNote = ""; lobbyPushMyEntry(); }
}
function setTransformLabel(side, rawName) {
    const label = document.getElementById(side === "p1" ? "p1-transform-label" : "cpu-transform-label");
    if (!label) return;
    if (isOnlineSetup()) {   // we don't know the opponent's name until they join the lobby
        label.textContent = (side === "p1" && lobbyOpponentName) ? `Transform ${lobbyOpponentName} into:` : "Transform Opponent into:";
        return;
    }
    const clean = rawName === "Random" ? "Opponent" : String(rawName).split(" ")[0];
    label.textContent = `Transform ${clean} into:`;
}

function onP1NameChange() {
    const nameSel = document.getElementById("p1-name");
    let pre = null;
    if (nameSel.dataset.filteredBy) { pre = nameSel.dataset.filteredBy; restoreNameList("p1-name"); }   // picked from a Lookup-filtered list: keep that transform
    updateSetupImages();
    setTransformLabel("cpu", nameSel.value);
    // the CPU's transform choices come from Player 1's character; a random one is chosen
    populateTransformDropdown("cpu-transform-type", nameSel.value, pre);
    if (lobbyActive) { lobbyNote = ""; lobbyPushMyEntry(); }     // online lobby: tell the opponent which character we picked
}

function onCpuNameChange() {
    const nameSel = document.getElementById("cpu-name");
    let pre = null;
    if (nameSel.dataset.filteredBy) { pre = nameSel.dataset.filteredBy; restoreNameList("cpu-name"); }
    updateSetupImages();
    updateMasterOptionLabel();
    setTransformLabel("p1", nameSel.value);
    populateTransformDropdown("p1-transform-type", nameSel.value, pre);
}

// The Lookup dropdown was changed: list only the characters that have that transformation, then fill the Transform dropdown for the chosen character
function onLookupChange(side) {
    if (isOnlineSetup()) return;
    const cfg = SETUP_SIDES[side];
    const t = document.getElementById(cfg.lookup).value;
    const nameSel = document.getElementById(cfg.otherName);
    const matches = NAMES.filter(n => (CHARACTER_MANIFEST[n] || []).includes(t));
    if (!matches.length) { populateTransformDropdown(cfg.transform, nameSel.value, t); return; }   // nobody has it: leave the names alone
    const items = (cfg.otherName === "cpu-name" ? ["Random"] : []).concat(matches);
    const otherNameValue = document.getElementById(cfg.otherName === "cpu-name" ? "p1-name" : "cpu-name").value;
    let pick = nameSel.value;
    if (!items.includes(pick) || pick === otherNameValue) {      // keep the current name if it works, otherwise pick a random match (not the other player's)
        const pool = matches.filter(n => n !== otherNameValue);
        const src = pool.length ? pool : matches;
        pick = src[Math.floor(Math.random() * src.length)];
    }
    fillSelect(nameSel, items, pick);
    nameSel.dataset.filteredBy = t;
    updateSetupImages();
    if (cfg.otherName === "cpu-name") updateMasterOptionLabel();
    setTransformLabel(side, nameSel.value);
    populateTransformDropdown(cfg.transform, nameSel.value, t);
}

function populateTransformDropdown(selectId, opposingCharName, preselect) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    const online = isOnlineSetup();
    // Online: the opponent is unknown until they join the lobby, so offer every transformation until then
    const charName = online ? (lobbyOpponentName || "Random") : opposingCharName;
    const mapped = CHARACTER_MANIFEST[charName];
    // Full list for "Random" / unknown, or characters with no transforms listed; otherwise that character's own transforms
    const list = (charName === "Random" || !mapped || !mapped.length) ? TRANSFORMS.slice() : mapped.slice();
    const prev = selectEl.value;
    let chosen = (preselect && list.includes(preselect)) ? preselect : null;
    if (!chosen && online && list.includes(prev)) chosen = prev;        // online: keep the player's pick while it is still valid
    if (!chosen) chosen = list[Math.floor(Math.random() * list.length)];
    fillSelect(selectEl, list, chosen);
    syncLookup(selectId);
}

// ============================================================
// SOLO CHALLENGE: THE SEVEN
// Wins advance to a harder rival; losses send the player back one rival.
// Beating Roz is the first checkpoint. Losing to Roz ends the run.
// ============================================================
const CHALLENGE_RIVALS = [
    { name:"Roz", difficulty:"random", form:"Eevee", initials:"RZ", tier:"Beginner", color:"#67e8f9" },
    { name:"Zixuan", difficulty:"smart", form:"Doll", initials:"ZX", tier:"Easy", color:"#a78bfa" },
    { name:"Fable", difficulty:"aggressive", form:"Otter", initials:"FB", tier:"Normal", color:"#f472b6" },
    { name:"Mark", difficulty:"v23low", form:"Gender", initials:"MK", tier:"Hard", color:"#fb923c" },
    { name:"Hyeri", difficulty:"defensive", form:"Squirrel", initials:"HY", tier:"Expert", color:"#5eead4" },
    { name:"Tex", difficulty:"transformer", form:"Cow", initials:"TX", tier:"Virtuoso", color:"#facc15" },
    { name:"Siobhán", difficulty:"adaptive", form:"Cat", initials:"SB", tier:"Mistress", color:"#c084fc" }
];
let challengeActive = false;
let challengeIndex = 0;
let challengeModifierNext = "none"; // none | handicap (CPU advantage) | bonus (player advantage)
let challengeCompleted = [];
let challengeLastResult = null;
let challengeTauntTimer = null;
let challengeRunStartedAt = null;
const safeStorage = {
    get(key) {
        try { return localStorage.getItem(key); }
        catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); return true; }
        catch { return false; }
    },
    remove(key) {
        try { localStorage.removeItem(key); }
        catch {}
    }
};
const CHALLENGE_RECORD_KEY = "hypnoticDuel.sevenChallengeRecord.v1";
function emptyChallengeRecord(){ return { runsStarted:0, runsCompleted:0, runsFailed:0, matchesWon:0, matchesLost:0, bestRivalIndex:0, lastOutcome:"Never played", lastPlayed:null }; }
function loadChallengeRecord(){ try { const raw=safeStorage.get(CHALLENGE_RECORD_KEY); return raw ? {...emptyChallengeRecord(),...JSON.parse(raw)} : emptyChallengeRecord(); } catch(e){ return emptyChallengeRecord(); } }
function saveChallengeRecord(record){ try { safeStorage.set(CHALLENGE_RECORD_KEY,JSON.stringify(record)); } catch(e){ console.warn("Challenge record could not be saved",e); } }
function updateChallengeRecord(mutator){ const record=loadChallengeRecord(); mutator(record); record.lastPlayed=new Date().toISOString(); saveChallengeRecord(record); return record; }
const CHALLENGE_SAVE_KEY = "hypnoticDuel.sevenChallengeSave.v1";
function challengeSavePayload(){ return {version:1, challengeActive, challengeIndex, challengeModifierNext, challengeCompleted:[...challengeCompleted], savedAt:new Date().toISOString()}; }
function saveChallengeProgress() {
    if(!challengeActive) return;
	
    try {
		safeStorage.set(CHALLENGE_SAVE_KEY, JSON.stringify(challengeSavePayload()));
	} catch(e) {
		console.warn("Challenge progress could not be saved",e); 
	}
}
function saveChallengeFromScreen(){
    if(!challengeActive) {
		showPopup("No Active Challenge", "There is no active challenge to save."); return; 
	}
    try {
        safeStorage.set(CHALLENGE_SAVE_KEY, JSON.stringify(challengeSavePayload()));
        showPopup("Challenge Saved", "Your challenge position and next-match bonus have been saved on this browser. To transfer progress to another browser, use <strong>Export Challenge Save</strong> in Game Tools.");
    } catch(e) {
        console.warn("Challenge progress could not be saved", e);
        showPopup("Save Failed", "Your browser could not save challenge progress. Check that site storage is available, then try again.");
    }
}
function applyChallengeSave(data){
    if(!data || data.version!==1 || !Number.isInteger(data.challengeIndex) || data.challengeIndex<0 || data.challengeIndex>=CHALLENGE_RIVALS.length) throw new Error("This is not a valid The Seven save.");
    challengeActive=true; challengeIndex=data.challengeIndex;
    const modeSelect=document.getElementById("game-mode-option"); if(modeSelect){modeSelect.value="solo";toggleGameMode();}
    challengeModifierNext=["none","bonus","handicap"].includes(data.challengeModifierNext)?data.challengeModifierNext:"none";
    challengeCompleted=Array.isArray(data.challengeCompleted)?data.challengeCompleted.filter(i=>Number.isInteger(i)&&i>=0&&i<CHALLENGE_RIVALS.length):[];
    challengeLastResult=null; challengeRunStartedAt=Date.now();
    resetTutorialGameState(); gameOverSeen=false; gameOverPresentationStarted=false;
    closeChallengeScreen();
    showPopup("Challenge Progress Loaded", `Your challenge has been restored at <strong>${CHALLENGE_RIVALS[challengeIndex].name}</strong>.<p>To keep the save compact and portable, it restores your gauntlet position and bonuses, not an in-progress match's dice, cards, or stats. Start the current rival's match again.</p><button onclick="closePopup();renderChallengeScreen('roadmap')">Continue</button>`);
    saveChallengeProgress();
}
function copySaveCode() {
    const textarea = document.getElementById('challenge-save-code');
    textarea.select();
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textarea.value)
            .then(() => showToast('Save code copied!'))
            .catch(() => fallbackCopy(textarea));
    } else {
        fallbackCopy(textarea);
    }
}

function fallbackCopy(textarea) {
    try {
        document.execCommand('copy');
        showToast('Save code copied!');
    } catch (e) {
        showToast('Could not copy. Please select and copy manually.');
    }
}
function exportChallengeSave(){
    let data;
    try { data=safeStorage.get(CHALLENGE_SAVE_KEY); } catch(e) {}
    if(!data && challengeActive) data=JSON.stringify(challengeSavePayload());
    if(!data){ showPopup("No Challenge Save", "Start The Seven first. Your progress is saved automatically as you advance."); return; }
    const code=btoa(unescape(encodeURIComponent(data)));
    showPopup("Export The Seven Save", `<p>Copy this save code, then use <strong>Load Challenge Save</strong> in another browser or on another computer.</p><textarea id="challenge-save-code" style="width:100%;min-height:110px;box-sizing:border-box;background:#17131f;color:#eee;border:1px solid #8b5cf6;border-radius:8px;padding:10px">${code}</textarea><button onclick="copySaveCode();">Copy Save Code</button>`);
}
async function importChallengeSave(){
    const code = await showThemedPrompt(
        "Paste your The Seven save code here:",
        "",
        "Restore Challenge Save"
    );

    if (code === null) return; // Player cancelled.

    if (!code.trim()) {
        await showThemedAlert(
            "You must enter a save code before continuing.",
            "No Save Code Entered"
        );
        return;
    }

    try { const data=JSON.parse(decodeURIComponent(escape(atob(code.trim())))); applyChallengeSave(data); }
    catch(e){ await showThemedAlert("That code is invalid or damaged. Copy the entire save code and try again.","Could Not Load Save"); }
}
function showChallengeRecord(){
    const r=loadChallengeRecord();
    const best=r.bestRivalIndex ? `${r.bestRivalIndex} / 7 — ${CHALLENGE_RIVALS[r.bestRivalIndex-1]?.name || "The Seven"}` : "Not yet reached";
    const last=r.lastPlayed ? new Date(r.lastPlayed).toLocaleString() : "Never";
    showPopup("The Seven — Challenge Record", `<div style="text-align:left;line-height:1.8"><strong>Runs started:</strong> ${r.runsStarted}<br><strong>Runs completed:</strong> ${r.runsCompleted}<br><strong>Runs ended at Roz:</strong> ${r.runsFailed}<br><strong>Matches won:</strong> ${r.matchesWon}<br><strong>Matches lost:</strong> ${r.matchesLost}<br><strong>Furthest rival reached:</strong> ${best}<br><strong>Last outcome:</strong> ${r.lastOutcome}<br><strong>Last played:</strong> ${last}</div>`);
}
async function resetChallengeRecord(){ 
        const confirmed = await showThemedConfirm(
        "Reset the saved The Seven challenge record on this browser?",
        "Reset Challenge Record"
    );

    if (!confirmed) return; saveChallengeRecord(emptyChallengeRecord()); showChallengeRecord(); 
}
function clearChallengeMatchAlerts(){ const toast=document.getElementById("card-trigger-toast"); if(toast){toast.innerHTML="";toast.classList.remove("visible");toast.removeAttribute("aria-hidden");} }
async function challengeTestFinish(result){
    if(!challengeActive || !gameState || gameState.gameMode!=="solo" || gameState.gameEnded){ showPopup("Challenge Test Buttons","Start an active Solo Challenge match before using these test buttons."); return; }
    
    const confirmed = await showThemedConfirm(
        result==="win" ? "TEST: Instantly win this challenge match?" : "TEST: Instantly lose this challenge match?",
        "TEST: Instant Challenge Match Result"
    );

    if (!confirmed) return;

    if(result==="win"){ gameState.p2.transform=10; gameState.p1.transform=Math.min(9,Number(gameState.p1.transform)||0); }
    else { gameState.p1.transform=10; gameState.p2.transform=Math.min(9,Number(gameState.p2.transform)||0); }
    gameState.gameEnded=true;
    gameState.activePlayer=result==="win"?1:2;
    clearChallengeMatchAlerts(); updateUI(); presentFinishedGame();
}


const PLAYER_TRANSFORMATION_TAUNT_CHANCE = 0.25;

const TRANSFORMATION_TAUNTS = {
    Statue: {
        player: {
            TransformPlayer: [
                "Another step. Your skin is losing its warmth, and soon even your expression may be set in stone.",
                "Feel that stiffness? I'm not just changing how you look. I'm taking away the little movements you never thought about."
            ],
            PlayerAt5Transform: [
                "Halfway to stone. How long before that startled look gets carved permanently into your face?",
                "Five stages down. Your body is becoming an ornament, and you still think you can fight me."
            ],
            PlayerAt8Transform: [
                "Two steps left. Imagine standing there forever, unable to do a thing about what I've made of you.",
                "Almost a statue. That lovely defiant expression? I might just make it your permanent one."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My skin is hardening. If you think I'll stand here like some garden ornament, think again.",
                "Stone? You're trying to turn me into stone? I'll make sure you regret chipping away at me."
            ],
            AIAt5Transform: [
                "Halfway to stone, and I can already feel my movements stiffening. You're going to pay for this.",
                "My face feels like marble. I refuse to become some lifeless decoration for your amusement."
            ],
            AIAt9Transform: [
                "One step left. A statue, is it? Fine. Then I'll be the most intimidating thing in your collection.",
                "Perhaps stone isn't so bad. I could stand here forever looking down on you. You, on the other hand, will still be breakable."
            ]
        }
    },

    Cow_female: {
        player: {
            TransformPlayer: [
                "Another step toward horns, hooves, and a body built for the pasture. Starting to feel less human?",
                "Your features are changing, and that stubborn human pride won't stop a single hoof from growing."
            ],
            PlayerAt5Transform: [
                "Halfway to a cow. How does it feel knowing your old shape is being replaced by something so thoroughly different?",
                "Five stages in. That human silhouette is fading, and there's a whole new animal taking its place."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon those hooves will be yours, and your old shoes will be nothing but a memory.",
                "Almost a cow now. Keep glaring at me. I want you to remember exactly who did this."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Horns? Hooves? Oh, you are going to regret making this particular change to me.",
                "My body is getting heavier, my features are changing. You'd better enjoy this while you can."
            ],
            AIAt5Transform: [
                "Halfway to a cow. I can feel my balance changing, and I absolutely refuse to moo for you.",
                "My hands are changing, my feet are changing, and you're enjoying this far too much."
            ],
            AIAt9Transform: [
                "One step left. If I'm going to be a cow, I'll be the most formidable one in the herd.",
                "Fine. Let the horns come. You may have changed my shape, but don't mistake that for having broken me."
            ]
        }
    },

    Cow_male: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a bull. Those shoulders won't stay human, and neither will that face.",
                "Feel yourself getting heavier? You're being built into a bull, piece by piece. Keep telling yourself you're in control."
            ],
            PlayerAt5Transform: [
                "Halfway to a bull. Your strength is changing, your frame is broadening, and your old clothes are losing the argument.",
                "Five stages down. Soon you'll have horns to match that stubborn head of yours."
            ],
            PlayerAt8Transform: [
                "Two steps left. Imagine those horns in the mirror. Still want to tell me nothing has changed?",
                "Nearly a bull. Your human proportions are almost gone, and there's no bargaining with what's coming."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My frame is broadening. If you're trying to turn me into a bull, you had better be ready for the consequences.",
                "Horns? Hooves? I did not agree to this. You and I are going to have a very different conversation afterward."
            ],
            AIAt5Transform: [
                "Halfway to a bull, and my body feels like it's been rebuilt from the ground up. I'm not letting you enjoy this for long.",
                "My shoulders are enormous, my balance is different, and I'm starting to understand just how strong this body could be."
            ],
            AIAt9Transform: [
                "One step left. All right, let the horns finish growing. You may have made a bull, but you haven't made me tame.",
                "I can feel the strength in this body now. If this is what you've chosen for me, you'd better learn to respect it."
            ]
        }
    },

    Cat: {
        player: {
            TransformPlayer: [
                "Another step toward whiskers, soft paws, and a tail that will give away every little emotion.",
                "Your ears are changing, your features are sharpening. Soon you'll look like you've always belonged on four paws."
            ],
            PlayerAt5Transform: [
                "Halfway to a cat. I wonder how long before your ears start twitching whenever I speak.",
                "Five stages down. That new face is coming along nicely. Shame you can't claw your way out of this."
            ],
            PlayerAt8Transform: [
                "Two steps left. Better prepare for a tail that betrays your mood even when your face doesn't.",
                "Almost a cat. That human reflection is about to become somebody else's problem."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears! And what is happening to my face? You're going to regret giving me whiskers.",
                "A tail? Paws? Oh, that's just wonderful. I'll remember this when I get the chance to return the favor."
            ],
            AIAt5Transform: [
                "Halfway to a cat. My balance is different, and I can hear every little sound in this room. Annoying.",
                "I can feel fur spreading and my face changing. Stop looking so pleased with yourself."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll admit these ears suit me. That doesn't mean you've won anything but a very irritated cat.",
                "Perhaps this form has its advantages. Sharp senses, quick movements, claws. You might have made a mistake."
            ]
        }
    },

    Dog: {
        player: {
            TransformPlayer: [
                "Another step toward floppy ears, a muzzle, and a tail that may be rather less discreet than your face.",
                "Your features are growing canine. Keep your chin up while you still can."
            ],
            PlayerAt5Transform: [
                "Halfway to a dog. How long before that new nose starts noticing everything you'd rather ignore?",
                "Five stages down. Your old face is slipping away, and a muzzle is taking its place."
            ],
            PlayerAt8Transform: [
                "Two steps left. Those ears and that tail are almost yours to keep.",
                "Nearly a dog. You can glare all you want, but you can't glare away a wagging tail."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing. You're giving me a muzzle? Oh, this is going to be personal.",
                "I can feel my ears changing and something happening behind me. Don't you dare laugh."
            ],
            AIAt5Transform: [
                "Halfway to a dog. My hearing is sharper, my nose is changing, and I can smell your smugness from here.",
                "My hands aren't quite right, and my face is growing longer. This is a humiliating way to gain new senses."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll take the sharper senses and the speed. I'll still be the one deciding what to do with them.",
                "Perhaps a canine form isn't entirely a disadvantage. Just remember who taught this dog to bite back."
            ]
        }
    },

    Werewolf: {
        player: {
            TransformPlayer: [
                "Another step toward fur, fangs, and a face that won't look human for much longer.",
                "Your body is growing wilder. I wonder whether you'll recognize yourself when the claws come in."
            ],
            PlayerAt5Transform: [
                "Halfway to a werewolf. Your human features are losing ground to something far more feral.",
                "Five stages down. Fur, fangs, and a growing muzzle. Still think you can hold on to your old self?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that reflection will bare its fangs back at you.",
                "Nearly a werewolf. Your old life is looking awfully small from inside that changing body."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Fur? Fangs? Oh, you have made a very dangerous choice. I hope you know what you're doing.",
                "My face is changing, and I can feel claws coming in. You'd better hope I don't get used to them."
            ],
            AIAt5Transform: [
                "Halfway to a werewolf. My senses are sharpening, my body is changing, and I can barely ignore every sound around me.",
                "My hands are becoming claws, and my teeth feel wrong. I am not enjoying this. Not yet."
            ],
            AIAt9Transform: [
                "One step left. The claws feel natural now. That should worry you more than it worries me.",
                "Fine. Let the transformation finish. If I am going to be a werewolf, I will be the one everyone else fears."
            ]
        }
    },

    Fox: {
        player: {
            TransformPlayer: [
                "Another step toward fox ears, a pointed muzzle, and a tail that will be impossible to ignore.",
                "Your features are getting sharper and more vulpine. I wonder whether that clever human expression will survive."
            ],
            PlayerAt5Transform: [
                "Halfway to a fox. Your face is changing, your tail is coming in, and your old appearance is losing its grip.",
                "Five stages down. You are beginning to look like the creature I have planned for you."
            ],
            PlayerAt8Transform: [
                "Two steps left. Those ears and that bushy tail are nearly yours.",
                "Almost a fox. All that cleverness, and you still couldn't outsmart a transformation."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "A muzzle and a tail? You have some nerve. I will find a way to make you regret this.",
                "My ears are changing, and I can feel my face sharpening. You'd better hope I don't become as clever as I look."
            ],
            AIAt5Transform: [
                "Halfway to a fox. My balance is changing, and this tail is going to take some getting used to.",
                "My features are getting sharper. If you think that makes me less dangerous, you're a fool."
            ],
            AIAt9Transform: [
                "One step left. I'll admit the tail is impressive. Don't mistake appreciation for gratitude.",
                "Fine. A fox it is. Quick, clever, and difficult to catch. Perhaps you should have thought this through."
            ]
        }
    },

    Horse: {
        player: {
            TransformPlayer: [
                "Another step toward a mane, hooves, and a frame that won't fit through life the way it used to.",
                "Your legs and body are changing. That human stride is on its way out."
            ],
            PlayerAt5Transform: [
                "Halfway to a horse. Your balance is shifting, your frame is changing, and those human proportions are fading.",
                "Five stages down. Soon those feet won't be much use for your old shoes."
            ],
            PlayerAt8Transform: [
                "Two steps left. You can practically feel those hooves replacing your feet.",
                "Nearly a horse. I hope you weren't too attached to your old way of walking."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My legs! What are you doing to my legs? This body is changing far too quickly.",
                "A mane? Hooves? I'll make you regret every stage of this transformation."
            ],
            AIAt5Transform: [
                "Halfway to a horse. My balance is completely different, and my legs are becoming something else.",
                "My frame is growing, my feet are changing, and I am not about to let you enjoy my discomfort."
            ],
            AIAt9Transform: [
                "One step left. All right, this body has power. I can work with power.",
                "A horse, then. Strong, fast, and hardly helpless. You may have changed me, but you haven't made me obedient."
            ]
        }
    },

    Pig: {
        player: {
            TransformPlayer: [
                "Another step toward a snout, floppy ears, and a body that looks less and less like your old one.",
                "Your nose is changing. That familiar face is disappearing, and there's nothing dignified about what comes next."
            ],
            PlayerAt5Transform: [
                "Halfway to a pig. Your face is changing, and that human nose is losing the battle.",
                "Five stages down. You can be furious all you like; it won't stop those ears from changing."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon the snout will be unmistakable.",
                "Almost a pig. I wonder how you'll feel when the mirror confirms what I've done."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My nose! No. Absolutely not. You are going to pay for this indignity.",
                "I can feel my face changing. You have some idea of what you've started, don't you?"
            ],
            AIAt5Transform: [
                "Halfway to a pig. My face feels wrong, my balance is changing, and you're enjoying every second.",
                "Five stages. I refuse to let a snout be the most memorable thing about me."
            ],
            AIAt9Transform: [
                "One step left. Fine. I can survive being a pig. Can you survive what I do next?",
                "If this is the body I've been given, I'll wear it with more dignity than you deserve."
            ]
        }
    },

    Gender_male: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a woman. Your face, your silhouette, your voice—none of it is beyond my reach.",
                "Your body is shifting toward a woman's form. Keep insisting you're unchanged; the mirror will settle the argument."
            ],
            PlayerAt5Transform: [
                "Halfway to becoming a woman. Your features and proportions are changing, and denial won't make them revert.",
                "Five stages down. Your old masculine outline is giving way to something unmistakably feminine."
            ],
            PlayerAt8Transform: [
                "Two steps left. That woman in the mirror is almost you, whether you're ready to admit it or not.",
                "Nearly transformed. You can cling to your old identity all you like; your changing reflection tells a different story."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing, my proportions are shifting—you're turning me into a woman. I will remember this.",
                "My voice sounds different. My body feels different. Don't you dare mistake my surprise for surrender."
            ],
            AIAt5Transform: [
                "Halfway to becoming a woman. My shape is changing in ways I can no longer dismiss. This is infuriating.",
                "My features are softer, my silhouette is changing, and my old clothes fit differently. I hate that you can see it."
            ],
            AIAt9Transform: [
                "One step left. I can see the woman I'm becoming now. That doesn't mean you've won my respect.",
                "Fine. Let the transformation finish. I'll decide what kind of woman I become, not you."
            ]
        }
    },

    Gender_female: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a man. Your features and proportions are shifting, and there's no stopping them now.",
                "Your body is changing toward a man's form. That old reflection is slipping away, whether you like it or not."
            ],
            PlayerAt5Transform: [
                "Halfway to becoming a man. Your silhouette is changing, and your old features are losing ground.",
                "Five stages down. That familiar face is changing into someone you may barely recognize."
            ],
            PlayerAt8Transform: [
                "Two steps left. The man in the mirror is almost you now.",
                "Nearly transformed. You can protest all you want; your reflection won't be persuaded."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing, my frame feels different—you're turning me into a man. This is not over.",
                "My voice, my proportions, my features—everything is shifting. I won't let you define who I am."
            ],
            AIAt5Transform: [
                "Halfway to becoming a man. My body is changing in ways I can feel with every movement.",
                "My frame is changing, and my reflection is becoming harder to recognize. I am furious with you."
            ],
            AIAt9Transform: [
                "One step left. I can see the man I'm becoming. I'll decide what that means for me.",
                "Fine. Let the change finish. You may have changed my body, but you don't get to own my identity."
            ]
        }
    },

    Puppet: {
        player: {
            TransformPlayer: [
                "Another step toward a body built with joints instead of freedom. I wonder how much control you'll have left.",
                "Your movements are becoming less natural. Soon you'll look like something made to be handled."
            ],
            PlayerAt5Transform: [
                "Halfway to a puppet. How does it feel when your body starts moving like it was designed by someone else?",
                "Five stages down. Your joints are changing, your movements feel strange, and you still can't stop me."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon every movement will remind you what I've turned you into.",
                "Almost a puppet. Imagine seeing those joints in the mirror and knowing exactly who made them."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My joints feel wrong. Are you turning me into a puppet? You have no idea what you're risking.",
                "My movements are changing. I refuse to become some toy you can show off."
            ],
            AIAt5Transform: [
                "Halfway to a puppet. My limbs move differently, and I hate how aware I am of every joint.",
                "Five stages. I can feel my body becoming something crafted rather than born. This is deeply unsettling."
            ],
            AIAt9Transform: [
                "One step left. If I become a puppet, I'll be the one pulling the strings.",
                "Fine. Let the joints settle. A puppet can still have a mind, and mine is already plotting."
            ]
        }
    },

    Bunny: {
        player: {
            TransformPlayer: [
                "Another step toward long ears, a fluffy tail, and legs that won't look quite human for much longer.",
                "Your ears are changing. That new silhouette is going to be very hard to hide."
            ],
            PlayerAt5Transform: [
                "Halfway to a bunny. Those ears are becoming part of you, and your old appearance is slipping away.",
                "Five stages down. I wonder how you'll feel when that little tail finally appears."
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly all fluff, ears, and rabbit features. How charmingly irreversible.",
                "Almost a bunny. You can keep glaring, but those long ears are here to stay."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are growing? And what is happening to my legs? You're going to regret this.",
                "A tail? Long ears? I am not going to let you enjoy this without consequences."
            ],
            AIAt5Transform: [
                "Halfway to a bunny. My balance is changing, and my legs feel ready to spring without asking me.",
                "Five stages. These ears are impossible to ignore. I swear, if you laugh..."
            ],
            AIAt9Transform: [
                "One step left. All right, the new legs have some advantages. Don't think I've forgiven you.",
                "Fine. A bunny. Quick, alert, and not nearly as helpless as you seem to think."
            ]
        }
    },

    Otter: {
        player: {
            TransformPlayer: [
                "Another step toward sleek fur, whiskers, and paws made for a life far removed from your old one.",
                "Your features are becoming more otter-like. I wonder how long before that new face feels familiar."
            ],
            PlayerAt5Transform: [
                "Halfway to an otter. Your whiskers and paws are coming along nicely. Still think this is just a game?",
                "Five stages down. You're losing your human shape and gaining a very different set of instincts."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that sleek little otter face will be unmistakably yours.",
                "Almost an otter. That old reflection is nearly gone, and I rather like the replacement."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Whiskers? Fur? You're turning me into an otter. I hope you're ready for the consequences.",
                "My paws are changing, and my face feels strange. You will answer for this."
            ],
            AIAt5Transform: [
                "Halfway to an otter. My body feels sleeker, my paws are different, and I am trying very hard not to panic.",
                "Five stages. My senses are changing, and this new body is becoming harder to ignore."
            ],
            AIAt9Transform: [
                "One step left. The sleek build and nimble paws might actually be useful. I still intend to win.",
                "Fine. An otter it is. If I have to adapt, I'll adapt better than you ever could."
            ]
        }
    },

    Eevee: {
        player: {
            TransformPlayer: [
                "Another step toward fluffy fur, huge ears, and an Eevee face. Your old look is fading fast.",
                "That new fur is coming in nicely. Soon you'll be unmistakably an Eevee, whether you find that cute or not."
            ],
            PlayerAt5Transform: [
                "Halfway to Eevee. The ears, the fur, the changing face—how much of your old self do you still recognize?",
                "Five stages down. You're becoming something adorable, and I know that isn't necessarily comforting."
            ],
            PlayerAt8Transform: [
                "Two steps left. Almost an Eevee. Your old reflection is about to become a distant memory.",
                "Nearly there. All that fluffy fur, those ears, that tail—you're going to look nothing like you did before."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Fluffy fur and oversized ears? You're turning me into an Eevee. I am not amused.",
                "My face is changing, my ears are enormous, and I swear you are enjoying this far too much."
            ],
            AIAt5Transform: [
                "Halfway to Eevee. I can feel the fur, and these ears make it impossible to ignore the changes.",
                "Five stages. I look ridiculous, I feel different, and I'm still going to beat you."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll admit the fur is soft. You are still absolutely insufferable.",
                "All right. An Eevee. Cute, quick, and quite capable of ruining your day."
            ]
        }
    },

    Squirrel: {
        player: {
            TransformPlayer: [
                "Another step toward twitching ears, nimble paws, and that big fluffy tail. Your old silhouette is disappearing.",
                "Your body is becoming squirrel-like. I wonder how you'll feel when that tail follows every movement."
            ],
            PlayerAt5Transform: [
                "Halfway to a squirrel. Those ears and paws are changing, and your human habits are starting to look out of place.",
                "Five stages down. You are halfway to a fluffy tail and a very different reflection."
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly a squirrel, and that tail is going to be very difficult to ignore.",
                "Almost there. Your human shape is nearly gone. Better get used to those paws."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are changing, and something is happening to my tailbone. Don't you dare laugh.",
                "Paws? A fluffy tail? You're turning me into a squirrel. This is a new low."
            ],
            AIAt5Transform: [
                "Halfway to a squirrel. My balance is changing, and I can feel that tail growing behind me.",
                "Five stages. These paws are nimble, these ears twitch at everything, and I'm still furious with you."
            ],
            AIAt9Transform: [
                "One step left. I'll admit the balance and agility are impressive. I'll still make you regret this.",
                "Fine. A squirrel. Quick, alert, and perfectly capable of climbing somewhere you can't follow."
            ]
        }
    },

    Robot: {
        player: {
            TransformPlayer: [
                "Another step toward metal, machinery, and a body that answers to a very different set of rules.",
                "Your body is becoming mechanical. I wonder how long before you stop recognizing your own movements."
            ],
            PlayerAt5Transform: [
                "Halfway to a robot. Your human body is being replaced piece by piece, and you can feel every change.",
                "Five stages down. Metal where there was flesh, mechanisms where there were muscles. Still feel in control?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon your reflection will be all machine, and your old body will be gone.",
                "Nearly a robot. Imagine looking down and realizing that almost nothing about your body is organic anymore."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Metal? Machinery? What have you done to my body? I'll dismantle whatever plan you have next.",
                "My limbs feel mechanical. You're turning me into a machine, and I am not going quietly."
            ],
            AIAt5Transform: [
                "Halfway to a robot. My movements feel different, and I can feel mechanisms replacing what used to be natural.",
                "Five stages. I am becoming metal and machinery, and I refuse to let you reduce me to a device."
            ],
            AIAt9Transform: [
                "One step left. If I'm becoming a machine, then I'll make this new body work for me.",
                "Fine. Let the transformation finish. A machine can be precise, relentless, and very difficult to stop."
            ]
        }
    },

    Doll: {
        player: {
            TransformPlayer: [
                "Another step toward a polished face, carefully crafted features, and a body that looks made rather than born.",
                "Your skin and features are changing. Soon you'll look like a doll somebody else designed."
            ],
            PlayerAt5Transform: [
                "Halfway to a doll. Your face is becoming smoother, your movements feel different, and your old appearance is fading.",
                "Five stages down. You're being remade into something that looks carefully crafted. How does that feel?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that doll-like face will be unmistakably yours.",
                "Almost a doll. Your old reflection is nearly gone, replaced with something polished and unfamiliar."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My skin feels different. You're turning me into a doll? You will regret this.",
                "My features are changing, and my movements feel strange. I refuse to become a toy for your amusement."
            ],
            AIAt5Transform: [
                "Halfway to a doll. My face is changing, and every movement feels unfamiliar. I hate that you can see it.",
                "Five stages. I can feel myself becoming something crafted, something carefully made. This is unnerving."
            ],
            AIAt9Transform: [
                "One step left. If I'm going to look like a doll, I'll be the one deciding what expression I wear.",
                "Fine. Let the finish settle. A doll can still be dangerous, and I intend to prove it."
            ]
        }
    },

    Dragon: {
        player: {
            TransformPlayer: [
                "Another step toward scales, claws, horns, and a shape far more formidable than your old one.",
                "Your body is growing draconic. I wonder whether you'll recognize the creature staring back at you."
            ],
            PlayerAt5Transform: [
                "Halfway to a dragon. Those scales and claws aren't decoration; they're signs of how thoroughly you're changing.",
                "Five stages down. Your old body is losing ground to something ancient, powerful, and decidedly less human."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon the mirror will show a dragon, not the person who started this match.",
                "Nearly a dragon. Those horns and scales are almost complete. You'd better get used to the new silhouette."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Scales? Claws? You're turning me into a dragon. You may have just made a spectacular mistake.",
                "My body is growing heavier, my features are changing. If I get wings, you'd better start running."
            ],
            AIAt5Transform: [
                "Halfway to a dragon. I can feel the scales, the claws, the power building in this body. You should be worried.",
                "Five stages. My face is changing, my body is growing formidable, and I'm beginning to see the advantages."
            ],
            AIAt9Transform: [
                "One step left. I can feel the power in this form. If you finish the job, you may not like what you've created.",
                "Fine. A dragon. Let the transformation finish. I intend to make this body legendary—and you very sorry."
            ]
        }
    },

    Bat: {
        player: {
            TransformPlayer: [
                "Another step toward oversized ears, leathery wings, and a silhouette that won't pass for human.",
                "Your body is becoming bat-like. I wonder how you'll feel when those wings start to feel like your own."
            ],
            PlayerAt5Transform: [
                "Halfway to a bat. Your ears and body are changing, and your old shape is getting harder to recognize.",
                "Five stages down. Imagine those wings unfolding where your arms used to be. Still feeling confident?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly a bat, with wings and ears that make your new form impossible to mistake.",
                "Almost there. Your human silhouette is nearly gone. Better prepare for the mirror."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are changing—and are those wings? You have a lot of nerve doing this to me.",
                "My body feels different, and something is growing from my back. I am going to remember every second of this."
            ],
            AIAt5Transform: [
                "Halfway to a bat. My hearing is changing, and these wings are making my balance completely unfamiliar.",
                "Five stages. My body is changing in ways I never asked for. Stop looking so pleased with yourself."
            ],
            AIAt9Transform: [
                "One step left. The wings are impressive, I'll grant you that. Now let's see if you can handle what I've become.",
                "Fine. A bat. Sharp senses, wings, and a very good memory for the person responsible."
            ]
        }
    }
};




const CHALLENGE_TAUNTS = {
    TransformPlayer: ["There you go. One more step away from who you were.", "Feel that shift? I barely had to try.", "Your old shape is already starting to feel like a memory.","There you go… another piece of the old you slipping away under my hands.","Feel that shift? Your body is learning its new shape faster than your mind can argue.","You’re starting to look like you belong to someone. Good."],
    AIGetsTransformed: ["Hey! That wasn't part of my plan!", "Careful. I can still turn this around… and when I do, you’ll feel it.", "Enjoy that little victory while it lasts. Bodies remember who pushed them."],
    PlayerIsObedient: ["Good. You followed the track exactly where I wanted.", "That was almost effortless. Thank you for cooperating.", "A little suggestion, and you simply obey.","A little pressure and you simply… yield. I like that."],
    AIIsObedient: ["I... did not mean to do that.", "A temporary lapse. Don't get comfortable.", "You got lucky. I won't make that mistake twice."],
    BigRollAI: ["Six dice, and the odds still adore me.", "Did you see that roll? Try keeping up.", "Now THAT is how you make the dice behave."],
    PlayerAt5Transform: ["Halfway there. Starting to recognize yourself less?", "Five stages down. You can still pretend you're in control.", "You're changing faster than you can deny it."],
    PlayerAt8Transform: ["Eight stages. This is where the panic usually starts.", "Almost finished. Try to enjoy the last few moments of the old you.", "Two more steps and you’ll be mine to reshape completely."],
    AIAt5Transform: ["Halfway transformed? Fine. I'm still in this.", "Five stages? That's a setback, not a defeat.", "I'm not done yet. Not even close."],
    AIAt9Transform: ["One more and I lose. I refuse to make it easy.", "Nine? No. I am NOT becoming your victory lap.", "All right, you've got my attention. Don't waste it."]
};
const CHALLENGE_RIVAL_TAUNTS = {
    Roz: {
        TransformPlayer: [
            "Whoa, you're changing! This is kind of amazing, actually. Do you think you'll get a cool tail, too?",
            "Another step! Eee! I wonder what you'll look like at the end! I hope it's something fluffy!",
            "You're changing right before my eyes! Is it rude to ask if I can take a picture? For science! And also because it’s really cute.",
            "Ooh, progress! Your old shape is getting all blurry. I hope the new one likes head-pats.",
            "Look at you go! This is like a surprise makeover where your body does whatever it wants… and I get to watch."
        ],

        AIGetsTransformed: [
            "Whoa! My ears are getting bigger! Wait, are those actual Eevee ears?! Oh my gosh, they're ADORABLE!",
            "Oh! I've got fur! Soft, fluffy fur! ...Hang on, why am I petting my own arm? This is so weird!",
            "My feet are getting all tiny and paw-shaped! How am I supposed to wear sneakers now? Actually, do Eevees even need sneakers?",
            "Eee! I think I'm growing a big fluffy tail! This is either a disaster or the best thing that's ever happened to me!",
            "Okay, plot twist! I'm turning into an Eevee! I mean, I don't know what that means for my future, but I suddenly really want a berry."
        ],

        PlayerIsObedient: [
            "Aww, you’re listening so well! Should I reward you with head-pats or more changes?",
            "See? Following instructions can feel really nice. Or weird. Usually both!",
            "Yay, teamwork! You’re doing what I say and I’m getting all warm and happy about it.",
            "Ooh, you’re being so cooperative. I wonder if this is how trainers feel when their Pokémon just… melts for them.",
            "That’s it. Just relax and go with it. That’s my strategy for everything, and look how far it’s gotten me!"
        ],

        AIIsObedient: [
            "Oops! Did I just do what you said? Huh. Weird. Kind of tingly too.",
            "My brain said 'don't do it,' but the rest of me apparently voted yes. Democracy is weird!",
            "Okay, so I may have followed your suggestion without thinking. In my defense, thinking is hard!",
            "Wait, why did I agree to that?! Oh well! I'm sure there's a perfectly good explanation. Probably. Maybe.",
            "I was going to resist that, but then I got distracted wondering if Eevees like belly rubs. What were we talking about?",
			"Wait, that wasn’t me deciding that. My body just… went along with it. Rude.",
        ],

        BigRollAI: [
            "DID YOU SEE THAT?! I'm amazing! I mean, probably! The dice definitely think so!",
            "Whoa-ho-ho! That roll was incredible! I should put a little crown on these dice!",
            "YES! Nailed it! I have no idea how I did that, so naturally I'm going to take full credit!",
            "That was SO COOL! If I could high-five the dice, I totally would. Do dice have hands?",
            "Did you see that? Even the dice want to play with me!"
        ],

        PlayerAt5Transform: [
            "Halfway there! You’re starting to look like you might actually enjoy this. Do you?",
            "Five stages down. Your old self is getting softer around the edges. Fluffy edges, maybe?",
            "You’re changing faster than you can deny it. I think that’s kind of hot. Is that allowed?",
            "Wow, you're changing so fast! It's like one of those time-lapse videos, except I can't stop watching!",
            "Halfway there! I would offer you some encouragement, but I'm not sure that would be very helpful right now. So... good luck?"
        ],

        PlayerAt8Transform: [
            "EIGHT?! Wow! You're almost done! Should I start planning the welcome party for your new self?",
            "Oh my gosh, only two stages left! This is so exciting! For me, anyway. Are you okay? You don't look okay.",
            "Eight stages! You’re running out of room to pretend this isn’t happening to you.",
            "Almost finished. Try to enjoy the last few moments of the old you… or don’t. Either works for me.",
            "Two more steps. You can practically feel the new shape waiting. Exciting, right?"
        ],

        AIAt5Transform: [
            "I’m not done yet! Even if my ears are bigger and my thoughts are fluffier.",
            "My ears are getting huge, my feet are turning into paws, and I think my tail is fluffier than my hair ever was. Is this normal? Who am I asking? I don't know any Eevees!",
            "Five stages already?! I'm half girl, half Eevee, and one hundred percent confused! But, um... the fur is actually really soft.",
            "Oh wow, my face is changing, too! I think I have a little Eevee nose! I keep trying to boop it, but I can't tell if I'm doing it right!",
            "Okay, no panicking! I'm just growing fur, paws, big ears, and a tail. Totally ordinary Tuesday stuff! ...Right?"
        ],

        AIAt9Transform: [
            "One more and I lose! I refuse to become a soft, obedient little Eevee just because you want me to!",
            "Nine stages?! No no no. I am still me. Mostly. Sort of. Help.",
            "Okay you’ve got my full attention and also my full panic. Don’t you dare finish this.",
            "Okay, I have a confession. I thought becoming an Eevee would be weird, but now I kind of love it! My paws are adorable, and my tail is AMAZING!",
            "Is it just me, or am I getting cuter by the minute? Because I just caught my reflection, and OH MY GOSH. I want to hug myself!",
            "One step left! I used to be worried about all this, but now I really want to know what it's like to be a real Eevee! Do you think I'll be able to do a little Eevee cry?",
            "You know what? I'm ready! Bring on the final stage! I want fluffy ears, a big bushy tail, and maybe a berry or two. Do Eevees like berries? I'm going to find out!"
        ]
    },
    Zixuan: {
        TransformPlayer: [
            "The conversion has advanced another stage. Your physical properties are diverging further from the original baseline.",
            "Interesting. A measurable change in your structure, accompanied by a predictable increase in resistance. The correlation is becoming quite clear.",
            "Feel that? The new shape settling in like it was always meant to. Elegant, isn’t it?",
            "You’re starting to look like a finished piece. I do enjoy watching a body learn its place.",
            "An additional stage of conversion. Fascinating how quickly a stable biological system can become something entirely different."
        ],

        AIGetsTransformed: [
            "Another stage toward becoming a rag doll. My skin feels different, almost like fabric. I need to determine whether this is a structural or merely sensory change.",
            "My joints are becoming strangely flexible, and I suspect my body is beginning to resemble a sewn construction. The implications are deeply concerning.",
            "I can feel something changing beneath my skin. If that sensation is stuffing, then the transformation is altering my internal structure as well. Remarkable—and alarming.",
            "My hands are becoming softer, and I think I can feel seams forming along my body. I would find this fascinating if I weren't the specimen.",
            "Unexpected result. My body is adopting the properties of a rag doll, and my usual methods of observation are severely compromised when the equipment is me."
        ],

        PlayerIsObedient: [
            "Compliance observed. The response is consistent with the hypothesis that resistance decreases under the appropriate conditions.",
            "You followed the suggestion. A useful demonstration of how behavioral variables can influence the transformation process.",
            "Excellent. The subject is cooperating. This should make the next phase considerably easier to observe.",
            "Good. You responded exactly as predicted. Compliance is such a clean sensation.",
            "You moved where I directed. Efficient. Attractive, even.",
            "A little pressure and you yield so neatly. I appreciate the precision."
        ],

        AIIsObedient: [
            "I followed the instruction despite my intention to resist. An interesting demonstration of the gap between conscious intent and observed behavior.",
            "Compliance recorded. I would prefer to be the researcher rather than the subject, but the data is undeniably useful.",
            "My response was inconsistent with my stated objective. I shall need to account for that variable in any subsequent analysis.",
            "I appear to have accepted the suggestion. I dislike the result, although I cannot deny that the mechanism warrants further investigation.",
            "The experimenter has become an unexpectedly cooperative subject. I would appreciate it if the experimenter could regain control of the situation."
        ],

        BigRollAI: [
            "An exceptional result. The observed outcome falls well within the favorable end of the probability distribution. I shall enjoy this while it lasts.",
            "Remarkable. Multiple favorable variables have aligned. It would be irresponsible not to exploit this opportunity.",
            "A highly efficient roll. If the remaining trials proceed at this rate, the results will exceed my initial projections.",
            "The probability of such a useful outcome was modest, but not negligible. I am pleased to see that the dice occasionally reward a sound experimental design.",
            "Excellent. The data is favorable, the hypothesis remains viable, and my opponent has just supplied another useful demonstration."
        ],

        PlayerAt5Transform: [
            "Stage five. Half of the conversion is complete, and your original physical characteristics are becoming an increasingly unreliable reference.",
            "Halfway rewritten. The old outline is still visible, but fading. Beautiful progress.",
            "Fifty percent complete. Your current condition is an interesting intermediate state, though I doubt you find it as informative as I do.",
            "Five stages down. I recommend reconsidering your strategy. The evidence suggests your original form is becoming progressively more difficult to preserve.",
            "The midpoint has been reached. I would be interested in measuring your current resistance, but I suspect the result would be rather discouraging.",
			"You’re changing faster than denial can keep up. Good."
        ],

        PlayerAt8Transform: [
            "Stage eight. Only two increments remain before the conversion reaches its terminal state. The available recovery window is becoming negligible.",
            "Eighty percent complete. Your original form is now a diminishing component of the overall system. The conclusion is approaching rapidly.",
            "The final form is almost visible. Do you feel it waiting under your skin?",
            "Almost complete. The last scraps of the previous version are becoming… decorative.",
            "The process is nearing its endpoint. I would encourage you to reconsider your position, although I suspect the relevant variables are no longer under your control.",
            "Stage eight confirmed. If this were a controlled trial, I would already be preparing the final assessment. Unfortunately for you, the experiment is still running."
        ],

        AIAt5Transform: [
            "Five stages complete. My skin is taking on the texture of fabric, and my joints feel disturbingly pliable. I am beginning to question the safety of this experiment.",
            "Halfway to becoming a rag doll. My body feels softer, and I suspect something resembling stuffing is forming beneath the surface. I would very much like to reverse these findings.",
            "The transformation has reached fifty percent. I can feel changes in my limbs and torso, as though my body is being assembled from fabric and thread. This is no longer an abstract hypothesis.",
            "My flexibility has increased beyond normal physiological limits, and I think I can feel seams along my arms. The data is compelling, but I am not enjoying being the source.",
            "Five stages. I initially regarded this as an opportunity to study an unusual phenomenon. Now I am beginning to understand why an ethics committee would insist on a willing subject."
        ],

        AIAt9Transform: [
            "Stage nine. My body is almost entirely that of a rag doll. Oddly, the softness is rather pleasant, and I find myself curious about the final result.",
            "One stage remains. My limbs bend with remarkable ease, and the fabric-like texture no longer feels entirely foreign. I may have underestimated the advantages of this form.",
            "The conversion is nearly complete. I can feel the stuffing shifting when I move, and while the sensation is peculiar, I must admit it is fascinating rather than unpleasant.",
            "Nine stages complete. I once considered the loss of my original body an unacceptable experimental outcome. Now I find myself wondering what additional properties the finished form will possess.",
            "One final stage. The seams, the softness, the unusual flexibility—all of it is becoming strangely familiar. I believe I am ready to observe the completed transformation from the inside."
        ]
    },
    Fable: {
        TransformPlayer: [
            "And that's another step! Now, class, what have we learned about the consequences of resisting a perfectly good lesson?",
            "Progress! I do hope you're paying attention. This is an excellent demonstration of how quickly things can change when you least expect them.",
            "Another step toward your new self. Don't look so worried, dear. Change can be an excellent teacher, even when the lessons are rather unconventional.",
            "Well done, Fable. Oh, sorry, I meant well done, me! It's so easy to get distracted when one's opponent is providing such a fascinating case study.",
            "One more step! If this were a classroom, I'd be writing your progress report. I'm afraid the comments section would be rather extensive.",
			"Ooh, look at you changing. Softening. Getting a little wetter around the edges in all the best ways.",
            "Another step under. Your body is learning to flow where I push it. Slippery, isn’t it?",
            "You’re starting to look like something I could keep. Something that would feel good to hold."
        ],
        AIGetsTransformed: [
            "Oh, goodness! My hands are changing. I believe my fingers are becoming webbed. This is certainly not covered in the curriculum!",
            "My face feels different, and I rather suspect whiskers are coming in. I am going to need a very long staff meeting to process this.",
            "An otter. I'm becoming an otter! I teach children about the natural world, but I never expected to become part of the lesson myself.",
            "My feet feel terribly strange. If these are becoming proper otter paws, I shall have to reconsider my entire approach to footwear.",
            "Well, this is an unexpected development. I always encouraged my students to embrace new experiences, but I did rather assume I'd remain human while doing so.",
			"Hey— my shape is getting slippery and I didn’t ask for this!",
            "Okay that change felt… really good actually. Rude of you to notice."
        ],
        PlayerIsObedient: [
            "There we are, dear. Sometimes it's easier to learn when we stop arguing with the lesson and start listening.",
            "Very good! I knew you could follow instructions. Now, let's see if we can make a little more progress, shall we?",
            "That's the spirit! There's no shame in accepting a little guidance. Even the most stubborn pupils can surprise themselves.",
            "Eyes forward, take a deep breath, and listen carefully. That's it. My, what a wonderfully attentive student you've become.",
            "Excellent cooperation! I'm afraid your homework tonight will involve a rather substantial amount of personal transformation.",
			"Mmm. You followed so nicely. I could get used to that.",
            "That was smooth. Almost like you wanted to.",
            "A little pressure and you just… give. I like watching that."
        ],
        AIIsObedient: [
            "Oh! I seem to have followed that instruction without thinking. Well, even teachers can have an off day.",
            "That was terribly unprofessional of me. I cannot very well teach a lesson about independent thinking while obeying every suggestion I hear!",
            "I know perfectly well what you're doing. So why, precisely, am I doing exactly as you say? This is most irregular.",
            "Right. Let's take a moment, collect ourselves, and remember that I am the educator here. Although I seem to be a rather poor student today.",
            "I shall be addressing this lapse in judgment after class. Assuming, of course, that I can still find my classroom by then."
        ],
        BigRollAI: [
            "Oh, splendid! That's what I call an exemplary performance. Full marks for me!",
            "Now, class, observe carefully. This is what happens when preparation meets opportunity. Well, mostly opportunity. And a little luck.",
            "Outstanding! I would put that result on the classroom wall if I weren't so busy using it to beat you.",
			"Did you see that roll? Even chance wants to get wet with me.",
            "Well, would you look at that! I believe I've just earned myself a gold star. Perhaps two.",
            "A truly excellent roll! And you know what we do with excellent results, don't you? We build on them!"
        ],
        PlayerAt5Transform: [
            "Halfway there! Now, I know this isn't quite the learning experience you signed up for, but there's still time to turn things around.",
            "Five stages completed. I'd call that a significant milestone, though I suspect you'd prefer a different sort of achievement certificate.",
            "We're at the halfway point, dear. Perhaps it's time to stop doodling in the margins and pay attention to the rather important matter at hand.",
            "Fifty percent! Not quite a passing grade if your goal was to remain unchanged, I'm afraid. Let's see whether you can improve your performance.",
            "Oh, my. Halfway transformed already! I do hope you're learning something from all this. Though perhaps not quite as much as I am.",
			"Halfway there. You’re starting to feel less solid and more… available.",
            "Five stages down. The old you is getting harder to hold onto. Fun, right?",
            "You’re changing so easily now. Almost like you were made for it."
        ],
        PlayerAt8Transform: [
            "Eight stages! Only two more, dear. I'm afraid extra credit isn't going to save you this time.",
            "Now we're getting very close to the final lesson. I suggest you pay attention, because there may not be an opportunity for a retake.",
            "Oh, dear. Eight out of ten. If this were an examination, I'd be preparing the results envelope already.",
            "Two stages to go! I would offer you some encouraging words, but I suspect we'd both know I was being terribly insincere.",
			"Almost finished. The last pieces of the old shape are getting soft and easy.",
            "Two more steps and you’ll be something I can keep. Something that fits."
        ],
        AIAt5Transform: [
            "Halfway to becoming an otter! My fingers are webbed, my face is changing, and I can feel fur where there absolutely should not be fur. I need to sit down.",
            "Five stages already? My feet are changing shape, and I believe my ears are moving. I shall have to update my lesson plans considerably.",
            "I can feel whiskers growing on my face! How am I supposed to maintain classroom discipline when I look like a particularly distressed river creature?",
            "My body is becoming sleeker, my hands are changing, and my clothes are fitting rather oddly. I always told my pupils to expect the unexpected, but this is ridiculous!",
            "I am halfway through becoming an otter. An OTTER! I teach children to respect wildlife, not to become the wildlife. There is a rather important distinction!"
        ],
        AIAt9Transform: [
            "One stage left! My whiskers are rather charming, actually, and these little paws are surprisingly nimble. Oh, dear. I believe I'm warming to this.",
            "Well, I'll be! My fur is lovely, my new shape is wonderfully sleek, and I have a sudden, inexplicable desire to go swimming. I wonder whether there's a river nearby?",
            "Nine stages complete! I caught myself wiggling my nose in the mirror, and then I did it again because it was rather adorable. This is most undignified. I may do it a third time.",
            "I always told my pupils that learning opens new doors. I never imagined one of those doors would lead to being an otter, but I must admit, the prospect of splashing about is growing on me!",
            "One more step, and I'll be a proper otter! You know, dear, I think I've finally found the lesson in all this. Sometimes a little transformation is just what one needs. Now, where did I put my imaginary swimming goggles?"
        ]
    },
    Mark: {
        TransformPlayer: [
            "Progress confirmed. Your current configuration is becoming increasingly difficult to maintain.",
            "Another successful operation. I would explain the process, but your system appears to be running on intuition rather than logic.",
            "One step closer to a completely different you. The transition is proceeding more smoothly than your decision-making.",
            "State updated. Your resistance remains measurable, but its practical value is declining.",
            "Fascinating. Apply the correct input at the correct moment, and even a stubborn system can be persuaded to rewrite itself.",
			"Feel that shift? Your body is choosing a different truth. I’m just helping it along.",
            "You’re starting to look like someone who knows what they are. Or what they’re becoming."
        ],
        AIGetsTransformed: [
            "Another step toward becoming a woman. I did not authorize this change to my physical specifications.",
            "Female body configuration detected. I would like to remind the system that this feature was not in my original requirements.",
            "My body is being rewritten, and apparently the new version is going to be female. I would appreciate access to the change log.",
            "Wonderful. Another step closer to becoming a woman. I spend years optimizing systems, and now I can't even maintain my own original architecture.",
            "My physical parameters are changing in a distinctly feminine direction. I am trying to remain objective, but this is a rather intrusive update.",
            "I appear to be losing the ability to specify my own biological configuration. This is precisely why I distrust undocumented processes.",
            "Unexpected state change detected. I refuse to believe that becoming a woman is the optimal solution to whatever problem these dice think I have.",
			"Interesting. The new shape fits better than it should. I will not thank you for that."
        ],
        PlayerIsObedient: [
            "There we are. The correct suggestion, delivered at the correct moment. Human decision-making really is a fascinating interface.",
            "Compliance confirmed. No need to force the issue when a well-timed prompt does the work for you.",
            "Your defenses have entered compatibility mode. Shall we proceed with the next phase of the update?",
            "I predicted this response three turns ago. You may call it hypnosis; I call it understanding the system requirements.",
            "Excellent. Your objections are still present, but they no longer appear to have administrative privileges.",
			"Good. You moved when I told you to. Bodies are honest like that.",
            "That was clean. You felt it, didn’t you? The little give.",
            "A little pressure and the old identity slips. I like watching that happen."
        ],
        AIIsObedient: [
            "I followed the suggestion. For the record, an action performed under compromised conditions should not count as informed consent.",
            "Compliance logged. I will be conducting a thorough investigation into why my own safeguards failed to engage.",
            "That response was not part of my strategy. I would like to roll back the last thirty seconds, please.",
            "My behavior has been modified without a satisfactory explanation. I am filing this under unacceptable system dependencies.",
            "I appear to have accepted instructions that I had every intention of rejecting. There is a rather serious flaw in this implementation."
        ],
        BigRollAI: [
            "Now that is a statistically satisfying result. I would say it was calculated, but I would be lying.",
            "Exceptional output. The dice have finally stopped behaving like an unmaintained legacy system.",
            "Beautiful. Every variable aligned, every outcome cooperated, and my opponent is about to experience the consequences.",
            "A remarkably efficient roll. I do appreciate it when randomness temporarily behaves like a competent colleague.",
            "Optimal result achieved. If anyone asks, I absolutely had a sophisticated predictive model for that.",
			"Chance just chose a side. Mine.",
			"The dice understand power. Good."
        ],
        PlayerAt5Transform: [
            "Five out of ten. Congratulations, you have reached the midpoint of a process you are unlikely to enjoy completing.",
            "We are halfway through your conversion. Statistically speaking, your recovery strategy deserves a performance review.",
            "Transformation progress: fifty percent. I would recommend a contingency plan, but I suspect you are already running out of options.",
            "Halfway there. Your original configuration is still recognizable, although the remaining system resources are becoming concerning.",
            "Five stages complete. You can still turn this around, of course. I simply wouldn't build a business plan around it.",
			"You’re changing in places you can’t ignore. Good."
        ],
        PlayerAt8Transform: [
            "Eight out of ten. At this point, recovery is less of a strategy and more of a theoretical possibility.",
            "Two stages remaining. I hope you have a backup, because your current configuration is approaching end of support.",
            "Critical threshold reached. I would tell you to remain calm, but panic might be the most rational response available.",
            "Eighty percent complete. Your remaining options have been reduced to a rather disappointing menu.",
            "Only two steps left. If this were software, I would call the transformation irreversible. Fortunately for me, this is much more entertaining."
        ],
        AIAt5Transform: [
            "Five stages. My waist is getting narrower, my chest is changing, and I am halfway to becoming a woman. I need a better contingency plan.",
            "Halfway complete. My face looks softer, my features are changing, and I can no longer dismiss this as a temporary visual anomaly.",
            "My center of gravity feels different, and even my clothes are fitting differently. I would very much like to roll back this particular update.",
            "Fifty percent transformed. I can feel my body changing in real time, and my usual approach of identifying the problem and fixing it is proving remarkably ineffective.",
            "My proportions are changing, and I am fairly certain my voice just sounded higher. This is no longer a theoretical problem. This is a full-scale system failure."
        ],
        AIAt9Transform: [
            "Nine stages complete. My hair is longer, my features are unmistakably feminine, and I have to admit... I look rather good. That conclusion was not in my original analysis.",
            "One step remaining. I caught my reflection a moment ago and actually smiled. I believe my objections are becoming statistically insignificant.",
            "My new figure is surprisingly elegant, and these changes are beginning to feel less like errors and more like features. I may need to revise my initial assessment.",
            "Well, the transformation has certainly improved my hair. And my face. And, apparently, my opinion of the result. I reserve the right to be quietly pleased.",
            "I spent this entire match trying to prevent myself from becoming a woman. Now I'm curious about the final details. I suppose even a logical man can discover that his initial assumptions were wrong."
        ]
    },
    Hyeri: {
        TransformPlayer: [
            "Breathe in... and let another layer of your old self drift away. There, can you feel the change settling in?",
            "One more step along the path, dear. You can resist the current, or discover how lovely it feels to float.",
            "Shhh... no need to struggle. Every change brings you closer to a self you have not yet met. Isn't that a beautiful thought?",
            "Another little shift. I wonder what you'll become when the journey is complete. Don't worry, I'll be here to welcome you.",
            "Feel that? The boundary between who you were and who you are becoming grows thinner with every breath. Just let it happen.",
			"Look at you changing! Fast little steps into something softer and more interesting.",
            "Another stage down. Your body is getting quicker to listen. I like that in a rival.",
            "You’re starting to look like you might actually enjoy being mine for a while."
        ],

        AIGetsTransformed: [
            "Mmm... another shift. I can feel my ears growing, my senses sharpening. The squirrel within me is beginning to stir.",
            "A soft tail is taking shape behind me... how curious. I wonder how it will feel to curl up with it. I welcome the discovery.",
            "My body grows lighter, more nimble. Perhaps the universe is teaching me to move through life with a little more playfulness.",
            "Ahh... soft fur, twitching ears, and the beginnings of a fluffy tail. My meditation has taken an unexpectedly delightful direction.",
            "I can feel the squirrel girl emerging, and I find myself smiling. There is something rather freeing about allowing a new form to unfold.",
			"Hey! My shape is getting all twitchy and sensitive and I did not sign up for this!",
            "Okay that felt really good for a second. Rude of you to make me admit it.",
            "My body is going all squirrel-y and hyper and part of me wants to lean into the rush."
        ],

        PlayerIsObedient: [
            "There you are... sinking a little deeper with every word. You needn't think so hard, dear. Just listen, breathe, and let go.",
            "Good... so beautifully willing. Feel your worries drifting away as you surrender to the moment. Isn't stillness wonderful?",
            "You followed my voice without hesitation. Perhaps some part of you has been longing to stop resisting and simply experience.",
            "That's it... deeper now. Let the outside world grow distant while my words become the only thing you need to follow.",
			"That was easy. Almost like you were waiting for permission.",
            "Mmm, such a receptive mind. I wonder how far you can wander when you stop trying to find your way back. Shall we discover that together?"
        ],

        AIIsObedient: [
            "Ohh... I seem to have drifted deeper than intended. How lovely to experience my own teachings from the other side.",
            "I followed your suggestion so willingly. Perhaps I was more ready to surrender than I cared to admit.",
            "There is no shame in letting go... even when I am the one who forgets to keep a hand on the reins. How enlightening.",
            "Mmm, you caught me in a quiet moment, and I simply let myself drift. I suppose even a guide deserves to wander sometimes.",
            "How interesting. I recognized the invitation, felt myself yielding, and chose not to fight it. What a curious little lesson in surrender."
        ],

        BigRollAI: [
            "Ahh, what a beautiful alignment. Even the dice seem to fall into a rhythm when I stop trying to force the universe.",
            "The moment unfolds exactly as it should... and today, it seems the universe is smiling at me.",
            "Such a lovely result. I could almost believe the dice were meditating before they landed.",
            "Mmm, the energy flows so freely today. Perhaps I should teach a class on surrendering to probability. You would make a fascinating student.",
            "A wonderful roll. Feel free to take a deep breath while you consider what this means for your own transformation."
        ],

        PlayerAt5Transform: [
            "Halfway along the journey, dear. Five steps behind you, five ahead. Let go of the need to decide whether that frightens you.",
            "You are halfway transformed. Notice how your old self is becoming less certain, less solid. Just breathe and observe.",
            "Five steps... and already the familiar is beginning to loosen its hold. I wonder what you'll discover when you stop clinging to it.",
            "You have come so far. There's no need to tense up now. The more you resist the current, the more tired you'll become.",
            "Halfway there. I can almost feel your thoughts searching for something familiar to hold on to. How sweet. Let them drift a little longer."
        ],

        PlayerAt8Transform: [
            "Eight steps, dear. The threshold is so close now. Breathe gently, and let the last of your resistance soften.",
            "Only two little steps remain. You can feel the change gathering around you, can't you? There's no need to be afraid of the unknown.",
            "So close to the end of your journey. I wonder whether you'll remember this moment as the point where you stopped fighting.",
            "Eight stages complete. Your old shape is nearly a distant memory. Stay with that feeling... there is still more to discover.",
            "The final threshold draws near. Perhaps, instead of asking what you might lose, you could wonder what you are about to find."
        ],

        AIAt5Transform: [
            "Halfway to becoming a squirrel girl... I can feel my ears twitching at sounds I would once have ignored. What a fascinating new awareness.",
            "My tail is growing fluffier, and I keep wanting to curl it around myself. I shall observe the impulse rather than judge it. Though it is rather adorable.",
            "Five stages. My fingers are becoming nimble, my movements lighter... I feel a curious urge to climb something tall and simply sit among the branches.",
            "I can feel soft fur spreading across my body. The change is becoming impossible to ignore, and yet... why should I wish to ignore it?",
            "Halfway transformed, and already my senses seem sharper. I wonder what the world will feel like when I have fully embraced this new form. I look forward to finding out."
        ],

        AIAt9Transform: [
            "One step remains... and look at my lovely fluffy tail! I keep catching myself swishing it with delight. I believe my meditation has acquired a rather playful new focus.",
            "Almost complete. My ears twitch at every little sound, and I find myself wanting to scamper up the nearest tree. How wonderful to discover new ways of being.",
            "I used to think of this as a transformation. Now it feels more like awakening to a part of myself I had never known. One more breath, one more step... I'm ready.",
            "Mmm, soft fur, nimble paws, a beautiful tail... I could spend hours simply exploring how it feels to move in this body. The universe has given me a delightful new practice.",
			"Nine. Too close. I’m still me under all this twitchy heat.",
            "One final step, and I shall be a squirrel girl in full. I welcome the change with an open heart. And I confess, I am rather looking forward to finding somewhere cozy to hide a few acorns."
        ]
    },
    Tex: {
        TransformPlayer: [
            "Well, partner, that's another step. I'd tell you to stand your ground, but I reckon the ground's got other plans for you.",
            "There you go, changin' again. Ain't it a shame you can't talk your way outta this one?",
            "Another step closer to somethin' you ain't gonna recognize in the mirror. Don't worry, I'll try not to laugh too hard.",
            "Now, don't give me that look. You knew there'd be consequences when you climbed into the saddle. You just figured they'd happen to somebody else.",
            "Well, ain't that somethin'. You're changin' faster than a politician changes his story. Least this transformation's got the decency to be honest about it.",
			"There you go. Slow and heavy. Another step into the shape I chose for you.",
            "Feel that? Your body getting fuller, warmer, slower to argue. Good.",
            "You’re starting to look like you belong in a stall. Mine."
        ],

        AIGetsTransformed: [
            "Well, hell. My shoulders are gettin' broader, my skin's thickening, and I got a mighty unpleasant suspicion about where this is headed.",
            "You're tellin' me I'm growin' horns? I've spent my whole life avoidin' bulls, and now I'm fixin' to be the biggest one in the pasture.",
            "My boots don't fit, my legs feel like fence posts, and somethin' tells me a tailor ain't gonna be much help with this particular problem.",
            "I can feel my face changin'. If a set of horns shows up between my eyes, partner, we're gonna have words.",
            "Well, ain't this a fine mess. I'm turnin' into a bull, and I got a feeling the ladies in the pasture are about to become a whole lot more interestin' than I'd care to admit.",
			"Interesting. The changes settle in deep. I can feel every one of them.",
            "My form is shifting. I will remember the hands that pushed it."
        ],

        PlayerIsObedient: [
            "That's it. You listen real nice, and I'll try not to take advantage of the arrangement. Much.",
            "Well, would you look at that. All that bluster, and a little suggestion was all it took. I won't tell if you won't.",
            "A sensible choice. A person's got to know when to lead and when to let somebody else hold the reins.",
            "There we go. Ain't no shame in takin' direction from a man who knows what he's doin'. Shame would be pretendin' you do.",
            "Much obliged. I do appreciate a cooperative guest. Makes it so much easier to get things done without raisin' my voice.",
			"Good. You moved when I told you. Slow and sure.",
            "That was easy. Bodies like yours learn fast under the right pressure.",
            "A little weight and you yield. I like that in a rival."
        ],

        AIIsObedient: [
            "Now, hold on. I know what that looked like, and I don't care to hear your version of it.",
            "Well, I'll be damned. Followed your lead without so much as a second thought. You keep that to yourself, hear?",
            "I reckon I was a mite too agreeable just then. Must be the dust. Gets into a man's head.",
            "Don't go smilin' like that, partner. I know what I did. I just ain't decided what I'm gonna call it yet.",
            "A gentleman can recognize a good suggestion without surrenderin' his pride. That's my story, and I'm stickin' to it."
        ],

        BigRollAI: [
            "Now that's what I call a result. You can complain about the odds all you like, but they just tipped their hat to me.",
            "Well, ain't that a beautiful thing. I'd say I planned it, but I don't want to insult either of us.",
            "That's a mighty fine roll. Makes a man feel like buyin' a drink, even if the company ain't worth the price.",
            "Would you look at that. Sometimes a man gets lucky. Sometimes he makes the other fella wish he hadn't shown up.",
            "Now that's a hand worth playin'. You might wanna sit down, partner. This next bit could be hard on your pride."
        ],

        PlayerAt5Transform: [
            "Halfway there, partner. You're in a tight spot, and I ain't seein' a whole lotta daylight through it.",
            "Five stages down. You still got some fight in you, I'll give you that. Shame fightin' ain't the same as winnin'.",
            "Well, look at you. Halfway to a whole new life, and you ain't even had the courtesy of a say in the matter.",
            "You're halfway gone, partner. I'd offer you some encouragement, but I ain't in the habit of lyin' to a person who's already got enough trouble.",
            "Five steps along. If you had a plan, now'd be a fine time to quit keepin' it a secret from yourself."
        ],

        PlayerAt8Transform: [
            "Eight stages. You're runnin' outta trail, partner, and I ain't the sort to lend you a horse.",
            "Two steps left. I'd say it's time to get serious, but I reckon that ship sailed a while back.",
            "Well, this is gettin' near the end of the line. You can glare at me all you want; it ain't gonna change the arithmetic.",
            "Eight down. I admire a stubborn soul, but there's a point where stubborn just becomes expensive.",
            "You're mighty close now. I'd tell you to enjoy your last moments as you are, but that'd be a little too neighborly of me."
        ],

        AIAt5Transform: [
            "Halfway to bein' a bull. My shoulders are built like a barn door, my skin's gettin' thick, and I ain't pleased with the direction of this conversation.",
            "Five stages. My boots are a lost cause, my hands are lookin' less like hands, and I swear I'm startin' to understand why bulls get so ornery.",
            "I got horns comin' in, muscle where I didn't ask for it, and a growing suspicion that the cows in the next pasture are lookin' mighty fine. Now that last part is downright unacceptable.",
            "Halfway changed, and already I'm feelin' the urge to paw at the dirt whenever somebody irritates me. You tell a soul about that, partner, and I'll deny every word.",
            "I came into this match a respectable man. Now I'm built like a prize bull and findin' myself distracted by the livestock. There's a joke in there somewhere, but I ain't laughin' yet."
        ],

        AIAt9Transform: [
            "Well, I'll be damned. These horns suit me better than I expected, and I ain't gonna pretend I don't cut a fine figure. Don't get smug about it.",
            "One stage left. I got a powerful set of shoulders, a fine coat, and the cows have started givin' me looks. Can't say I blame 'em. Still, this is gonna take some gettin' used to.",
            "Reckon I've spent enough time complainin'. Bein' a bull ain't all bad, and if the ladies in the pasture have opinions on the matter, well... a gentleman listens.",
            "Would you look at that. I can toss my head, stamp the ground, and make a fence post nervous just by walkin' past. There's somethin' to be said for a little presence.",
            "One more step and I'm a bull through and through. Never figured that'd be my road, but the pasture's lookin' mighty inviting, and I ain't one to argue with every good thing that comes my way.",
			"One stage left. I refuse to become someone else’s finished livestock."
        ]
    },
    Siobhán: {
        TransformPlayer: [
            "There we are, darling. Change can be such a beautiful thing, especially when someone else is directing it.",
            "Oh, don't look so startled. You knew this little game had claws. Well, mine, anyway.",
            "Another step along the way. I do love watching a carefully constructed identity come undone.",
            "Purrhaps you'll thank me when it's over. No? Well, let's not spoil the surprise.",
            "You see, sweetheart, I have a knack for bringing out things people never knew they had.",
			"There you go, darling. Another careful step away from who you were. You’re becoming much more interesting.",
            "Feel that shift? Your body is learning its new manners. I do enjoy a quick study.",
            "You’re starting to look like you belong on a leash. Figuratively. For now."
        ],

        AIGetsTransformed: [
            "Oh, how rude! Someone has been tampering with the cat. I shall have to sharpen my claws.",
            "A scratch to the pride, darling. Fortunately, mine is remarkably good at healing.",
            "Well, that was unexpected. I do hate surprises—unless, of course, I'm the one arranging them.",
            "Careful, sweetheart. Cornered cats have a dreadful reputation for good reason.",
            "You've managed to ruffle my fur. Enjoy the moment; it may be the last easy pleasure you get."
        ],

        PlayerIsObedient: [
            "Goodness, you do take direction beautifully. Should I be flattered, or simply impressed?",
            "Such cooperation! And here I was prepared to use my claws. What a disappointment. What a relief.",
            "Oh, darling, you followed that little cue perfectly. I do enjoy a well-trained audience.",
            "See how easy that was? A little nudge, a little suggestion, and suddenly we're getting somewhere.",
            "Mmm. I could get used to this. Though I suspect you might have other ideas about that.",
			"That was almost effortless. Thank you for making my work look easy.",
            "A little suggestion and you simply obey. I do appreciate good taste in a rival."
        ],

        AIIsObedient: [
            "I went along with you, darling. Don't confuse a cat's curiosity with a willingness to be owned.",
            "Oh, very clever. You gave the cat a little command. Shall we see whether she remembers it?",
            "I can play the dutiful lady when it suits me. The trick is knowing when the performance ends.",
            "Purrhaps I simply wanted to see that triumphant little look on your face. How charming.",
            "Enjoy your victory, sweetheart. I may even let you keep it. For a little while."
        ],

        BigRollAI: [
            "Now that's what I call landing on your feet. Even the dice appreciate a little feline finesse.",
            "Oh, marvelous! I do love it when fortune remembers which side of the room has the better wardrobe.",
            "A roll worthy of a standing ovation. Go on, darling—try not to look too impressed.",
            "See? Grace, timing, and a touch of luck. It's amazing what a cat can accomplish without asking permission.",
            "Did you see that? Even chance knows who is in charge.",
            "Well, well. The dice have spoken, and apparently they have excellent taste."
        ],

        PlayerAt5Transform: [
            "Halfway there, darling. You're beginning to discover just how much can change when the game gets its claws into you.",
            "Five stages! My, my. I wonder what you'll think of yourself when all this is over.",
            "You're not quite who you were, and not yet who you'll be. Isn't uncertainty delicious?",
            "Oh, sweetheart, we're only halfway through. Do try to keep that brave face in place.",
            "Five steps along the way. I do hope you're enjoying the experience as much as I'm enjoying the view."
        ],

        PlayerAt8Transform: [
            "Eight stages, darling. You're running out of room to pretend nothing's happening.",
            "Only two steps left. Oh, I do love a finale. Especially when someone else is the one sweating.",
            "So close to the end! Tell me, sweetheart, are you curious about what's waiting—or terrified?",
            "Eight stages down. You've come too far to call this a passing fancy now.",
            "Nearly there, darling. And here I thought you might have learned to land on your feet by now."
        ],

        AIAt5Transform: [
            "Halfway through, and still fabulous. I do make adversity look rather good, don't I?",
            "Five stages? Hmph. The trouble with trying to change a cat is that she rarely follows the script.",
            "Oh, this is becoming inconvenient. I had plans for this evening, and none involved losing my composure.",
            "You may have me halfway cornered, sweetheart. But you haven't seen what I do when the claws come out.",
            "Five stages altered. And yet, somehow, I remain the most interesting person in the room."
        ],

        AIAt9Transform: [
            "One stage left? Darling, must we rush? A lady deserves a dramatic finish.",
            "So close! I can practically hear the curtain rising. Let's see who lands on their feet.",
            "The final step. How thrilling. I do hope you've prepared something suitably memorable for the encore.",
            "One little stage between me and the end. Do try not to look so pleased with yourself.",
            "Well, sweetheart, here we are. The last move. Shall I surprise you, or would you prefer to be surprised?"
        ]
    }
};
function challengePortrait(name, initials, extraClass="") {
    const safe = String(name).replace(/[^a-z0-9 _-]/gi, "");
    const rivalIndex = CHALLENGE_RIVALS.findIndex(r => r.name === name);
    const transformed = rivalIndex >= 0 && challengeCompleted.includes(rivalIndex);
    const suffix = transformed ? "_head_transformed" : "_head";
    const path = `images/avatars/${safe}/${safe}${suffix}.jpg`;
    return `<div class="challenge-portrait ${extraClass}"><span>${initials || safe.slice(0,2).toUpperCase()}</span><img src="${path}" alt="${name}${transformed ? ' transformed' : ''}" onload="this.previousElementSibling.style.display='none'" onerror="this.remove()"></div>`;
}
function challengeRoadmapHtml() {
    const playerName = (document.getElementById("p1-name")?.value || gameState.p1.name || "Challenger").split(" ")[0];
    const rivals = CHALLENGE_RIVALS.map((r,i) => `<div class="challenge-rival ${i===challengeIndex?'current':''} ${challengeCompleted.includes(i)?'defeated':''}">${challengePortrait(r.name,r.initials)}<div class="challenge-rival-name">${r.name}</div><div class="challenge-rival-tier">${r.tier}</div></div>`).join("");
    const markerPct = CHALLENGE_RIVALS.length === 1 ? 50 : 7.14 + challengeIndex * (85.72 / 6);
    return `<div class="challenge-roadmap"><div class="challenge-player-portrait">${challengePortrait(playerName,playerName.slice(0,2).toUpperCase())}<div class="challenge-portrait-label">YOU · CHALLENGER</div></div><div><div class="challenge-route"><div class="challenge-road-marker" style="left:${markerPct}%"></div>${rivals}</div></div></div><div class="challenge-status">Rival ${challengeIndex+1} of 7 · Wins move you forward · Losses send you back</div>`;
}
function renderChallengeScreen(kind, extra={}) {
    const overlay=document.getElementById("challenge-overlay"), title=document.getElementById("challenge-title"), content=document.getElementById("challenge-content"), actions=document.getElementById("challenge-actions");
    if (!overlay || !title || !content || !actions) return;
    let html="", buttons="";
    if (kind === "rules") {
        title.textContent="✦ THE SEVEN: SOLO CHALLENGE ✦";
        html=`<p>Face seven rivals in an increasingly difficult gauntlet. Win to climb to the next rival. Lose and you'll be sent back one step, where you can fight your way forward again.</p><p><strong>One rule is absolute:</strong> losing at the first level ends the challenge. Defeat the Mistress to complete it.</p><p>Each victory makes the next match a little harder. Each loss grants a small boost for your next, easier rematch. You cannot choose your transformation in Challenge mode; the rival selects it at random from the available forms for your character.</p><p>Every rival has a distinct personality and strategy, and what you will transform them into. Your progress is shown on the roadmap.</p>`;
        buttons=`<button onclick="startChallengeRun()">Begin Challenge</button><button onclick="resumeSavedChallenge()">Resume Saved Challenge</button><button class="challenge-cancel" onclick="closeChallengeScreen()">Cancel</button>`;
    } else if (kind === "roadmap") {
        title.textContent="✦ THE ROAD AHEAD ✦";
        html=`<p>Study the route, challenger. The marker shows your next opponent.</p>${challengeRoadmapHtml()}<p style="text-align:center;color:#c4b5fd">Next up: <strong>${CHALLENGE_RIVALS[challengeIndex].name}</strong> · ${CHALLENGE_RIVALS[challengeIndex].tier}</p>`;
        buttons=`<button onclick="showChallengeIntro()">Face ${CHALLENGE_RIVALS[challengeIndex].name}</button><button class="challenge-cancel" onclick="quitChallengeRun()">Abandon Challenge</button>`;
    } else if (kind === "intro") {
        const r=CHALLENGE_RIVALS[challengeIndex];
        const modifier=challengeModifierNext;
        const modText=modifier==="handicap"?"Handicap: your rival starts with +1 bonus Energy this match.":modifier==="bonus"?"Challenge bonus: you start with +2 bonus Energy this match.":"No bonus or handicap this match.";
		let displayForm = r?.form ?? "Gender";
		if (displayForm === "Gender" || displayForm === "Cow") {
			const gender = r ? getGender(r.name) : null;
			if (gender === "male") {
				displayForm === "Gender" ? displayForm = "Woman" : displayForm = "Bull";
			} else if (gender === "female") {
				displayForm === "Gender" ? displayForm = "Man" : displayForm = "Cow";
			}
		}
	
        title.textContent=`RIVAL ${challengeIndex+1}: ${r.name.toUpperCase()}`;
        html=`${challengeRoadmapHtml()}<div class="challenge-opponent-card">${challengePortrait(r.name,r.initials)}<div><h3 style="border:0;color:${r.color};margin:0 0 6px">${r.name} · ${r.tier}</h3><p style="margin:4px 0">Signature transformation: <strong>${displayForm}</strong></p><p style="margin:4px 0">${modText}</p><p style="margin:4px 0;color:#b9a8ca;font-size:.88rem">The rival chooses your transformation from the forms available to your character.</p></div></div>`;
        buttons=`<button onclick="launchChallengeMatch()">Challenge ${r.name}</button><button class="challenge-cancel" onclick="quitChallengeRun()">Abandon Challenge</button>`;
    } else if (kind === "result") {
        title.textContent=extra.won?"✦ RIVAL DEFEATED ✦":"✦ THE GAUNTLET STRIKES BACK ✦";
        html=`<p style="text-align:center;font-size:1.12rem">${extra.message}</p>${challengeRoadmapHtml()}<p style="text-align:center">${extra.modText}</p>`;
        buttons=`<button onclick="continueChallengeAfterResult()">${extra.final?"Finish Challenge": "Continue"}</button><button onclick="saveChallengeFromScreen()">Save Challenge</button>${extra.final?"":`<button class="challenge-cancel" onclick="quitChallengeRun()">End Challenge</button>`}`;
    } else if (kind === "victory") {
        title.textContent="✦ THE SEVEN ARE DEFEATED ✦";
        html=`<p style="text-align:center;font-size:1.12rem">You have overcome all seven rivals. The gauntlet recognizes you as its champion!</p><p style="text-align:center;color:#c4b5fd">Your defeated opponents · select any portrait to enlarge it</p><div class="challenge-result-gallery">${CHALLENGE_RIVALS.map(r=>`<div><div class="challenge-portrait" role="button" tabindex="0" title="View ${r.name}'s transformed portrait" onclick="openImageModal(this.querySelector('img')?.src)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openImageModal(this.querySelector('img')?.src)}"><span>${r.form}</span><img src="images/avatars/${r.name}/${r.name}_to_${r.form}_10.jpg" alt="${r.name} transformed into ${r.form}" onload="this.previousElementSibling.style.display='none'" onerror="this.remove()"></div><div class="challenge-rival-name">${r.name}</div></div>`).join("")}</div><p style="text-align:center;color:#a99ab8">The Seven will remember this defeat. Or, if you prefer, the curtain can rise again.</p>`;
        buttons=`<button onclick="replayChallengeVictoryCinematic()">✦ Replay Victory Cinematic</button><button onclick="finishChallengeRun()">Finish Challenge</button>`;
    } else if (kind === "failed") {
        title.textContent="✦ CHALLENGE ENDED ✦";
        html=`<p style="text-align:center;font-size:1.12rem">Roz has defeated you. The gauntlet resets, and your run is over.</p>${challengeRoadmapHtml()}<p style="text-align:center;color:#b9a8ca">Every champion starts somewhere. Try again when you're ready.</p>`;
        buttons=`<button onclick="finishChallengeRun()">Return to Game Setup</button>`;
    }
    content.innerHTML=html; actions.innerHTML=buttons; overlay.style.display="flex";
}
function openChallengeRules(){ if(document.getElementById("game-mode-option")?.value!=="solo") return; renderChallengeScreen("rules"); }
function resumeSavedChallenge(){
    try { const raw=safeStorage.get(CHALLENGE_SAVE_KEY); if(!raw){showPopup("No Saved Challenge","There is no saved challenge on this browser. Use Export Challenge Save on the original browser, then load its code here.");return;} applyChallengeSave(JSON.parse(raw)); }
    catch(e){showPopup("Could Not Resume","The saved challenge could not be read. You can import a save code from another browser.");}
}
function closeChallengeScreen(){ const e=document.getElementById("challenge-overlay"); if(e)e.style.display="none"; }
function startChallengeRun(){
    challengeActive=true; challengeIndex=0; challengeModifierNext="none"; challengeCompleted=[]; challengeLastResult=null; challengeRunStartedAt=Date.now();
    updateChallengeRecord(r=>{r.runsStarted++;r.lastOutcome="Run in progress";});
    saveChallengeProgress();
    closeChallengeScreen(); renderChallengeScreen("roadmap");
}
function showChallengeIntro(){ renderChallengeScreen("intro"); }
function randomChallengePlayerForm(playerName){ const list=CHARACTER_MANIFEST[playerName] || []; const choices=list.length?list:TRANSFORMS; return choices[Math.floor(Math.random()*choices.length)]; }
function launchChallengeMatch(){
    saveChallengeProgress();
    closeChallengeScreen(); clearChallengeMatchAlerts();
    const toast=document.getElementById("card-trigger-toast"); if(toast) toast.removeAttribute("aria-hidden");
    const taunt=document.getElementById("challenge-taunt-box"); if(taunt){taunt.textContent="";taunt.classList.remove("visible");taunt.classList.add("challenge-taunt-active");taunt.style.display="flex";}
    const cont=document.getElementById("go-challenge-continue"); if(cont)cont.style.display="none";
    const go=document.getElementById("game-over-modal"); if(go)go.style.display="none";
    resetTutorialGameState(); gameOverSeen=false; gameOverPresentationStarted=false; challengeLastResult=null; initializeGame();
}
function continueFromChallengeGameOver(){
    const modal=document.getElementById("game-over-modal"); if(modal)modal.style.display="none";
    if(!challengeActive || !challengeLastResult) return;
    const box=document.getElementById("challenge-taunt-box");
    if(box){box.textContent="";box.classList.remove("visible");box.classList.add("challenge-taunt-active");box.style.display="flex";}
    renderChallengeScreen("result",challengeLastResult);
}
function continueChallengeAfterResult(){
    closeChallengeScreen();
    if (challengeLastResult?.final) { playChallengeVictoryCinematic().then(()=>renderChallengeScreen("victory")); return; }
    if (challengeLastResult?.failed) { renderChallengeScreen("failed"); return; }
    renderChallengeScreen("roadmap");
}

let challengeVictoryCinematicSkip = false;
let challengeVictoryCinematicResolve = null;
function skipChallengeVictoryCinematic(){
    challengeVictoryCinematicSkip = true;
    if (challengeVictoryCinematicResolve) challengeVictoryCinematicResolve();
}
async function replayChallengeVictoryCinematic(){
    closeChallengeScreen();
    await playChallengeVictoryCinematic();
    renderChallengeScreen("victory");
}
async function playChallengeVictoryCinematic(){
    const overlay=document.getElementById("challenge-victory-cinematic");
    const image=document.getElementById("cvc-image");
    const name=document.getElementById("cvc-name");
    const caption=document.getElementById("cvc-caption");
    if(!overlay||!image||!name||!caption) return;
    const reduced=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait=ms=>new Promise(resolve=>window.setTimeout(resolve,reduced?Math.min(ms,80):ms));
    challengeVictoryCinematicSkip=false;
    overlay.style.display="flex";
	playMusic("challenge");
    overlay.classList.remove("cvc-flash");
    image.classList.remove("cvc-fade");
    document.getElementById("cvc-skip").textContent="Skip Cinematic";
    try {
        for(let i=0;i<CHALLENGE_RIVALS.length;i++){
            if(challengeVictoryCinematicSkip) break;
            const rival=CHALLENGE_RIVALS[i];
            const base=`images/avatars/${rival.name}/${rival.name}_to_${rival.form}_`;
            const zero=await preloadCinematicStage(base+"0.jpg") || await preloadCinematicStage(`images/avatars/${rival.name}/${rival.name}_baseline.jpg`);
            const ten=await preloadCinematicStage(base+"10.jpg");
            if(challengeVictoryCinematicSkip) break;
            name.classList.remove("cvc-name-flash");
            name.textContent=rival.name;
            void name.offsetWidth;
            name.classList.add("cvc-name-flash");
            caption.textContent=`Rival ${i+1} of ${CHALLENGE_RIVALS.length} · ${rival.form} transformation`;
            overlay.classList.remove("cvc-flash");
            void overlay.offsetWidth;
            overlay.classList.add("cvc-flash");
            image.classList.remove("cvc-fade");
            if(zero){image.src=zero.src;image.alt=`${rival.name} before transformation`;}
            else if(ten){image.src=ten.src;image.alt=`${rival.name} transformed into ${rival.form}`;}
            else {image.removeAttribute("src");image.alt=`Artwork unavailable for ${rival.name}`;}
            await wait(1050);
            if(challengeVictoryCinematicSkip) break;
            if(ten){
                image.classList.add("cvc-fade");
                await wait(450);
                if(challengeVictoryCinematicSkip) break;
                image.src=ten.src;
                image.alt=`${rival.name} transformed into ${rival.form}, stage 10`;
                image.classList.remove("cvc-fade");
                overlay.classList.remove("cvc-flash");
                void overlay.offsetWidth;
                overlay.classList.add("cvc-flash");
                caption.textContent=`${rival.name} · transformation complete`;
            } else {
                caption.textContent=`Final artwork unavailable for ${rival.name}; continuing the victory procession.`;
            }
            await wait(1350);
            if(i<CHALLENGE_RIVALS.length-1 && !challengeVictoryCinematicSkip){
                image.classList.add("cvc-fade");
                caption.textContent="The next rival steps into the light…";
                await wait(480);
            }
        }
    } finally {
        overlay.style.display="none";
        image.classList.remove("cvc-fade");
        challengeVictoryCinematicSkip=false;
        challengeVictoryCinematicResolve=null;
		// Return to game music if a match is still active, otherwise stop.
		if (gameState && !gameState.gameEnded) playMusic("game");
		else stopAllMusic(true);
    }
}
function handleChallengeMatchEnded(winnerId){
    if (!challengeActive || gameState.gameMode!=="solo") return false;
    const rivalIndex=challengeIndex, rival=CHALLENGE_RIVALS[rivalIndex], won=winnerId===1;
    updateChallengeRecord(r=>{
        if(won) r.matchesWon++; else r.matchesLost++;
        r.bestRivalIndex=Math.max(r.bestRivalIndex,rivalIndex+1);
        r.lastOutcome=won?`Defeated ${rival.name}`:`Lost to ${rival.name}`;
    });
    if (won) {
        challengeCompleted=Array.from(new Set([...challengeCompleted,rivalIndex]));
        if (rivalIndex===CHALLENGE_RIVALS.length-1) {
            challengeLastResult={won:true,final:true,message:`You defeated ${rival.name}, the final rival, and completed The Seven!`,modText:"All seven rivals defeated."};
            updateChallengeRecord(r=>{r.runsCompleted++;r.lastOutcome="Completed The Seven";});
            try { safeStorage.remove(CHALLENGE_SAVE_KEY); } catch(e) {}
            return true;
        }
        challengeIndex=rivalIndex+1;
        challengeModifierNext="handicap";
        challengeLastResult={won:true,message:`${rival.name} has been defeated. The marker slides forward to ${CHALLENGE_RIVALS[challengeIndex].name}.`,modText:"Next match handicap: the next rival receives +1 starting Energy."};
    } else {
        // Falling back reopens the previously defeated rival: restore their normal portrait.
        if (rivalIndex===0) {
            challengeLastResult={won:false,failed:true,message:"Roz has won. This run of The Seven is over.",modText:"The first rival is the gatekeeper. Losing here ends the run."};
            updateChallengeRecord(r=>{r.runsFailed++;r.lastOutcome="Run ended at Roz";});
            try { safeStorage.remove(CHALLENGE_SAVE_KEY); } catch(e) {}
            return true;
        }
        challengeCompleted=challengeCompleted.filter(i=>i!==rivalIndex-1);
        challengeIndex=rivalIndex-1;
        challengeModifierNext="bonus";
        challengeLastResult={won:false,message:`${rival.name} defeats you. You fall back to ${CHALLENGE_RIVALS[challengeIndex].name} and must win your way forward again.`,modText:"Next match bonus: you receive +2 starting Energy."};
    }
    saveChallengeProgress();
    return true;
}
async function quitChallengeRun() {

    const confirmed = await showThemedConfirm(
        "Abandon The Seven challenge and return to setup?",
        "Abandon Challenge"
    );

    if (!confirmed) return;

    updateChallengeRecord(r=>{r.lastOutcome="Challenge abandoned";});
    finishChallengeRun(); 
 }
function finishChallengeRun(){
    challengeActive=false; challengeIndex=0; challengeModifierNext="none"; challengeCompleted=[]; challengeLastResult=null; challengeRunStartedAt=null;
    try { safeStorage.remove(CHALLENGE_SAVE_KEY); } catch(e) {}
    closeChallengeScreen();
    resetTutorialGameState(); gameOverSeen=false; gameOverPresentationStarted=false;
    const taunt=document.getElementById("challenge-taunt-box"); if(taunt){taunt.classList.remove("visible","challenge-taunt-active");taunt.textContent="";taunt.style.display="none";}
    const cont=document.getElementById("go-challenge-continue");if(cont)cont.style.display="none";
    const playAgain=document.getElementById("go-play-again");if(playAgain)playAgain.style.display="inline-block";
    const modal=document.getElementById("game-over-modal");if(modal)modal.style.display="none";
    document.getElementById("settings-modal").style.display="flex";
}


let lastTransformationTaunt = null;

function resetPlayerTransformationTaunts() {
    lastTransformationTaunt = null;
}

function getTransformationTauntKey(target) {
    const form = String(target?.transformTarget || "").trim();
    if (form !== "Gender" && form !== "Cow") return form;

    const gender = getGender(target?.name);

    if (gender === "male" || gender === "female") {
        return `${form}_${gender}`;
    }

    // Safe fallback if a character's gender is not defined.
    return form;
}

function getTransformationTaunt(targetPlayerId, eventName) {
    const target = targetPlayerId === 1 ? gameState.p1 : gameState.p2;
    const side = targetPlayerId === 1 ? "player" : "cpu";
    const formKey = getTransformationTauntKey(target);
    const pool = TRANSFORMATION_TAUNTS[formKey]?.[side]?.[eventName];

    if (!Array.isArray(pool) || pool.length === 0) return null;

    const available = pool.length > 1
        ? pool.filter(line => line !== lastTransformationTaunt)
        : pool;

    const line = available[Math.floor(Math.random() * available.length)];
    lastTransformationTaunt = line;
    return line;
}

function maybeShowTransformationTaunt(targetPlayerId, eventName, pct) {
    //if (Math.random() >= PLAYER_TRANSFORMATION_TAUNT_CHANCE) {
	if (Math.random() >= pct) {
        return false;
    }

    const line = getTransformationTaunt(targetPlayerId, eventName);
    if (!line) return false;

    if (challengeActive) {
        showChallengeTaunt(eventName, line);
    } else {
        showRegularTaunt(line);
    }

    return true;
}

function maybeShowPlayerTransformationTaunt(eventName, pct) {
    return maybeShowTransformationTaunt(1, eventName, pct);
}

function maybeShowCPUTransformationTaunt(eventName, pct) {
    return maybeShowTransformationTaunt(2, eventName, pct);
}


function showRegularTaunt(text) {
    const box = document.getElementById("challenge-taunt-box");
    if (!box || !text) return;

    if (regularTauntTimer) clearTimeout(regularTauntTimer);
	
	const cpuName = gameState.p2.name || "Rival";

    box.style.display = "flex";
    box.classList.add("challenge-taunt-active");
    box.textContent = `${cpuName}: “${text}”`;

    box.classList.remove("visible");
    void box.offsetWidth;
    box.classList.add("visible");

    regularTauntTimer = setTimeout(() => {
        box.textContent = "";
        box.classList.remove("visible");
		box.style.display = "none";
    }, 6500);
}


function showChallengeTaunt(eventName, forcedText=null){
    if (!challengeActive) return;
    const box=document.getElementById("challenge-taunt-box"); if(!box)return;
    const rival=CHALLENGE_RIVALS[challengeIndex];
    const personal=CHALLENGE_RIVAL_TAUNTS[rival.name]?.[eventName];
    const lines=CHALLENGE_TAUNTS[eventName]||[];
    const text=forcedText || (Array.isArray(personal)?personal[Math.floor(Math.random()*personal.length)]:(personal || (lines.length?lines[Math.floor(Math.random()*lines.length)]:"")));
    if(!text)return;
    if(challengeTauntTimer) clearTimeout(challengeTauntTimer);
    box.style.display="flex";box.classList.add("challenge-taunt-active");box.textContent=`${rival.name}: “${text}”`;
    box.classList.remove("visible");void box.offsetWidth;box.classList.add("visible");
    log(`Rival — ${rival.name}: “${text}”`);
    challengeTauntTimer=setTimeout(()=>{box.textContent="";box.classList.remove("visible");},6500);
}

function toggleGameMode() {
    let mode = document.getElementById("game-mode-option").value;
    document.getElementById("cpu-diff-wrap").style.display = mode === "solo" ? "flex" : "none";
    document.getElementById("online-room-wrap").style.display = mode === "online" ? "flex" : "none";
    const challengeWrap = document.getElementById("challenge-launch-wrap"); if (challengeWrap) challengeWrap.style.display = mode === "solo" ? "block" : "none";
    
    const p1Col = document.getElementById("p1-setup-col");
    const p2Col = document.getElementById("p2-setup-col");
    const p1Header = document.getElementById("p1-header-label");

    if (mode === "online") {
        if (p2Col) p2Col.style.display = "none";
        if (p1Col) p1Col.style.gridColumn = "span 2";
        if (p1Header) p1Header.innerText = "Your Settings";
    } else {
        if (p2Col) p2Col.style.display = "flex";
        if (p1Col) p1Col.style.gridColumn = "span 1";
        if (p1Header) p1Header.innerText = "Player 1";
    }

    if (mode === "solo") {
        document.getElementById("p2-header-label").innerText = "CPU";
    } else if (mode === "online") {
        document.getElementById("p2-header-label").innerText = "Online Opponent";
    } else {
        document.getElementById("p2-header-label").innerText = "Player 2";
    }

    // Lookup Transform is hidden online (we don't know the opponent's character until we connect)
    const online = mode === "online";
    ["p1", "cpu"].forEach(side => { const w = document.getElementById(side + "-lookup-wrap"); if (w) w.style.display = online ? "none" : "flex"; });
    if (online) {
        setTransformLabel("p1", "Opponent");
        populateTransformDropdown("p1-transform-type", "Random");    // every transformation in TRANSFORMS, current pick kept
    } else if (setupWasOnline) {
        onP1NameChange();
        onCpuNameChange();
    }
    setupWasOnline = online;
}

function prepareDebugDeck(deck) {
    if (!cardDebugOn || !debugCards || debugCards.length === 0) {
        return deck;
    }

    const forcedCards = [];

    // Extract selected cards from the main deck to prevent duplicates
    debugCards.forEach(id => {
        const index = deck.findIndex(card => (typeof card === 'object' ? card.id : card) === id);
        if (index !== -1) {
            forcedCards.push(deck.splice(index, 1)[0]);
        }
    });

    // Place forced cards at the draw position:
    // If your deal logic uses deck.pop() (draws from the end):
    return [...deck, ...forcedCards];

    // Note: If your deal logic uses deck.shift() (draws from the top), use:
    // return [...forcedCards, ...deck];
}

function addLog(msg) {
    if (!gameState) return;

    // Ensure array exists
    if (!gameState.log) gameState.log = [];

    // Optional timestamp or formatting
    msg = cpuDecorateLog(String(msg));
    gameState.log.push(msg);

    // Keep the complete in-match log so hiding the panel never discards history.

    // Sync to Firebase and update local UI
    syncToFirebase();
    updateUI();
}

function formatResourceTermsInTextNode(textNode) {
    if (!textNode || !textNode.nodeValue) return;
    let value = textNode.nodeValue;
    // Protect card names: some contain resource words that must remain intact.
    const names = (typeof KNOWN_CARDS !== "undefined" ? KNOWN_CARDS : []).map(c => c.name).filter(Boolean).sort((a,b) => b.length-a.length);
    const placeholders = [];
    names.forEach((name, i) => {
        const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        value = value.replace(re, match => { const token = `ZZCARDNAME${i}ZZ`; placeholders.push([token, match]); return token; });
    });
    const resources = [
        [/\bTrance\b\s*(?:🌀)?/gi, "🌀"], [/\bSubmission\b\s*(?:⛓️)?/gi, "⛓️"],
        [/\bArousal\b\s*(?:🔥)?/gi, "🔥"], [/\bEnergy\b\s*(?:⚡)?/gi, "⚡"],
        [/\bTransform\b\s*(?:👁️)?/gi, "👁️"], [/\bLucidity\b\s*(?:💧)?/gi, "💧"],
        [/\bVulnerability\b\s*(?:🪫)?/gi, "🪫"], [/\bVuln\b/gi, "🪫"]
    ];
    resources.forEach(([re, symbol]) => { value = value.replace(re, symbol); });
    placeholders.forEach(([token, original]) => { value = value.replace(token, original); });
    textNode.nodeValue = value;
}

function applyResourceSymbolsToLogEntry(entry) {
    if (!entry) return;
    const walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(formatResourceTermsInTextNode);
}

function colorizePlayerNamesInElement(root) {
    if (!root || !gameState) return;
    const players = [
        { name: gameState.p1 && gameState.p1.name, cls: "player-name-p1" },
        { name: gameState.p2 && gameState.p2.name, cls: "player-name-p2" }
    ].filter(p => p.name).sort((a, b) => b.name.length - a.name.length);
    if (!players.length) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement && node.parentElement.closest("button, .history-card-link, .player-name-p1, .player-name-p2")) continue;
        nodes.push(node);
    }
    nodes.forEach(node => {
        const text = node.nodeValue;
        let matches = [];
        players.forEach(player => {
            const escaped = player.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`(?<![\\p{L}\\p{N}])${nameTitlePrefixSource(player.cls)}${escaped}(?![\\p{L}\\p{N}])`, "giu");
            let m; while ((m = re.exec(text))) matches.push({ start: m.index, end: m.index + m[0].length, value: m[0], cls: player.cls });
        });
        matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
        const filtered = []; let lastEnd = -1;
        matches.forEach(m => { if (m.start >= lastEnd) { filtered.push(m); lastEnd = m.end; } });
        if (!filtered.length) return;
        const fragment = document.createDocumentFragment(); let cursor = 0;
        filtered.forEach(m => {
            if (m.start > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, m.start)));
            const span = document.createElement("span"); span.className = m.cls; span.textContent = m.value; fragment.appendChild(span); cursor = m.end;
        });
        if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
        node.parentNode.replaceChild(fragment, node);
    });
}

function renderLog() {
    const logBox = document.getElementById("game-log"); // Replace with your HTML log container ID
    if (!logBox || !gameState) return;

    let logs = gameState.log || [];
    if (!Array.isArray(logs)) {
        logs = Object.values(logs);
    }

    logBox.innerHTML = logs.map(msg => `<div class="log-entry">${msg}</div>`).join("");
    Array.from(logBox.querySelectorAll(".log-entry")).forEach(entry => {
        applyResourceSymbolsToLogEntry(entry);
        colorizePlayerNamesInElement(entry);
    });
    logBox.scrollTop = logBox.scrollHeight;
}

function logAtHistoryPosition(msg, position) {
    // Some choice-based effects resolve asynchronously. Keep their Chronicle/log entry
    // beside the event that opened the choice, rather than after later turn outcomes.
    log(msg);
    if (!gameState || !Array.isArray(gameState.log) || !gameState.log.length) return;
    const logs = gameState.log;
    const entry = logs.pop();
    const insertAt = Math.max(0, Math.min(Number(position) || 0, logs.length));
    logs.splice(insertAt, 0, entry);
    renderLog();
    renderTurnHistory();
    setGameLogVisible(localShowGameLog);
    if (logEl) logEl.scrollTop = logEl.scrollHeight;
}

function historyPlainText(value) {
    const box = document.createElement("div");
    box.innerHTML = String(value == null ? "" : value);
    return (box.textContent || box.innerText || "").replace(/\s+/g, " ").trim();
}

function getTurnHistoryGroups() {
    let logs = gameState && gameState.log ? gameState.log : [];
    if (!Array.isArray(logs)) logs = Object.values(logs);
    const groups = [];
    let current = null;
    let currentRound = null;
    logs.forEach(raw => {
        const text = historyPlainText(raw);
        if (!text) return;
        const roundMatch = text.match(/ROUND\s+(\d+)/i);
        if (roundMatch) currentRound = Number(roundMatch[1]);
        // Round banners are useful in the detailed log but add noise to the Chronicle.
        if (/^=+\s*ROUND\b/i.test(text) || /^ROUND\s+\d+\s*=*$/i.test(text)) return;
        // CPU-specific market-denial narration stays in the detailed log; the generic Market Wiped event is shown in Chronicle.
        if (/^CPU (?:used Wipe|wiped market)\b/i.test(text)) return;
        // Brain/AI narration remains in the detailed log; the Chronicle hides it by default.
        if (!localShowBrainComments && /🧠|\bCPU Score for card\b/i.test(text)) return;
        if (/---\s*.+?['’]s Turn\s*---/i.test(text) || /---\s*Player\s*\d+\s+Turn\s*---/i.test(text)) {
            current = { player: text.replace(/^---\s*/, "").replace(/\s*---$/, ""), round: currentRound, events: [] };
            groups.push(current);
        }
        if (!current) {
            current = { player: "Earlier events", round: currentRound, events: [] };
            groups.push(current);
        }
        // Don't repeat the generated turn header as a bullet in its own card.
        if (!/---\s*.+?['’]s Turn\s*---/i.test(text)) current.events.push(text);
    });
    return groups;
}

function escapeHistoryHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[ch]));
}

function historyPlayerLabelHtml(value) {
    let html = escapeHistoryHtml(value);
    const players = [
        { name: gameState && gameState.p1 && gameState.p1.name, cls: "player-name-p1" },
        { name: gameState && gameState.p2 && gameState.p2.name, cls: "player-name-p2" }
    ].filter(p => p.name).sort((a, b) => b.name.length - a.name.length);
    players.forEach(player => {
        const escaped = escapeHistoryHtml(player.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?<![\\p{L}\\p{N}])(${nameTitlePrefixSource(player.cls)}${escaped})((?:&#39;|&#x27;|['’])s)?(?![\\p{L}\\p{N}])`, "giu");
        html = html.replace(re, `<span class="${player.cls}">$1$2</span>`);
    });
    return html;
}

function historyEventHtml(value) {
    let html = escapeHistoryHtml(value);
    const sorted = [...new Map(KNOWN_CARDS.slice().sort((a, b) => b.name.length - a.name.length).map(card => [card.name.toLowerCase(), card])).values()];
    const linkedNames = new Set();
    sorted.forEach(card => {
        const nameKey = card.name.toLowerCase();
        if (linkedNames.has(nameKey)) return;
        linkedNames.add(nameKey);
        const escapedName = escapeHistoryHtml(card.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(escapedName, "gi");
        html = html.replace(re, match => `<button type="button" class="history-card-link" onclick="showCardDetails(${Number(card.id)})" title="View ${escapeHistoryHtml(card.name)}">${match}</button>`);
    });
    // Replace resource names with their die symbols while leaving linked card names intact.
    const resources = [[/\bTrance\b\s*(?:🌀)?/gi,"🌀"],[/\bSubmission\b\s*(?:⛓️)?/gi,"⛓️"],[/\bArousal\b\s*(?:🔥)?/gi,"🔥"],[/\bEnergy\b\s*(?:⚡)?/gi,"⚡"],[/\bTransform\b\s*(?:👁️)?/gi,"👁️"],[/\bLucidity\b\s*(?:💧)?/gi,"💧"],[/\bVulnerability\b\s*(?:🪫)?/gi,"🪫"],[/\bVuln\b/gi,"🪫"]];
    // Protect card-link HTML before replacing plain resource terms.
    const links = [];
    html = html.replace(/<button\b[^>]*class="history-card-link"[^>]*>[\s\S]*?<\/button>/gi, match => { const token=`ZZHISTORYLINK${links.length}ZZ`; links.push([token,match]); return token; });
    resources.forEach(([re,symbol]) => { html = html.replace(re,symbol); });
    // Color player names without altering linked card labels or their attributes.
    const playerNames = [
        { name: gameState && gameState.p1 && gameState.p1.name, cls: "player-name-p1" },
        { name: gameState && gameState.p2 && gameState.p2.name, cls: "player-name-p2" }
    ].filter(p => p.name).sort((a, b) => b.name.length - a.name.length);
    const protectedLinks = [];
    html = html.replace(/<button\b[^>]*class="history-card-link"[^>]*>[\s\S]*?<\/button>/gi, match => { const token = `ZZPLAYERLINK${protectedLinks.length}ZZ`; protectedLinks.push([token, match]); return token; });
    playerNames.forEach(player => {
        const escaped = escapeHistoryHtml(player.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?<![\\p{L}\\p{N}])(${nameTitlePrefixSource(player.cls)}${escaped})((?:&#39;|&#x27;|['’])s)?(?![\\p{L}\\p{N}])`, "giu");
        html = html.replace(re, `<span class="${player.cls}">$1$2</span>`);
    });
    protectedLinks.forEach(([token, link]) => { html = html.replace(token, link); });
    links.forEach(([token,link]) => { html = html.replace(token,link); });
    return html;
}

function showCardDetails(cardId) {
    const card = KNOWN_CARDS.find(c => Number(c.id) === Number(cardId));
    if (!card) return;
    const esc = value => escapeHistoryHtml(value);
    showPopup(esc(card.name), `<div style="font-size:.9em;font-weight:bold;margin-bottom:8px;"><span class="help-card-type-icon">${card.type === "Keep" ? "🖐️" : "💥"}</span>${esc(card.type)} · Cost <span style="color:#ff9f1c">${Number(card.cost)}⚡</span></div><div>${esc(card.desc)}</div>`);
    const shell = document.querySelector("#game-popup .modal-content");
    if (shell) {
        shell.classList.remove("card-popup-instant", "card-popup-keep");
        shell.classList.add(card.type === "Keep" ? "card-popup-keep" : "card-popup-instant");
    }
}

function renderTurnHistory() {
    const content = document.getElementById("turn-history-content");
    const position = document.getElementById("turn-history-position");
    const prev = document.getElementById("turn-history-prev");
    const next = document.getElementById("turn-history-next");
    if (!content || !gameState) return;
    const groups = getTurnHistoryGroups();
    if (!groups.length) {
        content.innerHTML = '<div class="turn-history-empty">Turn events will appear here as the duel unfolds.</div>';
        if (position) position.textContent = "Turn —";
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        return;
    }
    const index = selectedHistoryIndex < 0 ? groups.length - 1 : Math.max(0, Math.min(selectedHistoryIndex, groups.length - 1));
    if (selectedHistoryIndex >= groups.length) selectedHistoryIndex = groups.length - 1;
    const group = groups[index];
    const events = group.events || [];
    const categories = [
        { label: "Rival", match: t => /^Rival —/.test(t) },
        { label: "Dice Roll", match: t => /^Dice Roll:/i.test(t) },
        { label: "Cards & Effects", match: t => /card|bought|used|trigger|granted|activated|played|discard|shield|altered state|override|staircase|rapid pulse|mental awakening/i.test(t) }
    ];
    const used = new Set();
    let sections = "";
    categories.forEach(category => {
        const items = events.filter(t => category.match(t));
        items.forEach(t => used.add(t));
        if (items.length) sections += `<div class="turn-history-section"><strong>${category.label}</strong><ul>${items.slice(-8).map(t => { const shown = category.label === "Dice Roll" ? t.replace(/^Dice Roll:\s*/i, "").replace(/,\s*/g, " ") : t; return `<li class="history-event">${historyEventHtml(shown)}</li>`; }).join("")}</ul></div>`;
    });
    const outcomes = events.filter(t => !used.has(t));
    if (outcomes.length) sections += `<div class="turn-history-section"><strong>Turn events</strong><ul>${outcomes.slice(-8).map(t => `<li class="history-event">${historyEventHtml(t)}</li>`).join("")}</ul></div>`;
    const roundLabel = group.round ? ` · Round ${group.round}` : "";
    content.innerHTML = `<div class="turn-history-player">${historyPlayerLabelHtml(group.player)}${roundLabel}</div>${sections || '<div class="turn-history-empty">No detailed events were recorded for this turn.</div>'}`;
    if (position) position.textContent = `Turn ${index + 1} / ${groups.length}`;
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= groups.length - 1;
}

function moveTurnHistory(direction) {
    const groups = getTurnHistoryGroups();
    if (!groups.length) return;
    const current = selectedHistoryIndex < 0 ? groups.length - 1 : selectedHistoryIndex;
    selectedHistoryIndex = Math.max(0, Math.min(groups.length - 1, current + direction));
    renderTurnHistory();
}

// ============================================================
// ONLINE LOBBY
// Both players pick a character and transformation, see each other's choice, and press Ready. The transform list narrows to the
// opponent's character as soon as they join, so the two players always line up. Lobby data lives at games/<ROOM>/lobby/{host|guest}.
// ============================================================
let lobbyActive = false, lobbyReady = false, lobbyStarted = false, lobbyUnsub = null, lobbyRoom = "";
let lobbyOpponentName = null, lobbyOpponentTarget = null, lobbyNote = "";
window.lobbyConfirmed = null;

function lobbyRole() { return parseInt(document.getElementById("online-role-option").value, 10) === 2 ? "guest" : "host"; }
function lobbyOtherRole() { return lobbyRole() === "host" ? "guest" : "host"; }
function lobbyPath(role) { return "games/" + lobbyRoom + "/lobby/" + role; }
function lobbyMyName() { return (document.getElementById("p1-name").value || "").trim().split(" ")[0]; }
function lobbyEntry() {
    return { name: lobbyMyName(), target: document.getElementById("p1-transform-type").value, ready: lobbyReady, t: Date.now() };
}
function lobbyPushMyEntry() {
    if (!lobbyActive || lobbyStarted || !window.db) return;
    window.dbSet(window.dbRef(window.db, lobbyPath(lobbyRole())), lobbyEntry());
}
function onStartClicked() {
    if (document.getElementById("game-mode-option").value === "online") joinLobby(); else initializeGame();
}
function lobbyControlsLocked(locked) {         // while in the lobby the room, role and mode can't change
    ["game-mode-option", "online-room-code", "btn-role-host", "btn-role-guest"].forEach(id => { const e = document.getElementById(id); if (e) e.disabled = locked; });
    const startBtn = document.getElementById("start-game-btn"); if (startBtn) startBtn.style.display = locked ? "none" : "block";
    const lobby = document.getElementById("online-lobby"); if (lobby) lobby.style.display = locked ? "flex" : "none";
}
function joinLobby() {
    if (!window.db || !window.dbRef || !window.dbSet || !window.dbOnValue || !window.dbUpdate) { alert("Online play is not available (could not reach the game server)."); return; }
    if (lobbyActive) return;
    lobbyRoom = document.getElementById("online-room-code").value.trim().toUpperCase() || "ROOM123";
    document.getElementById("online-room-code").value = lobbyRoom;
    lobbyActive = true; lobbyReady = false; lobbyStarted = false; lobbyOpponentName = null; lobbyOpponentTarget = null;
    document.getElementById("lobby-room-line").innerText = `Lobby - Room ${lobbyRoom} (${lobbyRole() === "host" ? "Host" : "Guest"})`;
    lobbyControlsLocked(true);
    if (lobbyRole() === "host") {
        // fresh room: clear any old game and any stale guest entry, then register ourselves
        const updates = {};
        ["gameState", "market", "deck", "discardPile"].forEach(k => { updates["games/" + lobbyRoom + "/" + k] = null; });
        updates["games/" + lobbyRoom + "/lobby/guest"] = null;
        updates[lobbyPath("host")] = lobbyEntry();
        window.dbUpdate(window.dbRef(window.db), updates);
    } else {
        window.dbSet(window.dbRef(window.db, lobbyPath("guest")), lobbyEntry());
    }
    updateLobbyUI(null, null, "");
    lobbyUnsub = window.dbOnValue(window.dbRef(window.db, "games/" + lobbyRoom), snap => onLobbyUpdate(snap.val()));
}
function onLobbyUpdate(room) {
    if (!lobbyActive || lobbyStarted) return;
    const lobby = (room && room.lobby) || {};
    const me = lobby[lobbyRole()], opp = lobby[lobbyOtherRole()];
    // a guest who joins a game that is already running (e.g. after a refresh) goes straight back in
    if (room && room.gameState && lobbyRole() === "guest" && !opp) { startOnlineFromLobby(); return; }
    if (!me) { lobbyPushMyEntry(); return; }                    // our entry was cleared (the host created the room after we joined): add it again
    let note = "";
    const oppName = opp ? opp.name : null;
    if (oppName !== lobbyOpponentName) {                        // opponent joined, left, or changed character
        const before = document.getElementById("p1-transform-type").value;
        lobbyOpponentName = oppName;
        populateTransformDropdown("p1-transform-type", "Random");   // narrows to the opponent's character (or full list if none)
        setTransformLabel("p1", "Opponent");
        const after = document.getElementById("p1-transform-type").value;
        const possible = (CHARACTER_MANIFEST[oppName] || []).length ? CHARACTER_MANIFEST[oppName] : TRANSFORMS;
        lobbyNote = (oppName && before !== after) ? `${before} isn't available for ${oppName}, switched to ${after}. Possible for ${oppName}: ${possible.join(", ")}.` : "";
        if (!oppName && lobbyReady) { lobbyReady = false; }     // opponent left: cancel our Ready
        lobbyPushMyEntry();
    }
    lobbyOpponentTarget = opp ? opp.target : null;
    updateLobbyUI(me, opp, "");
    if (me.ready && opp && opp.ready) startOnlineFromLobby();
}
function updateLobbyUI(me, opp, note) {
    const set = (id, txt) => { const e = document.getElementById(id); if (e) e.innerText = txt; };
    const myName = lobbyMyName();
    const sameName = !!(opp && opp.name === myName);
	let transformMeInto = opp?.target ?? "Gender";
    let transformOpponentInto = document.getElementById("p1-transform-type").value;

	if (transformOpponentInto === "Gender" || transformOpponentInto === "Cow") {
		const gender = opp ? getGender(opp.name) : null;
		if (gender === "male") {
			transformOpponentInto === "Gender" ? transformOpponentInto = "Woman" : transformOpponentInto = "Bull";
		} else if (gender === "female") {
			transformOpponentInto === "Gender" ? transformOpponentInto = "Man" : transformOpponentInto = "Cow";
		}
	}
    //alert("5 Opp Name: " + (opp ? opp.name : "NA") + " Transform Opp into: " + transformOpponentInto + ", Gender: " + (opp ? getGender(opp.name) : "NA") + ", old: " + (opp?.target ?? "Gender"));
	
	if (transformMeInto === "Gender" || transformMeInto === "Cow") {
		if (getGender(myName) === "male") {
			transformMeInto === "Gender" ? transformMeInto = "Woman" : transformMeInto = "Bull";
		} else if (getGender(myName) === "female") {
			transformMeInto === "Gender" ? transformMeInto = "Man" : transformMeInto = "Cow";
		}
	}
    //alert("My Name: " + myName + " Transform me into: " + transformMeInto + ", Gender: " + getGender(myName) + ", old: " + document.getElementById("p1-transform-type").value);
	
    set("lobby-opp-name", opp ? `Opponent: ${opp.name}` : "Waiting for an opponent to join...");
    set("lobby-opp-status", opp ? `${opp.ready ? "Ready" : "Choosing..."} - will transform you into: ${transformMeInto}` : "Share the room code so they can join.");
    set("lobby-you-status", opp ? `You will transform ${opp.name} into: ${transformOpponentInto}` : "");
    let msg = note || lobbyNote || "";
    if (sameName) msg = `You both picked ${myName}. One of you needs to choose a different character.`;
    set("lobby-note", msg);
    const img = document.getElementById("lobby-opp-image");
    if (img) {
        if (opp) { const p = `images/avatars/${opp.name}/${opp.name}_baseline.jpg`; img.innerHTML = `<img src="${p}" onclick="openImageModal('${p}')" onerror="this.outerHTML='Image Req:<br>${opp.name}_baseline.jpg'"/>`; }
        else img.innerHTML = `<h2>?</h2>`;
    }
    const btn = document.getElementById("lobby-ready-btn");
    if (btn) { btn.disabled = !opp || sameName; btn.innerText = lobbyReady ? "Cancel Ready" : "Ready"; }
    ["p1-name", "p1-transform-type"].forEach(id => { const e = document.getElementById(id); if (e) e.disabled = lobbyReady; });   // locked while Ready
}
function toggleLobbyReady() {
    if (!lobbyActive || !lobbyOpponentName) return;
    lobbyReady = !lobbyReady;
    lobbyPushMyEntry();
}
function leaveLobby() {
    if (!lobbyActive) return;
    if (lobbyUnsub) { try { lobbyUnsub(); } catch (e) {} lobbyUnsub = null; }
    if (window.db && window.dbSet && !lobbyStarted) { try { window.dbSet(window.dbRef(window.db, lobbyPath(lobbyRole())), null); } catch (e) {} }
    lobbyActive = false; lobbyReady = false; lobbyOpponentName = null; lobbyOpponentTarget = null;
    lobbyControlsLocked(false);
    ["p1-name", "p1-transform-type"].forEach(id => { const e = document.getElementById(id); if (e) e.disabled = false; });
    populateTransformDropdown("p1-transform-type", "Random");
    setTransformLabel("p1", "Opponent");
}
function startOnlineFromLobby() {
    if (lobbyStarted) return;
    lobbyStarted = true;
    if (lobbyUnsub) { try { lobbyUnsub(); } catch (e) {} lobbyUnsub = null; }
    window.lobbyConfirmed = { oppName: lobbyOpponentName, oppTarget: lobbyOpponentTarget };
    lobbyActive = false;
    lobbyControlsLocked(false);
    ["p1-name", "p1-transform-type"].forEach(id => { const e = document.getElementById(id); if (e) e.disabled = false; });
    initializeGame();
}
window.addEventListener("pagehide", () => {     // best effort: leave the lobby if the tab closes
    if (lobbyActive && !lobbyStarted && window.db && window.dbSet) { try { window.dbSet(window.dbRef(window.db, lobbyPath(lobbyRole())), null); } catch (e) {} }
});

function setOnlineRole(role) {
    const roleSelect = document.getElementById("online-role-option");
    const btnHost = document.getElementById("btn-role-host");
    const btnGuest = document.getElementById("btn-role-guest");
    const statusMsg = document.getElementById("host-status-msg");

    if (role === 'host') {
        roleSelect.value = "1";
        btnHost.style.background = "var(--accent)";
        btnGuest.style.background = "#444";
        statusMsg.style.color = "#4cc9f0";
        statusMsg.innerText = "Host mode active (Player 1). Share this Room Code with your opponent.";
    } else {
        roleSelect.value = "2";
        btnGuest.style.background = "var(--accent)";
        btnHost.style.background = "#444";
        statusMsg.style.color = "#ff9f1c";
        statusMsg.innerText = "Guest mode active (Player 2). Enter the host's Room Code above.";
    }
}

function generateHostRoom() {
    const randomCode = "ROOM-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("online-room-code").value = randomCode;
    setOnlineRole('host');
}

function updateSetupImages() {
    let p1Name = document.getElementById("p1-name").value.split(" ")[0];
    let cpuName = document.getElementById("cpu-name").value;
    
    let p1ImgPath = `images/avatars/${p1Name}/${p1Name}_baseline.jpg`;
    document.getElementById("setup-p1-image").innerHTML = `<img src="${p1ImgPath}" onclick="openImageModal('${p1ImgPath}')" onerror="this.outerHTML='Image Req:<br>${p1Name}_baseline.jpg'"/>`;

    if (cpuName === "Random") {
        document.getElementById("setup-cpu-image").innerHTML = `<h2>?</h2>`;
    } else {
        let cpuTargetName = cpuName.split(" ")[0];
        let cpuImgPath = `images/avatars/${cpuTargetName}/${cpuTargetName}_baseline.jpg`;
        document.getElementById("setup-cpu-image").innerHTML = `<img src="${cpuImgPath}" onclick="openImageModal('${cpuImgPath}')" onerror="this.outerHTML='Image Req:<br>${cpuTargetName}_baseline.jpg'"/>`;
    }
}

// Lightweight synthesized UI sounds. Sound is opt-in and defaults to off.
function setSoundEnabled(enabled) {
    soundEnabled = !!enabled;
    if (!soundEnabled) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && !soundAudioContext) soundAudioContext = new AudioContextClass();
        if (soundAudioContext && soundAudioContext.state === "suspended") soundAudioContext.resume();
    } catch (e) {
        // Audio is an optional presentation layer; failures must never affect gameplay.
        soundEnabled = false;
        const toggle = document.getElementById("sound-effects-option");
        if (toggle) toggle.checked = false;
    }
}

function playSound(kind) {
    if (!soundEnabled) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!soundAudioContext) soundAudioContext = new AudioContextClass();
        const ctx = soundAudioContext;
        if (ctx.state === "suspended") ctx.resume();
        const now = ctx.currentTime;
        const tone = (freq, end, duration, wave, gainValue, offset) => {
            const start = now + (offset || 0);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = wave || "sine";
            osc.frequency.setValueAtTime(Math.max(35, freq), start);
            osc.frequency.exponentialRampToValueAtTime(Math.max(35, end), start + duration);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration + 0.02);
        };
        if (kind === "win") {
            [[523, 0], [659, 0.06], [784, 0.12]].forEach(([freq, offset]) => tone(freq, freq, 0.38, "sine", 0.04, offset));
            return;
        }
        if (kind === "transformBig") {
            tone(78, 210, 0.32, "triangle", 0.05, 0);
            tone(156, 320, 0.28, "sine", 0.028, 0.04);
            return;
        }
        const presets = {
            roll:        { freq: 145, end: 82, duration: 0.20, wave: "triangle", gain: 0.075 },
            lock:        { freq: 620, end: 390, duration: 0.075, wave: "sine", gain: 0.055 },
            unlock:      { freq: 390, end: 240, duration: 0.07, wave: "sine", gain: 0.04 },
            resolve:     { freq: 430, end: 660, duration: 0.14, wave: "sine", gain: 0.045 },
            card:        { freq: 520, end: 880, duration: 0.18, wave: "triangle", gain: 0.055 },
            trigger:     { freq: 480, end: 640, duration: 0.12, wave: "triangle", gain: 0.032 },
            up:          { freq: 520, end: 780, duration: 0.09, wave: "sine", gain: 0.028 },
            down:        { freq: 420, end: 220, duration: 0.1, wave: "sine", gain: 0.026 },
            sub:         { freq: 210, end: 160, duration: 0.06, wave: "sine", gain: 0.04 },
            transform:   { freq: 96, end: 150, duration: 0.2, wave: "triangle", gain: 0.04 },
            turn1:       { freq: 660, end: 880, duration: 0.12, wave: "sine", gain: 0.03 },
            turn2:       { freq: 392, end: 294, duration: 0.12, wave: "sine", gain: 0.03 },
            deny:        { freq: 110, end: 70, duration: 0.09, wave: "square", gain: 0.03 }
        };
        const preset = presets[kind] || presets.lock;
        tone(preset.freq, preset.end, preset.duration, preset.wave, preset.gain, 0);
    } catch (e) {
        // Ignore browser/audio-device failures; game logic continues normally.
    }
}

function playSubmissionCrackleSound() {
    if (!soundEnabled) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!soundAudioContext) soundAudioContext = new AudioContextClass();
        const ctx = soundAudioContext;
        if (ctx.state === "suspended") ctx.resume();
        const now = ctx.currentTime;
        // Three short, slightly dissonant bursts create a distinct magical crackle.
        [0, 0.055, 0.125].forEach((offset, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i === 1 ? "square" : "sawtooth";
            osc.frequency.setValueAtTime([980, 1460, 720][i], now + offset);
            osc.frequency.exponentialRampToValueAtTime([420, 610, 280][i], now + offset + 0.075);
            gain.gain.setValueAtTime(0.0001, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.045, now + offset + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + offset); osc.stop(now + offset + 0.085);
        });
    } catch (e) { /* Optional UI sound only; never affect gameplay. */ }
}

// ---------- Background music (presentation only) ----------
function getMusicElement(key) {
    if (!musicAudio[key]) {
        const a = new Audio(`audio/bgm-${key}.mp3`);
        a.loop = true;
        a.volume = 0;
        a.preload = "auto";
        musicAudio[key] = a;
    }
    return musicAudio[key];
}

function setMusicEnabled(enabled) {
    musicEnabled = !!enabled;
    try { safeStorage.set("hypduel_music_enabled", String(musicEnabled)); } catch (e) {}
    const toggle = document.getElementById("music-option");
    if (toggle) toggle.checked = musicEnabled;
    const volRow = document.getElementById("music-volume-row");
    if (volRow) volRow.style.opacity = musicEnabled ? "1" : "0.45";
    if (!musicEnabled) {
        stopAllMusic(true);
        return;
    }
    playMusicForCurrentContext();
}

function setMusicVolume(vol) {
    musicVolume = Math.max(0, Math.min(1, Number(vol) || 0));
    try { safeStorage.set("hypduel_music_volume", String(musicVolume)); } catch (e) {}
    const label = document.getElementById("music-volume-label");
    if (label) label.textContent = Math.round(musicVolume * 100) + "%";
    const slider = document.getElementById("music-volume-slider");
    if (slider) slider.value = String(Math.round(musicVolume * 100));
    // Apply immediately to whatever is currently playing
    Object.values(musicAudio).forEach(a => {
		if (a && !a.paused) a.volume = musicVolume;
	});
	if (gameAudio && !gameAudio.paused) gameAudio.volume = musicVolume;
}

function stopAllMusic(fade = true) {
    const all = [
        ...Object.values(musicAudio),
        gameAudio
    ].filter(Boolean);

    all.forEach(a => {
        if (fade && !a.paused && a.volume > 0.001) {
            const startVol = a.volume;
            const steps = 16;
            let i = 0;
            const id = setInterval(() => {
                i++;
                a.volume = Math.max(0, startVol * (1 - i / steps));
                if (i >= steps) {
                    clearInterval(id);
                    a.pause();
                    a.currentTime = 0;
                    a.volume = 0;
                }
            }, 40);
        } else {
            a.pause();
            a.currentTime = 0;
            a.volume = 0;
        }
    });
	
    currentMusicTrack = null;
    // optional: currentGameIndex = -1;  // so next game start picks fresh
	currentGameIndex = -1;
}

async function playMusic(key, { fadeMs = 900 } = {}) {
    if (!musicEnabled) return;

    // Already on the right high-level track
    if (currentMusicTrack === key && key !== "game") {
        const cur = getMusicElement(key);
        if (cur && !cur.paused) cur.volume = musicVolume;
        return;
    }
    // For game: if something is already playing, leave it alone
    if (key === "game" && currentMusicTrack === "game" && gameAudio && !gameAudio.paused) {
        gameAudio.volume = musicVolume;
        return;
    }

    const next = getMusicElement(key);
    const prevKey = currentMusicTrack;
    const steps = Math.max(1, Math.round(fadeMs / 40));

    // Fade whatever was playing out
    if (prevKey && prevKey !== key) {
        const prev = getMusicElement(prevKey);
        if (prev && !prev.paused) {
            const startVol = prev.volume > 0 ? prev.volume : musicVolume;
            let i = 0;
            const outId = setInterval(() => {
                i++;
                prev.volume = Math.max(0, startVol * (1 - i / steps));
                if (i >= steps) {
                    clearInterval(outId);
                    prev.pause();
                    if (prevKey !== "game") prev.currentTime = 0;
                    prev.volume = 0;
                }
            }, 40);
        }
    }

    if (key === "game") {
        // Start a random game track (or advance if none yet)
        currentMusicTrack = "game";
        if (currentGameIndex < 0 || !gameAudio || !gameAudio.src) {
            currentGameIndex = pickNextGameIndex();
        }
        next.src = gamePlaylist[currentGameIndex];
        next.loop = false;
        try {
            next.volume = 0;
            await next.play();
            let j = 0;
            const inId = setInterval(() => {
                j++;
                next.volume = musicVolume * (j / steps);
                if (j >= steps) {
                    clearInterval(inId);
                    next.volume = musicVolume;
                }
            }, 40);
        } catch (e) {
            currentMusicTrack = null;
        }
        return;
    }

    // Non-game tracks (setup / challenge / final) — same as before, looped
    currentMusicTrack = key;
    try {
        next.volume = 0;
        await next.play();
        let j = 0;
        const inId = setInterval(() => {
            j++;
            next.volume = musicVolume * (j / steps);
            if (j >= steps) {
                clearInterval(inId);
                next.volume = musicVolume;
            }
        }, 40);
    } catch (e) {
        currentMusicTrack = null;
    }
}

function playMusicForCurrentContext() {
    if (!musicEnabled) return;
    const settings = document.getElementById("settings-modal");
    const challengeOverlay = document.getElementById("challenge-victory-cinematic");
    const finalOverlay = document.getElementById("final-transform-cinematic");

    if (finalOverlay && finalOverlay.style.display === "flex") {
        playMusic("final");
    } else if (challengeOverlay && challengeOverlay.style.display === "flex") {
        playMusic("challenge");
    } else if (settings && settings.style.display !== "none") {
        playMusic("setup");
    } else if (gameState && !gameState.gameEnded) {
        playMusic("game");
    } else {
        stopAllMusic(true);
    }
}

function getMusicElement(key) {
    if (key === "game") {
        if (!gameAudio) {
            gameAudio = new Audio();
            gameAudio.preload = "auto";
            gameAudio.volume = 0;
            // When a game track finishes, pick another
            gameAudio.addEventListener("ended", onGameTrackEnded);
        }
        return gameAudio;
    }
    if (!musicAudio[key]) {
        const a = new Audio(`audio/bgm-${key}.mp3`);
        a.loop = true;
        a.volume = 0;
        a.preload = "auto";
        musicAudio[key] = a;
    }
    return musicAudio[key];
}

function pickNextGameIndex() {
    if (gamePlaylist.length <= 1) return 0;
    let next;
    do {
        next = Math.floor(Math.random() * gamePlaylist.length);
    } while (next === currentGameIndex);
    return next;
}

function onGameTrackEnded() {
    if (!musicEnabled || currentMusicTrack !== "game") return;
    // Soft handoff into the next random game track
    advanceGameTrack({ fadeMs: 700 });
}

async function advanceGameTrack({ fadeMs = 700 } = {}) {
    if (!musicEnabled) return;
    const a = getMusicElement("game");
    const nextIndex = pickNextGameIndex();
    const nextSrc = gamePlaylist[nextIndex];

    // Fade current out
    const startVol = a.volume > 0 ? a.volume : musicVolume;
    const steps = Math.max(1, Math.round(fadeMs / 40));
    await new Promise(resolve => {
        if (a.paused || startVol < 0.001) {
            resolve();
            return;
        }
        let i = 0;
        const id = setInterval(() => {
            i++;
            a.volume = Math.max(0, startVol * (1 - i / steps));
            if (i >= steps) {
                clearInterval(id);
                resolve();
            }
        }, 40);
    });

    a.pause();
    a.currentTime = 0;
    a.src = nextSrc;
    a.loop = false;                 // important: do not loop a single file
    currentGameIndex = nextIndex;
    currentMusicTrack = "game";

    try {
        a.volume = 0;
        await a.play();
        let j = 0;
        const inId = setInterval(() => {
            j++;
            a.volume = musicVolume * (j / steps);
            if (j >= steps) {
                clearInterval(inId);
                a.volume = musicVolume;
            }
        }, 40);
    } catch (e) {
        currentMusicTrack = null;
    }
}

/** Light device vibration for lock / resolve / transform. Honors prefers-reduced-motion. */
function triggerHaptic(kind) {
    try {
        if (!navigator.vibrate) return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const patterns = {
            lock: 18,
            unlock: 12,
            resolve: [22, 30, 22],
            transform: [28, 40, 28, 40, 45]
        };
        const pattern = patterns[kind];
        if (pattern != null) navigator.vibrate(pattern);
    } catch (e) { /* Haptics are optional; never block gameplay. */ }
}

/** Update the tiny last-effect line under the dice (human's own turn only). */
function setLastEffectTicker(cardName, detail) {
    const el = document.getElementById("last-effect-ticker");
    if (!el) return;
    // Only show during the local human player's turn.
    if (!gameState || !isLocalPlayerTurn()) {
        el.classList.remove("visible");
        el.innerHTML = "";
        lastEffectTickerText = "";
        return;
    }
    const name = String(cardName || "").trim();
    const detailText = String(detail || "").trim();
    if (!name && !detailText) {
        el.classList.remove("visible");
        el.innerHTML = "";
        lastEffectTickerText = "";
        return;
    }
    const esc = v => String(v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    lastEffectTickerText = name ? `${name}: ${detailText}` : detailText;
    el.innerHTML = name
        ? `<span class="ticker-card">${esc(name)}</span>${detailText ? ": " + esc(detailText) : ""}`
        : esc(detailText);
    el.classList.add("visible");
    if (lastEffectTickerTimer) clearTimeout(lastEffectTickerTimer);
    lastEffectTickerTimer = setTimeout(() => {
        // Fade after a few seconds so the board stays clean; keep text for screen readers briefly.
        el.classList.remove("visible");
    }, 4200);
}

function clearLastEffectTicker() {
    const el = document.getElementById("last-effect-ticker");
    if (el) { el.classList.remove("visible"); el.innerHTML = ""; }
    lastEffectTickerText = "";
    if (lastEffectTickerTimer) { clearTimeout(lastEffectTickerTimer); lastEffectTickerTimer = null; }
}

/** Online connection dot + "opponent thinking" label. */
function updateOnlineStatusUI() {
    const row = document.getElementById("online-status-row");
    const dot = document.getElementById("connection-dot");
    const label = document.getElementById("connection-label");
    const thinking = document.getElementById("opponent-thinking-label");
    if (!row || !dot || !label) return;
    const isOnline = !!(gameState && gameState.gameMode === "online");
    if (!isOnline) {
        row.classList.remove("visible");
        if (thinking) thinking.classList.remove("visible");
        return;
    }
    row.classList.add("visible");
    dot.classList.remove("connected", "disconnected", "connecting");
    if (onlineConnectionState === "connected") {
        dot.classList.add("connected");
        label.textContent = "Connected";
    } else if (onlineConnectionState === "disconnected") {
        dot.classList.add("disconnected");
        label.textContent = "Disconnected";
    } else {
        dot.classList.add("connecting");
        label.textContent = onlineConnectionState === "connecting" ? "Connecting…" : "Online";
    }
    const waitingOnOpponent = isOnline && gameState && !gameState.gameEnded && !isLocalPlayerTurn();
    if (thinking) {
        if (waitingOnOpponent) thinking.classList.add("visible");
        else thinking.classList.remove("visible");
    }
}

function bindFirebaseConnectionStatus() {
    if (!window.db || !window.dbRef || !window.dbOnValue) return;
    try {
        const connRef = window.dbRef(window.db, ".info/connected");
        window.dbOnValue(connRef, (snap) => {
            onlineConnectionState = snap.val() ? "connected" : "disconnected";
            updateOnlineStatusUI();
        });
    } catch (e) {
        onlineConnectionState = "disconnected";
        updateOnlineStatusUI();
    }
}

async function replayLastCinematic() {
    if (lastCinematicLoserId == null || !gameState) return;
    const modal = document.getElementById("game-over-modal");
    if (modal) modal.style.display = "none";
    await playFinalTransformationCinematic(lastCinematicLoserId);
    if (modal) modal.style.display = "flex";
}

function showStatDelta(anchorEl, delta, glyph) {
    const amount = Number(delta) || 0;
    if (!anchorEl || !amount) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = anchorEl.closest(".stat, .transform-progress-wrap, .track-container") || anchorEl;
    const floater = document.createElement("span");
    floater.className = `stat-float ${amount > 0 ? "stat-float-up" : "stat-float-down"}`;
    floater.textContent = `${amount > 0 ? "+" : ""}${amount}${glyph ? " " + glyph : ""}`;
    host.appendChild(floater);
    window.setTimeout(() => floater.remove(), 950);
}

function rejectMarketCard(el) {
    playSound("deny");
    if (!el || !el.classList) return;
    el.classList.remove("card-deny");
    void el.offsetWidth;
    el.classList.add("card-deny");
    window.setTimeout(() => el.classList.remove("card-deny"), 380);
}

function applyDiceDisplay(value) {
    localShowDiceText = value !== "off";
    try { safeStorage.set("hypduel_show_dice_text", String(localShowDiceText)); } catch (e) {}
    // Keep the legacy field initialized for existing saves, but rendering uses this local preference.
    if (gameState && !gameState.gameEnded) {
        try { updateUI(); } catch (e) { /* Settings must not interrupt gameplay. */ }
    }
}

function loadLocalDisplayPreferences() {
    try {
        const savedDice = safeStorage.get("hypduel_show_dice_text");
        if (savedDice !== null) localShowDiceText = savedDice !== "false";
        const savedLog = safeStorage.get("hypduel_show_game_log");
        if (savedLog !== null) localShowGameLog = savedLog !== "false";
        const savedBrain = safeStorage.get("hypduel_show_brain_comments");
        if (savedBrain !== null) localShowBrainComments = savedBrain === "true";
		const savedMusic = safeStorage.get("hypduel_music_enabled");
		if (savedMusic !== null) musicEnabled = savedMusic === "true";
		const savedVol = safeStorage.get("hypduel_music_volume");
		if (savedVol !== null) {
			const v = parseFloat(savedVol);
			if (!Number.isNaN(v)) musicVolume = Math.max(0, Math.min(1, v));
		}
    } catch (e) { /* Storage may be unavailable for local files or private browsing. */ }
}

function setGameLogVisible(visible) {
    localShowGameLog = !!visible;
    try { safeStorage.set("hypduel_show_game_log", String(localShowGameLog)); } catch (e) {}
    const logBox = document.getElementById("game-log");
    if (logBox) {
        logBox.classList.toggle("log-hidden", !localShowGameLog);
        logBox.setAttribute("aria-hidden", String(!localShowGameLog));
    }
    const logToolbar = document.getElementById("game-log-toolbar");
    if (logToolbar) logToolbar.classList.toggle("log-hidden", !localShowGameLog);
    const toggle = document.getElementById("show-game-log-option");
    if (toggle) toggle.checked = localShowGameLog;
}

function setBrainCommentsVisible(visible) {
    localShowBrainComments = !!visible;
    try { safeStorage.set("hypduel_show_brain_comments", String(localShowBrainComments)); } catch (e) {}
    const toggle = document.getElementById("show-brain-comments-option");
    if (toggle) toggle.checked = localShowBrainComments;
    renderTurnHistory();
}

async function copyGameLog() {
    const logs = (gameState && Array.isArray(gameState.log)) ? gameState.log : [];
    const text = logs.map(msg => {
        const entry = document.createElement("div");
        entry.textContent = historyPlainText(msg);
        applyResourceSymbolsToLogEntry(entry);
        return entry.textContent;
    }).join("\n");
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const area = document.createElement("textarea");
            area.value = text; area.style.position = "fixed"; area.style.opacity = "0";
            document.body.appendChild(area); area.select();
            const ok = document.execCommand("copy"); area.remove();
            if (!ok) throw new Error("Clipboard copy was not available");
        }
        const button = document.querySelector("#game-log-toolbar button");
        if (button) { const old = button.textContent; button.textContent = "✓ Copied"; setTimeout(() => button.textContent = old, 1400); }
    } catch (err) {
        showPopup("Copy Log", "Your browser blocked clipboard access. You can still select and copy the visible log manually.");
    }
}

function closeGameOverToBoard() {
    const modal = document.getElementById("game-over-modal");
    if (modal) modal.style.display = "none";
    gameOverSeen = true;
    if (gameState && gameState.gameEnded && typeof syncFinalBoardPortrait === "function") {
        syncFinalBoardPortrait(1);
        syncFinalBoardPortrait(2);
    }
    const restart = document.getElementById("restart-game-toolbar-btn");
    if (restart) restart.style.display = "inline-block";
    // When the player chooses View Board in a challenge, leave a clear way back
    // to the challenge interstitial in the taunt area's reserved space.
    if (challengeActive && challengeLastResult) {
        if (challengeTauntTimer) { clearTimeout(challengeTauntTimer); challengeTauntTimer = null; }
        const box = document.getElementById("challenge-taunt-box");
        if (box) {
            box.classList.remove("visible");
            box.classList.add("challenge-taunt-active");
            box.style.display = "flex";
            box.innerHTML = '<button type="button" class="challenge-board-continue" onclick="continueFromChallengeGameOver()">✦ Continue Challenge ✦</button>';
        }
    }
}
async function restartGameFromBoard() {
    const confirmed = await showThemedConfirm(
        "Restart Hypnotic Duel? The current match will be lost.",
        "Restart Hypnotic Duel"
    );

    if (!confirmed) return;

    window.location.reload();
}

function openOptionsModal(returnTarget = "game") {
    optionsReturnTarget = returnTarget === "setup" ? "setup" : "game";
    const diceSelect = document.getElementById("dice-text-option");
    if (diceSelect) diceSelect.value = localShowDiceText ? "on" : "off";
    const soundToggle = document.getElementById("sound-effects-option");
    if (soundToggle) soundToggle.checked = soundEnabled;
	const musicToggle = document.getElementById("music-option");
	if (musicToggle) musicToggle.checked = musicEnabled;
	const volSlider = document.getElementById("music-volume-slider");
	const volLabel = document.getElementById("music-volume-label");
	if (volSlider) volSlider.value = String(Math.round(musicVolume * 100));
	if (volLabel) volLabel.textContent = Math.round(musicVolume * 100) + "%";
	const volRow = document.getElementById("music-volume-row");
	if (volRow) volRow.style.opacity = musicEnabled ? "1" : "0.45";
    const logToggle = document.getElementById("show-game-log-option");
    if (logToggle) logToggle.checked = localShowGameLog;
    const brainToggle = document.getElementById("show-brain-comments-option");
    if (brainToggle) brainToggle.checked = localShowBrainComments;
    const modal = document.getElementById("options-modal");
    if (modal) modal.style.display = "flex";
}

function closeOptionsModal() {
    const modal = document.getElementById("options-modal");
    if (modal) modal.style.display = "none";
    // The setup dialog remains open behind Options when launched from setup.
}


async function confirmResetGame() {
    const isActiveOnlineGame =
        gameState &&
        gameState.gameMode === "online" &&
        onlineRoomId &&
        !gameState.gameEnded &&
        gameState.phase !== "waiting";

    if (isActiveOnlineGame) {
        
        const confirmed = await showThemedConfirm(
            "Forfeit this online match?\n\n" +
            "If you proceed, your opponent will be declared the winner " +
            "and will see your final transformation. This cannot be undone.",
            "Submit to Your Opponent"
        );

        if (!confirmed) return;

        if (confirmed) {
            forfeitOnlineGameAndExit();
        }
        return;
    }

    const confirmed2 = await showThemedConfirm(
        "Reset Hypnotic Duel and return to the setup screen? " +
        "The current match will be lost.",
        "Submit to Your Opponent"
    )

    if (!confirmed2) return;
    
    window.location.reload();
}

async function forfeitOnlineGameAndExit() {
    if (
        !window.db ||
        !window.dbRef ||
        !window.dbUpdate ||
        !onlineRoomId
    ) {
        window.alert(
            "Unable to submit the forfeit because the online server " +
            "is unavailable. Your game has not been reset."
        );
        return;
    }

    const quitterId = Number(onlineLocalRole);
    if (![1, 2].includes(quitterId)) return;

    const quitter = quitterId === 1 ? gameState.p1 : gameState.p2;
    const previous = {
        gameEnded: gameState.gameEnded,
        endReason: gameState.endReason,
        forfeitingPlayerId: gameState.forfeitingPlayerId,
        forfeitWinnerId: gameState.forfeitWinnerId,
        transform: quitter.transform
    };

    // Prevent this browser from presenting the opponent's victory cinematic.
    localForfeitPending = true;

    gameState.endReason = "forfeit";
    gameState.forfeitingPlayerId = quitterId;
    gameState.forfeitWinnerId = quitterId === 1 ? 2 : 1;
    gameState.gameEnded = true;

    // The cinematic ends at the fully transformed stage.
    quitter.transform = 10;

    const base = `games/${onlineRoomId}/gameState`;
    const updates = {};

    updates[`${base}/endReason`] = "forfeit";
    updates[`${base}/forfeitingPlayerId`] = quitterId;
    updates[`${base}/forfeitWinnerId`] = gameState.forfeitWinnerId;
    updates[`${base}/gameEnded`] = true;
    updates[`${base}/p${quitterId}/transform`] = 10;

    try {
        // One atomic update ensures the opponent cannot receive a
        // game-ended result without the accompanying forfeit details.
        await window.dbUpdate(window.dbRef(window.db), updates);

        // Return the quitting player to the main setup screen.
        window.location.reload();
    } catch (error) {
        console.error("Failed to submit online forfeit:", error);

        gameState.gameEnded = previous.gameEnded;
        gameState.endReason = previous.endReason;
        gameState.forfeitingPlayerId = previous.forfeitingPlayerId;
        gameState.forfeitWinnerId = previous.forfeitWinnerId;
        quitter.transform = previous.transform;
        localForfeitPending = false;

        window.alert(
            "The forfeit could not be sent to the server. " +
            "Please check your connection and try again."
        );
    }
}


function initializeGame() {
    const soundOption = document.getElementById("sound-effects-option");
    setSoundEnabled(!!(soundOption && soundOption.checked));
    const gameMode = document.getElementById("game-mode-option").value;
    const showDiceText = document.getElementById("dice-text-option").value === "on";
    localShowDiceText = showDiceText;
    const showEnergyActions = false;
	resetPlayerTransformationTaunts();
	//document.getElementById("energy-actions-option").value === "on";

    document.getElementById("energy-actions-panel-1").style.display = showEnergyActions ? "block" : "none";
    document.getElementById("settings-modal").style.display = "none";

    if (gameMode === "online") {
        onlineRoomId = document.getElementById("online-room-code").value.trim().toUpperCase() || "ROOM123";
        onlineLocalRole = parseInt(document.getElementById("online-role-option").value, 10);
        onlineConnectionState = "connecting";
        bindFirebaseConnectionStatus();
        updateOnlineStatusUI();

        document.getElementById("energy-actions-panel-2").style.display = showEnergyActions ? "block" : "none";
        document.getElementById("btn-end-turn-2").style.display = "block";
        document.getElementById("p1-last-keep-section").style.display = "block";

        let localName = document.getElementById("p1-name").value.trim().split(" ")[0] || (onlineLocalRole === 1 ? "Host" : "Guest");
        let localTarget = document.getElementById("p1-transform-type").value;
        const lc = window.lobbyConfirmed; window.lobbyConfirmed = null;

        if (onlineLocalRole === 1) {
            // --- HOST (PLAYER 1) ---
            gameState.gameMode = "online";
            gameState.showDiceText = showDiceText;
            gameState.showEnergyActions = showEnergyActions;

            gameState.p1.name = localName;
            gameState.p2.transformTarget = localTarget; // Host sets the target transformation for Player 2

            // names and choices were already exchanged in the lobby; "Waiting..." only if the host starts without one
            gameState.p2.name = (lc && lc.oppName) ? lc.oppName : "Waiting...";
            gameState.p1.transformTarget = (lc && lc.oppTarget) ? lc.oppTarget : TRANSFORMS[0];

            gameState.activePlayer = Math.random() < 0.5 ? 1 : 2;
            if (gameState.activePlayer === 1) gameState.p2.energy = 1; 
            else gameState.p1.energy = 1;

            refillMarket();
            startTurn(); 
            syncToFirebase();
            listenToFirebase(onlineRoomId);
			// Music: leave setup track and enter the board track (user has already clicked Start).
			playMusic("game");

        } else {
            // --- GUEST (PLAYER 2) ---
            window.pendingGuestName = localName;
            window.pendingGuestTarget = localTarget;

            listenToFirebase(onlineRoomId);

            if (!(lc && lc.oppName) && window.db && window.dbUpdate && window.dbRef) {   // lobby players already told the host
                let updates = {};
                updates["games/" + onlineRoomId + "/gameState/p2/name"] = localName;
                updates["games/" + onlineRoomId + "/gameState/p1/transformTarget"] = localTarget; // Guest sets the target transformation for Player 1
                window.dbUpdate(window.dbRef(window.db), updates);
            }
        }
        return;
    }

    // --- LOCAL / VS-CPU MODES ---
    let p1N = document.getElementById("p1-name").value.trim();
    let cpuN = document.getElementById("cpu-name").value.trim();
    let cpuNFinal = cpuN;
    if (challengeActive) { cpuNFinal = CHALLENGE_RIVALS[challengeIndex].name; cpuN = cpuNFinal; }
    if (cpuN === "Random") {
        const wanted = document.getElementById("p1-transform-type").value;      // the transformation chosen for the CPU's character
        let pool = NAMES.filter(n => n !== p1N && (CHARACTER_MANIFEST[n] || []).includes(wanted));
        if (!pool.length) pool = NAMES.filter(n => n !== p1N);
        cpuNFinal = pool[Math.floor(Math.random() * pool.length)];
    }

    if (p1N === cpuNFinal && !challengeActive) { alert("Players cannot have the same name."); return; }

    let p1T = document.getElementById("p1-transform-type").value;
    let cpuT = document.getElementById("cpu-transform-type").value;
    if (challengeActive) { p1T = randomChallengePlayerForm(p1N); cpuT = CHALLENGE_RIVALS[challengeIndex].form; }

    cpuBrainReset(); choiceQueue = []; choiceActive = null; endTurnAfterChoice = false; document.getElementById("choice-dialog").style.display = "none";
    gameState.gameMode = gameMode;
    gameState.showDiceText = showDiceText;
    gameState.showEnergyActions = showEnergyActions;

    gameState.p1.name = p1N.split(" ")[0]; 
    gameState.p1.transformTarget = cpuT === "Random" ? TRANSFORMS[Math.floor(Math.random()*TRANSFORMS.length)] : cpuT;
    gameState.p2.name = cpuNFinal.split(" ")[0]; 
    gameState.p2.transformTarget = p1T;
    if (challengeActive) {
        // The rival chooses the form imposed on the human; the human's assigned form is random.
        gameState.p1.transformTarget = randomChallengePlayerForm(gameState.p1.name);
        gameState.p2.transformTarget = CHALLENGE_RIVALS[challengeIndex].form;
    }

    if (gameMode === "pvp") {
        document.getElementById("energy-actions-panel-2").style.display = showEnergyActions ? "block" : "none";
        document.getElementById("btn-end-turn-2").style.display = "block";
        document.getElementById("p1-last-keep-section").style.display = "block";
    } else {
        document.getElementById("p1-last-keep-section").style.display = "none";
        gameState.p2.difficulty = challengeActive ? CHALLENGE_RIVALS[challengeIndex].difficulty : document.getElementById("cpu-difficulty").value;
    }

    gameState.activePlayer = challengeActive ? 1 : (Math.random() < 0.5 ? 1 : 2);
    if (gameState.activePlayer === 1) gameState.p2.energy = 1; else gameState.p1.energy = 1;
    if (challengeActive) {
        if (challengeModifierNext === "bonus") gameState.p1.energy += 2;
        else if (challengeModifierNext === "handicap") gameState.p2.energy += 1;
        challengeModifierNext = "none";
        const taunt=document.getElementById("challenge-taunt-box"); if(taunt) taunt.style.display="";
        showChallengeTaunt("TransformPlayer");
    } else { const taunt=document.getElementById("challenge-taunt-box"); if(taunt) {taunt.classList.remove("visible"); taunt.style.display="none";} }
    
    refillMarket(); 
    if (gameState.gameMode === "solo") recStart(); else gameRec = null;
    startTurn();
    updateUI();
	
	// Music: leave setup track and enter the board track (user has already clicked Start).
	playMusic("game");
}


// FIREBASE GAME STATE SYNCHRONIZATION (STEP 4)
function syncToFirebase() {
    if (gameState.gameMode !== "online" || !onlineRoomId || isSyncingFromFirebase || !window.db ||
		!window.firebaseAuthReady) {
		return;
	}
    const payload = {
        gameState: gameState,
        market: market,
        deck: deck,
        discardPile: discardPile,
        lastUpdated: Date.now()
    };
    window.dbSet(window.dbRef(window.db, "games/" + onlineRoomId), payload);
}

function listenToFirebaseOld(roomId) {
    if (!window.db) return;
    window.dbOnValue(window.dbRef(window.db, "games/" + roomId), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        isSyncingFromFirebase = true;
        if (data.gameState)
		{
			Object.assign(gameState, data.gameState);
			if (gameState.p1) {
				if (!gameState.p1.lastRoll) gameState.p1.lastRoll = [];
				if (!gameState.p1.inventory) gameState.p1.inventory = [];
			}
			if (gameState.p2) {
				if (!gameState.p2.lastRoll) gameState.p2.lastRoll = [];
				if (!gameState.p2.inventory) gameState.p2.inventory = [];
			}
			if (!gameState.log) gameState.log = [];
			if (!Array.isArray(gameState.log)) {
                gameState.log = Object.values(gameState.log);
            }
			// 2. Safely apply Guest name once room state is loaded
            if (onlineLocalRole === 2 && window.pendingGuestName) {
                gameState.p2.name = window.pendingGuestName;
                window.pendingGuestName = null; // Prevent re-triggering
                syncToFirebase();
            }
			
			
		}
        if (data.market) market = data.market;
        if (data.deck) deck = data.deck;
        if (data.discardPile) discardPile = data.discardPile;
        isSyncingFromFirebase = false;
        updateUI();
    });
}

function listenToFirebase(roomId) {
    if (!window.db || !window.dbRef || !window.dbOnValue) return;

    const roomRef = window.dbRef(window.db, "games/" + roomId);
    
    window.dbOnValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.gameState) return;

        isSyncingFromFirebase = true;
        try {
            gameState = data.gameState;
            if (data.market) market = data.market;
            if (data.deck) deck = data.deck;
            if (data.discardPile) discardPile = data.discardPile;

            // Sync Guest selections to Firebase if Host state overwrites with placeholders
            if (onlineLocalRole === 2) {
                let needsUpdate = false;
                if (window.pendingGuestName) {
                    gameState.p2.name = window.pendingGuestName;
                    needsUpdate = true;
                }
                if (window.pendingGuestTarget) {
                    gameState.p1.transformTarget = window.pendingGuestTarget;
                    needsUpdate = true;
                }
                if (needsUpdate && window.dbUpdate) {
                    let updates = {};
                    updates["games/" + onlineRoomId + "/gameState/p2/name"] = gameState.p2.name;
                    updates["games/" + onlineRoomId + "/gameState/p1/transformTarget"] = gameState.p1.transformTarget;
                    window.dbUpdate(window.dbRef(window.db), updates);
                }
            }

            // Sanitize incoming inventory and roll arrays
            ['p1', 'p2'].forEach(p => {
                if (gameState[p]) {
                    gameState[p].inventory = gameState[p].inventory ? (Array.isArray(gameState[p].inventory) ? gameState[p].inventory : Object.values(gameState[p].inventory)) : [];
                    gameState[p].lastRoll = gameState[p].lastRoll || [];
                    gameState[p].lastKeep = gameState[p].lastKeep || [];
                }
            });

            if (!gameState.log) gameState.log = [];
            if (!Array.isArray(gameState.log)) gameState.log = Object.values(gameState.log);
			if (
				localForfeitPending &&
				gameState.endReason === "forfeit" &&
				Number(gameState.forfeitingPlayerId) === Number(onlineLocalRole)
			) {
				return;
			}

            updateUI();
        } catch (err) {
            console.error("Error in listenToFirebase:", err);
        } finally {
            isSyncingFromFirebase = false;
        }
    });
}

const logEl = document.getElementById("game-log");
// ============================================================
// GAME RECORDER  (for analysing games and improving the AI)
// ------------------------------------------------------------
// Records every solo game: the full log (not just the last 50 lines), every roll with the dice you
// kept, every purchase / action with before-and-after stats, a state snapshot at each turn start,
// and the Master AI's plan. Games are saved in the browser (safeStorage --localStorage--, newest REC_MAX_GAMES kept)
// and exported with the "Download Game Logs" button.
// ============================================================
const REC_STORAGE_KEY = "hypduel_recordings_v1";
const REC_MAX_GAMES = 10;
const REC_MAX_CHARS = 3500000;      // stay well under the ~5 MB localStorage limit
let gameRec = null;
let recSaveTimer = null;

function recMini() {      // compact stat line: [energy, trance, arousal, transform, vulnerability]
    const a = p => [p.energy, p.trance, p.arousal, p.transform, p.vulnerability || 0];
    return { sub: gameState.submission, p1: a(gameState.p1), p2: a(gameState.p2) };
}
function recSnap() {
    const inv = p => (p.inventory || []).map(c => c.id);
    return { sub: gameState.submission, round: gameState.round,
             p1: recMini().p1, p2: recMini().p2, inv1: inv(gameState.p1), inv2: inv(gameState.p2),
             market: market.map(c => c ? c.id : null), deck: deck.length };
}
function recFaces(dice) { return dice.map(d => (typeof cpuFaceKey === "function" ? cpuFaceKey(d.face) : d.face) || "-").join(" "); }
function recEvent(type, data) {
    if (!gameRec) return;
    try { gameRec.events.push(Object.assign({ n: gameRec.events.length, r: gameState.round, who: gameState.activePlayer, type }, data || {})); } catch (e) {}
}
function recStart() {
    gameRec = {
        version: 1, id: Date.now(), startedAt: new Date().toISOString(),
        mode: gameState.gameMode, cpuDifficulty: gameState.p2.difficulty,
        players: { p1: { name: gameState.p1.name, target: gameState.p1.transformTarget },
                   p2: { name: gameState.p2.name, target: gameState.p2.transformTarget } },
        settings: { energyActions: gameState.showEnergyActions },
        firstPlayer: gameState.activePlayer, outcome: null, events: []
    };
    recEvent("start", { snap: recSnap() });
    recScheduleSave();
}
function recFinish(winner) {
    if (!gameRec || gameRec.outcome) return;
    gameRec.outcome = { winner, round: gameState.round, final: recSnap(), endedAt: new Date().toISOString() };
    recEvent("end", { winner });
    recSave();
}
function recLoadAll() { try { return JSON.parse(safeStorage.get(REC_STORAGE_KEY) || "[]"); } catch (e) { return []; } }
function recSave() {
    if (!gameRec) return;
    try {
        let all = recLoadAll().filter(g => g.id !== gameRec.id);
        all.push(gameRec);
        while (all.length > REC_MAX_GAMES) all.shift();
        let json = JSON.stringify(all);
        while (json.length > REC_MAX_CHARS && all.length > 1) { all.shift(); json = JSON.stringify(all); }
        safeStorage.set(REC_STORAGE_KEY, json);
    } catch (e) { /* storage full or disabled: the game stays in memory and can still be downloaded */ }
}
function recScheduleSave() {
    if (recSaveTimer) return;
    recSaveTimer = setTimeout(() => { recSaveTimer = null; recSave(); }, 2000);
}
function recTranscript(g) {
    return g.events.filter(e => e.type === "log").map(e => `R${e.r} P${e.who}: ${e.msg}`);
}
function recExport() {
    recSave();
    const games = recLoadAll();
    if (gameRec && !games.some(g => g.id === gameRec.id)) games.push(gameRec);
    return {
        exportedAt: new Date().toISOString(),
        note: "faces: SP=Spiral LU=Lucidity EN=Energy SU=Submission AR=Arousal TR=Transform. Stat arrays are [energy, trance, arousal, transform, vulnerability]. sub > 0 means the marker is on Player 2/CPU's side. winner 1 = Player 1 (human), 2 = Player 2 (CPU). outcome null = game was abandoned.",
        cardIndex: KNOWN_CARDS.map(c => ({ id: c.id, name: c.name, cost: c.cost, type: c.type })),
        progress: getDefeatProgress(),
        games: games.map(g => Object.assign({}, g, { transcript: recTranscript(g) }))
    };
}
function recDownload() {
    const data = recExport();
    if (!data.games.length) { alert("No recorded games yet. Play a solo game first."); return; }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hypnotic-duel-games-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
// ---------- progress: which difficulty levels the human has beaten ----------
const DEFEATS_KEY = "hypduel_defeats_v1";
const DIFFICULTY_ORDER = ["random", "smart", "aggressive", "defensive", "v23low", "trans", "adaptive"];
function loadDefeats() { try { return JSON.parse(localStorage.getItem(DEFEATS_KEY) || "{}"); } catch (e) { return {}; } }
function recordDifficultyResult(difficulty, humanWon) {
    try {
        const all = loadDefeats();
        const r = all[difficulty] || { games: 0, wins: 0, losses: 0, firstWin: null, lastWin: null, lastPlayed: null };
        const now = new Date().toISOString();
        r.games++; r.lastPlayed = now;
        if (humanWon) { r.wins++; if (!r.firstWin) r.firstWin = now; r.lastWin = now; } else r.losses++;
        all[difficulty] = r;
        localStorage.setItem(DEFEATS_KEY, JSON.stringify(all));
    } catch (e) { /* storage disabled: progress simply isn't saved */ }
}
function hasDefeated(difficulty) { const r = loadDefeats()[difficulty]; return !!(r && r.wins > 0); }
// one row per level, in ladder order: { difficulty, label, games, wins, losses, defeated, firstWin, lastWin }
function getDefeatProgress() {
    const all = loadDefeats();
    return DIFFICULTY_ORDER.map(d => {
        const r = all[d] || { games: 0, wins: 0, losses: 0, firstWin: null, lastWin: null };
        return { difficulty: d, label: CPU_DIFFICULTY_NAMES[d] || d, games: r.games, wins: r.wins, losses: r.losses, defeated: r.wins > 0, firstWin: r.firstWin, lastWin: r.lastWin };
    });
}
function clearDefeats() { try { localStorage.removeItem(DEFEATS_KEY); } catch (e) {} }
window.hypDuelProgress = getDefeatProgress;      // try it in the console: console.table(hypDuelProgress())
function recClear() { try { localStorage.removeItem(REC_STORAGE_KEY); } catch (e) {} }

// Wrap the game's own action functions so every call is recorded (behaviour is unchanged).
function recWrap(name, describe, withDice) {
    const orig = globalThis[name];
    if (typeof orig !== "function") return;
    globalThis[name] = function (...args) {
        let pre = null, d = null;
        if (gameRec) { try { pre = recMini(); d = describe ? describe(...args) : null; } catch (e) {} }
        const result = orig.apply(this, args);
        if (gameRec) {
            try {
                const ev = { fn: name, by: gameState.activePlayer, before: pre, after: recMini() };
                if (d) ev.args = d;
                if (withDice) ev.diceAfter = recFaces(gameState.dice);
                recEvent("act", ev);
            } catch (e) {}
        }
        return result;
    };
}
function recInstall() {
    const mk = i => { const c = market[i]; return c ? { id: c.id, card: c.name, cost: getCardPurchaseCost(c, gameState.activePlayer) } : null; };
    recWrap("buyCard", i => Object.assign({ market: market.map(c => c ? c.id : null) }, mk(i)));
    recWrap("buyAction", (type, pId) => ({ action: type, player: pId }));
    recWrap("wipeMarket", () => ({ market: market.map(c => c ? c.id : null) }));
    recWrap("sellCard", (i, pId) => { const p = pId === 1 ? gameState.p1 : gameState.p2; return { card: p.inventory[i] && p.inventory[i].name, player: pId }; });
    recWrap("discardForFreeBuy", (i, pId) => { const p = pId === 1 ? gameState.p1 : gameState.p2; return { card: p.inventory[i] && p.inventory[i].name, player: pId }; });
    recWrap("buyReroll", (cost, cardId, pId) => ({ cardId, player: pId }));
    recWrap("useAbsoluteFocus", (i, pId) => ({ player: pId }));
    recWrap("useQuietMind", pId => ({ player: pId }));
    recWrap("useRapidPulse", pId => ({ player: pId }));
    recWrap("useFadingReality", pId => ({ player: pId }));
    recWrap("useSimmeringArousal", pId => ({ player: pId }));
    recWrap("buyCardFromOpponent", (buyer, i) => ({ buyer, index: i }));
    recWrap("confirmLucidity", () => ({ allocations: JSON.parse(JSON.stringify(lucidityState.allocations)), points: lucidityState.total }));
    // each roll: which dice were KEPT going into it, and what came up
    recWrap("rollDiceAction", () => ({ keptBefore: gameState.dice.map(d => (d.kept ? 1 : 0)).join(""), facesBefore: recFaces(gameState.dice), rerollsLeft: gameState.rerollsLeft }), true);
    // end of dice phase: the final dice (not awaited so CPU timing is unchanged)
    const origResolve = globalThis.resolveDice;
    if (typeof origResolve === "function") {
        globalThis.resolveDice = function (...args) {
            if (gameRec) { try { recEvent("resolve", { dice: recFaces(gameState.dice), before: recMini() }); } catch (e) {} }
            return origResolve.apply(this, args);
        };
    }
    const origStart = globalThis.startTurn;
    if (typeof origStart === "function") {
        globalThis.startTurn = function (...args) {
            const result = origStart.apply(this, args);
            if (gameRec) { try { recEvent("turn_start", { snap: recSnap(), dice: gameState.dice.length, rerolls: gameState.rerollsLeft }); recScheduleSave(); } catch (e) {} }
            return result;
        };
    }
    const origEnd = globalThis.endTurn;
    if (typeof origEnd === "function") {
        globalThis.endTurn = function (...args) {
            if (gameRec && !(typeof isChoicePending === "function" && isChoicePending())) { try { recEvent("turn_end", { snap: recSnap() }); } catch (e) {} }
            return origEnd.apply(this, args);
        };
    }
    if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("pagehide", () => { recSave(); });
        window.addEventListener("beforeunload", () => { recSave(); });
    }
}


function log(msg, bold = false) {
	try { recEvent("log", { msg: String(msg) }); } catch (e) {}
	if (!gameState) return;
	if (!gameState.log) gameState.log = [];
	if (!Array.isArray(gameState.log)) {
        gameState.log = Object.values(gameState.log);
    }

    msg = cpuDecorateLog(String(msg));
    gameState.log.push(msg);

    // Retain all entries for this match; the visibility toggle only hides the panel.
    renderLog();
    renderTurnHistory();
    setGameLogVisible(localShowGameLog);
    logEl.scrollTop = logEl.scrollHeight;
}


const GAME_VERSION = "20261018.3"; // Update this label for each release.
function showAboutBox() {
    const body = `<div style="text-align:left;font-size:.95rem;line-height:1.65;">Hypnotic Duel created 2026 by Siobhán Greene.<br><img src="images/aboutBoxPicture.png" alt="Hypnotic Duel" style="display:block;width:100%;max-width:360px;max-height:190px;object-fit:contain;margin:12px auto 14px;border-radius:8px;" onerror="this.style.display='none'"><br>Much thanks for the inspiration for game mechanics from Richard Garfield and Edwin S Lowe. Also thanks to friends that helped test, create content, and agree to be content with this project.<br><br>For everyone that loves hypnosis and transformations. Hopefully I am not the only one!<div style="text-align:right;margin-top:18px;color:#b9a8cf;font-size:.8rem;">Version ${GAME_VERSION}</div></div>`;
    showPopup("About Hypnotic Duel", body);
}

function closePopup(){ const e=document.getElementById("game-popup"); if(e)e.style.display="none"; }
function showPopup(title, body) {
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-body").innerHTML = body;
    const shell = document.querySelector("#game-popup .modal-content");
    if (shell) shell.classList.remove("card-popup-instant", "card-popup-keep");
    document.getElementById("game-popup").style.display = "flex";
}
function getCardRef(playerId, cardId) {
    if (playerId === 0 || !gameState) return null;
    
    const player = playerId === 1 ? gameState.p1 : gameState.p2;
    let inv = player?.inventory || [];

    // Convert Firebase object back into an Array if needed
    if (!Array.isArray(inv)) {
        inv = Object.values(inv);
    }

    return inv.find(c => c && c.id === cardId) || null; 
}

function hasCard(playerId, cardId) {
    return !!getCardRef(playerId, cardId);
}

// ============================================================
// CPU AI DIFFICULTY SYSTEM
// ============================================================
const CPU_DIFFICULTY_NAMES = { random: "Beginner", smart: "Easy", aggressive: "Normal", v23low: "Hard", defensive: "Expert", transformer: "Virtuoso", adaptive: "Master" };
function getCpuDifficulty() { return gameState.p2.difficulty || "random"; }
function cpuTitleActive() { return !!gameState && gameState.gameMode === "solo" && getCpuDifficulty() === "adaptive"; }
// regex source for an optional "Master " / "Mistress " in front of the CPU's name, so the title is coloured with the name
function nameTitlePrefixSource(cls) { return (cls === "player-name-p2" && cpuTitleActive()) ? "(?:(?:Master|Mistress) )?" : ""; }
function cpuMasterTitle(cpuName) { return getGender(cpuName) === "female" ? "Mistress" : "Master"; }
function getCpuDifficultyName() {
    const d = getCpuDifficulty();
    if (d === "adaptive") return cpuMasterTitle(gameState.p2 && gameState.p2.name);   // Master for male CPUs, Mistress for female CPUs
    return CPU_DIFFICULTY_NAMES[d] || "Beginner";
}
// Display name: "Master Alex" / "Mistress Roz" while the Master AI is playing as the CPU (display only; the real name is unchanged)
function playerDisplayName(pObj) {
    if (!pObj) return "";
    if (gameState && pObj === gameState.p2 && gameState.gameMode === "solo" && getCpuDifficulty() === "adaptive" && pObj.name)
        return `${cpuMasterTitle(pObj.name)} ${pObj.name}`;
    return pObj.name;
}
function cpuDecorateLog(msg) {          // same title inside log lines
    try {
        if (!gameState || !gameState.p2 || gameState.gameMode !== "solo" || getCpuDifficulty() !== "adaptive" || !gameState.p2.name) return msg;
        const name = gameState.p2.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?<!(?:Master|Mistress) )(?<![\\p{L}\\p{N}])${name}(?![\\p{L}\\p{N}])`, "gu");
        return msg.replace(re, `${cpuMasterTitle(gameState.p2.name)} ${gameState.p2.name}`);
    } catch (e) { return msg; }
}
function updateMasterOptionLabel() {
    const opt = document.getElementById("cpu-diff-master-option");
    const sel = document.getElementById("cpu-name");
    if (!opt || !sel) return;
    const title = sel.value === "Random" ? "Master/Mistress" : cpuMasterTitle(sel.value);
    opt.textContent = `${title}`;
}
function cpuCountFace(face) { return gameState.dice.filter(d => d.face === face).length; }

function cpuKeepDie(face, difficulty, counts) {
    if (difficulty === "random") return Math.random() > 0.5;
    if (difficulty === "smart") return (face === "⛓️ SUBMISSION" || face === "⚡ ENERGY" || (face === "👁️ TRANSFORM" && counts.transform >= 2));
    if (difficulty === "aggressive") {
		if (["👁️ TRANSFORM", "⛓️ SUBMISSION", "⚡ ENERGY"].includes(face)) return true;
        if (face === "💧 LUCIDITY") return gameState.p2.trance >= 3 || gameState.p2.arousal >= 3 || gameState.p2.vulnerability >= 1;
        if (face === "🌀 SPIRAL") return gameState.p1.trance >= 3;
        return false;
    }
    if (difficulty === "v23low") {
        if (["👁️ TRANSFORM", "⚡ ENERGY"].includes(face)) return true;
        if (face === "⛓️ SUBMISSION") return counts.submission >= 4 || (counts.submission >= 3 && gameState.p2.transform >= 7 && gameState.p1.transform >= 7);
        if (face === "💧 LUCIDITY") return (gameState.p2.trance >= 4 || gameState.p2.arousal >= 4 || gameState.p2.vulnerability >= 1);
        return false;
    }
    if (difficulty === "defensive") {
        if (face === "💧 LUCIDITY") return (gameState.p2.trance >= 2 || gameState.p2.arousal >= 2 || gameState.p2.vulnerability >= 1);
        if (face === "⚡ ENERGY") return true;
        if (face === "👁️ TRANSFORM") return counts.transform >= 2 || gameState.p1.transform >= 6;
        if (face === "⛓️ SUBMISSION") return counts.submission >= 2 && gameState.p1.transform >= 5;
        if (face === "🌀 SPIRAL") return gameState.p1.trance >= 3;
        if (face === "🔥 AROUSAL") return gameState.p1.arousal >= 3;
        return false;
    }
    return false;
}

function cpuChooseDiceToKeep() {
    if (cpuIsAdaptive()) { cpuAdaptiveChooseKeep(); return; }
	const pinned = isCpuPinnedInSubmission();
    const difficulty = getCpuDifficulty();
    const counts = { spiral: cpuCountFace("🌀 SPIRAL"), lucidity: cpuCountFace("💧 LUCIDITY"), energy: cpuCountFace("⚡ ENERGY"), submission: cpuCountFace("⛓️ SUBMISSION"), arousal: cpuCountFace("🔥 AROUSAL"), transform: cpuCountFace("👁️ TRANSFORM") };
    if (CPU_TIERS[difficulty]) {
        const capped = CPU_TIERS[difficulty].maxRerolls;
        if (capped && (cpuBrain.rerollsUsed || 0) >= capped) {
            if (cpuBrain.capDecided !== gameState.round + ":" + cpuBrain.rerollsUsed) {          // decide once per turn whether to stop here
                cpuBrain.capDecided = gameState.round + ":" + cpuBrain.rerollsUsed;
                cpuBrain.capStop = Math.random() < (CPU_TIERS[difficulty].capChance ?? 1);
            }
            if (cpuBrain.capStop) { gameState.dice.forEach(d => { d.kept = true; }); return; }   // done rerolling: keep what we have
        }
        cpuBrain.rerollsUsed = (cpuBrain.rerollsUsed || 0) + 1;
        const plan = cpuTierKeepPlan(difficulty, gameState.rerollsLeft);
        gameState.dice.forEach((die, i) => { die.kept = plan[i]; });
        return;
    }
    gameState.dice.forEach(die => 
	{
		if (!die.kept)
		{
			// emergency override for submission
			if (pinned && die.face.includes("SUBMISSION"))
				die.kept = true;
			else
				die.kept = cpuKeepDie(die.face, difficulty, counts); 
		}
	});
    // Beginner / Easy: still never lock dice that cannot help
    const keepNow = gameState.dice.map(d => !!d.kept);
    cpuReleaseUselessKeeps(keepNow, gameState.rerollsLeft);
    gameState.dice.forEach((die, i) => { die.kept = keepNow[i]; });
}

function cpuShouldUseQuietMind() {
    const p = gameState.p2;
    if (!hasCard(2, 33) || p.energy < 2) return false;
    if (p.trance <= 0 && p.arousal <= 0) return false;
    if (cpuIsAdaptive()) return cpuAdaptiveWantsCalm();

    switch (getCpuDifficulty()) {
        case "defensive":  return p.arousal >= 3 || p.trance >= 3;     // wants Arousal at 2 or less
        case "aggressive": return p.arousal >= 4 || p.trance >= 4;     // only one step from max (or at it)
        case "v23low":     return p.arousal >= 4 || p.trance >= 4;
        case "transformer": return p.arousal >= 3 || p.trance >= 4;     // Arousal from 3; barely cares about its own Trance
        case "random":     return Math.random() > 0.5;
        default:           return p.arousal > 2 || p.trance >= 4; // smart
    }
}

function cpuUseQuietMind() {
    const p = gameState.p2;
    if (!cpuShouldUseQuietMind()) return false;
    p.energy -= 2;
    let lowered = "Trance";
    if (cpuIsAdaptive()) {
        if (p.arousal >= 3 && !(p.trance >= 4 && p.arousal === 4)) { p.arousal--; lowered = "Arousal"; }
        else if (p.trance > 0) p.trance--;
        else { p.arousal--; lowered = "Arousal"; }
    } else if (cpuIsTier()) {
        const cfg = CPU_TIERS[getCpuDifficulty()];
        if (p.arousal >= cfg.danger.arousal || p.trance <= 0) { p.arousal--; lowered = "Arousal"; }
        else p.trance--;
    } else if (p.trance > 0 && p.arousal > 0) {
        if (p.arousal > p.trance) { p.arousal--; lowered = "Arousal"; }
        else p.trance--;
    } else if (p.arousal > 0) {
        p.arousal--;
        lowered = "Arousal";
    } else {
        p.trance--;
    }
    log(`CPU used Quiet Mind (-2⚡) to lower ${lowered}.`);
    return true;
}

function cpuShouldUseRapidPulse() {
    const p = gameState.p2;
    if (!hasCard(2, 12) || p.energy < 2 || p.shieldActive) return false;
    switch (getCpuDifficulty()) {
        case "random": return Math.random() > 0.75;
        case "smart": return p.trance >= 3 || p.arousal >= 3;
        case "aggressive": return p.trance >= 4 || p.arousal >= 4;
        case "v23low": return p.trance >= 4 || p.arousal >= 4 || p.vulnerability >= 1;
        case "transformer": return p.arousal >= 3 || p.vulnerability >= 1;
        case "adaptive": {
            const th = cpuObservedThreats();
            if (p.arousal >= 3 && p.energy >= 2) return true;                 // protect the little rerolls we have left
            return (p.trance >= 3 || p.vulnerability >= 1 || (p.arousal >= 2 && th.arousal >= 2.5) || (p.trance >= 2 && th.trance >= 2)) && p.energy >= 4;
        }
        case "defensive": return p.trance >= 2 || p.arousal >= 2 || p.vulnerability >= 1;
        default: return false;
    }
}

function cpuShouldUseFadingReality(tCount) {
    if (!hasCard(2, 47)) return false;
    if (cpuIsAdaptive()) {
        if (cpuBrain.hunting) return false;
        return cpuCountsFromFaces(gameState.dice.map(d => d.face)).TR === 1 && gameState.dice.some(d => cpuFaceKey(d.face) === "TR" && !d.kept);
    }
    if (gameState.dice.findIndex(d => d.face === "👁️ TRANSFORM" && !d.kept) === -1) return false;
    switch (getCpuDifficulty()) {
        case "random": return Math.random() > 0.75;
        case "smart": case "v23low": case "defensive": return tCount < 2;
        case "aggressive": return tCount < 3;
        case "transformer": return tCount < 3;                    // always chase 👁️
        default: return false;
    }
}

function cpuShouldUseAbsoluteFocus(keptCount) {
    const card = getCardRef(2, 20);
    if (!card || !card.charges || card.charges <= 0) return false;
    if (cpuIsAdaptive()) return cpuExtraRerollGain() >= 0.3;
    if (!cpuLegacyHasFreeDice()) return false;                      // everything would stay locked
    if (cpuIsTier()) keptCount = cpuTierKeepPlan(getCpuDifficulty(), 1).filter(Boolean).length;
    return getCpuDifficulty() === "random" ? Math.random() > 0.8 : keptCount < 4;
}

// FIX ME!!!
function cpuShouldUseHypnoticSuggestion(keptCount) {
    const p = gameState.p2;
    if (!hasCard(2, 16) || p.energy < 1 || gameState.rerollsLeft > 0) return false;
    if (!gameState.dice.length || gameState.dice[0].face === "-") return false;
    if (cpuIsAdaptive()) return cpuExtraRerollGain() >= 0.22;
    if (!cpuLegacyHasFreeDice()) return false;                      // everything would stay locked: a reroll changes nothing
    if (cpuIsTier()) keptCount = cpuTierKeepPlan(getCpuDifficulty(), 1).filter(Boolean).length;

    switch (getCpuDifficulty()) {
        case "random":     return Math.random() > 0.55;
        case "smart":      return keptCount < 3 && p.energy >= 2;
        case "aggressive": return keptCount < 4 && p.energy >= 4;     // keeps a little more energy back for cards
        case "v23low":     return keptCount < 3 && p.energy >= 5;     // energy theme: spends it on cards, not rerolls
        case "transformer": return keptCount < 4 && p.energy >= 3;    // rerolls are how it finds 👁️👁️👁️
        case "defensive":  return keptCount < 3 && p.energy >= 2 && (p.trance >= 2 || p.arousal >= 2 || p.vulnerability > 0);
        default:           return false;
    }
}


//Checks if the CPU is pinned near the losing edge of the submission track.
// Adjust 'PINNED_THRESHOLD' or polarity (+ / -) to match your game's track orientation.
function isCpuPinnedInSubmission() {
    // Example: If +5 is defeat for CPU, pinned is +3 or higher.
    // If -5 is defeat for CPU, change condition to: gameState.submission <= -3
    const PINNED_THRESHOLD = 3; 
    return gameState.submission >= PINNED_THRESHOLD;
}



// ============================================================
// ADAPTIVE CPU AI  ("Master" difficulty, key = "adaptive")
// ------------------------------------------------------------
// Starts with no plan. Every turn it looks at:
//   (a) the dice it has been rolling,
//   (b) the cards it owns,
//   (c) the cards / dice the human is collecting,
// and commits to the strategy that fits best (see CPU_STRATEGIES).
// While rolling it adapts which dice to keep, can hunt for Trigger Word,
// and in the shop it buys cards that fit its plan, blocks the human's
// combos (buying the key card or wiping the market) and converts
// Energy into Transform when the game is closing.
// ============================================================
const CPU_DEBUG_LOG = true;   // true = the CPU explains its plan in the game log. Set false for release.

// strategy -> which faces matter and which cards support it (1 = helpful, 3 = core piece)
const CPU_STRATEGIES = {
    transform: { label: "Transform Rush",     faces: { TR: 1.0, SU: 0.7 },
                 cards: { 55: 2, 56: 2, 2: 3, 41: 3, 22: 2, 17: 1, 4: 1, 3: 1, 30: 2, 25: 2, 47: 1 } },
    submission: { label: "Submission Squeeze", faces: { SU: 1.0, TR: 0.7 },
                 cards: { 36: 3, 15: 3, 46: 2, 24: 2, 23: 1, 10: 2, 39: 2, 11: 1, 18: 1, 8: 1, 52: 2, 34: 1 } },
    arousal:   { label: "Arousal Lock",       faces: { AR: 1.0, TR: 0.5 },
                 cards: { 13: 3, 49: 3, 48: 2, 6: 2 } },
    trance:    { label: "Trance Engine",      faces: { SP: 1.0, EN: 0.6 },
                 cards: { 0: 3, 17: 3, 31: 2, 14: 2, 8: 2, 18: 1 } },
    energy:    { label: "Energy Engine",      faces: { EN: 1.0, SP: 0.4 },
                 cards: { 45: 3, 28: 2, 29: 2, 27: 1, 31: 1, 19: 1, 42: 1 } }
};
// cards that answer a given opposing strategy
const CPU_COUNTERS = {
    arousal:    [50, 32, 12, 33, 9],
    trance:     [21, 12, 9, 33, 37],
    submission: [34, 53, 15],
    transform:  [44, 51, 38, 9],
    energy:     [37]
};
const CPU_ONE_POINT_PUSHERS = [15, 46, 22, 34];   // Mesmerizing Rhythm blocks pushes of exactly 1

let cpuBrain = { plan: "none", planScores: {}, oppPlan: "none", oppScores: {}, history: [], oppHistory: [],
                 wipes: 0, hunting: false, lastOppRound: -1, lastEnd: null, taken: [], savingFor: null };
function cpuBrainReset() {
    cpuBrain = { plan: "none", planScores: {}, oppPlan: "none", oppScores: {}, history: [], oppHistory: [],
                 wipes: 0, hunting: false, lastOppRound: -1, lastEnd: null, taken: [], savingFor: null };
}
function cpuIsAdaptive() { return getCpuDifficulty() === "adaptive"; }
function cpuSay(msg) { if (CPU_DEBUG_LOG) log(`🧠 ${msg}`); }

// ---------- helpers ----------
function cpuFaceKey(face) {
    const f = String(face).toUpperCase();
    if (f.includes("SPIRAL")) return "SP";
    if (f.includes("LUCIDITY")) return "LU";
    if (f.includes("ENERGY")) return "EN";
    if (f.includes("SUBMISSION")) return "SU";
    if (f.includes("AROUSAL")) return "AR";
    if (f.includes("TRANSFORM")) return "TR";
    return null;
}
function cpuCountsFromFaces(faces) {
    const c = { SP: 0, LU: 0, EN: 0, SU: 0, AR: 0, TR: 0 };
    faces.forEach(f => { const k = cpuFaceKey(f); if (k) c[k]++; });
    return c;
}
function cpuBinom(n, k, p) {
    if (k < 0 || k > n) return 0;
    let c = 1;
    for (let i = 1; i <= k; i++) c = c * (n - k + i) / i;
    return c * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Expected "effect points" from a threshold face (Transform / Submission need 3+; each die past 3 adds 1).
// c = dice of the face we are holding, free = dice we can still reroll, r = rerolls left.
function cpuThresholdEV(c, free, r, bonus) {
    let dist = new Map([[c, 1]]);
    for (let i = 0; i < r; i++) {
        const next = new Map();
        dist.forEach((pr, cur) => {
            const f = free - (cur - c);
            for (let k = 0; k <= f; k++) {
                const q = pr * cpuBinom(f, k, 1 / 6);
                if (q > 0) next.set(cur + k, (next.get(cur + k) || 0) + q);
            }
        });
        dist = next;
    }
    let ev = 0;
    dist.forEach((pr, cur) => { if (cur >= 3) ev += pr * (1 + (cur - 3) + bonus); });
    return ev;
}

// Chance of ending with all six faces (Trigger Word) if we keep one die of each face and reroll the rest.
// m = faces still missing, free = rerollable dice, r = rerolls left.
const _cpuTrigMemo = {};
function cpuTrigProb(m, free, r) {
    if (m <= 0) return 1;
    if (r <= 0 || free <= 0) return 0;
    const key = m + "," + free + "," + r;
    if (key in _cpuTrigMemo) return _cpuTrigMemo[key];
    let dist = new Array(m + 1).fill(0); dist[0] = 1;
    for (let d = 0; d < free; d++) {
        const nd = new Array(m + 1).fill(0);
        for (let j = 0; j <= m; j++) {
            if (!dist[j]) continue;
            const pHit = (m - j) / 6;
            if (j < m) nd[j + 1] += dist[j] * pHit;
            nd[j] += dist[j] * (1 - pHit);
        }
        dist = nd;
    }
    let total = 0;
    for (let j = 0; j <= m; j++) {
        if (!dist[j]) continue;
        total += dist[j] * (j === m ? 1 : cpuTrigProb(m - j, free - j, r - 1));
    }
    _cpuTrigMemo[key] = total;
    return total;
}

// ---------- strategy detection ----------
function cpuStrategyScores(playerId) {
    const inv = gameState["p" + playerId].inventory || [];
    const hist = playerId === 2 ? cpuBrain.history : cpuBrain.oppHistory;
    const scores = {};
    Object.keys(CPU_STRATEGIES).forEach(key => {
        const s = CPU_STRATEGIES[key];
        let sc = inv.reduce((sum, c) => sum + (s.cards[c.id] || 0), 0);
        if (hist.length) {
            let ev = 0;
            hist.forEach(counts => { Object.keys(s.faces).forEach(fk => { ev += (counts[fk] || 0) * s.faces[fk]; }); });
            ev /= hist.length;
            sc += Math.max(0, ev - 1.5) * 1.2;       // ~1.5 weighted dice is just noise
        }
        scores[key] = sc;
    });
    return scores;
}
function cpuBestStrategy(scores, current) {
    let best = "none", bestV = 1.5;                  // need real evidence before committing
    Object.keys(scores).forEach(k => { if (scores[k] > bestV) { best = k; bestV = scores[k]; } });
    if (current && current !== "none" && scores[current] >= 1.5 && scores[current] >= bestV - 0.75) return current;  // hysteresis
    return best;
}
// What the human has actually been doing TO us (averaged over their last 3 turns), as threat scores per strategy.
function cpuObservedThreats() {
    const t = cpuBrain.taken || [];
    if (!t.length) return { arousal: 0, trance: 0, submission: 0, transform: 0 };
    const avg = k => t.reduce((sum, x) => sum + (x[k] || 0), 0) / t.length;
    const me = gameState.p2;
    return {
        arousal:    avg("ar") * 2.5 + (me.arousal >= 3 ? 1.5 : 0),
        trance:     avg("tr") * 1.5,
        submission: avg("sub") * 1.5 + (gameState.submission >= 3 ? 2 : 0),
        transform:  avg("tf") * 3 + avg("vu") * 2
    };
}
// remember how our stats looked when we finished our turn; the difference next turn is the human's damage
function cpuNoteEndOfTurn() {
    const p = gameState.p2;
    cpuBrain.lastEnd = { ar: p.arousal, tr: p.trance, sub: gameState.submission, tf: p.transform, vu: p.vulnerability || 0 };
}
function cpuNoteDamageTaken() {
    const p = gameState.p2, e = cpuBrain.lastEnd;
    if (!e || cpuBrain.lastDamageRound === gameState.round) return;      // ignore extra turns in the same round
    cpuBrain.lastDamageRound = gameState.round;
    cpuBrain.taken.push({
        ar: Math.max(0, p.arousal - e.ar), tr: Math.max(0, p.trance - e.tr),
        sub: Math.max(0, gameState.submission - e.sub),            // positive = toward the CPU's end
        tf: Math.max(0, p.transform - e.tf), vu: Math.max(0, (p.vulnerability || 0) - e.vu)
    });
    if (cpuBrain.taken.length > 3) cpuBrain.taken.shift();
}
function cpuReplan() {
    cpuBrain.planScores = cpuStrategyScores(2);
    cpuBrain.plan = cpuBestStrategy(cpuBrain.planScores, cpuBrain.plan);
    cpuBrain.oppScores = cpuStrategyScores(1);
    const threats = cpuObservedThreats();
    Object.keys(threats).forEach(k => { cpuBrain.oppScores[k] = (cpuBrain.oppScores[k] || 0) + threats[k]; });
    cpuBrain.oppPlan = cpuBestStrategy(cpuBrain.oppScores, cpuBrain.oppPlan);
}
function cpuPlanLabel() { return cpuBrain.plan === "none" ? "No plan yet" : CPU_STRATEGIES[cpuBrain.plan].label; }

function cpuBrainBeginTurn() {
    cpuBrain.wipes = 0;
    cpuBrain.hunting = false;
    cpuNoteDamageTaken();
    const lr = gameState.p1.lastRoll || [];
    if (lr.length && cpuBrain.lastOppRound !== gameState.round) {
        cpuBrain.oppHistory.push(cpuCountsFromFaces(lr));
        if (cpuBrain.oppHistory.length > 3) cpuBrain.oppHistory.shift();
        cpuBrain.lastOppRound = gameState.round;
    }
    cpuReplan();
    const opp = cpuBrain.oppPlan === "none" ? "nothing clear" : CPU_STRATEGIES[cpuBrain.oppPlan].label;
    const tk = cpuBrain.taken.length ? cpuBrain.taken[cpuBrain.taken.length - 1] : null;
    cpuSay(`Plan: ${cpuPlanLabel()}. Reading the human as: ${opp}.${tk ? ` Last human turn did: Arousal +${tk.ar}, Trance +${tk.tr}, Submission +${tk.sub}, Transform +${tk.tf}.` : ""}`);
    recEvent("cpu_brain", { plan: cpuBrain.plan, scores: cpuBrain.planScores, oppPlan: cpuBrain.oppPlan, oppScores: cpuBrain.oppScores });
}
function cpuBrainRecordRoll() {
    cpuBrain.history.push(cpuCountsFromFaces(gameState.dice.map(d => d.face)));
    if (cpuBrain.history.length > 3) cpuBrain.history.shift();
}

// ---------- dice keeping ----------
// value of one die of each face, in rough "Transform equivalents"
function cpuFaceWeights() {
    const p = gameState.p2, opp = gameState.p1;
    const w = { TR: 1.0, SU: 0.55, AR: 0.3, SP: 0.15, EN: 0.3, LU: 0 };
    const strat = CPU_STRATEGIES[cpuBrain.plan];
    if (strat) Object.keys(strat.faces).forEach(k => { w[k] += strat.faces[k] * 0.6; });
    const has = id => hasCard(2, id);
    if (has(2)) w.TR += 0.3;
    if (has(41)) w.TR += 0.2;
    if (has(56)) w.TR += 0.3;       // Deeper Bargains: a 👁️-heavy special die
    if (has(36)) w.SU += 0.25;
    if (has(24)) w.SU += 0.2;
    if (has(13)) w.AR += 0.35;
    if (has(49)) w.AR += 0.1;
    if (has(48)) w.AR += 0.1;
    if (has(0)) w.SP += 0.15;
    if (has(17)) w.SP += 0.3;
    if (has(31)) { w.EN += 0.2; w.SP += 0.1; }
    if (has(45)) w.EN += 0.25;
    if (has(28) || has(29)) w.EN += 0.1;
    if (p.energy < 4 && p.inventory.length <= 1) w.EN += 0.25;   // opening: we need money to start a strategy
    if (opp.trance + 2 >= 5) w.SP += 0.35;                       // a setback is within reach
    const slip = Math.max(0, gameState.submission);
    if (slip >= 2) w.SU += 0.4 * (slip - 1);                      // sliding toward our end: pushing back matters more and more
    return w;
}

function cpuAdaptiveKeepPlan(rerollsAvail) {
    const dice = gameState.dice, n = dice.length;
    const p = gameState.p2, opp = gameState.p1;
    const faces = dice.map(d => cpuFaceKey(d.face));
    const counts = cpuCountsFromFaces(dice.map(d => d.face));
    const keep = new Array(n).fill(false);
    const w = cpuFaceWeights();
    const bonusTR = hasCard(2, 2) ? 1 : 0;      // Dream State
    const bonusSU = hasCard(2, 36) ? 1 : 0;     // Deeper Trance
    const pinned = isCpuPinnedInSubmission();
    const slip = Math.max(0, gameState.submission);   // how far the marker has slid toward the CPU's end
    const keepFace = (k) => { faces.forEach((f, i) => { if (f === k) keep[i] = true; }); };

    // 1) Trigger Word hunt: keep one die of every face if the odds beat chasing a triple
    if (hasCard(2, 3) && !pinned && p.vulnerability < 2) {
        const distinct = Object.keys(counts).filter(k => counts[k] > 0).length;
        const P = cpuTrigProb(6 - distinct, n - distinct, rerollsAvail);
        const altTR = cpuThresholdEV(counts.TR, n - counts.TR, rerollsAvail, bonusTR);
        const altSU = cpuThresholdEV(counts.SU, n - counts.SU, rerollsAvail, bonusSU) * 0.6;
        const alt = Math.max(altTR, altSU);
        if (distinct === 6 || (P >= 0.1 && P * 5 >= alt * 1.1)) {
            const seen = {};
            faces.forEach((f, i) => { if (!seen[f]) { seen[f] = true; keep[i] = true; } });
            return { keep, hunting: true, P };
        }
    }

    // 2) Lucidity: only keep as many as we really need
    const arousalCost = hasCard(1, 48) ? 2 : 1;          // Burning Intensity
    let luNeed = 0, severity = 0;
    if (p.vulnerability > 0) { luNeed += p.vulnerability; severity += 1.2 * p.vulnerability; }
    if (p.arousal >= 5) { luNeed += arousalCost; severity += 1.4; }
    else if (p.arousal >= 3) { luNeed += (p.arousal - 2) * arousalCost; severity += 0.9; }
    if (p.trance >= 4) { luNeed += p.trance - 2; severity += 1.4; }
    else if (p.trance >= 3) { luNeed += 1; severity += 0.7; }
    if (hasCard(2, 9) && counts.LU > 0) luNeed = Math.max(0, luNeed - 1);
    if (severity >= 0.9 && luNeed > 0) {
        let k = Math.min(counts.LU, luNeed);
        faces.forEach((f, i) => { if (f === "LU" && k > 0) { keep[i] = true; k--; } });
    }

    // 2b) CRISIS: 2+ vulnerability means rolling 2+ fewer dice. Everything else waits: chase 💧, keep only finished triples
    if (p.vulnerability >= 2) {
        ["TR", "SU"].forEach(k => { if (counts[k] >= 3) keepFace(k); });
        if (pinned) keepFace("SU");
        return { keep, hunting: false, crisis: true };
    }

    // 3) Threshold faces: pick the better of Transform / Submission, flex to the second one if it is close
    const evTR = cpuThresholdEV(counts.TR, n - counts.TR, rerollsAvail, bonusTR) * w.TR;
    const evSU = cpuThresholdEV(counts.SU, n - counts.SU, rerollsAvail, bonusSU) * w.SU;
    const lead = evTR >= evSU ? "TR" : "SU", sec = lead === "TR" ? "SU" : "TR";
    if (counts[lead] > 0) keepFace(lead);
    // pinned: keep Submission dice to build a push back, but not a lone ⛓️ when we already hold a finished triple (it would lock every die)
    if (pinned && (counts.SU >= 2 || counts[lead] < 3)) keepFace("SU");
    if (slip >= 2 && counts.SU >= 2) keepFace("SU");   // marker is sliding: build the push back
    if (counts[sec] >= 2 && (counts[lead] < 3 || counts[sec] >= 3)) keepFace(sec);

    // 4) Arousal and the linear faces (Energy, Spiral): keep them while enough dice stay free to chase a triple
    let keptNow = keep.filter(Boolean).length;
    const leadKept = counts[lead] + ((counts[sec] >= 2 && (counts[lead] < 3 || counts[sec] >= 3)) ? counts[sec] : 0);
    let minFree = counts[lead] >= 3 ? 0 : (counts[lead] === 2 ? 2 : 3);
    if (cpuBrain.plan === "energy" || cpuBrain.plan === "trance") minFree = Math.max(0, minFree - 1);
    const arousalWanted = opp.arousal < 5 && counts.AR >= 2 &&       // Arousal needs 2+ dice (Stoking Fires too)
                          (w.AR >= 0.75 || ([1, 2, 3, 4].includes(opp.arousal) && counts.AR >= 2));
    const linear = [{ k: "EN", w: w.EN }, { k: "SP", w: w.SP }];
    if (arousalWanted) linear.push({ k: "AR", w: Math.max(w.AR, 0.5) });
    linear.sort((a, b) => b.w - a.w).forEach(l => {
        if (l.w < 0.25) return;                           // not worth more than a fresh reroll
        faces.forEach((f, i) => {
            if (f !== l.k || keep[i]) return;
            if (n - keptNow > minFree) { keep[i] = true; keptNow++; }
        });
    });
    return { keep, hunting: false };
}

function cpuAdaptiveChooseKeep() {
    const plan = cpuAdaptiveKeepPlan(gameState.rerollsLeft);
    cpuBrain.hunting = plan.hunting;
    if (hasCard(2, 55) && !plan.keep.some((kp, i) => kp && cpuFaceKey(gameState.dice[i].face) === "TR")) { const i = gameState.dice.findIndex(d => cpuFaceKey(d.face) === "TR"); if (i >= 0) plan.keep[i] = true; }
    recEvent("cpu_keep", { dice: recFaces(gameState.dice), keep: plan.keep.map(k => (k ? 1 : 0)).join(""), hunting: !!plan.hunting, crisis: !!plan.crisis, rerolls: gameState.rerollsLeft });
    gameState.dice.forEach((d, i) => { d.kept = plan.keep[i]; });
}

// How many Transform-equivalents would one more reroll add right now?
// Uses the SAME keep plan the CPU will actually use, so locked dice never count as rerollable.
function cpuExtraRerollGain() {
    const dice = gameState.dice;
    const counts = cpuCountsFromFaces(dice.map(d => d.face));
    const plan = cpuAdaptiveKeepPlan(1);            // what we would keep if we rerolled right now
    const free = plan.keep.filter(k => !k).length;
    if (free === 0) return 0;                       // every die would stay locked: a reroll changes nothing
    const me = gameState.p2, slip = Math.max(0, gameState.submission);
    let gain = 0;
    if (plan.hunting) {
        const distinct = Object.keys(counts).filter(k => counts[k] > 0).length;
        gain = distinct === 6 ? 0 : 5 * cpuTrigProb(6 - distinct, free, 1);
    } else {
        const keptOf = k => dice.filter((d, i) => plan.keep[i] && cpuFaceKey(d.face) === k).length;
        const bonus = { TR: hasCard(2, 2) ? 1 : 0, SU: hasCard(2, 36) ? 1 : 0 };
        const scale = { TR: 1, SU: 0.6 };
        ["TR", "SU"].forEach(k => {
            const now = counts[k] >= 3 ? (1 + (counts[k] - 3) + bonus[k]) : 0;
            const ev = cpuThresholdEV(keptOf(k), free, 1, bonus[k]);
            gain = Math.max(gain, (ev - now) * scale[k]);
        });
    }
    if (me.vulnerability >= 2 && counts.LU < me.vulnerability) gain += 0.4 * Math.min(2, me.vulnerability - 1);   // extra rolls to find 💧
    if (slip >= 3 && counts.SU < 3) gain += 0.25 * (slip - 2);                                                  // extra rolls to find ⛓️
    return gain;
}

// Simmering Arousal: which die (if any) to turn into 🔥
function cpuPickSimmeringDie() {
    const dice = gameState.dice;
    const counts = cpuCountsFromFaces(dice.map(d => d.face));
    if (counts.AR === 0) return -1;       // a lone 🔥 does nothing (Arousal and Stoking Fires both need 2+ dice), so only convert a die when we already have one
    if (hasCard(2, 3) && Object.keys(counts).every(k => counts[k] > 0)) return -1;   // don't break a Trigger Word
    const w = cpuFaceWeights();
    let bestIdx = -1, bestVal = Infinity;
    dice.forEach((d, i) => {
        const k = cpuFaceKey(d.face);
        if (!k || k === "AR") return;
        let v = w[k] || 0;
        if ((k === "TR" || k === "SU") && counts[k] >= 3) v += 5;      // protect made triples
        else if ((k === "TR" || k === "SU") && counts[k] === 2) v += 0.6;
        if (k === "LU") v = 0.05;
        if (v < bestVal) { bestVal = v; bestIdx = i; }
    });
    return bestVal < 1.0 ? bestIdx : -1;
}

// ---------- reading the opponent / blocking ----------
// How badly would handing this card to the human hurt us?
function cpuDenyScore(card) {
    const me = gameState.p2;
    let deny = 0;
    const oppScores = cpuBrain.oppScores || {};
    Object.keys(CPU_STRATEGIES).forEach(key => {
        const aff = CPU_STRATEGIES[key].cards[card.id] || 0;
        if (!aff) return;
        const s = oppScores[key] || 0;
        if (s >= 1) {
            deny += aff * Math.min(s, 6) * 2.5;
            const held = Object.keys(CPU_STRATEGIES[key].cards)
                .filter(id => Number(id) !== card.id && hasCard(1, Number(id))).length;
            if (held >= 1 && aff >= 2) deny += 10;                // completes a combo
        }
    });
    // Reroll engines and the Trigger Word hunt are dangerous whatever the human's plan is
    const rerollKit = [7, 16, 43, 20, 54].filter(id => hasCard(1, id)).length;
    if (card.id === 3 && rerollKit >= 1) deny += 15 + rerollKit * 8;
    if ([7, 16, 43, 20].includes(card.id) && hasCard(1, 3)) deny += 20;
    // we are close to being transformed: don't let them have burst damage
    if (me.transform >= 6 && [4, 25, 30, 40, 3, 52].includes(card.id)) deny += 15 + (me.transform - 6) * 8;
    // they already have Powerful Transform: more Transform tools snowball it
    if (hasCard(1, 41) && [2, 22, 17, 4].includes(card.id)) deny += 12;
    return deny;
}

// ---------- card scoring ----------
function cpuAdaptiveCardScore(card) {
    const p2 = gameState.p2, p1 = gameState.p1;
    let score = (card.ai && card.ai.adaptive != null) ? card.ai.adaptive : 30;

    // strategy fit
    Object.keys(CPU_STRATEGIES).forEach(key => {
        const aff = CPU_STRATEGIES[key].cards[card.id] || 0;
        if (!aff) return;
        if (key === cpuBrain.plan) score += aff * 9;
        else if ((cpuBrain.planScores[key] || 0) >= 1) score += aff * 3;
    });

    // emergencies
    if (isCpuPinnedInSubmission() && SUBMISSION_RECOVERY_CARDS.includes(card.id)) score += 60;
    const danger = p2.trance >= 3 || p2.arousal >= 3 || p2.vulnerability > 0;
    if (danger && [9, 12, 33].includes(card.id)) score += 18;
    // Arousal 3+ costs rerolls (5 = none: only ~6% to roll a triple). Energy actions are off, so the only cures are
    // 💧 dice, Quiet Mind, or extra rerolls that bypass the penalty.
    if (p2.arousal >= 3) {
        const big = p2.arousal >= 5 ? 1.5 : 1;
        if ([16, 43, 20].includes(card.id)) score += Math.round(20 * big);   // extra rerolls
        if (card.id === 33) score += Math.round(25 * big);                   // Quiet Mind
        if (card.id === 12) score += 18;                                     // Rapid Pulse: stop it climbing again
        if (card.id === 9) score += 12;                                      // Deep Safeties: bigger 💧
        if (card.id === 7) score += 8;                                       // extra die
        if ([32, 50].includes(card.id)) score += 8;                          // Guided Heat / Mutual Heat
    }
    if (p2.transform >= 6 && [44, 51, 38].includes(card.id)) score += 12 + (p2.transform - 6) * 8;
    if (p1.transform >= 6 && [4, 25, 30, 40].includes(card.id)) score += 12 + (p1.transform - 6) * 8;
    if (p1.transform >= 6 && [10, 39, 52, 15, 36].includes(card.id)) score += 6;

    // counters to what the human is building
    let counterBonus = 0;
    Object.keys(CPU_COUNTERS).forEach(k => {
        const v = (cpuBrain.oppScores || {})[k] || 0;
        if (v >= 2 && CPU_COUNTERS[k].includes(card.id)) counterBonus += Math.min(18, v * 3);
    });
    score += Math.min(30, counterBonus);
    const onePushers = CPU_ONE_POINT_PUSHERS.filter(id => hasCard(1, id)).length;
    if (card.id === 35) score += onePushers * 14;                                   // Mesmerizing Rhythm
    if (CPU_ONE_POINT_PUSHERS.includes(card.id) && hasCard(1, 35)) score -= 35;     // their Rhythm blocks our 1-pushes
    if (hasCard(1, 21) && [0, 14, 8, 18, 31].includes(card.id)) score -= 10;        // Switch Play bounces Trance
    if (hasCard(1, 50) && [6, 13, 49].includes(card.id)) score -= 10;               // Mutual Heat bounces Arousal

    // vulnerability: fewer dice is a killer, so fix it (more 💧, more dice, more rerolls)
    if (p2.vulnerability >= 1 && card.id === 9) score += 10;
    if (p2.vulnerability >= 2) {
        if (card.id === 9) score += 25;
        if (card.id === 7) score += 25;
        if ([43, 16, 20].includes(card.id)) score += 12;
    }
    // submission marker sliding toward our end: get back to neutral before we are pinned
    const slip = Math.max(0, gameState.submission);
    if (slip >= 2 && !isCpuPinnedInSubmission() && SUBMISSION_RECOVERY_CARDS.includes(card.id)) score += 12 * (slip - 1) + 8;
    if (slip >= 2 && [25, 30].includes(card.id)) score -= 40;

    // economy early, diminishing returns late
    if (gameState.round <= 4 && [45, 29, 28].includes(card.id)) score += 8;
    score -= Math.max(0, p2.inventory.length - 3) * 5;
    return score;
}

function cpuAdaptiveBuyThreshold() {
    const p = gameState.p2;
    let t = 40;
    if (p.inventory.length === 0) t = 34;       // opening: get something going
    if (p.energy >= 9) t -= 8;                  // sitting on cash
    if (isCpuPinnedInSubmission()) t -= 10;
    return t;
}

// extra "is this card actually useful right now?" checks, on top of passesCardSpecificConditions()
function cpuAdaptiveExtraConditions(card) {
    const p = gameState.p2, opp = gameState.p1;
    switch (card.id) {
        case 19: { // Primal Surge: nets +1 energy, so only buy it when it lets us buy something else right now
            const cost = getCardPurchaseCost(card, 2);
            const after = p.energy - cost + 9;
            const enables = market.some(c => c && c !== card && passesCardSpecificConditions(c) &&
                cpuAdaptiveCardScore(c) >= cpuAdaptiveBuyThreshold() &&
                getCardPurchaseCost(c, 2) <= after && getCardPurchaseCost(c, 2) > p.energy - cost);
            return enables || (gameState.showEnergyActions && after >= 5 && opp.transform >= 4);
        }
        case 5:  return opp.inventory.some(c => !inventoryHasName(p, c.name) && cpuAdaptiveCardScore(c) >= 55);
        case 42: return market.some(c => c && c !== card && c.cost >= 5 && passesCardSpecificConditions(c) &&
                                       cpuAdaptiveCardScore(c) >= cpuAdaptiveBuyThreshold() + 8);
        case 25: return gameState.submission <= 0;     // pushes OUR submission +2: never when it is already sliding
        case 30: return gameState.submission <= -1;    // pushes OUR submission +4
        case 37: return opp.energy >= 8 || (p.trance >= 4 && opp.energy >= 4);
        case 34: return gameState.submission >= 1;
        case 38: return p.transform >= 6;
        case 1:  return opp.transform >= 5;
        default: return true;
    }
}

function cpuAdaptiveMarketInfo() {
    const p = gameState.p2, human = gameState.p1;
    return market.map((card, idx) => {
        if (!card) return null;
        const cost = getCardPurchaseCost(card, 2);
        const dup = inventoryHasName(p, card.name);
        const passes = !dup && passesCardSpecificConditions(card) && cpuAdaptiveExtraConditions(card);
        return { idx, card, cost, dup, passes,
                 deny: cpuDenyScore(card),
                 humanCanAfford: human.energy >= getCardPurchaseCost(card, 1),
                 score: passes ? cpuAdaptiveCardScore(card) : 0 };
    }).filter(Boolean);
}

// returns the next thing the CPU wants to do in the shop, or null
function cpuAdaptiveNextShopAction() {
    const p = gameState.p2, human = gameState.p1;
    const thr = cpuAdaptiveBuyThreshold();
    const info = cpuAdaptiveMarketInfo();
    const canPay = i => i.cost <= p.energy || gameState.freeBuyActive;

    // Mirror Image: free buy of a pricey card
    if (hasCard(2, 42) && !gameState.freeBuyActive) {
        const t = info.filter(i => i.passes && i.card.id !== 42 && i.cost >= 5 && i.score >= thr + 8)
                      .sort((a, b) => b.score - a.score)[0];
        if (t && (t.cost > p.energy || t.cost >= 6)) return { type: "mirror", idx: t.idx, name: t.card.name };
    }
    // Waking Trance: sell it if +2 energy unlocks a strong card
    if (hasCard(2, 26)) {
        const t = info.filter(i => i.passes && i.cost > p.energy && i.cost <= p.energy + 2 && i.score >= thr + 8)[0];
        if (t) return { type: "sell" };
    }
    // Hypnotic Dominance: snipe a key card from the human
    if (hasCard(2, 5)) {
        for (let i = 0; i < human.inventory.length; i++) {
            const c = human.inventory[i];
            if (c && !inventoryHasName(p, c.name) && p.energy >= c.cost && cpuAdaptiveCardScore(c) >= 55)
                return { type: "snipe", idx: i, name: c.name };
        }
    }

    // best purchase (own value + a share of how much it would help the human)
    const cands = info.filter(i => !i.dup && canPay(i) && (i.passes || i.card.type === "Keep"))
        .map(i => Object.assign({}, i, { total: i.score + i.deny * (i.humanCanAfford ? 0.6 : 0.15) }))
        .filter(i => i.total >= thr)
        .sort((a, b) => b.total - a.total);
    let best = cands[0] || null;

    // don't waste energy on a mediocre card if a much better one is one turn away and the human can't grab it
    if (best) {
        const target = info.filter(i => i.passes && !canPay(i) && !i.humanCanAfford && i.cost <= p.energy + 2 && i.score >= best.total + 12)
                           .sort((a, b) => b.score - a.score)[0];          // only a card that is about one turn away
        if (target && (p.energy - best.cost) + 3 < target.cost) {
            const sf = cpuBrain.savingFor;
            if (!sf || sf.id !== target.card.id) cpuBrain.savingFor = { id: target.card.id, round: gameState.round, turns: 1 };
            else if (sf.round !== gameState.round) { sf.round = gameState.round; sf.turns++; }
            if (cpuBrain.savingFor.turns <= 2) best = null;                  // wait at most 2 turns, then buy what we can afford
        }
    }
    if (best) return { type: "buy", idx: best.idx, name: best.card.name, deny: best.deny > best.score * 0.5 && best.deny >= 40 };

    // wipe to deny a dangerous card the human can afford
    if (cpuBrain.wipes < 2 && p.energy >= 2 && deck.length > 0 && market.length > 0) {
        const threat = info.filter(i => i.humanCanAfford && i.deny >= 45).sort((a, b) => b.deny - a.deny)[0];
        if (threat) return { type: "wipe", why: `deny ${threat.card.name}` };
        // wipe a market with nothing we want
        const usefulExists = info.some(i => i.passes && i.score >= thr);
        if (!usefulExists && p.energy >= 5 && cpuBrain.wipes < 1) return { type: "wipe", why: "nothing useful" };
    }
    return null;
}

function cpuAdaptiveEnergyActions() {
    if (!gameState.showEnergyActions) return;
    const p = gameState.p2, opp = gameState.p1;
    const reserve = hasCard(2, 16) ? 3 : 0;            // keep a few ⚡ for Hypnotic Suggestion rerolls
    for (let g = 0; g < 12 && !gameState.gameEnded; g++) {
        if (p.energy >= 5 && opp.transform + Math.floor(p.energy / 5) >= 10) { buyAction("transform", 2); cpuSay("Lethal: cashing Energy into Transform."); continue; }
        if ((isCpuPinnedInSubmission() && p.energy >= 6) || (gameState.submission >= 2 && p.energy >= 9)) { buyAction("submission", 2); continue; }
        if (p.energy - 3 >= reserve && (p.arousal === 3 || p.arousal === 5 || (p.arousal === 4 && p.energy - 6 >= reserve))) { buyAction("arousal", 2); continue; }
        if (p.energy - 5 >= reserve && p.energy >= 5 && (opp.transform >= 5 || p.energy >= 10)) { buyAction("transform", 2); continue; }
        break;
    }
}

function cpuAdaptiveWantsCalm() {
    const p = gameState.p2;
    if (p.energy < 2) return false;
    // Arousal 3 or 5: ONE step restores a reroll, so it is worth 2⚡ even if that dips into the Hypnotic Suggestion reserve
    if (p.arousal === 3 || p.arousal === 5) return true;
    if (p.arousal === 4) return p.energy >= 4;                      // two steps restore a reroll
    const reserve = hasCard(2, 16) ? 2 : 0;
    return p.trance >= 4 && p.energy - 2 >= reserve;                // setback is one spiral away
}

// What the CPU picks when it causes a Setback (no Physical Manipulation, or pinned)
function cpuAdaptiveSetbackChoice(victim) {
    if (gameState.submission >= 2) return "submission";             // sliding toward our end: push it back toward neutral
    if (gameState.submission <= -3) return "submission";            // marker already near the human's end: push toward overflow
    const blocked = hasCard(1, 50) || hasCard(1, 32) || victim.shieldActive;   // Mutual Heat / Guided Heat / Rapid Pulse
    const crossesBand = [1, 2, 3, 4].includes(victim.arousal);      // +2 Arousal takes away a reroll
    if (!blocked && victim.arousal < 5 && (crossesBand || cpuBrain.plan === "arousal")) return "arousal";
    return "submission";
}

function cpuAdaptiveShopPhase() {
    cpuReplan();
    const p = gameState.p2;
    for (let g = 0; g < 10 && !gameState.gameEnded; g++) {
        const act = cpuAdaptiveNextShopAction();
        if (!act) break;
        if (act.type === "buy") {
            cpuSay(`Buys ${act.name}${act.deny ? " (blocking the human's plan)" : ""}.`);
            if (!buyCard(act.idx)) break;
        } else if (act.type === "wipe") {
            cpuSay(`Wipes the market (${act.why}).`);
            cpuBrain.wipes++;
            wipeMarket();
        } else if (act.type === "mirror") {
            const i42 = p.inventory.findIndex(c => c.id === 42);
            if (i42 === -1) break;
            discardCard(p.inventory.splice(i42, 1)[0]);
            gameState.freeBuyActive = true;
            cpuSay(`Uses Mirror Image to take ${act.name} for free.`);
            if (!buyCard(act.idx)) { gameState.freeBuyActive = false; break; }
        } else if (act.type === "sell") {
            const i26 = p.inventory.findIndex(c => c.id === 26);
            if (i26 === -1) break;
            discardCard(p.inventory.splice(i26, 1)[0]);
            p.energy += 2;
            cpuSay("Sells Waking Trance for +2⚡ to afford a better card.");
        } else if (act.type === "snipe") {
            cpuSay(`Hypnotic Dominance: buys ${act.name} from the human.`);
            if (!buyCardFromOpponent(2, act.idx)) break;
        }
        cpuReplan();
    }
    while (cpuUseQuietMind()) { /* spend until it no longer wants to */ }
    cpuAdaptiveEnergyActions();
    cpuNoteEndOfTurn();
    cpuSay(`Ends turn with ${p.energy}⚡ (plan: ${cpuPlanLabel()}).`);
}


// ============================================================
// LEGACY LEVELS: Normal ("aggressive"), Hard ("v23low"), Expert ("defensive")
// ------------------------------------------------------------
// All three now: (1) never lock dice they cannot use, (2) are eager for cards they like, save a little energy for them,
// and wipe the market to keep the human from taking a liked card they can't afford yet.
//   Normal : cares about Submission / Arousal only when ONE STEP from the max (or at it).
//   Expert : very cautious - wants Submission near the center (or on the human's side) and Arousal at 2 or less.
//   Hard   : energy theme - banks energy for the best cards, and only uses dice to fix problems or feed its cards.
// ============================================================
const CPU_TIERS = {
    // slip = how often this level makes believable mistakes while still chasing its agenda (all optional, 0 = perfect play):
//   keep    : chance to second-guess each kept die that isn't part of a finished triple and reroll it anyway
//   noise   : +/- points of misjudgement on every card's score each turn (so it sometimes buys the second-best card)
//   trouble : chance per turn that it doesn't notice it is in trouble (reacts one step later than usual)
//   deny    : chance per turn that it forgets to wipe the market to keep a liked card from the human
// maxRerolls / capChance (optional, Normal only): after this many rerolls it stops rerolling with probability capChance.
    //             liked cards    min score   saving window   deny-wipe   wipe when idle / flush      "trouble" starts at       lowered back to
    aggressive: { like: 55, buy: 32, reach: 3, patience: 3, denyMin: 55, idleWipe: 6, excessWipe: 8,  danger: { sub: 4, arousal: 4, trance: 4 }, target: { arousal: 3, trance: 3 },
                  slip: { keep: 0.5, noise: 22, trouble: 0.4, deny: 0.7 }, maxRerolls: 1, capChance: 0.45 },
    defensive:  { like: 55, buy: 35, reach: 3, patience: 3, denyMin: 55, idleWipe: 7, excessWipe: 10, danger: { sub: 2, arousal: 3, trance: 3 }, target: { arousal: 2, trance: 1 },
                  slip: { keep: 0.32, noise: 16, trouble: 0.1, deny: 0.5 } },
    // Virtuoso: 👁️ dice first, Energy second (to buy cards that boost that plan). Defends Submission only one step from the end,
    // Arousal from 3, barely cares about its own Trance. Wipes the market to deny the human's strategy cards (never Transform cards).
    transformer: { like: 55, buy: 35, reach: 3, patience: 3, denyMin: 12, idleWipe: 7, excessWipe: 9, danger: { sub: 4, arousal: 3, trance: 4 }, target: { arousal: 2, trance: 3 },
                  slip: {} },
    v23low:     { like: 60, buy: 35, reach: 4, patience: 3, denyMin: 60, idleWipe: 7, excessWipe: 9,  danger: { sub: 3, arousal: 4, trance: 4 }, target: { arousal: 3, trance: 3 },
                  slip: { keep: 0.35, noise: 18, trouble: 0.35, deny: 0.5 } }
};
// Virtuoso "burst finishing": cards that deal Transform straight away, and how much damage they do
const CPU_BURST = { 4: 1, 25: 1, 30: 2, 51: 1, 40: 1 };
function cpuBurstPlan() {
    const p = gameState.p2, opp = gameState.p1;
    const cards = market.filter(c => c && CPU_BURST[c.id] && passesCardSpecificConditions(c))
                        .map(c => ({ id: c.id, dmg: CPU_BURST[c.id], cost: getCardPurchaseCost(c, 2) }));
    let best = { dmg: 0, ids: [] };
    for (let mask = 1; mask < (1 << cards.length); mask++) {          // best combination we can pay for right now
        let cost = 0, dmg = 0; const ids = [];
        cards.forEach((c, i) => { if (mask & (1 << i)) { cost += c.cost; dmg += c.dmg; ids.push(c.id); } });
        if (cost <= p.energy && dmg > best.dmg) best = { dmg, ids };
    }
    return { remaining: Math.max(0, 10 - opp.transform), best };
}
function cpuIsTier() { return !!CPU_TIERS[getCpuDifficulty()]; }

// How much trouble the CPU is in, in steps beyond where this level starts to worry (0 = not worried)
function cpuTierProblems(level) {
    const cfg = CPU_TIERS[level], p = gameState.p2;
    const late = cpuBrain.troubleBlind ? 1 : 0;      // a distracted turn: notices trouble one step later
    const step = (v, t) => (v >= t + late ? v - (t + late) + 1 : 0);
    return { sub: step(Math.max(0, gameState.submission), cfg.danger.sub), arousal: step(p.arousal, cfg.danger.arousal),
             trance: step(p.trance, cfg.danger.trance), vuln: cpuBrain.troubleBlind ? 0 : (p.vulnerability || 0) };
}

// Release dice that cannot help: a face that can no longer reach its threshold with the dice still free
// (e.g. one ⛓️ locked with only one free die: you can never reach three), and Lucidity beyond what is needed.
// keep = array of booleans, modified in place. Used by every difficulty level.
function cpuReleaseUselessKeeps(keep, rerollsAvail) {
    const dice = gameState.dice, p = gameState.p2;
    const faces = dice.map(d => cpuFaceKey(d.face));
    const r = Math.max(1, rerollsAvail || 1);
    const lucidityNeed = (p.vulnerability || 0) + p.arousal * (hasCard(1, 48) ? 2 : 1) + p.trance;
    for (let pass = 0; pass < 5; pass++) {
        let changed = false;
        const free = keep.filter(k => !k).length;
        ["TR", "SU", "AR"].forEach(k => {
            const need = k === "AR" ? 2 : 3;
            const c = keep.reduce((sum, kp, i) => sum + (kp && faces[i] === k ? 1 : 0), 0);
            if (c === 0 || c >= need) return;
            let usable;
            if (c + free < need) usable = false;                                        // not enough dice left to ever get there
            else if (k === "AR") usable = 1 - Math.pow(Math.pow(5 / 6, r), free) >= 0.1;    // one more 🔥 within our rerolls
            else usable = cpuThresholdEV(c, free, r, 0) >= 0.04;                        // at least ~4% to reach three
            if (!usable) keep.forEach((kp, i) => { if (kp && faces[i] === k) { keep[i] = false; changed = true; } });
        });
        // Lucidity: no more than there is something to fix
        let luKept = keep.reduce((sum, kp, i) => sum + (kp && faces[i] === "LU" ? 1 : 0), 0);
        if (luKept > lucidityNeed) keep.forEach((kp, i) => { if (luKept > lucidityNeed && kp && faces[i] === "LU") { keep[i] = false; luKept--; changed = true; } });
        if (!changed) break;
    }
	// it doesn't need to be kept, just there, but good for the CPU to keep it
    if (hasCard(2, 55) && !keep.some((kp, i) => kp && faces[i] === "TR")) { const i = faces.indexOf("TR"); if (i >= 0) keep[i] = true; }   // Transformation Ritual wants a kept 👁️
    return keep;
}

// Which dice a Normal / Hard / Expert CPU keeps on a reroll
function cpuTierKeepPlan(level, r) {
    const dice = gameState.dice, n = dice.length, p = gameState.p2, opp = gameState.p1;
    const faces = dice.map(d => cpuFaceKey(d.face));
    const counts = cpuCountsFromFaces(dice.map(d => d.face));
    const cfg = CPU_TIERS[level], prob = cpuTierProblems(level);
    const keep = new Array(n).fill(false);
    const keepFace = k => faces.forEach((f, i) => { if (f === k) keep[i] = true; });
    const has = id => hasCard(2, id);

    // 1) trouble first: Lucidity for Arousal / Trance / Vulnerability, ⛓️ when Submission is sliding toward us
    let need = prob.vuln;
    if (prob.arousal > 0) need += Math.max(1, p.arousal - cfg.target.arousal) * (hasCard(1, 48) ? 2 : 1);
    if (prob.trance > 0) need += Math.max(1, p.trance - cfg.target.trance);
    if (has(9) && counts.LU > 0) need = Math.max(0, need - 1);
    if (need > 0) { let k = Math.min(counts.LU, need); faces.forEach((f, i) => { if (f === "LU" && k > 0) { keep[i] = true; k--; } }); }
    if (prob.sub > 0) keepFace("SU");

    // 2) what each level likes to chase
    if (level === "aggressive") {
        keepFace("TR"); keepFace("SU"); keepFace("EN");
        if (opp.trance >= 3) keepFace("SP");
    } else if (level === "defensive") {
        if (counts.TR >= 2 || opp.transform >= 6) keepFace("TR");
        if (counts.SU >= 2 && opp.transform >= 5) keepFace("SU");
        keepFace("EN");
        if (opp.trance >= 3) keepFace("SP");
        if (opp.arousal >= 3) keepFace("AR");
    } else if (level === "transformer") {
        // 👁️ is the plan: keep every 👁️. Then decide how many ⚡ to keep by comparing what a die is worth as a kept ⚡
        // against what the dice we would free up could become (another 👁️ for the triple).
        keepFace("TR");
        const keptOther = keep.filter(Boolean).length - counts.TR;           // dice already kept for trouble (💧 / defensive ⛓️)
        const bonusTR = has(2) ? 1 : 0;
        const wTR = has(41) ? 1.25 : 1;                                       // Powerful Transform: each hit also costs them a die
        const wEN = (has(45) ? 0.45 : 0.3) + (has(55) ? 0.1 : 0);            // Power Boost / Ritual make ⚡ worth more
        let bestK = 0, bestVal = -1;
        for (let k = 0; k <= counts.EN; k++) {
            const free = Math.max(0, n - counts.TR - keptOther - k);
            const val = wTR * cpuThresholdEV(counts.TR, free, r, bonusTR) + wEN * (k + free / 6);
            if (val > bestVal + 1e-9) { bestVal = val; bestK = k; }
        }
        let kEN = bestK;
        faces.forEach((f, i) => { if (f === "EN" && !keep[i] && kEN > 0) { keep[i] = true; kEN--; } });
        if (counts.SU >= 3) keepFace("SU");        // a finished triple is free value; otherwise ⛓️ is only for defending (above)
    } else {   // v23low: energy theme. Other faces only when they finish a triple or feed a card we own
        keepFace("EN");
        const tSyn = has(2) || has(41) || has(22) || has(56), sSyn = has(36) || has(24) || has(23);
        const aSyn = has(13) || has(49) || has(48), pSyn = has(0) || has(17) || has(31);
        if (counts.TR >= 3 || (tSyn && counts.TR >= 2)) keepFace("TR");
        if (counts.SU >= 3 || (sSyn && counts.SU >= 2)) keepFace("SU");
        if (aSyn && counts.AR >= 2) keepFace("AR");
        if (pSyn || opp.trance + counts.SP >= 5) keepFace("SP");
    }
    // believable mistakes: second-guess a kept die and reroll it anyway (never one that is part of a finished triple)
    const slipKeep = (cfg.slip && cfg.slip.keep) || 0;
    if (slipKeep > 0) {
        const kept = k => keep.reduce((sum, kp, i) => sum + (kp && faces[i] === k ? 1 : 0), 0);
        keep.forEach((kp, i) => {
            if (!kp) return;
            const f = faces[i];
            if ((f === "TR" || f === "SU") && kept(f) >= 3) return;
            if (Math.random() < slipKeep) keep[i] = false;
        });
    }
    return cpuReleaseUselessKeeps(keep, r);
}

function cpuLegacyHasFreeDice() {              // would a reroll change anything? (all levels except Master)
    if (cpuIsTier()) {
        const capped = CPU_TIERS[getCpuDifficulty()].maxRerolls;
        if (capped && (cpuBrain.rerollsUsed || 0) >= capped && cpuBrain.capStop !== false) return false;   // this level has stopped rerolling
        return cpuTierKeepPlan(getCpuDifficulty(), 1).some(k => !k);
    }
    return gameState.dice.some(d => !d.kept);
}

// ---------- shopping ----------
function cpuTierCardScore(card, level) {
    const p2 = gameState.p2, p1 = gameState.p1;
    let score = (card.ai && card.ai[level] != null) ? card.ai[level] : 30;
    const pr = cpuTierProblems(level);
    // trouble on the tracks, scaled by how worried this level is
    if (pr.sub > 0 && SUBMISSION_RECOVERY_CARDS.includes(card.id)) score += Math.min(70, 25 + 15 * pr.sub);
    if (pr.arousal > 0) {
        const k = Math.min(3, pr.arousal);
        if ([16, 43, 20].includes(card.id)) score += 12 * k;       // extra rerolls bypass the Arousal penalty
        if (card.id === 33) score += 15 + 8 * k;                   // Quiet Mind
        if (card.id === 12) score += 10 + 6 * k;                   // Rapid Pulse
        if (card.id === 9) score += 10;
    }
    if ((pr.trance > 0 || pr.vuln > 0) && [9, 12, 33, 44].includes(card.id)) score += (level === "defensive") ? 35 : 20;
    // the human is close to losing: offensive cards
    const pressureCards = level === "transformer" ? [2, 4, 25, 30, 40, 41, 51] : [2, 4, 10, 17, 24, 30, 39, 41, 52];
    if ((p1.transform >= 6 || gameState.submission <= -3) && pressureCards.includes(card.id)) score += (level === "defensive") ? 15 : 30;
    if (level === "trans" && CPU_BURST[card.id]) {       // burst cards are for the final push, not for the middle of the game
        const bp = cpuBurstPlan();
        if (bp.best.dmg >= bp.remaining && bp.best.ids.includes(card.id)) score += 90;      // this finishes the game
        else if (bp.remaining <= 4) score += 30;                                            // within reach: spend the energy
        else score -= 25;                                                                   // too early: keep the energy, the dice do the work
    }
    if (level === "trans" && (CPU_STRATEGIES.transform.cards[card.id] || [7, 16, 43, 20].includes(card.id))) score += 10;   // cards that go with the plan
    // economy / dice-engine cards keep their priority while we can pay for them
    if ([7, 28, 29, 43, 45].includes(card.id) && p2.energy >= card.cost) score += 15;
    if ((level === "v23low" || level === "transformer") && [45, 28, 29, 27].includes(card.id)) score += 12;    // energy theme
    const noise = (CPU_TIERS[level].slip && CPU_TIERS[level].slip.noise) || 0;
    if (noise > 0) {                                  // misjudgement: fixed for the whole turn
        if (!cpuBrain.noise) cpuBrain.noise = {};
        if (cpuBrain.noise[card.id] === undefined) cpuBrain.noise[card.id] = (Math.random() * 2 - 1) * noise;
        score += cpuBrain.noise[card.id];
    }
    return score;
}
function cpuTierExtraConditions(card, level) {
    const p = gameState.p2, opp = gameState.p1, cfg = CPU_TIERS[level];
    switch (card.id) {
        case 19: {   // Primal Surge nets +1 energy: only when it lets us buy something else right now
            const cost = getCardPurchaseCost(card, 2), after = p.energy - cost + 9;
            return market.some(c => c && c !== card && passesCardSpecificConditions(c) && cpuTierCardScore(c, level) >= cfg.buy &&
                               getCardPurchaseCost(c, 2) <= after && getCardPurchaseCost(c, 2) > p.energy - cost);
        }
        case 5:  return opp.inventory.some(c => c && !inventoryHasName(p, c.name) && cpuTierCardScore(c, level) >= cfg.like);
        case 42: return market.some(c => c && c !== card && c.cost >= 5 && passesCardSpecificConditions(c) && cpuTierCardScore(c, level) >= cfg.like);
        case 37: return opp.energy >= 8;
        case 34: return gameState.submission >= 1;
        case 38: return p.transform >= 6;
        case 1:  return opp.transform >= 5;
        default: return true;
    }
}
function cpuTierNextAction(level) {
    const cfg = CPU_TIERS[level], p = gameState.p2, human = gameState.p1;
    const info = market.map((card, idx) => {
        if (!card) return null;
        const passes = passesCardSpecificConditions(card) && cpuTierExtraConditions(card, level);
        return { idx, card, passes, cost: getCardPurchaseCost(card, 2), score: passes ? cpuTierCardScore(card, level) : 0,
                 humanCanAfford: human.energy >= getCardPurchaseCost(card, 1),
                 humanNear: human.energy + 2 >= getCardPurchaseCost(card, 1) };      // about to be able to afford it (their income is ~2 per turn)
    }).filter(Boolean);
    const canPay = i => i.cost <= p.energy || gameState.freeBuyActive;
    const liked = info.filter(i => i.passes && i.score >= cfg.like).sort((a, b) => b.score - a.score);

    // tools that help us reach a liked card
    if (hasCard(2, 42) && !gameState.freeBuyActive) {
        const t = liked.find(i => i.cost >= 5 && i.card.id !== 42);
        if (t && (t.cost > p.energy || t.cost >= 6)) return { type: "mirror", idx: t.idx, name: t.card.name };
    }
    if (hasCard(2, 26) && liked.some(i => !canPay(i) && i.cost <= p.energy + 2)) return { type: "sell" };
    if (hasCard(2, 5)) {
        for (let i = 0; i < human.inventory.length; i++) {
            const c = human.inventory[i];
            if (c && !inventoryHasName(p, c.name) && p.energy >= c.cost && cpuTierCardScore(c, level) >= cfg.like + 10) return { type: "snipe", idx: i, name: c.name };
        }
    }
    // 1) a liked card we can afford: take the best one
    const likedBuy = liked.find(canPay);
    if (likedBuy) return { type: "buy", idx: likedBuy.idx, name: likedBuy.card.name };
    // 2a) Virtuoso: wipe the market when the human could buy a card that fits THEIR strategy (never Transform cards: we want those)
    if (level === "transformer" && !cpuBrain.denyBlind && cpuBrain.wipes < 2 && p.energy >= 2 && deck.length > 0) {
        const target = info.filter(i => (i.humanCanAfford || i.humanNear) && !CPU_STRATEGIES.transform.cards[i.card.id] && cpuDenyScore(i.card) >= cfg.denyMin &&
                                        !(i.passes && i.score >= cfg.like))        // not a card we like ourselves
                           .sort((a, b) => cpuDenyScore(b.card) - cpuDenyScore(a.card))[0];
        if (target) return { type: "wipe", why: `deny ${target.card.name}` };
    }
    // 2) a liked card we can't afford but the human can: wipe the market so they don't get it
    const threat = liked.find(i => !canPay(i) && (i.humanCanAfford || (level === "trans" && i.humanNear)) && i.score >= cfg.denyMin);
    if (threat && !cpuBrain.denyBlind && cpuBrain.wipes < (level === "trans" ? 2 : 1) && p.energy >= 2 && deck.length > 0) return { type: "wipe", why: `deny ${threat.card.name}` };
    // 3) other useful cards - but save for a liked card that is about a turn away (for a few turns at most)
    let best = info.filter(i => i.passes && canPay(i) && i.score >= cfg.buy).sort((a, b) => b.score - a.score)[0] || null;
    if (best) {
        const target = liked.find(i => !canPay(i) && i.cost <= p.energy + cfg.reach);
        if (target && (p.energy - best.cost) + 2 < target.cost) {
            const sf = cpuBrain.savingFor;
            if (!sf || sf.id !== target.card.id) cpuBrain.savingFor = { id: target.card.id, round: gameState.round, turns: 1 };
            else if (sf.round !== gameState.round) { sf.round = gameState.round; sf.turns++; }
            if (cpuBrain.savingFor.turns <= cfg.patience) best = null;
        }
    }
    if (best) return { type: "buy", idx: best.idx, name: best.card.name };
    // 4) nothing worth buying and plenty of energy: refresh the market
    const anyUseful = info.some(i => i.passes && i.score >= cfg.buy);
    if (cpuBrain.wipes < 2 && deck.length > 0 && market.length > 0 && p.energy >= cfg.excessWipe) return { type: "wipe", why: "excess energy" };
    if (cpuBrain.wipes < 1 && deck.length > 0 && market.length > 0 && p.energy >= cfg.idleWipe && !anyUseful) return { type: "wipe", why: "nothing useful" };
    return null;
}
function cpuTierShopPhase(level) {
    cpuBrain.wipes = 0;
    const p = gameState.p2;
    if (level === "transformer") cpuReplan();      // read the human's strategy (their cards, rolls and what they did to us)
    for (let g = 0; g < 10 && !gameState.gameEnded; g++) {
        const act = cpuTierNextAction(level);
        if (!act) break;
        if (act.type === "buy") {
            if (!buyCard(act.idx)) break;
        } else if (act.type === "wipe") {
            const before = p.energy;
            cpuBrain.wipes++;
            wipeMarket();
            log(`CPU used Wipe (${act.why}): refreshed market (${before} → ${p.energy}).`);
        } else if (act.type === "mirror") {
            const i42 = p.inventory.findIndex(c => c.id === 42);
            if (i42 === -1) break;
            discardCard(p.inventory.splice(i42, 1)[0]);
            gameState.freeBuyActive = true;
            log(`CPU used Mirror Image to take ${act.name} for free.`);
            if (!buyCard(act.idx)) { gameState.freeBuyActive = false; break; }
        } else if (act.type === "sell") {
            const i26 = p.inventory.findIndex(c => c.id === 26);
            if (i26 === -1) break;
            discardCard(p.inventory.splice(i26, 1)[0]);
            p.energy += 2;
            log("CPU sold Waking Trance for +2 Energy.");
        } else if (act.type === "snipe") {
            if (!buyCardFromOpponent(2, act.idx)) break;
        }
    }
    while (cpuUseQuietMind()) { /* spend until it no longer wants to */ }
    if (level === "transformer") cpuNoteEndOfTurn();
    while (gameState.showEnergyActions == true && cpuShouldBuyTransformWithEnergy()) buyAction("transform", 2);
    while (gameState.showEnergyActions == true && cpuShouldBuySubmissionWithEnergy()) buyAction("submission", 2);
}

// ============================================================
// CPU decisions for cards 54-61
// ============================================================
function cpuCardValueProxy(card) { return (card && card.ai && card.ai.adaptive != null) ? card.ai.adaptive : 30; }   // "how strong is this card in general"
// how bad a Trance / Arousal level is for its owner (Arousal 3 and 5 each cost a reroll)
function cpuHarmOfStats(arousal, trance) {
    const bands = arousal <= 2 ? 0 : (arousal <= 4 ? 1 : 2);
    return bands * 0.8 + arousal * 0.1 + trance * 0.15 + (trance >= 4 ? 0.5 : 0);
}
function cpuMirrorTranceSwing() {            // Mirror Trance: how much better off we are after swapping 🌀 and 🔥 with the human
    const me = gameState.p2, opp = gameState.p1;
    return 2 * (cpuHarmOfStats(me.arousal, me.trance) - cpuHarmOfStats(opp.arousal, opp.trance));
}
function cpuBlankUseful() {                  // Blank: clears our 🌀 🔥 ⚡ and resets ⛓️ - only when we are in real trouble and have little ⚡ to lose
    const me = gameState.p2;
    const trouble = (gameState.submission >= 3 ? 1.5 : 0) + cpuHarmOfStats(me.arousal, me.trance);
    const lost = Math.max(0, me.energy - 7) * 0.3;
    return trouble - lost >= 1.6;
}
function cpuBreakTargetWorthIt() {           // Submissive Break gives the owner 2 ⚡, so only use it on a strong Keep card of the human
    return gameState.p1.inventory.some(c => c && c.type === "Keep" && cpuCardValueProxy(c) >= 50);
}
function cpuChooseBreakTarget(targets, pid) {
    const oppId = oppIdOf(pid);
    let best = null, bestV = -1;
    targets.filter(t => t.owner === oppId).forEach(t => { const v = cpuCardValueProxy(t.card); if (v > bestV) { bestV = v; best = t; } });
    return best;
}
function cpuChooseSpecialFace() {            // Deeper Bargains: which face the special die should show
    const d = getCpuDifficulty();
    if (d === "adaptive") {
        const byPlan = { transform: 5, submission: 3, arousal: 4, trance: 0, energy: 2 };
        return FACES[byPlan[cpuBrain.plan] !== undefined ? byPlan[cpuBrain.plan] : 5];
    }
    return FACES[5];                         // 👁️ for everyone else (tested: a 👁️ die is strong, 💧 and ⚡ dice hurt because the blank faces waste the die)
}
function cpuArousalBand(a) { return a <= 2 ? 0 : (a <= 4 ? 1 : 2); }
function cpuBurningUpCost() {                // what the 🔥 rise costs in lost rerolls, scaled by how much this level cares
    const p = gameState.p2;
    const rise = (p.burningUpUses || 0) === 0 ? 1 : 2;
    const lost = cpuArousalBand(Math.min(5, p.arousal + rise)) - cpuArousalBand(p.arousal);
    let cost = lost * 0.3 + rise * 0.03;
    const d = getCpuDifficulty();
    if (d === "defensive") cost *= 2.5; else if (d === "aggressive") cost *= 0.7; else if (d === "trans") cost *= 0.8;
    return cost;
}
// value of one more reroll for Normal / Hard / Expert / Virtuoso, using their own keep plan
function cpuTierExtraRerollGain(level) {
    const dice = gameState.dice, plan = cpuTierKeepPlan(level, 1);
    const free = plan.filter(k => !k).length;
    if (free === 0) return 0;
    const counts = cpuCountsFromFaces(dice.map(d => d.face));
    const keptOf = k => dice.filter((d, i) => plan[i] && cpuFaceKey(d.face) === k).length;
    let gain = 0;
    [["TR", 1, hasCard(2, 2) ? 1 : 0], ["SU", 0.6, hasCard(2, 36) ? 1 : 0]].forEach(([k, scale, b]) => {
        const now = counts[k] >= 3 ? 1 + (counts[k] - 3) + b : 0;
        gain = Math.max(gain, (cpuThresholdEV(keptOf(k), free, 1, b) - now) * scale);
    });
    return gain + 0.03 * free;
}
function cpuShouldUseBurningUp() {
    if (!canUseBurningUp(2) || gameState.rerollsLeft > 0) return false;       // spend the normal rerolls first
    const gain = cpuIsAdaptive() ? cpuExtraRerollGain() : (cpuIsTier() ? cpuTierExtraRerollGain(getCpuDifficulty()) : (gameState.dice.some(d => !d.kept) ? 0.3 : 0));
    return gain >= 0.25 + cpuBurningUpCost();
}
// Transformation Ritual: we lose 3 ⚡ if no 👁️ die is kept after rolling, so make sure one is
function cpuEnsureRitualKeep() {
    if (!hasCard(2, 55)) return;
    const isTR = d => String(d.face).toUpperCase().includes("TRANSFORM");
    if (gameState.dice.some(d => d.kept && isTR(d))) return;
    const d = gameState.dice.find(isTR);
    if (d) d.kept = true;
}

function cpuCardPurchaseScore(card) {
    const difficulty = getCpuDifficulty();
    if (difficulty === "random") return Math.random() * 100;
    if (difficulty === "smart") return 50;
	
	const p2 = gameState.p2; // CPU player
	const p1 = gameState.p1; // human player
	
	// 1. Fetch base rating for active archetype (defaulting to 30 if unrated)
    const baseRatings = card.ai || {};
    let score = baseRatings[difficulty] ?? 30;

    //let score = 0;
    //const aggCards = [0, 2, 3, 4, 6, 8, 10, 11, 13, 22, 23, 24, 31, 34, 36, 39, 40, 46, 48, 49];
    //const defCards = [5, 9, 12, 20, 26, 27, 29, 38, 41, 42, 43, 44, 45, 47];
	
	// old 2. Cost-efficiency adjustment (cheaper cards get a small baseline bump)
    //score += Math.max(0, (8 - card.cost) * 2);
	// 2. If we 
	
	
	// 3. Dynamic Situational Adjustments
    // EMERGENCY PINNED PRIORITY (ALL AI LEVELS)
    if (isCpuPinnedInSubmission() && SUBMISSION_RECOVERY_CARDS.includes(card.id)) {
        // Massive score boost to force immediate priority over almost all other market cards
        score += 60; 
    }
    
    // Defensive Emergency: Boost defense/cleansing if CPU is under heavy Trance/Arousal/Vulnerability
    const inDanger = p2.trance >= 3 || p2.arousal >= 3 || p2.vulnerability > 0;
    if (inDanger) {
        // Cards that clear debuffs or shield (e.g., Deep Safeties, Rapid Pulse, Flow Reversal)
        if ([9, 12, 33, 44].includes(card.id)) {
            score += (difficulty === "defensive") ? 35 : 20;
        }
    }

   // Lethal / Pressure Opportunity: Opponent is high on transform or submission track
    const opponentInDanger = p1.transform >= 6 || gameState.submission <= -3;
    if (opponentInDanger) {
        // High-impact offensive cards (e.g., Whispered Command, Shattered Ego, Subconscious Prompt)
        if ([2, 4, 10, 17, 24, 30, 39, 41, 52].includes(card.id)) {
            score += (difficulty === "aggressive" || difficulty === "v23low") ? 30 : 15;
        }
    }

    // Synergy Check: Extra Dice / Economy engine cards retain high priority if CPU has surplus energy
    if ([7, 28, 29, 43, 45].includes(card.id) && p2.energy >= card.cost) {
        score += 15;
    }
	
	log(`CPU Score for card ${card.id} ${card.name} is ${score}.`); updateUI();
	
	
    //return score + Math.max(0, 10 - card.cost);
	return score;
}

// Validates whether specific tactical conditions are met for individual cards.
function passesCardSpecificConditions(card) {
    const p1 = gameState.p1;
    const p2 = gameState.p2;
	
	if (inventoryHasName(gameState.p2, card.name)) return false;

	if (card.id === 52) {
		if (!(gameState.submission < 0) || gameState.submission <= -5) return false;
	}
	if (card.id === 53) {
		if (gameState.submission <= 0) return false;
	}
	if (card.id === 58 && !cpuBreakTargetWorthIt()) return false;
	if (card.id === 60 && cpuMirrorTranceSwing() < 0.7) return false;
	if (card.id === 61 && !cpuBlankUseful()) return false;

    // (1) Cards 25 and 30: Don't buy if submission is on the CPU side of the board
    // Note: Assuming positive submission value indicates CPU side (adjust polarity if negative is CPU side in your setup)
    if (card.id === 25 || card.id === 30) {
        const submissionOnCpuSide = gameState.submission > 0;
        if (submissionOnCpuSide) return false;
    }

    // (2) Card 40: Don't buy unless it pushes player to 10 transform level OR CPU has lower transform than opponent
    if (card.id === 40) {
        const pushesP1To10 = (p1.transform + 1) >= 10;
        const cpuLowerTransform = p2.transform < p1.transform;
        if (!pushesP1To10 && !cpuLowerTransform) return false;
    }

    // (3) Cards 44, 51: Only buy if CPU transform level > 0
    if (card.id === 44 || card.id === 51) {
        if (p2.transform <= 0) return false;
    }

    // (4) Card 4: Only buy if CPU trance > 0 OR player transform level > 7
    if (card.id === 4) {
        const cpuHasTrance = p2.trance > 0;
        const p1HighTransform = p1.transform > 7;
        if (!cpuHasTrance && !p1HighTransform) return false;
    }

    return true;
}

function cpuShouldBuyCard(card, effectiveCost) {
	if (!passesCardSpecificConditions(card)) return false;
	
    const p = gameState.p2;
	const difficulty = getCpuDifficulty();
    if (effectiveCost > p.energy && !gameState.freeBuyActive) return false;
    if (difficulty === "random") return Math.random() > 0.5;
	
	// Emergency Override: Always buy submission recovery cards when pinned if affordable
    if (isCpuPinnedInSubmission() && SUBMISSION_RECOVERY_CARDS.includes(card.id)) {
        return true;
    }
	
    if (difficulty === "smart") return true;

    const score = cpuCardPurchaseScore(card);
	// was 45
    //if (difficulty === "aggressive" || difficulty === "v23low") return score >= 30;
    //if (difficulty === "defensive") return score >= 50;
    //return false;
	
	
	// Dynamic purchase thresholds
    // Defensive CPUs require a score of 35+ (down from 50), Aggressive/Hard require 25+
    const minThreshold = (difficulty === "defensive") ? 35 : 25;
	return score >= minThreshold;
}

/**
 * Buys a card directly from the opponent's inventory using Card 5 (Hypnotic Dominance).
 * @param {number} buyerNum - 1 for P1, 2 for CPU/P2
 * @param {number} opponentCardIndex - Index of the card in the opponent's inventory array
 */
function buyCardFromOpponent(buyerNum, opponentCardIndex) {
	if (gameState.phase !== "shop" || Number(gameState.activePlayer) !== buyerNum) {
		log("Hypnotic Dominance can only be used on your own shop phase.");
		return false;
	}
	
    const buyer = buyerNum === 1 ? gameState.p1 : gameState.p2;
    const seller = buyerNum === 1 ? gameState.p2 : gameState.p1;

    // 1. Verify buyer owns Card 5 (Hypnotic Dominance)
    const hasDominance = buyer.inventory.some(c => c.id === 5);
    if (!hasDominance) {
        log(`Player ${buyerNum} cannot buy from opponent without Hypnotic Dominance.`);
        return false;
    }

    // 2. Validate target card
    const targetCard = seller.inventory[opponentCardIndex];
    if (!targetCard) return false;

    const cost = targetCard.cost;

    // 3. Check energy
    if (buyer.energy < cost) {
        log(`Player ${buyerNum} does not have enough ⚡ (${cost}) to buy ${targetCard.name} from opponent.`);
        return false;
    }
	
	if (inventoryHasName(buyer, targetCard.name)) {
		log(`${buyer.name} already has ${targetCard.name}. ${buyer.name} can only have one copy.`);
		return false;
	}

    // 4. Transfer energy and card
    buyer.energy -= cost;
    seller.energy += cost;

    const [stolenCard] = seller.inventory.splice(opponentCardIndex, 1);
    buyer.inventory.push(stolenCard);

    log(`${buyer.name} used Hypnotic Dominance to buy ${stolenCard.name} from ${seller.name} for ${cost} ⚡!`);
	syncToFirebase();
    updateUI();
    return true;
}

function cpuShouldSellWakingTrance(maxCost) {
    const p = gameState.p2;
    if (!hasCard(2, 26)) return false;
    switch (getCpuDifficulty()) {
        case "random": return Math.random() > 0.75;
        case "defensive": return p.energy < maxCost && p.energy + 2 >= maxCost && p.energy < 5;
        default: return p.energy < maxCost && p.energy + 2 >= maxCost;
    }
}

function cpuShouldUseMirrorImage(maxCost) {
    if (!hasCard(2, 42) || market.length === 0) return false;
    switch (getCpuDifficulty()) {
        case "random": return Math.random() > 0.75;
        case "defensive": return maxCost >= 6;
        default: return maxCost >= 5;
    }
}

function cpuShouldUseWipe() {
    const p = gameState.p2;
    const difficulty = getCpuDifficulty();

    // Wipe costs 2 Energy and is only useful if the deck can
    // actually provide replacement cards.
    if (p.energy < 2) return false;
    if (deck.length <= 0) return false;
    if (market.length <= 0) return false;

    // Don't wipe a market when the CPU can already buy something.
    // This calculation includes Hypnotic Focus and Compliant Mind.
    const hasAffordableCard = market.some(card => {
        const cost = getCardPurchaseCost(card, 2);
        return cost <= p.energy;
    });

    if (hasAffordableCard) return false;

    switch (difficulty) {
        case "random": return Math.random() > 0.65;
        case "smart": return true;
        case "aggressive": return p.energy >= 4;
        case "v23low": return p.energy >= 5;
        case "defensive": return p.energy >= 6;
        default: return false;
    }
}

function cpuShouldBuyTransformWithEnergy() {
    const p = gameState.p2; const difficulty = getCpuDifficulty();
    if (p.energy < 5) return false;
    if (difficulty === "random") return Math.random() > 0.8;
    if (difficulty === "smart") return true;
    if (difficulty === "aggressive") return p.transform >= 4 || gameState.p1.transform >= 5;
    if (difficulty === "v23low") return p.transform >= 7 || (gameState.p1.transform >= 7 && p.energy >= 7) || p.energy >= 9;
    if (difficulty === "defensive") return p.energy >= 10 || (p.transform >= 7 && p.energy >= 7);
    return false;
}

function cpuShouldBuySubmissionWithEnergy() {
    const p = gameState.p2; const difficulty = getCpuDifficulty();
    if (p.energy < 6) return false;
	// Priority 1: If pinned, ALL AI levels dump remaining energy into Submission
    if (isCpuPinnedInSubmission()) {
        return true;
    }
    if (difficulty === "v23low") return p.energy >= 7 && p.transform >= 7 && gameState.p1.transform >= 8 && gameState.submission > -5;
    if (difficulty === "aggressive") return p.energy >= 6 && p.transform >= 5 && gameState.p1.transform >= 5;
    if (difficulty === "defensive") return p.energy >= 8 && p.transform >= 6 && gameState.p1.transform >= 7 && gameState.submission > -5;
    if (difficulty === "smart") return true;
    if (difficulty === "random") return Math.random() > 0.8;
    return false;
}

function isLocalPlayerTurn() {
    if (!gameState) return false;

    const activeP = Number(gameState.activePlayer);

    if (gameState.gameMode === "online") {
        return activeP === Number(onlineLocalRole);
    }

    // Offline modes: local PvP allows both players; vs-CPU only allows Player 1
    return activeP === 1 || gameState.gameMode === "pvp";
}

// Presentation-only switch: set to false to disable shimmer/fade between avatar stages.
const ENABLE_TRANSFORMATION_ART_TRANSITIONS = true;
// Set false to return immediately to the normal game-over screen.
const ENABLE_FINAL_TRANSFORMATION_CINEMATIC = true;
const lastDisplayedTransform = { p1: null, p2: null };
const transformationGainThisTurn = { p1: 0, p2: 0 };
let lastObservedActivePlayer = null;
let lastDisplayedSubmission = null;
const transformEffectTimers = {};

function playTransformationUIEffect(playerKey, amountChanged, currentLevel, stageChanged, cumulativeGainThisTurn) {
    const portrait = document.getElementById(`${playerKey}-image`);
    const progressTrack = document.getElementById(`${playerKey}-transform-progress-track`);
    if (!portrait) return;

    // A stage change can happen downward too; the pulse is reserved for transformation increases.
    if (stageChanged && ENABLE_TRANSFORMATION_ART_TRANSITIONS) {
        portrait.classList.add("art-shimmer");
        window.setTimeout(() => portrait.classList.remove("art-shimmer"), 750);
        const img = portrait.querySelector("img");
        if (img) {
            img.classList.remove("art-stage-transition");
            void img.offsetWidth;
            img.classList.add("art-stage-transition");
            window.setTimeout(() => img.classList.remove("art-stage-transition"), 700);
        }
    }

    if (amountChanged > 0) {
        const crossedMilestone = currentLevel >= 10 || (currentLevel >= 8 && currentLevel - amountChanged < 8) || (currentLevel >= 5 && currentLevel - amountChanged < 5);
        playSound(crossedMilestone ? "transformBig" : "transform");
        if (stageChanged || amountChanged >= 2 || currentLevel >= 8) triggerHaptic("transform");
    }
    if (amountChanged <= 0) return;
    const effectClass = currentLevel >= 10 ? "transform-pulse-final" :
        (amountChanged >= 2 || cumulativeGainThisTurn >= 2 || currentLevel >= 8 ? "transform-pulse-strong" : "transform-pulse");
    const classes = ["transform-pulse", "transform-pulse-strong", "transform-pulse-final"];
    [portrait, progressTrack].filter(Boolean).forEach(el => {
        el.classList.remove(...classes);
        void el.offsetWidth; // restart the CSS animation if multiple changes land close together
        el.classList.add(effectClass);
    });

    if (transformEffectTimers[playerKey]) window.clearTimeout(transformEffectTimers[playerKey]);
    transformEffectTimers[playerKey] = window.setTimeout(() => {
        [portrait, progressTrack].filter(Boolean).forEach(el => el.classList.remove(...classes));
    }, effectClass === "transform-pulse-final" ? 1450 : effectClass === "transform-pulse-strong" ? 1000 : 750);
}

function cinematicWait(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
}

function preloadCinematicStage(path) {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null); // Missing artwork is skipped, never shown as a blank frame.
        image.src = path;
    });
}

async function playFinalTransformationCinematic(loserId) {
    if (!ENABLE_FINAL_TRANSFORMATION_CINEMATIC) return;
    const loser = loserId === 1 ? gameState.p1 : gameState.p2;
    const winner = loserId === 1 ? gameState.p2 : gameState.p1;
    const targetForm = loser.transformTarget || "new form";
	const loserGender = getGender(loser.name);
	let displayForm = targetForm;
	
	if (targetForm === "Gender" || targetForm === "Cow") {
		if (loserGender === "male") {
			targetForm === "Gender" ? displayForm = "Woman" : displayForm = "Bull";
		} else if (loserGender === "female") {
			targetForm === "Gender" ? displayForm = "Man" : displayForm = "Cow";
		}
	}
    const targetArticle = /^[AEIOU]/i.test(String(displayForm).trim()) ? "an" : "a";
    const isForfeit =
		gameState.endReason === "forfeit" &&
		Number(gameState.forfeitingPlayerId) === Number(loserId);

	const finalCaption = isForfeit
		? `${loser.name}'s resistance finally crumbles before ${winner.name}. ` +
		`“I surrender. I forfeit. I can't fight you any longer.”`
		: `${winner.name} has transformed ${loser.name} into ${targetArticle} ${displayForm}`;
    const overlay = document.getElementById("final-transform-cinematic");
    const portrait = document.getElementById("cinematic-avatar");
    const caption = document.getElementById("cinematic-caption");
    const counterWrap = document.getElementById("cinematic-counter-wrap");
    const counter = document.getElementById("cinematic-counter");
    const fill = document.getElementById("cinematic-fill");
    const skipButton = document.getElementById("cinematic-skip");
    if (!loser || !overlay || !portrait) return;

    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stageDelay = reducedMotion ? 70 : 330;
    const fadeDelay = reducedMotion ? 15 : 170;
    let skipped = false;
    let waitingForContinue = false;
    let continueCinematic = null;
    const skip = () => {
        if (waitingForContinue) { if (continueCinematic) continueCinematic(); }
        else skipped = true;
    };
    skipButton.textContent = "Skip to Final";
    skipButton.onclick = skip;
    overlay.style.setProperty("--cinematic-player-color", loserId === 1 ? "var(--player)" : "var(--cpu)");
    overlay.style.display = "flex";
	playMusic("final");
    overlay.classList.remove("cinematic-enter", "cinematic-shimmer", "cinematic-intense", "cinematic-final");
    void overlay.offsetWidth;
    overlay.classList.add("cinematic-enter");
    if (caption) {
		caption.textContent = isForfeit
			? `${playerDisplayName(loser)} — their resistance finally breaks`
			: `${playerDisplayName(loser)} — transformation begins`;
	}
    if (counterWrap) counterWrap.style.display = "block";

    const stagePath = stage => `images/avatars/${loser.name}/${loser.name}_to_${loser.transformTarget}_${Math.min(10, Math.max(0, Number(stage) || 0))}.jpg`;
    let shownStage = null;
    // Begin at stage 0, then play the complete 1–10 sequence regardless of the actual finishing stage.
    for (let stage = 0; stage <= 10; stage++) {
        if (skipped) break;
        const loaded = await preloadCinematicStage(stagePath(stage));
        if (skipped) break;
        if (!loaded) continue;

        if (shownStage === null) {
            portrait.src = loaded.src;
            portrait.alt = `${loser.name}, transformation stage ${stage}`;
            shownStage = stage;
            if (counter) counter.textContent = `Stage ${stage} / 10`;
            if (fill) fill.style.width = `${stage * 10}%`;
            await cinematicWait(reducedMotion ? 20 : 300);
            continue;
        }

        portrait.classList.add("is-fading");
        await cinematicWait(fadeDelay);
        if (skipped) break;
        portrait.src = loaded.src;
        portrait.alt = `${loser.name}, transformation stage ${stage}`;
        shownStage = stage;
        if (counter) counter.textContent = `Stage ${stage} / 10`;
        if (fill) fill.style.width = `${stage * 10}%`;
        portrait.classList.remove("is-fading");

        overlay.classList.remove("cinematic-shimmer", "cinematic-intense", "cinematic-final");
        void overlay.offsetWidth;
        if (stage === 10) {
            overlay.classList.add("cinematic-final");
            if (caption) caption.textContent = finalCaption;
            if (counterWrap) counterWrap.style.display = "none";
        } else {
            overlay.classList.add("cinematic-shimmer");
            if (stage >= 8) overlay.classList.add("cinematic-intense");
            if (caption) {
				caption.textContent = isForfeit
					? (stage >= 8
						? "Their last defenses collapse…"
						: "Their resolve is fading…")
					: (stage >= 8
						? "The final changes take hold…"
						: "Transformation in progress…");
			}
        }
        await cinematicWait(stage === 10 ? (reducedMotion ? 180 : 1050) : stageDelay);
    }

    // If stage 0 is absent, the first available stage still plays; if stage 10 is absent,
    // finish cleanly on the last available artwork instead of displaying a broken image.
    if (skipped && shownStage !== null) {
        const finalLoaded = await preloadCinematicStage(stagePath(10));
        if (finalLoaded) {
            portrait.src = finalLoaded.src;
            portrait.alt = `${loser.name}, final transformation stage`;
            shownStage = 10;
            overlay.classList.add("cinematic-final");
        }
    }
    if (shownStage !== null) {
        if (caption) caption.textContent = finalCaption;
        if (counterWrap) counterWrap.style.display = "none";
        overlay.classList.remove("cinematic-shimmer", "cinematic-intense");
        overlay.classList.add("cinematic-final");
        skipButton.textContent = "Continue";
        waitingForContinue = true;
        await new Promise(resolve => { continueCinematic = resolve; });
        waitingForContinue = false;
        skipButton.textContent = isForfeit
			? "Return to Main Screen"
			: "Continue";
	}
    overlay.style.display = "none";
	// Cinematic finished; game-over modal is about to appear — stop BGM or leave quiet.
	stopAllMusic(true);
    overlay.classList.remove("cinematic-enter", "cinematic-shimmer", "cinematic-intense", "cinematic-final");
    portrait.classList.remove("is-fading");
	
	if (typeof syncFinalBoardPortrait === "function") {
        syncFinalBoardPortrait(1);
        syncFinalBoardPortrait(2);
    }
}

function updateAvatarPortrait(container, imgPath, filename, stageChanged) {
    if (!container) return;
    const existing = container.querySelector("img");
    let alreadyShowing = false;
    try {
        alreadyShowing = !!(existing && existing.dataset.avatarPath === imgPath && existing.src === new URL(imgPath, document.baseURI).href);
    } catch (e) { alreadyShowing = !!(existing && existing.dataset.avatarPath === imgPath); }
    if (alreadyShowing) return;

    const token = String((Number(container.dataset.portraitToken) || 0) + 1);
    container.dataset.portraitToken = token;

    const img = document.createElement("img");
    img.dataset.avatarPath = imgPath;
    img.alt = filename;
    img.onclick = () => openImageModal(imgPath);
    const commit = () => {
        if (container.dataset.portraitToken !== token) return;
        if (!img.complete || img.naturalWidth === 0) return;
        container.replaceChildren(img);
        if (stageChanged && ENABLE_TRANSFORMATION_ART_TRANSITIONS) {
            img.classList.add("art-stage-transition");
            window.setTimeout(() => img.classList.remove("art-stage-transition"), 700);
        }
    };
    img.onload = commit;
    img.onerror = () => {
        if (container.dataset.portraitToken !== token) return;
        container.textContent = `Image Req: ${filename}`;
    };
    img.src = imgPath;
    if (img.complete) commit();
}

function pulseChangedStat(playerPrefix, statName, currentValue) {
    const ids = [`${playerPrefix}-${statName}`, `${playerPrefix}-${statName}-label`];
    const value = String(currentValue == null ? 0 : currentValue);
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const dataKey = `last${statName.charAt(0).toUpperCase()}${statName.slice(1)}Value`;
        if (el.dataset[dataKey] !== undefined && el.dataset[dataKey] !== value) {
            const className = `stat-change-${statName}`;
            el.classList.remove(className);
            void el.offsetWidth;
            el.classList.add(className);
            window.setTimeout(() => el.classList.remove(className), 950);
            if (id === `${playerPrefix}-${statName}`) {
                const delta = Number(value) - Number(el.dataset[dataKey]);
                const glyphs = { trance: "🌀", arousal: "🔥", energy: "⚡" };
                if (delta) {
                    showStatDelta(el, delta, glyphs[statName] || "");
                    playSound(delta > 0 ? "up" : "down");
                }
            }
        }
        el.dataset[dataKey] = value;
    });
}

function updateUI() {
    
    const taunt = document.getElementById("challenge-taunt-box");

    if (taunt) {
        if (challengeActive) {
            taunt.style.display = "flex";
            taunt.classList.add("challenge-taunt-active");
        } else if (gameState.phase !== "waiting" && !gameState.gameEnded) {
            taunt.style.display = "flex";
            taunt.classList.add("challenge-taunt-active");
        }
    }

    if (!gameState)
		return;
		
	// A later match must be allowed to show its own ending
	if (!gameState.gameEnded)
		gameOverPresentationStarted = false;
		
	// Freeze only after this browser has already shown the ending.
    // The first gameEnded snapshot still paints the final board.
	if (gameState.gameEnded && gameOverPresentationStarted)
		return;

    // Track transformation gained during the currently active player's turn, even when
    // multiple separate effects each add only one point.
    const observedActivePlayer = Number(gameState.activePlayer);
    if (lastObservedActivePlayer !== observedActivePlayer) {
        transformationGainThisTurn.p1 = 0;
        transformationGainThisTurn.p2 = 0;
        lastObservedActivePlayer = observedActivePlayer;
    }
    
    ['p1', 'p2'].forEach((p) => {
        let pObj = gameState[p];
        if (!pObj) return;

        document.getElementById(`${p}-trance`).innerText = pObj.trance;
        document.getElementById(`${p}-arousal`).innerText = pObj.arousal;
        document.getElementById(`${p}-energy`).innerText = pObj.energy;
        pulseChangedStat(p, "trance", pObj.trance);
        pulseChangedStat(p, "arousal", pObj.arousal);
        pulseChangedStat(p, "energy", pObj.energy);
        const energyLevel = Math.max(0, Math.min(10, Number(pObj.energy) || 0));
        const energyGlow = energyLevel <= 0 ? "none" : `0 0 ${2 + energyLevel * 1.1}px rgba(255,211,77,${(0.12 + energyLevel * 0.055).toFixed(2)}), 0 0 ${4 + energyLevel * 1.5}px rgba(255,159,28,${(0.08 + energyLevel * 0.045).toFixed(2)})`;
        [`${p}-energy`, `${p}-energy-label`].forEach(id => { const el = document.getElementById(id); if (el) { el.style.textShadow = energyGlow; el.style.color = energyLevel >= 7 ? "#ffe6a0" : ""; } });
        const tranceColors = ["#ffffff", "#d8efff", "#a9dcff", "#70c5ff", "#4cc9f0", "#1684c7"];
        const tranceColor = tranceColors[Math.max(0, Math.min(5, Number(pObj.trance) || 0))];
        [`${p}-trance`, `${p}-trance-label`].forEach(id => { const el = document.getElementById(id); if (el) { el.style.color = tranceColor; el.style.textShadow = Number(pObj.trance) >= 4 ? `0 0 8px ${tranceColor}66` : "none"; } });
        const arousal = Math.max(0, Math.min(5, Number(pObj.arousal) || 0));
        const arousalColor = arousal >= 5 ? "#ff3434" : arousal >= 3 ? "#ff9f1c" : "#ffffff";
        [`${p}-arousal`, `${p}-arousal-label`].forEach(id => { const el = document.getElementById(id); if (el) { el.style.color = arousalColor; el.style.textShadow = arousal >= 3 ? `0 0 7px ${arousalColor}55` : "none"; } });
        document.getElementById(`${p}-vuln`).innerText = pObj.vulnerability;
        document.getElementById(`${p}-vuln-container`).style.display = pObj.vulnerability > 0 ? "flex" : "none";

        const progressLevel = Math.max(0, Math.min(10, Number(pObj.transform) || 0));
        const progressFill = document.getElementById(`${p}-transform-progress`);
        const progressTrack = document.getElementById(`${p}-transform-progress-track`);
        const progressLabel = document.getElementById(`${p}-transform-progress-label`);
        if (progressFill) progressFill.style.width = `${progressLevel * 10}%`;
        if (progressLabel) progressLabel.textContent = `${progressLevel} / 10`;
        if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(progressLevel));

        const previousTransform = lastDisplayedTransform[p];
        const transformDelta = previousTransform === null ? 0 : Number(pObj.transform) - previousTransform;
        const stageChanged = previousTransform !== null && Math.min(10, Number(pObj.transform)) !== Math.min(10, previousTransform);
        const filename = `${pObj.name}_to_${pObj.transformTarget}_${Math.min(10, pObj.transform)}.jpg`;
        const imgPath = `images/avatars/${pObj.name}/${filename}`;
        const container = document.getElementById(`${p}-image`);
        updateAvatarPortrait(container, imgPath, filename, stageChanged);
        if (previousTransform !== null && transformDelta !== 0) {
            if (transformDelta > 0) transformationGainThisTurn[p] += transformDelta;
            showStatDelta(progressLabel || progressTrack, transformDelta, "👁️");
            playTransformationUIEffect(p, transformDelta, Number(pObj.transform) || 0, stageChanged, transformationGainThisTurn[p]);
        }
        lastDisplayedTransform[p] = Number(pObj.transform) || 0;
    });

    const p1LastRoll = gameState.p1?.lastRoll || [];
    const p2LastRoll = gameState.p2?.lastRoll || [];
    document.getElementById("p1-last-roll").innerText = p1LastRoll.length > 0 ? p1LastRoll.map(f => f.split(" ")[0]).join("") : "--";
    document.getElementById("cpu-last-roll").innerText = p2LastRoll.length > 0 ? p2LastRoll.map(f => f.split(" ")[0]).join("") : "--";

    const track = document.getElementById("submission-track");
    if (track) {
        // Build nodes only once so the marker can transition rather than being recreated on every UI refresh.
        if (!track.querySelector('.node')) {
            for (let i = 0; i < 11; i++) {
                const node = document.createElement('div');
                node.className = 'node';
                node.dataset.trackIndex = String(i);
                track.appendChild(node);
            }
            const marker = document.createElement('div');
            marker.className = 'submission-marker';
            marker.id = 'submission-marker';
            marker.setAttribute('aria-hidden', 'true');
            track.appendChild(marker);
        }
        const rawSubmission = Number(gameState.submission) || 0;
        const activeIndex = Math.max(0, Math.min(10, rawSubmission + 5));
        const marker = track.querySelector('#submission-marker');
        track.querySelectorAll('.node').forEach((node, i) => {
            node.classList.remove('active', 'active-left-end', 'active-right-end');
            if (i === activeIndex) node.classList.add(i === 0 ? 'active-left-end' : i === 10 ? 'active-right-end' : 'active');
        });
        if (marker) {
            const activeNode = track.querySelector(`.node[data-track-index="${activeIndex}"]`);
            if (activeNode) {
                // The nodes and marker are direct children of the same positioned track.
                // Use their shared offset coordinate system so the marker center overlays
                // the active node exactly, without mixing viewport and content-box coordinates.
                const nodeCenter = activeNode.offsetLeft + activeNode.offsetWidth / 2;
                marker.style.left = `${nodeCenter}px`;
            }
            marker.classList.toggle('pressure', Math.abs(rawSubmission) >= 4 && Math.abs(rawSubmission) < 5);
            marker.classList.toggle('endpoint', Math.abs(rawSubmission) >= 5);
            marker.style.borderColor = rawSubmission < 0 ? 'var(--cpu)' : rawSubmission > 0 ? 'var(--player)' : 'var(--accent)';
            marker.style.boxShadow = rawSubmission < 0 ? '0 0 10px var(--cpu), 0 0 18px rgba(255,77,77,.45)' : rawSubmission > 0 ? '0 0 10px var(--player), 0 0 18px rgba(76,201,240,.45)' : '';
        }
        const trackContainer = track.closest('.track-container');
        if (trackContainer) {
            trackContainer.classList.toggle('submission-left-pressure', rawSubmission <= -4);
            trackContainer.classList.toggle('submission-right-pressure', rawSubmission >= 4);
            if (Math.abs(rawSubmission) === 5 && lastDisplayedSubmission !== rawSubmission) {
                trackContainer.classList.remove('endpoint-crackle');
                void trackContainer.offsetWidth;
                trackContainer.classList.add('endpoint-crackle');
                window.setTimeout(() => trackContainer.classList.remove('endpoint-crackle'), 850);
                playSubmissionCrackleSound();
            } else if (lastDisplayedSubmission !== null && lastDisplayedSubmission !== rawSubmission) {
                playSound("sub");
            }
            if (lastDisplayedSubmission !== null && lastDisplayedSubmission !== rawSubmission) {
                showStatDelta(trackContainer, rawSubmission - lastDisplayedSubmission, "⛓️");
            }
        }
        lastDisplayedSubmission = rawSubmission;
    }

    const activePlayerNum = Number(gameState.activePlayer);
    let activeP = activePlayerNum === 1 ? gameState.p1 : gameState.p2;
    let isHumanTurn = isLocalPlayerTurn();
    let isP1 = activePlayerNum === 1;

    const p1NameEl = document.getElementById("ui-p1-name");
    const p2NameEl = document.getElementById("ui-cpu-name");

    if (p1NameEl && gameState.p1) {
        p1NameEl.innerText = gameState.p1.name || "Player 1";
        p1NameEl.classList.remove("active-player-glow");
        if (isP1) p1NameEl.classList.add("active-player-glow");
    }
    const p1Portrait = document.getElementById("p1-image"), p2Portrait = document.getElementById("p2-image");
    const gameLive = !gameState.gameEnded;
    if (p1Portrait) p1Portrait.classList.toggle("active-portrait-glow-p1", gameLive && isP1);
    if (p2Portrait) p2Portrait.classList.toggle("active-portrait-glow-p2", gameLive && !isP1);

    if (p2NameEl && gameState.p2) {
        if (gameState.gameMode === "vs-cpu") {
            p2NameEl.innerText = `${gameState.p2.name} (${getCpuDifficultyName()})`;
        } else {
            p2NameEl.innerText = playerDisplayName(gameState.p2) || "Player 2";
        }
        p2NameEl.classList.remove("active-player-glow");
        if (!isP1) p2NameEl.classList.add("active-player-glow");
    }

    const trackLabels = document.getElementById("track-labels");
    if (trackLabels && gameState.p1 && gameState.p2) {
        trackLabels.innerHTML = `<span class="${Number(gameState.submission) === -5 ? 'obey-label-active' : ''}" style="color:${Number(gameState.submission) === -5 ? 'var(--cpu)' : ''}">${gameState.p1.name} Will Obey</span><span>Neutral</span><span class="${Number(gameState.submission) === 5 ? 'obey-label-active' : ''}" style="color:${Number(gameState.submission) === 5 ? 'var(--player)' : ''}">${playerDisplayName(gameState.p2)} Will Obey</span>`;
    }

    let dirArrowsLeft = isP1 ? "◄◄ " : "";
    let dirArrowsRight = !isP1 ? " ►►" : "";
    let turnIndicator = document.getElementById("turn-indicator");
    if (turnIndicator && activeP) {
        turnIndicator.innerText = `${dirArrowsLeft}${playerDisplayName(activeP)}'s Turn${dirArrowsRight}`;
        turnIndicator.style.color = isP1 ? "var(--player)" : "var(--cpu)";
    }
    
    document.getElementById("rerolls-indicator").innerText = `(Rerolls: ${gameState.rerollsLeft})`;
    const boardEl = document.querySelector(".board");
    if (boardEl) {
        boardEl.classList.toggle("phase-rolling", gameState.phase === "rolling");
        boardEl.classList.toggle("phase-shop", gameState.phase === "shop");
        const phaseCueText = document.getElementById("phase-cue-text");
        if (phaseCueText) {
            phaseCueText.textContent = gameState.phase === "shop" ? "Spend energy" : "Keep or reroll";
        }
    }
    
    document.getElementById("btn-wipe-market").disabled = !isHumanTurn || activeP.energy < 2 || gameState.phase !== "shop";
    
    // UI Button Toggles P1
    document.getElementById("btn-buy-arousal-1").disabled = !isHumanTurn || !isP1 || gameState.p1.energy < 3 || gameState.phase !== "shop";
    document.getElementById("btn-buy-transform-1").disabled = !isHumanTurn || !isP1 || gameState.p1.energy < 5 || gameState.phase !== "shop";
    document.getElementById("btn-buy-submission-1").disabled = !isHumanTurn || !isP1 || gameState.p1.energy < 6 || gameState.phase !== "shop";
    
    let btnEnd1 = document.getElementById("btn-end-turn-1");
    btnEnd1.disabled = !isHumanTurn || !isP1 || gameState.phase !== "shop" || isChoicePending();
    btnEnd1.style.background = btnEnd1.disabled ? '' : 'var(--player)';

    // UI Button Toggles P2
    if (gameState.gameMode === "pvp" || gameState.gameMode === "online") {
        let isP2 = activePlayerNum === 2;
        document.getElementById("btn-buy-arousal-2").disabled = !isHumanTurn || !isP2 || gameState.p2.energy < 3 || gameState.phase !== "shop";
        document.getElementById("btn-buy-transform-2").disabled = !isHumanTurn || !isP2 || gameState.p2.energy < 5 || gameState.phase !== "shop";
        document.getElementById("btn-buy-submission-2").disabled = !isHumanTurn || !isP2 || gameState.p2.energy < 6 || gameState.phase !== "shop";
        
        let btnEnd2 = document.getElementById("btn-end-turn-2");
        btnEnd2.disabled = !isHumanTurn || !isP2 || gameState.phase !== "shop" || isChoicePending();
        btnEnd2.style.background = btnEnd2.disabled ? '' : 'var(--cpu)';
    }

    renderDiceAndActions(isHumanTurn); 
    renderMarket(); 
    renderInventory(1); 
    renderInventory(2); 
    renderLog();
    renderTurnHistory();
    setGameLogVisible(localShowGameLog);
    updateOnlineStatusUI();
	if (gameState.gameEnded) {
		presentFinishedGame();
		return;
	}
	
	// The other online player must not decide the winner. They wait for gameEnded.
    if (gameState.gameMode === "online" && !isLocalPlayerTurn()) return;
	checkWinCondition();
}

function renderDiceAndActions(isHumanTurn) {
    const dc = document.getElementById("dice-container"); dc.innerHTML = "";
    gameState.dice.forEach((die, index) => {
        const isAnimating = diceAnimating.has(index);
        const visibleFace = isAnimating ? (diceAnimationFaces.get(index) || FACES[Math.floor(Math.random() * FACES.length)]) : die.face;
        const div = document.createElement("div");
        div.dataset.dieIndex = index;
        const activeForDie = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
        const deeperBargainsDie = index === 0 && (activeForDie.inventory || []).some(c => Number(c.id) === 56 && c.chosenFace);
        div.className = `die ${deeperBargainsDie ? 'special-die' : ''} ${die.kept ? (gameState.activePlayer === 1 ? 'kept' : 'cpu-kept') : ''}${isAnimating ? ' rolling-die' : ''}`;
        if (isAnimating) div.style.animationDelay = `${(index % 6) * 35}ms`;
        if (visibleFace === "-") div.innerText = "?";
        else {
            div.innerText = localShowDiceText ? visibleFace : visibleFace.split(" ")[0];
            // Text + symbol labels need the compact base size; symbol-only gets the larger glyph.
            div.style.fontSize = localShowDiceText ? "0.8em" : "2.5em";
        }
        if (isHumanTurn && gameState.phase === "rolling" && die.face !== "-") div.onclick = () => {
            if (diceAnimating.size) return;
            die.kept = !die.kept;
            playSound(die.kept ? "lock" : "unlock");
            triggerHaptic(die.kept ? "lock" : "unlock");
            syncToFirebase();
            updateUI();
        };
        // CPU telegraph: briefly emphasize locked dice before the AI rerolls.
        if (cpuTelegraphActive && die.kept && gameState.activePlayer === 2) {
            div.classList.add("cpu-telegraph");
        }
        dc.appendChild(div);
    });

    const ag = document.getElementById("actions-grid"); ag.innerHTML = "";
    let isInitRoll = gameState.dice[0].face === "-";
    let activeColor = gameState.activePlayer === 1 ? 'var(--player)' : 'var(--cpu)';

    let rollBtnDisabled = !isHumanTurn || diceAnimating.size > 0 || (!isInitRoll && gameState.rerollsLeft <= 0) || gameState.phase !== "rolling";
    ag.innerHTML += `<button onclick="rollDiceAction()" id="btn-roll" ${rollBtnDisabled ? 'disabled' : ''} style="${rollBtnDisabled ? '' : 'background: ' + activeColor + ';'}">${isInitRoll ? "Roll Dice" : "Roll Unkept Dice"}</button>`;
    
    let activeP = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
    if (isHumanTurn && hasCard(gameState.activePlayer, 16) && gameState.phase === 'rolling' && !isInitRoll && gameState.rerollsLeft <= 0 && activeP.energy >= 1) {
        ag.innerHTML += `<button onclick="buyReroll(1, 16, ${gameState.activePlayer})" style="background:#f4a261; color:#000; font-weight:bold;">Use Hypnotic Suggestion (1⚡)</button>`;
    }
    
    let resolveDisabled = !isHumanTurn || diceAnimating.size > 0 || isInitRoll || gameState.phase !== "rolling";
    ag.innerHTML += `<button onclick="resolveDice()" id="btn-resolve" ${resolveDisabled ? 'disabled' : ''} style="${resolveDisabled ? '' : 'background: ' + activeColor + ';'}">Resolve Dice</button>`;
}

function renderMarket() {
    const mc = document.getElementById("market-container"); mc.innerHTML = "";
    let activeP = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
    let isHumanTurn = isLocalPlayerTurn();

    market.forEach((card, index) => {
        let displayCost = card.cost;
        if (hasCard(gameState.activePlayer, 29)) displayCost = Math.max(0, displayCost - 1);
        if (hasCard(gameState.activePlayer, 28) && !activeP.boughtCardThisTurn) displayCost = Math.max(0, displayCost - 2);
        if (gameState.freeBuyActive) displayCost = 0;

        const alreadyOwned = inventoryHasName(activeP, card.name);
        const canAfford = activeP.energy >= displayCost || gameState.freeBuyActive;
        const purchasable = isHumanTurn && gameState.phase === "shop" && canAfford && !alreadyOwned;
        const affordClass = alreadyOwned ? "already-owned" : (canAfford ? "can-afford" : "cannot-afford");
        let btnDisabled = purchasable ? "" : "disabled";
        const reject = !purchasable && isHumanTurn && gameState.phase === "shop" ? ` onclick="rejectMarketCard(this)"` : "";
        mc.innerHTML += `
            <div class="card ${affordClass}"${reject}>
                <div class="card-header"><span>${card.name}</span> <span style="${displayCost < card.cost ? 'color:var(--player); font-weight:bold;' : ''}">${displayCost}⚡</span></div>
                <div class="card-type">${card.type}</div>
                <div style="font-size:0.8em; margin: 10px 0; color:#ccc;">${card.desc}</div>
                <button ${btnDisabled} onclick="buyCard(${index})">${alreadyOwned ? "Already owned" : "Purchase"}</button>
            </div>`;
    });
}

// Visual-only card feedback. Local UI state only; never added to gameState/Firebase.
let pendingCardTriggerNotices = [];
let cardTriggerFlushTimer = null;
let cardTriggerToastTimer = null;
function queueCardTrigger(playerId, cardId, detail = "Effect activated", kind = "passive") {
    if (!gameState || ![1, 2].includes(Number(playerId))) return;
    const p = Number(playerId) === 1 ? gameState.p1 : gameState.p2;
    if (!p) return;
    const inventory = Array.isArray(p.inventory) ? p.inventory : Object.values(p.inventory || {});
    const card = inventory.find(c => c && Number(c.id) === Number(cardId));
    if (cardResolvedThisTurn instanceof Set) cardResolvedThisTurn.add(`${Number(playerId)}:${Number(cardId)}`);
    const cardName = card?.name || (typeof KNOWN_CARDS !== "undefined" ? (KNOWN_CARDS.find(c => Number(c.id) === Number(cardId)) || {}).name : "") || `Card ${cardId}`;
    pendingCardTriggerNotices.push({ playerId: Number(playerId), playerName: p.name || `Player ${playerId}`, cardId: Number(cardId), cardName, detail, kind });
    // Last-effect ticker: only for the local human's own triggers on their turn.
    if (isLocalPlayerTurn() && Number(playerId) === Number(gameState.activePlayer)) {
        setLastEffectTicker(cardName, detail);
    }
    if (cardTriggerFlushTimer) return;
    cardTriggerFlushTimer = setTimeout(() => {
        cardTriggerFlushTimer = null;
        const notices = pendingCardTriggerNotices.splice(0);
        const unique = [];
        const seen = new Set();
        notices.forEach(n => {
            const k = `${n.playerId}:${n.cardId}:${n.detail}`;
            if (!seen.has(k)) { seen.add(k); unique.push(n); }
        });
        renderCardTriggerToast(unique);
        if (unique.length) playSound("trigger");
        // Animate only cards that actually triggered in this batch. No timer-based
        // reapplication during ordinary inventory redraws (e.g. clicking dice).
        const animated = new Set();
        unique.forEach(n => {
            const key = `${n.playerId}:${n.cardId}`;
            if (animated.has(key)) return;
            animated.add(key);
            const inv = document.getElementById(`p${n.playerId}-inventory`);
            const el = inv && inv.querySelector(`.inv-card[data-card-id="${n.cardId}"]`);
            if (!el) return;
            el.classList.remove('card-triggered');
            void el.offsetWidth;
            el.classList.add('card-triggered');
            setTimeout(() => el.classList.remove('card-triggered'), 760);
        });
    }, 75);
}
function showTurnAlert(message, beneficiaryId) {
    const toast = document.getElementById("card-trigger-toast");
    if (!toast) return;
    const color = beneficiaryId === 1 ? "var(--player)" : "var(--cpu)";
    const line = `<div><strong style="color:${color}">Turn outcome</strong> · ${escapeHistoryHtml(message)}</div>`;
    toast.innerHTML = toast.innerHTML ? `${line}${toast.innerHTML}` : line;
    toast.classList.add("visible");
    if (cardTriggerToastTimer) { clearTimeout(cardTriggerToastTimer); cardTriggerToastTimer = null; }
}

function renderCardTriggerToast(notices) {
    if (!notices.length) return;
    const toast = document.getElementById('card-trigger-toast');
    if (!toast) return;
    const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const rows = notices.map(n => `<div><span class="toast-player" style="color:${n.playerId === 1 ? 'var(--player)' : 'var(--cpu)'}">${esc(n.playerName)}</span> · <strong>${esc(n.cardName)}</strong>: ${esc(n.detail)}</div>`);
    const existing = toast.classList.contains('visible') ? toast.innerHTML : '';
    toast.innerHTML = existing ? `${existing}${rows.join('')}` : rows.join('');
    toast.classList.remove('visible'); void toast.offsetWidth; toast.classList.add('visible');
    if (cardTriggerToastTimer) { clearTimeout(cardTriggerToastTimer); cardTriggerToastTimer = null; }
}

function renderInventory(playerId) {
    let p = playerId === 1 ? gameState.p1 : gameState.p2;
    let invDiv = document.getElementById(`p${playerId}-inventory`);
    invDiv.innerHTML = "";
    let isHuman = isLocalPlayerTurn();
    let isTurn = gameState.activePlayer === playerId;

    const buyerId = Number(gameState.activePlayer);
    const buyer = buyerId === 1 ? gameState.p1 : gameState.p2;
    const canSteal = isLocalPlayerTurn()
        && gameState.phase === "shop"
        && playerId !== buyerId
        && hasCard(buyerId, 5);

    p.inventory.forEach((card, idx) => {
        const keepClass = card.type === "Keep" ? " active-keep-card" : "";
        const ownerColor = playerId === 1 ? "var(--player)" : "var(--cpu)";
        let html = `<div class="inv-card${keepClass}" data-card-id="${Number(card.id)}" style="--card-owner-color:${ownerColor};"><div style="font-weight:bold; color:var(--accent);">${card.name} ${card.id === 20 ? `(Charges: ${card.charges})` : ''}</div><div style="font-size:0.8em; color:#bbb;">${card.desc}</div>`;
        if (isHuman && isTurn) {
            if (card.id === 12 && gameState.phase === 'rolling' && p.energy >= 2 && !p.shieldActive) html += `<button onclick="useRapidPulse(${playerId})" style="background:#457b9d;">Use Rapid Pulse (-2⚡)</button>`;
            if (card.id === 20 && gameState.phase === 'rolling' && gameState.dice[0].face !== "-" && gameState.rerollsLeft <= 0 && card.charges > 0) html += `<button onclick="useAbsoluteFocus(${idx}, ${playerId})" style="background:#f4a261; color:#000;">Use Focus Charge (+1 Reroll)</button>`;
            if (card.id === 26) html += `<button onclick="sellCard(${idx}, ${playerId})" style="background:#e76f51;">Sell (+2⚡)</button>`;
            if (card.id === 33 && gameState.phase === 'shop' && p.energy >= 2) html += `<button onclick="useQuietMind(${playerId})" style="background:#2a9d8f;">Quiet Mind (-2⚡)</button>`;
            if (card.id === 42 && gameState.phase === 'shop') html += `<button onclick="discardForFreeBuy(${idx}, ${playerId})" style="background:#2a9d8f;">Discard for Free Buy</button>`;
            if (card.id === 47 && gameState.phase === 'rolling' && gameState.dice.some(d => d.face === "👁️ TRANSFORM" && !d.kept)) html += `<button onclick="useFadingReality(${playerId})" style="background:#9d4edd;">Reroll Unlocked 👁️</button>`;
            if (card.id === 49 && gameState.phase === 'rolling' && gameState.dice[0].face !== "-" && !p.simmeringUsed) html += `<button onclick="useSimmeringArousal(${playerId})" style="background:#d62828;">Change 1 die to 🔥</button>`;
            if (card.id === 54 && canUseBurningUp(playerId)) html += `<button onclick="useBurningUp(${playerId})" style="background:#d62828;">Burning Up (up to 2 extra rerolls)</button>`;
        }
        if (canSteal) {
			const owned = inventoryHasName(buyer, card.name);
			const afford = buyer.energy >= card.cost && !owned;
			const label = owned ? "Already owned" : `Buy for ${card.cost}⚡`;
			html += `<button ${afford ? "" : "disabled"} onclick="buyCardFromOpponent(${buyerId}, ${idx})" style="background:#2a9d8f;">${label}</button>`;
		}
        html += `</div>`;
        invDiv.innerHTML += html;
    });
}

function buyReroll(energyCost, cardId, pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    if (p.energy >= energyCost && hasCard(pId, cardId)) { p.energy -= energyCost; gameState.rerollsLeft += 1; cardResolvedThisTurn.add(`${pId}:${cardId}`); log(`Bought reroll for ${energyCost}⚡.`); syncToFirebase(); updateUI(); }
}
function useAbsoluteFocus(idx, pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    let card = p.inventory[idx];

    if (card && card.charges > 0) {
        queueCardTrigger(pId, 20, "Spent a Focus charge for +1 Reroll", "manual");
        card.charges -= 1;
        gameState.rerollsLeft += 1;
        log(`Used Absolute Focus charge. (${card.charges} left)`);

        if (card.charges <= 0) {
            const discarded = p.inventory.splice(idx, 1)[0];
            discardCard(discarded);
            log("Absolute Focus depleted and discarded.");
        }
        syncToFirebase();
        updateUI();
    }
}
// ---- INLINE CHOICE DIALOG (shows below the market) ----
let choiceQueue = [];
let endTurnAfterChoice = false;   // the CPU tried to end its turn while a dialog was still open
let choiceActive = null;
function isChoicePending() { return choiceActive !== null || choiceQueue.length > 0; }
function showChoiceDialog(cfg) {
    // cfg: { key, title, message, options: [{ label, onClick, secondary }] }
    if (cfg.key && ((choiceActive && choiceActive.key === cfg.key) || choiceQueue.some(c => c.key === cfg.key))) return;
    choiceQueue.push(cfg);
    if (!choiceActive) showNextChoice();
}
function showNextChoice() {
    const el = document.getElementById("choice-dialog");
    choiceActive = choiceQueue.shift() || null;
    if (!choiceActive) {
        el.style.display = "none"; el.innerHTML = "";
        if (typeof updateUI === "function") updateUI();
        if (endTurnAfterChoice) { endTurnAfterChoice = false; endTurn(); }   // finish the CPU turn that was waiting on this choice
        return;
    }
    el.innerHTML = "";
    const h = document.createElement("h4"); h.textContent = choiceActive.title; el.appendChild(h);
    if (choiceActive.message) { const m = document.createElement("p"); m.textContent = choiceActive.message; el.appendChild(m); }
    const row = document.createElement("div"); row.className = "choice-buttons";
    choiceActive.options.forEach(opt => {
        const b = document.createElement("button");
        b.textContent = opt.label;
        if (opt.secondary) b.className = "secondary";
        b.onclick = () => {
            choiceActive = null;
            if (opt.onClick) opt.onClick();
            syncToFirebase();
            showNextChoice();
        };
        row.appendChild(b);
    });
    el.appendChild(row);
    el.style.display = "block";
    if (typeof updateUI === "function") updateUI();
}
function nudgeChoiceDialog() {
    const el = document.getElementById("choice-dialog");
    el.classList.remove("nudge"); void el.offsetWidth; el.classList.add("nudge");
}

function useQuietMind(pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    if (isChoicePending()) { nudgeChoiceDialog(); return; }
    if (!(p.energy >= 2 && (p.trance > 0 || p.arousal > 0))) return;
    const apply = (stat) => {
        const pl = pId === 1 ? gameState.p1 : gameState.p2;
        if (pl.energy < 2 || pl[stat] <= 0) return;
        queueCardTrigger(pId, 33, `Reduced ${stat === "trance" ? "Trance" : "Arousal"} by 1`, "manual");
        pl.energy -= 2;
        pl[stat]--;
        log(`${pl.name} used Quiet Mind to reduce ${stat === "trance" ? "Trance" : "Arousal"}.`);
    };
    if (p.trance > 0 && p.arousal > 0) {
        showChoiceDialog({
            key: "quietmind",
            title: "Quiet Mind (-2⚡)",
            message: "Reduce which stat by 1?",
            options: [
                { label: "🌀 Reduce Trance", onClick: () => apply("trance") },
                { label: "🔥 Reduce Arousal", onClick: () => apply("arousal") },
                { label: "Cancel", secondary: true }
            ]
        });
    } else {
        apply(p.trance > 0 ? "trance" : "arousal");
        syncToFirebase(); updateUI();
    }
}
function sellCard(invIndex, pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    let card = p.inventory.splice(invIndex, 1)[0];
    if (!card) return;
    p.energy += 2;
    discardCard(card);
    log(`Sold ${card.name} for 2 Energy.`); syncToFirebase(); updateUI();
}
function discardForFreeBuy(invIndex, pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    let card = p.inventory.splice(invIndex, 1)[0];
    if (!card) return;
    discardCard(card);
    gameState.freeBuyActive = true;
    log(`${p.name} discarded Mirror Image! Next buy is free.`); syncToFirebase(); updateUI();
}
function useRapidPulse(pId) { let p = pId === 1 ? gameState.p1 : gameState.p2; if (p.energy >= 2) { queueCardTrigger(pId, 12, "Activated shield for this turn", "manual"); p.energy -= 2; p.shieldActive = true; log(`${p.name} used Rapid Pulse to shield incoming Trance and Arousal!`); syncToFirebase(); updateUI(); } }

function useFadingReality(pId) {
    let changed = 0;
    gameState.dice.forEach(d => {
        if (d.face === "👁️ TRANSFORM" && !d.kept) {
            d.face = FACES[Math.floor(Math.random() * FACES.length)];
            d.kept = false;
            changed++;
        }
    });
    if (changed > 0) {
        queueCardTrigger(pId, 47, `Rerolled ${changed} unlocked Transform ${changed === 1 ? "die" : "dice"}`, "manual");
        log(`Fading Reality: rerolled ${changed} unlocked Transform ${changed === 1 ? "die" : "dice"}.`);
        syncToFirebase();
        updateUI();
    }
}

function useBurningUp(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    if (!hasCard(pId, 54) || p.burningUpUsed || gameState.phase !== "rolling" || gameState.dice[0]?.face === "-") return;
    p.burningUpUsed = true;
    p.burningUpPending = 2;
    gameState.rerollsLeft += 2;
    queueCardTrigger(pId, 54, "Added up to 2 extra rerolls");
    log(`${p.name} uses Burning Up: +2 rerolls, with escalating 🔥 after each.`);
    syncToFirebase(); updateUI();
}

function useSimmeringArousal(pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    let idx = gameState.dice.findIndex(d => d.face !== "🔥 AROUSAL" && !d.kept);
    if(idx !== -1) { queueCardTrigger(pId, 49, "Changed one die to 🔥", "manual"); gameState.dice[idx].face = "🔥 AROUSAL"; p.simmeringUsed = true; log("Simmering Arousal: Changed a die to Arousal."); syncToFirebase(); updateUI(); }
}

function increaseTrance(targetObj, amount, sourcePlayerId) {
    if (!targetObj || !(amount > 0)) return false;
    const targetId = targetObj === gameState.p1 ? 1 : 2;

    if (targetObj.shieldActive) {
        log(`Rapid Pulse shielded Trance against ${targetObj.name}.`);
        return false;
    }

    const before = targetObj.trance;
    targetObj.trance += amount;
    if (targetObj.trance <= before) return false;
    if (sourcePlayerId && sourcePlayerId !== targetId && hasCard(targetId, 21)) cardResolvedThisTurn.add(`${targetId}:21`);
    const triggersSetback = before < 5 && targetObj.trance >= 5;
    if (triggersSetback) log(`${targetObj.name}'s 🌀 deepens +${amount} 🌀.`);

    checkTranceSetback(targetObj, sourcePlayerId);

    if (sourcePlayerId && sourcePlayerId !== targetId && sourcePlayerId !== 0
        && !increaseTrance.reflecting && hasCard(targetId, 21)) {
        increaseTrance.reflecting = true;
        const src = gameState["p" + sourcePlayerId];
        if (src.shieldActive) {
            log(`Switch Play: ${src.name}'s Rapid Pulse stopped the reflected 🌀.`);
        } else {
            log(`Switch Play: ${targetObj.name} reflects 1 🌀 to ${src.name}.`);
            src.trance += 1;
            checkTranceSetback(src, targetId);
        }
        increaseTrance.reflecting = false;
    }
    return !triggersSetback;
}

function cpuShouldTransformOnSetback() {
    if (isCpuPinnedInSubmission()) return false;
    switch (getCpuDifficulty()) {
        case "random": return Math.random() > 0.5;
        case "aggressive":
        case "v23low":
        case "transformer": return true;
        case "adaptive": return gameState.submission < 2;   // when the marker is sliding, use the setback to push it back
        case "defensive": return gameState.p1.transform >= 6;
        default: return gameState.p1.transform >= 4;
    }
}

function checkTranceSetback(oppP, activePlayerId) {
    while (oppP.trance >= 5) {
        oppP.trance -= 5;
        const victimId = oppP === gameState.p1 ? 1 : 2;
        const canManipulate = activePlayerId && hasCard(activePlayerId, 17);
        const humanChooses = activePlayerId === 1 || gameState.gameMode === "pvp" || gameState.gameMode === "online";

        if (humanChooses) {
            const oppName = oppP.name;
            const setbackLogPosition = Array.isArray(gameState.log) ? gameState.log.length : 0;
            const opts = [
                { label: "Push Submission 2", onClick: () => { logAtHistoryPosition(`SETBACK: ${oppName} is deep in 🌀 becomes more submissive (+2 ⛓️).`, setbackLogPosition); pushSubmission(activePlayerId === 1 ? 2 : -2, activePlayerId); } },
                { label: `${oppName} Arousal +2`, onClick: () => {
                    logAtHistoryPosition(`SETBACK: ${oppName} is deep in 🌀 becomes more aroused (+2 🔥).`, setbackLogPosition);
                    increaseArousal(gameState["p" + victimId], 2, victimId, activePlayerId);
                } }
            ];
            if (canManipulate) opts.push({ label: `Physical Manipulation: Transform ${oppName} +1`, onClick: () => {
                logAtHistoryPosition(`SETBACK: ${oppName} is deep in 🌀 and is made to transform (+1 👁️).`, setbackLogPosition);
                applyTransform(victimId, 1, activePlayerId);
            } });
            showChoiceDialog({ title: `${oppName} Setback!`, message: "Choose the effect:", options: opts });
        } else if (canManipulate && cpuShouldTransformOnSetback()) {
            log(`SETBACK: ${oppP.name} is deep in 🌀 and is made to transform (+1 👁️).`);
            applyTransform(victimId, 1, activePlayerId);
        } else if (cpuIsAdaptive() && activePlayerId === 2 && cpuAdaptiveSetbackChoice(oppP) === "arousal") {
            log(`SETBACK: ${oppP.name} is deep in 🌀 becomes more aroused (+2 🔥).`);
            increaseArousal(oppP, 2, victimId, activePlayerId);
        } else {
            log(`SETBACK: ${oppP.name} is deep in 🌀 becomes more submissive (+2 ⛓️).`);
            pushSubmission(-2, 2);
        }
    }
}

function increaseArousal(target, amount, recipientId, sourceId) {
    const pObj = typeof target === "object" ? target : gameState["p" + target];
    if (!pObj || !(amount > 0)) return;
    if (recipientId == null) recipientId = pObj === gameState.p1 ? 1 : 2;

    const before = pObj.arousal;
    pObj.arousal = Math.min(5, pObj.arousal + amount);
    if (pObj.arousal > before && hasCard(recipientId, 32)) {
        pObj.energy += 1;
        queueCardTrigger(recipientId, 32, "+1 Energy when Arousal increased");
        log(`Guided Heat triggered: +1 Energy from arousal increase.`);
    }

    // One bounce. The reflected point must not trigger Mutual Heat again.
	if (pObj.arousal > before && sourceId && sourceId !== recipientId && sourceId !== 0
    && !increaseArousal.reflecting && hasCard(recipientId, 50)) {
    increaseArousal.reflecting = true;
    const src = gameState["p" + sourceId];
    if (src.shieldActive) {
        log(`Mutual Heat: ${src.name}'s Rapid Pulse stopped the reflected 🔥.`);
    } else {
        const srcBefore = src.arousal;
        src.arousal = Math.min(5, src.arousal + 1);
        queueCardTrigger(recipientId, 50, `Reflected 1 🔥 to ${src.name}`);
        log(`Mutual Heat: ${pObj.name} reflects 1 🔥 to ${src.name}.`);
        if (src.arousal > srcBefore && hasCard(sourceId, 32)) {
            src.energy += 1;
            queueCardTrigger(sourceId, 32, "+1 Energy when reflected Arousal increased");
            log(`Guided Heat triggered: +1 Energy from arousal increase.`);
        }
    }
    increaseArousal.reflecting = false;
}
}

function applyTransform(targetPlayerId, amount, sourcePlayerId) {
    let target = targetPlayerId === 1 ? gameState.p1 : gameState.p2;
    let finalAmount = amount;
    // Transformation Sigil only reacts to an actual opponent's transformation, not neutral/system effects.
    if (finalAmount > 0 && sourcePlayerId !== targetPlayerId && hasCard(targetPlayerId, 59)) {
        const rolls = [FACES[Math.floor(Math.random() * FACES.length)], FACES[Math.floor(Math.random() * FACES.length)]];
        const transformCount = rolls.filter(face => face === "👁️ TRANSFORM").length;
        const rollLabels = rolls.map(face => face.split(" ")[0]);
        log(`Transformation Sigil rolls: ${rollLabels.join(" and ")}.`);
        showPopup("✦ Transformation Sigil ✦", `<p>The Sigil rolls two dice to ward off transformation.</p><div style="display:flex;justify-content:center;gap:16px;margin:18px 0"><div style="font-size:2.8rem;background:#272033;border:2px solid #a78bfa;border-radius:12px;padding:14px;min-width:62px;text-align:center">${rollLabels[0]}</div><div style="font-size:2.8rem;background:#272033;border:2px solid #a78bfa;border-radius:12px;padding:14px;min-width:62px;text-align:center">${rollLabels[1]}</div></div><p>${transformCount===2?"Double Transform! Reduce the incoming transformation by 1 and reflect 1 transformation back.":transformCount===1?"One Transform! Reduce the incoming transformation by 1.":"No Transform faces. The incoming transformation is unchanged."}</p>`);
        if (transformCount >= 1) {
            finalAmount = Math.max(0, finalAmount - 1);
            queueCardTrigger(targetPlayerId, 59, "Reduced incoming transformation by 1");
            log(`Transformation Sigil reduces incoming 👁️ by 1.`);
        }
        if (transformCount === 2) {
            const reflectedTarget = (sourcePlayerId === 1 || sourcePlayerId === 2)
                ? sourcePlayerId
                : (targetPlayerId === 1 ? 2 : 1);
            const reflectedName = reflectedTarget === 1 ? gameState.p1.name : gameState.p2.name;
            log(`Transformation Sigil reflects 1 👁️ back at ${reflectedName}.`);
            applyTransform(reflectedTarget, 1, 0);
            queueCardTrigger(targetPlayerId, 59, "Reflected 1 transformation to the opponent");
        }
    }
    const beforeTransform = Number(target.transform) || 0;
    target.transform += finalAmount;
	let showedTaunt = false;
    if (challengeActive && finalAmount > 0) {
        if (targetPlayerId === 1)
			showChallengeTaunt("TransformPlayer");
        else 
			showChallengeTaunt("AIGetsTransformed");
        const afterTransform = Number(target.transform) || 0;
        if (targetPlayerId === 1 && beforeTransform < 5 && afterTransform >= 5) showChallengeTaunt("PlayerAt5Transform");
        if (targetPlayerId === 1 && beforeTransform < 8 && afterTransform >= 8) showChallengeTaunt("PlayerAt8Transform");
        if (targetPlayerId === 2 && beforeTransform < 5 && afterTransform >= 5) showChallengeTaunt("AIAt5Transform");
        if (targetPlayerId === 2 && beforeTransform < 9 && afterTransform >= 9) showChallengeTaunt("AIAt9Transform");
    }
	else if (!challengeActive)
	{
		if (finalAmount > 0) {
			if (targetPlayerId === 1) {
				maybeShowPlayerTransformationTaunt("TransformPlayer", PLAYER_TRANSFORMATION_TAUNT_CHANCE);

				const afterTransform = Number(target.transform) || 0;

				if (beforeTransform < 5 && afterTransform >= 5) {
					maybeShowPlayerTransformationTaunt("PlayerAt5Transform", PLAYER_TRANSFORMATION_TAUNT_CHANCE+.5);
				}

				if (beforeTransform < 8 && afterTransform >= 8) {
					maybeShowPlayerTransformationTaunt("PlayerAt8Transform", 1.0);
				}
			}
			else if (targetPlayerId === 2) {
				maybeShowCPUTransformationTaunt("AIGetsTransformed", PLAYER_TRANSFORMATION_TAUNT_CHANCE+.25);

				const afterTransform = Number(target.transform) || 0;

				if (beforeTransform < 5 && afterTransform >= 5) {
					maybeShowCPUTransformationTaunt("AIAt5Transform",PLAYER_TRANSFORMATION_TAUNT_CHANCE+.5);
				}

				if (beforeTransform < 9 && afterTransform >= 9) {
					maybeShowCPUTransformationTaunt("AIAt9Transform",1.0);
				}
			}
		}
	}
    if (finalAmount > 0 && target && Number(sourcePlayerId) !== 0) {
        showTurnAlert(`${target.name} transforms +${finalAmount} 👁️.`, targetPlayerId);
    }
    
    // Only apply Vulnerability if the source is an actual opponent
    // Powerful Transform: max ONE vulnerability counter per turn, however many Transform points are dealt
    if (finalAmount > 0 && sourcePlayerId !== 0 && sourcePlayerId !== targetPlayerId && hasCard(sourcePlayerId, 41) && !gameState.vulnGrantedThisTurn) { 
        gameState.vulnGrantedThisTurn = true;
        target.vulnerability += 1; 
        queueCardTrigger(sourcePlayerId, 41, `Applied 1 Vulnerability to ${target.name}`);
        log(`Powerful Transform applied 1 Vulnerability to ${target.name}.`); 
    }
}

// ============================================================
// CARDS 54-61 (engine side). The CPU and the tests use these; your own implementation may differ in details.
// ============================================================
const BLANK_FACE = "⬜ BLANK";
function playerById(pid) { return pid === 1 ? gameState.p1 : gameState.p2; }
function oppIdOf(pid) { return pid === 1 ? 2 : 1; }
function isHumanActor(pid) { return pid === 1 || gameState.gameMode !== "solo"; }
function specialDieFace(pObj) { return Math.random() < 0.5 ? pObj.specialFace : BLANK_FACE; }   // 3 faces of the chosen kind, 3 blanks

// 54 Burning Up: up to 2 extra rerolls per turn; your 🔥 rises by 1 after the first and by 2 after the second
function canUseBurningUp(pid) {
    const p = playerById(pid);
    return hasCard(pid, 54) && (p.burningUpUses || 0) < 2 && gameState.phase === "rolling" && gameState.dice.length > 0 && gameState.dice[0].face !== "-";
}
function useBurningUp(pid) {
    if (!canUseBurningUp(pid)) return false;
    const p = playerById(pid);
    const rise = (p.burningUpUses || 0) === 0 ? 1 : 2;
    p.burningUpUses = (p.burningUpUses || 0) + 1;
    gameState.rerollsLeft += 1;
    p.arousal = Math.min(5, p.arousal + rise);
    log(`${p.name} used Burning Up: +1 reroll, 🔥 +${rise}.`);
    queueCardTrigger(pid, 54, `+1 reroll, 🔥 +${rise}`);
    syncToFirebase(); updateUI();
    return true;
}
// 56 Deeper Bargains: one die becomes 3 x chosen face + 3 blanks
function applyDeeperBargains(pid, face) {
    const p = playerById(pid);
    p.specialFace = face;
    log(`${p.name}'s Deeper Bargains: one die now shows ${face} on three faces and blank on three.`);
    queueCardTrigger(pid, 56, `Special die: ${face}`);
    syncToFirebase(); updateUI();
}
function chooseDeeperBargains(pid) {
    if (!isHumanActor(pid)) { applyDeeperBargains(pid, cpuChooseSpecialFace()); return; }
    showChoiceDialog({ key: "deeperbargains", title: "Deeper Bargains", message: "Choose the face for your special die (three copies of it, three blanks):",
        options: FACES.map(f => ({ label: f, onClick: () => applyDeeperBargains(pid, f) })) });
}
// 58 Submissive Break: discard one Keep card belonging to either player; its owner gains 2 ⚡
function submissiveBreakTargets() {
    const out = [];
    [1, 2].forEach(owner => playerById(owner).inventory.forEach(c => { if (c && c.type === "Keep") out.push({ owner, card: c }); }));
    return out;
}
function applySubmissiveBreak(ownerId, cardId) {
    const owner = playerById(ownerId);
    const idx = owner.inventory.findIndex(c => c && c.id === cardId);
    if (idx < 0) return;
    const removed = owner.inventory.splice(idx, 1)[0];
    discardCard(removed);
    owner.energy += 2;
    log(`Submissive Break discarded ${owner.name}'s ${removed.name}. ${owner.name} gains 2 ⚡.`);
    syncToFirebase(); updateUI();
}
function resolveSubmissiveBreak(pid) {
    const targets = submissiveBreakTargets();
    if (!targets.length) { log("Submissive Break found no Keep card to discard."); return; }
    if (!isHumanActor(pid)) { const t = cpuChooseBreakTarget(targets, pid); if (t) applySubmissiveBreak(t.owner, t.card.id); return; }
    showChoiceDialog({ key: "submissivebreak", title: "Submissive Break", message: "Discard which Keep card? Its owner gains 2 ⚡.",
        options: targets.map(t => ({ label: `${playerById(t.owner).name}: ${t.card.name}`, onClick: () => applySubmissiveBreak(t.owner, t.card.id) })).concat([{ label: "Cancel", secondary: true }]) });
}

function executeInstant(card, playerId) {
    let p = playerId === 1 ? gameState.p1 : gameState.p2;
    let opp = playerId === 1 ? gameState.p2 : gameState.p1;
    let oppId = playerId === 1 ? 2 : 1;

    if (card.id === 1) { gameState.extraTurn = true; log(`${p.name} plays Sudden Flash! Taking an extra turn!`); }
    else if (card.id === 4) { applyTransform(oppId, 1, playerId); p.trance = 0; log(`Whispered Command! Opponent Transform +1, Trance reduced to 0.`); }
    else if (card.id === 6) {
        if (opp.shieldActive) log(`Velvet Voice blocked by ${opp.name}'s Rapid Pulse.`);
        else {
            increaseArousal(opp, 2, oppId, playerId);
            log(`Velvet Voice! Opponent Arousal +2.`);
        }
    }
    else if (card.id === 8) {
        increaseTrance(opp, 2, playerId);
        pushSubmission(playerId === 1 ? 2 : -2, playerId);
        log(`Mind Fog! Opponent Trance +2, Sub pushed 2.`);
    }
    else if (card.id === 10 || card.id === 39) {
        pushSubmission(playerId === 1 ? 4 : -4, playerId);
        log(`${p.name} used ${card.name}: ${opp.name}'s submission deepens +4 ⛓️.`);
        showTurnAlert(`${p.name} used ${card.name}: ${opp.name}'s submission deepens +4 ⛓️.`, playerId);
    }
    else if (card.id === 11) { pushSubmission(playerId === 1 ? 2 : -2, playerId); log(`Sluggish Mind! Sub pushed 2.`); }
    else if (card.id === 14) { increaseTrance(opp, 2, playerId); log(`Spiral Descent! Opponent 🌀 +2.`); }
    else if (card.id === 18) {
        pushSubmission(playerId === 1 ? 2 : -2, playerId);
        increaseTrance(opp, 1, playerId);
        log("Pulsing Light! Sub +2, Trance +1.");
    }
    else if (card.id === 19) { p.energy += 9; log("Primal Surge! +9 Energy."); }
    else if (card.id === 25) { pushSubmission(playerId === 1 ? -2 : 2, playerId); applyTransform(oppId, 1, playerId); log("Pendulum Swing! Deepen own sub by 2, Transform opponent 1."); }
    else if (card.id === 30) { pushSubmission(playerId === 1 ? -4 : 4, playerId); applyTransform(oppId, 2, playerId); log("Shattered Ego! Deepen own sub by 4, Transform opponent 2."); }
    else if (card.id === 37) {
        p.trance = 0;
        let drain = Math.floor(opp.energy / 2);
        opp.energy = Math.max(0, opp.energy - drain);
        log(`Swinging Pendulum! Own Trance to 0, drained ${drain} Energy from opponent.`);
    }
    else if (card.id === 40) { applyTransform(1, 1, 0); applyTransform(2, 1, 0); log("Global Change! Both players transform +1."); }
    else if (card.id === 44) {
        if (p.transform === 0) log("Flow Reversal blocked (Transformation is already 0).");
        else {
            p.transform = Math.max(0, p.transform - 1);
            log("Flow Reversal! Own Transform reduced by 1.");
        }
    }
    else if (card.id === 51) {
		if (p.transform <= 0) log("Transitive Energy blocked (no Transform to transfer).");
		else {
			p.transform -= 1;
			applyTransform(oppId, 1, playerId);
			log(`Transitive Energy: 1 Transform moved from ${p.name} to ${opp.name}.`);
			checkWinCondition();
		}
	}
    else if (card.id === 52) {
        const end = playerId === 1 ? 5 : -5;
        const onOppSide = playerId === 1 ? gameState.submission > 0 : gameState.submission < 0;
        if (!onOppSide) log("You Will Obey fizzled (submission is not on the opponent's side).");
        else if (gameState.submission === end) log("You Will Obey fizzled (submission is already at the end).");
        else {
            gameState.submission = end;
            log(`You Will Obey! Submission moved to ${end}.`);
        }
    }
    else if (card.id === 53) {
        const onOwnSide = playerId === 1 ? gameState.submission < 0 : gameState.submission > 0;
        if (!onOwnSide) log("I Will Not Obey fizzled (submission is not on your side).");
        else {
            gameState.submission = 0;
            log("I Will Not Obey! Submission returned to neutral.");
        }
    }
    else if (card.id === 60) {
        const oldTrance = p.trance, oldArousal = p.arousal;
        p.trance = opp.trance; p.arousal = opp.arousal;
        opp.trance = oldTrance; opp.arousal = oldArousal;
        log(`Mirror Trance! 🌀 and 🔥 levels were swapped between ${p.name} and ${opp.name}.`);
    }
    else if (card.id === 61) {
        p.trance = 0; p.arousal = 0; p.energy = 0; gameState.submission = 0;
        log(`Blank! ${p.name}'s 🌀, 🔥, and ⚡ are now 0; ⛓️ returned to neutral. 👁️ is unchanged.`);
    }

    syncToFirebase();
    updateUI();
}

// deprecated -- should never be called now
async function rollVirtualDice(playerId, count, sourceName) {
    let results = [];
    let counts = { "🌀 SPIRAL": 0, "💧 LUCIDITY": 0, "⚡ ENERGY": 0, "⛓️ SUBMISSION": 0, "🔥 AROUSAL": 0, "👁️ TRANSFORM": 0 };

    // Virtual dice are an independent roll.
    // Their individual effects resolve normally, but they do NOT
    // merge with the main roll for combination/set calculations.
    for (let i = 0; i < count; i++) {
        let face = FACES[Math.floor(Math.random() * FACES.length)];
        results.push(face);
        counts[face]++;
    }

    if (isLocalPlayerTurn()) {
        showPopup(`${sourceName} Results`, results.join("<br><br>"));
    }

    log(`${sourceName} rolled: ${results.map(r => r.split(" ")[0]).join(", ")}`);

    let p = playerId === 1 ? gameState.p1 : gameState.p2;
    let opp = playerId === 1 ? gameState.p2 : gameState.p1;
    let oppId = playerId === 1 ? 2 : 1;

    // ------------------------------------------------------------
    // ENERGY
    // Each virtual Energy die grants Energy normally.
    // Power Boost applies because these are still dice.
    // ------------------------------------------------------------
    if (counts["⚡ ENERGY"] > 0) {
        let gain = counts["⚡ ENERGY"];
        if (hasCard(playerId, 45)) { gain += 1; queueCardTrigger(playerId, 45, "+1 extra Energy from dice"); log("Power Boost granted +1 extra Energy from virtual dice!"); }
        p.energy += gain; log(`${p.name} gains +${gain} ⚡ from virtual dice.`);
    }

    // ------------------------------------------------------------
    // SPIRAL
    // Each virtual Spiral deepens opponent Trance.
    // Deep Gaze applies normally.
    // ------------------------------------------------------------
    if (counts["🌀 SPIRAL"] > 0) {
		let tPush = counts["🌀 SPIRAL"];
		if (!opp.shieldActive && hasCard(playerId, 0)) {
			tPush += 1;
			log("Deep Gaze deepened virtual Spiral Trance by 1 more!");
		}
		if (increaseTrance(opp, tPush, playerId)) log(`${opp.name}'s trance deepens +${tPush} 🌀 from virtual dice.`);
	}

    // ------------------------------------------------------------
    // LUCIDITY
    // Virtual Lucidity resolves exactly like normal Lucidity.
    // Deep Safeties applies.
    // ------------------------------------------------------------
    let lCount = counts["💧 LUCIDITY"];
    if (hasCard(playerId, 9) && lCount > 0) { lCount += 1; log("Deep Safeties boosted virtual Lucidity!"); }

    if (lCount > 0) {
        const arousalCost = hasCard(oppId, 48) ? 2 : 1;
        if (arousalCost > 1 && activeP.arousal > 0) cardResolvedThisTurn.add(`${oppId}:48`);
        const canClearAll = lCount >= lucidityClearCost(p, arousalCost);
        if (p.trance === 0 && p.arousal === 0 && p.vulnerability === 0) {
            log(`Lucidity rolled, but ${p.name} is clear-headed.`);
        } else if (canClearAll || lucidityActiveStatCount(p) === 1) {
            const allocations = autoAllocateLucidity(lCount, p, arousalCost);
            const lucidityParts = lucidityResultParts(p, allocations, hasCard(oppId, 41));
            log(lucidityParts.length ? `${p.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${p.name} is clear-headed.`);
        } else if (isLocalPlayerTurn()) {
            const showVuln = hasCard(oppId, 41);
            const allocations = await showLucidityDialog(lCount, p, showVuln, arousalCost);
            if (allocations.trance > 0) p.trance = Math.max(0, p.trance - allocations.trance);
            if (allocations.arousal > 0) p.arousal = Math.max(0, p.arousal - allocations.arousal);
            if (allocations.vuln > 0) p.vulnerability = Math.max(0, p.vulnerability - allocations.vuln);
            const lucidityParts = lucidityResultParts(p, allocations, hasCard(oppId, 41));
            log(lucidityParts.length ? `${p.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${p.name} is clear-headed.`);
        } else {
            const allocations = autoAllocateLucidity(lCount, p, arousalCost);
            const lucidityParts = lucidityResultParts(p, allocations, hasCard(oppId, 41));
            log(lucidityParts.length ? `${p.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${p.name} is clear-headed.`);
        }
    }

    // ------------------------------------------------------------
    // AROUSAL
    // Virtual Arousal contributes exactly as normal Arousal dice.
    // Stoking Fires applies.
    // Guided Heat is automatically handled by increaseArousal().
    // ------------------------------------------------------------
    //let arousalEffect = Math.floor(counts["🔥 AROUSAL"] / 2);
	let arousalEffect = counts.AROUSAL >= 2 ? counts.AROUSAL - 1 : 0;
    if (hasCard(playerId, 13) && counts["🔥 AROUSAL"] >= 2) { arousalEffect += 1; queueCardTrigger(playerId, 13, "Boosted virtual Arousal effect by 1"); log("Stoking Fires boosted virtual Arousal!"); }

    if (arousalEffect > 0) {
        if (opp.shieldActive) log("Rapid Pulse shielded virtual Arousal!");
        else { increaseArousal(opp, arousalEffect, oppId, playerId); log(`${opp.name}'s arousal increases +${arousalEffect} 🔥 from virtual dice.`); }
    }

    // ------------------------------------------------------------
    // SUBMISSION
    // Virtual Submission dice are individual effects.
    // They do NOT combine with Submission dice from the main roll.
    //
    // This deliberately does NOT require 3 virtual Submission dice
    // to create a 3-of-a-kind combination.
    // ------------------------------------------------------------
    if (counts["⛓️ SUBMISSION"] > 0) {
        let submissionPush = playerId === 1 ? counts["⛓️ SUBMISSION"] : -counts["⛓️ SUBMISSION"];
        pushSubmission(submissionPush, playerId);
        log(`${opp.name}'s submission deepens +${Math.abs(submissionPush)} ⛓️ from virtual dice.`);
    }

    // ------------------------------------------------------------
    // TRANSFORM
    // Virtual Transform dice apply their individual Transform effect.
    // They do NOT combine with Transform dice from the main roll.
    // ------------------------------------------------------------
    if (counts["👁️ TRANSFORM"] > 0) {
        applyTransform(oppId, counts["👁️ TRANSFORM"], playerId);
        log(`${gameState[playerId === 1 ? "p2" : "p1"].name} transforms +${counts["👁️ TRANSFORM"]} 👁️ from virtual dice.`);
    }

    syncToFirebase();
    updateUI();
}

function rollFaceForDie(playerId, dieIndex) {
    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const special = (p.inventory || []).find(c => Number(c.id) === 56 && c.chosenFace);
    // Deeper Bargains replaces die slot 0 with a 3-in-6 chosen face / 3-in-6 blank die.
    if (special && dieIndex === 0) {
        return Math.random() < 0.5 ? special.chosenFace : "⬜ BLANK";
    }
    return FACES[Math.floor(Math.random() * FACES.length)];
}

function startTurn() {
    if (gameState.activePlayer === 1) log(`=== ROUND ${gameState.round} ===`, true);
    
    // Altered State needs the opponent reference when it triggers at turn start.
    // Without this, owning card 15 throws a ReferenceError before the dice UI resets.
    let oppP = gameState.activePlayer === 1 ? gameState.p2 : gameState.p1;

    gameState.p1.boughtCardThisTurn = false; gameState.p2.boughtCardThisTurn = false; gameState.freeBuyActive = false; gameState.vulnGrantedThisTurn = false;
    let activeP = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
    activeP.shieldActive = false; activeP.simmeringUsed = false;
    activeP.burningUpUsed = false; activeP.burningUpPending = 0; activeP.burningUpUses = 0;
    activeP.lastRoll = [];
    cardResolvedThisTurn = new Set();

    if (hasCard(gameState.activePlayer, 55)) {
        activeP.energy += 2;
        queueCardTrigger(gameState.activePlayer, 55, "Gained 2 ⚡ at the start of the turn");
        log(`${activeP.name}'s Transformation Ritual grants +2 ⚡.`);
    }
    if (hasCard(gameState.activePlayer, 57)) {
        const beforeTrance = activeP.trance;
        activeP.trance = Math.max(0, activeP.trance - 1);
        queueCardTrigger(gameState.activePlayer, 57, `Reduced own 🌀 by ${beforeTrance - activeP.trance}`);
        log(`${activeP.name}'s Mental Fortitude reduces 🌀 by ${beforeTrance - activeP.trance}.`);
    }
    // These effects have already been applied by the time Submissive Break could target them.
    if (hasCard(gameState.activePlayer, 7)) cardResolvedThisTurn.add(`${gameState.activePlayer}:7`);
    if (hasCard(gameState.activePlayer, 15)) cardResolvedThisTurn.add(`${gameState.activePlayer}:15`);
    if (hasCard(gameState.activePlayer, 43)) cardResolvedThisTurn.add(`${gameState.activePlayer}:43`);
    if (hasCard(gameState.activePlayer, 55)) cardResolvedThisTurn.add(`${gameState.activePlayer}:55`);
    if (hasCard(gameState.activePlayer, 57)) cardResolvedThisTurn.add(`${gameState.activePlayer}:57`);
    
    if (activeP.arousal <= 2) gameState.rerollsLeft = 2; else if (activeP.arousal <= 4) gameState.rerollsLeft = 1; else gameState.rerollsLeft = 0;
    const mentalAwakeningActive = hasCard(gameState.activePlayer, 43);
    if (mentalAwakeningActive) gameState.rerollsLeft += 1;

    gameState.phase = "rolling";
	const activePObj = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
	const anchorBonus = (activePObj.inventory || []).filter(c => c && c.id === 7).length;
	let diceCount = 6 + anchorBonus;
    if (activeP.vulnerability > 0) {
        diceCount = Math.max(3, diceCount - activeP.vulnerability);
		if (diceCount < 3) diceCount = 3;
        log(`Vulnerability restricts ${activeP.name} to ${diceCount} dice.`);
    }
    if (gameState.somnambulismTurn) {
		const penalty = Math.max(1, Number(gameState.somnambulismPenalty) || 1);
		diceCount = Math.max(3, diceCount - penalty);
		gameState.somnambulismTurn = false;
	}
	else {
		gameState.somnambulismPenalty = 0;
	}
	
	console.log("LONG TRACE startTurn:", {
	seed: window.__longTraceSeed,
    turn: window.__longTraceTurn,
    active: gameState.activePlayer,
    vulnerability: activeP.vulnerability,
    anchorBonus,
    somnambulism: gameState.somnambulismTurn,
    diceCount,
    inventory: activeP.inventory.map(c => c.id)
});
    
    gameState.dice = Array(diceCount).fill({ face: "-", kept: false });
    log(`--- ${activeP.name}'s Turn ---`);
    // Show the CPU's turn as soon as it starts. When the human turn is merely prepared
    // after the CPU finishes, keep the CPU Chronicle card selected until the human rolls.
    const startedTurnGroups = getTurnHistoryGroups();
    if (gameState.activePlayer === 2 && startedTurnGroups.length) {
        selectedHistoryIndex = startedTurnGroups.length - 1;
    }
    renderTurnHistory();
    if (mentalAwakeningActive) log(`${activeP.name} has Mental Awakening: +1 reroll.`);
    
    if (hasCard(gameState.activePlayer, 15)) {
        pushSubmission(gameState.activePlayer === 1 ? 1 : -1, gameState.activePlayer);
        const alteredStateMessage = `${activeP.name}'s Altered State deepened ${oppP.name}'s submission by 1.`;
        log(alteredStateMessage);
        showTurnAlert(alteredStateMessage, gameState.activePlayer);
    }

    clearLastEffectTicker();
    syncToFirebase();
    updateUI();
    playSound(gameState.activePlayer === 1 ? "turn1" : "turn2");
    if (gameState.activePlayer === 2 && gameState.gameMode === "solo") setTimeout(executeCPUTurn, 1000);
}

function rollDiceAction() {
    // A new roll selects this player's turn card; otherwise browsing stays where the player left it.
    const historyGroupsAtRoll = getTurnHistoryGroups();
    if (historyGroupsAtRoll.length) selectedHistoryIndex = historyGroupsAtRoll.length - 1;
    const triggerToast = document.getElementById("card-trigger-toast");
    if (triggerToast) { triggerToast.classList.remove("visible"); triggerToast.innerHTML = ""; }
    if (cardTriggerToastTimer) { clearTimeout(cardTriggerToastTimer); cardTriggerToastTimer = null; }
    if (typeof cardTriggerFlushTimer !== "undefined" && cardTriggerFlushTimer) { clearTimeout(cardTriggerFlushTimer); cardTriggerFlushTimer = null; }
    if (typeof pendingCardTriggerNotices !== "undefined") pendingCardTriggerNotices = [];
    let isInitRoll = gameState.dice[0].face === "-";
    if (!isInitRoll && gameState.rerollsLeft <= 0) return;
    const roller = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
    const animatedIndices = [];
    gameState.dice.forEach((die, index) => { if (!die.kept) animatedIndices.push(index); });
    gameState.dice = gameState.dice.map((d, index) => d.kept ? d : { face: rollFaceForDie(gameState.activePlayer, index), kept: false });
    if (!isInitRoll) {
        gameState.rerollsLeft--;
        if (roller.burningUpPending > 0) {
            const arousalIncrease = roller.burningUpPending === 2 ? 1 : 2;
            roller.burningUpPending--;
            increaseArousal(roller, arousalIncrease, gameState.activePlayer, 0);
            queueCardTrigger(gameState.activePlayer, 54, `Gained a reroll; 🔥 increased by ${arousalIncrease}`);
            log(`Burning Up: 🔥 increased by ${arousalIncrease} after the reroll.`);
        }
    }

    // Keep the real result in gameState, but show independently cycling faces
    // until the animation ends so players cannot read the result early.
    if (diceAnimationInterval !== null) {
        window.clearInterval(diceAnimationInterval);
        diceAnimationInterval = null;
    }
    const animationToken = ++diceAnimationToken;
    diceAnimating = new Set(animatedIndices);
    diceAnimationFaces = new Map(animatedIndices.map(index => [
        index,
        FACES[Math.floor(Math.random() * FACES.length)]
    ]));

    playSound("roll");
    syncToFirebase();
    updateUI();

    // Cycle only the displayed faces; never modify the actual dice results.
    diceAnimationInterval = window.setInterval(() => {
        if (animationToken !== diceAnimationToken) return;
        const diceContainer = document.getElementById("dice-container");
        animatedIndices.forEach(index => {
            const face = FACES[Math.floor(Math.random() * FACES.length)];
            diceAnimationFaces.set(index, face);
            const dieElement = diceContainer && diceContainer.children[index];
            if (!dieElement) return;
            dieElement.innerText = localShowDiceText ? face : face.split(" ")[0];
        });
    }, 75);

    // Visual-only animation: the real roll is already determined and synchronized.
    window.setTimeout(() => {
        if (animationToken !== diceAnimationToken) return;
        if (diceAnimationInterval !== null) {
            window.clearInterval(diceAnimationInterval);
            diceAnimationInterval = null;
        }
        diceAnimationFaces.clear();
        diceAnimating.clear();
        // Reveal the actual results only when the dice have finished settling.
        if (gameState && !gameState.gameEnded) updateUI();
    }, 850);
}

// LUCIDITY MODAL LOGIC
function autoAllocateLucidity(points, playerObj, arousalCost = 1) {
    let rem = Math.max(0, Number(points) || 0);
    const allocation = { trance: 0, arousal: 0, vuln: 0 };
    allocation.vuln = Math.min(playerObj.vulnerability || 0, rem); playerObj.vulnerability -= allocation.vuln; rem -= allocation.vuln;
    const cost = Math.max(1, Number(arousalCost) || 1);
    allocation.arousal = Math.min(playerObj.arousal || 0, Math.floor(rem / cost)); playerObj.arousal -= allocation.arousal; rem -= allocation.arousal * cost;
    allocation.trance = Math.min(playerObj.trance || 0, rem); playerObj.trance -= allocation.trance;
    return allocation;
}
function lucidityActiveStatCount(playerObj) {
    let n = 0;
    if ((Number(playerObj.trance) || 0) > 0) n++;
    if ((Number(playerObj.arousal) || 0) > 0) n++;
    if ((Number(playerObj.vulnerability) || 0) > 0) n++;
    return n;
}
function lucidityClearCost(playerObj, arousalCost = 1) {
    return (Number(playerObj.vulnerability) || 0) + (Number(playerObj.arousal) || 0) * Math.max(1, Number(arousalCost) || 1) + (Number(playerObj.trance) || 0);
}
function lucidityResultParts(playerObj, allocation, opponentHasPowerfulTransform) {
    const parts = [];
    if (allocation.trance > 0) parts.push(`-${allocation.trance} 🌀`);
    if (allocation.arousal > 0) parts.push(`-${allocation.arousal} 🔥`);
    if (opponentHasPowerfulTransform && allocation.vuln > 0) parts.push(`-${allocation.vuln} 🪫`);
    return parts;
}
function showLucidityDialog(points, playerObj, showVuln, arousalCost = 1) {
    return new Promise((resolve) => {
        lucidityResolve = resolve;
        lucidityState.total = points;
        lucidityState.available = points;
        lucidityState.arousalCost = arousalCost > 1 ? arousalCost : 1;
        lucidityState.allocations = { trance: 0, arousal: 0, vuln: 0 };
        lucidityState.maxes = { trance: playerObj.trance, arousal: playerObj.arousal, vuln: playerObj.vulnerability };

        document.getElementById("lucidity-max-trance").innerText = playerObj.trance;
        document.getElementById("lucidity-max-arousal").innerText = playerObj.arousal;
        document.getElementById("lucidity-max-vuln").innerText = playerObj.vulnerability;
        document.getElementById("lucidity-row-vuln").style.display = showVuln || playerObj.vulnerability > 0 ? "flex" : "none";

        const arousalLabel = document.querySelector("#lucidity-row-arousal > span");
        if (arousalLabel) {
            arousalLabel.innerHTML = lucidityState.arousalCost > 1
                ? `Arousal (costs ${lucidityState.arousalCost} 💧 each, max <span id="lucidity-max-arousal">${playerObj.arousal}</span>)`
                : `Arousal (Max: <span id="lucidity-max-arousal">${playerObj.arousal}</span>)`;
        }

        updateLucidityDialogUI();
        document.getElementById("lucidity-modal").style.display = "flex";
    });
}

function adjLucidity(type, delta) {
    let current = lucidityState.allocations[type];
    let max = lucidityState.maxes[type];
    const cost = type === "arousal" ? (lucidityState.arousalCost || 1) : 1;

    if (delta > 0 && lucidityState.available >= cost && current < max) {
        lucidityState.allocations[type]++;
        lucidityState.available -= cost;
    } else if (delta < 0 && current > 0) {
        lucidityState.allocations[type]--;
        lucidityState.available += cost;
    }
    updateLucidityDialogUI();
}

function updateLucidityDialogUI() {
    document.getElementById("lucidity-points-left").innerText = lucidityState.available;
    document.getElementById("lucidity-val-trance").innerText = lucidityState.allocations.trance;
    document.getElementById("lucidity-val-arousal").innerText = lucidityState.allocations.arousal;
    document.getElementById("lucidity-val-vuln").innerText = lucidityState.allocations.vuln;

    // Points can still be distributed if any stat has room and we can afford its cost
    const canDistribute = lucidityState.available > 0 && ["trance", "arousal", "vuln"].some(type => {
        const cost = type === "arousal" ? (lucidityState.arousalCost || 1) : 1;
        return lucidityState.allocations[type] < lucidityState.maxes[type] && lucidityState.available >= cost;
    });
    document.getElementById("lucidity-points-left").style.color = canDistribute ? "#ff4d4d" : "var(--player)";
    document.getElementById("lucidity-confirm-btn").disabled = canDistribute;
}

function confirmLucidity() { if (document.getElementById("lucidity-confirm-btn").disabled) return; document.getElementById("lucidity-modal").style.display = "none"; if (lucidityResolve) lucidityResolve(lucidityState.allocations); }

async function resolveDice() {
    // In online mode, only the active local player executes dice resolution
    if (gameState.gameMode === "online" && !isLocalPlayerTurn()) return;
    playSound("resolve");
    triggerHaptic("resolve");

    gameState.phase = "shop";
    
    const activePlayerNum = Number(gameState.activePlayer);
    let oppId = activePlayerNum === 1 ? 2 : 1;
    let isHumanTurn = isLocalPlayerTurn();

    // Bind initial live player references
    let activeP = activePlayerNum === 1 ? gameState.p1 : gameState.p2;
    let oppP = activePlayerNum === 1 ? gameState.p2 : gameState.p1;

    // Baseline property guards
    activeP.trance = activeP.trance || 0;
    activeP.arousal = activeP.arousal || 0;
    activeP.vulnerability = activeP.vulnerability || 0;
    activeP.energy = activeP.energy || 0;

    if (hasCard(activePlayerNum, 55)) {
        // “Kept” means the dice remaining at the end of the roll sequence, not only dice locked against rerolls.
        const finalRollHasTransform = gameState.dice.some(d => d && d.face === "👁️ TRANSFORM");
        if (!finalRollHasTransform) {
            const lost = Math.min(3, activeP.energy);
            activeP.energy = Math.max(0, activeP.energy - 3);
            queueCardTrigger(activePlayerNum, 55, `Lost ${lost} ⚡ because no 👁️ die remained in the final roll`);
            log(`Transformation Ritual: no 👁️ die remained in the final dice; lost ${lost} ⚡.`);
        } else {
            queueCardTrigger(activePlayerNum, 55, "An 👁️ die remained in the final dice; avoided the Energy penalty");
            log("Transformation Ritual: an 👁️ die remained in the final dice; no Energy penalty.");
        }
    }
    oppP.trance = oppP.trance || 0;
    oppP.arousal = oppP.arousal || 0;

    // Deeper Bargains' special die has already been used by the time the shop opens.
    if (hasCard(activePlayerNum, 56)) cardResolvedThisTurn.add(`${activePlayerNum}:56`);

    // Save BOTH lastRoll and lastKeep
    const currentDiceFaces = gameState.dice.map(d => d.face);
    activeP.lastRoll = [...currentDiceFaces];
    activeP.lastKeep = [...currentDiceFaces];
    log(`Dice Roll: ${currentDiceFaces.map(face => String(face || "-").split(" ")[0]).join(", ")}`);

    // Count dice faces
    let counts = { SPIRAL: 0, LUCIDITY: 0, ENERGY: 0, SUBMISSION: 0, AROUSAL: 0, TRANSFORM: 0 };
    gameState.dice.forEach(d => { 
        if (!d || d.face === "-") return;
        let f = String(d.face).toUpperCase();
        if (f.includes("SPIRAL") || f.includes("TRANCE")) counts.SPIRAL++;
        else if (f.includes("LUCIDITY")) counts.LUCIDITY++;
        else if (f.includes("ENERGY")) counts.ENERGY++;
        else if (f.includes("SUBMISSION")) counts.SUBMISSION++;
        else if (f.includes("AROUSAL")) counts.AROUSAL++;
        else if (f.includes("TRANSFORM")) counts.TRANSFORM++;
    });

    if (challengeActive && activePlayerNum === 2 && Math.max(...Object.values(counts)) >= 4) showChallengeTaunt("BigRollAI");

    // 1. Energy
    if (counts.ENERGY > 0) { 
        let gain = counts.ENERGY;
        if (hasCard(activePlayerNum, 45)) { gain += 1; queueCardTrigger(activePlayerNum, 45, "+1 extra Energy from dice"); log("Power Boost granted +1 extra Energy!"); }
        activeP.energy += gain; 
        log(`+${gain} Energy.`); 
    }
    
    // 2. Spirals (Pushes Trance to Opponent)
    if (counts.SPIRAL > 0) {
		let tPush = counts.SPIRAL;
		if (!oppP.shieldActive && hasCard(activePlayerNum, 0)) {
			tPush += 1;
			queueCardTrigger(activePlayerNum, 0, "trance +1");
			log("Deep Gaze deepened Trance by 1 more!");
		}
		if (increaseTrance(oppP, tPush, activePlayerNum)) log(`${oppP.name}'s trance deepens +${tPush} 🌀.`);
	}

    // 3. Lucidity
    let lCount = counts.LUCIDITY;
    if (hasCard(activePlayerNum, 9) && lCount > 0) { cardResolvedThisTurn.add(`${activePlayerNum}:9`); lCount += 1; log(`Deep Safeties boosted Lucidity!`); }
    if (lCount > 0) {
        const arousalCost = hasCard(oppId, 48) ? 2 : 1;
        if (arousalCost > 1 && activeP.arousal > 0) cardResolvedThisTurn.add(`${oppId}:48`);
        const canClearAll = lCount >= lucidityClearCost(activeP, arousalCost);
        if (activeP.trance === 0 && activeP.arousal === 0 && activeP.vulnerability === 0) {
            log(`Lucidity rolled, but ${activeP.name} is clear-headed.`);
        } else if (canClearAll || lucidityActiveStatCount(activeP) === 1) {
            const allocations = autoAllocateLucidity(lCount, activeP, arousalCost);
            const lucidityParts = lucidityResultParts(activeP, allocations, hasCard(oppId, 41));
            log(lucidityParts.length ? `${activeP.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${activeP.name} is clear-headed.`);
        } else if (isHumanTurn) {
            const showVuln = hasCard(oppId, 41);
            const allocations = await showLucidityDialog(lCount, activeP, showVuln, arousalCost);
            activeP = activePlayerNum === 1 ? gameState.p1 : gameState.p2;
            oppP = activePlayerNum === 1 ? gameState.p2 : gameState.p1;
            if (allocations) {
                const tSub = Number(allocations.trance || 0);
                const aSub = Number(allocations.arousal || 0);
                const vSub = Number(allocations.vuln || 0);
                if (tSub > 0) activeP.trance = Math.max(0, activeP.trance - tSub);
                if (aSub > 0) activeP.arousal = Math.max(0, activeP.arousal - aSub);
                if (vSub > 0) activeP.vulnerability = Math.max(0, activeP.vulnerability - vSub);
                const allocationsUsed = { trance: tSub, arousal: aSub, vuln: vSub };
                const lucidityParts = lucidityResultParts(activeP, allocationsUsed, hasCard(oppId, 41));
                log(lucidityParts.length ? `${activeP.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${activeP.name} is clear-headed.`);
            }
        } else {
            const allocations = autoAllocateLucidity(lCount, activeP, arousalCost);
            const lucidityParts = lucidityResultParts(activeP, allocations, hasCard(oppId, 41));
            log(lucidityParts.length ? `${activeP.name} used 💧: ${lucidityParts.join(", ")}.` : `Lucidity rolled, but ${activeP.name} is clear-headed.`);
        }
    }

    // 4. Arousal
    //let arousalEffect = Math.floor(counts.AROUSAL / 2);
	let arousalEffect = counts.AROUSAL >= 2 ? counts.AROUSAL - 1 : 0;
    if (hasCard(activePlayerNum, 13) && counts.AROUSAL >= 2) { arousalEffect += 1; queueCardTrigger(activePlayerNum, 13, "Boosted Arousal effect by 1"); log(`Stoking Fires boosted Arousal!`); }
    if (arousalEffect > 0) { 
        if (!oppP.shieldActive) { 
            if (typeof increaseArousal === "function") {
                increaseArousal(oppP, arousalEffect, oppId, activePlayerNum);
            } else {
                oppP.arousal = (oppP.arousal || 0) + arousalEffect;
            }
            log(`${oppP.name}'s arousal increases +${arousalEffect} 🔥.`); 
        } 
    }

    // 5. Submission
    if (counts.SUBMISSION >= 3) {
        let effect = 1 + (counts.SUBMISSION - 3); 
        pushSubmission(activePlayerNum === 1 ? effect : -effect, activePlayerNum); 
        log(`${oppP.name}'s submission deepens +${effect} ⛓️.`);
        if (hasCard(activePlayerNum, 23)) { 
            if (typeof increaseArousal === "function") increaseArousal(oppP, 1, oppId, activePlayerNum); 
            else oppP.arousal = (oppP.arousal || 0) + 1;
            queueCardTrigger(activePlayerNum, 23, "Opponent Arousal +1 on 3+ Submission");
            log(`${oppP.name}'s arousal increases +1 🔥 from Submissive Flush.`); 
        }
        if (hasCard(activePlayerNum, 24)) {
			gameState.somnambulismPenalty = (Number(gameState.somnambulismPenalty) || 0) + 1;
			gameState.somnambulismTurn = true; 
			const fewer = gameState.somnambulismPenalty;
			queueCardTrigger(activePlayerNum, 24, `Earned an extra turn with ${fewer} fewer di${fewer === 1 ? "e" : "ce"}`);
			log(`Somnambulism triggered: Taking an extra turn with ${fewer} fewer di${fewer === 1 ? "e" : "ce"}!`); }
    }

    // 6. Transform
    if (counts.TRANSFORM >= 3) {
        let effect = 1 + (counts.TRANSFORM - 3); 
        applyTransform(oppId, effect, activePlayerNum); 
        log(`${oppP.name} transforms +${effect} 👁️.`);
        if (hasCard(activePlayerNum, 2)) { applyTransform(oppId, 1, activePlayerNum); queueCardTrigger(activePlayerNum, 2, "Added 1 Transform damage"); log(`Dream State actively boosted Transform damage by 1!`); }
        if (hasCard(activePlayerNum, 22)) { pushSubmission(activePlayerNum === 1 ? 1 : -1, activePlayerNum); queueCardTrigger(activePlayerNum, 22, "Pushed Submission +1 on 3+ Transform"); log("Mental Shackles triggered: Sub pushed +1."); }
    }

    // 7. Trigger Word Check
    if (hasCard(activePlayerNum, 3) && counts.SUBMISSION > 0 && counts.TRANSFORM > 0 && counts.AROUSAL > 0 && counts.SPIRAL > 0 && counts.LUCIDITY > 0 && counts.ENERGY > 0) {
        applyTransform(oppId, 5, activePlayerNum); 
        queueCardTrigger(activePlayerNum, 3, "Combo bonus: opponent takes +5 Transform");
        log(`Trigger Word activated! Opponent takes +5 Transform!`);
    }

    // Final sync to push changes to Firebase and both screens
    syncToFirebase();
    updateUI();
}

function animateSubmissionOverflow(targetPlayerId, overflowAmount) {
    const prefix = targetPlayerId === 1 ? 'p1' : 'p2';
    const targets = [document.getElementById(`${prefix}-image`), document.getElementById(`${prefix}-transform-progress-wrap`), document.getElementById(`${prefix}-transform-progress-track`)];
    // Progress wrapper currently has no id in older markup, so locate it through the progress track if needed.
    const progressTrack = document.getElementById(`${prefix}-transform-progress-track`);
    if (progressTrack && !targets.includes(progressTrack.parentElement)) targets.push(progressTrack.parentElement);
    targets.filter(Boolean).forEach(el => {
        el.classList.remove('transform-overflow-impact');
        void el.offsetWidth;
        el.classList.add('transform-overflow-impact');
        window.setTimeout(() => el.classList.remove('transform-overflow-impact'), 850);
    });
    const fill = document.getElementById(`${prefix}-transform-progress`);
    if (fill) {
        fill.style.filter = 'brightness(1.8)';
        window.setTimeout(() => { fill.style.filter = ''; }, 700);
    }
}

function pushSubmission(amount, sourcePlayer = null) {
    if (amount === 0) return;
    if (Math.abs(amount) === 1 && sourcePlayer !== null) {
        let oppId = sourcePlayer === 1 ? 2 : 1;
        if (hasCard(oppId, 35)) { queueCardTrigger(oppId, 35, "Blocked a 1-point Submission push", "reaction"); log("Mesmerizing Rhythm blocked exactly 1 point of push!"); return; }
    }
    
    // Card 36 Check: Only push further if pushing TOWARDS opponent
    if (sourcePlayer !== null && hasCard(sourcePlayer, 36)) {
        if ((sourcePlayer === 1 && amount > 0) || (sourcePlayer === 2 && amount < 0)) {
            amount += (sourcePlayer === 1 ? 1 : -1);
            const affectedPlayer = sourcePlayer === 1 ? gameState.p2 : gameState.p1;
            queueCardTrigger(sourcePlayer, 36, `Deepened ${affectedPlayer.name}'s submission by 1`);
            log(`Deeper Trance deepened ${affectedPlayer.name}'s submission by 1.`);
        }
    }

    let newSub = gameState.submission + amount;
    if (newSub > 5) {
        let overflow = newSub - 5; gameState.submission = 5;
        applyTransform(2, overflow, 0); animateSubmissionOverflow(2, overflow);
        const obeyMessage = `${gameState.p2.name} obeys and transforms ${overflow} 👁️.`;
        log(obeyMessage); showTurnAlert(obeyMessage, 2);
    }
    else if (newSub < -5) {
        let overflow = Math.abs(newSub - (-5)); gameState.submission = -5;
        applyTransform(1, overflow, 0); animateSubmissionOverflow(1, overflow);
        const obeyMessage = `${gameState.p1.name} obeys and transforms ${overflow} 👁️.`;
        log(obeyMessage); showTurnAlert(obeyMessage, 1);
    }
    else gameState.submission = newSub;
}

function generateDeck() {
    deck = [...KNOWN_CARDS].filter(card => !SUPPRESSED_CARD_IDS.includes(Number(card.id)));

    // Fresh game: nothing is in the discard pile yet.
    discardPile = [];

    // Fisher-Yates shuffle.
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function reshuffleDiscardIntoDeck() {
    if (deck.length > 0 || discardPile.length === 0) return false;
    deck = discardPile.splice(0);

    // Fisher-Yates shuffle the recycled cards.
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    log(`Discard pile reshuffled into a new draw deck (${deck.length} cards).`);
    return true;
}

function drawCardFromDeck() {
    // Whenever the draw deck is empty, recycle the discard pile.
    reshuffleDiscardIntoDeck();
    if (deck.length === 0) return null;
    return deck.pop();
}

function discardCard(card) {
    if (!card) return;

    // Store a copy so later changes to an inventory card cannot
    // accidentally modify the discarded version.
    discardPile.push(JSON.parse(JSON.stringify(card)));
}

function discardCards(cards) {
    if (!Array.isArray(cards)) return;
    cards.forEach(card => discardCard(card));
}

function refillMarket() {
    while (market.length < 3) {
        const card = drawCardFromDeck();

        if (!card) {
            // This can only happen if every remaining card is either
            // in the market or currently held by a player.
            break;
        }

        market.push(card);
    }
}

function wipeMarket() {
    let p = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;

    if (p.energy >= 2) {
        p.energy -= 2;

        // Wiped market cards are discarded and become recyclable.
        discardCards(market);
        market = [];
        refillMarket();
        syncToFirebase();
        updateUI();
        log(`Market Wiped. New cards: ${market.map(card => card && card.name).filter(Boolean).join(", ") || "none"}`);
    } else {
        playSound("deny");
    }
}

function getCardPurchaseCost(card, playerId = gameState.activePlayer) {
    if (!card) return Infinity;

    let p = playerId === 1 ? gameState.p1 : gameState.p2;
    let cost = card.cost;

    // Compliant Mind: all card purchases cost 1 less Energy.
    if (hasCard(playerId, 29)) cost = Math.max(0, cost - 1);
    if (hasCard(playerId, 28) && !p.boughtCardThisTurn) cost = Math.max(0, cost - 2);
    if (playerId === gameState.activePlayer && gameState.freeBuyActive) cost = 0;

    return cost;
}

function inventoryHasName(player, cardName) {
    if (!player || !cardName) return false;
    const inv = Array.isArray(player.inventory) ? player.inventory : Object.values(player.inventory || {});
    return inv.some(c => c && c.name === cardName);
}

function chooseDeeperBargainsFace(playerId) {
    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const card = (p.inventory || []).find(c => Number(c.id) === 56);
    if (!card) return;
    const faces = [
        { label: "🌀 Trance", value: "🌀 SPIRAL" },
        { label: "💧 Lucidity", value: "💧 LUCIDITY" },
        { label: "⚡ Energy", value: "⚡ ENERGY" },
        { label: "⛓️ Submission", value: "⛓️ SUBMISSION" },
        { label: "🔥 Arousal", value: "🔥 AROUSAL" },
        { label: "👁️ Transform", value: "👁️ TRANSFORM" }
    ];
    if (playerId === 2 && gameState.gameMode === "solo") {
        card.chosenFace = "👁️ TRANSFORM";
        log("CPU chose 👁️ Transform for Deeper Bargains.");
        return;
    }
    showChoiceDialog({
        key: `deeper-bargains-${playerId}`,
        title: "Deeper Bargains: Choose a Face",
        message: "Your special die has three copies of the chosen face and three blank faces.",
        options: faces.map(face => ({ label: face.label, onClick: () => {
            const liveCard = (p.inventory || []).find(c => Number(c.id) === 56);
            if (liveCard) liveCard.chosenFace = face.value;
            log(`${p.name} chose ${face.label} for Deeper Bargains.`);
            syncToFirebase(); updateUI();
        }}))
    });
}

function activateSubmissiveBreak(playerId) {
    const candidates = [];
    [1, 2].forEach(ownerId => {
        const owner = ownerId === 1 ? gameState.p1 : gameState.p2;
        (owner.inventory || []).forEach((card, index) => {
            if (!card || card.type !== "Keep" || Number(card.id) === 58) return;
            if (cardResolvedThisTurn.has(`${ownerId}:${Number(card.id)}`)) return;
            candidates.push({ ownerId, index, card, owner });
        });
    });
    if (!candidates.length) {
        log("Submissive Break found no eligible Keep card that has not resolved this turn.");
        return;
    }
    const removeCandidate = candidate => {
        const owner = candidate.ownerId === 1 ? gameState.p1 : gameState.p2;
        const index = owner.inventory.findIndex(c => c && Number(c.id) === Number(candidate.card.id));
        if (index < 0 || cardResolvedThisTurn.has(`${candidate.ownerId}:${Number(candidate.card.id)}`)) {
            log("Submissive Break: that card is no longer eligible.");
            return;
        }
        const [removed] = owner.inventory.splice(index, 1);
        owner.energy += 2;
        discardCard(removed);
        log(`Submissive Break discarded ${removed.name} from ${owner.name}; ${owner.name} gains 2 ⚡.`);
        syncToFirebase(); updateUI();
    };
    if (playerId === 2 && gameState.gameMode === "solo") {
        // CPU prioritizes removing the opponent's most expensive eligible Keep card.
        const target = candidates.filter(c => c.ownerId === 1).sort((a,b) => b.card.cost-a.card.cost)[0]
            || candidates.sort((a,b) => a.card.cost-b.card.cost)[0];
        removeCandidate(target);
        return;
    }
    showChoiceDialog({
        key: `submissive-break-${playerId}`,
        title: "Submissive Break",
        message: "Choose an active Keep card that has not resolved this turn. Its owner gains 2 ⚡.",
        options: candidates.map(c => ({
            label: `${c.owner.name}: ${c.card.name} (owner gains 2 ⚡)`,
            onClick: () => removeCandidate(c)
        }))
    });
}

function buyCard(index) {
    let card = market[index];
    if (!card) return false;

    let playerId = gameState.activePlayer;
    let p = playerId === 1 ? gameState.p1 : gameState.p2;

    if (inventoryHasName(p, card.name)) {
        playSound("deny");
        log(`${p.name} already has ${card.name}.`);
        return false;
    }

    let cost = getCardPurchaseCost(card, playerId);
    if (p.energy < cost) { playSound("deny"); return false; }
    if (hasCard(playerId, 29)) cardResolvedThisTurn.add(`${playerId}:29`);
    if (hasCard(playerId, 28) && !p.boughtCardThisTurn) cardResolvedThisTurn.add(`${playerId}:28`);

    p.energy -= cost;
    p.boughtCardThisTurn = true;

    if (gameState.freeBuyActive) {
        gameState.freeBuyActive = false;
    }

    log(`Bought card: ${card.name}`);
    playSound("card");

    if (hasCard(playerId, 46)) {
        pushSubmission(playerId === 1 ? 1 : -1, playerId);
        queueCardTrigger(playerId, 46, "Deepened Submission when a card was purchased");
        log("Bondage triggered! Sub deepened upon buying card.");
    }

    if (Number(card.id) === 58) {
        // Submissive Break is labelled Keep for the card pool, but resolves on purchase and is discarded.
        discardCard(card);
    } else if (card.type === "Keep") {
        p.inventory.push(JSON.parse(JSON.stringify(card)));
    } else {
        executeInstant(card, playerId);
        discardCard(card);
    }

    market.splice(index, 1);
    refillMarket();
    syncToFirebase();
    updateUI();
    if (Number(card.id) === 56) chooseDeeperBargainsFace(playerId);
    if (Number(card.id) === 58) activateSubmissiveBreak(playerId);
    return true;
}

function buyAction(type, pId) {
    let p = pId === 1 ? gameState.p1 : gameState.p2;
    let oppId = pId === 1 ? 2 : 1;
    if (type === 'arousal' && p.energy >= 3) { p.energy -= 3; p.arousal = Math.max(0, p.arousal - 1); }
    if (type === 'transform' && p.energy >= 5) { p.energy -= 5; applyTransform(oppId, 1, pId); }
    if (type === 'submission' && p.energy >= 6) { p.energy -= 6; pushSubmission(pId === 1 ? 2 : -2, pId); }
    log(`${p.name} bought Action: ${type}`); syncToFirebase(); updateUI();
}

function endTurn() {
    if (isChoicePending()) {
        if (gameState.activePlayer === 2 && gameState.gameMode === "solo") endTurnAfterChoice = true;   // CPU is done: end its turn as soon as you pick
        playSound("deny");
        nudgeChoiceDialog(); return;
    }
    endTurnAfterChoice = false;
    let activeP = gameState.activePlayer === 1 ? gameState.p1 : gameState.p2;
    let oppP = gameState.activePlayer === 1 ? gameState.p2 : gameState.p1;

    if (gameState.activePlayer === 1 && gameState.submission === -5) {
        applyTransform(1, 1, 0);
        log(`${gameState.p1.name} obeys and transforms 1 👁️.`);
        if (challengeActive) showChallengeTaunt("PlayerIsObedient");
        showTurnAlert(`${gameState.p1.name} obeys and transforms 1 👁️.`, 1);
    }

    if (gameState.activePlayer === 2 && gameState.submission === 5) {
        applyTransform(2, 1, 0);
        log(`${gameState.p2.name} obeys and transforms 1 👁️.`);
        if (challengeActive) showChallengeTaunt("AIIsObedient");
        showTurnAlert(`${gameState.p2.name} obeys and transforms 1 👁️.`, 2);
    }

    if (hasCard(gameState.activePlayer, 27) && activeP.energy === 0) {
        cardResolvedThisTurn.add(`${gameState.activePlayer}:27`);
        activeP.energy += 1;
        queueCardTrigger(gameState.activePlayer, 27, "Gained 1 Energy at end of turn");
        log("Endless Staircase granted 1 Energy.");
    }

    if (hasCard(gameState.activePlayer, 31)) {
        cardResolvedThisTurn.add(`${gameState.activePlayer}:31`);
		let tPush = Math.floor(activeP.energy / 6) * 2;
		if (tPush > 0) {
			log(`Falling Sensation: ${oppP.name}'s trance deepens +${tPush} 🌀.`);
			increaseTrance(oppP, tPush, gameState.activePlayer);
		}
	}

    // ------------------------------------------------------------
    // COGNITIVE OVERRIDE
    //
    // At the end of your turn, if the submission marker is already
    // on YOUR side of neutral, push it one additional point toward
    // the opponent's side.
    //
    // P1 side = submission < 0
    // P2 side = submission > 0
    //
    // If the marker is exactly at neutral (0), or on the opponent's
    // side, Cognitive Override does nothing.
    // ------------------------------------------------------------
    if (hasCard(gameState.activePlayer, 34)) {
        let onOwnSide =
            (gameState.activePlayer === 1 && gameState.submission < 0) ||
            (gameState.activePlayer === 2 && gameState.submission > 0);

        if (onOwnSide) {
            let direction = gameState.activePlayer === 1 ? 1 : -1;
            pushSubmission(direction, gameState.activePlayer);
            queueCardTrigger(gameState.activePlayer, 34, "Pushed Submission +1 at end of turn");
            log("Cognitive Override pushed Sub +1.");
        }
    }

    if (checkWinCondition()) return;

    if (gameState.extraTurn || gameState.somnambulismTurn) {
        gameState.extraTurn = false;
        log("Taking extra turn!");
        syncToFirebase();
        updateUI();
        startTurn();
		// Music: leave setup track and enter the board track (user has already clicked Start).
		playMusic("game");
        return;
    }

    if (gameState.activePlayer === 2) {
        gameState.round++;
    }

    gameState.activePlayer = gameState.activePlayer === 1 ? 2 : 1;

    syncToFirebase();
    updateUI();
    startTurn();
	// Music: leave setup track and enter the board track (user has already clicked Start).
	playMusic("game");
}

function executeCPUTurn() {
    if (gameState.gameMode !== "solo") return;

    if (cpuIsAdaptive() || getCpuDifficulty() === "transformer") cpuBrainBeginTurn();
    cpuBrain.rerollsUsed = 0;
    if (cpuIsTier()) {                               // decide this turn's mistakes once, so behaviour doesn't flicker
        const sl = CPU_TIERS[getCpuDifficulty()].slip || {};
        cpuBrain.noise = {};
        cpuBrain.troubleBlind = Math.random() < (sl.trouble || 0);
        cpuBrain.denyBlind = Math.random() < (sl.deny || 0);
    }
    rollDiceAction();
    updateUI();

    let idx12 = gameState.p2.inventory.findIndex(c => c.id === 12);

    if (
        idx12 !== -1 &&
        gameState.p2.energy >= 2 &&
        !gameState.p2.shieldActive &&
        cpuShouldUseRapidPulse()
    ) {
        gameState.p2.energy -= 2;
        gameState.p2.shieldActive = true;
        log("CPU used Rapid Pulse! Shielded incoming Trance and Arousal!");
    }

    let cpuBusy = false; // prevents overlapping telegraph/reroll steps inside the interval
    let rInterval = setInterval(() => {
        if (cpuBusy) return;
        if (gameState.rerollsLeft > 0) {
            // Telegraph: lock dice, show which ones the CPU kept, then pause before rolling.
            cpuChooseDiceToKeep();
            cpuTelegraphActive = true;
            updateUI();
            cpuBusy = true;
            setTimeout(() => {
                cpuTelegraphActive = false;
                rollDiceAction();
                cpuBusy = false;
            }, 400);
        } else {
			let transformCount = gameState.dice.filter(d => d.face === "👁️ TRANSFORM").length;
			if (cpuShouldUseFadingReality(transformCount)) {
				useFadingReality(2);
			}
		
            let keptCount = gameState.dice.filter(d => d.kept).length;
            let idx20 = gameState.p2.inventory.findIndex(c => c.id === 20);

            if (
                idx20 !== -1 &&
                gameState.p2.inventory[idx20].charges > 0 &&
                cpuShouldUseAbsoluteFocus(keptCount)
            ) {
                let card = gameState.p2.inventory[idx20];

                card.charges -= 1;
                gameState.rerollsLeft += 1;

                log(`CPU used Absolute Focus charge. (${card.charges} left)`);

                if (card.charges <= 0) {
                    const discarded = gameState.p2.inventory.splice(idx20, 1)[0];
                    discardCard(discarded);
                    log("Absolute Focus depleted and discarded.");
                }

                updateUI();
                return;
            }
			
            if (cpuShouldUseHypnoticSuggestion(keptCount)) {
                buyReroll(1, 16, 2);
                return;
            }
            // Burning Up uses the per-turn burningUpUses counter. Do not
            // return from the CPU interval unless the card was actually used;
            // otherwise a rejected use can leave the interval running forever.
            if (cpuShouldUseBurningUp()) {
                if (useBurningUp(2)) return;
            }

            clearInterval(rInterval);

            setTimeout(() => {

                // --------------------------------------------------------
                // SIMMERING AROUSAL
                //
                // A die being kept does NOT prevent the CPU from changing
                // it to Arousal. Changing a die's face is not a reroll,
                // so its kept state is preserved.
                // --------------------------------------------------------
                let idx49 = gameState.p2.inventory.findIndex(c => c.id === 49);

                if (idx49 !== -1 && !gameState.p2.simmeringUsed) {
                    let dIdx = cpuIsAdaptive() ? cpuPickSimmeringDie() : gameState.dice.findIndex(d => d.face !== "🔥 AROUSAL");

                    if (dIdx !== -1) {
                        gameState.dice[dIdx].face = "🔥 AROUSAL";
                        gameState.p2.simmeringUsed = true;
                        log("CPU used Simmering Arousal: Changed a die to Arousal.");
                        updateUI();
                    }
                }

                cpuEnsureRitualKeep();
                if (cpuIsAdaptive()) cpuBrainRecordRoll();
                resolveDice();
                if (cpuIsAdaptive()) { cpuAdaptiveShopPhase(); endTurn(); return; }
                if (cpuIsTier()) { cpuTierShopPhase(getCpuDifficulty()); endTurn(); return; }
				
				// --------------------------------------------------------
                // TACTICAL MARKET PRIORITIZATION (CARDS RATED 70+)
                // --------------------------------------------------------
				const isPinned = isCpuPinnedInSubmission();
                let highValueTarget = null;
                let maxTargetScore = 0;

                for (let i = 0; i < market.length; i++) {
                    let card = market[i];
                    if (!card || !passesCardSpecificConditions(card)) continue;
                    let score = cpuCardPurchaseScore(card);
					if (isPinned && SUBMISSION_RECOVERY_CARDS.includes(card.id)) {
						score += 50;
					}
                    if (score >= 70 && score > maxTargetScore) {
                        maxTargetScore = score;
                        highValueTarget = card;
                    }
                }

                if (highValueTarget) {
                    let targetCost = getCardPurchaseCost(highValueTarget, 2);

                    // 1. If CPU cannot afford high-value card, try generating energy/free buy
                    if (targetCost > gameState.p2.energy && !gameState.freeBuyActive) {
                        // Check for Waking Trance (Card 26) to sell for +2 energy
                        let idx26 = gameState.p2.inventory.findIndex(c => c.id === 26);
                        if (idx26 !== -1 && (gameState.p2.energy + 2) >= targetCost) {
                            let card = gameState.p2.inventory.splice(idx26, 1)[0];
                            if (card) {
                                gameState.p2.energy += 2;
                                discardCard(card);
                                log(`CPU sold ${card.name} for +2 Energy to afford priority target (${highValueTarget.name})!`);
                            }
                        }

                        // Check for Mirror Image (Card 42) to make buy free
                        let idx42 = gameState.p2.inventory.findIndex(c => c.id === 42);
                        if (targetCost > gameState.p2.energy && idx42 !== -1) {
                            const discarded = gameState.p2.inventory.splice(idx42, 1)[0];
                            if (discarded) discardCard(discarded);
                            gameState.freeBuyActive = true;
                            log(`CPU used Mirror Image to secure priority target (${highValueTarget.name})!`);
                        }
                    }

                    // 2. Deny Opponent if CPU still can't afford target, but Player 1 can
                    targetCost = getCardPurchaseCost(highValueTarget, 2);
                    let canCpuAfford = (targetCost <= gameState.p2.energy) || gameState.freeBuyActive;
                    let canPlayerAfford = gameState.p1.energy >= highValueTarget.cost;

                    if (!canCpuAfford && canPlayerAfford && deck.length > 0) {
                        let energyBefore = gameState.p2.energy;
                        wipeMarket();
                        log(`CPU wiped market to deny Player 1 high-value card (${highValueTarget.name})! (${energyBefore} → ${gameState.p2.energy})`);
                    }
                }

                let idx26 = gameState.p2.inventory.findIndex(c => c.id === 26);
                if (idx26 !== -1) {
                    let maxCost = market.length > 0 ? Math.max(...market.map(c => c.cost)) : 0;
                    if (cpuShouldSellWakingTrance(maxCost)) {
                        let card = gameState.p2.inventory.splice(idx26, 1)[0];
                        if (card) {
                            gameState.p2.energy += 2;
                            discardCard(card);
                            log(`CPU sold ${card.name} for +2 Energy.`);
                        }
                    }
                }

                // --------------------------------------------------------
                // MIRROR IMAGE
                // --------------------------------------------------------
                let idx42 = gameState.p2.inventory.findIndex(c => c.id === 42);
                if (idx42 !== -1 && market.length > 0) {
                    let maxCost = Math.max(...market.map(c => c.cost));
                    if (cpuShouldUseMirrorImage(maxCost)) {
                        const discarded = gameState.p2.inventory.splice(idx42, 1)[0];
                        if (discarded) discardCard(discarded);
                        gameState.freeBuyActive = true;
                        log("CPU discarded Mirror Image! Next buy is free.");
                    }
                }

                // --------------------------------------------------------
                // OPTIONAL CPU WIPE
                //
                // Only use Wipe if there is currently no affordable card
                // and the deck can actually refresh the market.
                //
                // Mirror Image is considered first because it can make
                // the existing market free.
                // --------------------------------------------------------
                if (cpuShouldUseWipe()) {
                    let energyBefore = gameState.p2.energy;
                    wipeMarket();
                    log(`CPU used Wipe: refreshed market (${energyBefore} → ${gameState.p2.energy}).`);
                }

                // --------------------------------------------------------
                // CARD PURCHASES
                //
                // getCardPurchaseCost() now includes:
                //   - Compliant Mind
                //   - first-purchase Hypnotic Focus
                //   - Mirror Image free purchase
                //
                // Therefore the CPU now understands the same purchase
                // rules as the human player.
                // --------------------------------------------------------
                let boughtSomething = true;
                while (boughtSomething) {
                    boughtSomething = false;
                    let bestIndex = -1;
                    let bestScore = -Infinity;
					
					// see if we have Hypnotic Dominance/5 to steal a major card
					if (gameState.p2.inventory.some(c => c.id === 5)) {
						// see if there is a card we want to snipe
						for (let i = 0; i < gameState.p1.inventory.length; i++) {
							let card = gameState.p1.inventory[i];
							if (!card) continue;
        
							let score = cpuCardPurchaseScore(card);
							// If CPU really wants the card and has energy to pay P1
							if (score >= 65 && gameState.p2.energy >= card.cost &&
								!inventoryHasName(gameState.p2, card.name)) {
								buyCardFromOpponent(2, i);
								break; 
							}
						}
					}
					
                    for (let i = 0; i < market.length; i++) {
                        let card = market[i];
                        if (!card) continue;
                        let effectiveCost = getCardPurchaseCost(card, 2);

                        if (effectiveCost <= gameState.p2.energy || gameState.freeBuyActive) {
                            if (cpuShouldBuyCard(card, effectiveCost)) {
                                let score = cpuCardPurchaseScore(card);
                                if (effectiveCost <= gameState.p2.energy) score += 5;
                                if (score > bestScore) {
                                    bestScore = score;
                                    bestIndex = i;
                                }
                            }
                        }
                    }

                    if (bestIndex !== -1) {
                        buyCard(bestIndex);
                        boughtSomething = true;
					} else if (!gameState.showEnergyActions) {
                        // High Energy Wipe Check
                        let diff = getCpuDifficulty();
                        let wipeThreshold = Infinity;
                        
                        if (diff === "aggressive") wipeThreshold = 8;
                        else if (diff === "v23low") wipeThreshold = 9;
                        else if (diff === "defensive") wipeThreshold = 10;
                        
                        if (gameState.p2.energy >= wipeThreshold && deck.length > 0 && market.length > 0) {
                            let energyBefore = gameState.p2.energy;
                            wipeMarket();
                            log(`CPU used Wipe (Excess Energy): refreshed market (${energyBefore} → ${gameState.p2.energy}).`);
                            boughtSomething = true; // Iterate loop again to evaluate the newly wiped market
                        }


                    }
                }
				
				while (cpuUseQuietMind())
				{
					// spend until don't want to spend
				}

                // --------------------------------------------------------
                // ENERGY ACTIONS
                // --------------------------------------------------------
                while (gameState.showEnergyActions == true && cpuShouldBuyTransformWithEnergy()) {
                    buyAction('transform', 2);
                }
                while (gameState.showEnergyActions == true && cpuShouldBuySubmissionWithEnergy()) {
                    buyAction('submission', 2);
                }
                endTurn();
            }, 1000);
        }
    }, 1000);
}

function syncFinalBoardPortrait(playerId) {
    const key = playerId === 1 ? 'p1' : 'p2';
    const player = playerId === 1 ? gameState.p1 : gameState.p2;
    if (!player) return;
    const level = Math.max(0, Math.min(10, Number(player.transform) || 0));
    const fill = document.getElementById(`${key}-transform-progress`);
    const label = document.getElementById(`${key}-transform-progress-label`);
    const track = document.getElementById(`${key}-transform-progress-track`);
    if (fill) fill.style.width = `${level * 10}%`;
    if (label) label.textContent = `${level} / 10`;
    if (track) track.setAttribute('aria-valuenow', String(level));
    const stage = Math.min(10, Math.max(0, Number(player.transform) || 0));
    const filename = `${player.name}_to_${player.transformTarget}_${stage}.jpg`;
    const path = `images/avatars/${player.name}/${filename}`;
        const container = document.getElementById(`${key}-image`);
    if (!container) return;
    const token = String((Number(container.dataset.portraitToken) || 0) + 1);
    container.dataset.portraitToken = token;
    let img = container.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        container.replaceChildren(img);
    }
    img.dataset.avatarPath = path;
    img.alt = filename;
    img.onclick = () => openImageModal(path);
    img.onload = null;
    img.onerror = () => {
        if (container.dataset.portraitToken !== token) return;
        container.textContent = `Image Req: ${filename}`;
    };
    img.src = path;
}

function winnerIdFromState() {
    if (!gameState || !gameState.p1 || !gameState.p2) return null;

    // A forfeit takes precedence over normal transformation scoring.
    if (gameState.endReason === "forfeit") {
        const quitter = Number(gameState.forfeitingPlayerId);

        if (quitter === 1) return 2;
        if (quitter === 2) return 1;
    }

    const p1Transformed = Number(gameState.p1.transform) >= 10;
    const p2Transformed = Number(gameState.p2.transform) >= 10;

    if (p1Transformed && p2Transformed) {
        return Number(gameState.activePlayer) === 2 ? 2 : 1;
    }
    if (p1Transformed) return 2;
    if (p2Transformed) return 1;

    return null;
}

function presentFinishedGame() {
    if (gameOverPresentationStarted || !gameState || !gameState.gameEnded) return;
    const winnerId = winnerIdFromState();
    if (!winnerId) return;
    gameOverPresentationStarted = true;
    playSound("win");
    const challengeMatch = challengeActive && gameState.gameMode === "solo";
    if (challengeMatch) handleChallengeMatchEnded(winnerId);
    const challengeContinue = document.getElementById("go-challenge-continue");
    if (challengeContinue) {
        challengeContinue.style.display = challengeMatch ? "block" : "none";
        challengeContinue.textContent = "✦ Continue Challenge";
    }
    const playAgain = document.getElementById("go-play-again");
    if (playAgain) playAgain.style.display = challengeMatch ? "none" : "inline-block";

    syncFinalBoardPortrait(1);
    syncFinalBoardPortrait(2);

    const p1Wins = winnerId === 1;
    const winner = p1Wins ? gameState.p1 : gameState.p2;
    const gameOverModal = document.getElementById("game-over-modal");

    document.getElementById("go-title").innerText = `${winner.name} Wins!`;
    document.getElementById("go-p1-name").innerText = gameState.p1.name;
    document.getElementById("go-p1-status").innerText = p1Wins ? "WINNER" : "TRANSFORMED";

    const p1FinalT = Math.min(10, Math.max(0, Number(gameState.p1.transform) || 0));
    const p1Path = `images/avatars/${gameState.p1.name}/${gameState.p1.name}_to_${gameState.p1.transformTarget}_${p1FinalT}.jpg`;
    document.getElementById("go-p1-image").innerHTML =
        `<img src="${p1Path}" onclick="openImageModal('${p1Path}')" onerror="this.outerHTML='Image Req:<br>${gameState.p1.name}_to_${gameState.p1.transformTarget}_${p1FinalT}.jpg'"/>`;
    document.getElementById("go-p1-panel").classList.remove("winner-highlight");
    if (p1Wins) document.getElementById("go-p1-panel").classList.add("winner-highlight");

    document.getElementById("go-p2-name").innerText = playerDisplayName(gameState.p2);
    document.getElementById("go-p2-status").innerText = !p1Wins ? "WINNER" : "TRANSFORMED";

    const p2FinalT = Math.min(10, Math.max(0, Number(gameState.p2.transform) || 0));
    const p2Path = `images/avatars/${gameState.p2.name}/${gameState.p2.name}_to_${gameState.p2.transformTarget}_${p2FinalT}.jpg`;
    document.getElementById("go-p2-image").innerHTML =
        `<img src="${p2Path}" onclick="openImageModal('${p2Path}')" onerror="this.outerHTML='Image Req:<br>${gameState.p2.name}_to_${gameState.p2.transformTarget}_${p2FinalT}.jpg'"/>`;
    document.getElementById("go-p2-panel").classList.remove("winner-highlight");
    if (!p1Wins) document.getElementById("go-p2-panel").classList.add("winner-highlight");

    recFinish(p1Wins ? 1 : 2);
    ["p1-image", "p2-image"].forEach(id => {
        const e = document.getElementById(id);
        if (e) e.classList.remove("active-portrait-glow-p1", "active-portrait-glow-p2");
    });

    lastCinematicLoserId = p1Wins ? 2 : 1;
    const replayBtn = document.getElementById("go-replay-cinematic");
    if (replayBtn) replayBtn.style.display = ENABLE_FINAL_TRANSFORMATION_CINEMATIC ? "inline-block" : "none";
	const isForfeit = gameState.endReason === "forfeit";

    if (ENABLE_FINAL_TRANSFORMATION_CINEMATIC) {
        playFinalTransformationCinematic(lastCinematicLoserId).finally(() => {
			if (isForfeit) {
				window.location.reload();
				return;
			}
            gameOverModal.style.display = "flex";
        });
    } else {
		playSound("win");
		stopAllMusic(true);   // or playMusic("final") for a short non-looping sting later
		if (isForfeit) {
			window.location.reload();
		}
		else {
			gameOverModal.style.display = "flex";
		}
    }
}

function checkWinCondition() {
	if (gameState.gameEnded) return true;

    // ------------------------------------------------------------
    // NEW IDENTITY
    //
    // A player who reaches 10+ Transform gets a chance to use
    // New Identity before victory is declared.
    // ------------------------------------------------------------
    [1, 2].forEach(pId => {
        let p = pId === 1 ? gameState.p1 : gameState.p2;

        if (p.transform >= 10 && hasCard(pId, 38)) {
            // Discard the entire active hand/inventory when
            // New Identity fires.
            const discardedCards = p.inventory.slice();
            discardCards(discardedCards);

            p.inventory = [];

            p.transform = 5;
            p.arousal = 5;

            log(
                `NEW IDENTITY triggered for ${p.name}! ` +
                `Transformation reverted to 5, Cards wiped, Arousal maxed!`,
                true
            );
        }
    });

    const p1Transformed = gameState.p1.transform >= 10;
    const p2Transformed = gameState.p2.transform >= 10;

    if (!p1Transformed && !p2Transformed) {
        return false;
    }

    // ------------------------------------------------------------
    // VICTORY
    //
    // Transform 10 means that player has been fully transformed.
    // Therefore, the player who caused the opponent to reach 10
    // is the winner.
    //
    // If both players reach 10 during the same active turn/effect,
    // the active player wins the tie.
    // ------------------------------------------------------------
    let winnerId;

    if (p1Transformed && p2Transformed) {
        // Simultaneous transformation:
        // active player wins the tie.
        winnerId = gameState.activePlayer;

        log(
            `Both players reached 10+ Transform! ` +
            `${winnerId === 1 ? gameState.p1.name : gameState.p2.name} ` +
            `wins as the active player.`
        );
    } else if (p1Transformed) {
        // P1 was fully transformed, so P2 caused the final transform.
        winnerId = 2;

        log(
            `${gameState.p1.name} reached 10+ Transform. ` +
            `${gameState.p2.name} wins!`
        );
    } else {
        // P2 was fully transformed, so P1 caused the final transform.
        winnerId = 1;

        log(
            `${gameState.p2.name} reached 10+ Transform. ` +
            `${gameState.p1.name} wins!`
        );
    }

       gameState.gameEnded = true;
    // If this runs while applying our own Firebase echo, wait until that
    // apply finishes. Otherwise the gameEnded write is dropped.
    const pushEndedState = () => {
        if (isSyncingFromFirebase) { setTimeout(pushEndedState, 0); return; }
        if (typeof syncToFirebase === "function") syncToFirebase();
    };
    pushEndedState();
    updateUI();
    return true;
}
	

function openImageModal(imgSrc) {
    if (!imgSrc) return;
    const modal = document.getElementById("image-modal");
    modal.style.display = "flex"; document.getElementById("image-modal-img").src = imgSrc;
}

function closeImageModal(event) {
    if (!event || event.target.id === "image-modal" || event.target.tagName === "SPAN") {
        document.getElementById("image-modal").style.display = "none";
    }
}


// ============================================================
// HELP / RULES / GUIDED TUTORIAL SYSTEM
// ============================================================

const HELP_CONTENT = {
    quick: `
        <div class="help-section">
            <h3>Objective</h3>
            <p><strong><strong>Completely transform your opponent before they transform you.</strong> There are 10 stages of transformation. When your move pushes them to 10 or beyond, you win. Their body becomes yours to rewrite.</p>
        </div>
        <div class="help-section">
            <h3>Your Turn</h3>
            <div class="help-grid">
                <div class="help-box"><strong>1. Roll</strong><br>Roll all available dice. Chance is the first language of suggestion.</div>
                <div class="help-box"><strong>2. Keep</strong><br>Click dice to lock the faces you want to keep. What you hold, you keep.</div>
                <div class="help-box"><strong>3. Reroll</strong><br>Roll the unkept dice again while you still have rerolls. High arousal makes the mind slower to refuse.</div>
                <div class="help-box"><strong>4. Resolve</strong><br>Resolve the final dice. Individual faces and powerful combinations both land.</div>
                <div class="help-box"><strong>5. Shop</strong><br>Spend Energy on cards or wipe the market. You may buy multiple cards if you can afford them.</div>
                <div class="help-box"><strong>6. End Turn</strong><br>Finish the shop phase and pass play unless an effect grants another turn.</div>
            </div>
        </div>
		<div class="help-section">
			<h3>Online Play: Enter the Shared Trance</h3>
			<p>Challenge another player remotely through Firebase. One player is the <strong>Host</strong> and the other is the <strong>Guest</strong>.</p>

			<h4>The Host Opens the Room</h4>
			<ol>
				<li>In the setup screen, select <strong>2 Player Online (Firebase)</strong> as the Game Mode.</li>
				<li>In the <strong>Online Setup</strong> menu, select <strong>Host Online Game</strong>.</li>
				<li>Click <strong>Generate</strong> to create a Room Code.</li>
				<li>Share that Room Code with your opponent. They will need it to connect to your room.</li>
				<li>Choose your character and other setup options, then click <strong>Start Game</strong>.</li>
				<li>The Online Lobby opens. Wait for the Guest to appear, check the character and transformation choices, then click <strong>Ready</strong>.</li>
			</ol>

			<h4>Guest</h4>
			<ol>
				<li>In the setup screen, select <strong>2 Player Online (Firebase)</strong> as the Game Mode.</li>
				<li>In the <strong>Online Setup</strong> menu, select <strong>Join Online Game</strong>.</li>
				<li>Enter the <strong>Room Code</strong> provided by the Host.</li>
				<li>Choose your character and setup options, then click <strong>Start Game</strong>.</li>
				<li>In the Online Lobby, check the Host's character and transformation choices, then click <strong>Ready</strong>.</li>
			</ol>
			
			<h4>Synchronize and Begin</h4>
			<p>The lobby displays your opponent's character and choices. Each player chooses the transformation they intend to inflict on the other character; the available transformations adjust to match the opponent. If a choice is unavailable for the selected character, the game may substitute an available option.</p> <p>Once both players are Ready, the lobby starts the shared match automatically. Dice, cards, resources, and turns are synchronized between both browsers.</p>

			<div class="help-box">
				<strong>Important:</strong> The Host should generate the Room Code first and give it to the Guest before the Guest attempts to join.
			</div>
			
			<div class="help-box"> <strong>Need to change a choice?</strong> Use <strong>Cancel Ready</strong> before the match starts. You can also use <strong>Leave Lobby</strong> to exit. Make sure both players agree on the room code before starting. </div>
		</div>
        <div class="help-section">
            <h3>The Six Dice</h3>
            <p>🌀 Trance &nbsp; 💧 Lucidity &nbsp; ⚡ Energy &nbsp; ⛓️ Submission &nbsp; 🔥 Arousal &nbsp; 👁️ Transform</p>
            <p>Most dice have an individual effect. Matching 3 or more of ⛓️ or 👁️ creates a stronger combination effect that can push the body or mind further under.</p>
        </div>
        <div class="help-section">
            <h3>First Strategy Tip</h3>
            <p>Energy buys the card powers that let you rewrite your opponent. Transform is how you finish the job. Early on, decide whether your roll is better spent building resources, applying pressure, or setting up a combination that leaves them soft and open.</p>
        </div>
        <div class="help-section" style="text-align:center;">
            <button onclick="startGuidedTutorial(false)" style="max-width:320px; margin:auto;">Start Guided Tutorial</button>
        </div>
    `,
    rules: `
        <div class="help-section">
            <h3>Objective: The Final Transformation</h3>
            <p>Each player is trying to <strong>Completely transform the opponent to a target shape</strong>. The player whose opponent is completely transformed through the 10 stages of transformation first is the winner. If both players are completely transformed during the same active turn/effect, the active player takes the victory.</p>
        </div>
        <div class="help-section">
            <h3>The Ritual of Each Turn</h3>
            <ol>
                <li><strong>Rolling phase:</strong> roll, lock useful dice, and reroll the rest while you still can.</li>
                <li><strong>Resolve:</strong> apply the final roll's individual effects and combinations.</li>
                <li><strong>Shop phase:</strong> buy cards or clear the market.</li>
                <li><strong>End Turn:</strong> end-of-turn effects resolve before the next player's turn begins.</li>
            </ol>
        </div>
        <div class="help-section">
            <h3>The Pendulum of Submission</h3>
            <p>Each side of the track has five steps. Having the track marker on your side means you are more submissive and open to being manipulated: it is not good for you. A sufficiently strong Submission roll pushes the track towards the opponent. Pushing beyond an endpoint overflows into Transformations: they obey, and their body changes to match.</p>
            <p>A roll of 3 or more ⛓️ faces produces <strong>1 + (number of ⛓️ beyond the first three)</strong> points of submission towards the opponent.</p>
        </div>
        <div class="help-section">
            <h3>Trance 🌀</h3>
            <p>Each 🌀 deepens the opponent's Trance. Reaching 5 Trance causes a Setback for the opponent: You choose whether they are more submissive (+2) or more aroused (+2). Then they surface with 0 Trance again... temporarily.</p>
        </div>
        <div class="help-section">
            <h3>Arousal 🔥 & Rerolls</h3>
            <p>Two 🔥 dice produce 1 Arousal; each additional 🔥 adds one more. So 3 🔥 produce 2, 4 🔥 produce 3, etc. Arousal is capped at 5. Your Arousal level controls your base rerolls: 0–2 Arousal gives 2 rerolls, 3–4 gives 1, and 5 gives 0. A heated mind is a slower mind. Some cards add rerolls or other modifiers.</p>
        </div>
        <div class="help-section">
            <h3>Transform 👁️</h3>
            <p>Three 👁️ dice produce 1 Transformation of the opponent, with each additional 👁️ adding another point. Cards can increase the number of Transformations. Transforming the opponent to 10 ends the game in your favor. Their body becomes the final statement.</p>
        </div>
        <div class="help-section">
            <h3>Energy ⚡</h3>
            <p>Each ⚡ die gives 1 Energy. Energy is spent on cards and being able to wipe the cards in the market and refill it. The card <i>Power Boost</i> can increase Energy gained from dice.</p>
        </div>
        <div class="help-section">
            <h3>Lucidity 💧</h3>
            <p>💧 Lucidity lets you reduce your own Trance, Arousal, and — when applicable — Vulnerability. <i>Deep Safeties</i> adds 1 extra point to spend. If the opponent has <i>Burning Intensity</i>, each Arousal point you remove costs 2💧. Human players distribute Lucidity manually in the allocation dialog.</p>
        </div>
        <div class="help-section">
            <h3>Vulnerability</h3>
            <p>If the card <i>Powerful Transform</i> is in play, Vulnerability reduces the number of dice the opposing player can roll, to a minimum of three. 💧 Lucidity can remove Vulnerability.</p>
        </div>
    `,
    dice: `
        <div class="help-section">
            <h3>Dice Reference</h3>
            <div class="help-grid">
                <div class="help-box"><div class="help-die">🌀 SPIRAL</div>Deepens the opponent's Trance. Deep Gaze increases the effect.</div>
                <div class="help-box"><div class="help-die">💧 LUCIDITY</div>Reduce your own Trance, Arousal, and applicable Vulnerability.</div>
                <div class="help-box"><div class="help-die">⚡ ENERGY</div>Gain Energy. Power Boost can add extra Energy.</div>
                <div class="help-box"><div class="help-die">⛓️ SUBMISSION</div>Three or more push the Submission track. Three ⛓️ also trigger effects from cards such as Somnambulism.</div>
                <div class="help-box"><div class="help-die">🔥 AROUSAL</div>Two 🔥 contribute 1 Arousal, and one more Arousal for each 🔥, with card effects able to modify the result.</div>
                <div class="help-box"><div class="help-die">👁️ TRANSFORM</div>Three or more deal further Transforms to the opponent.</div>
            </div>
        </div>
        <div class="help-section">
            <h3>Keeping Dice</h3>
            <p>Click a rolled die to lock it. Locked dice stay in place while unkept dice are rerolled. Click a kept die again to unlock it.</p>
        </div>
        <div class="help-section">
            <h3>Combinations vs. Individual Effects</h3>
            <p>Some effects are based on individual dice while others require a set of matching faces. For example, a virtual die can resolve its own individual effect, but it does not merge into the main roll when calculating a 3-die or larger combination.</p>
        </div>
    `,
    cards: `
        <div class="help-section">
            <h3>Cards & Market</h3>
            <p><strong>Keep</strong> cards stay active after purchase. <strong>Instant</strong> cards resolve immediately and are discarded afterward. The deck's discard pile can be recycled when the draw deck runs out.</p>
            <p>The market contains three cards. Whenever a card is purchased, that market slot is immediately refilled when possible. There is no hand/inventory limit however you can only buy a card if it does not have the same name as another card in your inventory.</p>
            <input id="help-card-search" class="help-card-search" type="search" placeholder="Search cards by name or effect..." oninput="renderHelpCards(this.value)">
            <div id="help-card-list" class="help-card-list"></div>
        </div>
        <div class="help-section">
            <h3>Claiming New Powers (Cards)</h3>
            <p>You may buy multiple cards during your shop phase if you have enough Energy. Hypnotic Focus reduces the cost of only your first purchase that turn; later purchases use their normal modified cost.</p>
            <p><strong>Wipe Row</strong> costs 2 Energy, discards the current market cards, and replaces the row with new cards when available. If you think the opponent will get a powerful card and you
			can't afford it, it is sometimes beneficial to wipe the market so they can't get it.</p>
        </div>
    `,
    advanced: `
        <div class="help-section">
            <h3>Extra Turns</h3>
            <p>Some effects grant another turn. Somnambulism automatically grants another turn after rolling ⛓️⛓️⛓️, with one fewer die on that extra turn.</p>
        </div>
        <div class="help-section">
            <h3>Lingering Suggestions</h3>
            <p>Some Keep cards trigger at the end of your turn. This includes effects that interact with Submission, Energy, or the opponent's Trance.</p>
        </div>
        <div class="help-section">
            <h3>Special Dice Manipulation</h3>
            <p>Simmering Arousal can change one die to 🔥 during the roll phase. The normal interface lets you lock dice you want to preserve; Simmering changes the first eligible non-🔥 die.</p>
        </div>
        <div class="help-section">
            <h3>Defensive Tools</h3>
            <p>Rapid Pulse can spend 2 Energy during the roll phase to shield you from incoming Trance and Arousal for a turn. Other cards provide rerolls, healing, extra dice, or ways to manipulate the market.</p>
        </div>
        <div class="help-section">
            <h3>New Identity Card</h3>
            <p>If a transformed player has New Identity when they reach 10+ Transform, the card can prevent the immediate victory by reverting that player to Transform 5, setting Arousal to 5, and discarding their active cards.</p>
        </div>
		<div class="help-section">
            <h3>Hypnotic Dominance Card</h3>
            <p>This card lets a player buy cards from the other player. They can still buy cards from the market as well!</p>
        </div>
        <div class="help-section">
            <h3>Game Modes</h3>
            <p><strong>1 Player vs CPU:</strong> play against the selected AI difficulty.</p>
            <p><strong>2 Player Local:</strong> two people share the same browser.</p>
            <p><strong>2 Player Online:</strong> use the Firebase room system to play remotely.</p>
        </div>
        <div class="help-section">
            <h3>AI Difficulties</h3>
            <p>Beginner is more random. Easy uses basic strategy. Normal is more aggressive. Hard uses a stronger strategic profile. Expert emphasizes defensive play. Master/Mistress uses an adaptive playstyle and can be very challenging.</p>
        </div>
    `
};

function openHelpModal(tab = 'quick') {
    const modal = document.getElementById('help-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    showHelpTab(tab);
}

function closeHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) modal.style.display = 'none';
}

function showHelpTab(tab) {
    const content = document.getElementById('help-content');
    if (!content) return;
    content.innerHTML = HELP_CONTENT[tab] || HELP_CONTENT.quick;
    document.querySelectorAll('#help-tabs .help-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    if (tab === 'cards') renderHelpCards('');
}

function renderHelpCards(filter = '') {
    const list = document.getElementById('help-card-list');
    if (!list) return;
    const q = String(filter || '').trim().toLowerCase();
    const searchAliases = { transform: '👁️', trance: '🌀', energy: '⚡', lucidity: '💧', arousal: '🔥', submission: '⛓️' };
    const queryTerms = q.split(/\s+/).filter(Boolean).map(term => searchAliases[term] || term);
    const cards = KNOWN_CARDS.filter(card => {
        if (!q) return true;
        const haystack = `${card.name} ${card.type} ${card.desc}`.toLowerCase();
        return haystack.includes(q) || queryTerms.some(term => haystack.includes(term));
    });
    list.innerHTML = cards.map(card => `
        <div class="help-card-entry ${card.type === 'Keep' ? 'help-card-keep' : 'help-card-instant'}">
            <div><strong>${escapeHistoryHtml(card.name)}</strong> <span class="help-card-meta"><span class="help-card-type-icon">${card.type === 'Keep' ? '🖐️' : '💥'}</span>${escapeHistoryHtml(card.type)} · <span class="help-card-cost">${Number(card.cost)}⚡</span></span></div>
            <div style="margin-top:5px;">${escapeHistoryHtml(card.desc)}</div>
        </div>
    `).join('') || '<div class="help-box">No cards match that search.</div>';
}

const GUIDED_TUTORIAL_STEPS = [
    {
        title: 'Welcome to Hypnotic Duel',
        body: '<p>Your goal is simple: <strong>Transform your opponent to 10 or more</strong> before they do the same to you.</p><p>This tutorial is a hands-on tour of the board. This is a practice game. You will make a few actions here so you can see how the controls work... and how the pressure builds.</p>',
        target: null, position: 'bottom', actionGate: 'none'
    },
    {
        title: '1. Make Your First Roll',
        body: '<p>The center of the board is your roll area. There are six possible faces: 🌀 Trance, 💧 Lucidity, ⚡ Energy, ⛓️ Submission, 🔥 Arousal, and 👁️ Transform.</p><p>Click <strong>Roll Dice</strong> to make your first roll. Then click <strong>Next</strong>.</p>',
        target: '#btn-roll', position: 'top', actionGate: 'roll'
    },
    {
        title: '2. Lock and Unlock Dice',
        body: '<p>Practice controlling your roll. Click two or three dice to <strong>lock</strong> them. Locked dice will stay in place when you reroll.</p><p>Then click one of those dice again to <strong>unlock</strong> it. Leave at least one die unlocked for the next step.</p>',
        target: '#dice-container', position: 'top', actionGate: 'dice'
    },
    {
        title: '3. Reroll the Unlocked Dice',
        body: '<p>Only unlocked dice are rerolled. Click <strong>Roll Unkept Dice</strong> once and watch the unlocked dice change while your locked dice stay put.</p><p>Your available rerolls are shown above the dice. High arousal makes those rerolls harder to come by, so keep your libdo in check.</p>',
        target: '#btn-roll', position: 'top', actionGate: 'reroll'
    },
    {
        title: '4. Resolve the Roll',
        body: '<p>When you are satisfied with a roll, click <strong>Resolve Dice</strong>. This applies the individual die effects and checks for powerful combinations such as 3+ Submission or 3+ Transform.</p><p>During this tutorial step, the other dice action is temporarily disabled so you can focus on Resolve.</p>',
        target: '#btn-resolve', position: 'top', actionGate: 'resolve'
    },
    {
        title: '5. Build Your Resources',
        body: '<p>After the roll resolves, your resources change. ⚡ Energy buys cards. 🌀 Trance pressures your opponent. 💧 Lucidity protects you. ⛓️ Submission moves the Submission track. 🔥 Arousal affects how many rerolls the opponent is allowed. 👁️ Transform is your main path to victory.</p>',
        target: '#p1-energy', position: 'top', actionGate: 'none'
    },
    {
        title: '6. Buy Cards',
        body: '<p>The three cards in the <strong>Market</strong> are available during the Shop phase. You may buy multiple cards if you have enough Energy; each purchase immediately refills that market slot.</p><p><strong>Keep</strong> cards remain active and appear in your Active Cards area. <strong>Instant</strong> cards resolve immediately and are then discarded. You may not have two Keep cards with the same name.</p>',
        target: '#market-container', position: 'bottom', actionGate: 'none'
    },
    {
        title: '7. The Submission Track',
        body: '<p>The Submission track has five nodes on each side. Nodes to the left mean Player 1 is more submissive and Player 2 is dominant. Nodes to the right are the opposite.</p><p>Strong Submission effects push the track. If you push beyond an endpoint, the overflow becomes Transformations against the player on that side; they obey, and their body changes.</p>',
        target: '#submission-track', position: 'bottom', actionGate: 'none'
    },
    {
        title: '8. Watch Your Active Cards',
        body: '<p>Your active <strong>Keep</strong> cards appear in the Active Cards area. Some add dice, rerolls, defensive effects, or stronger dice results. Others provide special abilities during particular phases. They are the lasting suggestions that stay with you.</p>',
        target: '#p1-inventory', position: 'top', actionGate: 'none'
    },
    {
        title: '9. Finish the Turn',
        body: '<p>When you are finished shopping and using available actions, click <strong>End Turn</strong>. End-of-turn effects resolve, then play passes to the other player unless an effect grants another turn.</p>',
        target: '#btn-end-turn-1', position: 'top', actionGate: 'none'
    },
    {
        title: '10. Win the Duel',
        body: '<p>Keep applying pressure until you Transform your opponent to <strong>10 or more</strong>.</p><p>Cards, dice combinations, Submission overflow, Energy actions, and other effects can all contribute to the final push. Their body (or tragically, yours) becomes the proof.</p><p>You are ready to play!</p>',
        target: null, position: 'top', actionGate: 'none'
    }
];

let guidedTutorialStep = 0;
let guidedTutorialActive = false;
let guidedTutorialStartedFromSetup = false;

function clearTutorialHighlight() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
}

function resetTutorialGameState() {
    gameState = {
        gameMode: 'solo',
        p1: { name: '', transformTarget: '', trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, burningUpPending: 0 },
        p2: { name: '', transformTarget: '', difficulty: 'smart', trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, burningUpPending: 0 },
        submission: 0, activePlayer: 1, round: 1, phase: 'waiting',
        dice: Array(6).fill({ face: '-', kept: false }),
        rerollsLeft: 0, gameEnded: false, showDiceText: true, showEnergyActions: false, freeBuyActive: false, extraTurn: false, somnambulismTurn: false,
        log: []
    };
    onlineRoomId = '';
    onlineLocalRole = 1;
    isSyncingFromFirebase = false;
    market = [];
    generateDeck();
}

function startTutorialDemoGame() {
    resetTutorialGameState();

    const p1Select = document.getElementById('p1-name');
    const cpuSelect = document.getElementById('cpu-name');
    const p1TargetSelect = document.getElementById('p1-transform-type');
    const cpuTargetSelect = document.getElementById('cpu-transform-type');

    const p1Raw = p1Select ? p1Select.value.trim() : 'Player 1';
    const cpuRaw = cpuSelect ? cpuSelect.value.trim() : 'CPU';
    const p1Name = p1Raw.split(' ')[0] || 'Player';
    let cpuName = cpuRaw === 'Random' ? 'CPU' : (cpuRaw.split(' ')[0] || 'CPU');
    if (cpuName === p1Name) cpuName = 'CPU';

    const p1Target = cpuTargetSelect && cpuTargetSelect.value !== 'Random'
        ? cpuTargetSelect.value
        : TRANSFORMS[0];
    const cpuTarget = p1TargetSelect && p1TargetSelect.value
        ? p1TargetSelect.value
        : TRANSFORMS[0];

    gameState.gameMode = 'solo';
    gameState.showDiceText = document.getElementById('dice-text-option')?.value !== 'off';
    gameState.showEnergyActions = false;
    gameState.p1.name = p1Name;
    gameState.p1.transformTarget = p1Target;
    gameState.p2.name = cpuName;
    gameState.p2.transformTarget = cpuTarget;
    gameState.p2.difficulty = 'random';

    // The tutorial always starts with the human in control so its interactive
    // dice examples cannot be interrupted by a CPU turn.
    gameState.activePlayer = 1;
    gameState.p2.energy = 1;

    document.getElementById('energy-actions-panel-1').style.display = 'none';
    document.getElementById('energy-actions-panel-2').style.display = 'none';
    document.getElementById('btn-end-turn-2').style.display = 'none';
    document.getElementById('p1-last-keep-section').style.display = 'none';

    const setup = document.getElementById('settings-modal');
    if (setup) setup.style.display = 'none';

    refillMarket();
    startTurn();
    updateUI();
}

function applyTutorialActionGate() {
    if (!guidedTutorialActive) return;

    const gate = GUIDED_TUTORIAL_STEPS[guidedTutorialStep]?.actionGate || 'none';
    const roll = document.getElementById('btn-roll');
    const resolve = document.getElementById('btn-resolve');

    if (roll) {
        if (gate === 'none') {
            // Leave the normal game controls untouched outside the hands-on steps.
        } else if (gate === 'roll' || gate === 'reroll') {
            roll.disabled = false;
        } else {
            roll.disabled = true;
        }
    }

    if (resolve) {
        if (gate === 'resolve') {
            resolve.disabled = false;
        } else if (gate !== 'none') {
            resolve.disabled = true;
        }
    }
}

function renderTutorialStep() {
    const step = GUIDED_TUTORIAL_STEPS[guidedTutorialStep];
    if (!step) return;
    clearTutorialHighlight();

    const title = document.getElementById('tutorial-title');
    const body = document.getElementById('tutorial-body');
    const progress = document.getElementById('tutorial-progress');
    const back = document.getElementById('tutorial-back');
    const next = document.getElementById('tutorial-next');
    const panel = document.querySelector('.tutorial-panel');

    if (title) title.innerText = step.title;
    if (body) body.innerHTML = step.body;
    if (progress) progress.innerText = `Guided Tutorial · ${guidedTutorialStep + 1} of ${GUIDED_TUTORIAL_STEPS.length}`;
    if (back) back.disabled = guidedTutorialStep === 0;
    if (next) next.innerText = guidedTutorialStep === GUIDED_TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next';
    if (panel) panel.classList.toggle('tutorial-top', step.position === 'top');

    if (step.target) {
        const target = document.querySelector(step.target);
        if (target) {
            target.classList.add('tutorial-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    applyTutorialActionGate();
}

function prepareGuidedTutorial() {
    // Starting from setup means this is a temporary tutorial demo, not a real
    // game. Enter a fresh board immediately and return to setup when finished.
    closeHelpModal();
    guidedTutorialStartedFromSetup = true;
    startTutorialDemoGame();
    startGuidedTutorial(true);
}

function startGuidedTutorial(fromSetup = false) {
    guidedTutorialActive = true;
    guidedTutorialStartedFromSetup = !!fromSetup;
    guidedTutorialStep = 0;
    closeHelpModal();

    const setup = document.getElementById('settings-modal');
    if (setup) setup.style.display = 'none';

    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.style.display = 'flex';

    requestAnimationFrame(() => renderTutorialStep());
}

function tutorialNext() {
    if (!guidedTutorialActive) return;
    if (guidedTutorialStep >= GUIDED_TUTORIAL_STEPS.length - 1) {
        endGuidedTutorial();
        return;
    }
    guidedTutorialStep++;
    renderTutorialStep();
}

function tutorialBack() {
    if (!guidedTutorialActive || guidedTutorialStep <= 0) return;
    guidedTutorialStep--;
    renderTutorialStep();
}

function endGuidedTutorial() {
    const returnToSetup = guidedTutorialStartedFromSetup;
    guidedTutorialActive = false;
    guidedTutorialStartedFromSetup = false;
    clearTutorialHighlight();

    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.style.display = 'none';

    if (returnToSetup) {
        // A tutorial started from setup is deliberately disposable. Reloading
        // guarantees a completely clean game and restores the setup dialog.
        location.reload();
    } else {
        updateUI();
    }
}


recInstall();

const themedDialog = document.getElementById("themed-dialog");
const themedDialogTitle = document.getElementById("themed-dialog-title");
const themedDialogMessage = document.getElementById("themed-dialog-message");
const themedDialogForm = document.getElementById("themed-dialog-form");
const themedDialogInput = document.getElementById("themed-dialog-input");
const themedDialogCancel = document.getElementById("themed-dialog-cancel");
const themedDialogAccept = document.getElementById("themed-dialog-accept");

let themedDialogMode = "alert";

function openThemedDialog({
    mode = "alert",
    title = "A Moment of Decision",
    message = "",
    defaultValue = "",
    acceptText = "Continue",
    cancelText = "Cancel"
} = {}) {
    // Avoid stacking multiple dialogs on top of each other.
    if (themedDialog.open) {
        console.warn("A themed dialog is already open.");
        return Promise.resolve(null);
    }

    themedDialogMode = mode;
    themedDialogTitle.textContent = title;
    themedDialogMessage.textContent = message;

    themedDialogInput.style.display =
        mode === "prompt" ? "block" : "none";

    themedDialogInput.value = defaultValue;
    themedDialogInput.required = false;

    themedDialogCancel.textContent = cancelText;
    themedDialogCancel.style.display =
        mode === "alert" ? "none" : "";

    themedDialogAccept.textContent = acceptText;

    return new Promise((resolve) => {
        // Resolve when the dialog closes, including Escape.
        themedDialog.addEventListener("close", () => {
            const result = themedDialog.returnValue;

            if (mode === "confirm") {
                resolve(result === "accept");
            } else if (mode === "prompt") {
                resolve(result === "accept"
                    ? themedDialogInput.value
                    : null);
            } else {
                resolve(undefined);
            }
        }, { once: true });

        themedDialog.showModal();

        if (mode === "prompt") {
            themedDialogInput.focus();
            themedDialogInput.select();
        } else {
            themedDialogAccept.focus();
        }
    });
}

// Returns true for Confirm, false for Cancel or Escape.
function showThemedConfirm(
    message,
    title = "Confirm Your Decision"
) {
    return openThemedDialog({
        mode: "confirm",
        title,
        message,
        acceptText: "Confirm",
        cancelText: "Cancel"
    });
}

// Returns the entered string, or null for Cancel or Escape.
function showThemedPrompt(
    message,
    defaultValue = "",
    title = "Enter Your Response"
) {
    return openThemedDialog({
        mode: "prompt",
        title,
        message,
        defaultValue,
        acceptText: "Submit",
        cancelText: "Cancel"
    });
}

// Shows a message with a single Continue button.
function showThemedAlert(
    message,
    title = "A Message for You"
) {
    return openThemedDialog({
        mode: "alert",
        title,
        message,
        acceptText: "Continue"
    });
}

// Submit / Enter accepts the dialog.
themedDialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    themedDialog.close("accept");
});

// Cancel button dismisses the dialog.
themedDialogCancel.addEventListener("click", () => {
    themedDialog.close("cancel");
});

// Escape dismisses the dialog and is handled by the close listener.
themedDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    themedDialog.close("cancel");
});



