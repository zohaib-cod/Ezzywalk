"use client";
import { useCart } from './CartProvider';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartBtn({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col space-y-3">
      <button 
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`w-full py-4 rounded-full font-bold flex items-center justify-center transition shadow-lg ${product.stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : added ? 'bg-green-500 text-white' : 'bg-[#1a73e8] text-white hover:bg-blue-600'}`}
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
      </button>

      <button 
        onClick={handleBuyNow}
        disabled={product.stock === 0}
        className={`w-full py-4 rounded-full font-bold flex items-center justify-center transition shadow-lg ${product.stock === 0 ? 'hidden' : 'bg-gray-900 text-white hover:bg-black'}`}
      >
        Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}
