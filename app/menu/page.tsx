"use client";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">Menu</h1>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Ramen Spesial</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Ramen Original</li>
              <li>Ramen Pedas</li>
              <li>Ramen Kari</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Side Dish</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Gyoza</li>
              <li>Karaage</li>
              <li>Edamame</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Minuman</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Ocha</li>
              <li>Lemon Tea</li>
              <li>Mineral Water</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
