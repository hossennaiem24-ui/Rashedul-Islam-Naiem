import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type {
  AdminOverviewPayload,
  CategoryItem,
  HeroBanner,
  Order,
  OrderStatus,
  Product,
} from '../types';
import { NaiemArongLogo } from './NaiemArongLogo';
import { SmartImage } from './SmartImage';

interface AdminPanelProps {
  onBackToStorefront: () => void;
  onStorefrontDataChanged: () => void;
}

type AdminTab = 'overview' | 'products' | 'catalog-design' | 'orders' | 'subscribers';

const IMAGE_PRESETS = [
  {
    label: 'Jamdani Saree (Women)',
    url: '/src/assets/images/cat_women_saree_1794898669744.jpg',
  },
  {
    label: 'Obsidian Panjabi (Men)',
    url: '/src/assets/images/cat_men_panjabi_1794898670419.jpg',
  },
  {
    label: 'Crimson Enamel Jewellery',
    url: '/src/assets/images/cat_jewellery_macro_1794898671600.jpg',
  },
  {
    label: 'Nakshi Kantha & Vase',
    url: '/src/assets/images/cat_home_nakshi_1794898672070.jpg',
  },
  {
    label: "Kids' Ethnic Kurta",
    url: '/src/assets/images/cat_kids_ethnic_1794898672258.jpg',
  },
  {
    label: 'Botanical Skin & Gift Box',
    url: '/src/assets/images/cat_gifts_skincare_1794898672578.jpg',
  },
  {
    label: 'Hero Crimson Campaign',
    url: '/src/assets/images/hero_heritage_crimson_1794898669437.jpg',
  },
  {
    label: 'Hero Winter Editorial',
    url: '/src/assets/images/hero_winter_editorial_1794898669998.jpg',
  },
];

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStorefront,
  onStorefrontDataChanged,
}) => {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [data, setData] = useState<AdminOverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Product Form Modal
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pForm, setPForm] = useState({
    name: '',
    sku: '',
    subBrand: 'Naiem Arong' as Product['subBrand'],
    category: 'Women',
    categorySlug: 'women',
    price: '',
    originalPrice: '',
    stock: '15',
    image: IMAGE_PRESETS[0].url,
    fabricOrMaterial: 'Handloom Cotton Silk',
    sizesText: 'S, M, L, XL',
    description: '',
    isNew: true,
    isFeatured: true,
    onSale: false,
  });

  // Banner Form Modal
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [bForm, setBForm] = useState({
    eyebrow: 'NAIEM ARONG · NEW DROP',
    title: '',
    subtitle: '',
    ctaLabel: 'SHOP NOW',
    targetCategory: 'women',
    image: IMAGE_PRESETS[6].url,
    theme: 'dark' as HeroBanner['theme'],
  });

  // Category Form Modal
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [cForm, setCForm] = useState({
    name: '',
    tagline: '',
    image: IMAGE_PRESETS[0].url,
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const json = (await res.json()) as AdminOverviewPayload;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const stats = useMemo(() => {
    if (!data) {
      return { revenue: 0, totalOrders: 0, activeProducts: 0, lowStock: 0, subscribers: 0 };
    }
    const revenue = data.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const lowStock = data.products.filter((p) => p.stock <= 10).length;
    return {
      revenue,
      totalOrders: data.orders.length,
      activeProducts: data.products.length,
      lowStock,
      subscribers: data.subscribers.length,
    };
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data.products;
    return data.products.filter((p) =>
      `${p.name} ${p.sku} ${p.category} ${p.subBrand}`.toLowerCase().includes(q),
    );
  }, [data, searchTerm]);

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    return data.orders.filter((o) => {
      if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return `${o.orderNumber} ${o.customerName} ${o.phone} ${o.city}`
        .toLowerCase()
        .includes(q);
    });
  }, [data, orderStatusFilter, searchTerm]);

  const openCreateProduct = () => {
    setEditingProduct(null);
    setPForm({
      name: '',
      sku: `NA-${Math.floor(1000 + Math.random() * 9000)}`,
      subBrand: 'Naiem Arong',
      category: 'Women',
      categorySlug: 'women',
      price: '3500',
      originalPrice: '',
      stock: '20',
      image: IMAGE_PRESETS[0].url,
      fabricOrMaterial: 'Handloom Cotton',
      sizesText: 'S, M, L, XL',
      description: 'Handcrafted Naiem Arong contemporary release.',
      isNew: true,
      isFeatured: true,
      onSale: false,
    });
    setProductFormOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPForm({
      name: p.name,
      sku: p.sku,
      subBrand: p.subBrand,
      category: p.category,
      categorySlug: p.categorySlug,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      stock: String(p.stock),
      image: p.image,
      fabricOrMaterial: p.fabricOrMaterial,
      sizesText: p.sizes.join(', '),
      description: p.description,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      onSale: p.onSale,
    });
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: pForm.name,
      sku: pForm.sku,
      subBrand: pForm.subBrand,
      category: pForm.category,
      categorySlug: pForm.categorySlug,
      price: Number(pForm.price),
      originalPrice: pForm.originalPrice ? Number(pForm.originalPrice) : null,
      stock: Number(pForm.stock),
      image: pForm.image,
      fabricOrMaterial: pForm.fabricOrMaterial,
      sizes: pForm.sizesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: pForm.description,
      isNew: pForm.isNew,
      isFeatured: pForm.isFeatured,
      onSale: pForm.onSale,
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setProductFormOpen(false);
      await loadAdminData();
      onStorefrontDataChanged();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadAdminData();
      onStorefrontDataChanged();
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await loadAdminData();
    }
  };

  const handleToggleBanner = async (banner: HeroBanner) => {
    await fetch(`/api/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !banner.active }),
    });
    await loadAdminData();
    onStorefrontDataChanged();
  };

  const handleDeleteBanner = async (id: string) => {
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    await loadAdminData();
    onStorefrontDataChanged();
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bForm),
    });
    if (res.ok) {
      setBannerFormOpen(false);
      await loadAdminData();
      onStorefrontDataChanged();
    }
  };

  const handleToggleCategory = async (cat: CategoryItem) => {
    await fetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !cat.visible }),
    });
    await loadAdminData();
    onStorefrontDataChanged();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cForm),
    });
    if (res.ok) {
      setCatFormOpen(false);
      setCForm({ name: '', tagline: '', image: IMAGE_PRESETS[0].url });
      await loadAdminData();
      onStorefrontDataChanged();
    }
  };

  const tabTitles: Record<AdminTab, string> = {
    overview: 'Executive Overview',
    products: 'Product Inventory',
    'catalog-design': 'Categories & Hero Banners',
    orders: 'Order Fulfillment',
    subscribers: 'Customer Subscribers',
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A] flex flex-col lg:flex-row">
      {/* Left Admin Sidebar (256px) */}
      <aside className="w-full lg:w-64 bg-[#0A0A0A] text-white border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col shrink-0">
        <div className="h-16 px-5 border-b border-neutral-800 flex items-center justify-between">
          <NaiemArongLogo variant="light" compact subtitle="ADMIN CONSOLE" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#DC2626] border border-[#DC2626] px-1.5 py-0.5">
            ADMIN
          </span>
        </div>

        <nav className="flex lg:flex-col gap-1 p-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
            { id: 'products' as const, label: 'Products', icon: ShoppingBag },
            { id: 'catalog-design' as const, label: 'Banners & Categories', icon: Layers },
            { id: 'orders' as const, label: 'Orders', icon: Package },
            { id: 'subscribers' as const, label: 'Subscribers', icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#DC2626] text-white'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-neutral-800 hidden lg:block">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="w-full h-10 bg-white hover:bg-[#DC2626] text-[#0A0A0A] hover:text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Live Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb & Primary Action Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToStorefront}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#0A0A0A] text-[11px] font-bold uppercase tracking-wider shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Store
            </button>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 truncate">
              <span>Naiem Arong Admin</span>
              <span className="mx-2 text-neutral-300">/</span>
              <span className="text-[#0A0A0A] font-bold">{tabTitles[tab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openCreateProduct}
              className="h-9 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6 flex-1">
          {loading || !data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-28 bg-white border border-neutral-200 animate-pulse p-5"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Overview & Shared KPI Bar */}
              {tab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-neutral-200 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                        Gross Merchandise Revenue
                      </p>
                      <p className="text-3xl font-mono font-bold text-[#0A0A0A] mt-2 tabular-nums">
                        ৳{stats.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#DC2626] font-semibold mt-1">
                        Excludes cancelled orders
                      </p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                        Total Orders
                      </p>
                      <p className="text-3xl font-mono font-bold text-[#0A0A0A] mt-2 tabular-nums">
                        {stats.totalOrders}
                      </p>
                      <p className="text-xs text-neutral-600 mt-1">
                        {data.orders.filter((o) => o.status === 'Pending').length} awaiting
                        dispatch
                      </p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                        Catalog SKUs
                      </p>
                      <p className="text-3xl font-mono font-bold text-[#0A0A0A] mt-2 tabular-nums">
                        {stats.activeProducts}
                      </p>
                      <p className="text-xs text-neutral-600 mt-1">
                        {stats.lowStock} items at low stock (&le; 10)
                      </p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                        Stay Tuned Subscribers
                      </p>
                      <p className="text-3xl font-mono font-bold text-[#0A0A0A] mt-2 tabular-nums">
                        {stats.subscribers}
                      </p>
                      <p className="text-xs text-neutral-600 mt-1">
                        Active newsletter &amp; SMS alerts
                      </p>
                    </div>
                  </div>

                  {/* Recent Orders + Quick Inventory Split */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white border border-neutral-200">
                      <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                          Recent Orders
                        </h3>
                        <button
                          type="button"
                          onClick={() => setTab('orders')}
                          className="text-xs font-bold text-[#DC2626] hover:underline"
                        >
                          Manage All
                        </button>
                      </div>
                      <div className="divide-y divide-neutral-200">
                        {data.orders.slice(0, 5).map((o) => (
                          <div
                            key={o.id}
                            className="px-5 py-3 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <p className="font-mono font-bold text-[#0A0A0A]">
                                #{o.orderNumber} · {o.customerName}
                              </p>
                              <p className="text-neutral-500">
                                {o.city} · {o.paymentMethod}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold tabular-nums">
                                ৳{o.total.toLocaleString()}
                              </p>
                              <p className="text-[11px] font-semibold text-[#DC2626]">
                                {o.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200">
                      <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                          Top Catalog Items
                        </h3>
                        <button
                          type="button"
                          onClick={() => setTab('products')}
                          className="text-xs font-bold text-[#DC2626] hover:underline"
                        >
                          View Inventory
                        </button>
                      </div>
                      <div className="divide-y divide-neutral-200">
                        {data.products.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            className="px-5 py-3 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 shrink-0">
                                <SmartImage
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  fallbackLabel={p.name}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#0A0A0A] truncate">{p.name}</p>
                                <p className="text-neutral-500 font-mono">
                                  {p.sku} · {p.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0 font-mono tabular-nums">
                              <p className="font-bold">৳{p.price.toLocaleString()}</p>
                              <p className="text-neutral-500">{p.stock} in stock</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Products Management */}
              {tab === 'products' && (
                <div className="bg-white border border-neutral-200">
                  <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search SKU, product name, category..."
                        className="w-full h-9 pl-9 pr-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 tabular-nums">
                      Showing {filteredProducts.length} of {data.products.length} products
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">SKU</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4 text-right">Price</th>
                          <th className="py-3 px-4 text-right">Stock</th>
                          <th className="py-3 px-4">Flags</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-xs">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 shrink-0">
                                  <SmartImage
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    fallbackLabel={p.name}
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-[#0A0A0A]">{p.name}</p>
                                  <p className="text-neutral-500">{p.subBrand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-600">{p.sku}</td>
                            <td className="py-3 px-4">{p.category}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                              ৳{p.price.toLocaleString()}
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-mono font-semibold tabular-nums ${
                                p.stock <= 5 ? 'text-[#DC2626]' : 'text-[#0A0A0A]'
                              }`}
                            >
                              {p.stock}
                            </td>
                            <td className="py-3 px-4 text-[11px] font-semibold">
                              {[
                                p.isNew ? 'New' : null,
                                p.onSale ? 'Sale' : null,
                                p.isFeatured ? 'Featured' : null,
                              ]
                                .filter(Boolean)
                                .join(' · ') || 'Standard'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditProduct(p)}
                                  className="p-1.5 border border-neutral-300 hover:border-[#0A0A0A] text-[#0A0A0A]"
                                  title="Edit product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 border border-neutral-300 hover:border-[#DC2626] hover:text-[#DC2626] text-neutral-600"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Banners & Categories Management */}
              {tab === 'catalog-design' && (
                <div className="space-y-6">
                  {/* Hero Banners */}
                  <div className="bg-white border border-neutral-200">
                    <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                          Storefront Hero Banners
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Control full-width promotional campaigns displayed on the homepage.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBannerFormOpen(true)}
                        className="h-9 px-3.5 bg-[#0A0A0A] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Banner</span>
                      </button>
                    </div>

                    <div className="divide-y divide-neutral-200">
                      {data.heroBanners.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-24 h-14 bg-neutral-100 border border-neutral-200 shrink-0">
                              <SmartImage
                                src={b.image}
                                alt={b.title}
                                className="w-full h-full object-cover"
                                fallbackLabel={b.title}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">
                                {b.eyebrow}
                              </p>
                              <h4 className="font-semibold text-sm text-[#0A0A0A] truncate">
                                {b.title}
                              </h4>
                              <p className="text-xs text-neutral-500 truncate">{b.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleBanner(b)}
                              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border ${
                                b.active
                                  ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                                  : 'bg-white border-neutral-300 text-neutral-500'
                              }`}
                            >
                              {b.active ? 'Active' : 'Hidden'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(b.id)}
                              className="p-1.5 border border-neutral-300 hover:border-[#DC2626] hover:text-[#DC2626]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="bg-white border border-neutral-200">
                    <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                          Department Categories
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Toggle visibility or add new handcrafted storefront departments.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCatFormOpen(true)}
                        className="h-9 px-3.5 bg-[#0A0A0A] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                      {data.categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="border border-neutral-200 p-3 flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-neutral-100 shrink-0">
                              <SmartImage
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                                fallbackLabel={cat.name}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-[#0A0A0A] truncate">
                                {cat.name}
                              </p>
                              <p className="text-[11px] font-mono text-neutral-500">
                                /{cat.slug}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCategory(cat)}
                            className={`w-full py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                              cat.visible
                                ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                                : 'bg-white border-neutral-300 text-neutral-500'
                            }`}
                          >
                            {cat.visible ? 'Visible on Storefront' : 'Hidden'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Management */}
              {tab === 'orders' && (
                <div className="bg-white border border-neutral-200">
                  <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {['ALL', ...ORDER_STATUSES].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border ${
                            orderStatusFilter === st
                              ? 'bg-[#DC2626] border-[#DC2626] text-white'
                              : 'bg-white border-neutral-300 text-neutral-700 hover:border-[#0A0A0A]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search order # or customer..."
                        className="w-full h-9 pl-9 pr-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                          <th className="py-3 px-4">Order #</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4 text-right">Total</th>
                          <th className="py-3 px-4">Fulfillment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-xs">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-mono font-bold text-[#0A0A0A]">
                              #{order.orderNumber}
                              <div className="text-[11px] font-normal text-neutral-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-[#0A0A0A]">
                                {order.customerName}
                              </p>
                              <p className="text-neutral-500">
                                {order.phone} · {order.city}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              {order.items.map((it) => (
                                <div key={`${it.productId}-${it.selectedSize}`}>
                                  {it.name} ({it.selectedSize}) × {it.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-4">{order.paymentMethod}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                              ৳{order.total.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(
                                    order.id,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                className={`h-8 px-2.5 text-xs font-bold border focus:outline-none ${
                                  order.status === 'Cancelled'
                                    ? 'border-[#DC2626] text-[#DC2626] bg-red-50'
                                    : order.status === 'Delivered'
                                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                                      : 'border-neutral-300 bg-white text-[#0A0A0A]'
                                }`}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s} className="text-[#0A0A0A] bg-white">
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subscribers */}
              {tab === 'subscribers' && (
                <div className="bg-white border border-neutral-200">
                  <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                      Stay Tuned Subscribers ({data.subscribers.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Mobile Number</th>
                          <th className="py-3 px-4">Region</th>
                          <th className="py-3 px-4">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-xs">
                        {data.subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-medium">{sub.email || '—'}</td>
                            <td className="py-3 px-4 font-mono">{sub.phone || '—'}</td>
                            <td className="py-3 px-4">{sub.region}</td>
                            <td className="py-3 px-4 font-mono text-neutral-500">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {productFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setProductFormOpen(false)}
          />
          <form
            onSubmit={handleSaveProduct}
            className="relative z-10 w-full max-w-2xl bg-white border border-neutral-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.16em]">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </span>
              <button
                type="button"
                onClick={() => setProductFormOpen(false)}
                className="text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pForm.name}
                    onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={pForm.sku}
                    onChange={(e) => setPForm({ ...pForm, sku: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 font-mono focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Department
                  </label>
                  <select
                    value={pForm.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const match = data?.categories.find((c) => c.slug === slug);
                      const fallbackName =
                        slug === 'winter-26' ? 'Winter 26' : match?.name || 'Women';
                      setPForm({
                        ...pForm,
                        categorySlug: slug,
                        category: fallbackName,
                      });
                    }}
                    className="w-full h-10 px-3 border border-neutral-300 bg-white focus:outline-none focus:border-[#0A0A0A]"
                  >
                    {(data?.categories || []).map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                    <option value="winter-26">Winter 26</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Line / Sub-Brand
                  </label>
                  <select
                    value={pForm.subBrand}
                    onChange={(e) =>
                      setPForm({
                        ...pForm,
                        subBrand: e.target.value as Product['subBrand'],
                      })
                    }
                    className="w-full h-10 px-3 border border-neutral-300 bg-white focus:outline-none focus:border-[#0A0A0A]"
                  >
                    <option value="Naiem Arong">Naiem Arong</option>
                    <option value="NA Heritage">NA Heritage</option>
                    <option value="NA Studio">NA Studio</option>
                    <option value="NA Noir">NA Noir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={pForm.stock}
                    onChange={(e) => setPForm({ ...pForm, stock: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 font-mono focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Sale Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pForm.price}
                    onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 font-mono focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pForm.originalPrice}
                    onChange={(e) => setPForm({ ...pForm, originalPrice: e.target.value })}
                    placeholder="Leave blank if no discount"
                    className="w-full h-10 px-3 border border-neutral-300 font-mono focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Studio Visual Preset
                  </label>
                  <select
                    value={pForm.image}
                    onChange={(e) => setPForm({ ...pForm, image: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 bg-white focus:outline-none focus:border-[#0A0A0A]"
                  >
                    {IMAGE_PRESETS.map((preset) => (
                      <option key={preset.label} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={pForm.sizesText}
                    onChange={(e) => setPForm({ ...pForm, sizesText: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Fabric / Material
                </label>
                <input
                  type="text"
                  value={pForm.fabricOrMaterial}
                  onChange={(e) => setPForm({ ...pForm, fabricOrMaterial: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={pForm.description}
                  onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                  className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pForm.isNew}
                    onChange={(e) => setPForm({ ...pForm, isNew: e.target.checked })}
                    className="accent-[#DC2626]"
                  />
                  <span>Show in &quot;What&apos;s New&quot;</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pForm.onSale}
                    onChange={(e) => setPForm({ ...pForm, onSale: e.target.checked })}
                    className="accent-[#DC2626]"
                  />
                  <span>Online Only Sale</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pForm.isFeatured}
                    onChange={(e) => setPForm({ ...pForm, isFeatured: e.target.checked })}
                    className="accent-[#DC2626]"
                  />
                  <span>Featured Product</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductFormOpen(false)}
                className="h-10 px-5 border border-neutral-300 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Hero Banner Modal */}
      {bannerFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70" onClick={() => setBannerFormOpen(false)} />
          <form
            onSubmit={handleCreateBanner}
            className="relative z-10 w-full max-w-lg bg-white border border-neutral-200"
          >
            <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                <ImageIcon className="w-4 h-4 text-[#DC2626]" />
                <span>Add Hero Banner</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerFormOpen(false)}
                className="text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={bForm.eyebrow}
                  onChange={(e) => setBForm({ ...bForm, eyebrow: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Campaign Headline *
                </label>
                <input
                  type="text"
                  required
                  value={bForm.title}
                  onChange={(e) => setBForm({ ...bForm, title: e.target.value })}
                  placeholder="e.g. Eid Noir & Crimson Capsule"
                  className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={bForm.subtitle}
                  onChange={(e) => setBForm({ ...bForm, subtitle: e.target.value })}
                  className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Target Department
                  </label>
                  <select
                    value={bForm.targetCategory}
                    onChange={(e) => setBForm({ ...bForm, targetCategory: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 bg-white"
                  >
                    <option value="all">All Products</option>
                    {(data?.categories || []).map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Visual Asset
                  </label>
                  <select
                    value={bForm.image}
                    onChange={(e) => setBForm({ ...bForm, image: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 bg-white"
                  >
                    {IMAGE_PRESETS.map((preset) => (
                      <option key={preset.label} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBannerFormOpen(false)}
                className="h-10 px-5 border border-neutral-300 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider"
              >
                Publish Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Category Modal */}
      {catFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70" onClick={() => setCatFormOpen(false)} />
          <form
            onSubmit={handleCreateCategory}
            className="relative z-10 w-full max-w-md bg-white border border-neutral-200"
          >
            <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.16em]">
                Add Storefront Category
              </span>
              <button
                type="button"
                onClick={() => setCatFormOpen(false)}
                className="text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={cForm.name}
                  onChange={(e) => setCForm({ ...cForm, name: e.target.value })}
                  placeholder="e.g. Footwear & Leather"
                  className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={cForm.tagline}
                  onChange={(e) => setCForm({ ...cForm, tagline: e.target.value })}
                  placeholder="Handcrafted Sandals · Bags · Clutches"
                  className="w-full h-10 px-3 border border-neutral-300 focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Department Image
                </label>
                <select
                  value={cForm.image}
                  onChange={(e) => setCForm({ ...cForm, image: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 bg-white"
                >
                  {IMAGE_PRESETS.map((preset) => (
                    <option key={preset.label} value={preset.url}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCatFormOpen(false)}
                className="h-10 px-5 border border-neutral-300 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
