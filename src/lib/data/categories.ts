import type { Category } from '../types';
import { categoryImage } from '../images';

/* ------------------------------------------------------------------ */
/* 14 major categories with full subcategory trees                     */
/* ------------------------------------------------------------------ */

const A: Omit<Category, 'id' | 'image'>[] = [
  {
    slug: 'electronics',
    name: 'Electronics',
    tagline: 'Audio, computing and smart tech',
    icon: 'Cpu',
    subcategories: [
      { slug: 'smartphones', name: 'Smartphones' },
      { slug: 'laptops-tablets', name: 'Laptops & Tablets' },
      { slug: 'headphones-audio', name: 'Headphones & Audio' },
      { slug: 'cameras', name: 'Cameras & Photography' },
      { slug: 'gaming', name: 'Gaming' },
      { slug: 'smart-home', name: 'Smart Home' },
      { slug: 'televisions', name: 'Televisions' },
      { slug: 'wearables-tech', name: 'Wearables' },
    ],
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    tagline: 'Elevated everyday style',
    icon: 'Shirt',
    subcategories: [
      { slug: 'mens-clothing', name: "Men's Clothing" },
      { slug: 'womens-clothing', name: "Women's Clothing" },
      { slug: 'footwear', name: 'Footwear' },
      { slug: 'denim', name: 'Denim' },
      { slug: 'activewear', name: 'Activewear' },
      { slug: 'outerwear', name: 'Outerwear' },
      { slug: 'innerwear', name: 'Innerwear & Sleep' },
    ],
  },
  {
    slug: 'home-living',
    name: 'Home & Living',
    tagline: 'Interiors that feel like home',
    icon: 'Sofa',
    subcategories: [
      { slug: 'furniture', name: 'Furniture' },
      { slug: 'bedding', name: 'Bedding & Linen' },
      { slug: 'kitchen-dining', name: 'Kitchen & Dining' },
      { slug: 'home-decor', name: 'Decor & Accents' },
      { slug: 'lighting', name: 'Lighting' },
      { slug: 'storage', name: 'Storage & Organisation' },
      { slug: 'bath', name: 'Bath' },
    ],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    tagline: 'Skincare, makeup and fragrance',
    icon: 'Sparkles',
    subcategories: [
      { slug: 'skincare', name: 'Skincare' },
      { slug: 'makeup', name: 'Makeup' },
      { slug: 'fragrance', name: 'Fragrance' },
      { slug: 'haircare', name: 'Haircare' },
      { slug: 'bath-body', name: 'Bath & Body' },
      { slug: 'mens-grooming', name: "Men's Grooming" },
      { slug: 'beauty-tools', name: 'Tools & Devices' },
    ],
  },
  {
    slug: 'sports',
    name: 'Sports',
    tagline: 'Gear for every kind of athlete',
    icon: 'Dumbbell',
    subcategories: [
      { slug: 'fitness-equipment', name: 'Fitness Equipment' },
      { slug: 'running', name: 'Running' },
      { slug: 'team-sports', name: 'Team Sports' },
      { slug: 'cycling', name: 'Cycling' },
      { slug: 'outdoor-camping', name: 'Outdoor & Camping' },
      { slug: 'yoga-pilates', name: 'Yoga & Pilates' },
      { slug: 'swimming', name: 'Swimming' },
    ],
  },
  {
    slug: 'toys-kids',
    name: 'Toys & Kids',
    tagline: 'Play, learn and grow',
    icon: 'Baby',
    subcategories: [
      { slug: 'building-toys', name: 'Building Toys' },
      { slug: 'board-games', name: 'Board Games' },
      { slug: 'action-figures', name: 'Action Figures' },
      { slug: 'dolls-playsets', name: 'Dolls & Playsets' },
      { slug: 'ride-ons', name: 'Ride-Ons' },
      { slug: 'learning-stem', name: 'Learning & STEM' },
      { slug: 'baby-care', name: 'Baby Care' },
    ],
  },
  {
    slug: 'books',
    name: 'Books',
    tagline: 'Stories, ideas and study guides',
    icon: 'BookOpen',
    subcategories: [
      { slug: 'fiction', name: 'Fiction' },
      { slug: 'non-fiction', name: 'Non-Fiction' },
      { slug: 'childrens-books', name: "Children's Books" },
      { slug: 'academic', name: 'Academic & Textbooks' },
      { slug: 'graphic-novels', name: 'Comics & Graphic Novels' },
      { slug: 'cookbooks', name: 'Cookbooks' },
      { slug: 'biographies', name: 'Biographies' },
    ],
  },
];

export const CATEGORY_DEFS_A = A;

const B: Omit<Category, 'id' | 'image'>[] = [
  {
    slug: 'pet-supplies',
    name: 'Pet Supplies',
    tagline: 'Everything your companion needs',
    icon: 'PawPrint',
    subcategories: [
      { slug: 'dog-supplies', name: 'Dog Supplies' },
      { slug: 'cat-supplies', name: 'Cat Supplies' },
      { slug: 'pet-food', name: 'Pet Food' },
      { slug: 'pet-toys', name: 'Pet Toys' },
      { slug: 'small-pet', name: 'Bird & Small Pet' },
      { slug: 'grooming', name: 'Grooming' },
      { slug: 'pet-beds', name: 'Beds & Furniture' },
    ],
  },
  {
    slug: 'travel',
    name: 'Travel',
    tagline: 'Gear for the journey',
    icon: 'Plane',
    subcategories: [
      { slug: 'luggage', name: 'Luggage & Cases' },
      { slug: 'backpacks', name: 'Backpacks' },
      { slug: 'travel-accessories', name: 'Travel Accessories' },
      { slug: 'camping', name: 'Camping & Hiking' },
      { slug: 'travel-tech', name: 'Travel Tech' },
    ],
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    tagline: 'Finishing touches, daily',
    icon: 'Glasses',
    subcategories: [
      { slug: 'watches', name: 'Watches' },
      { slug: 'eyewear', name: 'Eyewear' },
      { slug: 'wallets', name: 'Wallets & Holders' },
      { slug: 'handbags', name: 'Bags & Handbags' },
      { slug: 'hats-caps', name: 'Hats & Caps' },
      { slug: 'jewellery', name: 'Jewellery' },
      { slug: 'umbrellas', name: 'Umbrellas' },
    ],
  },
  {
    slug: 'grocery',
    name: 'Grocery',
    tagline: 'Pantry staples and fresh bites',
    icon: 'Coffee',
    subcategories: [
      { slug: 'coffee-tea', name: 'Coffee & Tea' },
      { slug: 'snacks', name: 'Snacks' },
      { slug: 'pantry', name: 'Pantry Staples' },
      { slug: 'beverages', name: 'Beverages' },
      { slug: 'chocolate', name: 'Chocolate & Sweets' },
      { slug: 'baking', name: 'Baking' },
      { slug: 'spices', name: 'Spices & Sauces' },
    ],
  },
  {
    slug: 'office',
    name: 'Office',
    tagline: 'Workspace, refined',
    icon: 'Briefcase',
    subcategories: [
      { slug: 'desk-setup', name: 'Desk Setup' },
      { slug: 'office-furniture', name: 'Office Furniture' },
      { slug: 'stationery', name: 'Stationery' },
      { slug: 'printers', name: 'Printers & Scanners' },
      { slug: 'storage-filing', name: 'Storage & Filing' },
      { slug: 'meeting', name: 'Meeting & Conferencing' },
    ],
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    tagline: 'Drive, maintain, upgrade',
    icon: 'Car',
    subcategories: [
      { slug: 'car-audio', name: 'Car Audio' },
      { slug: 'car-care', name: 'Car Care' },
      { slug: 'car-accessories', name: 'Car Accessories' },
      { slug: 'motorbike', name: 'Motorbike Gear' },
      { slug: 'car-tech', name: 'Car Electronics' },
      { slug: 'tools-equipment', name: 'Tools & Equipment' },
    ],
  },
  {
    slug: 'health-wellness',
    name: 'Health & Wellness',
    tagline: 'Feel better, every day',
    icon: 'HeartPulse',
    subcategories: [
      { slug: 'vitamins', name: 'Vitamins & Supplements' },
      { slug: 'medical-supplies', name: 'Medical Supplies' },
      { slug: 'mental-wellness', name: 'Mental Wellness' },
      { slug: 'sleep', name: 'Sleep Aids' },
      { slug: 'first-aid', name: 'First Aid' },
      { slug: 'oral-care', name: 'Oral Care' },
      { slug: 'womens-health', name: "Women's Health" },
    ],
  },
];

export const CATEGORY_DEFS_B = B;

const all = [...A, ...B];

export const CATEGORIES: Category[] = all.map((c, i) => ({
  ...c,
  id: `cat_${i + 1}`,
  image: categoryImage(c.slug, i),
}));

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryName(categorySlug: string, subSlug: string): string {
  const cat = getCategory(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subSlug)?.name ?? subSlug;
}

export const SUBCATEGORY_TOTAL = CATEGORIES.reduce((n, c) => n + c.subcategories.length, 0);