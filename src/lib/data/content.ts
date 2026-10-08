import type { FaqItem, HeroSlide, Testimonial } from '../types';
import { u, uw, avatar } from '../images';

/* ------------------------------------------------------------------ */
/* Hero slides — 6 rotating stories, ~300px tall rounded banner        */
/* ------------------------------------------------------------------ */

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero_elevate',
    eyebrow: 'New season',
    title: 'Elevate Your Everyday',
    copy: 'Discover quality products across every category — made for the way you live.',
    cta: { label: 'Shop Now', href: '/shop' },
    secondary: { label: 'Browse categories', href: '/shop' },
    image: uw('1483985988355-763728e1935b', 900, 640),
    tone: 'light',
    bg: '#E7EFE6',
    sale: { kicker: 'SUMMER SALE', upTo: 'UP TO', percent: '40%', suffix: 'OFF' },
  },
  {
    id: 'hero_summer',
    eyebrow: 'Summer edit',
    title: 'Summer Essentials',
    copy: 'Light fabrics, beach-ready tech and travel sizes — everything the season asks for.',
    cta: { label: 'Shop Now', href: '/shop?tag=featured' },
    secondary: { label: 'See deals', href: '/shop/deals' },
    image: uw('1523381210434-271e8be1f52b', 900, 640),
    tone: 'light',
    bg: '#F3EEE0',
    sale: { kicker: 'SUN SALE', upTo: 'UP TO', percent: '30%', suffix: 'OFF' },
  },
  {
    id: 'hero_upgrade',
    eyebrow: 'Home & Living',
    title: 'Upgrade Your Lifestyle',
    copy: 'Furniture, lighting and small comforts that make the room feel finished.',
    cta: { label: 'Shop Now', href: '/shop/home-living' },
    secondary: { label: 'New arrivals', href: '/new-arrivals' },
    image: uw('1586023492125-27b2c045efd7', 900, 640),
    tone: 'light',
    bg: '#E6EDF2',
    sale: { kicker: 'HOME EVENT', upTo: 'UP TO', percent: '25%', suffix: 'OFF' },
  },
  {
    id: 'hero_fresh',
    eyebrow: 'Just landed',
    title: 'Fresh Arrivals',
    copy: 'The newest drops across fashion, beauty and tech — in stock and ready to ship.',
    cta: { label: 'Shop Now', href: '/new-arrivals' },
    secondary: { label: 'Trending', href: '/shop?sort=popular' },
    image: uw('1445205170230-053b83016050', 900, 640),
    tone: 'light',
    bg: '#F2E9E4',
    sale: { kicker: 'NEW IN', upTo: 'FROM', percent: '20%', suffix: 'OFF' },
  },
  {
    id: 'hero_style',
    eyebrow: 'Fashion',
    title: 'Your Style. Your Story.',
    copy: 'Wardrobe staples and statement pieces from the brands worth dressing in.',
    cta: { label: 'Shop Now', href: '/shop/fashion' },
    secondary: { label: 'Lookbook', href: '/inspiration' },
    image: uw('1469334031218-e382a71b716b', 900, 640),
    tone: 'light',
    bg: '#ECE9F3',
    sale: { kicker: 'STYLE SALE', upTo: 'UP TO', percent: '35%', suffix: 'OFF' },
  },
  {
    id: 'hero_mega',
    eyebrow: 'Limited time',
    title: 'Mega LUNA Sale',
    copy: 'Our biggest prices of the season across every department — while stock lasts.',
    cta: { label: 'Shop Now', href: '/shop/deals' },
    secondary: { label: 'All deals', href: '/shop/deals' },
    image: uw('1472851294608-062f824d29cc', 900, 640),
    tone: 'light',
    bg: '#F5EDDF',
    sale: { kicker: 'MEGA SALE', upTo: 'UP TO', percent: '60%', suffix: 'OFF' },
  },
];

/* ------------------------------------------------------------------ */
/* Promo cards                                                         */
/* ------------------------------------------------------------------ */

export const PROMO_CARDS = [
  {
    id: 'promo_new_arrivals',
    eyebrow: 'New Arrivals',
    title: 'Fresh Styles Just In',
    href: '/new-arrivals',
    cta: 'Shop Now',
    image: u('1490481651871-ab68de25d43d', 700, 700),
    bg: '#DDE6D5',
  },
  {
    id: 'promo_home_refresh',
    eyebrow: 'Home Refresh',
    title: 'Make Your Space Better',
    href: '/shop/home-living',
    cta: 'Shop Now',
    image: u('1555041469-a586c61ea9bc', 700, 700),
    bg: '#F3EDDF',
  },
  {
    id: 'promo_tech_essentials',
    eyebrow: 'Tech Essentials',
    title: 'Upgrade Your Lifestyle',
    href: '/shop/electronics',
    cta: 'Shop Now',
    image: u('1592750475338-74b7b21085ab', 700, 700),
    bg: '#DCE8F1',
  },
];
/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst_1',
    name: 'Sarah J.',
    location: 'United States',
    role: 'Verified buyer',
    quote: 'Amazing quality and fast delivery! LUNA has become my go-to store for everything.',
    rating: 5,
    avatar: avatar(11, 'women'),
    product: 'Aurora X1 Noise-Cancelling Headphones',
  },
  {
    id: 'tst_2',
    name: 'Michael T.',
    location: 'United Kingdom',
    role: 'Verified buyer',
    quote: 'Great prices, excellent customer service, and super easy returns. Highly recommend!',
    rating: 4,
    avatar: avatar(23, 'men'),
    product: 'Everyday Oxford Shirt',
  },
  {
    id: 'tst_3',
    name: 'Priya K.',
    location: 'India',
    role: 'Verified buyer',
    quote: 'I love the variety they offer. I can find everything in one place. So convenient!',
    rating: 5,
    avatar: avatar(37, 'women'),
    product: 'Vitamin C Brightening Serum',
  },
  {
    id: 'tst_4',
    name: 'Ravi Menon',
    location: 'Dubai, United Arab Emirates',
    role: 'Verified buyer',
    quote:
      'The account manager can see stock across regions before I promise anything to a client, which has removed a lot of back and forth.',
    rating: 5,
    avatar: avatar(41, 'men'),
    product: 'Atlas of Imaginary Places',
  },
  {
    id: 'tst_5',
    name: 'Hannah Lindqvist',
    location: 'Stockholm, Sweden',
    role: 'Verified buyer',
    quote:
      'Supporting a small shop is not a phrase I expected to read on a homepage, and yet here it is. The pet line is now the only one I buy from.',
    rating: 5,
    avatar: avatar(53, 'women'),
    product: 'Orthopaedic Memory Foam Dog Bed',
  },
  {
    id: 'tst_6',
    name: 'Yuki Tanaka',
    location: 'Osaka, Japan',
    role: 'Verified buyer',
    quote:
      'Sizing guidance, material details and a real specification table. I shop elsewhere when I have to, but not when I do not.',
    rating: 5,
    avatar: avatar(67, 'women'),
    product: 'Merino Crew-Neck Sweater',
  },
];

/* ------------------------------------------------------------------ */
/* Trust bar                                                           */
/* ------------------------------------------------------------------ */

export const TRUST_POINTS = [
  { title: 'Free Shipping', copy: 'On orders over $49' },
  { title: 'Easy Returns', copy: '30 days return policy' },
  { title: 'Secure Payments', copy: '100% secure checkout' },
  { title: '24/7 Support', copy: "We're here to help" },
];

/* ------------------------------------------------------------------ */
/* Help centre                                                        */
/* ------------------------------------------------------------------ */

export const FAQS: FaqItem[] = [
  {
    group: 'Orders',
    q: 'How do I track my order?',
    a: 'Open Track order in the footer and enter your order number plus the email used at checkout. Live courier updates appear there within an hour of dispatch.',
  },
  {
    group: 'Orders',
    q: 'Can I change or cancel an order after placing it?',
    a: 'Yes, within 60 minutes of placing it. Contact support with your order number and we will amend or cancel it before the warehouse picks it.',
  },
  {
    group: 'Shipping',
    q: 'What are the delivery times?',
    a: 'Standard delivery is 2 to 5 business days, express is next-day in most regions. Remote addresses can add one to two days, which is always shown before you pay.',
  },
  {
    group: 'Shipping',
    q: 'Do you ship to my country?',
    a: 'We ship to more than 180 countries. Enter your postcode at checkout to confirm availability and see the exact landed cost including duties.',
  },
  {
    group: 'Returns',
    q: 'What is your returns policy?',
    a: 'Most categories can be returned free within 30 days, electronics within 14. Items must be unused and in original packaging. Start a return from your account or the order page.',
  },
  {
    group: 'Returns',
    q: 'How long do refunds take?',
    a: 'Refunds are issued within two business days of the return arriving at our warehouse, and appear on your statement in a further 3 to 5 days.',
  },
  {
    group: 'Account',
    q: 'Do I need an account to order?',
    a: 'No. Guest checkout is available for every purchase. An account adds order history, saved addresses, a wishlist and loyalty points.',
  },
  {
    group: 'Account',
    q: 'How do I reset my password?',
    a: 'Select Forgot password on the sign-in page. We send a reset link by email that stays valid for 30 minutes.',
  },
  {
    group: 'Payments',
    q: 'Which payment methods do you accept?',
    a: 'All major cards, digital wallets, bank transfer and cash on delivery in supported regions. Payment details are never stored on our servers.',
  },
  {
    group: 'Payments',
    q: 'Can I pay in instalments?',
    a: 'Yes, on orders over $150 we offer three or four interest-free instalments at checkout in most regions.',
  },
];

export const FAQ_GROUPS = ['Orders', 'Shipping', 'Returns', 'Account', 'Payments'] as const;