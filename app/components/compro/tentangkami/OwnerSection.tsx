import Image from 'next/image';

export default function OwnerSection() {
  return (
    <div className="container mx-auto px-4 py-16 bg-black">
      <h2 className="text-3xl font-bold mb-12 text-center">KENALAN SAMA OWNER</h2>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-2/3">
          <p className="text-gray-300 mb-6">
            Ade Irawan, sang pendiri RamenRamein, menemukan kecocokannya pada ramen saat berkunjung ke Jepang. Ia yang menyukai berbagai hidangan street food Jepang, 
            terpikir untuk membuka warung ramen sederhana di tanah airnya.
          </p>
          <p className="text-gray-300 mb-6">
            Terinspirasi dari pengalaman itu, ia ingin membawa nuansa yang sama ke Indonesia. 
            Dari situlah lahir ide membuka warung ramen pertama di Tajur, dengan konsep street 
            food Jepang yang disesuaikan dengan lidah Indonesia dan harga yang tetap terjangkau.
          </p>
          <p className="text-gray-300">
            Dengan semangat sederhana namun penuh rasa, Mas Ade membangun RamenRamein 
            sebagai tempat di mana orang bisa menikmati ramen lezat tanpa harus jauh-jauh ke 
            Jepang.
          </p>
        </div>
        <div className="md:w-1/3">
          <Image
            src="/images/tentangkami/mas_ade.png"
            alt="Owner RamenRamein"
            width={300}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
