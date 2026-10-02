export const metadata = {
  title: 'Contact Us - Ezzywalk',
  description: 'Get in touch with Ezzywalk customer support.',
};

export default function ContactPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20">
      <h1 className="text-4xl font-black text-[#123e6b] mb-8 text-center">Contact Us</h1>
      <div className="max-w-[600px] mx-auto bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
            <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="w-full bg-[#1a73e8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition shadow-[0_4px_14px_rgba(26,115,232,0.35)]">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
