/* ------------------------------------------------------------------ */
/* LUNA — Image registry                                               */
/*                                                                     */
/* Every remote image goes through `u()` so dimensions/quality are     */
/* consistent, and SmartImage falls back automatically if a URL fails.  */
/* ------------------------------------------------------------------ */

/** Build a cropped Unsplash URL from a photo id. */
export function u(id: string, w = 900, h = 900): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

/** Wide banner crop (hero, promos, editorial). */
export function uw(id: string, w = 1600, h = 700): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;
}

/** Deterministic local-safe placeholder (last-resort fallback). */
export function fallbackImage(seed: string, label = 'LUNA'): string {
  return `/api/placeholder?seed=${encodeURIComponent(seed)}&label=${encodeURIComponent(label)}`;
}

/* ---------------- Category image pools (products) ---------------- */

const POOL_TRAVEL = [
  '1488646953014-85cb44e25828',
  '1469854523086-cc02fe5d8800',
  '1503220317375-aaad61436b1b',
  '1553913861-c0fddf2619ee',
  '1508672019048-805c876b67e2',
  '1544620347-c4fd4a3d5957',
  '1527631746610-bca00a040d60',
  '1506905925346-21bda4d32df4',
  '1530521954074-e64f6810b32d',
  '1436491865332-7a61a109cc05',
];

const POOL_ELECTRONICS = [
  '1505740420928-5e560c06d30e',
  '1546435770-a3e426bf472b',
  '1583394838336-acd977736f90',
  '1517336714731-489689fd1ca8',
  '1496181133206-80ce9b88a853',
  '1531297484001-80022131f5a1',
  '1519389950473-47ba0277781c',
  '1541140532154-b024d705b90a',
  '1511707171634-5f897ff02aa9',
  '1592750475338-74b7b21085ab',
  '1526170375885-4d8ecf77b99f',
  '1502920917128-1aa500764cbd',
  '1461151304267-38535e780c79',
  '1589003077984-894e133dabab',
  '1558089687-f282ffcbc126',
  '1593359677879-a4bb92f829d1',
];

const POOL_FASHION = [
  '1523381210434-271e8be1f52b',
  '1483985988355-763728e1935b',
  '1445205170230-053b83016050',
  '1490481651871-ab68de25d43d',
  '1469334031218-e382a71b716b',
  '1542291026-7eec264c27ff',
  '1549298916-b41d501d3772',
  '1525966222134-fcfa99b8ae77',
  '1560769629-975ec94e6a86',
  '1600185365483-26d7a4cc7519',
  '1543163521-1bf539c55dd2',
  '1552374196-c4e7ffc6e126',
  '1617137968427-85924c800a22',
  '1596755094514-f87e34085b2c',
  '1618354691373-d851c5c3a990',
  '1620012253295-c15cc3e65df4',
];

const POOL_HOME = [
  '1555041469-a586c61ea9bc',
  '1567538096630-e0c55bd6374c',
  '1586023492125-27b2c045efd7',
  '1616486338812-3dadae4b4ace',
  '1616594039964-ae9021a400a0',
  '1505693416388-ac5ce068fe85',
  '1584100936595-c0654b55a2e2',
  '1556911220-bff31c812dba',
  '1484154218962-a197022b5858',
  '1524758631624-e2822e304c36',
  '1513694203232-719a280e022f',
  '1567016432779-094069958ea5',
  '1615874959474-d609969a20ed',
  '1618220179428-22790b461013',
];
const POOL_BEAUTY = [
  '1596462502278-27bfdc403348',
  '1571781926291-c477ebfd024b',
  '1522335789203-aabd1fc54bc9',
  '1512496015851-a90fb38ba796',
  '1487412720507-e7ab37603c6f',
  '1503236823255-94609f598e71',
  '1594035910387-fea47794261f',
  '1617897903246-719242758050',
  '1620916566398-39f1143ab7be',
  '1585652757141-8837d676fac8',
  '1560066984-138dadb4c035',
];

const POOL_SPORTS = [
  '1461896836934-ffe607ba8211',
  '1552674605-db6ffd4facb5',
  '1534438327276-14e5300c3a48',
  '1571019613454-1cb2f99b2d8b',
  '1576678927484-cc907957088c',
  '1544367567-0f2fcb009e0b',
  '1518611012118-696072aa579a',
  '1517836357463-d25dfeac3438',
  '1599058917212-d750089bc07e',
  '1571902943202-507ec2618e8f',
  '1519861531473-9200262188bf',
  '1519315901367-f34ff9154487',
  '1600965962361-9035dbfd1c50',
  '1549719386-74dfcbf7dbed',
];

const POOL_TOYS = [
  '1558877385-8c1b8c1e4a2f',
  '1594787318286-3d835c1d207f',
  '1560961911-ba7ef651a56c',
  '1587654780291-39c9404d746b',
  '1559454403-b8fb88521f11',
  '1519689680058-324335c77eba',
  '1522771930-78848d9293e8',
  '1566576912321-d58ddd7a6088',
  '1596461404969-9ae70f2830c1',
];

const POOL_BOOKS = [
  '1512820790803-83ca734da794',
  '1495446815901-a7297e633e8d',
  '1524995997946-a1c2e315a42f',
  '1544716278-ca5e3f4abd8c',
  '1507842217343-583bb7270b66',
  '1474932430478-367dbb6832c1',
  '1516979187457-637abb4f9353',
  '1521587760476-6c12a4b040da',
  '1526243741027-444d633d7365',
  '1497633762265-9d179a990aa6',
];

const POOL_PETS = [
  '1543466835-00a7907e9de1',
  '1583511655857-d19b40a7a54e',
  '1601758228041-f3b2795255f1',
  '1587300003388-59208cc962cb',
  '1573865526739-10659fec78a5',
  '1518791841217-8f162f1e1131',
  '1592194996308-7b43878e84a6',
  '1548767797-d8c844163c4c',
  '1444212477490-ca407925329e',
  '1425082661705-1834bfd09dca',
];

const POOL_ACCESSORIES = [
  '1511499767150-a48a237f0083',
  '1523779917675-b6ed3a42a561',
  '1627123424574-724758594e93',
  '1553062407-98eeb64c6a62',
  '1548036328-c9fa89d128fa',
  '1601924994987-69e26d50dc26',
  '1610652492500-ded49ceeb378',
  '1590548784585-643d2b9f2925',
  '1515562141207-7a88fb7ce338',
  '1599643478518-a784e5dc4c8f',
];

const POOL_GROCERY = [
  '1542838132-92c53300491e',
  '1579113800032-c38bd7635818',
  '1586201375761-83865001e31c',
  '1575377427642-087cf684f29d',
  '1447933601403-0c6688de566e',
  '1587049352846-4a222e784d38',
  '1606312619070-d48b4c652a52',
  '1558961363-fa8fdf82db35',
  '1553163147-622ab57be1c7',
  '1592924357228-91a4daadcfea',
];

const POOL_OFFICE = [
  '1497215728101-856f4ea42174',
  '1497366754035-f200968a6e72',
  '1521791136064-7986c2920216',
  '1552664730-d307ca884978',
  '1531973576160-7125cd663d86',
  '1517842645767-c639042777db',
  '1507925921958-8a62f3d1a50d',
  '1583485088034-697b5bc54ccd',
  '1516962126636-27ad087061cc',
  '1607166452427-7e4477079cb9',
];

const POOL_AUTO = [
  '1503376780353-7e6692767b70',
  '1494976388531-d1058494cdd8',
  '1552519507-da3b142c6e3d',
  '1541899481282-d53bffe3c35d',
  '1492144534655-ae79c964c9d7',
  '1553440569-bcc63803a83d',
  '1502877338535-766e1452684a',
  '1487754180451-c456f719a1fc',
  '1550355291-bbee04a92027',
  '1542362567-b07e54358753',
];

const POOL_HEALTH = [
  '1506126613408-eca07ce68773',
  '1519824145371-296894a0daa9',
  '1584308666744-24d5c474f2ae',
  '1607619056574-7b8d3ee536b2',
  '1550831107-1553da8c8464',
  '1576091160399-112ba8d25d1d',
  '1631549916768-4119b2e5f926',
  '1584515933487-779824d29309',
  '1471864190281-a93a3070b6de',
  '1545205597-3d9d02c29597',
];

/** Raw Unsplash photo ids grouped by category slug. */
export const CATEGORY_POOLS: Record<string, string[]> = {
  electronics: POOL_ELECTRONICS,
  fashion: POOL_FASHION,
  'home-living': POOL_HOME,
  beauty: POOL_BEAUTY,
  sports: POOL_SPORTS,
  'toys-kids': POOL_TOYS,
  books: POOL_BOOKS,
  'pet-supplies': POOL_PETS,
  travel: POOL_TRAVEL,
  accessories: POOL_ACCESSORIES,
  grocery: POOL_GROCERY,
  office: POOL_OFFICE,
  automotive: POOL_AUTO,
  'health-wellness': POOL_HEALTH,
};

/** Full-bleed editorial imagery. */
export const EDITORIAL = {
  hero: [
    '1483985988355-763728e1935b',
    '1445205170230-053b83016050',
    '1483985988355-763728e1935b',
    '1469334031218-e382a71b716b',
    '1441986300917-64674bd600d8',
    '1472851294608-062f824d29cc',
  ],
  promo: ['1542838132-92c53300491e', '1481437156560-3205f6a85735', '1513694203232-719a280e022f'],
  category: [
    '1523381210434-271e8be1f52b',
    '1517336714731-489689fd1ca8',
    '1555041469-a586c61ea9bc',
    '1596462502278-27bfdc403348',
    '1534438327276-14e5300c3a48',
    '1560961911-ba7ef651a56c',
    '1512820790803-83ca734da794',
    '1543466835-00a7907e9de1',
    '1503220317375-aaad61436b1b',
    '1511499767150-a48a237f0083',
    '1542838132-92c53300491e',
    '1497215728101-856f4ea42174',
    '1503376780353-7e6692767b70',
    '1506126613408-eca07ce68773',
  ],
  story: ['1441986300917-64674bd600d8', '1490481651871-ab68de25d43d', '1472851294608-062f824d29cc'],
};

/** Deterministic pool selection — stable across server/client renders. */
export function pickImages(slug: string, index: number, count = 3): string[] {
  const pool = CATEGORY_POOLS[slug] ?? CATEGORY_POOLS.electronics;
  const out: string[] = [];
  const step = pool.length >= count * 2 ? Math.max(1, Math.floor(pool.length / count)) : 1;
  for (let i = 0; i < count; i++) {
    out.push(u(pool[(index + i * step) % pool.length]));
  }
  return Array.from(new Set(out)).length === out.length
    ? out
    : Array.from({ length: count }, (_, i) => u(pool[(index + i) % pool.length]));
}

export function categoryImage(slug: string, index = 0): string {
  const pool = CATEGORY_POOLS[slug] ?? CATEGORY_POOLS.electronics;
  return u(pool[index % pool.length], 640, 640);
}

/** Deterministic reviewer avatars (local-friendly). */
export function avatar(seed: number, gender: 'women' | 'men' = 'women'): string {
  return `https://randomuser.me/api/portraits/${gender}/${(seed % 99) + 1}.jpg`;
}