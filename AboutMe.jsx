import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import ShopItemCard from '@/components/shop/ShopItemCard';
import ShopCart from '@/components/shop/ShopCart';
import { ShoppingBag } from 'lucide-react';

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const ownerEmail = urlParams.get('owner');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shop-items', ownerEmail],
    queryFn: () => ownerEmail
      ? base44.entities.CatalogItem.filter({ created_by: ownerEmail, is_active: true }, '-created_date')
      : base44.entities.CatalogItem.filter({ is_active: true }, '-created_date'),
  });

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.id !== itemId));
    } else {
      setCart(prev => prev.map(c => c.id === itemId ? { ...c, quantity } : c));
    }
  };

  const handleCheckout = async () => {
    if (!cart.length) return;
    setIsCheckingOut(true);

    const currentUrl = window.location.href.split('?')[0];
    const response = await base44.functions.invoke('createCheckout', {
      items: cart.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        currency: c.currency || 'USD',
        image_url: c.image_url,
        quantity: c.quantity,
      })),
      owner_email: ownerEmail,
      success_url: `${currentUrl}?payment=success`,
      cancel_url: `${currentUrl}?payment=cancelled`,
    });

    if (response.data?.url) {
      window.location.href = response.data.url;
    }
    setIsCheckingOut(false);
  };

  const paymentStatus = urlParams.get('payment');

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Shop</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Payment status */}
      {paymentStatus === 'success' && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
            ✅ Payment successful! Thank you for your order.
          </div>
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
            Payment was cancelled. Your cart is still saved.
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-4">
                    <Skeleton className="w-full aspect-square rounded-xl mb-3" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No products available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(item => (
                  <ShopItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          {showCart && (
            <ShopCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
              onClose={() => setShowCart(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}