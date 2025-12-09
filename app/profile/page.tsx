"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 API URL из .env.production / Vercel env
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${API}/auth/user`, { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          window.location.href = "/account";
          return;
        }

        if (!mounted) return;
        setUser(res.data.user);

        const pendingLocal = localStorage.getItem("pendingBooking");

        const tryClaim = async () => {
          try {
            if (pendingLocal) {
              await axios.post(
                `${API}/pending/claim`,
                { pending: JSON.parse(pendingLocal) },
                { withCredentials: true }
              );
              localStorage.removeItem("pendingBooking");
            } else {
              await axios.post(
                `${API}/pending/claim`,
                {},
                { withCredentials: true }
              );
            }
          } catch {}
        };

        tryClaim().then(() => {
          axios
            .get(`${API}/user/bookings`, { withCredentials: true })
            .then((r) => mounted && setBookings(r.data.bookings || []))
            .finally(() => mounted && setLoading(false));
        });
      })
      .catch(() => {
        window.location.href = "/account";
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await axios.post(
      `${API}/logout`,
      {},
      { withCredentials: true }
    );
    window.location.href = "/";
  };

  if (loading) return <p>Загрузка...</p>;
  if (!user) return null;

  const today = new Date();

  const isPast = (dateStr: string) => {
    const d = new Date(dateStr);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const daysUntil = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const cancelBooking = async (id: number) => {
    console.log("Attempting to cancel reservation with ID:", id);

    if (typeof id !== "number" || id <= 0 || !id) {
      console.error("Cancellation failed: Invalid ID:", id);
      alert("Невозможно отменить: неверный ID.");
      return;
    }

    try {
      await axios.post(
        `${API}/reservation/cancel`,
        { id: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error(err);
      alert("Ошибка отмены бронирования.");
    }
  };

  return (
    <main className="relative min-h-screen bg-white font-[Unbounded] px-4 py-10 flex flex-col items-center">

      {/* LEFT DECOR */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-[280px] pointer-events-none">
        <div className="relative h-full w-full">
          <img
            src="/matcha-bubble-tea.png"
            alt="matcha"
            className="absolute left-[90px] top-[20px] w-[260px] transform rotate-[330deg] animate-[float_6s_ease-in-out_infinite] opacity-95"
          />
          <img
            src="/ramen.png"
            alt="ramen"
            className="absolute left-[10px] top-[260px] w-[228px] transform rotate-[15deg] animate-[float_6s_ease-in-out_infinite] opacity-95"
          />
          <img
            src="/mochi.png"
            alt="mochi"
            className="absolute left-[105px] top-[475px] w-[220px] transform animate-[float_6s_ease-in-out_infinite] opacity-95"
          />
        </div>
      </div>

      {/* RIGHT DECOR */}
      <img
        src="/rolls_profile.png"
        alt="rolls"
        className="hidden lg:block absolute right-0 top-[220px] w-[360px] animate-[float_6s_ease-in-out_infinite] opacity-90 pointer-events-none"
      />

      <img
        src="/pancake.png"
        alt="pancake"
        className="hidden lg:block absolute right-20 top-[65px] w-[125px] transform rotate-[18deg] animate-[float_6s_ease-in-out_infinite] opacity-90 pointer-events-none"
      />

      {/* NAV */}
      <nav className="absolute top-5 right-10 flex gap-6 text-sm text-[#0E0042]">
        <Link href="/" className="hover:underline">О нас</Link>
        <Link href="/menu" className="hover:underline">Меню</Link>
        <Link href="/booking" className="hover:underline">Бронирование</Link>
      </nav>

      {/* HEADER */}
      <div className="w-full max-w-3xl mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0042]">
          Здравствуйте, <span className="font-bold">{user.name}</span> 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Мы рады видеть вас снова в Roll & Soul!
        </p>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* PERSONAL INFO */}
        <section className="bg-[#0D0149] text-white p-7 rounded-[5px] shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>

          <div className="space-y-1">
            <p className="text-gray-300 text-sm">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
        </section>

        {/* BOOKINGS */}
        <section className="bg-[#0D0149] text-white p-7 rounded-[5px] shadow-xl">
          <h2 className="text-xl font-semibold mb-4">История бронирований</h2>

          {bookings.length === 0 && (
            <p className="text-gray-300 text-[15px]">
              У вас ещё нет бронирований.
            </p>
          )}

          {bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b, i) => {
                const past = isPast(b.date);
                const cancelled = b.status === "cancelled";
                const days = daysUntil(b.date);

                let bg = past ? "#d1d5db" : "#86efac";
                let text = past ? "#374151" : "#065f46";

                if (cancelled) {
                  bg = "#f8d7da"; // мягкий красный
                  text = "#7f1d1d";
                }

                return (
                  <div
                    key={i}
                    className="rounded-[5px] p-4 flex flex-col gap-2 border border-white/20"
                    style={{
                      background: bg,
                      color: text,
                      fontWeight: 600,
                    }}
                  >
                    <p className="text-[16px]">
                      📅 {b.date} | {b.branch}
                    </p>

                    {!past && !cancelled && (
                      <p className="text-[14px] opacity-80">
                        ⏳ через {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"}
                      </p>
                    )}

                    <p className="text-[16px]">👥 {b.persons} персоны</p>

                    <p className="text-[16px]">
                      🍱 Меню: {Array.isArray(b.menu) ? b.menu.join(", ") : b.menu}
                    </p>

                    {/* CANCEL BUTTON */}
                    {!past && !cancelled && (
                      // 🔥 ВЫЗОВ: Убедитесь, что b.id не undefined!
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="border border-black mt-2 py-2 px-4 bg-gray-300 text-gray-800 hover:bg-red-300 transition w-fit"
                      >
                        Отменить бронь
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-10 px-10 py-3 bg-[#0D0149] text-white rounded-[5px] hover:bg-[#1A0075] transition shadow-lg"
      >
        Выйти из аккаунта
      </button>
    </main>
  );
}
