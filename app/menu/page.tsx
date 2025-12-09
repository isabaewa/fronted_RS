"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const DishGrid = dynamic(() => import("@/components/DishGrid"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MenuPage() {
  const categories = ["Рамен", "Роллы", "Напитки", "Бабл-ти", "Десерты"];
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [showCategoryBar, setShowCategoryBar] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const currentScrollY = window.scrollY;

      // Появление/скрытие кнопки Наверх
      setShowTopBtn(currentScrollY > 300);

      // Авто-сокрытие панели категорий
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowCategoryBar(false); // скролл вниз
      } else {
        setShowCategoryBar(true); // скролл вверх
      }

      lastScrollY.current = currentScrollY;

      // Определяем активную категорию
      let currentCat = categories[0];
      categories.forEach((cat) => {
        const el = document.getElementById(cat);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top - 100 <= 0) currentCat = cat;
        }
      });
      setActiveCategory(currentCat);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 50) {
        // если курсор поднесен к верху экрана — показываем панель
        setShowCategoryBar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToCategory = (name: string) => {
    const el = document.getElementById(name);
    if (el) {
      const yOffset = -100; // отступ под фиксированный Header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative w-full min-h-screen bg-white text-[#1F1F1F] font-[Unbounded] flex flex-col">
      <Header />

      {/* Заголовок */}
      <section className="text-center mt-[100px] mb-[60px]">
        <h2 className="text-[#100147] text-[40px] font-semibold mb-3">
          НАШЕ МЕНЮ
        </h2>
        <p className="text-black/80 text-[14px] font-light">
          Меню, в котором встречаются традиции и вдохновение.
          <br />
          Выбирайте, что сделает ваш день вкуснее.
        </p>
      </section>

      {/* Панель категорий */}
      <div
        className={`fixed top-[100px] w-full flex justify-center gap-[35px] flex-wrap transition-transform duration-300 z-50 ${
          showCategoryBar ? "translate-y-0" : "-translate-y-[150px]"
        }`}
        style={{ background: "rgba(255,255,255,0.95)", padding: "10px 0" }}
      >
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => scrollToCategory(cat)}
            className={`w-[210px] h-[55px] border border-black font-medium text-[20px] leading-[25px]
              ${
                activeCategory === cat
                  ? "bg-[#100147] text-white"
                  : "bg-white text-[#1F1F1F] hover:bg-[#100147] hover:text-white"
              } transition shadow-md`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Сетка блюд */}
      <section className="flex justify-center flex-grow mt-[60px]">
        <div className="max-w-[1198px]">
          <DishGrid />
        </div>
      </section>

      {/* Кнопка Наверх */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-[50px] h-[50px] bg-[#100147] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1f005c] transition"
          title="Наверх"
        >
          ↑
        </button>
      )}

      <Footer />
    </main>
  );
}
