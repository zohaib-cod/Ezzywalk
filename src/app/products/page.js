import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const { category, brand, search } = await searchParams;
  
  let products = [];
  try {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (brand) query.append('brand', brand);
    if (search) query.append('search', search);

    const url = `${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/products?${query.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      products = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch products', e);
  }

  let title = 'All Products';
  if (search) title = `Search Results for "${search}"`;
  else if (category || brand) {
    title = `${brand || ''} ${category ? category : 'Products'}`.trim();
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 capitalize">{title.toLowerCase()}</h1>
          <p className="text-gray-500 text-sm">Discover our premium collection crafted for comfort.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">No products found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="group relative bg-[#f3f5f7] rounded-[24px] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 block">
              <div className="w-full aspect-square relative flex items-center justify-center p-6">
                 {product.stock < 5 && product.stock > 0 && <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">Few Left</span>}
                 {product.stock === 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">Sold Out</span>}
                 <img 
                   src={product.imageUrl || "/categories/sneaker.png"} 
                   alt={product.name} 
                   className="w-[90%] h-auto object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 z-0" 
                 />
              </div>
              <div className="px-6 pb-7 pt-1 bg-white h-full">
                <p className="text-[#1a73e8] text-[9px] font-bold tracking-widest uppercase mb-1.5">{product.brand || 'EZZYWALK'}</p>
                <h3 className="font-bold text-[14px] mb-2 text-gray-900 leading-snug group-hover:text-[#1a73e8] transition-colors">{product.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                   <p className="font-black text-[15px] text-gray-900">Rs {product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
