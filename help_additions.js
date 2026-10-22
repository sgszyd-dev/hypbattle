// ============================================================
// HELP / RULES / GUIDED TUTORIAL SYSTEM
// ============================================================

const HELP_CONTENT = {
    quick: `
        <div class="help-section">
            <h3>Objective</h3>
            <p><strong>Completely transform your opponent before they transform you.</strong> There are 10 stages of transformation. When your move pushes them to 10 or beyond, you win. Their body becomes yours to rewrite.</p>
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
            <p>Each 🌀 deepens the opponent's Trance. Reaching 5 Trance causes a Setback for the opponent: You choose whether they are more submissive (+2) or more aroused (+2). Any Trance beyond 5 carries over, so a big push can trigger more than one Setback.</p>
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
            <h3>Setup</h3>
            <p>The starting player is chosen at random in a normal game. The player who goes second begins with 1 ⚡; the first player begins with 0. The market starts with three cards.</p>
        </div>
        <div class="help-section">
            <h3>Obedience at the End of the Track</h3>
            <p>If the Submission marker is on the <strong>very last step of your side</strong> when your turn ends, you obey and take <strong>1 Transform</strong>. Every turn you finish there costs you another point, so pushing it back off the endpoint matters.</p>
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
             <p>Some effects are based on individual dice while others require a set of matching faces. A <strong>⬜ Blank</strong> face has no effect and does not count toward any set. It appears on the special die from <i>Deeper Bargains</i> (three copies of your chosen face and three Blanks) and on 🌀 dice rolled by Tex when his signature power is active.</p>
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
            <p><strong>Wipe Row</strong> costs 2 Energy (or 1 for Zixuan's signature power), discards the current market cards, and replaces the row with new cards when available. If you think the opponent will get a powerful card and you
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
            <p>Beginner is more random. Easy uses basic strategy. Normal is more aggressive. Hard uses a stronger strategic profile. Expert emphasizes defensive play. Virtuoso favors Transformation-focused strategies. Master or Mistress adapts its plan to your play and can be very challenging.</p>
        </div>
    `,
	seven: `
        <div class="help-section">
            <h3>The Seven: Solo Challenge</h3>
            <p>Face seven rivals in a gauntlet that gets harder at every step. It is available in <strong>1 Player vs CPU</strong> mode from the setup screen.</p>
            <ul>
                <li><strong>The lineup:</strong> when a run begins, seven different characters are chosen at random from everyone except your own avatar. The lineup is fixed for that run, and it is saved with your progress.</li>
                <li><strong>The ladder:</strong> rivals climb through the CPU levels Beginner, Easy, Normal, Hard, Expert, Virtuoso and Master, in that order.</li>
                <li><strong>Winning</strong> moves you up to the next rival. Beating the seventh completes the challenge.</li>
                <li><strong>Losing</strong> sends you back one rival, and you must beat them again. <strong>Losing to the first rival ends the run.</strong></li>
                <li><strong>Going first:</strong> you always take the first turn in a challenge match. The CPU, as the second player, begins with 1 ⚡.</li>
                <li><strong>Transformations:</strong> every rival is always transformed into their own signature form, so <strong>every rival's signature power is active</strong>. Your own form is random, except against the seventh rival, where you are given your signature form and your power is active for the final match.</li>
            </ul>
            <h4>Saving</h4>
            <p>Progress is saved in this browser as you advance. A save restores your position in the gauntlet, not a match that is half played, so you restart the current rival's match when you resume. <strong>Export Challenge Save</strong> produces a code you can load on another browser. <strong>Challenge Record</strong> tracks your runs, wins, losses and furthest rival.</p>
        </div>
        <div class="help-section">
            <h3>Signature Powers</h3>
            <p>Each character has one special power tied to one <strong>signature form</strong>. A power is only active when the transformation <em>being inflicted on that character</em> is their signature form. The setup screen shows a status line for each character: <em>ACTIVE for this setup</em>, or which form to choose to activate it. In online play, choose the <em>Signature</em> option to give your opponent their signature form.</p>
            <div class="help-grid">
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Alex/Alex_head.jpg" alt="Alex">
                    <strong>Alex · <span class="signature-form">Bunny</span></strong><br>
                    <em>Unyielding Resistance</em><br>
                    Once per opposing turn, Alex absorbs 1 point of an incoming Submission push. Alex cannot buy or use <i>Mesmerizing Rhythm</i> or <i>I Will Not Obey</i>.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Roz/Roz_head.jpg" alt="Roz">
                    <strong>Roz · <span class="signature-form">Eevee</span></strong><br>
                    <em>Triple Trouble</em><br>
                    When Roz has no rerolls left and holds three or more matching dice, those dice lock and she gets one bonus reroll (once per turn).
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Xander/Xander_head.jpg" alt="Xander">
                    <strong>Xander · <span class="signature-form">Bat</span></strong><br>
                    <em>Heated Opening</em><br>
                    Every 🔥 die adds 1 Arousal, starting with the first die, instead of the usual two-dice minimum.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Siobhn/Siobhn_head.jpg" alt="Siobhán">
                    <strong>Siobhán · <span class="signature-form">Cat</span></strong><br>
                    <em>Predatory Momentum</em><br>
                    A final roll with 4 or more 👁️ or ⛓️ resolves only that face (the other dice are lost), then Siobhán takes a bonus turn: one six-die roll with no rerolls. Once per turn.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Tex/Tex_head.jpg" alt="Tex">
                    <strong>Tex · <span class="signature-form">Cow</span></strong><br>
                    <em>Twisted Dice</em><br>
                    Every 🌀 Tex rolls becomes Blank. Each ⛓️ die in his final roll can be kept or reassigned to 🌀 or 🔥, one die at a time.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Luci/Luci_head.jpg" alt="Luci">
                    <strong>Luci · <span class="signature-form">Robot</span></strong><br>
                    <em>Submission Amplifier</em><br>
                    A final roll with 3 or more ⛓️ adds one extra point to the Submission push.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Zixuan/Zixuan_head.jpg" alt="Zixuan">
                    <strong>Zixuan · <span class="signature-form">Doll</span></strong><br>
                    <em>Market Manipulator</em><br>
                    Wiping the market costs 1 ⚡ instead of 2.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Hyeri/Hyeri_head.jpg" alt="Hyeri">
                    <strong>Hyeri · <span class="signature-form">Squirrel</span></strong><br>
                    <em>Perfect Harmony</em><br>
                    When all six faces appear in the final roll, every die changes to a face she has not used with this power yet. Each face can be used once per game.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Mark/Mark_head.jpg" alt="Mark">
                    <strong>Mark · <span class="signature-form">Gender</span></strong><br>
                    <em>Lingering Trance</em><br>
                    When Mark causes an opponent's Trance Setback, that opponent keeps 1 🌀 instead of dropping to the usual remainder.
                </div>
                <div class="help-box signature-power-box">
                    <img class="signature-portrait" src="images/avatars/Fable/Fable_head.jpg" alt="Fable">
                    <strong>Fable · <span class="signature-form">Otter</span></strong><br>
                    <em>Lucid Reversal</em><br>
                    If her final roll has three or more 💧 and she has any Transform, Fable may spend three 💧 to reduce her own Transform by 1; the rest of her 💧 resolve normally.
                </div>
            </div>
        </div>
    `
};

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
        body: '<p>Only unlocked dice are rerolled. Click <strong>Roll Unkept Dice</strong> once and watch the unlocked dice change while your locked dice stay put.</p><p>Your available rerolls are shown above the dice. High arousal makes those rerolls harder to come by, so keep your libido in check.</p>',
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



let guidedTutorialStep = 0;
let guidedTutorialActive = false;
let guidedTutorialStartedFromSetup = false;

function clearTutorialHighlight() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
}

function resetTutorialGameState() {
    gameState = {
        gameMode: 'solo',
        p1: { name: '', transformTarget: '', trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, signatureSiobhanUsed:false, signatureHyeriUsedFaces:[] },
        p2: { name: '', transformTarget: '', difficulty: 'smart', trance: 0, arousal: 0, transform: 0, energy: 0, vulnerability: 0, lastRoll: [], inventory: [], boughtCardThisTurn: false, shieldActive: false, simmeringUsed: false, burningUpUsed: false, signatureSiobhanUsed:false, signatureHyeriUsedFaces:[] },
        submission: 0, activePlayer: 1, round: 1, phase: 'waiting',
        dice: Array(6).fill({ face: '-', kept: false }),
        rerollsLeft: 0, gameEnded: false, showDiceText: true, showEnergyActions: false, freeBuyActive: false, extraTurn: false, somnambulismTurn: false,
        signatureSiobhanBonusPending:false, signatureSiobhanBonusRoll:false, signatureTexAllocationPending:false, signatureTexAllocationDone:false, signatureFableDecisionPending:false, signatureFableDecisionMade:false, signatureFableSpend:false, signatureHyeriPromptPending:false, signatureRozBonusGranted:false, signatureAlexAbsorbedThisTurn:false,
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