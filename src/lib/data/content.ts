import type { FaqItem, HeroSlide, Testimonial } from '../types';
import { uw, avatar } from '../images';

/* ------------------------------------------------------------------ */
/* Hero slides — 6 rotating stories, ~300px tall rounded banner        */
/* ------------------------------------------------------------------ */

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero_new_season',
    eyebrow: 'Autumn Edit 2026',
    title: 'New season, better choices',
    copy: 'Wardrobe staples, home refreshes and tech upgrades — curated so you spend less time searching and more time living.',
    cta: { label: 'Shop new arrivals', href: '/new-arrivals' },
    secondary: { label: 'Browse categories', href: '/shop' },
    image: uw('1483985988355-763728e1935b', 1800, 760),
    tone: 'dark',
  },
  {
    id: 'hero_electronics',
    eyebrow: 'Electronics',
    title: 'Sound and screen, perfected',
    copy: 'Flagship audio, computing and smart home from brands we test ourselves. Free delivery and a 14-day return window.',
    cta: { label: 'Shop electronics', href: '/shop/electronics' },
    secondary: { label: 'See best sellers', href: '/shop/electronics?sort=popular' },
    image: uw('1445205170230-053b83016050', 1800, 760),
    tone: 'dark',
  },
  {
    id: 'hero_home',
    eyebrow: 'Home & Living',
    title: 'Make the room feel finished',
    copy: 'Furniture, lighting and textiles chosen for how they wear in rather than how they photograph.',
    cta: { label: 'Explore home', href: '/shop/home-living' },
    secondary: { label: 'Lighting picks', href: '/shop/home-living?sub=lighting' },
    image: uw('1586023492125-27b2c045efd7', 1800, 760),
    tone: 'light',
  },
  {
    id: 'hero_beauty',
    eyebrow: 'Beauty & Wellness',
    title: 'Routines that actually last',
    copy: 'Dermatologist-tested skincare, refillable packaging and clean formulas with the ingredient list up front.',
    cta: { label: 'Shop beauty', href: '/shop/beauty' },
    secondary: { label: 'Fragrance', href: '/shop/beauty?sub=fragrance' },
    image: uw('1487412720507-e7ab37603c6f', 1800, 760),
    tone: 'light',
  },
  {
    id: 'hero_fitness',
    eyebrow: 'Sports & Outdoors',
    title: 'Gear that earns its place',
    copy: 'Training, running and camping equipment tested by athletes and coaches, with free returns if it does not fit.',
    cta: { label: 'Shop sports', href: '/shop/sports' },
    secondary: { label: 'Outdoor & camping', href: '/shop/sports?sub=outdoor-camping' },
    image: uw('1552674605-db6ffd4facb5', 1800, 760),
    tone: 'dark',
  },
  {
    id: 'hero_grocery',
    eyebrow: 'Grocery & Pantry',
    title: 'Pantry staples, traceable lots',
    copy: 'Single-origin coffee, cold-pressed oils and bakery-grade flour delivered fresh to your door every week.',
    cta: { label: 'Shop grocery', href: '/shop/grocery' },
    secondary: { label: 'Coffee & tea', href: '/shop/grocery?sub=coffee-tea' },
    image: uw('1447933601403-0c6688de566e', 1800, 760),
    tone: 'light',
  },
];

/* ------------------------------------------------------------------ */
/* Promo cards                                                         */
/* ------------------------------------------------------------------ */

export const PROMO_CARDS = [
  {
    id: 'promo_sale',
    eyebrow: 'Flash sale',
    title: 'Up to 60% off selected lines',
    copy: 'Ends Sunday midnight. Free delivery on orders over $99.',
    href: '/shop/deals',
    cta: 'Shop deals',
    image: uw('1445205170230-053b83016050', 900, 1100),
    tone: 'dark' as const,
  },
  {
    id: 'promo_electronics',
    eyebrow: 'Tech week',
    title: 'Audio & computing event',
    copy: 'Bundled accessories and two-year warranties as standard.',
    href: '/shop/electronics',
    cta: 'Explore tech',
    image: uw('1517336714731-489689fd1ca8', 900, 1100),
    tone: 'light' as const,
  },
  {
    id: 'promo_home',
    eyebrow: 'Home refresh',
    title: 'Save 20% on lighting',
    copy: 'Free returns for 30 days on all lighting orders.',
    href: '/shop/home-living?sub=lighting',
    cta: 'Shop lighting',
    image: uw('1524758631624-e2822e304c36', 900, 1100),
    tone: 'light' as const,
  },
];
/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst_1',
    name: 'Amelia Hart',
    location: 'Seattle, United States',
    role: 'Verified buyer',
    quote:
      'I have ordered from bigger marketplaces and LUNA is the only one where the delivery estimate turned out to be right. The returns took four minutes.',
    rating: 5,
    avatar: avatar(11, 'women'),
    product: 'Aurora X1 Noise-Cancelling Headphones',
  },
  {
    id: 'tst_2',
    name: 'Daniel Okafor',
    location: 'Lagos, Nigeria',
    role: 'Verified buyer',
    quote:
      'The product specs here are actually honest. I compared three sites before buying the same speaker and LUNA was the only one with a real noise floor figure.',
    rating: 5,
    avatar: avatar(23, 'men'),
    product: 'Studio One Reference Monitors',
  },
  {
    id: 'tst_3',
    name: 'Sofia Marchetti',
    location: 'Milan, Italy',
    role: 'Verified buyer',
    quote:
      'I furnished a two-bedroom apartment entirely through LUNA. Everything arrived on the day promised and the flat-pack instructions actually made sense.',
    rating: 4,
    avatar: avatar(37, 'women'),
    product: 'Chesterfield Modular Sofa',
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
  { title: 'Free delivery over $99', copy: 'Express to 180+ countries, tracked end to end.' },
  { title: '30-day free returns', copy: 'No restocking fees, prepaid labels in every region.' },
  { title: 'Secure checkout', copy: 'Card, wallet, bank transfer and cash on delivery.' },
  { title: 'Support that answers', copy: 'Real people, median 3-hour first response.' },
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