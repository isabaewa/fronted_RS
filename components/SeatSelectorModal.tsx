"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOccupied, reserveTables } from "@/src/api/api";

interface SeatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSeat: (seatDesc: string) => void;
  branch?: string;   // опционально
  date?: string;     // YYYY-MM-DD опционально
}

type TableDef = {
  id: string;
  seats: number;
};

export default function SeatSelectorModal({
  isOpen,
  onClose,
  onSelectSeat,
  branch,
  date,
}: SeatSelectorModalProps) {
  const BRAND = "#100147";

  const [guests, setGuests] = useState<number>(2);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [occupied, setOccupied] = useState<string[]>(["A3", "C1"]);

  // Твои столы
  const tables: TableDef[] = [
    { id: "L4-1", seats: 4 },
    { id: "C6-1", seats: 6 },
    { id: "R4-2", seats: 4 },

    { id: "L2-1", seats: 2 },
    { id: "C2-2", seats: 2 },
    { id: "R2-3", seats: 2 },
  ];

  // Загрузка занятых столов с backend при открытии и при смене branch/date
  useEffect(() => {
    if (!isOpen) return;

    // если branch/date заданы — запросим занятые
    if (branch && date) {
      getOccupied(branch, date)
        .then((res) => {
          if (res && Array.isArray(res.occupied)) {
            setOccupied(res.occupied);
          } else {
            setOccupied([]);
          }
        })
        .catch((e) => {
          console.error("getOccupied error:", e);
          // оставляем локальные значения occupied — не ломаем UI
        });
    }
  }, [isOpen, branch, date]);

  useEffect(() => {
    if (!isOpen) {
      setSelected([]);
      setGuests(2);
      setError(null);
    }
  }, [isOpen]);

  const toggleSelect = (id: string) => {
    if (occupied.includes(id)) return;
    setError(null);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalSeats = selected
    .map((id) => tables.find((t) => t.id === id)!.seats)
    .reduce((s, a) => s + a, 0);

  const confirm = () => {
    if (selected.length === 0) {
      setError("Выберите хотя бы один столик");
      return;
    }
    if (totalSeats < guests) {
      setError("Стол слишком маленький для данного числа гостей");
      return;
    }

    // POST на /api/reserve-tables для быстрого уведомления (не ломает ничего)
    reserveTables(selected, guests).catch((err) => {
      console.error("reserveTables api error:", err);
    });

    // помечаем локально занятые
    setOccupied((prev) => Array.from(new Set([...prev, ...selected])));
    onSelectSeat(`${selected.join(", ")} (итого ${totalSeats} мест)`);
    onClose();
    setSelected([]);
    setError(null);
  };

  if (!isOpen) return null;

  // Размеры столов
  const seatSize = 50;
  const getTableSize = (seats: number) => {
    if (seats === 2) return { width: seatSize * 2, height: seatSize * 1.2 };
    if (seats === 4) return { width: seatSize * 2, height: seatSize * 2 };
    if (seats === 6) return { width: seatSize * 3, height: seatSize * 2 };
    return { width: seatSize * 2, height: seatSize * 2 };
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full max-w-[95%] rounded-2xl shadow-2xl"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${BRAND}30` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#F7F9FC]">
              <div>
                <h3 className="text-lg font-semibold text-[#0B1222]">
                  Выберите столик
                </h3>
                <p className="text-sm text-[#3b4250]">
                  Реальная модель зала — столы пропорциональны количеству гостей.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#3b4250]">
                  Гостей:
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => {
                      const v = Number(e.target.value || 1);
                      setGuests(v < 1 ? 1 : v);
                      setError(null);
                    }}
                    className="ml-2 w-20 px-2 py-1 rounded-md border border-[#e6e9f0] text-sm"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#0B1222] hover:bg-[#00000008]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex gap-4 px-4 py-6 bg-white overflow-x-auto">
              {/* Левая часть — легенда */}
              <div className="w-36 flex-shrink-0">
                <div className="mb-4 text-sm text-[#253043]">Подсказки</div>

                <div className="space-y-2 text-sm text-[#394958]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ background: BRAND }}
                    />
                    Свободный
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-[#BEBEBE]" />
                    Занятый
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-[#C4A46A]" />
                    Выбранный
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-[#fca5a5]" />
                    Мало мест
                  </div>
                </div>
              </div>

              {/* 🟦 ЗАЛ — GRID */}
              <div className="flex-1 relative">
                <div
                  className="mx-auto bg-[#F3F6FB] rounded-xl border grid grid-cols-3 gap-x-12 gap-y-10 justify-items-center items-center"
                  style={{
                    width: 600,
                    padding: "40px 20px",
                    borderColor: `${BRAND}20`,
                  }}
                >
                  {/* Столы */}
                  {tables.map((t, i) => {
                    const isOcc = occupied.includes(t.id);
                    const isSel = selected.includes(t.id);
                    const isTooSmall = t.seats < guests;

                    const { width, height } = getTableSize(t.seats);

                    let bg = BRAND;
                    let textColor = "#fff";

                    if (isOcc) {
                      bg = "#BEBEBE";
                      textColor = "#333";
                    } else if (isSel) {
                      bg = "#C4A46A";
                      textColor = "#0B0B0B";
                    } else if (isTooSmall) {
                      bg = "#FCA5A5";
                      textColor = "#2b2b2b";
                    }

                    return (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.06 * i,
                          type: "spring",
                          stiffness: 160,
                        }}
                        onClick={() => !isOcc && toggleSelect(t.id)}
                        className="flex flex-col items-center justify-center rounded-xl shadow-md"
                        style={{
                          width,
                          height,
                          background: bg,
                          color: textColor,
                          cursor: isOcc ? "not-allowed" : "pointer",
                        }}
                      >
                        <div className="font-bold">{t.id}</div>
                        <div className="text-[11px] opacity-80">
                          {t.seats} мест
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Bottom controls */}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-[#253043]">
                      Вы выбрали:{" "}
                      <span className="font-semibold">
                        {selected.join(", ") || "—"}
                      </span>
                    </div>
                    <div className="text-xs text-[#556275] mt-1">
                      Общая вместимость: <b>{totalSeats}</b> мест
                    </div>
                  </div>

                  <div className="text-right">
                    {error && (
                      <div className="text-sm text-red-600 mb-1">{error}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSelected([]);
                          setError(null);
                        }}
                        className="px-3 py-2 text-sm rounded-md border border-[#d6dbe8] bg-white"
                      >
                        Сбросить
                      </button>
                      <button
                        onClick={confirm}
                        className="px-4 py-2 rounded-md text-sm font-semibold"
                        style={{
                          background: selected.length ? BRAND : "#C9CED6",
                          color: selected.length ? "#fff" : "#666",
                        }}
                      >
                        Подтвердить ({selected.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
