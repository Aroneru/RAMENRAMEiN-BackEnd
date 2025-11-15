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
• Kemasan besek bambu yang ramah lingkungan dan menampilkan sentuhan elegan khas RAMENRAMEiN

Seluruh bahan diolah dengan standar higienis tinggi serta dari Miso Aka dan Mie yang juga cita rasa dan kualitas yang menjadi ciri khas kami.

Hampers ini ditawarkan dengan harga Rp 98.000 (belum termasuk ongkos kirim). Pilihan yang tepat untuk berbagi momen hangat dan unik di hari raya.`,
    tanggal: "1 Oktober 2025",
    gambar: "/images/berita/poster_hampers.jpeg",
  },
  {
    id: 2,
    kategori: "event",
    judul: "Papan Nama Baru RAMENRAMEiN",
    deskripsi: `Papan nama baru RAMENRAMEiN menandai babak baru dalam perjalanan kami.

Dengan desain yang lebih modern namun tetap mempertahankan esensi street food Jepang, papan nama ini mencerminkan komitmen kami untuk terus berkembang sambil menjaga cita rasa autentik yang telah menjadi ciri khas kami sejak awal.
Kami mengundang semua pelanggan setia dan pengunjung baru untuk datang dan melihat sendiri perubahan ini. Mari rayakan bersama kami babak baru RAMENRAMEiN dengan suasana yang segar dan semangat yang tak pernah padam.

Kami tunggu kehadiran Anda di RAMENRAMEiN dengan papan nama baru kami yang penuh semangat ini!`,
    tanggal: "15 Oktober 2025",
    gambar: "/images/berita/papan_nama_baru.jpeg",
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
