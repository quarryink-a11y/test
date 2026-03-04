import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCY_SYMBOLS = { USD: '$', CAD: 'C$', EUR: '€', UAH: '₴' };

const DEFAULT_PRODUCTS = [
  { name: 'Gift Certificate', price: '$100', category: 'Gift Certificate', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/facdd117f_ChatGPTImage28202617_19_12.png' },
  { name: 'Tattoo Flash Print', price: '$35', category: 'Print', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/2fd93ee8e_SnapInstato_587409522_18297979912287835_1863849136986666509_n.jpg' },
  { name: 'Sticker Pack', price: '$12', category: 'Sticker', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/99e1419b7_SnapInstato_589912109_18297979939287835_9021672559181322569_n.jpg' },
  { name: 'Artist Hoodie', price: '$65', category: 'Merch', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/605fb6cfb_ChatGPTImage28202617_16_20.png' },
];

export default function ShopSection({ items, ownerEmail, stripeConnected, theme }) {
  const [buyingId, setBuyingId] = useState(null);

  const isPreview = !items;
  const products = items ? items.map(p => ({
    id: p.id,
    name: p.name,
    price_num: p.price,
    price: `${CURRENCY_SYMBOLS[p.currency] || '$'}${p.price}`,
    currency: p.currency || 'USD',
    category: p.category || '',
    img: p.image_url,
  })) : DEFAULT_PRODUCTS;

  const handleBuy = async (product) => {
    if (isPreview || !stripeConnected) return;
    setBuyingId(product.id);
    const currentUrl = window.location.href.split('?')[0];
    const res = await base44.functions.invoke('createCheckout', {
      items: [{
        id: product.id,
        name: product.name,
        price: product.price_num,
        currency: product.currency,
        image_url: product.img,
        quantity: 1,
      }],
      owner_email: ownerEmail,
      success_url: `${currentUrl}?payment=success`,
      cancel_url: `${currentUrl}?payment=cancelled`,
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
    setBuyingId(null);
  };

  return (
    <section id="shop" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="label-caps text-white/35 mb-16">Shop</motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {products.map((p, i) => (
            <motion.div key={i} className="group cursor-pointer bg-[#050505]"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }} viewport={{ once: true }}>
              <div className="overflow-hidden relative">
                {p.img && (
                  <>
                    <img src={p.img} alt={p.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                  </>
                )}
                {stripeConnected && !isPreview && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={() => handleBuy(p)}
                      disabled={buyingId === p.id}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      {buyingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#050505] animate-spin" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5 text-[#050505]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="px-3 py-4 bg-[#0a0a0a]">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-serif-display text-[16px] font-light text-white/70">{p.name}</p>
                  <p className="label-caps text-white/25 shrink-0">{p.price}</p>
                </div>
                {p.category && <p className="text-[10px] leading-[1.9] text-white/30 font-light mt-1">{p.category}</p>}
                {stripeConnected && !isPreview && (
                  <button
                    onClick={() => handleBuy(p)}
                    disabled={buyingId === p.id}
                    className="mt-3 w-full py-2 text-[10px] tracking-[0.2em] uppercase text-white/60 border border-white/10 hover:border-white/30 hover:text-white/90 transition-all duration-300"
                  >
                    {buyingId === p.id ? 'Processing...' : 'Buy now'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}