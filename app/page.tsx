"use client";

import { Card } from "@/components";

const latestShoes = [
  {
    id: 1,
    title: "Air Force 1 Mid",
    description:
      "Classic basketball style with premium leather and iconic design",
    image: "/shoes/shoe-1.jpg",
    price: 129.99,
    category: "Basketball",
    badge: "New",
  },
  {
    id: 2,
    title: "Nike Dunk Low",
    description: "Retro basketball sneaker with modern comfort and style",
    image: "/shoes/shoe-2.webp",
    price: 110.0,
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "Air Max 90",
    description: "Legendary cushioning with visible Air unit and bold design",
    image: "/shoes/shoe-3.webp",
    price: 140.0,
    category: "Running",
    badge: "Popular",
  },
  {
    id: 4,
    title: "Jordan 1 High",
    description: "Iconic silhouette with premium materials and timeless appeal",
    image: "/shoes/shoe-4.webp",
    price: 170.0,
    category: "Jordan",
  },
  {
    id: 5,
    title: "Air Zoom Pegasus",
    description: "Responsive cushioning for your daily running routine",
    image: "/shoes/shoe-5.avif",
    price: 130.0,
    category: "Running",
  },
  {
    id: 6,
    title: "Blazer Mid '77",
    description: "Vintage basketball style with modern comfort",
    image: "/shoes/shoe-6.avif",
    price: 100.0,
    category: "Lifestyle",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-light-200">
      {/* Latest Shoes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-heading-2 font-bold text-dark-900 mb-8">
          Latest shoes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestShoes.map((shoe) => (
            <Card
              key={shoe.id}
              title={shoe.title}
              description={shoe.description}
              image={shoe.image}
              price={shoe.price}
              category={shoe.category}
              badge={shoe.badge}
              onClick={() => console.log(`Clicked on ${shoe.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
