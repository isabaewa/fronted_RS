"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email"); // <-- email из URL

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-[#0E0042]">
        <div className="text-center">
          <p className="text-lg">Ошибка: email не найден.</p>
          <button
            onClick={() => router.push("/register")}
            className="mt-4 bg-white text-[#0E0042] px-4 py-2 rounded-lg"
          >
            Вернуться к регистрации
          </button>
        </div>
      </main>
    );
  }

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Неверный код");
        return;
      }

      setSuccess("Email успешно подтвержден!");
      setTimeout(() => router.push("/account"), 1000);
    } catch {
      setError("Ошибка соединения с сервером");
    }
  };

  // отправить код заново
  const handleResend = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка отправки");
        return;
      }

      setSuccess("Код отправлен повторно!");
    } catch {
      setError("Ошибка соединения");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0E0042] font-[Unbounded] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-[#0E0042] mb-4">Подтверждение аккаунта</h1>

        <p className="text-sm text-gray-500 mb-4">
          Мы отправили код подтверждения на <b>{email}</b>
        </p>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-sm">{success}</p>}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
          maxLength={6}
          placeholder="Введите код"
          className="w-full text-center border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#0E0042] mb-6"
        />

        <button
          onClick={handleVerify}
          className="bg-[#0E0042] text-white py-3 rounded-lg w-full hover:bg-[#1A0075] transition"
        >
          Подтвердить
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Не получили код?{" "}
          <button onClick={handleResend} className="text-[#0E0042] font-medium hover:underline">
            Отправить снова
          </button>
        </p>
      </div>
    </main>
  );
}
