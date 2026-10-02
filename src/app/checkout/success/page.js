import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="max-w-[1050px] mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-black mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">
        Thank you for shopping at Ezzywalk. Your order has been received and is being processed. 
        You will receive an email confirmation shortly.
      </p>
      <Link href="/products" className="bg-[#1a73e8] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}
