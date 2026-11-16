// ============================================================
// ABILITIES  (abilities.js)
// Load order in index.html:   cpu_int.js  ->  abilities.js  ->  hypbattle.js
// Nothing here runs at load time except defining things, so it is safe to load before hypbattle.js. Functions from the
// main file (gameState, log, hasCard, increaseTrance...) are only used later, when the game calls us.
//
// IDEAS BEHIND IT
//   * A power is a KEY ("deepwell", "toll", ...), not a character. Each player object carries  powerKey.
//     The ten original characters keep working exactly as before (their key comes from SIGNATURE_POWERS by name).
//   * To give a NEW character a power: add one line to CHARACTER_POWER_KEYS below. That is all (plus the character's art,
//     taunts and transformation list as usual).
//   * To TEST a power with no character yet: set debugStart.p1Power / debugStart.cpuPower in hypbattle.js, or in the
//     browser console:   Abilities.setPower(1, "deepwell")
//   * Everything asks  hasSignaturePower(playerId, key)  (which now calls Abilities.hasPower), so a power only has to be
//     written once and Kaleidoscope (phase 3) can borrow any of them.
//
// PHASES
//   Phase 1 (this file): Toll, Cornered, Deep Well, Surrender to Heat      <- implemented
//   Phase 2: Echo, Called Shot, *Meditation, *Turn the Tables                 <- implemented (with simple CPU rules)
//   Phase 3: Layaway, Kaleidoscope                                          <- implemented
// ============================================================

(function () {
    "use strict";

    // ############################################################
    // 1) NUMBERS YOU MAY WANT TO TUNE
    // ############################################################
    const CFG = {
		deepWell: { threshold: 7, multiplier: 2 }, // Trance needed for a Setback / how much harder it hits
        cornered:  { transformAt: 8, extraDice: 1, energy: 1 },
        surrender: { tranceDivisor: 2 },                       // +1 Trance per 2 Arousal at the end of your turn
        toll:      { energy: 1 },
        layaway:   { reserveCost: 1, ownerTurns: 2, discount: 1 },
        // Kaleidoscope can borrow any of these. A legacy (original character) power counts as "used" when its board box flashes
        // (see legacyFired); a new power calls markUsed() itself.
        kaleidoscope: { swapCost: 3, pool: [
            "echo", "calledshot", "surrender", "deepwell", "toll", "layaway", "meditation", "cornered", "turntables",
            "tripletrouble", "submissionamplifier", "predatorymomentum", "lucidreversal", "perfectharmony", "unyieldingresistance",
            "heatedopening", "twisteddice", "marketmanipulator", "lingeringtrance", "suggestedtransference"
        ] }
    };

    // ############################################################
    // 2) THE REGISTRY (player-facing text is used by the setup box, the board hint and the Characters help tab)
    // ############################################################
    const REGISTRY = {
        echo:        { key: "echo",        icon: "🔁", title: "Echo",              phase: 2, description: "Once per turn, after your final roll, pay 1 ⚡ to copy one die's face onto another die." },
        calledshot:  { key: "calledshot",  icon: "🎯", title: "Called Shot",       phase: 2, description: "Before your first roll, name a face. If it shows 3 or more times when you resolve, its effect is +1. If it shows fewer than 2 times, lose 1 ⚡." },
		surrender: { key: "surrender", icon: "🏳️", title: "Surrender to Heat", phase: 1, description: "Arousal never costs you rerolls. At the end of your turn you gain 1 Trance for every 2 Arousal, which can trigger The Deepening." },
        deepwell:    { key: "deepwell",    icon: "🌊", title: "Deep Well",         phase: 1, description: "You need 7 Trance for The Deepening instead of 5, but when one lands its effect is doubled." },
        toll:        { key: "toll",        icon: "🪙", title: "Toll",              phase: 1, description: "Whenever your opponent buys a card, you gain 1 ⚡." },
        layaway:     { key: "layaway",     icon: "🏷️", title: "Layaway",           phase: 3, description: "At the end of your turn, pay 1 ⚡ to reserve a market card. For your next 2 turns only you can buy it (and no other card). Then your opponent may buy it for 1 ⚡ less, or it is discarded." },
        meditation:  { key: "meditation",  icon: "🧘", title: "Meditation",        phase: 2, description: "Instead of rolling, you may meditate: gain 3 ⚡ and lower your Trance and Arousal by 1. No rolls, rerolls or buying cards that turn. Not two turns in a row." },
        cornered:    { key: "cornered",    icon: "🧱", title: "Cornered",          phase: 1, description: "While you have 8 or more Transform, you roll one extra die and gain 1 ⚡ at the start of each of your turns." },
        turntables:  { key: "turntables",  icon: "🪞", title: "Turn the Tables",   phase: 2, description: "Once per game, in your shop phase, mirror the Submission marker (+3 becomes -3)." },
        kaleidoscope:{ key: "kaleidoscope",icon: "🔮", title: "Kaleidoscope",      phase: 3, description: "You hold one random borrowed power. Use it and you draw a new one (all get used before any repeat). Once per turn, pay 3 ⚡ to swap it for another." },
    };

    // New characters: "Their Name": "powerkey".   (Use the name exactly as it appears in CHARACTERS.)
    const CHARACTER_POWER_KEYS = {
        // "Newcharacter": "echo",
    };

    // ############################################################
    // 3) FINDING OUT WHO HAS WHAT
    // ############################################################
    function G() { return (typeof gameState !== "undefined") ? gameState : null; }
    function plainName(name) {                                  // same idea as normalizedCharacterName()
        return String(name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().split(/\s+/)[0].toLowerCase();
    }
    function legacyKeyForName(name) {                           // the original characters: key comes from SIGNATURE_POWERS
        if (typeof SIGNATURE_POWERS === "undefined") return null;
        const want = plainName(name);
        const hit = Object.entries(SIGNATURE_POWERS).find(([n]) => plainName(n) === want);
        return hit ? hit[1].key : null;
    }
    function keyForName(name) {
        const p = plainName(name);
        const mapped = Object.keys(CHARACTER_POWER_KEYS).find(n => plainName(n) === p);
        return mapped ? CHARACTER_POWER_KEYS[mapped] : legacyKeyForName(name);
    }
    function normalizeKey(nameOrKey) {                          // callers pass a key ("marketmanipulator") or, rarely, a name ("Siobhán")
        const s = String(nameOrKey || "");
        if (REGISTRY[s.toLowerCase()]) return s.toLowerCase();
        return legacyKeyForName(s) || s.toLowerCase();
    }
    // the player's own power key
    function keyFor(pObj) {
        if (!pObj) return null;
        if (pObj.powerKey) return pObj.powerKey;
        return keyForName(pObj.name);
    }
    // does this player have this power right now? (Kaleidoscope's borrowed power counts too)
    function hasPower(pObj, nameOrKey) {
        if (!pObj) return false;
        const want = normalizeKey(nameOrKey), have = keyFor(pObj);
        if (have === want) return true;
        return have === "kaleidoscope" && pObj.borrowedKey === want;
    }
    // active = has the power AND it is switched on in setup
    function ptHas(pObj, key) { return !!pObj && pObj.specialAbility !== false && hasPower(pObj, key); }
    function idOf(pObj) { const g = G(); return g && pObj === g.p1 ? 1 : 2; }
    function otherId(id) { return id === 1 ? 2 : 1; }

    // title and description for the UI (setup box, board hint, help tab)
    // the original characters' powers live in SIGNATURE_POWERS (hypbattle.js); these are their board icons
    const LEGACY_ICONS = {
        tripletrouble: "🎲", submissionamplifier: "📣", predatorymomentum: "🐆", lucidreversal: "💧", perfectharmony: "☯️",
        unyieldingresistance: "🛡️", heatedopening: "🔥", twisteddice: "🃏", marketmanipulator: "🏪", lingeringtrance: "🌫️", suggestedtransference: "🔀"
    };
    function infoFor(key) {
        const r = REGISTRY[key];
        if (r) return { key: r.key, icon: r.icon || "", title: r.title, description: r.description };
        if (typeof SIGNATURE_POWERS !== "undefined") {
            const hit = Object.values(SIGNATURE_POWERS).find(p => p.key === key);
            if (hit) return { key: hit.key, icon: LEGACY_ICONS[key] || "✨", title: hit.title, description: hit.description };
        }
        return null;
    }
    function infoForCharacter(name) {
        const k = CHARACTER_POWER_KEYS[Object.keys(CHARACTER_POWER_KEYS).find(n => plainName(n) === plainName(name))];
        return k ? infoFor(k) : null;
    }

    // ############################################################
    // 4) ASSIGNMENT AT GAME START (and for testing)
    // ############################################################
    function assignPowers() {
        const g = G(); if (!g || !g.p1 || !g.p2) return;
        [g.p1, g.p2].forEach(p => { p.powerKey = keyForName(p.name) || null; });
        // debug overrides (only when cardDebugOn)
        if (typeof cardDebugOn !== "undefined" && cardDebugOn && typeof debugStart !== "undefined") {
            if (debugStart.p1Power) g.p1.powerKey = debugStart.p1Power;
            if (debugStart.cpuPower) g.p2.powerKey = debugStart.cpuPower;
        }
        // per-game state for the powers that need it (phase 2 and 3 fill these in)
        [g.p1, g.p2].forEach(p => {
            p.borrowedKey = null; p.meditatedLast = false; p.meditatedThis = false; p.tablesUsed = false; p.echoUsedThisTurn = false; p.calledFace = null;
            p.layaway = null; p.kUsed = []; p.kSwapped = false; p.corneredFired = false;
        });
        [g.p1, g.p2].forEach(p => { if (keyFor(p) === "kaleidoscope") kaleidoDraw(p, null); });      // Kaleidoscope starts with a random power
        g.meditating = false; pendingCalledShotAlert = null;
    }
    // console helper:  Abilities.setPower(1, "deepwell")  swaps a power in a running game
    function setPower(playerNum, key) {
        const g = G(); if (!g) return;
        const sp = playerNum === 1 ? g.p1 : g.p2;
        sp.powerKey = key;
        if (key === "kaleidoscope") { if (!sp.borrowedKey) kaleidoDraw(sp, null); } else sp.borrowedKey = null;
        if (typeof updateSignaturePowerHints === "function") updateSignaturePowerHints();
        if (typeof syncToFirebase === "function") syncToFirebase();
        if (typeof updateUI === "function") updateUI();
    }

    // ############################################################
    // 5) NUMBERS THAT OTHER CODE ASKS ABOUT
    // ############################################################
    // base rerolls: Arousal normally sets them (0-2 = 2, 3-4 = 1, 5 = 0). Surrender to Heat ignores Arousal.
    function baseRerolls(pObj) {
        if (ptHas(pObj, "surrender")) return 2;
        const a = Number(pObj.arousal) || 0;
        return a <= 2 ? 2 : (a <= 4 ? 1 : 0);
    }
	// Trance needed for The Deepening, and how strongly its effect applies
    function setbackThreshold(pObj) { return ptHas(pObj, "deepwell") ? CFG.deepWell.threshold : 5; }
    function setbackMultiplier(pObj) { return ptHas(pObj, "deepwell") ? CFG.deepWell.multiplier : 1; }
    // A meditation turn has NO rolls of any kind (powers or cards) and NO buying of cards.
    function meditatingNow() { const g = G(); return !!(g && g.meditating); }
    function isUsed(pObj) { return !!pObj && ptHas(pObj, "turntables") && !!pObj.tablesUsed; }   // once-per-game powers: shown greyed out
    // extra dice on top of the usual 6 (+ Trance Anchor)
    function extraDice(pObj) {
        let n = 0;
        if (ptHas(pObj, "cornered") && (Number(pObj.transform) || 0) >= CFG.cornered.transformAt) n += CFG.cornered.extraDice;
        return n;
    }

    // ############################################################
    // 6) EVENTS (the hooks in hypbattle.js call these)
    // ############################################################
    function announce(playerId, text) {
        if (typeof log === "function") log(text);
        if (typeof flashSignaturePowerHint === "function") flashSignaturePowerHint(playerId);
    }

    // start of a player's turn (not called for Siobhan's bonus roll)
    function onTurnStart(playerId) {
        const g = G(); if (!g) return;
        const p = playerId === 1 ? g.p1 : g.p2;
        p.echoUsedThisTurn = false; p.calledFace = null; p.meditatedThis = false; p.kSwapped = false; g.meditating = false;      // phase 2 per-turn flags
        if (ptHas(p, "cornered") && (Number(p.transform) || 0) >= CFG.cornered.transformAt) {
            p.energy = (Number(p.energy) || 0) + CFG.cornered.energy;
            p.corneredFired = true;
            announce(playerId, `${p.name}'s Cornered: +${CFG.cornered.energy} ⚡ and an extra die.`);
        }
    }

    // end of a player's turn, before the other end-of-turn card effects
    function onTurnEnd(playerId) {
        const g = G(); if (!g) return;
        const p = playerId === 1 ? g.p1 : g.p2;
        p.meditatedLast = !!p.meditatedThis; p.meditatedThis = false;                                    // Meditation: not two turns in a row
        if (ptHas(p, "surrender")) {
            const gain = Math.floor((Number(p.arousal) || 0) / CFG.surrender.tranceDivisor);
            if (gain > 0) { selfTrance(p, playerId, gain); markUsed(p, "surrender"); }
        }
        if (p.corneredFired) { p.corneredFired = false; markUsed(p, "cornered"); }            // Kaleidoscope: used up once it has fired this turn
        if (g.gameMode === "solo" && playerId === 2) cpuLayawayReserve(p);                  // reserve first, so this turn does not count against it
        layawayTurnEnded(playerId);
        flushLegacyFired();
    }
	// Surrender to Heat's Trance. Solo and hotseat: the OPPONENT chooses The Deepening effect (a dialog for a human opponent, the
    // normal CPU choice for the CPU). Online: the computer running the turn belongs to the owner, so the effect is automatic.
    function selfTrance(p, id, amount) {
        const g = G();
        const source = g.gameMode === "online" ? 0 : otherId(id);
        announce(id, `${p.name}'s Surrender to Heat: +${amount} 🌀 from ${p.arousal} 🔥.`);
        const prev = increaseTrance.reflecting;
        increaseTrance.reflecting = true;                         // Switch Play must not bounce this back onto the opponent
        try { increaseTrance(p, amount, source); } finally { increaseTrance.reflecting = prev; }
    }

    // someone bought a card (from the market or from the opponent with Hypnotic Dominance)
    function onCardPurchased(buyerId, card) {
        const g = G(); if (!g) return;
        const opp = buyerId === 1 ? g.p2 : g.p1;
        if (ptHas(opp, "toll")) {
            opp.energy = (Number(opp.energy) || 0) + CFG.toll.energy;
            announce(otherId(buyerId), `${opp.name}'s Toll: +${CFG.toll.energy} ⚡ for ${card && card.name ? card.name : "the purchase"}.`);
            markUsed(opp, "toll");
        }
    }


    // ############################################################
    // 6b) PHASE 2: ECHO, CALLED SHOT, MEDITATION, TURN THE TABLES
    // ############################################################
    const FACE_NAMES = { TRANSFORM: "Transform", SUBMISSION: "Submission", AROUSAL: "Arousal", SPIRAL: "Trance", ENERGY: "Energy", LUCIDITY: "Lucidity" };
    const FACE_ICONS = { TRANSFORM: "👁️", SUBMISSION: "⛓️", AROUSAL: "🔥", SPIRAL: "🌀", ENERGY: "⚡", LUCIDITY: "💧" };
    function keyLabel(key) { return key && FACE_ICONS[key] ? FACE_ICONS[key] : ""; }          // symbol only (the tooltip carries the name)
    function faceKey(face) {                                    // "👁️ TRANSFORM" -> "TRANSFORM"; blanks and "-" -> null
        const f = String(face || "").toUpperCase();
        return Object.keys(FACE_NAMES).find(k => f.includes(k)) || (f.includes("TRANCE") ? "SPIRAL" : null);
    }
    function faceLabel(face) { const k = faceKey(face); return k ? String(face).split(" ")[0] + " " + FACE_NAMES[k] : "⬜ Blank"; }
    function activePlayerObj() { const g = G(); return g ? (Number(g.activePlayer) === 1 ? g.p1 : g.p2) : null; }
    function me() { const g = G(); return (g && typeof isLocalPlayerTurn === "function" && isLocalPlayerTurn()) ? activePlayerObj() : null; }
    function refresh() {
        if (typeof syncToFirebase === "function") syncToFirebase();
        if (typeof updateUI === "function") updateUI();
    }

    // ---------- the alert box (the card-trigger toast) ----------
    function escHtml(v) { return String(v).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])); }
    function toastLine(playerId, title, detail) {
        const g = G(), toast = document.getElementById("card-trigger-toast");
        if (!g || !toast) return;
        const p = Number(playerId) === 1 ? g.p1 : g.p2;
        const color = Number(playerId) === 1 ? "var(--player)" : "var(--cpu)";
        const line = `<div><span class="toast-player" style="color:${color}">${escHtml(p.name)}</span> · <strong>${escHtml(title)}</strong>: ${escHtml(detail)}</div>`;
        const existing = toast.classList.contains("visible") ? toast.innerHTML : "";
        toast.innerHTML = existing + line;
        toast.classList.remove("visible"); void toast.offsetWidth; toast.classList.add("visible");
        if (typeof cardTriggerToastTimer !== "undefined" && cardTriggerToastTimer) { clearTimeout(cardTriggerToastTimer); cardTriggerToastTimer = null; }
    }
    // rollDiceAction() wipes the alert box when a roll starts, so the "Called Shot: X" line waits here and is shown right after the wipe
    let pendingCalledShotAlert = null;
    function afterRollStarts() {
        if (!pendingCalledShotAlert) return;
        const a = pendingCalledShotAlert; pendingCalledShotAlert = null;
        toastLine(a.playerId, "🎯 Called Shot", a.text);
    }

    // ---------- ECHO ----------
    // Once per turn, after rolling, pay 1 ⚡ to copy one die's face onto another die.
    function echoAvailable(p) {
        const g = G();
        return !!(g && p && ptHas(p, "echo") && g.phase === "rolling" && !g.meditating && g.dice.length >= 2 && g.dice[0].face !== "-"
            && !p.echoUsedThisTurn && (Number(p.energy) || 0) >= 1);
    }
    function doEcho(p, from, to) {
        const g = G();
        g.dice[to].face = g.dice[from].face;                    // the target keeps its locked/unlocked state
        p.energy = (Number(p.energy) || 0) - 1;
        p.echoUsedThisTurn = true;
        announce(Number(g.activePlayer), `${p.name}'s Echo (1 ⚡): die ${to + 1} copies die ${from + 1} (${faceLabel(g.dice[from].face)}).`);
        if (typeof playSound === "function") playSound("lock");
        markUsed(p, "echo");
        refresh();
    }
    function openEcho() {                                       // two prompts: which die to copy, then which die to change
        const g = G(), p = me();
        if (!p || !echoAvailable(p) || typeof showChoiceDialog !== "function") return;
        const labels = g.dice.map((d, i) => `Die ${i + 1}: ${faceLabel(d.face)}`);
        showChoiceDialog({
            key: "echo-source", title: "Echo (1 ⚡)", message: "Which die do you want to copy?",
            options: g.dice.map((d, i) => ({ label: labels[i], onClick: () => {
                const targets = g.dice.map((t, j) => j).filter(j => j !== i && g.dice[j].face !== g.dice[i].face);
                if (!targets.length) { log("Echo: every other die already shows that face."); return; }
                setTimeout(() => showChoiceDialog({
                    key: "echo-target", title: "Echo (1 ⚡)", message: `Copy ${faceLabel(g.dice[i].face)} onto which die?`,
                    options: targets.map(j => ({ label: labels[j], onClick: () => doEcho(p, i, j) })).concat([{ label: "Cancel", secondary: true, onClick: () => {} }])
                }), 0);
            } })).concat([{ label: "Cancel", secondary: true, onClick: () => {} }])
        });
    }
    // CPU: copy a face when it completes or extends a combination
    // value of a final roll to the CPU, counting the thresholds that matter (a win, Submission running off the end, a Deepening)
    function cpuEchoOutcome(counts) {
        const g = G(), me = g.p2, opp = g.p1, T = setbackThreshold(opp), has = id => hasCard(2, id);
        let v = 0;
        const tr = counts.TRANSFORM || 0;
        if (tr >= 3) {
            const eff = 1 + (tr - 3) + (has(2) ? 1 : 0);
            v += eff * 9;
            if ((Number(opp.transform) || 0) + eff >= 10) v += 1000;                    // this roll wins the game
        }
        const su = counts.SUBMISSION || 0;
        if (su >= 3) {
            const push = 1 + (su - 3) + (ptHas(me, "submissionamplifier") ? 1 : 0) + (has(36) ? 1 : 0);
            v += push * 4;
            if ((Number(g.submission) || 0) - push <= -5) v += 30;                      // the marker runs off their end: a Transform
        }
        const sp = counts.SPIRAL || 0;
        if (sp > 0 && !opp.shieldActive) {
            v += sp * 1.2;
            if ((Number(opp.trance) || 0) < T && (Number(opp.trance) || 0) + sp >= T) v += 10;    // a Deepening
        }
        const ar = counts.AROUSAL || 0, arEff = ptHas(me, "heatedopening") ? ar : (ar >= 2 ? ar - 1 : 0);
        if (arEff > 0 && !opp.shieldActive) {
            v += arEff * 1.4;
            if ((Number(opp.arousal) || 0) < 5 && (Number(opp.arousal) || 0) + arEff >= 5) v += 3;
        }
        v += (counts.ENERGY || 0) * 0.9;
        v += Math.min(counts.LUCIDITY || 0, (Number(me.trance) || 0) + (Number(me.arousal) || 0)) * 0.8;   // 💧 only helps if there is something to clean up
        return v;
    }
    function cpuTryEchoSmart(p) {
        const g = G();
        const keys = g.dice.map(d => faceKey(d.face));
        const tally = ks => { const c = {}; ks.forEach(k => { if (k) c[k] = (c[k] || 0) + 1; }); return c; };
        const base = cpuEchoOutcome(tally(keys));
        let best = null;
        keys.forEach((f, i) => keys.forEach((t, j) => {
            if (i === j || !f || !t || f === t) return;
            const next = keys.slice(); next[j] = f;                                      // die j becomes a copy of die i
            const gain = cpuEchoOutcome(tally(next)) - base;
            if (!best || gain > best.gain) best = { i, j, gain };
        }));
        if (best && best.gain >= 3) { doEcho(p, best.i, best.j); return true; }
        return false;
    }
    function cpuTryEcho() {
        const g = G(), p = g.p2;
        if (!echoAvailable(p) || (Number(p.energy) || 0) < 2) return false;     // keep a spare ⚡
        if (typeof cpuSmartTier === "function" && cpuSmartTier() >= 2) return cpuTryEchoSmart(p);
        const keys = g.dice.map(d => faceKey(d.face));
        const counts = {}; keys.forEach(k => { if (k) counts[k] = (counts[k] || 0) + 1; });
        const worth = { TRANSFORM: 3, SUBMISSION: 2.2, AROUSAL: 1.5, SPIRAL: 1.2, ENERGY: 1, LUCIDITY: 0.8 };
        const val = (f, c) => (f === "TRANSFORM" || f === "SUBMISSION") ? (c >= 3 ? (c - 2) * worth[f] * 3 : 0)
            : (f === "AROUSAL" ? (c >= 2 ? (c - 1) * worth[f] : 0) : c * worth[f] * 0.4);
        let best = null;
        keys.forEach((f, i) => keys.forEach((t, j) => {
            if (i === j || f === t || !f) return;
            const gain = val(f, (counts[f] || 0) + 1) - val(f, counts[f] || 0) + (t ? val(t, counts[t] - 1) - val(t, counts[t]) : 0);
            if (!best || gain > best.gain) best = { i, j, gain };
        }));
        if (best && best.gain >= 1.5) { doEcho(p, best.i, best.j); return true; }
        return false;
    }

    // ---------- CALLED SHOT ----------
    // Name a face before the first roll. At resolve: shown 3+ times = that face's effect is +1; shown fewer than 2 = lose 1 ⚡.
    // Faces are shown as SYMBOLS only (tooltips give the names).
    function announceCalledShot(playerId, p, key) {
        announce(playerId, `${p.name}'s Called Shot: ${keyLabel(key)}.`);        // log + flash the power box
        pendingCalledShotAlert = { playerId, text: `called ${keyLabel(key)}` };    // alert box, shown as soon as the roll starts
    }
    function beforeRoll() {                                     // called at the top of rollDiceAction(); true = a prompt was opened
        const g = G(); if (!g || !g.dice || !g.dice.length) return false;
        const p = activePlayerObj();
        if (!ptHas(p, "calledshot") || g.meditating || g.dice[0].face !== "-" || g.signatureSiobhanBonusRoll || p.calledFace) return false;
        if (Number(g.activePlayer) === 2 && g.gameMode === "solo") { p.calledFace = cpuPickCalledFace(p); return false; }
        if (typeof isLocalPlayerTurn === "function" && !isLocalPlayerTurn()) return false;
        if (typeof showChoiceDialog !== "function" || typeof FACES === "undefined") return false;
        showChoiceDialog({
            key: "called-shot", title: "Called Shot",
            message: "Name a face before you roll. If it shows 3 or more times its effect is +1. If it shows fewer than 2 times, you lose 1 ⚡.",
            options: FACES.map(face => ({ label: keyLabel(faceKey(face)), faceName: faceKey(face), onClick: () => {
                p.calledFace = faceKey(face);
                announceCalledShot(Number(g.activePlayer), p, p.calledFace);
                refresh();
                setTimeout(() => rollDiceAction(), 0);
            } }))
        });
        return true;
    }

    // ----- CPU: which face to call -----
    // Beginner ("random") keeps the old simple pick. Every other level calls the face that serves its current plan, because it will
    // then play to get at least 2 of them (see cpuCalledShotAdjustKeep).
    function cpuIsNovice(p) { return (p.difficulty || "random") === "random"; }
    function cpuSmartCalledFace(p) {
        const g = G(), opp = g.p1;
        const T = setbackThreshold(opp), myT = setbackThreshold(p);
        const sub = Number(g.submission) || 0;                      // positive = toward the CPU's defeat
        const plan = (typeof cpuBrain !== "undefined" && cpuBrain && cpuBrain.plan) || "none";
        const heated = ptHas(p, "heatedopening");                          // Heated Opening: every 🔥 die counts
        const sc = { TRANSFORM: 3, SUBMISSION: 2, AROUSAL: 1, SPIRAL: 1, ENERGY: 1.2, LUCIDITY: 0.4 };
        const safe = (fn, dflt) => { try { return fn(); } catch (e) { return dflt; } };

        // Submission: defend when the marker is on the CPU's side, push when it is on the opponent's side
        const avoidPush = safe(() => typeof cpuShouldAvoidSubmissionPush === "function" && cpuShouldAvoidSubmissionPush(), false);
        if (sub >= 4) sc.SUBMISSION += 12; else if (sub >= 3) sc.SUBMISSION += 10; else if (sub >= 2) sc.SUBMISSION += 6;
        if (sub <= -2 && !avoidPush) sc.SUBMISSION += 6;
        if (plan === "submission" && !avoidPush) sc.SUBMISSION += 5;
        // Trance: two 🌀 dice would take the opponent to their Deepening point
        if (!opp.shieldActive && opp.trance < T && opp.trance + 2 >= T) sc.SPIRAL += 8;
        // Arousal: only when that plan is running and the opponent can still be pushed (2 🔥 dice = +1, or +2 with Heated Opening)
        const arLimit = heated ? 3 : 4;
        if (!opp.shieldActive && opp.arousal <= arLimit && safe(() => cpuArousalDiceNeeded() > 0, true)) {
            if (plan === "arousal") sc.AROUSAL += 6;
        } else sc.AROUSAL -= 100;
        // Transform: close to winning (or the Transform plan)
        const myProgress = Number(opp.transform) || 0;              // the opponent's Transform is the CPU's progress
        if (myProgress >= 8) sc.TRANSFORM += 9; else if (myProgress >= 7) sc.TRANSFORM += 7;
        if (plan === "transform") sc.TRANSFORM += 4;
        // Energy: saving for a card, or the Energy plan, or nearly broke
        if (plan === "energy" || safe(() => typeof cpuShoppingTarget === "function" && !!cpuShoppingTarget(), false)
            || ((Number(p.energy) || 0) < 3 && (p.inventory || []).length <= 1)) sc.ENERGY += 5;
        // Lucidity: lowering its own Arousal / Trance, or (Lucid Reversal) its own Transform
        if ((Number(p.arousal) || 0) >= 4) sc.LUCIDITY += 7;
        if ((Number(p.trance) || 0) >= myT - 1 && (Number(p.trance) || 0) > 0) sc.LUCIDITY += 7;
        if (ptHas(p, "lucidreversal") && (Number(p.transform) || 0) >= 7) sc.LUCIDITY += 6;
        // a light tie-break from the CPU's general face weights
        safe(() => { if (typeof cpuFaceWeights === "function") { const w = cpuFaceWeights();
            const map = { TRANSFORM: w.TR, SUBMISSION: w.SU, AROUSAL: w.AR, SPIRAL: w.SP, ENERGY: w.EN };
            Object.keys(map).forEach(k => { if (map[k] > -50) sc[k] += map[k] * 0.5; }); } }, null);
        return Object.keys(sc).sort((a, b) => sc[b] - sc[a])[0];
    }
    function cpuPickCalledFace(p) {
        const g = G();
        let key = "TRANSFORM";
        try {
            if (cpuIsNovice(p)) {
                if (typeof cpuFaceWeights === "function") {
                    const w = cpuFaceWeights();
                    const map = { TRANSFORM: w.TR, SUBMISSION: w.SU, AROUSAL: w.AR, SPIRAL: w.SP, ENERGY: w.EN };
                    key = Object.keys(map).filter(k => map[k] > -50).sort((a, b) => map[b] - map[a])[0] || key;
                }
            } else key = cpuSmartCalledFace(p);
        } catch (e) { /* keep the default */ }
        announceCalledShot(2, p, key);
        return key;
    }
    // ----- CPU: play to get at least 2 of the called face -----
    // Runs after the normal "which dice to keep" decision (every skill level except Beginner). It always locks the called face, and
    // while there are fewer than 2 it frees other locked dice so they get rerolled, but it never breaks up a finished triple (or a
    // Submission die while the CPU is pinned).
    function cpuCalledShotActive(p) {
        const g = G();
        return !!(g && g.gameMode === "solo" && Number(g.activePlayer) === 2 && p === g.p2 && ptHas(p, "calledshot") && p.calledFace
            && !cpuIsNovice(p) && g.phase === "rolling" && !g.signatureSiobhanBonusRoll && !g.meditating);
    }
    function calledFaceCount(p) { const g = G(); return g.dice.filter(d => faceKey(d.face) === p.calledFace).length; }
    function cpuCalledShotAdjustKeep() {
        const g = G(), p = g && g.p2;
        if (!cpuCalledShotActive(p)) return;
        const key = p.calledFace;
        g.dice.forEach(d => { if (faceKey(d.face) === key) d.kept = true; });
        if (calledFaceCount(p) >= 2) return;
        const pinned = typeof isCpuPinnedInSubmission === "function" && isCpuPinnedInSubmission();
        const counts = {}; g.dice.forEach(d => { const k = faceKey(d.face); if (k) counts[k] = (counts[k] || 0) + 1; });
        g.dice.forEach(d => {
            const k = faceKey(d.face);
            if (k === key || !d.kept || d.signatureRozLocked) return;
            if (k && counts[k] >= 3) return;                      // a finished triple stays
            if (pinned && k === "SUBMISSION") return;
            d.kept = false;
        });
    }
    // true = the CPU should spend a free reroll (Absolute Focus charge) because it still has fewer than 2 of its called face
    function cpuNeedsCalledShotReroll() {
        const g = G(), p = g && g.p2;
        return cpuCalledShotActive(p) && calledFaceCount(p) < 2;
    }

    // at resolve: adds the +1 (as an extra die of that face) and charges the penalty. Call it after counts are built.
    function applyCalledShot(p, playerNum, counts) {
        const key = p && p.calledFace; if (!key || !ptHas(p, "calledshot")) return;
        const g = G();
        const sym = keyLabel(key);
        const shown = g.dice.filter(d => faceKey(d.face) === key).length;
        if (shown >= 3 && counts[key] >= shown) {                          // not wiped out by Siobhan's bonus roll
            counts[key] += 1;
            announce(playerNum, `Called Shot hits: ${sym} showed ${shown} times, so its effect is +1.`);
            toastLine(playerNum, "🎯 Called Shot", `hit! ${sym} showed ${shown} times: effect +1`);
        } else if (shown < 2) {
            const lost = Math.min(1, Number(p.energy) || 0);
            p.energy = (Number(p.energy) || 0) - lost;
            announce(playerNum, `Called Shot misses: ${sym} showed ${shown} time${shown === 1 ? "" : "s"}${lost ? ", lose 1 ⚡" : ""}.`);
            toastLine(playerNum, "🎯 Called Shot", `missed. ${sym} showed ${shown} time${shown === 1 ? "" : "s"}${lost ? ", -1 ⚡" : ""}`);
        } else {
            log(`Called Shot: ${sym} showed ${shown} times. No bonus and no penalty.`);
            toastLine(playerNum, "🎯 Called Shot", `${sym} showed ${shown} times: no bonus, no penalty`);
        }
        p.calledFace = null;
        markUsed(p, "calledshot");
    }
    // the "🎯 Called: X" badge above each player's Active Cards (called from updateUI)
    function renderCalledShotBadges() {
        const g = G(); if (!g) return;
        [1, 2].forEach(id => {
            const el = document.getElementById(`p${id}-called-shot`); if (!el) return;
            const p = id === 1 ? g.p1 : g.p2;
            const key = p && ptHas(p, "calledshot") && p.calledFace;
            if (!key || !FACE_ICONS[key]) { el.style.display = "none"; el.innerHTML = ""; return; }
            el.style.display = "block";
            const html = `🎯 Called: <span class="called-face" data-face-name="${key}">${FACE_ICONS[key]}</span>`;
            if (el.innerHTML !== html) el.innerHTML = html;
        });
    }

    // ---------- MEDITATION ----------
    // Instead of rolling: gain 3 ⚡, lower Trance and Arousal by 1, then go straight to shopping. Not two turns in a row.
    function meditationAvailable(p) {
        const g = G();
        return !!(g && p && ptHas(p, "meditation") && g.phase === "rolling" && g.dice[0].face === "-" && !g.signatureSiobhanBonusRoll && !p.meditatedLast);
    }
    function applyMeditation(p, playerNum) {
        const g = G();
        p.energy = (Number(p.energy) || 0) + 3;
        p.trance = Math.max(0, (Number(p.trance) || 0) - 1);
        p.arousal = Math.max(0, (Number(p.arousal) || 0) - 1);
        p.meditatedThis = true;
        p.calledFace = null;
        g.meditating = true;                                              // so Transformation Ritual does not charge for the empty roll
        g.dice = g.dice.map(() => ({ face: "⬜ BLANK", kept: true }));
        g.rerollsLeft = 0;
        announce(playerNum, `${p.name} meditates instead of rolling: +3 ⚡, -1 🌀, -1 🔥. No rolls or card purchases this turn.`);
        markUsed(p, "meditation");
    }
    function meditate() {                                               // the button
        const p = me();
        if (!p || !meditationAvailable(p)) return;
        applyMeditation(p, Number(G().activePlayer));
        refresh();
        resolveDice();                                                   // resolves the blank dice, which moves on to the shop phase
    }
    function cpuWantsMeditation(p) {
        const g = G();
        if (g.p1.transform >= 8 || p.transform >= 8) return false;        // endgame: keep rolling
        return (Number(p.arousal) || 0) >= 4 || (Number(p.trance) || 0) >= setbackThreshold(p) - 1
            || ((Number(p.energy) || 0) <= 1 && Math.random() < 0.35);
    }
    // Top two levels: meditating means NO buying this turn, so skip it when there is a card worth buying right now (unless it is an emergency)
    function cpuMeditationWorthIt(p) {
        const g = G();
        if (typeof cpuSmartTier !== "function" || cpuSmartTier() < 2 || typeof cpuCardValue !== "function") return true;
        const T = setbackThreshold(p);
        if ((Number(p.trance) || 0) >= T - 1 || (Number(p.arousal) || 0) >= 5) return true;            // a Deepening or the worst Arousal band is imminent: recover
        const bar = cpuBuyBar(), energy = Number(p.energy) || 0;
        let best = 0;
        const consider = (card, cost) => {
            if (!card || cost > energy) return;
            if (typeof inventoryHasName === "function" && inventoryHasName(p, card.name)) return;
            best = Math.max(best, cpuCardValue(card));
        };
        if (holdsLayaway(2)) {                                                                          // holding a reservation: only that card matters
            const o = layawayOffer(2, 2); if (o && o.cost <= energy) best = 999;
        } else {
            market.forEach(card => card && consider(card, getCardPurchaseCost(card, 2)));
            const L = g.p1.layaway;
            if (L && L.stage === "open") consider(L.card, Math.max(0, getCardPurchaseCost(L.card, 2) - CFG.layaway.discount));
        }
        return best < bar;
    }
    // called at the very start of the CPU's turn; true = it meditated (so the caller must NOT roll)
    // how useful is this borrowed power to the CPU right now (0 to 10)? Only clearly dead powers are worth a 3 ⚡ swap.
    function cpuKaleidoValue(p, key) {
        const g = G(), T = setbackThreshold(p);
        if (key === "cornered") return (Number(p.transform) || 0) >= 8 ? 9 : 2;
        if (key === "meditation") {
            const hurting = (Number(p.arousal) || 0) >= 3 || (Number(p.trance) || 0) >= Math.max(2, T - 2);
            return hurting ? 8 : 2;
        }
        if (key === "layaway") return p.layaway ? 1 : 4;
        return 5;
    }
    function cpuKaleidoSwapMaybe(p) {
        if (!kaleidoSwapAvailable(p) || (Number(p.energy) || 0) < CFG.kaleidoscope.swapCost + 3) return;
        if (cpuKaleidoValue(p, p.borrowedKey) > 2) return;
        kaleidoSwapDo(p, 2);
    }
    function cpuStartOfTurn() {
        const g = G(); if (!g || g.gameMode !== "solo") return false;
        const p = g.p2;
        cpuKaleidoSwapMaybe(p);
        if (meditationAvailable(p) && cpuWantsMeditation(p) && cpuMeditationWorthIt(p)) { applyMeditation(p, 2); return true; }
        if (ptHas(p, "calledshot") && !p.calledFace) p.calledFace = cpuPickCalledFace(p);
        return false;
    }

    // ---------- TURN THE TABLES ----------
    // Once per game, in your shop phase: mirror the Submission marker (+3 becomes -3).
    function tablesAvailable(p) {
        const g = G();
        return !!(g && p && ptHas(p, "turntables") && g.phase === "shop" && !p.tablesUsed && Number(g.submission) !== 0);
    }
    function doTables(p, playerNum) {
        const g = G();
        const before = Number(g.submission);
        g.submission = -before;
        p.tablesUsed = true;
        announce(playerNum, `${p.name} uses Turn the Tables: the Submission marker flips from ${before > 0 ? "+" : ""}${before} to ${g.submission > 0 ? "+" : ""}${g.submission}!`);
        if (typeof showTurnAlert === "function") showTurnAlert("Turn the Tables!", playerNum);
        markUsed(p, "turntables");
        refresh();
    }
    function turnTables() { const p = me(); if (p && tablesAvailable(p)) doTables(p, Number(G().activePlayer)); }
    // CPU: flip it when the marker is well on the CPU's own side (positive = toward Player 2)
    function cpuShopPowers() {
        const g = G(); if (!g || g.gameMode !== "solo") return;
        const p = g.p2;
        if (!tablesAvailable(p)) return;
        const sub = Number(g.submission) || 0;                              // positive = against the CPU
        const top = typeof cpuSmartTier === "function" && cpuSmartTier() >= 2;
        let flip = sub >= 3;
        if (top && !flip) {
            // 1) You Will Obey is lethal once the marker is on THEIR side: flip, then buy it
            const obey = market.some(cd => cd && Number(cd.id) === 52 && getCardPurchaseCost(cd, 2) <= (Number(p.energy) || 0));
            if (obey && sub >= 1 && !holdsLayaway(2)) flip = true;
            // 2) they could push the marker over our end next turn: flip while it still helps
            if (sub >= 2 && typeof cpuDanger === "function" && cpuDanger() > 0 && cpuThreatForecast().overflow > 0) flip = true;
        }
        if (flip) doTables(p, 2);
    }


    // ############################################################
    // 6c) PHASE 3: LAYAWAY and KALEIDOSCOPE
    // ############################################################

    // ---------- KALEIDOSCOPE ----------
    // p.borrowedKey = the power held right now; p.kUsed = powers already used in this cycle. hasPower() already treats the borrowed
    // power as the player's own, so every hook for every power just works.
    // the power a player is actually playing with right now (a Kaleidoscope player plays their borrowed power)
    function effectiveKey(p) { const k = keyFor(p); return k === "kaleidoscope" ? (p.borrowedKey || null) : k; }
    // Both players never hold the same power: a draw skips whatever the opponent is playing with
    function kaleidoDraw(p, excludeKey) {
        const g = G(), opp = g ? (p === g.p1 ? g.p2 : g.p1) : null;
        const taken = opp ? effectiveKey(opp) : null;
        const pool = CFG.kaleidoscope.pool;
        p.kUsed = Array.isArray(p.kUsed) ? p.kUsed : [];
        let candidates = pool.filter(k => !p.kUsed.includes(k) && k !== excludeKey && k !== taken);
        if (!candidates.length) {                                   // everything has been used: recycle
            p.kUsed = [];
            candidates = pool.filter(k => k !== excludeKey && k !== taken);
            if (excludeKey !== null && typeof log === "function") log(`${p.name}'s Kaleidoscope has used every power and starts a new cycle.`);
        }
        const k = candidates[Math.floor(Math.random() * candidates.length)];
        p.borrowedKey = k;
        if (k === "turntables") p.tablesUsed = false;               // a fresh draw of a once-per-game power is usable again
        if (k === "meditation") p.meditatedLast = false;
        if (k === "predatorymomentum") p.signatureSiobhanUsed = false;
        if (k === "perfectharmony") p.signatureHyeriUsedFaces = [];
        p.kFired = null;
        return k;
    }
    // call this at the moment a borrowed power is performed (no-op for anyone else)
    function markUsed(p, key) {
        if (!p || keyFor(p) !== "kaleidoscope" || p.borrowedKey !== key) return;
        p.kUsed = Array.isArray(p.kUsed) ? p.kUsed : [];
        p.kUsed.push(key);
        const next = kaleidoDraw(p, key);
        const id = idOf(p), a = infoFor(key), b = infoFor(next);
        announce(id, `${p.name}'s Kaleidoscope: ${a.icon} ${a.title} used. New power: ${b.icon} ${b.title}.`);
        toastLine(id, "🔮 Kaleidoscope", `${a.icon} used, now ${b.icon} ${b.title}`);
    }
    function kaleidoSwapAvailable(p) {
        const g = G();
        return !!(g && p && p.specialAbility !== false && keyFor(p) === "kaleidoscope" && p.borrowedKey && !p.kSwapped && !p.calledFace
            && (g.phase === "rolling" || g.phase === "shop") && (Number(p.energy) || 0) >= CFG.kaleidoscope.swapCost
            && !(typeof isChoicePending === "function" && isChoicePending()));
    }
    function kaleidoSwap() {
        const p = me(), g = G();
        if (!p || !kaleidoSwapAvailable(p)) return;
        kaleidoSwapDo(p, Number(g.activePlayer));
    }
    function kaleidoSwapDo(p, num) {
        const g = G();
        const old = p.borrowedKey;
        p.energy = (Number(p.energy) || 0) - CFG.kaleidoscope.swapCost;
        const next = kaleidoDraw(p, old);                            // the old power goes back into the pile: it does NOT count as used
        p.kSwapped = true;
        const a = infoFor(old), b = infoFor(next);
        announce(num, `${p.name}'s Kaleidoscope (${CFG.kaleidoscope.swapCost} ⚡): ${a.icon} ${a.title} swapped for ${b.icon} ${b.title}.`);
        refresh();
    }
    // Original-character powers are not hooked one by one: hypbattle.js flashes the power's board box whenever it fires, and that flash
    // lands here. The power is retired at the end of the turn (not mid-roll, which would switch it off half way through a resolve).
    function legacyFired(playerId) {
        const g = G(); if (!g) return;
        const p = Number(playerId) === 1 ? g.p1 : g.p2;
        if (!p || keyFor(p) !== "kaleidoscope" || !p.borrowedKey || REGISTRY[p.borrowedKey]) return;     // new powers call markUsed themselves
        p.kFired = p.borrowedKey;
    }
    function flushLegacyFired() {
        const g = G(); if (!g) return;
        [g.p1, g.p2].forEach(o => {
            const k = o.kFired; if (!k) return;
            if (k === "predatorymomentum" && g.signatureSiobhanBonusPending) return;        // her bonus turn still needs the power
            o.kFired = null;
            if (o.borrowedKey === k) markUsed(o, k);
        });
    }
    // the board hint for a Kaleidoscope player also shows the power they are holding
    function hintFor(pObj) {
        const key = keyFor(pObj), info = infoFor(key);
        if (!info || key !== "kaleidoscope" || !pObj.borrowedKey || !infoFor(pObj.borrowedKey)) return info;
        const b = infoFor(pObj.borrowedKey); if (!b) return info;
        return Object.assign({}, info, { description: `${info.description}<br><span class="kaleido-current">Holding: <b>${b.icon} ${b.title}</b>. ${b.description}</span>` });
    }

    // ---------- LAYAWAY ----------
    // p.layaway = { card, stage: "owner" | "open", turnsLeft, fresh }.  The card sits OUTSIDE the market (wipes cannot touch it).
    //   stage "owner": only the owner can buy it (normal cost) and the owner can buy no other card. It lasts the owner's next 2 turns.
    //   stage "open":  the opponent may buy it on their next turn for 1 ⚡ less. If they do not, it is discarded at the end of that turn.
    function holdsLayaway(playerId) {
        const g = G(); if (!g) return false;
        const p = Number(playerId) === 1 ? g.p1 : g.p2;
        return !!(p && p.layaway && p.layaway.stage === "owner");
    }
    function layawayAvailable(p) {
        const g = G();
        return !!(g && p && ptHas(p, "layaway") && g.phase === "shop" && !p.layaway && (Number(p.energy) || 0) >= CFG.layaway.reserveCost
            && typeof market !== "undefined" && market.length > 0 && !(typeof isChoicePending === "function" && isChoicePending()));
    }
    function reserveLayaway(p, playerNum, marketIndex) {
        const card = market[marketIndex]; if (!card || p.layaway) return false;
        p.energy = (Number(p.energy) || 0) - CFG.layaway.reserveCost;
        market.splice(marketIndex, 1);
        if (typeof refillMarket === "function") refillMarket();
        p.layaway = { card: JSON.parse(JSON.stringify(card)), stage: "owner", turnsLeft: CFG.layaway.ownerTurns, fresh: true };
        announce(playerNum, `${p.name}'s Layaway (${CFG.layaway.reserveCost} ⚡): ${card.name} is reserved.`);
        toastLine(playerNum, "🏷️ Layaway", `${card.name} reserved`);
        markUsed(p, "layaway");
        refresh();
        return true;
    }
    function openLayaway() {
        const p = me(), g = G();
        if (!p || !layawayAvailable(p)) return;
        const num = Number(g.activePlayer);
        showChoiceDialog({
            key: "layaway", title: "Layaway",
            message: `Reserve one card for ${CFG.layaway.reserveCost} ⚡. Only you can buy it for your next ${CFG.layaway.ownerTurns} turns (and no other card), then your opponent may buy it for 1 ⚡ less.`,
            options: market.map((card, i) => ({ label: `${card.name} (${getCardPurchaseCost(card, num)}⚡)`, onClick: () => reserveLayaway(p, num, i) }))
                .concat([{ label: "Cancel", secondary: true, onClick: () => {} }])
        });
    }
    // what would this buyer pay for this owner's reserved card, and may they buy it right now?
    function layawayOffer(ownerId, buyerId) {
        const g = G(); if (!g) return null;
        const owner = ownerId === 1 ? g.p1 : g.p2, buyer = buyerId === 1 ? g.p1 : g.p2, L = owner.layaway;
        if (!L) return null;
        let cost = getCardPurchaseCost(L.card, buyerId);
        if (L.stage === "open") cost = Math.max(0, cost - CFG.layaway.discount);
        const eligible = L.stage === "owner" ? buyerId === ownerId : buyerId !== ownerId;
        let why = "";
        if (!eligible) why = L.stage === "owner" ? "Reserved" : "Open to the other player";
        else if (L.stage === "owner" && L.fresh) why = "From your next turn";            // reserved at the end of a turn, so not buyable until then
        else if (g.meditating) why = "Meditating";
        else if (L.stage === "open" && holdsLayaway(buyerId)) why = "Holding a Layaway";
        else if (typeof inventoryHasName === "function" && inventoryHasName(buyer, L.card.name)) why = "Already owned";
        else if ((Number(buyer.energy) || 0) < cost) why = "Cannot afford";
        return { card: L.card, cost, stage: L.stage, turnsLeft: L.turnsLeft, eligible, ok: eligible && !why, why };
    }
    function buyLayaway(ownerId) {                                       // the button on the Layaway slot
        const g = G(); if (!g || g.phase !== "shop" || (typeof isLocalPlayerTurn === "function" && !isLocalPlayerTurn())) return false;
        const buyerId = Number(g.activePlayer), offer = layawayOffer(ownerId, buyerId);
        if (!offer || !offer.ok) { if (typeof playSound === "function") playSound("deny"); return false; }
        const owner = ownerId === 1 ? g.p1 : g.p2;
        return buyCard(-1, { layaway: owner.layaway, ownerId, cost: offer.cost });
    }
    function layawayTaken(ownerId) {                                    // called by buyCard() once the reserved card is bought
        const g = G(); if (!g) return;
        (Number(ownerId) === 1 ? g.p1 : g.p2).layaway = null;
    }
    // end of a player's turn: count down their own reservation, open it up, or discard an unclaimed open one
    function layawayTurnEnded(playerId) {
        const g = G(); if (!g) return;
        [g.p1, g.p2].forEach(o => {
            const L = o.layaway; if (!L) return;
            const oid = idOf(o);
            if (L.stage === "owner" && oid === playerId) {
                if (L.fresh) { L.fresh = false; return; }                // the turn it was reserved does not count
                L.turnsLeft -= 1;
                if (L.turnsLeft <= 0) {
                    L.stage = "open";
                    announce(oid, `${o.name}'s Layaway runs out: ${L.card.name} is now open to ${(oid === 1 ? g.p2 : g.p1).name} for 1 ⚡ less.`);
                }
            } else if (L.stage === "open" && oid !== playerId) {
                if (typeof discardCard === "function") discardCard(L.card);
                o.layaway = null;
                log(`${L.card.name} (Layaway) was not bought and is discarded.`);
            }
        });
    }
    // the Layaway slot under the market: one tile per reservation, visible to both players
    function renderLayawayZone() {
        const g = G(), zone = document.getElementById("layaway-zone"); if (!g || !zone) return;
        const tiles = [];
        [1, 2].forEach(ownerId => {
            const owner = ownerId === 1 ? g.p1 : g.p2, L = owner.layaway; if (!L) return;
            const buyerId = Number(g.activePlayer), offer = layawayOffer(ownerId, buyerId);
            const mine = typeof isLocalPlayerTurn === "function" && isLocalPlayerTurn();
            const status = L.stage === "owner"
                ? `Reserved for ${escHtml(owner.name)}: ${L.fresh ? "from next turn, " : ""}${L.turnsLeft} turn${L.turnsLeft === 1 ? "" : "s"} left`
                : `Open to ${escHtml((ownerId === 1 ? g.p2 : g.p1).name)} for ${CFG.layaway.discount} ⚡ less, this turn only`;
            const c = L.card;
            const label = offer && offer.eligible ? (offer.why ? offer.why : `Buy (${offer.cost}⚡)`) : (offer ? offer.why : "");
            const enabled = !!(offer && offer.ok && mine && g.phase === "shop");
            tiles.push(`<div class="layaway-tile layaway-${L.stage}">
                <div class="layaway-head">🏷️ Layaway · ${status}</div>
                <div class="card ${c.type === "Instant" ? "card-instant" : "card-keep"} layaway-card" data-card-id="${Number(c.id)}">
                    <div class="card-header"><span>${escHtml(c.name)}</span> <span>${offer ? offer.cost : c.cost}⚡</span></div>
                    <div class="card-type"><span class="card-type-chip">${escHtml(c.type)}</span></div>
                    <div style="font-size:0.8em; margin: 10px 0; color:#ccc;">${c.desc}</div>
                    ${offer && offer.eligible ? `<button ${enabled ? "" : "disabled"} onclick="Abilities.buyLayaway(${ownerId})">${escHtml(label)}</button>` : ""}
                </div></div>`);
        });
        const html = tiles.join("");
        if (zone.innerHTML !== html) zone.innerHTML = html;
        zone.style.display = tiles.length ? "flex" : "none";
    }
    // ----- CPU -----
    function cpuHoldsLayaway() { const g = G(); return !!(g && g.gameMode === "solo" && holdsLayaway(2)); }
    function cpuLayawayCardScore(card) {
        try { if (typeof cpuAdaptiveCardScore === "function") return Number(cpuAdaptiveCardScore(card)) || 0; } catch (e) {}
        return (Number(card.cost) || 0) * 10;
    }
    function cpuLayawayThreshold() {
        try { if (typeof cpuAdaptiveBuyThreshold === "function") return Number(cpuAdaptiveBuyThreshold()) || 50; } catch (e) {}
        return 50;
    }
    function cpuCardOk(card) {
        const g = G(), p = g.p2;
        try {
            if (typeof inventoryHasName === "function" && inventoryHasName(p, card.name)) return false;
            if (typeof hasSignaturePower === "function" && hasSignaturePower(2, "unyieldingresistance") && typeof ALEX_DEFENSIVE_SUBMISSION_CARD_IDS !== "undefined" && ALEX_DEFENSIVE_SUBMISSION_CARD_IDS.includes(Number(card.id))) return false;
            if (typeof passesCardSpecificConditions === "function" && !passesCardSpecificConditions(card)) return false;
        } catch (e) {}
        return true;
    }
    // start of the CPU's shop phase: buy its own reserved card, or the human's open one when worth it
    function cpuLayawayShop() {
        const g = G(); if (!g || g.gameMode !== "solo" || g.meditating) return;
        const cpu = g.p2;
        if (cpu.layaway && cpu.layaway.stage === "owner") {
            const o = layawayOffer(2, 2);
            if (o && o.ok) buyLayaway2(2, o);
        } else if (g.p1.layaway && g.p1.layaway.stage === "open" && !holdsLayaway(2)) {
            const o = layawayOffer(1, 2);
            if (o && o.ok && cpuCardOk(o.card) && (cpuLayawayCardScore(o.card) >= cpuLayawayThreshold() || o.card.cost >= 4)) buyLayaway2(1, o);
        }
    }
    function buyLayaway2(ownerId, offer) {                               // CPU version: no "local turn" check
        const g = G(), owner = ownerId === 1 ? g.p1 : g.p2;
        return buyCard(-1, { layaway: owner.layaway, ownerId, cost: offer.cost });
    }
    // end of the CPU's turn: reserve a card it wants but cannot afford yet and should be able to afford soon
    function cpuLayawayReserve(p) {
        const g = G();
        if (!g || !ptHas(p, "layaway") || p.layaway || (Number(p.energy) || 0) < CFG.layaway.reserveCost || !market.length) return;
        const top = typeof cpuSmartTier === "function" && cpuSmartTier() >= 2;
        // while it holds a reservation the CPU cannot buy anything else, so never reserve when it may need the shop for an emergency
        if (top && ((typeof cpuDanger === "function" && cpuDanger() > 0) || (typeof cpuPressure === "function" && cpuPressure() >= 1))) return;
        const thr = cpuLayawayThreshold(), energy = Number(p.energy) || 0, after = energy - CFG.layaway.reserveCost;
        const has = id => hasCard(2, id);
        const income = 2 + (has(45) ? 1 : 0) + (has(55) ? 2 : 0);                // about what it earns per turn
        const reach = top ? after + income * CFG.layaway.ownerTurns : after + 4;  // what it can have by the end of its 2 exclusive turns
        const hu = g.p1;
        const rows = market.map((card, i) => card ? { card, i, cost: getCardPurchaseCost(card, 2) } : null).filter(Boolean);
        let best = null;
        rows.forEach(r => {
            if (r.cost <= energy) return;                                        // it could have bought this one already
            if (r.cost > reach) return;                                          // too far away to be affordable in time
            if (!cpuCardOk(r.card)) return;
            let score = cpuLayawayCardScore(r.card);
            if (top) {                                                           // reserving also keeps the card from the human
                const deny = typeof cpuDenyScore === "function" ? Number(cpuDenyScore(r.card)) || 0 : 0;
                score += deny * 0.5 + ((Number(hu.energy) || 0) + 2 >= getCardPurchaseCost(r.card, 1) ? 6 : 0);
            }
            if (score >= thr + (top ? 8 : 0) && (!best || score > best.score)) best = { i: r.i, score, cost: r.cost, card: r.card };
        });
        if (!best) return;
        if (top) {
            // opportunity cost: would it rather just buy something else next turn?
            const nextBudget = after + income;
            const alt = rows.filter(r => r.i !== best.i && r.cost <= nextBudget && cpuCardOk(r.card))
                .reduce((m, r) => Math.max(m, cpuLayawayCardScore(r.card)), 0);
            if (alt > best.score - 5) return;
        }
        reserveLayaway(p, 2, best.i);
    }

    // ---------- the buttons (added to the centre action row) ----------
    function actionButtonsHtml(isHumanTurn, isInitRoll) {
        const p = me();
        if (!isHumanTurn || !p) return "";
        let html = "";
        const btn = (onclick, text, bg, title) => `<button onclick="${onclick}" title="${title}" style="background:${bg}; color:#fff; font-weight:bold;">${text}</button>`;
        if (meditationAvailable(p)) html += btn("Abilities.meditate()", "🧘 Meditate", "#7c3aed", "Skip your roll: +3 energy, lower Trance and Arousal by 1");
        if (echoAvailable(p)) html += btn("Abilities.openEcho()", "🔁 Echo (1⚡)", "#0e7490", "Copy one die's face onto another die");
        if (tablesAvailable(p)) html += btn("Abilities.turnTables()", "🪞 Turn the Tables", "#b45309", "Once per game: flip the Submission marker");
        if (layawayAvailable(p)) html += btn("Abilities.openLayaway()", `🏷️ Layaway (${CFG.layaway.reserveCost}⚡)`, "#0f766e", "Reserve a market card for yourself");
        if (kaleidoSwapAvailable(p)) html += btn("Abilities.kaleidoSwap()", `🔮 Swap (${CFG.kaleidoscope.swapCost}⚡)`, "#a21caf", "Trade your borrowed power for another one (once per turn)");
        return html;
    }

    // ############################################################
    // 7) HELP TAB: boxes for powers that have a character (so new characters appear automatically)
    // ############################################################
    function helpBoxes() {
        return Object.keys(CHARACTER_POWER_KEYS).map(name => {
            const info = infoFor(CHARACTER_POWER_KEYS[name]); if (!info) return "";
            const file = (typeof characterFilename === "function") ? characterFilename(name) : name;
            return `<div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/${file}/${file}_head.jpg" alt="${name}">
                    <strong>${name}</strong><br><em>${info.title}</em><br>${info.description}
                </div>`;
        }).join("");
    }

    window.Abilities = {
        config: CFG, registry: REGISTRY, characterKeys: CHARACTER_POWER_KEYS,
        keyFor, hasPower, infoFor, infoForCharacter, assignPowers, setPower,
        baseRerolls, setbackThreshold, setbackMultiplier, extraDice,
        onTurnStart, onTurnEnd, onCardPurchased, helpBoxes,
        // phase 2
        beforeRoll, applyCalledShot, meditate, openEcho, turnTables, actionButtonsHtml,
        cpuStartOfTurn, cpuTryEcho, cpuShopPowers,
        // meditation rules, Called Shot display and CPU play, used-state
        meditatingNow, isUsed, afterRollStarts, renderCalledShotBadges, cpuCalledShotAdjustKeep, cpuNeedsCalledShotReroll,
        // phase 3: Layaway and Kaleidoscope
        markUsed, legacyFired, effectiveKey, hintFor, kaleidoSwap, openLayaway, buyLayaway, layawayTaken, holdsLayaway, renderLayawayZone,
        cpuLayawayShop, cpuHoldsLayaway
    };
})();
