import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Artwork, Order, CustomInquiry, SiteSettings } from "../types";

const LOCAL_STORAGE_KEY = "tiyana_supabase_config";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: "env" | "storage" | "none";
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = "";
let lastUsedKey = "";

export function getSupabaseConfig(): SupabaseConfig {
  // Check process.env first
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (envUrl && envKey && envUrl.startsWith("http")) {
    return { url: envUrl, anonKey: envKey, source: "env" };
  }

  // Check browser localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.url && parsed?.anonKey && parsed.url.startsWith("http")) {
          return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), source: "storage" };
        }
      }
    } catch (e) {
      console.warn("Could not read Supabase config from localStorage:", e);
    }
  }

  return { url: "", anonKey: "", source: "none" };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
    );
    cachedClient = null; // reset cached client
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    cachedClient = null;
  }
}

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith("http"));
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    return null;
  }
}

/**
 * Supabase Auth helper functions for Admin access
 */
export async function signInAdminUser(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: { message: "Supabase is not configured" } };
  return await supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signOutAdminUser() {
  const supabase = getSupabase();
  if (!supabase) return;
  return await supabase.auth.signOut();
}

export async function getCurrentAdminSession() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

/**
 * Ping Supabase to test connectivity and check if the tables are created.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  artworksCount?: number;
  tablesMissing?: boolean;
}> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: "Supabase credentials are not configured yet.",
    };
  }

  try {
    const { data, count, error } = await client
      .from("artworks")
      .select("*", { count: "exact", head: true });

    if (error) {
      if (error.code === "42P01" || error.message.includes("relation") || error.message.includes("does not exist")) {
        return {
          success: false,
          tablesMissing: true,
          message:
            "Connected to Supabase, but the database tables (artworks, orders, etc.) have not been created yet. Please execute the SQL schema in your Supabase SQL Editor.",
        };
      }
      return {
        success: false,
        message: `Supabase error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      artworksCount: count ?? 0,
      message: `Connection successful! Connected to Supabase Cloud (${count ?? 0} artworks in database).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || String(err)}`,
    };
  }
}

// ----------------------------------------------------
// Data mappers between TypeScript interfaces and Supabase
// ----------------------------------------------------

export function dbToArtwork(row: any): Artwork {
  return {
    id: row.id,
    title: row.title,
    titleBangla: row.title_bangla || "",
    category: row.category || "calligraphy",
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    description: row.description || "",
    spiritualMessage: row.spiritual_message || "",
    dimensions: row.dimensions || "12x12 inch",
    medium: row.medium || "Textured Acrylic on Canvas",
    finish: row.finish || "Varnished",
    image: row.image,
    isFeatured: Boolean(row.is_featured),
    inStock: Boolean(row.in_stock),
    badge: row.badge || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export function artworkToDb(art: Artwork) {
  return {
    id: art.id,
    title: art.title,
    title_bangla: art.titleBangla || null,
    category: art.category,
    price: art.price,
    original_price: art.originalPrice || null,
    description: art.description,
    spiritual_message: art.spiritualMessage || null,
    dimensions: art.dimensions,
    medium: art.medium,
    finish: art.finish || null,
    image: art.image,
    is_featured: Boolean(art.isFeatured),
    in_stock: Boolean(art.inStock),
    badge: art.badge || null,
    tags: art.tags || [],
    updated_at: new Date().toISOString(),
  };
}

export function dbToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email || "",
    address: row.address,
    deliveryZone: row.delivery_zone || "inside_dhaka",
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method || "cod",
    paymentTrxId: row.payment_trx_id || "",
    status: row.status || "pending",
    notes: row.notes || "",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function orderToDb(ord: Order) {
  return {
    id: ord.id,
    order_number: ord.orderNumber,
    customer_name: ord.customerName,
    phone: ord.phone,
    email: ord.email || null,
    address: ord.address,
    delivery_zone: ord.deliveryZone,
    items: ord.items,
    subtotal: ord.subtotal,
    delivery_fee: ord.deliveryFee,
    total_amount: ord.totalAmount,
    payment_method: ord.paymentMethod,
    payment_trx_id: ord.paymentTrxId || null,
    status: ord.status,
    notes: ord.notes || null,
    created_at: ord.createdAt,
    updated_at: new Date().toISOString(),
  };
}

export function dbToInquiry(row: any): CustomInquiry {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    artType: row.art_type,
    customVerseOrText: row.custom_verse_or_text || "",
    canvasSize: row.canvas_size || "",
    frameType: row.frame_type || "",
    estimatedPrice: Number(row.estimated_price || 0),
    notes: row.notes || "",
    status: row.status || "new",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function inquiryToDb(inq: CustomInquiry) {
  return {
    id: inq.id,
    customer_name: inq.customerName,
    phone: inq.phone,
    art_type: inq.artType,
    custom_verse_or_text: inq.customVerseOrText || null,
    canvas_size: inq.canvasSize || null,
    frame_type: inq.frameType || null,
    estimated_price: inq.estimatedPrice,
    notes: inq.notes || null,
    status: inq.status,
    created_at: inq.createdAt,
  };
}
