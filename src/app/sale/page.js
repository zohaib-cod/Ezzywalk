import Image from 'next/image';

export const metadata = {
  title: 'Season End Sale - Ezzywalk',
  description: 'Grab the best deals before they are gone.',
};

export default async function SalePage() {
  let saleProducts = [];
  try {
    const res = await fetch('http://localhost:5000/api/products/sale', { cache: 'no-store' });
    if (res.ok) {
      saleProducts = await res.json();
    }
  } catch (e) {
    console.error(e);
  }

  if (saleProducts.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-[#123e6b] mb-4">Season End Sale</h1>
        <p className="text-gray-500 text-lg">Our sale has ended. Check back later for more amazing deals!</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-20">
      <h1 className="text-4xl font-black text-[#123e6b] mb-4">Season End Sale</h1>
      <p className="text-gray-500 text-lg mb-12">Grab the best deals before they are gone.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {saleProducts.map((product) => (
          <div key={product.id} className="group relative rounded-2xl overflow-hidden bg-gray-50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 tracking-widest uppercase">
                SALE
              </div>
              {product.imageUrl && (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-red-500 font-bold mb-3">${product.price}</p>
              <button className="w-full bg-black text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
