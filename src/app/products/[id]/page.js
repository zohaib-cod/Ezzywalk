import { notFound } from 'next/navigation';
import AddToCartBtn from '@/components/AddToCartBtn';
import { Truck, RefreshCcw, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  
  let product = null;
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      product = await res.json();
    }
  } catch (e) {
    console.error(e);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Gallery area */}
        <div className="bg-[#f3f5f7] rounded-[32px] p-10 flex items-center justify-center min-h-[400px] relative">
          {product.stock === 0 && <span className="absolute top-6 left-6 bg-red-500 text-white text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-wider z-10">Sold Out</span>}
          <img 
            src={product.imageUrl || "/categories/sneaker.png"} 
            alt={product.name} 
            className="w-full max-w-[400px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Info area */}
        <div className="flex flex-col justify-center">
          <p className="text-[#1a73e8] text-[11px] font-bold tracking-[0.2em] uppercase mb-2">Ezzywalk</p>
          <h1 className="text-3xl lg:text-4xl font-black mb-4 text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-2xl font-bold text-gray-900 mb-6">Rs {product.price}</p>
          
          <div className="prose prose-sm text-gray-500 mb-8 leading-relaxed">
            <p>{product.description || 'Premium comfort meets everyday style. Crafted with the finest materials for a durable, lightweight fit that lasts all day.'}</p>
          </div>

          <div className="mb-8 border-y py-6 border-gray-100 flex flex-col space-y-4">
             <div className="flex items-center text-sm text-gray-600">
               <Truck className="w-5 h-5 text-blue-500 mr-3" /> 2-5 days nationwide delivery
             </div>
             <div className="flex items-center text-sm text-gray-600">
               <RefreshCcw className="w-5 h-5 text-blue-500 mr-3" /> 15-day easy exchange
             </div>
             <div className="flex items-center text-sm text-gray-600">
               <ShieldCheck className="w-5 h-5 text-blue-500 mr-3" /> 100% genuine quality
             </div>
          </div>

          <AddToCartBtn product={product} />
        </div>
      </div>
    </div>
  );
}
