// Task data from CSV
const TASKS = [
    { order: 1, day: "EVERY DAY", task: "Send Retainers on 18hr ventures", location: "Limsa Lominsa", priority: "HIGH", notes: "Do this FIRST every login", type: "misc" },
    { order: 2, day: "EVERY DAY", task: "GC Turn-ins - Check starred items", location: "Limsa Lominsa", priority: "MEDIUM", notes: "Easy seals if you craft", type: "crafting" },
    { order: 3, day: "EVERY DAY", task: "Squadron Mission (any 80%+ success)", location: "Limsa Lominsa", priority: "LOW", notes: "For challenge log", type: "misc" },
    { order: 4, day: "EVERY DAY", task: "Mini Cactpot", location: "Gold Saucer", priority: "LOW", notes: "30 seconds for MGP", type: "gold-saucer" },
    { order: 5, day: "Tuesday", task: "Jumbo Cactpot - BUY TICKET", location: "Gold Saucer", priority: "MEDIUM", notes: "WEEKLY - Results Saturday", type: "gold-saucer" },
    { order: 6, day: "Friday", task: "Fashion Report (wear 2 items)", location: "Gold Saucer", priority: "HIGH", notes: "WEEKLY - Check Reddit - 60k MGP", type: "gold-saucer" },
    { order: 7, day: "Saturday", task: "Jumbo Cactpot - CHECK WINNINGS", location: "Gold Saucer", priority: "MEDIUM", notes: "WEEKLY - Collect prize", type: "gold-saucer" },
    { order: 8, day: "Tuesday", task: "Wondrous Tails - Grab book from Khloe", location: "Idyllshire", priority: "HIGH", notes: "WEEKLY RESET - Do FIRST!", type: "combat" },
    { order: 9, day: "Sunday", task: "Wondrous Tails - TURN IN", location: "Idyllshire", priority: "HIGH", notes: "WEEKLY - Before Tuesday reset!", type: "combat" },
    { order: 10, day: "Tuesday", task: "Faux Hollows - 3 attempts", location: "Idyllshire", priority: "MEDIUM", notes: "WEEKLY - Old Extremes", type: "combat" },
    { order: 11, day: "Sunday", task: "Spend Poetics if close to cap", location: "Idyllshire", priority: "MEDIUM", notes: "Don't waste currency!", type: "misc" },
    { order: 12, day: "Tuesday", task: "Doman Enclave donation", location: "Yanxia", priority: "LOW", notes: "WEEKLY - 20k worth for 40k back", type: "misc" },
    { order: 13, day: "Tuesday", task: "Challenge Log - Check progress", location: "Anywhere", priority: "MEDIUM", notes: "WEEKLY RESET - Easy XP/MGP/Seals", type: "misc" },
    { order: 14, day: "EVERY DAY", task: "Pelupelu Dailies (3 quests)", location: "Tuliyollal", priority: "MEDIUM", notes: "Tribal rep", type: "misc" },
    { order: 15, day: "EVERY DAY", task: "Grab Daily Hunt Marks", location: "Tuliyollal", priority: "MEDIUM", notes: "5 marks to kill", type: "combat" },
    { order: 16, day: "Tuesday", task: "Grab Weekly Hunt Marks (all 3 tiers)", location: "Tuliyollal", priority: "HIGH", notes: "WEEKLY RESET", type: "combat" },
    { order: 17, day: "EVERY DAY", task: "Kill 5 Daily Hunt Marks", location: "Various zones", priority: "MEDIUM", notes: "Check Hunt Bill for locations", type: "combat" },
    { order: 18, day: "EVERY DAY", task: "Queue Expert Roulette", location: "Duty Finder", priority: "HIGH", notes: "#1 priority - auto-caps tomes", type: "combat" },
    { order: 19, day: "EVERY DAY", task: "Queue Leveling Roulette", location: "Duty Finder", priority: "LOW", notes: "Only if leveling alts", type: "combat" },
    { order: 20, day: "EVERY DAY", task: "Duty Roulette: Frontline", location: "Duty Finder", priority: "LOW", notes: "Easy PvP XP + Wolf Marks", type: "pvp" },
    { order: 21, day: "Tuesday", task: "Arcadion Normal (all 4 bosses)", location: "Duty Finder", priority: "HIGH", notes: "WEEKLY - Gear tokens ilvl 730", type: "combat" },
    { order: 22, day: "Tuesday", task: "Alliance Raid - Echoes of Vana'diel", location: "Duty Finder", priority: "HIGH", notes: "WEEKLY - Upgrade coins", type: "combat" },
    { order: 23, day: "Wednesday", task: "Savage Raids", location: "Duty Finder", priority: "MEDIUM", notes: "If progging with the boys", type: "combat" },
    { order: 24, day: "EVERY DAY", task: "Treasure Map allowance", location: "Any DT zone", priority: "LOW", notes: "Gather or buy MB", type: "gathering" },
    { order: 25, day: "EVERY DAY", task: "Island Sanctuary maintenance", location: "Island Sanctuary", priority: "LOW", notes: "Optional - Feed/Collect/Craft - 10 min", type: "misc" },
    { order: 26, day: "Tuesday", task: "Island Sanctuary weekly collection", location: "Island Sanctuary", priority: "LOW", notes: "WEEKLY - Grab cowries", type: "misc" }
];


// Currency data from CSV
const CURRENCY = [
    { currency: "Allagan Tomestones of Poetics", cap: "2000", priority: "URGENT", what_to_buy: "Augmented Credendum gear (ilvl 660)", notes: "Gear alt jobs for 90-100" },
    { currency: "Allagan Tomestones of Poetics", cap: "2000", priority: "HIGH", what_to_buy: "Thavnairian Onions", notes: "Level your chocobo" },
    { currency: "Allagan Tomestones of Poetics", cap: "2000", priority: "MEDIUM", what_to_buy: "Demicrystals", notes: "Vendor for quick gil" },
    { currency: "Allagan Tomestones of Poetics", cap: "2000", priority: "MEDIUM", what_to_buy: "Grade 8 Dark Matter", notes: "Gear repairs - always useful" },
    { currency: "Allagan Tomestones of Poetics", cap: "2000", priority: "LOW", what_to_buy: "Old relic materials", notes: "If doing old relics for glam" },
    { currency: "Allagan Tomestones of Heliometry", cap: "2000 (450/week)", priority: "SAVE", what_to_buy: "ilvl 740 gear - Weapon first", notes: "Current endgame - Weapon > Chest/Legs > Rest" },
    { currency: "Allagan Tomestones of Heliometry", cap: "2000 (450/week)", priority: "SAVE", what_to_buy: "Upgrade to ilvl 750 with Alliance coins", notes: "Use coins from weekly Alliance raid" },
    { currency: "Allagan Tomestones of Astronomy", cap: "2000", priority: "SPEND", what_to_buy: "ilvl 730 gear for catchup", notes: "Fill gaps or gear alt jobs instantly" },
    { currency: "Sacks of Nuts", cap: "None", priority: "HIGH", what_to_buy: "Aetheryte Tickets", notes: "FREE TELEPORTS - buy stacks!" },
    { currency: "Sacks of Nuts", cap: "None", priority: "HIGH", what_to_buy: "Materia X", notes: "Current tier melding" },
    { currency: "Sacks of Nuts", cap: "None", priority: "MEDIUM", what_to_buy: "Riding Maps", notes: "Faster mount speed in old zones" },
    { currency: "Sacks of Nuts", cap: "None", priority: "LOW", what_to_buy: "Minions/Orchestrions", notes: "For collection" },
    { currency: "Grand Company Seals", cap: "90000", priority: "URGENT", what_to_buy: "Ventures", notes: "For retainers - buy stacks!" },
    { currency: "Grand Company Seals", cap: "90000", priority: "HIGH", what_to_buy: "Aetheryte Tickets", notes: "Free teleports" },
    { currency: "Grand Company Seals", cap: "90000", priority: "MEDIUM", what_to_buy: "Glamour Prisms", notes: "Always need these" },
    { currency: "Grand Company Seals", cap: "90000", priority: "MEDIUM", what_to_buy: "Cordials", notes: "GP recovery for gathering" },
    { currency: "Grand Company Seals", cap: "90000", priority: "MEDIUM", what_to_buy: "Coke", notes: "Crafting mat - sells well on MB" },
    { currency: "MGP", cap: "None", priority: "HIGH", what_to_buy: "Mounts", notes: "Fenrir (1M), Sabotender Emperor (2M)" },
    { currency: "MGP", cap: "None", priority: "MEDIUM", what_to_buy: "Glamour/Cosmetics", notes: "Unique looks" },
    { currency: "MGP", cap: "None", priority: "MEDIUM", what_to_buy: "Emotes", notes: "Fun animations" },
    { currency: "Bicolor Gemstones", cap: "1000", priority: "MEDIUM", what_to_buy: "Crafting materials", notes: "Sell on MB for gil" },
    { currency: "Bicolor Gemstones", cap: "1000", priority: "LOW", what_to_buy: "FATE vouchers", notes: "Trade for mounts/music" },
    { currency: "White Crafters' Scrips", cap: "4000", priority: "HIGH", what_to_buy: "Master Recipe Books", notes: "Unlock recipes" },
    { currency: "Purple Crafters' Scrips", cap: "4000", priority: "HIGH", what_to_buy: "Current tier crafter gear", notes: "ilvl gear for crafting" },
    { currency: "White Gatherers' Scrips", cap: "4000", priority: "HIGH", what_to_buy: "Folklore Books", notes: "Unlock gathering nodes" },
    { currency: "Purple Gatherers' Scrips", cap: "4000", priority: "HIGH", what_to_buy: "Current tier gatherer gear", notes: "ilvl gear for gathering" },
    { currency: "Arcadion Tokens", cap: "None (1/week)", priority: "SAVE", what_to_buy: "ilvl 730 gear pieces", notes: "1 book = Chest/Legs | 2 books + 4 blades = Weapon" },
    { currency: "Wolf Marks", cap: "20000", priority: "MEDIUM", what_to_buy: "PvP Glamour Sets", notes: "Unique armor/weapon skins" },
    { currency: "Wolf Marks", cap: "20000", priority: "LOW", what_to_buy: "Mounts & Minions", notes: "PvP exclusive collectibles" },
    { currency: "Allied Seals", cap: "4000", priority: "MEDIUM", what_to_buy: "ARR Riding Maps", notes: "Faster mounts in 2.0 zones" },
    { currency: "Allied Seals", cap: "4000", priority: "LOW", what_to_buy: "Minions & Glamour", notes: "Old hunt rewards" },
    { currency: "Centurio Seals", cap: "4000", priority: "MEDIUM", what_to_buy: "HW/SB Riding Maps", notes: "Faster mounts in 3.0/4.0 zones" },
    { currency: "Centurio Seals", cap: "4000", priority: "LOW", what_to_buy: "Aetheryte Tickets", notes: "Alternative source" },
    { currency: "Skybuilders' Scrips", cap: "None", priority: "HIGH", what_to_buy: "Pteranodon Mount", notes: "8.4M scrips - the flex mount" },
    { currency: "Skybuilders' Scrips", cap: "None", priority: "MEDIUM", what_to_buy: "Emotes & Glamour", notes: "Unique Ishgard items" }
];

// Currency icons for visual flair
const CURRENCY_ICONS = {
    "Allagan Tomestones of Poetics": "🔵",
    "Allagan Tomestones of Heliometry": "🟣",
    "Allagan Tomestones of Astronomy": "🟠",
    "Sacks of Nuts": "🥜",
    "Grand Company Seals": "🛡️",
    "MGP": "🎰",
    "Bicolor Gemstones": "💎",
    "White Crafters' Scrips": "📜",
    "Purple Crafters' Scrips": "📜",
    "White Gatherers' Scrips": "📜",
    "Purple Gatherers' Scrips": "📜",
    "Arcadion Tokens": "🎫",
    "Wolf Marks": "🐺",
    "Allied Seals": "🦁",
    "Centurio Seals": "⚔️",
    "Skybuilders' Scrips": "🏗️"
};

// Type icons for task filtering
const TYPE_ICONS = {
    "combat": "⚔️",
    "crafting": "🔨",
    "gathering": "⛏️",
    "gold-saucer": "🎰",
    "pvp": "🐺",
    "misc": "📦"
};
