"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  toast: { message: string; type: "success" | "info" | "error" } | null;
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

  // Inquiries
  createInquiry: (inquiryData: Omit<CustomInquiry, "id" | "createdAt" | "status">) => CustomInquiry;
  updateInquiryStatus: (inquiryId: string, status: CustomInquiry["status"]) => void;

  // Artworks CRUD
  addArtwork: (artwork: Omit<Artwork, "id">) => void;
  updateArtwork: (id: string, updated: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
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
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<"connected" | "connecting" | "offline">("offline");

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((prev) => (prev?.message === message ? null : prev));
      }, 4000);
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

      if (artData && artData.length > 0) {
        const mappedArtworks = artData.map(dbToArtwork);
        setArtworks(mappedArtworks);
      }

      // 2. Fetch Orders
      const { data: ordData, error: ordError } = await client
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!ordError && ordData && ordData.length > 0) {
        setOrders(ordData.map(dbToOrder));
      }

      // 3. Fetch Inquiries
      const { data: inqData, error: inqError } = await client
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!inqError && inqData && inqData.length > 0) {
        setInquiries(inqData.map(dbToInquiry));
      }

      // 4. Fetch Site Settings
      const { data: settData, error: settError } = await client
        .from("site_settings")
        .select("settings")
        .eq("id", "current")
        .maybeSingle();

      if (!settError && settData?.settings) {
        setSettings((prev) => ({ ...prev, ...settData.settings }));
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

  // Settings update with Supabase sync
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    showToast("Site settings saved successfully.");

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
        createInquiry,
        updateInquiryStatus,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        updateSettings,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0d2218]/95 backdrop-blur-md border border-[#d4af37]/40 text-[#f4f8f5] px-5 py-3.5 rounded-xl shadow-2xl animate-bounce-short">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              toast.type === "success"
                ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                : toast.type === "error"
                ? "bg-rose-400 shadow-[0_0_8px_#fb7185]"
                : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
            }`}
          />
          <p className="text-sm font-medium">{toast.message}</p>
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
