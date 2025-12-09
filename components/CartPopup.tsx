"use client";

interface Dish {
  title: string;
  description: string;
  price: string;
  image: string;
}

interface SelectedDish {
  dish: Dish;
  quantity: number;
}

interface CartPopupProps {
  items: SelectedDish[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function CartPopup({ items, onClose, onConfirm }: CartPopupProps) {
  const total = items.reduce(
    (sum, item) => sum + parseInt(item.dish.price.replace(/\s|₸/g, ""), 10) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 relative">
        {/* Закрыть */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Корзина</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 mb-4">Выбрано блюд пока нет</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-80 overflow-auto mb-4">
            {items.map((item) => (
              <div
                key={item.dish.title}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                {/* Фото блюда */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.dish.image}
                    alt={item.dish.title}
                    className="w-12 h-12 object-cover"
                  />
                  <span className="font-medium">
                    {item.dish.title} × {item.quantity}
                  </span>
                </div>

                {/* Цена */}
                <span className="font-semibold">
                  {parseInt(item.dish.price.replace(/\s|₸/g, ""), 10) *
                    item.quantity}{" "}
                  ₸
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Итог */}
        <div className="flex justify-between items-center mb-4 font-semibold text-lg">
          <span>Итого:</span>
          <span>{total} ₸</span>
        </div>

        {/* Подтвердить */}
        <button
          onClick={onConfirm}
          className="w-full bg-[#100147] hover:bg-[#1f005c] text-white py-2 rounded-md font-semibold"
        >
          Подтвердить выбор
        </button>
      </div>
    </div>
  );
}