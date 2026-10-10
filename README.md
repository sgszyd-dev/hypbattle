# Hypnotic Duel

Browser dice-and-card duel. Two players (or one player and a CPU) roll six-faced dice, buy cards, and push each other along a submission track until one of them is fully transformed.

**Status:** Beta V8.0 (local two-player and Firebase online play).  
**Runtime:** one HTML file, no build step, no package manager.  
**Current source file:** `hypbattleWeb-game-2026-10-08r6.html` (~3,500 lines). Rename or copy it to `index.html` if you want a stable entry point for GitHub Pages.

This README is for people changing the game. In-game help (How to Play, rules, dice, card list, guided tutorial) is the player-facing manual and is generated from the same data the game runs on.

## Repository layout

The repo is the page plus art. There is no `package.json`, bundler, or test runner.

```text
.
├── README.md
├── index.html                         # the game (rename the dated HTML file)
└── images/
    └── avatars/
        └── <Name>/
            ├── <Name>_baseline.jpg
            └── <Name>_to_<Transform>_<stage>.jpg
```

Image paths are relative to the HTML file. Missing files do not crash the game; the portrait box shows `Image Req:` plus the expected filename.

`<Name>` is the first token of the roster entry, not the gendered label. `Alex (M)` loads `images/avatars/Alex/`. `Siobhán (F)` loads `images/avatars/Siobhán/` — the accent must match.

## Run it

Any static file server works. Opening the file directly (`file://`) is fine for solo and hotseat play. Online play should be served over `http://localhost` or `https://`, because the Firebase SDK is unreliable from `file://`.

```bash
# from the repo root, Python 3
python3 -m http.server 8080
# then open http://localhost:8080/
```

GitHub Pages works: enable Pages on the branch that contains `index.html` and `images/` at the site root (or set the Pages folder accordingly). Add that site origin to the Firebase project's authorized domains if Analytics or Auth is turned on later. Realtime Database itself does not require an authorized domain, but it does require rules that allow the browser to read and write. See [Online multiplayer](#online-multiplayer).

No install, lint, or build command exists today.

## Game modes

Selected on the setup screen (`#game-mode-option`):

| Value | UI label | Who plays |
|---|---|---|
| `solo` | 1 Player vs CPU | Human is always player 1. Player 2 is driven by `executeCPUTurn()`. |
| `pvp` | 2 Player Local | Hotseat. Both sides use the same browser. Nothing is hidden. |
| `online` | 2 Player Online (Firebase) | Host is player 1, guest is player 2. State is mirrored through Realtime Database. |

CPU difficulty is stored on `gameState.p2.difficulty`:

| Stored value | Setup label | Keep / buy posture |
|---|---|---|
| `random` | Beginner | Mostly random keeps and purchases. |
| `smart` | Easy | Keeps submission, energy, and pairs of transform. Buys anything it can afford that passes the card filters. |
| `aggressive` | Normal | Presses transform, submission, and energy. |
| `v23low` | Hard | Same family as aggressive, with tighter thresholds. The name is historical. |
| `defensive` | Expert | Prioritizes lucidity, energy, and not dying. |
| `adaptive` | Master | Prioritizes card and dice combinations |

`showEnergyActions` is forced to `false` inside `initializeGame()`. The Energy Action buttons (pay energy for arousal, transform, or submission) and the CPU branches that spend energy that way are currently unreachable. The panels and `buyAction()` are still in the file.

## Tech stack

- HTML, CSS, and one classic `<script>` (not a module). Every gameplay function is a global.
- A small `<script type="module">` in the head loads Firebase JS SDK `12.19.0` from `gstatic.com` and publishes `window.db`, `window.dbRef`, `window.dbSet`, `window.dbOnValue`, and `window.dbUpdate`.
- Services used: Firebase App, Analytics, Realtime Database. There is no Firebase Auth.
- UI is imperative DOM updates. `updateUI()` is the full redraw. Buttons in the HTML call globals via `onclick`.

Module scripts are deferred, so the Firebase block runs after the document is parsed and before `window.onload`. The game script is a classic script at the end of `<body>`, so it runs during parsing and only *uses* `window.db` later (onload / Start Game). Do not move gameplay into a module, or above the Firebase block, without keeping that order. If `getAnalytics()` throws, nothing below it runs and `window.db` never gets set — online play then silently no-ops. Wrap analytics if you see that.

## Code map

Everything lives in the one HTML file. Line numbers drift; search for the symbol.

| Region | Symbols | What it owns |
|---|---|---|
| CSS | `:root` and the modal / board rules | Layout, dice, cards, tutorial highlight. |
| Firebase bootstrap | `firebaseConfig`, `window.db*` | SDK init. Config is inline. |
| Setup modal | `initializeGame`, `toggleGameMode`, `onP1NameChange`, `onCpuNameChange` | Names, transform targets, mode, room code. |
| Constants | `FACES`, `NAMES`, `TRANSFORMS`, `CHARACTER_MANIFEST`, `KNOWN_CARDS` | Roster, art gating, the entire card pool. |
| State | `gameState`, `deck`, `market`, `discardPile` | Live match. Not persisted locally. |
| Sync | `syncToFirebase`, `listenToFirebase` | Online snapshot. `listenToFirebaseOld` is unused. |
| Log | `log`, `addLog`, `renderLog` | `log()` is the one gameplay uses. |
| CPU | `cpuKeepDie`, `cpuShould*`, `executeCPUTurn` | Solo mode only. |
| Render | `updateUI`, `renderDiceAndActions`, `renderMarket`, `renderInventory` | Rebuilds the board from `gameState`. |
| Turn | `startTurn`, `rollDiceAction`, `resolveDice`, `endTurn` | Phase machine. |
| Resolution helpers | `increaseTrance`, `increaseArousal`, `applyTransform`, `pushSubmission`, `checkTranceSetback` | Dice and card effects should go through these, not raw `+=`. |
| Cards | `buyCard`, `executeInstant`, `getCardPurchaseCost`, `wipeMarket` | Market, instants, keep cards. |
| Deck | `generateDeck`, `drawCardFromDeck`, `discardCard`, `reshuffleDiscardIntoDeck` | Draw pile is the end of the array (`pop`). |
| Win | `checkWinCondition` | Also fires New Identity before declaring a winner. |
| Help | `HELP_CONTENT`, `KNOWN_CARDS` filter | Rules pages. The card tab is data-driven. |
| Tutorial | `GUIDED_TUTORIAL_STEPS`, `prepareGuidedTutorial` | Scripted overlay on a throwaway solo game. Finishing reloads the page. |

## State

`deck`, `market`, and `discardPile` are **not** fields of `gameState`. Online sync writes them next to it. Local play just keeps the three globals.

```js
gameState = {
  gameMode: "solo" | "pvp" | "online",
  p1, p2,                       // player objects, see below
  submission: 0,                // integer, clamped to -5..5 by pushSubmission
  activePlayer: 1 | 2,
  round: 1,
  phase: "waiting" | "rolling" | "shop",
  dice: [{ face, kept }, ...],  // length varies, see dice count
  rerollsLeft: 0,
  gameEnded: false,
  showDiceText: true,
  showEnergyActions: false,
  freeBuyActive: false,         // Mirror Image primed a free purchase
  extraTurn: false,             // Sudden Flash
  somnambulismTurn: false,      // extra turn that starts with one fewer die
  log: []                       // last 50 strings
}

player = {
  name,                         // "Alex", not "Alex (M)"
  transformTarget,              // one of TRANSFORMS
  difficulty,                   // p2 only, solo only
  trance, arousal, transform, energy, vulnerability,  // numbers
  lastRoll: [],                 // faces from the resolved roll
  lastKeep: [],                 // same array copied again in resolveDice
  inventory: [],                // Keep cards currently active
  boughtCardThisTurn: false,    // Hypnotic Focus (id 28) uses this
  shieldActive: false,          // Rapid Pulse (id 12), cleared at start of that player's turn
  simmeringUsed: false          // Simmering Arousal (id 49), once per turn
}
```

Firebase shape at `games/<ROOMCODE>`:

```json
{
  "gameState": {},
  "market": [],
  "deck": [],
  "discardPile": [],
  "lastUpdated": 0
}
```

Realtime Database turns arrays into objects when it feels like it. `listenToFirebase` already coerces `inventory` and `log` back with `Object.values`. Do the same for any new array you sync, or the guest will crash on `.find` / `.map`.

`isSyncingFromFirebase` stops the listener from echoing a snapshot straight back to the server. Guest name and transform-target repairs use `dbUpdate` on specific paths instead of `syncToFirebase`, on purpose.

## Turn loop

`startTurn()` sets `phase` to `"rolling"`.

1. Rerolls from arousal: 0–2 → 2 rerolls, 3–4 → 1, 5 → 0. Mental Awakening (id 43) adds one.
2. Dice count starts at 6. Each Trance Anchor (id 7) adds one. Vulnerability subtracts that many, floor 3. A Somnambulism follow-up turn subtracts one more, floor 3.
3. Altered State (id 15) pushes submission 1 toward the opponent.
4. Human: click dice to toggle `kept`, then Roll / Resolve. Solo CPU: `executeCPUTurn()` after 1s.
5. `resolveDice()` sets `phase` to `"shop"` and applies the roll. Only the local active player may resolve in online mode (`isLocalPlayerTurn()`).
6. Shop: buy zero or more market cards, wipe the row for 2 energy, use shop-phase card buttons.
7. `endTurn()` runs end-of-turn keeps, then either starts an extra turn or swaps `activePlayer`.

First player is random. The player who does **not** go first starts with 1 energy.

Going second in a round increments `round` when player 2 ends a normal turn.

### Dice, as implemented

Faces are the strings in `FACES`. Matching is done with `includes` on the uppercased face, so display can be symbol-only.

| Face | Resolved effect |
|---|---|
| 🌀 Spiral | +1 Trance on the opponent per die. Deep Gaze (id 0) adds 1 more if the opponent is not shielded. |
| 💧 Lucidity | Points to spend on your own Trance, Arousal, and Vulnerability. Deep Safeties (id 9) adds 1 point if you rolled at least one. Burning Intensity (id 48) on the **opponent** makes each Arousal point cost 2. Humans use the lucidity modal; CPU spends vulnerability, then arousal, then trance. |
| ⚡ Energy | +1 Energy per die. Power Boost (id 45) adds 1 extra if any energy die was rolled, not per die. |
| ⛓️ Submission | No effect below 3. At 3+: push `1 + (count - 3)` toward the opponent. Also trips Submissive Flush (id 23) and Somnambulism (id 24). |
| 🔥 Arousal | `floor(count / 2)` arousal on the opponent. Stoking Fires (id 13) adds 1 if any arousal die was rolled. Opponent arousal is not capped here; the cap of 5 is applied inside `increaseArousal`. |
| 👁️ Transform | No effect below 3. At 3+: `1 + (count - 3)` transform on the opponent. Dream State (id 2) adds 1. Mental Shackles (id 22) also pushes submission 1. |

Trigger Word (id 3): if the resolved roll contains all six faces, the opponent takes +5 transform.

Rapid Pulse sets `shieldActive` for the rest of that turn. It blocks incoming Trance (including Deep Gaze and Switch Play) and incoming Arousal (including Mutual Heat). It does not block transform or submission.

### Submission track

`gameState.submission` is an integer from **-5 to +5**.

- Negative: marker is on player 1's side ("P1 will obey"). Bad for player 1.
- Positive: marker is on player 2's side ("P2 will obey"). Bad for player 2.
- Player 1's pushes are positive. Player 2's pushes are negative.

`pushSubmission(amount, sourcePlayer)`:

- A push of exactly ±1 is cancelled outright if the opponent has Mesmerizing Rhythm (id 35). Larger pushes are not reduced.
- Deeper Trance (id 36) adds one more point in the same direction when the source is pushing toward the opponent.
- Past +5, overflow becomes transform on player 2. Past -5, overflow becomes transform on player 1. Overflow uses source id `0`, so Powerful Transform does **not** add vulnerability.
- If a player ends their turn while the marker is on the far end against them (`-5` for P1, `+5` for P2), they take 1 transform ("obeying").

Cognitive Override (id 34) at end of turn: if the marker is strictly on your side of neutral, push 1 toward the opponent.

### Trance, arousal, transform, vulnerability

- Trance is uncapped in storage but `checkTranceSetback` fires while `trance >= 5`: subtract 5, then the active player chooses submission +2 on the victim or arousal +2. Physical Manipulation (id 17) adds a third option, transform +1. CPU choice is `cpuShouldTransformOnSetback()`, otherwise it pushes submission. The human choice is a `prompt()`.
- Arousal is capped at 5 inside `increaseArousal`. Guided Heat (id 32) gives the recipient +1 energy when their arousal actually rises.
- Switch Play (id 21) reflects 1 trance back at whoever just tranced you. Mutual Heat (id 50) reflects 1 arousal. Both are one-shot (a `reflecting` flag on the function) so they cannot loop. Rapid Pulse on the original source stops the reflection.
- `applyTransform(target, amount, source)` adds `amount` transform. If `source` is a real opponent and that opponent has Powerful Transform (id 41), the target also gains that much vulnerability. Source `0` means "the rules did this" and never applies vulnerability.
- Vulnerability only changes dice count, and only at the start of that player's turn. Lucidity removes it.
- Win check: after New Identity, a player at transform **≥ 10** has lost. The other player wins. If both cross 10 in the same resolution, the active player wins. New Identity (id 38) discards that player's whole inventory, sets transform to 5 and arousal to 5, and then the win check runs again.

## Cards

`KNOWN_CARDS` is the only card list (ids **0–53**, 54 cards: 36 Keep, 18 Instant). `generateDeck()` copies that array and shuffles it. The market holds 3 cards. Buying or wiping discards; `drawCardFromDeck()` recycles `discardPile` only when `deck` is empty. Cards currently in a player's inventory or on the market are not in the draw pile.

**Keep** cards are deep-copied into `inventory`. **Instant** cards run `executeInstant` and are discarded. A player cannot own two cards with the same `name` (`inventoryHasName`). Ids 10 and 39 are both named "Subconscious Prompt", so owning one blocks the other.

Cost modifiers in `getCardPurchaseCost`, applied in this order, each floored at 0:

1. Compliant Mind (id 29): −1 to every purchase.
2. Hypnotic Focus (id 28): −2 more on the first purchase of the turn.
3. If `freeBuyActive` (Mirror Image, id 42): cost is 0. The flag clears when the free card is bought.

Hypnotic Dominance (id 5) buys a card out of the opponent's inventory for the **printed** `cost` and gives the opponent that energy. It does not use `getCardPurchaseCost`. It is only legal in your own shop phase.

Bondage (id 46) pushes submission 1 toward the opponent when you buy from the market. It does not fire on a dominance steal.

### Adding a card

1. Append an object to `KNOWN_CARDS`. Use the next integer `id`. Do not reuse a name already in the list unless you intend the one-copy rule to block it.

   ```js
   { id: 54, name: "Example", cost: 4, type: "Keep", // or "Instant"
     desc: "One sentence the UI and the help tab will show.",
     ai: { aggressive: 40, defensive: 40, v23low: 40 } }
   ```

   `charges` is only special-cased for id 20. A new charged card needs its own UI.

2. **Instant:** add a branch in `executeInstant`. Use `increaseTrance`, `increaseArousal`, `applyTransform`, and `pushSubmission` rather than editing numbers directly, or shields, reflections, vulnerability, and overflow will not run.
3. **Keep with a triggered effect:** find the moment it should fire (`startTurn`, `resolveDice`, `endTurn`, `buyCard`, `pushSubmission`, …) and guard it with `hasCard(playerId, id)`.
4. **Keep with a button:** add a button in `renderInventory` and a `cpuShould…` check inside `executeCPUTurn`. If you only add the button, solo mode will never press it.
5. If the CPU must refuse the card in some board states, add that to `passesCardSpecificConditions`. Purchase score lives in `card.ai` plus the situational bumps in `cpuCardPurchaseScore`. Pinned-submission emergencies use `SUBMISSION_RECOVERY_CARDS`.
6. The help tab picks the card up automatically. If the rules text should mention it, edit `HELP_CONTENT`.

`rollVirtualDice` is marked deprecated and no current card calls it. Do not build a new card on it without reading the comment at the top of that function: those dice do not merge into the main roll's 3-of-a-kind checks.

### Activated keeps (where the code lives)

| Id | Card | Human entry point | CPU entry point |
|---|---|---|---|
| 5 | Hypnotic Dominance | Buy button on the opponent's inventory | Steal loop in `executeCPUTurn` |
| 12 | Rapid Pulse | `useRapidPulse` during rolling | `cpuShouldUseRapidPulse` before the reroll loop |
| 16 | Hypnotic Suggestion | `buyReroll` when rerolls are 0 | `cpuShouldUseHypnoticSuggestion` |
| 20 | Absolute Focus | `useAbsoluteFocus` | `cpuShouldUseAbsoluteFocus` |
| 26 | Waking Trance | `sellCard` (+2 energy, discard) | `cpuShouldSellWakingTrance` |
| 33 | Quiet Mind | `useQuietMind` during shop (`prompt` if both stats are up) | `cpuUseQuietMind` after shopping |
| 42 | Mirror Image | `discardForFreeBuy` | `cpuShouldUseMirrorImage` |
| 47 | Fading Reality | `useFadingReality` rerolls every **unlocked** 👁️ | `cpuShouldUseFadingReality` |
| 49 | Simmering Arousal | `useSimmeringArousal` changes the first unlocked non-🔥 | CPU changes the first non-🔥 even if it is kept |

## Characters and art

Roster (`NAMES`): Alex (M), Roz (F), Victor (M), Siobhán (F), Tex (M), Cassandra (F), Damian (M), Seraphina (F), Leo (M), Fable (F).

Transform targets (`TRANSFORMS`): Statue, Cow, Cat, Dog, Werewolf, Fox, Horse, Pig, Gender, Puppet, Bunny, Otter, Eevee.

`CHARACTER_MANIFEST` limits the **local** setup dropdown to transforms that character has art for. The key is the full roster string (`"Alex (M)"`). The value is the list of transforms that character can *be turned into*.

| Character | Local transform options |
|---|---|
| Alex | Bunny, Pig, Dog |
| Roz | Werewolf, Cow, Eevee |
| Siobhán | Horse, Cat, Bunny, Fox, Otter, Pig, Gender, Werewolf, Dog, Statue, Puppet |
| Tex | Cow, Cat, Werewolf |
| Fable | Cat, Bunny, Cow, Otter, Werewolf |
| Victor, Cassandra, Damian, Seraphina, Leo | **None.** The key exists and the array is empty, so the dropdown is empty. Online mode ignores the manifest and lists every transform. |

An empty array is not the same as a missing key. A missing key falls through to the full `TRANSFORMS` list. To give a new character every form, omit them from the manifest or handle `length === 0` in `populateTransformDropdown`.

### Filenames

Setup portrait:

```text
images/avatars/<Name>/<Name>_baseline.jpg
```

In-match and game-over portrait. `<stage>` is `min(11, transform)`, so ship stages **0 through 11** (12 files). The win happens at 10; stage 11 is the overflow frame.

```text
images/avatars/<Name>/<Name>_to_<Transform>_<stage>.jpg
```

Example: `images/avatars/Alex/Alex_to_Bunny_0.jpg` … `Alex_to_Bunny_11.jpg`.

`<Transform>` must match the `TRANSFORMS` string exactly (`Werewolf`, not `werewolf`).

### Adding a character

1. Add `"Name (M)"` or `"Name (F)"` to `NAMES`. Gameplay only keeps the first word, so names must be unique before the space and must not contain a space.
2. Add a `CHARACTER_MANIFEST` entry listing the forms you actually have art for.
3. Add `images/avatars/<Name>/<Name>_baseline.jpg`.
4. For each form, add stages 0–11. Anything you skip shows the placeholder text instead of a broken layout.

Clicking a portrait opens `#image-modal`.

## Online multiplayer

There is no account system. A room is just a Realtime Database node.

1. Host picks **2 Player Online**, **Host Online Game**, generates a code (`ROOM-` + 4 digits, or anything typed into the field), chooses their name and the form they want to inflict, then Start.
2. `initializeGame` writes the full payload to `games/<CODE>` and subscribes.
3. Guest picks **Join**, types the same code, and Start. They subscribe, then patch two fields:
   - `gameState/p2/name` — guest's name
   - `gameState/p1/transformTarget` — the form the guest wants to inflict on the host
4. Host's `p2.transformTarget` is whatever the host selected. Guest's transform target for themselves is that value. The two players are choosing what happens to the other person, not to themselves.

The host must Start first. A guest who writes into a room that does not exist yet can create a partial node the host later overwrites.

Whoever is subscribed will apply the remote snapshot over local state. Only the active local player should act; `isLocalPlayerTurn()` compares `activePlayer` with `onlineLocalRole`. The UI disables the other side's buttons, but nothing on the server rejects a forged write. The whole deck is in the room document, so the upcoming draw order is visible to both clients and to anyone who knows the room code.

### Rules you need on the database

The client signs in as nobody. Rules have to allow unauthenticated access to `games/$room`, or online play will fail. That also means anyone with the code (or the ability to guess one) can read and write that room. A short code is not access control.

Minimum shape that matches the current client:

```json
{
  "rules": {
    "games": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Tighten this before any public release (Auth, room secrets, validate the payload, stop clients from rewriting `deck`). The Firebase web config in the HTML is not a secret — it ships to every browser — but an open Realtime Database is.

Analytics measurement is initialized on every page load, including local solo games.

## Debug switches

Near the top of the game script:

```js
const cardDebugOn = false;
const debugCards = [5, 50, 51]; // dealt first
```

With `cardDebugOn` true, `prepareDebugDeck` pulls those ids out of the shuffled deck and places them where `deck.pop()` will draw them first (so they appear in the opening market, in reverse listed order).

`startTurn` also `console.log`s a `"LONG TRACE"` of dice-count inputs. `cpuCardPurchaseScore` calls `log()` for every card it scores, which writes into the on-screen game log during CPU turns. Take that out if you are not actively tuning AI weights.

## Implementation notes

Things that look like bugs or traps if you change the surrounding code. Confirm before "cleaning them up"; a few are load-bearing.

- **Shared die object.** `Array(n).fill({ face: "-", kept: false })` in the initial state and in `startTurn` puts the *same* object in every slot. The first click before a roll toggles every die. `rollDiceAction` replaces unkept slots with new objects, so this mostly disappears after the first roll. Prefer `Array.from({ length: n }, () => ({ face: "-", kept: false }))`.
- **Two loggers, one of them dead.** Gameplay calls `log()`. It pushes into `gameState.log`, re-renders, and also appends a DOM node. `updateUI()` then calls `renderLog()`, which replaces that DOM from the array, so the bold styling passed to `log(msg, true)` does not survive the next redraw. `log()` does not sync to Firebase by itself; the other client only sees the line after some later `syncToFirebase()`. `addLog()` would sync, but nothing calls it.
- **Difficulty label never shows.** `updateUI` looks for `gameState.gameMode === "vs-cpu"`. The real solo value is `"solo"`, so the header stays as the bare CPU name and not `"Name (Easy)"`.
- **`prompt()` for decisions.** Trance setback and Quiet Mind (when both stats are positive) block on `window.prompt`. Online, only the resolving browser sees it. Replacing those with a modal means the other client must wait on `phase` and must not resolve the same roll itself — `resolveDice` is already guarded by `isLocalPlayerTurn`.
- **Fading Reality vs its description.** The card text says you can reroll any 👁️. The button rerolls every unlocked 👁️ at once.
- **Simmering Arousal is asymmetric.** The human helper refuses kept dice. The CPU helper does not.
- **Empty manifest entries.** Victor, Cassandra, Damian, Seraphina, and Leo cannot start a local game with a chosen form until their arrays are filled or the empty-array case is treated as "all transforms".
- **Duplicate instant.** Ids 10 and 39 have the same name and the same effect. The second is unbuyable once the first is in inventory.
- **Energy actions are compiled out.** See [Game modes](#game-modes). `buyAction` is still the implementation if you turn the flag back on.
- **CPU wipe and buy loops** assume `market` entries are always real cards. A hole in the array is skipped; don't leave `undefined` slots in `market`.
- **Tutorial from setup** calls `location.reload()` when it ends, because `prepareGuidedTutorial` starts a disposable solo game. Starting the tutorial from in-game help instead (`startGuidedTutorial(false)`) does not reload and does not reset the match.

## Suggested checks when you change rules

There is no automated suite. After a rules change, run through these by hand:

- Solo, Beginner, complete one full turn: roll, keep, reroll, resolve, buy, end, CPU takes a turn without throwing in the console.
- Hotseat: both End Turn buttons, and a card bought by player 2, stick to the right inventory.
- A 3-👁️ roll with Dream State, and a 2-👁️ roll without it (the pair must do nothing).
- Submission pushed to +6 and to -6, and a turn ended while sitting on +5 or -5.
- Trance taken from 4 to 6 (setback should leave 1, plus the chosen punishment).
- Lucidity with Burning Intensity owned by the opponent (arousal costs 2).
- New Identity at 10 transform does not end the game; a second hit to 10 without that card does.
- Online: host creates a room, guest joins, guest's name replaces `"Waiting..."`, each side can act only on its own turn, a bought card appears on the other screen.

## License

No license file is in the repo yet. Add one before accepting contributions; until then the default is "all rights reserved."
