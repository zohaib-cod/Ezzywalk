"use client";
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

export default function CartIcon() {
  const { cartCount, isClient } = useCart();
  
  return (
    <Link href="/cart" className="hover:text-[#1a73e8] transition relative block">
      <ShoppingBag className="w-[20px] h-[20px] stroke-[1.5]" />
      {isClient && cartCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
