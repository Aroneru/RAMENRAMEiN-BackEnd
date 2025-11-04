import Image from 'next/image';

export default function SejarahSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        SEJARAH <span className="text-red-600">RAMENRAMEiN</span>
      </h2>
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-gray-300">
          RAMENRAMEiN didirikan pada tahun 2014 oleh Ade Irawan, terinspirasi dari suasana street food Jepang yang hangat dan bersahaja. 
          Ia ingin menghadirkan pengalaman serupa di Indonesia lewat warung ramen yang sederhana namun elegan, dengan cita rasa yang 
          disuarakan dengan ikhlas.
        </p>
        <p className="text-gray-300">
          Awalnya berlokasi di Jalan Raya Tajur, RAMENRAMEiN kemudian pindah ke Cibeureum, Tegallega, Kota Bogor saat masa pandemi. 
          Tergantungnya di depan rim kayu jati asli Jepang, ramainya datang dan sekonnya berjuasa Jepang-Indonesia yang diterjemah oleh 
          Pak Ade dengan rasa.
        </p>
        <p className="text-gray-300">
          Setiap mangkuk, ramen disiapkan dengan bahan home made dan fresh setiap hari, tanpa stok lama. Lebih dari sekadar tempat 
          makan, RAMENRAMEiN menjadi wujud dari semangat, kerja sama, dan kecintaan terhadap cita rasa autentik Jepang.
        </p>
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <div className="relative w-full aspect-video">
              <Image
                src="/images/tentangkami/tempat_dulu.jpg"
                alt="RamenRamein 2014"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-center mt-2">2014</p>
          </div>
          <div>
            <div className="relative w-full aspect-video">
              <Image
                src="/images/tentangkami/tempat_sekarang.jpeg"
                alt="RamenRamein Sekarang"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-center mt-2">Sekarang</p>
          </div>
        </div>
      </div>
    </div>
  );
}
