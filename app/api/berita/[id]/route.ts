import { NextResponse } from "next/server";

// Temporary: Data berita (akan diganti dengan database)
const beritaData = [
  {
    id: 1,
    kategori: "general",
    judul: "Hampers Lebaran Spesial dari RAMENRAMEiN!!!",
    deskripsi: `Lebaran tahun ini, RamenRamein menghadirkan sesuatu yang istimewa. Kami meracik Hampers Lebaran berisi kehangatan dan cita rasa ramen Jepang yang dapat dibagikan untuk keluarga, teman, atau rekan terdekat.

Dalam satu paket hampers, pelanggan akan mendapatkan:
• 3 porsi ramen spesial dengan pilihan kuah Miso, Curry, atau kombinasi keduanya
• Kartu ucapan personal yang dapat disesuaikan dengan nama penerima
• Bonus berupa aksesoris makan yang dapat digunakan kembali
• Kemasan besek bambu yang ramah lingkungan dan menampilkan sentuhan elegan khas RamenRamein

Seluruh bahan diolah dengan standar higienis tinggi serta dari Miso Aka dan Mie yang juga cita rasa dan kualitas yang menjadi ciri khas kami.

Hampers ini ditawarkan dengan harga Rp 98.000 (belum termasuk ongkos kirim). Pilihan yang tepat untuk berbagi momen hangat dan unik di hari raya.`,
    tanggal: "1 Oktober 2025",
    gambar: "/images/berita/poster_hampers.jpeg",
  },
  {
    id: 2,
    kategori: "event",
    judul: "Grand Opening Cabang Baru RAMENRAMEiN",
    deskripsi: `Kami dengan bangga mengumumkan pembukaan cabang baru RAMENRAMEiN di lokasi strategis yang lebih dekat dengan pelanggan setia kami.

Cabang baru ini hadir dengan konsep yang lebih modern dan nyaman, tetap dengan cita rasa ramen autentik yang menjadi ciri khas RAMENRAMEiN. Kami telah menyiapkan berbagai fasilitas terbaru untuk memberikan pengalaman terbaik bagi setiap pelanggan.

Fasilitas baru yang tersedia:
• Ruang makan yang lebih luas dan nyaman
• Area parkir yang lebih luas
• Sistem pemesanan yang lebih cepat dan efisien
• Menu spesial pembukaan dengan harga khusus

Kami mengundang Anda untuk merasakan pengalaman ramen terbaik di cabang baru kami. Grand opening akan diadakan pada tanggal 15 Oktober 2025 dengan berbagai acara menarik dan diskon spesial untuk pelanggan pertama.

Tunggu apa lagi? Mari rasakan kehangatan ramen autentik RAMENRAMEiN di cabang baru kami!`,
    tanggal: "15 Oktober 2025",
    gambar: "/images/berita/hampers-lebaran.jpg",
  },
];

// GET /api/berita/[id] - Get berita by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beritaId = parseInt(id);
    
    // TODO: Ganti dengan fetch dari database
    // const berita = await db.berita.findUnique({ where: { id: beritaId } });
    
    const berita = beritaData.find((b) => b.id === beritaId);
    
    if (!berita) {
      return NextResponse.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: berita,
    });
  } catch (error) {
    console.error("Error fetching berita:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data berita",
      },
      { status: 500 }
    );
  }
}

// PUT /api/berita/[id] - Update berita (untuk dashboard admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beritaId = parseInt(id);
    const body = await request.json();
    
    // TODO: Update di database
    // const updatedBerita = await db.berita.update({
    //   where: { id: beritaId },
    //   data: body,
    // });
    
    const index = beritaData.findIndex((b) => b.id === beritaId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }
    
    beritaData[index] = { ...beritaData[index], ...body };
    
    return NextResponse.json({
      success: true,
      data: beritaData[index],
      message: "Berita berhasil diupdate",
    });
  } catch (error) {
    console.error("Error updating berita:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupdate berita",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/berita/[id] - Delete berita (untuk dashboard admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beritaId = parseInt(id);
    
    // TODO: Delete dari database
    // await db.berita.delete({ where: { id: beritaId } });
    
    const index = beritaData.findIndex((b) => b.id === beritaId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }
    
    beritaData.splice(index, 1);
    
    return NextResponse.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting berita:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus berita",
      },
      { status: 500 }
    );
  }
}
