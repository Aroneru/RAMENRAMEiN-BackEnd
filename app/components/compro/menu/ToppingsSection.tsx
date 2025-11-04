import Image from "next/image";

interface ToppingProps {
  toppings: { name: string; img: string }[];
}

export default function ToppingsSection({ toppings }: ToppingProps) {
  return (
    <>
      <div className="flex justify-center mt-16">
        <div
          className="h-px bg-[#F98582]"
          style={{ width: "1284px", maxWidth: "90%" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-center text-2xl font-bold mb-10">TAMBAH TOPPING</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
          {toppings.map((item, idx) => (
            <div
              key={idx}
            >
              <Image
                src={item.img}
                alt={`Foto ${item.name}`}
                width={150}
                height={150}
                className="rounded-md object-cover aspect-square"
              />
              <h3 className="mt-4 font-semibold">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
