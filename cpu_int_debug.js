// ============================================================
// CPU SMARTS: strategy synergies, power counters, Deeper Bargains lock
// Written against hypbattle_d2eb06.js (+ the arousal patch).
//
// SMART TIERS
//   tier 2 = Virtuoso ("transformer") and Master ("adaptive")  -> everything below
//   tier 1 = Hard ("v23low") and Expert ("defensive")          -> power counters, deny/want cards, cheaper buying
//   tier 0 = Beginner / Easy / Normal                          -> unchanged (except the Deeper Bargains lock)
//
// PART 1 = new code. Paste the whole block anywhere in the CPU section (for example above cpuApplySignatureKeepPlan).
// ============================================================
// ============================================================
// IVY CPU DIAGNOSTICS
// ============================================================

const IVY_CPU_DEBUG = true;

function ivyCpuDebug(message, data = null) {
    if (!IVY_CPU_DEBUG) return;

    if (data !== null) {
        console.log(`[IVY DEBUG] ${message}`, data);
    } else {
        console.log(`[IVY DEBUG] ${message}`);
    }
}

// ############################################################
// PART 1: NEW CODE
// ############################################################

function cpuSmartTier() {
    const d = getCpuDifficulty();
    if (d === "adaptive" || d === "transformer") return 2;
    if (d === "v23low" || d === "defensive") return 1;
    return 0;
}

// ---------- who is the CPU, who is the human (only abilities that are switched ON count) ----------
const CPU_POWER_KEYS = ["alex", "roz", "xander", "siobhan", "tex", "luci", "zixuan", "hyeri", "mark", "fable"];
function cpuOwnPower()      { return CPU_POWER_KEYS.find(k => hasSignaturePower(2, k)) || null; }
function cpuOpponentPower() { return CPU_POWER_KEYS.find(k => hasSignaturePower(1, k)) || null; }

// ---------- card groups ----------
const CPU_REROLL_CARDS = [43, 20, 16, 54];                       // Mental Awakening, Absolute Focus, Hypnotic Suggestion, Burning Up
const CPU_SUBMISSION_KEEPS = [36, 15, 46, 24, 23, 34, 22];       // offensive ⛓️ cards that stay in play
const CPU_BIG_SUBMISSION_INSTANTS = [10, 39, 8, 18, 11];          // big instant ⛓️ pushes
const CPU_TRANCE_BOOST_CARDS = [0, 31, 14, 8, 18, 17];
const CPU_ENERGY_CARDS = [45, 28, 29, 27, 19];
const CPU_BIG_INSTANTS = [10, 39, 30, 8, 4];

// What the CPU does NOT want the HUMAN to get, by the human's ability.
// (The CPU also gets a bonus for buying these itself, because that keeps them from the human.)
const CPU_DENY_VS_POWER = {
    hyeri:   { cards: [...CPU_REROLL_CARDS, 7],               pts: 35 },   // rerolls and the extra die feed Perfect Harmony
    xander:  { cards: [13, 48, 49, 56, 6],                    pts: 35 },   // arousal cards
    luci:    { cards: CPU_SUBMISSION_KEEPS,                   pts: 30 },
    siobhan: { cards: [...CPU_REROLL_CARDS, 56],              pts: 35 },
    tex:     { cards: [13, 49, 48, 23, 0, 31, 14],            pts: 30 },   // arousal first, trance second
    alex:    { cards: CPU_SUBMISSION_KEEPS,                   pts: 30 },
    zixuan:  { cards: [...CPU_ENERGY_CARDS, 31],              pts: 30 },
    mark:    { cards: CPU_TRANCE_BOOST_CARDS,                 pts: 30 },
    roz:     { cards: CPU_REROLL_CARDS,                       pts: 30 },
    fable:   { cards: [7, 9, ...CPU_REROLL_CARDS],            pts: 20 }    // MY SUGGESTION: more dice and bigger 💧 make her 3-💧 reversal easier
};

// What the CPU WANTS when it faces that human ability.
const CPU_WANT_VS_POWER = {
    alex:  { cards: [...CPU_BIG_SUBMISSION_INSTANTS, 53], pts: 25 },       // push him back instead of getting pinned (53 = I Will Not Obey)
    fable: { cards: [41],                                  pts: 20 }       // MY SUGGESTION: Powerful Transform = fewer dice = harder to roll 3 💧
};

// What the CPU wants for its OWN ability.
const CPU_WANT_OWN_POWER = {
    hyeri:   { cards: [...CPU_REROLL_CARDS, 7, 3],        pts: 30 },       // six different faces: Perfect Harmony + Trigger Word
    siobhan: { cards: CPU_REROLL_CARDS,                   pts: 30 },
    mark:    { cards: CPU_TRANCE_BOOST_CARDS,             pts: 30 },
    alex:    { cards: CPU_SUBMISSION_KEEPS,               pts: 30 },
    zixuan:  { cards: CPU_ENERGY_CARDS,                   pts: 25 },
    luci:    { cards: CPU_SUBMISSION_KEEPS,               pts: 20 }
};

// Strategy pressure added to the CPU's plan scores for its own ability...
const CPU_POWER_PLAN_BIAS = {
    alex:   { submission: 3 },
    luci:   { submission: 3 },
    mark:   { trance: 3 },
    xander: { arousal: 3 },
    zixuan: { energy: 2, trance: 1.5, submission: 1.5 }
};
// ...and to its reading of what the human is building, from the human's ability.
const CPU_POWER_THREATS = {
    xander: { arousal: 3 },
    tex:    { arousal: 3, trance: 1.5 },
    mark:   { trance: 3 },
    luci:   { submission: 3 },
    alex:   { submission: 2 },
    zixuan: { energy: 3 }
};

function cpuApplySmartPlanBias(scores) {
    if (cpuSmartTier() < 2) return;
    const has = id => hasCard(2, id);
    if (has(23) || has(24)) scores.submission += 2;                       // Submissive Flush / Somnambulism: ⛓️ triples pay double
    if (has(13)) scores.arousal += 2;                                      // Stoking Fires
    if (has(0) && scores.submission >= 1.5) scores.trance += 1;           // Deep Gaze rides along with a submission push
    if (has(31)) {                                                         // Falling Sensation: 6 ⚡ = +2 🌀 every turn
        scores.trance += 1.5; scores.energy += 1.5;
        if (scores.submission >= 1.5) scores.submission += 1;
    }
    const bias = CPU_POWER_PLAN_BIAS[cpuOwnPower()];
    if (bias) Object.keys(bias).forEach(k => { scores[k] = (scores[k] || 0) + bias[k]; });
    if (cpuOpponentPower() === "tex") scores.submission += 3;             // attack Tex's submission
}
function cpuApplyPowerThreats(oppScores) {
    if (cpuSmartTier() < 2) return;
    const t = CPU_POWER_THREATS[cpuOpponentPower()];
    if (t) Object.keys(t).forEach(k => { oppScores[k] = (oppScores[k] || 0) + t[k]; });
}

// ---------- Falling Sensation mode ----------
// We own it and the submission tracker is on the HUMAN's side: trance and energy are the plan, and we don't spend energy
// below a multiple of 6 (every full 6 ⚡ at the end of the turn is +2 🌀 for the human).
function cpuFallingSensationMode() {
    return cpuSmartTier() >= 2 && hasCard(2, 31) && gameState.submission <= -1;
}
function cpuCanSpendKeepingFS(cost) {
    if (!cpuFallingSensationMode()) return true;
    const e = gameState.p2.energy;
    return Math.floor((e - cost) / 6) >= Math.floor(e / 6);
}

// ---------- dice weights (called at the end of cpuFaceWeights) ----------
function cpuSynergyFaceWeights(w) {
    const tier = cpuSmartTier();
    if (tier < 1) return w;
    const p = gameState.p2, has = id => hasCard(2, id);
    w.EN += tier >= 2 ? 0.15 : 0.10;                                       // above Normal: energy and buying cards are good
    if (tier < 2) return w;

    const subPlan = cpuBrain.plan === "submission" || (cpuBrain.planScores.submission || 0) >= 2;
    if (has(23) || has(24)) w.SU += 0.3;                                   // Submissive Flush / Somnambulism
    if (has(22)) {                                                         // Mental Shackles: 👁️ triples already push ⛓️ by 1
        w.TR += 0.35;
        if (Math.max(0, gameState.submission) < 2) w.SU = Math.max(0.2, w.SU - 0.25);   // not while we are being pushed toward the end
    }
    if (has(0) && subPlan) w.SP += 0.35;                                   // Deep Gaze: start going for 🌀 too
    if (cpuFallingSensationMode()) { w.SP += 0.5; w.EN += 0.5; w.TR = Math.max(0.3, w.TR - 0.2); }
    else if (has(31) && subPlan) { w.SP += 0.2; w.EN += 0.25; }
    if (hasSignaturePower(2, "mark")) w.SP += 0.3;                         // Lingering Trance
    if (hasSignaturePower(2, "zixuan") && has(31)) { w.SP += 0.2; w.SU += 0.2; }
    return w;
}

// ---------- dice locking rules (called at the end of cpuApplySignatureKeepPlan) ----------
function cpuSmartKeepRules(keep, faces, counts) {
    if (cpuSmartTier() < 2) return keep;
    const p = gameState.p2, opp = gameState.p1;
    // Fable: above 6 Transform, hunting three 💧 gets more important the closer she is to 10; below 7 she doesn't try on purpose
    if (hasSignaturePower(2, "fable") && p.transform > 6) {
        const need = p.transform >= 8 ? 1 : 2;                             // 7: only a pair is worth locking; 8+: every 💧
        if (counts.LU >= need) faces.forEach((f, i) => { if (f === "LU") keep[i] = true; });
    }
    // Falling Sensation mode: lock 🌀 (until their trance is full) and ⚡
    if (cpuFallingSensationMode()) {
        faces.forEach((f, i) => {
            if (f === "EN") keep[i] = true;
            if (f === "SP" && opp.trance < 5) keep[i] = true;
        });
    }
    return keep;
}

// Deeper Bargains: when the special die shows its real face (not Blank) the CPU always locks it.
// The special die is always the FIRST die (index 0). Used at every level.
function cpuLockSpecialDie(keep) {
    const card = (gameState.p2.inventory || []).find(c => c && Number(c.id) === 56);
    if (!card || !card.chosenFace) return keep;
    const die = gameState.dice[0];
    if (die && cpuFaceKey(die.face) && cpuFaceKey(die.face) === cpuFaceKey(card.chosenFace)) keep[0] = true;
    return keep;
}

// ---------- card values ----------
function cpuPowerDeny(card) {                // raw "keep this from the human" points for the human's ability
    if (cpuSmartTier() < 1) return 0;
    const d = CPU_DENY_VS_POWER[cpuOpponentPower()];
    return (d && d.cards.includes(Number(card.id))) ? d.pts : 0;
}
function cpuNewIdentityBonus() {              // New Identity is for when we are losing the transform race
    const p2 = gameState.p2, p1 = gameState.p1;
    if (p2.transform < 5) return 0;
    return Math.min(70, (p2.transform - 4) * 10 + Math.max(0, p1.transform - p2.transform) * 6);
}
// The best thing Hypnotic Dominance could take from the human right now (own value + how much it hurts them)
function cpuStealValue(scoreFn) {
    const p = gameState.p2, human = gameState.p1;
    let best = 0;
    (human.inventory || []).forEach(c => {
        if (!c || Number(c.id) === 5 || inventoryHasName(p, c.name)) return;
        best = Math.max(best, scoreFn(c) + 0.6 * cpuDenyScore(c));
    });
    return best;
}
// Extra score for a market card. scoreFn(card) is that level's own card scorer.
function cpuSmartCardBonus(card, scoreFn) {
    const tier = cpuSmartTier();
    if (tier < 1) return 0;
    const id = Number(card.id), has = x => hasCard(2, x);
    const oppKey = cpuOpponentPower(), ownKey = cpuOwnPower();
    let b = 0;

    b += cpuPowerDeny(card) * 0.6;                                          // buying it keeps it from them
    const want = CPU_WANT_VS_POWER[oppKey];
    if (want && want.cards.includes(id)) b += want.pts;
    const own = CPU_WANT_OWN_POWER[ownKey];
    if (own && own.cards.includes(id)) b += own.pts;
    if (tier < 2) return b;

    const subPlan = cpuBrain.plan === "submission" || (cpuBrain.planScores.submission || 0) >= 2 || gameState.submission <= -1;
    if (id === 0 && subPlan) b += 20;                                       // Deep Gaze with a submission push
    if (id === 31 && subPlan) b += 25;                                      // Falling Sensation with a submission push
    if (id === 31 && ownKey === "zixuan") b += 45;                          // Zixuan: energy + Falling Sensation is the engine
    if (ownKey === "zixuan" && !has(31) && CPU_BIG_INSTANTS.includes(id)) b += 20;   // without it: big instant cards
    if (id === 38) b += cpuNewIdentityBonus();                              // losing: New Identity is a good card
    if (id === 5) b += Math.min(45, cpuStealValue(scoreFn) * 0.45);        // Hypnotic Dominance: worth what it can take
    if (id === 3 && (ownKey === "hyeri") ) b += 10;                         // Trigger Word and Perfect Harmony want the same six faces
    return b;
}

// Hypnotic Dominance: pick the BEST card to take (own value + how much it hurts the human), not just the first good one
function cpuBestSnipe(scoreFn, minValue) {
    const p = gameState.p2, human = gameState.p1;
    let best = null;
    (human.inventory || []).forEach((c, i) => {
        if (!c || Number(c.id) === 5 || inventoryHasName(p, c.name) || p.energy < c.cost) return;
        if (!passesCardSpecificConditions(c)) return;
        const own = scoreFn(c);
        if (own < minValue) return;
        const value = own + 0.6 * cpuDenyScore(c);
        if (!best || value > best.value) best = { idx: i, name: c.name, value };
    });
    return best;
}

// ============================================================
// IVY — SUGGESTED TRANSFERENCE
// ============================================================

// Enable only while testing Ivy's opponent-exchange variation.
const IVY_DEBUG_OPPONENT_EXCHANGE = false;


// ============================================================
// IVY — SHARED SUGGESTED TRANSFERENCE PRESENTATION
// Used by human Ivy, CPU Ivy, and the remote online player.
// ============================================================

let ivyLastDisplayedExchangeId = null;

function ivyEscapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[ch]));
}

function ivyExchangeCardHTML(card, label) {
    const name = ivyEscapeHTML(card?.name || "Unknown Card");
    const type = ivyEscapeHTML(card?.type || "Keep");
    const desc = ivyEscapeHTML(card?.desc || "");
    const cost = Number(card?.cost) || 0;

    return `
        <div class="ivy-animation-card">
            <div class="ivy-animation-label">${ivyEscapeHTML(label)}</div>
            <div class="ivy-animation-card-inner">
                <div class="ivy-animation-card-header">
                    <strong>${name}</strong>
                    <span>${cost}⚡</span>
                </div>
                <div class="ivy-animation-card-type">${type}</div>
                <div class="ivy-animation-card-desc">${desc}</div>
            </div>
        </div>
    `;
}

function showIvyExchangeAnimation(event) {
    if (!event || !event.id || !event.oldCard || !event.newCard) return;

    // Avoid displaying the same synchronized event more than once.
    if (event.id === ivyLastDisplayedExchangeId) return;
    ivyLastDisplayedExchangeId = event.id;

    const previous = document.getElementById("ivy-exchange-animation");
    if (previous) previous.remove();

    const overlay = document.createElement("div");
    overlay.id = "ivy-exchange-animation";

    const playerName = ivyEscapeHTML(event.playerName || "Ivy");
    const oldName = ivyEscapeHTML(event.oldCard.name);
    const newName = ivyEscapeHTML(event.newCard.name);

    overlay.innerHTML = `
        <div class="ivy-animation-panel">
            <div class="ivy-animation-heading">SUGGESTED TRANSFERENCE</div>
            <div class="ivy-animation-subheading">
                ${playerName} exchanges one card for another
            </div>

            <div class="ivy-animation-stage">
                ${ivyExchangeCardHTML(event.oldCard, "RETURNING TO MARKET")}
                <div class="ivy-animation-spark">✧</div>
                ${ivyExchangeCardHTML(event.newCard, "JOINING INVENTORY")}
            </div>

            <div class="ivy-animation-message">
                ${playerName} used Suggested Transference to exchange
                <strong>${oldName}</strong> for <strong>${newName}</strong>!
            </div>

            <button type="button" class="ivy-animation-continue"
                    onclick="closeIvyExchangeAnimation()">
                Continue
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Start the card movement after the overlay has entered the document.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add("ivy-animation-active"));
    });

    // Automatically dismiss if the player does not press Continue.
    overlay._ivyTimer = setTimeout(closeIvyExchangeAnimation, 5000);
}

function closeIvyExchangeAnimation() {
    const overlay = document.getElementById("ivy-exchange-animation");
    if (!overlay) return;

    if (overlay._ivyTimer) clearTimeout(overlay._ivyTimer);
    overlay.classList.add("ivy-animation-closing");

    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 250);
}

// Record and display an exchange on the client that performed it.
// The event is included in gameState so Firebase sends it to the other player.
function ivyPublishExchangeAnimation(playerId, oldCard, newCard) {
    const player = playerId === 1 ? gameState.p1 : gameState.p2;

    const event = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        playerId,
        playerName: player?.name || (playerId === 2 ? "Ivy" : "Player"),
        oldCard: { ...oldCard },
        newCard: { ...newCard },
        round: gameState.round
    };

    gameState.ivyExchangeEvent = event;

    // Mark it as already displayed locally before Firebase echoes it back.
    ivyLastDisplayedExchangeId = event.id;
    showIvyExchangeAnimation(event);

    return event;
}


// Returns true when this card can be exchanged by Ivy.
function ivyCanExchangeCard(card, player) {
    if (!card || card.type !== "Keep") return false;

    // A card cannot be exchanged during the round in which it was acquired.
    if (
        Number.isFinite(Number(card.acquiredRound)) &&
        Number(card.acquiredRound) === Number(gameState.round)
    ) {
        return false;
    }

    return true;
}

function ivyCanUseExchange(playerId) {
    const p = playerId === 1 ? gameState.p1 : gameState.p2;

    return (
        hasSignaturePower(playerId, "ivy") &&
        gameState.activePlayer === playerId &&
        gameState.phase === "shop" &&
        !p.ivyExchangeUsedThisTurn
    );
}

// Show the available market exchanges for one of Ivy's Keep cards.
function openIvyTransference(inventoryIndex, playerId) {
    if (!ivyCanUseExchange(playerId)) return;

    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const offeredCard = p.inventory[inventoryIndex];

    if (!ivyCanExchangeCard(offeredCard, p)) return;

    const options = market
        .map((card, marketIndex) => ({ card, marketIndex }))
        .filter(({ card }) =>
            card &&
            Number(card.cost) <= Number(offeredCard.cost) &&
            !inventoryHasName(p, card.name)
        );

    if (!options.length) {
        showPopup(
            "Suggested Transference",
            "There are no eligible market cards of equal or lower Energy cost."
        );
        return;
    }

    const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

    const choices = options.map(({ card, marketIndex }) => `
        <div class="ivy-exchange-option">
            <strong>${esc(card.name)}</strong>
            <span>${Number(card.cost)}⚡ · ${esc(card.type)}</span>
            <p>${esc(card.desc || "")}</p>
            <button onclick="ivyExchangeWithMarket(${inventoryIndex}, ${marketIndex}, ${playerId})">
                Exchange for this card
            </button>
        </div>
    `).join("");

    showPopup(
        "Suggested Transference",
        `<p>Exchange <strong>${esc(offeredCard.name)}</strong> (Cost: ${offeredCard.cost}⚡) for one of these cards:</p>
         <div class="ivy-exchange-list">${choices}</div>`
    );
}

// Perform the actual market exchange.
function ivyExchangeWithMarket(inventoryIndex, marketIndex, playerId) {
    if (!ivyCanUseExchange(playerId)) return false;

    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const offeredCard = p.inventory[inventoryIndex];
    const receivedCard = market[marketIndex];

    if (!ivyCanExchangeCard(offeredCard, p) || !receivedCard) return false;

    if (Number(receivedCard.cost) > Number(offeredCard.cost)) {
        showPopup("Suggested Transference", "That card costs more than the card Ivy is offering.");
        return false;
    }

    if (inventoryHasName(p, receivedCard.name)) {
        showPopup("Suggested Transference", "Ivy already owns that card.");
        return false;
    }

    // Remove the offered card and take the market card.
    p.inventory.splice(inventoryIndex, 1);
    market.splice(marketIndex, 1);

    // The offered card replaces the market card.
    market.splice(marketIndex, 0, offeredCard);

    p.inventory.push(receivedCard);
    p.ivyExchangeUsedThisTurn = true;

    log(`${p.name} used Suggested Transference: exchanged ${offeredCard.name} for ${receivedCard.name}.`);
    playSound("card");

    closePopup();
    syncToFirebase();
    updateUI();

    return true;
}

// DEBUG ONLY: Ivy exchanges one of her eligible Keep cards
// for an opponent's Keep card of equal or lower cost.
function openIvyOpponentTransference(inventoryIndex, playerId) {
    if (!IVY_DEBUG_OPPONENT_EXCHANGE) return;
    if (!ivyCanUseExchange(playerId)) return;

    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const opponentId = playerId === 1 ? 2 : 1;
    const opponent = opponentId === 1 ? gameState.p1 : gameState.p2;
    const offeredCard = p.inventory[inventoryIndex];

    if (!ivyCanExchangeCard(offeredCard, p)) return;

    const options = opponent.inventory
        .map((card, index) => ({ card, index }))
        .filter(({ card }) =>
            card &&
            card.type === "Keep" &&
            Number(card.cost) <= Number(offeredCard.cost) &&
            !inventoryHasName(p, card.name)
        );

    if (!options.length) {
        showPopup("Suggested Transference", "The opponent has no eligible Keep cards to exchange.");
        return;
    }

    const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

    const choices = options.map(({ card, index }) => `
        <div class="ivy-exchange-option">
            <strong>${esc(card.name)}</strong>
            <span>${Number(card.cost)}⚡</span>
            <p>${esc(card.desc || "")}</p>
            <button onclick="ivyExchangeWithOpponent(${inventoryIndex}, ${index}, ${playerId})">
                Force this exchange
            </button>
        </div>
    `).join("");

    showPopup(
        "Suggested Transference — Debug",
        `<p>Exchange <strong>${esc(offeredCard.name)}</strong> for one of the opponent's cards:</p>
         <div class="ivy-exchange-list">${choices}</div>`
    );
}

function ivyExchangeWithOpponent(inventoryIndex, opponentIndex, playerId) {
    if (!IVY_DEBUG_OPPONENT_EXCHANGE || !ivyCanUseExchange(playerId)) return false;

    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const opponentId = playerId === 1 ? 2 : 1;
    const opponent = opponentId === 1 ? gameState.p1 : gameState.p2;

    const offeredCard = p.inventory[inventoryIndex];
    const receivedCard = opponent.inventory[opponentIndex];

    if (!ivyCanExchangeCard(offeredCard, p) || !receivedCard || receivedCard.type !== "Keep") return false;

    if (Number(receivedCard.cost) > Number(offeredCard.cost)) return false;
    if (inventoryHasName(p, receivedCard.name)) return false;

    p.inventory.splice(inventoryIndex, 1);
    opponent.inventory.splice(opponentIndex, 1);

    p.inventory.push(receivedCard);
    opponent.inventory.push(offeredCard);

    p.ivyExchangeUsedThisTurn = true;

    log(`${p.name} used Suggested Transference to exchange ${offeredCard.name} for ${opponent.name}'s ${receivedCard.name}.`);
    playSound("card");

    closePopup();
    syncToFirebase();
    updateUI();

    return true;
}

// ============================================================
// IVY CPU — SUGGESTED TRANSFERENCE STRATEGY
// ============================================================

// These lists are deliberately editable.
// Card IDs refer to the existing card definitions.
const IVY_CARD_PREFERENCES = {
    // Cards Ivy particularly likes in most situations.
    favorites: [
        7,  // Trance Anchor
        17, // Physical Manipulation
        41, // Powerful Transform
        43  // Mental Awakening
    ],

    // Cards that help Ivy pursue transformation.
    transformation: [
        2,  // Dream State
        16, // Hypnotic Suggestion
        17, // Physical Manipulation
        41, // Powerful Transform
        43, // Mental Awakening
        47  // Fading Reality
    ],

    // Cards that help Ivy defend herself.
    defensive: [
        9,  // Deep Safeties
        12, // Rapid Pulse
        21, // Switch Play
        33, // Quiet Mind
        35, // Mesmerizing Rhythm
        44, // Flow Reversal
        //53, // I Will Not Obey
        59//, // Transformation Sigil
        //61  // Blank
    ],

    // Cards that help Ivy pressure the opponent.
    offensive: [
        3,  // Trigger Word
        8,  // Mind Fog
        13, // Stoking Fires
        15, // Altered State
        22, // Mental Shackles
        34, // Cognitive Override
        36  // Deeper Trance
    ]
};

// Determine what Ivy currently needs most.
function ivyCpuCurrentPlan() {
    const p = gameState.p2;
    const opponent = gameState.p1;

    // Survival comes first if Ivy is in danger.
    if (
        p.trance >= 3 ||
        p.arousal >= 3 ||
        gameState.submission >= 3 ||
        p.vulnerability > 0
    ) {
        return "defensive";
    }

    // Transformation strategy: prefer cards that amplify Transform dice.
    if (
        p.transform >= 3 ||
        opponent.transform >= 4 ||
        gameState.p2.difficulty === "transformer"
    ) {
        return "transformation";
    }

    return "offensive";
}

// Calculate how much Ivy values a card right now.
function ivyCpuCardValue(card, plan) {
    if (!card) return 0;

    const difficulty = String(gameState.p2.difficulty || "adaptive").toLowerCase();
    const base =
        Number(card.ai?.[difficulty] ??
        card.ai?.adaptive ??
        card.ai?.transformer ??
        30);

    let score = base;

    if (IVY_CARD_PREFERENCES.favorites.includes(Number(card.id))) {
        score += 12;
    }

    if (plan === "defensive" &&
        IVY_CARD_PREFERENCES.defensive.includes(Number(card.id))) {
        score += 25;
    }

    if (plan === "transformation" &&
        IVY_CARD_PREFERENCES.transformation.includes(Number(card.id))) {
        score += 25;
    }

    if (plan === "offensive" &&
        IVY_CARD_PREFERENCES.offensive.includes(Number(card.id))) {
        score += 20;
    }

    return score;
}

// Try one exchange at the beginning of Ivy's CPU shop phase.
function ivyCpuTryExchange() {
    const p = gameState.p2;

    ivyCpuDebug("Exchange attempt started", {
        name: p.name,
        difficulty: p.difficulty,
        activePlayer: gameState.activePlayer,
        phase: gameState.phase,
        round: gameState.round,
        exchangeUsed: p.ivyExchangeUsedThisTurn
    });

    if (!hasSignaturePower(2, "ivy")) {
        ivyCpuDebug("STOPPED: Ivy's signature power was not detected.");
        return false;
    }

    if (p.ivyExchangeUsedThisTurn) {
        ivyCpuDebug("STOPPED: Ivy has already exchanged this turn.");
        return false;
    }

    if (!hasSignaturePower(2, "ivy")) return false;
    if (p.ivyExchangeUsedThisTurn) return false;

    const plan = ivyCpuCurrentPlan();

    const ownedCards = p.inventory
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => ivyCanExchangeCard(card, p));
		
	const allOwnedKeepCards = p.inventory
    .filter(card => card && card.type === "Keep")
    .map(card => {
        const eligible = ivyCanExchangeCard(card, p);

        return {
            id: card.id,
            name: card.name,
            cost: card.cost,
            acquiredRound: card.acquiredRound,
            currentRound: gameState.round,
            eligible,
            reason: eligible
                ? "Eligible"
                : "Acquired this round or otherwise ineligible"
        };
    });

ivyCpuDebug("ALL owned Keep cards (including ineligible):",
    allOwnedKeepCards
);

    const marketCards = market
    .map((card, index) => ({ card, index }))
    .filter(({ card }) =>
        card &&
        card.type === "Keep" &&
        Number.isFinite(Number(card.cost)) &&
        !inventoryHasName(p, card.name)
    );
	
	ivyCpuDebug("Current exchange plan:", plan);

ivyCpuDebug("Eligible owned Keep cards:",
    ownedCards.map(({ card }) => ({
        id: card.id,
        name: card.name,
        cost: card.cost,
        acquiredRound: card.acquiredRound,
        score: ivyCpuCardValue(card, plan)
    }))
);

ivyCpuDebug("Eligible market Keep cards:",
    marketCards.map(({ card }) => ({
        id: card.id,
        name: card.name,
        cost: card.cost,
        score: ivyCpuCardValue(card, plan)
    }))
);

    let bestExchange = null;

    for (const owned of ownedCards) {
        for (const candidate of marketCards) {
            if (Number(candidate.card.cost) > Number(owned.card.cost)) continue;

            const oldValue = ivyCpuCardValue(owned.card, plan);
            const newValue = ivyCpuCardValue(candidate.card, plan);
            const improvement = newValue - oldValue;
			
			ivyCpuDebug("Comparing exchange:", {
    givingUp: owned.card.name,
    givingUpCost: owned.card.cost,
    givingUpScore: oldValue,

    receiving: candidate.card.name,
    receivingCost: candidate.card.cost,
    receivingScore: newValue,

    improvement,
    requiredImprovement: 8
});

            // Ivy only trades when the new card is meaningfully better.
            if (improvement < 8) continue;

            if (!bestExchange || improvement > bestExchange.improvement) {
                bestExchange = {
                    ownedIndex: owned.index,
                    marketIndex: candidate.index,
                    oldCard: owned.card,
                    newCard: candidate.card,
                    improvement
                };
            }
        }
    }

    if (!bestExchange) {
    ivyCpuDebug("DECISION: No exchange selected. No candidate met the improvement threshold.");
    return false;
}

ivyCpuDebug("DECISION: Ivy selected an exchange:", bestExchange);

    const oldCard = p.inventory[bestExchange.ownedIndex];
    const newCard = market[bestExchange.marketIndex];

    p.inventory.splice(bestExchange.ownedIndex, 1);
    market.splice(bestExchange.marketIndex, 1);
    market.splice(bestExchange.marketIndex, 0, oldCard);
    p.inventory.push(newCard);

    p.ivyExchangeUsedThisTurn = true;

    cpuSay(
        `Uses Suggested Transference to exchange ${oldCard.name} for ${newCard.name} (${plan} strategy).`
    );

    syncToFirebase();
    updateUI();

    return true;
}