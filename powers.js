// ============================================================
// POWERS  (powers.js)
// Load order in index.html:   powers.js  ->  cpu_int.js  ->  abilities.js  ->  hypbattle.js
//
// ONE place that says what every special power IS and who has it.
//
//   POWERS             every power, written once (21 so far). Key = the id the game code checks, e.g.
//                      hasSignaturePower(id, "toll").
//                        icon, title, description   shown in the setup box, the board hint and Kaleidoscope messages
//                        helpText                   optional longer text for the Characters help tab (falls back to description)
//                        impl                       "core"      = the behaviour lives in hypbattle.js (the original powers)
//                                                   "abilities" = the behaviour lives in abilities.js
//   CHARACTER_POWERS   which character holds which power.
//
// TO GIVE A NEW CHARACTER AN EXISTING POWER: add one line to CHARACTER_POWERS (the name exactly as in CHARACTERS).
//   They then get the setup box, the board hint and a Characters help box automatically. Powers with no character yet
//   (Echo, Called Shot, ...) can still be tested with debugStart.p1Power / debugStart.cpuPower, or in the console:
//   Abilities.setPower(1, "deepwell").  Kaleidoscope borrows from every power in POWERS except itself.
// TEXT TOKENS: descriptions and helpText are filled in for whoever holds the power, so they stay correct if the power moves
//   to another character (or is borrowed by Kaleidoscope):  {NAME}  {HE}  {HIM}  {HIS}  {SELF}  (add _CAP for a capital, e.g. {HE_CAP}).
//   Prefer {NAME} for the subject of a sentence ("{NAME} gets...") and {HIS}/{HIM} for the rest; they read right for every gender.
//   See formatCharacterText() in hypbattle.js.
// TO ADD A BRAND NEW POWER: add it to POWERS, write its behaviour, and (if it is not a hook in hypbattle.js) set impl: "abilities".
// ============================================================

const POWERS = {
	// Alex
    unyieldingresistance: {
        icon: "🛡️", title: "Unyielding Resistance", impl: "core",
        description: "Absorbs one incoming Submission point per opposing turn; {NAME} cannot benefit from defensive Submission cards.",
        helpText: "Once per opposing turn, {NAME} absorbs 1 point of an incoming Submission push. {NAME} cannot buy or use <i>Mesmerizing Rhythm</i> or <i>I Will Not Obey</i>."
    },
	// Roz
    tripletrouble: {
        icon: "🎲", title: "Triple Trouble", impl: "core",
        description: "After normal rerolls, a final triple locks matching dice and grants one bonus reroll.",
        helpText: "When {NAME} has no rerolls left and holds three or more matching dice, those dice lock and {NAME} gets one bonus reroll (once per turn)."
    },
	// Xander
    heatedopening: {
        icon: "🔥", title: "Heated Opening", impl: "core",
        description: "Every Arousal die inflicts one Arousal, starting with the first die.",
        helpText: "Every 🔥 die adds 1 Arousal, starting with the first die, instead of the usual two-dice minimum."
    },
	// Siobhan
    predatorymomentum: {
        icon: "🐆", title: "Predatory Momentum", impl: "core",
        description: "A final roll with 4+ Transform or Submission resolves that face, then grants one bonus turn with a single six-die roll and no rerolls.",
        helpText: "A final roll with 4 or more 👁️ or ⛓️ resolves only that face (the other dice are lost), then {NAME} takes a bonus turn: one six-die roll with no rerolls. Once per turn."
    },
	// Tex
    twisteddice: {
        icon: "🃏", title: "Twisted Dice", impl: "core",
        description: "Trance dice become Blank; Submission dice may be reassigned to Trance or Arousal.",
        helpText: "Every 🌀 {NAME} rolls becomes Blank. Each ⛓️ die in {HIS} final roll can be kept or reassigned to 🌀 or 🔥, one die at a time."
    },
	// Luci
    submissionamplifier: {
        icon: "📣", title: "Submission Amplifier", impl: "core",
        description: "A final roll with 3+ Submission dice adds one extra Submission push.",
        helpText: "A final roll with 3 or more ⛓️ adds one extra point to the Submission push."
    },
	// Zixuan
    marketmanipulator: {
        icon: "🏪", title: "Market Manipulator", impl: "core",
        description: "Market wipes cost one Energy, with no per-turn limit.",
        helpText: "Wiping the market costs 1 ⚡ instead of 2 ⚡."
    },
	// Hyeri 
    perfectharmony: {
        icon: "☯️", title: "Perfect Harmony", impl: "core",
        description: "When all six standard faces appear, change all dice to a face this power has not used before.",
        helpText: "When all six faces appear in the final roll, every die changes to a face {NAME} has not used with this power yet. Each face can be used once per game."
    },
	// Mark
    lingeringtrance: {
        icon: "🫧", title: "Lingering Trance", impl: "core",
        description: "When {NAME} causes The Deepening, the opponent retains one 🌀 Trance.",
        helpText: "When {NAME} causes The Deepening (and selects Trance,) the opponent retains 1 🌀 Trance instead of dropping to the usual remainder."
    },
	// Fable
    lucidreversal: {
        icon: "💧", title: "Lucid Reversal", impl: "core",
        description: "Spend three Lucidity dice to reduce your own Transform by one.",
        helpText: "If {HIS} final roll has three or more 💧 and {NAME} has any Transform, {NAME} may spend three 💧 to reduce {HIS} own Transform by 1; the rest of {HIS} 💧 resolve normally."
    },
	// Ivy
    suggestedtransference: {
        icon: "🔀", title: "Suggested Transference", impl: "core",
        description: "Once per turn, exchange one of your Keep cards for a market card (or an opponent card) of equal or lower Energy cost.",
        helpText: "Once per turn, exchange one of your Keep cards for a market card (or an opponent card) of equal or lower Energy cost."
    },
	// Dare
    meditation: {
        icon: "🧘", title: "Meditation", impl: "abilities",
        description: "Instead of rolling, you may Meditate: gain 3 ⚡ and lower your Trance and Arousal by 1. No rolls, rerolls or buying cards that turn. Not two turns in a row.",
        helpText: "Instead of rolling, {NAME} may Meditate: gain 3 ⚡ and lower {HIS} Trance and Arousal by 1. Not two turns in a row. {NAME} cannot roll anything or buy cards on that turn."
    },
	// Val
    turntables: {
        icon: "🪞", title: "Turn the Tables", impl: "abilities",
        description: "Once per game, in your shop phase, switch the Submission marker to the other side (e.g., +3 becomes -3).",
        helpText: "Once per game, in your shop phase, switch the Submission marker to the other side (e.g., +3 becomes -3)."
    },
    echo: {
        icon: "🔁", title: "Echo", impl: "abilities",
        description: "Once per turn, after your final roll, pay 1 ⚡ to copy one die's face onto another die."
    },
	// Princess
    calledshot: {
        icon: "🎯", title: "Called Shot", impl: "abilities",
        description: "Before your first roll, name a face. If it shows 3 or more times when you resolve, its effect is +1. If it shows fewer than 2 times, lose 1 ⚡."
    },
    surrender: {
        icon: "🚒", title: "Surrender to Heat", impl: "abilities",
        description: "Arousal never costs you rerolls. At the end of your turn you gain 1 Trance for every 2 Arousal, which can trigger The Deepening."
    },
    deepwell: {
        icon: "🌊", title: "Deep Well", impl: "abilities",
        description: "You need 7 Trance for The Deepening instead of 5, but when one lands its effect is doubled."
    },
    toll: {
        icon: "🪙", title: "Toll", impl: "abilities",
        description: "Whenever your opponent buys a card, you gain 1 ⚡."
    },
    layaway: {
        icon: "🏷️", title: "Layaway", impl: "abilities",
        description: "At the end of your turn, pay 1 ⚡ to reserve a market card. For your next 2 turns only you can buy it (and no other card). Then your opponent may buy it for 1 ⚡ less, or it is discarded."
    },
	// Qiyana
    cornered: {
        icon: "🧱", title: "Cornered", impl: "abilities",
        description: "While you have 8 or more Transform, you roll one extra die and gain 1 ⚡ at the start of each of your turns."
    },
    kaleidoscope: {
        icon: "🔮", title: "Kaleidoscope", impl: "abilities",
        description: "You hold one random borrowed power. Use it and you draw a new one (all get used before any repeat). Once per turn, pay 3 ⚡ to swap it for another."
    }
};

// character name -> power key
const CHARACTER_POWERS = {
    Alex: "unyieldingresistance",
	Dare: "meditation",
	Fable: "lucidreversal",
    Hyeri: "perfectharmony",
    Ivy: "suggestedtransference", 
    Luci: "submissionamplifier",
    Mark: "lingeringtrance",
	Princess: "calledshot",
	Qiyana: "cornered",
	Roz: "tripletrouble",
    "Siobhán": "predatorymomentum",
    Tex: "twisteddice",
	Val: "turntables",
	Xander: "heatedopening",
	Zixuan: "marketmanipulator",
};

// Characters whose image folder is not their accent-stripped name (the help tab uses these).
const HELP_AVATAR_FOLDERS = { "Siobhán": "Siobhn" };
