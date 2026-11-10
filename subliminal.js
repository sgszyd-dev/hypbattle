// ============================================================
// SUBLIMINALS  (subliminal.js)
// Load it with a normal <script src="subliminal.js"></script> right before or after taunts.js. It needs nothing else: it
// injects its own CSS, keeps its own state and has its own debug panel (shown when cardDebugOn is true).
//
// WHAT IT DOES
//   * Off by default (Options checkbox). Only for 1 vs CPU games and online games, never hotseat.
//   * Every game starts with a pot of permanent base phrases and NO subliminals showing.
//   * Each time the local player is tranced to 5 (a Setback), the subliminal rate goes up (6% each, capped at 60%).
//     The count is stored in the game state (player.setbacksSuffered) so it also works for the player on the OTHER computer online.
//   * The pot is REBUILT from the game state every time a phrase is picked, so extras disappear on their own:
//       - base phrases (always)             - phrases unlocked for the rest of the game (cards, dice events)
//       - Arousal phrases for levels 1..current Arousal
//       - Submission phrases for levels 1..how far the marker is toward the player's side
//       - Transform phrases for the form being applied to the player, in tiers as the Transform level rises
//   * Every style is colour coded by category (base = lilac, Arousal = pink, Submission = violet, form = gold, unlock = blue).
//   * A subliminal is shown for a random time: "too fast" (2-3 screen frames), "flash" (110-260 ms) or "readable"
//     (700-1300 ms). More Setbacks shift the odds toward readable.
//   * Phrases can use your gender tokens (see PHRASES and expandTokens): {CPU}, {CPU_HIM}, {HUMGEN|boy|girl|one}, {AAN} {HUMTRANS}...
//   * Purely cosmetic: nothing here changes the game.
//
// HOOKS (one line each in hypbattle.js, see the list at the bottom of this file)
// ============================================================

(function () {
    "use strict";

    // ############################################################
    // 1) PHRASES (edit freely)
    // ############################################################
    const PHRASES = {
        base: [
            "I will obey", "Sink deeper", "Let go", "Don't think", "Good", "Deeper", "Empty and open",
            "Listen to my voice", "Drop", "Relax", "Obey", "Your mind is quiet", "Just follow", "Look closer",
            "Listen to {CPU}", "Look at {CPU_HIM}"
        ],
        // Arousal levels 1-5: each level adds its own phrases (levels below stay in the pot)
        arousal: {
            1: ["Warm", "A little flushed", "Feel that?", "Breathe slow"],
            2: ["So warm", "Heart racing", "Want more", "Restless"],
            3: ["Can't focus", "Need more", "Aching", "Don't stop"],
            4: ["Desperate", "Can't think", "Please", "Burning up"],
            5: ["Beg", "Only want", "Lost in it", "Take me"]
        },
        // Submission levels 1-5: how far the marker is toward the player's own end
        submission: {
            1: ["Maybe just listen", "Yes", "Easy to agree", "Why resist?", "Good {HUMGEN|boy|girl|one}"],
            2: ["Do as told", "Obey me", "Good one", "Nod", "Obey {CPU_HIM}"],
            3: ["You want to obey", "Yes, yes", "Resistance fades", "Say yes", "Say yes to {CPU_HIM}"],
            4: ["Your will is mine", "Obedient", "Kneel", "Yes, always", "Give {CPU_HIM} everything"],
            5: ["Mine", "Total obedience", "Nothing but yes", "You belong to me", "You belong to {CPU_HIM}", "Such a good {HUMGEN|boy|girl|one}"]
        },
        // Form phrases: three tiers of two. Transform 1-3 unlocks tier 1, 4-6 adds tier 2, 7-9 adds tier 3.
        forms: {
            Bat:       [["Hang loose", "Night calls"], ["Feel the wings", "Squeak"], ["Leathery wings", "You are a bat"]],
            Bunny:     [["Twitch", "Soft ears"], ["Hop hop", "Fluffy tail"], ["Long ears", "You are a bunny"]],
            Cat:       [["Stretch", "Purr"], ["Whiskers", "Curl up"], ["Soft paws", "You are a cat"]],
            Cow:       [["Graze", "Chew slowly"], ["Moo", "Heavy and slow"], ["Hooves", "You are {AAN} {HUMTRANS}"]],
            Dog:       [["Sit", "Good dog"], ["Fetch", "Wag"], ["Paws", "You are a dog"]],
            Doll:      [["Stay still", "Smile"], ["Pose for me", "Porcelain"], ["Painted smile", "You are a doll"]],
            Dragon:    [["Warm scales", "Hoard it"], ["Fire within", "Wings stretch"], ["Claws and fangs", "You are a dragon"]],
            Eevee:     [["Fluffy", "Perk up"], ["Evolve", "Soft fur"], ["Bushy tail", "You are an Eevee"]],
            Fox:       [["Cunning", "Quick"], ["Soft tail", "Pointed ears"], ["Russet fur", "You are a fox"]],
            Gender:    [["Change", "Soften"], ["Shift", "Settle into it"], ["Rearranged", "This is you now"]],
            Horse:     [["Trot", "Hold still"], ["Bridle", "Neigh"], ["Hooves", "You are a horse"]],
            Mannequin: [["Stand still", "Display"], ["Hold the pose", "Hollow"], ["Smooth plastic", "You are a mannequin"]],
            Otter:     [["Float", "Splash"], ["Play", "Sleek fur"], ["Webbed paws", "You are an otter"]],
            Pig:       [["Snuffle", "Roll in it"], ["Oink", "Pink"], ["Curly tail", "You are a pig"]],
            Puppet:    [["Strings", "Dance"], ["Move as pulled", "Wooden"], ["Hinged joints", "You are a puppet"]],
            Robot:     [["Compute", "Obey command"], ["Beep", "Systems online"], ["Metal body", "You are a robot"]],
            Squirrel:  [["Chitter", "Scamper"], ["Gather nuts", "Bushy tail"], ["Tiny paws", "You are a squirrel"]],
            Statue:    [["Stillness", "Cold"], ["Turning to stone", "Heavy"], ["Marble", "You are a statue"]],
            Werewolf:  [["Moon", "Restless"], ["Howl", "Fur grows"], ["Claws", "You are a werewolf"]]
        },
        // Permanent additions for the rest of the game. A card unlocks its phrases when ANYONE buys it.
        unlocks: {
            card: {
                0:  ["Look into my eyes", "Eyes on me"],        // Deep Gaze
                3:  ["Say the word", "Trigger"],                // Trigger Word
                5:  ["Give in", "Hand it over"],                // Hypnotic Dominance
                15: ["Altered", "Not quite yourself"],          // Altered State
                22: ["Shackled", "Held fast"],                  // Mental Shackles
                24: ["Sleepwalk", "Keep walking"],              // Somnambulism
                31: ["Falling", "Fall for me"],                 // Falling Sensation
                36: ["Deeper still", "Down you go"],            // Deeper Trance
                46: ["Bound", "Can't move"]                     // Bondage
            },
            event: {
                allSix: ["Six faces, one voice"],               // a roll with every face
                setback: ["Down you go", "Further down"]        // the local player reaches 5 Trance
            }
        }
    };

    // ############################################################
    // 2) SETTINGS
    // ############################################################
    const CFG = {
        rateStep: 0.10,          // rate gained per Setback
        rateMax: 0.60,
        cooldownMs: 2500,        // never two subliminals closer together than this
        maxPerMinute: 12,
        heartbeatMs: 4000,       // idle chance to show one while the game is going
        heartbeatFactor: 0.5,    // heartbeat chance = rate * this
        fastFrames: [2, 3],      // "too fast": screen frames
        flashMs: [110, 260],
        readableMs: [700, 1300],
        reducedMinMs: 450        // with "reduce motion" nothing shorter than this
    };
    const STYLES = [
        ["center", "Center flash"], ["glitch", "Glitch / scramble"], ["ghostdie", "Ghost die"],
        ["spiral", "Spiral reveal"], ["edge", "Edge banner"], ["drift", "Peripheral drift"], ["cursor", "Cursor halo"],
        ["random", "Random mix of all"]
    ];
    const CAT_COLORS = { base: "#e9d5ff", arousal: "#ff6fb1", submission: "#a78bfa", form: "#ffd166", unlock: "#7dd3fc" };
    const KEY_ENABLED = "hypduel_subliminals", KEY_STYLE = "hypduel_subliminal_style";

    const S = {                  // runtime state
        enabled: false, style: "random",
        debugSetbacks: 0, seenSetbacks: 0, snap: null, unlocked: [], recent: [], lastFire: 0, fireTimes: [],
        debug: { tier: "auto", rate: null },       // debug overrides
        mouse: { x: 200, y: 200 }, edgeTop: true, cleanups: []
    };
    const reduceMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const rand = (a, b) => a + Math.random() * (b - a);
    const randInt = (a, b) => Math.floor(rand(a, b + 1));

    // ---------- persistence ----------
    function store(k, v) { try { if (typeof safeStorage !== "undefined") safeStorage.set(k, v); else localStorage.setItem(k, v); } catch (e) {} }
    function load(k) { try { return (typeof safeStorage !== "undefined") ? safeStorage.get(k) : localStorage.getItem(k); } catch (e) { return null; } }

    // ############################################################
    // 3) GAME STATE HELPERS
    // ############################################################
    function gs() { return (typeof gameState !== "undefined") ? gameState : null; }
    function localNum() {                       // which seat is the person at this screen?
        const g = gs();
        return (g && g.gameMode === "online" && typeof onlineLocalRole !== "undefined") ? Number(onlineLocalRole) : 1;
    }
    function active() {
        if (!S.enabled) return false;
        const g = gs();
        if (!g || !g.p1 || !g.p2) return false;
        if (g.gameMode !== "solo" && g.gameMode !== "online") return false;          // never hotseat
        if (g.gameEnded) return false;
        if (typeof gameOverPresentationStarted !== "undefined" && gameOverPresentationStarted) return false;
        return true;
    }
    function me() { const g = gs(); return g ? g["p" + localNum()] : null; }
    // Setbacks this player has suffered. It is stored IN the game state (player.setbacksSuffered), so in online games the
    // other computer receives it automatically. (debugSetbacks is only what the debug panel adds on top.)
    function setbackCount() { const p = me(); return (p ? (Number(p.setbacksSuffered) || 0) : 0) + S.debugSetbacks; }
    // how far the marker is toward MY end (0-5). Positive submission = toward player 2's end.
    function submissionDepth() {
        const g = gs(); if (!g) return 0;
        const s = Number(g.submission) || 0;
        return Math.max(0, Math.min(5, localNum() === 1 ? -s : s));
    }

    // ---------- gender tokens: run every phrase through your processGenderTokens ----------
    // In a phrase, HUM means "the person looking at this screen" and CPU means "their opponent", for example:
    //   "Listen to {CPU}"   "Obey {CPU_HIM}"   "Good {HUMGEN|boy|girl|one}"   "You are {AAN} {HUMTRANS}"
    // processGenderTokens itself treats Player 1 as HUM and Player 2 as CPU. When the local player is Player 2 (online guest),
    // the HUM and CPU tokens are swapped first so they still mean "me" and "my opponent".
    const TOKEN_SWAP = { HUMAN: "CPU", CPU: "HUMAN", HUMTRANS: "CPUTRANS", CPUTRANS: "HUMTRANS", HUMGEN: "CPUGEN", CPUGEN: "HUMGEN" };
    function swapSides(text) {
        return text.replace(/\{([A-Z_]+)(?=[|}])/g, (m, name) => {
            if (TOKEN_SWAP[name]) return "{" + TOKEN_SWAP[name];
            if (name.indexOf("HUM_") === 0) return "{CPU_" + name.slice(4);
            if (name.indexOf("CPU_") === 0) return "{HUM_" + name.slice(4);
            return m;
        });
    }
    function expandTokens(text) {
        let t = String(text);
        if (t.indexOf("{") === -1) return t;
        if (localNum() === 2) t = swapSides(t);
        try {
            if (typeof processGenderTokens === "function") return processGenderTokens(t);
        } catch (e) { /* fall through */ }
        return t.replace(/\{[^{}]*\}/g, "").replace(/\s+/g, " ").trim();      // no token function: drop the tokens rather than show them
    }

    // ############################################################
    // 4) THE POT: rebuilt from the game state on every pick
    // ############################################################
    function buildPot() {
        const pot = [];
        const add = (list, cat) => (list || []).forEach(t => pot.push({ text: t, cat }));
        add(PHRASES.base, "base");
        add(S.unlocked, "unlock");
        const p = me();
        if (p) {
            for (let l = 1; l <= Math.min(5, Number(p.arousal) || 0); l++) add(PHRASES.arousal[l], "arousal");          // gone again when Arousal drops
            for (let l = 1; l <= submissionDepth(); l++) add(PHRASES.submission[l], "submission");                      // gone when the marker moves back
            const tiers = PHRASES.forms[p.transformTarget];
            const level = Number(p.transform) || 0;
            if (tiers && level > 0) {
                const upTo = level >= 7 ? 3 : (level >= 4 ? 2 : 1);
                for (let t = 0; t < upTo; t++) add(tiers[t], "form");
            }
        }
        return pot;
    }
    function pickPhrase() {
        let pot = buildPot();
        const fresh = pot.filter(e => !S.recent.includes(e.text));
        if (fresh.length >= 6) pot = fresh;                                         // avoid repeats when there is variety
        const e = pot[Math.floor(Math.random() * pot.length)];
        S.recent.push(e.text); if (S.recent.length > 4) S.recent.shift();
        return { text: e.text, display: expandTokens(e.text), cat: e.cat };
    }

    // ############################################################
    // 5) RATE AND TIMING
    // ############################################################
    function rate() {
        if (S.debug.rate !== null) return S.debug.rate;
        return Math.min(CFG.rateMax, CFG.rateStep * setbackCount());
    }
    function pickTier() {
        if (S.debug.tier !== "auto") return S.debug.tier;
        const readable = Math.min(40, 15 + 4 * setbackCount()), flash = 30;              // % ; the rest is "too fast"
        const r = Math.random() * 100;
        if (reduceMotion()) return r < 50 ? "readable" : "flash";                    // nothing faster than a flash
        if (r < readable) return "readable";
        if (r < readable + flash) return "flash";
        return "fast";
    }
    function tierMs(tier) {                       // how long a flash/readable subliminal stays (null = "too fast", counted in frames)
        if (tier === "fast" && !reduceMotion()) return null;
        const range = tier === "readable" ? CFG.readableMs : CFG.flashMs;
        return Math.max(reduceMotion() ? CFG.reducedMinMs : 0, rand(range[0], range[1]));
    }
    function holdFor(tier, ms, done) {            // run done() after the tier's time. "fast" counts real screen frames.
        if (ms === null) {
            let frames = randInt(CFG.fastFrames[0], CFG.fastFrames[1]);
            const step = () => { if (--frames <= 0) done(); else requestAnimationFrame(step); };
            requestAnimationFrame(() => requestAnimationFrame(step));               // the first frame paints it, then count
            return;
        }
        setTimeout(done, ms);
    }

    // ############################################################
    // 6) DISPLAY
    // ############################################################
    let layer = null;
    function ensureLayer() {
        if (layer) return layer;
        const css = document.createElement("style"); css.id = "subliminal-style"; css.textContent = STYLE_CSS; document.head.appendChild(css);
        layer = document.createElement("div"); layer.id = "subliminal-layer"; document.body.appendChild(layer);
        document.addEventListener("mousemove", e => { S.mouse.x = e.clientX; S.mouse.y = e.clientY; }, { passive: true });
        return layer;
    }
    function diceRect() {                         // where the middle of the action is
        const el = document.getElementById("dice-container");
        const r = el ? el.getBoundingClientRect() : null;
        if (r && r.width > 0) return r;
        return { left: window.innerWidth / 2 - 150, top: window.innerHeight / 2 - 60, width: 300, height: 120 };
    }
    function mkText(entry, tier, extra) {
        const d = document.createElement("div");
        d.className = "sub-text tier-" + tier + (extra ? " " + extra : "");
        d.textContent = entry.display;
        const col = CAT_COLORS[entry.cat] || "#fff";
        d.style.color = col; d.style.setProperty("--sub-col", col);              // colour coding applies to EVERY style
        return d;
    }
    // soft glow of the category colour behind the dice area (used by the styles that sit over the dice)
    function addWash(entry, tier) {
        const col = CAT_COLORS[entry.cat] || "#fff", r = diceRect();
        const wash = document.createElement("div");
        wash.className = "sub-wash tier-" + tier;
        wash.style.cssText = `left:${r.left - 40}px;top:${r.top - 30}px;width:${r.width + 80}px;height:${r.height + 60}px;` +
            `background:radial-gradient(ellipse at center, ${col}66 0%, ${col}22 55%, transparent 75%);`;
        layer.appendChild(wash);
        return wash;
    }
    function placeAtDice(d) {
        const r = diceRect();
        d.style.left = (r.left + r.width / 2) + "px"; d.style.top = (r.top + r.height / 2) + "px";
    }
    function show(el, tier, extraCleanup, alsoFade) {   // add to the layer, remove after the tier's time
        const ms = tierMs(tier);
        if (ms !== null) { el.style.setProperty("--sub-ms", ms + "ms"); if (alsoFade) alsoFade.style.setProperty("--sub-ms", ms + "ms"); }
        layer.appendChild(el);
        holdFor(tier, ms, () => { el.remove(); if (extraCleanup) extraCleanup(); });
    }

    const RENDER = {
        center(entry, tier) {
            const wash = addWash(entry, tier);
            const d = mkText(entry, tier, "sub-center"); placeAtDice(d);
            show(d, tier, () => wash.remove(), wash);
        },
        glitch(entry, tier) {
            const wash = addWash(entry, tier);
            const d = mkText(entry, tier, "sub-center sub-glitch"); d.dataset.text = entry.display; placeAtDice(d);
            if (tier !== "fast" && !reduceMotion()) {                              // letters scramble, then settle
                const glyphs = "#%&@$?!*+=<>", final = entry.display; let n = 0;
                const iv = setInterval(() => {
                    n++;
                    const settled = Math.floor(final.length * Math.min(1, n / 7));
                    d.textContent = final.split("").map((c, i) => c === " " || i < settled ? c : glyphs[randInt(0, glyphs.length - 1)]).join("");
                    d.dataset.text = d.textContent;
                    if (n >= 7) { clearInterval(iv); d.textContent = final; d.dataset.text = final; }
                }, 45);
                show(d, tier, () => { clearInterval(iv); wash.remove(); }, wash);
            } else show(d, tier, () => wash.remove(), wash);
        },
        ghostdie(entry, tier) {
            const dice = Array.from(document.querySelectorAll("#dice-container .die")).filter(x => x.textContent.trim() && x.textContent.trim() !== "-");
            if (!dice.length) return RENDER.center(entry, tier);
            const target = dice[randInt(0, dice.length - 1)], r = target.getBoundingClientRect();
            const d = mkText(entry, tier, "sub-ghost");
            d.style.left = r.left + "px"; d.style.top = r.top + "px"; d.style.width = r.width + "px"; d.style.height = r.height + "px";
            d.style.fontSize = Math.max(9, Math.min(15, r.width / Math.max(4, entry.display.length * 0.6))) + "px";
            show(d, tier);
        },
        spiral(entry, tier) {
            const sp = ensureSpiral(); sp.classList.add("pulse");
            const wash = addWash(entry, tier);
            const d = mkText(entry, tier, "sub-center"); placeAtDice(d);
            show(d, tier, () => { sp.classList.remove("pulse"); wash.remove(); }, wash);
        },
        edge(entry, tier) {
            const d = mkText(entry, tier, "sub-edge");
            const col = CAT_COLORS[entry.cat] || "#fff";
            d.style.color = "#fff"; d.style.background = `linear-gradient(90deg, transparent, ${col}aa 20%, ${col}aa 80%, transparent)`;
            S.edgeTop = !S.edgeTop; d.style[S.edgeTop ? "top" : "bottom"] = "0";
            show(d, tier);
        },
        drift(entry) {                                                              // slow and faint: tiers do not apply
            const d = mkText(entry, "drift", "sub-drift");                          // not a timed tier: it must not pick up the fade animation
            const dur = rand(7, 10);
            d.style.top = rand(8, 88) + "vh";
            d.style.setProperty("--sub-op", Math.min(0.32, 0.10 + 0.02 * setbackCount()).toFixed(2));
            d.style.animationDuration = dur + "s";
            layer.appendChild(d);
            setTimeout(() => d.remove(), dur * 1000 + 200);
        },
        cursor(entry, tier) {
            const d = mkText(entry, tier, "sub-cursor");
            d.style.left = Math.min(window.innerWidth - 160, S.mouse.x + 22) + "px"; d.style.top = (S.mouse.y + 18) + "px";
            show(d, tier);
        }
    };
    function ensureSpiral() {
        let sp = document.getElementById("sub-spiral");
        if (!sp) {
            sp = document.createElement("div"); sp.id = "sub-spiral"; layer.appendChild(sp);
        }
        const r = diceRect(), size = Math.max(r.width, r.height) * 2.4;
        sp.style.left = (r.left + r.width / 2 - size / 2) + "px"; sp.style.top = (r.top + r.height / 2 - size / 2) + "px";
        sp.style.width = size + "px"; sp.style.height = size + "px";
        sp.style.opacity = Math.min(0.30, 0.05 + 0.035 * setbackCount()).toFixed(2);
        return sp;
    }

    // ############################################################
    // 7) FIRING
    // ############################################################
    function fire(opts) {
        opts = opts || {};
        ensureLayer();
        const entry = pickPhrase();
        const tier = opts.tier || pickTier();
        let style = opts.style || S.style;
        if (style === "random") { const all = STYLES.map(s => s[0]).filter(k => k !== "random"); style = all[randInt(0, all.length - 1)]; }
        const now = Date.now();
        S.lastFire = now; S.fireTimes = S.fireTimes.filter(t => now - t < 60000); S.fireTimes.push(now);
        (RENDER[style] || RENDER.center)(entry, tier);
        updateDebugReadout(`${style} / ${tier} / ${entry.cat}: "${entry.display}"`);
    }
    function maybeFire(prob) {                     // the normal gate: enabled, right mode, cooldown, per-minute cap, then the dice roll
        if (!active()) return;
        const now = Date.now();
        if (now - S.lastFire < CFG.cooldownMs) return;
        if (S.fireTimes.filter(t => now - t < 60000).length >= CFG.maxPerMinute) return;
        if (Math.random() < prob) fire();
    }
    function later(prob) { setTimeout(() => maybeFire(prob), randInt(250, 900)); }   // let the dice land first

    function clear() {
        if (layer) layer.innerHTML = "";
        const sp = document.getElementById("sub-spiral"); if (sp) sp.remove();
    }


    // ############################################################
    // 8b) LOOKING AT THE GAME STATE (works on both computers in an online game)
    // In an online game the rules only run on the computer of whoever's turn it is. The other computer just receives the new
    // game state, so hooks inside rule functions never run there. Watching the state instead works everywhere.
    // ############################################################
    function addUnlocks(list) { (list || []).forEach(t => { if (!S.unlocked.includes(t)) S.unlocked.push(t); }); }
    function pollState() {
        const g = gs();
        if (!g || !g.p1 || !g.p2 || !active()) { S.snap = null; return; }
        const p = me();
        const snap = {
            turn: g.round + ":" + g.activePlayer,
            phase: g.phase,
            dice: (g.dice || []).map(d => d.face).join("|"),
            setbacks: p ? (Number(p.setbacksSuffered) || 0) : 0
        };
        // cards in play (either player) unlock their phrases for the rest of the game
        [g.p1, g.p2].forEach(pl => (pl.inventory || []).forEach(c => { if (c) addUnlocks(PHRASES.unlocks.card[Number(c.id)]); }));
        const prev = S.snap; S.snap = snap;
        if (!prev) { S.seenSetbacks = snap.setbacks; return; }                       // first look: nothing to react to yet
        if (snap.setbacks > S.seenSetbacks) {                                         // the local player was tranced to 5
            addUnlocks(PHRASES.unlocks.event.setback);
            updateDebugReadout(`setback ${snap.setbacks}: rate ${(rate() * 100).toFixed(0)}%`);
        }
        S.seenSetbacks = snap.setbacks;
        if (snap.turn !== prev.turn) setTimeout(() => maybeFire(rate()), 600);       // a new turn (either player's)
        else if (snap.phase !== prev.phase && snap.phase === "shop") later(rate());  // dice were resolved
        else if (snap.dice !== prev.dice && snap.dice.replace(/[-|]/g, "")) later(rate());   // dice were rolled
    }
    setInterval(pollState, 400);

    // ############################################################
    // 8) PUBLIC API (the hooks call these)
    // ############################################################
    const API = {
        state: S, phrases: PHRASES, styles: STYLES,
        buildPot, rate, active, expandTokens,                      // expandTokens(text) is handy in the console: Subliminal.expandTokens("Obey {CPU_HIM}")
        isEnabled: () => S.enabled,
        loadSetting() {
            S.enabled = load(KEY_ENABLED) === "true";                                  // default OFF
            // Normal play always uses every style ("random"). Only the debug panel can pick a single style (and remembers it).
            let st = load(KEY_STYLE); if (st === "color") st = "center";               // the old "Color coded" style is now built into all styles
            S.style = (debugOn() && st && STYLES.some(x => x[0] === st)) ? st : "random";
            const box = document.getElementById("subliminals-option"); if (box) box.checked = S.enabled;
        },
        setEnabled(on) { S.enabled = !!on; store(KEY_ENABLED, String(S.enabled)); if (!S.enabled) clear(); },
        setStyle(s) { S.style = s; store(KEY_STYLE, s); const sel = document.getElementById("sub-dbg-style"); if (sel) sel.value = s; },
        // game events. onGameStart resets this module; the other hooks just ask for an immediate look at the game state
        // (the engine also looks every 400 ms by itself, which is what makes it work for the OPPONENT's actions online).
        onGameStart() { S.debugSetbacks = 0; S.seenSetbacks = 0; S.snap = null; S.unlocked = []; S.recent = []; S.lastFire = Date.now(); S.fireTimes = []; clear(); updateDebugReadout("new game: rate 0%"); },
        onGameOver() { clear(); },
        onTranceSetback() { pollState(); },
        onRoll() { pollState(); },
        onResolve() { pollState(); },
        onTurnStart() { pollState(); },
        onCardBought() { pollState(); },
        onEvent(name) { API.unlockEvent(name); },
        unlockEvent(name) { addUnlocks(PHRASES.unlocks.event[name]); },
        fire, clear
    };
    window.Subliminal = API;

    // idle heartbeat: a chance to show one now and then even when nothing is happening
    setInterval(() => { if (setbackCount() > 0) maybeFire(rate() * CFG.heartbeatFactor); }, CFG.heartbeatMs);

    // ############################################################
    // 9) DEBUG PANEL (only when cardDebugOn is true)
    // ############################################################
    function debugOn() { return (typeof cardDebugOn !== "undefined") && cardDebugOn === true; }
    function updateDebugReadout(text) { const el = document.getElementById("sub-dbg-readout"); if (el) el.textContent = text; }
    function buildDebugPanel() {
        if (!debugOn() || document.getElementById("sub-debug")) return;
        ensureLayer();
        const box = document.createElement("div"); box.id = "sub-debug";
        const opts = arr => arr.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
        box.innerHTML =
            `<div id="sub-dbg-head">🧠 Subliminals (debug) <span id="sub-dbg-toggle">▾</span></div>
             <div id="sub-dbg-body">
               <label>Style <select id="sub-dbg-style">${opts(STYLES)}</select></label>
               <label>Speed <select id="sub-dbg-tier">${opts([["auto", "Auto (by rate)"], ["fast", "Too fast"], ["flash", "Flash"], ["readable", "Readable"]])}</select></label>
               <label>Rate <select id="sub-dbg-rate">${opts([["auto", "Auto"], ["0", "0%"], ["0.1", "10%"], ["0.25", "25%"], ["0.5", "50%"], ["1", "100%"]])}</select></label>
               <div class="row"><button id="sub-dbg-minus">− Setback</button><span id="sub-dbg-count">0</span><button id="sub-dbg-plus">+ Setback</button></div>
               <div class="row"><button id="sub-dbg-fire">Fire now</button><button id="sub-dbg-all">Show every style</button></div>
               <div id="sub-dbg-status">enabled: <span id="sub-dbg-en"></span></div>
               <div id="sub-dbg-readout"></div>
             </div>`;
        document.body.appendChild(box);
        const $ = id => document.getElementById(id);
        $("sub-dbg-style").value = S.style;
        const refresh = () => {
            const c = $("sub-dbg-count"), e = $("sub-dbg-en");
            if (c) c.textContent = setbackCount();
            if (e) e.textContent = S.enabled ? "yes" : "NO (turn on in Options)";
        };
        $("sub-dbg-head").onclick = () => { $("sub-dbg-body").classList.toggle("hidden"); };
        $("sub-dbg-style").onchange = e => API.setStyle(e.target.value);
        $("sub-dbg-tier").onchange = e => { S.debug.tier = e.target.value; };
        $("sub-dbg-rate").onchange = e => { S.debug.rate = e.target.value === "auto" ? null : Number(e.target.value); };
        $("sub-dbg-plus").onclick = () => { S.debugSetbacks++; refresh(); };
        $("sub-dbg-minus").onclick = () => { S.debugSetbacks = Math.max(0, S.debugSetbacks - 1); refresh(); };
        $("sub-dbg-fire").onclick = () => { fire(); refresh(); };                    // ignores enabled / mode / cooldown on purpose
        $("sub-dbg-all").onclick = () => {                                           // every style once, readable, 2 seconds apart
            STYLES.map(s => s[0]).filter(k => k !== "random").forEach((k, i) => setTimeout(() => fire({ style: k, tier: "readable" }), i * 2000));
        };
        setInterval(refresh, 1000); refresh();
    }

    // ############################################################
    // 10) STYLES (injected, so there is no separate CSS file)
    // ############################################################
    const STYLE_CSS = `
#subliminal-layer { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; }
.sub-text { position: fixed; font-family: var(--font-display, Cinzel, serif); font-weight: 700; white-space: nowrap;
    text-shadow: 0 0 14px var(--sub-col, rgba(190, 120, 255, .9)), 0 0 3px #000; letter-spacing: .08em; }
.sub-center { transform: translate(-50%, -50%); font-size: 2.6rem; }
.sub-text.tier-readable { animation: subFade var(--sub-ms, 1s) ease-in-out both; }
@keyframes subFade { 0% { opacity: 0; } 18% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }
.sub-wash { position: fixed; pointer-events: none; }
.sub-wash.tier-readable { animation: subFade var(--sub-ms, 1s) ease-in-out both; }
.sub-glitch { text-shadow: 2px 0 rgba(255, 0, 90, .85), -2px 0 rgba(0, 220, 255, .85), 0 0 12px var(--sub-col, rgba(190, 120, 255, .7)); animation: subJitter .12s steps(2) infinite; }
@keyframes subJitter { 0% { transform: translate(-50%, -50%) skewX(0deg); } 50% { transform: translate(calc(-50% + 3px), calc(-50% - 2px)) skewX(-6deg); } 100% { transform: translate(calc(-50% - 3px), calc(-50% + 1px)) skewX(5deg); } }
.sub-ghost { display: flex; align-items: center; justify-content: center; text-align: center; white-space: normal; overflow: hidden;
    box-sizing: border-box; background: rgba(18, 10, 30, .94); border: 1px solid var(--sub-col, #c084fc); box-shadow: inset 0 0 16px var(--sub-col, #c084fc); border-radius: 12px; z-index: 5; }
.sub-edge { left: 0; right: 0; height: 42px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; letter-spacing: .5em; text-transform: uppercase; }
.sub-drift { left: -30vw; font-size: 2rem; opacity: 0; animation-name: subDrift; animation-timing-function: linear; animation-fill-mode: forwards; }
@keyframes subDrift { 0% { transform: translateX(0); opacity: 0; } 15% { opacity: var(--sub-op, .15); } 85% { opacity: var(--sub-op, .15); } 100% { transform: translateX(160vw); opacity: 0; } }
.sub-cursor { font-size: 1.5rem; }
#sub-spiral { position: fixed; border-radius: 50%; pointer-events: none; transition: opacity 1s ease;
    background: repeating-conic-gradient(from 0deg, rgba(190, 120, 255, .55) 0deg 8deg, transparent 8deg 22deg);
    -webkit-mask-image: radial-gradient(circle, transparent 0%, #000 22%, #000 55%, transparent 72%); mask-image: radial-gradient(circle, transparent 0%, #000 22%, #000 55%, transparent 72%);
    animation: subSpin 14s linear infinite; }
#sub-spiral.pulse { filter: brightness(1.8); }
@keyframes subSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .sub-glitch, #sub-spiral { animation: none; } }
#sub-debug { position: fixed; left: 8px; bottom: 8px; z-index: 100001; width: 230px; background: rgba(22, 16, 34, .96); border: 1px solid #9d4edd;
    border-radius: 9px; color: #e6dff0; font-size: .75rem; box-shadow: 0 4px 16px rgba(0, 0, 0, .6); }
#sub-dbg-head { padding: 6px 9px; cursor: pointer; color: #f0abfc; font-weight: 700; }
#sub-dbg-body { padding: 4px 9px 9px; display: flex; flex-direction: column; gap: 6px; }
#sub-dbg-body.hidden { display: none; }
#sub-dbg-body label { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
#sub-dbg-body select { width: 130px; font-size: .75rem; }
#sub-dbg-body .row { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
#sub-dbg-body button { font-size: .72rem; padding: 4px 6px; cursor: pointer; }
#sub-dbg-status { color: #b9a8ca; }
#sub-dbg-readout { color: #b9a8ca; min-height: 2.2em; word-break: break-word; }
`;

    // start
    function init() { API.loadSetting(); buildDebugPanel(); }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

