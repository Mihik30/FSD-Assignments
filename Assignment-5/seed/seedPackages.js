const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Package = require("../models/Package");

dotenv.config();

const seedData = [
  {
    name: "Kashmir Valley Escape",
    destination: "Srinagar",
    durationDays: 6,
    price: 42999,
    rating: 4.8,
    tags: ["mountains", "houseboat", "family"],
    image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    description: "Glide through Dal Lake, stay in premium houseboats, and enjoy curated valley excursions.",
    availableSlots: 18,
    featured: true
  },
  {
    name: "Goa Coastline Retreat",
    destination: "Goa",
    durationDays: 4,
    price: 26999,
    rating: 4.5,
    tags: ["beach", "nightlife", "couples"],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    description: "Beachfront stay, island cruise, and sunset shacks with handpicked local experiences.",
    availableSlots: 22,
    featured: true
  },
  {
    name: "Kerala Backwater Bliss",
    destination: "Alleppey",
    durationDays: 5,
    price: 33999,
    rating: 4.7,
    tags: ["backwaters", "wellness", "nature"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    description: "Private houseboat stay, heritage cuisine, and tranquil village tours in God's Own Country.",
    availableSlots: 16,
    featured: true
  },
  {
    name: "Ladakh Adventure Circuit",
    destination: "Leh",
    durationDays: 7,
    price: 51999,
    rating: 4.9,
    tags: ["adventure", "roadtrip", "high-altitude"],
    image: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg",
    description: "A scenic high-altitude route with monastery visits, passes, and local guide support.",
    availableSlots: 12,
    featured: true
  },
  {
    name: "Jaipur Heritage Trail",
    destination: "Jaipur",
    durationDays: 3,
    price: 21999,
    rating: 4.4,
    tags: ["heritage", "food", "culture"],
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    description: "Explore forts, palaces, artisan markets, and curated Rajasthani food experiences.",
    availableSlots: 30,
    featured: false
  },
  {
    name: "Andaman Island Odyssey",
    destination: "Port Blair",
    durationDays: 6,
    price: 55999,
    rating: 4.8,
    tags: ["island", "water sports", "honeymoon"],
    image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
    description: "Coral reefs, snorkeling sessions, and premium island stays across Andaman highlights.",
    availableSlots: 14,
    featured: true
  },
  {
    name: "Darjeeling Tea Hills Tour",
    destination: "Darjeeling",
    durationDays: 4,
    price: 24999,
    rating: 4.3,
    tags: ["hills", "heritage train", "tea estates"],
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?auto=format&fit=crop&w=1200&q=80",
    description: "Toy-train moments, sunrise viewpoints, and guided tea estate trails.",
    availableSlots: 19,
    featured: false
  },
  {
    name: "Rann of Kutch Desert Camp",
    destination: "Kutch",
    durationDays: 3,
    price: 28999,
    rating: 4.6,
    tags: ["desert", "festival", "photography"],
    image: "https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg",
    description: "White desert sunsets, cultural performances, and premium tent accommodations.",
    availableSlots: 25,
    featured: false
  },
  {
    name: "Coorg Coffee Highlands",
    destination: "Coorg",
    durationDays: 4,
    price: 25999,
    rating: 4.5,
    tags: ["coffee", "nature", "weekend"],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    description: "Stay amid coffee plantations with waterfall hikes and local culinary experiences.",
    availableSlots: 21,
    featured: false
  },
  {
    name: "Sikkim Peaks Explorer",
    destination: "Gangtok",
    durationDays: 5,
    price: 36999,
    rating: 4.7,
    tags: ["mountains", "culture", "snow"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    description: "Monastery trails, cable-car views, and alpine scenery for a balanced mountain trip.",
    availableSlots: 17,
    featured: true
  }
];

async function seedPackages() {
  try {
    await connectDB();
    await Package.deleteMany({});
    await Package.insertMany(seedData);
    console.log("Package seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Package seed failed:", error.message);
    process.exit(1);
  }
}

seedPackages();
