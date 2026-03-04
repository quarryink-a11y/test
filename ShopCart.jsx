import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Image } from 'lucide-react';

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

export default function ShopItemCard({ item, onAddToCart }) {
  const symbol = CURRENCY_SYMBOLS[item.currency] || '$';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {item.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-600">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{symbol}{item.price}</span>
          <Button
            onClick={() => onAddToCart(item)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-4 gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}