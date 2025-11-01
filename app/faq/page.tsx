"use client";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">FAQ</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Apa itu RamenRamein?</h2>
            <p className="text-gray-300">RamenRamein adalah restoran ramen dengan cita rasa otentik Jepang yang disesuaikan dengan lidah Indonesia.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Apakah ada menu halal?</h2>
            <p className="text-gray-300">Semua menu di RamenRamein menggunakan bahan-bahan halal.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Bagaimana cara memesan?</h2>
            <p className="text-gray-300">Anda bisa datang langsung ke restoran atau memesan melalui aplikasi ojek online.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
