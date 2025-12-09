"use client";

import { useState, useEffect } from "react";
import DishCard from "./DishCard";
import CartPopup from "./CartPopup";

/* -------------------- Типы для фронтенда -------------------- */

interface Dish {
  title: string;
  description: string;
  price: string;
  image: string;
}

interface Category {
  name: string;
  dishes: Dish[];
}

interface MenuSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: (selectedDishes: { dish: Dish; quantity: number }[]) => void;
}

/* -------------------- Типы для backend ответа -------------------- */

interface BackendDish {
  name: string;
  desc: string;
  price: number;
  img: string;
}

interface BackendCategory {
  category: string;
  items: BackendDish[];
}

/* -------------------------------------------------------------- */

export default function MenuSelectorModal({
  isOpen,
  onClose,
  onSelectMenu
}: MenuSelectorModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Record<string, { dish: Dish; quantity: number }>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------ Загрузка меню с сервера ------------------ */

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch("http://localhost:5000/api/menu")
      .then(res => res.json())
      .then((data: BackendCategory[]) => {
        if (Array.isArray(data)) {
          const converted: Category[] = data.map((cat: BackendCategory) => ({
            name: cat.category,
            dishes: cat.items.map((item: BackendDish): Dish => ({
              title: item.name,
              description: item.desc,
              price: item.price.toString(),
              image: item.img.startsWith("http")
                ? item.img
                : `http://localhost:5000/${item.img}`
            }))
          }));

          setCategories(converted);
        } else {
          console.error("Неверный формат меню:", data);
          setCategories([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки меню:", err);
        setCategories([]);
        setLoading(false);
      });
  }, [isOpen]);

  /* ------------------------ Количество блюд ------------------------ */

  const increment = (dish: Dish) => {
    setCart(prev => {
      const current = prev[dish.title];
      return {
        ...prev,
        [dish.title]: { dish, quantity: current ? current.quantity + 1 : 1 }
      };
    });
  };

  const decrement = (dish: Dish) => {
    setCart(prev => {
      const current = prev[dish.title];
      if (!current) return prev;

      if (current.quantity <= 1) {
        const { [dish.title]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [dish.title]: { dish, quantity: current.quantity - 1 }
      };
    });
  };

  /* ------------------------ Корзина ------------------------ */

  if (!isOpen) return null;

  const cartItems = Object.values(cart);
  const total = cartItems.reduce(
    (sum, item) =>
      sum + parseInt(item.dish.price.replace(/\D/g, "")) * item.quantity,
    0
  );

  return (
    <>
      {/* Чёрный фон */}
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center overflow-auto">

        {/* Модальное окно */}
        <div className="relative bg-white w-[95%] max-w-[1200px] p-8 pb-20 mt-[3vh] shadow-xl">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black text-2xl font-bold"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center">
            Выберите блюда
          </h2>

          <div className="overflow-auto max-h-[70vh] pr-4 pb-4">
            {loading ? (
              <p className="text-center text-gray-500">Загрузка меню...</p>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-500">Меню пусто</p>
            ) : (
              categories.map((cat, catIndex) => (
                <div key={`${cat.name}-${catIndex}`} className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4">{cat.name}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.dishes.length > 0 ? (
                      cat.dishes.map((dish, dishIndex) => {
                        const quantity = cart[dish.title]?.quantity || 0;

                        return (
                          <div key={`${dish.title}-${dishIndex}`} className="relative">
                            <DishCard
                              title={dish.title}
                              description={dish.description}
                              image={dish.image}
                              price={parseInt(dish.price.replace(/\D/g, ""))}
                            />

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                              <button
                                onClick={() => decrement(dish)}
                                className="w-8 h-8 rounded-md bg-gray-400 hover:bg-gray-500 text-white font-bold"
                              >
                                −
                              </button>

                              <span className="font-semibold">{quantity}</span>

                              <button
                                onClick={() => increment(dish)}
                                className="w-8 h-8 rounded-md bg-gray-400 hover:bg-gray-500 text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 col-span-3">
                        Нет блюд в этой категории
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Нижняя панель корзины */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] bg-[#100147] text-white py-4 px-6 flex justify-between items-center shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
            >
              <img src="/cart.png" alt="Корзина" className="w-7 h-7" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>

            <span className="text-xl font-semibold">Итого: {total} ₸</span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-white text-[#100147] font-semibold py-2 px-6 shadow-md hover:bg-gray-100 transition"
          >
            Подтвердить
          </button>
        </div>
      </div>

      {/* Модалка корзины */}
      {isCartOpen && (
        <CartPopup
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onConfirm={() => {
            onSelectMenu(cartItems);
            onClose();
          }}
        />
      )}
    </>
  );
}
