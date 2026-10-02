"use client";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Search } from 'lucide-react';
import CartIcon from '@/components/CartIcon';
import Chatbot from '@/components/Chatbot';
import { useState, useEffect } from 'react';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const isAdmin = pathname?.startsWith('/admin');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {!isAdmin && (
        <header className="sticky top-0 z-50 bg-[#fcfcfd] border-b border-gray-100 border-t-2 border-t-pink-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-[72px]">
              <div className="flex-1 flex items-center">
                <Link href="/" className="flex flex-col whitespace-nowrap">
                  <span className="text-2xl font-black tracking-tighter text-[#123e6b] leading-none">
                    ezzywalk<span className="text-[#1a73e8]">.</span>
                  </span>
                  <span className="text-[#1a73e8] text-[10px] font-medium tracking-wide mt-1">Comfortably Yours</span>
                </Link>
              </div>

              <nav className="hidden lg:flex items-center justify-center space-x-5 xl:space-x-7 text-[11px] font-bold tracking-[0.1em] text-[#333] whitespace-nowrap flex-shrink-0">
                <Link href="/sale" className="bg-[#247ae3] text-white px-5 py-2.5 rounded-full flex items-center hover:bg-blue-600 transition shadow-[0_4px_14px_rgba(36,122,227,0.35)]">
                  SEASON END SALE
                </Link>
                <Link href="/products" className="flex items-center hover:text-[#1a73e8] transition">
                  NEW IN
                </Link>
                
                {/* Collections Dropdown */}
                <div className="relative group flex items-center h-[72px]">
                  <button className="flex items-center hover:text-[#1a73e8] transition uppercase">
                    Collections
                  </button>
                  {/* First Level Dropdown */}
                  <div className="absolute top-[72px] left-0 bg-white shadow-lg border rounded w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {/* Ezzywalk */}
                    <div className="relative group/ezzy">
                      <Link href="/products?brand=EZZYWALK" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8] flex justify-between items-center">
                        EZZYWALK <span className="text-[10px]">▶</span>
                      </Link>
                      {/* Second Level Dropdown */}
                      <div className="absolute top-0 left-full bg-white shadow-lg border rounded w-40 opacity-0 invisible group-hover/ezzy:opacity-100 group-hover/ezzy:visible transition-all duration-200">
                        <Link href="/products?brand=EZZYWALK&category=MEN" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8]">MEN</Link>
                        <Link href="/products?brand=EZZYWALK&category=WOMEN" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8]">WOMEN</Link>
                        <Link href="/products?brand=EZZYWALK&category=KIDS" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8]">KIDS</Link>
                      </div>
                    </div>
                    {/* Stowave */}
                    <div className="relative group/stowave">
                      <Link href="/products?brand=STOWAVE" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8] flex justify-between items-center">
                        STOWAVE <span className="text-[10px]">▶</span>
                      </Link>
                      <div className="absolute top-0 left-full bg-white shadow-lg border rounded w-40 opacity-0 invisible group-hover/stowave:opacity-100 group-hover/stowave:visible transition-all duration-200">
                        <Link href="/products?brand=STOWAVE&category=MEN" className="block px-4 py-3 hover:bg-gray-50 hover:text-[#1a73e8]">MEN</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/about" className="flex items-center hover:text-[#1a73e8] transition">
                  ABOUT US
                </Link>
                <Link href="/contact" className="flex items-center hover:text-[#1a73e8] transition">
                  CONTACT US
                </Link>
              </nav>

              <div className="flex-1 flex items-center justify-end space-x-6 text-gray-900 relative">
                <button onClick={() => setShowSearch(!showSearch)} className="hover:text-[#1a73e8] transition">
                  <Search className="w-[20px] h-[20px] stroke-[1.5]" />
                </button>
                {showSearch && (
                  <form onSubmit={handleSearch} className="absolute top-10 right-16 bg-white shadow-lg border rounded p-2 z-50 flex">
                    <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="border rounded-l px-3 py-1 text-sm outline-none w-48" />
                    <button type="submit" className="bg-[#1a73e8] text-white px-3 py-1 rounded-r text-sm">Go</button>
                  </form>
                )}
                <Link href="/profile" className="hover:text-[#1a73e8] transition">
                  <User className="w-[20px] h-[20px] stroke-[1.5]" />
                </Link>
                <CartIcon />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {!isAdmin && (
        <footer className="bg-[#0d2f4f] text-gray-300 mt-auto">
          <div className="max-w-[1150px] mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
            
            <div className="md:col-span-4 pr-8">
              <Link href="/" className="text-4xl font-black tracking-tighter text-white mb-6 inline-block">
                ezzywalk<span className="text-[#1a73e8]">.</span>
              </Link>
              <p className="text-sm text-blue-200/70 leading-relaxed mb-6 font-medium">
                Premium slippers and shirts designed for everyday comfort, crafted for style. Step into the new standard of lifestyle wear in Pakistan.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Shop</h3>
              <ul className="space-y-4 text-sm font-medium text-blue-200/70">
                <li><Link href="/products" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link href="/products?brand=EZZYWALK" className="hover:text-white transition">Ezzywalk</Link></li>
                <li><Link href="/products?brand=STOWAVE" className="hover:text-white transition">Stowave</Link></li>
                <li><Link href="/sale" className="hover:text-white transition">Clearance Sale</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Support</h3>
              <ul className="space-y-4 text-sm font-medium text-blue-200/70">
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/returns" className="hover:text-white transition">Return Policy</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Newsletter</h3>
              <p className="text-sm text-blue-200/70 mb-6 font-medium leading-relaxed">Subscribe to receive updates, access to exclusive deals, and more directly to your inbox.</p>
              <div className="flex h-12">
                <input type="email" placeholder="Enter your email" className="bg-[#1a446b] text-white px-5 py-2 w-full focus:outline-none rounded-l border border-[#1a446b] focus:border-blue-400 text-sm placeholder-blue-300/50 transition" />
                <button className="bg-blue-600 text-white px-6 py-2 font-bold hover:bg-blue-500 transition rounded-r text-sm uppercase tracking-wider">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0a2540] py-6 border-t border-[#1a446b]">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-blue-200/50">
              <p>&copy; {new Date().getFullYear()} Ezzywalk. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
      {!isAdmin && <Chatbot />}
    </>
  );
}
