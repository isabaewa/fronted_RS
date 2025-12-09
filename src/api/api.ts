// frontend/src/api/api.ts 
export const API_URL = "https://roul-soul.onrender.com";

// Теперь occupied возвращается как { [tableId]: number }
export async function getOccupied(branch: string, date: string) {
  const url = `${API_URL}/occupied?branch=${encodeURIComponent(branch)}&date=${encodeURIComponent(date)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`getOccupied failed: ${res.status}`);
  const data = await res.json(); // { occupied: ["L4-1", "L4-1", "C6-1", ...] }

  // Преобразуем массив в объект { tableId: занятое количество мест }
  const occupied: Record<string, number> = {};
  if (Array.isArray(data.occupied)) {
    data.occupied.forEach((id: string) => {
      occupied[id] = (occupied[id] || 0) + 1;
    });
  }

  return { occupied };
}

export async function reserveTables(tables: string[], guests: number) {
  const res = await fetch(`${API_URL}/api/reserve-tables`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tables, guests })
  });
  if (!res.ok) throw new Error("reserveTables failed");
  return res.json();
}

export async function createReservation(payload: {
  user_email: string,
  branch: string,
  date: string,    // YYYY-MM-DD
  tables: string[],
  guests: number,
  notes?: string,
  menu_items?: string[]
}) {
  const res = await fetch(`${API_URL}/reservation`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'unknown'}));
    throw new Error(err.error || 'createReservation failed');
  }
  return res.json(); // { success: true, reservation_id: ... }
}

export async function confirmReservation(reservation_id: number) {
  const res = await fetch(`${API_URL}/reservation/confirm`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservation_id }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Confirm reservation error:", text);
    throw new Error("Failed to confirm reservation: " + text);
  }

  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/user`, {
    credentials: "include"
  });
  if (!res.ok) return null;
  const j = await res.json();
  if (!j.authenticated) return null;
  return j.user; // { id, name, email }
}

// --- Pending reservation helpers (local only) ---
export function savePendingReservation(data: {
  branch: string;
  date: string;
  tables: string[];
  guests: number;
  notes?: string;
  menu_items?: string[];
}) {
  if (typeof window !== "undefined") {
    localStorage.setItem("pending_reservation", JSON.stringify(data));
  }
}

export function loadPendingReservation() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("pending_reservation");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function clearPendingReservation() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pending_reservation");
  }
}
