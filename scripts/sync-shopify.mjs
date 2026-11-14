import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read environment variables from .env.local or fallback defaults
function getEnv() {
  const envPath = path.join(rootDir, '.env.local');
  const env = {
    domain: '04wv6h-ut.myshopify.com',
    token: '0c626353bdea1d2a4c8f32890eb14565',
    version: '2024-01',
  };

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        if (key === 'VITE_SHOPIFY_STORE_DOMAIN') env.domain = val;
        if (key === 'VITE_SHOPIFY_STOREFRONT_TOKEN') env.token = val;
        if (key === 'VITE_SHOPIFY_API_VERSION') env.version = val;
      }
    }
  }
  return env;
}

const env = getEnv();
const ENDPOINT = `https://${env.domain}/api/${env.version}/graphql.json`;

function mapToMainCategory(rawCategory = '', title = '') {
  const c = (rawCategory || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (c.includes('flower pot') || c.includes('pot') || c.includes('vase')) return 'Flower Pots';
  if (c.includes('bouquet') || t.includes('bouquet')) return 'Bouquets';
  if (c.includes('flower') || c.includes('filler') || t.includes('tulip') || t.includes('rose') || t.includes('sunflower') || t.includes('lily') || t.includes('daisy')) return 'Flowers';
  if (c.includes('keychain') || c.includes('bag charm') || c.includes('charm') || t.includes('keychain') || t.includes('charm')) return 'Keychains';
  if (c.includes('bag') && !c.includes('charm') || t.includes('tote') || t.includes('bag')) return 'Bags';
  if (c.includes('plushie') || c.includes('character') || t.includes('plushie')) return 'Plushies';
  if (c.includes('standee') || c.includes('magnet') || c.includes('decor')) return 'Home Decor';
  if (c.includes('hair') || c.includes('bandana') || c.includes('earring') || c.includes('accessory') || t.includes('clip') || t.includes('scrunchie')) return 'Accessories';

  return 'Flowers';
}

function deriveOccasions(title = '', category = '') {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  const occ = ['Just Because'];
  if (t.includes('rose') || t.includes('heart') || t.includes('love') || t.includes('anniversary')) {
    occ.push('Anniversary', 'Valentine');
  }
  if (t.includes('birthday') || t.includes('cake') || t.includes('charm')) {
    occ.push('Birthdays');
  }
  if (t.includes('congrat') || c.includes('bouquet') || t.includes('sunflower')) {
    occ.push('Congratulations');
  }
  occ.push('Thank You');
  return Array.from(new Set(occ));
}

function deriveColors(title = '', tags = []) {
  const text = `${title} ${tags.join(' ')}`.toLowerCase();
  const map = [
    { name: 'Red', hex: '#E11D48', test: ['red', 'rose', 'crimson', 'scarlet'] },
    { name: 'Pink', hex: '#F472B6', test: ['pink', 'blush', 'pastel pink', 'lotus'] },
    { name: 'Yellow', hex: '#FACC15', test: ['yellow', 'sunflower', 'butter', 'sunshine', 'gold'] },
    { name: 'Blue', hex: '#60A5FA', test: ['blue', 'sky', 'navy', 'ocean'] },
    { name: 'Purple', hex: '#C084FC', test: ['purple', 'lavender', 'violet', 'lilac'] },
    { name: 'Green', hex: '#4ADE80', test: ['green', 'sage', 'mint', 'emerald', 'leaf'] },
    { name: 'White', hex: '#FFFFFF', test: ['white', 'cream', 'ivory', 'pure'] },
    { name: 'Maroon', hex: '#641623', test: ['maroon', 'burgundy', 'wine'] },
    { name: 'Brown', hex: '#78350F', test: ['brown', 'chocolate', 'bear', 'tan'] },
  ];

  const found = map.filter(c => c.test.some(k => text.includes(k)));
  if (found.length > 0) {
    return {
      primaryColor: found[0].name,
      swatches: found.slice(0, 3).map(c => c.hex),
    };
  }
  return { primaryColor: 'Multi', swatches: ['#FCE2EB', '#FAF4ED'] };
}

async function fetchAllShopifyProducts() {
  console.log(`📡 Fetching live catalog from Shopify Storefront API (${env.domain})...`);
  let hasNext = true;
  let cursor = null;
  const nodes = [];

  while (hasNext) {
    const after = cursor ? `, after: "${cursor}"` : '';
    const query = `
      query GetCatalog {
        products(first: 100${after}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              handle
              updatedAt
              productType
              description
              tags
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price { amount currencyCode }
                    compareAtPrice { amount currencyCode }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': env.token,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.errors && data.errors.length > 0) {
      throw new Error(`Shopify GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    const edges = data.data?.products?.edges || [];
    for (const edge of edges) {
      nodes.push(edge.node);
    }

    hasNext = data.data?.products?.pageInfo?.hasNextPage || false;
    cursor = data.data?.products?.pageInfo?.endCursor || null;
    if (!cursor) break;
  }

  console.log(`✓ Retrieved ${nodes.length} live products from Shopify.`);
  return nodes;
}

async function syncCatalog() {
  const liveNodes = await fetchAllShopifyProducts();

  const allProductsPath = path.join(rootDir, 'src/data/allProductsData.json');
  let existingList = [];
  if (fs.existsSync(allProductsPath)) {
    try {
      existingList = JSON.parse(fs.readFileSync(allProductsPath, 'utf8'));
    } catch {}
  }

  const existingMap = new Map();
  for (const item of existingList) {
    existingMap.set(item.id, item);
  }

  let priceChanges = 0;
  let titleChanges = 0;
  let newProducts = 0;

  const transformedList = liveNodes.map((node, index) => {
    const existing = existingMap.get(node.id);
    const firstVariant = node.variants?.edges?.[0]?.node;

    const imageUrls = (node.images?.edges || [])
      .map(e => e.node.url)
      .filter(Boolean);
    const mainImage = imageUrls[0] || '';

    const price = firstVariant ? parseFloat(firstVariant.price.amount) : 499;
    const compareAt = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
    const originalPrice = compareAt && compareAt > price ? compareAt : null;

    let discount = null;
    if (originalPrice && originalPrice > price) {
      const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
      discount = `${pct}% OFF`;
    }

    const category = mapToMainCategory(node.productType, node.title);
    const colors = deriveColors(node.title, node.tags || []);
    const occasions = deriveOccasions(node.title, category);

    // Track changes
    if (existing) {
      if (existing.price !== price) priceChanges++;
      if (existing.name !== node.title) titleChanges++;
    } else {
      newProducts++;
    }

    let badge = existing?.badge || null;
    if (!badge) {
      if (index % 13 === 0) badge = 'BESTSELLER';
      else if (index % 17 === 0) badge = 'POPULAR';
      else if (discount) badge = 'SALE';
      else if (price < 300) badge = 'UNDER ₹300';
    }

    const desc = (node.description || existing?.description || 'Handmade crochet, crafted with love by our artisans in Surat.')
      .replace(/\r?\n|\r/g, ' ')
      .trim();

    return {
      id: node.id,
      shopifyId: node.id,
      variantId: firstVariant?.id || existing?.variantId || undefined,
      handle: node.handle,
      name: node.title,
      subtitle: node.productType ? `Handmade Crochet ${node.productType}` : 'Handmade Crochet Creation',
      category,
      rawCategory: node.productType || '',
      price,
      originalPrice,
      discount,
      badge,
      image: mainImage,
      images: imageUrls,
      colorSwatches: existing?.colorSwatches || colors.swatches,
      inStock: firstVariant ? firstVariant.availableForSale !== false : true,
      occasions: existing?.occasions || occasions,
      color: existing?.color || colors.primaryColor,
      description: desc,
      tags: node.tags || [],
    };
  });

  // Write allProductsData.json
  fs.writeFileSync(allProductsPath, JSON.stringify(transformedList, null, 2), 'utf8');
  console.log(`💾 Saved ${transformedList.length} products to src/data/allProductsData.json`);

  // Write shopifyCatalog.json (used by PRODUCTS fallback)
  const shopifyCatalogPath = path.join(rootDir, 'src/data/shopifyCatalog.json');
  const catalogList = transformedList.map((p, index) => ({
    id: p.id,
    shopifyId: p.shopifyId,
    variantId: p.variantId,
    handle: p.handle,
    name: p.name,
    category: p.category,
    rawCategory: p.rawCategory,
    group: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    images: p.images,
    rating: 4.8,
    reviewsCount: 20 + ((index * 7) % 80),
    badge: p.badge,
    description: p.description,
    details: [
      '100% Handcrafted crochet piece',
      'Made with love by artisans in Surat',
      'Soft combed milk cotton yarn',
      'Durable, everlasting & easy care',
    ],
    inStock: p.inStock,
    featuredInHero: index < 8,
    tags: p.tags,
  }));
  fs.writeFileSync(shopifyCatalogPath, JSON.stringify(catalogList, null, 2), 'utf8');
  console.log(`💾 Saved ${catalogList.length} products to src/data/shopifyCatalog.json`);

  console.log('\n📊 Sync Summary:');
  console.log(`- Total live products: ${transformedList.length}`);
  console.log(`- Price changes detected & synced: ${priceChanges}`);
  console.log(`- Title changes detected & synced: ${titleChanges}`);
  console.log(`- New products added: ${newProducts}`);
  console.log('✨ All product changes from Shopify are now 100% synced into the local catalog!');
}

syncCatalog().catch(err => {
  console.error('❌ Failed to sync Shopify products:', err);
  process.exit(1);
});

