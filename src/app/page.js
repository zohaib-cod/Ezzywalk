import Link from 'next/link';
import { Truck, RefreshCcw, ShieldCheck, Star, Image as ImageIcon } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';

export default async function HomePage() {
  let trendingProducts = [];
  try {
    const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' });
    if (res.ok) {
      const allProducts = await res.json();
      trendingProducts = allProducts.slice(0, 4);
    }
  } catch (e) {
    console.error(e);
  }

  let banner = null;
  try {
      const res = await fetch('http://localhost:5000/api/banners', { cache: 'no-store' });
      if (res.ok) {
        banner = await res.json();
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback default banner content
    if (!banner) {
      banner = {
        label: 'New Collection',
        title: 'Shop Premium Slippers',
        description: 'Experience unmatched comfort and style for your everyday walk.',
        imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=1000&auto=format&fit=crop',
        linkUrl: '/products?category=SLIPPER',
        linkText: 'Shop Now'
      };
    }

    return (
      <div className="font-sans text-gray-900">
        {/* 1. Hero Section (Slider) */}
        <HeroSlider />


        {/* 3. Trending Grid (What Pakistan is wearing) */}
        <section className="max-w-[1050px] mx-auto px-4 py-16">
          <div className="text-center mb-12 flex flex-col items-center">
            <p className="text-[#1a73e8] font-black text-[10px] uppercase tracking-[0.25em] mb-2">Best Sellers</p>
            <h2 className="text-[2.5rem] font-black text-gray-900 tracking-tight leading-none mb-4">What Pakistan is wearing</h2>
            <div className="w-[32px] h-[3px] bg-[#1a73e8] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.length === 0 ? (
              <p className="col-span-4 text-center text-gray-500 py-10">No trending products available right now.</p>
            ) : trendingProducts.map((item) => (
              <Link href={`/products/${item.id}`} key={item.id} className="flex flex-col group cursor-pointer relative bg-[#f3f5f7] rounded-[24px] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-full aspect-square relative flex items-center justify-center p-6">
                  <span className="absolute top-4 left-4 bg-[#1a73e8] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">Best Seller</span>
                  <img
                    src={item.imageUrl || '/categories/sneaker.png'}
                    alt={item.name}
                    className="w-[90%] h-auto object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 z-0"
                  />
                </div>
                <div className="px-6 pb-7 pt-1">
                  <p className="text-[#1a73e8] text-[9px] font-bold tracking-widest uppercase mb-1.5">Ezzywalk</p>
                  <h3 className="font-bold text-[14px] mb-2 text-gray-900 leading-snug group-hover:text-[#1a73e8] transition-colors">{item.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="font-black text-[15px] text-gray-900">Rs {item.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Premium Sliders Banner */}
        <section className="max-w-[1050px] mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">{banner.label}</p>
            <h2 className="text-3xl font-bold">{banner.title}</h2>
            <p className="text-gray-500 mt-2 text-sm">{banner.description}</p>
          </div>
          <div className="relative w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden flex flex-col items-center justify-end pb-12 shadow-inner">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: `url('${banner.imageUrl}')` }}></div>
            <Link href={banner.linkUrl} className="relative z-10 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">
              {banner.linkText} &rarr;
            </Link>
          </div>
        </section>

        {/* 5. About Us / Brand Values */}
        <section className="relative w-full bg-[#11426b] py-24 mt-12 overflow-hidden">
          {/* Abstract Background Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 800 C 400 -200, 1000 800, 1800 100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
            <path d="M-200 200 C 500 1000, 1200 -200, 2000 500" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
          </svg>

          <div className="max-w-[1050px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left: Image */}
            <div className="relative h-[550px] w-full max-w-[420px] mx-auto rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80"
                alt="Crafting footwear"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Text Content */}
            <div className="pl-4">
              <p className="text-[#8cb4d6] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Our Legacy</p>
              <h2 className="text-[2.5rem] text-white font-black mb-6 leading-[1.1] tracking-tight">Crafting footwear the right way, since 1998.</h2>
              <p className="text-[#96b8d9] text-[13px] leading-relaxed mb-10 pr-4">
                Ezzywalk began in 1998 with one standard: make shoes that last, in every style our customers live in. Nearly three decades on, that expertise runs through every pair — leather, casual, sport and beyond — each built in our workshop with the same obsession for comfort and fit.
              </p>

              {/* Stats */}
              <div className="flex space-x-12 mb-10">
                <div>
                  <p className="text-[28px] font-black text-white mb-0.5">27</p>
                  <p className="text-[10px] text-[#8cb4d6]">years of craft</p>
                </div>
                <div>
                  <p className="text-[28px] font-black text-white mb-0.5">40+</p>
                  <p className="text-[10px] text-[#8cb4d6]">retail stores</p>
                </div>
                <div>
                  <p className="text-[28px] font-black text-white mb-0.5">300</p>
                  <p className="text-[10px] text-[#8cb4d6]">wholesale partners</p>
                </div>
              </div>

              {/* Button */}
              <button className="bg-white text-[#11426b] font-bold px-6 py-3 rounded-full text-[13px] hover:bg-gray-100 transition shadow-lg flex items-center">
                Shop the collection <span className="ml-2 font-black text-lg leading-none">&rarr;</span>
              </button>
            </div>
          </div>
        </section>

        {/* 6. Feature Icons */}
        <section className="bg-[#fcfcfd] py-14 border-b border-gray-100">
          <div className="max-w-[1050px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0 mt-0.5">
                <RefreshCcw className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[13px] mb-1">Multiple payment options</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Cash on delivery, Bank transfer, Card payments, EasyPaisa, JazzCash.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0 mt-0.5">
                <Truck className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[13px] mb-1">Fast nationwide delivery</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">At your doorstep in 2-5 working days.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0 mt-0.5">
                <RefreshCcw className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[13px] mb-1">15-day easy exchange</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Wrong size? Swap it online or in any store.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[13px] mb-1">Genuine leather promise</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Premium materials in every pair, guaranteed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="max-w-[1050px] mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Reviews</p>
            <h2 className="text-3xl font-bold mb-4">Worn city to city</h2>
            <div className="flex justify-center items-center space-x-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current text-yellow-400/50" />
              <span className="text-gray-900 font-bold ml-3 text-lg">4.8</span>
              <span className="text-gray-500 text-sm font-medium ml-1">/ 5.0 (2500+ reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Best slippers I have ever owned. Extremely comfortable for daily wear and the quality is outstanding.", name: "Ali K." },
              { text: "The fit of the casual shirts is perfect. Very premium feel. Highly recommend Ezzywalk to everyone!", name: "Zohaib M." },
              { text: "Fast delivery and beautiful packaging. The slippers are very durable. Will definitely buy again.", name: "Ahmed R." }
            ].map((review, i) => (
              <div key={i} className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-2xl relative">
                <div className="flex space-x-1 text-yellow-400 mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-gray-700 mb-8 text-sm leading-relaxed">"{review.text}"</p>
                <div className="flex items-center space-x-3 mt-auto">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <span className="font-bold text-sm text-gray-900">{review.name}</span>
                  <span className="text-green-600 ml-auto flex items-center text-[10px] font-bold uppercase tracking-wider bg-green-50 px-2 py-1 rounded">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }