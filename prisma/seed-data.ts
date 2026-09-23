// Sample content for development. Placeholder photographs come from Unsplash
// (https://unsplash.com/license) and are downloaded and optimised by the seed script.
// Replace everything from the admin dashboard.

type Crop = "pano" | "square";
export type SeedPhoto = {
  ref: string; // local reference used below
  unsplash: string;
  crop?: Crop;
  title: string;
  description?: string;
  location: string;
  date: string;
  trip?: string;
  portfolio: string[];
  mountain?: string[];
  featured?: boolean;
  kit?: keyof typeof KITS;
};

export const KITS = {
  land: { camera: "Sony α7 IV", lens: "FE 24-70mm F2.8 GM II", focalLength: "24mm", aperture: "f/8", iso: "100", shutterSpeed: "1/250s" },
  wide: { camera: "Sony α7 IV", lens: "FE 16-35mm F4 G", focalLength: "16mm", aperture: "f/11", iso: "100", shutterSpeed: "1/160s" },
  tele: { camera: "Sony α7 IV", lens: "FE 70-200mm F4 G", focalLength: "135mm", aperture: "f/5.6", iso: "200", shutterSpeed: "1/800s" },
  wild: { camera: "Sony α7 IV", lens: "FE 200-600mm F5.6-6.3 G", focalLength: "600mm", aperture: "f/6.3", iso: "800", shutterSpeed: "1/1600s" },
  night: { camera: "Sony α7 IV", lens: "FE 20mm F1.8 G", focalLength: "20mm", aperture: "f/1.8", iso: "3200", shutterSpeed: "15s" },
  street: { camera: "Fujifilm X100VI", lens: "23mm F2 (fixed)", focalLength: "23mm", aperture: "f/4", iso: "200", shutterSpeed: "1/500s" },
  food: { camera: "Fujifilm X-T5", lens: "XF 33mm F1.4 R LM WR", focalLength: "33mm", aperture: "f/2", iso: "400", shutterSpeed: "1/200s" },
  phone: { camera: "iPhone 15 Pro", lens: "Main camera 24mm", focalLength: "24mm", aperture: "f/1.8", iso: "64", shutterSpeed: "1/900s" },
};

export const CATEGORIES = {
  PORTFOLIO: ["Mountains", "Landscapes", "People", "Street", "Wildlife", "Architecture", "Food", "Sunsets", "Travel"],
  MOUNTAIN: ["Himalayas", "Treks", "Snow", "Sunrises", "Sunsets", "Valleys", "Lakes", "Roads", "Wildlife", "Camping"],
};

export const PHOTOS: SeedPhoto[] = [
  // ── Himachal Pradesh ──
  { ref: "hp-clouds", unsplash: "1506905925346-21bda4d32df4", title: "Above the clouds", description: "Woke at 4:30 to walk up from Jalori Pass. The valley below had vanished under a sea of cloud.", location: "Jalori Pass, Himachal Pradesh", date: "2026-04-15T05:52", trip: "himachal-2026", portfolio: ["Mountains", "Sunsets"], mountain: ["Himalayas", "Sunrises"], featured: true, kit: "land" },
  { ref: "hp-parvati", unsplash: "1626621341517-bbf3d9990a23", title: "Snowline above Solang", location: "Solang Valley, Himachal Pradesh", date: "2026-04-09T11:10", trip: "himachal-2026", portfolio: ["Mountains", "Travel"], mountain: ["Snow", "Treks"], kit: "land" },
  { ref: "hp-river", unsplash: "1581791534721-e599df4417f7", title: "Parvati River at first light", description: "Ice-cold water, pine smell, and the sound that follows you everywhere in Kasol.", location: "Kasol, Himachal Pradesh", date: "2026-04-10T07:05", trip: "himachal-2026", portfolio: ["Landscapes"], mountain: ["Valleys"], featured: true, kit: "wide" },
  { ref: "hp-solang", unsplash: "1593181629936-11c609b8db9b", title: "Snow day at Solang", location: "Solang Valley, Himachal Pradesh", date: "2026-04-09T13:40", trip: "himachal-2026", portfolio: ["People", "Travel"], mountain: ["Snow", "Himalayas"], kit: "land" },
  { ref: "hp-tosh", unsplash: "1434394354979-a235cd36269d", title: "The valley of Tosh", location: "Tosh, Himachal Pradesh", date: "2026-04-12T09:30", trip: "himachal-2026", portfolio: ["Mountains", "Landscapes"], mountain: ["Valleys", "Treks"], kit: "land" },
  { ref: "hp-deodar", unsplash: "1441974231531-c6227db76b6e", title: "Deodar trail", location: "Jibhi, Himachal Pradesh", date: "2026-04-14T16:20", trip: "himachal-2026", portfolio: ["Landscapes"], mountain: ["Treks"], kit: "land" },
  { ref: "hp-tent", unsplash: "1478827536114-da961b7f86d2", title: "Glowing tent, Kheerganga", location: "Kheerganga, Himachal Pradesh", date: "2026-04-11T21:15", trip: "himachal-2026", portfolio: ["Travel"], mountain: ["Camping"], kit: "night" },
  { ref: "hp-camp", unsplash: "1487730116645-74489c95b41b", title: "Camp in the pines", location: "Kasol, Himachal Pradesh", date: "2026-04-10T20:40", trip: "himachal-2026", portfolio: ["Travel"], mountain: ["Camping"], kit: "night" },
  { ref: "hp-cafe", unsplash: "1509042239860-f550ce710b93", title: "Café morning, Old Manali", location: "Old Manali, Himachal Pradesh", date: "2026-04-09T09:00", trip: "himachal-2026", portfolio: ["Food"], kit: "food" },
  { ref: "hp-autumn", unsplash: "1502082553048-f009c37129b9", crop: "square", title: "The lone tree at Shoja", location: "Shoja, Himachal Pradesh", date: "2026-04-16T17:10", trip: "himachal-2026", portfolio: ["Landscapes"], mountain: ["Valleys"], kit: "land" },
  { ref: "hp-pano", unsplash: "1454496522488-7a8e488e8606", crop: "pano", title: "Pir Panjal panorama", description: "Stitched from five frames at Rohtang. Still doesn't fit everything.", location: "Rohtang Pass, Himachal Pradesh", date: "2026-04-18T10:20", trip: "himachal-2026", portfolio: ["Mountains"], mountain: ["Himalayas", "Snow"], featured: true, kit: "tele" },

  // ── Uttarakhand ──
  { ref: "uk-chopta", unsplash: "1464822759023-fed622ff2c3b", title: "Chopta meadows", description: "They call it the mini Switzerland of India. I'd rather Switzerland was called the mini Chopta.", location: "Chopta, Uttarakhand", date: "2026-06-05T08:30", trip: "uttarakhand-2026", portfolio: ["Landscapes", "Mountains"], mountain: ["Valleys", "Himalayas"], featured: true, kit: "land" },
  { ref: "uk-mist", unsplash: "1469474968028-56623f02e42e", title: "Morning mist over Garhwal", location: "Devprayag, Uttarakhand", date: "2026-06-03T06:15", trip: "uttarakhand-2026", portfolio: ["Landscapes"], mountain: ["Sunrises", "Valleys"], kit: "tele" },
  { ref: "uk-summit", unsplash: "1491555103944-7c647fd857e6", title: "Summit of Chandrashila", location: "Chandrashila, Uttarakhand", date: "2026-06-06T07:40", trip: "uttarakhand-2026", portfolio: ["Mountains", "People"], mountain: ["Treks", "Snow"], featured: true, kit: "land" },
  { ref: "uk-tungnath", unsplash: "1544198365-f5d60b6d8190", title: "Peaks glowing above Tungnath", location: "Tungnath, Uttarakhand", date: "2026-06-06T05:10", trip: "uttarakhand-2026", portfolio: ["Mountains"], mountain: ["Treks", "Snow"], kit: "land" },
  { ref: "uk-fog", unsplash: "1418065460487-3e41a6c84dc5", title: "Fog in the oak forest", location: "Chopta, Uttarakhand", date: "2026-06-05T17:45", trip: "uttarakhand-2026", portfolio: ["Landscapes"], kit: "tele" },
  { ref: "uk-layers", unsplash: "1500534314209-a25ddb2bd429", title: "Layers of the Garhwal hills", location: "Auli, Uttarakhand", date: "2026-06-08T18:20", trip: "uttarakhand-2026", portfolio: ["Landscapes", "Sunsets"], mountain: ["Valleys", "Sunsets"], kit: "tele" },
  { ref: "uk-edge", unsplash: "1519904981063-b0cf448d479e", title: "Edge of the world", location: "Auli, Uttarakhand", date: "2026-06-08T09:10", trip: "uttarakhand-2026", portfolio: ["People", "Mountains"], mountain: ["Treks"], kit: "land" },
  { ref: "uk-nandadevi", unsplash: "1486911278844-a81c5267e227", title: "Nanda Devi from Auli", location: "Auli, Uttarakhand", date: "2026-06-09T06:05", trip: "uttarakhand-2026", portfolio: ["Mountains"], mountain: ["Himalayas", "Snow", "Sunrises"], featured: true, kit: "tele" },
  { ref: "uk-road", unsplash: "1520962922320-2038eebab146", title: "Road to Joshimath", location: "Joshimath, Uttarakhand", date: "2026-06-07T15:30", trip: "uttarakhand-2026", portfolio: ["Travel"], mountain: ["Roads"], kit: "land" },

  // ── Ladakh ──
  { ref: "la-pangong", unsplash: "1465056836041-7f43ac27dcb5", title: "Pangong at dusk", description: "Four thousand two hundred metres up, and the lake still changes colour every ten minutes.", location: "Pangong Tso, Ladakh", date: "2025-07-17T19:05", trip: "ladakh-2025", portfolio: ["Landscapes", "Mountains"], mountain: ["Lakes", "Himalayas"], featured: true, kit: "wide" },
  { ref: "la-steppe", unsplash: "1486870591958-9b9d0d1dda99", title: "Peaks above the golden steppe", location: "Hanle, Ladakh", date: "2025-07-20T16:40", trip: "ladakh-2025", portfolio: ["Mountains"], mountain: ["Himalayas"], kit: "land" },
  { ref: "la-sky", unsplash: "1485160497022-3e09382fb310", title: "Burning sky over Nubra", location: "Nubra Valley, Ladakh", date: "2025-07-13T19:20", trip: "ladakh-2025", portfolio: ["Sunsets"], mountain: ["Sunsets", "Valleys"], kit: "land" },
  { ref: "la-ridge", unsplash: "1508739773434-c26b3d09e071", title: "Last light on the ridge", location: "Chang La, Ladakh", date: "2025-07-16T19:30", trip: "ladakh-2025", portfolio: ["Mountains", "Sunsets"], mountain: ["Sunsets"], kit: "tele" },
  { ref: "la-highway", unsplash: "1500530855697-b586d89ba3ee", title: "The empty highway", description: "Manali–Leh. Four hundred and thirty kilometres, five passes, zero network.", location: "Manali–Leh Highway, Ladakh", date: "2025-07-11T14:00", trip: "ladakh-2025", portfolio: ["Travel", "Street"], mountain: ["Roads"], featured: true, kit: "land" },
  { ref: "la-milkyway", unsplash: "1519681393784-d120267933ba", title: "Milky Way over Hanle", description: "Hanle is a dark-sky reserve. Your eyes adjust and suddenly there are more stars than sky.", location: "Hanle, Ladakh", date: "2025-07-20T23:40", trip: "ladakh-2025", portfolio: ["Landscapes", "Mountains"], mountain: ["Himalayas", "Camping"], featured: true, kit: "night" },
  { ref: "la-stok", unsplash: "1536431311719-398b6704d4cc", title: "Stok Kangri by moonlight", location: "Leh, Ladakh", date: "2025-07-12T08:15", trip: "ladakh-2025", portfolio: ["Mountains"], mountain: ["Snow", "Himalayas"], featured: true, kit: "night" },
  { ref: "la-moriri", unsplash: "1501785888041-af3ef285b470", title: "Tso Moriri blue", location: "Tso Moriri, Ladakh", date: "2025-07-21T11:30", trip: "ladakh-2025", portfolio: ["Landscapes"], mountain: ["Lakes"], kit: "wide" },
  { ref: "la-fox", unsplash: "1474511320723-9a56873867b5", title: "Red fox, Changthang", description: "It watched us for a full minute, decided we were boring, and trotted off.", location: "Changthang, Ladakh", date: "2025-07-19T07:20", trip: "ladakh-2025", portfolio: ["Wildlife"], mountain: ["Wildlife"], featured: true, kit: "wild" },
  { ref: "la-galaxy", unsplash: "1517824806704-9040b037703b", title: "Tent under the galaxy", location: "Tso Moriri, Ladakh", date: "2025-07-21T22:50", trip: "ladakh-2025", portfolio: ["Travel"], mountain: ["Camping"], kit: "night" },

  // ── Rajasthan ──
  { ref: "rj-hawa", unsplash: "1477587458883-47145ed94245", title: "Hawa Mahal morning", description: "953 windows, and every one of them catching the first light.", location: "Jaipur, Rajasthan", date: "2025-11-14T08:10", trip: "rajasthan-2025", portfolio: ["Architecture", "Street"], featured: true, kit: "street" },
  { ref: "rj-amer", unsplash: "1599661046289-e31897846e41", title: "Amer Fort stairs", location: "Amer, Rajasthan", date: "2025-11-15T10:20", trip: "rajasthan-2025", portfolio: ["Architecture"], kit: "street" },
  { ref: "rj-thali", unsplash: "1585937421612-70a008356fbe", title: "Rajasthani thali", location: "Jodhpur, Rajasthan", date: "2025-11-16T13:30", trip: "rajasthan-2025", portfolio: ["Food"], kit: "food" },
  { ref: "rj-dunes", unsplash: "1510312305653-8ed496efae75", title: "Desert camp at sunset", location: "Sam Sand Dunes, Rajasthan", date: "2025-11-19T17:40", trip: "rajasthan-2025", portfolio: ["Sunsets", "Travel"], mountain: ["Camping"], kit: "land" },
  { ref: "rj-gadisar", unsplash: "1495616811223-4d98c6e9c869", title: "Sunset at Gadisar Lake", location: "Jaisalmer, Rajasthan", date: "2025-11-18T17:55", trip: "rajasthan-2025", portfolio: ["Sunsets"], kit: "tele" },

  // ── Goa ──
  { ref: "ga-palolem", unsplash: "1512343879784-a960bf40e7f2", title: "Palolem, turquoise", location: "Palolem, Goa", date: "2024-12-24T11:00", trip: "goa-2024", portfolio: ["Travel", "Landscapes"], featured: true, kit: "land" },
  { ref: "ga-anjuna", unsplash: "1507525428034-b723cf961d3e", title: "Golden hour at Anjuna", location: "Anjuna, Goa", date: "2024-12-21T17:50", trip: "goa-2024", portfolio: ["Sunsets"], kit: "land" },
  { ref: "ga-sea", unsplash: "1470071459604-3b5ec3a7fe05", title: "Cliffs over the Arabian Sea", location: "Vagator, Goa", date: "2024-12-22T07:30", trip: "goa-2024", portfolio: ["Landscapes"], kit: "wide" },
  { ref: "ga-palms", unsplash: "1476514525535-07fb3b4ae5f1", title: "Boat across the lagoon", location: "Divar Island, Goa", date: "2024-12-25T15:10", trip: "goa-2024", portfolio: ["Travel"], kit: "land" },
  { ref: "ga-aerial", unsplash: "1447752875215-b2761acb3c5d", title: "Walkway through the mangroves", location: "Chorão Island, Goa", date: "2024-12-26T09:40", trip: "goa-2024", portfolio: ["Travel", "Landscapes"], kit: "wide" },
  { ref: "ga-blue", unsplash: "1475924156734-496f6cac6ec1", title: "Blue hour, Vagator", location: "Dudhsagar, Goa", date: "2024-12-23T18:30", trip: "goa-2024", portfolio: ["Sunsets"], kit: "land" },

  // ── Sikkim ──
  { ref: "sk-kanchen", unsplash: "1549880338-65ddcdfd017b", title: "Kanchenjunga at dawn", description: "The third-highest mountain on Earth, turning pink one ridge at a time.", location: "Pelling, Sikkim", date: "2024-04-12T05:20", trip: "sikkim-2024", portfolio: ["Mountains", "Sunsets"], mountain: ["Himalayas", "Sunrises"], featured: true, kit: "tele" },
  { ref: "sk-stupa", unsplash: "1544735716-392fe2489ffa", title: "Monastery below the peaks", location: "Lachung, Sikkim", date: "2024-04-09T10:45", trip: "sikkim-2024", portfolio: ["Architecture", "Mountains"], mountain: ["Himalayas"], kit: "land" },
  { ref: "sk-zero", unsplash: "1458668383970-8ddd3927deed", title: "Peaks above the clouds", location: "Zero Point, Sikkim", date: "2024-04-10T09:15", trip: "sikkim-2024", portfolio: ["Mountains"], mountain: ["Snow", "Himalayas"], featured: true, kit: "tele" },
  { ref: "sk-yumthang", unsplash: "1455156218388-5e61b526818b", title: "Frozen reflections, Yumthang", location: "Yumthang Valley, Sikkim", date: "2024-04-10T13:00", trip: "sikkim-2024", portfolio: ["Landscapes"], mountain: ["Lakes", "Snow", "Valleys"], kit: "wide" },
  { ref: "sk-snowfall", unsplash: "1491002052546-bf38f186af56", title: "First snowfall in Lachung", location: "Lachung, Sikkim", date: "2024-04-09T16:30", trip: "sikkim-2024", portfolio: ["Landscapes"], mountain: ["Snow"], kit: "land" },
  { ref: "sk-frost", unsplash: "1478265409131-1f65c88f965c", title: "Frost on the window", location: "Lachung, Sikkim", date: "2024-04-10T06:10", trip: "sikkim-2024", portfolio: ["Travel"], mountain: ["Snow"], kit: "food" },
  { ref: "sk-bluehour", unsplash: "1483728642387-6c3bdd6c93e5", title: "Blue hour on the range", location: "Gangtok, Sikkim", date: "2024-04-06T18:40", trip: "sikkim-2024", portfolio: ["Mountains"], mountain: ["Himalayas"], kit: "tele" },
  { ref: "sk-ridge", unsplash: "1504870712357-65ea720d6078", title: "Knife-edge ridge", location: "Tsomgo, Sikkim", date: "2024-04-07T12:20", trip: "sikkim-2024", portfolio: ["Mountains"], mountain: ["Himalayas", "Treks"], kit: "tele" },

  // ── Meghalaya ──
  { ref: "mg-falls", unsplash: "1433086966358-54859d0ed716", title: "Waterfall in the rain", description: "Sohra is one of the wettest places on Earth. We did not bring enough socks.", location: "Cherrapunji, Meghalaya", date: "2023-11-12T11:30", trip: "meghalaya-2023", portfolio: ["Landscapes"], featured: true, kit: "wide" },
  { ref: "mg-bridge", unsplash: "1523712999610-f77fbcfc3843", title: "Morning light in the sacred grove", location: "Mawphlang, Meghalaya", date: "2023-11-14T08:20", trip: "meghalaya-2023", portfolio: ["Landscapes"], kit: "land" },
  { ref: "mg-hills", unsplash: "1472214103451-9374bd1c798e", title: "Hills of Sohra", location: "Sohra, Meghalaya", date: "2023-11-13T17:15", trip: "meghalaya-2023", portfolio: ["Landscapes", "Sunsets"], mountain: ["Valleys"], kit: "land" },
  { ref: "mg-canopy", unsplash: "1473773508845-188df298d2d1", title: "Rainforest canopy", location: "Nongriat, Meghalaya", date: "2023-11-15T10:00", trip: "meghalaya-2023", portfolio: ["Landscapes"], kit: "wide" },
  { ref: "mg-blossom", unsplash: "1462275646964-a0e3386b89fa", title: "Cherry blossoms, Shillong", location: "Shillong, Meghalaya", date: "2023-11-11T14:30", trip: "meghalaya-2023", portfolio: ["Landscapes"], kit: "tele" },
  { ref: "mg-cliffs", unsplash: "1542224566-6e85f2e6772f", title: "Green cliffs at sundown", location: "Sohra, Meghalaya", date: "2023-11-13T17:40", trip: "meghalaya-2023", portfolio: ["Landscapes", "Sunsets"], mountain: ["Valleys", "Sunsets"], kit: "land" },

  // ── Not part of a single trip ──
  { ref: "x-elephant", unsplash: "1549366021-9f761d450615", title: "Tusker in the sal forest", location: "Jim Corbett National Park, Uttarakhand", date: "2025-03-08T06:50", portfolio: ["Wildlife"], mountain: ["Wildlife"], featured: true, kit: "wild" },
  { ref: "x-butterchicken", unsplash: "1565557623262-b51c2513a641", title: "Late-night butter chicken", location: "Old Delhi", date: "2025-11-13T22:30", portfolio: ["Food"], kit: "food" },
  { ref: "x-crew", unsplash: "1529156069898-49953e39b3ac", title: "The crew", location: "Rishikesh, Uttarakhand", date: "2026-06-02T18:00", portfolio: ["People"], kit: "street" },
  { ref: "x-sunrisecrew", unsplash: "1511632765486-a01980e01a18", title: "Waiting for the sun", location: "Chandrashila, Uttarakhand", date: "2026-06-06T05:35", portfolio: ["People", "Sunsets"], mountain: ["Sunrises", "Treks"], kit: "land" },
  { ref: "x-lake", unsplash: "1439853949127-fa647821eba0", title: "Mirror lake", location: "Chandratal, Himachal Pradesh", date: "2025-09-20T07:10", portfolio: ["Landscapes", "Mountains"], mountain: ["Lakes", "Himalayas"], featured: true, kit: "wide" },
  { ref: "x-nightpeak", unsplash: "1480497490787-505ec076689f", title: "Glacier lake, Kinnaur", location: "Kinnaur, Himachal Pradesh", date: "2025-09-18T12:00", portfolio: ["Landscapes"], mountain: ["Lakes", "Snow"], kit: "land" },
  { ref: "x-valley", unsplash: "1506744038136-46273834b3fb", title: "Pink dawn in the valley", location: "Kinnaur, Himachal Pradesh", date: "2025-09-19T05:50", portfolio: ["Landscapes", "Sunsets"], mountain: ["Valleys", "Sunrises"], kit: "land" },
  { ref: "x-cabin", unsplash: "1470770841072-f978cf4d019e", title: "The house by the lake", location: "Sangla, Himachal Pradesh", date: "2025-09-21T16:30", portfolio: ["Architecture", "Landscapes"], mountain: ["Lakes"], kit: "land" },
  { ref: "x-granite", unsplash: "1426604966848-d7adac402bff", title: "Granite walls of Gangotri", location: "Gangotri, Uttarakhand", date: "2025-05-10T09:30", portfolio: ["Mountains"], mountain: ["Himalayas", "Treks"], kit: "tele" },
  { ref: "x-stars", unsplash: "1502657877623-f66bf489d236", title: "Stars over the valley", location: "Spiti Valley, Himachal Pradesh", date: "2025-09-22T23:10", portfolio: ["Landscapes"], mountain: ["Camping"], kit: "night" },
  { ref: "x-peakpano", unsplash: "1516655855035-d5215bcb5604", crop: "pano", title: "Suraj Tal panorama", location: "Suraj Tal, Himachal Pradesh", date: "2025-09-23T08:00", portfolio: ["Mountains"], mountain: ["Lakes", "Himalayas"], kit: "tele" },
];

// Extra images used only by memories / settings
export const EXTRA_IMAGES: Record<string, string> = {
    van: "1469854523086-cc02fe5d8800",
  latte: "1495474472287-4d71bcdd2085",
  roadside: "1470071459604-3b5ec3a7fe05",
  coffee: "1509042239860-f550ce710b93",
  tentview: "1504280390367-361c6d9f38f4",
  thali: "1565557623262-b51c2513a641",
  friends2: "1529156069898-49953e39b3ac",
  profile: "1519904981063-b0cf448d479e",
};

export const TRIPS = [
  {
    slug: "himachal-2026",
    title: "Himachal Pradesh",
    region: "Himachal Pradesh",
    tagline: "Where the mountains taught me to slow down.",
    excerpt: "Twelve days of pine forests, river camps and passes above the clouds — from Manali's cafés to the quiet villages of the Tirthan valley.",
    start: "2026-04-08",
    end: "2026-04-19",
    places: ["Manali", "Solang Valley", "Kasol", "Tosh", "Kheerganga", "Jibhi", "Jalori Pass", "Shoja"],
    lat: 32.2432,
    lng: 77.1892,
    featured: true,
    cover: "hp-river",
    story: `## Why I went

I had been staring at spreadsheets for eleven months. One Friday night I booked an overnight Volvo to Manali with no return ticket and a very loose plan: go north, stop when something looks beautiful, repeat.

## Places visited

Old Manali first, for its slow cafés and apple orchards. Then Solang for the last of the spring snow, and down into the **Parvati valley** — Kasol, Tosh and the steep hike to Kheerganga. The last few days were in **Jibhi and Shoja**, where the Tirthan river is so clear you can count the stones.

## People I met

A retired schoolteacher in Tosh who has watched the same peak every morning for forty years and says it has never looked the same twice. Two sisters from Pune walking the whole valley on foot. A café owner who played the same Bob Dylan record on loop and refused all requests.

## Food

Siddu with ghee in Jibhi. Rajma chawal at a dhaba on the way to Tosh that tasted better than it had any right to. Far too many cinnamon rolls in Old Manali.

## Adventures

The climb to Kheerganga took longer than planned because I kept stopping to take photographs. The reward was a natural hot spring at 2,950 metres and a sky full of stars.

## Funny moments

I spent twenty minutes photographing a "rare Himalayan bird" in Jibhi. It was a very ordinary pigeon, and the whole homestay knew it.

## Difficult moments

A landslide closed the road to Jalori for half a day. We sat in the car, rationed biscuits, and learned the lyrics to every song on one playlist.

> The mountains are not in a hurry. After a week, neither was I.

## Favourite memories

Walking up to Jalori Pass in the dark and watching the valley below disappear under a sea of cloud as the sun came up. I didn't take a photo for the first five minutes. Then I took two hundred.`,
  },
  {
    slug: "uttarakhand-2026",
    title: "Uttarakhand",
    region: "Uttarakhand",
    tagline: "Roads, rivers and endless Himalayan views.",
    excerpt: "From the ghats of Rishikesh to sunrise on Chandrashila and Nanda Devi from Auli — ten days along the Ganga and into Garhwal.",
    start: "2026-06-02",
    end: "2026-06-11",
    places: ["Rishikesh", "Devprayag", "Chopta", "Tungnath", "Chandrashila", "Auli", "Joshimath", "Valley of Flowers"],
    lat: 30.4897,
    lng: 79.2166,
    featured: true,
    cover: "uk-chopta",
    story: `## Why I went

A friend said the sunrise from Chandrashila was the best in India. I said that was a bold claim. Two weeks later, four of us were in a rented car heading up the Ganga.

## Places visited

Rishikesh, then **Devprayag** where the Alaknanda and Bhagirathi meet in two different colours. Up to the meadows of Chopta, the trek to **Tungnath and Chandrashila**, then Auli and Joshimath, finishing in the Valley of Flowers.

## People I met

A group of pilgrims in their seventies who overtook us on the Tungnath trail, chanting, and waited at the top to offer us prasad. A forest guard who knew every bird call in the valley.

## Food

Aloo ke gutke and bhang ki chutney in Chopta. Maggi at 3,500 metres, which is a spiritual experience of its own.

## Adventures

The 4 a.m. start to Chandrashila in the snow, headlamps bobbing, nobody talking. Then the whole Garhwal range lit up at once — Nanda Devi, Trishul, Chaukhamba.

## Funny moments

We took fourteen group photos in Rishikesh before getting one where everyone's eyes were open. It's still slightly blurry.

## Difficult moments

The rain in the Valley of Flowers turned the trail into a river. We turned back halfway and I sulked for an hour.

## Favourite memories

Sitting on the summit of Chandrashila with cold hands around a thermos of chai, waiting for the sun, with the people I love most.`,
  },
  {
    slug: "ladakh-2025",
    title: "Ladakh",
    region: "Ladakh",
    tagline: "High roads. Cold deserts. Unforgettable moments.",
    excerpt: "Fifteen days on the roof of the world — Khardung La, Nubra's dunes, Pangong at dusk and the dark skies of Hanle.",
    start: "2025-07-10",
    end: "2025-07-24",
    places: ["Leh", "Khardung La", "Nubra Valley", "Turtuk", "Pangong Tso", "Chang La", "Hanle", "Tso Moriri"],
    lat: 34.1526,
    lng: 77.5771,
    featured: true,
    cover: "la-pangong",
    story: `## Why I went

Every mountain lover has Ladakh on the list. I had put it off for years because it felt too big. In the end I stopped waiting to feel ready.

## Places visited

Leh to acclimatise, over **Khardung La** into the Nubra valley and the apricot orchards of Turtuk, then Pangong, Chang La, and the long, empty drive to **Hanle** and **Tso Moriri**.

## People I met

A nomadic family near Tso Moriri who invited us in for butter tea. Two cyclists from Kerala riding the whole Manali–Leh highway — we still text every week.

## Food

Thukpa every single night. Skyu, a Ladakhi pasta stew, in a homestay kitchen in Turtuk. Apricots straight off the tree.

## Adventures

Watching the Milky Way rise over the observatory at Hanle, a dark-sky reserve where you can see your own shadow by starlight.

## Funny moments

A yak blocked the road near Chang La for twenty minutes and showed absolutely no interest in our horn.

## Difficult moments

Altitude sickness on the second night at Pangong. Headache, no appetite, no sleep. Water, rest, and patience fixed it — and a lesson in going slow.

## Favourite memories

A red fox at dawn in the Changthang plateau, watching us for a full minute before trotting off into the golden grass.`,
  },
  {
    slug: "rajasthan-2025",
    title: "Rajasthan",
    region: "Rajasthan",
    tagline: "Golden forts and desert sunsets.",
    excerpt: "A different kind of landscape — pink city mornings, blue city lanes and a night under the stars in the Thar.",
    start: "2025-11-14",
    end: "2025-11-21",
    places: ["Jaipur", "Amer", "Jodhpur", "Jaisalmer", "Sam Sand Dunes"],
    lat: 26.9124,
    lng: 75.7873,
    featured: false,
    cover: "rj-hawa",
    story: `## Why I went

To see if someone who only photographs mountains could fall for the desert. (Spoiler: yes.)

## Places visited

Jaipur and Amer, the blue lanes of Jodhpur, the golden fort of Jaisalmer, and a night at the Sam sand dunes.

## People I met

A puppeteer in Jaisalmer whose family has made the same wooden puppets for six generations.

## Food

Dal baati churma, laal maas, and the best kachori of my life at a stall with no name.

## Adventures

Walking the ramparts of Mehrangarh at sunset with the whole blue city below.

## Funny moments

A camel named Michael Jackson. Nobody would explain why.

## Difficult moments

The heat at noon, even in November. We learned to rest like the locals.

## Favourite memories

Gadisar Lake at sunset — the moment the sun touched the water, everyone went quiet.`,
  },
  {
    slug: "goa-2024",
    title: "Goa",
    region: "Goa",
    tagline: "Salt, sun and slow afternoons.",
    excerpt: "The year ended on the coast: quiet beaches in the south, Portuguese lanes in Panjim and sunsets over the Arabian Sea.",
    start: "2024-12-20",
    end: "2024-12-27",
    places: ["Anjuna", "Vagator", "Palolem", "Fontainhas", "Divar Island"],
    lat: 15.2993,
    lng: 74.124,
    featured: false,
    cover: "ga-palolem",
    story: `## Why I went

A break from the cold. Friends, the sea, and no alarms.

## Places visited

Anjuna and Vagator in the north, the colourful lanes of Fontainhas, a ferry to Divar Island, and the calm crescent of Palolem.

## People I met

A fisherman in Palolem who showed us how to read the tides from the colour of the water.

## Food

Prawn curry rice, bebinca, and poi bread still warm from the bakery.

## Adventures

Kayaking through the mangroves at sunrise.

## Funny moments

Losing a flip-flop to the Arabian Sea and walking home with one.

## Difficult moments

Christmas traffic in the north. We escaped south and never went back.

## Favourite memories

Every single sunset. We stopped whatever we were doing to watch them.`,
  },
  {
    slug: "sikkim-2024",
    title: "Sikkim",
    region: "Sikkim",
    tagline: "Prayer flags and Kanchenjunga at dawn.",
    excerpt: "Monasteries, frozen lakes and the first snowfall of my life — ten days in the eastern Himalaya.",
    start: "2024-04-05",
    end: "2024-04-14",
    places: ["Gangtok", "Tsomgo Lake", "Nathula", "Lachung", "Yumthang Valley", "Zero Point", "Pelling"],
    lat: 27.533,
    lng: 88.5122,
    featured: false,
    cover: "sk-kanchen",
    story: `## Why I went

To see Kanchenjunga with my own eyes.

## Places visited

Gangtok, Tsomgo Lake, Nathula, the rhododendron valleys of Lachung and Yumthang, Zero Point, and finally Pelling for the view.

## People I met

A young monk in Pelling who wanted to know everything about cricket.

## Food

Momos, thukpa, and sha phaley. Hot tongba on a cold evening.

## Adventures

Standing at Zero Point at 4,700 metres with snow up to my knees.

## Funny moments

Our driver sang old Hindi songs for five hours straight. By day three we were singing along.

## Difficult moments

Roads closed for snow; we waited a day in Lachung. It turned into my favourite day of the trip.

## Favourite memories

My first snowfall, in Lachung. I forgot to take a photo for ten whole minutes.`,
  },
  {
    slug: "meghalaya-2023",
    title: "Meghalaya",
    region: "Meghalaya",
    tagline: "Where the clouds come home.",
    excerpt: "Living root bridges, waterfalls in the rain and cherry blossom season in Shillong.",
    start: "2023-11-10",
    end: "2023-11-17",
    places: ["Shillong", "Cherrapunji", "Nongriat", "Mawlynnong", "Dawki"],
    lat: 25.5788,
    lng: 91.8933,
    featured: false,
    cover: "mg-falls",
    story: `## Why I went

Cherry blossoms in India? I had to see it.

## Places visited

Shillong, Sohra (Cherrapunji), the double-decker root bridge at Nongriat, Mawlynnong and the glass-clear river at Dawki.

## People I met

A Khasi grandmother who explained how root bridges are grown over generations, not built.

## Food

Jadoh, smoked pork with bamboo shoot, and far too much tea.

## Adventures

The 3,500 steps down to Nongriat. And the 3,500 steps back up.

## Funny moments

Every "it won't rain today" was followed immediately by rain.

## Difficult moments

Wet socks. For eight days.

## Favourite memories

Pink cherry blossoms against a grey monsoon sky in Shillong.`,
  },
];

export const MEMORIES = [
  { img: "x-sunrisecrew", caption: "Four of us, one thermos of chai, and the sun taking its sweet time.", title: "Sunrise with friends", location: "Chandrashila, Uttarakhand", date: "2026-06-06", trip: "uttarakhand-2026" },
  { img: "hp-camp", caption: "Someone brought a guitar nobody could play. Best concert of the year.", title: "Campfire night", location: "Kasol, Himachal Pradesh", date: "2026-04-10", trip: "himachal-2026" },
  { img: "extra:van", caption: "Seven hours of the same five songs. Nobody complained.", title: "Road trip", location: "Manali–Leh Highway", date: "2025-07-11", trip: "ladakh-2025" },
  { img: "extra:latte", caption: "Old Manali cafés have a way of turning ‘one coffee’ into an entire afternoon.", title: "Mountain café", location: "Old Manali, Himachal Pradesh", date: "2026-04-09", trip: "himachal-2026" },
  { img: "extra:roadside", caption: "We stopped the car just because the clouds looked unreal.", title: "Roadside stop", location: "Jalori Pass, Himachal Pradesh", date: "2026-04-15", trip: "himachal-2026" },
  { img: "extra:friends2", caption: "Fourteen photos to get one where everyone had their eyes open.", title: "Funny moment", location: "Rishikesh, Uttarakhand", date: "2026-06-02", trip: "uttarakhand-2026" },
  { img: "rj-gadisar", caption: "The lake went silent the moment the sun touched the water.", title: "Sunset", location: "Gadisar Lake, Jaisalmer", date: "2025-11-18", trip: "rajasthan-2025" },
  { img: "sk-snowfall", caption: "First snowfall of my life. I forgot to take a photo for ten whole minutes.", title: "First snowfall", location: "Lachung, Sikkim", date: "2024-04-09", trip: "sikkim-2024" },
  { img: "extra:thali", caption: "The aunty at the dhaba refused to let us leave until we'd had seconds. And thirds.", title: "Local food", location: "Jodhpur, Rajasthan", date: "2025-11-16", trip: "rajasthan-2025" },
  { img: "extra:coffee", caption: "Met two cyclists from Kerala at a chai stop. We still text every week.", title: "New friends", location: "Leh, Ladakh", date: "2025-07-14", trip: "ladakh-2025" },
  { img: "la-galaxy", caption: "Lay on the frozen ground for an hour counting satellites.", title: "Stargazing", location: "Tso Moriri, Ladakh", date: "2025-07-21", trip: "ladakh-2025" },
  { img: "extra:tentview", caption: "Waking up to this view makes the frozen toes worth it.", title: "Morning in the tent", location: "Tosh, Himachal Pradesh", date: "2026-04-12", trip: "himachal-2026" },
];

export const STORIES = [
  {
    slug: "the-road-to-spiti",
    title: "The Road to Spiti",
    excerpt: "Four hundred kilometres of broken road, river crossings and the emptiest, most beautiful valley I've ever driven into.",
    location: "Spiti Valley, Himachal Pradesh",
    date: "2025-10-02",
    cover: "x-stars",
    trip: null,
    tags: ["spiti", "road trip", "himalaya", "himachal"],
    photos: ["x-lake", "x-nightpeak", "x-valley", "x-cabin", "x-stars", "x-peakpano"],
    content: `There is a point, somewhere after Kinnaur, where the green simply runs out. The pine forests thin, the apple orchards stop, and the mountains turn the colour of old paper. That is where the road to Spiti really begins.

## Kinnaur first

We came in the long way, from Shimla, following the Sutlej up through Kinnaur. Sangla was still green and loud with water. We spent a night in a wooden house by a lake that looked like it had been painted onto the valley, and woke to pink light on the peaks.

## The broken road

After Pooh the tarmac becomes a suggestion. There are sections where the road is just a ledge cut into loose rock, with the river several hundred metres straight down. You learn to stop talking on these stretches. You learn to trust the driver coming the other way.

> Spiti doesn't let you rush it. The road decides your speed, and the altitude decides your mood.

## Chandratal

The lake sits at 4,300 metres, perfectly still in the early morning, reflecting every ridge around it. We arrived at dawn after a freezing night in a tent, and for a while nobody picked up a camera.

## Stars

The real reason to come to Spiti is the night. With no towns and no light, the sky is so full that the Milky Way casts a faint glow on the ground. I set up the tripod, pointed it vaguely upward, and let the valley do the rest.

## What I'd tell you

- Go in September, after the monsoon and before the passes close.
- Carry cash, spare fuel and patience.
- Spend at least two nights in Kaza to acclimatise.
- Don't try to see everything. Spiti rewards staying still.`,
  },
  {
    slug: "a-morning-above-the-clouds",
    title: "A Morning Above the Clouds",
    excerpt: "A 4:30 a.m. alarm, a frozen walk up from Jalori Pass, and a valley that disappeared under a sea of cloud.",
    location: "Jalori Pass, Himachal Pradesh",
    date: "2026-04-28",
    cover: "hp-clouds",
    trip: "himachal-2026",
    tags: ["sunrise", "himachal", "clouds"],
    photos: ["hp-clouds", "hp-deodar", "hp-autumn"],
    content: `The alarm went off at 4:30 and every part of me wanted to ignore it. Outside the homestay in Shoja it was black and silent and very, very cold.

## The walk up

From Jalori Pass it is a short walk up through oak and rhododendron to a clearing on the ridge. In the dark it felt much longer. Our headlamps caught frost on the leaves and the occasional pair of eyes that we decided, collectively, not to think about.

## Then the light

We reached the ridge just as the sky began to turn. Below us, where the valley should have been, there was only cloud — a white ocean stretching all the way to the far peaks, with the summits floating on top like islands.

> For a few minutes there was no sound at all, except a crow somewhere below us, and the click of a shutter.

## Why it matters

I've been chasing this feeling for years: being somewhere early enough, and quiet enough, that the world puts on a show for no one in particular. You can't plan it. You can only turn up, again and again, and hope.

This time, it happened.`,
  },
  {
    slug: "why-i-keep-going-back-to-the-mountains",
    title: "Why I Keep Going Back to the Mountains",
    excerpt: "It isn't the views. Or it isn't only the views.",
    location: "The Himalaya",
    date: "2026-07-15",
    cover: "uk-summit",
    trip: null,
    tags: ["himalaya", "reflections", "mountains"],
    photos: ["uk-summit", "uk-nandadevi", "la-stok", "sk-kanchen"],
    content: `People ask me why I keep going back to the mountains, as if one visit should have been enough. I never have a good answer ready, so here is a slow one.

## They make everything smaller

In the city my problems feel enormous. At 4,000 metres, under a peak that has been standing for fifty million years, they shrink to their real size.

## They make everything slower

You can't hurry uphill. Your lungs won't let you. So you walk, stop, breathe, look around — and you start noticing the things you'd have walked straight past.

## They make people kinder

Strangers share food at dhabas. Drivers wave you through narrow bends. Someone always has an extra pair of gloves.

> Mountains don't care who you are. That is exactly why they are so good for you.

## They are never the same twice

The same ridge at dawn, at noon, in snow, in cloud — four different mountains. I could photograph one view for a lifetime and never run out.

So I'll keep going back. Not to conquer anything. Just to stand there for a while, and remember how to breathe.`,
  },
  {
    slug: "10-days-in-himachal",
    title: "10 Days in Himachal",
    excerpt: "An honest, unhurried itinerary through Manali, the Parvati valley and the Tirthan valley — with the mistakes I made so you don't have to.",
    location: "Himachal Pradesh",
    date: "2026-04-25",
    cover: "hp-tosh",
    trip: "himachal-2026",
    tags: ["itinerary", "himachal", "travel guide", "manali", "kasol"],
    photos: ["hp-river", "hp-solang", "hp-tosh", "hp-tent", "hp-cafe", "hp-pano"],
    content: `This is the route I'd give a friend: slow enough to enjoy, varied enough to surprise you, and flexible enough to survive a landslide.

## Days 1–3: Manali and Solang

Arrive by overnight bus and sleep it off in **Old Manali**. Walk the orchards, visit Hadimba temple early before the crowds, and spend a day in Solang for the snow. Eat cinnamon rolls. Eat more cinnamon rolls.

## Days 4–6: The Parvati valley

Base yourself in **Kasol**, then walk up to **Tosh** for the views and do the hike to **Kheerganga**. Stay the night at the top if you can — the hot spring under the stars is the whole point.

## Days 7–9: Jibhi and Shoja

Drive south to the **Tirthan valley**. Jibhi is all wooden houses and waterfalls; Shoja is quieter and higher. Walk to Jalori Pass for sunrise (see *A Morning Above the Clouds*).

## Day 10: Slow return

Leave time for the drive back. Roads in the hills keep their own schedule.

## Things I got wrong

- I packed for summer. April nights are cold — bring a proper down jacket.
- I tried to do Kheerganga as a day hike. Don't.
- I didn't carry enough cash. Many places have no signal for UPI.`,
  },
  {
    slug: "the-most-beautiful-sunrise-ive-seen",
    title: "The Most Beautiful Sunrise I've Seen",
    excerpt: "Kanchenjunga, from a hotel balcony in Pelling, at 5:10 in the morning.",
    location: "Pelling, Sikkim",
    date: "2024-05-01",
    cover: "sk-kanchen",
    trip: "sikkim-2024",
    tags: ["sunrise", "sikkim", "kanchenjunga"],
    photos: ["sk-kanchen", "sk-bluehour", "sk-zero"],
    content: `We had been in Sikkim for a week and Kanchenjunga had not shown itself once. Cloud, every single morning.

## The last morning

On our final day in Pelling I set an alarm for 4:45 out of pure stubbornness. When I opened the curtain the sky was clear. Completely clear.

## Pink, then gold

The first light touched the very summit — the third-highest point on Earth — and turned it pink. Then the colour slid slowly down the ridges, one by one, until the whole massif was glowing gold above a valley still in deep blue shadow.

> I've seen a lot of sunrises. This is the one I'll describe to my grandchildren.

## What I learned

Sometimes the mountains make you wait. Turn up anyway.`,
  },
];

export const SETTINGS = {
  heroText: "Travel. Explore. Capture. Repeat.\nLifeInPeaks is my journal of unforgettable journeys, breathtaking views and stories that stay forever.",
  heroAside: "Good Views, Brighter Days",
  quote: "Not all classrooms have four walls.",
  intro:
    "I travel to places that make me stop, breathe, and look around.\nThrough my camera, I try to preserve the moments that I never want to forget.",
  aboutIntro: "I'm a traveller, mountain lover and photographer who enjoys collecting stories from the road.",
  aboutBio: `I took my first real photograph on a borrowed camera on a school trip to Mussoorie. It was out of focus and slightly crooked, and I've been chasing that feeling ever since.

These days I spend my weekdays at a desk and my holidays somewhere above 3,000 metres. I travel slowly, mostly by road, and I'd rather spend three days in one valley than three hours in ten.

This website is my travel journal — a place to keep the photographs, the stories, and the small, happy moments in between.

**What's in my bag:** Sony α7 IV, a 24-70, a 70-200, a small tripod, and far too many snacks.`,
  stats: [
    { label: "Trips", value: "20+" },
    { label: "Places", value: "50+" },
    { label: "Photos", value: "5,000+" },
    { label: "Mountains", value: "Countless" },
  ],
  instagramUsername: "lifeinpeaks",
  facebookUrl: "https://facebook.com/lifeinpeaks",
  youtubeUrl: "https://youtube.com/@lifeinpeaks",
  contactEmail: "hello@lifeinpeaks.com",
  seoDescription:
    "Lifeinpeaks — mountain photography, Himalayan travel stories and happy little moments from the road. A personal travel photography journal from India.",
};
