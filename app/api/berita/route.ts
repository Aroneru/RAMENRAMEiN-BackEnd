import { NextResponse } from "next/server";

// Temporary: Data berita (akan diganti dengan database)
// Ketika admin menambahkan berita dari dashboard, data akan disimpan di database
// dan API ini akan mengambil dari database
const beritaData = [
  {
    id: 1,
    judul: "Hampers Lebaran Spesial dari RAMENRAMEiN!!!",
    deskripsi: "Edisi hampers lebaran tahun ini masih sama, tidak kurang, tidak lebih tapi pas di kantong.",
    tanggal: "1 Oktober 2025",
    gambar: "/images/berita/poster_hampers.jpeg",
  },
  {
    id: 2,
    judul: "Grand Opening Cabang Baru RAMENRAMEiN",
    deskripsi: "Kami dengan bangga mengumumkan pembukaan cabang baru RAMENRAMEiN di lokasi strategis.",
    tanggal: "15 Oktober 2025",
    gambar: "/images/berita/grand_opening.jpg",
  },
];

// GET /api/berita - Get all berita
export async function GET() {
  try {
    // TODO: Ganti dengan fetch dari database
    // const beritaList = await db.berita.findMany();
    
    return NextResponse.json({
      success: true,
      data: beritaData,
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

// POST /api/berita - Create new berita (untuk dashboard admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Validasi data
    // TODO: Simpan ke database
    // const newBerita = await db.berita.create({ data: body });
    
    // Temporary: tambahkan ke array (akan diganti dengan database)
    const newId = beritaData.length > 0 
      ? Math.max(...beritaData.map(b => b.id)) + 1 
      : 1;
    
    const newBerita = {
      id: newId,
      ...body,
    };
    
    beritaData.push(newBerita);
    
    return NextResponse.json({
      success: true,
      data: newBerita,
      message: "Berita berhasil ditambahkan",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating berita:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan berita",
      },
      { status: 500 }
    );
  }
}
