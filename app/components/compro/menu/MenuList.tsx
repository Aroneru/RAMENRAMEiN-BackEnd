import Image from "next/image";

interface MenuListProps {
  items: { name: string; desc: string; img: string }[];
}

export default function MenuList({ items }: MenuListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-12 px-6 justify-items-center">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-6 rounded-2xl shadow-xl text-left w-full max-w-md"
        >
          <div className="bg-[url('/images/wood-texture.jpg')] bg-cover bg-center rounded-xl overflow-hidden">
            <Image
              src={item.img}
              alt={`Foto ${item.name}`}
              width={500}
              height={350}
              className="object-cover w-full h-auto"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{item.name}</h2>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
