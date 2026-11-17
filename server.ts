import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import type {
  AdminOverviewPayload,
  CategoryItem,
  HeroBanner,
  Order,
  OrderStatus,
  Product,
  PromoBanner,
  Subscriber,
} from './src/types.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreSchema {
  products: Product[];
  categories: CategoryItem[];
  heroBanners: HeroBanner[];
  promoBanners: PromoBanner[];
  orders: Order[];
  subscribers: Subscriber[];
}

const ASSETS = {
  heroHeritage: '/src/assets/images/hero_heritage_crimson_1794898669437.jpg',
  heroWinter: '/src/assets/images/hero_winter_editorial_1794898669998.jpg',
  womenSaree: '/src/assets/images/cat_women_saree_1794898669744.jpg',
  menPanjabi: '/src/assets/images/cat_men_panjabi_1794898670419.jpg',
  jewellery: '/src/assets/images/cat_jewellery_macro_1794898671600.jpg',
  homeNakshi: '/src/assets/images/cat_home_nakshi_1794898672070.jpg',
  kidsEthnic: '/src/assets/images/cat_kids_ethnic_1794898672258.jpg',
  giftsSkincare: '/src/assets/images/cat_gifts_skincare_1794898672578.jpg',
};

function createSeedStore(): StoreSchema {
  const now = new Date().toISOString();

  const categories: CategoryItem[] = [
    {
      id: 'cat-women',
      name: 'Women',
      slug: 'women',
      image: ASSETS.womenSaree,
      tagline: 'Jamdani Sarees · Shalwar Kameez · Kurtis',
      visible: true,
      sortOrder: 1,
    },
    {
      id: 'cat-men',
      name: 'Men',
      slug: 'men',
      image: ASSETS.menPanjabi,
      tagline: 'Tailored Panjabis · Coats · Heritage Shirts',
      visible: true,
      sortOrder: 2,
    },
    {
      id: 'cat-kids',
      name: "Kids'",
      slug: 'kids',
      image: ASSETS.kidsEthnic,
      tagline: 'Festive Kurtas · Frocks · Handloom Sets',
      visible: true,
      sortOrder: 3,
    },
    {
      id: 'cat-home',
      name: 'Home Décor',
      slug: 'home-decor',
      image: ASSETS.homeNakshi,
      tagline: 'Nakshi Kantha · Cushion Covers · Pottery',
      visible: true,
      sortOrder: 4,
    },
    {
      id: 'cat-jewellery',
      name: 'Jewellery',
      slug: 'jewellery',
      image: ASSETS.jewellery,
      tagline: 'Oxidized Silver · Enamel Bangles · Rings',
      visible: true,
      sortOrder: 5,
    },
    {
      id: 'cat-skin',
      name: 'Skin & Hair',
      slug: 'skin-hair',
      image: ASSETS.giftsSkincare,
      tagline: 'Botanical Oils · Herbal Cleansers · Serums',
      visible: true,
      sortOrder: 6,
    },
    {
      id: 'cat-gifts',
      name: 'Gifts & Crafts',
      slug: 'gifts-crafts',
      image: ASSETS.homeNakshi,
      tagline: 'Artisan Hampers · Brassware · Notebooks',
      visible: true,
      sortOrder: 7,
    },
    {
      id: 'cat-wedding',
      name: 'Wedding',
      slug: 'wedding',
      image: ASSETS.heroHeritage,
      tagline: 'Bridal Jamdani · Velvet Sherwani · Trousseau',
      visible: true,
      sortOrder: 8,
    },
  ];

  const heroBanners: HeroBanner[] = [
    {
      id: 'hero-1',
      eyebrow: 'NAIEM ARONG · SIGNATURE EDITION',
      title: 'Crimson Loom & Obsidian Craft',
      subtitle:
        'Handwoven Jamdani silks and precision-embroidered Panjabis crafted by master artisans across Bangladesh.',
      ctaLabel: 'SHOP THE COLLECTION',
      targetCategory: 'women',
      image: ASSETS.heroHeritage,
      theme: 'light',
      active: true,
      sortOrder: 1,
    },
    {
      id: 'hero-2',
      eyebrow: 'WINTER 26 · LIMITED ARCHIVE',
      title: 'The Midnight & Crimson Edit',
      subtitle:
        'Layered handspun woollen shawls, structured Nehru jackets, and tailored winter silhouettes.',
      ctaLabel: 'EXPLORE WINTER 26',
      targetCategory: 'winter-26',
      image: ASSETS.heroWinter,
      theme: 'dark',
      active: true,
      sortOrder: 2,
    },
    {
      id: 'hero-3',
      eyebrow: 'HANDCRAFTED SILVER & ENAMEL',
      title: 'Artisanal Jewellery Vault',
      subtitle:
        'Bold oxidized silver bangles and deep crimson meenakari statements sculpted by heritage silversmiths.',
      ctaLabel: 'DISCOVER JEWELLERY',
      targetCategory: 'jewellery',
      image: ASSETS.jewellery,
      theme: 'crimson',
      active: true,
      sortOrder: 3,
    },
  ];

  const promoBanners: PromoBanner[] = [
    {
      id: 'promo-1',
      eyebrow: 'ARTISANAL ADORNMENT',
      title: 'Silver & Crimson Enamel Bangles',
      ctaLabel: 'SHOP JEWELLERY',
      targetCategory: 'jewellery',
      image: ASSETS.jewellery,
    },
    {
      id: 'promo-2',
      eyebrow: 'HERITAGE INTERIORS',
      title: 'Hand-Stitched Nakshi Kantha Living',
      ctaLabel: 'EXPLORE HOME DÉCOR',
      targetCategory: 'home-decor',
      image: ASSETS.homeNakshi,
    },
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      sku: 'NA-WMN-0101',
      name: 'Crimson & Noir Handloom Jamdani Saree',
      subBrand: 'NA Heritage',
      category: 'Women',
      categorySlug: 'women',
      price: 12850,
      originalPrice: null,
      image: ASSETS.womenSaree,
      description:
        '84-count cotton-silk Jamdani woven over three weeks in Rupganj with geometric noir borders on deep digital crimson.',
      fabricOrMaterial: 'Muslin Cotton-Silk Blend',
      sizes: ['Free Size'],
      stock: 14,
      isNew: true,
      isFeatured: true,
      onSale: false,
      createdAt: now,
    },
    {
      id: 'prod-2',
      sku: 'NA-MEN-0204',
      name: 'Obsidian Red-Placket Embroidered Panjabi',
      subBrand: 'NA Studio',
      category: 'Men',
      categorySlug: 'men',
      price: 4250,
      originalPrice: 4950,
      image: ASSETS.menPanjabi,
      description:
        'Long-staple combed black cotton Panjabi with tonal crimson geometric hand-embroidery along the mandarin collar and placket.',
      fabricOrMaterial: '100% Egyptian Cotton',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 28,
      isNew: true,
      isFeatured: true,
      onSale: true,
      createdAt: now,
    },
    {
      id: 'prod-3',
      sku: 'NA-JWL-0309',
      name: 'Meenakari Crimson & Oxidized Silver Bangles',
      subBrand: 'Naiem Arong',
      category: 'Jewellery',
      categorySlug: 'jewellery',
      price: 3650,
      originalPrice: null,
      image: ASSETS.jewellery,
      description:
        'Set of handcrafted 925 silver-plated brass bangles featuring hammered textures and deep ruby enamel inlay.',
      fabricOrMaterial: 'Oxidized Brass & Enamel',
      sizes: ['2.4', '2.6', '2.8'],
      stock: 19,
      isNew: true,
      isFeatured: true,
      onSale: false,
      createdAt: now,
    },
    {
      id: 'prod-4',
      sku: 'NA-HOM-0412',
      name: 'Rajshahi Nakshi Kantha Cushion & Matte Vase Set',
      subBrand: 'NA Heritage',
      category: 'Home Décor',
      categorySlug: 'home-decor',
      price: 2950,
      originalPrice: 3400,
      image: ASSETS.homeNakshi,
      description:
        'Hand-quilted crimson and charcoal Nakshi Kantha cotton cushion cover paired with an artisanal black clay vessel.',
      fabricOrMaterial: 'Handspun Cotton & Terracotta',
      sizes: ['18" x 18"'],
      stock: 22,
      isNew: true,
      isFeatured: true,
      onSale: true,
      createdAt: now,
    },
    {
      id: 'prod-5',
      sku: 'NA-KID-0501',
      name: 'Block-Printed Festive Kurta & Embroidered Vest',
      subBrand: 'Naiem Arong',
      category: "Kids'",
      categorySlug: 'kids',
      price: 2450,
      originalPrice: null,
      image: ASSETS.kidsEthnic,
      description:
        'Soft breathable ivory cotton kurta with traditional crimson woodblock motifs and an obsidian floral embroidered vest.',
      fabricOrMaterial: 'Organic Handloom Cotton',
      sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
      stock: 31,
      isNew: true,
      isFeatured: false,
      onSale: false,
      createdAt: now,
    },
    {
      id: 'prod-6',
      sku: 'NA-SKN-0608',
      name: 'Botanical Saffron Serum & Noir Clay Gift Box',
      subBrand: 'NA Noir',
      category: 'Skin & Hair',
      categorySlug: 'skin-hair',
      price: 1850,
      originalPrice: null,
      image: ASSETS.giftsSkincare,
      description:
        'Cold-pressed botanical night elixir and mineral black clay balm presented in a signature satin-tied gift box.',
      fabricOrMaterial: 'Herbal Oils & Activated Clay',
      sizes: ['50ml + 100g'],
      stock: 40,
      isNew: true,
      isFeatured: true,
      onSale: false,
      createdAt: now,
    },
    {
      id: 'prod-7',
      sku: 'NA-WNT-0711',
      name: 'Handwoven Crimson Woollen Shawl & Linen Kurta',
      subBrand: 'NA Studio',
      category: 'Winter 26',
      categorySlug: 'winter-26',
      price: 6800,
      originalPrice: 7900,
      image: ASSETS.heroWinter,
      description:
        'Heavy-drape handloom merino-cotton shawl in signature Naiem Arong crimson layered with a structured ivory linen tunic.',
      fabricOrMaterial: 'Merino Wool & Raw Linen',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 11,
      isNew: true,
      isFeatured: true,
      onSale: true,
      createdAt: now,
    },
    {
      id: 'prod-8',
      sku: 'NA-WED-0802',
      name: 'Royal Crimson Jamdani & Obsidian Sherwani Duo',
      subBrand: 'NA Heritage',
      category: 'Wedding',
      categorySlug: 'wedding',
      price: 28500,
      originalPrice: null,
      image: ASSETS.heroHeritage,
      description:
        'Bespoke bridal Jamdani saree paired with a structured black raw-silk Panjabi ensemble for contemporary ceremonies.',
      fabricOrMaterial: 'Pure Rajshahi Silk & Jamdani',
      sizes: ['S', 'M', 'L', 'Custom'],
      stock: 6,
      isNew: true,
      isFeatured: true,
      onSale: false,
      createdAt: now,
    },
    {
      id: 'prod-9',
      sku: 'NA-GFT-0903',
      name: 'Signature Obsidian Ribbon Artisan Gift Hamper',
      subBrand: 'NA Noir',
      category: 'Gifts & Crafts',
      categorySlug: 'gifts-crafts',
      price: 3200,
      originalPrice: 3800,
      image: ASSETS.giftsSkincare,
      description:
        'Curated celebration box featuring organic fragrance oil, stoneware vessel, and hand-crafted greeting sleeve.',
      fabricOrMaterial: 'Curated Artisan Set',
      sizes: ['Standard Box'],
      stock: 25,
      isNew: false,
      isFeatured: false,
      onSale: true,
      createdAt: now,
    },
    {
      id: 'prod-10',
      sku: 'NA-JWL-0315',
      name: 'Ruby Enamel Drop Chandbali Earrings',
      subBrand: 'NA Noir',
      category: 'Jewellery',
      categorySlug: 'jewellery',
      price: 2150,
      originalPrice: 2500,
      image: ASSETS.jewellery,
      description:
        'Filigree oxidized silver drop earrings set with faceted garnet-crimson glass stones and hand-painted enamel.',
      fabricOrMaterial: '925 Silver Plated & Garnet Glass',
      sizes: ['One Size'],
      stock: 17,
      isNew: true,
      isFeatured: false,
      onSale: true,
      createdAt: now,
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'NA-2026-1041',
      customerName: 'Farhana Rahman',
      phone: '+880 1711-884320',
      email: 'farhana.rahman@example.com',
      address: 'House 24, Road 11, Banani',
      city: 'Dhaka',
      paymentMethod: 'bKash / Nagad',
      items: [
        {
          productId: 'prod-1',
          name: 'Crimson & Noir Handloom Jamdani Saree',
          sku: 'NA-WMN-0101',
          price: 12850,
          quantity: 1,
          selectedSize: 'Free Size',
          image: ASSETS.womenSaree,
        },
      ],
      subtotal: 12850,
      shippingFee: 0,
      total: 12850,
      status: 'Delivered',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ord-1002',
      orderNumber: 'NA-2026-1042',
      customerName: 'Tanvir Ahmed',
      phone: '+880 1819-440219',
      email: 'tanvir.ahmed@example.com',
      address: 'Flat 5B, Nasirabad Housing Society',
      city: 'Chattogram',
      paymentMethod: 'Cash on Delivery',
      items: [
        {
          productId: 'prod-2',
          name: 'Obsidian Red-Placket Embroidered Panjabi',
          sku: 'NA-MEN-0204',
          price: 4250,
          quantity: 2,
          selectedSize: 'L',
          image: ASSETS.menPanjabi,
        },
      ],
      subtotal: 8500,
      shippingFee: 0,
      total: 8500,
      status: 'Processing',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'ord-1003',
      orderNumber: 'NA-2026-1043',
      customerName: 'Nusrat Jahan',
      phone: '+880 1912-330912',
      email: 'nusrat.jahan@example.com',
      address: '42 Lake Drive Road, Sector 7, Uttara',
      city: 'Dhaka',
      paymentMethod: 'Card Payment',
      items: [
        {
          productId: 'prod-3',
          name: 'Meenakari Crimson & Oxidized Silver Bangles',
          sku: 'NA-JWL-0309',
          price: 3650,
          quantity: 1,
          selectedSize: '2.6',
          image: ASSETS.jewellery,
        },
      ],
      subtotal: 3650,
      shippingFee: 120,
      total: 3770,
      status: 'Pending',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  const subscribers: Subscriber[] = [
    {
      id: 'sub-1',
      email: 'sadia.karim@example.com',
      region: 'Bangladesh',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'sub-2',
      phone: '+880 1712-901234',
      region: 'Bangladesh',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return {
    products,
    categories,
    heroBanners,
    promoBanners,
    orders,
    subscribers,
  };
}

function readStore(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    const initial = createSeedStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(raw) as StoreSchema;
  } catch {
    const fallback = createSeedStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function writeStore(data: StoreSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // Storefront data (public)
  app.get('/api/storefront', (_req, res) => {
    const store = readStore();
    res.json({
      products: store.products,
      categories: store.categories
        .filter((c) => c.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      heroBanners: store.heroBanners
        .filter((b) => b.active)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      promoBanners: store.promoBanners,
    });
  });

  // Admin overview (all data including hidden items, orders, subscribers)
  app.get('/api/admin/overview', (_req, res) => {
    const store = readStore();
    const payload: AdminOverviewPayload = {
      products: store.products,
      categories: [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder),
      heroBanners: [...store.heroBanners].sort((a, b) => a.sortOrder - b.sortOrder),
      promoBanners: store.promoBanners,
      orders: [...store.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
      subscribers: [...store.subscribers].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
    res.json(payload);
  });

  // Product CRUD
  app.post('/api/products', (req, res) => {
    const store = readStore();
    const body = req.body as Partial<Product>;
    if (!body.name || body.price === undefined || !body.category) {
      res.status(400).json({ error: 'Name, category, and price are required.' });
      return;
    }
    const slug =
      body.categorySlug ||
      body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const product: Product = {
      id: `prod-${Date.now()}`,
      sku: body.sku?.trim() || `NA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name.trim(),
      subBrand: body.subBrand || 'Naiem Arong',
      category: body.category.trim(),
      categorySlug: slug,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      image: body.image?.trim() || ASSETS.womenSaree,
      description: body.description?.trim() || 'Handcrafted Naiem Arong limited edition release.',
      fabricOrMaterial: body.fabricOrMaterial?.trim() || 'Artisanal Cotton Blend',
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ['M', 'L', 'XL'],
      stock: Number(body.stock ?? 15),
      isNew: Boolean(body.isNew ?? true),
      isFeatured: Boolean(body.isFeatured ?? true),
      onSale: Boolean(body.onSale ?? false),
      createdAt: new Date().toISOString(),
    };
    store.products.unshift(product);
    writeStore(store);
    res.status(201).json(product);
  });

  app.put('/api/products/:id', (req, res) => {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    const existing = store.products[idx];
    const body = req.body as Partial<Product>;
    const updated: Product = {
      ...existing,
      ...body,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      originalPrice:
        body.originalPrice !== undefined
          ? body.originalPrice
            ? Number(body.originalPrice)
            : null
          : existing.originalPrice,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      id: existing.id,
    };
    store.products[idx] = updated;
    writeStore(store);
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const store = readStore();
    const next = store.products.filter((p) => p.id !== req.params.id);
    if (next.length === store.products.length) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    store.products = next;
    writeStore(store);
    res.json({ ok: true });
  });

  // Categories CRUD
  app.post('/api/categories', (req, res) => {
    const store = readStore();
    const body = req.body as Partial<CategoryItem>;
    if (!body.name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }
    const slug =
      body.slug?.trim() ||
      body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: body.name.trim(),
      slug,
      image: body.image?.trim() || ASSETS.womenSaree,
      tagline: body.tagline?.trim() || 'Handcrafted Artisan Series',
      visible: body.visible ?? true,
      sortOrder: body.sortOrder ?? store.categories.length + 1,
    };
    store.categories.push(cat);
    writeStore(store);
    res.status(201).json(cat);
  });

  app.put('/api/categories/:id', (req, res) => {
    const store = readStore();
    const idx = store.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    store.categories[idx] = { ...store.categories[idx], ...req.body, id: store.categories[idx].id };
    writeStore(store);
    res.json(store.categories[idx]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const store = readStore();
    store.categories = store.categories.filter((c) => c.id !== req.params.id);
    writeStore(store);
    res.json({ ok: true });
  });

  // Hero Banners CRUD
  app.post('/api/banners', (req, res) => {
    const store = readStore();
    const body = req.body as Partial<HeroBanner>;
    if (!body.title) {
      res.status(400).json({ error: 'Banner title is required.' });
      return;
    }
    const banner: HeroBanner = {
      id: `hero-${Date.now()}`,
      eyebrow: body.eyebrow?.trim() || 'NAIEM ARONG',
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || 'Curated contemporary craft & lifestyle.',
      ctaLabel: body.ctaLabel?.trim() || 'SHOP NOW',
      targetCategory: body.targetCategory?.trim() || 'all',
      image: body.image?.trim() || ASSETS.heroHeritage,
      theme: body.theme || 'dark',
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? store.heroBanners.length + 1,
    };
    store.heroBanners.push(banner);
    writeStore(store);
    res.status(201).json(banner);
  });

  app.put('/api/banners/:id', (req, res) => {
    const store = readStore();
    const idx = store.heroBanners.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Banner not found.' });
      return;
    }
    store.heroBanners[idx] = { ...store.heroBanners[idx], ...req.body, id: store.heroBanners[idx].id };
    writeStore(store);
    res.json(store.heroBanners[idx]);
  });

  app.delete('/api/banners/:id', (req, res) => {
    const store = readStore();
    store.heroBanners = store.heroBanners.filter((b) => b.id !== req.params.id);
    writeStore(store);
    res.json({ ok: true });
  });

  // Orders
  app.post('/api/orders', (req, res) => {
    const store = readStore();
    const body = req.body as Partial<Order>;
    if (!body.customerName || !body.phone || !body.address || !body.items?.length) {
      res.status(400).json({ error: 'Customer details and at least one item are required.' });
      return;
    }

    const subtotal = body.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 5000 ? 0 : 120;
    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `NA-2026-${1044 + store.orders.length}`,
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      address: body.address.trim(),
      city: body.city?.trim() || 'Dhaka',
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      items: body.items,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Decrement stock safely
    for (const item of body.items) {
      const pIdx = store.products.findIndex((p) => p.id === item.productId);
      if (pIdx !== -1) {
        store.products[pIdx].stock = Math.max(0, store.products[pIdx].stock - item.quantity);
      }
    }

    store.orders.unshift(order);
    writeStore(store);
    res.status(201).json(order);
  });

  app.patch('/api/orders/:id', (req, res) => {
    const store = readStore();
    const idx = store.orders.findIndex((o) => o.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    const { status } = req.body as { status?: OrderStatus };
    if (!status) {
      res.status(400).json({ error: 'Status is required.' });
      return;
    }
    store.orders[idx].status = status;
    writeStore(store);
    res.json(store.orders[idx]);
  });

  // Subscribers
  app.post('/api/subscribers', (req, res) => {
    const store = readStore();
    const body = req.body as Partial<Subscriber>;
    if (!body.email && !body.phone) {
      res.status(400).json({ error: 'Email or phone number is required.' });
      return;
    }
    const subscriber: Subscriber = {
      id: `sub-${Date.now()}`,
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      region: body.region || 'Bangladesh',
      createdAt: new Date().toISOString(),
    };
    store.subscribers.unshift(subscriber);
    writeStore(store);
    res.status(201).json(subscriber);
  });

  // Vite dev middleware or static dist
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Naiem Arong server listening on http://localhost:${PORT}`);
  });
}

startServer();
