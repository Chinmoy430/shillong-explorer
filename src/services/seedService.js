// ============================================================
// Seed Service — Populates Firestore with Default Content
// ============================================================
// This module provides the DEFAULT_DATA (same as your old data.js)
// and a seedFirestore() function that writes it all to Firestore.
//
// HOW TO USE: Go to Admin → Settings → click "Initialize Database"
// This runs seedFirestore() via the browser — no backend needed.
//
// SAFE TO RE-RUN: Uses setDoc with merge:true for fixed documents
// and only adds collection items if the collection is empty.
// ============================================================

import {
  setDoc, addDoc, doc, collection, getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// ── Default data (mirrors your old data.js DEFAULT_DATA) ─────

export const DEFAULT_DATA = {
  siteSettings: {
    agencyName: 'SAWAIOM TRAVELS AGENCY',
    tagline:    'Discover the Scotland of the East',
    phone:      '+91 98765 43210',
    email:      'hello@shillongexplorer.com',
    whatsapp:   '919876543210',
    address:    'Police Bazar, Shillong, Meghalaya 793001',
    social: {
      facebook:  'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube:   'https://youtube.com',
      twitter:   'https://twitter.com',
    },
  },

  hero: {
    title:           'Explore the Magic of <span>Shillong</span>',
    subtitle:        'Scotland of the East — Waterfalls, Caves, and Culture Await You',
    ctaText:         'Browse Attractions →',
    backgroundImage: '/assets/images/hero.png',
  },

  categories: [
    { id: 'all',       name: 'All',        icon: '🗺️', order: 0 },
    { id: 'nature',    name: 'Nature',      icon: '🌿', order: 1 },
    { id: 'waterfall', name: 'Waterfalls',  icon: '💧', order: 2 },
    { id: 'lake',      name: 'Lakes',       icon: '🏞️', order: 3 },
    { id: 'cultural',  name: 'Cultural',    icon: '🏛️', order: 4 },
    { id: 'adventure', name: 'Adventure',   icon: '🧗', order: 5 },
    { id: 'village',   name: 'Villages',    icon: '🏡', order: 6 },
    { id: 'viewpoint', name: 'Viewpoints',  icon: '🔭', order: 7 },
  ],

  attractions: [
    {
      name: 'Laitlum Canyons', category: 'viewpoint', rating: 4.8, reviewCount: 285, rank: 1,
      shortDesc: 'Dramatic canyon viewpoint with breathtaking valley vistas and misty gorges.',
      fullDesc:  "Laitlum Canyons, meaning 'End of Hills' in Khasi, offers one of the most dramatic landscapes in Northeast India. Perched at an elevation of 1,480 metres, the canyon provides jaw-dropping views of deep green gorges, rolling meadows, and distant waterfalls. A must-visit for nature lovers and photographers.",
      image: '/assets/images/laitlum_canyons.png',
      location: 'Smit, East Khasi Hills', duration: '2–3 hours', bestTime: 'October to April', isTopPick: true,
    },
    {
      name: 'Elephant Falls', category: 'waterfall', rating: 4.6, reviewCount: 412, rank: 2,
      shortDesc: 'Three-tiered majestic waterfall surrounded by lush tropical greenery.',
      fullDesc:  "Elephant Falls is one of the most popular waterfalls near Shillong, located just 12 km from the city. The falls cascade in three tiers through dense forest. The British named it 'Elephant Falls' after a rock resembling an elephant.",
      image: '/assets/images/elephant_falls.png',
      location: 'Upper Shillong', duration: '1–2 hours', bestTime: 'June to September', isTopPick: true,
    },
    {
      name: 'Dawki River (Umngot)', category: 'nature', rating: 4.9, reviewCount: 623, rank: 3,
      shortDesc: 'Crystal-clear river where boats appear to float on air above the transparent water.',
      fullDesc:  "The Umngot River at Dawki is one of India's most astonishing natural wonders. The water is so crystal clear that boats appear to float in mid-air. Perfect for boating, snorkelling, and photography.",
      image: '/assets/images/dawki_river.png',
      location: 'Dawki, West Jaintia Hills', duration: 'Full day trip', bestTime: 'October to May', isTopPick: true,
    },
    {
      name: 'Living Root Bridges', category: 'adventure', rating: 4.7, reviewCount: 318, rank: 4,
      shortDesc: 'Ancient bio-engineering marvels — living bridges formed from rubber fig tree roots.',
      fullDesc:  'The Living Root Bridges of Cherrapunji and Mawlynnong are extraordinary examples of bio-engineering by the Khasi people, grown over hundreds of years.',
      image: '/assets/images/living_root_bridge.png',
      location: 'Cherrapunji / Mawlynnong', duration: '4–5 hours (including trek)', bestTime: 'October to April', isTopPick: true,
    },
    {
      name: 'Umiam Lake (Barapani)', category: 'lake', rating: 4.5, reviewCount: 189, rank: 5,
      shortDesc: 'Vast man-made lake amidst pine-clad hills — perfect for water sports and picnics.',
      fullDesc:  'Umiam Lake, also known as Barapani, is a large reservoir created in 1965 on the Umiam River. Surrounded by lush pine forests, it offers boating, kayaking, and water scooter rides.',
      image: '/assets/images/umiam_lake.png',
      location: '17 km from Shillong city', duration: '2–3 hours', bestTime: 'October to March', isTopPick: false,
    },
    {
      name: "Mawlynnong — Asia's Cleanest Village", category: 'village', rating: 4.6, reviewCount: 241, rank: 6,
      shortDesc: "Asia's cleanest village with pristine paths, flowering gardens, and sky bridges.",
      fullDesc:  "Mawlynnong earned the title of 'Asia's Cleanest Village' from Discover India Magazine in 2003. The village is a model of community-led cleanliness with bamboo dustbins and flower gardens.",
      image: '/assets/images/mawlynnong.png',
      location: '83 km from Shillong', duration: '2–3 hours', bestTime: 'October to June', isTopPick: false,
    },
  ],

  tours: [
    {
      name: 'Shillong City Highlights', category: 'Sightseeing', duration: '1 Day',
      groupSize: '2–15 people', price: 1999, originalPrice: 2499, rating: 4.7, isFeatured: true,
      highlights: ["Ward's Lake", 'Don Bosco Museum', 'Shillong Peak', 'Police Bazar', 'Elephant Falls'],
      description: 'A comprehensive one-day tour covering the best of Shillong city.',
      image: '/assets/images/umiam_lake.png',
      includes: ['AC Vehicle', 'Guide', 'Entry Tickets'],
    },
    {
      name: 'Shillong–Cherrapunji Day Trip', category: 'Nature', duration: '2 Days',
      groupSize: '2–12 people', price: 3999, originalPrice: 4999, rating: 4.8, isFeatured: true,
      highlights: ['Nohkalikai Falls', 'Mawsmai Cave', 'Seven Sisters Falls', 'Living Root Bridge', 'Dawki River'],
      description: 'Explore the world\'s wettest place — Cherrapunji — with its dramatic waterfalls and caves.',
      image: '/assets/images/elephant_falls.png',
      includes: ['AC Vehicle', 'Hotel Stay (1 night)', 'Breakfast', 'Guide', 'Entry Tickets'],
    },
    {
      name: 'Meghalaya Explorer (5 Days)', category: 'Adventure', duration: '5 Days',
      groupSize: '2–10 people', price: 12999, originalPrice: 16999, rating: 4.9, isFeatured: true,
      highlights: ['Shillong', 'Cherrapunji', 'Dawki', 'Mawlynnong', 'Living Root Bridge', 'Jowai'],
      description: 'The ultimate Meghalaya experience — 5 days covering all major attractions.',
      image: '/assets/images/laitlum_canyons.png',
      includes: ['AC Vehicle', 'Hotel (4 nights)', 'Breakfast & Dinner', 'Guide', 'All Entry Tickets', 'Boating'],
    },
    {
      name: 'Living Root Bridge Trek', category: 'Adventure', duration: '1 Day',
      groupSize: '2–8 people', price: 2499, originalPrice: 2999, rating: 4.7, isFeatured: false,
      highlights: ['Double-Decker Root Bridge', 'Nongriat Trek', 'Natural Pool', 'Waterfall Swim'],
      description: 'Trek through ancient jungles to discover the legendary double-decker living root bridge.',
      image: '/assets/images/living_root_bridge.png',
      includes: ['Transport', 'Trekking Guide', 'Packed Lunch'],
    },
    {
      name: 'Dawki & Mawlynnong Day Trip', category: 'Nature', duration: '1 Day',
      groupSize: '2–15 people', price: 2799, originalPrice: 3299, rating: 4.8, isFeatured: false,
      highlights: ['Dawki Boating', 'Umngot River', 'Mawlynnong Village', 'Sky Walk'],
      description: 'Crystal clear waters and Asia\'s cleanest village in one unforgettable day.',
      image: '/assets/images/dawki_river.png',
      includes: ['AC Vehicle', 'Guide', 'Boating', 'Village Entry'],
    },
    {
      name: 'Laitlum Canyon Sunrise Trek', category: 'Adventure', duration: 'Half Day',
      groupSize: '2–10 people', price: 1499, originalPrice: 1999, rating: 4.6, isFeatured: false,
      highlights: ['Sunrise at Laitlum', 'Canyon Views', 'Village Walk', 'Photography Spots'],
      description: 'Watch the sunrise paint the dramatic Laitlum Canyons gold.',
      image: '/assets/images/mawlynnong.png',
      includes: ['Transport', 'Guide', 'Morning Snacks'],
    },
  ],

  testimonials: [
    {
      name: 'Priya Sharma', location: 'Delhi', rating: 5, avatar: 'PS', date: 'March 2025',
      text: 'Absolutely stunning experience! The Meghalaya Explorer package was perfectly organized. The Dawki river left us speechless — photos don\'t do it justice!',
    },
    {
      name: 'Rahul & Neha Kapoor', location: 'Mumbai', rating: 5, avatar: 'RK', date: 'February 2025',
      text: 'We booked the Shillong-Cherrapunji trip for our anniversary and it exceeded all expectations. Will definitely book again!',
    },
    {
      name: 'Ananya Roy', location: 'Kolkata', rating: 5, avatar: 'AR', date: 'January 2025',
      text: 'The living root bridge trek was challenging but so worth it! SAWAIOM TRAVELS AGENCY made it seamless.',
    },
    {
      name: 'Vikram Mehta', location: 'Bangalore', rating: 4, avatar: 'VM', date: 'December 2024',
      text: 'Great service and well-planned itinerary. The city highlights tour covered everything I wanted to see.',
    },
  ],
};

// ── Seed Function ─────────────────────────────────────────────

/**
 * Writes all DEFAULT_DATA to Firestore.
 * Called from Admin → Settings → "Initialize Database" button.
 * @param {function} onProgress - callback(message) to show progress in the UI
 */
export const seedFirestore = async (onProgress = () => {}) => {
  // 1. Site settings
  onProgress('Writing site settings…');
  await setDoc(doc(db, 'siteContent', 'settings'), DEFAULT_DATA.siteSettings, { merge: true });

  // 2. Hero
  onProgress('Writing hero section…');
  await setDoc(doc(db, 'siteContent', 'hero'), DEFAULT_DATA.hero, { merge: true });

  // 3. Categories (fixed document IDs matching category id)
  onProgress('Writing categories…');
  for (const cat of DEFAULT_DATA.categories) {
    await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
  }

  // 4. Attractions — only seed if collection is empty
  onProgress('Checking attractions…');
  const existingAttractions = await getDocs(collection(db, 'attractions'));
  if (existingAttractions.empty) {
    onProgress('Seeding attractions…');
    for (const item of DEFAULT_DATA.attractions) {
      await addDoc(collection(db, 'attractions'), item);
    }
  } else {
    onProgress(`Attractions already exist (${existingAttractions.size} docs) — skipped.`);
  }

  // 5. Tours — only seed if empty
  onProgress('Checking tours…');
  const existingTours = await getDocs(collection(db, 'tours'));
  if (existingTours.empty) {
    onProgress('Seeding tours…');
    for (const item of DEFAULT_DATA.tours) {
      await addDoc(collection(db, 'tours'), item);
    }
  } else {
    onProgress(`Tours already exist (${existingTours.size} docs) — skipped.`);
  }

  // 6. Testimonials — only seed if empty
  onProgress('Checking testimonials…');
  const existingTestimonials = await getDocs(collection(db, 'testimonials'));
  if (existingTestimonials.empty) {
    onProgress('Seeding testimonials…');
    for (const item of DEFAULT_DATA.testimonials) {
      await addDoc(collection(db, 'testimonials'), item);
    }
  } else {
    onProgress(`Testimonials already exist (${existingTestimonials.size} docs) — skipped.`);
  }

  onProgress('✅ Database initialization complete!');
};
