import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Package,
  RefreshCw,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GearProduct, GearCategory, CartItem, RecoveryOrder } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface RecoveryStoreProps {
  products: GearProduct[];
  orders: RecoveryOrder[];
  onPlaceOrder: (cartItems: CartItem[]) => RecoveryOrder | null;
  onRestockProduct: (productId: string, delta: number) => void;
  onViewOrderAnalytics: () => void;
}

export const RecoveryStore: React.FC<RecoveryStoreProps> = ({
  products,
  orders,
  onPlaceOrder,
  onRestockProduct,
  onViewOrderAnalytics
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | GearCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showStockManager, setShowStockManager] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<RecoveryOrder | null>(null);
  const [stockNotice, setStockNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const prod = products.find((p) => p.id === item.productId);
      return acc + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= p.lowStockThreshold);
  }, [products]);

  const handleAddToCart = (product: GearProduct) => {
    if (product.stock <= 0) {
      triggerHaptic('warning');
      setStockNotice(`${product.name} is currently out of stock.`);
      setTimeout(() => setStockNotice(null), 2600);
      return;
    }

    const existing = cart.find((c) => c.productId === product.id);
    const nextQty = (existing?.quantity || 0) + 1;

    if (nextQty > product.stock) {
      triggerHaptic('warning');
      setStockNotice(`Only ${product.stock} unit${product.stock === 1 ? '' : 's'} of ${product.name} available in stock.`);
      setTimeout(() => setStockNotice(null), 2600);
      return;
    }

    // Subtle mobile haptic feedback via navigator.vibrate()
    triggerHaptic('medium');

    setCart((prev) => {
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, quantity: nextQty } : c
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });

    setStockNotice(`Added "${product.name}" to recovery bag.`);
    setTimeout(() => setStockNotice(null), 2200);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    triggerHaptic('light');

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const updated = Math.min(product.stock, item.quantity + delta);
          return { ...item, quantity: updated };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = onPlaceOrder(cart);
    if (!order) {
      triggerHaptic('warning');
      setStockNotice('Could not complete order: insufficient stock on one or more items.');
      return;
    }
    triggerHaptic('success');
    try {
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.65 } });
    } catch {}
    setCart([]);
    setIsCartOpen(false);
    setCheckoutSuccessOrder(order);
  };

  return (
    <div id="ergonomic-recovery-store" className="space-y-6">
      {/* Store Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              Driver Ergonomic Gear &amp; Stock Control
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              {orders.length} Orders Logged (6-Mo)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Road Recovery Gear &amp; Cockpit Accessories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Clinical lumbar cushions, cervical cradles, and myofascial pitstop tools with live inventory tracking and automatic 6-month order frequency analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowStockManager((s) => !s);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              showStockManager
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Stock Manager ({lowStockProducts.length} Alerts)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onViewOrderAnalytics();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>6-Mo Order Trends</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsCartOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({cartItemCount})</span>
            {cartSubtotal > 0 && (
              <span className="font-mono">• ${cartSubtotal.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>

      {/* Live Toast Feedback */}
      {stockNotice && (
        <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{stockNotice}</span>
          </div>
          <button type="button" onClick={() => setStockNotice(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Checkout Confirmation Card */}
      {checkoutSuccessOrder && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-white">
                Order Confirmed ({checkoutSuccessOrder.id}) • ${checkoutSuccessOrder.total.toFixed(2)}
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                Stock levels updated automatically and order frequency logged to your 6-month profile trend chart.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onViewOrderAnalytics();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Order Chart</span>
          </button>
        </div>
      )}

      {/* Stock Management Panel */}
      {showStockManager && (
        <div className="p-5 rounded-3xl bg-slate-950/90 border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Live Stock Management Console</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor low-stock alerts, restock sold-out ergonomic items, or adjust available units.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowStockManager(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((prod) => {
              const isOut = prod.stock <= 0;
              const isLow = !isOut && prod.stock <= prod.lowStockThreshold;
              return (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{prod.imageEmoji}</span>
                      <span className="text-xs font-bold text-white truncate">{prod.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                      <span className="text-slate-500">{prod.sku}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          isOut
                            ? 'bg-rose-500/20 text-rose-300'
                            : isLow
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isOut ? 'OUT OF STOCK' : `${prod.stock} units`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onRestockProduct(prod.id, -1);
                      }}
                      disabled={prod.stock <= 0}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Decrease stock by 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        onRestockProduct(prod.id, 5);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Restock +5 units"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>+5</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Gear' },
          { id: 'lumbar', label: 'Lumbar Support' },
          { id: 'cervical', label: 'Neck & Shoulders' },
          { id: 'wrists', label: 'Wrists & Hands' },
          { id: 'recovery', label: 'Sciatic & Trigger Point' },
          { id: 'hydration', label: 'Hydration' }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategory(cat.id as 'all' | GearCategory);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => {
          const isOut = product.stock <= 0;
          const isLow = !isOut && product.stock <= product.lowStockThreshold;
          const inCartQty = cart.find((c) => c.productId === product.id)?.quantity || 0;

          return (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {product.imageEmoji}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-lg font-black font-mono text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border flex items-center gap-1 ${
                        isOut
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                          : isLow
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {isOut ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </>
                      ) : isLow ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock: {product.stock} left</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          <span>In Stock: {product.stock}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.benefits.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  Fit: {product.vehicleFit}
                </span>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={isOut}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isOut ? 'Unavailable' : inCartQty > 0 ? `Add (${inCartQty} in Bag)` : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">Recovery Gear Cart</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Your recovery gear cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={item.productId}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {product.imageEmoji} {product.name}
                          </div>
                          <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                            ${product.price.toFixed(2)} each • {product.stock} left
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            disabled={item.quantity >= product.stock}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -item.quantity)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-semibold">Order Total</span>
                <span className="text-xl font-black font-mono text-white">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl disabled:opacity-40 cursor-pointer"
              >
                Place Order &amp; Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
