"use client";
import Image from "next/image";

interface DishCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function DishCard({ title, description, price, image }: DishCardProps) {
  return (
    <div className="relative w-[350px] h-[441px] bg-white shadow-md overflow-hidden rounded-xl">
      {/* Фото блюда */}
      <div className="relative w-[350px] h-[230px] bg-[#100147]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="350px"
          unoptimized // отключаем оптимизацию Next.js для локального Flask
        />
        {/* Цена */}
        <div className="absolute right-[19px] top-[18px] w-[114px] h-[41px] bg-white flex items-center justify-center">
          <span className="font-[Unbounded] font-semibold text-[20px] text-black">
            {price} ₸
          </span>
        </div>
      </div>

      {/* Разделительная линия */}
      <div className="absolute top-[283px] left-0 w-[350px] h-[1px] bg-black/80" />

      {/* Название */}
      <div className="absolute top-[240px] left-0 w-[350px] h-[31px] flex items-center justify-center">
        <h3 className="font-[Unbounded] font-bold text-[20px] text-center text-black/80">
          {title}
        </h3>
      </div>

      {/* Описание */}
      <div className="absolute top-[299px] left-0 w-[350px] h-[78px] px-3 text-center">
        <p className="font-[Unbounded] font-light text-[14px] leading-[20px] text-black/80">
          {description}
        </p>
      </div>
    </div>
  );
}
