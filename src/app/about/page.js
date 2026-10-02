export const metadata = {
  title: 'About Us - Ezzywalk',
  description: 'Learn more about Ezzywalk, our story, and our mission.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20">
      <h1 className="text-4xl font-black text-[#123e6b] mb-8 text-center">About Ezzywalk</h1>
      <div className="prose prose-lg mx-auto text-gray-700">
        <p className="mb-6">
          Welcome to <strong>Ezzywalk</strong>. We believe in crafting premium footwear and apparel that redefine everyday comfort and style in Pakistan.
        </p>
        <p className="mb-6">
          Our journey started with a simple idea: to create products that feel as good as they look. Today, Ezzywalk is a growing brand dedicated to delivering the highest quality slippers and shirts, tailored for the modern lifestyle.
        </p>
        <p>
          Thank you for trusting us and stepping into the new standard of lifestyle wear with Ezzywalk.
        </p>
      </div>
    </div>
  );
}
