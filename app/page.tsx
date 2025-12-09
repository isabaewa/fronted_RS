"use client"; 
// Указывает, что компонент рендерится на клиенте (Next.js 13+)

import Image from "next/image";
import Link from "next/link"; 
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CafeMap from "@/components/CafeMap";

// Главная страница
export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen bg-white text-[#1F1F1F] font-[Unbounded]">
      
      {/* ШАПКА САЙТА */}
      <Header />

      {/* HERO-СЕКЦИЯ (основный приветственный блок) */}
      <section className="flex flex-col items-center text-center mt-[140px]">
        
        {/* Главный заголовок */}
        <h2 className="text-[#100147] font-semibold text-[40px] leading-[75px] max-w-[1096px]">
          Сделано с душой — почувствуй вкус Азии
        </h2>

        {/* Описание */}
        <p className="mt-[40px] text-[14px] font-light text-black max-w-[892px] leading-[20px]">
          Добро пожаловать в <span className="font-semibold">Roll & Soul</span> — уютное азиатское кафе, где каждая деталь сделана с душой.
          Мы готовим рамен, роллы, бабл-ти и десерты по рецептам, вдохновлённым уличной кухней Азии.
        </p>

        {/* КНОПКИ */}
        <div className="flex gap-[30px] mt-[50px]">
          
          {/* Перейти в меню */}
          <Link
            href="/menu"
            className="border border-black w-[210px] h-[55px] flex items-center justify-center text-[16px] font-normal text-[#1F1F1F] hover:bg-[#f7f7f7] transition shadow-md"
          >
            Посмотреть меню
          </Link>

          {/* Страница бронирования */}
          <Link
            href="/booking"
            className="bg-[#100147] border border-black text-white w-[210px] h-[55px] flex items-center justify-center text-[16px] font-normal hover:bg-[#1c0f4b] transition shadow-md"
          >
            Забронировать
          </Link>

        </div>
      </section>

      {/* БЛОК С АДРЕСАМИ (фон + черное окно + карта) */}
      <section className="relative mt-[120px] w-full h-[486px]">
        
        {/* Фоновая картинка секции */}
        <Image
          src="/cafe-bg.jpg"
          alt="Интерьер кафе"
          fill
          className="object-cover"
        />

        {/* Тёмный блок с текстом адресов */}
        <div className="absolute left-[29px] top-[39px] w-[900px] h-[405px] bg-black/80 p-[40px] z-10">
          <h3 className="text-white text-[18px] font-medium mb-6">Где нас найти?</h3>

          {/* Текст адресов (используется `white-space: pre-line`, чтобы сохранять переносы) */}
          <p className="text-white text-[18px] font-normal leading-[20px] whitespace-pre-line">
            {`Город: Алматы

1) Атакент: улица Тимирязева, 42

2) Мега центр: улица Макатаева, 127/1 / проспект Сейфуллина, 483

3) Мега центр: улица Розыбакиева, 247`}
          </p>
        </div>

        {/* Карта справа — отдельный компонент CafeMap */}
        <div className="absolute top-[40px] right-[30px] w-[500px] h-[405px] overflow-hidden shadow-lg z-20 transition-all duration-300 ">
          <CafeMap />
        </div>
      </section>

      {/* ПОДВАЛ САЙТА */}
      <Footer />

    </main>
  );
}
