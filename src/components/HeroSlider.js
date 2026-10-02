"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/heroSlides`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) return <div className="w-full h-[550px] bg-gray-100 flex items-center justify-center animate-pulse">Loading...</div>;
  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[550px] overflow-hidden group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className={`min-w-full h-full flex flex-col items-center justify-center relative ${slide.bgColor || 'bg-gray-900'}`}
          >
            {slide.imageUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
            )}
            {/* Dark overlay for text readability without washing out image colors */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center p-8">
              {slide.label && (
                <div className="bg-white/80 p-8 backdrop-blur-sm shadow-xl border border-white text-center rounded-xl mb-4 max-w-[80%] md:max-w-[60%]">
                  {slide.label && <h2 className="text-red-800 font-bold tracking-[0.3em] uppercase mb-2 text-sm">{slide.label}</h2>}
                  {slide.title && (
                    <h1 className="text-4xl md:text-6xl font-black text-red-800 mb-2 leading-none">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl font-bold tracking-widest text-red-800 uppercase mb-8">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.linkUrl && slide.linkText && (
                    <Link href={slide.linkUrl} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition inline-block">
                      {slide.linkText} &rarr;
                    </Link>
                  )}
                </div>
              )}
              {!slide.label && (
                <div className="text-center text-white p-8">
                  {slide.title && <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-lg">{slide.title}</h1>}
                  {slide.subtitle && <p className="text-xl font-bold mb-6 drop-shadow-md">{slide.subtitle}</p>}
                  {slide.linkUrl && slide.linkText && (
                    <Link href={slide.linkUrl} className="bg-white text-blue-900 font-bold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition inline-block">
                      {slide.linkText} &rarr;
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${current === idx ? 'bg-blue-600 scale-125' : 'bg-gray-400 hover:bg-gray-500'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
