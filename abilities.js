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
//   Phase 2: Echo, Called Shot, Meditation, Turn the Tables                 <- implemented (with simple CPU rules)
//   Phase 3: Layaway, Kaleidoscope                                          (registry entries exist, behaviour not yet)
// ============================================================

(function () {
    "use strict";

    // ############################################################
    // 1) NUMBERS YOU MAY WANT TO TUNE
    // ############################################################
    const CFG = {
        deepWell:  { threshold: 7, multiplier: 2 },            // Trance needed for a Setback / how much harder it hits
        cornered:  { transformAt: 8, extraDice: 1, energy: 1 },
        surrender: { tranceDivisor: 2 },                       // +1 Trance per 2 Arousal at the end of your turn
        toll:      { energy: 1 }
    };

    // ############################################################
    // 2) THE REGISTRY (player-facing text is used by the setup box, the board hint and the Characters help tab)
    // ############################################################
    const REGISTRY = {
        echo:        { key: "echo",        title: "Echo",              phase: 2, description: "Once per turn, after your final roll, pay 1 ⚡ to copy one die's face onto another die." },
        calledshot:  { key: "calledshot",  title: "Called Shot",       phase: 2, description: "Before your first roll, name a face. If it shows 3 or more times when you resolve, its effect is +1. If it shows fewer than 2 times, lose 1 ⚡." },
        surrender:   { key: "surrender",   title: "Surrender to Heat", phase: 1, description: "Arousal never costs you rerolls. At the end of your turn you gain 1 Trance for every 2 Arousal, which can push you into a Setback." },
        deepwell:    { key: "deepwell",    title: "Deep Well",         phase: 1, description: "You need 7 Trance for a Setback instead of 5, but when one lands its effect is doubled." },
        toll:        { key: "toll",        title: "Toll",              phase: 1, description: "Whenever your opponent buys a card, you gain 1 ⚡." },
        layaway:     { key: "layaway",     title: "Layaway",           phase: 3, description: "At the end of your turn, pay 1 ⚡ to reserve a market card. While you hold a reservation you can only buy that card. If you have not bought it within two turns, your opponent may buy it for 1 ⚡ less; if they do not, it is discarded." },
        meditation:  { key: "meditation",  title: "Meditation",        phase: 2, description: "Instead of rolling, you may meditate: gain 3 ⚡ and lower your Trance and Arousal by 1. Not two turns in a row. You can still shop." },
        cornered:    { key: "cornered",    title: "Cornered",          phase: 1, description: "While you have 8 or more Transform, you roll one extra die and gain 1 ⚡ at the start of each of your turns." },
        turntables:  { key: "turntables",  title: "Turn the Tables",   phase: 2, description: "Once per game, in your shop phase, mirror the Submission marker (+3 becomes -3)." },
        kaleidoscope:{ key: "kaleidoscope",title: "Kaleidoscope",      phase: 3, description: "You always hold one borrowed special ability, drawn at random from the others. When you use it, you draw the next. Pay 3 ⚡ to swap it for a new draw." }
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
    function normalizeKey(nameOrKey) {                          // callers pass a key ("zixuan") or, rarely, a name ("Siobhán")
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
    function infoFor(key) {
        const r = REGISTRY[key];
        if (r) return { key: r.key, title: r.title, description: r.description };
        if (typeof SIGNATURE_POWERS !== "undefined") {
            const hit = Object.values(SIGNATURE_POWERS).find(p => p.key === key);
            if (hit) return hit;
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
            p.layaway = null;
        });
    }
    // console helper:  Abilities.setPower(1, "deepwell")  swaps a power in a running game
    function setPower(playerNum, key) {
        const g = G(); if (!g) return;
        (playerNum === 1 ? g.p1 : g.p2).powerKey = key;
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
    // Trance needed for a Setback, and how hard the Setback hits
    function setbackThreshold(pObj) { return ptHas(pObj, "deepwell") ? CFG.deepWell.threshold : 5; }
    function setbackMultiplier(pObj) { return ptHas(pObj, "deepwell") ? CFG.deepWell.multiplier : 1; }
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
        p.echoUsedThisTurn = false; p.calledFace = null; p.meditatedThis = false; g.meditating = false;      // phase 2 per-turn flags
        if (ptHas(p, "cornered") && (Number(p.transform) || 0) >= CFG.cornered.transformAt) {
            p.energy = (Number(p.energy) || 0) + CFG.cornered.energy;
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
            if (gain > 0) selfTrance(p, playerId, gain);
        }
    }
    // Surrender to Heat's Trance. Solo and hotseat: the OPPONENT chooses the Setback effect (a dialog for a human opponent, the
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
        }
    }


    // ############################################################
    // 6b) PHASE 2: ECHO, CALLED SHOT, MEDITATION, TURN THE TABLES
    // ############################################################
    const FACE_NAMES = { TRANSFORM: "Transform", SUBMISSION: "Submission", AROUSAL: "Arousal", SPIRAL: "Trance", ENERGY: "Energy", LUCIDITY: "Lucidity" };
    const FACE_ICONS = { TRANSFORM: "👁️", SUBMISSION: "⛓️", AROUSAL: "🔥", SPIRAL: "🌀", ENERGY: "⚡", LUCIDITY: "💧" };
    function keyLabel(key) { return key && FACE_NAMES[key] ? FACE_ICONS[key] + " " + FACE_NAMES[key] : ""; }
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

    // ---------- ECHO ----------
    // Once per turn, after rolling, pay 1 ⚡ to copy one die's face onto another die.
    function echoAvailable(p) {
        const g = G();
        return !!(g && p && ptHas(p, "echo") && g.phase === "rolling" && g.dice.length >= 2 && g.dice[0].face !== "-"
            && !p.echoUsedThisTurn && (Number(p.energy) || 0) >= 1);
    }
    function doEcho(p, from, to) {
        const g = G();
        g.dice[to].face = g.dice[from].face;                    // the target keeps its locked/unlocked state
        p.energy = (Number(p.energy) || 0) - 1;
        p.echoUsedThisTurn = true;
        announce(Number(g.activePlayer), `${p.name}'s Echo (1 ⚡): die ${to + 1} copies die ${from + 1} (${faceLabel(g.dice[from].face)}).`);
        if (typeof playSound === "function") playSound("lock");
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
    function cpuTryEcho() {
        const g = G(), p = g.p2;
        if (!echoAvailable(p) || (Number(p.energy) || 0) < 2) return false;     // keep a spare ⚡
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
    function beforeRoll() {                                     // called at the top of rollDiceAction(); true = a prompt was opened
        const g = G(); if (!g || !g.dice || !g.dice.length) return false;
        const p = activePlayerObj();
        if (!ptHas(p, "calledshot") || g.dice[0].face !== "-" || g.signatureSiobhanBonusRoll || p.calledFace) return false;
        if (Number(g.activePlayer) === 2 && g.gameMode === "solo") { p.calledFace = cpuPickCalledFace(p); return false; }
        if (typeof isLocalPlayerTurn === "function" && !isLocalPlayerTurn()) return false;
        if (typeof showChoiceDialog !== "function" || typeof FACES === "undefined") return false;
        showChoiceDialog({
            key: "called-shot", title: "Called Shot",
            message: "Name a face before you roll. If it shows 3 or more times its effect is +1. If it shows fewer than 2 times, you lose 1 ⚡.",
            options: FACES.map(face => ({ label: faceLabel(face), onClick: () => {
                p.calledFace = faceKey(face);
                announce(Number(g.activePlayer), `${p.name}'s Called Shot: ${faceLabel(face)}.`);
                refresh();
                setTimeout(() => rollDiceAction(), 0);
            } }))
        });
        return true;
    }
    function cpuPickCalledFace(p) {
        const g = G();
        let key = "TRANSFORM";
        try {
            if (typeof cpuFaceWeights === "function") {
                const w = cpuFaceWeights();
                const map = { TRANSFORM: w.TR, SUBMISSION: w.SU, AROUSAL: w.AR, SPIRAL: w.SP, ENERGY: w.EN };
                key = Object.keys(map).filter(k => map[k] > -50).sort((a, b) => map[b] - map[a])[0] || key;
            }
        } catch (e) { /* keep the default */ }
        announce(2, `${p.name}'s Called Shot: ${FACE_NAMES[key]}.`);
        return key;
    }
    // at resolve: adds the +1 (as an extra die of that face) and charges the penalty. Call it after counts are built.
    function applyCalledShot(p, playerNum, counts) {
        const key = p && p.calledFace; if (!key || !ptHas(p, "calledshot")) return;
        const g = G();
        const shown = g.dice.filter(d => faceKey(d.face) === key).length;
        if (shown >= 3 && counts[key] >= shown) {                          // not wiped out by Siobhan's bonus roll
            counts[key] += 1;
            announce(playerNum, `Called Shot hits: ${FACE_NAMES[key]} showed ${shown} times, so its effect is +1.`);
        } else if (shown < 2) {
            const lost = Math.min(1, Number(p.energy) || 0);
            p.energy = (Number(p.energy) || 0) - lost;
            announce(playerNum, `Called Shot misses: ${FACE_NAMES[key]} showed ${shown} time${shown === 1 ? "" : "s"}${lost ? ", lose 1 ⚡" : ""}.`);
        } else {
            log(`Called Shot: ${FACE_NAMES[key]} showed ${shown} times. No bonus and no penalty.`);
        }
        p.calledFace = null;
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
        g.meditating = true;                                              // so Transformation Ritual does not charge for the empty roll
        g.dice = g.dice.map(() => ({ face: "⬜ BLANK", kept: true }));
        g.rerollsLeft = 0;
        announce(playerNum, `${p.name} meditates instead of rolling: +3 ⚡, -1 🌀, -1 🔥.`);
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
    // called at the very start of the CPU's turn; true = it meditated (so the caller must NOT roll)
    function cpuStartOfTurn() {
        const g = G(); if (!g || g.gameMode !== "solo") return false;
        const p = g.p2;
        if (meditationAvailable(p) && cpuWantsMeditation(p)) { applyMeditation(p, 2); return true; }
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
        refresh();
    }
    function turnTables() { const p = me(); if (p && tablesAvailable(p)) doTables(p, Number(G().activePlayer)); }
    // CPU: flip it when the marker is well on the CPU's own side (positive = toward Player 2)
    function cpuShopPowers() {
        const g = G(); if (!g || g.gameMode !== "solo") return;
        const p = g.p2;
        if (tablesAvailable(p) && Number(g.submission) >= 3) doTables(p, 2);
    }

    // ---------- the buttons (added to the centre action row) ----------
    function actionButtonsHtml(isHumanTurn, isInitRoll) {
        const p = me();
        if (!isHumanTurn || !p) return "";
        let html = "";
        const btn = (onclick, text, bg, title) => `<button onclick="${onclick}" title="${title}" style="background:${bg}; color:#fff; font-weight:bold;">${text}</button>`;
        if (meditationAvailable(p)) html += btn("Abilities.meditate()", "🧘 Meditate", "#7c3aed", "Skip your roll: +3 energy, lower Trance and Arousal by 1");
        if (echoAvailable(p)) html += btn("Abilities.openEcho()", "🔁 Echo (1⚡)", "#0e7490", "Copy one die's face onto another die");
        if (tablesAvailable(p)) html += btn("Abilities.turnTables()", "🔄 Turn the Tables", "#b45309", "Once per game: flip the Submission marker");
        if (p.calledFace && G().phase === "rolling") html += `<span style="align-self:center; color:#fcd34d; font-weight:bold;">🎯 Called: ${keyLabel(p.calledFace)}</span>`;
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
        cpuStartOfTurn, cpuTryEcho, cpuShopPowers
    };
})();
