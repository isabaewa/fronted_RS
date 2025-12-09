"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function AccountPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 👇 БЕРЁМ API URL из .env.production (или .env.local)
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  // -----------------------------
  // LOGIN HANDLER
  // -----------------------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/login/email`, {
        method: "POST",
        credentials: "include", // важно для session cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let errText = "Неверный email или пароль";
        try {
          const errJson = await res.json();
          if (errJson?.error) errText = errJson.error;
        } catch {}
        setError(errText);
        return;
      }

      const data = await res.json();
      console.log("Login success:", data);

      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      setError("Ошибка соединения с сервером");
    }
  };

  // -----------------------------
  // GOOGLE LOGIN HANDLER
  // -----------------------------
  const handleGoogleLogin = () => {
    // 🔥 теперь Google login тоже через бэкенд Render
    window.location.href = `${API}/login/google`;
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0E0042] font-[Unbounded] px-4">
      <div className="flex flex-col lg:flex-row w-[1100px] max-w-[95%] bg-[#0E0042] rounded-[20px] overflow-hidden shadow-2xl py-10">
        {/* Левая часть — форма */}
        <div className="lg:w-1/2 flex items-center justify-center bg-white/95 rounded-[10px] px-6 py-10">
          <div className="w-[80%] max-w-[380px] flex flex-col justify-center">
            <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition">
              <Image src="/логоRS.png" alt="Roll & Soul" width={45} height={45} className="rounded-full" />
              <span className="text-[#0E0042] text-lg font-semibold">Roll & Soul</span>
            </Link>

            <h1 className="text-[36px] font-semibold text-[#0E0042] mb-3">Вход в аккаунт</h1>

            <p className="text-[14px] text-[#5C5C5C] leading-[25px] mb-8 font-light">
              Мы рады вас видеть! Войдите, чтобы забронировать столик.
            </p>

            {/* Ошибка */}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

            {/* Форма: НЕЗАБЫТЬ - onSubmit установлен здесь */}
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="border border-[#BDBDBD] rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E0042]"
                required
              />

              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="border border-[#BDBDBD] rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E0042]"
                required
              />

              <button
                type="submit"
                className="bg-[#0E0042] text-white py-3 rounded-[10px] mt-2 shadow-md hover:bg-[#1A0075] transition"
              >
                Войти
              </button>

              <div className="text-center text-sm mt-3">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-[#0E0042] hover:underline">
                  Создать
                </Link>
              </div>

              <div className="text-center text-[16px] text-[#1F1F1F]/50 my-2">или</div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 border border-[#BDBDBD] rounded-[10px] py-[10px] hover:bg-gray-50 transition w-full"
              >
                <Image src="/google-icon.png" alt="Google" width={35} height={35} />
                <span className="text-[16px] text-black font-medium opacity-50">Продолжить с Google</span>
              </button>
            </form>
          </div>
        </div>

        {/* Правая часть */}
        <div className="lg:w-1/2 relative flex items-center justify-center text-white bg-[#0E0042] py-10">
          <Image src="/sushi.png" alt="Sushi" width={480} height={500} className="object-contain drop-shadow-2xl" />

          <nav className="absolute top-5 right-10 flex gap-6 text-sm text-white">
            <Link href="/" className="hover:underline">О нас</Link>
            <Link href="/menu" className="hover:underline">Меню</Link>
            <Link href="/booking" className="hover:underline">Бронирование</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
