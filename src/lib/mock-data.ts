import { CITY_COORDS } from "./geo";
import type { Item, Message, SwapProposal, User } from "./types";

// Real Unsplash photos (free license) for HAVE listings — WANT listings stay illustrative (emoji placeholder).
function img(unsplashId: string) {
  return `https://images.unsplash.com/photo-${unsplashId}?w=800&q=75&auto=format&fit=crop`;
}

function jitter(base: number, spread = 0.06) {
  return base + (Math.random() * 2 - 1) * spread;
}

// Deterministic-ish small jitter table so seed data doesn't shuffle on every reload.
const J: [number, number][] = [
  [0.02, -0.03], [-0.04, 0.01], [0.03, 0.04], [-0.01, -0.05], [0.05, 0.02],
  [-0.03, -0.02], [0.01, 0.05], [-0.05, 0.03], [0.04, -0.04], [-0.02, 0.02],
  [0.02, 0.03], [-0.04, -0.01],
];

function pin(cityLat: number, cityLng: number, i: number) {
  const [dLat, dLng] = J[i % J.length];
  return { lat: cityLat + dLat, lng: cityLng + dLng };
}

type SeedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  rating: number;
  ratingCount: number;
  preferredCategories: string[];
  avatarEmoji: string;
};

const seedUsers: SeedUser[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@example.com", phone: "9820011223", city: "Mumbai", pincode: "400050", rating: 4.8, ratingCount: 14, preferredCategories: ["Mobiles & Electronics", "Books & Media"], avatarEmoji: "👩🏽" },
  { id: "u2", name: "Rahul Verma", email: "rahul@example.com", phone: "9911022334", city: "Delhi", pincode: "110017", rating: 4.5, ratingCount: 9, preferredCategories: ["Sports & Fitness", "Vehicles"], avatarEmoji: "🧑🏻" },
  { id: "u3", name: "Ananya Iyer", email: "ananya@example.com", phone: "9845033445", city: "Bengaluru", pincode: "560034", rating: 4.9, ratingCount: 21, preferredCategories: ["Furniture", "Home & Kitchen"], avatarEmoji: "👩🏻" },
  { id: "u4", name: "Karthik Reddy", email: "karthik@example.com", phone: "9848044556", city: "Hyderabad", pincode: "500081", rating: 4.2, ratingCount: 6, preferredCategories: ["Mobiles & Electronics", "Tools & Equipment"], avatarEmoji: "🧑🏽" },
  { id: "u5", name: "Divya Krishnan", email: "divya@example.com", phone: "9840055667", city: "Chennai", pincode: "600020", rating: 4.7, ratingCount: 17, preferredCategories: ["Books & Media", "Art & Crafts"], avatarEmoji: "👩🏾" },
  { id: "u6", name: "Sourav Banerjee", email: "sourav@example.com", phone: "9830066778", city: "Kolkata", pincode: "700019", rating: 4.4, ratingCount: 11, preferredCategories: ["Musical Instruments", "Collectibles"], avatarEmoji: "🧑🏻" },
  { id: "u7", name: "Neha Joshi", email: "neha@example.com", phone: "9822077889", city: "Pune", pincode: "411045", rating: 4.6, ratingCount: 13, preferredCategories: ["Baby & Kids", "Toys & Games"], avatarEmoji: "👩🏻" },
  { id: "u8", name: "Aman Patel", email: "aman@example.com", phone: "9925088990", city: "Ahmedabad", pincode: "380015", rating: 4.3, ratingCount: 8, preferredCategories: ["Clothing & Accessories", "Beauty & Personal Care"], avatarEmoji: "🧑🏽" },
  { id: "u9", name: "Ritu Chauhan", email: "ritu@example.com", phone: "9928099001", city: "Jaipur", pincode: "302015", rating: 4.9, ratingCount: 19, preferredCategories: ["Home & Kitchen", "Art & Crafts"], avatarEmoji: "👩🏽" },
  { id: "u10", name: "Vikram Singh", email: "vikram@example.com", phone: "9935100112", city: "Lucknow", pincode: "226010", rating: 4.1, ratingCount: 5, preferredCategories: ["Vehicles", "Tools & Equipment"], avatarEmoji: "🧑🏻" },
  { id: "u11", name: "Meera Nair", email: "meera@example.com", phone: "9846211223", city: "Kochi", pincode: "682016", rating: 4.8, ratingCount: 16, preferredCategories: ["Books & Media", "Musical Instruments"], avatarEmoji: "👩🏾" },
  { id: "u12", name: "Arjun Malhotra", email: "arjun@example.com", phone: "9911322334", city: "Delhi", pincode: "110024", rating: 4.0, ratingCount: 3, preferredCategories: ["Mobiles & Electronics", "Sports & Fitness"], avatarEmoji: "🧑🏻" },
];

export const users: User[] = seedUsers.map((u, i) => {
  const city = CITY_COORDS[u.city] ?? CITY_COORDS.Delhi;
  const { lat, lng } = pin(city.lat, city.lng, i);
  return { ...u, lat, lng, createdAt: new Date(2026, 5, 1 + i).toISOString() };
});

type SeedItem = Omit<Item, "lat" | "lng" | "createdAt" | "status"> & { status?: Item["status"] };

const seedItems: SeedItem[] = [
  { id: "i1", ownerId: "u1", type: "HAVE", title: "OnePlus 8T - Good Condition", description: "128GB, minor scratches on back, screen guard on since day one. Comes with box and charger.", category: "Mobiles & Electronics", condition: "GOOD", city: "Mumbai", pincode: "400050", emoji: "📱", images: [img("1580910051074-3eb694886505")], estValue: 12000, desiredExchange: "Looking for a DSLR camera or a study table", cashTopupOk: true, cashTopupMax: 2000 },
  { id: "i2", ownerId: "u1", type: "WANT", title: "Looking for a badminton racket set", description: "Preferably Yonex or Li-Ning, 2 rackets + shuttlecocks.", category: "Sports & Fitness", condition: "GOOD", city: "Mumbai", pincode: "400050", emoji: "🏸", images: [], estValue: 1500, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i3", ownerId: "u2", type: "HAVE", title: "Study table with drawer", description: "Sturdy wooden study table, 3ft x 2ft, one drawer. Some paint chipping on edges.", category: "Furniture", condition: "FAIR", city: "Delhi", pincode: "110017", emoji: "🪵", images: [img("1518455027359-f3f8164ba6bd")], estValue: 2500, desiredExchange: "A working smartphone or a bicycle", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i4", ownerId: "u2", type: "WANT", title: "Looking for a DSLR camera", description: "Any brand, doesn't need to be latest — just working and decent lens.", category: "Mobiles & Electronics", condition: "GOOD", city: "Delhi", pincode: "110017", emoji: "📷", images: [], estValue: 15000, desiredExchange: "", cashTopupOk: true, cashTopupMax: 3000 },
  { id: "i5", ownerId: "u3", type: "HAVE", title: "IKEA bookshelf, 5-tier", description: "White laminate, very sturdy, no wobble. Selling because we're moving cities.", category: "Furniture", condition: "LIKE_NEW", city: "Bengaluru", pincode: "560034", emoji: "📚", images: [img("1507842217343-583bb7270b66")], estValue: 4000, desiredExchange: "Kitchen appliances or a study table", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i6", ownerId: "u3", type: "WANT", title: "Looking for a mixer grinder", description: "Preferably 750W+, good working condition, any brand.", category: "Home & Kitchen", condition: "GOOD", city: "Bengaluru", pincode: "560034", emoji: "🍳", images: [], estValue: 2500, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i7", ownerId: "u4", type: "HAVE", title: "Mixer grinder, Preethi 750W", description: "3 jars included, used for 1 year, works perfectly. Moving to a new flat with built-in grinder.", category: "Home & Kitchen", condition: "GOOD", city: "Hyderabad", pincode: "500081", emoji: "🍳", images: [img("1585515320310-259814833e62")], estValue: 2200, desiredExchange: "Books, board games, or a badminton set", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i8", ownerId: "u4", type: "WANT", title: "Looking for a toolkit / drill machine", description: "Basic home toolkit or a cordless drill, doesn't need to be pro-grade.", category: "Tools & Equipment", condition: "GOOD", city: "Hyderabad", pincode: "500081", emoji: "🛠️", images: [], estValue: 1800, desiredExchange: "", cashTopupOk: true, cashTopupMax: 1000 },
  { id: "i9", ownerId: "u5", type: "HAVE", title: "Complete Harry Potter box set", description: "All 7 books, English, good condition, some highlighting in book 3.", category: "Books & Media", condition: "GOOD", city: "Chennai", pincode: "600020", emoji: "📚", images: [img("1512820790803-83ca734da794")], estValue: 1800, desiredExchange: "Art supplies or a guitar", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i10", ownerId: "u5", type: "WANT", title: "Looking for acrylic paint set + canvases", description: "Beginner to intermediate set, any brand, at least 12 colours.", category: "Art & Crafts", condition: "NEW", city: "Chennai", pincode: "600020", emoji: "🎨", images: [], estValue: 900, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i11", ownerId: "u6", type: "HAVE", title: "Acoustic guitar, Yamaha F310", description: "A few years old but well maintained, new strings put on last month.", category: "Musical Instruments", condition: "GOOD", city: "Kolkata", pincode: "700019", emoji: "🎸", images: [img("1510915361894-db8b60106cb1")], estValue: 6000, desiredExchange: "Vintage coins/stamps collection or a bookshelf", cashTopupOk: true, cashTopupMax: 1500 },
  { id: "i12", ownerId: "u6", type: "WANT", title: "Looking for old coins or stamps collection", description: "Building a collection, interested in pre-1980s Indian coins or stamps.", category: "Collectibles", condition: "FAIR", city: "Kolkata", pincode: "700019", emoji: "🏺", images: [], estValue: 500, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i13", ownerId: "u7", type: "HAVE", title: "Baby stroller, Chicco", description: "Used for 8 months, foldable, all wheels and brakes working fine.", category: "Baby & Kids", condition: "GOOD", city: "Pune", pincode: "411045", emoji: "🍼", images: [img("1634058505081-a4835469b440")], estValue: 3500, desiredExchange: "Toys, books, or kitchen items", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i14", ownerId: "u7", type: "WANT", title: "Looking for building block sets (Lego-style)", description: "For a 4-year-old, any large compatible block set.", category: "Toys & Games", condition: "GOOD", city: "Pune", pincode: "411045", emoji: "🧸", images: [], estValue: 1200, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i15", ownerId: "u8", type: "HAVE", title: "Leather jacket, size L", description: "Genuine leather, worn twice, no damage. Bought a size too big.", category: "Clothing & Accessories", condition: "LIKE_NEW", city: "Ahmedabad", pincode: "380015", emoji: "🧥", images: [img("1551028719-00167b16eac5")], estValue: 3000, desiredExchange: "Skincare/grooming sets or a sports item", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i16", ownerId: "u8", type: "WANT", title: "Looking for a grooming kit / trimmer", description: "Any decent brand, rechargeable preferred.", category: "Beauty & Personal Care", condition: "GOOD", city: "Ahmedabad", pincode: "380015", emoji: "💄", images: [], estValue: 800, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i17", ownerId: "u9", type: "HAVE", title: "Brass dinner set, 24-piece", description: "Traditional brass dinner set, lightly used for festivals only.", category: "Home & Kitchen", condition: "LIKE_NEW", city: "Jaipur", pincode: "302015", emoji: "🍽️", images: [img("1711153419402-336ee48f2138")], estValue: 5000, desiredExchange: "Hand-painted decor or craft supplies", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i18", ownerId: "u9", type: "WANT", title: "Looking for a pottery wheel or craft supplies", description: "For a home craft hobby — anything pottery or macrame related.", category: "Art & Crafts", condition: "FAIR", city: "Jaipur", pincode: "302015", emoji: "🎨", images: [], estValue: 1500, desiredExchange: "", cashTopupOk: true, cashTopupMax: 500 },
  { id: "i19", ownerId: "u10", type: "HAVE", title: "Royal Enfield helmet + riding gloves", description: "ISI marked helmet size L, gloves size M, both barely used.", category: "Vehicles", condition: "LIKE_NEW", city: "Lucknow", pincode: "226010", emoji: "🪖", images: [img("1590506995460-d0d9892b54da")], estValue: 2200, desiredExchange: "Power tools or a mobile phone", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i20", ownerId: "u10", type: "WANT", title: "Looking for a cordless drill machine", description: "For home repair projects, any working brand.", category: "Tools & Equipment", condition: "GOOD", city: "Lucknow", pincode: "226010", emoji: "🛠️", images: [], estValue: 2000, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i21", ownerId: "u11", type: "HAVE", title: "Ukulele, soprano size", description: "Comes with a soft case, tuned and ready to play, minor wear on body.", category: "Musical Instruments", condition: "GOOD", city: "Kochi", pincode: "682016", emoji: "🎸", images: [img("1556449895-a33c9dba33dd")], estValue: 1800, desiredExchange: "Malayalam or English novels", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i22", ownerId: "u11", type: "WANT", title: "Looking for a novel collection / book box", description: "Fiction, mystery, or classics — any bundle of 5+ books.", category: "Books & Media", condition: "GOOD", city: "Kochi", pincode: "682016", emoji: "📚", images: [], estValue: 1000, desiredExchange: "", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i23", ownerId: "u12", type: "HAVE", title: "iPhone 11, 64GB", description: "Battery health 84%, small dent on corner, always used with a case.", category: "Mobiles & Electronics", condition: "GOOD", city: "Delhi", pincode: "110024", emoji: "📱", images: [img("1592750475338-74b7b21085ab")], estValue: 18000, desiredExchange: "A road bike or gaming console", cashTopupOk: true, cashTopupMax: 4000 },
  { id: "i24", ownerId: "u12", type: "WANT", title: "Looking for a road bicycle", description: "Any decent geared bicycle, city or hybrid, for daily commute.", category: "Sports & Fitness", condition: "GOOD", city: "Delhi", pincode: "110024", emoji: "🚲", images: [], estValue: 9000, desiredExchange: "", cashTopupOk: true, cashTopupMax: 3000 },
  { id: "i25", ownerId: "u2", type: "HAVE", title: "Badminton racket set, Yonex", description: "2 rackets + a tube of shuttlecocks, used for a season, strings intact.", category: "Sports & Fitness", condition: "GOOD", city: "Delhi", pincode: "110017", emoji: "🏸", images: [img("1626224583764-f87db24ac4ea")], estValue: 1600, desiredExchange: "Any electronics or a study table", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i26", ownerId: "u4", type: "HAVE", title: "Cordless drill machine, Bosch", description: "Comes with a set of bits, used for one home renovation, works great.", category: "Tools & Equipment", condition: "GOOD", city: "Hyderabad", pincode: "500081", emoji: "🛠️", images: [img("1504148455328-c376907d081c")], estValue: 2100, desiredExchange: "Kitchen appliances", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i27", ownerId: "u9", type: "HAVE", title: "Hand-painted Madhubani wall art", description: "Framed, 18x24 inches, bought from a local artisan, brand new condition.", category: "Art & Crafts", condition: "LIKE_NEW", city: "Jaipur", pincode: "302015", emoji: "🎨", images: [img("1547891654-e66ed7ebb968")], estValue: 1400, desiredExchange: "Craft supplies or home decor", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i28", ownerId: "u3", type: "HAVE", title: "Kitchen appliance combo — kettle + toaster", description: "Both working perfectly, upgrading to a bigger set.", category: "Home & Kitchen", condition: "GOOD", city: "Bengaluru", pincode: "560034", emoji: "🍳", images: [img("1748408082799-94daff13e792")], estValue: 1600, desiredExchange: "Furniture or storage items", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i29", ownerId: "u7", type: "HAVE", title: "Wooden building blocks set", description: "Large 100-piece natural wood block set, great for toddlers.", category: "Toys & Games", condition: "GOOD", city: "Pune", pincode: "411045", emoji: "🧸", images: [img("1558060370-d644479cb6f7")], estValue: 1000, desiredExchange: "Baby gear or books", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i30", ownerId: "u5", type: "HAVE", title: "Acrylic paint set (24 colours) + 3 canvases", description: "Barely used, bought for a course that got cancelled.", category: "Art & Crafts", condition: "LIKE_NEW", city: "Chennai", pincode: "600020", emoji: "🎨", images: [img("1513364776144-60967b0f800f")], estValue: 950, desiredExchange: "Books or a musical instrument", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i31", ownerId: "u6", type: "HAVE", title: "Vintage Indian coin collection (1970s-80s)", description: "Small curated collection, 15 coins, kept in an album.", category: "Collectibles", condition: "FAIR", city: "Kolkata", pincode: "700019", emoji: "🏺", images: [img("1767025945853-591b10d68e29")], estValue: 600, desiredExchange: "Musical instruments or books", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i32", ownerId: "u1", type: "HAVE", title: "Bluetooth speaker, JBL Go 2", description: "Compact speaker, good bass, comes with charging cable.", category: "Mobiles & Electronics", condition: "GOOD", city: "Mumbai", pincode: "400050", emoji: "🔊", images: [img("1608043152269-423dbba4e7e1")], estValue: 1500, desiredExchange: "Books or kitchen items", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i33", ownerId: "u8", type: "HAVE", title: "Skincare & grooming hamper", description: "Unused set of face wash, moisturizer, and trimmer — received as a gift.", category: "Beauty & Personal Care", condition: "NEW", city: "Ahmedabad", pincode: "380015", emoji: "💄", images: [img("1571781926291-c477ebfd024b")], estValue: 1100, desiredExchange: "Clothing or accessories", cashTopupOk: false, cashTopupMax: 0 },
  { id: "i34", ownerId: "u11", type: "HAVE", title: "Novel bundle — 8 English fiction books", description: "Mix of thrillers and literary fiction, all in good readable condition.", category: "Books & Media", condition: "GOOD", city: "Kochi", pincode: "682016", emoji: "📚", images: [img("1495446815901-a7297e633e8d")], estValue: 900, desiredExchange: "Musical instruments or craft supplies", cashTopupOk: false, cashTopupMax: 0 },
];

export const items: Item[] = seedItems.map((it, i) => {
  const city = CITY_COORDS[it.city] ?? CITY_COORDS.Delhi;
  const { lat, lng } = pin(city.lat, city.lng, i + 3);
  return {
    ...it,
    lat,
    lng,
    status: it.status ?? "ACTIVE",
    createdAt: new Date(2026, 6, 1 + (i % 28)).toISOString(),
  };
});

export const proposals: SwapProposal[] = [
  {
    id: "p1",
    fromItemId: "i23",
    toItemId: "i3",
    proposerId: "u12",
    recipientId: "u2",
    message: "Hey! Would you swap your study table for my iPhone 11 + a little cash on top?",
    cashFrom: "PROPOSER",
    cashAmount: 400,
    status: "PENDING",
    createdAt: new Date(2026, 6, 20).toISOString(),
  },
  {
    id: "p2",
    fromItemId: "i7",
    toItemId: "i9",
    proposerId: "u4",
    recipientId: "u5",
    message: "I have a mixer grinder in great shape — would you trade for the Harry Potter set?",
    cashFrom: "NONE",
    cashAmount: 0,
    status: "ACCEPTED",
    createdAt: new Date(2026, 6, 15).toISOString(),
  },
  {
    id: "p3",
    fromItemId: "i11",
    toItemId: "i34",
    proposerId: "u6",
    recipientId: "u11",
    message: "Would you consider my guitar for your novel bundle?",
    cashFrom: "NONE",
    cashAmount: 0,
    status: "DECLINED",
    createdAt: new Date(2026, 6, 10).toISOString(),
  },
];

export const messages: Message[] = [
  { id: "m1", proposalId: "p2", senderId: "u4", content: "Hi Divya! Really hoping this works out — the grinder is in great shape.", createdAt: new Date(2026, 6, 15, 10, 5).toISOString() },
  { id: "m2", proposalId: "p2", senderId: "u5", content: "Hi Karthik, sounds good! I've wanted to declutter my bookshelf anyway.", createdAt: new Date(2026, 6, 15, 11, 20).toISOString() },
  { id: "m3", proposalId: "p2", senderId: "u4", content: "Great — could we meet near your place this weekend?", createdAt: new Date(2026, 6, 15, 11, 45).toISOString() },
  { id: "m4", proposalId: "p2", senderId: "u5", content: "Saturday afternoon works for me. I'll share a landmark near Besant Nagar.", createdAt: new Date(2026, 6, 15, 12, 0).toISOString() },
];
