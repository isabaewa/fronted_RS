"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [step, setStep] = useState<1 | 2>(1); // <-- новый шаг
  const [code, setCode] = useState<string>(""); // <-- ввод кода

  // ----------------------------------------------------
  // STEP 1 — РЕГИСТРАЦИЯ (отправляет email-код)
  // ----------------------------------------------------
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      // успешная регистрация — ждёт подтверждение email
      window.location.href = `/verify?email=${email}`;
    } catch (err) {
      console.error(err);
      setError("Ошибка соединения с сервером");
    }
  };

  // ----------------------------------------------------
  // STEP 2 — ПОДТВЕРЖДЕНИЕ EMAIL (код из почты)
  // ----------------------------------------------------
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Неверный код");
        return;
      }

      setSuccess("Email подтвержден! Теперь можете войти.");
      setTimeout(() => (window.location.href = "/account"), 1000);
    } catch (err) {
      console.error(err);
      setError("Ошибка соединения с сервером");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "${process.env.NEXT_PUBLIC_API_URL}/login/google";
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0E0042] font-[Unbounded] px-4">
      <div className="flex flex-col lg:flex-row w-[1100px] max-w-[95%] bg-[#0E0042] rounded-[20px] overflow-hidden shadow-2xl py-10">

        {/* LEFT: FORM */}
        <div className="lg:w-1/2 flex items-center justify-center bg-white/95 rounded-[10px] px-6 py-10">
          <div className="w-[80%] max-w-[380px] flex flex-col justify-center">

            <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition">
              <Image src="/логоRS.png" alt="Roll & Soul" width={45} height={45} priority className="rounded-full" />
              <span className="text-[#0E0042] text-lg font-semibold">Roll & Soul</span>
            </Link>

            <h1 className="text-[36px] font-semibold text-[#0E0042] mb-3">
              {step === 1 ? "Регистрация" : "Подтверждение email"}
            </h1>

            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2">{success}</div>}

            {step === 1 && (
              <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)}
                       className="border border-[#BDBDBD] rounded-[10px] px-4 py-3" required />

                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="border border-[#BDBDBD] rounded-[10px] px-4 py-3" required />

                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
                       className="border border-[#BDBDBD] rounded-[10px] px-4 py-3" required />

                <input type="password" placeholder="Подтвердите пароль" value={password2}
                       onChange={(e) => setPassword2(e.target.value)}
                       className="border border-[#BDBDBD] rounded-[10px] px-4 py-3" required />

                <button type="submit"
                        className="bg-[#0E0042] text-white py-3 rounded-[10px] mt-2 shadow-md hover:bg-[#1A0075] transition">
                  Зарегистрироваться
                </button>

                <div className="text-center text-sm mt-3">
                  Уже есть аккаунт?{" "}
                  <Link href="/account" className="text-[#0E0042] hover:underline">Войти</Link>
                </div>

                <div className="text-center text-[16px] text-[#1F1F1F]/50 my-2">или</div>

                <button type="button" onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-2 border border-[#BDBDBD] rounded-[10px] py-[10px] hover:bg-gray-50 transition w-full">
                  <Image src="/google-icon.png" alt="Google" width={35} height={35} priority />
                  <span className="text-[16px] text-black font-medium opacity-50">Продолжить с Google</span>
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="flex flex-col gap-4" onSubmit={handleVerify}>
                <input
                  type="text"
                  placeholder="Код из email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-[#BDBDBD] rounded-[10px] px-4 py-3"
                  required
                />

                <button type="submit"
                        className="bg-[#0E0042] text-white py-3 rounded-[10px] mt-2 shadow-md hover:bg-[#1A0075] transition">
                  Подтвердить email
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
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
