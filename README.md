# Hypnotic Duel

*A strategic dice-and-card game where the mind is the battlefield.*

Hypnotic Duel is a browser-based, turn-based strategy game built with
HTML, CSS, and JavaScript. Roll and lock dice, manage resources, acquire
abilities, and use a changing set of tactics to transform your opponent
before they transform you.

> **Project status:** Beta --- the uploaded game file identifies itself
> as **Hypnotic Duel - Beta V13.0**. Rules, balance, and online-play
> behavior may continue to change.

## Features

-   **Three game modes**
    -   **1 Player vs CPU** --- play against the computer.
    -   **2 Player Local** --- take turns on the same browser.
    -   **2 Player Online** --- connect remotely through a Firebase
        Realtime Database room and lobby.
-   **Multiple CPU difficulty profiles:** Beginner, Easy, Normal, Hard,
    Expert, and Master. The profiles range from more random play to more
    aggressive, defensive, or adaptive strategies.
-   **Dice management:** roll, lock dice you want to keep, and reroll
    the remaining dice before resolving the result.
-   **Resource and status management:** use Energy to buy cards, while
    Trance, Lucidity, Arousal, Submission, and Transform affect the
    duel.
-   **Card market and inventory:** purchase cards from a three-card
    market, use immediate effects, and build around persistent Keep
    cards.
-   **Submission track:** contest control of the track; pushing past an
    endpoint can cause Transform damage.
-   **Character and transformation selection:** choose character names
    and transformation targets during setup.
-   **Built-in help:** quick rules, advanced explanations, searchable
    card descriptions, and a guided tutorial.
-   **Game history and diagnostics:** review turn history and use the
    game's available game-log/export tools.
-   **Presentation options:** choose dice notation, optionally enable
    sound effects, and show or hide the detailed log.
-   **Responsive interface and reduced-motion accommodations** for
    supported animations.

## How to Play

### Objective

Transform your opponent to **10 or more Transform** before they do the
same to you. Keep an eye on your own Transform level and use cards and
resources to disrupt the opponent's plan.

### Turn overview

1.  **Roll.** Roll the available dice.
2.  **Choose what to keep.** Click dice to lock them so they remain
    unchanged on a reroll.
3.  **Reroll.** Reroll unlocked dice while you still have rerolls
    available.
4.  **Resolve.** Apply the dice effects and any qualifying combinations.
5.  **Shop and use abilities.** Spend Energy on cards in the market and
    use any available card effects.
6.  **End your turn.** The game advances to the other player unless an
    effect grants an extra turn.

The dice use these symbols:

  Symbol   Resource / effect
  -------- -------------------
  🌀       Trance
  💧       Lucidity
  ⚡       Energy
  ⛓️       Submission
  🔥       Arousal
  👁️       Transform

### Cards and the market

The market offers three cards at a time. Buying a card refills its
market slot when possible, and a player can make multiple purchases if
they have enough Energy. The discard pile can be recycled when the draw
deck runs out.

-   **Keep cards** provide ongoing or phase-specific abilities.
-   **Instant cards** resolve immediately and are then discarded.
-   You cannot have two cards with the same name in your inventory.
-   Some cards modify dice, provide defense, change resources, grant
    extra turns, or affect the market.
-   **Wipe Row** costs Energy and replaces the current market row when
    cards are available.
-   Some card effects allow purchases from the opponent's inventory.

For exact card descriptions and edge cases, open the in-game **Help /
Rules** panel; it includes a searchable card list and advanced rules.

### Game modes

-   **Solo:** select a CPU difficulty in the setup dialog.
-   **Local multiplayer:** choose **2 Player Local** to play with
    another person on the same device.
-   **Online multiplayer:** choose **2 Player Online (Firebase)**. One
    player hosts a room and shares the room code; the other joins with
    that code. Both players select their characters/transformations in
    the lobby and mark themselves ready.

## Running the Game Locally

### Requirements

-   A modern browser with JavaScript enabled.
-   An internet connection for the external Google Fonts and Firebase
    CDN resources used by the current HTML.
-   Firebase configuration and suitable Realtime Database rules for
    online multiplayer.

### Quick start

1.  Download or clone this repository.
2.  Keep the HTML file together with any image, icon, manifest, or other
    assets referenced by the project. Preserve their expected relative
    paths.
3.  Open the main HTML file in a modern browser.
4.  Choose a game mode and configuration, then select **Begin Duel**.

For local solo or same-device play, the game may run by opening the HTML
file directly. If browser restrictions or asset paths cause problems,
serve the project directory through a local static web server instead.

### GitHub Pages

The game can be hosted as a static site if the repository includes the
main HTML file and all referenced assets at the expected paths.

1.  Push the project files to GitHub.
2.  In the repository, open **Settings → Pages**.
3.  Select the branch and folder containing the site files (commonly
    `main` and `/root`).
4.  Save, then open the published Pages URL once GitHub finishes
    deploying.

If you rename the main HTML file to `index.html`, check all asset paths
and any project links before publishing.

## Online Multiplayer and Firebase

The current implementation imports Firebase JavaScript SDK modules from
Google's CDN and uses **Firebase Realtime Database** to exchange lobby
and game state. The HTML contains the Firebase project configuration for
the `hypbattle` project.

Before relying on online play:

-   Confirm that the Firebase project is active and that the configured
    Realtime Database URL is correct.
-   Configure database security rules deliberately. Do **not** deploy a
    publicly writable database simply to make room joining work;
    client-side room codes are not an authorization or anti-cheat
    system.
-   Test hosting over HTTPS and test with two separate browser
    sessions/devices.
-   Check Firebase usage, quotas, and billing settings for your project.

The Firebase web configuration (including the API key) identifies the
client application; it should not be treated as a database security
boundary. Protect data with Firebase Security Rules and any additional
validation appropriate for your deployment. Do not add service-account
credentials or other server secrets to client-side HTML.

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

## Project Structure

The game is currently implemented as a largely self-contained HTML page,
with:

-   **HTML** for the setup dialogs, board, dice, market, inventory,
    help, and history interfaces.
-   **CSS** for the dark occult-inspired theme, responsive layout, and
    animation effects.
-   **JavaScript** for game state, dice resolution, cards, CPU behavior,
    game history, and multiplayer synchronization.
-   **Firebase Realtime Database** for the online room/lobby and shared
    game state.
-   **Referenced static assets** such as character artwork, icons, and
    web app manifest files, where included in the repository.

The current source file provided for this README is named
`index.html`. Update the filename above if the
repository uses a different canonical entry point.

## Characters and art

Roster (`CHARACTERS`): Alex (M), Roz (F), Victor (M), Siobhán (F), Tex (M), Cassandra (F), Zixuan (M), Hyeri (F), Mark (M), Fable (F).

Transform targets (`TRANSFORMS`): Statue, Cow, Cat, Dog, Werewolf, Fox, Horse, Pig, Gender, Puppet, Bunny, Otter, Eevee, Squirrel, Robot, Doll, Dragon.

`CHARACTER_MANIFEST` limits the **local** setup dropdown to transforms that character has art for. The key is the full roster string (`"Alex"`). The value is the list of transforms that character can *be turned into*.

| Character | Local transform options |
|---|---|
| Alex | Bunny, Pig, Dog, Cat, Gender |
| Roz | Werewolf, Cow, Eevee |
| Siobhán | Horse, Cat, Bunny, Fox, Otter, Pig, Doll, Gender, Werewolf, Dog, Statue, Puppet |
| Tex | Cow, Cat, Werewolf, Horse |
| Fable | Cat, Bunny, Cow, Otter, Werewolf, Statue |
| Zixuan | Dog, Fox, Pig |
| Hyeri | Bunny, Squirrel, Cat, Dragon |
| Mark | Robot, Puppet, Statue |
| Victor, Cassandra | **None.** The key exists and the array is empty, so the dropdown is empty. Online mode ignores the manifest and lists every transform. |

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

1. Add `"Name"` and `"Gender"` to `CHARACTERS`. Gameplay only keeps the first word, so names must be unique before the space and must not contain a space.
2. Add a `CHARACTER_MANIFEST` entry listing the forms you actually have art for.
3. Add `images/avatars/<Name>/<Name>_baseline.jpg`.
4. For each form, add stages 0–11. Anything you skip shows the placeholder text instead of a broken layout.

### Adding new transforms

1. Add to the `TRANSFORMS` array.

Clicking a portrait opens `#image-modal`.

## Troubleshooting

-   **Online room controls do not work:** confirm that Online mode is
    selected, the Firebase modules load successfully, and the browser
    console has no Firebase/database errors.
-   **Opponent does not appear in the lobby:** check that both players
    entered the same room code and that Firebase Realtime Database
    access is configured correctly.
-   **Images or icons are missing:** make sure all referenced assets are
    committed and that their paths and capitalization match. GitHub
    Pages paths are case-sensitive.
-   **The page works locally but not on GitHub Pages:** inspect
    browser-console errors and verify the deployed file layout and
    relative paths.
-   **The CPU behaves unexpectedly:** reproduce the situation, review
    the in-game log and turn history, and record the selected difficulty
    and relevant card/dice state.
# Debug switches

Near the top of the game script:

```js
const cardDebugOn = false;
const debugCards = [5, 50, 51]; // dealt first
```

With `cardDebugOn` true, `prepareDebugDeck` pulls those ids out of the shuffled deck and places them where `deck.pop()` will draw them first (so they appear in the opening market, in reverse listed order).

`startTurn` also `console.log`s a `"LONG TRACE"` of dice-count inputs. `cpuCardPurchaseScore` calls `log()` for every card it scores, which writes into the on-screen game log during CPU turns. Take that out if you are not actively tuning AI weights.
## Contributing and Feedback

Bug reports, reproducible gameplay issues, and suggestions for improving
balance or CPU strategy are welcome. When reporting a bug, include:

-   Game mode and CPU difficulty (if applicable).
-   Steps to reproduce the issue.
-   Expected and actual results.
-   Relevant turn-history or exported game-log details.
-   Browser and operating system, if the issue appears
    environment-specific.

## License

Copyright © 2026 Siobhán Greene. All rights reserved. No license is granted to use, copy, modify, or distribute this project

