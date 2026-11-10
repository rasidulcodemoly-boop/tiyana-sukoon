"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import {
  Artwork,
  Order,
  CustomInquiry,
  CartItem,
  SiteSettings,
  OrderStatus,
} from "../types";
import {
  initialArtworks,
  initialOrders,
  initialInquiries,
  initialSettings,
} from "../data/initialData";
import {
  getSupabase,
  isSupabaseConfigured,
  dbToArtwork,
  artworkToDb,
  dbToOrder,
  orderToDb,
  dbToInquiry,
  inquiryToDb,
} from "../lib/supabase";
import { translations, Language } from "../lib/translations";

interface StoreContextType {
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;

  artworks: Artwork[];
  orders: Order[];
  inquiries: CustomInquiry[];
  settings: SiteSettings;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedArtworkForModal: Artwork | null;
  setSelectedArtworkForModal: (artwork: Artwork | null) => void;
  toast: { id?: number; message: string; type: "success" | "info" | "error" } | null;
  showToast: (message: string, type?: "success" | "info" | "error") => void;

  // Supabase Cloud State
  isSupabaseActive: boolean;
  supabaseStatus: "connected" | "connecting" | "offline";
  syncWithSupabase: () => Promise<void>;
  seedSupabaseArtworks: () => Promise<{ success: boolean; count: number; error?: string }>;

  // Cart operations
  addToCart: (artwork: Artwork, quantity?: number, selectedFrame?: string, customText?: string) => void;
  removeFromCart: (artworkId: string) => void;
  updateCartQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Orders
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;

  // Inquiries
  createInquiry: (inquiryData: Omit<CustomInquiry, "id" | "createdAt" | "status">) => CustomInquiry;
  updateInquiryStatus: (inquiryId: string, status: CustomInquiry["status"]) => void;
  deleteInquiry: (inquiryId: string) => void;
  clearAllInquiries: () => void;

  // Artworks CRUD
  addArtwork: (artwork: Omit<Artwork, "id">) => void;
  updateArtwork: (id: string, updated: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  deleteArtworks: (ids: string[]) => void;
  reorderArtworks: (newOrder: Artwork[]) => void;

  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>, silent?: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ARTWORKS: "tiyana_artworks_v1",
  ORDERS: "tiyana_orders_v1",
  INQUIRIES: "tiyana_inquiries_v1",
  SETTINGS: "tiyana_settings_v1",
  CART: "tiyana_cart_v1",
  LANGUAGE: "tiyana_language_v1",
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [language, setLanguageState] = useState<Language>("en");
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inquiries, setInquiries] = useState<CustomInquiry[]>(initialInquiries);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedArtworkForModal, setSelectedArtworkForModal] =
    useState<Artwork | null>(null);
  const [toast, setToast] = useState<{
    id?: number;
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<"connected" | "connecting" | "offline">("offline");

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = Date.now();
      setToast({ id, message, type });
      setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, 4500);
    },
    []
  );

  // Sync data from Supabase
  const syncWithSupabase = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
      setSupabaseStatus("offline");
      return;
    }

    try {
      setSupabaseStatus("connecting");

      // 1. Fetch Artworks
      const { data: artData, error: artError } = await client
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (artError) {
        console.warn("Supabase artworks fetch notice:", artError.message);
        setSupabaseStatus("offline");
        return;
      }

      // 4. Fetch Site Settings (Fetch first to get artworkOrderIds)
      const { data: settData, error: settError } = await client
        .from("site_settings")
        .select("settings")
        .eq("id", "current")
        .maybeSingle();

      let activeSettings = settings;
      if (!settError && settData?.settings) {
        activeSettings = { ...settings, ...settData.settings };
        setSettings(activeSettings);
      }

      if (artData && artData.length > 0) {
        let mappedArtworks = artData.map(dbToArtwork);
        const orderIds = activeSettings.artworkOrderIds;
        if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
          const map = new Map(orderIds.map((id, idx) => [id, idx]));
          mappedArtworks.sort((a, b) => {
            const posA = map.has(a.id) ? map.get(a.id)! : 9999;
            const posB = map.has(b.id) ? map.get(b.id)! : 9999;
            return posA - posB;
          });
        }
        setArtworks(mappedArtworks);
      }

      // 2. Fetch Orders
      const { data: ordData, error: ordError } = await client
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!ordError && ordData) {
        setOrders(ordData.map(dbToOrder));
      }

      // 3. Fetch Inquiries
      const { data: inqData, error: inqError } = await client
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!inqError && inqData) {
        setInquiries(inqData.map(dbToInquiry));
      }

      setSupabaseStatus("connected");
    } catch (e: any) {
      console.warn("Supabase sync failed, falling back to local cache:", e);
      setSupabaseStatus("offline");
    }
  }, []);

  // Seed Supabase with initial 21 artworks
  const seedSupabaseArtworks = useCallback(async (): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> => {
    const client = getSupabase();
    if (!client) {
      return { success: false, count: 0, error: "Supabase client not configured." };
    }

    try {
      const rows = initialArtworks.map(artworkToDb);
      const { data, error } = await client.from("artworks").upsert(rows, { onConflict: "id" });

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      // Also seed site settings
      await client.from("site_settings").upsert(
        {
          id: "current",
          settings: initialSettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      // Re-fetch
      await syncWithSupabase();
      showToast(`Successfully seeded ${initialArtworks.length} artworks to Supabase!`, "success");
      return { success: true, count: initialArtworks.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || String(e) };
    }
  }, [syncWithSupabase, showToast]);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const savedArtworks = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
      if (savedArtworks) setArtworks(JSON.parse(savedArtworks));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedInquiries = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (savedInquiries) setInquiries(JSON.parse(savedInquiries));

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
      if (savedLanguage === "en" || savedLanguage === "bn") {
        setLanguageState(savedLanguage);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    setIsHydrated(true);

    // If Supabase is configured, trigger initial sync
    if (isSupabaseConfigured()) {
      syncWithSupabase();
    }
  }, [syncWithSupabase]);

  // Sync to localStorage as offline safety net
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks));
    } catch (e) {
      console.error(e);
    }
  }, [artworks, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isHydrated]);

  // Cart operations
  const addToCart = (
    artwork: Artwork,
    quantity = 1,
    selectedFrame?: string,
    customText?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.artwork.id === artwork.id &&
          item.selectedFrame === selectedFrame &&
          item.customText === customText
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { artwork, quantity, selectedFrame, customText }];
    });
    showToast(`Added "${artwork.title.slice(0, 24)}..." to your collection cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (artworkId: string) => {
    setCart((prev) => prev.filter((item) => item.artwork.id !== artworkId));
    showToast("Item removed from cart.", "info");
  };

  const updateCartQuantity = (artworkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(artworkId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.artwork.id === artworkId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.artwork.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Create Order with Supabase sync
  const createOrder = (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `TS-${randomSuffix}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Optimistic local state update
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Async sync with Supabase
    const client = getSupabase();
    if (client) {
      client
        .from("orders")
        .insert(orderToDb(newOrder))
        .then(({ error }) => {
          if (error) {
            console.error("Failed to insert order into Supabase:", error);
          }
        });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order status updated to ${status.toUpperCase()}`);

    const client = getSupabase();
    if (client) {
      client
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .then(({ error }) => {
          if (error) console.error("Supabase update error:", error);
        });
    }
  };

  const updateOrderNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, notes } : ord))
    );

    const client = getSupabase();
    if (client) {
      client
        .from("orders")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .then(({ error }) => {
          if (error) console.error("Supabase update error:", error);
        });
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast("Order deleted from admin panel", "info");

    const client = getSupabase();
    if (client) {
      client
        .from("orders")
        .delete()
        .eq("id", orderId)
        .then(({ error }) => {
          if (error) console.error("Supabase delete error:", error);
        });
    }
  };

  const clearAllOrders = () => {
    const orderIds = orders.map((o) => o.id);
    setOrders([]);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast("All orders cleared successfully", "info");

    const client = getSupabase();
    if (client) {
      if (orderIds.length > 0) {
        client
          .from("orders")
          .delete()
          .in("id", orderIds)
          .then(({ error }) => {
            if (error) console.error("Supabase clear orders error:", error);
          });
      } else {
        client
          .from("orders")
          .delete()
          .neq("id", "")
          .then(({ error }) => {
            if (error) console.error("Supabase clear orders error:", error);
          });
      }
    }
  };

  // Create Inquiry with Supabase sync
  const createInquiry = (
    inquiryData: Omit<CustomInquiry, "id" | "createdAt" | "status">
  ): CustomInquiry => {
    const newInq: CustomInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    setInquiries((prev) => [newInq, ...prev]);

    const client = getSupabase();
    if (client) {
      client
        .from("inquiries")
        .insert(inquiryToDb(newInq))
        .then(({ error }) => {
          if (error) {
            console.error("Failed to insert inquiry to Supabase:", error);
          }
        });
    }

    return newInq;
  };

  const updateInquiryStatus = (
    inquiryId: string,
    status: CustomInquiry["status"]
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
    showToast(`Inquiry marked as ${status.toUpperCase()}`);

    const client = getSupabase();
    if (client) {
      client
        .from("inquiries")
        .update({ status })
        .eq("id", inquiryId)
        .then(({ error }) => {
          if (error) console.error("Supabase inquiry update error:", error);
        });
    }
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
    showToast("Inquiry deleted", "info");

    const client = getSupabase();
    if (client) {
      client
        .from("inquiries")
        .delete()
        .eq("id", inquiryId)
        .then(({ error }) => {
          if (error) console.error("Supabase inquiry delete error:", error);
        });
    }
  };

  const clearAllInquiries = () => {
    const inquiryIds = inquiries.map((i) => i.id);
    setInquiries([]);
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast("All inquiries cleared", "info");

    const client = getSupabase();
    if (client) {
      if (inquiryIds.length > 0) {
        client
          .from("inquiries")
          .delete()
          .in("id", inquiryIds)
          .then(({ error }) => {
            if (error) console.error("Supabase clear inquiries error:", error);
          });
      } else {
        client
          .from("inquiries")
          .delete()
          .neq("id", "")
          .then(({ error }) => {
            if (error) console.error("Supabase clear inquiries error:", error);
          });
      }
    }
  };

  // Artwork CRUD with Supabase sync
  const addArtwork = (artworkData: Omit<Artwork, "id">) => {
    const newArt: Artwork = {
      ...artworkData,
      id: `art-${Date.now()}`,
    };
    setArtworks((prev) => [newArt, ...prev]);
    showToast(`Artwork "${newArt.title}" published!`);

    const client = getSupabase();
    if (client) {
      client
        .from("artworks")
        .insert(artworkToDb(newArt))
        .then(({ error }) => {
          if (error) console.error("Failed to add artwork to Supabase:", error);
        });
    }
  };

  const updateArtwork = (id: string, updated: Partial<Artwork>) => {
    let fullArtwork: Artwork | null = null;
    setArtworks((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          fullArtwork = { ...art, ...updated };
          return fullArtwork;
        }
        return art;
      })
    );
    showToast("Artwork updated successfully.");

    if (fullArtwork) {
      const client = getSupabase();
      if (client) {
        client
          .from("artworks")
          .upsert(artworkToDb(fullArtwork))
          .then(({ error }) => {
            if (error) console.error("Failed to update artwork in Supabase:", error);
          });
      }
    }
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((art) => art.id !== id));
    showToast("Artwork removed.", "info");

    const client = getSupabase();
    if (client) {
      client
        .from("artworks")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to delete artwork in Supabase:", error);
        });
    }
  };

  const deleteArtworks = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    setArtworks((prev) => prev.filter((art) => !ids.includes(art.id)));
    showToast(`সফলভাবে ${ids.length}টি আর্টওয়ার্ক মুছে ফেলা হয়েছে! ✓`, "success");

    const client = getSupabase();
    if (client) {
      client
        .from("artworks")
        .delete()
        .in("id", ids)
        .then(({ error }) => {
          if (error) console.error("Failed to delete artworks in Supabase:", error);
        });
    }
  };

  const reorderArtworks = (newOrder: Artwork[]) => {
    setArtworks(newOrder);
    try {
      localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(newOrder));
    } catch (e) {
      console.error(e);
    }
    const orderIds = newOrder.map((a) => a.id);
    updateSettings({ artworkOrderIds: orderIds }, true);
    showToast("আর্টওয়ার্ক ক্রম/সিরিয়াল সফলভাবে সাজানো হয়েছে! ✓", "success");
  };

  // Settings update with Supabase sync
  const updateSettings = (newSettings: Partial<SiteSettings>, silent?: boolean) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (!silent) {
      showToast("স্টোর সেটিংস সফলভাবে সেভ হয়েছে! (Settings Saved)", "success");
    }

    const client = getSupabase();
    if (client) {
      client
        .from("site_settings")
        .upsert({
          id: "current",
          settings: updated,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error("Failed to save settings to Supabase:", error);
        });
    }
  };

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const nextLang: Language = prev === "en" ? "bn" : "en";
      try {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, nextLang);
      } catch (e) {
        console.error(e);
      }
      return nextLang;
    });
  }, []);

  const t = useCallback(
    (key: keyof typeof translations.en): string => {
      return translations[language]?.[key] || translations.en[key] || "";
    },
    [language]
  );

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        artworks,
        orders,
        inquiries,
        settings,
        cart,
        isCartOpen,
        setIsCartOpen,
        selectedArtworkForModal,
        setSelectedArtworkForModal,
        toast,
        showToast,
        isSupabaseActive: supabaseStatus === "connected",
        supabaseStatus,
        syncWithSupabase,
        seedSupabaseArtworks,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        createOrder,
        updateOrderStatus,
        updateOrderNotes,
        deleteOrder,
        clearAllOrders,
        createInquiry,
        updateInquiryStatus,
        deleteInquiry,
        clearAllInquiries,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        deleteArtworks,
        reorderArtworks,
        updateSettings,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-6 right-6 z-[99999] flex items-center gap-3.5 bg-[#091b11]/95 backdrop-blur-xl border border-emerald-500/40 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.25)] animate-fadeIn transition-all duration-300 max-w-md pointer-events-auto">
          <div className="flex-shrink-0">
            {toast.type === "success" && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f4dc8a]">
                <Info className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <p className="text-[11px] font-bold text-white tracking-wide uppercase">
              {toast.type === "success"
                ? "সফল হয়েছে ✓ (Success)"
                : toast.type === "error"
                ? "সমস্যা হয়েছে (Error)"
                : "নোটিফিকেশন (Notification)"}
            </p>
            <p className="text-xs text-[#c4d7cc] mt-0.5 leading-snug font-medium break-words">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-[#8fa89a] hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
