"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BranchSelector from "@/components/BranchSelector";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SeatSelectorModal from "@/components/SeatSelectorModal";
import MenuSelectorModal from "@/components/MenuSelectorModal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import {
  getCurrentUser,
  createReservation,
  confirmReservation,
  savePendingReservation,
} from "@/src/api/api";
import { useRouter } from "next/navigation";

interface Dish {
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function BookingPage() {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState("");

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<
    { dish: Dish; quantity: number }[]
  >([]);

  const [notes, setNotes] = useState("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("pendingBooking");
    if (stored) {
      try {
        const data = JSON.parse(stored);

        if (data.branch) setSelectedBranch(data.branch);
        if (data.date) setSelectedDate(new Date(data.date));
        if (data.tables?.length)
          setSelectedSeat(data.tables.join(", "));
        if (data.menu_items?.length) {
          const fakeMenu = data.menu_items.map((title: string) => ({
            dish: { title, description: "", price: "", image: "" },
            quantity: 1,
          }));
          setSelectedMenu(fakeMenu);
        }
        if (data.notes) setNotes(data.notes);
      } catch {}
    }
  }, []);

  const branches = [
    "Атакент: улица Тимирязева, 42",
    "Мега центр: улица Макатаева, 127/1 / проспект Сейфуллина, 483",
    "Мега центр: улица Розыбакиева, 247",
  ];

  const parseSelectedTables = (seatDesc: string): string[] => {
    if (!seatDesc) return [];
    const beforeParen = seatDesc.split("(")[0].trim();
    if (!beforeParen) return [];
    return beforeParen.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const openError = (msg: string) => {
    setErrorMessage(msg);
    setIsErrorModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBranch) {
      openError("Выберите филиал.");
      return;
    }
    if (!selectedDate) {
      openError("Выберите дату.");
      return;
    }

    const tables = parseSelectedTables(selectedSeat);
    if (tables.length === 0) {
      openError("Выберите место.");
      return;
    }

    const user = await getCurrentUser();

    const payload = {
      branch: selectedBranch,
      date: formatDate(selectedDate),
      tables,
      guests: 2,
      notes,
      menu_items: selectedMenu.map((item) => item.dish.title),
    };

    if (!user) {
      localStorage.setItem("pendingBooking", JSON.stringify(payload));
      try {
        await savePendingReservation(payload);
      } catch {}

      openError("Создайте аккаунт, чтобы завершить бронирование.");
      router.push("/register");
      return;
    }

    const finalPayload = {
      ...payload,
      user_email: user.email,
    };

    try {
      const createRes = await createReservation(finalPayload);
      const reservation_id = createRes?.reservation_id;

      if (!reservation_id) {
        openError("Не удалось создать бронь.");
        return;
      }

      await confirmReservation(reservation_id);
      localStorage.removeItem("pendingBooking");

      setIsSuccessModalOpen(true);

      setSelectedSeat("");
      setSelectedDate(null);
      setSelectedBranch("");
      setSelectedMenu([]);
      setNotes("");
    } catch (err: any) {
      openError("Ошибка: " + (err.message || "unknown"));
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-white text-[#1F1F1F] font-[Unbounded] flex flex-col">
      <Header />

      <section className="flex-grow max-w-6xl mx-auto mt-[120px] mb-[100px] px-6 lg:px-0 grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-[#0B004B] text-white rounded-2xl p-12 shadow-xl flex flex-col justify-between h-[835px]">
          <div>
            <h1 className="text-3xl font-bold mb-2">Забронируйте столик</h1>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed">
              Выберите удобное время и место — и мы подготовим всё к вашему приезду.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <BranchSelector
                branches={branches}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
              />

              <div>
                <label className="text-sm mb-2 block">Дата</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="ДД.ММ.ГГГГ"
                  dateFormat="dd.MM.yyyy"
                  className="w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 placeholder-gray-400 backdrop-blur-sm"
                  calendarClassName="bg-white text-black rounded-lg shadow-lg p-2"
                  wrapperClassName="w-full"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Выбор места</label>
                <input
                  type="text"
                  readOnly
                  value={selectedSeat}
                  onClick={() => setIsSeatModalOpen(true)}
                  placeholder="Выберите место"
                  className="cursor-pointer w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Меню</label>
                <input
                  type="text"
                  readOnly
                  value={
                    selectedMenu.length > 0
                      ? `${selectedMenu.length} блюд выбрано`
                      : ""
                  }
                  placeholder="Выбрать меню"
                  onClick={() => setIsMenuModalOpen(true)}
                  className="cursor-pointer w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 placeholder-gray-400"
                />
              </div>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Пожелания / аллергия (если есть)"
                className="w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 placeholder-gray-400"
              />

              <button
                type="submit"
                className="bg-white text-[#0B004B] font-semibold py-2 rounded-md shadow-md hover:bg-gray-100 transition"
              >
                Подтвердить и оплатить
              </button>
            </form>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            После оплаты мы свяжемся с вами для подтверждения брони.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Image
              src="/atakent.jpg"
              alt="Атакент"
              width={500}
              height={250}
              className="rounded-lg object-cover w-full h-56"
            />
            <p className="text-sm mt-3 font-medium">
              1) Атакент: улица Тимирязева, 42
            </p>
          </div>

          <div>
            <Image
              src="/makataeva.jpg"
              alt="Мега центр Макатаева"
              width={500}
              height={250}
              className="rounded-lg object-cover w-full h-56"
            />
            <p className="text-sm mt-3 font-medium">
              2) Мега центр: улица Макатаева, 127/1 / проспект Сейфуллина, 483
            </p>
          </div>

          <div>
            <Image
              src="/rozybakieva.jpg"
              alt="Мега центр Розыбакиева"
              width={500}
              height={250}
              className="rounded-lg object-cover w-full h-56"
            />
            <p className="text-sm mt-3 font-medium">
              3) Мега центр: улица Розыбакиева, 247
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <SeatSelectorModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        onSelectSeat={(seat) => setSelectedSeat(seat)}
        branch={selectedBranch}
        date={selectedDate ? formatDate(selectedDate) : undefined}
      />

      <MenuSelectorModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSelectMenu={(items) => setSelectedMenu(items)}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/profile"); // ← теперь только в профиль
        }}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />
    </main>
  );
}
