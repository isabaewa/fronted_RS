"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

const Header: React.FC = () => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => setAuth(res.data.authenticated))
      .catch(() => setAuth(false));
  }, []);

  return (
    <header className="w-full h-[100px] flex items-center justify-between px-[70px]">
      {/* Левая часть — логотип + название */}
      <Link
        href="/"
        className="flex items-center gap-[28px] hover:opacity-90 transition"
      >
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center">
          <Image src="/логоRS.png" alt="Roll & Soul" width={60} height={60} />
        </div>
        <span className="text-[#100147] text-[20px] font-medium leading-[25px]">
          Roll & Soul
        </span>
      </Link>

      {/* Центральное меню */}
      <nav className="flex items-center gap-[12px] text-[#1F1F1F] text-[16px] font-medium">
        <Link href="/" className="hover:text-[#100147] transition">
          О нас
        </Link>
        <Link href="/menu" className="hover:text-[#100147] transition">
          Меню
        </Link>
        <Link href="/booking" className="hover:text-[#100147] transition">
          Бронирование
        </Link>
      </nav>

      {/* Кнопка справа */}
      <Link
        href={auth ? "/profile" : "/account"}
        className="w-[200px] h-[45px] bg-[#100147] text-white flex items-center justify-center rounded-none hover:bg-[#1c0f4b] transition"
      >
        Аккаунт
      </Link>
    </header>
  );
};

export default Header;
