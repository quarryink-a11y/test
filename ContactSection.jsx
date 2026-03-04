import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Loader2, ShoppingBag } from 'lucide-react';

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

export default function ShopCart({ cart, onUpdateQuantity, onCheckout, isCheckingOut, onClose }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = cart.length ? cart[0].currency || 'USD' : 'USD';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg border p-5 h-fit sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">Cart</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map(item => {
              const itemSymbol = CURRENCY_SYMBOLS[item.currency] || '$';
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{itemSymbol}{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{symbol}{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-full"
          >
            {isCheckingOut ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              'Checkout'
            )}
          </Button>
        </>
      )}
    </div>
  );
}