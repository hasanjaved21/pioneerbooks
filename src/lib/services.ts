import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Order } from '../types';

// Track connection health
let isSupabaseOnline: boolean | null = null;
const listeners = new Set<(online: boolean) => void>();

export function subscribeToSupabaseStatus(listener: (online: boolean) => void) {
  listeners.add(listener);
  if (isSupabaseOnline !== null) listener(isSupabaseOnline);
  return () => {
    listeners.delete(listener);
  };
}

function setSupabaseOnline(status: boolean) {
  if (isSupabaseOnline !== status) {
    isSupabaseOnline = status;
    listeners.forEach((l) => l(status));
  }
}

// Initial authentic collection of Pakistan Law books with PKR prices
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'The Code of Civil Procedure, 1908 (CPC with Case-Law)',
    description: 'Complete annotated Civil Procedure Code with High Court rules, amendments, and authoritative judicial precedents.',
    price: 3200,
    category: 'Code of Civil',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'prod-002',
    title: 'Code of Criminal Procedure, 1898 (CrPC Major Act)',
    description: 'Comprehensive commentary on criminal trials, investigation, bail laws, and schedule of offences in Pakistan.',
    price: 3500,
    category: 'Code of Criminal',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1453733197781-717857324662?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'prod-003',
    title: 'Constitution of the Islamic Republic of Pakistan, 1973',
    description: 'Official text with all Constitutional amendments up to 26th Amendment, schedule & landmark judgments.',
    price: 1800,
    category: 'Bare Acts',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'prod-004',
    title: 'Civil Judge-cum-Judicial Magistrate Examination Guide (PDF)',
    description: 'Complete syllabus coverage, solved past papers, interview guidelines, and leading case references for aspirants.',
    price: 1200,
    category: 'Civil Judge Exam',
    type: 'pdf',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    is_featured: true,
    download_count: 248,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'prod-005',
    title: 'Companies Act 2017 & Corporate Laws of Pakistan',
    description: 'Detailed manual on SECP compliance, incorporation, company administration, and winding up procedures.',
    price: 2950,
    category: 'Corporate Laws',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prod-006',
    title: 'Law of Conveyance, Deeds & Legal Drafting Manual',
    description: 'Model deeds, agreements, powers of attorney, sale agreements, affidavits, and registration laws.',
    price: 950,
    category: 'Conveyance, Deeds',
    type: 'pdf',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    is_featured: true,
    download_count: 175,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prod-007',
    title: 'Financial Institutions (Recovery of Finances) & Banking Laws',
    description: 'Comprehensive banking statutes, FIRFO 2001, State Bank of Pakistan prudential regulations and case-law.',
    price: 2600,
    category: 'Banking',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'prod-008',
    title: 'West Pakistan Land Revenue Act & Assistant Collector Powers',
    description: 'Revenue records, mutation, partition, recovery procedures, and duties of Assistant Collector Grade-I & II.',
    price: 1900,
    category: 'Assistant Collector',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'prod-009',
    title: 'Abstract of Labour Laws & Factory Standing Orders',
    description: 'Statutory compliance for industrial establishments, gratuity, social security, and working hours.',
    price: 1450,
    category: 'Abstract of labour',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'prod-010',
    title: 'Annual Five-Year Case Law Digest (Supreme Court & High Courts)',
    description: 'Indexed subject-wise citations of PLD, SCMR, MLD, CLC, and PCrLJ for quick reference.',
    price: 4800,
    category: 'Case Law Digest',
    type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

const LOCAL_PRODUCTS_KEY = 'pioneer_law_products_v3';
const LOCAL_ORDERS_KEY = 'pioneer_law_orders_v3';
const DELETED_KEYS_STORAGE = 'pioneer_deleted_product_keys_v4';
const DISALLOWED_CATEGORIES = new Set(['quran', 'hadith', 'history', 'kids', 'fiqh', 'spirituality']);

function getDeletedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_KEYS_STORAGE);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function recordDeletedKey(id: string, title?: string) {
  try {
    const set = getDeletedKeys();
    set.add(id);
    if (title && title.trim()) {
      set.add(`title:${title.trim().toLowerCase()}`);
    }
    localStorage.setItem(DELETED_KEYS_STORAGE, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Failed to record deleted key:', e);
  }
}

function isProductDeleted(product: { id: string; title?: string }, deletedSet: Set<string>): boolean {
  if (deletedSet.has(product.id)) return true;
  if (product.title && deletedSet.has(`title:${product.title.trim().toLowerCase()}`)) return true;
  return false;
}

function getLocalProducts(): Product[] {
  try {
    const deleted = getDeletedKeys();
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw === null) {
      const initial = DEFAULT_PRODUCTS.filter((p) => !isProductDeleted(p, deleted) && !DISALLOWED_CATEGORIES.has((p.category || '').trim().toLowerCase()));
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((p) => !isProductDeleted(p, deleted) && !DISALLOWED_CATEGORIES.has(((p.category || '')).trim().toLowerCase()));
    }
    return DEFAULT_PRODUCTS.filter((p) => !isProductDeleted(p, deleted) && !DISALLOWED_CATEGORIES.has(((p.category || '')).trim().toLowerCase()));
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Failed to save orders to localStorage:', e);
  }
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const deleted = getDeletedKeys();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          setSupabaseOnline(true);
          // Filter out any remote product that was deleted locally or in disallowed categories
          const validRemote = data.filter(
            (p) => !isProductDeleted(p, deleted) && !DISALLOWED_CATEGORIES.has((p.category || '').trim().toLowerCase())
          );

          if (validRemote.length > 0) {
            // Merge with any custom local items not yet in remote
            const localList = getLocalProducts();
            const remoteIds = new Set(validRemote.map((p) => p.id));
            const localOnly = localList.filter((p) => !remoteIds.has(p.id) && p.id.startsWith('custom-'));
            const merged = [...validRemote, ...localOnly];
            saveLocalProducts(merged);
            return merged;
          }

          if (data.length === 0 && deleted.size === 0) {
            try {
              // Seed starter books into remote Supabase table so it's populated on very first run
              const toInsert = DEFAULT_PRODUCTS.map(({ id: _id, ...rest }) => rest);
              const { data: seeded } = await supabase.from('products').insert(toInsert).select();
              if (seeded && seeded.length > 0) {
                saveLocalProducts(seeded as Product[]);
                return seeded as Product[];
              }
            } catch (seedErr) {
              console.warn('Seeding remote Supabase table error:', seedErr);
            }
            return getLocalProducts();
          }

          // If all products were deleted or filtered out by user
          saveLocalProducts(validRemote);
          return validRemote;
        }

        if (error) {
          console.warn('Supabase query error:', error.message);
          setSupabaseOnline(false);
        }
      } catch (err) {
        console.warn('Supabase unreachable, using offline product catalog:', err);
        setSupabaseOnline(false);
      }
    }
    return getLocalProducts();
  },

  async getById(id: string): Promise<Product> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setSupabaseOnline(true);
          return data as Product;
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    const local = getLocalProducts().find((p) => p.id === id);
    if (!local) throw new Error('Product not found');
    return local;
  },

  async getFeatured(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(8);

        if (!error && Array.isArray(data) && data.length > 0) {
          setSupabaseOnline(true);
          return data as Product[];
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    const all = getLocalProducts();
    const featured = all.filter((p) => p.is_featured);
    return featured.length > 0 ? featured : all.slice(0, 4);
  },

  async getByCategory(category: string): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category);

        if (!error && Array.isArray(data) && data.length > 0) {
          setSupabaseOnline(true);
          return data as Product[];
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    return getLocalProducts().filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  },

  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('title', `%${query}%`);

        if (!error && Array.isArray(data)) {
          setSupabaseOnline(true);
          return data as Product[];
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    return getLocalProducts().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'download_count'>): Promise<Product> {
    const newId = 'custom-' + (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    const newProduct: Product = {
      ...product,
      id: newId,
      created_at: new Date().toISOString(),
      download_count: 0,
    };

    // Save to local storage immediately so it appears right away
    const local = getLocalProducts();
    const updated = [newProduct, ...local];
    saveLocalProducts(updated);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([product])
          .select()
          .single();

        if (!error && data) {
          setSupabaseOnline(true);
          // Replace temporary id with remote id
          const withRemote = [data as Product, ...local.filter((p) => p.id !== newId)];
          saveLocalProducts(withRemote);
          return data as Product;
        } else {
          console.warn('Could not insert to remote Supabase, saved locally:', error?.message);
        }
      } catch (err) {
        console.warn('Supabase offline during product create, product safely preserved locally:', err);
        setSupabaseOnline(false);
      }
    }

    return newProduct;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const local = getLocalProducts();
    const existingIndex = local.findIndex((p) => p.id === id);
    let updatedProduct: Product = { ...local[existingIndex], ...product };

    if (existingIndex !== -1) {
      local[existingIndex] = updatedProduct;
      saveLocalProducts([...local]);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(product)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          setSupabaseOnline(true);
          return data as Product;
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }

    return updatedProduct;
  },

  async delete(id: string): Promise<void> {
    const local = getLocalProducts();
    const target = local.find((p) => p.id === id);
    const targetTitle = target?.title;

    // 1. Record in local blacklist so neither local cache nor Supabase fetch resurrects it
    recordDeletedKey(id, targetTitle);

    // 2. Remove immediately from local storage
    const remaining = local.filter((p) => p.id !== id);
    saveLocalProducts(remaining);

    // 3. Delete from Supabase
    if (isSupabaseConfigured) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      try {
        if (isUUID) {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) {
            console.error('Supabase delete error by id:', error.message);
            throw new Error(error.message);
          }
        }
        
        // Also if targetTitle exists, ensure any remote row with matching title is cleaned up
        if (targetTitle) {
          const { error: titleErr } = await supabase.from('products').delete().eq('title', targetTitle);
          if (titleErr) {
            console.warn('Supabase delete error by title:', titleErr.message);
          }
        }

        setSupabaseOnline(true);
      } catch (err: any) {
        console.warn('Failed to delete from remote Supabase:', err);
        // Only throw if it's a real database error rather than offline connection error
        if (err?.message && !err.message.includes('fetch')) {
          throw err;
        }
      }
    }
  },

  async incrementDownload(id: string): Promise<void> {
    const local = getLocalProducts();
    const item = local.find((p) => p.id === id);
    if (item) {
      item.download_count = (item.download_count || 0) + 1;
      saveLocalProducts([...local]);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('products')
          .update({ download_count: (item?.download_count || 1) })
          .eq('id', id);
      } catch (err) {
        // Silently handle
      }
    }
  },

  async uploadFile(file: File, bucket: 'product-images' | 'product-pdfs'): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'bin';
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    if (isSupabaseConfigured) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (!uploadError) {
          setSupabaseOnline(true);
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          if (data?.publicUrl) {
            return data.publicUrl;
          }
        } else {
          console.warn('Supabase storage upload error, falling back to local file reader:', uploadError.message);
        }
      } catch (err) {
        console.warn('Supabase storage unreachable, falling back to local file reader:', err);
        setSupabaseOnline(false);
      }
    }

    // Offline / fallback: Convert file to Base64 Data URL so images and PDFs work seamlessly!
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to encode file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};

export const orderService = {
  async create(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const newId = 'ord-' + (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    const newOrder: Order = {
      ...order,
      id: newId,
      created_at: new Date().toISOString(),
    };

    const local = getLocalOrders();
    saveLocalOrders([newOrder, ...local]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([order])
          .select()
          .single();

        if (!error && data) {
          setSupabaseOnline(true);
          return data as Order;
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }

    return newOrder;
  },

  async getByUserId(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          setSupabaseOnline(true);
          return data as Order[];
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    return getLocalOrders().filter((o) => o.user_id === userId);
  },

  async getAll(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          setSupabaseOnline(true);
          return data as Order[];
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }
    return getLocalOrders();
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const local = getLocalOrders();
    const item = local.find((o) => o.id === id);
    if (item) {
      item.status = status;
      saveLocalOrders([...local]);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          setSupabaseOnline(true);
          return data as Order;
        }
      } catch (err) {
        setSupabaseOnline(false);
      }
    }

    if (!item) throw new Error('Order not found');
    return item;
  },
};
