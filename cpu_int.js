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
    cpuRescueFaceWeights(w); cpuForecastFaceWeights(w); cpuStyleFaceWeights(w);
    return cpuEndgameFaceWeights(w);
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
    return cpuEndgameKeepRules(keep, faces, counts);
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
	b += cpuEndgameCardBonus(card);
	b += cpuForesightCardBonus(card) + cpuStyleCardBonus(card);
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
const IVY_DEBUG_OPPONENT_EXCHANGE = true;


// ============================================================
// IVY — SHARED SUGGESTED TRANSFERENCE PRESENTATION
// Used by human Ivy, CPU Ivy, and the remote online player.
// ============================================================

let ivyLastDisplayedExchangeId = null;
let ivyFirebaseInitialSnapshotSeen = false;

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
	
	const isOpponentExchange = event.exchangeType === "opponent";

	const animationTitle = isOpponentExchange
		? "Rival Transference"
		: "Suggested Transference";

	const oldCardLabel = isOpponentExchange
		? "GIVING TO OPPONENT"
		: "RETURNING TO MARKET";

	const newCardLabel = isOpponentExchange
		? "RECEIVED FROM OPPONENT"
		: "ACQUIRED FROM MARKET";

	const animationMessage = isOpponentExchange
		? `${event.playerName} exchanged cards with the opposing player!`
		: `${event.playerName} returned one card to the market and acquired another!`;

    overlay.innerHTML = `
        <div class="ivy-animation-panel">
            <div class="ivy-animation-heading">SUGGESTED TRANSFERENCE</div>
            <div class="ivy-animation-subheading">
                ${playerName} exchanges one card for another
            </div>

            <div class="ivy-animation-stage">
                ${ivyExchangeCardHTML(event.oldCard, oldCardLabel)}
                <div class="ivy-animation-spark">✧</div>
                ${ivyExchangeCardHTML(event.newCard, newCardLabel)}
            </div>

            <div class="ivy-animation-message">
                ${playerName} used <em>Suggested Transference</em> to exchange
                <strong>${oldName}</strong> for <strong>${newName}</strong>!
            </div>

            <button type="button" class="ivy-animation-continue"
                    onclick="closeIvyExchangeAnimation()">
                Continue
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Show both cards in their original positions before starting the swap.
	// Increase IVY_EXCHANGE_REVEAL_DELAY to make this pause longer.
	const IVY_EXCHANGE_REVEAL_DELAY = 2000;

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			setTimeout(() => {
				overlay.classList.add("ivy-animation-active");
			}, IVY_EXCHANGE_REVEAL_DELAY);
		});
	});
	
	overlay.classList.toggle("ivy-opponent-exchange", isOpponentExchange);

	// No automatic dismissal. The player must press Continue.
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
function ivyPublishExchangeAnimation(playerId, oldCard, newCard, exchangeType = "market") {
    const player = playerId === 1 ? gameState.p1 : gameState.p2;

    const event = {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		playerId,
		playerName: player?.name || (playerId === 2 ? "Ivy" : "Player"),
		oldCard: {...oldCard},
		newCard: {...newCard},
		round: gameState.round,
		exchangeType
	};

    gameState.ivyExchangeEvent = event;

    // Display locally. showIvyExchangeAnimation() records the event ID itself.
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
			card.type === "Keep" &&
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

// Perform the actual market exchange, then show the shared animation.
function ivyExchangeWithMarket(inventoryIndex, marketIndex, playerId) {
    if (!ivyCanUseExchange(playerId)) return false;

    const p = playerId === 1 ? gameState.p1 : gameState.p2;
    const offeredCard = p.inventory[inventoryIndex];
    const receivedCard = market[marketIndex];

    if (!ivyCanExchangeCard(offeredCard, p) || !receivedCard) return false;

    if (receivedCard.type !== "Keep") {
        showPopup("Suggested Transference", "Only Keep cards can be exchanged.");
        return false;
    }

    if (Number(receivedCard.cost) > Number(offeredCard.cost)) {
        showPopup("Suggested Transference", "That card costs more than the card being offered.");
        return false;
    }

    if (inventoryHasName(p, receivedCard.name)) {
        showPopup("Suggested Transference", `${p.name} already owns that card.`);
        return false;
    }

    // Keep copies for the animation before changing the arrays.
    const oldCard = { ...offeredCard };
    const newCard = { ...receivedCard };

    // Remove the offered card and take the market card.
    p.inventory.splice(inventoryIndex, 1);
    market.splice(marketIndex, 1);

    // The offered card replaces the card taken from the market.
    market.splice(marketIndex, 0, oldCard);
    p.inventory.push(newCard);

    p.ivyExchangeUsedThisTurn = true;

    log(
		`${p.name} used Suggested Transference to exchange ${oldCard.name} (${oldCard.cost}⚡) for ${newCard.name} (${newCard.cost}⚡).`
	);
    playSound("card");

    closePopup();

    // Create the shared event before synchronizing.
    ivyPublishExchangeAnimation(playerId, oldCard, newCard, "market");

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


// DEBUG ONLY: Ivy considers exchanging one of her Keep cards
// for an opponent's Keep card.
function ivyCpuTryOpponentExchange(plan = ivyCpuCurrentPlan()) {
    if (!IVY_DEBUG_OPPONENT_EXCHANGE) return false;
    if (!hasSignaturePower(2, "ivy")) return false;
    if (!ivyCanUseExchange(2)) return false;

    const ivy = gameState.p2;
    const opponent = gameState.p1;

    const ivyCards = ivy.inventory
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => ivyCanExchangeCard(card, ivy));

    const opponentCards = opponent.inventory
		.map((card, index) => ({ card, index }))
		.filter(({ card }) =>
			card &&
			card.type === "Keep" &&
			Number.isFinite(Number(card.cost)) &&
			Number(card.cost) >= 0 &&
			!(
				Number.isFinite(Number(card.acquiredRound)) &&
				Number(card.acquiredRound) === Number(gameState.round)
			) &&
			!ivy.inventory.some(owned => owned.name === card.name)
		);

    let bestExchange = null;
	
    for (const offered of ivyCards) {
        for (const received of opponentCards) {
            // Ivy cannot receive a card more expensive than the one she offers.
            if (Number(received.card.cost) > Number(offered.card.cost)) continue;

            const offeredValue = ivyCpuCardValue(offered.card, plan);
            const receivedValue = ivyCpuCardValue(received.card, plan);
            const improvement = receivedValue - offeredValue;

            // Keep the same improvement threshold as Ivy's market exchange.
            if (improvement < 8) continue;

            if (!bestExchange || improvement > bestExchange.improvement) {
                bestExchange = {
                    offeredIndex: offered.index,
                    receivedIndex: received.index,
                    offeredCard: offered.card,
                    receivedCard: received.card,
                    improvement
                };
            }
        }
    }

    if (!bestExchange) {
		return false;
	}

    const offeredCard = ivy.inventory[bestExchange.offeredIndex];
    const receivedCard = opponent.inventory[bestExchange.receivedIndex];

    // Exchange ownership.
    ivy.inventory.splice(bestExchange.offeredIndex, 1);
    opponent.inventory.splice(bestExchange.receivedIndex, 1);

    ivy.inventory.push(receivedCard);
    opponent.inventory.push(offeredCard);

    ivy.ivyExchangeUsedThisTurn = true;

    log(
        `Ivy used Suggested Transference to exchange ${offeredCard.name} (${offeredCard.cost}⚡) for ${opponent.name}'s ${receivedCard.name} (${receivedCard.cost}⚡).`
    );

    playSound("card");

    // Reuse the existing shared exchange animation.
    ivyPublishExchangeAnimation(2, offeredCard, receivedCard, "opponent");

    syncToFirebase();
    updateUI();

    return true;
}


// Try one exchange at the beginning of Ivy's CPU shop phase.
function ivyCpuTryExchange() {
    const p = gameState.p2;
/*
    ivyCpuDebug("Exchange attempt started", {
        name: p.name,
        difficulty: p.difficulty,
        activePlayer: gameState.activePlayer,
        phase: gameState.phase,
        round: gameState.round,
        exchangeUsed: p.ivyExchangeUsedThisTurn
    });
*/
    if (!hasSignaturePower(2, "ivy")) {
        //ivyCpuDebug("STOPPED: Ivy's signature power was not detected.");
        return false;
    }

    if (p.ivyExchangeUsedThisTurn) {
        //ivyCpuDebug("STOPPED: Ivy has already exchanged this turn.");
        return false;
    }

    if (!hasSignaturePower(2, "ivy")) return false;
    if (p.ivyExchangeUsedThisTurn) return false;

    const plan = ivyCpuCurrentPlan();
	// Debug option: first consider exchanging with the opponent.
	// If successful, Ivy has used her once-per-turn exchange.
	if (IVY_DEBUG_OPPONENT_EXCHANGE && ivyCpuTryOpponentExchange(plan)) {
		return true;
	}

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

//ivyCpuDebug("ALL owned Keep cards (including ineligible):",
//    allOwnedKeepCards
//);

    const marketCards = market
    .map((card, index) => ({ card, index }))
    .filter(({ card }) =>
        card &&
        card.type === "Keep" &&
        Number.isFinite(Number(card.cost)) &&
        !inventoryHasName(p, card.name)
    );
	
	//ivyCpuDebug("Current exchange plan:", plan);
/*
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
*/
    let bestExchange = null;

    for (const owned of ownedCards) {
        for (const candidate of marketCards) {
            if (Number(candidate.card.cost) > Number(owned.card.cost)) continue;

            const oldValue = ivyCpuCardValue(owned.card, plan);
            const newValue = ivyCpuCardValue(candidate.card, plan);
            const improvement = newValue - oldValue;
			/*
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
*/
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
  //  ivyCpuDebug("DECISION: No exchange selected. No candidate met the improvement threshold.");
    return false;
}

//ivyCpuDebug("DECISION: Ivy selected an exchange:", bestExchange);
    const oldCard = { ...p.inventory[bestExchange.ownedIndex] };
    const newCard = { ...market[bestExchange.marketIndex] };

    // Perform the exchange exactly once.
    p.inventory.splice(bestExchange.ownedIndex, 1);
    market.splice(bestExchange.marketIndex, 1);
    market.splice(bestExchange.marketIndex, 0, oldCard);
    p.inventory.push(newCard);

    p.ivyExchangeUsedThisTurn = true;

    log(
		`Ivy used Suggested Transference to exchange ${oldCard.name} (${oldCard.cost}⚡) for ${newCard.name} (${newCard.cost}⚡).`
	);

    // The shared presentation also runs on the CPU's own screen.
    ivyPublishExchangeAnimation(2, oldCard, newCard, "market");

    syncToFirebase();
    updateUI();

    return true;
}

// ============================================================
// CPU ENDGAME + SUBMISSION WAR   (Virtuoso and Master only: "smart tier 2" from cpu_smarts.js)
// Needs cpu_smarts.js in place first (it provides cpuSmartTier, CPU_SUBMISSION_KEEPS, the hooks this plugs into).
//
// PART 1 = new code (paste as one block next to the cpu_smarts.js code).  PART 2 = the small hooks.
//
// Facts the code relies on (from the game code):
//   * gameState.submission runs -5 (the HUMAN's end) ... +5 (the CPU's end).
//   * a ⛓️ or 👁️ roll of 3 gives effect 1, and every extra die adds 1 (4 dice = 2, 5 dice = 3).
//   * a push past an end overflows into Transform. A marker sitting on a player's end at the end of THEIR turn = +1 Transform.
//   * a Trance Setback lets the attacker choose "Push Submission 2", so 🌀 also pushes the marker.
// ============================================================


// ############################################################
// PART 1: NEW CODE
// ############################################################

// ---------- where the marker is ----------
function cpuEdge() {
    const s = gameState.submission;
    return { toOpp: 5 + s, toMe: 5 - s };        // points until the human's end / until our end
}

// ---------- endgame state ----------
function cpuEndgameInfo() {
    const opp = gameState.p1;
    const e = cpuEdge();
    return {
        need: Math.max(0, 10 - (opp.transform || 0)),     // Transforms still needed
        active: (opp.transform || 0) >= 6,                // endgame: every Transform counts
        urgent: (opp.transform || 0) >= 8,                // 8-9: hunt for the last points
        toOpp: e.toOpp, toMe: e.toMe,
        pinned: e.toOpp <= 2                              // marker on or next to their end: ⛓️ points overflow into Transforms
    };
}
function cpuInDanger() {                                  // our own endgame: don't starve ourselves of defense
    return gameState.p2.transform >= 8 || gameState.submission >= 4;
}

// ---------- the submission war ----------
// Cards that push ⛓️ or 🌀 (weight = how hard they push)
const CPU_SUB_PUSH_WEIGHT = { 36: 3, 15: 2, 46: 2, 24: 2, 34: 1.5, 22: 1.5, 23: 1, 31: 2, 0: 1, 17: 1 };
function cpuSubPower(playerId) {
    const inv = (playerId === 1 ? gameState.p1.inventory : gameState.p2.inventory) || [];
    let s = 0;
    inv.forEach(c => { if (c) s += CPU_SUB_PUSH_WEIGHT[Number(c.id)] || 0; });
    if (hasSignaturePower(playerId, "luci")) s += 1.5;
	if (playerId === 1 && cpuStyle().subPress) s += 2;        // they play a ⛓️ game: treat them as holding more pushing power
    return s;
}
// "press"   = we have the better ⛓️/🌀 cards (or have them pinned): push hard
// "defend"  = they out-gun us: get the marker back to the middle, then tread water and let the other plans have the dice
// "neutral" = no strong lean
function cpuSubmissionMode() {
    const mine = cpuSubPower(2), theirs = cpuSubPower(1), s = gameState.submission;
    if (theirs >= mine + 2 && s > -2) return "defend";
    if (mine >= 2 || s <= -2) return "press";
    return "neutral";
}

// ---------- dice weights (Master) ----------
function cpuEndgameFaceWeights(w) {
    if (cpuSmartTier() < 2) return w;
    const opp = gameState.p1, s = gameState.submission;
    const info = cpuEndgameInfo(), mode = cpuSubmissionMode();
    const mine = cpuSubPower(2), theirs = cpuSubPower(1);

    if (info.active) {
        const urgency = opp.transform - 5;                                   // 1 at 6 ... 4 at 9
        w.TR += 0.25 * urgency;                                              // a 👁️ triple is a Transform
        if (info.pinned) {
            w.SU += 0.3 * urgency + 0.2;                                     // every ⛓️ point past the edge is a Transform
            if (opp.trance >= 3) w.SP += 0.3 * urgency;                      // a Setback pushes ⛓️ by 2
        }
        if (info.urgent) w.EN += 0.2;                                        // energy buys the finishing card
    }
    if (mode === "press") {
        w.SU += Math.min(1.0, 0.3 + 0.15 * mine);
        w.SP += Math.min(0.5, 0.1 * mine);
        if (s <= -3) w.SU += 0.3;
    } else if (mode === "defend") {
        if (s >= 1) w.SU += Math.min(1.2, 0.3 * s + 0.1 * theirs);           // pull the marker back toward the middle
        else { w.TR += 0.1; w.AR += 0.05; w.EN += 0.1; }                     // treading water: other plans get the dice
    }
    return w;
}

// ---------- dice locks (Master and Virtuoso; runs at the end of the keep plan) ----------
function cpuEndgameKeepRules(keep, faces, counts) {
    if (cpuSmartTier() < 2) return keep;
    const opp = gameState.p1, s = gameState.submission;
    const info = cpuEndgameInfo(), mode = cpuSubmissionMode();
    const free = keep.filter(k => !k).length;
    const lock = f => faces.forEach((x, i) => { if (x === f) keep[i] = true; });

    // Pinned in the endgame: ⛓️ (and a nearly full 🌀) are the finishers
    if (info.active && info.pinned) {
        if (counts.SU >= 2 && free >= 1) lock("SU");
        if (opp.trance >= 3 && counts.SP >= 1) lock("SP");
    }
    // Pressing with good ⛓️ / 🌀 cards: keep pairs and go for the triple
    if (mode === "press") {
        if (counts.SU >= 2 && free >= 1) lock("SU");
        if (counts.SP >= 2 && free >= 1) lock("SP");
    }
    // They out-gun us and the marker is on our side: use ⛓️ to pull it back
    if (mode === "defend" && s >= 1 && counts.SU >= 2 && free >= 1) lock("SU");
    return keep;
}

// ---------- shop ----------
// Extra score for a market card (add to cpuSmartCardBonus)
function cpuEndgameCardBonus(card) {
    if (cpuSmartTier() < 2) return 0;
    const id = Number(card.id), opp = gameState.p1;
    const info = cpuEndgameInfo(), mode = cpuSubmissionMode();
    let b = 0;
    const dmg = CPU_BURST[id] || 0;                                         // cards that deliver Transforms directly
    if (dmg && info.active) {
        b += dmg * (opp.transform - 4) * 8;                                 // 8 Transform: +32 per point
        if (dmg >= info.need) b += 40;                                      // it finishes the game
    }
    const push = CPU_SUB_PUSH_WEIGHT[id] || 0;
    if (push && mode === "press") b += 8 * push;
    if (push && mode === "defend") b += 4 * push;
    if (mode === "defend" && (id === 53 || id === 35 || id === 34)) b += 25;   // I Will Not Obey / Mesmerizing Rhythm / Cognitive Override
    if (info.active && info.pinned && id === 17) b += 20;                   // Physical Manipulation: every Setback becomes a Transform
    return b;
}
// Keeping cards from the human (add to cpuDenyScore)
function cpuEndgameDeny(card) {
    if (cpuSmartTier() < 2) return 0;
    const id = Number(card.id), me = gameState.p2;
    let d = 0;
    if (me.transform >= 7) d += (CPU_BURST[id] || 0) * (me.transform - 5) * 12;     // we are the one in the endgame: they must not get finishers
    if (cpuSubmissionMode() === "defend") d += 6 * (CPU_SUB_PUSH_WEIGHT[id] || 0);  // they are winning the ⛓️ war: don't hand them more
    return d;
}
// In the endgame, don't spend the energy a finishing card needs on something else (defense is still allowed when we are in danger)
function cpuEndgameAllowsPurchase(card) {
    if (cpuSmartTier() < 2) return true;
    if (!cpuEndgameInfo().urgent) return true;
    if (CPU_BURST[Number(card.id)] || cpuInDanger()) return true;
    return gameState.p2.energy - getCardPurchaseCost(card, 2) >= cpuBurstMinCost();
}
// Nothing to finish with in the market: wipe to hunt for a finisher, but keep the ⚡ to buy it
function cpuEndgameWipeHunt() {
    if (cpuSmartTier() < 2) return null;
    const info = cpuEndgameInfo(), p = gameState.p2;
    if (!info.urgent || cpuFallingSensationMode()) return null;
    if ((cpuBrain.huntWipes || 0) >= 3) return null;
    if (market.some(c => c && CPU_BURST[Number(c.id)])) return null;        // there is already one to buy
    if (deck.length === 0 || p.energy < getMarketWipeCost(2) + cpuBurstMinCost()) return null;
    cpuBrain.huntWipes = (cpuBrain.huntWipes || 0) + 1;
    return { type: "wipe", why: "hunting a finishing card" };
}


// PART 1: SUBMISSION RESCUE
// Why the Master AI stays squeezed: the only tools it had were ⛓️ dice (one point per triple) and a small score bonus on
// rescue cards. It never SAVED the 6-7 ⚡ those cards cost, kept spending on other cards, and never went looking for one.
// ############################################################

// card id -> how many points of ⛓️ it takes off OUR side
const CPU_RESCUE_POINTS = {
    53: s => s,                 // I Will Not Obey: back to neutral (needs the marker on our side)
    10: () => 4, 39: () => 4,   // Subconscious Prompt
    11: () => 2,                // Sluggish Mind
    18: () => 2, 8: () => 2,    // Pulsing Light / Mind Fog (both also add 🌀 to the human)
    61: s => s                  // Blank: back to neutral, but wipes our ⚡/🌀/🔥: last resort
};

// 0 = fine, 1 = marker on our side, 2 = squeezed, 3 = emergency
function cpuPressure() {
    const s = gameState.submission;
    if (s <= 1) return 0;
    const theirs = cpuSubPower(1);
    if (s >= 4) return 3;
    if (s >= 3) return theirs >= 2 ? 3 : 2;
    return theirs >= 3 ? 2 : 1;
}

function cpuRescueEligible(card) {
    const id = Number(card.id), s = gameState.submission;
    if (inventoryHasName(gameState.p2, card.name)) return false;
    if (hasSignaturePower(2, "alex") && ALEX_DEFENSIVE_SUBMISSION_CARD_IDS.includes(id)) return false;
    if (id === 53 && s <= 0) return false;
    if (id === 61 && cpuPressure() < 3) return false;
    return true;
}
// Rescue cards in the market, best first. value = points removed (capped at what we need) minus the price
function cpuRescueOptions() {
    const s = gameState.submission;
    return market
        .map((c, idx) => (c && CPU_RESCUE_POINTS[Number(c.id)] && cpuRescueEligible(c))
            ? { idx, card: c, cost: getCardPurchaseCost(c, 2), pts: CPU_RESCUE_POINTS[Number(c.id)](s) } : null)
        .filter(Boolean)
        .map(o => Object.assign(o, { value: Math.min(o.pts, s + 2) * 14 - o.cost * 3 - (Number(o.card.id) === 61 ? 15 : 0) }))
        .filter(o => o.value > 0)
        .sort((a, b) => b.value - a.value);
}

// Shop action: buy the best way out we can afford; if there is none in the market, hunt for one (keeping the ⚡ to buy it)
function cpuRescueShopAction() {
    if (cpuSmartTier() < 2 || cpuPressure() < 2) return null;
    const p = gameState.p2;
    const opts = cpuRescueOptions();
    const affordable = opts.filter(o => o.cost <= p.energy || gameState.freeBuyActive);
    if (affordable.length) return { type: "buy", idx: affordable[0].idx, name: affordable[0].card.name };
    if (!opts.length && (cpuBrain.rescueWipes || 0) < 2 && deck.length > 0
        && p.energy >= getMarketWipeCost(2) + 4 && !cpuFallingSensationMode()) {
        cpuBrain.rescueWipes = (cpuBrain.rescueWipes || 0) + 1;
        return { type: "wipe", why: "hunting a way out of the Submission squeeze" };
    }
    return null;
}
// While squeezed, never spend the energy a rescue card in the market is waiting for
function cpuRescueAllowsPurchase(card) {
    if (cpuSmartTier() < 2 || cpuPressure() < 2) return true;
    if (CPU_RESCUE_POINTS[Number(card.id)]) return true;
    const p = gameState.p2;
    const target = cpuRescueOptions().filter(o => o.cost > p.energy && o.cost <= p.energy + 3).sort((a, b) => a.cost - b.cost)[0];
    if (!target) return true;
    return p.energy - getCardPurchaseCost(card, 2) >= target.cost;
}
// Dice: push back harder, and bank energy so the rescue card becomes affordable
function cpuRescueFaceWeights(w) {
    if (cpuSmartTier() < 2) return w;
    const pr = cpuPressure();
    if (pr >= 2) { w.SU += 0.3 * pr; w.EN += 0.25; }
    return w;
}

// ############################################################
// PART 2: THREAT FORECAST (look one turn ahead)
// What is the most the human could do to our Transform next turn?  dice + the cards they could afford + Submission overflow.
// ############################################################

const CPU_PUSH_INSTANTS = { 10: 4, 39: 4, 11: 2, 18: 2, 8: 2 };      // instants that push ⛓️ (against whoever the marker favours)
const CPU_TRANSFORM_DEFENSE = { 44: 40, 59: 30, 38: 30 };            // Flow Reversal, Transformation Sigil, New Identity

function cpuBurstMinCost() {                                         // cheapest card that delivers Transforms
    const costs = Object.keys(CPU_BURST).map(id => { const c = KNOWN_CARDS.find(k => Number(k.id) === Number(id)); return c ? c.cost : 4; });
    return costs.length ? Math.min(...costs) : 4;
}

function cpuThreatForecast() {
    const me = gameState.p2, hu = gameState.p1, s = gameState.submission;
    const key = [gameState.round, hu.energy, hu.transform, me.transform, s, me.trance, market.map(c => c ? c.id : 0).join(",")].join("|");
    if (cpuBrain.forecastKey === key && cpuBrain.forecast) return cpuBrain.forecast;

    const margin = Math.max(0, 10 - (me.transform || 0));
    const toMe = 5 - s;                                              // points until the marker is over OUR end
    const budget = (hu.energy || 0) + 2;                             // ⚡ they can have next turn (their dice add about 2)
    const has = id => hasCard(1, id);
    const keepPush = (has(36) ? 1 : 0) + (has(15) ? 1 : 0) + (has(34) && s > 0 ? 1 : 0) + (has(46) ? 1 : 0)
        + (has(22) ? 0.5 : 0) + (hasSignaturePower(1, "luci") ? 1 : 0);
    const setbackPush = me.trance >= 3 ? 2 : 0;                      // a Setback lets them "Push Submission 2"
    const physManip = (has(17) && me.trance >= 3) ? 1 : 0;           // Physical Manipulation turns it into a Transform

    const cards = market.filter(Boolean).map(c => ({
        id: Number(c.id), cost: getCardPurchaseCost(c, 1),
        dmg: CPU_BURST[Number(c.id)] || 0, push: CPU_PUSH_INSTANTS[Number(c.id)] || 0, kill: Number(c.id) === 52 && s > 0
    })).filter(c => c.dmg || c.push || c.kill);

    let best = { total: 0, ids: [], overflow: 0 };
    for (let mask = 0; mask < (1 << cards.length); mask++) {
        let cost = 0, dmg = 0, push = 0, kill = false; const ids = [];
        cards.forEach((c, i) => { if (mask & (1 << i)) { cost += c.cost; dmg += c.dmg; push += c.push; kill = kill || c.kill; ids.push(c.id); } });
        if (cost > budget) continue;
        const extra = keepPush + setbackPush + push;
        const ovDice = kill ? toMe + 2 : Math.max(0, 2 + extra - toMe);    // their dice go into ⛓️ (2 = a strong roll)
        const ovNoDice = kill ? toMe + 2 : Math.max(0, extra - toMe);      // their dice go into 👁️ instead (also 2)
        const total = dmg + Math.max(ovDice, ovNoDice + 2) + physManip;
        if (total > best.total) best = { total, ids, overflow: Math.max(ovDice, ovNoDice) };
    }
    const style = cpuStyle();
    const max = best.total || (2 + physManip);
    const likely = max * 0.5 + (style.transformer ? 0.5 : 0);
    const f = { margin, max, likely, lethal: max >= margin, likelyLethal: likely >= margin, overflow: best.overflow, ids: best.ids };
    cpuBrain.forecastKey = key; cpuBrain.forecast = f;
    return f;
}
// 0 = safe, 1 = they could finish us, 2 = they probably will
function cpuDanger() {
    if (cpuSmartTier() < 2) return 0;
    const f = cpuThreatForecast();
    return f.lethal ? (f.likelyLethal ? 2 : 1) : 0;
}

// Shop action when we are in danger: survive, take their finishing cards away, or wipe them out of the market
function cpuEmergencyShopAction() {
    const sev = cpuDanger();
    if (!sev) return null;
    const p = gameState.p2, f = cpuThreatForecast();
    const free = gameState.freeBuyActive;

    // 1) buy a way to survive
    const defs = market.map((c, idx) => (c && CPU_TRANSFORM_DEFENSE[Number(c.id)]) ? { idx, card: c, id: Number(c.id), cost: getCardPurchaseCost(c, 2) } : null)
        .filter(o => o && (o.cost <= p.energy || free) && !inventoryHasName(p, o.card.name)
            && (o.id !== 38 || p.transform >= 7) && (o.id !== 44 || p.transform > 0))
        .sort((a, b) => CPU_TRANSFORM_DEFENSE[b.id] - CPU_TRANSFORM_DEFENSE[a.id]);
    if (defs.length) return { type: "buy", idx: defs[0].idx, name: defs[0].card.name };

    // 2) a way out of a Submission overflow
    if (f.overflow > 0 && cpuPressure() >= 1) {
        const r = cpuRescueOptions().filter(o => o.cost <= p.energy || free)[0];
        if (r) return { type: "buy", idx: r.idx, name: r.card.name };
    }
    // 3) take their finishing cards (they transform THEM when we play them) if we can use them ourselves
    const takeable = market.map((c, idx) => (c && f.ids.includes(Number(c.id)) && CPU_BURST[Number(c.id)] && Number(c.id) !== 40) ? { idx, card: c, cost: getCardPurchaseCost(c, 2) } : null)
        .filter(o => o && (o.cost <= p.energy || free) && passesCardSpecificConditions(o.card));
    if (takeable.length) return { type: "buy", idx: takeable[0].idx, name: takeable[0].card.name };

    // 4) they can afford a finisher and we cannot take it: wipe it away
    const stillThere = market.some(c => c && f.ids.includes(Number(c.id)));
    if (stillThere && (cpuBrain.emergencyWipes || 0) < 2 && deck.length > 0 && p.energy >= getMarketWipeCost(2) && !cpuFallingSensationMode()) {
        cpuBrain.emergencyWipes = (cpuBrain.emergencyWipes || 0) + 1;
        return { type: "wipe", why: "denying their finishing cards" };
    }
    return null;
}
function cpuForesightCardBonus(card) {
    const sev = cpuDanger();
    if (!sev) return 0;
    const id = Number(card.id);
    let b = (CPU_TRANSFORM_DEFENSE[id] || 0) * sev;
    if (CPU_RESCUE_POINTS[id] && cpuThreatForecast().overflow > 0) b += 20 * sev;
    return b;
}
function cpuForesightDeny(card) {                  // cards the human could use to finish us: keep them out of the market
    const sev = cpuDanger();
    if (!sev) return 0;
    const f = cpuThreatForecast();
    return f.ids.includes(Number(card.id)) ? 40 * sev : 0;
}
function cpuForecastFaceWeights(w) {
    const sev = cpuDanger();
    if (!sev) return w;
    const f = cpuThreatForecast();
    if (f.overflow > 0) w.SU += 0.4 * sev;         // push the marker away from our end
    w.EN += 0.2;                                    // energy buys the way out
    return w;
}

// ############################################################
// PART 3: SMART LUCIDITY
// The old order was always: Vulnerability, then Arousal, then Trance, with nothing about what actually matters.
// Now every possible split of the 💧 is scored (rerolls regained, Setback danger, Vulnerability) and the best one is used.
// ############################################################

function cpuTranceThreat() {                       // how much 🌀 the human could add to us next turn
    const hu = gameState.p1, st = cpuStyle();
    let t = 1;
    [0, 31, 14, 8, 18].forEach(id => { if (hasCard(1, id)) t += 1; });
    if (st.trancer) t += 1.5;
    if (hasSignaturePower(1, "mark") || hasSignaturePower(1, "tex")) t += 1;
    return t;
}
function cpuLucidityValue(p, v, a, t) {
    const rerolls = x => (x <= 2 ? 2 : (x <= 4 ? 1 : 0));
    let val = v * 1.6;                                                          // each Vulnerability point = one fewer die next turn
    const a0 = p.arousal || 0, a1 = a0 - a;
    val += (rerolls(a1) - rerolls(a0)) * 2.2 + a * 0.35;                       // crossing a reroll band is what matters
    if (cpuStyle().arousal || hasSignaturePower(1, "xander") || hasSignaturePower(1, "tex")) val += a * 0.5;
    const t0 = p.trance || 0, t1 = t0 - t, th = cpuTranceThreat();
    val += t * 0.45;
    if (t0 + th >= 5 && t1 + th < 5) val += 2.5 * (1 + 0.3 * Math.max(0, gameState.submission - 1));   // a Setback is worse the closer we are to our end
    return val;
}
// Same contract as autoAllocateLucidity(points, playerObj, arousalCost): spends the points and returns {trance, arousal, vuln}
function cpuAllocateLucidity(points, playerObj, arousalCost = 1) {
    const cost = Math.max(1, Number(arousalCost) || 1);
    const P = Math.max(0, Number(points) || 0);
    let best = { v: 0, a: 0, t: 0, val: -1 };
    for (let v = 0; v <= Math.min(playerObj.vulnerability || 0, P); v++) {
        for (let a = 0; a <= Math.min(playerObj.arousal || 0, Math.floor((P - v) / cost)); a++) {
            for (let t = 0; t <= Math.min(playerObj.trance || 0, P - v - a * cost); t++) {
                const val = cpuLucidityValue(playerObj, v, a, t) + (v + a * cost + t) * 0.01;   // tiny push to actually use the dice
                if (val > best.val) best = { v, a, t, val };
            }
        }
    }
    playerObj.vulnerability = (playerObj.vulnerability || 0) - best.v;
    playerObj.arousal = (playerObj.arousal || 0) - best.a;
    playerObj.trance = (playerObj.trance || 0) - best.t;
    return { vuln: best.v, arousal: best.a, trance: best.t };
}

// ############################################################
// PART 4: COUNTER-STYLE (read how the human plays, then counter it)
// ############################################################

function cpuNoteHumanStyle(counts) {               // once per human turn, with their final roll counts
    const st = cpuBrain.style = cpuBrain.style || { n: 0, su: 0, tr: 0, ar: 0, sp: 0, en: 0, lu: 0, energyHigh: 0 };
    const a = st.n === 0 ? 1 : 0.4;                // recent turns count more
    const mix = (k, v) => { st[k] = st[k] * (1 - a) + v * a; };
    mix("su", counts.SU || 0); mix("tr", counts.TR || 0); mix("ar", counts.AR || 0);
    mix("sp", counts.SP || 0); mix("en", counts.EN || 0); mix("lu", counts.LU || 0);
    mix("energyHigh", (gameState.p1.energy || 0) >= 7 ? 1 : 0);
    st.n++;
}
function cpuStyle() {
    const st = cpuBrain.style, t = cpuBrain.taken || [];
    const none = { subPress: false, transformer: false, arousal: false, trancer: false, hoarder: false, lucid: false };
    if (!st || st.n < 2) return none;
    const avg = k => t.length ? t.reduce((s, x) => s + (x[k] || 0), 0) / t.length : 0;
    return {
        subPress: st.su >= 2.3 || avg("sub") >= 1.4,
        transformer: st.tr >= 2.3 || avg("tf") >= 0.5,
        arousal: st.ar >= 2 || avg("ar") >= 1.5,
        trancer: st.sp >= 2 || avg("tr") >= 1.5,
        hoarder: st.energyHigh >= 0.6,
        lucid: st.lu >= 2.2
    };
}
function cpuAnnounceStyle() {                      // write it to the brain log when it changes
    const st = cpuStyle();
    const names = Object.keys(st).filter(k => st[k]);
    const label = names.length ? names.join(", ") : "nothing clear";
    if (cpuBrain.styleLabel !== label) { cpuBrain.styleLabel = label; cpuSay(`Reading your style: ${label}.`); }
}
// What to buy against each style
const CPU_STYLE_COUNTER_CARDS = {
    subPress:    { cards: [35, 53, 34],        pts: 15 },
    transformer: { cards: [44, 59, 38],        pts: 25 },
    arousal:     { cards: [12, 50, 33, 9],     pts: 20 },       // Rapid Pulse, Mutual Heat, Quiet Mind, Deep Safeties
    trancer:     { cards: [12, 21],            pts: 18 }        // Rapid Pulse, Switch Play
};
function cpuStyleCardBonus(card) {
    if (cpuSmartTier() < 2) return 0;
    const st = cpuStyle(), id = Number(card.id);
    let b = 0;
    Object.keys(CPU_STYLE_COUNTER_CARDS).forEach(k => {
        if (st[k] && CPU_STYLE_COUNTER_CARDS[k].cards.includes(id)) b += CPU_STYLE_COUNTER_CARDS[k].pts;
    });
    if (st.hoarder && card.cost >= 6) b += 8;                                   // they are sitting on energy: expensive cards are the ones they'll take
    return b;
}
function cpuStyleFaceWeights(w) {
    if (cpuSmartTier() < 2) return w;
    const st = cpuStyle();
    if (st.lucid) { w.AR -= 0.15; w.SP -= 0.1; w.TR += 0.1; w.SU += 0.1; }     // they clear 🔥/🌀 with 💧: push Transform and ⛓️ instead
    return w;
}

