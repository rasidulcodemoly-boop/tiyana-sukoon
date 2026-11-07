"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import { PaymentMethod } from "../types";
import confetti from "canvas-confetti";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  Truck,
  Sparkles,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    createOrder,
    settings,
    language,
    t,
  } = useStore();

  const [deliveryZone, setDeliveryZone] = useState<"inside_dhaka" | "outside_dhaka">(
    "inside_dhaka"
  );
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentTrxId, setPaymentTrxId] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isCartOpen) return null;

  // Calculate delivery fee
  const baseDelivery =
    deliveryZone === "inside_dhaka"
      ? settings.insideDhakaDeliveryFee
      : settings.outsideDhakaDeliveryFee;
  const deliveryFee =
    cartSubtotal >= settings.freeDeliveryThreshold ? 0 : baseDelivery;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    if (
      (paymentMethod === "bkash" || paymentMethod === "nagad") &&
      !paymentTrxId.trim()
    ) {
      alert(
        `Please provide the ${paymentMethod.toUpperCase()} Transaction ID or Last 4 digits.`
      );
      return;
    }

    setIsPlacingOrder(true);

    try {
      const newOrder = createOrder({
        customerName,
        phone,
        address,
        deliveryZone,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee,
        totalAmount: grandTotal,
        paymentMethod,
        paymentTrxId: paymentTrxId.trim() || undefined,
        notes: orderNotes.trim() || undefined,
      });

      // Fire confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#10b981", "#f4dc8a", "#059669"],
        });
      } catch (err) {
        // ignore
      }

      setCompletedOrder(newOrder);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getWhatsAppOrderText = (order: any) => {
    const itemsList = order.items
      .map(
        (it: any) =>
          `• ${it.artwork.title} (Qty: ${it.quantity}) - ৳${(
            it.artwork.price * it.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const text = `Assalamu Alaikum! I have placed an order on Tiyana's Sukoon website:
Order No: ${order.orderNumber}
Customer: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address} (${
      order.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"
    })
Payment: ${order.paymentMethod.toUpperCase()}${
      order.paymentTrxId ? ` (Trx: ${order.paymentTrxId})` : ""
    }

Items:
${itemsList}

Subtotal: ৳${order.subtotal.toLocaleString()}
Delivery Fee: ৳${order.deliveryFee.toLocaleString()}
Grand Total: ৳${order.totalAmount.toLocaleString()} BDT

Please confirm my order. Thank you!`;

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#07150e] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0a1e13]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 text-[#f4dc8a] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t("cartTitle")}</h3>
                <p className="text-[11px] text-[#8fa89a]">
                  {cart.length} {language === "bn" ? "টি আর্টওয়ার্ক নির্বাচিত" : `item${cart.length === 1 ? "" : "s"} selected`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setCompletedOrder(null);
              }}
              className="p-2 rounded-lg bg-[#06120b] text-[#8fa89a] hover:text-white border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {completedOrder ? (
              /* Success Screen */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                    Order Successful
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    JazakAllah Khayr!
                  </h3>
                  <p className="text-xs text-[#9cb5a6]">
                    Your order has been recorded in our studio dashboard.
                  </p>
                </div>

                <div className="bg-[#091b11] p-4 rounded-xl border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8fa89a]">Order Tracking No:</span>
                    <span className="font-mono font-bold text-[#f4dc8a]">
                      {completedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa89a]">Customer:</span>
                    <span className="font-medium text-white">
                      {completedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa89a]">Total Payable:</span>
                    <span className="font-bold text-[#fceb9e]">
                      ৳{completedOrder.totalAmount.toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8fa89a]">Payment Mode:</span>
                    <span className="uppercase text-emerald-400 font-semibold">
                      {completedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={getWhatsAppOrderText(completedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-3d-emerald py-3 text-xs inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order to Studio WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setCompletedOrder(null);
                      setIsCartOpen(false);
                    }}
                    className="w-full btn-3d-dark py-2.5 text-xs text-[#9cb5a6]"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#0a1e13] text-[#8fa89a] flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Your Cart is Empty</h4>
                  <p className="text-xs text-[#8fa89a] mt-1">
                    Explore our Arabic calligraphy pieces and add them to your collection.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-3d-gold px-5 py-2.5 text-xs"
                >
                  Browse Artwork
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.artwork.id}
                      className="p-3.5 rounded-xl bg-[#091d12] border border-white/5 flex gap-3 items-center justify-between"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#06110a]">
                        <Image
                          src={item.artwork.image}
                          alt={item.artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-white truncate">
                          {language === "bn" && item.artwork.titleBangla ? item.artwork.titleBangla : item.artwork.title}
                        </h4>
                        <p className="text-[10px] text-[#8fa89a] truncate">
                          {item.selectedFrame || item.artwork.dimensions}
                        </p>
                        <p className="text-xs font-bold text-[#fceb9e] mt-1">
                          ৳{(item.artwork.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.artwork.id)}
                          className="text-[#8fa89a] hover:text-rose-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-[#06110a] rounded-lg border border-white/10 p-0.5">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.artwork.id, item.quantity - 1)
                            }
                            className="p-1 text-[#8fa89a] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1 text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.artwork.id, item.quantity + 1)
                            }
                            className="p-1 text-[#8fa89a] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-white/10">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#d4af37]">
                      Delivery &amp; Checkout Details
                    </h4>
                    <p className="text-[11px] text-[#8fa89a]">
                      We deliver securely packed framed art across Bangladesh.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanzim Ahmed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Detailed Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House/Apartment, Road, Area, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* Delivery Zone Selector */}
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1.5">
                      Delivery Zone
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone("inside_dhaka")}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          deliveryZone === "inside_dhaka"
                            ? "bg-[#102d1e] border-[#d4af37] text-white"
                            : "bg-[#091d12] border-white/10 text-[#8fa89a]"
                        }`}
                      >
                        <p className="font-bold">Inside Dhaka</p>
                        <p className="text-[10px] text-[#f4dc8a]">
                          {cartSubtotal >= settings.freeDeliveryThreshold
                            ? "FREE Delivery"
                            : `৳${settings.insideDhakaDeliveryFee}`}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryZone("outside_dhaka")}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          deliveryZone === "outside_dhaka"
                            ? "bg-[#102d1e] border-[#d4af37] text-white"
                            : "bg-[#091d12] border-white/10 text-[#8fa89a]"
                        }`}
                      >
                        <p className="font-bold">Outside Dhaka</p>
                        <p className="text-[10px] text-[#f4dc8a]">
                          {cartSubtotal >= settings.freeDeliveryThreshold
                            ? "FREE Delivery"
                            : `৳${settings.outsideDhakaDeliveryFee}`}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1.5">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "cod", label: "Cash on Delivery" },
                        { id: "bkash", label: "bKash" },
                        { id: "nagad", label: "Nagad" },
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                          className={`p-2 rounded-lg border text-center text-xs font-semibold transition-all ${
                            paymentMethod === pm.id
                              ? "bg-[#102d1e] border-[#d4af37] text-white"
                              : "bg-[#091d12] border-white/10 text-[#8fa89a]"
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>

                    {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                      <div className="mt-2 p-3 rounded-lg bg-[#06120b] border border-white/10 text-[11px] space-y-1.5 text-[#9cb5a6]">
                        <p className="text-white font-medium">
                          Send money to {paymentMethod.toUpperCase()}:{" "}
                          <span className="font-mono text-[#f4dc8a]">
                            {settings.phone1}
                          </span>
                        </p>
                        <input
                          type="text"
                          required
                          placeholder="Enter Transaction ID (TrxID)"
                          value={paymentTrxId}
                          onChange={(e) => setPaymentTrxId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-[#091d12] border border-white/10 text-white text-xs placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Order Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call before delivery, gift wrap requested"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* Submit Button inside form */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="w-full btn-3d-gold py-3 text-xs tracking-wider uppercase font-bold"
                    >
                      {isPlacingOrder
                        ? t("cartPlacingOrder")
                        : `${t("cartPlaceOrderBtn")} • ৳${grandTotal.toLocaleString()} BDT`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Drawer Bottom Total Bar (if not submitted & has items) */}
          {!completedOrder && cart.length > 0 && (
            <div className="p-4 bg-[#0a1e13] border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-[#8fa89a]">
                <span>{t("cartSubtotal")}</span>
                <span>৳{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8fa89a]">
                <span>{t("cartDelivery")}</span>
                <span>{deliveryFee === 0 ? (language === "bn" ? "ফ্রি" : "FREE") : `৳${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white/5">
                <span>{t("cartTotal")}</span>
                <span className="text-[#fceb9e]">
                  ৳{grandTotal.toLocaleString()} BDT
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
