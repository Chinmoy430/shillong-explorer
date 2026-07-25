// ============================================================
// SHILLONG EXPLORER — Default Data
// This file provides the initial data loaded into localStorage.
// All content is editable via the Admin Panel.
// ============================================================

const DEFAULT_DATA = {
  siteSettings: {
    agencyName: "Shillong Explorer",
    tagline: "Discover the Scotland of the East",
    logoText: "Shillong Explorer",
    phone: "+91 98765 43210",
    email: "hello@shillongexplorer.com",
    whatsapp: "919876543210",
    address: "Police Bazar, Shillong, Meghalaya 793001",
    social: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com"
    }
  },

  hero: {
    title: "Explore the Magic of Shillong",
    subtitle: "Scotland of the East — Waterfalls, Caves, and Culture Await You",
    ctaText: "Browse Attractions",
    ctaLink: "attractions.html",
    backgroundImage: "assets/images/hero.png"
  },

  categories: [
    { id: "all", name: "All", icon: "🗺️" },
    { id: "nature", name: "Nature", icon: "🌿" },
    { id: "waterfall", name: "Waterfalls", icon: "💧" },
    { id: "lake", name: "Lakes", icon: "🏞️" },
    { id: "cultural", name: "Cultural", icon: "🏛️" },
    { id: "adventure", name: "Adventure", icon: "🧗" },
    { id: "village", name: "Villages", icon: "🏡" },
    { id: "viewpoint", name: "Viewpoints", icon: "🔭" }
  ],

  attractions: [
    {
      id: 1,
      name: "Laitlum Canyons",
      category: "viewpoint",
      rating: 4.8,
      reviewCount: 285,
      shortDesc: "Dramatic canyon viewpoint with breathtaking valley vistas and misty gorges.",
      fullDesc: "Laitlum Canyons, meaning 'End of Hills' in Khasi, offers one of the most dramatic landscapes in Northeast India. Perched at an elevation of 1,480 metres, the canyon provides jaw-dropping views of deep green gorges, rolling meadows, and distant waterfalls. A must-visit for nature lovers and photographers.",
      image: "assets/images/laitlum_canyons.png",
      location: "Smit, East Khasi Hills",
      duration: "2–3 hours",
      bestTime: "October to April",
      isTopPick: true,
      rank: 1
    },
    {
      id: 2,
      name: "Elephant Falls",
      category: "waterfall",
      rating: 4.6,
      reviewCount: 412,
      shortDesc: "Three-tiered majestic waterfall surrounded by lush tropical greenery.",
      fullDesc: "Elephant Falls is one of the most popular waterfalls near Shillong, located just 12 km from the city. The falls cascade in three tiers through dense forest. The British named it 'Elephant Falls' after a rock resembling an elephant, which unfortunately was destroyed in an earthquake. Still, the natural beauty remains awe-inspiring.",
      image: "assets/images/elephant_falls.png",
      location: "Upper Shillong",
      duration: "1–2 hours",
      bestTime: "June to September",
      isTopPick: true,
      rank: 2
    },
    {
      id: 3,
      name: "Dawki River (Umngot)",
      category: "nature",
      rating: 4.9,
      reviewCount: 623,
      shortDesc: "Crystal-clear river where boats appear to float on air above the transparent water.",
      fullDesc: "The Umngot River at Dawki is one of India's most astonishing natural wonders. The water is so crystal clear that boats appear to float in mid-air. Located near the Bangladesh border, it's perfect for boating, snorkelling, and photography. The annual boat race is a highlight of the Shillong calendar.",
      image: "assets/images/dawki_river.png",
      location: "Dawki, West Jaintia Hills",
      duration: "Full day trip",
      bestTime: "October to May",
      isTopPick: true,
      rank: 3
    },
    {
      id: 4,
      name: "Living Root Bridges",
      category: "adventure",
      rating: 4.7,
      reviewCount: 318,
      shortDesc: "Ancient bio-engineering marvels — living bridges formed from rubber fig tree roots.",
      fullDesc: "The Living Root Bridges of Cherrapunji and Mawlynnong are extraordinary examples of bio-engineering by the Khasi people. Grown over hundreds of years by training rubber fig tree roots across streams, these living structures become stronger with age. The famous double-decker root bridge at Nongriat requires a scenic trek.",
      image: "assets/images/living_root_bridge.png",
      location: "Cherrapunji / Mawlynnong",
      duration: "4–5 hours (including trek)",
      bestTime: "October to April",
      isTopPick: true,
      rank: 4
    },
    {
      id: 5,
      name: "Umiam Lake (Barapani)",
      category: "lake",
      rating: 4.5,
      reviewCount: 189,
      shortDesc: "Vast man-made lake amidst pine-clad hills — perfect for water sports and picnics.",
      fullDesc: "Umiam Lake, also known as Barapani, is a large reservoir created in 1965 on the Umiam River. Surrounded by lush pine forests and rolling hills, the lake is a popular recreational spot offering boating, kayaking, and water scooter rides. The golden reflections at sunset are spectacular.",
      image: "assets/images/umiam_lake.png",
      location: "17 km from Shillong city",
      duration: "2–3 hours",
      bestTime: "October to March",
      isTopPick: false,
      rank: 5
    },
    {
      id: 6,
      name: "Mawlynnong — Asia's Cleanest Village",
      category: "village",
      rating: 4.6,
      reviewCount: 241,
      shortDesc: "Asia's cleanest village with pristine paths, flowering gardens, and sky bridges.",
      fullDesc: "Mawlynnong earned the title of 'Asia's Cleanest Village' from Discover India Magazine in 2003. The village is a model of community-led cleanliness with bamboo dustbins, neat pathways, and flower gardens outside every home. The sky walk offers breathtaking views of Bangladesh plains below.",
      image: "assets/images/mawlynnong.png",
      location: "83 km from Shillong",
      duration: "2–3 hours",
      bestTime: "October to June",
      isTopPick: false,
      rank: 6
    }
  ],

  tours: [
    {
      id: 1,
      name: "Shillong City Highlights",
      category: "Sightseeing",
      duration: "1 Day",
      groupSize: "2–15 people",
      price: 1999,
      originalPrice: 2499,
      highlights: ["Ward's Lake", "Don Bosco Museum", "Shillong Peak", "Police Bazar", "Elephant Falls"],
      description: "A comprehensive one-day tour covering the best of Shillong city — cultural landmarks, scenic viewpoints, and famous markets.",
      image: "assets/images/umiam_lake.png",
      isFeatured: true,
      includes: ["AC Vehicle", "Guide", "Entry Tickets"],
      rating: 4.7
    },
    {
      id: 2,
      name: "Shillong–Cherrapunji Day Trip",
      category: "Nature",
      duration: "2 Days",
      groupSize: "2–12 people",
      price: 3999,
      originalPrice: 4999,
      highlights: ["Nohkalikai Falls", "Mawsmai Cave", "Seven Sisters Falls", "Living Root Bridge", "Dawki River"],
      description: "Explore the world's wettest place — Cherrapunji — with its dramatic waterfalls, caves, and the astonishing Dawki River.",
      image: "assets/images/elephant_falls.png",
      isFeatured: true,
      includes: ["AC Vehicle", "Hotel Stay (1 night)", "Breakfast", "Guide", "Entry Tickets"],
      rating: 4.8
    },
    {
      id: 3,
      name: "Meghalaya Explorer (5 Days)",
      category: "Adventure",
      duration: "5 Days",
      groupSize: "2–10 people",
      price: 12999,
      originalPrice: 16999,
      highlights: ["Shillong", "Cherrapunji", "Dawki", "Mawlynnong", "Living Root Bridge", "Jowai", "Kaziranga"],
      description: "The ultimate Meghalaya experience — 5 days covering all major attractions across the state with comfortable stays and expert guides.",
      image: "assets/images/laitlum_canyons.png",
      isFeatured: true,
      includes: ["AC Vehicle", "Hotel (4 nights)", "Breakfast & Dinner", "Guide", "All Entry Tickets", "Boating"],
      rating: 4.9
    },
    {
      id: 4,
      name: "Living Root Bridge Trek",
      category: "Adventure",
      duration: "1 Day",
      groupSize: "2–8 people",
      price: 2499,
      originalPrice: 2999,
      highlights: ["Double-Decker Root Bridge", "Nongriat Trek", "Natural Pool", "Waterfall Swim"],
      description: "Trek through ancient jungles to discover the legendary double-decker living root bridge at Nongriat. Swim in natural pools!",
      image: "assets/images/living_root_bridge.png",
      isFeatured: false,
      includes: ["Transport", "Trekking Guide", "Packed Lunch"],
      rating: 4.7
    },
    {
      id: 5,
      name: "Dawki & Mawlynnong Day Trip",
      category: "Nature",
      duration: "1 Day",
      groupSize: "2–15 people",
      price: 2799,
      originalPrice: 3299,
      highlights: ["Dawki Boating", "Umngot River", "Mawlynnong Village", "Sky Walk", "Bangladesh Border View"],
      description: "Crystal clear waters and Asia's cleanest village in one unforgettable day. Perfect for photographers and nature lovers.",
      image: "assets/images/dawki_river.png",
      isFeatured: false,
      includes: ["AC Vehicle", "Guide", "Boating", "Village Entry"],
      rating: 4.8
    },
    {
      id: 6,
      name: "Laitlum Canyon Sunrise Trek",
      category: "Adventure",
      duration: "Half Day",
      groupSize: "2–10 people",
      price: 1499,
      originalPrice: 1999,
      highlights: ["Sunrise at Laitlum", "Canyon Views", "Village Walk", "Photography Spots"],
      description: "Watch the sunrise paint the dramatic Laitlum Canyons gold. An early morning trek rewarding you with breathtaking misty valley views.",
      image: "assets/images/mawlynnong.png",
      isFeatured: false,
      includes: ["Transport", "Guide", "Morning Snacks"],
      rating: 4.6
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Absolutely stunning experience! The Meghalaya Explorer package was perfectly organized. Our guide was knowledgeable and friendly. The Dawki river left us speechless — photos don't do it justice!",
      avatar: "PS",
      date: "March 2025"
    },
    {
      id: 2,
      name: "Rahul & Neha Kapoor",
      location: "Mumbai",
      rating: 5,
      text: "We booked the Shillong-Cherrapunji trip for our anniversary and it exceeded all expectations. The hotel arrangements were comfortable, food was great. Will definitely book again!",
      avatar: "RK",
      date: "February 2025"
    },
    {
      id: 3,
      name: "Ananya Roy",
      location: "Kolkata",
      rating: 5,
      text: "The living root bridge trek was challenging but so worth it! Our guide kept us energized and the double-decker bridge is truly a wonder. Shillong Explorer made it seamless.",
      avatar: "AR",
      date: "January 2025"
    },
    {
      id: 4,
      name: "Vikram Mehta",
      location: "Bangalore",
      rating: 4,
      text: "Great service and well-planned itinerary. The city highlights tour covered everything I wanted to see. Would recommend to anyone visiting Shillong for the first time.",
      avatar: "VM",
      date: "December 2024"
    }
  ],

  adminCredentials: {
    username: "admin",
    password: "shillong2025"
  }
};

// Initialize data in localStorage if not already present
function initializeData() {
  if (!localStorage.getItem('se_initialized')) {
    localStorage.setItem('se_siteSettings', JSON.stringify(DEFAULT_DATA.siteSettings));
    localStorage.setItem('se_hero', JSON.stringify(DEFAULT_DATA.hero));
    localStorage.setItem('se_categories', JSON.stringify(DEFAULT_DATA.categories));
    localStorage.setItem('se_attractions', JSON.stringify(DEFAULT_DATA.attractions));
    localStorage.setItem('se_tours', JSON.stringify(DEFAULT_DATA.tours));
    localStorage.setItem('se_testimonials', JSON.stringify(DEFAULT_DATA.testimonials));
    localStorage.setItem('se_adminCredentials', JSON.stringify(DEFAULT_DATA.adminCredentials));
    localStorage.setItem('se_initialized', 'true');
  }
}

// Data access helpers
function getData(key) {
  const item = localStorage.getItem(`se_${key}`);
  return item ? JSON.parse(item) : null;
}

function setData(key, value) {
  localStorage.setItem(`se_${key}`, JSON.stringify(value));
}

function resetData() {
  localStorage.removeItem('se_initialized');
  initializeData();
}

// Run on every page load
initializeData();
