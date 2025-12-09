"use client";
import { useEffect, useState, useRef } from "react";
import DishCard from "./DishCard";

interface Dish {
  name: string;
  price: number;
  desc: string;
  img: string;
}

interface Category {
  category: string;
  items: Dish[];
}

export default function DishGrid() {
  const [menu, setMenu] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`)
    .then((res) => {
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      return res.json();
    })
    .then((data) => setMenu(data))
    .catch((err) => {
      console.error("Ошибка загрузки меню:", err);
      setError("Не удалось загрузить меню 😢");
    });
}, []);


  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (menu.length === 0) {
    return <p className="text-center mt-10 text-gray-500">Загрузка меню...</p>;
  }

  return (
    <div className="w-full flex flex-col items-center pb-[100px]">
      <div className="w-[1198px] space-y-[120px]">
        {menu.map((category, i) => (
          <section
            key={i}
            id={category.category}
            ref={(el) => {
              refs.current[category.category] = el;
            }}
          >
            <h2 className="text-[#100147] text-3xl font-semibold mb-10 text-center">
              {category.category}
            </h2>

            <div className="grid grid-cols-3 gap-x-[74px] gap-y-[30px] justify-items-center">
              {category.items.map((dish, j) => (
                <DishCard
                  key={j}
                  title={dish.name}
                  description={dish.desc}
                  price={dish.price}
                  image={`${dish.img}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
