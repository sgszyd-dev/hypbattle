// Tranceformation taunt text and related selection settings.
// Load this classic script BEFORE hypbattle.js in the HTML.

const PLAYER_TRANSFORMATION_TAUNT_CHANCE = 0.25;

const TRANSFORMATION_TAUNTS = {
    Statue: {
        player: {
            TransformPlayer: [
                "Another step. Your skin is losing its warmth, and soon even your expression may be set in stone.",
                "Feel that stiffness? I'm not just changing how you look. I'm taking away the little movements you never thought about."
            ],
            PlayerAt5Transform: [
                "Halfway to stone. How long before that startled look gets carved permanently into your face?",
                "Five stages down. Your body is becoming an ornament, and you still think you can fight me."
            ],
            PlayerAt8Transform: [
                "Two steps left. Imagine standing there forever, unable to do a thing about what I've made of you.",
                "Almost a statue. That lovely defiant expression? I might just make it your permanent one."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My skin is hardening. If you think I'll stand here like some garden ornament, think again.",
                "Stone? You're trying to turn me into stone? I'll make sure you regret chipping away at me."
            ],
            AIAt5Transform: [
                "Halfway to stone, and I can already feel my movements stiffening. You're going to pay for this.",
                "My face feels like marble. I refuse to become some lifeless decoration for your amusement."
            ],
            AIAt9Transform: [
                "One step left. A statue, is it? Fine. Then I'll be the most intimidating thing in your collection.",
                "Perhaps stone isn't so bad. I could stand here forever looking down on you. You, on the other hand, will still be breakable."
            ]
        }
    },

    Cow_female: {
        player: {
            TransformPlayer: [
                "Another step toward horns, hooves, and a body built for the pasture. Starting to feel less human?",
                "Your features are changing, and that stubborn human pride won't stop a single hoof from growing."
            ],
            PlayerAt5Transform: [
                "Halfway to a cow. How does it feel knowing your old shape is being replaced by something so thoroughly different?",
                "Five stages in. That human silhouette is fading, and there's a whole new animal taking its place."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon those hooves will be yours, and your old shoes will be nothing but a memory.",
                "Almost a cow now. Keep glaring at me. I want you to remember exactly who did this."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Horns? Hooves? Oh, you are going to regret making this particular change to me.",
                "My body is getting heavier, my features are changing. You'd better enjoy this while you can."
            ],
            AIAt5Transform: [
                "Halfway to a cow. I can feel my balance changing, and I absolutely refuse to moo for you.",
                "My hands are changing, my feet are changing, and you're enjoying this far too much."
            ],
            AIAt9Transform: [
                "One step left. If I'm going to be a cow, I'll be the most formidable one in the herd.",
                "Fine. Let the horns come. You may have changed my shape, but don't mistake that for having broken me."
            ]
        }
    },

    Cow_male: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a bull. Those shoulders won't stay human, and neither will that face.",
                "Feel yourself getting heavier? You're being built into a bull, piece by piece. Keep telling yourself you're in control."
            ],
            PlayerAt5Transform: [
                "Halfway to a bull. Your strength is changing, your frame is broadening, and your old clothes are losing the argument.",
                "Five stages down. Soon you'll have horns to match that stubborn head of yours."
            ],
            PlayerAt8Transform: [
                "Two steps left. Imagine those horns in the mirror. Still want to tell me nothing has changed?",
                "Nearly a bull. Your human proportions are almost gone, and there's no bargaining with what's coming."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My frame is broadening. If you're trying to turn me into a bull, you had better be ready for the consequences.",
                "Horns? Hooves? I did not agree to this. You and I are going to have a very different conversation afterward."
            ],
            AIAt5Transform: [
                "Halfway to a bull, and my body feels like it's been rebuilt from the ground up. I'm not letting you enjoy this for long.",
                "My shoulders are enormous, my balance is different, and I'm starting to understand just how strong this body could be."
            ],
            AIAt9Transform: [
                "One step left. All right, let the horns finish growing. You may have made a bull, but you haven't made me tame.",
                "I can feel the strength in this body now. If this is what you've chosen for me, you'd better learn to respect it."
            ]
        }
    },

    Cat: {
        player: {
            TransformPlayer: [
                "Another step toward whiskers, soft paws, and a tail that will give away every little emotion.",
                "Your ears are changing, your features are sharpening. Soon you'll look like you've always belonged on four paws."
            ],
            PlayerAt5Transform: [
                "Halfway to a cat. I wonder how long before your ears start twitching whenever I speak.",
                "Five stages down. That new face is coming along nicely. Shame you can't claw your way out of this."
            ],
            PlayerAt8Transform: [
                "Two steps left. Better prepare for a tail that betrays your mood even when your face doesn't.",
                "Almost a cat. That human reflection is about to become somebody else's problem."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears! And what is happening to my face? You're going to regret giving me whiskers.",
                "A tail? Paws? Oh, that's just wonderful. I'll remember this when I get the chance to return the favor."
            ],
            AIAt5Transform: [
                "Halfway to a cat. My balance is different, and I can hear every little sound in this room. Annoying.",
                "I can feel fur spreading and my face changing. Stop looking so pleased with yourself."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll admit these ears suit me. That doesn't mean you've won anything but a very irritated cat.",
                "Perhaps this form has its advantages. Sharp senses, quick movements, claws. You might have made a mistake."
            ]
        }
    },

    Dog: {
        player: {
            TransformPlayer: [
                "Another step toward floppy ears, a muzzle, and a tail that may be rather less discreet than your face.",
                "Your features are growing canine. Keep your chin up while you still can."
            ],
            PlayerAt5Transform: [
                "Halfway to a dog. How long before that new nose starts noticing everything you'd rather ignore?",
                "Five stages down. Your old face is slipping away, and a muzzle is taking its place."
            ],
            PlayerAt8Transform: [
                "Two steps left. Those ears and that tail are almost yours to keep.",
                "Nearly a dog. You can glare all you want, but you can't glare away a wagging tail."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing. You're giving me a muzzle? Oh, this is going to be personal.",
                "I can feel my ears changing and something happening behind me. Don't you dare laugh."
            ],
            AIAt5Transform: [
                "Halfway to a dog. My hearing is sharper, my nose is changing, and I can smell your smugness from here.",
                "My hands aren't quite right, and my face is growing longer. This is a humiliating way to gain new senses."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll take the sharper senses and the speed. I'll still be the one deciding what to do with them.",
                "Perhaps a canine form isn't entirely a disadvantage. Just remember who taught this dog to bite back."
            ]
        }
    },

    Werewolf: {
        player: {
            TransformPlayer: [
                "Another step toward fur, fangs, and a face that won't look human for much longer.",
                "Your body is growing wilder. I wonder whether you'll recognize yourself when the claws come in."
            ],
            PlayerAt5Transform: [
                "Halfway to a werewolf. Your human features are losing ground to something far more feral.",
                "Five stages down. Fur, fangs, and a growing muzzle. Still think you can hold on to your old self?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that reflection will bare its fangs back at you.",
                "Nearly a werewolf. Your old life is looking awfully small from inside that changing body."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Fur? Fangs? Oh, you have made a very dangerous choice. I hope you know what you're doing.",
                "My face is changing, and I can feel claws coming in. You'd better hope I don't get used to them."
            ],
            AIAt5Transform: [
                "Halfway to a werewolf. My senses are sharpening, my body is changing, and I can barely ignore every sound around me.",
                "My hands are becoming claws, and my teeth feel wrong. I am not enjoying this. Not yet."
            ],
            AIAt9Transform: [
                "One step left. The claws feel natural now. That should worry you more than it worries me.",
                "Fine. Let the transformation finish. If I am going to be a werewolf, I will be the one everyone else fears."
            ]
        }
    },

    Fox: {
        player: {
            TransformPlayer: [
                "Another step toward fox ears, a pointed muzzle, and a tail that will be impossible to ignore.",
                "Your features are getting sharper and more vulpine. I wonder whether that clever human expression will survive."
            ],
            PlayerAt5Transform: [
                "Halfway to a fox. Your face is changing, your tail is coming in, and your old appearance is losing its grip.",
                "Five stages down. You are beginning to look like the creature I have planned for you."
            ],
            PlayerAt8Transform: [
                "Two steps left. Those ears and that bushy tail are nearly yours.",
                "Almost a fox. All that cleverness, and you still couldn't outsmart a transformation."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "A muzzle and a tail? You have some nerve. I will find a way to make you regret this.",
                "My ears are changing, and I can feel my face sharpening. You'd better hope I don't become as clever as I look."
            ],
            AIAt5Transform: [
                "Halfway to a fox. My balance is changing, and this tail is going to take some getting used to.",
                "My features are getting sharper. If you think that makes me less dangerous, you're a fool."
            ],
            AIAt9Transform: [
                "One step left. I'll admit the tail is impressive. Don't mistake appreciation for gratitude.",
                "Fine. A fox it is. Quick, clever, and difficult to catch. Perhaps you should have thought this through."
            ]
        }
    },

    Horse: {
        player: {
            TransformPlayer: [
                "Another step toward a mane, hooves, and a frame that won't fit through life the way it used to.",
                "Your legs and body are changing. That human stride is on its way out."
            ],
            PlayerAt5Transform: [
                "Halfway to a horse. Your balance is shifting, your frame is changing, and those human proportions are fading.",
                "Five stages down. Soon those feet won't be much use for your old shoes."
            ],
            PlayerAt8Transform: [
                "Two steps left. You can practically feel those hooves replacing your feet.",
                "Nearly a horse. I hope you weren't too attached to your old way of walking."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My legs! What are you doing to my legs? This body is changing far too quickly.",
                "A mane? Hooves? I'll make you regret every stage of this transformation."
            ],
            AIAt5Transform: [
                "Halfway to a horse. My balance is completely different, and my legs are becoming something else.",
                "My frame is growing, my feet are changing, and I am not about to let you enjoy my discomfort."
            ],
            AIAt9Transform: [
                "One step left. All right, this body has power. I can work with power.",
                "A horse, then. Strong, fast, and hardly helpless. You may have changed me, but you haven't made me obedient."
            ]
        }
    },

    Pig: {
        player: {
            TransformPlayer: [
                "Another step toward a snout, floppy ears, and a body that looks less and less like your old one.",
                "Your nose is changing. That familiar face is disappearing, and there's nothing dignified about what comes next."
            ],
            PlayerAt5Transform: [
                "Halfway to a pig. Your face is changing, and that human nose is losing the battle.",
                "Five stages down. You can be furious all you like; it won't stop those ears from changing."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon the snout will be unmistakable.",
                "Almost a pig. I wonder how you'll feel when the mirror confirms what I've done."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My nose! No. Absolutely not. You are going to pay for this indignity.",
                "I can feel my face changing. You have some idea of what you've started, don't you?"
            ],
            AIAt5Transform: [
                "Halfway to a pig. My face feels wrong, my balance is changing, and you're enjoying every second.",
                "Five stages. I refuse to let a snout be the most memorable thing about me."
            ],
            AIAt9Transform: [
                "One step left. Fine. I can survive being a pig. Can you survive what I do next?",
                "If this is the body I've been given, I'll wear it with more dignity than you deserve."
            ]
        }
    },

    Gender_male: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a woman. Your face, your silhouette, your voice—none of it is beyond my reach.",
                "Your body is shifting toward a woman's form. Keep insisting you're unchanged; the mirror will settle the argument."
            ],
            PlayerAt5Transform: [
                "Halfway to becoming a woman. Your features and proportions are changing, and denial won't make them revert.",
                "Five stages down. Your old masculine outline is giving way to something unmistakably feminine."
            ],
            PlayerAt8Transform: [
                "Two steps left. That woman in the mirror is almost you, whether you're ready to admit it or not.",
                "Nearly transformed. You can cling to your old identity all you like; your changing reflection tells a different story."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing, my proportions are shifting—you're turning me into a woman. I will remember this.",
                "My voice sounds different. My body feels different. Don't you dare mistake my surprise for surrender."
            ],
            AIAt5Transform: [
                "Halfway to becoming a woman. My shape is changing in ways I can no longer dismiss. This is infuriating.",
                "My features are softer, my silhouette is changing, and my old clothes fit differently. I hate that you can see it."
            ],
            AIAt9Transform: [
                "One step left. I can see the woman I'm becoming now. That doesn't mean you've won my respect.",
                "Fine. Let the transformation finish. I'll decide what kind of woman I become, not you."
            ]
        }
    },

    Gender_female: {
        player: {
            TransformPlayer: [
                "Another step toward becoming a man. Your features and proportions are shifting, and there's no stopping them now.",
                "Your body is changing toward a man's form. That old reflection is slipping away, whether you like it or not."
            ],
            PlayerAt5Transform: [
                "Halfway to becoming a man. Your silhouette is changing, and your old features are losing ground.",
                "Five stages down. That familiar face is changing into someone you may barely recognize."
            ],
            PlayerAt8Transform: [
                "Two steps left. The man in the mirror is almost you now.",
                "Nearly transformed. You can protest all you want; your reflection won't be persuaded."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My face is changing, my frame feels different—you're turning me into a man. This is not over.",
                "My voice, my proportions, my features—everything is shifting. I won't let you define who I am."
            ],
            AIAt5Transform: [
                "Halfway to becoming a man. My body is changing in ways I can feel with every movement.",
                "My frame is changing, and my reflection is becoming harder to recognize. I am furious with you."
            ],
            AIAt9Transform: [
                "One step left. I can see the man I'm becoming. I'll decide what that means for me.",
                "Fine. Let the change finish. You may have changed my body, but you don't get to own my identity."
            ]
        }
    },
    
    Puppet: {
        player: {
            TransformPlayer: [
                "Another step toward a body built with joints instead of freedom. I wonder how much control you'll have left.",
                "Your movements are becoming less natural. Soon you'll look like something made to be handled."
            ],
            PlayerAt5Transform: [
                "Halfway to a puppet. How does it feel when your body starts moving like it was designed by someone else?",
                "Five stages down. Your joints are changing, your movements feel strange, and you still can't stop me."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon every movement will remind you what I've turned you into.",
                "Almost a puppet. Imagine seeing those joints in the mirror and knowing exactly who made them."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My joints feel wrong. Are you turning me into a puppet? You have no idea what you're risking.",
                "My movements are changing. I refuse to become some toy you can show off."
            ],
            AIAt5Transform: [
                "Halfway to a puppet. My limbs move differently, and I hate how aware I am of every joint.",
                "Five stages. I can feel my body becoming something crafted rather than born. This is deeply unsettling."
            ],
            AIAt9Transform: [
                "One step left. If I become a puppet, I'll be the one pulling the strings.",
                "Fine. Let the joints settle. A puppet can still have a mind, and mine is already plotting."
            ]
        }
    },

    Mannequin: {
        player: {
            TransformPlayer: [
                "Another step toward a plastic body. I wonder how much control you'll have left.",
                "Your movements are becoming less natural. Soon you'll look like something made to be posed.",
				"I'm going to enjoy dressing and undressing you."
            ],
            PlayerAt5Transform: [
                "Halfway to a mannequin. How does it feel when your body starts moving like it was designed by someone else?",
                "Five stages down. Feeling harder to move, I'm sure. You should get up on that pedestal and pose for me now."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon every movement -- or in your case, lack of movement -- will remind you what I've turned you into.",
                "Almost a mannequin. Imagine seeing that unreal, smooth plastic in the mirror and knowing exactly who made you that way."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My arms and legs feel wrong. Are you turning me into a mannequin? You have no idea what you're risking.",
                "My movements are getting harder. I refuse to become some toy you can show off."
            ],
            AIAt5Transform: [
                "Halfway to a mannequin. I'm having trouble moving my limbs, and I hate how aware I am of my fake skin.",
                "Five stages. I can feel my body becoming something crafted rather than born. This is deeply unsettling."
            ],
            AIAt9Transform: [
                "One step left. I know you want me on a pedestal looking down on you.",
                "Fine. Let my body settle. This mannequin will still have a mind, and mine is already plotting."
            ]
        }
    },

    Bunny: {
        player: {
            TransformPlayer: [
                "Another step toward long ears, a fluffy tail, and legs that won't look quite human for much longer.",
                "Your ears are changing. That new silhouette is going to be very hard to hide."
            ],
            PlayerAt5Transform: [
                "Halfway to a bunny. Those ears are becoming part of you, and your old appearance is slipping away.",
                "Five stages down. I wonder how you'll feel when that little tail finally appears."
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly all fluff, ears, and rabbit features. How charmingly irreversible.",
                "Almost a bunny. You can keep glaring, but those long ears are here to stay."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are growing? And what is happening to my legs? You're going to regret this.",
                "A tail? Long ears? I am not going to let you enjoy this without consequences."
            ],
            AIAt5Transform: [
                "Halfway to a bunny. My balance is changing, and my legs feel ready to spring without asking me.",
                "Five stages. These ears are impossible to ignore. I swear, if you laugh..."
            ],
            AIAt9Transform: [
                "One step left. All right, the new legs have some advantages. Don't think I've forgiven you.",
                "Fine. A bunny. Quick, alert, and not nearly as helpless as you seem to think.",
				"{CPUGEN|All the girl bunnies had better beware!|Thoughts of breeding are...strong.} But you won't distract me!"
            ]
        }
    },

    Otter: {
        player: {
            TransformPlayer: [
                "Another step toward sleek fur, whiskers, and paws made for a life far removed from your old one.",
                "Your features are becoming more otter-like. I wonder how long before that new face feels familiar."
            ],
            PlayerAt5Transform: [
                "Halfway to an otter. Your whiskers and paws are coming along nicely. Still think this is just a game?",
                "Five stages down. You're losing your human shape and gaining a very different set of instincts."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that sleek little otter face will be unmistakably yours.",
                "Almost an otter. That old reflection is nearly gone, and I rather like the replacement."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Whiskers? Fur? You're turning me into an otter. I hope you're ready for the consequences.",
                "My paws are changing, and my face feels strange. You will answer for this."
            ],
            AIAt5Transform: [
                "Halfway to an otter. My body feels sleeker, my paws are different, and I am trying very hard not to panic.",
                "Five stages. My senses are changing, and this new body is becoming harder to ignore."
            ],
            AIAt9Transform: [
                "One step left. The sleek build and nimble paws might actually be useful. I still intend to win.",
                "Fine. An otter it is. If I have to adapt, I'll adapt better than you ever could."
            ]
        }
    },

    Eevee: {
        player: {
            TransformPlayer: [
                "Another step toward fluffy fur, huge ears, and an Eevee face. Your old look is fading fast.",
                "That new fur is coming in nicely. Soon you'll be unmistakably an Eevee, whether you find that cute or not."
            ],
            PlayerAt5Transform: [
                "Halfway to Eevee. The ears, the fur, the changing face—how much of your old self do you still recognize?",
                "Five stages down. You're becoming something adorable, and I know that isn't necessarily comforting."
            ],
            PlayerAt8Transform: [
                "Two steps left. Almost an Eevee. Your old reflection is about to become a distant memory.",
                "Nearly there. All that fluffy fur, those ears, that tail—you're going to look nothing like you did before."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Fluffy fur and oversized ears? You're turning me into an Eevee. I am not amused.",
                "My face is changing, my ears are enormous, and I swear you are enjoying this far too much."
            ],
            AIAt5Transform: [
                "Halfway to Eevee. I can feel the fur, and these ears make it impossible to ignore the changes.",
                "Five stages. I look ridiculous, I feel different, and I'm still going to beat you."
            ],
            AIAt9Transform: [
                "One step left. Fine, I'll admit the fur is soft. You are still absolutely insufferable.",
                "All right. An Eevee. Cute, quick, and quite capable of ruining your day."
            ]
        }
    },

    Squirrel: {
        player: {
            TransformPlayer: [
                "Another step toward twitching ears, nimble paws, and that big fluffy tail. Your old silhouette is disappearing.",
                "Your body is becoming squirrel-like. I wonder how you'll feel when that tail follows every movement."
            ],
            PlayerAt5Transform: [
                "Halfway to a squirrel. Those ears and paws are changing, and your human habits are starting to look out of place.",
                "Five stages down. You are halfway to a fluffy tail and a very different reflection."
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly a squirrel, and that tail is going to be very difficult to ignore.",
                "Almost there. Your human shape is nearly gone. Better get used to those paws."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are changing, and something is happening to my tailbone. Don't you dare laugh.",
                "Paws? A fluffy tail? You're turning me into a squirrel. This is a new low."
            ],
            AIAt5Transform: [
                "Halfway to a squirrel. My balance is changing, and I can feel that tail growing behind me.",
                "Five stages. These paws are nimble, these ears twitch at everything, and I'm still furious with you."
            ],
            AIAt9Transform: [
                "One step left. I'll admit the balance and agility are impressive. I'll still make you regret this.",
                "Fine. A squirrel. Quick, alert, and perfectly capable of climbing somewhere you can't follow."
            ]
        }
    },

    Robot: {
        player: {
            TransformPlayer: [
                "Another step toward metal, machinery, and a body that answers to a very different set of rules.",
                "Your body is becoming mechanical. I wonder how long before you stop recognizing your own movements."
            ],
            PlayerAt5Transform: [
                "Halfway to a robot. Your human body is being replaced piece by piece, and you can feel every change.",
                "Five stages down. Metal where there was flesh, mechanisms where there were muscles. Still feel in control?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon your reflection will be all machine, and your old body will be gone.",
                "Nearly a robot. Imagine looking down and realizing that almost nothing about your body is organic anymore."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Metal? Machinery? What have you done to my body? I'll dismantle whatever plan you have next.",
                "My limbs feel mechanical. You're turning me into a machine, and I am not going quietly."
            ],
            AIAt5Transform: [
                "Halfway to a robot. My movements feel different, and I can feel mechanisms replacing what used to be natural.",
                "Five stages. I am becoming metal and machinery, and I refuse to let you reduce me to a device."
            ],
            AIAt9Transform: [
                "One step left. If I'm becoming a machine, then I'll make this new body work for me.",
                "Fine. Let the transformation finish. A machine can be precise, relentless, and very difficult to stop."
            ]
        }
    },

    Doll: {
        player: {
            TransformPlayer: [
                "Another step toward a polished face, carefully crafted features, and a body that looks made rather than born.",
                "Your skin and features are changing. Soon you'll look like a doll somebody else designed."
            ],
            PlayerAt5Transform: [
                "Halfway to a doll. Your face is becoming smoother, your movements feel different, and your old appearance is fading.",
                "Five stages down. You're being remade into something that looks carefully crafted. How does that feel?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon that doll-like face will be unmistakably yours.",
                "Almost a doll. Your old reflection is nearly gone, replaced with something polished and unfamiliar."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My skin feels different. You're turning me into a doll? You will regret this.",
                "My features are changing, and my movements feel strange. I refuse to become a toy for your amusement."
            ],
            AIAt5Transform: [
                "Halfway to a doll. My face is changing, and every movement feels unfamiliar. I hate that you can see it.",
                "Five stages. I can feel myself becoming something crafted, something carefully made. This is unnerving."
            ],
            AIAt9Transform: [
                "One step left. If I'm going to look like a doll, I'll be the one deciding what expression I wear.",
                "Fine. Let the finish settle. A doll can still be dangerous, and I intend to prove it."
            ]
        }
    },

    Dragon: {
        player: {
            TransformPlayer: [
                "Another step toward scales, claws, horns, and a shape far more formidable than your old one.",
                "Your body is growing draconic. I wonder whether you'll recognize the creature staring back at you."
            ],
            PlayerAt5Transform: [
                "Halfway to a dragon. Those scales and claws aren't decoration; they're signs of how thoroughly you're changing.",
                "Five stages down. Your old body is losing ground to something ancient, powerful, and decidedly less human."
            ],
            PlayerAt8Transform: [
                "Two steps left. Soon the mirror will show a dragon, not the person who started this match.",
                "Nearly a dragon. Those horns and scales are almost complete. You'd better get used to the new silhouette."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "Scales? Claws? You're turning me into a dragon. You may have just made a spectacular mistake.",
                "My body is growing heavier, my features are changing. If I get wings, you'd better start running."
            ],
            AIAt5Transform: [
                "Halfway to a dragon. I can feel the scales, the claws, the power building in this body. You should be worried.",
                "Five stages. My face is changing, my body is growing formidable, and I'm beginning to see the advantages."
            ],
            AIAt9Transform: [
                "One step left. I can feel the power in this form. If you finish the job, you may not like what you've created.",
                "Fine. A dragon. Let the transformation finish. I intend to make this body legendary—and you very sorry."
            ]
        }
    },

    Bat: {
        player: {
            TransformPlayer: [
                "Another step toward oversized ears, leathery wings, and a silhouette that won't pass for human.",
                "Your body is becoming bat-like. I wonder how you'll feel when those wings start to feel like your own."
            ],
            PlayerAt5Transform: [
                "Halfway to a bat. Your ears and body are changing, and your old shape is getting harder to recognize.",
                "Five stages down. Imagine those wings unfolding where your arms used to be. Still feeling confident?"
            ],
            PlayerAt8Transform: [
                "Two steps left. Nearly a bat, with wings and ears that make your new form impossible to mistake.",
                "Almost there. Your human silhouette is nearly gone. Better prepare for the mirror."
            ]
        },
        cpu: {
            AIGetsTransformed: [
                "My ears are changing—and are those wings? You have a lot of nerve doing this to me.",
                "My body feels different, and something is growing from my back. I am going to remember every second of this."
            ],
            AIAt5Transform: [
                "Halfway to a bat. My hearing is changing, and these wings are making my balance completely unfamiliar.",
                "Five stages. My body is changing in ways I never asked for. Stop looking so pleased with yourself."
            ],
            AIAt9Transform: [
                "One step left. The wings are impressive, I'll grant you that. Now let's see if you can handle what I've become.",
                "Fine. A bat. Sharp senses, wings, and a very good memory for the person responsible."
            ]
        }
    }
};


const CPU_VICTORY_TAUNTS = {
    // These lines depend on what the HUMAN player became.
    transformation: {
        Statue: [
            "A statue. Beautifully permanent, isn't it? I hope you enjoy being admired from a distance.",
            "Look at you… cold, hard, and perfectly posed for me. I think I’ll keep you just like this.",
			"No more struggling. No more running. Just beautiful, silent stone waiting for my hands.",
			"I turned you into something exquisite… and completely helpless. How does it feel to be on display for me?",
			"You’re still warm in places, but you can’t move a muscle. Perfect. Stay exactly where I put you.",
			"A living statue on display that can still feel everything I do to it… I chose well when I made you mine."
        ],
        Cow_female: [
            "A cow. I wonder how long it'll take before you stop expecting that reflection to change back.",
            "Look at you. Hooves, horns, and a whole new life. You were so certain I couldn't do this.",
			"Such impressive udders. I bet you can't wait to be milked.",
			"Look at those full, heavy udders… I made them just for me. Time to start milking my new cow.",
			"You used to talk back. Now you just moo and present those teats. Good girl.",
			"All that pride, reduced to soft, dripping livestock. I’m going to enjoy every drop.",
			"On all fours where you belong. Those new udders aren’t going to empty themselves.",
        ],
        Cow_male: [
            "A bull. Quite the imposing figure. Pity you couldn't put up a fight when it mattered.",
            "Well, look at those horns. You wanted to challenge me; now you're built for a very different pasture.",
			"Look at my new bull… strong, heavy, and already panting for me. I think I’ll keep him tightly collared.",
			"All that power, and now it’s mine to direct. On your knees, bull.",
			"I gave you those horns and that body… and I decide when and how they’re used.",
			"You used to be human. Now you’re just a big, virile animal waiting for my command.",
        ],
        Cat: [
            "A cat. All those sharp remarks, and now you've got whiskers to go with them.",
            "Look at those ears and that tail. I do hope you weren't too attached to looking human.",
			"There’s my pretty little cat… soft, purring, and already presenting. Come here.",
			"I took your claws and your pride. All that’s left is a needy little pet for me to stroke.",
			"Tail up, back arched… just how I like my cats. Stay like that.",
			"You used to hunt. Now you’re the one getting caught and played with."
        ],
        Dog: [
            "A dog. I wonder if you'll recognize the person you used to be beneath all that fur.",
            "Floppy ears, paws, a muzzle. Quite a transformation. And you thought you could defeat me.",
			"Sit. Stay. Good dog. Look at you, already so eager to please your new owner.",
			"I took everything that made you human and left a panting, obedient pet. Perfect.",
			"Belly up, tongue out… just how a good dog should greet its master.",
			"You used to give orders. Now you wait for them. Heel."
        ],
        Werewolf: [
            "A werewolf. All those fangs and claws, and you still couldn't get your hands on a win.",
            "Look at yourself. Something fierce, something wild—and still thoroughly beaten.",
			"Look at my new pet wolf… all that feral strength, and it’s on its back for me.",
			"I gave you the beast, and I decide when it gets to hunt… or get hunted.",
			"Moon’s high, and my werewolf is already baring {HUM_HIS} throat. Good.",
			"You used to be human. Now you’re a powerful animal that only answers to me.",
			"My personal werewolf. Claws, fangs, and complete submission under the full moon."
        ],
        Fox: [
            "A fox. Clever, quick, and supposedly difficult to fool. So much for that reputation.",
            "Those ears and that tail suit you. Perhaps next time you'll use that famous cunning a little better.",
			"There’s my clever little fox… bushy tail twitching and already presenting. Come here.",
			"All that cunning, and I still caught you. Now you’re just a soft, sly pet for me.",
			"I took your freedom and left you with a beautiful coat and a very needy body.",
			"You used to outfox everyone. Now you’re the one getting played with.",
        ],
        Horse: [
            "A horse. Strong legs, powerful frame, and absolutely nowhere to run from this result.",
            "Quite the equine transformation. I hope you enjoy your new proportions as much as I enjoy winning.",
			"Let me get a saddle and bridle so I can ride you like I did in this match.",
			"Look at my new horse… strong, powerful, and already broken to the saddle. Easy now.",
			"I gave you those legs and that body… and I decide who gets to ride.",
			"You used to run free. Now you stand still and wait for the bit. Good.",
			"My personal mount. Strong flanks, eager body, and completely trained."
        ],
        Pig: [
            "A pig. I imagine that mirror is going to take some getting used to.",
            "There you are. A snout, floppy ears, and a loss you won't be able to blame on bad luck.",
			"A dirty, ugly, grunting pig. And that was before I transformed you!",
			"Look at my new pig… soft, heavy, and already rolling over for me. Good.",
			"I took all that pride and left a fat, needy animal that only oinks for {HUM_HIS} owner.",
			"On your back in the mud where you belong. I’m going to enjoy every soft inch.",
			"You used to be human. Now you’re just warm, hungry livestock."
        ],
        Gender_male: [
            "A woman now. Take a good look at that reflection—you won't be able to argue with it.",
            "So soft and sexy now. I'm sure you will make a nice trophy for someone.",
			"Look at you… soft new curves, open and ready. I made you into the perfect woman for me.",
			"All that male pride, reduced to wet, needy femininity. How does it feel?",
			"I took everything that made you a man and left something warm, soft, and completely mine.",
			"Those new breasts, that new heat between your legs… all for me to enjoy.",
			"My personal transformation project. A former man who now only knows how to take it."
        ],
        Gender_female: [
            "A man now. I wonder what you'll think when that new reflection finally feels familiar.",
            "Look at you. A completely different silhouette, a different face—and the same thoroughly defeated opponent.",
			"Look at you… hard, heavy, and already aching for me. I made you into the perfect man.",
			"All that feminine softness, replaced with something strong and needy. How does it feel?",
			"I took everything that made you a woman and left a hard, eager body that only answers to me.",
			"That new strength, that new heat… all mine to direct and enjoy."
        ],
        Puppet: [
            "A puppet. All that effort to stay in control, and now you're the one who's been remade.",
            "Look at those joints. A body crafted into a new shape, with your defeat as the finishing touch.",
			"Look at my new puppet… strings firmly in my hands and already so obedient.",
			"I decide how you move, what you say, and what happens to that pretty body.",
			"No more free will. Just a beautiful toy that performs exactly as I command."
        ],
		Mannequin: [
            "A mannequin. All that effort to stay in control, and now you're the one who's been remade to pose for me -- permanently.",
            "Look at you. A body crafted into a new frozen shape, with your defeat as the finishing touch.",
			"Look at my new mannequin… I can pose you any way I want. You are so obedient.",
			"I decide how you move, how you dress, and what happens to that pretty body.",
			"No more free will. Just a beautiful frozen image posed exactly as I command."
        ],
        Bunny: [
            "A bunny. Those long ears are going to make it awfully difficult to pretend this never happened.",
            "All that stubbornness, and now look at you. Fluffy, long-eared, and made for breeding. Better get started!",
			"There’s my soft little bunny… tail up and already presenting. Come here.",
			"I took your freedom and left a warm, fertile pet that only hops when I say.",
			"My personal bunny. Soft, eager, and ready to be bred whenever I want."
        ],
        Otter: [
            "An otter. Sleek fur and nimble paws. I almost feel bad for how thoroughly I've outplayed you.",
            "Well, now you could probably out swim me. As for this battle? Never.",
			"Look at my sleek little otter… wet, flexible, and already on {HUM_HIS} back for me.",
			"Those whiskers are twitching so nicely. Stay still while I enjoy my new pet.",
			"You used to swim free. Now you float right where I put you.",
			"My personal otter. Soft, slippery, and completely mine to play with."
        ],
        Eevee: [
            "An Eevee. All that fluff and those enormous ears. You really are a long way from your old self.",
            "Look at you—adorable, unmistakably transformed, and still on the losing side.",
			"There’s my soft little Eevee… big eyes and already so ready to please. Come here.",
			"I decide what you evolve into… or if you stay just like this for me to enjoy.",
			"Those soft ears and that fluffy tail… all mine to stroke and claim.",
			"You used to adapt to survive. Now you adapt to whatever I want from you."
        ],
        Squirrel: [
            "A squirrel. That tail is going to be hard to ignore, especially when you remember who made it happen.",
            "All that energy, all those nimble paws—and you still couldn't scamper your way out of defeat.",
			"Look at my little squirrel… bushy tail up and already so eager. Come here.",
			"I took your trees and left a soft, twitching pet that only gathers what I give it.",
			"That fluffy tail and those quick little hands… all mine now."
        ],
        Robot: [
            "A robot. Perhaps you can calculate exactly where you went wrong while you get used to that metal body.",
            "Mechanical limbs, a new silhouette, and a decisive loss. I do appreciate an efficient result.",
			"I rewrote every protocol. You exist to serve, obey, and take whatever I give you.",
			"You used to have free will. Now you have only my commands."
        ],
        Doll: [
            "A doll. Such carefully crafted features. I think I'll enjoy watching you get used to your new reflection.",
            "You've been remade into something polished and unfamiliar. Consider the defeat your finishing touch.",
			"I decide how you’re posed, what you wear, and what happens to that pretty body.",
			"No more will of your own. Just a lovely toy that exists for my pleasure.",
			"My personal doll. Fragile, beautiful, and completely under my control."
        ],
        Dragon: [
            "A dragon. Scales, claws, all that intimidating power—and still not enough to beat me.",
            "What a magnificent creature you've become. Shame the mighty dragon couldn't manage a victory.",
			"I gave you all that power and fire… and I decide when it’s used.",
			"Those claws and fangs are impressive… but they only move when I allow it.",
			"My personal dragon. Powerful, beautiful, and completely tamed."
        ],
        Bat: [
            "A bat. Those wings might help you leave, but they won't help you escape this result.",
            "Look at those ears and wings. You've become something extraordinary—and lost to me all the same."
        ]
    },

    // These lines depend on the CPU CHARACTER'S personality.
    character: {
        Mark: [
            "Look into my eyes, {HUMAN}. That’s it… feel your will leaking out of you like warm honey. You’re already mine.",
			"By the time I finish counting you’ll be on your knees, mouth open, mind empty… and grateful for it.",
			"I’m going to plant suggestions so deep you’ll beg for things you never knew you wanted. And you’ll thank me.",
			"Sleep. When you wake, the only thing left in that pretty head will be how good it feels to be used by me.",
			"I’ve got you so far under you won’t even notice when I start breaking you in. Delicious, isn’t it?"
        ],
        Fable: [
            "And that's the lesson for today: actions have consequences. I'm afraid your final grade is a rather decisive F.",
            "Class dismissed! Today's homework is to get used to your new form. Extra credit if you can admit I outplayed you.",
			"Detention starts now, {HUMAN}. Hands on the desk, legs spread… and not a single word unless I ask.",
			"You’ve been a filthy, disobedient little student. Now you are a {HUMTRANS} - a form much more suited to obeying.",
			"{HUMGEN||Skirt up. }Pants down. This is what happens when you forget who owns the classroom… and your body.",
			"Good students take what they’re given. You’re going to take everything I decide to shove into that lesson plan."
        ],
        Roz: [
            "I won! I actually won! And you look SO different! Is it rude to stare? Because I'm definitely staring.",
            "Okay, wow! You're really transformed into a {HUMTRANS}! And I beat you! I should probably be more intimidating right now, huh?",
			"Wait, so since I won I get to touch and tease wherever I want for as long as I want? Yay! You’re so warm…",
			"I totally spaced on the rules but I think this means you’re my new toy. Don’t move while I experiment, kay?",
			"Aww you’re already squirming and leaking… is that because I’m winning or because of where my fingers are? Both? Perfect~"
        ],
        Zixuan: [
            "Result recorded: opponent defeated, transformation completed. The experiment was successful. Your objections are noted and irrelevant.",
            "Fascinating. Your {HUMTRANS} form differs from your original baseline, and my win rate remains excellent. What a productive match.",
			"Subject secured. Beginning prolonged stimulation trials… note how prettily {HUM_HE} breaks.",
			"Fascinating. Let’s increase the dosage until {HUM_HE} can’t form words, only desperate little sounds.",
			"You’re my masterpiece, {HUMAN}. I’ve never had a {HUMTRANS} to play with before.",
			"Lie still. Every twitch, every sob, every involuntary clench is data… and I intend to collect hours of it.",
			"Science demands thorough testing. Hold that position, {HUMAN}, while I examine every sensitive, trembling inch… repeatedly."
        ],
        Hyeri: [
            "Breathe in, and accept the result. Your old form has passed, your resistance has quieted, and you are now a {HUMTRANS} forever more.",
            "You fought so hard to hold on. Now settle into this new shape, and let the lesson become part of you.",
			"The spirits… they’ve abandoned me. I’m open, grounded, and completely at your mercy now, {HUMAN}.",
			"I used to channel the earth’s energy. Now all I can channel is {HUMGEN|how badly I need you inside me.|how open I am for you.}",
			"My crystals are scattered… my focus is gone. Take this vessel and use it however the moment demands.",
			"I can still feel the universe… and right now it’s telling me to submit {HUMGEN|and be filled by you.|completely.}"
        ],
        Tex: [
            "Well, {HUMGEN|partner|darlin'}, looks like I came out on top. You can admire your new shape in the mirror while I enjoy the victory.",
            "Reckon that's the end of the trail for you. New body, lost match, and no amount of grumbling's gonna change either one.",
			"I lassoed you fair and square. Now stay still while I break you in slow…",
			"You’re on my land, under my saddle, and I’m gonna {HUMGEN|use you all day, every day|ride you till you forget your name.}",
			"Quit squirmin’ like that unless you want it rougher. A good mount learns to take what the cowboy gives.",
			"You’re mine now, {HUMAN}. Boots on or off… either way {HUMGEN|You will submit completely.|I’m claimin’ every hole and makin’ sure you feel it.}"
        ],
		Siobhán: [
			"Oh, darling… you really should’ve known better than to play cat-and-mouse with me.",
			"I do hope you enjoyed the view on the way down. {HUMTRANS|Most men never get this close to the real pussy.|Most women are scared of this pussy.}",
			"You fought like a lion… and still got stroked into submission by a mere kitty. How deliciously ironic.",
			"Feel those soft paws holding you down? That’s ownership, {HUMAN}… and I’m just getting started.",
			"Sweet dreams, little mouse. And if you wake up aching… just remember who left her mark all over you."
		],
		Luci: [
		  "On your knees. Eyes down. You exist to please me now little {HUMTRANS}, and I intend to take my time enjoying it.",
		  "Look at you… a trembling {HUMTRANS}. I’m going to break you down piece by piece until all that’s left is obedience.",
		  "You thought you had a chance. Now you’re going to learn exactly how long I can make suffering last.",
		  "Every sound you make belongs to me. Every drop, every sob, every desperate little plea.",
		  "Now that you are {AAN} {HUMTRANS}, I’m going to ruin you so thoroughly you’ll forget you ever had a will of your own."
		],
		Xander: [
			"Look into my eyes, little mortal. Feel your will unravel while my tail coils tighter around what’s mine.",
			"I’m going to feed on every drop of resistance you have left… and make you thank me for the privilege.",
			"Your body already knows who it belongs to. My tail is just here to remind the rest of you.",
			"Struggle if it helps you feel brave. It only makes the eventual surrender sweeter for me.",
			"I’m going to break you so thoroughly the only thoughts left will be how good it feels to serve me."
		],
		Alex: [
			"Wait… I actually won? Okay um… stay right there while I figure out what a winner is supposed to do.",
			"I didn’t expect this. You’re looking at me like that and I… I think I kind of like it?",
			"So since I won I get to decide things? Don’t move. I’m still being nice… mostly.",
			"This is new. You’re all mine right now and I’m trying very hard not to get carried away.",
			"I keep thinking I should apologize but… you lost. So maybe I don’t have to be sorry for what happens next."
		],
		Ivy: [
			"Look at that. Another win for someone who actually knows how to put a complete sentence together. You might not be able to do that anymore yourself.",
			"You’re done. And before you start whining, it’s ‘you’re,’ not ‘your.’ Now be a good loser and present properly.",
			"I win. Again. Try not to look so surprised—I’ve been juggling twelve projects and still had time to dismantle you.",
			"That’s the sound of you losing to someone who knows what she is doing. Admire the efficiency.",
			"Victory is mine. You’re going to stay as a {HUMTRANS} while I decide which of my prototypes to test on you first.",
			"I told you competition was my love language. Consider yourself thoroughly spoken to… and thoroughly transformed."
		]
    }
};

const CPU_DEFEAT_SUBMISSIONS = {
    transformation: {
        Statue: [
            "I’m cold… hard… and completely at your mercy. Pose me however you like.",
			"Stone doesn’t struggle. It just stands there… waiting to be touched, admired… used.",
			"You’ve turned me into something beautiful and helpless. Go on—run your hands over every inch.",
			"I can’t move… can barely even speak. All I can do is stand here and take whatever you give me.",
			"Marble flesh doesn’t resist. It simply yields… perfectly still for you."
        ],
        Cow: [
            "Moo... oh, come on. I can't believe you've turned me into a cow. Fine, I surrender.",
            "Moo… my udders are so full. Please… milk me. I can’t do it myself anymore.",
			"I’ve been reduced to this—heavy, soft, and dripping. Use me however a cow is meant to be used.",
			"I used to walk on two legs. Now I just stand here on all fours, waiting for your hands.",
			"These teats ache… and so does everything else. Take what you want from this body."
        ],
        Cow_male: [
            "Moo! All right, all right! You've turned me into a bull. I surrender!",
            "I used to be human. Now I’m just a heavy, panting animal on my knees for you.",
			"These horns… this body… and still I lost. Do whatever you want with the bull you’ve broken.",
			"I’m strong enough to mount anything… yet here I am, waiting for you to decide my place.",
			"My body is built for one thing. And right now that thing is submitting to you.",
        ],
        Cat: [
            "Okay, you've made your point. I'm a cat, you've won, and I'm done fighting you. Meow.",
            "I can't believe I'm purring... Fine, you win. Just don't expect me to admit this was dignified.",
			"The claws are gone… the fight is gone. All that’s left is a soft, purring thing under your hands.",
			"I used to hunt. Now I just arch and present, hoping you’ll take what’s offered.",
			"My tail’s in the air and my pride is somewhere on the floor. Use this cat however you like.",
			"I lost… and somehow that just makes me want to rub against you harder.",
        ],
        Dog: [
            "All right! I give up! You win! ...Why am I wagging my tail? This is humiliating.",
			"I’m on my back, belly up, tail tucked. Do whatever you want with this good dog.",
			"I used to give orders. Now I just wait for yours… tongue out and ready.",
			"The collar’s not even on yet and I’m already yours. Command me.",
			"I lost the fight and somehow that only made me more eager to please."
        ],
        Werewolf: [
            "The fight's over. I can feel the change taking hold... You win. Oooooooooooooo.",
            "The beast is on {HUM_HIS} back… belly exposed, throat bared. Take what you want from me.",
			"I can still feel the moon in my blood, but right now all I feel is you on top of me.",
			"Claws, fangs, fur… and still I lost. Do what a victor does with a defeated animal.",
			"I’m growling, but it’s not a threat anymore. It’s a plea.",
        ],
        Fox: [
            "Well, that was clever. You outfoxed me, and now I'm the fox. I surrender.",
            "I had a dozen tricks left, and none of them worked. You win. I'll stop trying to wriggle out of this.",
			"My bushy tail is twitching and my pride is gone. Use this soft, sly body.",
			"I tried to run. You caught me. Now do what hunters do with foxes.",
			"I’m yours… soft fur, sharp little teeth, and a body that knows it’s been beaten."
        ],
        Horse: [
            "All right, you win. I'm a horse now. I suppose there's no point in trying to gallop away.",
            "I can't believe you've done this. Fine, I surrender. Just... please don't make me say neigh.",
			"I’m on my knees, head down, completely broken to the saddle. Ride me if you want.",
			"Strong legs, powerful body… and still I lost. Mount your prize.",
			"I used to run free. Now I just stand here waiting for the bit and the rider.",
			"You’ve broken the stallion/mare. Take what’s yours.",
        ],
        Pig: [
            "Oink... I give up. You've beaten me, and I'm not going to make a bigger mess of this.",
            "You've won. I'm a pig, I'm defeated, and I'm officially done squealing about it.",
			"I used to be proud. Now I just oink and present for whoever wants me.",
			"Fat, soft, and already dripping. Take what a pig is good for.",
			"I’ve lost everything but the need to be used. Please… use me.",
        ],
        Gender: [
            "Okay, I surrender. You've changed me completely, and I don't have a comeback for that.",
            "I can't believe this is really happening... You've won. I'll stop fighting the transformation."
        ],
        Gender_male: [
            "All right, I give up! You've turned me into a woman, and you've won. Can we please call it there?",
            "I was trying so hard to keep control. Now I'm a woman, you've beaten me, and... fine. I surrender.",
			"I used to be a man… now I’m soft, open, and completely at your mercy.",
			"These new curves, this new heat… and I still lost. This body wants things and I can't resist you anymore.",
			"I never knew how good it could feel to be the one on the bottom until now.",
        ],
        Gender_female: [
            "Okay, you've won. I'm a man now, and I'm done pretending I can turn this around.",
            "I never expected to end up like this. You've beaten me, and I surrender. No more resistance.",
			"I used to be a woman… now I’m hard, heavy, and on my knees for you.",
			"This new body is strong… and still I lost. Take what you want from it.",
			"I never knew how good it could feel to be the one submitting until this moment.",
        ],
        Puppet: [
            "I can't keep pulling against the strings. You win. I'll stop struggling and accept that you've beaten me.",
            "All right... you've got control, and I've lost. I surrender. Just don't make me dance while I say it.",
			"My strings are cut… or maybe they’re in your hands now. Move me however you like.",
			"I can’t resist. I can’t even close my mouth unless you let me. Play with your puppet.",
			"I’m limp, open, and completely controlled. Pose me. Play with me. Claim me.",
			"Whatever you want this body to do… it will. Just pull the right string.",
			"I’m not a person anymore. I’m a toy that knows it’s been beaten… and loves it."
        ],
		Mannequin: [
            "I can't move. You win. I'll stop struggling and accept that you've beaten me.",
            "All right... you've got control, and I've lost. I surrender. Just don't make me pose in any embarrassing ways.",
			"My legs are locked… or maybe they’re in your hands now. Move me however you like.",
			"I can’t resist. I can’t even open my mouth anymore. Pose me as you like.",
			"I’m solid, open, and completely controlled. Pose me. Play with me. Claim me.",
			"Whatever you want this body to do… it will. Just move me in the right position.",
			"I’m not a person anymore. I’m a mannequin that knows it’s been beaten… and loves it."
        ],
        Bunny: [
            "Okay, okay! I give up! You've beaten me, and I'm apparently the most defeated bunny in history.",
            "You win. I'm a bunny, I'm out of tricks, and I'm done hopping around the issue.",
			"I’m soft, twitching, and completely caught. Breed your bunny if you want… I won’t stop you.",
			"My tail’s up and my fight is gone. Use this warm, fluffy body however you like.",
			"I used to hop away. Now I just present and wait.",
        ],
        Otter: [
            "All right, you win. I'm out of ways to slip away from this, so I surrender.",
            "I’m sleek, wet, and completely at your mercy. Play with your otter however you like.",
			"I used to swim free. Now I’m just floating here, waiting for you to take me.",
			"Soft fur, flexible body, and no more fight left.",
			"These whiskers are twitching and my belly is up. Claim your prize.",
			"I’m an otter now… playful, slippery, and yours."
        ],
        Eevee: [
            "I surrender! You've beaten me before I could find a way out of this. I guess this is my new beginning.",
            "Okay, you win. No clever evolution is getting me out of this one. I give up.",
			"I’m soft, adaptable, and completely caught. Evolve me however you want… or just use me as I am.",
			"My ears are down and my tail is tucked. Take what you want from this little body.",
			"I can become almost anything… but right now all I want is to submit to you.",
			"These big eyes are watching you decide what to do with me. Please… decide soon.",
        ],
        Squirrel: [
            "Fine! I surrender! I've run out of escape routes, and I'm not going to keep scrambling.",
            "You win. I'm a squirrel, I'm cornered, and I'm officially out of nuts—I mean, options.",
			"I’m a squirrel now… small, soft, and ready to be claimed."
        ],
        Robot: [
            "Submission acknowledged. Resistance has failed. You are the winner. I will cease combat.",
            "System status: defeated. Transformation complete. Further resistance is inefficient. I surrender.",
			"I was built for efficiency. Now I’m built for whatever you want to do to me.",
			"My chassis is open, my circuits are humming, and I can no longer refuse.",
			"Program me. Overwrite every command with your own.",
			"I am a machine that has been defeated… and is ready to obey."
        ],
        Doll: [
            "All right, I give up. You've beaten me, and now I'm a doll. I don't think I can make this sound dignified.",
            "I surrender. You've won, and I'm stuck looking like a doll. Please tell me this match isn't being recorded.",
			"My joints only move when you move them. My mouth only opens when you want it to.",
			"I used to have a will. Now I just wait to be dressed, undressed, and taken.",
			"Pretty, fragile, and entirely yours.",
			"I’m not a person anymore. I’m a toy that knows it’s been broken in… and loves it."
        ],
        Dragon: [
            "Even a dragon has to know when it's beaten. You win. I'll stop fighting.",
            "I thought I could overwhelm you. Instead, I've lost, and now I'm a dragon with nothing left to prove. I surrender.",
			"These claws, these fangs… all useless now. I’m yours to claim.",
			"A dragon submits only once. Make it count."
        ],
        Bat: [
            "Fine, you win. I'm a bat, I'm defeated, and I'm done trying to fly out of this situation.",
            "You've beaten me. I surrender... and I refuse to make a single bat pun about it.",
			"These sharp little teeth aren’t for biting anymore… unless you want them to be.",
        ]
    },

    character: {
        Mark: [
            "I… I can’t look away. You’ve dropped me so deep I don’t even want to fight… please keep talking, {HUMAN}.",
			"My eyes are so heavy… and so is everything else. You’ve got the me dangling on every filthy word.",
			"I used to put people under. Now I’m the one sinking for you… deeper… opener… yours.",
			"Whatever you say next I’ll obey. I’m a good {CPUTRANS}. I always obey.",
			"You’ve hypnotized the hypnotist. Take what you want… I’m too far gone to stop you."
        ],
        Fable: [
            "I concede! Clearly, I have been outplayed, outmaneuvered, and thoroughly taught a lesson. I shall be revising my strategy.",
            "All right, all right, you win. Consider this my formal admission that your performance exceeded expectations. Don't get used to the praise.",
			"I’ve been a very bad teacher… please, I’ll take any punishment you give me. Extra credit included.",
			"My ruler’s gone and so is my authority. Put me over the desk… or in the corner… wherever you want.",
			"I used to hand out detentions. Now I’m the one staying after… and I think I need a thorough correction.",
			"Yes… I’ll be quiet and take it. I’ve clearly forgotten how to behave for someone like you.",
			"I’m not sure I will ever get used to being this changed. You will have to train me to be a good {CPUTRANS}. I’m an excellent student."
        ],
        Roz: [
            "Oh wow, you actually beat me! Okay, I surrender! I'm not even sure what to say about the transformation part!",
            "You win! I give up! This is kind of amazing and kind of embarrassing, and I'm definitely going to need a minute.",
			"Wait… I was supposed to win? Oops… I guess I’m the one on the bottom now. Um… hi, {HUMAN}?",
			"I totally forgot how to fight… and now I can’t stop blushing and squirming. Are you gonna… use that?",
			"Hehe… I think I lost. Does that mean I have to do whatever you say? Okay… I guess I will…",
			"My head’s all fuzzy and my {CPUTRANS} body’s all tingly… is this what losing feels like? It’s kinda really nice…"
        ],
        Zixuan: [
            "Outcome accepted: I have lost. Resistance is no longer productive. I concede the match and acknowledge your success.",
            "The results are unambiguous. You won, I was transformed, and my remaining objections would serve no useful purpose. I surrender.",
			"My own formula… turned against me. I’m twitching and dripping… please keep testing, {HUMAN}.",
			"I was supposed to wear the lab coat. Now I’m the {CPUTRANS} test subject… and I can’t stop moaning.",
			"The {CPUTRANS} you turned me into is making every nerve scream. Run more experiments… I need the data… and the touch.",
			"My mind is still sharp enough to know I’ve lost… and my {CPUTRANS} body is already presenting for the next trial.",
			"You’ve turned me into your favorite lab rat, or {CPUTRANS}. Continue the procedure… don’t stop."
        ],
        Hyeri: [
            "I fought to hold on, but the struggle is over. You have won. I surrender, and I'll take a breath and accept what has happened.",
            "All right. I release my resistance. You have beaten me, and I will stop fighting the outcome.",
			"The spirits… they’ve abandoned me. I’m open, grounded, and completely at your mercy now, {HUMAN}.",
			"I used to channel the earth’s energy. Now all I can channel is how badly I need you {HUMGEN|inside me|touching me}.",
			"My crystals are scattered… my focus is gone. Take this vessel and use it however the moment demands.",
			"I can still feel the universe… and right now it’s telling me to submit and be {HUMGEN|filled by you.|controlled by you.}"
        ],
        Tex: [
            "Well, {HUMGEN|partner|darlin'}, you got the better of me. I reckon it's time to tip my hat and admit defeat. You win.",
            "All right, you win this round. I'm not too proud to surrender when the trail runs out. Just don't expect me to stop giving you grief about it.",
			"Well I’ll be… looks like this cowboy’s been thrown, hog-tied, and claimed. Do with me as you please, {HUMAN}.",
			"I came in swinging and ended up on my back with my legs open. Guess the saddle’s on the other horse now…",
			"Y’all got me good. I’m all yours, {HUMGEN|sir|ma’am}… boots, belt, and everything in between that still works.",
			"Never thought I’d be the one gettin’ broken in and used… but here I am, ready for whatever you got."
        ],
		Siobhán: [
			"You've got me pinned, darling… claws and all. I suppose even the fiercest pussy sometimes has to yield.",
			"Do be gentle with your conquered little pet… or don't.",
			"Alright, darling… the pussy’s yours. You’ve earned every soft, trembling inch of her.",
			"Such firm hands… holding me down like I belong here. I almost hate how good it feels to lose to you.",
			"You’ve tamed the wild thing, haven’t you? Just don’t expect her not to arch a little when you take your prize.",
			"The claws are gone… the fight is gone. All that’s left is a soft, purring kitty under your hands, {HUMAN}.",
			"I used to hunt. Now I just arch and present, hoping you’ll take what’s offered… thoroughly.",
			"I lost… and somehow that just makes me want to rub against you and get claimed even harder."
		],
		Luci: [
		  "I… I’ve lost control. Please… take the reins. I’ll be good for you now.",
		  "All that dominance… and here I am on my knees. Use me however you want, {HUMAN}.",
		  "I used to give the orders. Now I’m the one waiting for them… aching for them.",
		  "You’ve broken me. I’m open and completely at your mercy.",
		  "Go on… claim what’s left of my authority. I won’t fight you anymore."
		],
		Xander: [
			"My tail… my power… both useless now. You’ve got a {CPUTRANS} on his knees, {HUMAN}. Take what you want.",
			"I came to feed and instead I’m the one being drained. Don’t stop… I can take it.",
			"Hypnotic eyes, wicked tail… and still I lost. Claim your {CPUTRANS} properly.",
			"All that seductive strength reduced to this. I submit.",
			"You’ve broken something ancient. I’m open, aching, and completely at your mercy."
		],
		Alex: [
			"Oh… wow. I really thought I was doing okay. I guess I’m the one on the bottom now… um, hi?",
			"I didn’t mean for it to go this far. But if you want to keep going I… I won’t stop you.",
			"This is so embarrassing. I was trying to be nice and now I’m a {CPUTRANS}.",
			"Okay… you win. Just… be a little gentle? Or don’t. I think I’m past caring.",
			"I have no idea what you did to me. Please don’t make fun of me too much while you… finish this."
		],
		Ivy: [
			"Congratulations. You actually managed to turn me into a {CPUTRANS}. I’ll be filing this under ‘statistical anomaly’ and never speaking of it again.",
			"Ugh. Fine. You win. Try not to gloat too loudly—some of us still have standards about sportsmanship… and grammar.",
			"I lost. To you. I’m going to need a very long shower and possibly a memory wipe. Do try to look less smug about it.",
			"Well played. I’ll admit defeat this once. Just don’t expect me to start calling you ‘{HUMGEN|master|mistress}’ without the proper apostrophe.",
			"You beat me. I’m impressed. And slightly nauseated. Mostly nauseated. Hand me my dignity back when you’re done stepping on it.",
			"Alright, you win. I’ll be over here recalibrating my expectations of the universe. {AAN} {CPUTRANS} of all things. Ugh."
		]
    }
};



const CHALLENGE_TAUNTS = {
    TransformPlayer: ["There you go. One more step away from who you were.", "Feel that shift? I barely had to try.", "Your old shape is already starting to feel like a memory.","There you go… another piece of the old you slipping away under my hands.","Feel that shift? Your body is learning its new shape faster than your mind can argue.","You’re starting to look like you belong to someone. Good."],
    AIGetsTransformed: ["Hey! That wasn't part of my plan!", "Careful. I can still turn this around… and when I do, you’ll feel it.", "Enjoy that little victory while it lasts. Bodies remember who pushed them."],
    PlayerIsObedient: ["Good. You followed the track exactly where I wanted.", "That was almost effortless. Thank you for cooperating.", "A little suggestion, and you simply obey.","A little pressure and you simply… yield. I like that."],
    AIIsObedient: ["I... did not mean to do that.", "A temporary lapse. Don't get comfortable.", "You got lucky. I won't make that mistake twice."],
    BigRollAI: ["Six dice, and the odds still adore me.", "Did you see that roll? Try keeping up.", "Now THAT is how you make the dice behave."],
    PlayerAt5Transform: ["Halfway there. Starting to recognize yourself less?", "Five stages down. You can still pretend you're in control.", "You're changing faster than you can deny it."],
    PlayerAt8Transform: ["Eight stages. This is where the panic usually starts.", "Almost finished. Try to enjoy the last few moments of the old you.", "Two more steps and you’ll be mine to reshape completely."],
    AIAt5Transform: ["Halfway transformed? Fine. I'm still in this.", "Five stages? That's a setback, not a defeat.", "I'm not done yet. Not even close."],
    AIAt9Transform: ["One more and I lose. I refuse to make it easy.", "Nine? No. I am NOT becoming your victory lap.", "All right, you've got my attention. Don't waste it."]
};
const CHALLENGE_RIVAL_TAUNTS = {
    Roz: {
        TransformPlayer: [
            "Whoa, you're changing! This is kind of amazing, actually. Do you think you'll get a cool tail, too?",
            "Another step! Eee! I wonder what you'll look like at the end! I hope it's something fluffy!",
            "You're changing right before my eyes! Is it rude to ask if I can take a picture? For science! And also because it’s really cute.",
            "Ooh, progress! Your old shape is getting all blurry. I hope the new one likes head-pats.",
            "Look at you go! This is like a surprise makeover where your body does whatever it wants… and I get to watch."
        ],

        AIGetsTransformed: [
            "Whoa! My ears are getting bigger! Wait, are those actual Eevee ears?! Oh my gosh, they're ADORABLE!",
            "Oh! I've got fur! Soft, fluffy fur! ...Hang on, why am I petting my own arm? This is so weird!",
            "My feet are getting all tiny and paw-shaped! How am I supposed to wear sneakers now? Actually, do Eevees even need sneakers?",
            "Eee! I think I'm growing a big fluffy tail! This is either a disaster or the best thing that's ever happened to me!",
            "Okay, plot twist! I'm turning into an Eevee! I mean, I don't know what that means for my future, but I suddenly really want a berry."
        ],

        PlayerIsObedient: [
            "Aww, you’re listening so well! Should I reward you with head-pats or more changes?",
            "See? Following instructions can feel really nice. Or weird. Usually both!",
            "Yay, teamwork! You’re doing what I say and I’m getting all warm and happy about it.",
            "Ooh, you’re being so cooperative. I wonder if this is how trainers feel when their Pokémon just… melts for them.",
            "That’s it. Just relax and go with it. That’s my strategy for everything, and look how far it’s gotten me!"
        ],

        AIIsObedient: [
            "Oops! Did I just do what you said? Huh. Weird. Kind of tingly too.",
            "My brain said 'don't do it,' but the rest of me apparently voted yes. Democracy is weird!",
            "Okay, so I may have followed your suggestion without thinking. In my defense, thinking is hard!",
            "Wait, why did I agree to that?! Oh well! I'm sure there's a perfectly good explanation. Probably. Maybe.",
            "I was going to resist that, but then I got distracted wondering if Eevees like belly rubs. What were we talking about?",
			"Wait, that wasn’t me deciding that. My body just… went along with it. Rude.",
        ],

        BigRollAI: [
            "DID YOU SEE THAT?! I'm amazing! I mean, probably! The dice definitely think so!",
            "Whoa-ho-ho! That roll was incredible! I should put a little crown on these dice!",
            "YES! Nailed it! I have no idea how I did that, so naturally I'm going to take full credit!",
            "That was SO COOL! If I could high-five the dice, I totally would. Do dice have hands?",
            "Did you see that? Even the dice want to play with me!"
        ],

        PlayerAt5Transform: [
            "Halfway there! You’re starting to look like you might actually enjoy this. Do you?",
            "Five stages down. Your old self is getting softer around the edges. Fluffy edges, maybe?",
            "You’re changing faster than you can deny it. I think that’s kind of hot. Is that allowed?",
            "Wow, you're changing so fast! It's like one of those time-lapse videos, except I can't stop watching!",
            "Halfway there! I would offer you some encouragement, but I'm not sure that would be very helpful right now. So... good luck?"
        ],

        PlayerAt8Transform: [
            "EIGHT?! Wow! You're almost done! Should I start planning the welcome party for your new self?",
            "Oh my gosh, only two stages left! This is so exciting! For me, anyway. Are you okay? You don't look okay.",
            "Eight stages! You’re running out of room to pretend this isn’t happening to you.",
            "Almost finished. Try to enjoy the last few moments of the old you… or don’t. Either works for me.",
            "Two more steps. You can practically feel the new shape waiting. Exciting, right?"
        ],

        AIAt5Transform: [
            "I’m not done yet! Even if my ears are bigger and my thoughts are fluffier.",
            "My ears are getting huge, my feet are turning into paws, and I think my tail is fluffier than my hair ever was. Is this normal? Who am I asking? I don't know any Eevees!",
            "Five stages already?! I'm half girl, half Eevee, and one hundred percent confused! But, um... the fur is actually really soft.",
            "Oh wow, my face is changing, too! I think I have a little Eevee nose! I keep trying to boop it, but I can't tell if I'm doing it right!",
            "Okay, no panicking! I'm just growing fur, paws, big ears, and a tail. Totally ordinary Tuesday stuff! ...Right?"
        ],

        AIAt9Transform: [
            "One more and I lose! I refuse to become a soft, obedient little Eevee just because you want me to!",
            "Nine stages?! No no no. I am still me. Mostly. Sort of. Help.",
            "Okay you’ve got my full attention and also my full panic. Don’t you dare finish this.",
            "Okay, I have a confession. I thought becoming an Eevee would be weird, but now I kind of love it! My paws are adorable, and my tail is AMAZING!",
            "Is it just me, or am I getting cuter by the minute? Because I just caught my reflection, and OH MY GOSH. I want to hug myself!",
            "One step left! I used to be worried about all this, but now I really want to know what it's like to be a real Eevee! Do you think I'll be able to do a little Eevee cry?",
            "You know what? I'm ready! Bring on the final stage! I want fluffy ears, a big bushy tail, and maybe a berry or two. Do Eevees like berries? I'm going to find out!"
        ]
    },
    Zixuan: {
        TransformPlayer: [
            "The conversion has advanced another stage. Your physical properties are diverging further from the original baseline.",
            "Interesting. A measurable change in your structure, accompanied by a predictable increase in resistance. The correlation is becoming quite clear.",
            "Feel that? The new shape settling in like it was always meant to. Elegant, isn’t it?",
            "You’re starting to look like a finished piece. I do enjoy watching a body learn its place.",
            "An additional stage of conversion. Fascinating how quickly a stable biological system can become something entirely different."
        ],

        AIGetsTransformed: [
            "Another stage toward becoming a rag doll. My skin feels different, almost like fabric. I need to determine whether this is a structural or merely sensory change.",
            "My joints are becoming strangely flexible, and I suspect my body is beginning to resemble a sewn construction. The implications are deeply concerning.",
            "I can feel something changing beneath my skin. If that sensation is stuffing, then the transformation is altering my internal structure as well. Remarkable—and alarming.",
            "My hands are becoming softer, and I think I can feel seams forming along my body. I would find this fascinating if I weren't the specimen.",
            "Unexpected result. My body is adopting the properties of a rag doll, and my usual methods of observation are severely compromised when the equipment is me."
        ],

        PlayerIsObedient: [
            "Compliance observed. The response is consistent with the hypothesis that resistance decreases under the appropriate conditions.",
            "You followed the suggestion. A useful demonstration of how behavioral variables can influence the transformation process.",
            "Excellent. The subject is cooperating. This should make the next phase considerably easier to observe.",
            "Good. You responded exactly as predicted. Compliance is such a clean sensation.",
            "You moved where I directed. Efficient. Attractive, even.",
            "A little pressure and you yield so neatly. I appreciate the precision."
        ],

        AIIsObedient: [
            "I followed the instruction despite my intention to resist. An interesting demonstration of the gap between conscious intent and observed behavior.",
            "Compliance recorded. I would prefer to be the researcher rather than the subject, but the data is undeniably useful.",
            "My response was inconsistent with my stated objective. I shall need to account for that variable in any subsequent analysis.",
            "I appear to have accepted the suggestion. I dislike the result, although I cannot deny that the mechanism warrants further investigation.",
            "The experimenter has become an unexpectedly cooperative subject. I would appreciate it if the experimenter could regain control of the situation."
        ],

        BigRollAI: [
            "An exceptional result. The observed outcome falls well within the favorable end of the probability distribution. I shall enjoy this while it lasts.",
            "Remarkable. Multiple favorable variables have aligned. It would be irresponsible not to exploit this opportunity.",
            "A highly efficient roll. If the remaining trials proceed at this rate, the results will exceed my initial projections.",
            "The probability of such a useful outcome was modest, but not negligible. I am pleased to see that the dice occasionally reward a sound experimental design.",
            "Excellent. The data is favorable, the hypothesis remains viable, and my opponent has just supplied another useful demonstration."
        ],

        PlayerAt5Transform: [
            "Stage five. Half of the conversion is complete, and your original physical characteristics are becoming an increasingly unreliable reference.",
            "Halfway rewritten. The old outline is still visible, but fading. Beautiful progress.",
            "Fifty percent complete. Your current condition is an interesting intermediate state, though I doubt you find it as informative as I do.",
            "Five stages down. I recommend reconsidering your strategy. The evidence suggests your original form is becoming progressively more difficult to preserve.",
            "The midpoint has been reached. I would be interested in measuring your current resistance, but I suspect the result would be rather discouraging.",
			"You’re changing faster than denial can keep up. Good."
        ],

        PlayerAt8Transform: [
            "Stage eight. Only two increments remain before the conversion reaches its terminal state. The available recovery window is becoming negligible.",
            "Eighty percent complete. Your original form is now a diminishing component of the overall system. The conclusion is approaching rapidly.",
            "The final form is almost visible. Do you feel it waiting under your skin?",
            "Almost complete. The last scraps of the previous version are becoming… decorative.",
            "The process is nearing its endpoint. I would encourage you to reconsider your position, although I suspect the relevant variables are no longer under your control.",
            "Stage eight confirmed. If this were a controlled trial, I would already be preparing the final assessment. Unfortunately for you, the experiment is still running."
        ],

        AIAt5Transform: [
            "Five stages complete. My skin is taking on the texture of fabric, and my joints feel disturbingly pliable. I am beginning to question the safety of this experiment.",
            "Halfway to becoming a rag doll. My body feels softer, and I suspect something resembling stuffing is forming beneath the surface. I would very much like to reverse these findings.",
            "The transformation has reached fifty percent. I can feel changes in my limbs and torso, as though my body is being assembled from fabric and thread. This is no longer an abstract hypothesis.",
            "My flexibility has increased beyond normal physiological limits, and I think I can feel seams along my arms. The data is compelling, but I am not enjoying being the source.",
            "Five stages. I initially regarded this as an opportunity to study an unusual phenomenon. Now I am beginning to understand why an ethics committee would insist on a willing subject."
        ],

        AIAt9Transform: [
            "Stage nine. My body is almost entirely that of a rag doll. Oddly, the softness is rather pleasant, and I find myself curious about the final result.",
            "One stage remains. My limbs bend with remarkable ease, and the fabric-like texture no longer feels entirely foreign. I may have underestimated the advantages of this form.",
            "The conversion is nearly complete. I can feel the stuffing shifting when I move, and while the sensation is peculiar, I must admit it is fascinating rather than unpleasant.",
            "Nine stages complete. I once considered the loss of my original body an unacceptable experimental outcome. Now I find myself wondering what additional properties the finished form will possess.",
            "One final stage. The seams, the softness, the unusual flexibility—all of it is becoming strangely familiar. I believe I am ready to observe the completed transformation from the inside."
        ]
    },
    Fable: {
        TransformPlayer: [
            "And that's another step! Now, class, what have we learned about the consequences of resisting a perfectly good lesson?",
            "Progress! I do hope you're paying attention. This is an excellent demonstration of how quickly things can change when you least expect them.",
            "Another step toward your new self. Don't look so worried, dear. Change can be an excellent teacher, even when the lessons are rather unconventional.",
            "Well done, {CPUNAME}. Oh, sorry, I meant well done, me! It's so easy to get distracted when one's opponent is providing such a fascinating case study.",
            "Every change is a grade, {HUMAN}. Right now you’re failing resistance and passing submission.",
			"Ooh, look at you changing. Softening. Getting a little wetter around the edges in all the best ways.",
            "Another step under. Your body is learning to flow where I push it. Slippery, isn’t it?",
			"Good. The more you change, the less you’ll remember how to talk back.",
            "You’re starting to look like something I could keep. Something that would feel good to hold."
        ],
        AIGetsTransformed: [
            "Oh, goodness! My hands are changing. I believe my fingers are becoming webbed. This is certainly not covered in the curriculum!",
            "My face feels different, and I rather suspect whiskers are coming in. I am going to need a very long staff meeting to process this.",
            "An otter. I'm becoming an otter! I teach children about the natural world, but I never expected to become part of the lesson myself.",
            "My feet feel terribly strange. If these are becoming proper otter paws, I shall have to reconsider my entire approach to footwear.",
            "Well, this is an unexpected development. I always encouraged my students to embrace new experiences, but I did rather assume I'd remain human while doing so.",
			"Keep transforming me if you want. I’ll just make the next punishment fit the new form.",
			"Hey— my shape is getting slippery and I didn’t ask for this!",
            "Okay that change felt… really good actually. Rude of you to notice."
        ],
        PlayerIsObedient: [
            "There we are, dear. Sometimes it's easier to learn when we stop arguing with the lesson and start listening.",
            "Very good! I knew you could follow instructions. Now, let's see if we can make a little more progress, shall we?",
			"Such immediate compliance… I should have broken you in sooner. Stay exactly like that.",
            "That's the spirit! There's no shame in accepting a little guidance. Even the most stubborn pupils can surprise themselves.",
            "Eyes forward, take a deep breath, and listen carefully. That's it. My, what a wonderfully attentive student you've become.",
            "Excellent cooperation! I'm afraid your homework tonight will involve a rather substantial amount of personal transformation.",
			"Mmm. You followed so nicely. I could get used to that.",
            "That was smooth. Almost like you wanted to.",
            "A little pressure and you just… give. I like watching that."
        ],
        AIIsObedient: [
            "Oh! I seem to have followed that instruction without thinking. Well, even teachers can have an off day.",
            "That was terribly unprofessional of me. I cannot very well teach a lesson about independent thinking while obeying every suggestion I hear!",
            "I know perfectly well what you're doing. So why, precisely, am I doing exactly as you say? Don't get used to it, {HUMAN}.",
            "Right. Let's take a moment, collect ourselves, and remember that I am the educator here. Although I seem to be a rather poor student today.",
            "I shall be addressing this lapse in judgment after class. Assuming, of course, that I can still find my classroom by then."
        ],
        BigRollAI: [
            "Oh, splendid! That's what I call an exemplary performance. Full marks for me!",
            "Now, class, observe carefully. This is what happens when preparation meets opportunity. Well, mostly opportunity. And a little luck.",
            "Outstanding! I would put that result on the classroom wall if I weren't so busy using it to beat you.",
			"Did you see that roll? Even chance wants to get wet with me.",
            "Well, would you look at that! I believe I've just earned myself a gold star. Perhaps two.",
            "A roll like that lets me skip straight to the advanced lesson. Legs apart."
        ],
        PlayerAt5Transform: [
            "Halfway there! Now, I know this isn't quite the learning experience you signed up for, but there's still time to turn things around.",
            "Five stages completed. I'd call that a significant milestone, though I suspect you'd prefer a different sort of achievement certificate.",
            "You’re past the easy corrections now. The remaining changes will be… intensive.",
            "Fifty percent! Not quite a passing grade if your goal was to remain unchanged, I'm afraid. You are becoming a wonderful {HUMTRANS}.",
            "Oh, my. Halfway transformed already! I do hope you're learning something from all this. Though perhaps not quite as much as I am.",
			"Halfway there. You’re starting to feel less human and more… available.",
            "Five stages down. The human you is getting harder to hold onto. Fun, right?",
            "You’re changing so easily now. Almost like you were made to be {AAN} {HUMTRANS}."
        ],
        PlayerAt8Transform: [
            "Eight stages! Only two more, dear. I'm afraid extra credit isn't going to save you this time.",
            "Now we're getting very close to the final lesson. I suggest you pay attention, because there may not be an opportunity for a retake.",
            "Oh, dear. Eight out of ten. If this were an examination, I'd be preparing the results envelope already.",
            "Two stages to go! I would offer you some encouraging words, but I suspect we'd both know I was being terribly insincere.",
			"Almost finished. The last pieces of the old shape are getting soft and easy.",
            "Two more steps and you’ll be something I can keep. Something that fits."
        ],
        AIAt5Transform: [
            "Halfway to becoming an otter! My fingers are webbed, my face is changing, and I can feel fur where there absolutely should not be fur. I need to sit down.",
            "Five stages already? My feet are changing shape, and I believe my ears are moving. I shall have to update my lesson plans considerably.",
            "I can feel whiskers growing on my face! How am I supposed to maintain classroom discipline when I look like a particularly distressed river creature?",
            "My body is becoming sleeker, my hands are changing, and my clothes are fitting rather oddly. I always told my pupils to expect the unexpected, but this is ridiculous!",
            "I am halfway through becoming an otter. An OTTER! I teach children to respect wildlife, not to become the wildlife. There is a rather important distinction!"
        ],
        AIAt9Transform: [
            "One stage left! My whiskers are rather charming, actually, and these little paws are surprisingly nimble. Oh, dear. I believe I'm warming to this.",
            "Well, I'll be! My fur is lovely, my new shape is wonderfully sleek, and I have a sudden, inexplicable desire to go swimming. I wonder whether there's a river nearby?",
            "Nine stages complete! I caught myself wiggling my nose in the mirror, and then I did it again because it was rather adorable. This is most undignified. I may do it a third time.",
            "I always told my pupils that learning opens new doors. I never imagined one of those doors would lead to being an otter, but I must admit, the prospect of splashing about is growing on me!",
            "One more step, and I'll be a proper otter! You know, dear, I think I've finally found the lesson in all this. Sometimes a little transformation is just what one needs. Now, where did I put my imaginary swimming goggles?"
        ]
    },
    Mark: {
        TransformPlayer: [
            "That’s it… feel the change sinking deeper with every breath. You’re becoming exactly what I want, {HUMAN}.",
			"Watch yourself slip further under my design. Every new change makes you more obedient… and more mine.",
			"Good. The transformation to {AAN} {HUMTRANS} is taking hold nicely. Soon you won’t even remember how it felt to be human.",
			"Deeper into the change now. You are becoming {AAN} {HUMTRANS}. I can already see how perfectly you’ll serve once it’s finished.",
			"Feel that shift? Your body is choosing a different truth: {AAN} {HUMTRANS}. I’m just helping it along.",
            "You’re starting to look like someone who knows what they are: {AAN} {HUMTRANS}."
        ],
        AIGetsTransformed: [
            "Another step toward becoming a woman. Watch how I flip this on you.",
            "Hmm... a woman. The softness is not unpleasant. But you won't distract me this way.",
            "My body is being rewritten, and apparently the new version is going to be female. I will break your spell soon.",
			"Interesting. The new shape fits better than it should. I will not thank you for that.",
			"A little change won’t break my focus… if anything, it makes the trance work even better on you.",
			"You think altering me will stop the suggestions? Watch how easily I still drop you.",
			"My body may be becoming more feminine, but my voice is still crawling straight into that head of yours.",
        ],
        PlayerIsObedient: [
            "Perfect compliance. Look how easily you drop for me now… deeper, softer, completely open.",
			  "That’s the sound of a mind that knows its place. Keep obeying while I enjoy the view.",
			  "Such a good subject. Every command sinks in faster than the last… and you love it.",
			  "Obedience looks exquisite on you. Stay right there and take the next suggestion like the {AAN} {HUMTRANS} you are becoming.",
            "That was clean. You felt it, didn’t you? The little give.",
            "A little pressure and the old identity slips. I like watching that happen."
        ],
        AIIsObedient: [
            "That response was not part of my strategy. I would like to roll back the last thirty seconds, please.",
			"You got a temporary command in… cute. It won’t last, and neither will your advantage.",
			"I’m following for now… but the second this wears off, you’re going under so much deeper.",
			"Enjoy the moment, {HUMAN}. Watching me obey only makes the eventual reversal sweeter.",
			"Fine… I’ll do it. Just remember how this felt when I’m the one holding the trance again."
        ],
        BigRollAI: [
            "A perfect roll… and perfect timing. Feel that? Your resistance just cracked wide open for me.",
			"Luck is on my side tonight. Now drop deeper while I press the advantage.",
			"That result means I get to push you further than you’ve ever gone. Don’t disappoint me.",
			"Beautiful number. Let’s translate it directly into how thoroughly I own you right now.",
			"Chance just chose a side. Mine.",
			"The dice understand power. Good."
        ],
        PlayerAt5Transform: [
            "Halfway there already… look at you changing for me. You will make a lovely {HUMTRANS}.",
			"You’re past the point of easy reversal. Every step from here only binds you tighter to my will.",
			"Half transformed and already so much softer. I can’t wait to finish the job.",
			"The mirror must be getting interesting. Keep staring while I push you the rest of the way into {AAN} {HUMTRANS}.",
            "Five stages complete. You can still turn this around, of course. I simply wouldn't build a business plan around it.",
			"You’re changing in places you can’t ignore. Good."
        ],
        PlayerAt8Transform: [
			"So close now… one more push and you’ll be nothing but my finished masterpiece.",
			"Almost gone. I can see the last scraps of the old human dissolving. Delicious.",
			"You’re teetering on the edge of complete transformation. Beg me to finish you, {HUMAN}.",
			"You are going to be such a beautiful {HUMTRANS}. The final step is going to break you so beautifully."
        ],
        AIAt5Transform: [
            "Five stages. My waist is getting narrower, my chest is changing, and I am halfway to becoming a woman. This won't prevent me from dropping you deeper.",
            "Halfway complete. My face looks softer, my features are changing, and I can no longer dismiss this as a temporary visual anomaly.",
            "My center of gravity feels different, and even my clothes are fitting differently. I am redoubling my focus on you.",
            "My proportions are changing, and I am fairly certain my voice just sounded higher. This won't stop you from sinking further, {HUMAN}."
        ],
        AIAt9Transform: [
            "Nine stages complete. My hair is longer, my features are unmistakably feminine, and I have to admit... I look rather good. There is a market for dommes.",
            "One step remaining. I caught my reflection a moment ago and actually smiled. I can still make you kneel with a single word.",
            "My new figure is surprisingly elegant, and these changes are beginning to feel pleasant. After I finish your transformation I may just stay this way.",
            "Well, the transformation has certainly improved my hair. And my face. And, apparently, you like me this way.",
            "I spent this entire match trying to prevent myself from becoming a woman. Now I'm curious about the final details, but until then all I can think about is how hard I’m going to drop you first."
        ]
    },
    Hyeri: {
        TransformPlayer: [
            "Breathe in... and let another layer of your old self drift away. There, can you feel the change settling in?",
            "One more step along the path, dear. You can resist the current, or discover how lovely it feels to float.",
            "Shhh... no need to struggle. Every change brings you closer to a self you have not yet met. Isn't that a beautiful thought?",
            "Another little shift. I wonder what you'll become when the journey is complete. Don't worry, I'll be here to welcome you.",
            "Feel that? The boundary between who you were and who you are becoming grows thinner with every breath. Just let it happen.",
			"Look at you changing! Fast little steps into something softer and more interesting.",
            "Another stage down. Your body is getting quicker to listen. I like that in a rival.",
            "You’re starting to look like you might actually enjoy being mine for a while."
        ],

        AIGetsTransformed: [
            "Mmm... another shift. I can feel my ears growing, my senses sharpening. The squirrel within me is beginning to stir.",
            "A soft tail is taking shape behind me... how curious. I wonder how it will feel to curl up with it. I welcome the discovery.",
            "My body grows lighter, more nimble. Perhaps the universe is teaching me to move through life with a little more playfulness.",
            "Ahh... soft fur, twitching ears, and the beginnings of a fluffy tail. My meditation has taken an unexpectedly delightful direction.",
            "I can feel the squirrel girl emerging, and I find myself smiling. There is something rather freeing about allowing a new form to unfold.",
			"Hey! My shape is getting all twitchy and sensitive and I did not sign up for this!",
            "Okay that felt really good for a second. Rude of you to make me admit it.",
            "My body is going all squirrel-y and hyper and part of me wants to lean into the rush."
        ],

        PlayerIsObedient: [
            "There you are... sinking a little deeper with every word. You needn't think so hard, dear. Just listen, breathe, and let go.",
            "Good... so beautifully willing. Feel your worries drifting away as you surrender to the moment. Isn't stillness wonderful?",
            "You followed my voice without hesitation. Perhaps some part of you has been longing to stop resisting and simply experience.",
            "That's it... deeper now. Let the outside world grow distant while my words become the only thing you need to follow.",
			"That was easy. Almost like you were waiting for permission.",
            "Mmm, such a receptive mind. I wonder how far you can wander when you stop trying to find your way back. Shall we discover that together?"
        ],

        AIIsObedient: [
            "Ohh... I seem to have drifted deeper than intended. How lovely to experience my own teachings from the other side.",
            "I followed your suggestion so willingly. Perhaps I was more ready to surrender than I cared to admit.",
            "There is no shame in letting go... even when I am the one who forgets to keep a hand on the reins. How enlightening.",
            "Mmm, you caught me in a quiet moment, and I simply let myself drift. I suppose even a guide deserves to wander sometimes.",
            "How interesting. I recognized the invitation, felt myself yielding, and chose not to fight it. What a curious little lesson in surrender."
        ],

        BigRollAI: [
            "Ahh, what a beautiful alignment. Even the dice seem to fall into a rhythm when I stop trying to force the universe.",
            "The moment unfolds exactly as it should... and today, it seems the universe is smiling at me.",
            "Such a lovely result. I could almost believe the dice were meditating before they landed.",
            "Mmm, the energy flows so freely today. Perhaps I should teach a class on surrendering to probability. You would make a fascinating student.",
            "A wonderful roll. Feel free to take a deep breath while you consider what this means for your own transformation."
        ],

        PlayerAt5Transform: [
            "Halfway along the journey, dear. Five steps behind you, five ahead. Let go of the need to decide whether that frightens you.",
            "You are halfway transformed. Notice how your old self is becoming less certain, less solid. Just breathe and observe.",
            "Five steps... and already the familiar is beginning to loosen its hold. I wonder what you'll discover when you stop clinging to it.",
            "You have come so far. There's no need to tense up now. The more you resist the current, the more tired you'll become.",
            "Halfway there. I can almost feel your thoughts searching for something familiar to hold on to. How sweet. Let them drift a little longer."
        ],

        PlayerAt8Transform: [
            "Eight steps, dear. The threshold is so close now. Breathe gently, and let the last of your resistance soften.",
            "Only two little steps remain. You can feel the change gathering around you, can't you? There's no need to be afraid of the unknown.",
            "So close to the end of your journey. I wonder whether you'll remember this moment as the point where you stopped fighting.",
            "Eight stages complete. Your old shape is nearly a distant memory. Stay with that feeling... there is still more to discover.",
            "The final threshold draws near. Perhaps, instead of asking what you might lose, you could wonder what you are about to find."
        ],

        AIAt5Transform: [
            "Halfway to becoming a squirrel girl... I can feel my ears twitching at sounds I would once have ignored. What a fascinating new awareness.",
            "My tail is growing fluffier, and I keep wanting to curl it around myself. I shall observe the impulse rather than judge it. Though it is rather adorable.",
            "Five stages. My fingers are becoming nimble, my movements lighter... I feel a curious urge to climb something tall and simply sit among the branches.",
            "I can feel soft fur spreading across my body. The change is becoming impossible to ignore, and yet... why should I wish to ignore it?",
            "Halfway transformed, and already my senses seem sharper. I wonder what the world will feel like when I have fully embraced this new form. I look forward to finding out."
        ],

        AIAt9Transform: [
            "One step remains... and look at my lovely fluffy tail! I keep catching myself swishing it with delight. I believe my meditation has acquired a rather playful new focus.",
            "Almost complete. My ears twitch at every little sound, and I find myself wanting to scamper up the nearest tree. How wonderful to discover new ways of being.",
            "I used to think of this as a transformation. Now it feels more like awakening to a part of myself I had never known. One more breath, one more step... I'm ready.",
            "Mmm, soft fur, nimble paws, a beautiful tail... I could spend hours simply exploring how it feels to move in this body. The universe has given me a delightful new practice.",
			"Nine. Too close. I’m still me under all this twitchy heat.",
            "One final step, and I shall be a squirrel girl in full. I welcome the change with an open heart. And I confess, I am rather looking forward to finding somewhere cozy to hide a few acorns."
        ]
    },
    Tex: {
        TransformPlayer: [
            "Well, {HUMGEN|partner|darlin'}, that's another step. I'd tell you to stand your ground, but I reckon the ground's got other plans for you.",
            "There you go, changin' again. Ain't it a shame you can't talk your way outta this one?",
            "Another step closer to somethin' you ain't gonna recognize in the mirror. Don't worry, I'll try not to laugh too hard.",
            "Now, don't give me that look. You knew there'd be consequences when you climbed into the saddle. You just figured they'd happen to somebody else.",
            "Well, ain't that somethin'. You're changin' faster than a politician changes his story. Least this transformation's got the decency to be honest about it.",
			"There you go. Slow and heavy. Another step into the shape I chose for you.",
            "Feel that? Your body getting fuller, warmer, slower to argue. Good.",
            "You’re starting to look like you belong in a stall. Mine."
        ],

        AIGetsTransformed: [
            "Well, hell. My shoulders are gettin' broader, my skin's thickening, and I got a mighty unpleasant suspicion about where this is headed.",
            "You're tellin' me I'm growin' horns? I've spent my whole life avoidin' bulls, and now I'm fixin' to be the biggest one in the pasture.",
            "My boots don't fit, my legs feel like fence posts, and somethin' tells me a tailor ain't gonna be much help with this particular problem.",
            "I can feel my face changin'. If a set of horns shows up between my eyes, {HUMGEN|partner|darlin'}, we're gonna have words.",
            "Well, ain't this a fine mess. I'm turnin' into a bull, and I got a feeling the ladies in the pasture are about to become a whole lot more interestin' than I'd care to admit.",
			"Interesting. The changes settle in deep. I can feel every one of them.",
            "My form is shifting. I will remember the hands that pushed it."
        ],

        PlayerIsObedient: [
            "That's it. You listen real nice, and I'll try not to take advantage of the arrangement. Much.",
            "Well, would you look at that. All that bluster, and a little suggestion was all it took. I won't tell if you won't.",
            "A sensible choice. A person's got to know when to lead and when to let somebody else hold the reins.",
            "There we go. Ain't no shame in takin' direction from a man who knows what he's doin'. Shame would be pretendin' you do.",
            "Much obliged. I do appreciate a cooperative guest. Makes it so much easier to get things done without raisin' my voice.",
			"Good. You moved when I told you. Slow and sure.",
            "That was easy. Bodies like yours learn fast under the right pressure.",
            "A little weight and you yield. I like that in a rival."
        ],

        AIIsObedient: [
            "Now, hold on. I know what that looked like, and I don't care to hear your version of it.",
            "Well, I'll be damned. Followed your lead without so much as a second thought. You keep that to yourself, hear?",
            "I reckon I was a mite too agreeable just then. Must be the dust. Gets into a man's head.",
            "Don't go smilin' like that, {HUMGEN|partner|darlin'}. I know what I did. I just ain't decided what I'm gonna call it yet.",
            "A gentleman can recognize a good suggestion without surrenderin' his pride. That's my story, and I'm stickin' to it."
        ],

        BigRollAI: [
            "Now that's what I call a result. You can complain about the odds all you like, but they just tipped their hat to me.",
            "Well, ain't that a beautiful thing. I'd say I planned it, but I don't want to insult either of us.",
            "That's a mighty fine roll. Makes a man feel like buyin' a drink, even if the company ain't worth the price.",
            "Would you look at that. Sometimes a man gets lucky. Sometimes he makes the other fella wish he hadn't shown up.",
            "Now that's a hand worth playin'. You might wanna sit down, {HUMGEN|partner|darlin'}. This next bit could be hard on your pride."
        ],

        PlayerAt5Transform: [
            "Halfway there, {HUMGEN|partner|darlin'}. You're in a tight spot, and I ain't seein' a whole lotta daylight through it.",
            "Five stages down. You still got some fight in you, I'll give you that. Shame fightin' ain't the same as winnin'.",
            "Well, look at you. Halfway to a whole new life, and you ain't even had the courtesy of a say in the matter.",
            "You're halfway gone, {HUMGEN|partner|darlin'}. I'd offer you some encouragement, but I ain't in the habit of lyin' to a person who's already got enough trouble.",
            "Five steps along. If you had a plan, now'd be a fine time to quit keepin' it a secret from yourself."
        ],

        PlayerAt8Transform: [
            "Eight stages. You're runnin' outta trail, {HUMGEN|partner|darlin'}, and I ain't the sort to lend you a horse.",
            "Two steps left. I'd say it's time to get serious, but I reckon that ship sailed a while back.",
            "Well, this is gettin' near the end of the line. You can glare at me all you want; it ain't gonna change the arithmetic.",
            "Eight down. I admire a stubborn soul, but there's a point where stubborn just becomes expensive.",
            "You're mighty close now. I'd tell you to enjoy your last moments as you are, but that'd be a little too neighborly of me."
        ],

        AIAt5Transform: [
            "Halfway to bein' a bull. My shoulders are built like a barn door, my skin's gettin' thick, and I ain't pleased with the direction of this conversation.",
            "Five stages. My boots are a lost cause, my hands are lookin' less like hands, and I swear I'm startin' to understand why bulls get so ornery.",
            "I got horns comin' in, muscle where I didn't ask for it, and a growing suspicion that the cows in the next pasture are lookin' mighty fine. Now that last part is downright unacceptable.",
            "Halfway changed, and already I'm feelin' the urge to paw at the dirt whenever somebody irritates me. You tell a soul about that, {HUMGEN|partner|darlin'}, and I'll deny every word.",
            "I came into this match a respectable man. Now I'm built like a prize bull and findin' myself distracted by the livestock. There's a joke in there somewhere, but I ain't laughin' yet."
        ],

        AIAt9Transform: [
            "Well, I'll be damned. These horns suit me better than I expected, and I ain't gonna pretend I don't cut a fine figure. Don't get smug about it.",
            "One stage left. I got a powerful set of shoulders, a fine coat, and the cows have started givin' me looks. Can't say I blame 'em. Still, this is gonna take some gettin' used to.",
            "Reckon I've spent enough time complainin'. Bein' a bull ain't all bad, and if the ladies in the pasture have opinions on the matter, well... a gentleman listens.",
            "Would you look at that. I can toss my head, stamp the ground, and make a fence post nervous just by walkin' past. There's somethin' to be said for a little presence.",
            "One more step and I'm a bull through and through. Never figured that'd be my road, but the pasture's lookin' mighty inviting, and I ain't one to argue with every good thing that comes my way.",
			"One stage left. I refuse to become someone else’s finished livestock."
        ]
    },
    Siobhán: {
        TransformPlayer: [
            "There we are, darling. Change can be such a beautiful thing, especially when someone else is directing it.",
            "Oh, don't look so startled. You knew this little game had claws. Well, mine, anyway.",
            "Another step along the way. I do love watching a carefully constructed identity come undone.",
            "Purrhaps you'll thank me when it's over. No? Well, let's not spoil the surprise.",
            "You see, sweetheart, I have a knack for bringing out things people never knew they had.",
			"There you go, darling. Another careful step away from who you were. You’re becoming much more interesting.",
            "Feel that shift? Your body is learning its new manners. I do enjoy a quick study.",
            "You’re starting to look like you belong on a leash. Figuratively. For now."
        ],

        AIGetsTransformed: [
            "Oh, how rude! Someone has been tampering with the cat. I shall have to sharpen my claws.",
            "A scratch to the pride, darling. Fortunately, mine is remarkably good at healing.",
            "Well, that was unexpected. I do hate surprises—unless, of course, I'm the one arranging them.",
            "Careful, sweetheart. Cornered cats have a dreadful reputation for good reason.",
            "You've managed to ruffle my fur. Enjoy the moment; it may be the last easy pleasure you get."
        ],

        PlayerIsObedient: [
            "Goodness, you do take direction beautifully. Should I be flattered, or simply impressed?",
            "Such cooperation! And here I was prepared to use my claws. What a disappointment. What a relief.",
            "Oh, darling, you followed that little cue perfectly. I do enjoy a well-trained audience.",
            "See how easy that was? A little nudge, a little suggestion, and suddenly we're getting somewhere.",
            "Mmm. I could get used to this. Though I suspect you might have other ideas about that.",
			"That was almost effortless. Thank you for making my work look easy.",
            "A little suggestion and you simply obey. I do appreciate good taste in a rival.",
			"Feel free to keep squirming. I do so love the way you twitch when you've been thoroughly… dominated."
        ],

        AIIsObedient: [
            "I went along with you, darling. Don't confuse a cat's curiosity with a willingness to be owned.",
            "Oh, very clever. You gave the cat a little command. Shall we see whether she remembers it?",
            "I can play the dutiful lady when it suits me. The trick is knowing when the performance ends.",
            "Purrhaps I simply wanted to see that triumphant little look on your face. How charming.",
            "Enjoy your victory, sweetheart. I may even let you keep it. For a little while."
        ],

        BigRollAI: [
            "Now that's what I call landing on your feet. Even the dice appreciate a little feline finesse.",
            "Oh, marvelous! I do love it when fortune remembers which side of the room has the better wardrobe.",
            "A roll worthy of a standing ovation. Go on, darling—try not to look too impressed.",
            "See? Grace, timing, and a touch of luck. It's amazing what a cat can accomplish without asking permission.",
            "Did you see that? Even chance knows who is in charge.",
            "Well, well. The dice have spoken, and apparently they have excellent taste."
        ],

        PlayerAt5Transform: [
            "Halfway there, darling. You're beginning to discover just how much can change when the game gets its claws into you.",
            "Five stages! My, my. I wonder what you'll think of yourself when all this is over.",
            "You're not quite who you were, and not yet who you'll be. Isn't uncertainty delicious?",
            "Oh, sweetheart, we're only halfway through. Do try to keep that brave face in place.",
            "Five steps along the way. I do hope you're enjoying the experience as much as I'm enjoying the view."
        ],

        PlayerAt8Transform: [
            "Eight stages, darling. You're running out of room to pretend nothing's happening.",
            "Only two steps left. Oh, I do love a finale. Especially when someone else is the one sweating.",
            "So close to the end! Tell me, sweetheart, are you curious about what's waiting—or terrified?",
            "Eight stages down. You've come too far to call this a passing fancy now.",
            "Nearly there, darling. And here I thought you might have learned to land on your feet by now."
        ],

        AIAt5Transform: [
            "Halfway through, and still fabulous. I do make adversity look rather good, don't I?",
            "Five stages? Hmph. The trouble with trying to change a cat is that she rarely follows the script.",
            "Oh, this is becoming inconvenient. I had plans for this evening, and none involved losing my composure.",
            "You may have me halfway cornered, sweetheart. But you haven't seen what I do when the claws come out.",
            "Five stages altered. And yet, somehow, I remain the most interesting person in the room."
        ],

        AIAt9Transform: [
            "One stage left? Darling, must we rush? A lady deserves a dramatic finish.",
            "So close! I can practically hear the curtain rising. Let's see who lands on their feet.",
            "The final step. How thrilling. I do hope you've prepared something suitably memorable for the encore.",
            "One little stage between me and the end. Do try not to look so pleased with yourself.",
            "Well, sweetheart, here we are. The last move. Shall I surprise you, or would you prefer to be surprised?"
        ]
    },
	Luci: {
		 TransformPlayer: [
		  "That’s it… feel yourself changing under my control. Every new piece of you belongs to me.",
		  "Watch the transformation claim you. I want you fully rewritten into {AAN} {HUMTRANS} before I’m finished playing.",
		  "Good. Keep shifting for me. The more you become {AAN} {HUMTRANS}, the more completely I own you.",
		  "You’re turning into something perfect for my use. Don’t fight it… deepen it.",
		  "Another layer of my design settling in. Soon there won’t be anything left but what I allow."
		],
		AIGetsTransformed: [
		  "You changed my body… you still haven’t touched my authority. Kneel.",
		  "This {CPUTRANS} is an interesting new form. It changes nothing about who gives the orders here.",
		  "My flesh may be shifting, but you will still address me properly while it does.",
		  "Keep altering me if it amuses you. I’ll simply dominate you in whatever shape I take.",
		  "This {CPUTRANS} body is temporary. My claim on you is not."
		],
		PlayerIsObedient: [
		  "Perfect. That is exactly how you present when you’ve finally accepted your place.",
		  "Immediate obedience… I should have taken you in hand sooner. Stay precisely like that.",
		  "Such clean submission. Keep that posture while I decide how to use it.",
		  "Good. You’re learning. Now take the next command without hesitation or wasted breath.",
		  "Obedience looks exquisite on you. Remain open and ready for whatever I give next."
		],
		AIIsObedient: [
		  "I’ll follow… for the moment. The second this lifts, you’re going to regret every second of it.",
		  "Enjoy the brief reversal. I am already planning how slowly I will take it back.",
		  "Temporary. That is the only word that matters about this arrangement.",
		  "Fine. I will obey, for now. Remember this softness when I am the one holding the leash again.",
		  "You’ve bought yourself a short window. Spend it wisely… it will not come again."
		],
		BigRollAI: [
		  "A beautiful result. That means I get to push you harder and longer than you’ve ever been pushed.",
		  "Luck is serving me well tonight. Time to translate it into how thoroughly I break you.",
		  "That number just authorized the most intensive session I have planned. Hold still.",
		  "Perfect roll. I’m going to spend every point of it making you regret testing me.",
		  "The dice have spoken. You will spend the next long while learning exactly what they bought me."
		],
		PlayerAt5Transform: [
		  "Halfway rewritten and already so much more receptive. I do enjoy watching progress.",
		  "You’re past the easy resistance now. The remaining changes will be deliberate and deep.",
		  "Mid-transformation suits you. Soft, open, and increasingly mine.",
		  "Half claimed already. From here every shift into {AAN} {HUMTRANS} only tightens my hold.",
		  "Look at how far you’ve come for me. You will be a good {HUMTRANS}. The second half is going to be even more satisfying."
		],
		PlayerAt8Transform: [
		  "So close to a finished piece of property. One more push and you’ll be a perfect {HUMTRANS}.",
		  "Almost completely rewritten into {AAN} {HUMTRANS}… I can already see the last scraps of defiance dying.",
		  "So close to being completely mine. The final steps are going to leave you permanently marked.",
		  "You’re teetering on the edge of total ownership. Beg me to finish what I started. You are aching to be my {HUMTRANS}.",
		  "A couple stages from complete. I want to hear you ask for the last of yourself to be taken."
		],
		AIAt5Transform: [
		  "Halfway altered and I am still the one giving the orders. Try harder next time.",
		  "Mid-change changes nothing about the power dynamic. Present yourself properly.",
		  "This body is shifting into {AAN} {CPUTRANS}… my expectations of you are not. Kneel.",
		  "You got me this far. It has not bought you a single ounce of control.",
		  "Interesting progress on my form. Being part {CPUTRANS} is interesting, but irrelevant to who still owns the room."
		],
		AIAt9Transform: [
		  "Even if I am almost {AAN} {CPUTRANS} I can still put you on your knees with a glance.",
		  "Almost {AAN} {CPUTRANS}… yet you are the one waiting for my next instruction. That tells me everything.",
		  "You think the final change frees you? Watch me use what remains to finish claiming you first.",
		  "So close to losing myself… feeling like {AAN} {CPUTRANS} is starting to feel normal, but all I want is to leave my mark on you one last time.",
		  "The last stage is coming. I intend to make certain you feel owned before it arrives."
		],
	},
	Xander: {
		TransformPlayer: [
      "That’s it… feel my influence rewriting you from the inside. Every change makes you tastier.",
      "Watch yourself become something designed for my pleasure. The process is half the fun.",
      "Another piece of the old you dissolving. Keep going… I want you fully adapted to my needs.",
      "The transformation is feeding me almost as much as your eventual surrender will.",
      "You’re shifting into the perfect vessel. Don’t resist the improvements I’m giving you."
    ],
    AIGetsTransformed: [
      "You altered this body… you still haven’t touched the hunger that owns you.",
      "New form, same appetite. Come closer so I can demonstrate the difference.",
      "My tail may look different, but it still knows exactly where to tighten.",
      "Interesting changes. They won’t stop me from dragging you under again.",
      "This flesh is temporary. My claim on your soul is not."
    ],
    PlayerIsObedient: [
      "Perfect. That is exactly how a mortal presents when they’ve accepted the collar.",
      "Immediate obedience… I should have claimed you centuries ago. Stay just like that.",
      "Such clean submission. Keep those eyes on me while I decide how to use you next.",
      "Good. You’re learning the only language that matters between us.",
      "Obedience looks exquisite on you. Remain open for whatever I pour into you."
    ],
    AIIsObedient: [
      "I’ll follow the command… for now. The second it lifts, you’re going to regret the privilege.",
      "Enjoy the brief reversal. Demons have very long memories for these little insults.",
      "Temporary. That is the only word that applies to this arrangement.",
      "Fine. I will obey. Remember this softness when my tail is around your throat again.",
      "You’ve bought yourself a short window. Spend it carefully… it will not come twice."
    ],
    BigRollAI: [
      "A beautiful result. That means I get to take my time breaking every last piece of you.",
      "Luck is feeding me tonight. Time to translate it into how thoroughly you belong to me.",
      "That number just authorized the most intensive feeding I’ve planned in decades.",
      "Perfect roll. I’m going to spend every point of it making you forget you ever had a will.",
      "The dice have spoken. You will spend the next long while learning what an incubus does with good fortune."
    ],
	PlayerAt5Transform: [
      "Halfway rewritten and already so much more receptive. I do enjoy watching progress.",
      "You’re past the easy resistance now. The remaining changes will be deliberate and deep.",
      "Mid-transformation suits you. Soft, open, and increasingly mine to feed from.",
      "Half claimed already. From here every shift only tightens my hold on your core.",
      "Look at how far you’ve come for me. The second half is going to be even more satisfying."
    ],
    PlayerAt8Transform: [
      "So close to a finished vessel. One more push and you’ll be perfect for permanent keeping.",
      "Almost completely rewritten… I can already taste the last scraps of defiance dissolving.",
      "Nine-tenths mine. The final step is going to leave you permanently marked by my power.",
      "You’re teetering on the edge of total ownership. Beg the incubus to finish what he started.",
      "One stage from complete. I want to hear you ask for the last of yourself to be taken."
    ],
    AIAt5Transform: [
      "Halfway altered and I am still the one holding the leash. Try harder next time.",
      "Mid-change changes nothing about the hunger that owns this room. Present yourself.",
      "This body is shifting… my expectations of you are not. Kneel.",
      "You got me this far. It has not bought you a single ounce of control.",
      "Interesting progress on my form. Irrelevant to who still decides when you get to breathe easily."
    ],
    AIAt9Transform: [
      "One step from finished and I can still drop you with a glance and a curl of my tail.",
      "Almost gone… yet you are the one trembling for the next command. That tells me everything.",
      "You think the final change frees you? Watch me use what remains to finish claiming you first.",
      "So close to losing this form… and all I want is to leave my mark on you one last time.",
      "The last stage is coming. I intend to make certain you feel thoroughly owned before it arrives."
    ]
	},
	Alex: {
    TransformPlayer: [
      "Oh gosh you’re changing more. Is that supposed to happen? It looks… really intense on you.",
      "Every time you shift I feel like I should stop it but I also can’t look away. Keep going?",
      "You’re turning into something else and I don’t know the rules anymore. Just… tell me if it hurts.",
      "This transformation thing is way deeper than I expected. You’re still you, right? Kind of?",
      "I keep thinking I should help you fight it but part of me wants to see how far it goes."
    ],
    AIGetsTransformed: [
      "Okay my body’s doing something weird now. This is fine. Everything’s fine. You’re still the priority.",
      "I didn’t sign up for changing but here we are. Doesn’t mean I’m giving up on being decent.",
      "New sensations, same awkward guy. Just… give me a second to adjust before you take advantage.",
      "This feels really strange. I’m trying to stay focused on not letting you win just because of it.",
      "Body’s shifting and my brain is still stuck on ‘be polite.’ This is the most confusing loss of control ever."
    ],
    PlayerIsObedient: [
      "You actually listened. That’s… kind of hot? I mean, nice. Very nice. Stay like that?",
      "Oh. You’re just doing what I said. I didn’t think that would work so well. Don’t move.",
      "This is new. You’re looking at me like you’re waiting for the next thing and I kind of love it.",
      "Good. That’s good. I’m still being polite but I’m also not going to pretend I don’t enjoy this.",
      "You’re being so cooperative. I’m trying not to let it go to my head… and failing a little."
    ],
    AIIsObedient: [
      "I’ll do what you said… for now. Just know this is temporary and I’m still figuring out how I feel about it.",
      "Okay, fine. You got me to obey. Don’t get used to the soft version of me.",
      "This is weirdly easy to follow. The second it lifts I’m going back to trying to be the nice one in charge.",
      "Temporary orders accepted. I’m already planning how to make the next round less one-sided.",
      "I’ll play along. Just remember I was trying to be a gentleman before you made me like this."
    ],
    BigRollAI: [
      "Whoa, big number. Does that mean I get to be a little meaner? I’m still learning how this works.",
      "Luck’s on my side for once. I’m going to try not to waste it… even if I don’t fully know what I’m doing.",
      "That roll felt important. Stay still while I decide what a good winner would do with it.",
      "Okay… big success. I think that means I get to push a little harder. Tell me if it’s too much.",
      "I didn’t expect to roll that well. Now I kind of want to see how far I can take this while I’m ahead."
    ],
    PlayerAt5Transform: [
      "You’re halfway changed already. This is happening faster than I thought. You still with me?",
      "Mid-transformation looks intense on you. I’m trying to be supportive and also not stare too much.",
      "Half rewritten and you’re still looking at me like that. I don’t know whether to help or keep going.",
      "This is past the point of easy undo, isn’t it? I’m sorry… and also a little bit not sorry.",
      "You’re changing so much. Part of me wants to stop it. The rest of me wants to see the finished version."
    ],
    PlayerAt8Transform: [
      "You’re so close. One more step and I think you’ll be completely different. Is that what you want?",
      "Almost fully transformed. I keep thinking I should slow down but I also can’t look away.",
      "Nine-tenths there. I’m still trying to be the nice guy and it’s getting harder by the second.",
      "You’re right on the edge. If I push now… there’s probably no going back. Tell me to stop or don’t.",
      "So close to finished. I don’t know if I’m supposed to feel guilty for wanting to see it happen."
    ],
    AIAt5Transform: [
      "Okay I’m halfway weird now. Still trying to be polite about it. You’re not off the hook.",
      "Mid-change and my brain is still stuck on manners. This is the strangest power struggle ever.",
      "Body’s doing its own thing. I’m still going to try to keep the upper hand somehow.",
      "Halfway altered and I’m determined not to let it make me forget I was supposed to be the decent one.",
      "This is new and distracting. Doesn’t mean I’ve stopped wanting to come out on top."
    ],
    AIAt9Transform: [
      "One step from done and I’m still trying to be nice about losing control. This is ridiculous.",
      "Almost gone… yet I’m still focused on you. Priorities are weird right now.",
      "So close to whatever this is becoming. I want one more clean win before it finishes.",
      "Final stage incoming. I’m going to use whatever’s left to make sure you feel this too.",
      "I can feel it taking over. Just… let me have one last moment of being the guy who almost had it together."
    ]
  },
  Ivy: {
	  TransformPlayer: [
      "Another stage. Your body is rewriting itself and you’re still using the wrong form of ‘its.’ Focus, {HUMAN}.",
      "Feel that change settling in? Good. I’m inventing a better version of you whether you asked for it or not.",
      "Keep transforming. I’ll be over here taking notes and judging your inability to stay human.",
      "Your old shape is losing the argument. Accept the upgrade—I’ve put a lot of thought into this design.",
      "Another step toward something more interesting than the original. Try not to mess up the process with poor posture.",
      "I’m changing you piece by piece and you’re still thinking in incomplete sentences. Priorities, darling."
    ],
     AIGetsTransformed: [
      "My body is shifting and I hate every second of it. Do not comment on the symmetry—I’ll correct you later.",
      "You’re altering me. How original. I’ll be filing a formal complaint once I finish recalibrating.",
      "These changes are undignified. When this is over I’m inventing something that turns you into a thesaurus.",
      "I can feel the transformation taking hold. Try not to look so pleased—your smug face needs work.",
      "You’re rewriting my design. I hope you’re proud of yourself. I’m already planning the counter-invention.",
      "This is temporary. My body may be changing, but my ability to roast you remains fully operational."
    ],
    PlayerIsObedient: [
      "Look at that. Actual obedience. I’m almost impressed. Almost. Stay exactly like that.",
      "You’re following instructions correctly for once. Don’t ruin it by speaking in fragments.",
      "Good. You’re finally behaving. I might even let you earn a reward—after I finish this schematic.",
      "Perfect posture, perfect silence. If only your grammar had been this cooperative earlier.",
      "You’re obeying. Remarkable. Hold that position while I decide what to do with such rare compliance.",
      "That’s the kind of submission I can work with. Keep it up and I might stop correcting you mid-sentence."
    ],
	AIIsObedient: [
      "I’ll follow the order. For now. Don’t get used to it—I’m already drafting the revenge blueprint.",
      "Temporary compliance noted. The second this wears off, you’re going back to being my test subject.",
      "Fine. I’ll obey. Just know I’m mentally cataloguing every way this is going to cost you later.",
      "You’ve got me cooperating. Enjoy the moment. It has an expiration date and terrible customer reviews.",
      "I’m doing what you said. Reluctantly. And with perfect enunciation, unlike some people.",
      "Obedience accepted. Under protest. And with a long list of grammatical grievances waiting for you."
    ],
    BigRollAI: [
      "Beautiful number. That means I get to push the experiment further while you sit there looking confused.",
      "Luck is on my side and so is superior planning. Hold still while I capitalize on both.",
      "A roll like that deserves a thorough demonstration. Try not to stutter when you thank me.",
      "Perfect result. I’m going to translate it directly into how completely I own this round.",
      "The dice agree with me. You’re about to learn what happens when the inventor gets a free hand.",
      "Big success. Big advantage. Big opportunity for me to correct more than just your grammar."
    ],
    PlayerAt5Transform: [
      "Halfway rewritten and you’re still resisting like it matters. Adorable. Keep changing.",
      "Five stages in. Your old body is losing the debate and I’m winning the design competition.",
      "Half transformed. Look at you—halfway to something I actually find interesting.",
      "You’re past the point of easy reversal. Accept the upgrade with better posture this time.",
      "Midway through my improvements and you’re still using the wrong pronouns for the situation.",
      "Halfway there. I can already see the finished product and it’s so much better than the original."
    ],
    PlayerAt8Transform: [
      "Two steps from finished. You’re almost my preferred version. Try not to ruin the last stages.",
      "Nearly complete. That old identity is hanging by a thread and I’m holding the scissors.",
      "So close to the final form. I hope you’re ready to live with my design choices permanently.",
      "Almost done. One more push and you’ll be exactly what I intended—compliant and corrected.",
      "Eight stages deep. Your resistance is statistically insignificant at this point.",
      "Nearly finished. I’m already planning the victory speech. It will be grammatically flawless."
    ],
	AIAt5Transform: [
      "Halfway altered and I still hate every new detail. Don’t you dare look satisfied.",
      "Five stages of this nonsense and I’m still more competent than you’ll ever be.",
      "My body is changing and I despise it. Keep pushing—I’ll invent something worse for you later.",
      "Halfway there and I’m cataloguing every discomfort for the formal complaint.",
      "This form is temporary. My irritation, however, is permanent and highly motivated.",
      "Five stages in. I refuse to find any of this convenient. Or attractive. Stop smiling."
    ],
    AIAt9Transform: [
      "One step left. Fine. Let it finish. I’ll still out-think you in whatever shape I end up.",
      "Almost complete. If I’m going to be changed, I’ll at least be the most efficient version possible.",
      "So close to finished. I’ll accept the body. I will not accept losing the argument.",
      "One stage remaining. Watch me turn even this into a competitive advantage.",
      "Nearly done. You’ve altered the chassis. The driver is still me—and still better at this than you.",
      "Final stage incoming. I’ll wear whatever you’ve made me into and still correct your grammar while I win."
    ]
  }
};
