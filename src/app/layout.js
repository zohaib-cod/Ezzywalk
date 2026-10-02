import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Ezzywalk - Premium Slippers & Shirts',
  description: 'Shop the latest slippers and shirts at Ezzywalk.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white flex flex-col min-h-screen">
        <CartProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
