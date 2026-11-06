// ============================================================
// HELPER TOOLTIPS
// Paste this whole file at the END of hypbattle.js (it needs safeStorage, gameState and getMarketWipeCost, which already exist).
// It starts itself. Hover (or keyboard focus, or press and hold on a touch screen) over a stat, bar, button or panel to see
// what it does. One checkbox in Options turns all of it on or off.
//
// Everything is matched with CSS selectors, so it keeps working when the board is redrawn (dice, buttons and cards are rebuilt
// on every update). To add or change a tip, edit HELPER_TIP_RULES below: the first matching rule wins, so keep specific rules
// above general ones.
// ============================================================

let helperTipsEnabled = true;                              // on by default; the Options checkbox changes it
const HELPER_TIP_DELAY_MS = 1000;                          // how long to hover before a tip appears
const HELPER_TOAST_KEY = "hypduel_helper_tips_toast_seen";
const HELPER_TIPS_KEY = "hypduel_helper_tips";
let helperTipEl = null, helperTipAnchor = null, helperTipTimer = null, helperTipWatch = null, helperTipTouchTimer = null;
let helperTipSuppressClick = false;

function helperEsc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

// ---------- setting ----------
function loadHelperTipsSetting() {
    try { const v = safeStorage.get(HELPER_TIPS_KEY); if (v !== null && v !== undefined) helperTipsEnabled = v !== "false"; } catch (e) {}
    document.body.classList.toggle("helper-tips-on", helperTipsEnabled);
    const box = document.getElementById("show-helper-tips-option");
    if (box) box.checked = helperTipsEnabled;
}
function setHelperTipsEnabled(on) {                        // called by the Options checkbox
    helperTipsEnabled = !!on;
    try { safeStorage.set(HELPER_TIPS_KEY, String(helperTipsEnabled)); } catch (e) {}
    document.body.classList.toggle("helper-tips-on", helperTipsEnabled);
    if (!helperTipsEnabled) hideHelperTip();
}

// ---------- small helpers for the tip texts ----------
function helperPlayerNum(el) {                             // which player's panel is this element in? (1 or 2)
    const m = /^(p1|p2|cpu)-/.exec(el.id || "");
    if (m) return m[1] === "p1" ? 1 : 2;
    const panel = el.closest(".panel");
    if (panel && panel.querySelector("#p1-trance")) return 1;
    if (panel && panel.querySelector("#p2-trance")) return 2;
    return 1;
}
function helperPlayer(el) { const n = helperPlayerNum(el); return gameState && gameState["p" + n] ? gameState["p" + n] : { name: "Player", trance: 0, arousal: 0, energy: 0, transform: 0 }; }
function helperRerollsFor(arousal) { return arousal <= 2 ? 2 : (arousal <= 4 ? 1 : 0); }

const HELPER_DIE_TIPS = {
    TRANSFORM:  ["👁️ Transform", "Three matching 👁️ dice transform your opponent by 1 level, and each extra die adds 1 more. Reach level 10 to win."],
    SUBMISSION: ["⛓️ Submission", "Three matching ⛓️ dice push the Submission marker 1 point toward your opponent, and each extra die adds 1 more. A push past their end becomes Transform points."],
    AROUSAL:    ["🔥 Arousal", "Two or more 🔥 dice raise your opponent's Arousal (the number of dice minus one). High Arousal costs them rerolls."],
    SPIRAL:     ["🌀 Spiral", "Each 🌀 die adds 1 Trance to your opponent. At 5 Trance they suffer a Setback."],
    ENERGY:     ["⚡ Energy", "Each ⚡ die gives you 1 Energy to spend on market cards or a Wipe."],
    LUCIDITY:   ["💧 Lucidity", "Each 💧 die lets you lower your own Trance, Arousal or Vulnerability."],
    BLANK:      ["⬜ Blank", "A blank face does nothing."]
};



// What six dice of one face do (used by the Hyeri tip)
const HELPER_HYERI_FACES = {
    TRANSFORM:  "six 👁️ dice transform your opponent by 4 levels.",
    SUBMISSION: "six ⛓️ dice push the Submission marker 4 points toward your opponent.",
    AROUSAL:    "six 🔥 dice add 5 Arousal to your opponent (it stops at 5).",
    SPIRAL:     "six 🌀 dice add 6 Trance to your opponent, which causes a Setback.",
    ENERGY:     "six ⚡ dice give you 6 Energy.",
    LUCIDITY:   "six 💧 dice let you lower your own Trance, Arousal and Vulnerability a lot."
};

// ---------- card help: short definitions of the words a card might use ----------
const HELPER_GLOSSARY = [
    { re: /setback/i,                 term: "Setback",       def: "Happens when a player's Trance reaches 5. Whoever caused it chooses the effect, and the Trance drops by 5." },
    { re: /vulnerab/i,                term: "Vulnerability", def: "Each point takes away one die on your next turn (never fewer than 3). 💧 dice clear it." },
    { re: /lucidity|💧/i,              term: "Lucidity 💧",    def: "💧 dice let you lower your own Trance, Arousal or Vulnerability." },
    { re: /shield/i,                  term: "Shield",        def: "Rapid Pulse's shield blocks Trance and Arousal increases against you until your next turn." },
    { re: /submission|⛓️/i,           term: "Submission ⛓️",  def: "The tug-of-war marker (–5 to +5). A push past an end becomes Transform points, and ending your turn on your own end costs you +1 Transform." },
    { re: /transform|👁️/i,           term: "Transform 👁️",   def: "A player's transformation level, from 0 to 10. At 10 they lose the duel." },
    { re: /trance|🌀/i,               term: "Trance 🌀",      def: "Raised by 🌀 dice. At 5 it causes a Setback." },
    { re: /arousal|🔥/i,              term: "Arousal 🔥",     def: "Raised by 🔥 dice. It sets your rerolls: 0–2 = 2 rerolls, 3–4 = 1, 5 = 0." },
    { re: /energy|⚡/i,               term: "Energy ⚡",      def: "The currency for market cards and for wiping the market." },
    { re: /reroll/i,                  term: "Reroll",        def: "Rolling your unlocked dice again. Click dice first to lock the ones you want to keep." },
    { re: /deepen/i,                  term: "Deepen",        def: "Means increase." }
];
function helperCardTip(el) {
    const id = Number(el.dataset.cardId);
    const def = (typeof KNOWN_CARDS !== "undefined") ? KNOWN_CARDS.find(c => Number(c.id) === id) : null;
    if (!def) return null;
    const isMarket = el.classList.contains("card");
    const typeLine = def.type === "Instant"
        ? "💥 <b>Instant</b>: takes effect once, right when it is bought."
        : "🖐️ <b>Keep</b>: stays in play after it is bought and keeps working every turn.";
    let state = "";
    if (isMarket) {
        if (el.classList.contains("signature-blocked")) state = "Blocked by Alex's ability: defensive Submission cards are prohibited.";
        else if (el.classList.contains("already-owned")) state = "You already own this card, and you cannot buy a second copy.";
        else if (el.classList.contains("can-afford")) state = "You can afford this card.";
        else state = "You do not have enough ⚡ yet.";
    } else {
        state = def.type === "Instant" ? "Already used." : "In play.";
    }
    const text = String(def.desc || "");
    const words = HELPER_GLOSSARY.filter(g => g.re.test(text)).slice(0, 4)
        .map(g => `<div class="helper-gloss"><b>${g.term}:</b> ${g.def}</div>`).join("");
    return [helperEsc(def.name), `${typeLine}<br><i>${state}</i>${words ? "<hr>" + words : ""}`];
}

// ---------- the tips: first matching rule wins ----------
// sel = CSS selector.  h3 = text of a heading.  build(el) returns [title, html].
const HELPER_TIP_RULES = [
    // --- dice (specific) ---
    { sel: "#dice-container .die.special-die", build: () => ["Special Die", "From <b>Deeper Bargains</b>: three of this die's six sides show the chosen face and the other three are blank."] },
    { sel: "#dice-container .die", build: el => {
        const d = gameState && gameState.dice ? gameState.dice[Number(el.dataset.dieIndex)] : null;
        const face = d ? String(d.face) : "-";
        if (face === "-") return ["Dice", "Click <b>Roll Dice</b> to roll them."];
        const key = Object.keys(HELPER_DIE_TIPS).find(k => face.toUpperCase().includes(k)) || "BLANK";
        const humanTurn = gameState.activePlayer === 1 || gameState.gameMode !== "solo";
        return [HELPER_DIE_TIPS[key][0], HELPER_DIE_TIPS[key][1] + (humanTurn ? "<br><i>Click a die to lock it before you reroll.</i>" : "")];
    } },
    // --- buttons ---
    { sel: "#btn-roll", build: () => ["Roll / Reroll", "The first click rolls all your dice. Click dice to <b>lock</b> the ones you like, then <b>Reroll</b> the rest. Your rerolls are limited: see the Rerolls counter."] },
    { sel: "#btn-resolve", build: () => ["Resolve Dice", "Stop rolling and apply your dice: Transform, Submission, Trance, Arousal, Energy and Lucidity all take effect. Then you can shop and End Turn."] },
    { sel: "#btn-wipe-market", build: () => {
        const cost = typeof getMarketWipeCost === "function" ? getMarketWipeCost(gameState.activePlayer) : 2;
        return ["Wipe the Market", `Pay <b>${cost} ⚡</b> to discard every card in the row and deal three new ones. Available in your shop phase, after you resolve your dice.`];
    } },
    { sel: ".btn-end-turn", build: () => ["End Turn", "Pass the turn to your opponent. Do your shopping first: unspent Energy carries over."] },
    // --- stats (both players) ---
    { sel: "#p1-trance-label, #p1-trance, #p2-trance-label, #p2-trance", build: el => {
        const p = helperPlayer(el);
        return ["Trance 🌀", `Every 🌀 die you roll adds 1 Trance to your opponent. At <b>5 Trance</b> a <b>Setback</b> happens: whoever caused it chooses to push the Submission marker 2 points toward the victim's end, or add 2 Arousal (or +1 Transform with Physical Manipulation). Trance then drops by 5. Spend 💧 dice to lower your own.<br><i>${helperEsc(p.name)}: ${p.trance} / 5</i>`];
    } },
    { sel: "#p1-arousal-label, #p1-arousal, #p2-arousal-label, #p2-arousal", build: el => {
        const p = helperPlayer(el);
        return ["Arousal 🔥", `Your Arousal sets how many rerolls you get each turn: <b>0–2 🔥 = 2 rerolls, 3–4 = 1, 5 = 0</b>. Rolling two or more 🔥 dice raises your opponent's. Spend 💧 dice to lower your own.<br><i>${helperEsc(p.name)}: ${p.arousal} 🔥 = ${helperRerollsFor(p.arousal)} reroll${helperRerollsFor(p.arousal) === 1 ? "" : "s"}</i>`];
    } },
    { sel: "#p1-energy-label, #p1-energy, #p2-energy-label, #p2-energy", build: el => {
        const p = helperPlayer(el);
        return ["Energy ⚡", `Each ⚡ die you roll gives you 1 Energy. Spend it on market cards and to Wipe the market. It carries over from turn to turn.<br><i>${helperEsc(p.name)}: ${p.energy} ⚡</i>`];
    } },
    { sel: "#p1-vuln-container, #p2-vuln-container", build: () => ["Vulnerability 🪫", "Comes from <b>Powerful Transform</b>. Each point takes one die away from your next turn (you never roll fewer than 3). Spend 💧 dice to clear it."] },
    { sel: "#p1-transform-progress-track, #p1-transform-progress-label, #p2-transform-progress-track, #p2-transform-progress-label, .transform-progress-caption", build: el => {
        const p = helperPlayer(el);
        return ["Transformation", `How far along the transformation is, from 0 to 10. At <b>10</b> the duel is lost. It rises from 👁️ triples, from Submission pushed past the end of the track, and from certain cards.<br><i>${helperEsc(p.name)}: ${p.transform} / 10</i>`];
    } },
    // --- Lucidity dialog ---
    { sel: "#lucidity-row-trance", build: () => ["Lower Trance", "Each 💧 lowers your Trance by 1. Keeping it low avoids a <b>Setback</b> at 5, where your opponent chooses a punishment."] },
    { sel: "#lucidity-row-arousal", build: () => ["Lower Arousal", "Each 💧 lowers your Arousal by 1 (2 💧 each if your opponent has Burning Intensity). Lower Arousal means more rerolls: 0–2 🔥 = 2, 3–4 = 1, 5 = 0."] },
    { sel: "#lucidity-row-vuln", build: () => ["Clear Vulnerability", "Each 💧 removes 1 Vulnerability, which would otherwise take a die away on your next turn."] },
    { sel: "#lucidity-points-left", build: () => ["Points Available", "Spend all your 💧 to confirm, as long as something can still be lowered. Rows that are already at 0 cannot take points."] },
    // --- Setback dialog (the choice dialog whose title ends in "Setback!") ---
    { sel: "#choice-dialog h4", build: el => /setback!?$/i.test(el.textContent.trim())
        ? ["Setback", "A player's Trance reached 5. As the player who caused it, you choose the effect. Their Trance then drops by 5."] : null },
    { sel: "#choice-dialog button", build: el => {
        const t = el.textContent.trim();
        if (/^Push Submission/i.test(t)) return ["Push Submission 2", "Moves the Submission marker 2 points toward their end. A push past their end becomes Transform points, so this is strongest when the marker is already close to their end."];
        if (/Arousal \+2$/i.test(t)) return ["Arousal +2", "Raises their Arousal by 2 (it cannot go above 5). Higher Arousal gives them fewer rerolls: 3–4 🔥 = 1 reroll, 5 = 0."];
        if (/^Physical Manipulation/i.test(t)) return ["Physical Manipulation", "Transforms them by 1 level right now."];
        return null;
    } },
    // --- signature choice dialogs: Tex, Fable, Hyeri ---
    { sel: "#choice-dialog h4", build: el => {
        const t = el.textContent.trim();
        if (/^Tex/i.test(t)) return ["Tex · Twisted Dice", "Tex's special ability: after rolling, each ⛓️ Submission die can stay as ⛓️ or be converted to 🌀 Trance or 🔥 Arousal. (Any 🌀 Tex rolls himself comes up blank.)"];
        if (/^Fable/i.test(t)) return ["Fable · Lucid Reversal", "Fable's special ability: with three or more 💧 dice, she may spend three of them to lower her own Transform by 1."];
        if (/^Hyeri/i.test(t)) return ["Hyeri · Perfect Harmony", "Hyeri's special ability: when all six faces appear, every die changes to one face she chooses. Each face can be chosen only once per game."];
        return null;
    } },
    { sel: "#choice-dialog button", build: el => {
        const t = el.textContent.trim();
        // Tex
        if (/^Keep ⛓️ Submission/i.test(t)) return ["Keep as Submission", "Leave this die as ⛓️. Three or more ⛓️ dice push the Submission marker."];
        if (/^Convert to 🌀/i.test(t)) return ["Convert to Trance", "Turn this die into 🌀. Each 🌀 die adds 1 Trance to your opponent, and 5 Trance causes a Setback."];
        if (/^Convert to 🔥/i.test(t)) return ["Convert to Arousal", "Turn this die into 🔥. Two or more 🔥 dice raise your opponent's Arousal."];
        // Fable
        if (/^Spend 3/i.test(t)) return ["Spend 3 💧", "Uses three of your 💧 dice to lower your own Transform by 1. Any other 💧 dice still work as normal."];
        if (/^Keep Lucidity/i.test(t)) return ["Keep Lucidity", "Keep all your 💧 dice to lower your Trance, Arousal or Vulnerability instead."];
        // Hyeri: the buttons are the faces themselves
        const face = Object.keys(HELPER_HYERI_FACES).find(k => t.toUpperCase().includes(k));
        if (face) return [HELPER_DIE_TIPS[face][0], `All six dice become this face: ${HELPER_HYERI_FACES[face]} You can only pick each face once per game.`];
        return null;
    } },
    // --- cards (market and Active Cards) ---
    { sel: ".card[data-card-id], .inv-card[data-card-id]", build: el => helperCardTip(el) },
    // --- board areas ---
    { sel: ".track-container", build: () => ["Submission", "A tug-of-war marker from –5 to +5. ⛓️ triples (and some cards) push it toward your opponent's end. A push past an end becomes Transform points, and if the marker is on <b>your</b> end when your turn finishes, you obey and take +1 Transform."] },
    { sel: "#market-container", build: () => ["Market", "Three cards for sale. Click a card to buy it with ⚡. 🖐️ <b>Keep</b> cards stay in play under Active Cards; 💥 <b>Instant</b> cards take effect once. Buying refills the row."] },
    { h3: "Market", build: () => ["Market", "Three cards for sale. Click a card to buy it with ⚡. 🖐️ <b>Keep</b> cards stay in play; 💥 <b>Instant</b> cards take effect once."] },
    { sel: "#rerolls-indicator", build: () => {
        const left = gameState ? gameState.rerollsLeft : 0;
        return ["Rerolls", `<b>${left}</b> left this turn. Your base number depends on your Arousal (0–2 🔥 = 2, 3–4 = 1, 5 = 0), and some cards add more.`];
    } },
    { sel: "#last-effect-ticker", build: () => ["Last Effect", "The most recent card or ability effect, shown so you do not miss what just happened."] },
    { sel: "#phase-cue", build: () => ["What to do now", "This tells you the next step of your turn: roll, lock the dice you like, reroll, resolve, then shop and end your turn."] },
    { sel: ".turn-history-head h3, #turn-history-card h3", build: () => ["Turn Chronicle", "A step-by-step record of each turn. Use the ‹ › buttons to look back at earlier turns."] },
    { h3: "Last Roll", build: el => ["Last Roll", `The dice ${helperEsc(helperPlayer(el).name)} finished their previous turn with, so you can see what they were going for.`] },
    { sel: "#p1-last-roll, #cpu-last-roll", build: el => ["Last Roll", `The dice ${helperEsc(helperPlayer(el).name)} finished their previous turn with.`] },
    { h3: "Active Cards", build: () => ["Active Cards", "🖐️ Keep cards you have bought. They stay in play and keep working every turn. 💥 Instant cards are used up when bought, so they do not appear here."] },
    { sel: ".card-type-chip", build: el => {
        const t = el.textContent.trim();
        return t === "Instant"
            ? ["💥 Instant", "Takes effect once, right when you buy it."]
            : ["🖐️ Keep", "Stays in play after you buy it and keeps working every turn."];
    } },
    // --- special abilities ---
    { sel: ".signature-power-hint", build: () => ["Special Ability", "This character's special ability. It can be switched off for either player on the game setup screen."] },
    { sel: ".special-ability-box", build: () => ["Special Ability", "Each character has one special ability. Untick the box to play without it."] },
    // --- setup screen ---
    { sel: "#cpu-difficulty", build: () => ["CPU Difficulty", "Beginner and Easy play loosely. Normal is aggressive. Hard and Expert use stronger strategies, and Virtuoso and Master are the smartest and adapt to how you play."] },
    { sel: "#p1-transform-label, #cpu-transform-label", build: () => ["Transformation", "Pick the form this character will be transformed into. <b>Random</b> picks one at random from the forms available for that character."] }
];

// ---------- the floating box ----------
function ensureHelperTipEl() {
    if (!helperTipEl) {
        helperTipEl = document.createElement("div");
        helperTipEl.id = "helper-tip";
        helperTipEl.setAttribute("role", "tooltip");
        document.body.appendChild(helperTipEl);
    }
    return helperTipEl;
}
function findHelperTip(target) {
    if (!(target instanceof Element)) return null;
    for (const rule of HELPER_TIP_RULES) {
        let el = null;
        if (rule.sel) el = target.closest(rule.sel);
        else if (rule.h3) {
            const h = target.closest("h3");
            if (h && h.textContent.replace(/[^A-Za-z ]/g, "").trim().toLowerCase() === rule.h3.toLowerCase()) el = h;
        }
        if (el) {
            try { const content = rule.build(el); if (content) return { el, content }; } catch (e) { /* try the next rule */ }
        }
    }
    return null;
}
function showHelperTip(found) {
    const tip = ensureHelperTipEl();
    tip.innerHTML = `<div class="helper-tip-title">${found.content[0]}</div><div class="helper-tip-text">${found.content[1]}</div>`;
    tip.classList.add("measuring"); tip.classList.remove("show");
    const r = found.el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    let top = r.bottom + 8;
    if (top + th > window.innerHeight - 8) top = r.top - th - 8;
    top = Math.max(8, top);
    tip.style.left = left + "px"; tip.style.top = top + "px";
    tip.classList.remove("measuring"); tip.classList.add("show");
    helperTipAnchor = found.el;
    clearInterval(helperTipWatch);                          // the board is redrawn often: hide if the element disappears
    helperTipWatch = setInterval(() => { if (!helperTipAnchor || !document.body.contains(helperTipAnchor)) hideHelperTip(); }, 300);
}
function hideHelperTip() {
    clearTimeout(helperTipTimer); clearInterval(helperTipWatch); clearTimeout(helperTipTouchTimer);
    helperTipAnchor = null;
    if (helperTipEl) helperTipEl.classList.remove("show");
}


// ---------- one-time "tips are on" toast ----------
// Call showHelperTipsToastOnce() when the first game starts (see the hook note). It shows once per browser.
function showHelperTipsToastOnce() {
    if (!helperTipsEnabled) return;
    try { if (safeStorage.get(HELPER_TOAST_KEY) === "true") return; safeStorage.set(HELPER_TOAST_KEY, "true"); } catch (e) {}
    let t = document.getElementById("helper-toast");
    if (!t) { t = document.createElement("div"); t.id = "helper-toast"; document.body.appendChild(t); }
    t.textContent = "💡 Tips are on. Turn them off in Options.";
    t.onclick = () => t.classList.remove("show");
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => t.classList.remove("show"), 6500);
}

// ---------- events (delegated, so redrawn elements keep working) ----------
function initHelperTips() {
    loadHelperTipsSetting();
    document.addEventListener("mouseover", e => {
        if (!helperTipsEnabled) return;
        const found = findHelperTip(e.target);
        if (!found) { if (helperTipAnchor) hideHelperTip(); return; }
        if (found.el === helperTipAnchor) return;
        hideHelperTip();
        helperTipTimer = setTimeout(() => showHelperTip(found), HELPER_TIP_DELAY_MS);
    });
    document.addEventListener("mouseout", e => {
        if (!helperTipsEnabled) return;
        const to = e.relatedTarget;
        if (helperTipAnchor && to instanceof Node && helperTipAnchor.contains(to)) return;
        hideHelperTip();
    });
    document.addEventListener("focusin", e => { if (helperTipsEnabled) { const f = findHelperTip(e.target); if (f) showHelperTip(f); } });
    document.addEventListener("focusout", hideHelperTip);
    document.addEventListener("mousedown", hideHelperTip, true);
    document.addEventListener("scroll", hideHelperTip, true);
    document.addEventListener("keydown", e => { if (e.key === "Escape") hideHelperTip(); });
    // touch screens have no hover: press and hold for half a second
    document.addEventListener("touchstart", e => {
        if (!helperTipsEnabled) return;
        const found = findHelperTip(e.target);
        if (!found) return;
        clearTimeout(helperTipTouchTimer);
        helperTipTouchTimer = setTimeout(() => {
            helperTipSuppressClick = true;                  // don't also "click" the button that was held
            showHelperTip(found);
            setTimeout(hideHelperTip, 4500);
        }, 500);
    }, { passive: true });
    document.addEventListener("touchend", () => clearTimeout(helperTipTouchTimer), { passive: true });
    document.addEventListener("touchmove", () => clearTimeout(helperTipTouchTimer), { passive: true });
    document.addEventListener("click", e => {
        if (helperTipSuppressClick) { helperTipSuppressClick = false; e.stopPropagation(); e.preventDefault(); }
    }, true);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHelperTips);
else initHelperTips();
