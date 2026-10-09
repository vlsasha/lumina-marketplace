'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string; // unique ID for the cart item
  sourceId: string;
  sourceName: string;
  tier: number;
  providers: `0x${string}`[];
  amounts: bigint[];
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('vana_cart');
    if (saved) {
      try {
        // We need to parse BigInts carefully
        const parsed = JSON.parse(saved, (key, value) => {
          if (typeof value === 'string' && value.endsWith('n')) {
            return BigInt(value.slice(0, -1));
          }
          return value;
        });
        setItems(parsed);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!mounted) return;
    const serialized = JSON.stringify(items, (key, value) => {
      typeof value === 'bigint' ? value.toString() + 'n' : value
    });
    localStorage.setItem('vana_cart', serialized);
  }, [items, mounted]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substring(7) };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Added ${item.sourceName} to cart!`);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
